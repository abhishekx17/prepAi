import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 
    'border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 dark:border-blue-500/20 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 shadow-sm',
  secondary: 
    'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.055] dark:text-zinc-300 dark:hover:bg-white/[0.09] dark:hover:border-white/20 dark:hover:text-zinc-50 shadow-sm',
  ghost: 
    'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-white/[0.06]',
  danger: 
    'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700 dark:border-red-950/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:text-red-300 dark:hover:border-red-900/30 dark:hover:bg-red-950/40 shadow-sm',
};

const sizes = {
  sm: 'h-8.5 px-3 text-xs gap-1.5 rounded-xl font-bold',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl font-bold',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl font-bold',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-bold tracking-tight cursor-pointer whitespace-nowrap transition-colors disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
