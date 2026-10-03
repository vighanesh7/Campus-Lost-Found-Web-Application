import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';
import BarList from '../../components/admin/BarList';
import StatCard from '../../components/common/StatCard';
import Icon from '../../components/common/Icon';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import api from '../../services/api';
import { downloadBlob, formatDate } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const load = useCallback(() => { setError(null); api.get('/admin/stats').then((r) => setData(r.data.data)).catch((e) => setError(getErrorMessage(e))); }, []);
  useEffect(() => { load(); }, [load]);
  const exportCsv = async (name) => {
    try { const r = await api.get(`/admin/export/${name}`, { responseType: 'blob' }); downloadBlob(r.data, `${name}.csv`); }
    catch (e) { toast.error('Export failed'); }
  };
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!data) return <LoadingSpinner label="Loading dashboard..." />;
  const { totals, users, reportCounts: rc } = data;
  return (
    <div>
      <AdminHeader title="Admin Dashboard">
        <button type="button" className="btn btn-outline" onClick={() => exportCsv('items')}><Icon name="download" size={16} /> Items CSV</button>
        <button type="button" className="btn btn-outline" onClick={() => exportCsv('reports')}><Icon name="download" size={16} /> Reports CSV</button>
      </AdminHeader>
      <div className="stat-grid six">
        <StatCard tone="total" label="Total users" value={users} icon="user" />
        <StatCard tone="lost" label="Lost items" value={totals.lost} icon="bag" />
        <StatCard tone="found" label="Found items" value={totals.found} icon="check" />
        <StatCard tone="resolved" label="Resolved items" value={totals.resolved} icon="shield" />
        <StatCard tone="lost" label="Pending reports" value={rc.PENDING} icon="flag" />
        <StatCard tone="found" label="Resolved reports" value={rc.RESOLVED + rc.APPROVED} icon="check" />
      </div>
      <div className="two-col">
        <section className="card"><h2>Most reported categories</h2><BarList rows={data.topCategories} labelKey="name" /></section>
        <section className="card"><h2>Most common lost locations</h2><BarList rows={data.commonLocations} labelKey="location" /></section>
        <section className="card"><h2>Reports per month</h2><BarList rows={[...data.reportsPerMonth].reverse()} labelKey="month" /></section>
        <section className="card"><h2>Recent reports</h2>
          {data.recentReports.length === 0 ? <p className="muted">No reports yet.</p> : (
            <ul className="plain-list">{data.recentReports.map((r) => (
              <li key={r.id}><Link to="/admin/reports">{r.item?.name || 'Deleted item'}</Link><span className="muted"> · {r.reportType} · {formatDate(r.createdAt)} · {r.status}</span></li>
            ))}</ul>)}
        </section>
      </div>
    </div>
  );
}
