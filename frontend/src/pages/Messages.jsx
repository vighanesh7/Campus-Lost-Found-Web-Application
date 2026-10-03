import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MessageCard from '../components/messages/MessageCard';
import ChatThread from '../components/messages/ChatThread';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { fetchConversations } from '../redux/messageSlice';

// Desktop: list + chat side by side. Mobile: one at a time (like the Figma screen).
export default function Messages() {
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations, status, error } = useSelector((s) => s.messages);
  useEffect(() => { dispatch(fetchConversations()); }, [dispatch]);
  return (
    <div className={`messages-layout ${conversationId ? 'has-thread' : ''}`}>
      <section className="conv-list">
        <h1 className="page-title">Messages</h1>
        {status === 'loading' && <LoadingSpinner label="Loading messages..." />}
        {status === 'failed' && <ErrorMessage message={error} onRetry={() => dispatch(fetchConversations())} />}
        {status === 'succeeded' && (conversations.length === 0
          ? <EmptyState icon="message" title="No messages yet." message="Open an item and tap “Contact Reporter” to start a chat." />
          : <div className="stack">{conversations.map((c) => <MessageCard key={c.id} conversation={c} active={String(c.id) === conversationId} onOpen={(id) => navigate(`/messages/${id}`)} />)}</div>)}
      </section>
      <section className="thread">
        {conversationId ? <ChatThread key={conversationId} id={conversationId} onBack={() => navigate('/messages')} />
          : <EmptyState icon="message" title="Select a conversation" message="Your chats about lost and found items appear here." />}
      </section>
    </div>
  );
}
