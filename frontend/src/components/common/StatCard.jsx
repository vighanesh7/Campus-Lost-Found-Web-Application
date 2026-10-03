import Icon from './Icon';
// tone: lost | found | total | resolved (colours from the Figma home screen)
export default function StatCard({ label, value, tone, icon = 'bag' }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <span className="stat-icon"><Icon name={icon} size={20} /></span>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value ?? '–'}</strong>
    </div>
  );
}
