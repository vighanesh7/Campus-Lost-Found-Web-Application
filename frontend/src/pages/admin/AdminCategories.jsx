import { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import FormField from '../../components/forms/FormField';
import { clearCategoryCache } from '../../hooks/useCategories';
import api from '../../services/api';
import { getErrorMessage, fieldErrors } from '../../utils/errors';
import { useToast } from '../../context/ToastContext';

export default function AdminCategories() {
  const toast = useToast();
  const [cats, setCats] = useState(null); const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' }); const [editId, setEditId] = useState(null);
  const [errs, setErrs] = useState({}); const [toDelete, setToDelete] = useState(null);
  const load = useCallback(() => { setError(null); api.get('/categories').then((r) => setCats(r.data.data.categories)).catch((e) => setError(getErrorMessage(e))); }, []);
  useEffect(() => { load(); }, [load]);
  const save = async (e) => {
    e.preventDefault(); setErrs({});
    try {
      if (editId) await api.put(`/categories/${editId}`, form); else await api.post('/categories', form);
      toast.success(editId ? 'Category updated' : 'Category added'); clearCategoryCache();
      setForm({ name: '', description: '' }); setEditId(null); load();
    } catch (err) { setErrs(fieldErrors(err.response?.data)); toast.error(getErrorMessage(err)); }
  };
  const remove = async () => {
    try { await api.delete(`/categories/${toDelete.id}`); toast.success('Category deleted'); clearCategoryCache(); load(); } catch (e) { toast.error(getErrorMessage(e)); }
    setToDelete(null);
  };
  return (
    <div className="narrow">
      <AdminHeader title="Manage Categories" />
      <form className="card" onSubmit={save} noValidate>
        <FormField id="cname" label={editId ? 'Edit category name' : 'New category name'} error={errs.name}><input id="cname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField id="cdesc" label="Description"><input id="cdesc" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
        <div className="btn-row"><button className="btn btn-primary">{editId ? 'Save changes' : 'Add category'}</button>
          {editId && <button type="button" className="btn btn-outline" onClick={() => { setEditId(null); setForm({ name: '', description: '' }); }}>Cancel</button>}</div>
      </form>
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!cats && !error && <LoadingSpinner />}
      {cats && <ul className="plain-list cat-list">{cats.map((c) => (
        <li key={c.id}><div><b>{c.name}</b><span className="muted"> {c.description}</span></div>
          <div className="btn-row"><button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditId(c.id); setForm({ name: c.name, description: c.description || '' }); }}>Edit</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setToDelete(c)}>Delete</button></div></li>))}</ul>}
      <ConfirmationDialog open={!!toDelete} danger title="Delete category?" message={`Delete "${toDelete?.name}"? Categories used by items cannot be deleted.`} confirmLabel="Delete" onConfirm={remove} onCancel={() => setToDelete(null)} />
    </div>
  );
}
