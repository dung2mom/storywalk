/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Sparkles, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { MORE_STORIES, STORY_IMAGES } from '../data/storyData';
import { playSoundEffect } from '../utils/audioEngine';

interface StorySelectorModalProps {
  onClose: () => void;
  onSelectLostHat: () => void;
}

export const StorySelectorModal: React.FC<StorySelectorModalProps> = ({
  onClose,
  onSelectLostHat,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-amber-300 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            playSoundEffect('pop');
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Close stories selector"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h3 className="text-xl font-black text-amber-950 font-display">
            Story Library
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Guided read-along adventures for 3rd–4th grade English learners.
        </p>

        {/* Current Active Story Card */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 relative mb-3.5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-300 bg-amber-100">
              <img
                src={STORY_IMAGES.cover}
                alt="The Lost Hat"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-display">
                  Active Story
                </span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Ready to Read
                </span>
              </div>
              <h4 className="text-base font-black text-amber-950 truncate font-display mt-0.5">
                The Lost Hat
              </h4>
              <p className="text-xs text-slate-600 line-clamp-1">
                Leo the bear loses his favorite yellow hat in the wind.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoundEffect('pop');
              onSelectLostHat();
            }}
            className="w-full mt-3 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs"
          >
            <span>Read "The Lost Hat"</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Upcoming Library Stories */}
        <div className="space-y-3">
          {MORE_STORIES.map((story) => (
            <div
              key={story.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left relative opacity-90 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {story.level}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {story.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-800 font-display mt-1">
                    {story.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {story.description}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                <span>{story.pages} Pages · Sound Effects</span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Unlocks with reading streak! ⭐
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            playSoundEffect('pop');
            onClose();
          }}
          className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
