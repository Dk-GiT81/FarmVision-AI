import React from "react";

function Home({ setPage }) {
  return (
    <div className="main-container">
      <div className="glass-card" style={{ width: "350px", textAlign: "center" }}>
        <h1>🍎 FarmVision AI</h1>
        <p>AI-based Pomegranate Disease Detection</p>

        <button className="predict-btn" onClick={() => setPage("login")}>
          Login
        </button>

        <button className="predict-btn" onClick={() => setPage("signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Home;