/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, AlertCircle, ArrowRight, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { PageQuestion, QuestionChoice } from '../data/storyData';
import { speakText, stopSpeaking, playSoundEffect } from '../utils/audioEngine';

interface QuestionScreenProps {
  pageNumber: number;
  totalPages: number;
  question: PageQuestion;
  onAnswerCorrect: () => void;
  onProceedNext: () => void;
  onPrevious: () => void;
  onBackToStory?: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  pageNumber,
  totalPages,
  question,
  onAnswerCorrect,
  onProceedNext,
  onPrevious,
  onBackToStory,
}) => {
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    // Reset state for new question
    setSelectedChoiceIdx(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowHint(false);
    setAttemptCount(0);

    return () => {
      stopSpeaking();
    };
  }, [pageNumber]);

  const handleReadQuestion = () => {
    playSoundEffect('pop');
    speakText(question.audioPromptText, { rate: 0.85 });
  };

  const handleSelectChoice = (choice: QuestionChoice, idx: number) => {
    if (isAnswered && isCorrect) return; // already solved correctly

    setSelectedChoiceIdx(idx);
    const newAttempt = attemptCount + 1;
    setAttemptCount(newAttempt);

    if (choice.isCorrect) {
      setIsAnswered(true);
      setIsCorrect(true);
      setShowHint(false);
      playSoundEffect('chime');
      if (newAttempt === 1) {
        onAnswerCorrect();
      }
    } else {
      setIsCorrect(false);
      playSoundEffect('nudge');
      setShowHint(true);

      // If failed twice, reveal the correct choice gently
      if (newAttempt >= 2) {
        setIsAnswered(true);
      }
    }
  };

  const handleContinue = () => {
    playSoundEffect('pop');
    stopSpeaking();
    onProceedNext();
  };

  const handlePrev = () => {
    playSoundEffect('pop');
    stopSpeaking();
    onPrevious();
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-xl mx-auto px-4 py-4 select-none">
      {/* Top Header info */}
      <div className="flex items-center justify-between text-xs py-1">
        <div className="flex items-center gap-2">
          {onBackToStory && (
            <button
              onClick={() => {
                playSoundEffect('pop');
                onBackToStory();
              }}
              className="py-1 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs border border-slate-200 flex items-center gap-1 shadow-xs transition-colors"
              title="Return to story text"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Story</span>
            </button>
          )}
          <span className="font-extrabold text-amber-950 font-display text-sm tracking-wide">
            Question {pageNumber} of {totalPages}
          </span>
        </div>
        <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[11px] capitalize">
          {question.type.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Center Question Card */}
      <div className="my-auto py-2">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-amber-200/90 text-center relative overflow-hidden">
          {/* Audio listen button for question */}
          <div className="flex justify-center mb-3">
            <button
              onClick={handleReadQuestion}
              className="py-1.5 px-3.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors border border-amber-200 min-h-[40px]"
              title="Listen to question"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Listen to Question</span>
            </button>
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug font-display px-2">
            {question.prompt}
          </h2>

          {/* 2-3 Answer Choice Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
            {question.choices.map((choice, idx) => {
              const isSelected = selectedChoiceIdx === idx;
              const showAsCorrect = (isSelected && isCorrect) || (isAnswered && choice.isCorrect);
              const showAsIncorrect = isSelected && isCorrect === false;

              let buttonStyle = 'bg-slate-50 hover:bg-amber-50/80 text-slate-800 border-slate-200 hover:border-amber-300';
              if (showAsCorrect) {
                buttonStyle = 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-2 ring-emerald-400 shadow-emerald-500/20';
              } else if (showAsIncorrect) {
                buttonStyle = 'bg-rose-50 text-rose-950 border-rose-400 ring-2 ring-rose-300 animate-wiggle-soft';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectChoice(choice, idx)}
                  disabled={isAnswered && isCorrect === true}
                  className={`p-4 rounded-2xl border-2 font-black text-lg sm:text-xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm active:scale-95 min-h-[90px] min-w-[44px] cursor-pointer ${buttonStyle}`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                    {choice.emoji}
                  </span>
                  <span className="font-extrabold tracking-tight">
                    {choice.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback Display Banner */}
          {isCorrect === true && (
            <div className="mt-5 p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="font-extrabold text-sm sm:text-base font-display">
                Nice! ⭐ {question.explanation}
              </span>
            </div>
          )}

          {showHint && isCorrect === false && (
            <div className="mt-5 p-3.5 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 flex items-start gap-2.5 animate-in slide-in-from-top-2 text-left">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <span className="font-extrabold block">Almost there! 🔁</span>
                <span className="font-medium text-amber-900">{question.hint}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar: Previous and Next always available */}
      <div className="flex items-center justify-between gap-2.5 pt-2 pb-3">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="py-3 px-3.5 sm:px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-200 flex items-center justify-center gap-1 min-h-[50px] shadow-xs active:scale-95 transition-all shrink-0"
          title="Go to previous page or question"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Previous</span>
        </button>

        {/* Center: Quick Story View */}
        {onBackToStory && (
          <button
            onClick={() => {
              playSoundEffect('pop');
              onBackToStory();
            }}
            className="hidden sm:flex py-3 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 items-center justify-center gap-1.5 min-h-[50px] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Review Story</span>
          </button>
        )}

        {/* Next Button */}
        <button
          onClick={handleContinue}
          className={`py-3 px-4 sm:px-6 rounded-2xl font-black text-xs sm:text-sm font-display flex items-center justify-center gap-1.5 shadow-md transition-all min-h-[50px] shrink-0 ${
            isAnswered
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 animate-pulse-glow active:scale-95'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 active:scale-95'
          }`}
          title={pageNumber === totalPages ? 'See results' : 'Go to next page'}
        >
          <span>{pageNumber === totalPages ? 'See Results' : 'Next'}</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
