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
          className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-550 select-none mb-2"
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
              active ? 'text-zinc-50 font-bold' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
            } ${isCollapsed ? 'lg:justify-center lg:px-0 lg:h-10' : 'h-11'}`}
          >
            {/* Left Border Active Indicator */}
            {active && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-2.5 bottom-2.5 w-[2.5px] bg-cyan-200 rounded-r-md z-15"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {/* Active Pill Background */}
            {active && (
              <motion.div
                layoutId="sidebar-active-bg"
                className="absolute inset-0 z-0 rounded-xl border border-cyan-200/16 bg-cyan-200/[0.08]"
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
                <p className="text-[10px] text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">
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
        className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-white/10 bg-zinc-950/86 shadow-[20px_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:sticky lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with Collapse Action */}
        <div 
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="flex h-16 items-center gap-3 border-b border-white/10 px-4 shrink-0 overflow-hidden select-none cursor-pointer hover:bg-white/[0.04] transition-colors group/brand"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 group-hover/brand:border-cyan-100/40 transition-colors relative">
            <Sparkles className="h-4.5 w-4.5" strokeWidth={1.5} />
            {isCollapsed && (
              <ChevronRight className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-zinc-950 border border-white/10 rounded-full text-zinc-500 opacity-0 group-hover/brand:opacity-100 transition-opacity" />
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
                <p className="text-sm font-bold tracking-tight text-zinc-50 leading-none">PrepAI</p>
                <p className="text-[10px] font-medium text-zinc-500 mt-1 select-none">Interview workspace</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[9px] font-bold text-cyan-200/70 select-none">
                  Beta
                </span>
                <ChevronLeft className="h-4 w-4 text-zinc-500 group-hover/brand:text-zinc-350 transition-colors" />
              </div>
            </motion.div>
          )}
        </div>

        {/* New session */}
        <div className="border-b border-white/10 p-3 shrink-0 overflow-hidden">
          <Button
            variant="secondary"
            size="sm"
            onClick={onNewSession}
            className={`w-full h-9.5 ${isCollapsed ? 'lg:px-0 lg:justify-center' : 'justify-start'}`}
          >
            <Plus className="h-4 w-4 shrink-0 text-zinc-400" strokeWidth={1.5} />
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

        {/* User Profile Footer */}
        <div className="border-t border-white/10 p-3 shrink-0 overflow-hidden">
          <div className={`flex items-center gap-2.5 rounded-2xl bg-white/[0.045] p-2.5 border border-white/10 ${isCollapsed ? 'lg:justify-center lg:p-1.5' : ''}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/10 text-xs font-bold text-cyan-100 uppercase select-none">
              {user?.username?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-xs font-bold text-zinc-200">{user?.username || 'User'}</p>
                <p className="truncate text-[9px] font-medium text-zinc-550 mt-0.5">{user?.email}</p>
              </motion.div>
            )}
            {!isCollapsed && (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg p-1 text-zinc-550 hover:bg-white/[0.06] hover:text-zinc-300 transition-colors cursor-pointer"
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
              className="mt-2 hidden w-full items-center justify-center rounded-lg py-2.5 text-zinc-550 hover:bg-white/[0.06] hover:text-zinc-300 lg:flex cursor-pointer"
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
