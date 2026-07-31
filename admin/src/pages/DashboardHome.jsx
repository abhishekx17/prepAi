import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Card } from '../components/Card';
import { 
  Users, 
  BrainCircuit, 
  BookOpen, 
  FileCheck2, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle,
  ArrowRight,
  Shield
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 24, stiffness: 220 } },
};

const AnimatedCounter = ({ value, duration = 0.8 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stringVal = String(value);
    const match = stringVal.match(/\d+/);
    const end = match ? parseInt(match[0], 10) : 0;
    if (end === 0) {
      setCount(value);
      return undefined;
    }

    let start = 0;
    const isPercent = stringVal.includes('%');
    const stepTime = Math.max(Math.floor((duration * 1000) / end), 20);

    const timer = setInterval(() => {
      start += Math.ceil(end / 28);
      if (start >= end) {
        clearInterval(timer);
        setCount(value);
      } else {
        setCount(isPercent ? `${start}%` : start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

const StatTile = ({ label, value, detail, icon: Icon, tone = 'cyan' }) => {
  const toneClasses = {
    cyan: 'text-sky-400 bg-sky-950/20 border-sky-900/40',
    pink: 'text-fuchsia-400 bg-fuchsia-950/20 border-fuchsia-900/40',
    green: 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40',
    amber: 'text-amber-400 bg-amber-950/20 border-amber-900/40',
  };

  return (
    <Card className="p-4 sm:p-5 border-zinc-800">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-white">
            <AnimatedCounter value={value} />
          </p>
          <p className="mt-1 text-xs font-medium text-zinc-500">{detail}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${toneClasses[tone]}`}>
          <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
        </div>
      </div>
    </Card>
  );
};

export default function DashboardHome() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/api/admin/stats');
      if (response.data?.success) {
        setData(response.data.stats);
        setError('');
      } else {
        setError('Failed to fetch statistics.');
      }
    } catch (err) {
      console.error(err);
      setError('Error communicating with administration backend.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getPercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  const users = data?.users;
  const usage = data?.usage;
  const interviews = data?.interviews;
  const quizzes = data?.quizzes;
  const reports = data?.reports;
  const recentInterviews = data?.recentInterviews;
  const recentQuizzes = data?.recentQuizzes;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Aggregating system statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-zinc-900 border border-zinc-800 text-red-400 flex items-center gap-3 rounded-2xl">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider">Dashboard Error</h3>
          <p className="text-xs text-zinc-400 mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 text-zinc-300"
    >
      {/* Cockpit Intro section */}
      <motion.section
        variants={itemVariants}
        className="overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/40 shadow-sm backdrop-blur-sm"
      >
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-7">
          <div className="flex min-h-52 flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-sky-900/20 bg-sky-950/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.7} />
                Administrator cockpit
              </div>
              <h2 className="mt-5 max-w-2xl text-2xl font-black tracking-tight text-white sm:text-3xl">
                Welcome back, Abhishek.
              </h2>
              <p className="mt-3 max-w-xl text-xs leading-5 text-zinc-400">
                Monitor system metrics, audit user sessions, allocate licensing scopes, and verify technical quiz performance.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/users')}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-4 text-xs font-bold cursor-pointer transition"
              >
                Manage Users
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/sessions')}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-xs font-bold text-zinc-200 hover:bg-zinc-800 cursor-pointer transition"
              >
                Audit Sessions
              </button>
              <button
                type="button"
                onClick={fetchStats}
                disabled={refreshing}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 text-xs font-bold text-zinc-400 hover:text-zinc-200 cursor-pointer disabled:opacity-50 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid content-end gap-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">System status</p>
              <p className="mt-2 text-sm font-bold text-zinc-200">
                {users.total === 0
                  ? 'Awaiting user registration'
                  : interviews.total === 0
                    ? 'Awaiting interview practice logs'
                    : quizzes.total === 0
                      ? 'Awaiting trivia session database logs'
                      : 'All systems functioning normally'}
              </p>
              <p className="mt-1 text-[11px] leading-4 text-zinc-500">
                Database registers and aggregates active resources automatically.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Counter tiles */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Registered Users" value={users.total} detail={`${users.verified} verified accounts`} icon={Users} tone="cyan" />
        <StatTile label="Mock Interviews" value={interviews.total} detail={`${interviews.completed} completed runs`} icon={BrainCircuit} tone="green" />
        <StatTile label="Technical Quizzes" value={quizzes.total} detail={`${quizzes.completed} completed runs`} icon={BookOpen} tone="amber" />
        <StatTile label="Match Reports" value={reports.total} detail="Resume analyses" icon={FileCheck2} tone="pink" />
      </motion.div>

      {/* Global Licensing Distribution - Now full width since system checkpoints are removed */}
      <motion.div variants={itemVariants}>
        <Card className="p-4 sm:p-6 border-zinc-800 w-full bg-zinc-900/40">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Licensing Distribution</p>
              <h3 className="mt-1 text-base font-bold text-white">Global User Plan Allocation</h3>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Total Accounts: <strong className="text-zinc-200">{users.total}</strong>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Free Tier */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/45 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-zinc-400">Free Tier</span>
                  <span className="text-white font-mono">{users.tiers.Free} ({getPercentage(users.tiers.Free, users.total)}%)</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal mb-4">Standard limitations enforced (5 Resumes, 1 Interview, 3 Quizzes).</p>
              </div>
              <div className="w-full bg-zinc-900 rounded h-1.5 overflow-hidden">
                <div 
                  className="bg-zinc-600 h-full rounded transition-all duration-1000" 
                  style={{ width: `${getPercentage(users.tiers.Free, users.total)}%` }}
                ></div>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/45 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-indigo-400">Pro Tier</span>
                  <span className="text-white font-mono">{users.tiers.Pro} ({getPercentage(users.tiers.Pro, users.total)}%)</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal mb-4 font-normal">Premium features enabled. Limit constraints bypass enabled.</p>
              </div>
              <div className="w-full bg-zinc-900 rounded h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded transition-all duration-1000" 
                  style={{ width: `${getPercentage(users.tiers.Pro, users.total)}%` }}
                ></div>
              </div>
            </div>

            {/* Enterprise Tier */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/45 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-purple-400">Enterprise Tier</span>
                  <span className="text-white font-mono">{users.tiers.Enterprise} ({getPercentage(users.tiers.Enterprise, users.total)}%)</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal mb-4">Corporate access. Total limit exceptions for candidate evaluation.</p>
              </div>
              <div className="w-full bg-zinc-900 rounded h-1.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded transition-all duration-1000" 
                  style={{ width: `${getPercentage(users.tiers.Enterprise, users.total)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Live System Activity logs */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Interviews Activity List */}
        <motion.section variants={itemVariants}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Live Mock Interviews</h3>
            <button
              onClick={() => navigate('/sessions')}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition cursor-pointer font-semibold"
            >
              Audit all
            </button>
          </div>
          <div className="space-y-3">
            {recentInterviews && recentInterviews.slice(0, 3).map((interview) => (
              <Card key={interview.id} hover onClick={() => navigate('/sessions')} className="p-4 border-zinc-800 bg-zinc-900/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">{interview.jobTitle}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">User: <strong className="text-zinc-400 font-semibold">{interview.username}</strong></p>
                  </div>
                  <span className="rounded-full border border-sky-900/50 bg-sky-950/20 px-2.5 py-0.5 text-[9px] font-black text-sky-400">
                    {interview.difficulty}
                  </span>
                </div>
              </Card>
            ))}
            {(!recentInterviews || recentInterviews.length === 0) && (
              <p className="text-xs text-zinc-500 py-4 text-center">No active mock interview logs registered.</p>
            )}
          </div>
        </motion.section>

        {/* Quizzes Activity List */}
        <motion.section variants={itemVariants}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Live Quiz Sessions</h3>
            <button
              onClick={() => navigate('/sessions')}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition cursor-pointer font-semibold"
            >
              Audit all
            </button>
          </div>
          <div className="space-y-3">
            {recentQuizzes && recentQuizzes.slice(0, 3).map((quiz) => (
              <Card key={quiz.id} hover onClick={() => navigate('/sessions')} className="p-4 border-zinc-800 bg-zinc-900/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">{quiz.topic}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">User: <strong className="text-zinc-400 font-semibold">{quiz.username}</strong></p>
                  </div>
                  <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2.5 py-0.5 text-[9px] font-black text-amber-400">
                    {quiz.difficulty}
                  </span>
                </div>
              </Card>
            ))}
            {(!recentQuizzes || recentQuizzes.length === 0) && (
              <p className="text-xs text-zinc-500 py-4 text-center">No active quiz logs registered.</p>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
