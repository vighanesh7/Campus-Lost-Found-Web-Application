import { useEffect, useRef } from 'react';
import Icon from './Icon';
// Accessible dialog: Esc closes, focus moves inside, backdrop click closes.
export default function Modal({ open, title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Close dialog" onClick={onClose}><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
