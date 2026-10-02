/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { CoverScreen } from './components/CoverScreen';
import { StoryPageScreen } from './components/StoryPageScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';
import { StoryMapRetell } from './components/StoryMapRetell';
import { GlossaryModal } from './components/GlossaryModal';
import { StorySelectorModal } from './components/StorySelectorModal';
import { CertificateModal } from './components/CertificateModal';
import { ParentTeacherGuideModal } from './components/ParentTeacherGuideModal';
import {
  STORY_PAGES,
  GLOSSARY_DICTIONARY,
  GlossaryItem,
} from './data/storyData';
import { stopSpeaking, playSoundEffect } from './utils/audioEngine';

type AppScreen = 'cover' | 'story' | 'question' | 'retell' | 'result';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('cover');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals state
  const [activeGlossaryItem, setActiveGlossaryItem] = useState<GlossaryItem | null>(null);
  const [showStorySelector, setShowStorySelector] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showTeacherGuide, setShowTeacherGuide] = useState<boolean>(false);
  const [savedReflection, setSavedReflection] = useState<{ sentence: string; emoji: string }>({
    sentence: 'I like Pip the puppy because it was super cute and playful.',
    emoji: '😊',
  });

  const totalPages = STORY_PAGES.length;
  const currentPage = STORY_PAGES[currentPageIndex];

  // Stop speech when changing major screens
  useEffect(() => {
    stopSpeaking();
  }, [screen]);

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleStartStory = () => {
    setCurrentPageIndex(0);
    setScore(0);
    setScreen('story');
  };

  const handleProceedToQuestion = () => {
    setScreen('question');
  };

  const handleAnswerCorrect = () => {
    setScore((prev) => prev + 1);
  };

  const handleProceedFromQuestion = () => {
    if (currentPageIndex + 1 < totalPages) {
      setCurrentPageIndex((prev) => prev + 1);
      setScreen('story');
    } else {
      // Completed all 10 pages!
      playSoundEffect('fanfare');
      setScreen('result');
    }
  };

  const handlePreviousPage = () => {
    stopSpeaking();
    playSoundEffect('pageFlip');
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      setScreen('story');
    } else {
      setScreen('cover');
    }
  };

  const handlePreviousFromQuestion = () => {
    stopSpeaking();
    playSoundEffect('pageFlip');
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      setScreen('question');
    } else {
      setScreen('story');
    }
  };

  const handleJumpToPage = (pageIndex: number) => {
    stopSpeaking();
    playSoundEffect('pageFlip');
    setCurrentPageIndex(pageIndex);
    setScreen('story');
  };

  const handleJumpToResult = () => {
    stopSpeaking();
    playSoundEffect('pageFlip');
    setScreen('result');
  };

  const handleBackToStoryFromQuestion = () => {
    stopSpeaking();
    playSoundEffect('pageFlip');
    setScreen('story');
  };

  const handleReadAgain = () => {
    setCurrentPageIndex(0);
    setScore(0);
    setScreen('story');
  };

  const handleResetToCover = () => {
    stopSpeaking();
    setScreen('cover');
  };

  const handleOpenCertificate = (sentence: string, emoji: string) => {
    setSavedReflection({ sentence, emoji });
    setShowCertificate(true);
  };

  const handleOpenGlossaryByWord = (word: string) => {
    const item = GLOSSARY_DICTIONARY[word];
    if (item) {
      setActiveGlossaryItem(item);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-100/40 text-slate-800 flex flex-col font-sans">
      {/* Top Application Header Bar */}
      <HeaderBar
        currentPage={currentPageIndex + 1}
        totalPages={totalPages}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenGuide={() => setShowTeacherGuide(true)}
        onResetToCover={screen !== 'cover' ? handleResetToCover : undefined}
        onJumpToPage={handleJumpToPage}
        onJumpToResult={handleJumpToResult}
        isResultScreen={screen === 'result'}
        showProgress={screen === 'story' || screen === 'question' || screen === 'result'}
      />

      {/* Main Screen Content View */}
      <main className="flex-1 flex flex-col">
        {screen === 'cover' && (
          <CoverScreen
            onStartStory={handleStartStory}
            onOpenGuide={() => setShowTeacherGuide(true)}
          />
        )}

        {screen === 'story' && (
          <StoryPageScreen
            key={`story-page-${currentPageIndex}`}
            page={currentPage}
            totalPages={totalPages}
            onOpenGlossary={(item) => setActiveGlossaryItem(item)}
            onProceedToQuestion={handleProceedToQuestion}
            onPreviousPage={handlePreviousPage}
          />
        )}

        {screen === 'question' && (
          <QuestionScreen
            key={`question-page-${currentPageIndex}`}
            pageNumber={currentPageIndex + 1}
            totalPages={totalPages}
            question={currentPage.question}
            onAnswerCorrect={handleAnswerCorrect}
            onProceedNext={handleProceedFromQuestion}
            onPrevious={handlePreviousFromQuestion}
            onBackToStory={handleBackToStoryFromQuestion}
          />
        )}

        {screen === 'retell' && (
          <StoryMapRetell
            onBackToResults={() => setScreen('result')}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            score={score}
            totalQuestions={totalPages}
            onReadAgain={handleReadAgain}
            onChooseAnotherStory={() => setShowStorySelector(true)}
            onOpenRetell={() => setScreen('retell')}
            onOpenCertificate={handleOpenCertificate}
          />
        )}
      </main>

      {/* Tap-a-Word Picture Glossary Modal */}
      {activeGlossaryItem && (
        <GlossaryModal
          item={activeGlossaryItem}
          onClose={() => setActiveGlossaryItem(null)}
        />
      )}

      {/* Choose Another Story Library Modal */}
      {showStorySelector && (
        <StorySelectorModal
          onClose={() => setShowStorySelector(false)}
          onSelectLostHat={() => {
            setShowStorySelector(false);
            handleReadAgain();
          }}
        />
      )}

      {/* Official Reading Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          score={score}
          totalQuestions={totalPages}
          reflectionSentence={savedReflection.sentence}
          reactionEmoji={savedReflection.emoji}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Teacher & Parent Learning Guide Modal */}
      {showTeacherGuide && (
        <ParentTeacherGuideModal
          onClose={() => setShowTeacherGuide(false)}
          onOpenGlossaryWord={(word) => {
            setShowTeacherGuide(false);
            handleOpenGlossaryByWord(word);
          }}
        />
      )}
    </div>
  );
}
