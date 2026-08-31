import React, { useState } from 'react';
import { RotateCw, Check, Clock, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function Flashcard({ card, onMastered, onReviewLater }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-full max-w-xl mx-auto min-h-[300px] select-none">
      <div
        onClick={() => setIsFlipped((prev) => !prev)}
        className={`relative w-full h-full min-h-[300px] rounded-3xl transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE (Term / Concept) */}
        <div className="absolute inset-0 backface-hidden p-8 rounded-3xl bg-slate-900/90 border-2 border-purple-500/40 shadow-glow-purple flex flex-col justify-between backdrop-blur-2xl">
          <div className="flex items-center justify-between text-xs">
            <Badge variant="purple" size="sm">Term / Question</Badge>
            <span className="text-slate-400 flex items-center gap-1 text-[11px] font-bold">
              <RotateCw className="w-3.5 h-3.5" /> Click to Flip
            </span>
          </div>

          <div className="my-auto text-center space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {card.term || card.concept || card.question}
            </h3>
            {card.subject && (
              <p className="text-xs text-purple-300 font-extrabold uppercase tracking-wider">
                {card.subject}
              </p>
            )}
          </div>

          <div className="text-center text-xs text-slate-500 font-bold">
            Tap anywhere to reveal definition
          </div>
        </div>

        {/* BACK SIDE (Definition / Explanation) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/40 shadow-glow-emerald flex flex-col justify-between backdrop-blur-2xl text-white">
          <div className="flex items-center justify-between text-xs">
            <Badge variant="success" size="sm">Definition / Solution</Badge>
            <span className="text-slate-400 flex items-center gap-1 text-[11px] font-bold">
              <RotateCw className="w-3.5 h-3.5" /> Click to Flip
            </span>
          </div>

          <div className="my-auto text-center space-y-3">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              {card.definition || card.explanation || card.answer}
            </p>
            {card.example && (
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-emerald-300">
                <strong>Example:</strong> {card.example}
              </div>
            )}
          </div>

          {/* Action buttons on back side */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-3 pt-2"
          >
            <Button
              variant="secondary"
              size="sm"
              icon={Clock}
              onClick={onReviewLater}
            >
              Review Later
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={onMastered}
              className="shadow-glow-emerald font-black"
            >
              Mastered ✓
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
