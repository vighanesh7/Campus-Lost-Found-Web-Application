import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileCard from '../components/forms/ProfileCard';
import FormField from '../components/forms/FormField';
import Modal from '../components/common/Modal';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Icon from '../components/common/Icon';
import { logout, updateProfile } from '../redux/authSlice';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { fieldErrors, getErrorMessage } from '../utils/errors';

const MENU = [['/my/lost', 'tag', 'My Lost Items'], ['/my/found', 'check', 'My Found Items'], ['/my/reports', 'flag', 'My Reports'], ['/favorites', 'heart', 'Favourites'], ['/messages', 'message', 'Messages'], ['/notifications', 'bell', 'Notifications']];

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((s) => s.auth.user);
  const [stats, setStats] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const load = () => api.get('/users/profile').then((r) => setStats(r.data.data.stats)).catch((e) => setLoadError(getErrorMessage(e)));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openEdit = () => { setForm({ name: user.name, department: user.department || '', year: user.year || '', phone: user.phone || '' }); setErrors({}); setEditing(true); };
  const save = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (fileRef.current?.files[0]) fd.append('profileImage', fileRef.current.files[0]);
    setSaving(true);
    const res = await dispatch(updateProfile(fd));
    setSaving(false);
    if (res.error) { setErrors(fieldErrors(res.payload)); toast.error(res.payload?.message || 'Could not save'); } else { toast.success('Profile updated'); setEditing(false); }
  };
  if (loadError) return <ErrorMessage message={loadError} onRetry={() => { setLoadError(null); load(); }} />;
  if (!stats) return <LoadingSpinner label="Loading profile..." />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <div className="profile-layout">
      <ProfileCard user={user} stats={stats} />
      <nav className="menu-list" aria-label="Profile menu">
        {MENU.map(([to, icon, label]) => <Link key={to} to={to}><Icon name={icon} size={18} />{label}</Link>)}
        <button type="button" onClick={openEdit}><Icon name="edit" size={18} />Change Profile details</button>
        {user.role === 'ADMIN' && <Link to="/admin"><Icon name="grid" size={18} />Admin dashboard</Link>}
        <button type="button" className="menu-danger" onClick={() => setConfirmLogout(true)}><Icon name="logout" size={18} />Log out</button>
      </nav>
      <Modal open={editing} title="Edit profile" onClose={() => setEditing(false)}>
        <form onSubmit={save} noValidate>
          <FormField id="p-name" label="Full name" error={errors.name}><input id="p-name" value={form.name || ''} onChange={set('name')} /></FormField>
          <FormField id="p-dep" label="Department" error={errors.department}><input id="p-dep" value={form.department || ''} onChange={set('department')} /></FormField>
          <FormField id="p-year" label="Year" error={errors.year}><input id="p-year" type="number" min="1" max="6" value={form.year || ''} onChange={set('year')} /></FormField>
          <FormField id="p-phone" label="Phone" error={errors.phone}><input id="p-phone" value={form.phone || ''} onChange={set('phone')} /></FormField>
          <FormField id="p-img" label="Profile photo"><input id="p-img" type="file" accept="image/jpeg,image/png,image/webp" ref={fileRef} /></FormField>
          <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></div>
        </form>
      </Modal>
      <ConfirmationDialog open={confirmLogout} title="Log out?" message="You will need to log in again." confirmLabel="Log out" onConfirm={() => { dispatch(logout()); navigate('/login'); }} onCancel={() => setConfirmLogout(false)} />
    </div>
  );
}
