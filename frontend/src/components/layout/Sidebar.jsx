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
  const { user } = useAuth();
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
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#FFFDF5]/95 backdrop-blur-2xl border-r border-[#E8D5A0]/60 flex flex-col transition-all duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E8D5A0]/60 bg-[#FFF9E8]/40">
          <NavLink to="/dashboard" className="flex items-center gap-3 font-black text-lg text-stone-900 tracking-tight group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-glow-emerald group-hover:scale-105 transition-transform font-bold">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-stone-900 font-black text-base">NoteFlow <span className="text-emerald-600">AI</span></span>
              <span className="text-[9px] text-stone-500 font-extrabold tracking-widest uppercase mt-0.5">Study System</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Scroll Area */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {/* MAIN SECTION */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-stone-500">
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
                      ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-400/50 shadow-sm'
                      : 'text-stone-600 hover:bg-[#FFF9E8] hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-700' : 'text-stone-500 group-hover:text-stone-800'
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
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-stone-500">
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
                      ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-400/50 shadow-sm'
                      : 'text-stone-600 hover:bg-[#FFF9E8] hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-700' : 'text-stone-500 group-hover:text-stone-800'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-sm" />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* TOOLS & COPILOT */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-stone-500">
              AI Tools
            </div>
            <button
              type="button"
              onClick={() => setIsAIChatOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-purple-900 bg-purple-50/80 hover:bg-purple-100 border border-purple-300 shadow-sm transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-purple-600 group-hover:rotate-12 transition-transform" />
                <span>AI Study Copilot</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-200 text-purple-800 font-extrabold">
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
                      ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-400/50 shadow-sm'
                      : 'text-stone-600 hover:bg-[#FFF9E8] hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-700' : 'text-stone-500 group-hover:text-stone-800'
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
          <div className="p-3 rounded-2xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 space-y-1.5 shadow-warm-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold flex items-center gap-1 text-emerald-800">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
                5-Day Streak
              </span>
              <span className="text-[10px] text-stone-500 font-mono">100% Goal</span>
            </div>
            <div className="w-full bg-[#E8D5A0]/40 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full w-4/5" />
            </div>
          </div>
        </div>

        {/* Bottom User Card */}
        <div className="p-3 border-t border-[#E8D5A0]/60 bg-[#FFF9E8]/40">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FFFDF5] transition-all border border-transparent hover:border-[#E8D5A0]"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-900 truncate">{user?.name || 'Alex Vance'}</p>
              <p className="text-[10px] text-stone-500 truncate">{user?.email || 'student@noteflow.ai'}</p>
            </div>
            <Settings className="w-4 h-4 text-stone-400 hover:text-stone-700" />
          </NavLink>
        </div>
      </aside>

      {/* AI Assistant Modal */}
      <AIAssistantModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </>
  );
}
