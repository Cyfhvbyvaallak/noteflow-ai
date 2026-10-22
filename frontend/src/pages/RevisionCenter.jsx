import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Layers,
  Filter,
  Flame,
  Zap,
  Target
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Flashcard } from '../components/revision/Flashcard';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function RevisionCenter() {
  const toast = useToast();
  const [lectures, setLectures] = useState([]);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sample preloaded flashcard data
  const fallbackCards = [
    {
      subject: 'Computer Science',
      term: 'Raft Randomized Timeouts',
      definition: 'Nodes pick random election timers between 150ms-300ms so one candidate times out first, preventing split-vote deadlocks in leader elections.'
    },
    {
      subject: 'Physics',
      term: 'De Broglie Wave Duality',
      definition: 'lambda = h / p. Demonstrates that every moving particle or quantum entity has an associated matter wave wavelength inversely proportional to momentum.'
    },
    {
      subject: 'Biology',
      term: 'ATP Synthase Rotary Motor',
      definition: 'Harnesses proton motive force across the mitochondrial membrane to synthesize ATP from ADP and inorganic phosphate via mechanical rotational catalysis.'
    },
    {
      subject: 'Mathematics',
      term: 'Matrix Diagonalization Rule',
      definition: 'An n x n matrix A is diagonalizable if and only if A has n linearly independent eigenvectors: A = P * D * P^(-1).'
    }
  ];

  const [cards, setCards] = useState(fallbackCards);

  useEffect(() => {
    async function loadData() {
      try {
        const lecs = await api.lectures.list();
        if (lecs && lecs.length > 0) {
          setLectures(lecs);
          setSelectedLectureId(lecs[0].id);

          // Extract flashcards from first lecture
          const firstLec = await api.lectures.get(lecs[0].id);
          const revNotes = firstLec.revision_notes?.[0]?.content;
          if (revNotes?.definitions?.length > 0) {
            const extracted = revNotes.definitions.map((d) => ({
              subject: firstLec.subject,
              term: d.term,
              definition: d.definition
            }));
            setCards(extracted);
          }
        }
      } catch (err) {
        console.warn('Using preloaded fallback cards:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectLecture = async (lecId) => {
    setSelectedLectureId(lecId);
    setCurrentCardIndex(0);
    try {
      const lec = await api.lectures.get(lecId);
      const revNotes = lec.revision_notes?.[0]?.content;
      if (revNotes?.definitions?.length > 0) {
        const extracted = revNotes.definitions.map((d) => ({
          subject: lec.subject,
          term: d.term,
          definition: d.definition
        }));
        setCards(extracted);
      } else {
        setCards(fallbackCards);
      }
    } catch {
      setCards(fallbackCards);
    }
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleMastered = () => {
    toast.success('Concept marked as Mastered! 🎉');
    handleNext();
  };

  const handleReviewLater = () => {
    toast.info('Added to review queue.');
    handleNext();
  };

  const currentCard = cards[currentCardIndex] || fallbackCards[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-[#FFFDF5] p-6 sm:p-8 rounded-3xl text-stone-900 shadow-warm-card border border-[#E8D5A0]">
        <div className="space-y-2">
          <Badge variant="purple" size="md">Active Recall Revision</Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900">
            Study Smarter. Remember More.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg leading-relaxed font-medium">
            Flip through active recall flashcards, terminology glossaries, and high-probability exam concepts extracted directly from your lectures.
          </p>
        </div>
      </div>

      {/* Course / Lecture Selector Bar */}
      {lectures.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {lectures.map((lec) => (
            <button
              key={lec.id}
              onClick={() => handleSelectLecture(lec.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer border ${
                selectedLectureId === lec.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-sm'
                  : 'bg-[#FFFDF5] border-[#E8D5A0] text-stone-700 hover:text-stone-900 hover:bg-[#FFF9E8]'
              }`}
            >
              {lec.subject}: {lec.title.length > 25 ? lec.title.substring(0, 25) + '...' : lec.title}
            </button>
          ))}
        </div>
      )}

      {/* Flashcard Studio Arena */}
      <div className="space-y-6">
        <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-extrabold text-stone-500 px-2">
          <span>Card {currentCardIndex + 1} of {cards.length}</span>
          <span className="text-purple-800">Space or Click to Flip</span>
        </div>

        {/* 3D Flip Flashcard */}
        <Flashcard
          card={currentCard}
          onMastered={handleMastered}
          onReviewLater={handleReviewLater}
        />

        {/* Stepper Navigation */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="secondary"
            size="md"
            icon={ChevronLeft}
            onClick={handlePrev}
          >
            Previous
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={ChevronRight}
            onClick={handleNext}
            className="shadow-glow-emerald font-black"
          >
            Next Concept
          </Button>
        </div>
      </div>
    </div>
  );
}
