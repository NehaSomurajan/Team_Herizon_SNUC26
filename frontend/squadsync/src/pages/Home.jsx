import React, { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/user/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!user) return <p>Loading user data...</p>;

  const xpGoal = 3200;
  const xpProgress = Math.min(user.helperScore * 300, xpGoal);
  const xpPercent = (xpProgress / xpGoal) * 100;
  const avatarLetter = user.name.charAt(0).toUpperCase();
  const badges = user.badges || [];
  const habitsDone = 4;
  const dayStreak = user.streak || 0;
  const globalRank = 3;

  return (
    <div className="home">
      <div className="card profile-card">
        <div>
          <div className="greeting">Good morning 👋</div>
          <h2>{user.name}</h2>
          <div className="level">
            Level 12 &middot; {xpProgress.toLocaleString()} XP
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${xpPercent}%` }} />
          </div>
          <div className="badges">
            {badges.map(b => <span key={b}>{b}</span>)}
          </div>
        </div>
        <div className="avatar">{avatarLetter}</div>
      </div>

      <div className="stats">
        <div className="stat blue"><h2>{habitsDone}/5</h2><p>habits done</p></div>
        <div className="stat orange"><h2>{dayStreak} 🔥</h2><p>day streak</p></div>
        <div className="stat purple"><h2>#{globalRank}</h2><p>global rank</p></div>
      </div>
    </div>
  );
}