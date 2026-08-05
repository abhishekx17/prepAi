import React, { useState } from 'react';
import { useRouteError } from 'react-router';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home, ChevronRight, ChevronDown, Terminal } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

const ErrorPage = ({ error: propError }) => {
  const routerError = useRouteError();
  const [showDetails, setShowDetails] = useState(false);

  // Determine the error details
  const error = propError || routerError;
  const errorMessage = error?.statusText || error?.message || "An unexpected error occurred.";
  const errorStack = error?.stack || null;
  const statusCode = error?.status || (propError ? "System Crash" : "Render Error");

  const handleReset = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 flex flex-col relative overflow-hidden font-sans">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo onClick={handleReset} className="cursor-pointer" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="max-w-xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-zinc-800"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="mx-auto w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 mb-8 border border-red-150 dark:border-red-900/30"
            >
              <AlertCircle className="w-10 h-10" />
            </motion.div>

            {/* Error Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent"
            >
              Oops! Something went wrong
            </motion.h1>

            {/* Error Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-slate-500 dark:text-zinc-400 mb-8 text-sm sm:text-base leading-relaxed"
            >
              We encountered a glitch while processing this page ({statusCode}). Don't worry, your progress is safe. Try reloading or return home.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <button
                onClick={handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 px-6 py-3 font-semibold text-sm transition-all duration-200 cursor-pointer border border-slate-200/50 dark:border-zinc-700/50"
              >
                <Home className="h-4 w-4" />
                <span>Go Back Home</span>
              </button>
            </motion.div>

            {/* Developer Details Accordion */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="border-t border-slate-100 dark:border-zinc-850 pt-6 text-left"
              >
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>TECHNICAL DETAILS (DEVELOPER LOGS)</span>
                  </span>
                  {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/20 dark:border-zinc-800/80 font-mono text-xs overflow-x-auto text-red-650 dark:text-red-400 leading-relaxed max-h-48 overflow-y-auto"
                  >
                    <p className="font-bold mb-1">{errorMessage}</p>
                    {errorStack && <pre className="whitespace-pre text-[10px] opacity-80 mt-2">{errorStack}</pre>}
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-slate-400 dark:text-zinc-500 border-t border-slate-200/50 dark:border-zinc-900/50">
        <p>&copy; {new Date().getFullYear()} PrepAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ErrorPage;
