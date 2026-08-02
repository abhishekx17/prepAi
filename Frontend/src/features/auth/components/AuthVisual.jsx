import React from 'react';
import { FileSearch, MessageSquare, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../../../components/ui/Logo';

const features = [
  { icon: FileSearch, label: 'Resume analysis' },
  { icon: MessageSquare, label: 'Mock interviews' },
  { icon: ClipboardCheck, label: 'Skill quizzes' },
];

const AuthVisual = ({
  title = 'Your interview preparation workspace.',
  subtitle = 'Analyze roles, practice with AI-led interviews, and track progress — all in one focused environment.',
}) => (
  <section className="relative flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/10 p-8 lg:p-10 select-none">
    {/* Animated background grid */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#71717a" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Orbiting rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="absolute left-1/2 top-[38%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-850"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute left-1/2 top-[38%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-900"
      />

      {/* Center node */}
      <div className="absolute left-1/2 top-[38%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 shadow-md">
        <Logo size="lg" iconOnly={true} />
      </div>

      {/* Floating feature pills */}
      {features.map((item, i) => {
        const Icon = item.icon;
        const positions = [
          'left-[6%] top-[20%]',
          'right-[6%] top-[45%]',
          'left-[10%] bottom-[20%]',
        ];
        return (
          <motion.div
            key={item.label}
            animate={{ y: [0, -4, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
            className={`absolute flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 shadow-sm ${positions[i]}`}
          >
            <Icon className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.5} />
            <span className="text-[10px] font-bold text-zinc-400">{item.label}</span>
          </motion.div>
        );
      })}
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-1 flex-col justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200">
          <Logo size="sm" iconOnly={true} />
        </div>
        <div>
          <p className="text-xs font-bold tracking-tight text-zinc-50 leading-none">PrepAI</p>
          <p className="text-[9px] font-medium text-zinc-500 mt-1 select-none">Interview workspace</p>
        </div>
      </div>

      <div className="pt-24 mt-auto">
        <h1 className="max-w-xs text-xl font-bold leading-snug tracking-tight text-zinc-50 lg:text-2xl select-text">
          {title}
        </h1>
        <p className="mt-2.5 max-w-xs text-xs leading-relaxed text-zinc-500 select-text">{subtitle}</p>

        <div className="mt-6 flex gap-6 border-t border-zinc-850 pt-5">
          {[
            { value: '3', label: 'Core tools' },
            { value: 'AI', label: 'Analysis engines' },
            { value: 'Secure', label: 'Workspace' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs font-bold text-zinc-300 font-mono">{stat.value}</p>
              <p className="mt-1 text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AuthVisual;
