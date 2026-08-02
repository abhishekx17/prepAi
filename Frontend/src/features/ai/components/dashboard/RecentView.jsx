import React, { useState, useMemo } from 'react';
import { FileText, MessageSquare, ClipboardCheck, Clock, Search, Activity, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { LoadingDots } from '../../../../components/ui/AnimatedLoader';

const formatDate = (value) => {
  if (!value) return 'Recent';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const EmptyState = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/10 p-12 text-center select-none w-full max-w-md mx-auto mt-6">
    <Clock className="mx-auto h-8 w-8 text-slate-400 dark:text-zinc-600 animate-pulse" strokeWidth={1.5} />
    <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">{message}</p>
  </div>
);

const StatsCard = ({ icon: Icon, title, value, subtext, colorClass, delay, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="w-full text-left rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 flex items-center justify-between shadow-sm dark:shadow-none hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-all select-none cursor-pointer group"
  >
    <div className="space-y-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{title}</span>
      <h4 className="text-2xl font-black text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{value}</h4>
      <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">{subtext}</p>
    </div>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${colorClass}`}>
      <Icon className="w-5 h-5" strokeWidth={1.5} />
    </div>
  </motion.button>
);

const HistoryItem = ({ icon: Icon, title, meta, badgeText, badgeTheme, type, onClick }) => {
  let badgeClasses = 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 text-slate-600 dark:text-zinc-300';
  if (badgeTheme === 'success') {
    badgeClasses = 'border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-350';
  } else if (badgeTheme === 'warning') {
    badgeClasses = 'border-amber-200 dark:border-amber-950 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300';
  } else if (badgeTheme === 'danger') {
    badgeClasses = 'border-rose-200 dark:border-rose-950 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-350';
  }

  let typeText = 'Resume Analysis';
  let typeColor = 'border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400';
  if (type === 'interview') {
    typeText = 'Mock Interview';
    typeColor = 'border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400';
  } else if (type === 'quiz') {
    typeText = 'Technical Quiz';
    typeColor = 'border-violet-100 dark:border-violet-900/50 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400';
  }

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 p-4 text-left hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-all cursor-pointer shadow-sm dark:shadow-none hover:scale-[1.002]"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${typeColor}`}>
        <Icon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{typeText}</span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            {meta}
          </span>
        </div>
        <p className="truncate text-sm font-bold text-slate-800 dark:text-zinc-150 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-450 transition-colors">
          {title}
        </p>
      </div>
      {badgeText && (
        <span className={`self-start sm:self-center shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold font-mono select-none uppercase tracking-wide ${badgeClasses}`}>
          {badgeText}
        </span>
      )}
    </motion.button>
  );
};

const RecentView = ({
  reports,
  interviews,
  quizHistory,
  loadingHistory,
  onNavigateReport,
  onNavigateInterview,
  onNavigateQuiz,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completedInterviews = useMemo(() => {
    return interviews.filter((i) => i.status === 'completed');
  }, [interviews]);

  const avgMatchScore = useMemo(() => {
    if (!reports.length) return 0;
    return Math.round(reports.reduce((sum, r) => sum + (r.matchScore || 0), 0) / reports.length);
  }, [reports]);

  const avgQuizScore = useMemo(() => {
    if (!quizHistory.length) return 0;
    return Math.round(
      quizHistory.reduce((sum, q) => sum + ((q.score / q.numQuestions) * 100), 0) / quizHistory.length
    );
  }, [quizHistory]);

  const allItems = useMemo(() => {
    const list = [];
    
    reports.forEach((r) => {
      let theme = 'warning';
      if (r.matchScore >= 80) theme = 'success';
      else if (r.matchScore < 50) theme = 'danger';

      list.push({
        id: r._id,
        type: 'report',
        title: r.jobTitle || 'Compatibility Report',
        meta: formatDate(r.createdAt),
        createdAt: new Date(r.createdAt || 0).getTime(),
        icon: FileText,
        badgeText: `${r.matchScore || 0}% Match`,
        badgeTheme: theme,
        onClick: () => onNavigateReport(r._id),
      });
    });

    completedInterviews.forEach((session) => {
      list.push({
        id: session._id,
        type: 'interview',
        title: session.jobTitle || 'Mock Interview',
        meta: `${session.focusArea || 'Interview'} • ${session.difficulty || 'Mid'}`,
        createdAt: new Date(session.createdAt || 0).getTime(),
        icon: MessageSquare,
        badgeText: 'Completed',
        badgeTheme: 'success',
        onClick: () => onNavigateInterview(session._id),
      });
    });

    quizHistory.forEach((quiz) => {
      const percentage = Math.round((quiz.score / quiz.numQuestions) * 100);
      let theme = 'warning';
      if (percentage >= 80) theme = 'success';
      else if (percentage < 50) theme = 'danger';

      list.push({
        id: quiz._id,
        type: 'quiz',
        title: quiz.topic || 'Skill Quiz',
        meta: `${quiz.difficulty} Difficulty`,
        createdAt: new Date(quiz.createdAt || 0).getTime(),
        icon: ClipboardCheck,
        badgeText: `${quiz.score} / ${quiz.numQuestions} (${percentage}%)`,
        badgeTheme: theme,
        onClick: () => onNavigateQuiz(quiz._id),
      });
    });

    return list.sort((a, b) => b.createdAt - a.createdAt);
  }, [reports, completedInterviews, quizHistory]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const tabMap = {
        all: null,
        reports: 'report',
        interviews: 'interview',
        quizzes: 'quiz'
      };
      const targetType = tabMap[activeTab];
      const matchesTab = !targetType || item.type === targetType;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.meta && item.meta.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [allItems, activeTab, searchQuery]);

  const isEmpty = allItems.length === 0;

  const tabs = [
    { id: 'all', label: 'All', icon: Activity, count: allItems.length },
    { id: 'reports', label: 'Analyses', icon: FileText, count: reports.length },
    { id: 'interviews', label: 'Interviews', icon: MessageSquare, count: completedInterviews.length },
    { id: 'quizzes', label: 'Quizzes', icon: ClipboardCheck, count: quizHistory.length },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="p-5 sm:p-6">
        <CardHeader
          icon={Clock}
          title="History"
          description="Browse your past resume analyses, mock interviews, and quiz sessions."
        />
      </Card>

      {loadingHistory ? (
        <div className="flex items-center justify-center py-16">
          <LoadingDots />
        </div>
      ) : isEmpty ? (
        <EmptyState message="No activity yet. Start by analyzing a resume or taking a quiz." />
      ) : (
        <div className="space-y-6">
          {/* Stats KPI dashboard */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <StatsCard
              icon={FileText}
              title="Resume Analyses"
              value={reports.length}
              subtext={reports.length > 0 ? `Avg. Match Score: ${avgMatchScore}%` : 'No analyses yet'}
              colorClass="border-blue-100 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
              delay={0.05}
              onClick={() => setActiveTab('reports')}
            />
            <StatsCard
              icon={MessageSquare}
              title="Mock Sessions"
              value={completedInterviews.length}
              subtext={`${completedInterviews.length} sessions completed`}
              colorClass="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
              delay={0.1}
              onClick={() => setActiveTab('interviews')}
            />
            <StatsCard
              icon={ClipboardCheck}
              title="Quizzes Taken"
              value={quizHistory.length}
              subtext={quizHistory.length > 0 ? `Avg. Score: ${avgQuizScore}%` : 'No quizzes yet'}
              colorClass="border-violet-100 dark:border-violet-900/50 bg-violet-50/60 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400"
              delay={0.15}
              onClick={() => setActiveTab('quizzes')}
            />
          </div>

          {/* Interactive Navigation and Filtering */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
            <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer select-none ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-zinc-100 shadow-sm'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-zinc-400'
                        : 'bg-slate-200/50 dark:bg-zinc-900/40 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          {/* History Feed list */}
          <div className="space-y-2 select-none">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <HistoryItem
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    meta={item.meta}
                    badgeText={item.badgeText}
                    badgeTheme={item.badgeTheme}
                    type={item.type}
                    onClick={item.onClick}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <p className="text-xs text-slate-500 dark:text-zinc-500 font-semibold">No results match your search/filter.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentView;
