import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../common/Avatar';
import Icon from '../common/Icon';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { fetchConversation, fetchConversations, sendMessage } from '../../redux/messageSlice';
import { useToast } from '../../context/ToastContext';
import { timeAgo } from '../../utils/format';

export default function ChatThread({ id, onBack }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const me = useSelector((s) => s.auth.user);
  const { conversation, messages, status, error } = useSelector((s) => s.messages.active);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Load the thread, then poll quietly for new messages.
  useEffect(() => {
    dispatch(fetchConversation({ id }));
    dispatch(fetchConversations());   // refresh unread badges after opening
    const t = setInterval(() => dispatch(fetchConversation({ id, silent: true })), 8000);
    return () => clearInterval(t);
  }, [dispatch, id]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const res = await dispatch(sendMessage({ conversationId: id, message: text.trim() }));
    setSending(false);
    if (res.error) toast.error(res.payload?.message || 'Message not sent'); else { setText(''); inputRef.current?.focus(); }
  };

  if (status === 'loading') return <LoadingSpinner label="Loading conversation..." />;
  if (status === 'failed') return <ErrorMessage message={error} onRetry={() => dispatch(fetchConversation({ id }))} />;
  if (!conversation) return null;
  return (
    <div className="chat">
      <header className="chat-head">
        <button type="button" className="icon-btn chat-back" aria-label="Back to conversations" onClick={onBack}><Icon name="back" /></button>
        <Avatar user={conversation.other} size={38} />
        <div><strong>{conversation.other?.name}</strong>
          {conversation.item && <small>About: <Link to={`/items/${conversation.item.id}`}>{conversation.item.name}</Link></small>}</div>
      </header>
      <div className="chat-body" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.senderId === me.id ? 'mine' : 'theirs'}`}>
            <p>{m.message}</p><small>{timeAgo(m.createdAt)}</small>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="chat-form" onSubmit={submit}>
        <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." aria-label="Message" maxLength={2000} />
        <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()} aria-label="Send message"><Icon name="send" size={18} /></button>
      </form>
    </div>
  );
}
