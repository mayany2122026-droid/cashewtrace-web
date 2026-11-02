import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Sparkles, 
  Trash2, AlertCircle, Play, LayoutDashboard, Globe
} from 'lucide-react';
import { Entry, SupportedLanguage, UserProfile, CategorizeResult } from '../types';
import { parseVoiceTranscript } from '../utils/parser';
import { speakText, stopSpeaking, unlockMobileAudio, playSuccessChime } from '../utils/speech';
import { askAssistant, AssistantResponse } from '../utils/assistantClient';
import { incrementVoiceRecordingCount, TrialStats } from '../utils/trialTracker';

interface SimplifiedSecretaryViewProps {
  lang: SupportedLanguage;
  onChangeLanguage: (newLang: SupportedLanguage) => void;
  currentProfile: UserProfile;
  onSaveProfile: (name: string, phone: string) => void;
  entries: Entry[];
  onAddEntry: (result: CategorizeResult, rawTranscript: string) => void;
  onDeleteEntry?: (id: string) => void;
  onSwitchToDashboard: () => void;
  primaryCurrency?: string;
  trialStats?: TrialStats;
  onOpenVideoTutorial?: () => void;
}

export const SimplifiedSecretaryView: React.FC<SimplifiedSecretaryViewProps> = ({
  lang,
  onChangeLanguage,
  currentProfile,
  entries,
  onAddEntry,
  onDeleteEntry,
  onSwitchToDashboard,
  primaryCurrency = 'USD',
  trialStats,
  onOpenVideoTutorial,
}) => {
  // Voice Recording and Assistant State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [secretaryStatus, setSecretaryStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  
  // Real-time microphone audio visualizer
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);

  // Audio Analyser & MediaStream refs
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fallbackIntervalRef = useRef<any>(null);
  
  // Recent recorded entry or Assistant speech bubble
  const [lastRecordedEntry, setLastRecordedEntry] = useState<Entry | null>(null);
  const [assistantCard, setAssistantCard] = useState<AssistantResponse | null>(null);

  // Recognition ref and buffered text trackers
  const recognitionRef = useRef<any>(null);
  const latestTextRef = useRef('');
  const isProcessingRef = useRef(false);

  // Real-time Audio Visualizer
  const startAudioVisualizer = (stream: MediaStream) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        startSimulatedVisualizer();
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const level = Math.min(100, Math.round((avg / 80) * 100));
        setAudioLevel(level);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err) {
      console.debug('Audio visualizer init error:', err);
      startSimulatedVisualizer();
    }
  };

  const startSimulatedVisualizer = () => {
    if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);
    fallbackIntervalRef.current = setInterval(() => {
      setAudioLevel(prev => (prev > 40 ? 15 + Math.floor(Math.random() * 20) : 45 + Math.floor(Math.random() * 35)));
    }, 110);
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
    setAudioLevel(0);
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      } catch {}
      audioStreamRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopAudioVisualizer();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  // Web Speech Recognition + Microphone Audio Analyser setup
  const startListening = async () => {
    stopSpeaking();
    unlockMobileAudio();
    latestTextRef.current = '';
    isProcessingRef.current = false;
    setMicErrorMessage(null);

    // 1. Explicitly request microphone stream for live soundwave visualizer
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
        audioStreamRef.current = stream;
        startAudioVisualizer(stream);
      } catch (err: any) {
        console.warn('Microphone permission request status:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicErrorMessage('កម្មវិធីមិនទាន់បានទទួលសិទ្ធិប្រើប្រាស់មីក្រូហ្វូនទេ។ សូមអនុញ្ញាតសិទ្ធិមីក្រូហ្វូនក្នុង Browser។');
          setIsListening(false);
          setSecretaryStatus('idle');
          return;
        }
        startSimulatedVisualizer();
      }
    } else {
      startSimulatedVisualizer();
    }

    // 2. Web Speech Recognition setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(true);
      setSecretaryStatus('listening');
      setTranscript('កំពុងកត់ត្រាសំឡេង...');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'km' ? 'km-KH' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setSecretaryStatus('listening');
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        latestTextRef.current = currentText;
        setTranscript(currentText);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition status:', err);
        if (err.error === 'not-allowed') {
          setMicErrorMessage('សូមអនុញ្ញាតការប្រើមីក្រូហ្វូនក្នុង Browser (ចុចលើរូបសោជិតអាសយដ្ឋាន URL)។');
        }
        setIsListening(false);
        setSecretaryStatus('idle');
        stopAudioVisualizer();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioVisualizer();
        const textToProcess = latestTextRef.current.trim();
        if (textToProcess && !isProcessingRef.current) {
          isProcessingRef.current = true;
          processSpokenText(textToProcess);
        } else {
          setSecretaryStatus('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      setIsListening(false);
      setSecretaryStatus('idle');
      stopAudioVisualizer();
    }
  };

  const stopListening = () => {
    stopAudioVisualizer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    const textToProcess = latestTextRef.current.trim();
    if (textToProcess && !isProcessingRef.current) {
      isProcessingRef.current = true;
      processSpokenText(textToProcess);
    }
  };

  // Process Spoken Text: Natural Language Recording or AI Questions
  const processSpokenText = async (spoken: string) => {
    setSecretaryStatus('thinking');

    const lower = spoken.toLowerCase();

    // Context calculations for AI assistant queries
    const todayStr = new Date().toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toDateString();

    const todayRecords = entries.filter((e) => new Date(e.date).toDateString() === todayStr);
    const yesterdayRecords = entries.filter((e) => new Date(e.date).toDateString() === yesterdayStr);

    const todaySales = todayRecords.filter((e) => e.type === 'income').reduce((s, e) => s + (e.amount || 0), 0);
    const todayExpenses = todayRecords.filter((e) => e.type === 'expense').reduce((s, e) => s + (e.amount || 0), 0);
    const todayNetProfit = todaySales - todayExpenses;
    const upcomingAppointments = entries.filter((e) => e.category === 'health' || e.category === 'meeting' || e.type === 'reminder');

    // Undo / Delete command
    const isDeleteCommand =
      lower.includes('លុប') ||
      lower.includes('លុបចោល') ||
      lower.includes('delete') ||
      lower.includes('undo') ||
      lower.includes('cancel');

    if (isDeleteCommand && lastRecordedEntry) {
      if (onDeleteEntry) {
        onDeleteEntry(lastRecordedEntry.id);
      }
      setLastRecordedEntry(null);
      setAssistantCard(null);
      const deleteSpeech = lang === 'km' ? 'បានលុបកំណត់ត្រាចោលរួចរាល់!' : 'Record deleted successfully!';
      speakText(deleteSpeech, lang, {
        playChime: true,
        onEnd: () => setSecretaryStatus('idle'),
      });
      return;
    }

    // Questions / AI Assistant Queries
    const isQuestionOrQuery = 
      lower.includes('?') ||
      lower.includes('՞') ||
      lower.includes('ម្សិលមិញ') ||
      lower.includes('yesterday') ||
      lower.includes('ចំណាយ') ||
      lower.includes('លក់បានប៉ុន្មាន') ||
      lower.includes('how much') ||
      lower.includes('what') ||
      lower.includes('តើ') ||
      lower.includes('ប៉ុន្មាន') ||
      lower.includes('សួស្តី') ||
      lower.includes('hello');

    if (isQuestionOrQuery) {
      const aiResponse = await askAssistant(spoken, lang, {
        userName: currentProfile.name,
        userPhone: currentProfile.phoneNumber,
        todaySales,
        todayExpenses,
        todayNetProfit,
        todayRecords: entries,
        yesterdayRecords,
        upcomingAppointments,
      });

      setAssistantCard(aiResponse);
      setSecretaryStatus('speaking');

      speakText(aiResponse.spokenText || aiResponse.answer, lang, {
        playChime: true,
        onEnd: () => {
          setSecretaryStatus('idle');
        }
      });
      return;
    }

    // Natural Voice Recording (Income, Expense, Debt, Health, Reminder)
    const parsed = parseVoiceTranscript(spoken, primaryCurrency, lang);
    onAddEntry(parsed, spoken);
    playSuccessChime('success');
    incrementVoiceRecordingCount();

    const newRecord: Entry = {
      id: `rec_${Date.now()}`,
      userId: currentProfile.id,
      date: new Date().toISOString(),
      rawVoiceTranscript: spoken,
      category: parsed.category,
      type: parsed.type,
      titleKhmer: parsed.titleKhmer || spoken,
      titleEnglish: parsed.titleEnglish || spoken,
      amount: parsed.amount,
      currency: parsed.currency || primaryCurrency,
      reminderTime: parsed.reminderTime,
      personName: parsed.personName,
      isCompleted: true,
      notes: parsed.notes,
    };

    setLastRecordedEntry(newRecord);
    setAssistantCard(null);
    setSecretaryStatus('speaking');

    const confirmationSpeech = lang === 'km'
      ? `បានកត់ត្រា៖ ${parsed.titleKhmer || spoken}${parsed.amount && parsed.amount > 0 ? ` ចំនួន ${parsed.amount.toLocaleString()} ${parsed.currency}` : ''}។`
      : `Recorded: ${parsed.titleEnglish || spoken}${parsed.amount && parsed.amount > 0 ? ` ${parsed.amount.toLocaleString()} ${parsed.currency}` : ''}.`;

    speakText(confirmationSpeech, lang, {
      onEnd: () => {
        setSecretaryStatus('idle');
      }
    });
  };

  const isKm = lang === 'km';

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-3 min-h-[92vh] flex flex-col justify-between select-none">
      
      {/* Clean Minimalist Top Navigation */}
      <header className="flex items-center justify-between py-2 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-base shadow-sm">
            🎙️
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
              MyDailyPA
            </h1>
            <p className="text-[11px] font-bold text-rose-700 leading-tight">
              {isKm ? 'ជំនួយការខ្ញុំ' : 'Daily Voice Assistant'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Video Guide Button */}
          {onOpenVideoTutorial && (
            <button
              type="button"
              onClick={onOpenVideoTutorial}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
              title={isKm ? 'តើ MyDailyPA គឺជាអ្វី & ដោះស្រាយបញ្ហាអ្វី?' : 'What is MyDailyPA & What does it solve?'}
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>{isKm ? '🎬 វីដេអូ' : '🎬 Video'}</span>
            </button>
          )}

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={() => onChangeLanguage(lang === 'km' ? 'en' : 'km')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer"
            title="ផ្លាស់ប្តូរភាសា / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'km' ? 'ខ្មែរ' : 'EN'}</span>
          </button>

          {/* Switch to Full MSME Dashboard */}
          <button
            type="button"
            onClick={onSwitchToDashboard}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer"
            title="ផ្ទាំងគ្រប់គ្រងពេញ / Full Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{isKm ? 'ផ្ទាំងពេញ' : 'Dashboard'}</span>
          </button>
        </div>
      </header>

      {/* Microphone Permission Recovery Alert */}
      {micErrorMessage && (
        <div className="my-2 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{micErrorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setMicErrorMessage(null);
              startListening();
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            សាកល្បង
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* THE CLEAN MICROPHONE: DISPLAY & INTERACT WITH USERS       */}
      {/* ========================================================= */}
      <main className="my-auto py-6 flex flex-col items-center justify-center text-center space-y-6">
        
        {/* Simple Headline Text Above the Microphone */}
        <div className="space-y-1 max-w-sm mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isKm ? 'ចុចលើមីក្រូហ្វូនដើម្បីនិយាយ' : 'Tap the microphone to speak'}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {isKm ? 'កត់ត្រាចំណូល ចំណាយ លុយជំពាក់ ឬសួរសំណួរ' : 'Record income, expenses, debts, or ask anything'}
          </p>
        </div>

        {/* Centerpiece: THE CLEAN, LARGE MICROPHONE */}
        <div className="relative my-4 flex items-center justify-center">
          
          {/* Animated Glowing Ripples when Listening */}
          {isListening && (
            <>
              <div 
                className="absolute w-52 h-52 rounded-full bg-rose-500/20 animate-ping"
                style={{
                  transform: `scale(${1 + (audioLevel / 100) * 0.4})`,
                }}
              />
              <div 
                className="absolute w-44 h-44 rounded-full bg-rose-500/30 animate-pulse"
                style={{
                  transform: `scale(${1 + (audioLevel / 100) * 0.25})`,
                }}
              />
            </>
          )}

          {/* The Clean Microphone Button */}
          <button
            id="clean-main-microphone-button"
            type="button"
            onClick={isListening ? stopListening : startListening}
            style={{
              transform: isListening ? `scale(${1 + (audioLevel / 100) * 0.15})` : undefined,
              transition: 'transform 0.08s ease-out',
            }}
            className={`relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white ring-8 ring-rose-200'
                : secretaryStatus === 'thinking'
                ? 'bg-amber-500 text-white ring-8 ring-amber-200 animate-pulse'
                : 'bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white ring-8 ring-rose-100 hover:scale-105'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-14 h-14 sm:w-16 sm:h-16 text-white animate-pulse" />
                <span className="text-xs font-black mt-1 uppercase tracking-wider">
                  {audioLevel > 15 ? (isKm ? 'ចាប់សំឡេង!' : 'Listening!') : (isKm ? 'កំពុងស្តាប់...' : 'Listening...')}
                </span>
              </>
            ) : secretaryStatus === 'thinking' ? (
              <>
                <Sparkles className="w-14 h-14 text-white animate-spin" />
                <span className="text-xs font-black mt-1">
                  {isKm ? 'កំពុងគិត...' : 'Thinking...'}
                </span>
              </>
            ) : (
              <>
                <Mic className="w-16 h-16 sm:w-18 sm:h-18 text-white" />
                <span className="text-xs sm:text-sm font-black mt-1 tracking-wide">
                  {isKm ? 'ចុចនិយាយ' : 'Tap to Speak'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Equalizer Soundwave Bars (Physical Movement with Voice Decibels) */}
        {isListening && (
          <div className="flex flex-col items-center justify-center gap-1 animate-in fade-in">
            <div className="flex items-center justify-center gap-1.5 h-9">
              {[0.4, 0.7, 1.0, 1.3, 0.9, 0.6, 0.35].map((m, idx) => {
                const height = Math.max(6, Math.min(38, Math.round(6 + (audioLevel * 0.32 * m))));
                return (
                  <div
                    key={idx}
                    className="w-2 rounded-full bg-gradient-to-t from-rose-600 to-amber-400 transition-all duration-75"
                    style={{
                      height: `${height}px`,
                      opacity: audioLevel > 10 ? 1 : 0.6,
                    }}
                  />
                );
              })}
            </div>
            <p className="text-xs font-black text-rose-700">
              {audioLevel > 15
                ? `🟢 ${isKm ? `ចាប់សំឡេង (${audioLevel}%)` : `Voice detected (${audioLevel}%)`}`
                : isKm ? '🎤 កំពុងស្តាប់... សូមនិយាយ' : '🎤 Listening... Please speak'}
            </p>
          </div>
        )}

        {/* Live Voice Transcript Bubble */}
        {transcript && isListening && (
          <div className="w-full max-w-sm px-4 py-2.5 rounded-2xl bg-white border border-rose-200 shadow-sm text-center animate-in fade-in">
            <p className="text-sm sm:text-base font-black text-rose-950 italic">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Assistant Spoken Response Bubble */}
        {assistantCard && !isListening && (
          <div className="w-full max-w-sm p-4 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-left space-y-2 shadow-sm animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isKm ? 'ចម្លើយជំនួយការ' : 'Assistant Response'}</span>
              </span>
              <button
                type="button"
                onClick={() => setAssistantCard(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {assistantCard.answer}
            </p>
            <button
              type="button"
              onClick={() => speakText(assistantCard.spokenText || assistantCard.answer, lang, { playChime: true })}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isKm ? 'ស្តាប់សំឡេងឡើងវិញ' : 'Listen again'}</span>
            </button>
          </div>
        )}

        {/* Clean Recorded Result Bubble */}
        {lastRecordedEntry && !assistantCard && !isListening && (
          <div className="w-full max-w-sm p-3.5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3 shadow-sm animate-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs">
                ✓
              </div>
              <div>
                <p className="text-xs font-black text-emerald-800">
                  {isKm ? 'បានកត់ត្រាជោគជ័យ' : 'Recorded Successfully'}
                </p>
                <p className="text-sm font-bold text-slate-900 line-clamp-1">
                  {isKm ? lastRecordedEntry.titleKhmer : lastRecordedEntry.titleEnglish}
                  {lastRecordedEntry.amount && lastRecordedEntry.amount > 0 && (
                    <span className="ml-1 text-emerald-700 font-mono font-black">
                      {lastRecordedEntry.amount.toLocaleString()} {lastRecordedEntry.currency}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {onDeleteEntry && (
              <button
                type="button"
                onClick={() => {
                  onDeleteEntry(lastRecordedEntry.id);
                  setLastRecordedEntry(null);
                  speakText(isKm ? 'បានលុបចោល' : 'Deleted', lang);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title={isKm ? 'លុបការកត់ត្រានេះ' : 'Delete this record'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Subtle Interactive Voice Examples (Just clean clickable pills) */}
        {!isListening && (
          <div className="w-full max-w-sm pt-2 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isKm ? 'ឧទាហរណ៍ចុចសាកល្បង' : 'Quick Try Examples'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => processSpokenText('លក់កាហ្វេបាន ២ម៉ឺនរៀល')}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer active:scale-95"
              >
                💬 «លក់កាហ្វេ ២ម៉ឺនរៀល»
              </button>

              <button
                type="button"
                onClick={() => processSpokenText('ទិញបន្លែ ៨ពាន់រៀល')}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer active:scale-95"
              >
                💬 «ទិញបន្លែ ៨ពាន់រៀល»
              </button>

              <button
                type="button"
                onClick={() => processSpokenText('ពូសុខ ជំពាក់ $15')}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer active:scale-95"
              >
                💬 «ពូសុខ ជំពាក់ $15»
              </button>

              <button
                type="button"
                onClick={() => processSpokenText('តើថ្ងៃនេះចំណេញបានប៉ុន្មាន?')}
                className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition-colors cursor-pointer active:scale-95 border border-indigo-200"
              >
                ❓ «តើថ្ងៃនេះចំណេញប៉ុន្មាន?»
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Clean Minimalist Bottom Bar */}
      <footer className="py-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {isKm ? `កត់ត្រាឥតគិតថ្លៃ៖ ${trialStats?.recordsRemaining ?? Math.max(0, 300 - entries.length)} ដង` : `Free recordings left: ${trialStats?.recordsRemaining ?? Math.max(0, 300 - entries.length)}`}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          NBC Rate: 4,030 KHR = $1
        </div>
      </footer>

    </div>
  );
};
