import { LOCATION_SUGGESTIONS } from '../../utils/constants';
export default function LocationFilter({ value, onChange }) {
  return (
    <>
      <input className="select-sm" list="location-options" placeholder="Location" aria-label="Filter by location" value={value} onChange={(e) => onChange(e.target.value)} />
      <datalist id="location-options">{LOCATION_SUGGESTIONS.map((l) => <option key={l} value={l} />)}</datalist>
    </>
  );
}
