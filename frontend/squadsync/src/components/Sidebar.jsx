import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Helper API call for login
async function loginUser(name) {
  const res = await fetch("http://localhost:3000/login", {  // Adjust base URL as needed
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // returns user object with _id etc
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [username, setUsername] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    try {
      const user = await loginUser(username.trim());
      localStorage.setItem("userId", user._id);
      setUserId(user._id);
      setUsername("");
      setIsLoggingIn(false);
      setError("");
      navigate("/dashboard"); // redirect to dashboard home after login
    } catch (err) {
      setError("Login failed, try again.");
    }
  };

  // Logout function (optional)
  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId("");
    navigate("/");
  };

  // Sidebar fixed styling
  return (
    <div
      className="sidebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 200,
        padding: "20px",
        backgroundColor: "#111827",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2>SQ</h2>

        {userId ? (
          <>
            <nav>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>
                  <Link
                    to="/dashboard"
                    style={{
                      color: location.pathname === "/dashboard" ? "#a78bfa" : "white",
                      textDecoration: "none",
                    }}
                  >
                    🏠 Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/stats"
                    style={{
                      color: location.pathname === "/dashboard/stats" ? "#a78bfa" : "white",
                      textDecoration: "none",
                    }}
                  >
                    📊 Stats
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/groups"
                    style={{
                      color: location.pathname === "/dashboard/groups" ? "#a78bfa" : "white",
                      textDecoration: "none",
                    }}
                  >
                    👥 Group
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/help"
                    style={{
                      color: location.pathname === "/dashboard/help" ? "#a78bfa" : "white",
                      textDecoration: "none",
                    }}
                  >
                    ❓ Help
                  </Link>
                </li>
              </ul>
            </nav>
            <button
              onClick={handleLogout}
              style={{
                marginTop: 30,
                backgroundColor: "#6b21a8",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
                color: "white",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {!isLoggingIn ? (
              <button
                onClick={() => setIsLoggingIn(true)}
                style={{
                  backgroundColor: "#6b21a8",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  color: "white",
                  width: "100%",
                }}
              >
                Sign In
              </button>
            ) : (
              <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: 10,
                    borderRadius: 6,
                    border: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#6b21a8",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: "white",
                    width: "100%",
                  }}
                >
                  Login / Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggingIn(false);
                    setError("");
                    setUsername("");
                  }}
                  style={{
                    marginTop: 8,
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: 12,
                  }}
                >
                  Cancel
                </button>
                {error && (
                  <p style={{ color: "red", fontSize: 12, marginTop: 8 }}>{error}</p>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}