import { SupportedLanguage } from '../types';

let sharedAudioContext: AudioContext | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voices listener as early as possible
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Unlocks Web Audio and SpeechSynthesis on iOS / Android mobile devices.
 * Must be triggered on touch or click.
 */
export function unlockMobileAudio() {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      if (!sharedAudioContext) {
        sharedAudioContext = new AudioCtx();
      }
      if (sharedAudioContext.state === 'suspended') {
        sharedAudioContext.resume();
      }
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      if (cachedVoices.length === 0) {
        cachedVoices = window.speechSynthesis.getVoices();
      }
    }
  } catch {}
}

// Auto-register touch/click unlockers globally
if (typeof window !== 'undefined') {
  const handleInteraction = () => {
    unlockMobileAudio();
  };
  window.addEventListener('touchstart', handleInteraction, { passive: true });
  window.addEventListener('touchend', handleInteraction, { passive: true });
  window.addEventListener('click', handleInteraction, { passive: true });
}

export function playSuccessChime(type: 'success' | 'alert' | 'ding' = 'success') {
  try {
    unlockMobileAudio();
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    
    if (!sharedAudioContext) {
      sharedAudioContext = new AudioCtx();
    }
    const ctx = sharedAudioContext;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'alert') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      // Crisp 2-tone melodic chime (D5 -> A5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    }
  } catch (err) {
    console.debug('Audio chime playback notice:', err);
  }
}

export function getLangCode(lang: SupportedLanguage): string {
  switch (lang) {
    case 'ko': return 'ko-KR';
    case 'en': 
    default: return 'en-US';
  }
}

/**
 * Checks if text contains Khmer script characters
 */
function hasKhmerCharacters(text: string): boolean {
  return /[\u1780-\u17FF]/.test(text);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

export function formatTextForVoice(text: string, lang: SupportedLanguage = 'en'): string {
  if (!text) return text;
  
  // Replace all variations of MyDailyPA / DailyPA so text-to-speech engines
  // pronounce "My Daily P A" (reading individual letters P and A) instead of pronouncing "pa".
  return text
    .replace(/MyDailyPA/gi, 'My Daily P A')
    .replace(/MyDaily\s*PA/gi, 'My Daily P A')
    .replace(/My\s*Daily\s*PA/gi, 'My Daily P A')
    .replace(/DailyPA/gi, 'Daily P A')
    .replace(/Daily\s*PA/gi, 'Daily P A');
}

export function getContinuousWalkthroughScript(lang: SupportedLanguage = 'en'): string {
  if (lang === 'ko') {
    return 'My Daily P A에 오신 것을 환영합니다. 타이핑 없이 음성으로 수입, 지출, 부채 및 일정을 관리하는 지능형 비서입니다. 하단의 마이크 버튼을 탭하고 바로 음성으로 기록을 시작하세요!';
  }
  return 'Welcome to My Daily P A. Your intelligent voice assistant for tracking sales, expenses, debts, and daily schedules without typing. Tap the microphone button below to start voice recording right away!';
}

export function speakText(
  text: string, 
  lang: SupportedLanguage = 'en', 
  options?: { 
    playChime?: boolean; 
    onStart?: () => void; 
    onEnd?: () => void; 
    englishFallbackText?: string;
  }
) {
  if (typeof window === 'undefined') return;

  // Always unlock mobile audio session
  unlockMobileAudio();

  // Play audio chime if requested or by default on touch
  if (options?.playChime !== false) {
    playSuccessChime();
  }

  if (!('speechSynthesis' in window)) return;

  try {
    // Check if speechSynthesis is paused on mobile and resume it
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // On iOS Safari, cancel only if speaking to avoid dropping upcoming speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices();
    }

    const code = getLangCode(lang);

    // Look for exact voice or language prefix (e.g. km-KH or km)
    let matchedVoice: SpeechSynthesisVoice | undefined;
    if (lang === 'km') {
      matchedVoice = cachedVoices.find(v => 
        v.lang.toLowerCase().includes('km') || 
        v.lang.toLowerCase().includes('khmer') ||
        v.name.toLowerCase().includes('khmer') ||
        v.name.toLowerCase().includes('cambodia')
      );
    } else if (lang === 'en-GB') {
      matchedVoice = cachedVoices.find(v => v.lang.toLowerCase().includes('en-gb') || v.lang.toLowerCase().includes('en_gb') || v.name.toLowerCase().includes('united kingdom') || v.name.toLowerCase().includes('british')) ||
                     cachedVoices.find(v => v.lang.startsWith('en'));
    } else if (lang === 'en-US' || lang === 'en') {
      matchedVoice = cachedVoices.find(v => v.lang.toLowerCase().includes('en-us') || v.lang.toLowerCase().includes('en_us')) ||
                     cachedVoices.find(v => v.lang.startsWith('en'));
    } else {
      matchedVoice = cachedVoices.find(v => v.lang.replace('_', '-').toLowerCase() === code.toLowerCase()) ||
                     cachedVoices.find(v => v.lang.toLowerCase().startsWith(code.slice(0, 2).toLowerCase()));
    }

    // STRICT: Format text for natural pronunciation of "My Daily P A" instead of "pa"
    const textToSpeak = formatTextForVoice(text, lang);
    const voiceToUse = matchedVoice;
    const spokenLangCode = lang === 'km' ? 'km-KH' : code;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = spokenLangCode;
    utterance.volume = 1.0;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    if (options?.onStart) {
      utterance.onstart = () => {
        options.onStart?.();
      };
    }

    if (options?.onEnd) {
      utterance.onend = () => {
        options.onEnd?.();
      };
      utterance.onerror = () => {
        options.onEnd?.();
      };
    }

    // Small timeout ensures iOS Safari WebKit event loop registers the utterance
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.debug('Speech speak error:', e);
        options?.onEnd?.();
      }
    }, 15);
  } catch (err) {
    console.debug('Speech synthesis non-blocking error:', err);
    options?.onEnd?.();
  }
}

/**
 * Dedicated test function to test speaker volume and voice on mobile
 */
export function testVoiceAndSound(lang: SupportedLanguage = 'km') {
  playSuccessChime('success');
  const greeting = 'សំឡេង MyDailyPA ដំណើរការល្អណាស់!';
  speakText(greeting, lang, { playChime: true });
}

export function createSpeechRecognizer(
  lang: SupportedLanguage,
  onResult: (transcript: string, isFinal: boolean) => void,
  onError?: (err: any) => void
) {
  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRec) return null;

  const recognition = new SpeechRec();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = getLangCode(lang);

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    if (final) {
      onResult(final, true);
    } else if (interim) {
      onResult(interim, false);
    }
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event);
  };

  return recognition;
}

