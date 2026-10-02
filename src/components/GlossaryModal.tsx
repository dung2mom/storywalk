/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, X, Check, Sparkles } from 'lucide-react';
import { GlossaryItem } from '../data/storyData';
import { speakWord, speakSentence, playSoundEffect, stopSpeaking } from '../utils/audioEngine';

interface GlossaryModalProps {
  item: GlossaryItem | null;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ item, onClose }) => {
  const [playingTarget, setPlayingTarget] = useState<'word' | 'meaning' | 'example' | null>(null);
  const [hasLearned, setHasLearned] = useState(false);

  if (!item) return null;

  const handlePlayWord = () => {
    setPlayingTarget('word');
    playSoundEffect('pop');
    speakWord(item.word, false);
    setTimeout(() => {
      setPlayingTarget(null);
    }, 1200);
  };

  const handlePlayMeaning = () => {
    setPlayingTarget('meaning');
    playSoundEffect('pop');
    speakSentence(item.definition, () => {
      setPlayingTarget(null);
    });
  };

  const handlePlayExample = () => {
    setPlayingTarget('example');
    playSoundEffect('pop');
    speakSentence(item.example, () => {
      setPlayingTarget(null);
    });
  };

  const handleClose = () => {
    stopSpeaking();
    playSoundEffect('pop');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 transform transition-transform animate-in slide-in-from-bottom-4 duration-250 relative max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-title"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
          aria-label="Close glossary"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Word Header with Audio */}
        <div className="flex items-center gap-4 pt-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl sm:text-5xl shadow-xs shrink-0">
            {item.emoji}
          </div>
          <div>
            <h3 id="glossary-title" className="text-3xl sm:text-4xl font-black text-amber-950 capitalize font-display tracking-tight leading-tight">
              {item.word}
            </h3>
            <p className="text-base sm:text-lg font-mono font-bold text-amber-800 tracking-wide mt-1">
              {item.phonetic}
            </p>
          </div>
        </div>

        {/* Listen Word Control (Slow button deleted per user request) */}
        <div className="mt-5">
          <button
            onClick={handlePlayWord}
            className={`w-full py-3.5 sm:py-4 px-5 rounded-2xl font-black text-base sm:text-lg font-display flex items-center justify-center gap-2.5 transition-all shadow-md min-h-[50px] ${
              playingTarget === 'word'
                ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-300/60 scale-98'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
            }`}
          >
            <Volume2 className={`w-5 h-5 sm:w-6 sm:h-6 ${playingTarget === 'word' ? 'animate-bounce' : ''}`} />
            <span>{playingTarget === 'word' ? 'Listening...' : 'Listen to Word'}</span>
          </button>
        </div>

        {/* Meaning Box with Listen Button & Large Readable Text */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-200 text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-950 font-display">
              Meaning
            </span>
            <button
              onClick={handlePlayMeaning}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all shadow-xs min-h-[36px] ${
                playingTarget === 'meaning'
                  ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                  : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-300'
              }`}
              title="Hear meaning read aloud in American English"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>{playingTarget === 'meaning' ? 'Speaking...' : 'Listen'}</span>
            </button>
          </div>
          {/* Large text matching the size of 'I like Pip' */}
          <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed font-sans">
            {item.definition}
          </p>
        </div>

        {/* Example Sentence Box with Listen Button & Large Readable Text */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-700 font-display">
              Example Sentence
            </span>
            <button
              onClick={handlePlayExample}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all shadow-xs min-h-[36px] ${
                playingTarget === 'example'
                  ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
              }`}
              title="Hear example read aloud in American English"
            >
              <Volume2 className="w-4 h-4 text-slate-700" />
              <span>{playingTarget === 'example' ? 'Speaking...' : 'Listen'}</span>
            </button>
          </div>
          {/* Large text matching the size of 'I like Pip' */}
          <p className="text-xl sm:text-2xl font-bold text-slate-800 italic leading-relaxed font-sans">
            "{item.example}"
          </p>
        </div>

        {/* Confirmation Button */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => {
              stopSpeaking();
              playSoundEffect('chime');
              setHasLearned(true);
              setTimeout(() => {
                onClose();
              }, 300);
            }}
            className={`w-full py-4 rounded-2xl font-black text-base sm:text-lg font-display flex items-center justify-center gap-2 transition-all min-h-[52px] shadow-md ${
              hasLearned
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-98'
            }`}
          >
            {hasLearned ? (
              <>
                <Check className="w-5 h-5" />
                <span>Learned! ⭐</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Got it! Back to story</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
