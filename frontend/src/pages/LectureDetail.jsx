import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Share2,
  Trash2,
  BookmarkPlus,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { AIResultTabs } from '../components/lecture/AIResultTabs';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function LectureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'summary');

  useEffect(() => {
    async function loadLecture() {
      try {
        const data = await api.lectures.get(id);
        setLecture(data);
      } catch (err) {
        console.error('Error fetching lecture:', err);
        toast.error('Lecture not found or access denied.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadLecture();
  }, [id]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      toast.info('Regenerating AI summary, key points, revision notes and quiz...');
      const updated = await api.lectures.regenerate(id);
      setLecture(updated);
      toast.success('Study suite successfully refreshed with AI!');
    } catch (err) {
      toast.error(err.message || 'Failed to regenerate content.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Lecture link copied to clipboard!');
    } catch {
      toast.error('Could not copy link.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lecture and all associated study materials?')) {
      try {
        await api.lectures.delete(id);
        toast.success('Lecture deleted successfully.');
        navigate('/dashboard');
      } catch (err) {
        toast.error('Failed to delete lecture.');
      }
    }
  };

  const handleSaveToMyNotes = async () => {
    try {
      const summaryText = lecture.summary?.summary_text || '';
      await api.notes.create({
        lecture_id: lecture.id,
        title: `Notes: ${lecture.title}`,
        subject: lecture.subject,
        content: `# Study Notes: ${lecture.title}\n\n${summaryText}`,
        tags: lecture.subject.toLowerCase().replace(/\s+/g, '-')
      });
      toast.success('Added to your personal notes library!');
      navigate('/notes');
    } catch (err) {
      toast.error(err.message || 'Failed to create note.');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    const mins = Math.round(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-10 w-1/4" />
        <LoadingSkeleton className="h-40 w-full" />
        <LoadingSkeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!lecture) return null;

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={BookmarkPlus}
            onClick={handleSaveToMyNotes}
          >
            Save to Notes
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Share2}
            onClick={handleShare}
          >
            Share
          </Button>

          <Button
            variant="purple"
            size="sm"
            icon={RefreshCw}
            isLoading={regenerating}
            onClick={handleRegenerate}
          >
            Regenerate AI
          </Button>

          <button
            onClick={handleDelete}
            title="Delete lecture"
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 p-6 sm:p-8 rounded-3xl text-white shadow-glass-card border border-white/10">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-black px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald">
              {lecture.subject}
            </span>
            <Badge variant="success" size="sm" dot>
              {lecture.status}
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              Source: {lecture.source_type?.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {lecture.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              {formatDuration(lecture.duration)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {formatDate(lecture.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* 5-Tab AI Study Suite */}
      <AIResultTabs
        lecture={lecture}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onRegenerate={handleRegenerate}
        onStartQuiz={(quizId) => {
          if (quizId) {
            navigate(`/quizzes/${quizId}`);
          } else {
            toast.info('No quiz generated for this lecture yet. Try regenerating!');
          }
        }}
      />
    </div>
  );
}
