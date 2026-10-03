import Icon from './Icon';
export default function EmptyState({ icon = 'search', title, message, action }) {
  return (
    <div className="state">
      <Icon name={icon} size={40} className="state-icon" />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
