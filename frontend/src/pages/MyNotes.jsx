import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Star,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { NoteCard } from '../components/notes/NoteCard';
import { NoteEditor } from '../components/notes/NoteEditor';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function MyNotes() {
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const fallbackNotes = [
    {
      id: 1,
      title: 'My Raft Algorithm Implementation Notes',
      subject: 'Computer Science',
      content: '# Raft Implementation Notes\n\nKey trick is randomized election timeouts (150ms-300ms). Leader never overwrites its own log entries.\n\n- Leader sends periodic heartbeats.\n- Followers vote for candidates with up-to-date logs.',
      tags: 'distributed-systems,raft,algorithms',
      is_favorite: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Quantum Formula Cheat Sheet',
      subject: 'Physics',
      content: '# Quantum Mechanics Formulas\n\n- De Broglie: $\\lambda = \\frac{h}{p}$\n- Heisenberg Uncertainty: $\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$\n- Probability Density: $P(x) = |\\Psi(x)|^2$',
      tags: 'physics,quantum,formulas',
      is_favorite: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Cellular Respiration ATP Accounting',
      subject: 'Biology',
      content: '# ATP Balance Sheet\n\n- Glycolysis: 2 ATP + 2 NADH\n- Pyruvate Oxidation: 2 NADH\n- Krebs Cycle: 2 ATP + 6 NADH + 2 FADH2\n- Oxidative Phosphorylation: ~28 ATP via ATP Synthase',
      tags: 'biology,metabolism,atp',
      is_favorite: false,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await api.notes.list();
        if (data && data.length > 0) {
          setNotes(data);
        } else {
          setNotes(fallbackNotes);
        }
      } catch (err) {
        console.warn('Using fallback notes:', err);
        setNotes(fallbackNotes);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  const handleCreateNew = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Delete this note?')) {
      try {
        await api.notes.delete(noteId);
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        toast.success('Note deleted.');
      } catch {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        toast.success('Note removed.');
      }
    }
  };

  const handleToggleFavorite = async (noteId) => {
    try {
      await api.notes.toggleFavorite(noteId);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, is_favorite: !n.is_favorite } : n))
      );
    } catch {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, is_favorite: !n.is_favorite } : n))
      );
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        const updated = await api.notes.update(editingNote.id, noteData);
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? updated : n)));
        toast.success('Note updated successfully!');
      } else {
        const created = await api.notes.create(noteData);
        setNotes((prev) => [created, ...prev]);
        toast.success('Note created successfully!');
      }
      setIsEditorOpen(false);
    } catch (err) {
      toast.error('Failed to save note.');
    }
  };

  const subjects = ['ALL', ...new Set(notes.map((n) => n.subject).filter(Boolean))];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.tags && n.tags.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = selectedSubject === 'ALL' || n.subject === selectedSubject;
    const matchesFavorite = !onlyFavorites || n.is_favorite;

    return matchesSearch && matchesSubject && matchesFavorite;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-glass-card border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="primary" size="md">Study Notes Library</Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Smart Notes & Summaries
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
            Search, filter, edit, and organize all lecture notes and customized study sheets in one workspace.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={Plus}
          onClick={handleCreateNew}
          className="shadow-glow-emerald font-black"
        >
          Create Note
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes, formulas, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-glow-emerald'
                  : 'bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}

          <button
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`p-2 rounded-xl text-xs font-bold transition-all border ${
              onlyFavorites
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-glow-rose'
                : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Show only favorites"
          >
            <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-56 w-full rounded-3xl" />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No smart notes found"
          description="Create your first personal note or record a lecture to generate smart study material."
          actionLabel="Create Note"
          onAction={handleCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          isOpen={isEditorOpen}
          initialData={editingNote}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
}
