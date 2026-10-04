import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { User } from '../types';
import { loginUser } from '../services/api';
import Navbar from '../components/common/Navbar';
import { useNotification } from '../context/NotificationContext';

interface LoginProps {
  setUser: (user: User) => void;
  setPage?: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setUser, setPage }) => {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password.trim()) {
      const msg = 'Please enter both email and password.';
      setFormError(msg);
      notifyError(msg);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email: trimmedEmail, password });

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);

        if (data.user.role === 'admin') {
          success('Welcome back, Admin.');
        } else {
          success('Welcome back to FarmVision AI.');
        }

        if (setPage) setPage('dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        const errorMsg = data.error || 'Incorrect email or password.';
        setFormError(errorMsg);
        notifyError(errorMsg);
      }
    } catch (err) {
      console.error('Login error:', err);
      const netError = 'Unable to connect to FarmVision AI. Please try again.';
      setFormError(netError);
      notifyError(netError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="ambient-orb ambient-orb-top-left" />
      <div className="ambient-orb ambient-orb-bottom-right" />

      <div className="app-content auth-page-container">
        <Navbar setPage={setPage} showBackHome={true} />

        <div className="auth-card-wrapper">
          <div className="auth-split-card">
            {/* LEFT BANNER SIDE */}
            <div className="auth-banner-side">
              <div className="auth-banner-brand">
                <div className="navbar-brand-icon">
                  <Leaf size={20} />
                </div>
                <span>FarmVision AI</span>
              </div>

              <div>
                <h2 className="auth-banner-title">
                  Smart Disease Detection for Healthier Pomegranates
                </h2>
                <p className="auth-banner-desc">
                  Instant visual diagnostics powered by state-of-the-art computer vision to safeguard your harvest.
                </p>
              </div>

              <div style={{ fontSize: '13px', opacity: 0.85, fontWeight: 500 }}>
                Advanced AI Precision Agriculture
              </div>
            </div>

            {/* RIGHT FORM SIDE */}
            <div className="auth-form-side">
              <div className="auth-form-header">
                <h2 className="auth-form-title">Welcome Back</h2>
                <p className="auth-form-subtitle">Login to access your agricultural diagnosis dashboard</p>
              </div>

              {formError && (
                <div className="alert-message alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon-left" />
                    <input
                      type="email"
                      className="input-field"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon-left" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <div
                      className="input-icon-right"
                      onClick={() => setShowPassword(!showPassword)}
                      role="button"
                      tabIndex={0}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  style={{ marginTop: '14px', height: '46px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-switch-text">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="auth-switch-link"
                  onClick={() => setPage && setPage('signup')}
                >
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
