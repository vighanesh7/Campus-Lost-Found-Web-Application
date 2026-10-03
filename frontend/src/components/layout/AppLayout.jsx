import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { logout } from '../../redux/authSlice';
import { fetchFavorites } from '../../redux/favoriteSlice';
import { fetchNotifications } from '../../redux/notificationSlice';
import { fetchConversations } from '../../redux/messageSlice';

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const unreadNotifications = useSelector((s) => s.notifications.unreadCount);
  const unreadMessages = useSelector((s) => s.messages.conversations.reduce((n, c) => n + c.unreadCount, 0));
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Load shared data once, then poll every 30s so badges stay fresh (simple alternative to WebSockets).
  useEffect(() => {
    const load = () => { dispatch(fetchNotifications()); dispatch(fetchConversations()); };
    dispatch(fetchFavorites());
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [dispatch]);

  const doLogout = () => { dispatch(logout()); navigate('/login'); };
  return (
    <div className="shell">
      <Sidebar isAdmin={user.role === 'ADMIN'} unreadNotifications={unreadNotifications} unreadMessages={unreadMessages} onLogout={() => setConfirmLogout(true)} />
      <div className="shell-main">
        <Navbar user={user} unreadNotifications={unreadNotifications} />
        <main className="content"><Outlet /></main>
      </div>
      <MobileBottomNav unreadMessages={unreadMessages} />
      <ConfirmationDialog open={confirmLogout} title="Log out?" message="You will need to log in again to see your reports and messages." confirmLabel="Log out" onConfirm={doLogout} onCancel={() => setConfirmLogout(false)} />
    </div>
  );
}
