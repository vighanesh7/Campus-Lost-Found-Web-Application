import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/format';
export default function MessageCard({ conversation, active, onOpen }) {
  const { other, lastMessage, unreadCount, item } = conversation;
  return (
    <button type="button" className={`msg-card ${active ? 'active' : ''}`} onClick={() => onOpen(conversation.id)}>
      <Avatar user={other} size={44} />
      <span className="msg-text">
        <strong>{other?.name || 'Unknown user'}{item && <em> · {item.name}</em>}</strong>
        <span className="msg-preview">{lastMessage?.message}</span>
      </span>
      <span className="msg-side"><small>{lastMessage && timeAgo(lastMessage.createdAt)}</small>{unreadCount > 0 && <b className="nav-badge">{unreadCount}</b>}</span>
    </button>
  );
}
