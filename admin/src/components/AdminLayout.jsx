import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, LogOut, Shield, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Analytics', href: '/', icon: LayoutDashboard },
    { name: 'Users Control', href: '/users', icon: Users },
    { name: 'Sessions / Tasks', href: '/sessions', icon: Activity },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-zinc-950 font-['Plus_Jakarta_Sans',sans-serif] antialiased text-zinc-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-zinc-900 border-r border-zinc-800/80
        transform lg:transform-none lg:opacity-100 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'}
      `}>
        {/* Collapsible Brand Logo header - Tapping this toggles collapsed view */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-5 border-b border-zinc-800/60 flex items-center justify-between shrink-0 hover:bg-zinc-800/35 transition cursor-pointer select-none"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <Shield className="w-4.5 h-4.5" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold text-white tracking-wide text-xs block uppercase font-mono">PrepAI Admin</span>
                <span className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase font-mono mt-0.5 block">Console</span>
              </motion.div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }} 
              className="lg:hidden text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items (Stretches flex, uses pb-24 padding to prevent layout overlapping with absolute bottom profile card) */}
        <nav className="flex-grow overflow-y-auto p-4 pb-24 space-y-1.5 mt-6 relative z-10 select-none">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  relative flex items-center rounded-lg text-xs font-semibold tracking-wide transition-all border
                  ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-2.5'}
                  ${active 
                    ? 'text-sky-400 font-bold border-sky-900/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30 border-transparent'
                  }
                `}
                title={isCollapsed ? item.name : ''}
              >
                {active && (
                  <motion.div
                    layoutId="admin-sidebar-active-bg"
                    className="absolute inset-0 z-0 rounded-lg bg-sky-950/20 border border-sky-900/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {active && (
                  <motion.div
                    layoutId="admin-sidebar-active-indicator"
                    className={`absolute bg-sky-400 rounded-md
                      ${isCollapsed ? 'left-1 top-2.5 bottom-2.5 w-[2px]' : 'left-0 top-2.5 bottom-2.5 w-[2.5px]'}
                    `}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4.5 h-4.5 relative z-10 ${active ? 'text-sky-400' : 'text-zinc-500'}`} />
                {!isCollapsed && (
                  <span className="relative z-10">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar / Admin Profile (Pinned to absolute bottom of the sidebar wrapper) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-900 z-20 shrink-0">
          <div className={`flex items-center rounded-lg bg-zinc-950 border border-zinc-800/55 shadow-sm transition-all
            ${isCollapsed ? 'flex-col gap-2 p-2' : 'gap-3 p-2.5'}
          `}>
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-bold text-sky-400 border border-zinc-800 uppercase shrink-0">
              {user.username ? user.username.substring(0, 2) : 'AD'}
            </div>
            {!isCollapsed ? (
              <>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-bold text-white truncate">{user.username}</p>
                  <p className="text-[9px] text-zinc-500 truncate mt-0.5">{user.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors cursor-pointer mt-1"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex min-h-screen flex-col transition-all duration-300
        ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
      `}>
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-30 min-h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-zinc-400 tracking-tight text-[10px] uppercase font-mono hidden sm:block truncate">
              {location.pathname === '/' ? 'System Performance metrics' : 
               location.pathname === '/users' ? 'User Database Control' : 
               location.pathname === '/sessions' ? 'Activity Session Logs' : 'Admin Console'}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a 
              href={import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 px-2.5 sm:px-3 text-xs text-zinc-400 hover:text-white font-semibold transition"
            >
              <span className="hidden sm:inline">Launch App</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
