import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper function to login user
async function loginUser(name) {
  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export default function Login() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Login handler
  const handleLogin = async () => {
    if (!name.trim()) {
      setError("Username cannot be empty");
      return;
    }
    try {
      const user = await loginUser(name.trim());
      localStorage.setItem("userId", user._id);
      setError("");
      navigate("/dashboard/home"); // Navigate to dashboard home after login
    } catch (err) {
      console.error(err);
      setError("Login failed. User might not exist. Try signing in.");
    }
  };

  // Navigate to Sign In page
  const goToSignIn = () => {
    navigate("/signin");
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={handleLogin} style={styles.loginBtn}>
        Login
      </button>
      <button onClick={goToSignIn} style={styles.signInBtn}>
        Sign In (Create Account)
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 360,
    margin: "auto",
    padding: 20,
    marginTop: 100,
    border: "1px solid #ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  loginBtn: {
    width: "100%",
    padding: 10,
    backgroundColor: "#6b21a8",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
    marginBottom: 8,
  },
  signInBtn: {
    width: "100%",
    padding: 10,
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
  },
};