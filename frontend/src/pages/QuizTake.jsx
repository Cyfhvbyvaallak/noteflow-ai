import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { QuizQuestion } from '../components/quiz/QuizQuestion';
import { QuizResultsCard } from '../components/quiz/QuizResultsCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await api.quizzes.get(id);
        setQuiz(data);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        toast.error('Quiz not found.');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [id]);

  const handleSelectAnswer = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleSubmit = async () => {
    const totalQuestions = quiz.questions?.length || 0;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const evaluation = await api.quizzes.submit(id, answers);
      setResult(evaluation);
      toast.success('Quiz submitted and graded instantly!');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <LoadingSkeleton className="h-8 w-1/3" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!quiz) return null;

  if (result) {
    return (
      <QuizResultsCard
        result={result}
        onRetake={handleRetake}
        onBackToStudy={() => navigate(`/lectures/${quiz.lecture_id}`)}
      />
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Top Breadcrumb & Quiz Info */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/lectures/${quiz.lecture_id}`)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </button>

        <Badge variant="purple" size="sm">
          {quiz.subject || 'Lecture Quiz'}
        </Badge>
      </div>

      {/* Progress Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span className="text-base font-black truncate">{quiz.title}</span>
          <span className="text-cyan-400 font-mono font-black">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <ProgressBar progress={progressPercent} variant="brand" height="h-2" />
      </div>

      {/* Active Question Panel */}
      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onSelectAnswer={handleSelectAnswer}
        />
      )}

      {/* Bottom Step Controls */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="secondary"
          size="md"
          icon={ChevronLeft}
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
        >
          Previous
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button
            variant="cyan"
            size="md"
            icon={ChevronRight}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="font-black"
          >
            Next Question
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            icon={Send}
            isLoading={submitting}
            onClick={handleSubmit}
            className="shadow-glow-emerald font-black"
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
