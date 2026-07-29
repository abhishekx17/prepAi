import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const Alert = ({ type = 'error', children }) => {
  const isError = type === 'error';
  const Icon = isError ? AlertTriangle : CheckCircle2;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm transition-all leading-normal ${
        isError
          ? 'border-red-950/50 bg-red-950/10 text-red-450'
          : 'border-zinc-800 bg-zinc-900/20 text-zinc-300'
      }`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${isError ? 'text-red-400' : 'text-zinc-400'}`} strokeWidth={1.5} />
      <span className="flex-1">{children}</span>
    </div>
  );
};

export default Alert;
