import React, { useState } from 'react';
import {
  Search,
  Copy,
  Check,
  Download,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';

export function TranscriptViewer({ transcriptText = '', lectureTitle = 'Lecture' }) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(transcriptText);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editableText : transcriptText);
      setCopied(true);
      toast.success('Transcript copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text.');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([isEditing ? editableText : transcriptText], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${lectureTitle.toLowerCase().replace(/\s+/g, '_')}_transcript.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Transcript downloaded!');
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    toast.success('Local transcript edits saved.');
  };

  // Highlight search terms
  const renderHighlightedText = (text) => {
    if (!searchTerm.trim()) {
      return text;
    }
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-cyan-500 text-slate-950 px-1 py-0.5 rounded font-black shadow-glow-cyan">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card className="bg-slate-900/70 border-white/10 shadow-glass-card">
      {/* Viewer Header with Search and Actions */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-glow-cyan">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Full Speech-to-Text Transcript</h3>
            <p className="text-xs text-slate-400">Verbatim lecture audio conversion</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-950 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all w-44 sm:w-56 shadow-inner"
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={copied ? Check : Copy}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleDownload}
          >
            Export
          </Button>

          {isEditing ? (
            <Button
              variant="primary"
              size="sm"
              icon={Save}
              onClick={handleSaveEdit}
            >
              Save Edits
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Transcript Text Body */}
      <CardBody>
        {isEditing ? (
          <textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            rows={18}
            className="w-full p-4 rounded-2xl border border-cyan-500/40 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all leading-relaxed shadow-inner"
          />
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
            {renderHighlightedText(transcriptText)}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
