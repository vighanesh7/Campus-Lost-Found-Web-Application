import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon';

const Badge = ({ n }) => (n > 0 ? <span className="nav-badge" aria-label={`${n} unread`}>{n > 9 ? '9+' : n}</span> : null);
export default function Sidebar({ isAdmin, unreadNotifications, unreadMessages, onLogout }) {
  const link = (to, icon, label, badge = 0) => (
    <NavLink to={to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
      <Icon name={icon} size={18} /><span>{label}</span><Badge n={badge} />
    </NavLink>
  );
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand"><Icon name="bag" size={26} /><span>Campus<br /><small>Lost &amp; Found</small></span></div>
      <nav>
        {link('/home', 'home', 'Home')}
        {link('/search', 'search', 'Search Items')}
        {link('/lost', 'tag', 'Lost Items')}
        {link('/found', 'check', 'Found Items')}
        {link('/report', 'plus', 'Report Item')}
        {link('/favorites', 'heart', 'Favourites')}
        {link('/messages', 'message', 'Messages', unreadMessages)}
        {link('/notifications', 'bell', 'Notifications', unreadNotifications)}
        {link('/profile', 'user', 'Profile')}
        {isAdmin && (
          <>
            <p className="side-heading">Admin</p>
            {link('/admin', 'grid', 'Dashboard')}
            {link('/admin/users', 'user', 'Users')}
            {link('/admin/items', 'list', 'Items')}
            {link('/admin/reports', 'flag', 'Reports')}
            {link('/admin/categories', 'tag', 'Categories')}
          </>
        )}
      </nav>
      <button type="button" className="side-link side-logout" onClick={onLogout}><Icon name="logout" size={18} /><span>Log out</span></button>
    </aside>
  );
}
