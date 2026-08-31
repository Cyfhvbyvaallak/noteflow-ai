import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Mic,
  FileText,
  Sparkles,
  BookOpen,
  HelpCircle,
  Brain,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';

export function StudyCore3D() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-xl aspect-square mx-auto perspective-1000 flex items-center justify-center select-none"
    >
      {/* Radial Background Glows (Purple + Cyan + Emerald) */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-4 inset-x-12 h-20 bg-gradient-radial from-emerald-500/30 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* 3D Tilting Stage */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Futuristic Glowing Base Platform */}
        <div
          className="absolute bottom-6 w-80 h-80 rounded-full border border-cyan-500/30 bg-gradient-to-t from-cyan-950/40 to-transparent pointer-events-none shadow-glow-cyan"
          style={{ transform: 'rotateX(75deg) translateZ(-40px)' }}
        />

        {/* Outer Orbital Neon Ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[420px] h-[420px] rounded-full border border-purple-500/30 border-dashed pointer-events-none"
          style={{ transform: 'rotateX(65deg) rotateY(15deg)' }}
        />

        {/* Outer Orbital Neon Ring 2 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[330px] h-[330px] rounded-full border border-cyan-400/35 pointer-events-none"
          style={{ transform: 'rotateX(55deg) rotateY(-20deg)' }}
        />

        {/* ================= CENTRAL GLOWING AI BRAIN / INTELLIGENCE CORE ================= */}
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
            boxShadow: [
              '0 0 50px rgba(139,92,246,0.5), inset 0 0 30px rgba(6,182,212,0.4)',
              '0 0 85px rgba(6,182,212,0.7), inset 0 0 45px rgba(139,92,246,0.6)',
              '0 0 50px rgba(139,92,246,0.5), inset 0 0 30px rgba(6,182,212,0.4)',
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-20 w-32 h-32 rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 border-2 border-cyan-400/60 flex flex-col items-center justify-center p-3 text-center shadow-2xl backdrop-blur-2xl"
          style={{ transform: 'translateZ(70px)' }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 shadow-glow-cyan mb-1.5 font-bold">
            <Brain className="w-7 h-7 text-slate-950 animate-pulse" />
          </div>
          <span className="text-[11px] font-black tracking-widest text-cyan-300 uppercase">NoteFlow</span>
          <span className="text-[9px] font-extrabold text-purple-300">AI Study Core</span>
        </motion.div>

        {/* ================= FLOATING CARD 1: 🎙️ LECTURE AUDIO (Top-Left) ================= */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-2 left-0 z-30 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-rose-500/40 shadow-glow-rose flex items-center gap-2.5 max-w-[210px]"
          style={{ transform: 'translateZ(100px)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-sm shrink-0 animate-mic-pulse">
            <Mic className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-400">Live Speech</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            </div>
            <p className="text-[11px] font-extrabold text-white truncate">Quantum Mechanics</p>
            {/* Neon audio bars */}
            <div className="flex items-end gap-0.5 h-2 mt-1">
              <div className="w-1 bg-emerald-400 rounded-full h-full wave-bar-neon" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 bg-cyan-400 rounded-full h-2/3 wave-bar-neon" style={{ animationDelay: '0.3s' }} />
              <div className="w-1 bg-purple-400 rounded-full h-4/5 wave-bar-neon" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 bg-emerald-400 rounded-full h-1/2 wave-bar-neon" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </motion.div>

        {/* ================= FLOATING CARD 2: 📝 SYNCHRONIZED TRANSCRIPT (Top-Right) ================= */}
        <motion.div
          animate={{
            y: [5, -5, 5],
            rotate: [2, -1, 2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="absolute top-6 right-0 z-25 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-glow-cyan flex items-center gap-2.5 max-w-[220px]"
          style={{ transform: 'translateZ(85px)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
            <FileText className="w-4 h-4 text-slate-950" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-cyan-400">Speech-to-Text</span>
            <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight font-mono">
              "λ = h / p (de Broglie wave duality)"
            </p>
          </div>
        </motion.div>

        {/* ================= FLOATING CARD 3: ✨ EXECUTIVE AI SUMMARY (Bottom-Left) ================= */}
        <motion.div
          animate={{
            y: [-7, 5, -7],
            rotate: [1, -2, 1]
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-4 left-0 z-30 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white backdrop-blur-2xl border border-emerald-500/50 shadow-glow-emerald max-w-[220px]"
          style={{ transform: 'translateZ(110px)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider">Executive AI Summary</span>
          </div>
          <p className="text-[10px] text-slate-200 leading-tight">
            ✓ 5 Key takeaways extracted<br />
            ✓ High-yield exam points tagged
          </p>
        </motion.div>

        {/* ================= FLOATING CARD 4: ❓ PRACTICE QUIZ (Bottom-Right) ================= */}
        <motion.div
          animate={{
            y: [5, -7, 5],
            rotate: [-1, 2, -1]
          }}
          transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute bottom-8 right-0 z-30 p-3 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-purple-500/50 shadow-glow-purple max-w-[220px]"
          style={{ transform: 'translateZ(95px)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-300">Practice Quiz</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">100% Match</span>
          </div>
          <p className="text-[10px] font-bold text-white line-clamp-1 mb-1">
            Q: What is the de Broglie wavelength?
          </p>
          <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>λ = h / p (Correct)</span>
          </div>
        </motion.div>

        {/* Connecting Laser Conduits */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-50">
          <line x1="25%" y1="20%" x2="50%" y2="50%" stroke="url(#coreGrad1)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="url(#coreGrad2)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="url(#coreGrad1)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="url(#coreGrad2)" strokeWidth="1.5" strokeDasharray="4 4" />
          <defs>
            <linearGradient id="coreGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="coreGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}
