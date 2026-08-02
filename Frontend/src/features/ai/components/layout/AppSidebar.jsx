import React from 'react';
import {
  LayoutDashboard,
  FileSearch,
  MessageSquare,
  ClipboardCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../components/ui/Button';

export const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Dashboard home',
    icon: LayoutDashboard,
    category: 'workspace',
  },
  {
    id: 'analyze',
    label: 'Resume Analysis',
    description: 'Match resume to job',
    icon: FileSearch,
    category: 'workspace',
  },
  {
    id: 'mock',
    label: 'Mock Interview',
    description: 'AI-led practice session',
    icon: MessageSquare,
    category: 'workspace',
  },
  {
    id: 'quiz',
    label: 'Skill Quiz',
    description: 'Topic-based MCQ test',
    icon: ClipboardCheck,
    category: 'workspace',
  },
  {
    id: 'recent',
    label: 'History',
    description: 'Past reports & sessions',
    icon: Clock,
    category: 'archive',
  },
];

const AppSidebar = ({
  user,
  activeFeature,
  isCollapsed,
  isMobileOpen,
  onSelectFeature,
  onToggleCollapse,
  onCloseMobile,
  onNewSession,
  onLogout,
}) => {
  const workspaceItems = NAV_ITEMS.filter((item) => item.category === 'workspace');
  const archiveItems = NAV_ITEMS.filter((item) => item.category === 'archive');

  const renderNavGroup = (items, title) => (
    <div className="space-y-1.5">
      {title && !isCollapsed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none mb-2"
        >
          {title}
        </motion.p>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeFeature === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectFeature(item.id)}
            title={item.label}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left cursor-pointer transition-colors ${
              active ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-800 dark:hover:text-zinc-200'
            } ${isCollapsed ? 'lg:justify-center lg:px-0 lg:h-10' : 'h-11'}`}
          >
            {/* Left Border Active Indicator */}
            {active && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-2.5 bottom-2.5 w-[2.5px] bg-blue-600 dark:bg-blue-400 rounded-r-md z-15"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {/* Active Pill Background */}
            {active && (
              <motion.div
                layoutId="sidebar-active-bg"
                className="absolute inset-0 z-0 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            <div className="relative z-10 flex items-center justify-center shrink-0">
              <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={active ? 2 : 1.5} />
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 min-w-0 flex-1"
              >
                <p className="text-[12px] font-bold tracking-tight">{item.label}</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-medium group-hover:text-slate-600 dark:group-hover:text-zinc-400 transition-colors">
                  {item.description}
                </p>
              </motion.div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-35 bg-black lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{
          width: isMobileOpen ? 230 : isCollapsed ? 68 : 230,
          x: isMobileOpen ? 0 : undefined,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with Collapse Action */}
        <div 
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="flex h-16 items-center gap-3 border-b border-slate-200 dark:border-zinc-800 px-4 shrink-0 overflow-hidden select-none cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group/brand"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover/brand:border-blue-500 transition-colors relative">
            <Sparkles className="h-4.5 w-4.5" strokeWidth={1.5} />
            {isCollapsed && (
              <ChevronRight className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-full text-slate-400 dark:text-zinc-500 opacity-0 group-hover/brand:opacity-100 transition-opacity" />
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="min-w-0 flex-1 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-zinc-50 leading-none">PrepAI</p>
                <p className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 mt-1 select-none">Interview workspace</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full border border-blue-200/50 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400 select-none">
                  Beta
                </span>
                <ChevronLeft className="h-4 w-4 text-slate-400 dark:text-zinc-500 group-hover/brand:text-slate-600 dark:group-hover:text-zinc-300 transition-colors" />
              </div>
            </motion.div>
          )}
        </div>

        {/* New session */}
        <div className="border-b border-slate-200 dark:border-zinc-800 p-3 shrink-0 overflow-hidden">
          <Button
            variant="secondary"
            size="sm"
            onClick={onNewSession}
            className={`w-full h-9.5 ${isCollapsed ? 'lg:px-0 lg:justify-center' : 'justify-start'}`}
          >
            <Plus className="h-4 w-4 shrink-0 text-slate-400 dark:text-zinc-400" strokeWidth={1.5} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-bold"
              >
                New session
              </motion.span>
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto p-3 select-none">
          {renderNavGroup(workspaceItems, 'Workspace')}
          {renderNavGroup(archiveItems, 'Archive')}
        </nav>

        {/* Usage Panel */}
        <div className="border-t border-slate-200 dark:border-zinc-800 p-3 shrink-0 overflow-hidden">
          {isCollapsed ? (
            <div 
              className="flex h-10 w-full items-center justify-center rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-zinc-800/50 text-slate-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all cursor-help relative group"
              title={`${user?.tier || 'Free'} Plan Usage:\n• Resumes: ${user?.usage?.resumesAnalyzed || 0}${user?.tier === 'Free' || !user?.tier ? '/5' : ''}\n• Interviews: ${user?.usage?.interviewsStarted || 0}${user?.tier === 'Free' || !user?.tier ? '/1' : ''}\n• Quizzes: ${user?.usage?.quizzesTaken || 0}${user?.tier === 'Free' || !user?.tier ? '/3' : ''}`}
            >
              <BarChart3 className="h-4.5 w-4.5" strokeWidth={1.5} />
              
              {(user?.tier === 'Free' || !user?.tier) && (
                ((user?.usage?.resumesAnalyzed || 0) >= 5 || (user?.usage?.interviewsStarted || 0) >= 1 || (user?.usage?.quizzesTaken || 0) >= 3) ? (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                ) : ((user?.usage?.resumesAnalyzed || 0) >= 4 || (user?.usage?.quizzesTaken || 0) >= 2) ? (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                ) : null
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 p-3 shadow-sm space-y-3.5 backdrop-blur-sm relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <BarChart3 className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
                  Plan Usage
                </span>
                
                {user?.tier === 'Pro' || user?.tier === 'Enterprise' ? (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm border border-amber-400/25 select-none">
                    <Award className="h-2.5 w-2.5" />
                    {user.tier}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-300/30 dark:border-zinc-700/50 select-none">
                    Free
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {/* Resume Analyses */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-600 dark:text-zinc-400">Resumes</span>
                    <span className="text-slate-800 dark:text-zinc-200">
                      {user?.usage?.resumesAnalyzed || 0}
                      {user?.tier === 'Free' || !user?.tier ? ' / 5' : ''}
                    </span>
                  </div>
                  {(user?.tier === 'Free' || !user?.tier) && (
                    <div className="h-1 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          (user?.usage?.resumesAnalyzed || 0) >= 5 
                            ? 'bg-rose-500' 
                            : (user?.usage?.resumesAnalyzed || 0) >= 4 
                            ? 'bg-amber-500' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${Math.min(((user?.usage?.resumesAnalyzed || 0) / 5) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Mock Interviews */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-600 dark:text-zinc-400">Mock Interviews</span>
                    <span className="text-slate-800 dark:text-zinc-200">
                      {user?.usage?.interviewsStarted || 0}
                      {user?.tier === 'Free' || !user?.tier ? ' / 1' : ''}
                    </span>
                  </div>
                  {(user?.tier === 'Free' || !user?.tier) && (
                    <div className="h-1 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          (user?.usage?.interviewsStarted || 0) >= 1 
                            ? 'bg-rose-500' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${Math.min(((user?.usage?.interviewsStarted || 0) / 1) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Quizzes Taken */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-600 dark:text-zinc-400">Skill Quizzes</span>
                    <span className="text-slate-800 dark:text-zinc-200">
                      {user?.usage?.quizzesTaken || 0}
                      {user?.tier === 'Free' || !user?.tier ? ' / 3' : ''}
                    </span>
                  </div>
                  {(user?.tier === 'Free' || !user?.tier) && (
                    <div className="h-1 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          (user?.usage?.quizzesTaken || 0) >= 3 
                            ? 'bg-rose-500' 
                            : (user?.usage?.quizzesTaken || 0) >= 2 
                            ? 'bg-amber-500' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${Math.min(((user?.usage?.quizzesTaken || 0) / 3) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {(user?.tier === 'Free' || !user?.tier) && (
                <div className="pt-2 border-t border-slate-200/50 dark:border-zinc-800/50">
                  <button 
                    type="button"
                    onClick={() => alert('Upgrade flow is coming soon!')}
                    className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 hover:from-blue-500 hover:to-indigo-500 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white border border-blue-500/15 dark:border-blue-500/5 hover:border-transparent text-[10px] font-bold text-center tracking-tight transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-500/10"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-200 dark:border-zinc-800 p-3 shrink-0 overflow-hidden">
          <div className={`flex items-center gap-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.045] p-2.5 border border-slate-200 dark:border-zinc-800/50 ${isCollapsed ? 'lg:justify-center lg:p-1.5' : ''}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase select-none">
              {user?.username?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-xs font-bold text-slate-800 dark:text-zinc-200">{user?.username || 'User'}</p>
                <p className="truncate text-[9px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">{user?.email}</p>
              </motion.div>
            )}
            {!isCollapsed && (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg p-1 text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              type="button"
              onClick={onLogout}
              className="mt-2 hidden w-full items-center justify-center rounded-lg py-2.5 text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-600 dark:hover:text-zinc-300 lg:flex cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default AppSidebar;
