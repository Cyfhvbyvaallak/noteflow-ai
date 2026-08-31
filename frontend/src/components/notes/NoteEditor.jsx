import React, { useState } from 'react';
import {
  Save,
  X,
  Star,
  Tag,
  BookOpen,
  Sparkles,
  Bold,
  Italic,
  List,
  Heading,
  Code
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export function NoteEditor({
  isOpen,
  initialData,
  onClose,
  onSave,
  subjects = ['Computer Science', 'Physics', 'Biology', 'Mathematics', 'Chemistry', 'General']
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [subject, setSubject] = useState(initialData?.subject || 'Computer Science');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [isFavorite, setIsFavorite] = useState(initialData?.is_favorite || false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({
      title: title.trim(),
      content: content.trim(),
      subject,
      tags: tags.trim(),
      is_favorite: isFavorite,
      lecture_id: initialData?.lecture_id || null
    });
  };

  const insertMarkdown = (prefix, suffix = '') => {
    setContent((prev) => `${prev}\n${prefix}Text${suffix}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-slate-900/95 border border-white/10 rounded-3xl shadow-glass-card p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="font-black text-lg text-white">
            {initialData ? 'Edit Study Note' : 'Create New Study Note'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Favorite */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Note Title (e.g., Raft Leader Election Algorithms)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-2xl border border-white/10 bg-slate-950 text-white font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-2xl border transition-all ${
                isFavorite
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-glow-rose'
                  : 'bg-slate-950 text-slate-500 border-white/10 hover:text-amber-400'
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Subject Selector and Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="distributed-systems, algorithms, exam"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Markdown Formatting Toolbar */}
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => insertMarkdown('### ')}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white"
              title="Heading"
            >
              <Heading className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('**', '**')}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*')}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('- ')}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('```\n', '\n```')}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <textarea
            rows={12}
            placeholder="Write your study notes or formula summaries here in Markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-4 rounded-2xl border border-white/10 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all leading-relaxed shadow-inner"
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              className="shadow-glow-emerald font-black"
            >
              Save Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
