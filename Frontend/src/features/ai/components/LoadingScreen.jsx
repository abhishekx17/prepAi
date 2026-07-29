import React from 'react';
import { LoadingDots, LoadingRing } from '../../../components/ui/AnimatedLoader';

const LoadingScreen = ({ message = 'Preparing workspace' }) => (
  <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
    <section className="flex w-full max-w-xs flex-col items-center select-none">
      <LoadingRing size={44} />
      <LoadingDots className="mt-5" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">{message}</p>
      <p className="mt-1 text-[11px] text-zinc-650">Please wait a moment</p>
    </section>
  </main>
);

export default LoadingScreen;
