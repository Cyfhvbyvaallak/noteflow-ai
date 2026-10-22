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
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFDF5]/90 backdrop-blur-2xl border-b border-[#E8D5A0]/60 px-4 sm:px-6 flex items-center justify-between shadow-warm-sm">
      {/* Left: Mobile Toggle & AI Command Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-2xl text-stone-600 hover:text-stone-900 hover:bg-[#FBF1D5] lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global AI Search Trigger */}
        <div
          onClick={() => navigate('/search')}
          className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-[#FFF9E8] hover:bg-[#FBF1D5] text-stone-600 rounded-2xl cursor-pointer text-xs font-medium w-64 md:w-88 border border-[#E8D5A0] hover:border-emerald-500 shadow-inner transition-all group"
        >
          <Search className="w-4 h-4 text-stone-500 group-hover:text-emerald-600 transition-colors" />
          <span className="text-stone-600 group-hover:text-stone-900 font-medium">Search lectures, formulas, quizzes...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 ml-auto text-[10px] bg-[#FFFDF5] text-stone-600 px-2 py-0.5 rounded-lg border border-[#E8D5A0] font-mono shadow-xs">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
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

        {/* Sign Out */}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          title="Sign out"
          className="p-2 rounded-2xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
