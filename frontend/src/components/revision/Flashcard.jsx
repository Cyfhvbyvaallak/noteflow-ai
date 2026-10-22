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
        <div className="absolute inset-0 backface-hidden p-8 rounded-3xl bg-[#FFFDF5] border-2 border-purple-300 shadow-warm-card flex flex-col justify-between backdrop-blur-2xl">
          <div className="flex items-center justify-between text-xs">
            <Badge variant="purple" size="sm">Term / Question</Badge>
            <span className="text-stone-500 flex items-center gap-1 text-[11px] font-bold">
              <RotateCw className="w-3.5 h-3.5" /> Click to Flip
            </span>
          </div>

          <div className="my-auto text-center space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
              {card.term || card.concept || card.question}
            </h3>
            {card.subject && (
              <p className="text-xs text-purple-800 font-extrabold uppercase tracking-wider">
                {card.subject}
              </p>
            )}
          </div>

          <div className="text-center text-xs text-stone-400 font-bold">
            Tap anywhere to reveal definition
          </div>
        </div>

        {/* BACK SIDE (Definition / Explanation) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 rounded-3xl bg-[#FFFDF5] border-2 border-emerald-400 shadow-warm-card flex flex-col justify-between backdrop-blur-2xl text-stone-900">
          <div className="flex items-center justify-between text-xs">
            <Badge variant="success" size="sm">Definition / Solution</Badge>
            <span className="text-stone-500 flex items-center gap-1 text-[11px] font-bold">
              <RotateCw className="w-3.5 h-3.5" /> Click to Flip
            </span>
          </div>

          <div className="my-auto text-center space-y-3">
            <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
              {card.definition || card.explanation || card.answer}
            </p>
            {card.example && (
              <div className="p-2.5 rounded-xl bg-[#FFF9E8] border border-[#E8D5A0] text-xs text-emerald-800">
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
