import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Sparkles,
  Key,
  BookOpen,
  HelpCircle,
  Search,
  Check,
  CheckCircle2,
  ArrowRight,
  Clock,
  Layers,
  Copy,
  Download
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function InteractiveWorkflow() {
  const [selectedOutput, setSelectedOutput] = useState('summary');

  const outputs = [
    {
      id: 'transcript',
      title: 'Speech-to-Text Transcript',
      icon: FileText,
      tag: 'Raw Capture',
      color: 'from-blue-600 to-indigo-600',
      description: 'Verbatim transcription synchronized with timestamps, speaker separation, and term search.'
    },
    {
      id: 'summary',
      title: 'Executive AI Summary',
      icon: Sparkles,
      tag: 'Synthesized',
      color: 'from-emerald-600 to-teal-600',
      description: 'Concise executive summary distilling 60-minute lectures into structured 3-minute reads.'
    },
    {
      id: 'key_points',
      title: 'Key Concept Extraction',
      icon: Key,
      tag: 'Prioritized',
      color: 'from-amber-500 to-orange-600',
      description: 'Extracts critical principles categorized by priority: Critical, High, and Medium.'
    },
    {
      id: 'revision',
      title: 'Exam Revision Kit',
      icon: BookOpen,
      tag: 'Active Recall',
      color: 'from-purple-600 to-pink-600',
      description: 'Curated definition glossaries, formula sheets, and high-probability exam topics.'
    },
    {
      id: 'quiz',
      title: 'Practice Quiz System',
      icon: HelpCircle,
      tag: 'Auto-Evaluated',
      color: 'from-emerald-500 to-cyan-600',
      description: 'Multiple choice & True/False questions generated strictly from lecture transcripts.'
    },
    {
      id: 'search',
      title: 'Universal Search Index',
      icon: Search,
      tag: 'Instant Lookup',
      color: 'from-slate-700 to-slate-900',
      description: 'Cross-resource search finding definitions, equations, and slides in milliseconds.'
    }
  ];

  return (
    <section id="ai-tools" className="py-24 px-6 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Output AI Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            One Lecture. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Six Intelligent Outputs.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Click on any intelligent output below to preview how NoteFlow AI transforms spoken words into structured study materials.
          </p>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (5 Cols): Interactive Output Selectors */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-xs text-white shadow-md">
                  CS
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Consensus & The Raft Protocol</h4>
                  <p className="text-[11px] text-slate-400">Computer Science • 52 min lecture</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PROCESSED
              </span>
            </div>

            {outputs.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedOutput === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedOutput(item.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/80 shadow-glow-emerald scale-[1.02]'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.title}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column (7 Cols): Dynamic Live Interactive Preview Card */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl min-h-[440px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {selectedOutput === 'summary' && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Executive AI Summary</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Synthesized in 2.1s</span>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
                      <p className="font-bold text-white text-base">
                        💡 Core Thesis & Overview:
                      </p>
                      <p>
                        The Raft consensus protocol was designed as an understandable alternative to Multi-Paxos for managing replicated state machines. It decomposes distributed consensus into three distinct sub-problems: <strong>Leader Election</strong>, <strong>Log Replication</strong>, and <strong>Safety</strong>.
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                          Key Takeaways
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                            <span className="font-bold text-emerald-300">1. Strong Leader Model</span>
                            <p className="text-slate-400">All log entries flow strictly from Leader to Followers.</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                            <span className="font-bold text-emerald-300">2. Randomized Timeouts</span>
                            <p className="text-slate-400">150ms-300ms randomized timers eliminate split votes.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOutput === 'transcript' && (
                  <motion.div
                    key="transcript"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                        <FileText className="w-4 h-4" />
                        <span>Speech-to-Text Transcription</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">100% Accuracy</span>
                    </div>

                    <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto">
                      <p><span className="text-emerald-400">[00:00:15] Professor:</span> "Good morning everyone. Today we are diving into distributed consensus protocols."</p>
                      <p><span className="text-emerald-400">[00:01:40] Professor:</span> "Specifically, we will contrast the complexity of Multi-Paxos with the structured elegance of Raft."</p>
                      <p><span className="text-emerald-400">[00:04:12] Professor:</span> "Notice how Raft breaks the system down into three orthogonal sub-problems: Leader election, log replication, and safety guarantees."</p>
                    </div>
                  </motion.div>
                )}

                {selectedOutput === 'key_points' && (
                  <motion.div
                    key="key_points"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <Key className="w-4 h-4" />
                        <span>Prioritized Key Concepts</span>
                      </div>
                      <span className="text-xs text-amber-400 font-bold">3 Critical Insights</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-3">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500 text-white mt-0.5">CRITICAL</span>
                        <div>
                          <h5 className="font-bold text-sm text-white">Quorum Agreement Rule</h5>
                          <p className="text-xs text-slate-300 mt-0.5">A log entry is committed only when replicated on a strict majority (N/2 + 1) of nodes.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 mt-0.5">HIGH</span>
                        <div>
                          <h5 className="font-bold text-sm text-white">Leader Append-Only Safety</h5>
                          <p className="text-xs text-slate-300 mt-0.5">A leader never overwrites or truncates its own log entries; it only appends new ones.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOutput === 'revision' && (
                  <motion.div
                    key="revision"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                        <BookOpen className="w-4 h-4" />
                        <span>Exam Revision Flashcards & Glossary</span>
                      </div>
                      <span className="text-xs text-purple-400 font-bold">Exam Ready</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-800/90 border border-purple-500/40 space-y-2">
                        <div className="text-[10px] font-extrabold uppercase text-purple-400">Term</div>
                        <h5 className="font-extrabold text-sm text-white">Heartbeat Interval</h5>
                        <p className="text-slate-300">Periodic empty AppendEntries RPCs sent to prevent followers from starting elections.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-800/90 border border-purple-500/40 space-y-2">
                        <div className="text-[10px] font-extrabold uppercase text-purple-400">Exam Focus</div>
                        <h5 className="font-extrabold text-sm text-white">Split Brain Prevention</h5>
                        <p className="text-slate-300">Guaranteed by enforcing overlapping majorities in disjoint cluster partitions.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOutput === 'quiz' && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <HelpCircle className="w-4 h-4" />
                        <span>Self-Testing Practice Quiz</span>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold">Question 1 of 5</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="font-bold text-sm text-white">
                        In a Raft cluster of 5 nodes, what is the minimum quorum required to commit a log entry?
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">A) 2 nodes</div>
                        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/70 text-emerald-300 font-bold flex items-center justify-between">
                          <span>B) 3 nodes</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">C) 4 nodes</div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">D) 5 nodes</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOutput === 'search' && (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <Search className="w-4 h-4" />
                        <span>Cross-Resource Global Index</span>
                      </div>
                      <span className="text-xs text-cyan-400 font-mono">0.03s Response</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                      <Search className="w-4 h-4 text-emerald-400" />
                      <span>Query: <strong className="text-white">"election timeout"</strong></span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between">
                        <span className="font-bold text-white">Transcript Match (00:14:22)</span>
                        <span className="text-emerald-400 text-[11px]">150ms-300ms window</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between">
                        <span className="font-bold text-white">Quiz Question #3</span>
                        <span className="text-emerald-400 text-[11px]">Split-vote prevention</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Fully grounded in lecture speech
                </span>
                <span className="text-emerald-400 font-bold">1-Click Study Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
