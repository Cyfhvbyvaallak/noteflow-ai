import React from 'react';
import { Star, Edit3, Trash2, Tag, Calendar, BookOpen, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function NoteCard({ note, onEdit, onDelete, onToggleFavorite }) {
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tagList = note.tags
    ? note.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <Card hoverEffect className="p-5 flex flex-col justify-between h-full bg-slate-900/60 border-white/10 group">
      <div>
        {/* Header with subject & favorite toggle */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge variant="primary" size="sm">
            {note.subject || 'General'}
          </Badge>
          <button
            onClick={() => onToggleFavorite(note.id)}
            className={`p-1 rounded-lg transition-colors ${
              note.is_favorite
                ? 'text-amber-400 hover:text-amber-300'
                : 'text-slate-600 hover:text-amber-400'
            }`}
          >
            <Star className={`w-4 h-4 ${note.is_favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Note Title */}
        <h4 className="font-black text-white text-base mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1">
          {note.title}
        </h4>

        {/* Note snippet preview */}
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-4 leading-relaxed mb-4 font-medium">
          {note.content.replace(/[#*`$]/g, '')}
        </p>

        {/* Tags */}
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tagList.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-cyan-300 rounded-md border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer with date & actions */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatDate(note.updated_at || note.created_at)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
            title="Edit Note"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
