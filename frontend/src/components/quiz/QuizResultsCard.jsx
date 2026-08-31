import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export function QuizResultsCard({ result, onRetake, onBackToStudy }) {
  const isPassed = result.percentage >= 70;

  useEffect(() => {
    if (result.percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [result.percentage]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Score Overview Card */}
      <Card className="p-8 text-center space-y-6 shadow-elevated border-slate-200 bg-white">
        <div
          className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
            isPassed
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/25'
              : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/25'
          }`}
        >
          <Trophy className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <Badge variant={isPassed ? 'success' : 'warning'} size="lg">
            {isPassed ? 'Quiz Mastered 🎉' : 'Keep Practicing 📚'}
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {result.score} / {result.total_questions}
          </h2>
          <p className="text-lg text-slate-600 font-bold">
            Score: <span className={isPassed ? 'text-emerald-600 font-black' : 'text-amber-600 font-black'}>{result.percentage}%</span>
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {isPassed
            ? 'Outstanding work! You have demonstrated high factual mastery over this lecture.'
            : 'Good effort! Review the detailed answer explanations below to solidify your exam readiness.'}
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="secondary" size="md" icon={RotateCcw} onClick={onRetake}>
            Retake Quiz
          </Button>
          <Button variant="primary" size="md" icon={BookOpen} onClick={onBackToStudy} className="shadow-glow-emerald">
            Back to Study Materials
          </Button>
        </div>
      </Card>

      {/* In-depth Answer Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 px-1">
          Detailed Answer Breakdown & Explanations
        </h3>

        {result.results.map((item, idx) => (
          <Card key={idx} className="p-6 space-y-4 border-slate-200 bg-white shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.question}
                </h4>
              </div>
              <Badge variant={item.is_correct ? 'success' : 'danger'} size="sm" dot>
                {item.is_correct ? 'Correct' : 'Incorrect'}
              </Badge>
            </div>

            {/* User choice vs Correct answer */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 min-w-[90px]">Your Answer:</span>
                <span
                  className={`font-bold ${
                    item.is_correct ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {item.user_answer ? `Option ${item.user_answer}` : 'Unanswered'}
                </span>
              </div>
              {!item.is_correct && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 min-w-[90px]">Correct Answer:</span>
                  <span className="font-bold text-emerald-700">Option {item.correct_answer}</span>
                </div>
              )}
            </div>

            {/* AI Fact Grounding Explanation */}
            {item.explanation && (
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" /> Lecture Grounding & Explanation:
                </span>
                <p className="leading-relaxed text-emerald-900">{item.explanation}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
