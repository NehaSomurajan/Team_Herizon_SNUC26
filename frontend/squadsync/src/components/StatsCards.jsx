export default function StatsCards({ user }) {
  return (
    <div className="stats">
      <div className="card">🔥 {user.streak} Day Streak</div>
      <div className="card">⭐ {user.helperScore} Score</div>
      <div className="card">🤝 {user.helpedCount} Helped</div>
    </div>
  );
}