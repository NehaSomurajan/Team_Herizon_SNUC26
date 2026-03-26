export default function HeaderCard({ user }) {
  return (
    <div className="header-card">
      <h3>Welcome 👋</h3>
      <h1>{user.name}</h1>
      <p>🔥 Streak: {user.streak}</p>

      <div>
        {user.badges?.map((b, i) => (
          <span key={i}>{b} </span>
        ))}
      </div>
    </div>
  );
}