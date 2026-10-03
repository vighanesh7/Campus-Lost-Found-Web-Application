import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format';

// A formal report (complaint) about a post. Admin sees action buttons.
export default function ReportCard({ report, admin = false, onUpdate }) {
  const [notes, setNotes] = useState(report.adminNotes || '');
  return (
    <article className="card report-card">
      <div className="report-head">
        <div>
          <h3>{report.item ? <Link to={`/items/${report.item.id}`}>{report.item.name}</Link> : 'Deleted item'}</h3>
          <p className="muted">{report.reportType.replace('_', ' ')} · {formatDate(report.createdAt)}{report.reporter && ` · by ${report.reporter.name}`}</p>
        </div>
        <span className={`badge badge-rep-${report.status.toLowerCase()}`}>{report.status}</span>
      </div>
      <p>{report.reason}</p>
      {!admin && report.adminNotes && <p className="muted"><b>Admin note:</b> {report.adminNotes}</p>}
      {admin && (
        <>
          <label className="field-label" htmlFor={`notes-${report.id}`}>Admin notes</label>
          <textarea id={`notes-${report.id}`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <div className="btn-row">
            <button type="button" className="btn btn-danger" onClick={() => onUpdate(report.id, 'APPROVED', notes)}>Approve &amp; close item</button>
            <button type="button" className="btn btn-outline" onClick={() => onUpdate(report.id, 'REJECTED', notes)}>Reject</button>
            <button type="button" className="btn btn-outline" onClick={() => onUpdate(report.id, 'REVIEWED', notes)}>Mark reviewed</button>
            <button type="button" className="btn btn-outline" onClick={() => onUpdate(report.id, 'RESOLVED', notes)}>Resolved</button>
          </div>
        </>
      )}
    </article>
  );
}
