import ItemCard from './ItemCard';
export default function ItemGrid({ items, favoriteIds = [], onFavorite, onView }) {
  return (
    <div className="item-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} isFavorite={favoriteIds.includes(item.id)} onFavorite={onFavorite} onView={onView} />
      ))}
    </div>
  );
}
