import React from 'react';

export const Input = ({ icon: Icon, className = '', ...props }) => (
  <div className="relative w-full">
    {Icon && (
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
    )}
    <input
      className={`h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm text-slate-850 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-sky-500 dark:focus:border-sky-500 focus:bg-white dark:focus:bg-zinc-950/70 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition-all font-semibold ${
        Icon ? 'pl-9 pr-4' : 'px-3'
      } ${className}`}
      {...props}
    />
  </div>
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full resize-none rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 p-3 text-sm leading-relaxed text-slate-850 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-sky-500 dark:focus:border-sky-500 focus:bg-white dark:focus:bg-zinc-950/70 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition-all font-semibold ${className}`}
    {...props}
  />
);

export const Select = ({ className = '', children, ...props }) => (
  <select
    className={`h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 px-3 text-sm text-slate-850 dark:text-zinc-100 focus:border-sky-500 dark:focus:border-sky-500 focus:bg-white dark:focus:bg-zinc-950/70 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition-all cursor-pointer font-semibold ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const FieldLabel = ({ htmlFor, children, optional }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-xs font-bold text-slate-700 dark:text-zinc-300 select-none">
    <span className="flex items-center gap-1.5">
      {children}
      {optional && <span className="text-slate-400 dark:text-zinc-600 font-normal">(optional)</span>}
    </span>
  </label>
);

export default Input;
