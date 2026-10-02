/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Sparkles, Volume2, Bookmark, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { STORY_IMAGES } from '../data/storyData';
import { playSoundEffect } from '../utils/audioEngine';

interface CoverScreenProps {
  onStartStory: () => void;
  onOpenGuide: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onStartStory, onOpenGuide }) => {
  const handleStart = () => {
    playSoundEffect('fanfare');
    onStartStory();
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-xl mx-auto px-4 py-6">
      {/* Top Banner / Editorial Tag */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Interactive English Reader · Grade 3–4</span>
        </div>
      </div>

      {/* Centerpiece Cover Illustration & Book Details */}
      <div className="flex flex-col items-center text-center my-auto py-4">
        {/* Cover Art Card with tactile frame */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-3xl overflow-hidden shadow-2xl shadow-amber-900/15 border-4 border-white bg-white group transition-transform duration-300 hover:scale-[1.01]">
          <div className="relative aspect-[4/3] overflow-hidden bg-amber-100">
            <img
              src={STORY_IMAGES.cover}
              alt="Leo the bear wearing his favorite yellow hat with Pip the puppy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Spine / Cover Title Area */}
          <div className="p-5 bg-gradient-to-b from-amber-50 to-white text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-950 font-display tracking-tight leading-tight">
              The Lost Hat
            </h1>
            <p className="text-sm font-semibold text-amber-800/90 mt-1">
              An English Read-Along Adventure
            </p>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-3 text-xs font-semibold text-slate-500 mt-3 pt-3 border-t border-amber-100">
              <span className="flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-amber-600" /> 10 Pages
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" /> Read-Aloud Audio
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 10 Quiz Questions
              </span>
            </div>
          </div>
        </div>

        {/* 3 Step Learning Journey */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[380px] mt-6">
          <div className="bg-white/80 border border-amber-200/70 rounded-2xl p-2.5 text-center shadow-xs">
            <span className="text-xl">🎧</span>
            <div className="text-[11px] font-extrabold text-amber-950 mt-1 font-display">1. Listen</div>
            <div className="text-[10px] text-slate-500">Word highlight</div>
          </div>
          <div className="bg-white/80 border border-amber-200/70 rounded-2xl p-2.5 text-center shadow-xs">
            <span className="text-xl">💡</span>
            <div className="text-[11px] font-extrabold text-amber-950 mt-1 font-display">2. Understand</div>
            <div className="text-[10px] text-slate-500">Tap-a-word help</div>
          </div>
          <div className="bg-white/80 border border-amber-200/70 rounded-2xl p-2.5 text-center shadow-xs">
            <span className="text-xl">🗣️</span>
            <div className="text-[11px] font-extrabold text-amber-950 mt-1 font-display">3. Respond</div>
            <div className="text-[10px] text-slate-500">Speak & reflect</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Zone */}
      <div className="w-full max-w-[380px] mx-auto pb-4 space-y-2.5">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-extrabold text-lg sm:text-xl font-display shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2.5 transition-all group"
        >
          <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          <span>Start Story</span>
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>

        <button
          onClick={() => {
            playSoundEffect('pop');
            onOpenGuide();
          }}
          className="w-full py-2.5 px-4 text-xs font-bold text-amber-900/80 hover:text-amber-950 hover:bg-amber-100/50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <HelpCircle className="w-4 h-4 text-amber-700" />
          <span>View Can-Do Learning Objective & Sight Words</span>
        </button>
      </div>
    </div>
  );
};
