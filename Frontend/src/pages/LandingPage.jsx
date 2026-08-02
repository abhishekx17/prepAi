import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  FileText,
  MessageSquare,
  ClipboardCheck,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Users,
  Check,
  ChevronDown,
  Info,
  Star,
  Shield,
  Clock,
  Layers,
  ArrowUpRight,
  Play
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useAuth } from '../features/auth/hooks/useAuth';

// Monochrome company logos for the marquee strip
const LOGOS = [
  { name: 'Google', svg: <svg className="h-6 w-auto fill-current" viewBox="0 0 24 24"><path d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.13-5.136 4.13A5.85 5.85 0 018.1 11.7a5.85 5.85 0 015.89-5.83 5.7 5.7 0 014.07 1.7l2.45-2.42A8.91 8.91 0 0013.99 2.5a9.01 9.01 0 00-9 9 9.01 9.01 0 009 9c5.07 0 8.35-3.56 8.35-8.47 0-.58-.05-1.12-.15-1.748H12.24z"/></svg> },
  { name: 'Meta', svg: <svg className="h-6 w-auto fill-current" viewBox="0 0 24 24"><path d="M22.84 10.74c-.11-.53-.45-1-.95-1.32a6.38 6.38 0 00-3.32-.88 6.43 6.43 0 00-3.35.88c-.62.4-1.1.96-1.38 1.63-.3-.67-.78-1.23-1.4-1.63a6.43 6.43 0 00-3.35-.88 6.38 6.38 0 00-3.32.88c-.5.32-.84.79-.95 1.32-.12.58-.02 1.2.29 1.76a4 4 0 001.35 1.39 6.22 6.22 0 003 1.07V15a4.23 4.23 0 01-1.92-.76c-.46-.35-.78-.83-.87-1.38s.02-1.12.31-1.63c.27-.47.67-.84 1.13-1.07s.98-.34 1.5-.34 1 .11 1.46.34a2.82 2.82 0 011.13 1.07c.29.51.4 1.08.31 1.63s-.41 1-.87 1.38A4.23 4.23 0 0111 15v.06a6.22 6.22 0 003-1.07 4 4 0 001.35-1.39c.31-.56.41-1.18.29-1.76zM1.16 10.74c-.11-.53-.45-1-.95-1.32A6.38 6.38 0 000 8.54a6.43 6.43 0 000 .88c-.12.58-.02 1.2.29 1.76a4 4 0 001.35 1.39 6.22 6.22 0 003 1.07V15A4.23 4.23 0 012.72 14.24c-.46-.35-.78-.83-.87-1.38s.02-1.12.31-1.63c.27-.47.67-.84 1.13-1.07S4.27 10 4.79 10s1 .11 1.46.34a2.82 2.82 0 011.13 1.07c.29.51.4 1.08.31 1.63s-.41 1-.87 1.38A4.23 4.23 0 016.14 15.06a6.22 6.22 0 003-1.07 4 4 0 001.35-1.39c.31-.56.41-1.18.29-1.76z"/></svg> },
  { name: 'Stripe', svg: <svg className="h-6 w-auto fill-current" viewBox="0 0 24 24"><path d="M13.93 7.84c0-.98.77-1.42 2.05-1.42 1.28 0 2.29.39 2.92.74l.43-2.31c-.65-.33-1.85-.68-3.41-.68-3.32 0-5.32 1.77-5.32 4.75 0 3.2 2.84 3.73 4.14 4.12 1.3.39 1.76.68 1.76 1.28 0 .8-.8 1.29-2.07 1.29-1.63 0-2.8-.57-3.48-.96l-.47 2.37c.78.43 2.18.84 3.93.84 3.4 0 5.48-1.75 5.48-4.7 0-3.31-2.92-3.87-4.14-4.22-1.22-.35-1.82-.67-1.82-1.1zm-8.87-.2c0-.52.42-.91.95-.91.53 0 .95.39.95.91s-.42.91-.95.91c-.53 0-.95-.39-.95-.91zm2.34 2.82v8.52h-2.73v-8.52h2.73zm13.11.19h-2.74v8.52h2.74V10.65z"/></svg> },
  { name: 'Vercel', svg: <svg className="h-5 w-auto fill-current" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z"/></svg> },
  { name: 'Netflix', svg: <svg className="h-5.5 w-auto fill-current" viewBox="0 0 24 24"><path d="M5.61 22.8c-.28 0-.53-.16-.64-.42l-.02-.04C4.1 20.3 3 18.25 2 16.2L2 2h2.75v12.2l1.64 3.4c.05.11.13.18.25.18h.04c.12 0 .2-.07.25-.18l1.64-3.4V2h2.75l.02.04 1.28 2.65L12 2.65V22.8H9.25V10.6l-1.64-3.4a.27.27 0 00-.25-.18h-.04a.27.27 0 00-.25.18l-1.64 3.4V22.8H5.61z"/></svg> },
  { name: 'Slack', svg: <svg className="h-5.5 w-auto fill-current" viewBox="0 0 24 24"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.043zm2.52-6.342a2.528 2.528 0 0 1-2.52-2.52 2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.523 2.522v2.52h-2.523zm0 1.261a2.528 2.528 0 0 1 2.523 2.52v5.043a2.528 2.528 0 0 1-2.523 2.52H3.782a2.528 2.528 0 0 1-2.52-2.52V12.6a2.528 2.528 0 0 1 2.52-2.52h5.043zm6.342-2.52a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zm-1.261 0a2.528 2.528 0 0 1-2.52 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52V3.782a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-2.52 6.342a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.523-2.522v-2.52h2.523zm0-1.261a2.528 2.528 0 0 1-2.523-2.52V8.823a2.528 2.528 0 0 1 2.523-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.52H10.14z"/></svg> },
];

const FAQS = [
  {
    q: 'How does the AI analyze my resume?',
    a: 'We parse the text from your PDF or TXT resume and cross-reference it directly against your target job description. The AI analyzes skill relevance, identifies critical gaps, and outputs a compatibility match rating.',
  },
  {
    q: 'Can I customize the focus and difficulty of mock interviews?',
    a: "Absolutely. You can choose Junior, Mid, or Senior difficulty levels and pick custom focus areas like 'Coding Heavy', 'System Design', or 'Behavioral Focus' depending on your upcoming loops.",
  },
  {
    q: 'Is my personal data kept secure?',
    a: 'Yes. All resumes, job descriptions, chat transcripts, and evaluation metrics are linked exclusively to your private account. We never share your data or use it to train public algorithms.',
  },
  {
    q: 'How are the technical quizzes generated?',
    a: 'Quizzes are built on-the-fly based on the technical topic, difficulty, and count you request. Each question includes a thorough answer explanation and distractor feedback.',
  },
];

const KEYWORDS = ['technical interviews', 'system design', 'coding quizzes', 'behavioral loops'];

const TESTIMONIALS = [
  {
    name: 'Akshay Kumar',
    handle: '@akshay_dev',
    text: 'PrepAI helped me isolate my consensus algorithm gaps in under 10 minutes. The adaptive simulator loops felt exactly like my actual staff-level Google interview rounds.',
    avatar: 'https://avatar.vercel.sh/akshay'
  },
  {
    name: 'Nitesh Sharma',
    handle: '@nitesh_systems',
    text: 'I ran three mock design rounds focused on high-throughput ledger scale. The instant evaluation logs on Lua scripting and DB partitions were spot-on.',
    avatar: 'https://avatar.vercel.sh/nitesh'
  },
  {
    name: 'Priya Patel',
    handle: '@priya_codes',
    text: 'The resume parsing accuracy is incredible. It immediately flagged my missing Redis caching details and recommended target assessments.',
    avatar: 'https://avatar.vercel.sh/priya'
  },
  {
    name: 'Rohan Mehta',
    handle: '@rohan_architect',
    text: 'LRU cache double-linked list questions in the assessments prepared me perfectly. Got my senior frontend offer last week!',
    avatar: 'https://avatar.vercel.sh/rohan'
  },
  {
    name: 'Sneha Rao',
    handle: '@sneha_tech',
    text: 'Love the instant feedback and transcript evaluation. It is highly detailed and gives precise answers instead of generic tips.',
    avatar: 'https://avatar.vercel.sh/sneha'
  }
];

// Interactive Dashboard Preview Component representing the active workspace UI
const InteractiveDashboardMock = () => {
  const [demoStep, setDemoStep] = useState('overview'); // 'overview' | 'resume_analysis' | 'mock_interview' | 'skill_quiz' | 'results'
  const [scanProgress, setScanProgress] = useState(0);
  const [typedMessage, setTypedMessage] = useState('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);

  // Automated video-like continuous demo loop
  useEffect(() => {
    let timer;
    const runDemoLoop = () => {
      // Step 1: Overview
      setDemoStep('overview');
      setScanProgress(0);
      setTypedMessage('');
      setSelectedQuizAnswer(null);

      // Step 2: Resume Analysis after 4 seconds
      timer = setTimeout(() => {
        setDemoStep('resume_analysis');
        
        // Scan progress bar animation
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progress >= 84) {
            clearInterval(interval);
            setScanProgress(84);
          } else {
            setScanProgress(progress);
          }
        }, 100);

        // Step 3: Mock Interview after 5 seconds
        timer = setTimeout(() => {
          setDemoStep('mock_interview');
          
          // Typing text animation
          const fullMessage = "For high concurrency writes in Redis, I would write a Lua script to execute operations atomically...";
          let currentText = "";
          let index = 0;
          const typingInterval = setInterval(() => {
            currentText += fullMessage[index];
            setTypedMessage(currentText);
            index++;
            if (index >= fullMessage.length) {
              clearInterval(typingInterval);
            }
          }, 35);

          // Step 4: Skill Quiz after 6.5 seconds
          timer = setTimeout(() => {
            setDemoStep('skill_quiz');
            
            // Select answer B after 1.5 seconds
            timer = setTimeout(() => {
              setSelectedQuizAnswer('B');
              
              // Step 5: Updated Results after 4.5 seconds
              timer = setTimeout(() => {
                setDemoStep('results');
                
                // Restart the loop after 5 seconds
                timer = setTimeout(() => {
                  runDemoLoop();
                }, 5000);
              }, 4500);
            }, 1500);
          }, 6500);
        }, 5000);
      }, 4000);
    };

    runDemoLoop();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-[#f8fafc] dark:bg-zinc-950 shadow-2xl transition-all duration-300">
      
      {/* OS Mock Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-2 font-mono text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">
            {demoStep === 'overview' && 'WORKSPACE OVERVIEW'}
            {demoStep === 'resume_analysis' && 'ANALYZING RESUME COMPATIBILITY'}
            {demoStep === 'mock_interview' && 'MOCK INTERVIEW SIMULATOR'}
            {demoStep === 'skill_quiz' && 'ADAPTIVE TECHNICAL ASSESSMENT'}
            {demoStep === 'results' && 'METRICS SYNCHRONIZED'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] font-bold text-slate-400 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          <span className="text-blue-600 dark:text-blue-400">DEMO IN ACTION</span>
        </div>
      </div>

      {/* App Body Grid */}
      <div className="flex h-[520px] md:h-[480px] font-sans text-xs text-slate-700 dark:text-zinc-300 overflow-hidden">
        
        {/* Mock Sidebar */}
        <div className="hidden md:flex w-48 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex-col justify-between select-none shrink-0">
          <div className="space-y-6">
            {/* Logo brand info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-tight text-xs block">PrepAI</span>
                  <span className="text-[8px] text-slate-400 block font-medium -mt-0.5">Interview workspace</span>
                </div>
              </div>
              <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900 uppercase">Beta</span>
            </div>

            {/* New Session action button */}
            <div className="p-2 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 rounded-lg text-center cursor-default hover:bg-slate-100 dark:hover:bg-zinc-855 transition-colors font-semibold text-slate-800 dark:text-zinc-200">
              + New session
            </div>

            {/* Navigation Lists */}
            <div className="space-y-4">
              <div>
                <span className="text-[8px] font-bold font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase block mb-2">WORKSPACE</span>
                <div className="space-y-1 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  <div className={`px-2.5 py-2 rounded flex items-center gap-2 transition-all ${demoStep === 'overview' || demoStep === 'results' ? 'bg-blue-50/70 border border-blue-200/50 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400' : 'text-slate-500 dark:text-zinc-400'}`}>
                    <Layers className="h-3.5 w-3.5 shrink-0" />
                    <span>Overview</span>
                  </div>
                  <div className={`px-2.5 py-2 rounded flex items-center gap-2 transition-all ${demoStep === 'resume_analysis' ? 'bg-blue-50/70 border border-blue-200/50 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-zinc-400'}`}>
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <div className="text-left">
                      <span>Resume Analysis</span>
                      <span className="text-[7px] text-slate-400 block font-normal capitalize">Match resume to job</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-2 rounded flex items-center gap-2 transition-all ${demoStep === 'mock_interview' ? 'bg-blue-50/70 border border-blue-200/50 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-zinc-400'}`}>
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    <div className="text-left">
                      <span>Mock Interview</span>
                      <span className="text-[7px] text-slate-400 block font-normal capitalize">AI-led practice session</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-2 rounded flex items-center gap-2 transition-all ${demoStep === 'skill_quiz' ? 'bg-blue-50/70 border border-blue-200/50 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-zinc-400'}`}>
                    <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
                    <div className="text-left">
                      <span>Skill Quiz</span>
                      <span className="text-[7px] text-slate-400 block font-normal capitalize">Topic-based MCQ test</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[8px] font-bold font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase block mb-2">ARCHIVE</span>
                <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="px-2.5 py-2 rounded flex items-center gap-2 text-slate-550 dark:text-zinc-400">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <div className="text-left">
                      <span>History</span>
                      <span className="text-[7px] text-slate-400 block font-normal capitalize">Past reports & sessions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Bottom Details */}
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800/80 font-mono text-[8px] text-slate-500 space-y-1">
              <div className="flex justify-between items-center">
                <span>PLAN USAGE</span>
                <span className="bg-[#FF4F00] text-white text-[6.5px] font-bold px-1 py-0.5 rounded font-sans uppercase">Enterprise</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/50 dark:border-zinc-900 pt-1.5 mt-1.5">
                <span>Resumes:</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">2</span>
              </div>
              <div className="flex justify-between">
                <span>Mock Interviews:</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">1</span>
              </div>
              <div className="flex justify-between">
                <span>Skill Quizzes:</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">3</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 dark:border-zinc-900 pt-3">
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center font-mono">
                A
              </div>
              <div className="truncate font-mono text-[8.5px]">
                <span className="block font-bold text-slate-900 dark:text-zinc-150 uppercase tracking-tight">abhishek</span>
                <span className="block text-slate-400 truncate">abhishek.0x17@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Workspace (Simulates light themed look) */}
        <div className="flex-1 bg-white dark:bg-zinc-950 p-6 overflow-y-auto space-y-5 text-left border-l border-slate-200 dark:border-zinc-800">
          
          {/* Main workspace header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
            <div>
              <span className="font-mono text-[8px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase block">DASHBOARD</span>
              <h2 className="text-base font-bold font-display uppercase tracking-tight text-slate-900 dark:text-zinc-50">Overview</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded border border-slate-200 dark:border-zinc-800 text-slate-500">
                <Moon className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-wider text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Ready</span>
              </div>
            </div>
          </div>

          {/* Tab Content Rendering */}
          {demoStep === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                {/* Preparation Cockpit Card */}
                <div className="md:col-span-8 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 text-[8px] font-bold uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                      <TrendingUp className="h-3 w-3" />
                      Preparation Cockpit
                    </span>
                    <h3 className="text-base font-bold font-display uppercase text-slate-900 dark:text-zinc-50 leading-tight">Welcome back, abhishek.</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed max-w-md">
                      Keep your resume, interview reps, and skill checks in one calm workspace built for focused preparation.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="bg-blue-600 text-white px-4 py-1.5 rounded text-[10px] font-bold font-mono uppercase border border-blue-700 select-none">Start analysis ➔</div>
                    <div className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-1.5 rounded text-[10px] font-bold font-mono uppercase select-none">View history</div>
                  </div>
                </div>

                {/* Milestone progress card */}
                <div className="md:col-span-4 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold font-mono uppercase text-slate-400">Milestone Progress</span>
                      <Award className="h-4.5 w-4.5 text-amber-500" />
                    </div>
                    <span className="text-2xl font-black font-display text-slate-900 dark:text-zinc-100 block mt-2">75%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mt-4">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-400 uppercase">Avg. Match</span>
                    <span className="text-base font-bold font-display text-slate-900 dark:text-zinc-50 block mt-0.5">84%</span>
                  </div>
                  <FileText className="h-5 w-5 text-blue-500/20" />
                </div>
                <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-400 uppercase">Reports</span>
                    <span className="text-base font-bold font-display text-slate-900 dark:text-zinc-50 block mt-0.5">3</span>
                  </div>
                  <FileText className="h-5 w-5 text-pink-500/20" />
                </div>
                <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-400 uppercase">Interviews</span>
                    <span className="text-base font-bold font-display text-slate-900 dark:text-zinc-50 block mt-0.5">1</span>
                  </div>
                  <MessageSquare className="h-5 w-5 text-emerald-500/20" />
                </div>
                <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-400 uppercase">Quiz Accuracy</span>
                    <span className="text-base font-bold font-display text-slate-900 dark:text-zinc-50 block mt-0.5">33%</span>
                  </div>
                  <ClipboardCheck className="h-5 w-5 text-amber-500/20" />
                </div>
              </div>

              {/* Bottom Cards: Checklist & Tools */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-6 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-900">
                    <h4 className="text-[10px] font-bold font-display uppercase tracking-tight text-slate-900 dark:text-zinc-200">Preparation checklist</h4>
                    <span className="text-[8px] font-mono text-slate-400 font-bold">3/4</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[8.5px]">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold line-through decoration-emerald-500/30">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Analyze a resume against a target role</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold line-through decoration-emerald-500/30">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Complete a mock interview session</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold line-through decoration-emerald-500/30">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Take a technical skill quiz</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                      <span className="w-3.5 h-3.5 rounded border border-slate-200 block shrink-0" />
                      <span>Review performance gap reports</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-2.5">
                  <span className="text-[8px] font-bold font-mono tracking-widest text-slate-400 uppercase block">LAUNCH TOOLS</span>
                  <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl flex items-center justify-between hover:border-blue-500 transition-colors">
                    <div className="text-left max-w-[80%]">
                      <span className="font-bold text-slate-900 dark:text-zinc-150 block text-[10px]">Resume Analysis</span>
                      <span className="text-[8px] text-slate-400 block font-normal mt-0.5">Compare your resume with a target role and get gaps.</span>
                    </div>
                    <span className="text-blue-600 font-bold font-mono text-[9px] shrink-0">Analyze ➔</span>
                  </div>
                  <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl flex items-center justify-between hover:border-blue-500 transition-colors">
                    <div className="text-left max-w-[80%]">
                      <span className="font-bold text-slate-900 dark:text-zinc-150 block text-[10px]">Mock Interview</span>
                      <span className="text-[8px] text-slate-400 block font-normal mt-0.5">Create a role-specific interview flow for coding, design.</span>
                    </div>
                    <span className="text-blue-600 font-bold font-mono text-[9px] shrink-0">Practice ➔</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {demoStep === 'resume_analysis' && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-zinc-100">Resume Matching Arena</span>
                </div>
                <span className="font-mono text-[9px] font-bold text-slate-400">Match score computed in real-time</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl space-y-3">
                  <h4 className="font-bold uppercase tracking-wide text-xs">Profile Analysis Logs</h4>
                  <div className="space-y-2 font-mono text-[9px] leading-relaxed">
                    <div className="flex justify-between border-b border-slate-100 dark:border-zinc-900 pb-1.5">
                      <span className="text-slate-400">Resume File:</span>
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">staff_infra_resume.pdf</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-zinc-900 pb-1.5">
                      <span className="text-slate-400">Target Role:</span>
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">Staff Systems Architect</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between mb-1.5 text-[8.5px] font-bold text-blue-600">
                        <span>Parsing structural tokens...</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold uppercase tracking-wide text-xs">AI Evaluation Insights</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                      Looking for distributed concurrency design patterns. System checklist parsed.
                    </p>
                  </div>
                  {scanProgress >= 84 && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-mono text-[9px] font-bold border border-emerald-100 dark:border-emerald-900/30">
                      ✓ Profile alignment score validated at 84%.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {demoStep === 'mock_interview' && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-zinc-100">AI Live Arena Simulation</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <div className="p-4 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl font-mono text-[9px] space-y-4 min-h-[180px]">
                <div className="flex flex-col items-start">
                  <span className="text-[7.5px] font-bold text-slate-400 uppercase mb-0.5">PrepAI Technical Advisor</span>
                  <div className="p-2 rounded bg-slate-50 dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 text-slate-700 dark:text-zinc-350 max-w-[85%]">
                    How would you prevent race conditions in Redis when updating token capacities from concurrent calls?
                  </div>
                </div>

                {typedMessage.length > 0 && (
                  <div className="flex flex-col items-end">
                    <span className="text-[7.5px] font-bold text-slate-400 uppercase mb-0.5">Candidate (abhishek)</span>
                    <div className="p-2 rounded bg-blue-600 text-white border border-blue-700 max-w-[85%]">
                      {typedMessage}█
                    </div>
                  </div>
                )}

                {typedMessage.length >= 80 && (
                  <div className="flex flex-col items-start animate-fade-in">
                    <span className="text-[7.5px] font-bold text-emerald-600 uppercase mb-0.5">AI Evaluation Report</span>
                    <div className="p-2.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 max-w-[85%] font-bold">
                      ✓ Correct. Lua script guarantees atomic execution. Good platform efficiency awareness.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {demoStep === 'skill_quiz' && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-zinc-100">Adaptive Skill Assessment</span>
                </div>
                <span className="font-mono text-[8px] text-slate-400 font-bold uppercase">Topic: Algorithms & Caching</span>
              </div>

              <div className="p-5 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl space-y-4 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">Which storage architecture is best for LRU Cache with O(1) operations?</p>
                <div className="space-y-2 font-mono text-[9px]">
                  <div className="p-2.5 rounded border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 text-slate-400">
                    A. Balanced Search Binary Tree
                  </div>
                  <div className={`p-2.5 rounded border transition-all duration-300 ${selectedQuizAnswer === 'B' ? 'border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-350 animate-pulse'}`}>
                    B. Hash Map + Doubly Linked List {selectedQuizAnswer === 'B' && '✓'}
                  </div>
                  <div className="p-2.5 rounded border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 text-slate-400">
                    C. Sequential LSM Array
                  </div>
                </div>
              </div>
            </div>
          )}

          {demoStep === 'results' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                {/* Preparation Cockpit Card */}
                <div className="md:col-span-8 p-5 rounded-xl border border-blue-500/30 dark:border-blue-900/50 bg-blue-50/10 dark:bg-blue-950/10 flex flex-col justify-between ring-2 ring-blue-500/10">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 text-[8px] font-bold uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                      <TrendingUp className="h-3 w-3" />
                      Preparation Cockpit
                    </span>
                    <h3 className="text-base font-bold font-display uppercase text-slate-900 dark:text-zinc-50 leading-tight">Workspace Synchronized!</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed max-w-md">
                      Your resume match gaps are addressed, simulations completed, and all checklist milestones achieved.
                    </p>
                  </div>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-bold font-mono uppercase tracking-wider block mt-3 max-w-sm border border-emerald-100 dark:border-emerald-900/30">
                    ✓ Mock loop evaluation: Active offer profile ready.
                  </div>
                </div>

                {/* Milestone progress card */}
                <div className="md:col-span-4 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold font-mono uppercase text-slate-400">Milestone Progress</span>
                      <Award className="h-4.5 w-4.5 text-blue-600 animate-bounce" />
                    </div>
                    <span className="text-2xl font-black font-display text-slate-900 dark:text-zinc-150 block mt-2">100%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mt-4">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-400 uppercase">Avg. Match</span>
                    <span className="text-base font-bold font-display text-slate-900 dark:text-zinc-50 block mt-0.5">84%</span>
                  </div>
                  <FileText className="h-5 w-5 text-blue-500/20" />
                </div>
                <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-400 uppercase text-blue-600">Reports</span>
                    <span className="text-base font-bold font-display text-blue-600 block mt-0.5">4</span>
                  </div>
                  <FileText className="h-5 w-5 text-pink-500/20" />
                </div>
                <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-400 uppercase text-blue-600">Interviews</span>
                    <span className="text-base font-bold font-display text-blue-600 block mt-0.5">2</span>
                  </div>
                  <MessageSquare className="h-5 w-5 text-emerald-500/20" />
                </div>
                <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-400 uppercase text-blue-600">Quiz Accuracy</span>
                    <span className="text-base font-bold font-display text-blue-600 block mt-0.5">45%</span>
                  </div>
                  <ClipboardCheck className="h-5 w-5 text-amber-500/20" />
                </div>
              </div>

              {/* Bottom Cards: Checklist & Tools */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-pulse-once">
                <div className="md:col-span-6 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-900">
                    <h4 className="text-[10px] font-bold font-display uppercase tracking-tight text-slate-900 dark:text-zinc-200">Preparation checklist</h4>
                    <span className="text-[8px] font-mono text-slate-400 font-bold">4/4</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[8.5px]">
                    <div className="flex items-center gap-2 text-emerald-650 dark:text-emerald-450 font-semibold line-through decoration-emerald-500/30">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Analyze a resume against a target role</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-655 dark:text-emerald-450 font-semibold line-through decoration-emerald-500/30">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Complete a mock interview session</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-655 dark:text-emerald-450 font-semibold line-through decoration-emerald-500/30">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Take a technical skill quiz</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-655 dark:text-emerald-450 font-semibold line-through decoration-emerald-500/30">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Review performance gap reports</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-2.5">
                  <span className="text-[8px] font-bold font-mono tracking-widest text-slate-400 uppercase block">LAUNCH TOOLS</span>
                  <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl flex items-center justify-between hover:border-blue-500 transition-colors">
                    <div className="text-left max-w-[80%]">
                      <span className="font-bold text-slate-900 dark:text-zinc-150 block text-[10px]">Resume Analysis</span>
                      <span className="text-[8px] text-slate-400 block font-normal mt-0.5">Compare your resume with a target role and get gaps.</span>
                    </div>
                    <span className="text-blue-600 font-bold font-mono text-[9px] shrink-0">Analyze ➔</span>
                  </div>
                  <div className="p-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl flex items-center justify-between hover:border-blue-500 transition-colors">
                    <div className="text-left max-w-[80%]">
                      <span className="font-bold text-slate-900 dark:text-zinc-150 block text-[10px]">Mock Interview</span>
                      <span className="text-[8px] text-slate-400 block font-normal mt-0.5">Create a role-specific interview flow for coding, design.</span>
                    </div>
                    <span className="text-blue-600 font-bold font-mono text-[9px] shrink-0">Practice ➔</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};



const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [keywordIndex, setKeywordIndex] = useState(0);

  // Cycle keywords in Hero
  useEffect(() => {
    const interval = setInterval(() => {
      setKeywordIndex((prev) => (prev + 1) % KEYWORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'light'; // default light theme
  });

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
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300 font-sans selection:bg-brand-primary/10 selection:text-brand-primary">
      
      {/* Navbar Section */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded border-2 border-slate-900 dark:border-zinc-100 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 group-hover:scale-95 transition-transform duration-200">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold font-display tracking-tight text-slate-900 dark:text-zinc-50">
              PrepAI
            </span>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-semibold tracking-wider uppercase">
            <a href="#features" className="text-slate-600 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
              Features
            </a>
            <a href="#demo" className="text-slate-600 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
              Workspace Demo
            </a>
            <a href="#pricing" className="text-slate-600 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-slate-600 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
              FAQs
            </a>
          </nav>

          {/* Actions & Theme toggle */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex h-9 items-center justify-center rounded border-2 border-slate-900 dark:border-zinc-100 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-800 dark:hover:bg-zinc-200 px-5 text-xs font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Dashboard
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-300 hover:text-brand-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-9 items-center justify-center rounded border-2 border-slate-900 dark:border-zinc-100 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-800 dark:hover:bg-zinc-200 px-5 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer layout */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900 px-4 py-6 z-40 space-y-4 shadow-lg transition-colors duration-300"
          >
            <nav className="flex flex-col gap-4 font-mono text-xs font-bold tracking-widest uppercase">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-zinc-300 hover:text-brand-primary">
                Features
              </a>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-zinc-300 hover:text-brand-primary">
                Workspace Demo
              </a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-zinc-300 hover:text-brand-primary">
                Pricing
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-zinc-300 hover:text-brand-primary">
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
                  className="flex w-full h-10 items-center justify-center rounded border-2 border-slate-900 dark:border-zinc-100 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold font-mono uppercase tracking-wider"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-full items-center justify-center rounded border border-slate-200 dark:border-zinc-800 text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-full items-center justify-center rounded border-2 border-slate-900 dark:border-zinc-100 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold font-mono uppercase tracking-wider"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Clean Tag pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-50/50 dark:bg-blue-950/20 px-3 py-1 ring-1 ring-blue-200/20 shadow-lg shadow-blue-400/10 backdrop-blur-[1px] cursor-pointer hover:bg-blue-500/[5%] transition-colors"
            >
              <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 font-mono">New</span>
              <span className="flex items-center gap-1 font-sans text-xs text-slate-800 dark:text-zinc-200">
                <span>Start creating custom prep sessions</span>
                <ArrowUpRight className="h-3 w-3 text-blue-500" />
              </span>
            </motion.div>

            {/* Bold, Tight Centered Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-8 uppercase select-none"
            >
              Prepare for your next <br/>
              <div className="relative -rotate-2 my-3 inline-flex items-center justify-center rounded bg-blue-600 dark:bg-blue-700 px-5 py-1.5 text-white min-w-[240px] sm:min-w-[400px] h-11 sm:h-16 overflow-hidden shadow-[0_4px_20px_rgba(0,78,252,0.25)] select-none">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={keywordIndex}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute text-center font-display font-black uppercase text-lg sm:text-3xl tracking-wider text-white"
                  >
                    {KEYWORDS[keywordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>

            {/* Benefit-Driven Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-sm sm:text-base text-slate-650 dark:text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Transform any resume or target JD into hyper-personalized interview mock loops, custom assessment test sheets, and coding exercises using cutting-edge AI. Perfect for software developers and engineering candidates who demand offer letters.
            </motion.p>

            {/* CTA button with circular arrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex justify-center mb-10"
            >
              <button
                onClick={handleCTA}
                className="group inline-flex items-center gap-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <span>Start Prep Arena Now</span>
                <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-3.5 w-3.5 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Static Monochrome Trusted Logos Bar */}
      <section className="bg-slate-50 dark:bg-zinc-950 py-8 select-none transition-colors duration-300 border-t border-b border-slate-200/60 dark:border-zinc-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
            Validated by developers entering active engineering roles at
          </p>
          {/* Scrolling horizontal marquee for logos, especially on mobile/small screens */}
          <div 
            className="mt-6 relative w-full overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
          >
            <div className="flex gap-16 animate-marquee whitespace-nowrap py-2 text-slate-400 dark:text-zinc-500">
              {/* Repeat logos three times to guarantee infinite seamless wrap on any width screen */}
              {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors duration-200 shrink-0 inline-flex"
                >
                  {logo.svg}
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="demo" className="py-16 sm:py-24 bg-white dark:bg-zinc-900 transition-colors duration-300 border-b border-slate-200 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <InteractiveDashboardMock />
          </motion.div>
        </div>
      </section>


      {/* Features Grid Section */}
      <section id="features" className="py-20 sm:py-32 bg-white dark:bg-zinc-900 transition-colors duration-300 border-b border-slate-200 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <span className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase">
              Robust Core Modules
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-zinc-50 uppercase mt-3">
              Engineered for absolute feedback loop.
            </h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
              No generic test questions. PrepAI uses solid functional layers to help developers study exactly what counts to score the offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/40 hover:border-slate-900 dark:hover:border-zinc-100 transition-all duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-slate-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-bold text-xs select-none">
                01
              </div>
              <h3 className="mt-6 text-base font-bold font-display text-slate-900 dark:text-zinc-50 uppercase">
                Interactive Resume Profiling
              </h3>
              <p className="mt-3.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Verify exactly which tech stack terms are missing or weak on your CV before recruiters inspect it. Review comprehensive scores alongside direct adjustment checklists.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/40 hover:border-slate-900 dark:hover:border-zinc-100 transition-all duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-slate-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-bold text-xs select-none">
                02
              </div>
              <h3 className="mt-6 text-base font-bold font-display text-slate-900 dark:text-zinc-50 uppercase">
                Live AI Interview Simulator
              </h3>
              <p className="mt-3.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Talk through system design, architecture, and coding concepts with an interactive AI. Adjust parameters dynamically to practice under high-stress mock loop timelines.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/40 hover:border-slate-900 dark:hover:border-zinc-100 transition-all duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-slate-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-bold text-xs select-none">
                03
              </div>
              <h3 className="mt-6 text-base font-bold font-display text-slate-900 dark:text-zinc-50 uppercase">
                Algorithmic Quizzes
              </h3>
              <p className="mt-3.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Test detailed system mechanics (like replication models, query indexes, and complexity bounds) with adaptive test sessions generated instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Infinite Marquee */}
      <section className="py-12 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 border-b border-slate-200 dark:border-zinc-900 overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center mb-8">
          <span className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase">
            Reviews
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white uppercase mt-2">
            Loved by developers everywhere
          </h2>
          <p className="mt-2 text-xs text-slate-505 dark:text-zinc-400 font-medium">
            Join thousands who have transformed their preparation workflow
          </p>
        </div>

        {/* Marquee Container with smooth fading edges and restricted width */}
        <div 
          className="relative max-w-4xl mx-auto overflow-hidden my-4 py-2"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <div className="flex gap-4 animate-marquee whitespace-nowrap">
            {/* Render testimonials list twice for seamless infinite scrolling loop */}
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div
                key={`r1-${idx}`}
                className="w-72 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-sm shrink-0 inline-block whitespace-normal text-left"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  {/* Colorful gradient avatar matching name */}
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-tr ${
                    idx % 3 === 0 ? 'from-blue-500 to-indigo-600' :
                    idx % 3 === 1 ? 'from-cyan-400 to-blue-500' :
                    'from-teal-400 to-indigo-500'
                  } shrink-0`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-950 dark:text-white leading-none">{t.name}</h4>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{t.handle}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-350 leading-relaxed font-medium">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean Comparison Layout */}
      <section id="pricing" className="py-20 sm:py-32 bg-white dark:bg-zinc-900 transition-colors duration-300 border-b border-slate-200 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <span className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase">
              Transparent Costs
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-zinc-50 uppercase mt-3">
              Simple subscription tiers.
            </h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
              Choose the plan that suits your schedule. No hidden platform fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Free Tier */}
            <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl p-8 flex flex-col justify-between hover:border-slate-900 dark:hover:border-zinc-100 transition-colors duration-300">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-zinc-50 uppercase">Free Tier</h3>
                <p className="mt-2 text-[10px] text-slate-500 font-mono tracking-tighter">
                  Essentials for immediate mock testing
                </p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold font-display text-slate-900 dark:text-zinc-50">$0</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Forever</span>
                </div>
                
                <ul className="mt-8 space-y-4 text-xs font-medium text-slate-700 dark:text-zinc-300 border-t border-slate-200/50 dark:border-zinc-800/60 pt-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-primary shrink-0" />
                    <span>5 Resume match checks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-primary shrink-0" />
                    <span>1 Complete AI mock simulation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-primary shrink-0" />
                    <span>3 Adaptive skill quizzes</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCTA}
                className="mt-8 w-full h-11 inline-flex items-center justify-center rounded border border-slate-900 dark:border-zinc-100 text-slate-900 dark:text-zinc-100 hover:bg-slate-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 text-xs font-bold font-mono uppercase tracking-widest transition-colors cursor-pointer"
              >
                Sign Up Free
              </button>
            </div>

            {/* Pro Tier (Highlighted with flat Accent details) */}
            <div className="bg-slate-50 dark:bg-zinc-950 border-2 border-brand-accent rounded-xl p-8 flex flex-col justify-between relative shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-brand-accent text-white text-[8px] font-bold font-mono uppercase tracking-widest px-3 py-1 select-none">
                RECOMMENDED
              </div>
              
              <div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-zinc-50 uppercase">Pro Prep</h3>
                <p className="mt-2 text-[10px] text-slate-500 font-mono tracking-tighter">
                  Everything required to land top offers
                </p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold font-display text-slate-900 dark:text-zinc-50">$19</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">/ Month</span>
                </div>

                <ul className="mt-8 space-y-4 text-xs font-medium text-slate-700 dark:text-zinc-300 border-t border-slate-200/50 dark:border-zinc-800/60 pt-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-accent shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">Unlimited Resume matching</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-accent shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">Unlimited Live AI simulations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-accent shrink-0" />
                    <span>Unlimited assessment quizzes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-accent shrink-0" />
                    <span>Real-time structural feedback</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCTA}
                className="mt-8 w-full h-11 inline-flex items-center justify-center rounded bg-brand-accent text-white hover:bg-brand-accent-hover text-xs font-bold font-mono uppercase tracking-widest transition-colors cursor-pointer"
              >
                Go Pro Now
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl p-8 flex flex-col justify-between hover:border-slate-900 dark:hover:border-zinc-100 transition-colors duration-300">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-zinc-50 uppercase">Enterprise</h3>
                <p className="mt-2 text-[10px] text-slate-500 font-mono tracking-tighter">
                  Custom setups for bootcamps and schools
                </p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold font-display text-slate-900 dark:text-zinc-50">Custom</span>
                </div>

                <ul className="mt-8 space-y-4 text-xs font-medium text-slate-700 dark:text-zinc-300 border-t border-slate-200/50 dark:border-zinc-800/60 pt-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-primary shrink-0" />
                    <span>Custom evaluation templates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-primary shrink-0" />
                    <span>Group analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-brand-primary shrink-0" />
                    <span>API tokens for custom loops</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCTA}
                className="mt-8 w-full h-11 inline-flex items-center justify-center rounded border border-slate-900 dark:border-zinc-100 text-slate-900 dark:text-zinc-100 hover:bg-slate-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 text-xs font-bold font-mono uppercase tracking-widest transition-colors cursor-pointer"
              >
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Accordion FAQs Section */}
      <section id="faq" className="py-20 sm:py-32 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 border-b border-slate-200 dark:border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-zinc-50 uppercase mt-3">
              Frequently asked questions.
            </h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400 font-medium">
              Quick answers concerning standard functionalities of PrepAI.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-zinc-100 font-display text-xs sm:text-sm cursor-pointer select-none"
                  >
                    <span className="uppercase tracking-wide">{faq.q}</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-primary' : ''
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

      {/* Final CTA Section - Full Width Royal Blue Box */}
      <section className="bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
        <div className="w-full bg-[#1a3cbd] text-white py-20 sm:py-28 px-4 sm:px-8 md:px-16 flex flex-col items-center text-center relative overflow-hidden select-none rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-2xl">
          
          {/* Subtle background grid overlay to add premium depth */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white leading-tight max-w-3xl relative z-10">
            Ready to transform your preparation journey?
          </h2>
          
          <p className="mt-4 text-xs sm:text-sm text-blue-105/80 font-medium max-w-2xl leading-relaxed relative z-10">
            Join thousands of developers and engineering candidates who are already scaling their mock workflows with our advanced AI workspace.
          </p>
          
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 relative z-10 w-full">
            <button
              onClick={handleCTA}
              className="group w-full md:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-white rounded-lg px-6 py-3 text-xs font-bold font-mono uppercase tracking-widest transition-colors cursor-pointer border border-zinc-800"
            >
              <span>Start Preparing Now</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <span className="text-[10px] sm:text-xs font-semibold text-blue-200/90 font-mono tracking-wider">
              No credit card required &bull; Free forever plan
            </span>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900 py-12 transition-colors duration-300 select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-slate-900 dark:border-zinc-100 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold font-display text-slate-900 dark:text-zinc-50">PREPAI</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 font-mono text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-zinc-500">
            <a href="#features" className="hover:text-brand-primary">Features</a>
            <a href="#demo" className="hover:text-brand-primary">Demo</a>
            <a href="#pricing" className="hover:text-brand-primary">Pricing</a>
            <a href="#faq" className="hover:text-brand-primary">FAQs</a>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono">
            &copy; 2026 PREPAI INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
