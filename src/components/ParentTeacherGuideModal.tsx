/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, CheckCircle, Lightbulb, Sparkles, Volume2 } from 'lucide-react';
import { GLOSSARY_DICTIONARY } from '../data/storyData';
import { playSoundEffect } from '../utils/audioEngine';

interface ParentTeacherGuideModalProps {
  onClose: () => void;
  onOpenGlossaryWord: (word: string) => void;
}

export const ParentTeacherGuideModal: React.FC<ParentTeacherGuideModalProps> = ({
  onClose,
  onOpenGlossaryWord,
}) => {
  const glossaryList = Array.from(new Map(Object.values(GLOSSARY_DICTIONARY).map((item) => [item.word, item])).values());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-2 border-amber-300 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            playSoundEffect('pop');
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h3 className="text-xl font-black text-amber-950 font-display">
            Teacher & Parent Learning Guide
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Pedagogical framework & Can-Do objectives for Grade 3–4 English learners.
        </p>

        {/* Can-Do Statement (from PRD) */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-left mb-4">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900 font-display mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Can-Do Learning Objective
          </div>
          <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
            "By the end of this story, the learner can listen to and understand a 10-page picture-book story at the 95–98% known-word level, answer simple comprehension questions about it, and say one sentence about how they felt about the story."
          </p>
        </div>

        {/* 3-Step Guided Routine */}
        <div className="space-y-2 mb-5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-display block">
            The 3-Step Guided Routine
          </span>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <span className="font-bold text-slate-900">Step 1: Listening with Sync Highlighting</span>
              <p className="text-slate-600 mt-0.5">Learners connect phonemes to graphemes as words glow in sync with the audio. Slow mode (0.65x) is provided for emerging decoders.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <span className="font-bold text-slate-900">Step 2: Scaffolding with Tap-a-Word Glossary</span>
              <p className="text-slate-600 mt-0.5">Underlined key words pop up in-place with picture, pronunciation, and sample sentence to remove anxiety and eliminate friction.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <span className="font-bold text-slate-900">Step 3: Comprehension & Sentence Construction</span>
              <p className="text-slate-600 mt-0.5">Alternating question types (fill-in-the-blank, yes/no, observation) verify understanding, while the end-of-story reflection empowers kids to speak.</p>
            </div>
          </div>
        </div>

        {/* 20 Core Sight Words Glossary Table */}
        <div className="text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-display">
              Target Vocabulary ({glossaryList.length} Words)
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">Tap to preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {glossaryList.map((item) => (
              <button
                key={item.word}
                onClick={() => {
                  playSoundEffect('pop');
                  onOpenGlossaryWord(item.word);
                }}
                className="p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200/80 flex items-center gap-2 text-left transition-colors"
              >
                <span className="text-lg">{item.emoji}</span>
                <div className="truncate">
                  <span className="text-xs font-black text-amber-950 block capitalize font-display truncate">
                    {item.word}
                  </span>
                  <span className="text-[10px] text-amber-800/80 font-mono">
                    {item.phonetic}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            playSoundEffect('pop');
            onClose();
          }}
          className="w-full mt-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
        >
          Got it, Close Guide
        </button>
      </div>
    </div>
  );
};
