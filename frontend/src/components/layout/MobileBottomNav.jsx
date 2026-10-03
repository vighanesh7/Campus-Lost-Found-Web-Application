import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon';
// Same five tabs as the Figma mobile design.
const TABS = [['/home', 'home', 'Home'], ['/search', 'search', 'Search'], ['/report', 'plus', 'Report'], ['/messages', 'message', 'Message'], ['/profile', 'user', 'Profile']];
export default function MobileBottomNav({ unreadMessages }) {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {TABS.map(([to, icon, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottom-link ${isActive ? 'active' : ''}`}>
          <span className="bottom-icon"><Icon name={icon} size={20} />{label === 'Message' && unreadMessages > 0 && <i className="dot" />}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
