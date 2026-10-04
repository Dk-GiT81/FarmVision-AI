import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole } from './types';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

import { useNotification } from './context/NotificationContext';

// Protected Route Wrapper for Dashboard and its sub-routes
export const ProtectedDashboard: React.FC<{
  user: User | null;
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Dashboard user={user} onLogout={onLogout} />;
};

export const AppContent: React.FC<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleLogout: () => void;
}> = ({ user, setUser, handleLogout }) => {
  return (
    <Routes>
      {/* 1. Public Home Landing Page */}
      <Route path="/" element={<Home />} />

      {/* 2. Login Page (redirect to /dashboard if already authenticated) */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />}
      />

      {/* 3. Register Page (redirect to /dashboard if already authenticated) */}
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
      />

      {/* 4. Legacy redirect: /signup -> /register */}
      <Route path="/signup" element={<Navigate to="/register" replace />} />

      {/* 5. Protected Dashboard Route & All Sub-routes (/dashboard, /dashboard/upload, etc.) */}
      <Route
        path="/dashboard/*"
        element={<ProtectedDashboard user={user} onLogout={handleLogout} />}
      />

      {/* 6. Wildcard redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { info } = useNotification();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (
          parsed &&
          typeof parsed.email === 'string' &&
          (parsed.role === 'farmer' || parsed.role === 'admin')
        ) {
          setUser({
            name: typeof parsed.name === 'string' ? parsed.name : 'User',
            email: parsed.email,
            role: parsed.role as UserRole,
          });
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch (e) {
      console.error('Failed to parse user session from localStorage:', e);
      localStorage.removeItem('user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    info('You have been logged out successfully.');
  };

  return (
    <BrowserRouter>
      <AppContent user={user} setUser={setUser} handleLogout={handleLogout} />
    </BrowserRouter>
  );
};

export default App;
