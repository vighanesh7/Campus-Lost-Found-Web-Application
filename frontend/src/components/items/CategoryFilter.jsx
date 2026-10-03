export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className="chips" role="group" aria-label="Filter by category">
      <button type="button" className={`chip ${value === '' ? 'active' : ''}`} onClick={() => onChange('')}>All</button>
      {categories.map((c) => (
        <button key={c.id} type="button" className={`chip ${String(c.id) === String(value) ? 'active' : ''}`} onClick={() => onChange(String(c.id))}>{c.name}</button>
      ))}
    </div>
  );
}
