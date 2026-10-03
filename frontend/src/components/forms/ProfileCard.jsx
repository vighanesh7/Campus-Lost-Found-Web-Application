import Avatar from '../common/Avatar';
export default function ProfileCard({ user, stats }) {
  return (
    <section className="profile-card">
      <div className="profile-cover" />
      <div className="profile-info">
        <Avatar user={user} size={96} />
        <h1>{user.name}</h1>
        <p className="muted">{user.role === 'ADMIN' ? 'Administrator' : 'Student'} · {user.studentId}</p>
        <dl className="profile-details">
          <div><dt>Department</dt><dd>{user.department || '–'}{user.year ? `, Year ${user.year}` : ''}</dd></div>
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          <div><dt>Phone</dt><dd>{user.phone || '–'}</dd></div>
        </dl>
        {stats && (
          <div className="profile-stats">
            <div><b>{stats.lost}</b><span>Lost</span></div><div><b>{stats.found}</b><span>Found</span></div><div><b>{stats.resolved}</b><span>Resolved</span></div>
          </div>
        )}
      </div>
    </section>
  );
}
