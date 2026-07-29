import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../../ai/components/LoadingScreen';
import { Alert } from '../../../components/ui/Alert';

const Login = () => {
  const { 
    loading, 
    handleLogin, 
    handleVerifyLoginOTP, 
    handleGoogleAuth 
  } = useAuth();
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Load Google Client SDK
  useEffect(() => {
    const renderGoogleBtn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1035532551523-mock.apps.googleusercontent.com',
          callback: async (response) => {
            setError('');
            const res = await handleGoogleAuth(response.credential);
            if (res.success) navigate('/dashboard');
            else setError(res.error);
          },
        });
        const container = document.getElementById('googleSignInBtn');
        if (container) {
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: '380',
          });
        }
      }
    };

    if (window.google) {
      renderGoogleBtn();
    } else {
      const existingScript = document.getElementById('google-gsi-sclient');
      if (existingScript) {
        existingScript.addEventListener('load', renderGoogleBtn);
      } else {
        const script = document.createElement('script');
        script.id = 'google-gsi-sclient';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = renderGoogleBtn;
      }
    }
  }, [otpSent]);

  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setOtpLoading(true);
    const res = await handleLogin({ email, password });
    setOtpLoading(false);
    if (res.success && res.otpSent) {
      setOtpSent(true);
      setSuccessMsg('A 6-digit verification code has been sent to your email.');
    } else {
      setError(res.error || 'Authentication check failed.');
    }
  };

  const handleVerifyOTPCode = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setOtpLoading(true);
    const res = await handleVerifyLoginOTP(email, otpCode);
    setOtpLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'OTP verification failed.');
    }
  };

  if (loading) return <LoadingScreen message="Establishing session" />;

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-zinc-955 transition-colors duration-300 select-none">
      
      {/* Left Column: Premium Branding */}
      <section className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-colors duration-300 relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2.5 group relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-200 dark:border-sky-800/50 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 group-hover:border-sky-500 transition-colors duration-300">
            <Sparkles className="h-4.5 w-4.5" strokeWidth={2} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">PrepAI</span>
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
                <CheckCircle2 className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-6 flex gap-8 relative z-10">
          <div>
            <p className="text-sm font-black text-sky-600 dark:text-sky-400">88%</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Pass rate increase</p>
          </div>
          <div>
            <p className="text-sm font-black text-sky-600 dark:text-sky-400">12k+</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Reports generated</p>
          </div>
        </div>
      </section>

      {/* Right Column: Form */}
      <section className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
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
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6">
            <div className="flex lg:hidden h-11 w-11 items-center justify-center rounded-xl border border-sky-100 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 mb-4 transition-colors">
              <Sparkles className="h-5.5 w-5.5" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
              {otpSent ? 'Enter verification code' : 'Sign in to PrepAI'}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
              {otpSent ? 'For security, we sent a code to verify your login.' : 'Enter your email and password to log in.'}
            </p>
          </div>

          {(error || successMsg) && (
            <div className="mb-6">
              {error && <Alert type="error">{error}</Alert>}
              {successMsg && <Alert type="success">{successMsg}</Alert>}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.div
                key="credentials-view"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <form onSubmit={handleSubmitCredentials} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-950 focus:border-sky-500 dark:focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition-all font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-950 focus:border-sky-500 dark:focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition-all font-semibold"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
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
                    disabled={otpLoading}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold transition-all shadow-sm hover:shadow-sky-500/15 cursor-pointer disabled:opacity-50"
                  >
                    <span>{otpLoading ? 'Checking...' : 'Login'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Social Sign-in Divider */}
                <div className="flex items-center justify-center gap-3 select-none">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800/80" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Or continue with
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800/80" />
                </div>

                {/* Google Button Wrapper */}
                <div id="googleSignInBtn" className="w-full flex justify-center" />
              </motion.div>
            ) : (
              <motion.form
                key="otp-view"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleVerifyOTPCode}
                className="space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="otpCode" className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                      OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-[10px] font-bold text-sky-600 hover:text-sky-500 cursor-pointer"
                    >
                      Back to Login
                    </button>
                  </div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                    <input
                      id="otpCode"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 text-sm text-center font-mono font-black text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-950 focus:border-sky-500 dark:focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition-all tracking-[4px]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold transition-all shadow-sm hover:shadow-sky-500/15 cursor-pointer disabled:opacity-50"
                >
                  <span>{otpLoading ? 'Verifying...' : 'Verify & Log In'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer Link */}
          <p className="mt-8 border-t border-slate-100 dark:border-zinc-800/60 pt-6 text-center lg:text-left text-xs text-slate-500 dark:text-zinc-400">
            No account yet?{' '}
            <Link to="/register" className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
              Create one
            </Link>
          </p>

        </motion.div>
      </section>

    </main>
  );
};

export default Login;
