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
    <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto bg-[#FFFDF5] border-[#E8D5A0] shadow-warm-card">
      {/* Question Header */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-teal-800">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <h3 className="text-base sm:text-lg font-black text-stone-900 leading-relaxed">
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
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm font-bold'
                  : 'bg-[#FFF9E8] border-[#E8D5A0] hover:border-teal-400 hover:bg-[#FFFDF5] text-stone-800'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-sm'
                      : 'bg-[#FBF1D5] text-stone-700 border border-[#E8D5A0]'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed font-medium">{opt.text}</span>
              </div>

              <div className="shrink-0">
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-stone-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
