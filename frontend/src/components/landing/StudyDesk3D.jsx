import React from 'react';
import { motion } from 'framer-motion';
import {
  Laptop,
  BookOpen,
  Sparkles,
  HelpCircle,
  Mic,
  FileText,
  Flame,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Badge } from '../common/Badge';

export function StudyDesk3D() {
  return (
    <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Gradients & Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="primary" size="md" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
            Smart Workspace Architecture
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            The AI Study Desk of the Future
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            All your lectures, flashcards, formula cheat sheets, and practice tests synthesized into one interconnected intelligence station.
          </p>
        </div>

        {/* 3D Holographic Layered Desk Station */}
        <div className="relative max-w-5xl mx-auto p-6 sm:p-12 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
          {/* Main Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Hologram: Floating Smart Notebook */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-elevated space-y-3"
            >
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  <FileText className="w-4 h-4" /> Smart Notes Engine
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Live Sync</span>
              </div>
              <h4 className="font-extrabold text-sm text-white">Linear Algebra: Eigenvalues</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Av = lambda * v. Characteristic polynomial: det(A - lambda * I) = 0.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Formula sheet extracted
              </div>
            </motion.div>

            {/* Centerpiece: AI Processing Hub */}
            <div className="relative flex flex-col items-center justify-center p-6 text-center space-y-4">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    '0 0 30px rgba(16,185,129,0.3)',
                    '0 0 60px rgba(16,185,129,0.6)',
                    '0 0 30px rgba(16,185,129,0.3)'
                  ]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-glow-emerald cursor-default"
              >
                <Cpu className="w-10 h-10 text-white animate-pulse" />
              </motion.div>
              <div>
                <h3 className="font-black text-lg text-white">NoteFlow AI Nexus</h3>
                <p className="text-xs text-emerald-400 font-bold">Speech-to-Study Automation Engine</p>
              </div>
            </div>

            {/* Right Hologram: Real-Time Practice Quiz Deck */}
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-elevated space-y-3"
            >
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <HelpCircle className="w-4 h-4" /> Active Recall Quiz
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Score: 100%</span>
              </div>
              <h4 className="font-extrabold text-sm text-white">Cellular Respiration Quiz</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Q: What is the primary function of ATP synthase during oxidative phosphorylation?
              </p>
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-bold flex items-center justify-between">
                <span>Synthesize ATP via proton gradient</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
