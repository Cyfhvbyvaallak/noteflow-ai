import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Trophy,
  Play,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { api } from '../services/api';

export function QuizHub() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const data = await api.quizzes.list();
        setQuizzes(data || []);
      } catch (err) {
        console.error('Error loading quizzes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.subject && q.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-glass-card border border-white/10 space-y-2">
        <Badge variant="purple" size="md">Active Recall Testing</Badge>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Practice Quiz Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
          Self-test your conceptual mastery with AI practice quizzes generated strictly from lecture speech transcripts.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search quizzes by course or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
        />
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-56 w-full rounded-3xl" />
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No quizzes generated yet"
          description="Record or upload a lecture and NoteFlow AI will generate customized practice questions."
          actionLabel="Record Lecture"
          onAction={() => navigate('/record')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card
              key={quiz.id}
              hoverEffect
              className="p-6 bg-slate-900/60 border-white/10 flex flex-col justify-between space-y-4 group shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="sm">
                    {quiz.subject || 'Lecture Quiz'}
                  </Badge>
                  <span className="text-xs font-mono text-purple-300 font-bold">5 Questions</span>
                </div>

                <h3 className="font-black text-white text-base group-hover:text-purple-300 transition-colors">
                  {quiz.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  Factually grounded multiple choice test assessing understanding of key lecture principles.
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Instant Grading</span>
                </div>

                <Button
                  variant="purple"
                  size="sm"
                  icon={Play}
                  onClick={() => navigate(`/quizzes/${quiz.id}`)}
                  className="shadow-glow-purple font-black"
                >
                  Take Quiz
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
