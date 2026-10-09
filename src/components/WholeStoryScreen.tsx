/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play, Square, Sparkles } from 'lucide-react';
import { STORY_PAGES, GLOSSARY_DICTIONARY, GlossaryItem } from '../data/storyData';
import { speakText, stopSpeaking, playSoundEffect, parseWordTokens, WordToken } from '../utils/audioEngine';

interface WholeStoryScreenProps {
  pageIndex: number;
  totalPages: number;
  onPageChange: (nextPageIndex: number) => void;
  onFinishStory: () => void;
  onStopToCover: () => void;
  onOpenGlossary: (item: GlossaryItem) => void;
}

interface SentenceSpan {
  text: string;
  startIndex: number;
  firstWordIndex: number;
  lastWordIndex: number;
}

function computeSentenceSpans(text: string, tokens: WordToken[]): SentenceSpan[] {
  const spans: SentenceSpan[] = [];
  if (tokens.length === 0) return spans;

  let currentStartWord = 0;
  for (let i = 0; i < tokens.length; i++) {
    const isTerminal = /[.!?]['"]?$/.test(tokens[i].word);
    const isLast = i === tokens.length - 1;

    if (isTerminal || isLast) {
      const firstToken = tokens[currentStartWord];
      const lastToken = tokens[i];
      spans.push({
        text: text.slice(firstToken.startIndex, lastToken.endIndex),
        startIndex: firstToken.startIndex,
        firstWordIndex: currentStartWord,
        lastWordIndex: i,
      });
      currentStartWord = i + 1;
    }
  }

  return spans.length > 0
    ? spans
    : [
        {
          text,
          startIndex: 0,
          firstWordIndex: 0,
          lastWordIndex: tokens.length - 1,
        },
      ];
}

function getSentenceIndexForWord(spans: SentenceSpan[], wordIdx: number): number {
  for (let i = 0; i < spans.length; i++) {
    if (wordIdx >= spans[i].firstWordIndex && wordIdx <= spans[i].lastWordIndex) {
      return i;
    }
  }
  return 0;
}

export const WholeStoryScreen: React.FC<WholeStoryScreenProps> = ({
  pageIndex,
  totalPages,
  onPageChange,
  onFinishStory,
  onStopToCover,
  onOpenGlossary,
}) => {
  const page = STORY_PAGES[pageIndex];
  const wordTokens = parseWordTokens(page.text);
  const sentenceSpans = computeSentenceSpans(page.text, wordTokens);

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSlow, setIsSlow] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const currentWordIndexRef = useRef<number>(0);
  const currentSentenceIndexRef = useRef<number>(0);
  const pausedSentenceIndexRef = useRef<number>(0);
  const transitionTimerRef = useRef<number | null>(null);
  const isManuallyControlledRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  // Play narration starting from a given sentence index
  const startNarrationFromSentence = (sentenceIdx: number, slowMode: boolean) => {
    stopSpeaking();
    if (!isMountedRef.current) return;

    const span = sentenceSpans[sentenceIdx] || sentenceSpans[0];
    const speechText = page.text.slice(span.startIndex);
    const wordOffset = span.firstWordIndex;

    currentWordIndexRef.current = wordOffset;
    currentSentenceIndexRef.current = sentenceIdx;
    setActiveWordIndex(wordOffset);

    const rate = slowMode ? 0.65 : 0.88;

    speakText(speechText, {
      rate,
      onWordBoundary: (relativeIdx) => {
        if (!isMountedRef.current || isManuallyControlledRef.current) return;
        const absIdx = wordOffset + relativeIdx;
        currentWordIndexRef.current = absIdx;
        currentSentenceIndexRef.current = getSentenceIndexForWord(sentenceSpans, absIdx);
        setActiveWordIndex(absIdx);
      },
      onEnd: () => {
        if (!isMountedRef.current || isManuallyControlledRef.current) return;
        handlePageComplete();
      },
      onError: () => {
        if (!isMountedRef.current || isManuallyControlledRef.current) return;
        handlePageComplete();
      },
    });
  };

  // Called when speech on this page completes naturally
  const handlePageComplete = () => {
    setActiveWordIndex(null);
    setIsTransitioning(true);
    playSoundEffect('chime');

    // Wait about 1 second and automatically move to next page
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    transitionTimerRef.current = window.setTimeout(() => {
      if (!isMountedRef.current) return;
      setIsTransitioning(false);

      if (pageIndex + 1 < totalPages) {
        onPageChange(pageIndex + 1);
      } else {
        // Finished last page! Show 'The End' screen
        playSoundEffect('fanfare');
        onFinishStory();
      }
    }, 1000);
  };

  // When page changes or mounts: start narration immediately
  useEffect(() => {
    isMountedRef.current = true;
    isManuallyControlledRef.current = false;
    setIsPaused(false);
    setIsTransitioning(false);
    setActiveWordIndex(null);
    currentWordIndexRef.current = 0;
    currentSentenceIndexRef.current = 0;
    pausedSentenceIndexRef.current = 0;

    // Start playing current page from beginning
    startNarrationFromSentence(0, isSlow);

    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      stopSpeaking();
    };
  }, [pageIndex]);

  // Handle Pause
  const handlePause = () => {
    playSoundEffect('pop');
    isManuallyControlledRef.current = true;
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    stopSpeaking();
    pausedSentenceIndexRef.current = currentSentenceIndexRef.current;
    setIsPaused(true);
  };

  // Handle Resume (continues from the sentence where it stopped)
  const handleResume = () => {
    playSoundEffect('pop');
    isManuallyControlledRef.current = false;
    setIsPaused(false);

    if (isTransitioning) {
      // If paused during the 1s delay before next page, advance immediately
      if (pageIndex + 1 < totalPages) {
        onPageChange(pageIndex + 1);
      } else {
        onFinishStory();
      }
      return;
    }

    startNarrationFromSentence(pausedSentenceIndexRef.current, isSlow);
  };

  // Handle Stop (returns to the cover)
  const handleStop = () => {
    playSoundEffect('pop');
    isManuallyControlledRef.current = true;
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    stopSpeaking();
    onStopToCover();
  };

  // Handle Slow Toggle (toggle normal / slow)
  const handleToggleSlow = () => {
    playSoundEffect('pop');
    const newSlow = !isSlow;
    setIsSlow(newSlow);

    if (!isPaused && !isTransitioning) {
      // Re-trigger narration from current sentence at the new speed
      const targetSentence = currentSentenceIndexRef.current;
      startNarrationFromSentence(targetSentence, newSlow);
    }
  };

  const handleWordClick = (rawOrClean: string) => {
    const clean = rawOrClean.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const wordKey =
      clean === 'chirps' ? 'chirp' :
      clean === 'pushes' ? 'push' :
      clean;

    const glossaryItem = GLOSSARY_DICTIONARY[wordKey] || GLOSSARY_DICTIONARY[clean];
    if (glossaryItem) {
      // Pause narration when student opens glossary
      if (!isPaused) {
        handlePause();
      }
      playSoundEffect('pop');
      onOpenGlossary(glossaryItem);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-xl mx-auto px-4 py-3 select-none">
      {/* Top Meta Bar: Progress Indicator */}
      <div className="flex items-center justify-between py-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-black text-amber-950 font-display text-base tracking-wide flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            Page {page.pageNumber} / {totalPages}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-700 font-extrabold truncate max-w-[150px] sm:max-w-[200px]">
            {page.sceneTitle}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Autoplay Narration</span>
        </div>
      </div>

      {/* Top Half: Illustration Container */}
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-amber-900/10 border-4 border-white bg-amber-100 my-2">
        <img
          src={page.image}
          alt={page.altText}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {isPaused && (
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in">
            <div className="px-4 py-2 rounded-2xl bg-white/95 text-slate-900 font-black text-sm sm:text-base flex items-center gap-2 shadow-lg">
              <Pause className="w-5 h-5 fill-current text-amber-600" />
              <span>Paused · Tap Resume to continue</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Half: Story Text Box with Synchronized Word Highlighting */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-amber-200/80 my-2 flex-1 flex flex-col justify-center">
        <div className="text-center sm:text-left">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-relaxed font-sans">
            {wordTokens.map((token, index) => {
              const isCurrentActiveWord = !isPaused && activeWordIndex === index;
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
                          ? 'word-active scale-105'
                          : 'text-amber-950 border-b-4 border-amber-500 hover:bg-amber-100'
                      }`}
                      title="Tap for meaning"
                    >
                      {token.word}
                    </button>
                  ) : (
                    <span
                      className={`inline-block transition-all px-0.5 py-0.5 rounded-md ${
                        isCurrentActiveWord ? 'word-active scale-105' : ''
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

        {/* Status Hint */}
        <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs sm:text-sm font-bold text-amber-950/70">
          <span>{isPaused ? 'Narration paused' : isTransitioning ? 'Turning page in 1s...' : 'Reading aloud in American English...'}</span>
          <span className="text-xs text-slate-400">Speed: {isSlow ? '0.65x' : '0.88x'}</span>
        </div>
      </div>

      {/* Large Rounded Control Buttons at the Bottom */}
      {/* ⏸ Pause / ▶ Resume, ⏹ Stop (returns to cover), 🐢 Slow (toggle normal/slow) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2 pb-3">
        {/* 1. ⏸ Pause / ▶ Resume */}
        {isPaused ? (
          <button
            onClick={handleResume}
            className="py-4 px-3 sm:px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-base sm:text-lg font-display shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all min-h-[56px]"
            title="Resume narration"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="py-4 px-3 sm:px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-base sm:text-lg font-display shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all min-h-[56px]"
            title="Pause narration"
          >
            <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            <span>Pause</span>
          </button>
        )}

        {/* 2. ⏹ Stop (returns to the cover) */}
        <button
          onClick={handleStop}
          className="py-4 px-3 sm:px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-base sm:text-lg font-display shadow-md flex items-center justify-center gap-2 transition-all min-h-[56px]"
          title="Stop and return to cover"
        >
          <Square className="w-5 h-5 fill-current" />
          <span>Stop</span>
        </button>

        {/* 3. 🐢 Slow (toggle normal/slow) */}
        <button
          onClick={handleToggleSlow}
          className={`py-4 px-3 sm:px-5 rounded-2xl font-black text-base sm:text-lg font-display border-2 flex items-center justify-center gap-2 transition-all min-h-[56px] shadow-sm ${
            isSlow
              ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300'
              : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200'
          }`}
          title={isSlow ? 'Switch to normal speed' : 'Switch to slow speed'}
        >
          <span className="text-xl">{isSlow ? '🐰' : '🐢'}</span>
          <span>{isSlow ? 'Normal' : 'Slow'}</span>
        </button>
      </div>
    </div>
  );
};
