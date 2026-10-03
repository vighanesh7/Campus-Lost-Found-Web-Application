// Non-blocking file helpers using fs/promises.
const fs = require('fs/promises');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');
const logDir = path.join(__dirname, '..', '..', 'logs');

const ensureDir = (dir) => fs.mkdir(dir, { recursive: true });
const removeFile = async (filePath) => {
  try { await fs.unlink(filePath); } catch (e) { if (e.code !== 'ENOENT') throw e; }
};
const appendLog = (line) => fs.appendFile(path.join(logDir, 'app.log'), `${line}\n`);
const readLog = async () => {
  try { return await fs.readFile(path.join(logDir, 'app.log'), 'utf8'); }
  catch (e) { if (e.code === 'ENOENT') return ''; throw e; }
};
module.exports = { uploadDir, logDir, ensureDir, removeFile, appendLog, readLog };
