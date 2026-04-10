import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || "Login failed");
        return;
      }

      setUser(data.user);
    } catch (err) {
      setError("Cannot reach backend API");
    }
  };

  if (user) {
    return (
      <main className="container">
        <h1>Home Page</h1>
        <p>Welcome, {user.fullName}</p>
        <p>Your username is {user.username}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Username
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In</button>
        <small>Demo: admin / admin123</small>
      </form>
    </main>
  );
}

export default App;
