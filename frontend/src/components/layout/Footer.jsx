import React from 'react';
import { GraduationCap, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-8 px-6 text-sm text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span>NoteFlow AI</span>
          <span className="text-xs font-normal text-slate-400">© {new Date().getFullYear()} NoteFlow Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500">
          <Link to="/dashboard" className="hover:text-emerald-600 transition-colors">Dashboard</Link>
          <Link to="/record" className="hover:text-emerald-600 transition-colors">Record Lecture</Link>
          <Link to="/upload" className="hover:text-emerald-600 transition-colors">Upload</Link>
          <Link to="/settings" className="hover:text-emerald-600 transition-colors">System Settings</Link>
        </div>
      </div>
    </footer>
  );
}
