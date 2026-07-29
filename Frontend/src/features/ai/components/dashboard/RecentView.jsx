import React from 'react';
import { FileText, MessageSquare, ClipboardCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
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
  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/12 bg-slate-100/50 dark:bg-white/[0.035] p-10 text-center select-none">
    <Clock className="mx-auto h-6 w-6 text-slate-400 dark:text-zinc-500" strokeWidth={1.5} />
    <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">{message}</p>
  </div>
);

const HistoryItem = ({ icon: Icon, title, meta, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.035] p-4 text-left hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-all cursor-pointer shadow-sm dark:shadow-none"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-100 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400">
      <Icon className="h-4 w-4 transition-colors" strokeWidth={1.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-sky-600 dark:group-hover:text-zinc-50 transition-colors">{title}</p>
      <p className="mt-1 text-[10px] font-medium text-slate-400 dark:text-zinc-500">{meta}</p>
    </div>
    {badge && (
      <span className="shrink-0 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/60 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-zinc-300 font-mono select-none">
        {badge}
      </span>
    )}
  </button>
);

const RecentView = ({
  reports,
  interviews,
  quizHistory,
  loadingHistory,
  onNavigateReport,
  onNavigateInterview,
  onNavigateQuiz,
}) => {
  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const isEmpty =
    !loadingHistory && reports.length === 0 && completedInterviews.length === 0 && quizHistory.length === 0;

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
        <div className="space-y-8 select-none">
          {reports.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Resume Reports
              </h3>
              <div className="space-y-2">
                {reports.map((report) => (
                  <HistoryItem
                    key={report._id}
                    icon={FileText}
                    title={report.jobTitle || 'Compatibility Report'}
                    meta={formatDate(report.createdAt)}
                    badge={`${report.matchScore || 0}% match`}
                    onClick={() => onNavigateReport(report._id)}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {completedInterviews.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Mock Interviews
              </h3>
              <div className="space-y-2">
                {completedInterviews.map((session) => (
                  <HistoryItem
                    key={session._id}
                    icon={MessageSquare}
                    title={session.jobTitle || 'Mock Interview'}
                    meta={`${session.focusArea || 'Interview'} · ${session.difficulty || 'Mid'} · ${formatDate(session.createdAt)}`}
                    badge={session.status}
                    onClick={() => onNavigateInterview(session._id)}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {quizHistory.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Quizzes
              </h3>
              <div className="space-y-2">
                {quizHistory.map((quiz) => (
                  <HistoryItem
                    key={quiz._id}
                    icon={ClipboardCheck}
                    title={quiz.topic}
                    meta={`${quiz.difficulty} · ${formatDate(quiz.createdAt)}`}
                    badge={`${quiz.score} / ${quiz.numQuestions}`}
                    onClick={() => onNavigateQuiz(quiz._id)}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentView;
