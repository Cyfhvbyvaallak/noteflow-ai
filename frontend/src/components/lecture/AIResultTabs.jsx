import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ListOrdered,
  BookOpen,
  HelpCircle,
  Download,
  Share2,
  RefreshCw,
  Copy,
  Check,
  Tag,
  BookmarkCheck,
  CheckCircle2,
  Key,
  Layers,
  Award
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { TranscriptViewer } from './TranscriptViewer';
import { useToast } from '../../context/ToastContext';

export function AIResultTabs({
  lecture,
  activeTab,
  onTabChange,
  onRegenerate,
  onStartQuiz
}) {
  const toast = useToast();
  const [copiedSummary, setCopiedSummary] = useState(false);

  const transcript = lecture.transcript?.transcript_text || 'No transcript available.';
  const summary = lecture.summary?.summary_text || 'No summary generated yet.';
  const keyPoints = lecture.key_points?.[0]?.content || [];
  const revisionNotes = lecture.revision_notes?.[0]?.content || {};
  const quiz = lecture.quizzes?.[0];

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      toast.success('Summary copied to clipboard!');
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {}
  };

  const handleDownloadRevisionNotes = () => {
    const topic = revisionNotes.topic || lecture.title;
    const content = `# Revision Notes: ${topic}\n\n## Important Concepts\n${
      revisionNotes.important_concepts?.map((c) => `- **${c.concept}**: ${c.explanation}`).join('\n') || ''
    }\n\n## Definitions\n${
      revisionNotes.definitions?.map((d) => `- **${d.term}**: ${d.definition}`).join('\n') || ''
    }\n\n## Quick Revision Points\n${
      revisionNotes.quick_revision_points?.map((p) => `- ${p}`).join('\n') || ''
    }`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.toLowerCase().replace(/\s+/g, '_')}_revision_notes.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Revision notes downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Light Warm Glass Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#FFFDF5] border border-[#E8D5A0] overflow-x-auto shadow-warm-sm">
        <button
          onClick={() => onTabChange('transcript')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'transcript'
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#FFF9E8]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Transcript</span>
        </button>

        <button
          onClick={() => onTabChange('summary')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow-emerald'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#FFF9E8]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Summary</span>
        </button>

        <button
          onClick={() => onTabChange('key_points')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'key_points'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#FFF9E8]'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>3. Key Points</span>
        </button>

        <button
          onClick={() => onTabChange('revision')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'revision'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#FFF9E8]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. Revision Kit</span>
        </button>

        <button
          onClick={() => onTabChange('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-glow-emerald'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#FFF9E8]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>5. Practice Quiz</span>
        </button>
      </div>

      {/* Tab 1: Transcript Viewer */}
      {activeTab === 'transcript' && (
        <TranscriptViewer transcriptText={transcript} lectureTitle={lecture.title} />
      )}

      {/* Tab 2: Executive AI Summary */}
      {activeTab === 'summary' && (
        <Card className="p-6 sm:p-8 bg-[#FFFDF5] border-[#E8D5A0] shadow-warm-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D5A0]/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900">Executive AI Summary</h3>
                <p className="text-xs text-stone-500 font-medium">Distilled 3-minute study overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={copiedSummary ? Check : Copy}
                onClick={handleCopySummary}
              >
                {copiedSummary ? 'Copied' : 'Copy Summary'}
              </Button>
            </div>
          </div>

          <div className="max-w-none text-stone-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {summary}
          </div>
        </Card>
      )}

      {/* Tab 3: Key Points */}
      {activeTab === 'key_points' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-500">
              Prioritized Key Principles
            </h3>
            <span className="text-xs text-amber-700 font-bold">{keyPoints.length} Key Concepts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyPoints.map((kp, idx) => (
              <Card key={idx} hoverEffect className="p-5 bg-[#FFFDF5] border-[#E8D5A0] space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      kp.importance === 'Critical'
                        ? 'danger'
                        : kp.importance === 'High'
                        ? 'warning'
                        : 'primary'
                    }
                    size="sm"
                  >
                    {kp.importance || 'High'}
                  </Badge>
                  <span className="text-xs font-mono text-stone-400">#{idx + 1}</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">{kp.point}</h4>
                {kp.explanation && (
                  <p className="text-xs text-stone-600 leading-relaxed">{kp.explanation}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Revision Kit */}
      {activeTab === 'revision' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-stone-900">Exam Revision Kit</h3>
              <p className="text-xs text-stone-500">Definitions, concept cards, and exam focus sheet</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleDownloadRevisionNotes}
            >
              Export Markdown
            </Button>
          </div>

          {/* Definitions */}
          {revisionNotes.definitions?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
                Terminology Glossary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {revisionNotes.definitions.map((d, idx) => (
                  <Card key={idx} className="p-4 bg-[#FFFDF5] border-purple-200 space-y-1.5">
                    <span className="text-xs font-black text-purple-800">{d.term}</span>
                    <p className="text-xs text-stone-700 leading-relaxed">{d.definition}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Important Concepts */}
          {revisionNotes.important_concepts?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-800">
                Core Conceptual Models
              </h4>
              <div className="space-y-3">
                {revisionNotes.important_concepts.map((c, idx) => (
                  <Card key={idx} className="p-5 bg-[#FFFDF5] border-teal-200 space-y-2">
                    <h5 className="font-extrabold text-sm text-teal-800">{c.concept}</h5>
                    <p className="text-xs text-stone-700 leading-relaxed">{c.explanation}</p>
                    {c.example && (
                      <div className="p-2.5 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-xs text-stone-600">
                        <strong className="text-stone-800">Example:</strong> {c.example}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Practice Quiz Launcher */}
      {activeTab === 'quiz' && (
        <Card className="p-8 text-center space-y-6 bg-[#FFFDF5] border-[#E8D5A0] shadow-warm-card">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-black flex items-center justify-center mx-auto shadow-sm">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-stone-900">Interactive Practice Quiz</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Test your understanding with automated MCQs generated strictly from this lecture transcript.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon={HelpCircle}
            onClick={() => onStartQuiz(quiz?.id)}
            className="px-8 shadow-glow-emerald font-black"
          >
            Start Practice Quiz Now
          </Button>
        </Card>
      )}
    </div>
  );
}
