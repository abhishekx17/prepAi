import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingDots = ({ className = '' }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      className="h-1.5 w-1.5 rounded-full bg-zinc-400"
    />
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
      className="h-1.5 w-1.5 rounded-full bg-zinc-400"
    />
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.4 }}
      className="h-1.5 w-1.5 rounded-full bg-zinc-400"
    />
  </div>
);

export const LoadingRing = ({ size = 40 }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="absolute inset-0 rounded-full border border-zinc-800"
      style={{ borderTopColor: '#fafafa' }}
    />
    <div className="absolute inset-1.5 rounded-full border border-zinc-900/50" />
  </div>
);

export const GenerationProgress = ({ title, subtitle, steps, currentStep }) => (
  <section className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/10 p-8 text-center select-none">
    <LoadingRing size={48} />
    <h2 className="mt-6 text-base font-bold text-zinc-50">{title}</h2>
    {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}

    <div className="mt-8 w-full max-w-sm rounded-lg border border-zinc-850 bg-zinc-950/40 p-1.5 text-left">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const done = currentStep > stepNum;
        const active = currentStep === stepNum;

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`flex items-center gap-3 rounded-lg px-3.5 py-3 transition-colors ${
              active ? 'bg-zinc-900/60' : ''
            }`}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center">
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
              ) : active ? (
                <LoadingDots />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
              )}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                active || done ? 'text-zinc-200' : 'text-zinc-650'
              }`}
            >
              {step}
            </span>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default LoadingRing;
