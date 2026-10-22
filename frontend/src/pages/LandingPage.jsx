import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic,
  FileText,
  Sparkles,
  BookOpen,
  HelpCircle,
  UploadCloud,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Zap,
  ShieldCheck,
  Clock,
  Flame,
  Star,
  Check,
  Search,
  BarChart3,
  Layers,
  Cpu,
  Brain
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { StudyCore3D } from '../components/landing/StudyCore3D';
import { InteractiveWorkflow } from '../components/landing/InteractiveWorkflow';
import { BeforeAfterComparison } from '../components/landing/BeforeAfterComparison';
import { StudyDesk3D } from '../components/landing/StudyDesk3D';

export function LandingPage() {
  const navigate = useNavigate();
  const { user, loginDemo } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartLearning = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      loginDemo();
      navigate('/dashboard');
    }
  };

  const stats = [
    { value: '10K+', label: 'Lecture Minutes Processed', sub: 'Across 12 disciplines', glow: 'text-emerald-700' },
    { value: '5K+', label: 'Smart Notes Generated', sub: 'Summaries & key points', glow: 'text-teal-700' },
    { value: '25K+', label: 'AI Quiz Questions', sub: 'Factually grounded', glow: 'text-purple-700' },
    { value: '4.9/5', label: 'Student Experience', sub: 'High exam retention', glow: 'text-amber-700' }
  ];

  const workflowSteps = [
    { icon: Mic, num: '01', title: 'Record Lecture', desc: 'Capture spoken lecture live in-browser or upload MP3, WAV, MP4, or PDF slide decks.' },
    { icon: FileText, num: '02', title: 'Transcribe', desc: 'AI converts speech into synchronized, searchable text with timestamps and terminology.' },
    { icon: Sparkles, num: '03', title: 'Understand', desc: 'Academic NLP parses definitions, key formulas, and core lecture principles.' },
    { icon: BookOpen, num: '04', title: 'Organize', desc: 'Auto-synthesizes executive summaries, concept cards, and exam revision flashcards.' },
    { icon: HelpCircle, num: '05', title: 'Practice', desc: 'Generates self-testing quizzes with instant explanations and score tracking.' }
  ];

  const features = [
    {
      title: 'Smart Lecture Recorder',
      desc: 'Record classroom lectures live with real-time waveform spectrum visualizers and zero-lag audio processing.',
      icon: Mic,
      tag: 'Live Capture',
      accent: 'border-rose-300'
    },
    {
      title: 'AI Speech-to-Text Transcription',
      desc: 'High-precision speech models formatting speech into structured timestamps with search and inline editing.',
      icon: FileText,
      tag: 'Speech-to-Text',
      accent: 'border-teal-300'
    },
    {
      title: 'Intelligent Executive Summaries',
      desc: 'Transforms 60-minute dense lectures into concise 3-minute executive summaries and key takeaway cards.',
      icon: Sparkles,
      tag: 'Executive AI',
      accent: 'border-emerald-300'
    },
    {
      title: 'Key Concept Extraction',
      desc: 'Automatically identifies important principles and categorizes them by importance: Critical, High, and Medium.',
      icon: Layers,
      tag: 'Concept Engine',
      accent: 'border-amber-300'
    },
    {
      title: 'AI Exam Revision Kits',
      desc: 'Builds interactive flashcards, terminology glossaries, formula sheets, and high-probability exam topics.',
      icon: BookOpen,
      tag: 'Revision Suite',
      accent: 'border-purple-300'
    },
    {
      title: 'Practice Quiz Generator',
      desc: 'Generates self-testing MCQs strictly grounded in lecture transcripts with detailed rationale for every answer.',
      icon: HelpCircle,
      tag: 'Active Recall',
      accent: 'border-emerald-300'
    },
    {
      title: 'Universal Command Search',
      desc: 'Instantly query transcripts, notes, summaries, and quiz questions with highlighted snippet previews in 0.03 seconds.',
      icon: Search,
      tag: 'Ctrl + K Search',
      accent: 'border-cyan-300'
    },
    {
      title: 'Learning & Retention Analytics',
      desc: 'Track weekly study hours, quiz mastery rates, and course progress with real-time visual charts.',
      icon: BarChart3,
      tag: 'Performance',
      accent: 'border-purple-300'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9E8] text-stone-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      {/* 1. STICKY LIGHT WARM GLASS NAVBAR */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFFDF5]/90 backdrop-blur-2xl border-b border-[#E8D5A0]/60 shadow-warm-sm py-3'
            : 'bg-transparent py-5'
        } px-6`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-black text-xl text-stone-900 tracking-tight group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-glow-emerald group-hover:scale-105 transition-transform font-black">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-stone-900 font-black text-lg">
                NoteFlow <span className="text-emerald-600">AI</span>
              </span>
              <span className="text-[9px] text-stone-500 font-extrabold uppercase tracking-widest mt-0.5">
                Speech-to-Study System
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-extrabold text-stone-600 tracking-wider uppercase">
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
            <a href="#ai-tools" className="hover:text-teal-700 transition-colors">AI Outputs</a>
            <a href="#features" className="hover:text-purple-700 transition-colors">Features</a>
            <a href="#stats" className="hover:text-emerald-700 transition-colors">Performance</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/dashboard')}
                className="shadow-glow-emerald font-black"
              >
                Open Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => navigate('/login')}
                  className="font-bold text-stone-700 hover:text-stone-950"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStartLearning}
                  className="shadow-glow-emerald font-black"
                >
                  Start Learning Free
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. CINEMATIC HERO SECTION WITH 3D AI STUDY CORE */}
      <section className="relative overflow-hidden pt-12 pb-24 px-6 bg-[#FFF9E8] text-stone-900">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column (7 Cols): Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF5] text-purple-900 border border-purple-300 text-xs font-extrabold tracking-wide uppercase shadow-warm-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>AI-Powered Study Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-stone-900"
            >
              Turn Every Lecture Into Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600">
                Personal AI Study System
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0"
            >
              Record or upload your lecture and let NoteFlow AI transform it into structured notes, summaries, key concepts, revision material, and personalized practice quizzes.
            </motion.p>

            {/* Glowing CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={handleStartLearning}
                className="px-8 py-4 text-base shadow-glow-emerald font-black"
              >
                Start Learning →
              </Button>
              <Button
                variant="purple"
                size="lg"
                icon={Mic}
                onClick={() => {
                  loginDemo();
                  navigate('/record');
                }}
                className="px-6 py-4 text-base font-bold shadow-glow-purple"
              >
                Record a Lecture 🎙️
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={UploadCloud}
                onClick={() => {
                  loginDemo();
                  navigate('/upload');
                }}
                className="px-5 py-4 text-sm font-semibold"
              >
                Upload Lecture
              </Button>
            </motion.div>

            {/* Proof Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-stone-600"
            >
              <span className="flex items-center gap-1.5 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1-Click zero-friction demo
              </span>
              <span className="flex items-center gap-1.5 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> Real-time Speech-to-Text
              </span>
              <span className="flex items-center gap-1.5 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> 4 Preloaded sample courses
              </span>
            </motion.div>
          </div>

          {/* Right Column (5 Cols): 3D AI Brain Centerpiece */}
          <div className="lg:col-span-5 flex justify-center">
            <StudyCore3D />
          </div>
        </div>
      </section>

      {/* 3. PRODUCT STATISTICS STRIP */}
      <section id="stats" className="py-14 px-6 bg-[#FFFDF5] border-y border-[#E8D5A0]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-[#FFF9E8] border border-[#E8D5A0]/60 shadow-warm-sm space-y-1">
              <div className={`text-3xl sm:text-4xl font-black tracking-tight ${item.glow}`}>
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-stone-900">{item.label}</div>
              <p className="text-[11px] text-stone-500 font-medium">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ANIMATED HOW IT WORKS PIPELINE */}
      <section id="how-it-works" className="py-24 px-6 bg-[#FFF9E8]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="primary" size="md">Step-by-Step Pipeline</Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
              From Lecture to Learning in Seconds
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              How NoteFlow AI transforms raw audio streams into high-yield exam mastery materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Card
                  key={idx}
                  hoverEffect
                  className="p-6 text-center space-y-3 bg-[#FFFDF5] border-[#E8D5A0]/60 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                      Step {step.num}
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-base">{step.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE WORKFLOW */}
      <InteractiveWorkflow />

      {/* 6. FEATURES SHOWCASE */}
      <section id="features" className="py-24 px-6 bg-[#FFF9E8]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="purple" size="md">Comprehensive Capabilities</Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
              Engineered for Higher Retention
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every tool a university student needs to absorb, organize, revise, and test lecture comprehension.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card
                  key={idx}
                  hoverEffect
                  className={`p-6 space-y-3 bg-[#FFFDF5] ${feat.accent} flex flex-col justify-between group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="default" size="sm">{feat.tag}</Badge>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      {feat.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BEFORE VS AFTER COMPARISON */}
      <BeforeAfterComparison />

      {/* 8. 3D AI STUDY DESK SECTION */}
      <StudyDesk3D />

      {/* 9. FINAL HIGH-IMPACT CTA */}
      <section className="py-24 px-6 bg-[#FFFDF5] text-stone-900 text-center border-t border-[#E8D5A0]/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <Badge variant="primary" size="md">
            ✨ Elevate Your University Learning
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 leading-tight">
            Your Next Lecture Could Already Be <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600">
              Your Best Study Notes.
            </span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Stop writing everything. Start understanding everything with automated speech-to-text, summaries, revision flashcards, and quizzes.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={handleStartLearning}
              className="px-10 py-4 text-base shadow-glow-emerald font-black"
            >
              Start Learning with NoteFlow AI →
            </Button>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#FFFDF5] text-stone-600 border-t border-[#E8D5A0]/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black shadow-sm">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-stone-900 font-bold text-sm">NoteFlow AI</span>
            <span className="text-stone-500">• Intelligent Speech-to-Study Automation</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
            <a href="#ai-tools" className="hover:text-teal-700 transition-colors">AI Tools</a>
            <a href="#features" className="hover:text-purple-700 transition-colors">Features</a>
            <Link to="/dashboard" className="hover:text-emerald-700 transition-colors">Dashboard</Link>
          </div>

          <div>
            © {new Date().getFullYear()} NoteFlow AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
