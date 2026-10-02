/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RotateCcw, BookOpen, Volume2, Mic, Square, Play, Pause, Award, MapPin, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { REFLECTION_OPTIONS, STORY_IMAGES } from '../data/storyData';
import { speakText, playSoundEffect, stopSpeaking } from '../utils/audioEngine';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onReadAgain: () => void;
  onChooseAnotherStory: () => void;
  onOpenRetell: () => void;
  onOpenCertificate: (sentence: string, emoji: string) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  onReadAgain,
  onChooseAnotherStory,
  onOpenRetell,
  onOpenCertificate,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<'😊' | '🙁' | '😮' | null>('😊');
  const [selectedSubject, setSelectedSubject] = useState<string>('Pip the puppy');
  const [selectedReason, setSelectedReason] = useState<string>('it was super cute and playful');
  const [isSpeakingModel, setIsSpeakingModel] = useState(false);

  // Real Audio Recording & Playback State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const fullSentence = `I like ${selectedSubject} because ${selectedReason}.`;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, []);

  const handleEmojiClick = (emoji: '😊' | '🙁' | '😮') => {
    playSoundEffect('pop');
    setSelectedEmoji(emoji);
  };

  const handlePlayModelSentence = () => {
    playSoundEffect('pop');
    if (audioElementRef.current && isPlayingRecording) {
      audioElementRef.current.pause();
      setIsPlayingRecording(false);
    }

    setIsSpeakingModel(true);
    speakText(fullSentence, {
      rate: 0.88,
      onEnd: () => setIsSpeakingModel(false),
      onError: () => setIsSpeakingModel(false),
    });
  };

  // Start recording student voice using browser MediaRecorder
  const handleStartRecording = async () => {
    stopSpeaking();
    setMicErrorMessage(null);

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlayingRecording(false);
    }

    try {
      playSoundEffect('pop');

      // Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        if (recordedAudioUrl) {
          URL.revokeObjectURL(recordedAudioUrl);
        }

        const newUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(newUrl);
        setIsRecording(false);
        playSoundEffect('chime');

        // Stop microphone stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording with 250ms timeslice to ensure dataavailable fires continuously
      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      // Timer counter (auto stop at 10 seconds)
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 10) {
            handleStopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone error or permission denied:', err);
      setIsRecording(false);
      setMicErrorMessage(
        'Microphone permission is required to record your voice. In Chrome, please click the site settings / lock icon in the address bar to allow Microphone.'
      );
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.requestData();
      } catch (e) {}
      mediaRecorderRef.current.stop();
    }
  };

  // Playback recorded student voice
  const handleTogglePlayRecording = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecording && audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlayingRecording(false);
      return;
    }

    stopSpeaking();
    playSoundEffect('pop');

    if (audioElementRef.current) {
      audioElementRef.current.play().then(() => {
        setIsPlayingRecording(true);
      }).catch((err) => {
        console.warn('Audio playback error:', err);
        setIsPlayingRecording(false);
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-xl mx-auto px-4 py-5 select-none">
      {/* Top Heading with Star Badge */}
      <div className="text-center pt-1">
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300 bg-amber-50 animate-float-gentle">
            <img
              src={STORY_IMAGES.badge}
              alt="Story Explorer Badge"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full p-1.5 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-amber-950 font-display mt-3">
          You finished the story!
        </h1>

        {/* Score Line */}
        <p className="text-lg sm:text-xl font-extrabold text-amber-800 mt-1">
          You answered <span className="text-amber-950 font-black text-2xl">{score} / {totalQuestions}</span> correctly
        </p>
      </div>

      {/* Center Reflection Card */}
      <div className="my-3 space-y-4">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-amber-200/90 text-left">
          {/* Reaction Emoji Row */}
          <div>
            <span className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-950 block font-display mb-2.5">
              1. How did the story make you feel?
            </span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: '😊', label: 'Happy' },
                { emoji: '😮', label: 'Surprised' },
                { emoji: '🙁', label: 'Sad' },
              ].map((item) => (
                <button
                  key={item.emoji}
                  onClick={() => handleEmojiClick(item.emoji as '😊' | '🙁' | '😮')}
                  className={`py-3 px-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all min-h-[52px] ${
                    selectedEmoji === item.emoji
                      ? 'border-amber-500 bg-amber-100/90 text-amber-950 font-black shadow-sm scale-[1.02]'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                  <span className="text-sm sm:text-base font-black font-display">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sentence-Chip Builder: "I like ___ because ___." */}
          <div className="mt-6 pt-5 border-t-2 border-amber-100">
            <span className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-950 block font-display mb-2.5">
              2. Complete your sentence: "I like ___ because ___."
            </span>

            {/* Choose Subject Chips */}
            <div className="space-y-2 mb-4">
              <span className="text-sm sm:text-base font-extrabold text-slate-700">Choose who or what you liked:</span>
              <div className="flex flex-wrap gap-2">
                {REFLECTION_OPTIONS.subjects.map((sub) => (
                  <button
                    key={sub.text}
                    onClick={() => {
                      playSoundEffect('pop');
                      setSelectedSubject(sub.text);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-base sm:text-lg font-black transition-all flex items-center gap-2 border-2 ${
                      selectedSubject === sub.text
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-102'
                        : 'bg-slate-50 hover:bg-amber-100/70 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-xl">{sub.emoji}</span>
                    <span>{sub.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Reason Chips */}
            <div className="space-y-2 mb-4">
              <span className="text-sm sm:text-base font-extrabold text-slate-700">Choose why:</span>
              <div className="flex flex-wrap gap-2">
                {REFLECTION_OPTIONS.reasons.map((res) => (
                  <button
                    key={res.text}
                    onClick={() => {
                      playSoundEffect('pop');
                      setSelectedReason(res.text);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-base sm:text-lg font-black transition-all flex items-center gap-2 border-2 ${
                      selectedReason === res.text
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-102'
                        : 'bg-slate-50 hover:bg-amber-100/70 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-xl">{res.emoji}</span>
                    <span>{res.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Assembled Sentence Preview Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-dashed border-amber-300 mt-2">
              <p className="text-xl sm:text-2xl font-black text-amber-950 font-display leading-snug">
                "{fullSentence}"
              </p>

              {/* Microphone Permission Notice & Full Tab Helper */}
              {micErrorMessage && (
                <div className="mt-3.5 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs sm:text-sm font-bold space-y-2 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block text-sm">Microphone permission notice:</span>
                      <span>{micErrorMessage}</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <a
                      href={typeof window !== 'undefined' ? window.location.href : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors shadow-xs"
                    >
                      <span>Open in Full Window for Direct Mic Access</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Real Voice Recording & Playback Interface */}
              <div className="mt-4 pt-3.5 border-t border-amber-200/80 space-y-3">
                {/* State 1: Currently Recording */}
                {isRecording && (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping shrink-0" />
                      <span className="font-black text-sm sm:text-base text-rose-950 font-display">
                        Recording: 0:0{recordingSeconds} / 0:10 (Speak your sentence now!)
                      </span>
                    </div>

                    <button
                      onClick={handleStopRecording}
                      className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Stop</span>
                    </button>
                  </div>
                )}

                {/* State 2: Not Recording */}
                {!isRecording && (
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Model TTS audio button */}
                    <button
                      onClick={handlePlayModelSentence}
                      className={`py-3 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 transition-all shadow-xs min-h-[48px] ${
                        isSpeakingModel
                          ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                      title="Listen to native model sentence"
                    >
                      <Volume2 className="w-5 h-5 text-amber-600" />
                      <span>{isSpeakingModel ? 'Speaking...' : 'Listen'}</span>
                    </button>

                    {/* Record button */}
                    <button
                      onClick={handleStartRecording}
                      className="py-3 px-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm sm:text-base font-display flex items-center gap-2 shadow-md shadow-rose-500/25 active:scale-95 transition-all min-h-[48px]"
                      title="Record your voice saying this sentence"
                    >
                      <Mic className="w-5 h-5" />
                      <span>{recordedAudioUrl ? 'Record Again' : 'Say It Aloud (Record)'}</span>
                    </button>

                    {/* Listen to My Recording button */}
                    {recordedAudioUrl && (
                      <button
                        onClick={handleTogglePlayRecording}
                        className={`py-3 px-5 rounded-2xl font-black text-sm sm:text-base font-display flex items-center gap-2 shadow-md transition-all min-h-[48px] ${
                          isPlayingRecording
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-102'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 active:scale-95'
                        }`}
                        title="Listen to what you recorded"
                      >
                        {isPlayingRecording ? (
                          <>
                            <Pause className="w-5 h-5 fill-current" />
                            <span>Pause My Voice</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 fill-current" />
                            <span>Listen to My Voice</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Recorded Audio Playback Card */}
                {recordedAudioUrl && !isRecording && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-black text-emerald-950">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Your voice was recorded! Listen to your pronunciation:</span>
                    </div>

                    {/* Native Audio Element with Playback Controls */}
                    <audio
                      ref={audioElementRef}
                      src={recordedAudioUrl}
                      controls
                      className="w-full h-10 mt-1 rounded-xl"
                      onPlay={() => setIsPlayingRecording(true)}
                      onPause={() => setIsPlayingRecording(false)}
                      onEnded={() => setIsPlayingRecording(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Story Map & Certificate CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              playSoundEffect('pop');
              onOpenRetell();
            }}
            className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/80 border border-amber-200 text-amber-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-colors min-h-[50px]"
          >
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>Story Map Retell 🗺️</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('fanfare');
              onOpenCertificate(fullSentence, selectedEmoji || '😊');
            }}
            className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/80 border border-amber-200 text-amber-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-colors min-h-[50px]"
          >
            <Award className="w-5 h-5 text-amber-600" />
            <span>My Certificate 🎖️</span>
          </button>
        </div>
      </div>

      {/* Bottom Actions: [Read Again] and [Choose Another Story] */}
      <div className="grid grid-cols-2 gap-3 pt-2 pb-2">
        <button
          onClick={() => {
            playSoundEffect('pop');
            onReadAgain();
          }}
          className="py-4 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-base sm:text-lg font-display shadow-md flex items-center justify-center gap-2 transition-all min-h-[52px]"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Read Again</span>
        </button>

        <button
          onClick={() => {
            playSoundEffect('pop');
            onChooseAnotherStory();
          }}
          className="py-4 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-base sm:text-lg font-display shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all min-h-[52px]"
        >
          <BookOpen className="w-5 h-5" />
          <span>Choose Another Story</span>
        </button>
      </div>
    </div>
  );
};
