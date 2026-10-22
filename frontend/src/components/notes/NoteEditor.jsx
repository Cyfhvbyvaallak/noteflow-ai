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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-[#FFFDF5] border border-[#E8D5A0] rounded-3xl shadow-warm-hover p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8D5A0]/60 pb-4">
          <h3 className="font-black text-lg text-stone-900">
            {initialData ? 'Edit Study Note' : 'Create New Study Note'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-[#FBF1D5] transition-colors"
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
              className="flex-1 px-4 py-3 rounded-2xl border border-[#E8D5A0] bg-[#FFF9E8] text-stone-900 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'bg-[#FFF9E8] text-stone-400 border-[#E8D5A0] hover:text-amber-500'
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Subject Selector and Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-[#FFFDF5]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="distributed-systems, algorithms, exam"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Markdown Formatting Toolbar */}
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-xs text-stone-600">
            <button
              type="button"
              onClick={() => insertMarkdown('### ')}
              className="p-1.5 rounded-lg hover:bg-[#FBF1D5] hover:text-stone-900"
              title="Heading"
            >
              <Heading className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('**', '**')}
              className="p-1.5 rounded-lg hover:bg-[#FBF1D5] hover:text-stone-900"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*')}
              className="p-1.5 rounded-lg hover:bg-[#FBF1D5] hover:text-stone-900"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('- ')}
              className="p-1.5 rounded-lg hover:bg-[#FBF1D5] hover:text-stone-900"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('```\n', '\n```')}
              className="p-1.5 rounded-lg hover:bg-[#FBF1D5] hover:text-stone-900"
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
            className="w-full p-4 rounded-2xl border border-[#E8D5A0] bg-[#FFF9E8] font-mono text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all leading-relaxed shadow-inner"
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
