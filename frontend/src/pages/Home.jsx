import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import StatCard from '../components/common/StatCard';
import Icon from '../components/common/Icon';
import ItemGrid from '../components/items/ItemGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import useItemActions from '../hooks/useItemActions';
import { fetchRecent, fetchStats } from '../redux/itemSlice';

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'; };

function RecentSection({ title, to, items, actions }) {
  return (
    <section className="block">
      <div className="block-head"><h2>{title}</h2><Link to={to}>View All</Link></div>
      {items.length === 0 ? <EmptyState title="Nothing here yet." /> : <ItemGrid items={items} {...actions} />}
    </section>
  );
}
export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const stats = useSelector((s) => s.items.stats);
  const recent = useSelector((s) => s.items.recent);
  const { favoriteIds, toggleFavorite, viewItem } = useItemActions();
  const actions = { favoriteIds, onFavorite: toggleFavorite, onView: viewItem };
  useEffect(() => { dispatch(fetchStats()); dispatch(fetchRecent()); }, [dispatch]);
  const s = stats.data;

  return (
    <div>
      <h1 className="page-title">{greeting()}, <span className="accent">{user.name.split(' ')[0]}</span></h1>
      <p className="muted">Find where you're looking for on campus</p>
      {stats.status === 'failed' ? <ErrorMessage message="Could not load statistics." onRetry={() => dispatch(fetchStats())} /> : (
        <div className="stat-grid">
          <StatCard tone="lost" label="Lost Items" value={s?.lost} icon="bag" />
          <StatCard tone="found" label="Found Items" value={s?.found} icon="check" />
          <StatCard tone="total" label="Total Reports" value={s?.total} icon="list" />
          <StatCard tone="resolved" label="Resolved" value={s?.resolved} icon="shield" />
        </div>
      )}
      {s && <p className="muted small">You have {s.pending} pending/matched report{s.pending === 1 ? '' : 's'}.</p>}

      <section className="block">
        <div className="block-head"><h2>Quick Action</h2></div>
        <div className="quick-grid">
          <Link to="/report?type=LOST" className="quick"><span className="quick-icon blue"><Icon name="plus" /></span>Report Lost</Link>
          <Link to="/report?type=FOUND" className="quick"><span className="quick-icon green"><Icon name="check" /></span>Report Found</Link>
          <Link to="/search" className="quick"><span className="quick-icon outline"><Icon name="search" /></span>Search</Link>
          <Link to="/favorites" className="quick"><span className="quick-icon outline"><Icon name="heart" /></span>Favourite</Link>
        </div>
      </section>

      {recent.status === 'loading' && <LoadingSpinner label="Loading recent items..." />}
      {recent.status === 'failed' && <ErrorMessage message={recent.error} onRetry={() => dispatch(fetchRecent())} />}
      {recent.status === 'succeeded' && (
        <div className="two-col">
          <RecentSection title="Recent Lost Items" to="/lost" items={recent.lost} actions={actions} />
          <RecentSection title="Recent Found Items" to="/found" items={recent.found} actions={actions} />
        </div>
      )}
    </div>
  );
}
