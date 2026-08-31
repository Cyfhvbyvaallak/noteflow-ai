import React from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';
import { FileUploader } from '../components/lecture/FileUploader';
import { Badge } from '../components/common/Badge';

export function UploadLecture() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            Batch Processor
          </Badge>
          <span className="text-xs text-slate-400">Audio, Video & PDF Deck</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Lecture Files
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
          Upload recorded audio (MP3, WAV, M4A), lecture videos (MP4), or presentation slide decks (PDF). Our AI engine will extract concepts and build your revision suite.
        </p>
      </div>

      {/* Main Uploader Studio */}
      <FileUploader />
    </div>
  );
}
