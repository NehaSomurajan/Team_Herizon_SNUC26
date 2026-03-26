import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

async function createUser(name) {
  const res = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Sign In failed");
  return res.json();
}

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }
    try {
      const user = await createUser(username.trim());
      localStorage.setItem("userId", user._id);
      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account. Try a different username.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center" }}>Sign In / Create Account</h2>
      <input
        type="text"
        placeholder="Choose a username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={handleSignIn} style={styles.signInBtn}>
        Create Account
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