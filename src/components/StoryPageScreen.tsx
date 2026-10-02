/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryPage, GLOSSARY_DICTIONARY, GlossaryItem } from '../data/storyData';
import { speakText, stopSpeaking, playSoundEffect, parseWordTokens } from '../utils/audioEngine';

interface StoryPageScreenProps {
  page: StoryPage;
  totalPages: number;
  onOpenGlossary: (item: GlossaryItem) => void;
  onProceedToQuestion: () => void;
  onPreviousPage: () => void;
}

export const StoryPageScreen: React.FC<StoryPageScreenProps> = ({
  page,
  totalPages,
  onOpenGlossary,
  onProceedToQuestion,
  onPreviousPage,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [hasListenedAtLeastOnce, setHasListenedAtLeastOnce] = useState(false);

  // Parse exact word tokens for synchronized speech and highlighting
  const wordTokens = parseWordTokens(page.text);

  // Reset audio state when page changes
  useEffect(() => {
    stopSpeaking();
    setIsPlayingAudio(false);
    setActiveWordIndex(null);
    setHasListenedAtLeastOnce(false);

    return () => {
      stopSpeaking();
    };
  }, [page.pageNumber]);

  const handleReadAloud = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      setActiveWordIndex(null);
      return;
    }

    playSoundEffect('pop');
    setIsPlayingAudio(true);
    setActiveWordIndex(0);

    speakText(page.text, {
      rate: 0.88,
      onWordBoundary: (wordIndex) => {
        setActiveWordIndex(wordIndex);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        setActiveWordIndex(null);
        setHasListenedAtLeastOnce(true);
        playSoundEffect('chime');
      },
      onError: () => {
        setIsPlayingAudio(false);
        setActiveWordIndex(null);
        setHasListenedAtLeastOnce(true);
      },
    });
  };

  const handleWordClick = (rawOrClean: string) => {
    const clean = rawOrClean.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const wordKey =
      clean === 'chirps' ? 'chirp' :
      clean === 'pushes' ? 'push' :
      clean;

    const glossaryItem = GLOSSARY_DICTIONARY[wordKey] || GLOSSARY_DICTIONARY[clean];
    if (glossaryItem) {
      playSoundEffect('pop');
      onOpenGlossary(glossaryItem);
    }
  };

  const handleNextClick = () => {
    if (!hasListenedAtLeastOnce) {
      playSoundEffect('nudge');
      handleReadAloud();
      return;
    }
    stopSpeaking();
    playSoundEffect('pageFlip');
    onProceedToQuestion();
  };

  const handlePrevClick = () => {
    stopSpeaking();
    playSoundEffect('pageFlip');
    onPreviousPage();
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-xl mx-auto px-4 py-3 select-none">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between py-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-950 font-display text-base tracking-wide">
            Page {page.pageNumber} / {totalPages}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-700 font-bold truncate max-w-[160px] sm:max-w-[220px]">
            {page.sceneTitle}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
          <span>Tap words for vocabulary</span>
        </div>
      </div>

      {/* Top Half: 100% Clean Illustration Container (No hotspots) */}
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-amber-900/10 border-4 border-white bg-amber-100 my-2">
        <img
          src={page.image}
          alt={page.altText}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </div>

      {/* Bottom Half: Story Text Box with Synchronized Word Highlighting & Large Voca Words */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-amber-200/80 my-2 flex-1 flex flex-col justify-center">
        <div className="text-center sm:text-left">
          {/* Large story text matching 'I like Pip' size */}
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-relaxed font-sans">
            {wordTokens.map((token, index) => {
              const isCurrentActiveWord = isPlayingAudio && activeWordIndex === index;
              const cleanWord = token.cleanWord;
              const isGlossary =
                page.highlightWords.includes(cleanWord) ||
                (cleanWord === 'chirps' && page.highlightWords.includes('chirp')) ||
                (cleanWord === 'pushes' && page.highlightWords.includes('push'));

              return (
                <React.Fragment key={index}>
                  {isGlossary ? (
                    <button
                      onClick={() => handleWordClick(cleanWord)}
                      className={`inline-block font-black transition-all px-1.5 py-0.5 rounded-md cursor-pointer ${
                        isCurrentActiveWord
                          ? 'word-active'
                          : 'text-amber-950 border-b-4 border-amber-500 hover:bg-amber-100 hover:text-amber-900'
                      }`}
                      title="Tap for meaning & pronunciation"
                    >
                      {token.word}
                    </button>
                  ) : (
                    <span
                      className={`inline-block transition-all px-0.5 py-0.5 rounded-md ${
                        isCurrentActiveWord ? 'word-active' : ''
                      }`}
                    >
                      {token.word}
                    </span>
                  )}
                  {' '}
                </React.Fragment>
              );
            })}
          </p>
        </div>

        {/* Large Voca Word Chips (Enlarged to match 'I like Pip' size) */}
        <div className="mt-5 pt-4 border-t-2 border-amber-100">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-base sm:text-lg font-black text-amber-950 font-display">
              Vocabulary Words:
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {page.highlightWords.map((w) => {
              if (w === 'chirps' || w === 'pushes') return null;
              const clean = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
              const item = GLOSSARY_DICTIONARY[clean];

              return (
                <button
                  key={w}
                  onClick={() => handleWordClick(w)}
                  className="px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xl sm:text-2xl font-display border-2 border-amber-300 shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 min-h-[52px]"
                  title={`Tap to learn "${w}"`}
                >
                  <span className="text-2xl sm:text-3xl drop-shadow-xs">{item?.emoji || '⭐'}</span>
                  <span className="capitalize">{w}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Controls Bar (Slow button removed per request) */}
      <div className="flex items-center justify-between gap-3 pt-2 pb-3">
        {/* Previous Button */}
        <button
          onClick={handlePrevClick}
          className="py-3.5 px-4 sm:px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-black text-sm sm:text-base border border-slate-200 flex items-center justify-center gap-1.5 min-h-[52px] shadow-xs active:scale-95 transition-all shrink-0"
          title="Go back to previous page"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        {/* Center: [🔊 Read to me] Button (Full and prominent) */}
        <button
          onClick={handleReadAloud}
          className={`flex-1 py-3.5 px-4 sm:px-6 rounded-2xl font-black text-base sm:text-lg font-display flex items-center justify-center gap-2 shadow-md transition-all min-h-[52px] ${
            isPlayingAudio
              ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-300/60 scale-98'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 active:scale-95'
          }`}
        >
          <Volume2 className={`w-5 h-5 sm:w-6 sm:h-6 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          <span>{isPlayingAudio ? 'Listening...' : 'Read to me'}</span>
        </button>

        {/* Right: [Question ▶] Button */}
        <button
          onClick={handleNextClick}
          className={`py-3.5 px-4 sm:px-6 rounded-2xl font-black text-sm sm:text-base font-display flex items-center justify-center gap-1.5 shadow-md transition-all min-h-[52px] shrink-0 ${
            hasListenedAtLeastOnce
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 animate-pulse-glow active:scale-95'
              : 'bg-slate-200 text-slate-400 hover:bg-amber-100 hover:text-amber-800'
          }`}
          title={hasListenedAtLeastOnce ? 'Go to question' : 'Listen first to unlock question'}
        >
          <span>Question</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
