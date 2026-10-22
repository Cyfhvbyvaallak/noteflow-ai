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
    <section className="py-24 px-6 bg-[#FFF9E8] text-stone-900 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-emerald-200/30 via-amber-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="primary" size="md">
            Smart Workspace Architecture
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900">
            The AI Study Desk of the Future
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            All your lectures, flashcards, formula cheat sheets, and practice tests synthesized into one interconnected intelligence station.
          </p>
        </div>

        {/* 3D Layered Desk Station */}
        <div className="relative max-w-5xl mx-auto p-6 sm:p-12 rounded-3xl bg-[#FFFDF5] border border-[#E8D5A0] shadow-warm-card backdrop-blur-xl">
          {/* Main Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Card: Floating Smart Notebook */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="p-5 rounded-2xl bg-[#FFF9E8] border border-indigo-200 shadow-warm-sm space-y-3"
            >
              <div className="flex items-center justify-between text-xs pb-2 border-b border-indigo-100">
                <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                  <FileText className="w-4 h-4" /> Smart Notes Engine
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Live Sync</span>
              </div>
              <h4 className="font-extrabold text-sm text-stone-900">Linear Algebra: Eigenvalues</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Av = lambda * v. Characteristic polynomial: det(A - lambda * I) = 0.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Formula sheet extracted
              </div>
            </motion.div>

            {/* Centerpiece: AI Processing Hub */}
            <div className="relative flex flex-col items-center justify-center p-6 text-center space-y-4">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    '0 0 25px rgba(16,185,129,0.25)',
                    '0 0 50px rgba(16,185,129,0.45)',
                    '0 0 25px rgba(16,185,129,0.25)'
                  ]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white font-black shadow-glow-emerald cursor-default"
              >
                <Cpu className="w-10 h-10 text-white animate-pulse" />
              </motion.div>
              <div>
                <h3 className="font-black text-lg text-stone-900">NoteFlow AI Nexus</h3>
                <p className="text-xs text-emerald-700 font-bold">Speech-to-Study Automation Engine</p>
              </div>
            </div>

            {/* Right Card: Real-Time Practice Quiz Deck */}
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="p-5 rounded-2xl bg-[#FFF9E8] border border-emerald-200 shadow-warm-sm space-y-3"
            >
              <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-100">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <HelpCircle className="w-4 h-4" /> Active Recall Quiz
                </span>
                <span className="text-[10px] text-emerald-800 font-bold">Score: 100%</span>
              </div>
              <h4 className="font-extrabold text-sm text-stone-900">Cellular Respiration Quiz</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Q: What is the primary function of ATP synthase during oxidative phosphorylation?
              </p>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-900 font-bold flex items-center justify-between">
                <span>Synthesize ATP via proton gradient</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
