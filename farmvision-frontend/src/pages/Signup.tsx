import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Leaf, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { registerUser } from '../services/api';
import Navbar from '../components/common/Navbar';
import { useNotification } from '../context/NotificationContext';

interface SignupProps {
  setPage?: (page: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ setPage }) => {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password.trim()) {
      const msg = 'Please fill in all required fields.';
      setFormError(msg);
      notifyError(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setFormError(msg);
      notifyError(msg);
      return;
    }

    if (password.length < 4) {
      const msg = 'Password must be at least 4 characters long.';
      setFormError(msg);
      notifyError(msg);
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
        role: 'farmer',
      });

      if (data.message) {
        success('Welcome to FarmVision AI! Your account has been created successfully.');
        if (setPage) setPage('login');
        navigate('/login');
      } else {
        const errorMsg = data.error || 'Registration failed. Please check your information.';
        setFormError(errorMsg);
        notifyError(errorMsg);
      }
    } catch (err) {
      console.error('Registration error:', err);
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
                  Join Our Community for Healthier Pomegranates
                </h2>
                <p className="auth-banner-desc">
                  Create your account today and gain immediate access to AI-powered diagnosis,
                  pesticide recommendations, and crop tracking.
                </p>
              </div>

              <div style={{ fontSize: '13px', opacity: 0.85, fontWeight: 500 }}>
                Protecting Orchards Nationwide
              </div>
            </div>

            {/* RIGHT FORM SIDE */}
            <div className="auth-form-side">
              <div className="auth-form-header">
                <h2 className="auth-form-title">Create Account</h2>
                <p className="auth-form-subtitle">Create your FarmVision AI account to begin</p>
              </div>

              {formError && (
                <div className="alert-message alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <UserIcon size={18} className="input-icon-left" />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Ramesh Patil"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Create password"
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

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon-left" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <div
                      className="input-icon-right"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      role="button"
                      tabIndex={0}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  style={{ marginTop: '12px', height: '46px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-switch-text">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="auth-switch-link"
                  onClick={() => setPage && setPage('login')}
                >
                  Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
