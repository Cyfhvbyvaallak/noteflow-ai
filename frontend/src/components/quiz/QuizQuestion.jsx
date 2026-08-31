import React from 'react';
import { Check, Circle } from 'lucide-react';
import { Card } from '../common/Card';

export function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer
}) {
  const options = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d },
  ].filter((opt) => opt.text && opt.text.trim());

  return (
    <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto bg-slate-900/80 border-white/10 shadow-glass-card">
      {/* Question Header */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Selectable Option Cards */}
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;
          return (
            <div
              key={opt.key}
              onClick={() => onSelectAnswer(question.id, opt.key)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-glow-emerald font-bold'
                  : 'bg-slate-950/70 border-white/10 hover:border-cyan-500/40 hover:bg-slate-950 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 shadow-glow-emerald'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed font-medium">{opt.text}</span>
              </div>

              <div className="shrink-0">
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
