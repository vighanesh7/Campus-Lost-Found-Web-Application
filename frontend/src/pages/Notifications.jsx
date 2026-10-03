import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NotificationCard from '../components/notifications/NotificationCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../redux/notificationSlice';

export default function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { today, earlier, unreadCount, status, error } = useSelector((s) => s.notifications);
  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const open = (n) => {
    if (!n.isRead) dispatch(markNotificationRead(n.id));
    if (n.type === 'MESSAGE') navigate('/messages');
    else if (n.relatedItemId) navigate(`/items/${n.relatedItemId}`);
  };
  const group = (label, list) => list.length > 0 && (
    <section className="block"><h2 className="group-title">{label}</h2>
      <div className="stack">{list.map((n) => <NotificationCard key={n.id} notification={n} onOpen={open} />)}</div></section>
  );
  return (
    <section className="narrow">
      <div className="block-head">
        <h1 className="page-title">Notification</h1>
        {unreadCount > 0 && <button type="button" className="btn btn-outline" onClick={() => dispatch(markAllNotificationsRead())}>Mark all as read</button>}
      </div>
      {status === 'loading' && <LoadingSpinner label="Loading notifications..." />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={() => dispatch(fetchNotifications())} />}
      {status === 'succeeded' && (today.length + earlier.length === 0
        ? <EmptyState icon="bell" title="You're all caught up." message="New activity will show up here." />
        : <>{group('Today', today)}{group('Earlier', earlier)}</>)}
    </section>
  );
}
