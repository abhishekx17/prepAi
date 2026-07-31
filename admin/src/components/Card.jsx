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
      className={`rounded-lg border border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-sm backdrop-blur-sm ${
        hover || onClick
          ? 'hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer'
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
  <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-start sm:justify-between select-none">
    <div className="flex items-start gap-4">
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/70 text-indigo-400 shadow-sm">
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
