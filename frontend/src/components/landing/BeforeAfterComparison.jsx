import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XCircle,
  CheckCircle2,
  Sparkles,
  Clock,
  BookX,
  FileQuestion,
  FileCheck,
  Brain,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../common/Badge';

export function BeforeAfterComparison() {
  const [activeTab, setActiveTab] = useState('all');

  const painPoints = [
    {
      before: 'Write everything manually during fast-paced lectures',
      after: 'Record live or upload file; AI automatically captures 100% of speech',
      icon: Clock
    },
    {
      before: 'Miss critical exam formulas & definitions while frantically scribbling',
      after: 'Key points & definition glossaries are automatically extracted and tagged',
      icon: BookX
    },
    {
      before: 'Spend 4+ hours after class trying to synthesize unstructured notes',
      after: 'Executive 3-minute summary synthesized immediately after lecture ends',
      icon: Zap
    },
    {
      before: 'Flip through notebooks trying to find that one diagram or formula',
      after: 'Universal Command-Palette search indexes all semesters in 0.03 seconds',
      icon: FileQuestion
    },
    {
      before: 'Manually write practice questions or study blindly before exams',
      after: 'Self-testing MCQs generated with instant explanations and score tracking',
      icon: Brain
    }
  ];

  return (
    <section className="py-24 px-6 bg-white border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary" size="md">Study Transformation</Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Traditional Note-Taking <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600">
              vs NoteFlow AI Automation
            </span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Stop losing 70% of lecture information. Upgrade to an automated study workflow.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: Traditional Study (Red/Slate) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/40 border border-rose-200/80 space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
                <div className="flex items-center gap-2 text-rose-700 font-extrabold text-lg">
                  <XCircle className="w-6 h-6 text-rose-500" />
                  <span>Traditional Lecture Routine</span>
                </div>
                <span className="text-[11px] font-bold text-rose-600 px-2 py-0.5 rounded bg-rose-100">Manual / Outdated</span>
              </div>

              <div className="space-y-3.5">
                {painPoints.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 border border-rose-100 shadow-2xs">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      {item.before}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-100/70 text-rose-900 text-xs font-bold text-center">
              ⚠️ Result: Cognitive overload, incomplete notes & high exam anxiety
            </div>
          </div>

          {/* RIGHT: NoteFlow AI (Emerald/Navy) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white border border-emerald-500/40 space-y-6 flex flex-col justify-between shadow-elevated relative overflow-hidden">
            {/* Glow backdrop */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>With NoteFlow AI</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-300 px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                  ✨ AI Automated
                </span>
              </div>

              <div className="space-y-3.5">
                {painPoints.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                      {item.after}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center relative z-10 shadow-xs">
              🚀 Result: 100% lecture comprehension, active recall retention & top grades
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
