import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import TypeFilter from '../../components/items/TypeFilter';
import useDebounce from '../../hooks/useDebounce';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errors';
import { formatDate } from '../../utils/format';
import { STATUS_LABELS } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';

export default function AdminItems() {
  const toast = useToast();
  const [q, setQ] = useState(''); const dq = useDebounce(q);
  const [type, setType] = useState(''); const [page, setPage] = useState(1);
  const [data, setData] = useState(null); const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const load = useCallback(() => {
    setError(null);
    api.get('/admin/items', { params: { search: dq, type, page, limit: 10 } }).then((r) => setData(r.data.data)).catch((e) => setError(getErrorMessage(e)));
  }, [dq, type, page]);
  useEffect(() => { load(); }, [load]);
  const setStatus = async (item, status) => {
    try { await api.patch(`/items/${item.id}/status`, { status }); toast.success('Status updated'); load(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const remove = async () => {
    try { await api.delete(`/admin/items/${toDelete.id}`); toast.success('Item removed'); setToDelete(null); load(); } catch (e) { toast.error(getErrorMessage(e)); setToDelete(null); }
  };
  return (
    <div>
      <AdminHeader title="Manage Items" />
      <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search items" />
      <div className="filter-row"><TypeFilter value={type} onChange={(v) => { setType(v); setPage(1); }} /></div>
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!data && !error && <LoadingSpinner />}
      {data && (data.items.length === 0 ? <p className="muted">No items found.</p> : (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Item</th><th>Type</th><th>Reporter</th><th>Location</th><th>Date</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{data.items.map((i) => (
              <tr key={i.id}><td><Link to={`/items/${i.id}`}>{i.name}</Link></td><td>{i.type}</td><td>{i.reporter?.name}</td><td>{i.location}</td><td>{formatDate(i.date)}</td>
                <td><select aria-label={`Status of ${i.name}`} value={i.status} onChange={(e) => setStatus(i, e.target.value)}>{Object.keys(STATUS_LABELS).map((s) => <option key={s}>{s}</option>)}</select></td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => setToDelete(i)}>Remove</button></td></tr>
            ))}</tbody></table></div>
          <Pagination page={data.currentPage} totalPages={data.totalPages} onChange={setPage} />
        </>))}
      <ConfirmationDialog open={!!toDelete} danger title="Remove item?" message={`Remove "${toDelete?.name}" permanently?`} confirmLabel="Remove" onConfirm={remove} onCancel={() => setToDelete(null)} />
    </div>
  );
}
