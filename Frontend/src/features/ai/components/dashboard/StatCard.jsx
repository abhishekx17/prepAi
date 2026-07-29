import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ icon: Icon, label, value, hint }) => (
  <motion.div
    whileHover={{ y: -1 }}
    transition={{ duration: 0.15 }}
    className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 select-none"
  >
    <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-850 bg-zinc-950 text-zinc-400">
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </div>
    <p className="text-2xl font-bold tracking-tight text-zinc-50">{value}</p>
    <p className="mt-0.5 text-xs font-semibold text-zinc-400">{label}</p>
    {hint && <p className="mt-2 text-[10px] font-medium text-zinc-500">{hint}</p>}
  </motion.div>
);

export default StatCard;
