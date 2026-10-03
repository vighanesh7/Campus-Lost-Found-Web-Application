import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/common/Icon';
import Modal from '../components/common/Modal';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import FormField from '../components/forms/FormField';
import ItemStatusBadge, { TypeBadge } from '../components/items/ItemStatusBadge';
import ItemGrid from '../components/items/ItemGrid';
import useItemActions from '../hooks/useItemActions';
import { useToast } from '../context/ToastContext';
import { changeItemStatus, fetchItem, removeItem } from '../redux/itemSlice';
import { sendMessage } from '../redux/messageSlice';
import api from '../services/api';
import { formatDate, imageUrl } from '../utils/format';
import { fieldErrors, getErrorMessage } from '../utils/errors';

export default function ItemDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const me = useSelector((s) => s.auth.user);
  const { item, status, error } = useSelector((s) => s.items.current);
  const { favoriteIds, toggleFavorite, viewItem } = useItemActions();
  const [dialog, setDialog] = useState(null);          // 'contact' | 'report' | {status} | 'delete'
  const [text, setText] = useState('');
  const [reportType, setReportType] = useState('INAPPROPRIATE');
  const [busy, setBusy] = useState(false);
  const [fieldErr, setFieldErr] = useState({});
  const [matches, setMatches] = useState([]);

  useEffect(() => { dispatch(fetchItem(id)); }, [dispatch, id]);
  const canManage = item && (item.userId === me.id || me.role === 'ADMIN');
  useEffect(() => {          // possible matches are only returned to the owner/admin
    setMatches([]);
    if (canManage) api.get(`/matches/item/${id}`).then((r) => setMatches(r.data.data.matches.map((m) => m.item))).catch(() => {});
  }, [id, canManage]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner label="Loading item..." />;
  if (status === 'failed') return <ErrorMessage message={error || 'Item not found.'} onRetry={() => dispatch(fetchItem(id))} />;

  const close = () => { setDialog(null); setText(''); setFieldErr({}); };
  const isOwner = item.userId === me.id;
  const src = imageUrl(item.image || item.images?.[0]?.imagePath);

  const contact = async (e) => {
    e.preventDefault(); setBusy(true);
    const res = await dispatch(sendMessage({ recipientId: item.userId, itemId: item.id, message: text.trim() }));
    setBusy(false);
    if (res.error) { setFieldErr(fieldErrors(res.payload)); toast.error(res.payload?.message); return; }
    toast.success('Message sent'); navigate(`/messages/${res.payload.conversationId}`);
  };
  const report = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await api.post('/reports', { itemId: item.id, reportType, reason: text.trim() }); toast.success('Report sent to the admins'); close(); }
    catch (err) { setFieldErr(fieldErrors(err.response?.data)); toast.error(getErrorMessage(err)); }
    setBusy(false);
  };
  const setStatus = async () => {
    setBusy(true); const res = await dispatch(changeItemStatus({ id: item.id, status: dialog.status })); setBusy(false);
    if (res.error) toast.error(res.payload?.message); else toast.success(`Marked as ${dialog.status.toLowerCase()}`); close();
  };
  const del = async () => {
    setBusy(true); const res = await dispatch(removeItem(item.id)); setBusy(false);
    if (res.error) { toast.error(res.payload?.message); close(); } else { toast.success('Item deleted'); navigate(-1); }
  };
  const done = ['RESOLVED', 'RETURNED', 'CLOSED'].includes(item.status);

  return (
    <article className="details">
      <button type="button" className="back-link" onClick={() => navigate(-1)}><Icon name="back" size={18} /> Back</button>
      <div className="details-grid">
        <div className="details-image">{src ? <img src={src} alt={item.name} /> : <span className="thumb-fallback"><Icon name="bag" size={72} /></span>}</div>
        <div className="details-info">
          <div className="badges"><TypeBadge type={item.type} /><ItemStatusBadge status={item.status} /></div>
          <h1>{item.name}</h1>
          <p className="item-meta big"><Icon name="pin" size={16} />{item.location}</p>
          <p className="item-meta big"><Icon name="calendar" size={16} />{formatDate(item.date)}{item.time && ` · ${item.time.slice(0, 5)}`}</p>
          <h2>Description</h2><p>{item.description}</p>
          {item.additionalDetails && <><h2>Additional details</h2><p>{item.additionalDetails}</p></>}
          <h2>Details</h2>
          <dl className="detail-table">
            <div><dt>Category</dt><dd>{item.category?.name}</dd></div>
            <div><dt>Location</dt><dd>{item.location}</dd></div>
            <div><dt>Date</dt><dd>{formatDate(item.date)}</dd></div>
            <div><dt>Status</dt><dd>{item.status}</dd></div>
            <div><dt>Reported by</dt><dd>{item.reporter?.name}{item.reporter?.department && ` (${item.reporter.department})`}</dd></div>
          </dl>
          <div className="btn-row">
            {!isOwner && <button type="button" className="btn btn-primary" onClick={() => setDialog('contact')}><Icon name="message" size={16} /> Contact Reporter</button>}
            <button type="button" className="btn btn-outline" onClick={() => toggleFavorite(item)}><Icon name="heart" size={16} /> {favoriteIds.includes(item.id) ? 'Saved' : 'Save'}</button>
            {!isOwner && <button type="button" className="btn btn-outline" onClick={() => setDialog('report')}><Icon name="flag" size={16} /> Report post</button>}
          </div>
          {canManage && (
            <div className="manage">
              <h2>Manage this report</h2>
              <div className="btn-row">
                {!done && <button type="button" className="btn btn-primary" onClick={() => setDialog({ status: 'RESOLVED' })}>Mark as resolved</button>}
                {!done && <button type="button" className="btn btn-outline" onClick={() => setDialog({ status: 'RETURNED' })}>Item returned</button>}
                {!done && <button type="button" className="btn btn-outline" onClick={() => setDialog({ status: 'CLOSED' })}>Close</button>}
                {done && <button type="button" className="btn btn-outline" onClick={() => setDialog({ status: 'ACTIVE' })}>Re-open</button>}
                <button type="button" className="btn btn-danger" onClick={() => setDialog('delete')}><Icon name="trash" size={16} /> Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {matches.length > 0 && (
        <section className="block"><div className="block-head"><h2>Possible matches</h2></div>
          <p className="muted small">Suggested by keywords, category, place and date. Check them before contacting the owner.</p>
          <ItemGrid items={matches} favoriteIds={favoriteIds} onFavorite={toggleFavorite} onView={(i) => viewItem(i)} /></section>
      )}

      <Modal open={dialog === 'contact'} title={`Message ${item.reporter?.name}`} onClose={close}>
        <form onSubmit={contact}>
          <FormField id="msg" label="Your message" error={fieldErr.message}>
            <textarea id="msg" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Hi, I'm contacting you about "${item.name}"...`} required maxLength={2000} />
          </FormField>
          <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={close}>Cancel</button><button className="btn btn-primary" disabled={busy || !text.trim()}>{busy ? 'Sending...' : 'Send message'}</button></div>
        </form>
      </Modal>
      <Modal open={dialog === 'report'} title="Report this post" onClose={close}>
        <form onSubmit={report}>
          <FormField id="rtype" label="Reason"><select id="rtype" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="INAPPROPRIATE">Inappropriate content</option><option value="SPAM">Spam</option><option value="DUPLICATE">Duplicate post</option><option value="FALSE_CLAIM">False claim</option><option value="OTHER">Other</option></select></FormField>
          <FormField id="rreason" label="Details" error={fieldErr.reason}><textarea id="rreason" rows={3} value={text} onChange={(e) => setText(e.target.value)} required /></FormField>
          <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={close}>Cancel</button><button className="btn btn-danger" disabled={busy || text.trim().length < 5}>Submit report</button></div>
        </form>
      </Modal>
      <ConfirmationDialog open={!!dialog?.status} title="Change status?" message={`Set this item to ${dialog?.status}? Notifications will be sent where relevant.`} busy={busy} onConfirm={setStatus} onCancel={close} />
      <ConfirmationDialog open={dialog === 'delete'} danger title="Delete this item?" message="This permanently removes the post and its images." confirmLabel="Delete" busy={busy} onConfirm={del} onCancel={close} />
    </article>
  );
}
