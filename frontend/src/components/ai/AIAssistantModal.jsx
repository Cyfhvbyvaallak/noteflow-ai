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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl bg-[#FFFDF5] border border-purple-300/80 rounded-3xl shadow-warm-hover flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-[#E8D5A0]/60 flex items-center justify-between bg-[#FFF9E8]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  NoteFlow AI Study Copilot
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 font-bold">
                    GPT-4o Ready
                  </span>
                </h3>
                <p className="text-xs text-stone-500">Context-aware lecture comprehension assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-[#FBF1D5] transition-colors"
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
                  <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-300 text-purple-700 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-br-none shadow-sm font-medium'
                      : 'bg-[#FFF9E8] border border-[#E8D5A0] text-stone-800 rounded-bl-none shadow-warm-sm whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-3 text-xs text-purple-700 font-bold p-2">
                <Bot className="w-4 h-4 animate-spin" />
                <span>AI is analyzing lecture concepts...</span>
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 2 && (
            <div className="px-6 py-2 border-t border-[#E8D5A0]/40 bg-[#FFF9E8]/40">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                Suggested Prompts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s.prompt)}
                    className="p-2.5 rounded-xl bg-[#FFFDF5] hover:bg-[#FFF9E8] border border-[#E8D5A0] hover:border-purple-400 text-left text-xs text-stone-700 hover:text-stone-900 transition-all line-clamp-1 cursor-pointer"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-4 border-t border-[#E8D5A0]/60 bg-[#FFFDF5]">
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
                className="flex-1 px-4 py-3 rounded-2xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 placeholder:text-stone-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
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
