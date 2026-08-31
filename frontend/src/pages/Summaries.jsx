import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function Summaries() {
  const navigate = useNavigate();
  const toast = useToast();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.lectures.list();
        setLectures(data || []);
      } catch (err) {
        console.error('Error fetching summaries:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopy = async (id, text, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Summary copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const filteredLectures = lectures.filter((lec) =>
    lec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lec.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-teal-950/40 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-glass-card border border-white/10 space-y-2">
        <Badge variant="primary" size="md">Executive Syntheses</Badge>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          AI Summaries Archive
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
          Review 3-minute executive lecture summaries with core takeaways, formulas, and critical concepts.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search summaries by course or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
        />
      </div>

      {/* Summaries Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-64 w-full rounded-3xl" />
          ))}
        </div>
      ) : filteredLectures.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No lecture summaries found"
          description="Record or upload your first lecture to generate executive AI summaries."
          actionLabel="Record Lecture"
          onAction={() => navigate('/record')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLectures.map((lec) => (
            <Card
              key={lec.id}
              hoverEffect
              onClick={() => navigate(`/lectures/${lec.id}?tab=summary`)}
              className="p-6 bg-slate-900/60 border-white/10 flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">{lec.subject}</Badge>
                  <span className="text-xs text-slate-500 font-mono">
                    {Math.round((lec.duration || 0) / 60)} mins
                  </span>
                </div>

                <h3 className="font-black text-white text-base group-hover:text-emerald-400 transition-colors">
                  {lec.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  Synthesized executive summary ready with key takeaways, conceptual model formulas, and revision points.
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copiedId === lec.id ? Check : Copy}
                  onClick={(e) => handleCopy(lec.id, lec.title, e)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {copiedId === lec.id ? 'Copied' : 'Copy'}
                </Button>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Summary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
