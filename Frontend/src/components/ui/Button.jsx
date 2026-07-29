import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'border border-cyan-200/40 bg-cyan-100 text-zinc-950 hover:bg-white shadow-[0_0_28px_rgba(103,232,249,0.16)]',
  secondary: 'border border-white/10 bg-white/[0.055] text-zinc-200 hover:bg-white/[0.09] hover:border-white/20 hover:text-zinc-50',
  ghost: 'text-zinc-400 hover:text-zinc-50 hover:bg-white/[0.06]',
  danger: 'border border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-red-300 hover:border-red-400/30 hover:bg-red-500/10',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md font-medium',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg font-medium',
  lg: 'h-11 px-5 text-sm gap-2 rounded-lg font-semibold',
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
      className={`inline-flex items-center justify-center font-medium cursor-pointer whitespace-nowrap transition-colors disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
