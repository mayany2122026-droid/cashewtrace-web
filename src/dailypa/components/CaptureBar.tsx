import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Sparkles, AlertCircle, 
  CheckCircle2, ArrowRight, Play, Film, Send,
  HelpCircle, Zap, ChevronDown, Languages, Clock, User
} from 'lucide-react';
import { CategorizeResult, EntryType, SupportedLanguage } from '../types';
import { parseVoiceTranscript } from '../utils/parser';
import { speakText, stopSpeaking, getContinuousWalkthroughScript, unlockMobileAudio } from '../utils/speech';
import { TIERS_CONFIG } from '../utils/tiers';
import { t } from '../utils/i18n';
import { getTrialStats, TrialStats, MAX_FREE_VOICE_RECORDS, MAX_FREE_TRIAL_DAYS } from '../utils/trialTracker';

interface CaptureBarProps {
  onAddEntry: (result: CategorizeResult, rawTranscript: string) => void;
  voiceTtsEnabled: boolean;
  lang: SupportedLanguage;
  onToggleLang: (l?: SupportedLanguage) => void;
  currentUserId: string;
  onOpenVideoTutorial: () => void;
  onOpenLanguageModal: () => void;
  onVoiceCommand: (cmd: string) => boolean;
  onQuickSpeak?: () => void;
  totalEntriesCount?: number;
  onOpenPricingTiers?: () => void;
  defaultCurrency?: string;
  onOpenOnboarding?: () => void;
  trialStats?: TrialStats;
}

export const CaptureBar: React.FC<CaptureBarProps> = ({
  onAddEntry,
  voiceTtsEnabled,
  lang,
  onToggleLang,
  onOpenVideoTutorial,
  onOpenLanguageModal,
  onVoiceCommand,
  onQuickSpeak,
  totalEntriesCount = 0,
  onOpenPricingTiers,
  defaultCurrency = 'USD',
  onOpenOnboarding,
  trialStats,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [guideExpanded, setGuideExpanded] = useState(true);

  // Continuous Voice Walkthrough State (Section 1 -> Section 2 -> Section 3 -> Section 4)
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);
  const speechTimerRef = useRef<any[]>([]);

  useEffect(() => {
    return () => {
      speechTimerRef.current.forEach(t => clearTimeout(t));
      stopSpeaking();
    };
  }, []);

  const handlePlayContinuousWalkthrough = () => {
    speechTimerRef.current.forEach(t => clearTimeout(t));
    speechTimerRef.current = [];

    if (isSpeakingGuide) {
      stopSpeaking();
      setIsSpeakingGuide(false);
      setSpeakingStep(null);
      return;
    }

    setIsSpeakingGuide(true);
    setSpeakingStep(1);

    const script = getContinuousWalkthroughScript(lang);

    // Dynamic step indicator progression
    const t2 = setTimeout(() => setSpeakingStep(2), 5200);
    const t3 = setTimeout(() => setSpeakingStep(3), 9800);
    const t4 = setTimeout(() => setSpeakingStep(4), 14000);
    speechTimerRef.current = [t2, t3, t4];

    speakText(script, lang, {
      playChime: false, // Instant start with zero delay
      englishFallbackText: 'Welcome to MyDailyPA, your personal voice assistant. You can record income and expenses in Riels or Dollars. Please tap the red microphone below to speak.',
      onStart: () => {
        setIsSpeakingGuide(true);
        setSpeakingStep(1);
      },
      onEnd: () => {
        setIsSpeakingGuide(false);
        setSpeakingStep(null);
        speechTimerRef.current.forEach(t => clearTimeout(t));
        speechTimerRef.current = [];
      }
    });
  };

  const handleStopWalkthrough = () => {
    stopSpeaking();
    setIsSpeakingGuide(false);
    setSpeakingStep(null);
    speechTimerRef.current.forEach(t => clearTimeout(t));
    speechTimerRef.current = [];
  };
  
  // Persistent last recorded voice note for user inspection
  const [lastSavedEntry, setLastSavedEntry] = useState<{
    text: string;
    parsed: CategorizeResult;
    time: string;
  } | null>(null);

  // Continuous Cashier Mode for Grocery Sellers & MSME Vendors
  const [isCashierMode, setIsCashierMode] = useState(false);
  const isCashierModeRef = useRef(false);
  isCashierModeRef.current = isCashierMode;

  const recognitionRef = useRef<any>(null);
  const latestTextRef = useRef<string>('');
  const isProcessingRef = useRef<boolean>(false);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Match language code
      if (lang === 'km') {
        recognition.lang = 'km-KH';
      } else if (lang === 'th') {
        recognition.lang = 'th-TH';
      } else if (lang === 'vi') {
        recognition.lang = 'vi-VN';
      } else if (lang === 'nl') {
        recognition.lang = 'nl-NL';
      } else if (lang === 'de') {
        recognition.lang = 'de-DE';
      } else if (lang === 'zh') {
        recognition.lang = 'zh-CN';
      } else if (lang === 'ko') {
        recognition.lang = 'ko-KR';
      } else if (lang === 'fr') {
        recognition.lang = 'fr-FR';
      } else if (lang === 'es') {
        recognition.lang = 'es-ES';
      } else if (lang === 'it') {
        recognition.lang = 'it-IT';
      } else if (lang === 'id') {
        recognition.lang = 'id-ID';
      } else if (lang === 'ms') {
        recognition.lang = 'ms-MY';
      } else {
        recognition.lang = 'en-US';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('');
        latestTextRef.current = '';
        isProcessingRef.current = false;
      };

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

        const currentSpoken = (final || interim).trim();
        if (currentSpoken) {
          latestTextRef.current = currentSpoken;
        }

        if (final) {
          setTranscript(final);
          setInterimText('');
          if (!isProcessingRef.current) {
            isProcessingRef.current = true;
            handleProcessVoiceInput(final);
          }
        } else {
          setInterimText(interim);
        }
      };

      recognition.onerror = (err: any) => {
        setIsListening(false);
        if (err?.error === 'not-allowed') {
          setFeedbackMessage(
            lang === 'km' 
              ? 'សូមអនុញ្ញាតការប្រើមីក្រូហ្វូនក្នុង Browser របស់អ្នក (ចុចរូបសោជិត URL)។' 
              : 'Please allow microphone access in your browser settings.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Robust fallback: if recognition ended without an explicit isFinal flag,
        // process whatever speech was captured in latestTextRef
        if (!isProcessingRef.current && latestTextRef.current.trim()) {
          isProcessingRef.current = true;
          const captured = latestTextRef.current.trim();
          setTranscript(captured);
          setInterimText('');
          handleProcessVoiceInput(captured);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const toggleListening = async () => {
    stopSpeaking();
    unlockMobileAudio();

    if (!recognitionRef.current) {
      // Simulate quick voice input in unsupported environments
      const sample = lang === 'th' 
        ? 'ขายสบู่ธรรมชาติได้ 525 ดอลลาร์' 
        : lang === 'vi' 
        ? 'Bán xà phòng được 525 đô la' 
        : lang === 'km'
        ? 'លក់សាប៊ូធម្មជាតិបាន ៣៥ ដប ៥២៥ ដុល្លារ'
        : lang === 'nl'
        ? '35 natuurlijke zepen verkocht voor 525 euro'
        : lang === 'de'
        ? '35 Naturseifen für 525 Euro verkauft'
        : 'Sold natural soaps for 525 dollars';
      handleProcessVoiceInput(sample);
      return;
    }

    if (isListening) {
      // User tapped again to stop their voice command
      try {
        recognitionRef.current.stop();
      } catch (e) {}

      // Immediately process any text captured during this session
      if (!isProcessingRef.current && latestTextRef.current.trim()) {
        isProcessingRef.current = true;
        const captured = latestTextRef.current.trim();
        setTranscript(captured);
        setInterimText('');
        handleProcessVoiceInput(captured);
      }
    } else {
      // User begins fresh voice recording
      setTranscript('');
      setInterimText('');
      setFeedbackMessage(null);
      latestTextRef.current = '';
      isProcessingRef.current = false;

      // Request getUserMedia to prompt for permission if needed
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
        } catch (err: any) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setFeedbackMessage(
              lang === 'km'
                ? 'កម្មវិធីមិនទាន់បានទទួលសិទ្ធិប្រើប្រាស់មីក្រូហ្វូនទេ។ សូមចុចបើកសិទ្ធិមីក្រូហ្វូនក្នុង Browser។'
                : 'Microphone permission blocked. Please allow microphone in browser.'
            );
            return;
          }
        }
      }

      try {
        recognitionRef.current.start();
      } catch (e) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current?.start(), 150);
        } catch (err) {}
      }
    }
  };

  const handleProcessVoiceInput = (text: string) => {
    if (!text.trim()) return;

    // Check voice navigation commands first (e.g., switching language or requesting sales/expenses)
    if (onVoiceCommand(text)) {
      return;
    }

    // Parse transaction using AI parser
    const parsed = parseVoiceTranscript(text, defaultCurrency, lang);
    onAddEntry(parsed, text);

    // Save as persistent last voice entry for user inspection
    setLastSavedEntry({
      text: text.trim(),
      parsed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    const title = lang === 'km'
      ? (parsed.titleKhmer || parsed.titleEnglish || text.trim())
      : (parsed.titleEnglish || parsed.titleKhmer || text.trim());
    const amountStr = parsed.amount ? `(${parsed.amount.toLocaleString()} ${parsed.currency})` : '';
    const msg = `${t('btnSave', lang)}: ${title} ${amountStr}`.trim();
    setFeedbackMessage(msg);

    if (voiceTtsEnabled) {
      const speechAmount = parsed.amount 
        ? `${parsed.amount.toLocaleString()} ${parsed.currency === 'KHR' ? (lang === 'km' ? 'រៀល' : 'riels') : parsed.currency}` 
        : '';
      speakText(`${title} ${speechAmount}`.trim(), lang, { playChime: true });
    }

    // Continuous Cashier Mode: Automatically re-open microphone after a brief pause
    if (isCashierModeRef.current && recognitionRef.current) {
      setTimeout(() => {
        try {
          isProcessingRef.current = false;
          latestTextRef.current = '';
          setTranscript('');
          setInterimText('');
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {}
      }, 2200);
    }

    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    handleProcessVoiceInput(manualText);
    setManualText('');
  };

  const handleSelectTemplate = (script: string) => {
    setTemplatesOpen(false);
    handleProcessVoiceInput(script);
  };

  return (
    <section 
      id="hero-voice-capture-session"
      className="max-w-4xl w-full mx-auto px-3 sm:px-6 pt-2 pb-2 space-y-4"
    >
      {/* 4-Step Welcome & Getting Started Flow */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-rose-50/40 to-amber-50/30 border border-rose-200 shadow-sm p-4 sm:p-5 space-y-3.5">
        
        {/* Flow Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
              ⭐
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                {lang === 'km' 
                  ? '៤ ជំហានងាយៗមុនពេលចាប់ផ្តើមកត់ត្រាសំឡេង' 
                  : lang === 'nl'
                  ? '4 eenvoudige stappen voor u begint met opnemen'
                  : '4 Easy Steps Before Voice Recording'}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'km' ? 'សេចក្តីណែនាំរហ័សសម្រាប់អ្នកប្រើប្រាស់ថ្មីទាំងអស់' : 'Quick walkthrough for first-time users'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Continuous Voice Flow Button without Pausing & without clicking multiple times */}
            {isSpeakingGuide ? (
              <button
                type="button"
                onClick={handleStopWalkthrough}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm animate-pulse cursor-pointer transition-all"
                title={lang === 'km' ? 'បញ្ឈប់សំឡេង' : 'Stop voice playback'}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>{lang === 'km' ? '⏹️ បញ្ឈប់សំឡេង' : '⏹️ Stop Audio'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlayContinuousWalkthrough}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 cursor-pointer transition-all"
                title={lang === 'km' ? 'ស្តាប់ការណែនាំពីដើមដល់ចប់ដោយមិនបាច់ចុចម្តងមួយៗ' : 'Listen all steps continuously without pausing'}
              >
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
                <span>{lang === 'km' ? '🔊 ស្តាប់ការណែនាំទាំងអស់ (បន្តបន្ទាប់)' : '🔊 Listen All Steps (Continuous)'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setGuideExpanded(!guideExpanded)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>{guideExpanded ? (lang === 'km' ? 'បង្រួម' : 'Collapse') : (lang === 'km' ? 'ពង្រីក' : 'Expand')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${guideExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {guideExpanded && (
          <div className="space-y-2.5 pt-1 animate-in fade-in duration-150">
            
            {/* Step 1: Greeting Welcome */}
            <div className={`flex items-start gap-2.5 p-2.5 sm:p-3 rounded-2xl border transition-all ${
              speakingStep === 1 
                ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-400/50 shadow-md scale-[1.01]' 
                : 'bg-white border-rose-100 shadow-2xs'
            }`}>
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {lang === 'km' ? 'សូមស្វាគមន៍មកកាន់ ជំនួយការខ្ញុំ' : 'Welcome to MyDailyPA — Your Assistant'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleStopWalkthrough();
                      speakText(
                        lang === 'km' 
                          ? 'សូមស្វាគមន៍មកកាន់ ជំនួយការខ្ញុំ។ ជំនួយការសំឡេងឆ្លាតវៃសម្រាប់កត់ត្រាចំណូល ចំណាយ បំណុល និងកិច្ចការប្រចាំថ្ងៃដោយមិនបាច់វាយអក្សរ។' 
                          : 'Welcome to MyDailyPA, your personal voice assistant to track income, expenses, debts, and tasks without typing.',
                        lang,
                        { playChime: false }
                      );
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>{lang === 'km' ? 'ស្តាប់សេចក្តីស្វាគមន៍' : 'Listen Welcome'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {lang === 'km' 
                    ? 'ជំនួយការសំឡេងឆ្លាតវៃសម្រាប់កត់ត្រាចំណូល ចំណាយ បំណុល និងកិច្ចការប្រចាំថ្ងៃដោយមិនបាច់វាយអក្សរ។' 
                    : 'Smart voice assistant to track income, expenses, debts, and tasks without typing.'}
                </p>
              </div>
            </div>

            {/* Step 2: Language - Exclusively Khmer (KH) */}
            <div className={`flex items-start gap-2.5 p-2.5 sm:p-3 rounded-2xl border transition-all ${
              speakingStep === 2 
                ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-[1.01]' 
                : 'bg-white border-amber-100 shadow-2xs'
            }`}>
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {lang === 'km' ? 'ភាសាខ្មែរ (Khmer Voice AI)' : 'Khmer Voice AI'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        handleStopWalkthrough();
                        speakText(
                          'ប្រព័ន្ធត្រូវបានកំណត់ជាភាសាខ្មែររួចជាស្រេច ដើម្បីងាយស្រួលនិយាយ និងកត់ត្រា។',
                          'km',
                          { playChime: false }
                        );
                      }}
                      className="px-2 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3 h-3 text-amber-600" />
                      <span>{lang === 'km' ? 'ស្តាប់' : 'Listen'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5 shadow-2xs">
                    <span>🇰🇭</span>
                    <span>ភាសាខ្មែរ (KH)</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    ✓ កំណត់រួចជាស្រេច
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500">
                  {lang === 'km' 
                    ? '💡 អ្នកអាចចុចមីក្រូហ្វូន រួចនិយាយភាសាខ្មែរដោយផ្ទាល់ភ្លាមៗ ដោយមិនបាច់ជ្រើសរើសភាសា!' 
                    : '💡 Tap the microphone and speak in Khmer directly without language selection!'}
                </p>
              </div>
            </div>

            {/* Step 3: Watch Video Guide Before Recording */}
            <div className={`flex items-start gap-2.5 p-2.5 sm:p-3 rounded-2xl border transition-all ${
              speakingStep === 3 
                ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-400/50 shadow-md scale-[1.01]' 
                : 'bg-white border-indigo-100 shadow-2xs'
            }`}>
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {lang === 'km' ? 'មើលវីដេអូណែនាំមុននឹងកត់ត្រាសំឡេង' : 'Watch Video Guide Before Voice Recording'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        handleStopWalkthrough();
                        speakText(
                          lang === 'km' 
                            ? 'សូមមើលវីដេអូណែនាំដើម្បីដឹងពីរបៀបប្រើប្រាស់។ អ្នកអាចចុចបិទគ្រប់ពេល។'
                            : 'Watch our video guide to see how MyDailyPA works. You can close it anytime.',
                          lang,
                          { playChime: false }
                        );
                      }}
                      className="px-2 py-0.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3 h-3 text-indigo-600" />
                      <span>{lang === 'km' ? 'ស្តាប់' : 'Listen'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onOpenVideoTutorial}
                      className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{lang === 'km' ? '▶️ មើលវីដេអូណែនាំ' : 'Watch Video Guide'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-indigo-700 font-medium mt-1 leading-relaxed">
                  {lang === 'km'
                    ? '🎬 សូមមើលវីដេអូដើម្បីដឹងពីរបៀបប្រើប្រាស់ MyDailyPA។ ប្រសិនបើអ្នកចង់ឈប់មើល គ្រាន់តែចុចប៊ូតុងបិទ (Close) គ្រប់ពេល!'
                    : '🎬 Please watch our video so you know how to use MyDailyPA. If you want to stop watching, just tap the close button anytime!'}
                </p>
              </div>
            </div>

            {/* Step 4: Tap Red Mic to Record, Tap Again to Stop */}
            <div className={`flex items-start gap-2.5 p-2.5 sm:p-3 rounded-2xl border transition-all ${
              speakingStep === 4 
                ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-400/50 shadow-md scale-[1.01]' 
                : 'bg-white border-rose-200 shadow-2xs'
            }`}>
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-slate-900 block">
                    {lang === 'km' ? 'កត់ត្រាសំឡេងរបស់អ្នកយ៉ាងងាយស្រួល' : 'Record Your Voice by Tapping the Mic'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleStopWalkthrough();
                      speakText(
                        lang === 'km'
                          ? 'សូមចុចលើប៊ូតុងមីក្រូហ្វូនពណ៌ក្រហមធំនៅខាងក្រោមនេះភ្លាម ដើម្បីចាប់ផ្តើមនិយាយបញ្ជា!'
                          : 'Please tap the big red microphone button directly below to start speaking!',
                        lang,
                        { playChime: false }
                      );
                    }}
                    className="px-2 py-0.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3 h-3 text-rose-600" />
                    <span>{lang === 'km' ? 'ស្តាប់' : 'Listen'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  {lang === 'km'
                    ? '👉 សូមចុចលើប៊ូតុងមីក្រូហ្វូនពណ៌ក្រហមធំខាងក្រោម ដើម្បីចាប់ផ្តើមនិយាយបញ្ជា ហើយចុចម្តងទៀតពេលអ្នកនិយាយចប់ (Tap mic to speak, tap again to stop).'
                    : '👉 Please record your voice by tapping the big red button below, and tap again if you want to stop your command.'}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* 300 Free Records & 60 Days Trial Meter with Sign In Option */}
        {(() => {
          const currentStats = trialStats || getTrialStats();
          const voiceCount = Math.max(totalEntriesCount || 0, currentStats.voiceRecordingsCount);
          const recordsLeft = Math.max(0, MAX_FREE_VOICE_RECORDS - voiceCount);
          const daysLeft = currentStats.daysRemaining;

          return (
            <div className="pt-2.5 border-t border-rose-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                    <span>🎁</span>
                    <span>{lang === 'km' ? 'កូតាសាកល្បងឥតគិតថ្លៃ' : 'Free Trial'}</span>
                  </span>
                  
                  {/* Records remaining */}
                  <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                    <Mic className="w-3 h-3 text-rose-500" />
                    <strong className="text-emerald-800">{recordsLeft}</strong>/300 {lang === 'km' ? 'ដង' : 'records'}
                  </span>

                  <span className="text-slate-300">•</span>

                  {/* Days remaining */}
                  <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    <strong className="text-indigo-800">{daysLeft}</strong>/60 {lang === 'km' ? 'ថ្ងៃ' : 'days'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Sign In with Name & Phone Button if not registered */}
                  {onOpenOnboarding && !currentStats.isRegistered && (
                    <button
                      type="button"
                      onClick={onOpenOnboarding}
                      className="px-2.5 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10.5px] font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title={lang === 'km' ? 'ភ្ជាប់ឈ្មោះ & លេខទូរស័ព្ទ ដើម្បីរក្សាទុកកូតា ៣០០ ដង' : 'Sign in with Name & Phone to track your 300 records'}
                    >
                      <User className="w-3 h-3 text-rose-600" />
                      <span>{lang === 'km' ? 'ចូលគណនី (ឈ្មោះ & លេខទូរស័ព្ទ)' : 'Sign In (Name & Phone)'}</span>
                    </button>
                  )}

                  {/* Tiers Button */}
                  {onOpenPricingTiers && (
                    <button
                      type="button"
                      onClick={onOpenPricingTiers}
                      className="px-2 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-[10.5px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <span>💎 {lang === 'km' ? 'តម្លៃ ១$-៥$' : 'Tiers ($1-$5)'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dual Visual Progress Bars */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[9.5px] text-slate-500 font-bold">
                    <span>{lang === 'km' ? 'សំឡេង' : 'Voice'} ({voiceCount}/300)</span>
                    <span className="font-mono text-emerald-700">{Math.round((voiceCount / MAX_FREE_VOICE_RECORDS) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (voiceCount / MAX_FREE_VOICE_RECORDS) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[9.5px] text-slate-500 font-bold">
                    <span>{lang === 'km' ? 'រយៈពេល' : 'Days'} ({currentStats.daysUsed}/60d)</span>
                    <span className="font-mono text-indigo-700">{Math.round((currentStats.daysUsed / MAX_FREE_TRIAL_DAYS) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (currentStats.daysUsed / MAX_FREE_TRIAL_DAYS) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Expired Banner Alert */}
              {currentStats.isExpired && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 font-bold flex items-center justify-between gap-2">
                  <span>
                    ⚠️ {lang === 'km' 
                      ? 'អ្នកបានប្រើប្រាស់អស់កូតាសាកល្បងហើយ (៣០០ ដង ឬ ៦០ ថ្ងៃ)។ សូមជ្រើសរើសកញ្ចប់ ១$ ដល់ ៥$/ខែ!'
                      : 'You have reached the free trial limit (300 records or 60 days). Please choose a $1-$5/month tier!'}
                  </span>
                  {onOpenPricingTiers && (
                    <button
                      type="button"
                      onClick={onOpenPricingTiers}
                      className="px-2 py-1 rounded-lg bg-amber-600 text-white font-black text-[10px] shrink-0 cursor-pointer"
                    >
                      {lang === 'km' ? 'ជ្រើសរើសកញ្ចប់' : 'Select Tier'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {/* Microphone Recording Station — Positioned Directly Below Greeting Box */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-md shadow-slate-200/50 space-y-4">
        
        {/* Central 80px+ Accessible Red Microphone */}
        <div className="flex flex-col items-center justify-center text-center py-2 space-y-3">
          <div className="relative">
            {isListening && (
              <>
                <span className="animate-ping absolute -inset-3 rounded-full bg-rose-400 opacity-40"></span>
                <span className="animate-pulse absolute -inset-6 rounded-full bg-rose-300 opacity-20"></span>
              </>
            )}

            <button
              id="big-red-mic-button"
              type="button"
              onClick={toggleListening}
              className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 ring-4 ring-rose-400/60 shadow-rose-600/40 animate-pulse'
                  : 'bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 shadow-rose-500/30'
              }`}
              title={isListening ? t('muteSpeech', lang) : t('tapToSpeak', lang)}
            >
              {isListening ? (
                <MicOff className="w-9 h-9 sm:w-11 sm:h-11" />
              ) : (
                <Mic className="w-9 h-9 sm:w-11 sm:h-11" />
              )}
            </button>
          </div>

          <div className="space-y-1 max-w-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {isListening ? t('listeningStatus', lang) : t('tapToSpeak', lang)}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t('exampleVoicePrompt', lang)}
            </p>
          </div>

          {/* Quick status indicator & helper tip */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
              <span>{isListening ? (lang === 'km' ? 'កំពុងស្តាប់...' : 'Listening...') : (lang === 'km' ? 'រួចរាល់សម្រាប់ការកត់ត្រា' : 'Ready to record')}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'km' 
                ? '💡 និយាយភាសាខ្មែរ លាយអង់គ្លេស ឬដុល្លារ/រៀល បានយ៉ាងរលូន'
                : '💡 Speak naturally in Khmer, English, or your local language'}
            </span>
          </div>

          {/* Continuous Cashier Mode Toggle for Grocery Vendors */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => {
                const next = !isCashierMode;
                setIsCashierMode(next);
                if (next && !isListening) {
                  toggleListening();
                }
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer shadow-2xs ${
                isCashierMode 
                  ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-300 animate-pulse' 
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>🛒</span>
              <span>
                {lang === 'km' 
                  ? `របៀបគិតលុយជាប់ដៃ (Cashier Mode): ${isCashierMode ? 'បើក (ON)' : 'បិទ (OFF)'}` 
                  : `Continuous Cashier Mode: ${isCashierMode ? 'ON' : 'OFF'}`}
              </span>
            </button>
            <span className="text-[10px] text-slate-400 max-w-xs text-center">
              {lang === 'km' 
                ? '🖐️ ដៃប្រឡាក់ទំនិញ? របៀប Cashier នឹងស្តាប់មុខទំនិញបន្ទាប់ដោយស្វ័យប្រវត្តិ!' 
                : '🖐️ Busy hands? Cashier mode automatically re-listens after each sale recorded!'}
            </span>
          </div>

          {/* Quick 1-Tap MSME Grocery Basket & Helper Voice Examples */}
          <div className="w-full max-w-lg pt-1 space-y-1 text-left">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>⚡ {lang === 'km' ? 'ឧទាហរណ៍សំឡេងលក់ទំនិញ & បុគ្គលិក' : 'Grocery & Helper Voice Prompts'}:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <button
                type="button"
                onClick={() => handleProcessVoiceInput('លក់អង្ករ 5kg 20000៛, ប្រេងឆា 1ដប $3, ពងមាន់ 10គ្រាប់ 6000៛')}
                className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 whitespace-nowrap font-bold shrink-0 transition-all cursor-pointer"
              >
                🧺 {lang === 'km' ? 'កន្ត្រកអង្ករ+ប្រេង+ពង' : 'Basket: Rice+Oil+Eggs'}
              </button>
              <button
                type="button"
                onClick={() => handleProcessVoiceInput('Sold 5kg rice 5 dollars, 2 bottles oil 6 dollars, 1 bag sugar 3 dollars')}
                className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 whitespace-nowrap font-bold shrink-0 transition-all cursor-pointer"
              >
                🧺 Sold 3 grocery items ($14)
              </button>
              <button
                type="button"
                onClick={() => handleProcessVoiceInput('បើកប្រាក់ខែឱ្យសុខា 150$')}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 whitespace-nowrap font-bold shrink-0 transition-all cursor-pointer"
              >
                👥 {lang === 'km' ? 'បើកប្រាក់ខែសុខា 150$' : 'Paid Sokha $150'}
              </button>
              <button
                type="button"
                onClick={() => handleProcessVoiceInput('ឱ្យសុខាបុរេប្រទាន 20$')}
                className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 whitespace-nowrap font-bold shrink-0 transition-all cursor-pointer"
              >
                💸 {lang === 'km' ? 'បុរេប្រទានសុខា 20$' : 'Advance $20'}
              </button>
              <button
                type="button"
                onClick={() => handleProcessVoiceInput('ដារ៉ាឈប់សម្រាកថ្ងៃនេះឈឺ')}
                className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 whitespace-nowrap font-bold shrink-0 transition-all cursor-pointer"
              >
                📅 {lang === 'km' ? 'ដារ៉ាឈប់សម្រាក (ឈឺ)' : 'Dara absent (sick)'}
              </button>
            </div>
          </div>

          {/* Real-time speech transcript feedback while recording */}
          {(interimText || transcript) && (
            <div className="w-full max-w-lg p-3 rounded-2xl bg-rose-50/90 border border-rose-200 text-xs sm:text-sm font-semibold text-rose-950 animate-in fade-in text-left">
              <div className="text-[10px] uppercase tracking-wider font-black text-rose-600 mb-1">
                🎙️ {lang === 'km' ? 'សំឡេងកំពុងនិយាយ (Live Voice Input)' : 'Live Speech Recording'}:
              </div>
              <span className="font-bold">{transcript || interimText}</span>
              {interimText && <span className="animate-pulse ml-1 text-rose-500">...</span>}
            </div>
          )}

          {feedbackMessage && (
            <div className="w-full max-w-lg p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 animate-in fade-in flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Persistent Last Recorded Voice Note Box (Never lost!) */}
          {lastSavedEntry && (
            <div className="w-full max-w-lg p-3.5 rounded-2xl bg-slate-50 border-2 border-emerald-400/80 shadow-xs space-y-2 animate-in fade-in text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'km' ? 'សារសំឡេងដែលបានកត់ត្រា' : 'Recorded Voice Note'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({lastSavedEntry.time})</span>
                </div>
                <button
                  type="button"
                  onClick={() => speakText(lastSavedEntry.text, lang, { playChime: true })}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Replay Spoken Audio"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{lang === 'km' ? 'ស្តាប់ឡើងវិញ' : 'Replay'}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  "{lastSavedEntry.text}"
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5 flex-wrap gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] uppercase">
                    {(lastSavedEntry.parsed.category || 'others').toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-bold text-[10px] uppercase">
                    {(lastSavedEntry.parsed.type || 'expense').toUpperCase()}
                  </span>
                </div>
                {lastSavedEntry.parsed.amount ? (
                  <span className="font-mono font-black text-emerald-700 text-sm">
                    {lastSavedEntry.parsed.amount.toLocaleString()} {lastSavedEntry.parsed.currency}
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Quick Voice Command Chips */}
        <div className="pt-1 border-t border-slate-100 flex items-center justify-center gap-1.5 flex-wrap text-[11px]">
          <span className="text-slate-400 text-[10px] font-bold uppercase mr-1">
            {t('voiceCommandLabel', lang)}
          </span>
          <button
            onClick={() => onVoiceCommand(lang === 'th' ? 'รายรับ' : lang === 'vi' ? 'thu nhập' : lang === 'nl' ? 'inkomsten' : lang === 'de' ? 'einnahmen' : 'ចំណូល')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-all cursor-pointer"
          >
            {t('cmdIncome', lang)}
          </button>
          <button
            onClick={() => onVoiceCommand(lang === 'th' ? 'รายจ่าย' : lang === 'vi' ? 'chi tiêu' : lang === 'nl' ? 'uitgaven' : lang === 'de' ? 'ausgaben' : 'ចំណាយ')}
            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold transition-all cursor-pointer"
          >
            {t('cmdExpense', lang)}
          </button>
          <button
            onClick={() => onVoiceCommand(lang === 'th' ? 'การนัดหมาย' : lang === 'vi' ? 'cuộc hẹn' : lang === 'nl' ? 'afspraak' : lang === 'de' ? 'termin' : 'ប្រជុំ')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold transition-all cursor-pointer"
          >
            {t('cmdMeetings', lang)}
          </button>
          <button
            onClick={() => onVoiceCommand(lang === 'th' ? 'รายงาน' : lang === 'vi' ? 'báo cáo' : lang === 'nl' ? 'rapport' : lang === 'de' ? 'bericht' : 'របាយការណ៍')}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold transition-all cursor-pointer"
          >
            {t('cmdReport', lang)}
          </button>
          <button
            onClick={() => onVoiceCommand(lang === 'th' ? 'อ่านทั้งหมด' : lang === 'vi' ? 'đọc tất cả' : lang === 'nl' ? 'alles voorlezen' : lang === 'de' ? 'alles vorlesen' : 'អានទាំងអស់')}
            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold transition-all cursor-pointer"
          >
            {t('cmdReadAll', lang)}
          </button>
        </div>

        {/* 1-Tap Voice Templates Accordion (4 Tiers) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <button
              id="voice-templates-dropdown-button"
              type="button"
              onClick={() => setTemplatesOpen(!templatesOpen)}
              className="flex items-center gap-2 text-xs font-black text-slate-800 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('linkVoiceTemplates', lang)}</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                4 Tiers
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${templatesOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {templatesOpen && (
            <div className="mt-3 space-y-3 animate-in fade-in duration-150">
              {TIERS_CONFIG.map((tier) => (
                <div key={tier.id} className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{lang === 'km' ? tier.titleKm : tier.titleEn}</span>
                    <span className="text-[10px] text-slate-500">{tier.subcategories.join(', ')}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {tier.templates.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectTemplate(lang === 'km' ? tpl.scriptKm : tpl.scriptEn)}
                        className="p-2.5 rounded-xl bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-[11px] font-black text-slate-900 group-hover:text-rose-600 mb-1">
                          <span className="truncate">{lang === 'km' ? tpl.titleKm : tpl.titleEn}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                          "{lang === 'km' ? tpl.scriptKm : tpl.scriptEn}"
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fallback Text Input (For quiet environments or manual typing) */}
        <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-100 flex gap-2">
          <input
            id="manual-entry-text-input"
            type="text"
            placeholder={t('manualInputPlaceholder', lang)}
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          />
          <button
            type="submit"
            disabled={!manualText.trim()}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>{t('btnSave', lang)}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </section>
  );
};
