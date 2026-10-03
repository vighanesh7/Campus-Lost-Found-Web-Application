import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import CategoryFilter from './CategoryFilter';
import DateFilter from './DateFilter';
import TypeFilter from './TypeFilter';
import LocationFilter from './LocationFilter';
import ItemGrid from './ItemGrid';
import useCategories from '../../hooks/useCategories';
import useDebounce from '../../hooks/useDebounce';
import useItemActions from '../../hooks/useItemActions';
import { fetchItems } from '../../redux/itemSlice';
import { rangeToParams } from '../../utils/format';

// Shared by Search, Lost and Found pages. `fixedType` locks the LOST/FOUND filter.
export default function ItemBrowser({ fixedType, title, initialSearch = '' }) {
  const dispatch = useDispatch();
  const { items, status, error, totalItems, currentPage, totalPages } = useSelector((s) => s.items.list);
  const { categories } = useCategories();
  const { favoriteIds, toggleFavorite, viewItem } = useItemActions();

  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [range, setRange] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const dSearch = useDebounce(search);
  const dLocation = useDebounce(location);

  // useMemo keeps the params object stable so the effect only fires when a filter really changed.
  const params = useMemo(() => ({
    ...(dSearch && { search: dSearch }), ...(categoryId && { categoryId }), ...(dLocation && { location: dLocation }),
    ...((fixedType || type) && { type: fixedType || type }), ...rangeToParams(range), page, limit: 12,
  }), [dSearch, categoryId, dLocation, fixedType, type, range, page]);

  useEffect(() => { dispatch(fetchItems(params)); }, [dispatch, params]);
  const withReset = (setter) => (v) => { setter(v); setPage(1); };
  const retry = () => dispatch(fetchItems(params));

  return (
    <section>
      <h1 className="page-title">{title}</h1>
      <SearchBar value={search} onChange={withReset(setSearch)} />
      <CategoryFilter categories={categories} value={categoryId} onChange={withReset(setCategoryId)} />
      <div className="filter-row" aria-label="Filters">
        <LocationFilter value={location} onChange={withReset(setLocation)} />
        <DateFilter value={range} onChange={withReset(setRange)} />
        {!fixedType && <TypeFilter value={type} onChange={withReset(setType)} />}
      </div>
      {status === 'loading' && <LoadingSpinner label="Loading items..." />}
      {status === 'failed' && <ErrorMessage message={error || 'Failed to load items. Try again.'} onRetry={retry} />}
      {status === 'succeeded' && (
        <>
          <p className="results-count">{totalItems} result{totalItems === 1 ? '' : 's'} found</p>
          {items.length === 0
            ? <EmptyState title={`No ${fixedType ? fixedType.toLowerCase() : ''} items found.`} message="Try different keywords or clear some filters." />
            : <ItemGrid items={items} favoriteIds={favoriteIds} onFavorite={toggleFavorite} onView={viewItem} />}
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </section>
  );
}
