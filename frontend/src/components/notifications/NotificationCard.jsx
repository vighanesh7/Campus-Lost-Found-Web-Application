import Icon from '../common/Icon';
import { timeAgo } from '../../utils/format';
const ICONS = { ITEM_REPORTED: 'check', MATCH_FOUND: 'search', MESSAGE: 'message', STATUS_CHANGE: 'flag', ITEM_RESOLVED: 'check', ADMIN_ACTION: 'shield', REMINDER: 'clock' };
export default function NotificationCard({ notification, onOpen }) {
  return (
    <button type="button" className={`notif ${notification.isRead ? '' : 'unread'}`} onClick={() => onOpen(notification)}>
      <span className="notif-icon"><Icon name={ICONS[notification.type] || 'bell'} size={18} /></span>
      <span className="notif-text">
        <strong>{notification.title}</strong>
        <span>{notification.message}</span>
        <small>{timeAgo(notification.createdAt)}</small>
      </span>
    </button>
  );
}
