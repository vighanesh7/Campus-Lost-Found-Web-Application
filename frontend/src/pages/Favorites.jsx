import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ItemGrid from '../components/items/ItemGrid';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import useItemActions from '../hooks/useItemActions';
import { fetchFavorites } from '../redux/favoriteSlice';

export default function Favorites() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.favorites);
  const { favoriteIds, toggleFavorite, viewItem } = useItemActions();
  const [q, setQ] = useState('');
  useEffect(() => { dispatch(fetchFavorites()); }, [dispatch]);
  // useMemo: re-filter only when the list or the search text changes
  const visible = useMemo(() => items.map((f) => f.item).filter(Boolean)
    .filter((i) => `${i.name} ${i.location}`.toLowerCase().includes(q.toLowerCase())), [items, q]);
  return (
    <section>
      <h1 className="page-title">Favourite Items</h1>
      <SearchBar value={q} onChange={setQ} placeholder="Search your saved items" />
      {status === 'loading' && <LoadingSpinner label="Loading favourites..." />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={() => dispatch(fetchFavorites())} />}
      {status === 'succeeded' && (visible.length === 0
        ? <EmptyState icon="heart" title="No saved items." message="Tap the heart on any item to save it here." />
        : <ItemGrid items={visible} favoriteIds={favoriteIds} onFavorite={toggleFavorite} onView={viewItem} />)}
    </section>
  );
}
