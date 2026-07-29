import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ className = '', children, hover = false, onClick, ...props }) => {
  const Tag = onClick ? motion.button : motion.div;
  
  const motionProps = onClick || hover
    ? {
        whileHover: { scale: 1.005 },
        whileTap: onClick ? { scale: 0.995 } : {},
        transition: { duration: 0.15 },
      }
    : {};

  return (
    <Tag
      className={`rounded-2xl border border-white/10 bg-white/[0.045] text-left shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-sm ${
        hover || onClick
          ? 'hover:border-white/20 hover:bg-white/[0.07] cursor-pointer'
          : ''
      } transition-colors ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Tag>
  );
};

export const CardHeader = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between select-none">
    <div className="flex items-start gap-4">
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-950/70 text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
        </div>
      )}
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-zinc-50">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400">{description}</p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0 sm:pt-0.5">{action}</div>}
  </div>
);

export default Card;
