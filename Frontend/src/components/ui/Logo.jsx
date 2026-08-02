import React from 'react';

export function Logo({
  size = 'md',
  showText = true,
  iconOnly = false,
  variant = 'blue', // 'blue' | 'dark' | 'none'
  textClassName = '',
  containerClassName = '',
  onClick,
}) {
  // Sizing configurations
  const sizeMap = {
    xs: {
      box: 'h-6 w-6 rounded-md',
      icon: 14,
      text: 'text-xs',
    },
    sm: {
      box: 'h-7 w-7 rounded-lg',
      icon: 16,
      text: 'text-xs',
    },
    md: {
      box: 'h-9 w-9 rounded-xl',
      icon: 20,
      text: 'text-base',
    },
    lg: {
      box: 'h-11 w-11 rounded-2xl',
      icon: 24,
      text: 'text-lg',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Render style variant for the icon box
  const variantStyles = {
    blue: 'border border-blue-200/60 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400',
    dark: 'border-2 border-slate-900 dark:border-zinc-100 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900',
    none: 'border-0 bg-transparent',
  };

  const svgContent = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none transition-transform duration-200 group-hover:scale-105"
    >
      <defs>
        <linearGradient id="logo-p-grad" x1="7" y1="3" x2="26" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="logo-spark-grad" x1="14" y1="7" x2="19" y2="13" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {/* Chat bubble tail */}
      <path d="M12 18L8 22H14Z" fill="url(#logo-p-grad)" />
      {/* P shape with cutout (evenodd fill rule) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 3H18A8 8 0 0 1 26 11A8 8 0 0 1 18 19H11V29A1 1 0 0 1 10 30H8A1 1 0 0 1 7 29V3ZM11 7V15H18A4 4 0 0 0 22 11A4 4 0 0 0 18 7H11Z"
        fill="url(#logo-p-grad)"
      />
      {/* AI Spark (Central) */}
      <path
        d="M16.5 8.5C16.5 10 17.3 11 19 11C17.3 11 16.5 12 16.5 13.5C16.5 12 15.7 11 14 11C15.7 11 16.5 10 16.5 8.5Z"
        fill="url(#logo-spark-grad)"
      />
      {/* Small Spark (Top Right) */}
      <path
        d="M25.5 3C25.5 4 26.1 4.7 27.2 4.7C26.1 4.7 25.5 5.4 25.5 6.4C25.5 5.4 24.9 4.7 23.8 4.7C24.9 4.7 25.5 4 25.5 3Z"
        fill="#06B6D4"
      />
    </svg>
  );

  if (iconOnly) {
    return svgContent;
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${containerClassName}`}
    >
      {/* Logo Icon Box */}
      <div
        className={`flex items-center justify-center shrink-0 transition-all duration-300 ${variantStyles[variant] || variantStyles.blue} ${currentSize.box}`}
      >
        {svgContent}
      </div>

      {/* Brand Text */}
      {showText && (
        <span
          className={`font-bold font-display tracking-tight text-slate-900 dark:text-zinc-50 ${currentSize.text} ${textClassName}`}
        >
          PrepAI
        </span>
      )}
    </div>
  );
}

export default Logo;
