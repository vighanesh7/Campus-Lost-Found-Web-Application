import Modal from './Modal';
export default function ConfirmationDialog({ open, title = 'Are you sure?', message, confirmLabel = 'Confirm', danger = false, busy = false, onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="muted">{message}</p>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="button" className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} disabled={busy} onClick={onConfirm}>{busy ? 'Please wait...' : confirmLabel}</button>
      </div>
    </Modal>
  );
}
