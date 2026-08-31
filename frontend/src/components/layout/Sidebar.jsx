import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  UploadCloud,
  FileText,
  Sparkles,
  BookOpen,
  HelpCircle,
  Search,
  Settings,
  GraduationCap,
  ChevronRight,
  Zap,
  Flame,
  Clock,
  Bot,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { AIAssistantModal } from '../ai/AIAssistantModal';

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, demoMode } = useAuth();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Record Lecture', path: '/record', icon: Mic, badge: 'Live', badgeVariant: 'danger' },
    { name: 'Upload Lecture', path: '/upload', icon: UploadCloud },
    { name: 'My Notes', path: '/notes', icon: FileText },
  ];

  const studyNav = [
    { name: 'AI Summaries', path: '/summaries', icon: Sparkles },
    { name: 'Revision Center', path: '/revision', icon: BookOpen },
    { name: 'Practice Quizzes', path: '/quizzes', icon: HelpCircle },
  ];

  const toolsNav = [
    { name: 'Global Search', path: '/search', icon: Search },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-950/90 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-all duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-white/[0.01]">
          <NavLink to="/dashboard" className="flex items-center gap-3 font-black text-lg text-white tracking-tight group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-glow-emerald group-hover:scale-105 transition-transform font-bold">
              <GraduationCap className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-white font-black text-base">NoteFlow <span className="text-emerald-400">AI</span></span>
              <span className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase mt-0.5">Study System</span>
            </div>
          </NavLink>
        </div>

        {/* Demo Mode Notification Badge */}
        {demoMode && (
          <div className="mx-3 mt-3 p-2.5 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-200 shadow-glow-emerald">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[11px] leading-tight text-white">Interactive Demo Active</div>
              <div className="text-[10px] text-emerald-300/80 truncate">4 preloaded study suites ready</div>
            </div>
          </div>
        )}

        {/* Navigation Scroll Area */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {/* MAIN SECTION */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Main Studio
            </div>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || 'primary'} size="sm" dot>
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* STUDY SECTION */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Smart Study
            </div>
            {studyNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* TOOLS & COPILOT */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              AI Tools
            </div>
            <button
              type="button"
              onClick={() => setIsAIChatOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-purple-300 hover:bg-purple-950/40 border border-purple-500/30 shadow-glow-purple transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                <span>AI Study Copilot</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 font-extrabold">
                Ask
              </span>
            </button>

            {toolsNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Study Streak Badge */}
        <div className="px-3 py-2">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white space-y-1.5 shadow-glass-card">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold flex items-center gap-1 text-emerald-400">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                5-Day Streak
              </span>
              <span className="text-[10px] text-slate-400 font-mono">100% Goal</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-1.5 rounded-full w-4/5" />
            </div>
          </div>
        </div>

        {/* Bottom User Card */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02]">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 shadow-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-black text-xs flex items-center justify-center shadow-glow-emerald">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Alex Vance'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'student@noteflow.ai'}</p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 hover:text-white" />
          </NavLink>
        </div>
      </aside>

      {/* AI Assistant Modal */}
      <AIAssistantModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </>
  );
}
