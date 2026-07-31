import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './services/api';
import AdminLayout from './components/AdminLayout';
import DashboardHome from './pages/DashboardHome';
import UsersManagement from './pages/UsersManagement';
import SessionsManagement from './pages/SessionsManagement';
import { Shield, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forgot Password States
  const [authMode, setAuthMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/auth/get-me');
      if (response.data?.user) {
        const u = response.data.user;
        if (u.email === 'abhishek.0x17@gmail.com') {
          setUser(u);
        } else {
          setAuthError('Access denied. Official administrator privileges required.');
          await api.get('/api/auth/logout').catch(() => {});
        }
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data?.user) {
        const u = response.data.user;
        if (u.email === 'abhishek.0x17@gmail.com') {
          setUser(u);
        } else {
          setAuthError('Access denied. Only the official administrator account is permitted.');
          await api.get('/api/auth/logout').catch(() => {});
        }
      } else {
        setAuthError('Unexpected response from server.');
      }
    } catch (err) {
      console.error(err);
      setAuthError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setAuthError('Please enter your email address.');
      return;
    }
    setSubmitting(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const response = await api.post('/api/auth/forgot-password', { email: resetEmail });
      if (response.data?.success) {
        setAuthSuccess('Password reset OTP code has been sent to your email.');
        setAuthMode('reset');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Failed to send OTP code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !resetOtp || !resetNewPassword) {
      setAuthError('Please complete all reset fields.');
      return;
    }
    setSubmitting(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const response = await api.post('/api/auth/reset-password', {
        email: resetEmail,
        otp: resetOtp,
        newPassword: resetNewPassword
      });
      if (response.data?.success) {
        setAuthSuccess('Your password has been reset successfully. Please log in.');
        setAuthMode('login');
        setPassword('');
        setResetOtp('');
        setResetNewPassword('');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Failed to reset password. Verify OTP code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.get('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Connecting to server...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-6 sm:p-8 shadow-xl relative z-10 fade-in-up">
          
          {/* Logo / Brand header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-300 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">PrepAI Admin Portal</h1>
            <p className="text-zinc-500 text-xs mt-1">Authorized Management Access Only</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-900/40 text-red-400 rounded-lg text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-6 p-4 bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 rounded-lg text-xs">
              <span>{authSuccess}</span>
            </div>
          )}

          {authMode === 'login' && (
            /* Login view */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="admin@prepai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-zinc-600 outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs py-2.5 rounded-lg transition mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>
          )}

          {authMode === 'forgot' && (
            /* Forgot Password view */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Enter your Admin Email</label>
                <input
                  type="email"
                  placeholder="abhishek.0x17@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs py-2.5 rounded-lg transition mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Request Reset OTP</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition mt-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </form>
          )}

          {authMode === 'reset' && (
            /* Reset password view */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-zinc-500 text-xs leading-relaxed mb-4">
                We've sent an verification OTP to your email. Enter it below along with your new password to reset it.
              </p>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">OTP verification code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition font-mono tracking-wider"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showResetNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-zinc-600 outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showResetNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs py-2.5 rounded-lg transition mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('forgot');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition mt-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email / Resend</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AdminLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/sessions" element={<SessionsManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}
