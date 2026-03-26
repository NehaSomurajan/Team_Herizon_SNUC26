import { useState, useContext, createContext, useEffect } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Arjun Sharma",
  username: "@arjun_dev",
  level: 12,
  xp: 2840,
  xpToNext: 3200,
  streak: 14,
  avatar: "AS",
  badges: ["🔥 Hot Streak", "🧠 Quiz Master", "💻 Code Warrior", "🌟 Helper"],
  rank: 3,
};

const MOCK_HABITS = [
  { id: 1, name: "Coding Practice", icon: "💻", category: "LeetCode + GitHub", progress: 80, status: "completed", xpReward: 50 },
  { id: 2, name: "Daily Quiz", icon: "🧠", category: "10 Questions", progress: 100, status: "completed", xpReward: 30 },
  { id: 3, name: "Reading", icon: "📚", category: "30 min session", progress: 40, status: "in-progress", xpReward: 20 },
  { id: 4, name: "Language Learning", icon: "🌍", category: "Duolingo • 3 lessons", progress: 0, status: "missed", xpReward: 25 },
  { id: 5, name: "Meditation", icon: "🧘", category: "10 min focus", progress: 100, status: "completed", xpReward: 15 },
];

const MOCK_SQUADS = [
  { id: 1, name: "Code Breakers", members: ["AS","RK","PM","VN","TL"], topic: "DSA + System Design", checkins: 4, total: 5, xp: 12400 },
  { id: 2, name: "ML Pioneers", members: ["SK","AM","DL"], topic: "Machine Learning", checkins: 3, total: 3, xp: 8900 },
  { id: 3, name: "Web Wizards", members: ["PK","RT","SM","AJ"], topic: "Full Stack Dev", checkins: 2, total: 4, xp: 6700 },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Priya Krishnan", username: "@priya_k", xp: 4200, streak: 28, avatar: "PK", badge: "🏆", helper: 4.9 },
  { rank: 2, name: "Rahul Mehta", username: "@r_mehta", xp: 3600, streak: 21, avatar: "RM", badge: "🥈", helper: 4.7 },
  { rank: 3, name: "Arjun Sharma", username: "@arjun_dev", xp: 2840, streak: 14, avatar: "AS", badge: "🥉", helper: 4.5, isMe: true },
  { rank: 4, name: "Sneha Patel", username: "@sneha_p", xp: 2650, streak: 10, avatar: "SP", badge: "⭐", helper: 4.3 },
  { rank: 5, name: "Dev Kumar", username: "@dev_k", xp: 2200, streak: 7, avatar: "DK", badge: "⭐", helper: 4.1 },
  { rank: 6, name: "Ananya Iyer", username: "@ananya_i", xp: 1980, streak: 5, avatar: "AI", badge: "⭐", helper: 3.9 },
  { rank: 7, name: "Vikram Nair", username: "@vikram_n", xp: 1750, streak: 3, avatar: "VN", badge: "⭐", helper: 3.8 },
];

const MOCK_SOS = [
  { id: 1, name: "Karthik R", avatar: "KR", tags: ["Struggling in DSA", "Recursion"], urgency: "high", time: "2m ago" },
  { id: 2, name: "Meera S", avatar: "MS", tags: ["Confused: Dynamic Programming"], urgency: "medium", time: "15m ago" },
  { id: 3, name: "Aditya P", avatar: "AP", tags: ["System Design help needed"], urgency: "medium", time: "32m ago" },
  { id: 4, name: "Riya V", avatar: "RV", tags: ["SQL Queries", "DB normalization"], urgency: "low", time: "1h ago" },
];

const WEEK_ACTIVITY = [true, true, false, true, true, true, true]; // last 7 days

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppContext = createContext();

// ─── UTILITY HELPERS ─────────────────────────────────────────────────────────
const avatarColors = [
  "bg-violet-500","bg-indigo-500","bg-cyan-500","bg-emerald-500",
  "bg-rose-500","bg-amber-500","bg-fuchsia-500","bg-sky-500"
];
const getColor = (str) => avatarColors[str.charCodeAt(0) % avatarColors.length];

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

function Avatar({ initials, size = "md", pulse = false }) {
  const sz = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-xl" }[size];
  return (
    <div className={`relative ${sz} rounded-full ${getColor(initials)} flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
      {pulse && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-900 animate-pulse" />}
    </div>
  );
}

function AvatarGroup({ members, max = 4 }) {
  const shown = members.slice(0, max);
  const extra = members.length - max;
  return (
    <div className="flex -space-x-2">
      {shown.map((m, i) => (
        <div key={i} className="ring-2 ring-gray-900 rounded-full">
          <Avatar initials={m} size="sm" />
        </div>
      ))}
      {extra > 0 && (
        <div className="w-7 h-7 rounded-full bg-gray-700 ring-2 ring-gray-900 flex items-center justify-center text-xs text-gray-300 font-semibold">
          +{extra}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ value, color = "violet", showLabel = false }) {
  const colors = {
    violet: "from-violet-500 to-purple-600",
    cyan: "from-cyan-400 to-blue-500",
    emerald: "from-emerald-400 to-teal-500",
    amber: "from-amber-400 to-orange-500",
    rose: "from-rose-400 to-pink-500",
  };
  return (
    <div className="relative w-full">
      <div className="h-2 bg-gray-700/60 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && <span className="absolute right-0 -top-5 text-xs text-gray-400">{value}%</span>}
    </div>
  );
}

function Card({ children, className = "", glow = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5
        transition-all duration-300
        ${glow ? "shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20" : "hover:shadow-lg hover:shadow-black/30"}
        ${onClick ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function Badge({ text }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium">
      {text}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "in-progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    missed: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };
  const labels = { completed: "✓ Done", "in-progress": "⏳ In Progress", missed: "✗ Missed" };
  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ active, setActive }) {
  const navItems = [
    { id: "home", label: "Home", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { id: "habits", label: "Tasks", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    )},
    { id: "leaderboard", label: "Ranks", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )},
    { id: "squad", label: "Squad", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    )},
    { id: "help", label: "Help", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )},
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-20 bg-gray-900/95 border-r border-gray-800 z-50 items-center py-6 gap-2">
        {/* Logo */}
        <div className="mb-4 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-violet-500/30">
          SQ
        </div>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            title={item.label}
            className={`
              w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5
              transition-all duration-200 group
              ${active === item.id
                ? "bg-violet-500/20 text-violet-400 shadow-md shadow-violet-500/20"
                : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"}
            `}
          >
            {item.icon}
            <span className="text-[9px] font-medium">{item.label}</span>
          </button>
        ))}
        {/* User avatar at bottom */}
        <div className="mt-auto">
          <Avatar initials={MOCK_USER.avatar} pulse />
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-50 flex items-center justify-around px-2 py-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              active === item.id ? "text-violet-400" : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

// ─── HOME DASHBOARD ───────────────────────────────────────────────────────────
function Home({ setPage }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const xpPct = Math.round((MOCK_USER.xp / MOCK_USER.xpToNext) * 100);

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/80 via-purple-700/70 to-indigo-800/80 border border-violet-500/30 p-6 shadow-xl shadow-violet-900/30">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 70% 50%, white 0%, transparent 60%)"}} />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-violet-300 text-sm font-medium mb-1">Good morning 👋</p>
            <h1 className="text-2xl font-black text-white tracking-tight">{MOCK_USER.name}</h1>
            <p className="text-violet-200/70 text-sm mt-1">Level {MOCK_USER.level} · {MOCK_USER.xp.toLocaleString()} XP</p>
          </div>
          <Avatar initials={MOCK_USER.avatar} size="xl" pulse />
        </div>
        {/* XP bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-violet-300/80">
            <span>XP Progress</span>
            <span>{MOCK_USER.xp} / {MOCK_USER.xpToNext}</span>
          </div>
          <div className="h-2.5 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-300 to-white/80 rounded-full transition-all duration-1000"
              style={{width:`${xpPct}%`}}
            />
          </div>
        </div>
        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {MOCK_USER.badges.map(b => (
            <span key={b} className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-xs border border-white/20">{b}</span>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today", value: "4/5", sub: "habits done", icon: "📊", color: "from-cyan-500/20 to-blue-600/20", border: "border-cyan-500/30", text: "text-cyan-400" },
          { label: "Streak", value: `${MOCK_USER.streak}🔥`, sub: "day streak", icon: "🔥", color: "from-orange-500/20 to-amber-600/20", border: "border-orange-500/30", text: "text-orange-400" },
          { label: "Rank", value: `#${MOCK_USER.rank}`, sub: "global rank", icon: "🏆", color: "from-violet-500/20 to-purple-600/20", border: "border-violet-500/30", text: "text-violet-400" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-3 text-center`}>
            <p className={`text-xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCheckedIn(!checkedIn)}
          className={`
            relative overflow-hidden rounded-2xl p-4 border font-bold text-sm transition-all duration-300
            ${checkedIn
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : "bg-violet-500/20 border-violet-500/40 text-violet-300 hover:bg-violet-500/30 hover:-translate-y-0.5"}
          `}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{checkedIn ? "✅" : "📋"}</span>
            <span>{checkedIn ? "Checked In!" : "Check In Today"}</span>
          </div>
          {checkedIn && <div className="absolute inset-0 bg-emerald-400/5 animate-pulse rounded-2xl" />}
        </button>
        <button
          onClick={() => setPage("squad")}
          className="rounded-2xl p-4 border border-indigo-500/40 bg-indigo-500/20 text-indigo-300 font-bold text-sm hover:bg-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">👥</span>
          <span>Find a Group</span>
        </button>
      </div>

      {/* Activity grid */}
      <Card>
        <h3 className="text-sm font-bold text-gray-300 mb-3">Last 7 Days</h3>
        <div className="flex gap-1.5 items-end">
          {["M","T","W","T","F","S","S"].map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full rounded-lg transition-all ${
                WEEK_ACTIVITY[i]
                  ? "h-8 bg-gradient-to-t from-violet-600 to-violet-400 shadow-md shadow-violet-500/30"
                  : "h-4 bg-gray-700/60"
              }`} />
              <span className="text-[10px] text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Today's summary */}
      <Card glow>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-white">Daily Summary</h3>
          <span className="text-xs text-gray-400">Today</span>
        </div>
        <div className="space-y-3">
          {[
            { label: "Habits Completed", value: "4 of 5", pct: 80, color: "violet" },
            { label: "XP Earned Today", value: "+120 XP", pct: 75, color: "cyan" },
            { label: "Streak Goal", value: "14 days 🔥", pct: 93, color: "emerald" },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-400">{s.label}</span>
                <span className="text-white font-semibold">{s.value}</span>
              </div>
              <ProgressBar value={s.pct} color={s.color} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── HABITS ───────────────────────────────────────────────────────────────────
function Habits() {
  const [habits, setHabits] = useState(MOCK_HABITS);
  const completed = habits.filter(h => h.status === "completed").length;

  const toggle = (id) => {
    setHabits(h => h.map(h => h.id === id
      ? { ...h, status: h.status === "completed" ? "in-progress" : "completed", progress: h.status === "completed" ? 50 : 100 }
      : h
    ));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Today's Habits</h2>
          <p className="text-gray-400 text-sm">{completed}/{habits.length} completed</p>
        </div>
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8b5cf6" strokeWidth="3"
              strokeDasharray={`${(completed/habits.length)*100} 100`} strokeLinecap="round"/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {Math.round((completed/habits.length)*100)}%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {habits.map(h => (
          <Card key={h.id} onClick={() => toggle(h.id)} className="group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-700/60 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {h.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="font-bold text-white text-sm">{h.name}</h4>
                  <StatusPill status={h.status} />
                </div>
                <p className="text-xs text-gray-400 mb-2">{h.category}</p>
                <ProgressBar value={h.progress} color={
                  h.status === "completed" ? "emerald" :
                  h.status === "in-progress" ? "amber" : "rose"
                } />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-500">{h.progress}% done</span>
                  <span className="text-xs text-violet-400 font-semibold">+{h.xpReward} XP</span>
                </div>
                {h.status === "missed" && (
                  <div className="mt-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <p className="text-xs text-rose-400">😔 You missed yesterday — let's bounce back today! Tap to resume.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SQUAD ────────────────────────────────────────────────────────────────────
function Squad() {
  const [joined, setJoined] = useState([1]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white">Your Squads</h2>
        <p className="text-gray-400 text-sm">Study better together</p>
      </div>

      {/* Check-in strip */}
      <Card className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-700/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤝</span>
          <div>
            <p className="font-bold text-white text-sm">Group Check-In Active</p>
            <p className="text-cyan-300/80 text-xs">4 of 5 members checked in today</p>
          </div>
          <div className="ml-auto">
            <AvatarGroup members={MOCK_SQUADS[0].members} />
          </div>
        </div>
      </Card>

      {MOCK_SQUADS.map(sq => (
        <Card key={sq.id} glow>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-black text-white">{sq.name}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{sq.topic}</p>
            </div>
            <button
              onClick={() => setJoined(j => j.includes(sq.id) ? j.filter(x=>x!==sq.id) : [...j, sq.id])}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                joined.includes(sq.id)
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-violet-500 text-white hover:bg-violet-600"
              }`}
            >
              {joined.includes(sq.id) ? "✓ Joined" : "Join Squad"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <AvatarGroup members={sq.members} />
            <div className="text-right">
              <p className="text-xs text-gray-400">{sq.checkins}/{sq.total} checked in</p>
              <p className="text-xs text-violet-400 font-semibold">{sq.xp.toLocaleString()} XP total</p>
            </div>
          </div>
          {/* Check-in bar */}
          <div className="mt-3">
            <ProgressBar value={Math.round((sq.checkins/sq.total)*100)} color="cyan" />
          </div>
          <div className="mt-2 flex gap-1.5">
            {sq.members.map((m,i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Avatar initials={m} size="sm" pulse={i < sq.checkins} />
                <div className={`w-1.5 h-1.5 rounded-full ${i < sq.checkins ? "bg-emerald-400" : "bg-gray-600"}`} />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
function Leaderboard() {
  const top3 = MOCK_LEADERBOARD.slice(0,3);
  const rest = MOCK_LEADERBOARD.slice(3);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white">Leaderboard</h2>
        <p className="text-gray-400 text-sm">Weekly XP rankings</p>
      </div>

      {/* Podium */}
      <div className="relative flex items-end justify-center gap-3 pt-4 pb-6">
        {[top3[1], top3[0], top3[2]].map((p, idx) => {
          const heights = ["h-20","h-28","h-16"];
          const sizes = ["md","lg","md"];
          const order = [top3[1],top3[0],top3[2]];
          return (
            <div key={p.rank} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-2xl">{p.badge}</span>
              <Avatar initials={p.avatar} size={sizes[idx]} pulse={p.isMe} />
              <p className="text-xs font-bold text-white text-center truncate w-full text-center">{p.name.split(" ")[0]}</p>
              <p className="text-xs text-violet-400">{p.xp.toLocaleString()}</p>
              <div className={`w-full ${heights[idx]} rounded-t-xl ${
                idx===1 ? "bg-gradient-to-t from-amber-600 to-yellow-400"
                : idx===0 ? "bg-gradient-to-t from-gray-500 to-gray-300"
                : "bg-gradient-to-t from-orange-700 to-orange-400"
              } flex items-end justify-center pb-2`}>
                <span className="text-lg font-black text-white/80">#{p.rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest */}
      <div className="space-y-2">
        {rest.map(p => (
          <div key={p.rank} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
            p.isMe
              ? "bg-violet-500/20 border border-violet-500/40"
              : "bg-gray-800/50 border border-gray-700/30 hover:border-gray-600/50"
          }`}>
            <span className="text-gray-500 font-bold w-5 text-center text-sm">#{p.rank}</span>
            <Avatar initials={p.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${p.isMe ? "text-violet-300" : "text-white"}`}>{p.name}</p>
              <p className="text-xs text-gray-500">{p.username}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{p.xp.toLocaleString()}</p>
              <p className="text-xs text-gray-500">🔥 {p.streak}d</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-400 font-semibold">⭐ {p.helper}</p>
              <p className="text-xs text-gray-500">helper</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HELP CENTRE / SOS ────────────────────────────────────────────────────────
function Help() {
  const [helped, setHelped] = useState([]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white">Help Centre</h2>
        <p className="text-gray-400 text-sm">Support your peers · Earn helper XP</p>
      </div>

      {/* AI Panel */}
      <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-indigo-500/30" glow>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm">🤖</div>
          <div>
            <p className="text-white font-bold text-sm">AI Study Advisor</p>
            <p className="text-indigo-300/70 text-xs">Personalized insights for you</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-emerald-400 text-xs font-bold mb-1">✨ Your Strengths</p>
            <p className="text-gray-300 text-xs">Arrays, HashMaps, React Hooks, SQL basics</p>
          </div>
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <p className="text-rose-400 text-xs font-bold mb-1">🎯 Work On</p>
            <p className="text-gray-300 text-xs">DP, Graph traversal, System design</p>
          </div>
        </div>
        <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
          <p className="text-violet-300 text-xs font-semibold mb-1">💡 AI Suggestion</p>
          <p className="text-gray-300 text-xs">Priya Krishnan is great at Dynamic Programming and available. Reach out for a 30-min pair session!</p>
        </div>
      </Card>

      {/* SOS List */}
      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Students Needing Help</h3>
      <div className="space-y-3">
        {MOCK_SOS.map(s => (
          <Card key={s.id}>
            <div className="flex items-start gap-3">
              <Avatar initials={s.avatar} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-bold text-white text-sm">{s.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    s.urgency === "high" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                    s.urgency === "medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                    "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                  }`}>{s.urgency}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {s.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-gray-700/60 rounded-full text-xs text-gray-300">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{s.time}</span>
                  <button
                    onClick={() => setHelped(h => h.includes(s.id) ? h.filter(x=>x!==s.id) : [...h, s.id])}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      helped.includes(s.id)
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-violet-500 text-white hover:bg-violet-600"
                    }`}
                  >
                    {helped.includes(s.id) ? "✓ Assisting" : "🤝 Help"}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gamification */}
      <Card className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 border-amber-700/30">
        <h3 className="font-bold text-white mb-3">🎮 Gamification</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "XP Points", value: `${MOCK_USER.xp.toLocaleString()}`, icon: "⚡", color: "text-yellow-400" },
            { label: "Helper Rank", value: "4.5 ⭐", icon: "🤝", color: "text-cyan-400" },
            { label: "Badges", value: `${MOCK_USER.badges.length} earned`, icon: "🏅", color: "text-violet-400" },
            { label: "Mini Games", value: "Level 5", icon: "🎯", color: "text-emerald-400" },
          ].map(s => (
            <div key={s.label} className="p-2.5 bg-black/20 rounded-xl border border-white/5">
              <p className="text-lg">{s.icon}</p>
              <p className={`font-black text-sm ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const pages = {
    home: <Home setPage={setPage} />,
    habits: <Habits />,
    leaderboard: <Leaderboard />,
    squad: <Squad />,
    help: <Help />,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans" style={{fontFamily:"'DM Sans', 'Inter', system-ui, sans-serif"}}>
      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <Navbar active={page} setActive={setPage} />

      {/* Main content */}
      <main className="md:ml-20 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-5">
          {pages[page]}
        </div>
      </main>
    </div>
  );
}
