import { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import ReportCard from '../../components/items/ReportCard';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errors';
import { useToast } from '../../context/ToastContext';

const FILTERS = ['', 'PENDING', 'REVIEWED', 'APPROVED', 'REJECTED', 'RESOLVED'];
export default function AdminReports() {
  const toast = useToast();
  const [status, setStatus] = useState('PENDING'); const [page, setPage] = useState(1);
  const [data, setData] = useState(null); const [error, setError] = useState(null);
  const load = useCallback(() => {
    setError(null); setData(null);
    api.get('/reports', { params: { status, page } }).then((r) => setData(r.data.data)).catch((e) => setError(getErrorMessage(e)));
  }, [status, page]);
  useEffect(() => { load(); }, [load]);
  const update = async (id, newStatus, adminNotes) => {
    try { await api.patch(`/reports/${id}`, { status: newStatus, adminNotes }); toast.success(`Report ${newStatus.toLowerCase()}`); load(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  return (
    <div className="narrow">
      <AdminHeader title="Manage Reports" />
      <div className="chips">{FILTERS.map((f) => <button key={f} type="button" className={`chip ${f === status ? 'active' : ''}`} onClick={() => { setStatus(f); setPage(1); }}>{f || 'All'}</button>)}</div>
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!data && !error && <LoadingSpinner />}
      {data && (data.reports.length === 0 ? <EmptyState icon="flag" title="No reports here." /> : (
        <div className="stack">{data.reports.map((r) => <ReportCard key={r.id} report={r} admin onUpdate={update} />)}</div>))}
      {data && <Pagination page={data.currentPage} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
}
