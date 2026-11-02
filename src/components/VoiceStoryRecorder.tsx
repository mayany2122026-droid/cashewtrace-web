import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Play, Pause, RotateCcw, Volume2, VolumeX, 
  Sparkles, CheckCircle2, Heart, Award, ShieldCheck, 
  AlertCircle, Radio, Clock, Share2, Music, Check, RefreshCw
} from 'lucide-react';
import { useLanguage, AppLanguage } from '../lib/LanguageContext';

export interface VoiceStoryData {
  audioUrl?: string;
  audioBlob?: Blob;
  durationSeconds: number;
  recordedAt?: string;
  transcriptionKh: string;
  transcriptionEn: string;
  authorName: string;
  authorRole: string;
  isLiveRecording: boolean;
}

interface VoiceStoryRecorderProps {
  initialData?: Partial<VoiceStoryData>;
  onSave?: (data: VoiceStoryData) => void;
  isConsumerMode?: boolean;
  activeLanguage?: AppLanguage | string;
  batchId?: string;
  productName?: string;
}

const DEFAULT_TRANSCRIPTION_KH = "គ្រាប់ស្វាយចន្ទីកែច្នៃរបស់យើង ត្រូវបានសម្រិតសម្រាំងយ៉ាងយកចិត្តទុកដាក់ចេញពីរោងចក្រកែច្នៃស្តង់ដារ HACCP និងស្រោបគ្រឿងផ្សំប្រកបដោយក្តីស្រលាញ់ និងការផ្ចិតផ្ចង់បំផុត។ យើងសង្ឃឹមយ៉ាងមុតមាំថា អតិថិជនទាំងអស់នឹងរីករាយ និងទទួលបានរសជាតិឈ្ងុយឆ្ងាញ់ពិតៗពីផលិតផលយើង!";
const DEFAULT_TRANSCRIPTION_EN = "Our processed cashew kernels are carefully selected from a certified HACCP processing factory. We carefully coated them with care and love, and we sincerely hope that our valued customers enjoy our product!";

export default function VoiceStoryRecorder({
  initialData,
  onSave,
  isConsumerMode = false,
  activeLanguage = 'kh',
  batchId = 'MAYANY-2026',
  productName = 'Cashew Kernel'
}: VoiceStoryRecorderProps) {
  const { language: globalLanguage, isKhmer, t } = useLanguage();
  // Mode: 'listen' | 'record'
  const [mode, setMode] = useState<'listen' | 'record'>(isConsumerMode ? 'listen' : 'listen');
  const [lang, setLang] = useState<'kh' | 'en'>(globalLanguage === 'kh' ? 'kh' : 'en');

  // Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string>(initialData?.audioUrl || '');
  const [hasRecordedAudio, setHasRecordedAudio] = useState<boolean>(Boolean(initialData?.audioUrl));
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  // Playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(initialData?.durationSeconds || 14);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Audio refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Sync language with global language or parent prop if it changes
  useEffect(() => {
    if (globalLanguage) {
      setLang(globalLanguage === 'kh' ? 'kh' : 'en');
    } else if (activeLanguage === 'kh') {
      setLang('kh');
    } else {
      setLang('en');
    }
  }, [globalLanguage, activeLanguage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // 1. LIVE MICROPHONE RECORDING HANDLERS
  const startRecording = async () => {
    setMicPermissionError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicPermissionError("Your browser does not support microphone recording. Please use Chrome, Edge, or Safari.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setHasRecordedAudio(true);
        setDuration(recordingTime > 0 ? recordingTime : 14);

        if (onSave) {
          onSave({
            audioUrl: url,
            audioBlob,
            durationSeconds: recordingTime,
            recordedAt: new Date().toISOString(),
            transcriptionKh: DEFAULT_TRANSCRIPTION_KH,
            transcriptionEn: DEFAULT_TRANSCRIPTION_EN,
            authorName: 'Mayany SAM',
            authorRole: 'Founder & Managing Director',
            isLiveRecording: true
          });
        }

        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Start elapsed timer
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error("Microphone access error:", err);
      setMicPermissionError("Microphone permission denied or not found. Please allow microphone access in your browser bar.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setRecordingTime(0);
    }
  };

  // 2. PLAYBACK HANDLERS (Custom Audio File or Text-to-Speech Fallback)
  const togglePlay = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    // If we have a recorded audio blob URL
    if (hasRecordedAudio && audioUrl && audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
      return;
    }

    // Otherwise, play browser Speech Synthesis simulation
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = lang === 'kh' ? DEFAULT_TRANSCRIPTION_KH : DEFAULT_TRANSCRIPTION_EN;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.lang = lang === 'kh' ? 'km-KH' : 'en-US';

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsSynthesizing(true);
        setPlaybackTime(0);
        setPlaybackProgress(0);

        const estDuration = lang === 'kh' ? 16 : 12;
        setDuration(estDuration);

        let elapsed = 0;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = window.setInterval(() => {
          elapsed += 0.2;
          setPlaybackTime(Math.min(elapsed, estDuration));
          setPlaybackProgress((elapsed / estDuration) * 100);
          if (elapsed >= estDuration) {
            pausePlayback();
          }
        }, 200);
      };

      utterance.onend = () => {
        pausePlayback();
      };

      utterance.onerror = () => {
        pausePlayback();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Basic simulation fallback
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 14000);
    }
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    setIsSynthesizing(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioPlayerRef.current) {
      const current = audioPlayerRef.current.currentTime;
      const dur = audioPlayerRef.current.duration || duration || 14;
      setPlaybackTime(current);
      setDuration(dur);
      setPlaybackProgress((current / dur) * 100);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackProgress(0);
    setPlaybackTime(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400/60 shadow-xl relative overflow-hidden font-sans">
      
      {/* Decorative ambient gold glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden audio element for recorded track */}
      {audioUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* TOP HEADER: Badge & Language / Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-inner">
            <Radio className={`w-5 h-5 ${isPlaying || isRecording ? 'animate-pulse text-amber-300' : ''}`} />
          </div>
            <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-sans uppercase tracking-wider text-amber-400 font-bold">
                សារសម្លេងម្ចាស់សហគ្រាស (Interactive Voice Story & Quality Note)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>គុណភាព HACCP (HACCP Quality)</span>
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white font-serif flex items-center gap-1.5">
              <span>សារសម្លេងម្ចាស់សហគ្រាស (Founder's Voice Message)</span>
            </h3>
          </div>
        </div>

        {/* Action Controls: Language Toggle & Record Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Language Toggle */}
          <div className="bg-stone-950 p-1 rounded-xl border border-stone-700 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setLang('kh')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                lang === 'kh' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              🇰🇭 ខ្មែរ (Khmer)
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                lang === 'en' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          {!isConsumerMode && (
            <button
              type="button"
              onClick={() => setMode(mode === 'record' ? 'listen' : 'record')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition flex items-center gap-1.5 cursor-pointer border ${
                mode === 'record'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:text-white border-stone-700'
              }`}
            >
              <Mic size={13} />
              <span>{mode === 'record' ? 'ទម្រង់ចាក់ស្តាប់ (Player Mode)' : 'ថតសម្លេងផ្ទាល់ (Record Mic)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* RECORDING MODE (FOR PRODUCER / MAYANY TO RECORD LIVE VOICE VIA MIC) */}
      {mode === 'record' && (
        <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-amber-500/40 mb-4 space-y-3 animate-fade-in relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-red-500 animate-pulse" />
              <span>ថតសម្លេងផ្ទាល់ដោយប្រើ Microphone (Live Founder Voice Recording):</span>
            </span>
            <span className="text-xs font-mono font-bold text-stone-400">
              {isRecording ? `Recording: ${formatTime(recordingTime)} / 1:00` : 'Max 60s'}
            </span>
          </div>

          {micPermissionError && (
            <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{micPermissionError}</span>
            </div>
          )}

          {/* Recording Status & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Mic size={15} />
                <span>ចុចដើម្បីចាប់ផ្ដើមថត (Start Recording)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition cursor-pointer animate-pulse"
              >
                <MicOff size={15} />
                <span>បញ្ឈប់ & រក្សាទុក (Stop & Save Audio)</span>
              </button>
            )}

            {isRecording && (
              <button
                type="button"
                onClick={cancelRecording}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs px-3 py-2 rounded-xl transition cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
            )}

            {hasRecordedAudio && !isRecording && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={14} />
                <span>បានថតសម្លេងជោគជ័យ (Custom Audio Ready)</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* CORE AUDIO PLAYER INTERFACE */}
      <div className="bg-stone-950/90 rounded-2xl p-4 sm:p-5 border border-stone-800 space-y-4 relative z-10">
        
        {/* Transcription Card (What the voice is saying) */}
        <div className="p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Heart size={12} className="text-rose-500 fill-rose-500" />
              <span>{lang === 'kh' ? 'ខ្លឹមសារសារសម្លេង (HACCP & Love Note):' : 'Founder Statement & Quality Guarantee:'}</span>
            </span>
            <span>Batch {batchId}</span>
          </div>

          <p className="text-xs sm:text-[13px] leading-relaxed text-stone-200 font-serif italic">
            "{lang === 'kh' ? DEFAULT_TRANSCRIPTION_KH : DEFAULT_TRANSCRIPTION_EN}"
          </p>

          <div className="pt-2 flex items-center justify-between text-[10.5px] font-mono text-stone-400 border-t border-stone-800/60">
            <span className="text-amber-400 font-bold">
              Mayany SAM • Founder & Managing Director
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>HACCP Factory Selected</span>
            </span>
          </div>
        </div>

        {/* Waveform & Playback Controls */}
        <div className="space-y-2.5">
          {/* Progress Bar & Waveform Simulation */}
          <div className="space-y-1">
            <div className="h-9 w-full bg-stone-900 rounded-xl px-3 flex items-center justify-between gap-1 overflow-hidden border border-stone-800">
              {/* Dynamic Animated Waveform Bars */}
              {Array.from({ length: 32 }).map((_, i) => {
                const heightPct = isPlaying
                  ? Math.sin(i * 0.4 + playbackTime * 4) * 40 + 50
                  : Math.sin(i * 0.3) * 20 + 35;
                const isPassed = (i / 32) * 100 <= playbackProgress;

                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPassed ? 'bg-amber-400' : 'bg-stone-700'
                    }`}
                    style={{ height: `${Math.max(15, heightPct)}%` }}
                  />
                );
              })}
            </div>

            {/* Timers */}
            <div className="flex items-center justify-between text-[10.5px] font-mono text-stone-400 px-1">
              <span>{formatTime(playbackTime)}</span>
              <span className="text-amber-400 font-bold font-sans">{isPlaying ? '▶ កំពុងចាក់សម្លេង (Playing Voice)' : 'ចុចស្តាប់សារសម្លេង (Listen to Voice)'}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Buttons Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {/* Big Play / Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-300 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
                title={isPlaying ? "ផ្អាកសម្លេង (Pause Audio)" : "ចាក់ស្តាប់សារសម្លេង (Play Voice Message)"}
              >
                {isPlaying ? <Pause size={20} className="fill-stone-950" /> : <Play size={20} className="fill-stone-950 ml-0.5" />}
              </button>

              <div className="flex flex-col">
                <span className="text-xs font-bold text-white font-sans">
                  {isPlaying ? 'កំពុងស្ដាប់សារសម្លេង (Listening)' : 'ចុចដើម្បីស្ដាប់សម្លេង (Click to Listen)'}
                </span>
                <span className="text-[10px] text-stone-400 font-sans">
                  {hasRecordedAudio ? '🎙️ សារសម្លេងថតផ្ទាល់ (Authentic Live Voice Note)' : '🔊 សារអានជាភាសាខ្មែរ/អង់គ្លេស (Audio Narration)'}
                </span>
              </div>
            </div>

            {/* Replay Button */}
            <button
              type="button"
              onClick={() => {
                if (audioPlayerRef.current) audioPlayerRef.current.currentTime = 0;
                setPlaybackTime(0);
                setPlaybackProgress(0);
                startPlayback();
              }}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1 font-sans"
              title="ចាក់ឡើងវិញពីដើម (Replay from start)"
            >
              <RotateCcw size={14} />
              <span className="text-[10px] hidden sm:inline">ចាក់ឡើងវិញ (Replay)</span>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE FOR AUDIENCE */}
      <div className="mt-3.5 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-sans text-stone-400 relative z-10">
        <div className="flex items-center gap-1.5">
          <Award size={13} className="text-amber-400 shrink-0" />
          <span>គ្រាប់ស្វាយចន្ទីស្តង់ដារ HACCP • ផលិតដោយក្តីស្រលាញ់ • សហគ្រាស ម៉ាយ៉ានី កម្ពុជា (Mayany Enterprise Cambodia)</span>
        </div>
        <span className="text-amber-300/80">
          អាចស្កេនបាននៅលើគ្រប់ទូរស័ព្ទស្មាតហ្វូន (Scannable on all Smartphones)
        </span>
      </div>
    </div>
  );
}
