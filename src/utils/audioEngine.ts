/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Audio Engine for StoryWalk! using Web Speech API and Web Audio API synthesized SFX

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundEffectType = 'chime' | 'nudge' | 'pop' | 'whoosh' | 'boing' | 'bark' | 'quack' | 'chirp' | 'fanfare' | 'pageFlip' | 'giggle';

export function playSoundEffect(type: SoundEffectType) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'chime': {
        // Cheerful sparkling 3-note chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.45);
        });
        break;
      }

      case 'nudge': {
        // Soft encouraging 2-tone wobble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(290, now + 0.2);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'pop': {
        // Soft bubble tap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case 'whoosh': {
        // Synthesized gentle wind gust using white noise buffer
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.linearRampToValueAtTime(800, now + 0.25);
        filter.frequency.linearRampToValueAtTime(250, now + 0.5);
        filter.Q.value = 3;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.5);
        break;
      }

      case 'boing': {
        // Playful cartoon spring
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.3);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.33);
        break;
      }

      case 'bark': {
        // Cute playful puppy bark
        [0, 0.15].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now + offset);
          osc.frequency.exponentialRampToValueAtTime(180, now + offset + 0.1);

          gain.gain.setValueAtTime(0.18, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.13);
        });
        break;
      }

      case 'quack': {
        // Duck quack with formants
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(240, now + 0.18);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(750, now);
        filter.Q.value = 4.0;

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
        break;
      }

      case 'chirp': {
        // Happy little bird tweet
        const notes = [1400, 2200, 1800, 2600];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0, now + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.05 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.07);
        });
        break;
      }

      case 'pageFlip': {
        // Quick subtle rustle
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
        break;
      }

      case 'giggle': {
        // Cute playful chuckle
        [0, 0.08, 0.16].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(550, now + offset);
          osc.frequency.linearRampToValueAtTime(700, now + offset + 0.04);
          osc.frequency.linearRampToValueAtTime(580, now + offset + 0.07);

          gain.gain.setValueAtTime(0.16, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.075);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.08);
        });
        break;
      }

      case 'fanfare': {
        // Victory fanfare (C4, E4, G4, C5 high hold)
        const chord = [
          { f: 523.25, time: 0.0, dur: 0.2 },
          { f: 659.25, time: 0.18, dur: 0.2 },
          { f: 783.99, time: 0.36, dur: 0.25 },
          { f: 1046.5, time: 0.6, dur: 0.8 },
        ];
        chord.forEach((item) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.f, now + item.time);

          gain.gain.setValueAtTime(0, now + item.time);
          gain.gain.linearRampToValueAtTime(0.28, now + item.time + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + item.time);
          osc.stop(now + item.time + item.dur + 0.05);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Audio effect playback not supported or user has not interacted yet', err);
  }
}

export interface WordToken {
  word: string;
  cleanWord: string;
  startIndex: number;
  endIndex: number;
  estimatedDurationMs: number;
}

export function parseWordTokens(text: string): WordToken[] {
  const tokens: WordToken[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const clean = raw.replace(/[^a-zA-Z]/g, '').toLowerCase();
    tokens.push({
      word: raw,
      cleanWord: clean,
      startIndex: match.index,
      endIndex: match.index + raw.length,
      estimatedDurationMs: Math.max(260, 200 + raw.length * 50),
    });
  }
  return tokens;
}

// Get American English (en-US) voice
export function getAmericanEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Strictly look for en-US / en_US voices
  const usVoices = voices.filter(
    (v) => v.lang === 'en-US' || v.lang === 'en_US' || v.lang.startsWith('en-US')
  );

  if (usVoices.length > 0) {
    // Prefer natural, high-clarity American English voices
    const preferred = usVoices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        name.includes('google us english') ||
        name.includes('natural') ||
        name.includes('samantha') ||
        name.includes('ava') ||
        name.includes('allison') ||
        name.includes('tom') ||
        name.includes('guy') ||
        name.includes('jenny') ||
        name.includes('aria') ||
        name.includes('zira') ||
        name.includes('david') ||
        v.default
      );
    });
    return preferred || usVoices[0];
  }

  // 2. Fallback: Any voice with lang starting with en
  const anyEnglish = voices.filter((v) => v.lang.startsWith('en'));
  return anyEnglish[0] || null;
}

// Speech Synthesis Controller with word-by-word boundary tracking
export interface SpeakOptions {
  rate?: number; // 0.65 for slow, 0.88 for normal
  pitch?: number;
  onWordBoundary?: (wordIndex: number, word: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let fallbackInterval: number | null = null;
let watchdogTimeout: number | null = null;

export function stopSpeaking() {
  if (fallbackInterval) {
    window.clearInterval(fallbackInterval);
    fallbackInterval = null;
  }
  if (watchdogTimeout) {
    window.clearTimeout(watchdogTimeout);
    watchdogTimeout = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(text: string, options: SpeakOptions = {}) {
  stopSpeaking();

  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported on this browser.');
    options.onStart?.();
    setTimeout(() => {
      options.onEnd?.();
    }, 1500);
    return;
  }

  const rate = options.rate ?? 0.88;
  const pitch = options.pitch ?? 1.05;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.lang = 'en-US'; // Strict American English

  const usVoice = getAmericanEnglishVoice();
  if (usVoice) {
    utterance.voice = usVoice;
  }

  const tokens = parseWordTokens(text);
  let boundaryReceived = false;

  utterance.onstart = () => {
    options.onStart?.();
    if (tokens.length > 0) {
      options.onWordBoundary?.(0, tokens[0].word);
    }

    // Boundary Watchdog:
    // If the browser does NOT fire onboundary events within 450ms,
    // only then start the fallback interval to animate words smoothly.
    watchdogTimeout = window.setTimeout(() => {
      if (!boundaryReceived && tokens.length > 1) {
        let currentIdx = 1;
        const stepFallback = () => {
          if (currentIdx < tokens.length && !boundaryReceived) {
            options.onWordBoundary?.(currentIdx, tokens[currentIdx].word);
            const tokenDuration = Math.round(tokens[currentIdx].estimatedDurationMs / rate);
            currentIdx++;
            fallbackInterval = window.setTimeout(stepFallback, tokenDuration) as unknown as number;
          }
        };
        const initialWait = Math.round(tokens[0].estimatedDurationMs / rate);
        fallbackInterval = window.setTimeout(stepFallback, initialWait) as unknown as number;
      }
    }, 450);
  };

  utterance.onboundary = (event) => {
    boundaryReceived = true;
    if (watchdogTimeout) {
      window.clearTimeout(watchdogTimeout);
      watchdogTimeout = null;
    }
    if (fallbackInterval) {
      window.clearTimeout(fallbackInterval);
      fallbackInterval = null;
    }

    if (event.name === 'word' || !event.name) {
      const charIndex = event.charIndex;
      // Find the exact token matching this charIndex
      let matchedIdx = -1;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const nextToken = tokens[i + 1];

        if (charIndex >= token.startIndex && (!nextToken || charIndex < nextToken.startIndex)) {
          matchedIdx = i;
          break;
        }
      }

      // If outside bounds, pick closest token
      if (matchedIdx === -1) {
        let minDiff = Infinity;
        for (let i = 0; i < tokens.length; i++) {
          const diff = Math.abs(tokens[i].startIndex - charIndex);
          if (diff < minDiff) {
            minDiff = diff;
            matchedIdx = i;
          }
        }
      }

      if (matchedIdx >= 0 && matchedIdx < tokens.length) {
        options.onWordBoundary?.(matchedIdx, tokens[matchedIdx].word);
      }
    }
  };

  utterance.onend = () => {
    if (watchdogTimeout) {
      window.clearTimeout(watchdogTimeout);
      watchdogTimeout = null;
    }
    if (fallbackInterval) {
      window.clearTimeout(fallbackInterval);
      fallbackInterval = null;
    }
    activeUtterance = null;
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    if (watchdogTimeout) {
      window.clearTimeout(watchdogTimeout);
      watchdogTimeout = null;
    }
    if (fallbackInterval) {
      window.clearTimeout(fallbackInterval);
      fallbackInterval = null;
    }
    activeUtterance = null;
    options.onError?.();
    options.onEnd?.();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

// Speak a single vocabulary word clearly in en-US American English
export function speakWord(word: string, isSlow: boolean = false) {
  stopSpeaking();
  if (!isSpeechSupported()) return;

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = isSlow ? 0.65 : 0.85;
  utterance.pitch = 1.05;
  utterance.lang = 'en-US';

  const usVoice = getAmericanEnglishVoice();
  if (usVoice) {
    utterance.voice = usVoice;
  }
  window.speechSynthesis.speak(utterance);
}

// Speak a sentence (e.g. definition, example) clearly in en-US American English
export function speakSentence(sentence: string, onEnd?: () => void) {
  stopSpeaking();
  if (!isSpeechSupported()) {
    onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.rate = 0.85;
  utterance.pitch = 1.05;
  utterance.lang = 'en-US';

  const usVoice = getAmericanEnglishVoice();
  if (usVoice) {
    utterance.voice = usVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };
  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}
