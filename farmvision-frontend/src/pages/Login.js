import React, { useState } from "react";

function Login({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="main-container">
      <div className="glass-card" style={{ width: "320px", textAlign: "center" }}>
        <h2>Login</h2>

        <input className="input" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input className="input" type="password" placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="predict-btn" onClick={handleLogin}>
          Login
        </button>

        <p onClick={() => setPage("signup")} style={{ cursor: "pointer" }}>
          Don't have account? Sign Up
        </p>
      </div>
    </div>
  );
}

export default Login;