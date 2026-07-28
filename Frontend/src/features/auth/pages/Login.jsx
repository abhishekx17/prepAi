import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, Eye } from 'lucide-react';
import AuthVisual from '../components/AuthVisual';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLogin({ email, password });
    navigate('/');
  };

  if (loading) {
    return (
      <main>
        <h1>Loading.....</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#0A0C10] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-center selection:bg-slate-700 selection:text-white">
      {/* Main Responsive Grid Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen max-w-7xl mx-auto w-full p-4 sm:p-8 lg:p-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: 3D Animated AI Model & Branding */}
        <section className="lg:col-span-6 flex flex-col justify-between h-full bg-[#0E1017] lg:bg-transparent p-6 sm:p-8 lg:p-0 rounded-2xl border border-slate-900 lg:border-none">
          <AuthVisual
            title="ACE YOUR INTERVIEW."
            subtitle="AI-powered mock interview simulator for technical and behavioral practice."
          />
        </section>

        {/* Right Side: Responsive Login Form */}
        <section className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <div className="w-full max-w-md bg-[#12151E] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Sign In</h2>
              <p className="text-sm text-slate-400">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1A1D29] hover:bg-[#222636] border border-slate-800 rounded-xl text-slate-200 text-sm font-medium transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3S5.6 9 5.6 8.2L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1A1D29] hover:bg-[#222636] border border-slate-800 rounded-xl text-slate-200 text-sm font-medium transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-[#12151E] px-3 text-xs text-slate-500 font-mono absolute">
                or
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@example.com"
                    className="w-full bg-[#1A1D29] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full bg-[#1A1D29] border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-slate-200 text-black font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="text-center mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <a href="/register" className="text-white hover:underline font-semibold ml-1">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
