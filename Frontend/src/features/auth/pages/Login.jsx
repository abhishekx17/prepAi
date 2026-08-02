import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../../components/ui/Logo';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../../ai/components/LoadingScreen';
import { Alert } from '../../../components/ui/Alert';

const Login = () => {
  const { 
    loading, 
    handleLogin, 
    handleForgotPassword,
    handleResetPassword
  } = useAuth();
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Password reset state controller
  const [authMode, setAuthMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setAuthLoading(true);
    const res = await handleLogin({ email, password });
    setAuthLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Authentication check failed.');
    }
  };

  const handleSubmitForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setAuthLoading(true);
    const res = await handleForgotPassword(email);
    setAuthLoading(false);
    if (res.success) {
      setSuccessMessage('Password reset verification OTP code has been sent to your email.');
      setAuthMode('reset');
    } else {
      setError(res.error || 'Failed to send OTP code.');
    }
  };

  const handleSubmitReset = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      setError('Please fill in all reset password fields.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setAuthLoading(true);
    const res = await handleResetPassword({ email, otp, newPassword });
    setAuthLoading(false);
    if (res.success) {
      setSuccessMessage('Your password has been updated successfully. Please log in.');
      setAuthMode('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
    } else {
      setError(res.error || 'Failed to update password. Check your OTP code.');
    }
  };

  if (loading) return <LoadingScreen message="Establishing session" />;

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 select-none">
      
      {/* Left Column: Premium Branding */}
      <section className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-colors duration-300 relative overflow-hidden">
        <Link to="/" className="relative z-10 group">
          <Logo size="md" variant="blue" showText={true} textClassName="text-lg font-bold tracking-tight" />
        </Link>

        <div className="my-auto relative z-10 max-w-sm space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 leading-tight">
              Your interview preparation workspace.
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
              Analyze roles, practice with AI-led interviews, and track progress — all in one focused environment.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {[
              "Personalized Resume Match Rating",
              "Adaptive Technical Mock Arena Rounds",
              "Dynamic Topic-based Quizzes",
              "Detailed speech and code analysis"
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-6 flex gap-8 relative z-10">
          <div>
            <p className="text-sm font-black text-blue-600 dark:text-blue-400">88%</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Pass rate increase</p>
          </div>
          <div>
            <p className="text-sm font-black text-blue-600 dark:text-blue-400">12k+</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Reports generated</p>
          </div>
        </div>
      </section>

      {/* Right Column: Form */}
      <section className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 lg:bg-transparent lg:dark:bg-transparent border border-slate-200 dark:border-zinc-800 lg:border-0 rounded-2xl p-8 sm:p-10 lg:p-0 shadow-sm lg:shadow-none transition-colors duration-300"
        >
          {/* Header Title toggler */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6">
            <Logo size="lg" variant="blue" showText={false} containerClassName="lg:hidden mb-4" />
            
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
              {authMode === 'login' ? 'Sign in to PrepAI' : authMode === 'forgot' ? 'Forgot Password' : 'Reset your password'}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
              {authMode === 'login' ? 'Enter your email and password to log in.' : 
               authMode === 'forgot' ? 'Enter your email address to receive a verification OTP code.' : 
               'Enter the OTP verification code and your new password.'}
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="error">{error}</Alert>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450 rounded-xl text-xs flex items-start gap-2.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {authMode === 'login' && (
              /* LOGIN VIEW */
              <motion.div
                key="credentials-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSubmitCredentials} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-555" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-950 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="password" className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setError('');
                          setSuccessMessage('');
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-950 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 dark:text-zinc-555 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4.5 w-4.5" strokeWidth={1.5} />
                        ) : (
                          <Eye className="h-4.5 w-4.5" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm hover:shadow-blue-500/15 cursor-pointer disabled:opacity-50"
                  >
                    <span>{authLoading ? 'Checking...' : 'Login'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {authMode === 'forgot' && (
              /* FORGOT PASSWORD VIEW */
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSubmitForgotPassword} className="space-y-5">
                  <div>
                    <label htmlFor="forgot-email" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
                      Enter your email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-950 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm hover:shadow-blue-500/15 cursor-pointer disabled:opacity-50"
                  >
                    <span>{authLoading ? 'Requesting...' : 'Request Reset OTP'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-white transition-colors cursor-pointer mt-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Login</span>
                  </button>
                </form>
              </motion.div>
            )}

            {authMode === 'reset' && (
              /* RESET PASSWORD VIEW */
              <motion.div
                key="reset-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSubmitReset} className="space-y-5">
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
                    Check your email inbox. We have sent a verification code to <strong className="text-slate-800 dark:text-white">{email}</strong>.
                  </p>

                  <div>
                    <label htmlFor="reset-otp" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
                      OTP verification code
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                      <input
                        id="reset-otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP code"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-650 focus:bg-white dark:focus:bg-zinc-950 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-mono tracking-wider font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                      <input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Choose a new secure password"
                        className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-950 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4.5 w-4.5" strokeWidth={1.5} />
                        ) : (
                          <Eye className="h-4.5 w-4.5" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm hover:shadow-blue-500/15 cursor-pointer disabled:opacity-50"
                  >
                    <span>{authLoading ? 'Updating...' : 'Update Password'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-white transition-colors cursor-pointer mt-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Change Email / Resend OTP</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Link */}
          <p className="mt-8 border-t border-slate-100 dark:border-zinc-800/60 pt-6 text-center lg:text-left text-xs text-slate-500 dark:text-zinc-400">
            No account yet?{' '}
            <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              Create one
            </Link>
          </p>

        </motion.div>
      </section>

    </main>
  );
};

export default Login;
