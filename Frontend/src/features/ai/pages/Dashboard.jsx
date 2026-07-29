import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Menu, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/hooks/useAuth';
import { generateReport, getReports } from '../services/report.api';
import { getInterviewHistory, startInterview, uploadResumeFile } from '../services/interview.api';
import { getQuizHistory, startQuiz } from '../services/quiz.api';
import AppSidebar, { NAV_ITEMS } from '../components/layout/AppSidebar';
import OverviewView from '../components/dashboard/OverviewView';
import AnalyzeView from '../components/dashboard/AnalyzeView';
import MockInterviewView from '../components/dashboard/MockInterviewView';
import QuizView from '../components/dashboard/QuizView';
import RecentView from '../components/dashboard/RecentView';
import ResumeUpload from '../components/dashboard/ResumeUpload';
import { GenerationProgress } from '../../../components/ui/AnimatedLoader';

const ANALYZE_STEPS = [
  'Parsing resume and job description',
  'Mapping skills and identifying gaps',
  'Building interview question plan',
  'Writing compatibility report',
];

const MOCK_STEPS = [
  'Reading candidate context',
  'Selecting interview style',
  'Creating question flow',
  'Opening mock session',
];

const QUIZ_STEPS = [
  'Synthesizing quiz parameters',
  'Generating multiple-choice items',
  'Formulating option distractors',
  'Writing answer explanations',
];

const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'light';
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
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem('sidebar-collapsed') === 'true'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState('overview');

  const [reports, setReports] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [quizGenerating, setQuizGenerating] = useState(false);
  const [quizGenerationStep, setQuizGenerationStep] = useState(0);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Mid');
  const [focusArea, setFocusArea] = useState('Coding Heavy');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('Mid');
  const [quizNumQuestions, setQuizNumQuestions] = useState(5);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'quiz' || location.pathname === '/quiz') setActiveFeature('quiz');
    else if (tab === 'interview' || tab === 'mock') setActiveFeature('mock');
    else if (tab === 'recent') setActiveFeature('recent');
    else if (tab === 'analyze' || tab === 'report') setActiveFeature('analyze');
    else if (!tab && location.pathname === '/dashboard') setActiveFeature('overview');
  }, [location.search, location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingHistory(true);
        const [reportsData, interviewsData, quizData] = await Promise.all([
          getReports(),
          getInterviewHistory(),
          getQuizHistory(),
        ]);
        setReports(reportsData.reports || []);
        setInterviews(interviewsData.history || []);
        setQuizHistory(quizData.history || []);
      } catch {
        setError('Could not load history.');
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (generating) {
      setGenerationStep(1);
      interval = setInterval(() => {
        setGenerationStep((v) => (v < 4 ? v + 1 : v));
      }, 1800);
    } else setGenerationStep(0);
    return () => clearInterval(interval);
  }, [generating]);

  useEffect(() => {
    let interval;
    if (quizGenerating) {
      setQuizGenerationStep(1);
      interval = setInterval(() => {
        setQuizGenerationStep((v) => (v < 4 ? v + 1 : v));
      }, 2000);
    } else setQuizGenerationStep(0);
    return () => clearInterval(interval);
  }, [quizGenerating]);

  const averageReportScore = useMemo(() => {
    if (!reports.length) return 0;
    return Math.round(reports.reduce((s, r) => s + (r.matchScore || 0), 0) / reports.length);
  }, [reports]);

  const selectFeature = (featureId) => {
    setActiveFeature(featureId);
    setError('');
    setSuccessMsg('');
    setIsMobileMenuOpen(false);

    const routes = {
      overview: '/dashboard',
      analyze: '/dashboard?tab=analyze',
      mock: '/dashboard?tab=interview',
      quiz: '/quiz',
      recent: '/dashboard?tab=recent',
    };
    navigate(routes[featureId] || '/dashboard');
  };

  const clearForm = () => {
    setGenerating(false);
    setQuizGenerating(false);
    setJobTitle('');
    setJobDescription('');
    setResume('');
    setSelfDescription('');
    setQuizTopic('');
    setFileName('');
    setFileSize('');
    setError('');
    setSuccessMsg('');
    selectFeature('analyze');
  };

  const performUpload = async (file) => {
    setError('');
    setSuccessMsg('');
    setUploadingFile(true);
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    try {
      const data = await uploadResumeFile(file);
      if (data?.text) {
        setResume(data.text);
        setSuccessMsg(`Resume parsed: ${file.name}`);
      } else {
        setError('No readable text could be extracted from this file.');
        setFileName('');
        setFileSize('');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Use PDF or TXT.');
      setFileName('');
      setFileSize('');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) performUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    if (name.endsWith('.pdf') || name.endsWith('.txt')) performUpload(file);
    else setError('Unsupported file type. Upload PDF or TXT.');
  };

  const validateSharedInputs = () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError('Job title and job description are required.');
      return false;
    }
    if (!resume.trim()) {
      setError('Please upload your resume first.');
      return false;
    }
    return true;
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!validateSharedInputs()) return;
    setError('');
    setSuccessMsg('');
    setGenerating(true);
    try {
      const data = await generateReport(jobDescription, resume, selfDescription);
      if (data?.report?._id) navigate(`/report/${data.report._id}`);
      else {
        setError('Failed to generate report.');
        setGenerating(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate report.');
      setGenerating(false);
    }
  };

  const handleMock = async (e) => {
    e.preventDefault();
    if (!validateSharedInputs()) return;
    setError('');
    setSuccessMsg('');
    setGenerating(true);
    try {
      const data = await startInterview({ jobTitle, jobDescription, resume, difficulty, focusArea });
      if (data?.sessionId) navigate(`/interview/${data.sessionId}`);
      else {
        setError('Failed to initialize interview session.');
        setGenerating(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to initialize session.');
      setGenerating(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim()) {
      setError('Please enter a technical topic.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setQuizGenerating(true);
    try {
      const data = await startQuiz({ topic: quizTopic, difficulty: quizDifficulty, numQuestions: quizNumQuestions });
      if (data?.sessionId) navigate(`/quiz/${data.sessionId}`);
      else {
        setError('Failed to start quiz session.');
        setQuizGenerating(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate quiz.');
      setQuizGenerating(false);
    }
  };

  const resumeUploadProps = {
    resume,
    fileName,
    fileSize,
    uploadingFile,
    isDragOver,
    onClear: () => {
      setResume('');
      setFileName('');
      setFileSize('');
      setSuccessMsg('');
    },
    onFileSelect: handleFileUpload,
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: () => setIsDragOver(false),
    onDrop: handleDrop,
  };

  const renderResumeUpload = () => <ResumeUpload {...resumeUploadProps} />;

  const activeNav = NAV_ITEMS.find((item) => item.id === activeFeature);

  const renderContent = () => {
    if (generating) {
      const isMock = activeFeature === 'mock';
      return (
        <GenerationProgress
          title={isMock ? 'Creating mock interview' : 'Analyzing resume'}
          subtitle="Preparing output from your resume and target role."
          steps={isMock ? MOCK_STEPS : ANALYZE_STEPS}
          currentStep={generationStep}
        />
      );
    }

    if (quizGenerating) {
      return (
        <GenerationProgress
          title="Assembling quiz"
          subtitle={`Generating questions for "${quizTopic}"`}
          steps={QUIZ_STEPS}
          currentStep={quizGenerationStep}
        />
      );
    }

    switch (activeFeature) {
      case 'overview':
        return (
          <OverviewView
            username={user?.username}
            reports={reports}
            interviews={interviews}
            quizHistory={quizHistory}
            averageReportScore={averageReportScore}
            onSelectFeature={selectFeature}
            onNavigateReport={(id) => navigate(`/report/${id}`)}
          />
        );
      case 'analyze':
        return (
          <AnalyzeView
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            selfDescription={selfDescription}
            setSelfDescription={setSelfDescription}
            error={error}
            successMsg={successMsg}
            onClear={clearForm}
            onSubmit={handleAnalyze}
            renderResumeUpload={renderResumeUpload}
          />
        );
      case 'mock':
        return (
          <MockInterviewView
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            selfDescription={selfDescription}
            setSelfDescription={setSelfDescription}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            focusArea={focusArea}
            setFocusArea={setFocusArea}
            error={error}
            successMsg={successMsg}
            onClear={clearForm}
            onSubmit={handleMock}
            renderResumeUpload={renderResumeUpload}
          />
        );
      case 'quiz':
        return (
          <QuizView
            quizTopic={quizTopic}
            setQuizTopic={setQuizTopic}
            quizDifficulty={quizDifficulty}
            setQuizDifficulty={setQuizDifficulty}
            quizNumQuestions={quizNumQuestions}
            setQuizNumQuestions={setQuizNumQuestions}
            error={error}
            successMsg={successMsg}
            onClear={() => {
              setQuizTopic('');
              setError('');
              setSuccessMsg('');
            }}
            onSubmit={handleQuizSubmit}
          />
        );
      case 'recent':
        return (
          <RecentView
            reports={reports}
            interviews={interviews}
            quizHistory={quizHistory}
            loadingHistory={loadingHistory}
            onNavigateReport={(id) => navigate(`/report/${id}`)}
            onNavigateInterview={(id) => navigate(`/interview/${id}/result`)}
            onNavigateQuiz={(id) => navigate(`/quiz/${id}/result`)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      <AppSidebar
        user={user}
        activeFeature={activeFeature}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onSelectFeature={selectFeature}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onNewSession={clearForm}
        onLogout={handleLogout}
      />
      {/* Spacer to push right column content past the fixed sidebar on desktop */}
      <div 
        className={`hidden lg:block shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-[68px]' : 'w-[230px]'}`}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-4 backdrop-blur-md sm:px-6 select-none transition-colors">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="mr-3 rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-zinc-200 lg:hidden cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              {activeFeature === 'overview' ? 'Dashboard' : 'Workspace'}
            </p>
            <h1 className="mt-0.5 truncate text-base font-bold tracking-tight text-slate-900 dark:text-zinc-50">
              {activeNav?.label || 'Overview'}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-4.5 w-4.5" />
              ) : (
                <Sun className="h-4.5 w-4.5" />
              )}
            </button>

            {/* Status indicator */}
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-zinc-400 sm:flex transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Ready
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature + (generating || quizGenerating ? '-loading' : '')}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
