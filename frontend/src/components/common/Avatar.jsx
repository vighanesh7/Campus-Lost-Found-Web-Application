import { imageUrl } from '../../utils/format';
export default function Avatar({ user, size = 40 }) {
  const src = imageUrl(user?.profileImage);
  const initials = (user?.name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return src
    ? <img className="avatar" src={src} alt={user.name} style={{ width: size, height: size }} />
    : <span className="avatar avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.4 }} aria-label={user?.name}>{initials}</span>;
}
