import React from 'react';
import { Mic, Radio, Sparkles } from 'lucide-react';
import { AudioRecorder } from '../components/lecture/AudioRecorder';
import { Badge } from '../components/common/Badge';

export function RecordLecture() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            Live Stream
          </Badge>
          <span className="text-xs text-slate-400">Audio Speech-to-Text</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Record Live Lecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
          Capture your classroom or conference audio in real-time. NoteFlow AI will transcribe and generate summaries, revision flashcards, and quizzes automatically.
        </p>
      </div>

      {/* Main Recorder Studio */}
      <AudioRecorder />
    </div>
  );
}
