import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ItemGrid from '../components/items/ItemGrid';
import ReportCard from '../components/items/ReportCard';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import useItemActions from '../hooks/useItemActions';
import { fetchMyItems } from '../redux/itemSlice';
import api from '../services/api';
import { getErrorMessage } from '../utils/errors';

// /my/lost, /my/found  -> my posts with their status.   /my/reports -> complaints I filed.
export default function MyItems() {
  const { type } = useParams();
  const dispatch = useDispatch();
  const mine = useSelector((s) => s.items.mine);
  const { favoriteIds, toggleFavorite, viewItem } = useItemActions();
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [reports, setReports] = useState({ list: [], status: 'idle', error: null });
  const isReports = type === 'reports';

  useEffect(() => { setPage(1); }, [type]);
  useEffect(() => {
    if (isReports) {
      setReports((r) => ({ ...r, status: 'loading' }));
      api.get('/reports', { params: { page } }).then((res) => setReports({ list: res.data.data.reports, status: 'succeeded', error: null }))
        .catch((e) => setReports({ list: [], status: 'failed', error: getErrorMessage(e) }));
    } else dispatch(fetchMyItems({ type: type.toUpperCase(), page, limit: 12 }));
  }, [dispatch, type, page, isReports, tick]);

  const state = isReports ? reports : mine;
  const list = isReports ? reports.list : mine.items;
  const title = { lost: 'My Lost Items', found: 'My Found Items', reports: 'My Reports' }[type] || 'My Items';
  return (
    <section>
      <h1 className="page-title">{title}</h1>
      <div className="chips">
        {['lost', 'found', 'reports'].map((t) => <Link key={t} to={`/my/${t}`} className={`chip ${t === type ? 'active' : ''}`}>{t[0].toUpperCase() + t.slice(1)}</Link>)}
      </div>
      {state.status === 'loading' && <LoadingSpinner />}
      {state.status === 'failed' && <ErrorMessage message={state.error} onRetry={() => setTick((t) => t + 1)} />}
      {state.status === 'succeeded' && (list.length === 0
        ? <EmptyState title={`No ${type} yet.`} action={!isReports && <Link className="btn btn-primary" to={`/report?type=${type.toUpperCase()}`}>Report an item</Link>} />
        : isReports
          ? <div className="stack">{list.map((r) => <ReportCard key={r.id} report={r} />)}</div>
          : <ItemGrid items={list} favoriteIds={favoriteIds} onFavorite={toggleFavorite} onView={viewItem} />)}
      {!isReports && <Pagination page={mine.currentPage} totalPages={mine.totalPages} onChange={setPage} />}
    </section>
  );
}
