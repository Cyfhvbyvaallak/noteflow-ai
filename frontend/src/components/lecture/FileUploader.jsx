import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileAudio,
  FileVideo,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function FileUploader() {
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stage, setStage] = useState('');

  const subjects = [
    'Computer Science',
    'Physics',
    'Biology',
    'Mathematics',
    'Chemistry',
    'History',
    'Economics',
    'Psychology',
    'General Studies'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    const validExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.pdf'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      toast.error('Unsupported file format. Please upload MP3, WAV, M4A, MP4, or PDF.');
      return;
    }
    setSelectedFile(file);
    if (!title) {
      const defaultName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(defaultName.replace(/[-_]/g, ' '));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['mp3', 'wav', 'm4a'].includes(ext)) return FileAudio;
    if (['mp4'].includes(ext)) return FileVideo;
    return FileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadAndProcess = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select or drop a lecture file.');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a lecture title.');
      return;
    }

    setUploading(true);
    setUploadProgress(25);
    setStage('Uploading file to secure storage...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title.trim());
      formData.append('subject', subject);
      
      const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
      if (ext === '.pdf') {
        formData.append('source_type', 'PDF_UPLOAD');
      } else if (ext === '.mp4') {
        formData.append('source_type', 'VIDEO_UPLOAD');
      } else {
        formData.append('source_type', 'AUDIO_UPLOAD');
      }

      setUploadProgress(50);
      setStage(ext === '.pdf' ? 'Extracting slide deck content via PyPDF2...' : 'Transcribing speech to text...');

      setUploadProgress(75);
      setStage('AI Synthesis: Summary, Key Points, Revision Kit & Practice Quiz...');

      const response = await api.transcription.uploadAndProcess(formData);

      setUploadProgress(100);
      setStage('Completed!');
      toast.success('Lecture processed into complete study kit!');

      setTimeout(() => {
        navigate(`/lectures/${response.lecture_id}`);
      }, 1000);

    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Unable to process this file format.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto overflow-hidden shadow-glass-card border-white/10 bg-slate-900/80 backdrop-blur-2xl">
      <form onSubmit={handleUploadAndProcess} className="p-6 sm:p-8 space-y-6">
        {/* Title and Subject */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Lecture Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Quantum Mechanics: Wave-Particle Duality & Schrödinger Equation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-slate-950/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-semibold shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Academic Subject
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubject(sub)}
                  disabled={uploading}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    subject === sub
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-glow-emerald font-black'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Glass Drag-and-Drop Area */}
        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/40 scale-[1.01] shadow-glow-cyan'
                : 'border-white/15 hover:border-cyan-400/60 bg-slate-950/60 hover:bg-slate-950/90'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.mp4,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-4 shadow-glow-cyan">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h4 className="text-base sm:text-lg font-black text-white tracking-tight mb-1">
              Drop your lecture file here
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed font-medium">
              Audio recordings (MP3/WAV/M4A), Video (MP4), or presentation slide decks (PDF).
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="primary" size="sm">MP3</Badge>
              <Badge variant="primary" size="sm">WAV</Badge>
              <Badge variant="primary" size="sm">M4A</Badge>
              <Badge variant="info" size="sm">MP4 Video</Badge>
              <Badge variant="warning" size="sm">PDF Slides</Badge>
            </div>
          </div>
        ) : (
          /* Selected File Card */
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between gap-4 shadow-glow-cyan">
            <div className="flex items-center gap-3.5 min-w-0">
              {React.createElement(getFileIcon(selectedFile.name), {
                className: 'w-8 h-8 text-cyan-400 shrink-0'
              })}
              <div className="min-w-0">
                <p className="text-sm font-black text-white truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-400 font-mono">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={removeFile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Upload & AI Pipeline Progress Indicator */}
        {uploading && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-purple-500/40 text-white space-y-4 shadow-glow-purple">
            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>{stage}</span>
              </div>
              <span className="font-mono text-sm">{uploadProgress}%</span>
            </div>
            <ProgressBar progress={uploadProgress} variant="brand" height="h-2.5" />
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!selectedFile || uploading}
            isLoading={uploading}
            icon={Sparkles}
            className="w-full sm:w-auto px-8 shadow-glow-emerald font-black"
          >
            Process Lecture with AI
          </Button>
        </div>
      </form>
    </Card>
  );
}
