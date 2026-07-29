import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import AuthVisual from '../components/AuthVisual';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../../ai/components/LoadingScreen';
import { Button } from '../../../components/ui/Button';
import { Input, FieldLabel } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

const Register = () => {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await handleRegister({ username, email, password });
    if (res?.success) navigate('/');
    else setError(res?.error || 'Registration failed. Please try again.');
  };

  if (loading) return <LoadingScreen message="Setting up your workspace" />;

  return (
    <main className="flex min-h-screen items-center bg-zinc-955 px-4 py-8 sm:px-6 lg:px-10 select-none">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-10">
        <AuthVisual
          title="Start preparing smarter."
          subtitle="Create a private workspace for resume analysis, mock interviews, and skill assessments."
        />

        <section className="flex flex-col justify-center rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6 sm:p-8 lg:p-10">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-550">Register</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-zinc-50">
              Create your account
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Takes less than a minute to get started.
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert type="error">{error}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                type="text"
                icon={User}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Alex Johnson"
                required
              />
            </div>

            <div>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a strong password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full pt-1">
              <span>Create account</span>
              <ArrowRight className="h-4 w-4 text-zinc-950" strokeWidth={1.5} />
            </Button>
          </form>

          <p className="mt-8 border-t border-zinc-800/80 pt-6 text-center text-xs text-zinc-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-zinc-300 hover:text-zinc-100 transition-colors">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Register;
