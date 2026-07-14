import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./components/upload";
import History from "./components/History";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
  }, []);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  };

  // 🔐 Not logged in
  if (!user) {
    if (page === "home") return <Home setPage={setPage} />;
    if (page === "login") return <Login setUser={setUser} setPage={setPage} />;
    if (page === "signup") return <Signup setPage={setPage} />;
  }

  // 🧑‍🌾 Farmer
  if (user.role === "farmer") {
    return (
      <div className="app-container">

        {/* 🔥 NAVBAR */}
        <div className="navbar">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <h2 style={{ color: "white", textAlign: "center" }}>
          Welcome {user.name}
        </h2>

        <Upload setRefreshTrigger={setRefreshTrigger} user={user} />
        <History refreshTrigger={refreshTrigger} user={user} />
      </div>
    );
  }

  // 👨‍💼 Admin
if (user.role === "admin") {
  return (
    <div className="app-container">

      <div className="navbar">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2 style={{ color: "white", textAlign: "center" }}>
        Admin Dashboard
      </h2>

      <Dashboard user={user} />
      <History refreshTrigger={refreshTrigger} user={user} />

    </div>
  );
}
}

export default App;