import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Zap,
  BookOpen,
  HelpCircle,
  FileText,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Button } from '../common/Button';

export function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your NoteFlow AI Study Copilot. How can I assist your lecture understanding today? You can ask me to summarize concepts, explain complex equations, or generate mock exam questions.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const suggestedPrompts = [
    { text: '💡 Summarize Raft consensus election timeouts', prompt: 'Explain how randomized election timeouts prevent split-vote deadlocks in Raft protocol.' },
    { text: '⚛️ Explain Schrödinger wave equation concept', prompt: 'Break down the physical significance of the wave function and probability density in quantum mechanics.' },
    { text: '🧬 How does ATP Synthase generate energy?', prompt: 'Explain the rotary mechanism of ATP Synthase driven by the proton electrochemical gradient.' },
    { text: '📐 What are Eigenvalues and Eigenvectors?', prompt: 'Give an intuitive geometric explanation of matrix diagonalization and eigenvalues.' }
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let botResponse = `Here is the AI study breakdown for your inquiry:\n\n**Key Insight:** In this topic, the core principle revolves around decomposing complex behaviors into verifiable mathematical rules.\n\n• **Core Principle:** Ensures strict state consistency across all partitions.\n• **Exam High-Yield:** Remember the formula $$\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$$ or the majority quorum equation $$(N/2)+1$$.\n\nWould you like me to generate a 3-question self-testing quiz on this?`;
      
      if (query.toLowerCase().includes('raft') || query.toLowerCase().includes('consensus')) {
        botResponse = `**Raft Consensus Protocol Breakdown:**\n\n1. **Randomized Election Timouts:** Nodes choose random timers between 150ms-300ms to ensure one candidate times out first and collects the majority quorum before others split the votes.\n2. **Append-Only Safety:** Leaders never overwrite or truncate their logs; they strictly append.\n3. **Quorum Rule:** A log entry is committed only when replicated on a strict majority of nodes (e.g., 3 out of 5).`;
      } else if (query.toLowerCase().includes('quantum') || query.toLowerCase().includes('schrödinger') || query.toLowerCase().includes('wave')) {
        botResponse = `**Quantum Mechanics & Wave-Particle Duality:**\n\n• **De Broglie Relation:** $$\\lambda = \\frac{h}{p}$$, demonstrating that all matter exhibits wave properties.\n• **Schrödinger Equation:** $$i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi$$, describing how quantum states evolve deterministically over time.\n• **Born Rule:** The squared modulus $$|\\Psi(x,t)|^2$$ yields the spatial probability density of finding the particle at coordinate $$x$$.`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: botResponse }]);
      setIsThinking(false);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl bg-slate-900/95 border border-purple-500/30 rounded-3xl shadow-glow-purple flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-glow-purple">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  NoteFlow AI Study Copilot
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    GPT-4o Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Context-aware lecture comprehension assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-br-none shadow-glow-emerald font-medium'
                      : 'bg-slate-800/80 border border-white/10 text-slate-200 rounded-bl-none shadow-glass-card whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-3 text-xs text-purple-400 font-bold p-2">
                <Bot className="w-4 h-4 animate-spin" />
                <span>AI is analyzing lecture concepts...</span>
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 2 && (
            <div className="px-6 py-2 border-t border-white/5 bg-white/[0.01]">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Suggested Prompts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s.prompt)}
                    className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 hover:border-purple-500/40 text-left text-xs text-slate-300 hover:text-white transition-all line-clamp-1"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-4 border-t border-white/10 bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask NoteFlow AI about your lectures, formulas, or concepts..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isThinking}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-white/15 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
              />
              <Button
                type="submit"
                variant="purple"
                size="md"
                disabled={!input.trim() || isThinking}
                icon={Send}
              >
                Ask AI
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
