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
        <mark key={i} className="bg-amber-200 text-stone-950 px-1 py-0.5 rounded font-black border border-amber-300">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card className="bg-[#FFFDF5] border-[#E8D5A0] shadow-warm-card">
      {/* Viewer Header with Search and Actions */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D5A0]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-300 text-teal-700 flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-900">Full Speech-to-Text Transcript</h3>
            <p className="text-xs text-stone-500">Verbatim lecture audio conversion</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all w-44 sm:w-56 shadow-inner"
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
            className="w-full p-4 rounded-2xl border border-teal-300 bg-[#FFF9E8] font-mono text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all leading-relaxed shadow-inner"
          />
        ) : (
          <div className="p-4 rounded-2xl bg-[#FFF9E8] border border-[#E8D5A0]/80 font-mono text-xs sm:text-sm text-stone-800 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
            {renderHighlightedText(transcriptText)}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
