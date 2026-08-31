import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic,
  UploadCloud,
  FileText,
  Sparkles,
  BookOpen,
  HelpCircle,
  Clock,
  Trophy,
  ArrowRight,
  Plus,
  Play,
  Calendar,
  Layers,
  Star,
  CheckCircle2,
  Flame,
  Zap,
  TrendingUp,
  BarChart2,
  ChevronRight,
  Brain,
  Cpu
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const DEFAULT_METRICS = {
    student_name: 'Alex Vance',
    total_lectures: 4,
    total_notes: 3,
    total_summaries: 4,
    quizzes_completed: 3,
    average_quiz_score: 85.0,
    weekly_hours: [3.5, 4.2, 2.8, 5.1, 4.0, 1.5, 3.8],
    recent_lectures: [
      {
        id: 1,
        title: 'Consensus in Distributed Systems & The Raft Protocol',
        subject: 'Computer Science',
        duration: 3120,
        status: 'COMPLETED',
        source_type: 'AUDIO_UPLOAD',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Quantum Mechanics: Wave-Particle Duality & The Schrödinger Equation',
        subject: 'Physics',
        duration: 2700,
        status: 'COMPLETED',
        source_type: 'AUDIO_UPLOAD',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Cellular Respiration, Glycolysis & ATP Synthase',
        subject: 'Biology',
        duration: 3400,
        status: 'COMPLETED',
        source_type: 'AUDIO_UPLOAD',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Linear Algebra: Eigenvalues & Matrix Diagonalization',
        subject: 'Mathematics',
        duration: 2900,
        status: 'COMPLETED',
        source_type: 'AUDIO_UPLOAD',
        created_at: new Date().toISOString()
      }
    ],
    recent_notes: [
      {
        id: 1,
        title: 'My Raft Algorithm Implementation Notes',
        subject: 'Computer Science',
        snippet: 'Key trick is randomized election timeouts (150ms-300ms). Leader never overwrites its own log entries.',
        is_favorite: true
      },
      {
        id: 2,
        title: 'Quantum Formula Cheat Sheet',
        subject: 'Physics',
        snippet: 'lambda = h/p. delta_x * delta_p >= h_bar / 2. |psi|^2 represents spatial probability density.',
        is_favorite: true
      }
    ],
    upcoming_revisions: [
      {
        id: 1,
        lecture_id: 1,
        subject: 'Computer Science',
        topic: 'Consensus & The Raft Protocol',
        points_count: 6,
        sample_point: 'Raft splits consensus into Leader Election, Log Replication, and Safety.'
      },
      {
        id: 2,
        lecture_id: 2,
        subject: 'Physics',
        topic: 'Wave-Particle Duality & Uncertainty',
        points_count: 5,
        sample_point: 'Measurement of position and momentum is fundamentally bounded by h_bar/2.'
      }
    ]
  };

  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await api.dashboard.getMetrics();
        if (data && data.total_lectures !== undefined) {
          setMetrics((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Dashboard fetch fallback to local preloaded cache:', err);
      }
    }
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    const mins = Math.round(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSubjectBadge = (subject) => {
    switch (subject) {
      case 'Computer Science':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'Physics':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      case 'Biology':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Mathematics':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-white/10';
    }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekHours = metrics.weekly_hours || [3.5, 4.2, 2.8, 5.1, 4.0, 1.5, 3.8];
  const maxHours = Math.max(...weekHours, 6);

  const quickActions = [
    {
      title: 'Record Lecture',
      desc: 'Live microphone capture with waveform',
      icon: Mic,
      path: '/record',
      color: 'from-rose-600 to-red-600',
      glow: 'hover:shadow-glow-rose hover:border-rose-500/40'
    },
    {
      title: 'Upload Lecture',
      desc: 'Drop audio, video, or PDF slides',
      icon: UploadCloud,
      path: '/upload',
      color: 'from-cyan-500 to-blue-600',
      glow: 'hover:shadow-glow-cyan hover:border-cyan-500/40'
    },
    {
      title: 'AI Summaries',
      desc: 'Review 3-min executive summaries',
      icon: Sparkles,
      path: '/summaries',
      color: 'from-emerald-500 to-teal-600',
      glow: 'hover:shadow-glow-emerald hover:border-emerald-500/40'
    },
    {
      title: 'Generate Quiz',
      desc: 'Self-test with factually grounded MCQs',
      icon: HelpCircle,
      path: '/quizzes',
      color: 'from-purple-600 to-indigo-600',
      glow: 'hover:shadow-glow-purple hover:border-purple-500/40'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 1. WELCOME SECTION WITH MINI 3D AI VISUAL */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-glass-card border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-extrabold uppercase tracking-wider shadow-glow-purple">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                5-Day Study Streak
              </span>
              <span className="text-xs text-slate-400 font-medium">Exam Ready ✨</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {getGreeting()}, {user?.name || metrics?.student_name || 'Alex'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
              Ready to turn your next lecture into smart study material?
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={Mic}
              onClick={() => navigate('/record')}
              className="shadow-glow-emerald font-black"
            >
              🎙️ Record Lecture
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={UploadCloud}
              onClick={() => navigate('/upload')}
              className="font-bold border-white/20"
            >
              ↑ Upload Lecture
            </Button>
          </div>
        </div>
      </div>

      {/* 2. 3D FLOATING GLASS STATISTICS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Lectures */}
        <Card hoverEffect className="p-5 bg-slate-900/60 border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Lectures</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-glow-emerald">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
            {metrics?.total_lectures || 0}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>4 Active Courses</span>
          </div>
        </Card>

        {/* Card 2: Notes Generated */}
        <Card hoverEffect className="p-5 bg-slate-900/60 border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Notes Generated</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-glow-cyan">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">
            {metrics?.total_notes || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            Summaries & Glossaries
          </div>
        </Card>

        {/* Card 3: Quizzes Completed */}
        <Card hoverEffect className="p-5 bg-slate-900/60 border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Quizzes Done</span>
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-glow-purple">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">
            {metrics?.quizzes_completed || 0}
          </div>
          <div className="text-[11px] text-purple-300 font-bold mt-2">
            Exam Focus Ready
          </div>
        </Card>

        {/* Card 4: Average Score */}
        <Card hoverEffect className="p-5 bg-slate-900/60 border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Avg Quiz Score</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-glow-rose">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {metrics?.average_quiz_score ? `${metrics.average_quiz_score}%` : '85%'}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-2">
            Top 5% Mastery ✨
          </div>
        </Card>
      </div>

      {/* 3. QUICK ACTIONS GRID */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <Card
                key={idx}
                hoverEffect
                onClick={() => navigate(act.path)}
                className={`p-5 bg-slate-900/70 border-white/10 cursor-pointer flex flex-col justify-between space-y-3 ${act.glow}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">{act.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{act.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. VISUAL ANALYTICS & RECENT LECTURES SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): Weekly Activity Bar Chart & Recent Lectures */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weekly Learning Activity */}
          <Card className="p-6 bg-slate-900/60 border-white/10 shadow-glass-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Weekly Learning Activity</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Hours of Lecture Study</span>
            </div>

            {/* Neon Bar Chart */}
            <div className="pt-4 flex items-end justify-between gap-2 h-36">
              {weekDays.map((day, idx) => {
                const hours = weekHours[idx];
                const heightPercent = Math.round((hours / maxHours) * 100);
                const isPeak = hours === Math.max(...weekHours);
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] text-cyan-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {hours}h
                    </span>
                    <div className="w-full bg-slate-800/80 rounded-xl h-24 flex items-end p-1 overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                        className={`w-full rounded-lg transition-all ${
                          isPeak
                            ? 'bg-gradient-to-t from-cyan-500 to-purple-500 shadow-glow-cyan'
                            : 'bg-slate-700 group-hover:bg-cyan-400'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Lectures */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Recent Lectures
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notes')}
                className="text-xs text-slate-400 font-bold hover:text-white"
              >
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {metrics.recent_lectures.map((lec) => (
                <Card
                  key={lec.id}
                  hoverEffect
                  onClick={() => navigate(`/lectures/${lec.id}`)}
                  className="p-5 cursor-pointer bg-slate-900/60 border-white/10 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getSubjectBadge(lec.subject)}`}>
                          {lec.subject}
                        </span>
                        <Badge variant="success" size="sm" dot>
                          {lec.status}
                        </Badge>
                      </div>
                      <h3 className="font-extrabold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors truncate">
                        {lec.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatDuration(lec.duration)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(lec.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button variant="primary" size="sm" icon={ArrowRight}>
                        Study Kit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Upcoming Revision & Quick Study Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Revision Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Upcoming Revision
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/revision')}
                className="text-xs text-slate-400 font-bold hover:text-white"
              >
                Flashcards
              </Button>
            </div>

            <div className="space-y-3">
              {metrics.upcoming_revisions.map((rev) => (
                <Card
                  key={rev.id}
                  hoverEffect
                  onClick={() => navigate(`/lectures/${rev.lecture_id}?tab=revision`)}
                  className="p-4 cursor-pointer bg-slate-900/60 border-white/10 space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">{rev.subject}</span>
                    <Badge variant="purple" size="sm">{rev.points_count} Cards</Badge>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {rev.topic}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    💡 {rev.sample_point}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Smart Study Notes
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notes')}
                className="text-xs text-slate-400 font-bold hover:text-white"
              >
                All Notes
              </Button>
            </div>

            <div className="space-y-3">
              {metrics.recent_notes.map((note) => (
                <Card
                  key={note.id}
                  hoverEffect
                  onClick={() => navigate('/notes')}
                  className="p-4 cursor-pointer bg-slate-900/60 border-white/10 space-y-1.5 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {note.title}
                    </span>
                    {note.is_favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {note.snippet.replace(/[#*`$]/g, '')}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
