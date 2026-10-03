import Icon from './Icon';
export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search for an item' }) {
  return (
    <form className="searchbar" role="search" onSubmit={(e) => { e.preventDefault(); onSubmit?.(value); }}>
      <Icon name="search" size={18} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label="Search items" />
    </form>
  );
}
