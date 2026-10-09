/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Home, Sparkles, BookOpen, Star, Award } from 'lucide-react';
import { STORY_IMAGES } from '../data/storyData';
import { playSoundEffect } from '../utils/audioEngine';

interface TheEndScreenProps {
  onListenAgain: () => void;
  onBackToCover: () => void;
  onStartInteractiveQuiz: () => void;
}

export const TheEndScreen: React.FC<TheEndScreenProps> = ({
  onListenAgain,
  onBackToCover,
  onStartInteractiveQuiz,
}) => {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-xl mx-auto px-4 py-6 select-none animate-in fade-in duration-300">
      {/* Top Banner Tag */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs sm:text-sm font-black tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Story Completed · Read-Aloud Experience</span>
        </div>
      </div>

      {/* Centerpiece The End Art & Message */}
      <div className="flex flex-col items-center text-center my-auto py-4">
        {/* Celebration Badge Illustration */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-2xl shadow-amber-900/20 border-4 border-amber-300 bg-amber-50 group hover:scale-105 transition-transform duration-300">
          <img
            src={STORY_IMAGES.badge}
            alt="The Lost Hat Explorer Badge"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-2 shadow-md">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-amber-950 font-display tracking-tight mt-6">
          The End
        </h1>

        <p className="text-lg sm:text-xl font-extrabold text-amber-900/90 mt-2 max-w-md">
          You listened to the whole story of <span className="text-amber-950 underline decoration-amber-400 font-black">The Lost Hat</span>!
        </p>

        <p className="text-sm sm:text-base font-bold text-slate-600 mt-2">
          Leo and Pip are so happy you joined their park adventure! 🐻🐶💛
        </p>
      </div>

      {/* Action Buttons Zone */}
      <div className="w-full max-w-md mx-auto pb-4 space-y-3">
        {/* Listen Again */}
        <button
          onClick={() => {
            playSoundEffect('pop');
            onListenAgain();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-black text-lg sm:text-xl font-display shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2.5 transition-all"
        >
          <RotateCcw className="w-6 h-6 stroke-[2.5]" />
          <span>Listen Again</span>
        </button>

        {/* Back to Cover */}
        <button
          onClick={() => {
            playSoundEffect('pop');
            onBackToCover();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-800 font-black text-base sm:text-lg font-display border-2 border-slate-300 shadow-sm flex items-center justify-center gap-2.5 transition-all"
        >
          <Home className="w-5 h-5" />
          <span>Back to Cover</span>
        </button>

        {/* Optional: Try Interactive Quiz */}
        <button
          onClick={() => {
            playSoundEffect('fanfare');
            onStartInteractiveQuiz();
          }}
          className="w-full py-3 px-4 rounded-xl bg-amber-100/80 hover:bg-amber-200/90 text-amber-950 font-black text-sm sm:text-base font-display flex items-center justify-center gap-2 transition-all"
        >
          <Award className="w-4 h-4 text-amber-700" />
          <span>Try Interactive Story with Questions & Certificate</span>
        </button>
      </div>
    </div>
  );
};
