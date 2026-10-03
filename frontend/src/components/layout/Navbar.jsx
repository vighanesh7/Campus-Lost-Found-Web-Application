import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';
import SearchBar from '../common/SearchBar';
export default function Navbar({ user, unreadNotifications }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <Link to="/home" className="topbar-brand" aria-label="Campus Lost and Found home"><Icon name="bag" size={22} /><b>Campus L&amp;F</b></Link>
      <div className="topbar-search">
        <SearchBar value={q} onChange={setQ} onSubmit={(v) => v.trim() && navigate(`/search?q=${encodeURIComponent(v.trim())}`)} />
      </div>
      <div className="topbar-actions">
        <Link to="/notifications" className="icon-btn bell" aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ''}`}>
          <Icon name="bell" />{unreadNotifications > 0 && <i className="dot" />}
        </Link>
        <Link to="/favorites" className="icon-btn" aria-label="Favourites"><Icon name="heart" /></Link>
        <Link to="/profile" aria-label="My profile"><Avatar user={user} size={34} /></Link>
      </div>
    </header>
  );
}
