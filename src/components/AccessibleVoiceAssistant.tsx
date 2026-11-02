import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, RefreshCw, HelpCircle, StopCircle, ArrowRight, Wifi, WifiOff } from 'lucide-react';
import { getOfflineAnswer } from '../data/offlineKnowledgeBase';

export interface QuickPrompt {
  icon: string;
  labelKh: string;
  labelEn: string;
  query: string;
}

interface AccessibleVoiceAssistantProps {
  appContext: 'packaging' | 'farmer' | 'mango' | 'spices' | 'mayany' | 'dailypa' | 'general';
  appNameKh: string;
  appNameEn: string;
  lang?: 'km' | 'en';
  quickPrompts?: QuickPrompt[];
  onVoiceCommand?: (transcript: string) => void;
  placeholderKh?: string;
  placeholderEn?: string;
}

// Simple Web Audio API sound feedback
function playChime(type: 'start' | 'stop' | 'success') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'start') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'stop') {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    // Ignore audio context errors
  }
}

export default function AccessibleVoiceAssistant({
  appContext,
  appNameKh,
  appNameEn,
  lang = 'km',
  quickPrompts = [],
  onVoiceCommand,
  placeholderKh = 'ចុចមីក្រូហ្វូនធំ រួចនិយាយសួរសំណួរ ឬបញ្ជា...',
  placeholderEn = 'Tap the big mic and speak any question or command...',
}: AccessibleVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseAnswer, setResponseAnswer] = useState<string | null>(null);
  const [responseTitle, setResponseTitle] = useState<string | null>(null);
  const [responseSource, setResponseSource] = useState<'online' | 'offline' | null>(null);
  const [isSpeakingTts, setIsSpeakingTts] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [activeLang, setActiveLang] = useState<'km' | 'en'>(lang);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const recognitionRef = useRef<any>(null);
  const isManuallyListeningRef = useRef(false);
  const currentTranscriptRef = useRef('');
  const timerIntervalRef = useRef<any>(null);
  const ttsQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  const isKm = activeLang === 'km';

  // Monitor network connectivity changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Timer counter for recording duration
  useEffect(() => {
    if (isListening) {
      setRecordSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setRecordSeconds(0);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isListening]);

  // Sequential speech synthesis chunker to ensure long answers never cut off
  const speakNextChunk = () => {
    if (!ttsQueueRef.current.length || !isSpeakingRef.current) {
      isSpeakingRef.current = false;
      setIsSpeakingTts(false);
      return;
    }

    const chunk = ttsQueueRef.current.shift();
    if (!chunk || !chunk.trim()) {
      speakNextChunk();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.lang = isKm ? 'km-KH' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        speakNextChunk();
      };
      utterance.onerror = (e) => {
        console.warn('Speech chunk error:', e);
        speakNextChunk();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis exception:', e);
      speakNextChunk();
    }
  };

  // Speak aloud via TTS with sentence chunking
  const speakAloud = (text: string) => {
    if (!('speechSynthesis' in window) || !ttsEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`]/g, '').replace(/\[.*?\]/g, '');
      
      // Split into bite-sized sentences by punctuation or newlines so browser never stops halfway
      const sentences = clean
        .split(/(?<=[។\.\?!])|\n+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (sentences.length === 0) return;

      ttsQueueRef.current = sentences;
      isSpeakingRef.current = true;
      setIsSpeakingTts(true);
      speakNextChunk();
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeakingTts(false);
      isSpeakingRef.current = false;
    }
  };

  const stopSpeaking = () => {
    isSpeakingRef.current = false;
    ttsQueueRef.current = [];
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingTts(false);
    }
  };

  // Submit query: Online Gemini AI with instant Offline Knowledge Base fallback
  const handleQuerySubmit = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    if (onVoiceCommand) {
      try {
        onVoiceCommand(q);
      } catch (e) {
        console.warn('Voice command execution notice:', e);
      }
    }

    setIsProcessing(true);
    setResponseAnswer(null);
    setResponseTitle(null);

    // If completely offline, use the built-in Agricultural Knowledge Base immediately
    if (!navigator.onLine) {
      const offlineResult = getOfflineAnswer(q, activeLang, appContext);
      setResponseTitle(offlineResult.title);
      setResponseAnswer(offlineResult.answer);
      setResponseSource('offline');
      setIsProcessing(false);
      playChime('success');
      if (ttsEnabled) {
        speakAloud(offlineResult.spokenText || offlineResult.answer);
      }
      return;
    }

    // If online, query /api/ask with an AbortController timeout of 6 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          lang: activeLang,
          appContext,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const ans = data.answer || (isKm ? 'ខ្ញុំបានទទួលសំណួររបស់អ្នក។' : 'I received your question.');
      
      setResponseTitle(isKm ? 'ចម្លើយពីប្រព័ន្ធ AI' : 'AI Assistant Answer');
      setResponseAnswer(ans);
      setResponseSource('online');
      playChime('success');

      if (ttsEnabled) {
        speakAloud(data.spokenText || ans);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Online request unsuccessful, switching smoothly to Offline Knowledge Base:', err?.message || err);
      
      // Seamless offline fallback - answers the farmer's question without leaving them empty-handed!
      const offlineResult = getOfflineAnswer(q, activeLang, appContext);
      setResponseTitle(offlineResult.title);
      setResponseAnswer(offlineResult.answer);
      setResponseSource('offline');
      playChime('success');

      if (ttsEnabled) {
        speakAloud(offlineResult.spokenText || offlineResult.answer);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Continuous Speech Recognition without artificial cutoff
  // Click once to start recording; click again to stop & answer
  const startListening = () => {
    stopSpeaking();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isKm ? 'កម្មវិធីរុករកនេះមិនគាំទ្រ Voice Speech Recognition ទេ។ សូមប្រើ Chrome ឬ Safari។' : 'Speech recognition is not supported in this browser. Please use Chrome or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isKm ? 'km-KH' : 'en-US';

      currentTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      isManuallyListeningRef.current = true;
      setIsListening(true);
      playChime('start');

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = currentTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const part = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += (final ? ' ' : '') + part;
          } else {
            interim += part;
          }
        }

        currentTranscriptRef.current = final;
        setTranscript(final);
        setInterimTranscript(interim);
        // Notice: NO auto-stop timeout! User controls the end of their question by clicking the button.
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'no-speech') {
          // Keep listening, do not abort
          return;
        }
        if (event.error === 'network') {
          // If network error on speech recognition, notify gracefully
          console.warn('Speech recognition network issue');
          return;
        }
        if (event.error === 'not-allowed') {
          isManuallyListeningRef.current = false;
          setIsListening(false);
          alert(isKm ? 'សូមបើកសិទ្ធិប្រើប្រាស់ Microphone ក្នុង Browser ដើម្បីនិយាយ។' : 'Please allow microphone access in your browser to speak.');
        }
      };

      // Auto-restart if browser pauses during silence so farmer's speech is NEVER cut off
      recognition.onend = () => {
        if (isManuallyListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Already active
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to initialize speech recognition:', e);
      setIsListening(false);
      isManuallyListeningRef.current = false;
    }
  };

  const stopListening = (shouldSubmit = true) => {
    isManuallyListeningRef.current = false;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    playChime('stop');

    const fullText = (currentTranscriptRef.current + ' ' + interimTranscript).trim();
    if (shouldSubmit && fullText) {
      handleQuerySubmit(fullText);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening(true);
    } else {
      startListening();
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl p-5 sm:p-7 space-y-6">
      
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            🎙️
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{isKm ? 'ជំនួយការសំឡេងឆ្លាតវៃ' : 'Voice AI Assistant'}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                {isKm ? appNameKh : appNameEn}
              </span>

              {/* Online / Offline Status Badge */}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 border ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-600" />
                    <span>{isKm ? 'អនឡាញ' : 'Online'}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    <span>{isKm ? 'Offline ឆ្លើយបានធម្មតា' : 'Offline Mode Ready'}</span>
                  </>
                )}
              </span>
            </div>
            
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-sans mt-0.5">
              {isKm ? 'និយាយសួរសំណួរ ឬបញ្ជាជាសំឡេង' : 'Speak Any Question or Voice Command'}
            </h2>
          </div>
        </div>

        {/* Controls: Language toggle & TTS Audio toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveLang(activeLang === 'km' ? 'en' : 'km')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>{isKm ? '🇰🇭 ភាសាខ្មែរ' : '🌐 English'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isSpeakingTts) stopSpeaking();
              setTtsEnabled(!ttsEnabled);
            }}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              ttsEnabled ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
            title={ttsEnabled ? (isKm ? 'បិទសំឡេងអាន' : 'Mute Speech') : (isKm ? 'បើកសំឡេងអាន' : 'Unmute Speech')}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{ttsEnabled ? (isKm ? 'សំឡេង' : 'Audio ON') : (isKm ? 'ស្ងាត់' : 'Audio OFF')}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Mic Centerpiece (Continuous recording: Click to start, Click to stop) */}
      <div className="flex flex-col items-center justify-center py-4 px-2 space-y-4 text-center">
        
        {/* Big Mic Button with Active Pulse & Duration Badge */}
        <div className="relative flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-36 h-36 rounded-full bg-rose-400/30 animate-ping pointer-events-none" />
              <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            type="button"
            onClick={toggleListening}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-2xl cursor-pointer select-none ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white ring-8 ring-rose-200 scale-105'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white ring-8 ring-emerald-100'
            }`}
          >
            {isListening ? (
              <>
                <StopCircle className="w-12 h-12 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider mt-1">
                  {isKm ? 'ចុចបញ្ចប់' : 'Stop & Answer'}
                </span>
                <span className="text-[10px] font-mono font-bold bg-black/30 px-2 py-0.5 rounded-full mt-0.5">
                  {formatTime(recordSeconds)}
                </span>
              </>
            ) : (
              <>
                <Mic className="w-12 h-12" />
                <span className="text-xs font-black uppercase tracking-wider mt-1">
                  {isKm ? 'ចុចដើម្បីនិយាយ' : 'Tap to Speak'}
                </span>
                <span className="text-[9px] opacity-80 font-normal">
                  {isKm ? 'គ្មានកំណត់ពេល' : 'No time limit'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Live Status and Instruction */}
        <div className="space-y-1.5">
          {isListening ? (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-black animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>
                  {isKm 
                    ? `កំពុងថតសំឡេង (${formatTime(recordSeconds)}) — និយាយរួច ចុចប៊ូតុងម្តងទៀតដើម្បីឆ្លើយ` 
                    : `Recording (${formatTime(recordSeconds)}) — When finished, tap the button again to answer`}
                </span>
              </div>
              
              {/* Sound Wave Bars */}
              <div className="flex items-center justify-center gap-1.5 h-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                  <div
                    key={bar}
                    className="w-1.5 bg-rose-600 rounded-full animate-pulse"
                    style={{
                      height: `${10 + ((bar * 7) % 18)}px`,
                      animationDuration: `${0.35 + (bar % 5) * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : isProcessing ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
              <span>
                {isKm 
                  ? 'កំពុងស្វែងរកចម្លើយពេញលេញ (គ្មានកាត់ផ្តាច់)...' 
                  : 'Formulating complete answer without cutoff...'}
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-slate-700 max-w-md mx-auto">
                {isKm ? placeholderKh : placeholderEn}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {isKm 
                  ? '💡 ចុចម្តងដើម្បីចាប់ផ្តើមនិយាយ និងចុចម្តងទៀតពេលនិយាយចប់ (មិនកាត់ផ្តាច់សំឡេងឡើយ)' 
                  : '💡 Tap once to speak, tap again when finished. No time limit.'}
              </p>
            </div>
          )}
        </div>

        {/* Big Live Voice Transcript Display (24px - 28px Font for Readability) */}
        {(transcript || interimTranscript) && (
          <div className="w-full max-w-2xl p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-emerald-400/40 text-left space-y-1 shadow-inner animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                {isKm ? 'សំឡេងដែលបានស្តាប់ឮ៖' : 'Voice Heard:'}
              </span>
              {isListening && (
                <span className="text-[10px] font-bold text-rose-600 animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  {isKm ? 'កំពុងកត់ត្រា...' : 'Live capturing...'}
                </span>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 font-sans leading-snug">
              {transcript}{' '}
              <span className="text-emerald-600 font-normal italic opacity-80">{interimTranscript}</span>
            </p>
          </div>
        )}
      </div>

      {/* AI Answer Card (Large Font Size, High Contrast, Continuous Chunked Audio) */}
      {responseAnswer && (
        <div className="w-full rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-slate-50 border-2 border-emerald-500/40 p-5 sm:p-7 space-y-4 shadow-lg animate-in fade-in zoom-in-95">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-sans">
                  {responseTitle || (isKm ? 'ចម្លើយពេញលេញពីជំនួយការ' : 'Complete Answer from Assistant')}
                </h3>
                {responseSource && (
                  <span className="text-[10px] font-bold text-slate-500">
                    {responseSource === 'online' 
                      ? (isKm ? '⚡ ឆ្លើយតបដោយប្រព័ន្ធ Gemini 3.6 AI' : '⚡ Powered by Gemini 3.6 AI') 
                      : (isKm ? '📦 ឆ្លើយតបពីមូលដ្ឋានទិន្នន័យ Offline (កសិកម្ម & ជ័យ សំបូរ)' : '📦 Powered by Offline Agricultural Knowledge Base')}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSpeakingTts ? (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <StopCircle className="w-4 h-4 text-rose-600" />
                  <span>{isKm ? 'បញ្ឈប់សំឡេង' : 'Stop Audio'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => speakAloud(responseAnswer)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isKm ? 'អានឡើងវិញពេញលេញ' : 'Read Full Answer'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Answer Text in Big, High-Contrast Type */}
          <div className="text-lg sm:text-xl font-medium text-slate-800 font-sans leading-relaxed whitespace-pre-line">
            {responseAnswer}
          </div>
        </div>
      )}

      {/* Quick Tap Suggestion Chips */}
      {quickPrompts.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
            {isKm ? 'សំណួរពេញនិយមដែលអ្នកអាចចុចសួរភ្លាមៗ (គាំទ្រទាំង Online & Offline)៖' : 'Quick Questions (Tap to Ask — Works Online & Offline):'}
          </span>
          
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTextInput(p.query);
                  handleQuerySubmit(p.query);
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 transition active:scale-95 shadow-xs cursor-pointer"
              >
                <span className="text-base">{p.icon}</span>
                <span>{isKm ? p.labelKh : p.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Text Input Fallback */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (textInput.trim()) {
            handleQuerySubmit(textInput);
          }
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={isKm ? 'ឬវាយសំណួរនៅទីនេះ (ដំណើរការទាំង Online និង Offline)...' : 'Or type your question here (Works Online & Offline)...'}
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!textInput.trim() || isProcessing}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <span>{isKm ? 'ផ្ញើ' : 'Ask'}</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}

