import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ className = '', children, hover = false, onClick, ...props }) => {
  const Tag = onClick ? motion.button : motion.div;
  
  const motionProps = onClick || hover
    ? {
        whileHover: { y: -4, scale: 1.01 },
        whileTap: onClick ? { scale: 0.99 } : {},
        transition: { duration: 0.2, ease: "easeOut" },
      }
    : {};

  return (
    <Tag
      className={`rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 text-slate-850 dark:text-zinc-100 shadow-sm dark:shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-sm ${
        hover || onClick
          ? 'hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer'
          : ''
      } transition-all ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Tag>
  );
};

export const CardHeader = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-zinc-800/80 pb-5 sm:flex-row sm:items-start sm:justify-between select-none">
    <div className="flex items-start gap-4">
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/70 text-sky-600 dark:text-sky-400 shadow-sm">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
        </div>
      )}
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0 sm:pt-0.5">{action}</div>}
  </div>
);

export default Card;
