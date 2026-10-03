import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminHeader from '../../components/admin/AdminHeader';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import useDebounce from '../../hooks/useDebounce';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errors';
import { useToast } from '../../context/ToastContext';

export default function AdminUsers() {
  const toast = useToast();
  const me = useSelector((s) => s.auth.user);
  const [q, setQ] = useState(''); const dq = useDebounce(q);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null); const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const load = useCallback(() => {
    setError(null);
    api.get('/admin/users', { params: { search: dq, page } }).then((r) => setData(r.data.data)).catch((e) => setError(getErrorMessage(e)));
  }, [dq, page]);
  useEffect(() => { load(); }, [load]);
  const changeRole = async (u, role) => {
    try { await api.put(`/admin/users/${u.id}/role`, { role }); toast.success('Role updated'); load(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const remove = async () => {
    try { await api.delete(`/admin/users/${toDelete.id}`); toast.success('User deleted'); setToDelete(null); load(); } catch (e) { toast.error(getErrorMessage(e)); setToDelete(null); }
  };
  return (
    <div>
      <AdminHeader title="Manage Users" />
      <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name, email or student ID" />
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!data && !error && <LoadingSpinner />}
      {data && (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Student ID</th><th>Dept</th><th>Role</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{data.users.map((u) => (
              <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.studentId}</td><td>{u.department}</td>
                <td><select aria-label={`Role for ${u.name}`} value={u.role} disabled={u.id === me.id} onChange={(e) => changeRole(u, e.target.value)}><option>STUDENT</option><option>ADMIN</option></select></td>
                <td><button type="button" className="btn btn-danger btn-sm" disabled={u.id === me.id} onClick={() => setToDelete(u)}>Delete</button></td></tr>
            ))}</tbody></table></div>
          <Pagination page={data.currentPage} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
      <ConfirmationDialog open={!!toDelete} danger title="Delete user?" message={`Delete ${toDelete?.name} and all their posts? This cannot be undone.`} confirmLabel="Delete" onConfirm={remove} onCancel={() => setToDelete(null)} />
    </div>
  );
}
