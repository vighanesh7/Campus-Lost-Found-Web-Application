// Streams a DB table as CSV in batches: memory stays flat no matter how many rows.
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');

const esc = (v) => {
  if (v === null || v === undefined) return '';
  const s = v instanceof Date ? v.toISOString() : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
async function* csvRows(model, columns, batch = 200) {   // async generator = readable source
  yield `${columns.join(',')}\n`;
  for (let offset = 0; ; offset += batch) {
    const rows = await model.findAll({ order: [['id', 'ASC']], limit: batch, offset, raw: true });
    if (!rows.length) return;
    for (const r of rows) yield `${columns.map((c) => esc(r[c])).join(',')}\n`;
  }
}
exports.sendCsv = async (res, filename, model, columns) => {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await pipeline(Readable.from(csvRows(model, columns)), res);   // Readable -> Writable (HTTP response)
};
