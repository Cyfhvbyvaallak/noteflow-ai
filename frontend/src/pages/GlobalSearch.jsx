import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Layers,
  FileText,
  Sparkles,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Command
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function GlobalSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const executeSearch = async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.search.query(searchTerm.trim());
      setResults(data);
      setSearchParams({ q: searchTerm.trim() });
    } catch (err) {
      toast.error('Failed to perform global search.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQ = searchParams.get('q');
    if (initialQ) {
      setQuery(initialQ);
      executeSearch(initialQ);
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const categories = [
    { id: 'all', label: 'All Results' },
    { id: 'lectures', label: 'Lectures', count: results?.lectures?.length || 0 },
    { id: 'transcripts', label: 'Transcripts', count: results?.transcripts?.length || 0 },
    { id: 'summaries', label: 'Summaries', count: results?.summaries?.length || 0 },
    { id: 'notes', label: 'Notes', count: results?.notes?.length || 0 },
    { id: 'quizzes', label: 'Quiz Questions', count: results?.quizzes?.length || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Search Command Bar */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-glass-card border border-white/10 space-y-4">
        <Badge variant="primary" size="md">Command-Palette Global Search</Badge>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Instant Cross-Resource Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-medium">
          Locate concepts, timestamps, definitions, formulas, and quiz questions in milliseconds across your entire degree.
        </p>

        {/* Big Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative pt-2">
          <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            placeholder="Search equations, definitions, keywords (e.g. 'Raft', 'Schrödinger', 'ATP', 'Eigenvalues')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-4 rounded-2xl bg-slate-900 border border-white/15 text-white placeholder:text-slate-500 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
          />
          <Button
            type="submit"
            variant="cyan"
            size="md"
            className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 font-black"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Results Category Tabs */}
      {results && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-glow-cyan border-cyan-400'
                  : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label} {cat.count !== undefined ? `(${cat.count})` : ''}
            </button>
          ))}
        </div>
      )}

      {/* Search Result Items */}
      {loading ? (
        <div className="space-y-4">
          <LoadingSkeleton className="h-24 w-full rounded-2xl" />
          <LoadingSkeleton className="h-24 w-full rounded-2xl" />
          <LoadingSkeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : !results ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          Type a search term above to scan all lectures, notes, transcripts, and quizzes.
        </div>
      ) : results.total_results === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching study items found"
          description={`We couldn't find any results matching "${query}". Try searching for broader terms like "quantum", "consensus", "biology", or "eigenvalue".`}
        />
      ) : (
        <div className="space-y-4">
          {/* Lectures Matches */}
          {(activeCategory === 'all' || activeCategory === 'lectures') &&
            results.lectures?.map((lec) => (
              <Card
                key={lec.id}
                hoverEffect
                onClick={() => navigate(`/lectures/${lec.id}`)}
                className="p-5 bg-slate-900/60 border-white/10 flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">{lec.subject}</Badge>
                    <span className="text-xs text-slate-400">Lecture Record</span>
                  </div>
                  <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {lec.title}
                  </h4>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </Card>
            ))}

          {/* Transcripts Matches */}
          {(activeCategory === 'all' || activeCategory === 'transcripts') &&
            results.transcripts?.map((t, idx) => (
              <Card
                key={idx}
                hoverEffect
                onClick={() => navigate(`/lectures/${t.lecture_id}?tab=transcript`)}
                className="p-5 bg-slate-900/60 border-white/10 space-y-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">{t.lecture_title}</span>
                  <Badge variant="info" size="sm">Transcript Match</Badge>
                </div>
                <p className="text-xs text-slate-300 font-mono line-clamp-2 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-white/5">
                  "...{t.snippet}..."
                </p>
              </Card>
            ))}

          {/* Notes Matches */}
          {(activeCategory === 'all' || activeCategory === 'notes') &&
            results.notes?.map((n) => (
              <Card
                key={n.id}
                hoverEffect
                onClick={() => navigate('/notes')}
                className="p-5 bg-slate-900/60 border-white/10 space-y-1.5 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{n.title}</span>
                  <Badge variant="success" size="sm">Note</Badge>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {n.snippet.replace(/[#*`$]/g, '')}
                </p>
              </Card>
            ))}

          {/* Quizzes Matches */}
          {(activeCategory === 'all' || activeCategory === 'quizzes') &&
            results.quizzes?.map((q, idx) => (
              <Card
                key={idx}
                hoverEffect
                onClick={() => navigate(`/quizzes/${q.quiz_id}`)}
                className="p-5 bg-slate-900/60 border-white/10 space-y-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300">{q.quiz_title}</span>
                  <Badge variant="purple" size="sm">Quiz Question</Badge>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  Q: {q.question}
                </p>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
