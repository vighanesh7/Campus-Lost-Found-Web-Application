export default function TypeFilter({ value, onChange }) {
  return (
    <select className="select-sm" aria-label="Filter by type" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Lost &amp; Found</option><option value="LOST">Lost only</option><option value="FOUND">Found only</option>
    </select>
  );
}
