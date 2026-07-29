import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FileSearch,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../../../components/ui/Card';

const FEATURE_CARDS = [
  {
    id: 'analyze',
    icon: FileSearch,
    title: 'Resume Analysis',
    description: 'Compare your resume with a target role and get gaps, match score, and next steps.',
    cta: 'Analyze',
    accent: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/40',
  },
  {
    id: 'mock',
    icon: MessageSquare,
    title: 'Mock Interview',
    description: 'Create a role-specific interview flow for coding, design, or behavioral practice.',
    cta: 'Practice',
    accent: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/20 border-fuchsia-200 dark:border-fuchsia-800/40',
  },
  {
    id: 'quiz',
    icon: ClipboardCheck,
    title: 'Skill Quiz',
    description: 'Generate focused MCQs on any technical topic with explanations after grading.',
    cta: 'Quiz',
    accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40',
  },
];

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
    cyan: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/40',
    pink: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/20 border-fuchsia-200 dark:border-fuchsia-800/40',
    green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40',
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-zinc-50">
            <AnimatedCounter value={value} />
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-zinc-500">{detail}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${toneClasses[tone]}`}>
          <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
        </div>
      </div>
    </Card>
  );
};

const OverviewView = ({
  username,
  reports,
  interviews,
  quizHistory,
  averageReportScore,
  onSelectFeature,
  onNavigateReport,
}) => {
  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const avgQuizScore =
    quizHistory.length === 0
      ? 0
      : Math.round(
          (quizHistory.reduce((s, q) => s + (q.score || 0) / (q.numQuestions || 1), 0) /
            quizHistory.length) *
            100
        );

  const checklist = [
    { label: 'Analyze a resume against a target role', done: reports.length > 0 },
    { label: 'Complete a mock interview session', done: completedInterviews.length > 0 },
    { label: 'Take a technical skill quiz', done: quizHistory.length > 0 },
    { label: 'Reach 70% average quiz accuracy', done: avgQuizScore >= 70 },
  ];
  const completedMilestones = checklist.filter((item) => item.done).length;
  const completionPercent = Math.round((completedMilestones / checklist.length) * 100);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
      
      {/* Cockpit Intro section */}
      <motion.section
        variants={itemVariants}
        className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.045] shadow-sm dark:shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm"
      >
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-7">
          <div className="flex min-h-56 flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 dark:border-sky-800/20 bg-sky-50 dark:bg-sky-950/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.7} />
                Preparation cockpit
              </div>
              <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
                Welcome back{username ? `, ${username}` : ''}.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-zinc-400">
                Keep your resume, interview reps, and skill checks in one calm workspace built for focused preparation.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onSelectFeature('analyze')}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-4 text-sm font-bold shadow-sm cursor-pointer"
              >
                Start analysis
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => onSelectFeature('recent')}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.055] px-4 text-sm font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-white/[0.09] cursor-pointer"
              >
                View history
              </button>
            </div>
          </div>

          <div className="grid content-end gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/55 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Milestone progress</p>
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-zinc-50">{completionPercent}%</p>
                </div>
                <Award className="h-6 w-6 text-amber-500 dark:text-amber-250" strokeWidth={1.5} />
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-white/8">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
            
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/55 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Next best action</p>
              <p className="mt-2 text-sm font-bold text-slate-850 dark:text-zinc-100">
                {reports.length === 0
                  ? 'Analyze your first resume'
                  : completedInterviews.length === 0
                    ? 'Run a mock interview'
                    : quizHistory.length === 0
                      ? 'Take a focused quiz'
                      : 'Review recent results'}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-500">
                The dashboard adapts as you build more preparation history.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Counter tiles */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Avg. match" value={`${averageReportScore}%`} detail="Across resume reports" icon={FileSearch} tone="cyan" />
        <StatTile label="Reports" value={reports.length} detail="Generated analyses" icon={FileSearch} tone="pink" />
        <StatTile label="Interviews" value={completedInterviews.length} detail="Completed sessions" icon={MessageSquare} tone="green" />
        <StatTile label="Quiz accuracy" value={`${avgQuizScore}%`} detail="Average score" icon={ClipboardCheck} tone="amber" />
      </motion.div>

      {/* Main Checklist / Launch items */}
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        
        <motion.div variants={itemVariants}>
          <Card className="h-full p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Milestones</p>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-zinc-50">Preparation checklist</h3>
              </div>
              <span className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] px-3 py-1 text-xs font-bold text-slate-600 dark:text-zinc-300">
                {completedMilestones}/{checklist.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-zinc-950/35 p-3">
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-200" strokeWidth={1.6} />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-zinc-600" strokeWidth={1.6} />
                  )}
                  <span className={`text-xs leading-5 ${item.done ? 'text-slate-400 dark:text-zinc-500 line-through' : 'font-semibold text-slate-700 dark:text-zinc-200'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Launch tools</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.id}
                  hover
                  onClick={() => onSelectFeature(feature.id)}
                  className="flex min-h-52 flex-col justify-between p-5"
                >
                  <div>
                    <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border ${feature.accent}`}>
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-50">{feature.title}</h4>
                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-zinc-500">{feature.description}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-zinc-300">
                    {feature.cta}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />
                  </span>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent reports list */}
      {reports.length > 0 && (
        <motion.section variants={itemVariants}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Recent reports</h3>
            <button
              type="button"
              onClick={() => onSelectFeature('recent')}
              className="text-xs font-bold text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              View all
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {reports.slice(0, 3).map((report) => (
              <Card key={report._id} hover onClick={() => onNavigateReport(report._id)} className="p-4">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-zinc-100">
                  {report.jobTitle || 'Compatibility Report'}
                </p>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-400 dark:text-zinc-550">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                      : 'Recent'}
                  </span>
                  <span className="rounded-full border border-sky-100 dark:border-sky-900/50 bg-sky-50 dark:bg-sky-950/20 px-2.5 py-1 text-[10px] font-black text-sky-600 dark:text-sky-400">
                    {report.matchScore || 0}% match
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>
      )}

    </motion.div>
  );
};

export default OverviewView;
