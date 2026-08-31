import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Mic,
  UploadCloud,
  LogOut,
  Sparkles,
  Command,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user, logout, demoMode } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shadow-glass">
      {/* Left: Mobile Toggle & AI Command Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global AI Search Trigger */}
        <div
          onClick={() => navigate('/search')}
          className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 rounded-2xl cursor-pointer text-xs font-medium w-64 md:w-88 border border-white/10 hover:border-cyan-500/40 shadow-inner transition-all group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-slate-400 group-hover:text-slate-200">Search lectures, formulas, quizzes...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 ml-auto text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg border border-white/10 font-mono shadow-xs">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>
      </div>

      {/* Right Actions & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Upload Action */}
        <Button
          variant="secondary"
          size="sm"
          icon={UploadCloud}
          onClick={() => navigate('/upload')}
          className="hidden md:inline-flex"
        >
          Upload Lecture
        </Button>

        {/* Record Action */}
        <Button
          variant="primary"
          size="sm"
          icon={Mic}
          onClick={() => navigate('/record')}
        >
          <span className="hidden xs:inline">Record Live</span>
        </Button>

        {/* Demo Indicator */}
        {demoMode && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 rounded-xl text-xs font-black shadow-glow-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Demo Mode</span>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          title="Sign out"
          className="p-2 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
