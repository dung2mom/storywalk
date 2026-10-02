/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Volume2, VolumeX, HelpCircle, Trophy } from 'lucide-react';
import { playSoundEffect } from '../utils/audioEngine';

interface HeaderBarProps {
  currentPage: number;
  totalPages: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenGuide: () => void;
  onResetToCover?: () => void;
  onJumpToPage?: (pageIndex: number) => void;
  onJumpToResult?: () => void;
  isResultScreen?: boolean;
  showProgress?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentPage,
  totalPages,
  isMuted,
  onToggleMute,
  onOpenGuide,
  onResetToCover,
  onJumpToPage,
  onJumpToResult,
  isResultScreen = false,
  showProgress = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-3 sm:px-4 py-2.5 transition-all shadow-xs">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        {/* Top row: Brand + Audio/Guide Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Zone */}
          <div className="flex items-center gap-2">
            {onResetToCover ? (
              <button
                onClick={() => {
                  playSoundEffect('pop');
                  onResetToCover();
                }}
                className="flex items-center gap-2 text-left group"
                title="Return to Cover"
              >
                <div className="w-9 h-9 rounded-2xl bg-amber-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform text-white font-bold">
                  <BookOpen className="w-5 h-5 text-amber-950" />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black tracking-tight text-amber-950 font-display flex items-center gap-1.5">
                    StoryWalk!
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 hidden sm:inline-block">
                      The Lost Hat
                    </span>
                  </span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 flex items-center justify-center shadow-xs text-white font-bold">
                  <BookOpen className="w-5 h-5 text-amber-950" />
                </div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-amber-950 font-display">
                  StoryWalk!
                </span>
              </div>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {/* Mute Toggle */}
            <button
              onClick={() => {
                playSoundEffect('pop');
                onToggleMute();
              }}
              className="p-2 text-slate-700 hover:text-amber-900 rounded-xl hover:bg-amber-50 border border-slate-200 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label="Toggle mute"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Parent/Teacher Guide */}
            <button
              onClick={() => {
                playSoundEffect('pop');
                onOpenGuide();
              }}
              className="p-2 text-amber-900 hover:text-amber-950 rounded-xl hover:bg-amber-100/70 border border-amber-200 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Learning Objectives & Sight Words"
              aria-label="Story Guide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Second row: Clickable Page Number Navigator: 1 to 10 + Result */}
        {showProgress && onJumpToPage && (
          <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-amber-100/90">
            <span className="text-xs sm:text-sm font-black text-amber-950/80 font-display shrink-0 mr-1">
              Pages:
            </span>

            {/* Clickable Page Number Buttons 1 to 10 + Result button */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 scrollbar-none flex-1 justify-between sm:justify-start">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isCurrent = !isResultScreen && currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      playSoundEffect('pop');
                      onJumpToPage(pageNum - 1);
                    }}
                    className={`min-w-[30px] sm:min-w-[36px] h-8 sm:h-9 rounded-xl font-black text-xs sm:text-sm font-display flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300 scale-105'
                        : 'bg-amber-100/80 hover:bg-amber-200 text-amber-950 border border-amber-200/80 hover:scale-105 active:scale-95'
                    }`}
                    title={`Jump to Page ${pageNum}`}
                    aria-label={`Jump directly to Page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Result Button right after 10 */}
              {onJumpToResult && (
                <button
                  onClick={() => {
                    playSoundEffect('pop');
                    onJumpToResult();
                  }}
                  className={`min-w-[64px] sm:min-w-[74px] h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl font-black text-xs sm:text-sm font-display flex items-center justify-center gap-1 transition-all shrink-0 ${
                    isResultScreen
                      ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300 scale-105'
                      : 'bg-amber-100/80 hover:bg-amber-200 text-amber-950 border border-amber-200/80 hover:scale-105 active:scale-95'
                  }`}
                  title="Jump to Result page"
                  aria-label="Jump directly to Result page"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Result</span>
                </button>
              )}
            </div>

            <span className="text-xs sm:text-sm font-black text-amber-950 font-display shrink-0 ml-1.5 hidden sm:inline">
              {isResultScreen ? 'Result ⭐' : `Page ${currentPage} / ${totalPages}`}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
