// Tiny CSS bar chart (no chart library needed).
export default function BarList({ rows, labelKey, valueKey = 'count' }) {
  const max = Math.max(1, ...rows.map((r) => Number(r[valueKey])));
  if (!rows.length) return <p className="muted">No data yet.</p>;
  return (
    <ul className="bars">{rows.map((r) => (
      <li key={r[labelKey]}><span>{r[labelKey]}</span><div className="bar"><i style={{ width: `${(Number(r[valueKey]) / max) * 100}%` }} /></div><b>{r[valueKey]}</b></li>
    ))}</ul>
  );
}
