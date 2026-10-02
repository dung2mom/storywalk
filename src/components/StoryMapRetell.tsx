/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RETELL_CARDS, StoryRetellCard, STORY_IMAGES } from '../data/storyData';
import { playSoundEffect, speakText } from '../utils/audioEngine';
import { CheckCircle, RefreshCw, Volume2, Sparkles, Trophy } from 'lucide-react';

interface StoryMapRetellProps {
  onBackToResults: () => void;
}

export const StoryMapRetell: React.FC<StoryMapRetellProps> = ({ onBackToResults }) => {
  // Initial scrambled order: 2, 4, 1, 3
  const [currentSlots, setCurrentSlots] = useState<StoryRetellCard[]>([
    RETELL_CARDS[1], // Problem
    RETELL_CARDS[3], // Ending
    RETELL_CARDS[0], // Beginning
    RETELL_CARDS[2], // Event
  ]);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const stageLabels = ['1. Beginning', '2. Problem', '3. Event', '4. Ending'];

  const handleCardClick = (idx: number) => {
    playSoundEffect('pop');
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      // Swap items at selectedIdx and idx
      const newSlots = [...currentSlots];
      const temp = newSlots[selectedIdx];
      newSlots[selectedIdx] = newSlots[idx];
      newSlots[idx] = temp;
      setCurrentSlots(newSlots);
      setSelectedIdx(null);

      // Check if correctly ordered 1, 2, 3, 4
      const isCorrect = newSlots.every((card, i) => card.order === i + 1);
      if (isCorrect) {
        setIsCompleted(true);
        playSoundEffect('fanfare');
      }
    }
  };

  const handleReset = () => {
    playSoundEffect('pop');
    setIsCompleted(false);
    setSelectedIdx(null);
    setCurrentSlots([RETELL_CARDS[1], RETELL_CARDS[3], RETELL_CARDS[0], RETELL_CARDS[2]]);
  };

  const handleReadFullStorySummary = () => {
    playSoundEffect('pop');
    const fullSummary = currentSlots.map((c) => c.description).join(' ');
    speakText(fullSummary, { rate: 0.85 });
  };

  const getImageForCard = (key: string) => {
    if (key === 'cover') return STORY_IMAGES.cover;
    if (key === 'wind') return STORY_IMAGES.wind;
    if (key === 'pond') return STORY_IMAGES.pond;
    if (key === 'bird') return STORY_IMAGES.bird;
    return STORY_IMAGES.cover;
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-xl mx-auto px-4 py-4 select-none">
      {/* Title & Instructions */}
      <div className="text-center pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Story Map Retelling Challenge</span>
        </div>
        <h2 className="text-2xl font-black text-amber-950 font-display mt-2">
          Put the Story in Order!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
          Tap two cards to swap them into: Beginning → Problem → Event → Ending
        </p>
      </div>

      {/* 4 Story Slots Grid */}
      <div className="grid grid-cols-2 gap-3 my-3">
        {currentSlots.map((card, idx) => {
          const isSelected = selectedIdx === idx;
          const isSlotCorrect = card.order === idx + 1;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`text-left p-3 rounded-2xl border-2 transition-all flex flex-col justify-between relative shadow-sm min-h-[170px] ${
                isSelected
                  ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-300/50 scale-[1.02]'
                  : isCompleted && isSlotCorrect
                  ? 'border-emerald-400 bg-emerald-50/60'
                  : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
              }`}
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 font-display">
                  {stageLabels[idx]}
                </span>
                <span className="text-xl">{card.emoji}</span>
              </div>

              {/* Small Picture */}
              <div className="w-full h-20 rounded-xl overflow-hidden my-1 bg-amber-100 border border-amber-200/60 relative">
                <img
                  src={getImageForCard(card.imageKey)}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Text */}
              <div className="mt-1">
                <h4 className="text-xs sm:text-sm font-black text-amber-950 truncate font-display">
                  {card.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight mt-0.5">
                  {card.description}
                </p>
              </div>

              {isCompleted && isSlotCorrect && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted ? (
        <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-center animate-in zoom-in-95 duration-200 shadow-md">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
            <h3 className="text-lg font-black font-display text-emerald-950">
              Story Map Completed! ⭐
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-emerald-800">
            You successfully ordered Beginning, Problem, Event, and Ending!
          </p>
          <button
            onClick={handleReadFullStorySummary}
            className="mt-3 py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Listen to Whole Retelling</span>
          </button>
        </div>
      ) : (
        <div className="text-center text-xs font-bold text-slate-400 py-1">
          {selectedIdx !== null
            ? 'Now tap another card to swap places!'
            : 'Tap a card to pick it up, then tap another to swap.'}
        </div>
      )}

      {/* Bottom Nav Buttons */}
      <div className="flex items-center gap-3 pt-3 pb-2">
        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 min-h-[48px]"
          title="Reset puzzle"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Shuffle</span>
        </button>

        <button
          onClick={onBackToResults}
          className="flex-1 py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base font-display shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 min-h-[48px]"
        >
          <span>Back to Results & Reflection</span>
        </button>
      </div>
    </div>
  );
};
