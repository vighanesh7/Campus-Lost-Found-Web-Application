import { DATE_RANGES } from '../../utils/constants';
export default function DateFilter({ value, onChange }) {
  return (
    <select className="select-sm" aria-label="Filter by date" value={value} onChange={(e) => onChange(e.target.value)}>
      {DATE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
    </select>
  );
}
