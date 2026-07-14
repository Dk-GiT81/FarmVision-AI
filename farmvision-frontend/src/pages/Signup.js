import React, { useState } from "react";

function Signup({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");

  const handleSignup = async () => {
    const res = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();

    if (data.message) {
      alert("Signup successful");
      setPage("login");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="main-container">
      <div className="glass-card" style={{ width: "320px", textAlign: "center" }}>
        <h2>Sign Up</h2>

        <input className="input" placeholder="Name"
          onChange={(e)=>setName(e.target.value)} />

        <input className="input" placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)} />

        <input className="input" type="password" placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)} />

        <select className="input" onChange={(e)=>setRole(e.target.value)}>
          <option value="farmer">Farmer</option>
          <option value="admin">Admin</option>
        </select>

        <button className="predict-btn" onClick={handleSignup}>
          Sign Up
        </button>

        <p onClick={() => setPage("login")} style={{ cursor: "pointer" }}>
          Already have account? Login
        </p>
      </div>
    </div>
  );
}

export default Signup;