import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  ArrowRight, 
  FileSearch, 
  MessageSquare, 
  ClipboardCheck, 
  CheckCircle2, 
  Menu, 
  X,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Users,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/hooks/useAuth';

const KEYWORDS = ["technical interviews", "system design", "coding quizzes", "behavioral rounds"];

const FAQS = [
  {
    q: "How does the AI analyze my resume?",
    a: "We parse the text from your PDF or TXT resume and cross-reference it directly against your target job description. The AI analyzes skill relevance, identifies critical gaps, and outputs a compatibility match rating."
  },
  {
    q: "Can I customize the focus and difficulty of mock interviews?",
    a: "Absolutely. You can choose Junior, Mid, or Senior difficulty levels and pick custom focus areas like 'Coding Heavy', 'System Design', or 'Behavioral Focus' depending on your upcoming loops."
  },
  {
    q: "Is my personal data kept secure?",
    a: "Yes. All resumes, job descriptions, chat transcripts, and evaluation metrics are linked exclusively to your private account. We never share your data or use it to train public algorithms."
  },
  {
    q: "How are the technical quizzes generated?",
    a: "Quizzes are built on-the-fly based on the technical topic, difficulty, and count you request. Each question includes a thorough answer explanation and distractor feedback."
  }
];

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [activeDemoTab, setActiveDemoTab] = useState('resume');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'light'; // default light theme
  });

  // Cycle keywords in Hero
  useEffect(() => {
    const interval = setInterval(() => {
      setKeywordIndex(prev => (prev + 1) % KEYWORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Modern subtle animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300 font-sans selection:bg-sky-100 dark:selection:bg-sky-900 selection:text-sky-900 dark:selection:text-sky-100">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-200 dark:border-sky-800/50 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 group-hover:border-sky-500 transition-colors duration-300">
              <Sparkles className="h-4.5 w-4.5" strokeWidth={2} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
              PrepAI
            </span>
          </Link>

          {/* Desktop Navigation Link items */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Features
            </a>
            <a href="#playground" className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Playground
            </a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              FAQs
            </a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-4.5 w-4.5" strokeWidth={2} />
              ) : (
                <Sun className="h-4.5 w-4.5" strokeWidth={2} />
              )}
            </button>

            {/* Dynamic CTA */}
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-5 text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer hover:shadow-sky-500/10"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-5 text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions Hamburger & Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 px-4 py-6 z-40 space-y-4 shadow-lg transition-colors duration-300"
          >
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400"
              >
                Features
              </a>
              <a
                href="#playground"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400"
              >
                Playground
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400"
              >
                FAQs
              </a>
            </nav>
            <div className="border-t border-slate-100 dark:border-zinc-900 pt-4 flex flex-col gap-3">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="flex w-full h-10 items-center justify-center rounded-xl bg-sky-600 text-white text-sm font-semibold cursor-pointer"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-full items-center justify-center rounded-xl bg-sky-600 text-white text-sm font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Split Layout */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Headline, Subtitle, & CTAs */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 flex flex-col items-start text-left"
            >
              {/* Tagline Pill */}
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/20 px-3.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 select-none mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                Elevate Your Technical Prep
              </motion.div>

              {/* Headline with Text Rotator */}
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.15]"
              >
                Prepare for your next
                <span className="block text-sky-600 dark:text-sky-400 mt-2 min-h-[1.25em]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={keywordIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="inline-block"
                    >
                      {KEYWORDS[keywordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                variants={itemVariants}
                className="mt-6 text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-medium"
              >
                Bridge skill gaps through personalized resume analysis, real-world mock interview simulations, and adaptive technical quizzes. Completely private, intelligent, and optimized for developers.
              </motion.p>

              {/* Actions */}
              <motion.div 
                variants={itemVariants}
                className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <button
                  onClick={handleCTA}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-8 text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer hover:shadow-sky-500/15"
                >
                  {user ? 'Go to Dashboard' : 'Get Started For Free'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                
                <a
                  href="#playground"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 px-8 text-sm font-semibold transition-colors duration-200"
                >
                  Try Interactive Demo
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column: Floating Visual Cards Stack */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              <div className="w-full max-w-md space-y-6 relative z-10 py-4 select-none">
                
                {/* Float Card 1: Resume Scorer Mock */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 dark:border-sky-950 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400">
                      <FileSearch className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">Resume Match Rating</h4>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Senior Backend Engineer role</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">87%</span>
                    <span className="block text-[8px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">High Match</span>
                  </div>
                </motion.div>

                {/* Float Card 2: AI Dialog Mock */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md space-y-3.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4.5 w-4.5 text-sky-600 dark:text-sky-400" />
                      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Mock Simulator</span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-3 text-[11px] font-medium leading-relaxed">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border border-slate-100 dark:border-zinc-900">
                      "Explain the difference between optimistic and pessimistic locking in relational databases."
                    </div>
                    <div className="p-3 rounded-xl bg-sky-600 text-white text-right">
                      "Optimistic locking assumes low conflict, checking versions before write. Pessimistic locking locks the records immediately..."
                    </div>
                  </div>
                </motion.div>

                {/* Float Card 3: Quiz Score Card */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.2 }}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">Adaptive SQL Quiz</h4>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Difficulty: Hard</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 dark:text-white">9 / 10</span>
                    <span className="block text-[8px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">Finished</span>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Interactive Playground Demo Section (Long extension) */}
      <section id="playground" className="py-20 sm:py-28 bg-white dark:bg-zinc-900 border-t border-b border-slate-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
              See how it works
            </h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
              Click the tabs below to preview the core functionalities of the PrepAI dashboard.
            </p>
          </div>

          {/* Playground container */}
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 p-4 sm:p-6 transition-colors duration-300">
            
            {/* Demo Tabs */}
            <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200 dark:border-zinc-900 select-none">
              <button
                onClick={() => setActiveDemoTab('resume')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  activeDemoTab === 'resume'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-sky-600'
                }`}
              >
                <FileSearch className="h-4 w-4" />
                Resume Analysis
              </button>
              <button
                onClick={() => setActiveDemoTab('interview')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  activeDemoTab === 'interview'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-sky-600'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Mock Simulator
              </button>
              <button
                onClick={() => setActiveDemoTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  activeDemoTab === 'quiz'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-sky-600'
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                Topic Quizzes
              </button>
            </div>

            {/* Demo Contents */}
            <div className="pt-6 min-h-[300px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeDemoTab === 'resume' && (
                  <motion.div
                    key="resume-demo"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Review Complete
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Match Review: Senior Frontend Engineer</h4>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                          The resume shows robust experiences in React architectures and state management. However, missing database indexing exposure and CI/CD pipelines limits ideal alignment.
                        </p>
                        <div className="space-y-2 pt-2 text-xs font-medium">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-4 w-4 shrink-0" />
                            <span>Found relevant experience in React, Vite, Framer Motion</span>
                          </div>
                          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <Info className="h-4 w-4 shrink-0" />
                            <span>Lacks specific references to performance testing frameworks</span>
                          </div>
                        </div>
                      </div>

                      {/* Scorer circle mockup */}
                      <div className="flex flex-col items-center justify-center p-6 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shrink-0 w-full sm:w-48 text-center">
                        <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Match rating</span>
                        <span className="text-5xl font-extrabold text-sky-600 dark:text-sky-400 mt-2">87%</span>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold mt-1">High compatibility</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeDemoTab === 'interview' && (
                  <motion.div
                    key="interview-demo"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40 text-[10px] font-bold px-2 py-0.5 rounded-md select-none">
                      Active AI Simulator
                    </div>
                    <div className="space-y-3.5 text-xs max-w-3xl">
                      {/* Dialog bubble 1 */}
                      <div className="flex gap-3">
                        <div className="h-7 w-7 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0 border border-sky-200/50">
                          AI
                        </div>
                        <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl leading-relaxed text-slate-800 dark:text-zinc-200 font-medium">
                          Explain how you would design a rate limiter for a high-traffic public API. Which algorithm is best, and why?
                        </div>
                      </div>
                      
                      {/* Dialog bubble 2 */}
                      <div className="flex gap-3 justify-end">
                        <div className="p-3 bg-sky-600 text-white rounded-xl leading-relaxed font-medium">
                          I'd use the Token Bucket algorithm. It's space-efficient and handles bursts of traffic smoothly. We can store token balances in a fast-access store like Redis to support distributed architectures.
                        </div>
                        <div className="h-7 w-7 rounded-full bg-slate-300 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                          Me
                        </div>
                      </div>

                      {/* Dialog bubble 3 */}
                      <div className="flex gap-3">
                        <div className="h-7 w-7 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0 border border-sky-200/50">
                          AI
                        </div>
                        <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl leading-relaxed text-slate-800 dark:text-zinc-200 font-medium">
                          Correct. How would you prevent race conditions in Redis when updating token capacities from multiple concurrent API calls?
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeDemoTab === 'quiz' && (
                  <motion.div
                    key="quiz-demo"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 text-[10px] font-bold px-2 py-0.5 rounded-md select-none">
                      Dynamic Quiz Item
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                        Question: Which implementation is best suited for building a Least Recently Used (LRU) cache with O(1) operations?
                      </p>
                      
                      {/* MCQ choices */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs select-none">
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 font-semibold flex items-center">
                          A. Binary Search Tree
                        </div>
                        <div className="p-3 rounded-xl border border-emerald-500 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center">
                          B. Hash Map + Doubly Linked List (Correct)
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 font-semibold flex items-center">
                          C. Sorted Array list
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 font-semibold flex items-center">
                          D. Stack using pointer lists
                        </div>
                      </div>

                      {/* Explanation panel */}
                      <div className="p-3 bg-sky-50/40 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/30 rounded-xl text-[11px] leading-relaxed text-slate-700 dark:text-zinc-400 font-medium">
                        <strong>Explanation:</strong> Doubly Linked Lists allow O(1) insertions/deletions at ends, while Hash Maps provide O(1) key-to-node mapping. Together they deliver O(1) cache access.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action trigger */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-900 flex justify-end">
                <button
                  onClick={handleCTA}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 cursor-pointer"
                >
                  Start preparing this way
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
              Everything you need to land the offer
            </h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
              We focus on structure, feedback, and repetition. PrepAI is designed to give you direct insights with zero fluff.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Resume Analysis */}
            <div className="group rounded-2xl border border-slate-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-8 hover:border-sky-500 dark:hover:border-sky-500/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-100 dark:border-sky-950 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                <FileSearch className="h-5.5 w-5.5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-zinc-50">
                Resume Match Analysis
              </h3>
              <p className="mt-3.5 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Upload your resume alongside target job descriptions. Extract exact skill mismatch gaps, structural issues, and get detailed matching score reviews.
              </p>
            </div>

            {/* Feature 2: Mock Interview Simulator */}
            <div className="group rounded-2xl border border-slate-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-8 hover:border-sky-500 dark:hover:border-sky-500/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-100 dark:border-sky-950 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                <MessageSquare className="h-5.5 w-5.5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-zinc-50">
                Real-Time AI Mock Arena
              </h3>
              <p className="mt-3.5 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Answer interactive, tailored technical questions. The AI adapts mock parameters based on the specific job description and dynamically scores your speech patterns.
              </p>
            </div>

            {/* Feature 3: Skills Assessment Quiz */}
            <div className="group rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 hover:border-sky-500 dark:hover:border-sky-500/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-100 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                <ClipboardCheck className="h-5.5 w-5.5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-zinc-50">
                Custom Skill Assessments
              </h3>
              <p className="mt-3.5 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Enter any coding topic, language, or system design standard. Generate multiple choice assessments, complete with thorough answers and explanation docs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white dark:bg-zinc-900 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
              Three steps to confidence
            </h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
              We streamline the prep workflow, saving you hours of searching for random question pools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-sm border border-sky-200/50 dark:border-sky-800/40">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Import Profile</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium max-w-xs">
                Upload your resume file and specify target job information to anchor your prep focus.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-sm border border-sky-200/50 dark:border-sky-800/40">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Practice Interactively</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium max-w-xs">
                Go through real-time simulator rounds or tackle technical quiz modules at your own pace.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 font-bold text-sm border border-sky-200/50 dark:border-sky-800/40">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Bridge the Gap</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium max-w-xs">
                Review scores, read step-by-step explanations, modify areas of concern, and repeat.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Pricing Section (Long extension) */}
      <section id="pricing" className="py-20 sm:py-28 bg-slate-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
              Choose the plan that matches your current preparation timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Free plan */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col justify-between hover:border-sky-500/50 transition-colors duration-350">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Free Tier</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 font-medium">Essentials to get you started</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-zinc-50">$0</span>
                  <span className="text-xs text-slate-500 font-bold uppercase">forever</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>5 Resume compatibility reviews</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>1 Complete AI mock session</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>3 Technical skill quizzes</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleCTA}
                className="mt-8 w-full h-10 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-zinc-950 font-bold text-xs text-slate-800 dark:text-zinc-300 cursor-pointer"
              >
                Sign Up Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-sky-500 dark:border-sky-500 rounded-2xl p-8 flex flex-col justify-between relative shadow-sm">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-sky-600 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 select-none">
                Most Popular
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-200">Pro Prep</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 font-medium">Everything needed to land a role</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-zinc-50">$19</span>
                  <span className="text-xs text-slate-500 font-bold uppercase">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Unlimited Resume analyses</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Unlimited Mock Arena simulations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Comprehensive customized quizzes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Detailed feedback explanations</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleCTA}
                className="mt-8 w-full h-10 inline-flex items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer"
              >
                Go Pro Now
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col justify-between hover:border-sky-500/50 transition-colors duration-350">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Enterprise</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 font-medium">For schools, bootcamps and teams</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-zinc-50">Custom</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Custom mock loop templates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Team admin dashboard panels</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>API keys for custom pipelines</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleCTA}
                className="mt-8 w-full h-10 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-zinc-950 font-bold text-xs text-slate-800 dark:text-zinc-300 cursor-pointer"
              >
                Contact Sales
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="stats" className="py-20 sm:py-28 bg-white dark:bg-zinc-900 border-t border-b border-slate-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-600 dark:text-sky-400">12k+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reports Created</div>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-600 dark:text-sky-400">88%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pass Rate Increase</div>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-600 dark:text-sky-400">45k+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions Solved</div>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-600 dark:text-sky-400">15+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tech Domains</div>
            </div>

          </div>

        </div>
      </section>

      {/* Accordion FAQs Section (Long extension) */}
      <section id="faq" className="py-20 sm:py-28 bg-slate-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
              Quick answers to common questions about PrepAI.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-zinc-100 text-xs sm:text-sm cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 text-slate-400 dark:text-zinc-500 transition-transform duration-220 ${
                        isOpen ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-zinc-400 font-medium leading-relaxed border-t border-slate-50 dark:border-zinc-950">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
            Ready to prepare with absolute clarity?
          </h2>
          <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
            Join developers building consistent practice habits and bridging skill gaps with AI insights.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleCTA}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-8 text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900 py-12 transition-colors duration-300 select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/50">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-zinc-50">PrepAI</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            &copy; 2026 PrepAI Inc. All rights reserved. Built for developers.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
