import { STATUS_LABELS } from '../../utils/constants';
export default function ItemStatusBadge({ status }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{STATUS_LABELS[status] || status}</span>;
}
export const TypeBadge = ({ type }) => <span className={`tag tag-${type.toLowerCase()}`}>{type === 'LOST' ? 'Lost' : 'Found'}</span>;
