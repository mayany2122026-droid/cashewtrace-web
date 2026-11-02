import React, { useState, useEffect } from 'react';
import { 
  UserProfile, Entry, Contact, CreditDebtRecord, 
  CurrencyConfig, SupportedLanguage, EntryType, CategoryType, CategorizeResult,
  ScheduleConfig, HelperStaff, LaborLogRecord
} from './types';
import { INITIAL_PROFILES, SAMPLE_ENTRIES, INITIAL_CREDIT_DEBT } from './utils/mockData';
import { speakText, unlockMobileAudio } from './utils/speech';
import { getSpokenVoiceFeedback, t, SUPPORTED_LANGUAGES_INFO } from './utils/i18n';
import { 
  getStoredSchedule, 
  saveStoredSchedule,
  parseVoiceReminderScheduleCommand,
  queryScheduledReminderTimes,
  handleSmartMemoryAndMentorQuery,
  generateComprehensiveEveningRecap
} from './utils/voiceAssistantEngine';

import { TopNavbar } from './components/TopNavbar';
import { RevolutHero } from './components/RevolutHero';
import { CaptureBar } from './components/CaptureBar';
import { BoxTabs } from './components/BoxTabs';
import { EntryCard } from './components/EntryCard';
import { OfficialContactCard } from './components/OfficialContactCard';
import { DailyVoicePLDigestModal } from './components/DailyVoicePLDigestModal';
import { CustomerCreditDebtModal } from './components/CustomerCreditDebtModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { CurrencySettingsModal } from './components/CurrencySettingsModal';
import { AuthOnboardingModal } from './components/AuthOnboardingModal';
import { InstallHomeScreenGateway } from './components/InstallHomeScreenGateway';
import { TelegramMiniAppModal } from './components/TelegramMiniAppModal';
import { AdminHubModal } from './components/AdminHubModal';
import { BriefingModal } from './components/BriefingModal';
import { ContactsModal } from './components/ContactsModal';
import { FullVideoTutorialModal } from './components/FullVideoTutorialModal';
import { TwoAppsInstallModal } from './components/TwoAppsInstallModal';
import { PricingTiersModal } from './components/PricingTiersModal';
import { ShareAppModal } from './components/ShareAppModal';
import { SummaryGraphModal, SummaryTimeframe } from './components/SummaryGraphModal';
import { HelperLaborModal } from './components/HelperLaborModal';
import { SimplifiedSecretaryView } from './components/SimplifiedSecretaryView';
import { LeanCanvasModal } from './components/LeanCanvasModal';
import { 
  initTelegramWebApp, 
  triggerTelegramHaptic, 
  isTelegramInAppBrowser, 
  openInExternalBrowser 
} from './utils/telegram';
import { 
  getTrialStats, 
  incrementVoiceRecordingCount, 
  TrialStats, 
  signOutUser 
} from './utils/trialTracker';

interface DailyPaAppProps {}

export const DailyPaApp: React.FC<DailyPaAppProps> = () => {
  const [isTgBrowserNoticeDismissed, setIsTgBrowserNoticeDismissed] = useState(false);
  const [trialStats, setTrialStats] = useState<TrialStats>(() => getTrialStats());

  // Check URL parameters for app isolation modes (?app=personal, ?app=founder)
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const appMode = urlParams?.get('app');

  const initialProfile = () => {
    if (appMode === 'founder') {
      return INITIAL_PROFILES[1]; // Founder Admin
    }
    if (appMode === 'personal') {
      return INITIAL_PROFILES[0]; // Mayany SAM
    }
    if (typeof window !== 'undefined') {
      const phone = localStorage.getItem('dailypa_current_phone');
      const name = localStorage.getItem('dailypa_current_user_name');
      if (phone && name) {
        return {
          id: `user_${phone.replace(/\D/g, '')}`,
          name,
          phoneNumber: phone,
          role: 'user' as const,
          avatar: '👤',
        };
      }
    }
    return INITIAL_PROFILES[2]; // Public
  };

  const [currentProfile, setCurrentProfile] = useState<UserProfile>(initialProfile);
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dailypa_lang');
      if (saved === 'ko' || saved === 'en') return saved;
    }
    return 'en';
  });

  const [voiceTtsEnabled, setVoiceTtsEnabled] = useState(true);

  // View Mode: 'simplified' (Radical Voice Pocket Secretary for non-reading/writing) vs 'dashboard' (Full MSME View)
  const [viewMode, setViewMode] = useState<'simplified' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dailypa_view_mode');
      if (saved === 'dashboard') return 'dashboard';
    }
    // Default to Simplified Secretary as recommended by mentors!
    return 'simplified';
  });

  const handleToggleViewMode = (mode: 'simplified' | 'dashboard') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailypa_view_mode', mode);
    }
  };

  const handleSaveProfileDirect = (name: string, phone: string) => {
    const sanitizedPhone = phone.trim();
    const sanitizedName = name.trim();
    const profileId = `user_${sanitizedPhone.replace(/\D/g, '')}`;
    const updatedProfile: UserProfile = {
      id: profileId,
      name: sanitizedName,
      phoneNumber: sanitizedPhone,
      role: 'user',
      avatar: '👤',
    };
    setCurrentProfile(updatedProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailypa_current_phone', sanitizedPhone);
      localStorage.setItem('dailypa_current_user_name', sanitizedName);
    }
  };

  // Entries Vault State (Starts completely clean for new users)
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (typeof window !== 'undefined') {
      const cleanResetDone = localStorage.getItem('dailypa_clean_start_v2');
      if (cleanResetDone) {
        const saved = localStorage.getItem(`dailypa_entries_${currentProfile.id}`);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {}
        }
      }
    }
    return [];
  });

  // Credit & Debt State (Starts clean)
  const [debtRecords, setDebtRecords] = useState<CreditDebtRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const cleanResetDone = localStorage.getItem('dailypa_clean_start_v2');
      if (cleanResetDone) {
        const saved = localStorage.getItem(`dailypa_debt_${currentProfile.id}`);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {}
        }
      }
    }
    return [];
  });

  // Contacts (Starts clean)
  const [contacts, setContacts] = useState<Contact[]>(() => {
    if (typeof window !== 'undefined') {
      const cleanResetDone = localStorage.getItem('dailypa_clean_start_v2');
      if (cleanResetDone) {
        const saved = localStorage.getItem(`dailypa_contacts_${currentProfile.id}`);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {}
        }
      }
    }
    return [];
  });

  // Currency & Exchange Rate State (NBC 4,030 KHR baseline)
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dailypa_currency_config');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      primaryCurrency: 'KHR',
      secondaryCurrency: 'USD',
      secondaryCurrencySymbol: '៛',
      secondaryCurrencyName: 'រៀលកម្ពុជា',
      exchangeRateMode: 'nbc',
      usdToKhrRate: 4030,
      usdToSecondaryRate: 4030,
      lastUpdated: new Date().toISOString(),
      sourceLabel: 'ធនាគារជាតិនៃកម្ពុជា (NBC)',
      allowFluctuation: false,
    };
  });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedType, setSelectedType] = useState<EntryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isVoicePLDigestOpen, setIsVoicePLDigestOpen] = useState(false);
  const [isCreditDebtOpen, setIsCreditDebtOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isAdminHubOpen, setIsAdminHubOpen] = useState(false);
  const [isLeanCanvasOpen, setIsLeanCanvasOpen] = useState(false);
  const [isVideoTutorialOpen, setIsVideoTutorialOpen] = useState(false);
  const [isInstallGatewayOpen, setIsInstallGatewayOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isTwoAppsModalOpen, setIsTwoAppsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isCurrencySettingsOpen, setIsCurrencySettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPricingTiersOpen, setIsPricingTiersOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSummaryGraphOpen, setIsSummaryGraphOpen] = useState(false);
  const [isHelperLaborOpen, setIsHelperLaborOpen] = useState(false);
  const [summaryTimeframe, setSummaryTimeframe] = useState<SummaryTimeframe>('week');
  const [summarySearchQuery, setSummarySearchQuery] = useState('');
  const [summaryAutoSpeak, setSummaryAutoSpeak] = useState(false);

  // MSME Helpers & Staff State (Persisted per profile)
  const [helpers, setHelpers] = useState<HelperStaff[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`dailypa_helpers_${currentProfile.id}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [
      { id: 'h1', name: 'សុខា (Sokha)', phone: '012 334 455', role: 'Shop Helper / អ្នកលក់', monthlySalary: 150, currency: 'USD', startDate: '2025-01-01', isActive: true },
      { id: 'h2', name: 'ដារ៉ា (Dara)', phone: '088 776 655', role: 'Delivery / ដឹកជញ្ជូន', monthlySalary: 120, currency: 'USD', startDate: '2025-02-15', isActive: true },
    ];
  });

  // MSME Labor Log Records (Salaries, Advances, Absences, Overtime)
  const [laborLogs, setLaborLogs] = useState<LaborLogRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`dailypa_labor_logs_${currentProfile.id}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`dailypa_helpers_${currentProfile.id}`, JSON.stringify(helpers));
    }
  }, [helpers, currentProfile.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`dailypa_labor_logs_${currentProfile.id}`, JSON.stringify(laborLogs));
    }
  }, [laborLogs, currentProfile.id]);

  const handleOpenSummaryGraph = (timeframe: SummaryTimeframe = 'week', query: string = '', autoSpeak: boolean = false) => {
    setSummaryTimeframe(timeframe);
    setSummarySearchQuery(query);
    setSummaryAutoSpeak(autoSpeak);
    setIsSummaryGraphOpen(true);
  };

  // Schedule config for Morning Briefing & Evening Profit Recap (100% voice controllable)
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>(() => getStoredSchedule());

  const handleUpdateSchedule = (newCfg: Partial<ScheduleConfig>) => {
    setScheduleConfig((prev) => {
      const updated = { ...prev, ...newCfg };
      saveStoredSchedule(updated);
      return updated;
    });
  };


  // Initialize Telegram WebApp runtime (viewport expand, header styling, haptic readiness)
  useEffect(() => {
    const tgUser = initTelegramWebApp();
    if (tgUser) {
      setCurrentProfile((prev) => {
        if (prev.role === 'user') {
          return {
            ...prev,
            name: `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`,
          };
        }
        return prev;
      });
    }
  }, []);

  // Ensure existing sessions and new users start with clean data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanResetDone = localStorage.getItem('dailypa_clean_start_v2');
      if (!cleanResetDone) {
        INITIAL_PROFILES.forEach((p) => {
          localStorage.removeItem(`dailypa_entries_${p.id}`);
          localStorage.removeItem(`dailypa_debt_${p.id}`);
          localStorage.removeItem(`dailypa_contacts_${p.id}`);
        });
        localStorage.setItem('dailypa_clean_start_v2', 'true');
        setEntries([]);
        setDebtRecords([]);
        setContacts([]);
      }
    }
  }, []);

  // Listen for language and currency updates from header and LanguageToggle
  useEffect(() => {
    const handleGlobalLangCurrency = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { lang: newLang, config } = customEvent.detail;
        if (newLang) setLang(newLang as SupportedLanguage);
        if (config) setCurrencyConfig(config);
      }
    };
    window.addEventListener('app_language_currency_change', handleGlobalLangCurrency);
    return () => {
      window.removeEventListener('app_language_currency_change', handleGlobalLangCurrency);
    };
  }, []);

  // Auto-Warmup & Greeting on App Launch
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hasPlayedGreeting = false;
    const triggerInitialGreeting = () => {
      if (hasPlayedGreeting) return;
      hasPlayedGreeting = true;
      unlockMobileAudio();

      const greetingText = 'ជម្រាបសួរ! សូមស្វាគមន៍មកកាន់ MyDailyPA។ ខ្ញុំជាលេខាសំឡេងផ្ទាល់ខ្លួនរបស់អ្នក។ អ្នកអាចកត់ត្រាចំណូល ចំណាយ ជាប្រាក់រៀល ឬជាដុល្លារ។ សូមចុចប៊ូតុងមីក្រូហ្វូនដើម្បីនិយាយ។';

      speakText(greetingText, 'km', {
        playChime: false, // Instant start with zero delay
        englishFallbackText: 'Welcome to MyDailyPA, your personal voice assistant. You can record income and expenses in Riels or Dollars. Please tap the microphone to speak.'
      });
    };

    // Attempt direct audio playback on initial mount (supported in PWAs and desktop)
    try {
      triggerInitialGreeting();
    } catch {}

    // Mobile browsers (iOS/Android) block auto-speech without interaction;
    // this immediately triggers on the user's very first tap/touch anywhere on screen!
    const handleFirstUserInteraction = () => {
      triggerInitialGreeting();
    };

    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstUserInteraction, { once: true, passive: true });
    window.addEventListener('click', handleFirstUserInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
      window.removeEventListener('click', handleFirstUserInteraction);
    };
  }, [lang]);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`dailypa_entries_${currentProfile.id}`, JSON.stringify(entries));
    }
  }, [entries, currentProfile.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`dailypa_debt_${currentProfile.id}`, JSON.stringify(debtRecords));
    }
  }, [debtRecords, currentProfile.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`dailypa_contacts_${currentProfile.id}`, JSON.stringify(contacts));
    }
  }, [contacts, currentProfile.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailypa_lang', lang);
    }
  }, [lang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailypa_currency_config', JSON.stringify(currencyConfig));
    }
  }, [currencyConfig]);

  // Automated Alarm & Briefing Clock Checker (Checks every 20 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toDateString();

      // Check Evening Profit Recap
      if (
        currentTimeStr === scheduleConfig.eveningTime &&
        scheduleConfig.lastEveningRecapDate !== todayDateStr
      ) {
        handleUpdateSchedule({ lastEveningRecapDate: todayDateStr });
        const recap = generateComprehensiveEveningRecap(
          entries,
          debtRecords,
          currencyConfig.usdToSecondaryRate || currencyConfig.usdToKhrRate,
          lang
        );
        speakText(recap.spokenRecap, lang, { playChime: true });
        setIsBriefingOpen(true);
      }

      // Check Morning Briefing
      if (
        currentTimeStr === scheduleConfig.morningTime &&
        scheduleConfig.lastMorningBriefingDate !== todayDateStr
      ) {
        handleUpdateSchedule({ lastMorningBriefingDate: todayDateStr });
        const morningText = lang === 'km'
          ? `ជម្រាបសួរពេលព្រឹក! ដល់ម៉ោងសង្ខេបកិច្ចការហើយ។ ខ្ញុំជា Mayany ជំនួយការផ្ទាល់ខ្លួនរបស់អ្នក។ សូមជូនពរឱ្យថ្ងៃនេះជាថ្ងៃលក់ដាច់ និងមានសំណាងល្អ!`
          : `Good morning! Time for your daily focus briefing. I am Mayany, your personal assistant. Wishing you a wonderful and profitable day!`;
        speakText(morningText, lang, { playChime: true });
        setIsBriefingOpen(true);
      }
    }, 20000);

    return () => clearInterval(timer);
  }, [scheduleConfig, entries, debtRecords, currencyConfig, lang]);


  // Language & Currency Synchronization Handler
  const handleSelectLanguageAndCurrency = (newLang: SupportedLanguage) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailypa_lang', newLang);
    }

    const langInfo = SUPPORTED_LANGUAGES_INFO.find((item) => item.code === newLang);
    if (!langInfo) return;

    let updatedConfig: CurrencyConfig;
    if (newLang === 'ko') {
      // Korean (한국어): KRW currency with USD secondary
      updatedConfig = {
        primaryCurrency: 'KRW',
        secondaryCurrency: 'USD',
        secondaryCurrencySymbol: '₩',
        secondaryCurrencyName: '대한민국 원 (KRW)',
        exchangeRateMode: 'market',
        usdToKhrRate: 4030,
        usdToSecondaryRate: 1380,
        lastUpdated: new Date().toISOString(),
        sourceLabel: '한국수출입은행 / 서울외환시장 (1$ = 1,380₩)',
        allowFluctuation: false,
      };
    } else {
      // English (International): USD primary
      updatedConfig = {
        primaryCurrency: 'USD',
        secondaryCurrency: 'USD',
        secondaryCurrencySymbol: '$',
        secondaryCurrencyName: 'US Dollar',
        exchangeRateMode: 'market',
        usdToKhrRate: 4030,
        usdToSecondaryRate: 1,
        lastUpdated: new Date().toISOString(),
        sourceLabel: 'International US Dollar (USD $)',
        allowFluctuation: false,
      };
    }

    setCurrencyConfig(updatedConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailypa_currency_config', JSON.stringify(updatedConfig));
    }

    // Voice feedback
    if (voiceTtsEnabled) {
      if (newLang === 'ko') {
        speakText('한국어 모드가 활성화되었습니다. 원화 환율이 적용됩니다.', 'ko');
      } else {
        speakText('English language mode activated with US Dollar currency.', 'en');
      }
    }
  };

  // Voice Command Handler & Live Voice Assistant for All Users (including non-reading/writing)
  const handleVoiceCommand = (command: string): boolean => {
    const lower = command.toLowerCase().trim();

    // Calculate current financial totals dynamically for accurate voice reporting
    let totalIncUsd = 0;
    let totalExpUsd = 0;
    entries.forEach((e) => {
      const amt = e.amount || 0;
      const isKhr = e.currency === 'KHR';
      const valUsd = isKhr ? amt / currencyConfig.usdToKhrRate : amt;
      if (e.type === 'income') totalIncUsd += valUsd;
      else if (e.type === 'expense') totalExpUsd += valUsd;
    });
    const netUsd = totalIncUsd - totalExpUsd;
    const expLocal = Math.round(totalExpUsd * currencyConfig.usdToSecondaryRate);
    const incLocal = Math.round(totalIncUsd * currencyConfig.usdToSecondaryRate);
    const netLocal = Math.round(netUsd * currencyConfig.usdToSecondaryRate);
    const sym = currencyConfig.secondaryCurrencySymbol;

    // 0A. Voice-Controllable Reminder Time & Schedule Settings (e.g. "រំលឹកខ្ញុំម៉ោង ៩ យប់", "កំណត់ម៉ោង ៥ ព្រឹក", "remind me at 9pm", "set reminder to 5am")
    const scheduleParsed = parseVoiceReminderScheduleCommand(command, scheduleConfig, lang);
    if (scheduleParsed && scheduleParsed.handled) {
      handleUpdateSchedule(scheduleParsed.updatedSchedule);
      speakText(scheduleParsed.spokenFeedback, lang, { playChime: true });
      return true;
    }

    // 0B. Voice Query for Scheduled Times ("តើខ្ញុំកំណត់ម៉ោងរំលឹកម៉ោងប៉ុន្មាន?", "when is my reminder scheduled?")
    const schedQuery = queryScheduledReminderTimes(command, scheduleConfig, lang);
    if (schedQuery && schedQuery.handled) {
      speakText(schedQuery.spokenResponse, lang, { playChime: true });
      return true;
    }

    // 0C. Smart Memory & AI Mentor Q&A ("តើខ្ញុំបានលេបថ្នាំហើយឬនៅ?", "តើមានប្រជុំអ្វីខ្លះ?", "តើស្អែកត្រូវធ្វើអ្វីខ្លះ?", "តើធ្វើដូចម្តេចដើម្បីគិតប្រាក់ចំណេញ?")
    const mentorQuery = handleSmartMemoryAndMentorQuery(
      command,
      entries,
      debtRecords,
      scheduleConfig,
      currencyConfig.usdToSecondaryRate || currencyConfig.usdToKhrRate,
      lang
    );
    if (mentorQuery && mentorQuery.handled) {
      speakText(mentorQuery.spokenAnswer, lang, { playChime: true });
      return true;
    }

    // 0D. Evening Voice Profit Recap by Voice Alone ("សង្ខេបពេលល្ងាច", "evening recap", "profit recap", "ចំណេញពេលល្ងាច")
    if (
      lower.includes('សង្ខេបពេលល្ងាច') ||
      lower.includes('evening recap') ||
      lower.includes('profit recap') ||
      lower.includes('ចំណេញពេលល្ងាច') ||
      lower.includes('សង្ខេបល្ងាច') ||
      lower.includes('សង្ខេបប្រាក់ចំណេញ') ||
      lower.includes('ညနေခင်း အကျဉ်းချုပ်')
    ) {
      const comprehensive = generateComprehensiveEveningRecap(
        entries,
        debtRecords,
        currencyConfig.usdToSecondaryRate || currencyConfig.usdToKhrRate,
        lang
      );
      speakText(comprehensive.spokenRecap, lang, { playChime: true });
      setIsBriefingOpen(true);
      return true;
    }

    // 0E. Voice Command to Share with Friends (Messenger, Telegram & Web)
    if (
      lower.includes('ចែករំលែក') ||
      lower.includes('ផ្ញើទៅមិត្ត') ||
      lower.includes('share app') ||
      lower.includes('share with friends') ||
      lower.includes('messenger') ||
      lower.includes('chia sẻ') ||
      lower.includes('แชร์') ||
      lower.includes('bagikan') ||
      lower.includes('မျှဝေ') ||
      lower.includes('分享') ||
      lower.includes('공유') ||
      lower.includes('partager') ||
      lower.includes('teilen') ||
      lower.includes('compartir') ||
      lower.includes('condividi') ||
      lower.includes('delen') ||
      lower.includes('compartilhar')
    ) {
      setIsShareModalOpen(true);
      const shareVoiceMap: Record<string, string> = {
        km: 'បើកផ្ទាំងចែករំលែកទៅកាន់មិត្តភក្តិ តាមរយៈ Facebook Messenger, Telegram និងកម្មវិធីរុករកដោយមិនបាច់ដំឡើង!',
        en: 'Opening Share menu for Facebook Messenger, Telegram, and any browser with zero installation needed!',
        vi: 'Mở bảng chia sẻ cho Facebook Messenger, Telegram và trình duyệt không cần cài đặt!',
        th: 'เปิดเมนูแชร์สำหรับ Facebook Messenger, Telegram และเบราว์เซอร์แล้วค่ะ!',
        id: 'Membuka menu berbagi untuk Facebook Messenger, Telegram, dan semua peramban!',
        ms: 'Membuka menu perkongsian untuk Facebook Messenger, Telegram dan pelayar!',
        sg: 'Opening Share menu for Facebook Messenger, Telegram, and Web!',
        bn: 'Membuka menu perkongsian untuk Messenger dan Telegram!',
        fil: 'Binubuksan ang Share menu para sa Facebook Messenger, Telegram, at Web!',
        lo: 'ເປີດເມນູແບ່ງປັນສຳລັບ Facebook Messenger, Telegram ແລະ browser ແລ້ວ!',
        my: 'Facebook Messenger, Telegram နှင့် ဘရောက်ဇာများအတွက် မျှဝေရန် မီနူးကို ဖွင့်ပေးပါပြီ။',
        zh: '正在打开分享菜单，可一键发送至 Facebook Messenger、Telegram 或任意浏览器！',
        ko: 'Facebook Messenger, Telegram 및 웹 브라우저용 공유 메뉴를 엽니다!',
        fr: 'Ouverture du menu de partage pour Facebook Messenger, Telegram et navigateur !',
        de: 'Teilen-Menü für Facebook Messenger, Telegram und Browser geöffnet!',
        es: '¡Abriendo el menú para compartir por Facebook Messenger, Telegram y navegadores!',
        it: 'Apertura del menu di condivisione per Facebook Messenger, Telegram e browser!',
        nl: 'Deelmenu geopend voor Facebook Messenger, Telegram en browser!',
        pt: 'Abrindo menu de compartilhamento para Facebook Messenger, Telegram e navegador!',
      };
      speakText(shareVoiceMap[lang] || shareVoiceMap.en, lang, { playChime: true });
      return true;
    }

    // 0F. Voice Command for Graphs & Visual Summary (Day / Week / Month / Specific Item)
    const isDaySummary = 
      lower.includes('summary of my day') || 
      lower.includes('daily summary') || 
      lower.includes('summary today') || 
      lower.includes('day summary') || 
      lower.includes('សង្ខេបថ្ងៃនេះ') || 
      lower.includes('សង្ខេបប្រចាំថ្ងៃ') ||
      lower.includes('tổng kết ngày') ||
      lower.includes('สรุปรายวัน') ||
      lower.includes('ringkasan harian');

    const isMonthSummary = 
      lower.includes('summary of my month') || 
      lower.includes('monthly summary') || 
      lower.includes('summary this month') || 
      lower.includes('month summary') || 
      lower.includes('សង្ខេបខែនេះ') || 
      lower.includes('សង្ខេបប្រចាំខែ') ||
      lower.includes('tổng kết tháng') ||
      lower.includes('สรุปรายเดือน') ||
      lower.includes('ringkasan bulanan');

    const isWeekSummary = 
      lower.includes('summary of my week') || 
      lower.includes('weekly summary') || 
      lower.includes('summary this week') || 
      lower.includes('week summary') || 
      lower.includes('សង្ខេបសប្តាហ៍') || 
      lower.includes('សង្ខេបប្រចាំសប្តាហ៍') ||
      lower.includes('tổng kết tuần') ||
      lower.includes('สรุปรายสัปดาห์') ||
      lower.includes('ringkasan mingguan');

    const isGraphQuery = 
      lower.includes('graph') || 
      lower.includes('chart') || 
      lower.includes('show graph') ||
      lower.includes('show my graph') ||
      lower.includes('ក្រាហ្វ') || 
      lower.includes('biểu đồ') || 
      lower.includes('กราฟ') || 
      lower.includes('grafik') ||
      lower.includes('ဂရပ်') ||
      lower.includes('图表');

    const isGeneralSummary = lower.includes('summary of') || lower.includes('give me a summary');

    if (isDaySummary || isMonthSummary || isWeekSummary || isGraphQuery || isGeneralSummary) {
      let targetTf: SummaryTimeframe = 'week';
      if (isDaySummary) targetTf = 'day';
      else if (isMonthSummary) targetTf = 'month';
      else if (isWeekSummary) targetTf = 'week';

      let itemQuery = '';
      const matchItem = lower.match(/(?:summary of|សង្ខេបពី|សង្ខេប|tổng kết|สรุป)\s+(.+)/);
      if (matchItem && matchItem[1]) {
        const potential = matchItem[1].trim();
        if (!['my day', 'my week', 'my month', 'today', 'this week', 'this month', 'day', 'week', 'month', 'ថ្ងៃនេះ', 'សប្តាហ៍នេះ', 'ខែនេះ'].includes(potential)) {
          itemQuery = potential;
        }
      }

      handleOpenSummaryGraph(targetTf, itemQuery, true);
      return true;
    }

    // 0G. Voice Command for Helpers & Labor Cost ("cost of labor", "labor summary", "helper salary", "ថ្លៃពលកម្ម", "ប្រាក់ខែបុគ្គលិក")
    const isLaborVoiceCmd = 
      lower.includes('labor') || 
      lower.includes('labour') || 
      lower.includes('helper') || 
      lower.includes('helpers') || 
      lower.includes('ថ្លៃពលកម្ម') || 
      lower.includes('បុគ្គលិក') || 
      lower.includes('ជំនួយការ');

    if (isLaborVoiceCmd && (lower.includes('cost') || lower.includes('summary') || lower.includes('report') || lower.includes('check') || lower.includes('show') || lower.includes('សង្ខេប') || lower.includes('របាយការណ៍') || lower.includes('មើល') || lower.includes('ប៉ុន្មាន'))) {
      setIsHelperLaborOpen(true);
      const laborMsg = lang === 'km'
        ? `កំពុងបើកផ្ទាំងគ្រប់គ្រងជំនួយការ និងរបាយការណ៍ថ្លៃពលកម្មប្រចាំខែ។ អ្នកមានជំនួយការ ${helpers.length} នាក់។`
        : `Opening Helper and monthly labor cost dashboard. You have ${helpers.length} active helpers.`;
      speakText(laborMsg, lang, { playChime: true });
      return true;
    }

    // 1. Voice Language Switching commands

    if (lower.includes('ភាសាខ្មែរ') || lower === 'khmer' || lower.includes('speak khmer')) {
      handleSelectLanguageAndCurrency('km');
      speakText('បានប្តូរទៅភាសាខ្មែរជាជោគជ័យ។ សូមស្វាគមន៍មកកាន់ ជំនួយការខ្ញុំ។ តើអ្នកចង់កត់ត្រាអ្វីដែរ?', 'km', { playChime: true });
      return true;
    }
    if (lower === 'english' || lower.includes('speak english') || lower.includes('switch to english')) {
      handleSelectLanguageAndCurrency('en');
      speakText('Switched to English. I am MyDailyPA, your personal assistant. What would you like to record or check today?', 'en', { playChime: true });
      return true;
    }
    if (lower.includes('nederlands') || lower.includes('dutch') || lower.includes('spreek nederlands')) {
      handleSelectLanguageAndCurrency('nl');
      speakText('Overgeschakeld naar het Nederlands. Ik ben MyDailyPA, uw assistent. Wat wilt u vandaag bijhouden?', 'nl', { playChime: true });
      return true;
    }
    if (lower.includes('deutsch') || lower.includes('german') || lower.includes('sprich deutsch')) {
      handleSelectLanguageAndCurrency('de');
      speakText('Auf Deutsch umgestellt. Wie kann ich Ihnen heute helfen?', 'de', { playChime: true });
      return true;
    }
    if (lower.includes('tiếng việt') || lower.includes('vietnamese')) {
      handleSelectLanguageAndCurrency('vi');
      speakText('Đã chuyển sang tiếng Việt. Bạn muốn ghi chép gì hôm nay?', 'vi', { playChime: true });
      return true;
    }
    if (lower.includes('ภาษาไทย') || lower.includes('thai')) {
      handleSelectLanguageAndCurrency('th');
      speakText('เปลี่ยนเป็นภาษาไทยแล้ว คุณต้องการบันทึกอะไรวันนี้?', 'th', { playChime: true });
      return true;
    }
    if (lower.includes('français') || lower.includes('french')) {
      handleSelectLanguageAndCurrency('fr');
      speakText('Passé en français. Que souhaitez-vous enregistrer aujourd\'hui?', 'fr', { playChime: true });
      return true;
    }
    if (lower.includes('español') || lower.includes('spanish')) {
      handleSelectLanguageAndCurrency('es');
      speakText('Cambiado a español. ¿Qué le gustaría registrar hoy?', 'es', { playChime: true });
      return true;
    }
    if (lower.includes('中文') || lower.includes('chinese')) {
      handleSelectLanguageAndCurrency('zh');
      speakText('已切换为中文。今天有什么需要记账或提醒的？', 'zh', { playChime: true });
      return true;
    }

    // 2. Voice Query: Total Expenses Today? ("What is my total expense?", "ចំណាយប៉ុន្មាន?", "uitgaven?", "ausgaben?")
    if (
      lower.includes('ចំណាយប៉ុន្មាន') || 
      lower.includes('អស់ប៉ុន្មាន') || 
      lower.includes('how much did i spend') || 
      lower.includes('total expense') || 
      lower.includes('my expenses') || 
      lower.includes('hoeveel uitgegeven') || 
      lower.includes('wieviel ausgegeben') ||
      lower.includes('chi tiêu hôm nay') ||
      lower.includes('ค่าใช้จ่ายวันนี้')
    ) {
      setSelectedType('expense');
      let msg = '';
      if (lang === 'km') {
        msg = `ថ្ងៃនេះ អ្នកបានចំណាយអស់សរុប ${expLocal.toLocaleString()} ${sym} (ស្មើនឹង ${totalExpUsd.toFixed(2)} ដុល្លារ)។`;
      } else if (lang === 'nl') {
        msg = `Vandaag bedragen uw totale uitgaven ${expLocal.toLocaleString()} ${sym} (ongeveer $${totalExpUsd.toFixed(2)}).`;
      } else if (lang === 'de') {
        msg = `Heute betragen Ihre Gesamtausgaben ${expLocal.toLocaleString()} ${sym} (ca. $${totalExpUsd.toFixed(2)}).`;
      } else if (lang === 'vi') {
        msg = `Tổng chi tiêu hôm nay của bạn là ${expLocal.toLocaleString()} ${sym} (tương đương $${totalExpUsd.toFixed(2)}).`;
      } else if (lang === 'th') {
        msg = `วันนี้คุณมีค่าใช้จ่ายรวม ${expLocal.toLocaleString()} ${sym} (ประมาณ $${totalExpUsd.toFixed(2)})`;
      } else {
        msg = `Today your total expenses are $${totalExpUsd.toFixed(2)} (or ${expLocal.toLocaleString()} ${sym}).`;
      }
      speakText(msg, lang, { playChime: true });
      return true;
    }

    // 3. Voice Query: Total Sales & Income Today? ("How much did I sell?", "ចំណូលប៉ុន្មាន?", "លក់បានប៉ុន្មាន?")
    if (
      lower.includes('លក់បានប៉ុន្មាន') || 
      lower.includes('ចំណូលប៉ុន្មាន') || 
      lower.includes('how much did i sell') || 
      lower.includes('total sales') || 
      lower.includes('total income') || 
      lower.includes('my sales') || 
      lower.includes('hoeveel omzet') || 
      lower.includes('einnahmen heute') ||
      lower.includes('doanh thu hôm nay') ||
      lower.includes('ยอดขายวันนี้')
    ) {
      setSelectedType('income');
      let msg = '';
      if (lang === 'km') {
        msg = `ថ្ងៃនេះ អ្នកលក់បានចំណូលសរុប ${incLocal.toLocaleString()} ${sym} (ស្មើនឹង ${totalIncUsd.toFixed(2)} ដុល្លារ)។`;
      } else if (lang === 'nl') {
        msg = `Vandaag bedraagt uw totale omzet en inkomsten ${incLocal.toLocaleString()} ${sym} (ongeveer $${totalIncUsd.toFixed(2)}).`;
      } else if (lang === 'de') {
        msg = `Heute betragen Ihre Gesamteinnahmen ${incLocal.toLocaleString()} ${sym} (ca. $${totalIncUsd.toFixed(2)}).`;
      } else if (lang === 'vi') {
        msg = `Doanh thu và thu nhập hôm nay của bạn là ${incLocal.toLocaleString()} ${sym} ($${totalIncUsd.toFixed(2)}).`;
      } else if (lang === 'th') {
        msg = `วันนี้คุณมียอดขายและรายรับรวม ${incLocal.toLocaleString()} ${sym} ($${totalIncUsd.toFixed(2)})`;
      } else {
        msg = `Today your total sales and income are $${totalIncUsd.toFixed(2)} (or ${incLocal.toLocaleString()} ${sym}).`;
      }
      speakText(msg, lang, { playChime: true });
      return true;
    }

    // 4. Voice Query: Net Balance Left? ("What is my balance?", "សល់លុយប៉ុន្មាន?", "saldo?")
    if (
      lower.includes('សល់ប៉ុន្មាន') || 
      lower.includes('សល់លុយ') || 
      lower.includes('សមតុល្យ') || 
      lower.includes('balance') || 
      lower.includes('how much money left') || 
      lower.includes('wat is mijn saldo') || 
      lower.includes('guthaben') ||
      lower.includes('số dư') ||
      lower.includes('ยอดคงเหลือ')
    ) {
      let msg = '';
      if (lang === 'km') {
        msg = `សមតុល្យលុយនៅសល់របស់អ្នកគឺ ${netLocal.toLocaleString()} ${sym} (ស្មើនឹង ${netUsd.toFixed(2)} ដុល្លារ)។`;
      } else if (lang === 'nl') {
        msg = `Uw netto kassaldo is ${netLocal.toLocaleString()} ${sym} ($${netUsd.toFixed(2)}).`;
      } else if (lang === 'de') {
        msg = `Ihr aktueller Kassenbestand beträgt ${netLocal.toLocaleString()} ${sym} ($${netUsd.toFixed(2)}).`;
      } else {
        msg = `Your net cash balance is $${netUsd.toFixed(2)} (or ${netLocal.toLocaleString()} ${sym}).`;
      }
      speakText(msg, lang, { playChime: true });
      return true;
    }

    // 5. Voice Query: Meetings, Tasks & Reminders ("What meetings do I have?", "ប្រជុំអ្វីខ្លះ?", "afspraken?")
    if (
      lower.includes('ប្រជុំអ្វីខ្លះ') || 
      lower.includes('មានកិច្ចការអ្វី') || 
      lower.includes('រំលឹកអ្វីខ្លះ') || 
      lower.includes('what are my meetings') || 
      lower.includes('my tasks') || 
      lower.includes('my reminders') || 
      lower.includes('welke afspraken') || 
      lower.includes('welche termine')
    ) {
      setSelectedType('reminder');
      const reminderTasks = entries.filter((e) => e.type === 'reminder' || e.type === 'task');
      if (reminderTasks.length === 0) {
        const noTasksMsg = lang === 'km' 
          ? 'ថ្ងៃនេះ អ្នកមិនទាន់មានការណាត់ជួប ឬកិច្ចការដែលត្រូវធ្វើនៅឡើយទេ'
          : lang === 'nl'
          ? 'U heeft vandaag geen openstaande afspraken of herinneringen'
          : 'You have no scheduled meetings or reminders today';
        speakText(noTasksMsg, lang, { playChime: true });
      } else {
        const taskTitles = reminderTasks.slice(0, 3).map((t, idx) => `${idx + 1}: ${lang === 'km' ? t.titleKhmer : t.titleEnglish}`).join('. ');
        const tasksMsg = lang === 'km'
          ? `អ្នកមានការណាត់ជួប និងកិច្ចការចំនួន ${reminderTasks.length}៖ ${taskTitles}`
          : `You have ${reminderTasks.length} scheduled reminders: ${taskTitles}`;
        speakText(tasksMsg, lang, { playChime: true });
      }
      return true;
    }

    // 6. Navigation Filters
    if (lower.includes('ចំណូល') || lower.includes('income')) {
      setSelectedType('income');
      if (voiceTtsEnabled) speakText(getSpokenVoiceFeedback('show_income', lang), lang);
      return true;
    }
    if (lower.includes('ចំណាយ') || lower.includes('expense')) {
      setSelectedType('expense');
      if (voiceTtsEnabled) speakText(getSpokenVoiceFeedback('show_expense', lang), lang);
      return true;
    }
    if (lower.includes('ប្រជុំ') || lower.includes('meeting') || lower.includes('រំលឹក')) {
      setSelectedType('reminder');
      if (voiceTtsEnabled) speakText(getSpokenVoiceFeedback('open_briefing', lang), lang);
      return true;
    }
    if (lower.includes('របាយការណ៍') || lower.includes('briefing') || lower.includes('សង្ខេប')) {
      setIsBriefingOpen(true);
      if (voiceTtsEnabled) speakText(getSpokenVoiceFeedback('open_briefing', lang), lang);
      return true;
    }
    if (lower.includes('អានសកម្មភាព') || lower.includes('read aloud') || lower.includes('អានទាំងអស់')) {
      // Read top 3 entries aloud
      const topEntries = entries.slice(0, 3);
      if (topEntries.length === 0) {
        speakText('មិនទាន់មានទិន្នន័យកត់ត្រានៅឡើយទេ', lang);
      } else {
        const textToRead = topEntries.map((e, idx) => `${idx + 1}៖ ${lang === 'km' ? e.titleKhmer : e.titleEnglish}`).join('... ');
        speakText(`កំណត់ត្រាចុងក្រោយ៖ ${textToRead}`, lang);
      }
      return true;
    }
    if (lower.includes('មើលទាំងអស់') || lower.includes('show all')) {
      setSelectedType('all');
      setSelectedCategory('all');
      setSearchQuery('');
      if (voiceTtsEnabled) speakText(getSpokenVoiceFeedback('show_all', lang), lang);
      return true;
    }

    return false;
  };

  // Add Voice Entry
  const handleAddEntry = (result: CategorizeResult, rawTranscript: string) => {
    const newEntry: Entry = {
      id: 'entry_' + Date.now(),
      userId: currentProfile.id,
      category: result.category,
      type: result.type,
      titleKhmer: result.titleKhmer,
      titleEnglish: result.titleEnglish,
      amount: result.amount,
      currency: result.currency || 'USD',
      date: new Date().toISOString(),
      reminderTime: result.reminderTime,
      personName: result.personName,
      items: result.items,
      notes: result.notes,
      isCompleted: false,
      rawVoiceTranscript: rawTranscript,
      confidenceScore: result.confidenceScore || 0.98,
      isSynced: true,
      basketBreakdown: result.basketBreakdown,
      isLaborLog: result.isLaborLog,
    };

    // Auto-sync voice labor log to helper labor records
    if (result.isLaborLog) {
      const helperName = result.personName || (helpers[0] ? helpers[0].name : 'Helper');
      const matched = helpers.find(
        (h) => h.name.toLowerCase().includes(helperName.toLowerCase()) || helperName.toLowerCase().includes(h.name.toLowerCase())
      );
      const helperId = matched?.id || (helpers[0]?.id || 'h1');
      const laborRecId = 'labor_' + Date.now();

      newEntry.laborRecordId = laborRecId;

      const newLaborRecord: LaborLogRecord = {
        id: laborRecId,
        helperId,
        helperName: matched?.name || helperName,
        type: result.laborLogType || (result.type === 'expense' ? 'salary' : 'absence'),
        amount: result.amount || 0,
        currency: result.currency || 'USD',
        date: new Date().toISOString().split('T')[0],
        month: new Date().toISOString().slice(0, 7),
        notes: result.notes || rawTranscript,
        recordedViaVoice: true,
        rawVoiceTranscript: rawTranscript,
      };

      setLaborLogs((prev) => [newLaborRecord, ...prev]);
    }

    triggerTelegramHaptic('success');
    setEntries((prev) => [newEntry, ...prev]);

    // Track usage (300 voice recordings / 60 days limit) and sync to Firestore
    incrementVoiceRecordingCount().then((updated) => {
      setTrialStats(updated);
    });
  };

  // Helper & Labor Record Handlers
  const handleAddHelper = (helperData: Omit<HelperStaff, 'id'>) => {
    const newHelper: HelperStaff = {
      ...helperData,
      id: 'h_' + Date.now(),
    };
    setHelpers((prev) => [...prev, newHelper]);
  };

  const handleUpdateHelper = (helperData: HelperStaff) => {
    setHelpers((prev) => prev.map((h) => (h.id === helperData.id ? helperData : h)));
  };

  const handleDeleteHelper = (id: string) => {
    setHelpers((prev) => prev.filter((h) => h.id !== id));
  };

  const handleAddLaborLog = (logData: Omit<LaborLogRecord, 'id'>) => {
    const newId = 'labor_' + Date.now();
    const newLog: LaborLogRecord = {
      ...logData,
      id: newId,
    };
    setLaborLogs((prev) => [newLog, ...prev]);

    // If financial payout (salary, advance, bonus, overtime), synchronize to main business entries as operating expense
    if (['salary', 'advance', 'bonus', 'overtime'].includes(logData.type) && logData.amount > 0) {
      const expenseEntry: Entry = {
        id: 'entry_labor_' + Date.now(),
        userId: currentProfile.id,
        category: 'operating',
        type: 'expense',
        titleKhmer: `${logData.type === 'salary' ? 'បើកប្រាក់ខែ' : 'បុរេប្រទាន'} ${logData.helperName}`,
        titleEnglish: `${logData.type === 'salary' ? 'Salary Payment' : 'Advance'} - ${logData.helperName}`,
        amount: logData.amount,
        currency: logData.currency || 'USD',
        date: new Date().toISOString(),
        personName: logData.helperName,
        notes: logData.notes,
        isCompleted: true,
        isLaborLog: true,
        laborRecordId: newId,
        isSynced: true,
      };
      setEntries((prev) => [expenseEntry, ...prev]);
    }
  };

  const handleDeleteLaborLog = (id: string) => {
    setLaborLogs((prev) => prev.filter((l) => l.id !== id));
    // Also remove matching synchronized entry if any
    setEntries((prev) => prev.filter((e) => e.laborRecordId !== id));
  };

  // Toggle Entry completion
  const handleToggleComplete = (id: string) => {
    triggerTelegramHaptic('selection');
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isCompleted: !e.isCompleted } : e))
    );
  };

  // Delete Entry
  const handleDeleteEntry = (id: string) => {
    triggerTelegramHaptic('warning');
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Add Debt Record
  const handleAddDebtRecord = (rec: Omit<CreditDebtRecord, 'id' | 'createdAt'>) => {
    const newRec: CreditDebtRecord = {
      ...rec,
      id: 'debt_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setDebtRecords((prev) => [newRec, ...prev]);
  };

  // Record Payment for Debt
  const handleRecordPayment = (id: string, paymentAmount: number, syncToIncome: boolean) => {
    setDebtRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const newPaid = r.paidAmount + paymentAmount;
        const newRemaining = Math.max(0, r.totalAmount - newPaid);
        const status = newRemaining === 0 ? 'paid' : 'partial';

        // Add to payment history
        const newHistory = [
          ...(r.paymentHistory || []),
          {
            id: 'pay_' + Date.now(),
            amount: paymentAmount,
            currency: r.currency,
            date: new Date().toISOString(),
            notes: 'បង់តាម DailyPA',
          },
        ];

        // Optionally sync to DailyPA income
        if (syncToIncome) {
          handleAddEntry(
            {
              category: 'msme',
              type: 'income',
              titleKhmer: `ប្រមូលលុយជំពាក់ពី ${r.contactName} (${paymentAmount} ${r.currency})`,
              titleEnglish: `Collected debt payment from ${r.contactName}`,
              amount: paymentAmount,
              currency: r.currency,
            },
            `ប្រមូលលុយជំពាក់ ${paymentAmount} ${r.currency} ពី ${r.contactName}`
          );
        }

        return {
          ...r,
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status,
          paymentHistory: newHistory,
        };
      })
    );
  };

  // Delete Debt Record
  const handleDeleteDebtRecord = (id: string) => {
    setDebtRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Add Contact
  const handleAddContact = (c: Omit<Contact, 'id'>) => {
    const newC: Contact = {
      ...c,
      id: 'contact_' + Date.now(),
    };
    setContacts((prev) => [newC, ...prev]);
  };

  // Delete Contact
  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Reset & Clear data (Clean Slate)
  const handleResetAllData = () => {
    setEntries([]);
    setDebtRecords([]);
    setContacts([]);
    if (typeof window !== 'undefined') {
      INITIAL_PROFILES.forEach((p) => {
        localStorage.removeItem(`dailypa_entries_${p.id}`);
        localStorage.removeItem(`dailypa_debt_${p.id}`);
        localStorage.removeItem(`dailypa_contacts_${p.id}`);
      });
      localStorage.setItem('dailypa_clean_start_v2', 'true');
    }
  };

  const handleLoadSampleData = () => {
    setEntries(SAMPLE_ENTRIES);
    setDebtRecords(INITIAL_CREDIT_DEBT);
  };

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    if (selectedType !== 'all' && e.type !== selectedType) return false;
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchKhmer = e.titleKhmer.toLowerCase().includes(q);
      const matchEnglish = (e.titleEnglish || '').toLowerCase().includes(q);
      const matchPerson = (e.personName || '').toLowerCase().includes(q);
      const matchNotes = (e.notes || '').toLowerCase().includes(q);
      if (!matchKhmer && !matchEnglish && !matchPerson && !matchNotes) return false;
    }
    return true;
  }).sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  // 1. Radically Simplified Pocket Secretary for Non-Reading/Non-Writing Users (Mentor Recommendation)
  if (viewMode === 'simplified') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
        <SimplifiedSecretaryView
          lang={lang}
          onChangeLanguage={handleSelectLanguageAndCurrency}
          currentProfile={currentProfile}
          onSaveProfile={handleSaveProfileDirect}
          entries={entries}
          onAddEntry={handleAddEntry}
          onDeleteEntry={handleDeleteEntry}
          onSwitchToDashboard={() => handleToggleViewMode('dashboard')}
          primaryCurrency={currencyConfig.primaryCurrency}
          trialStats={trialStats}
          onOpenVideoTutorial={() => setIsVideoTutorialOpen(true)}
        />

        {/* Global Modals for Seamless Continuity */}
        <PricingTiersModal
          isOpen={isPricingTiersOpen}
          onClose={() => setIsPricingTiersOpen(false)}
          lang={lang}
          usedRecordsCount={Math.max(entries.length, trialStats.voiceRecordingsCount)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />

        <AuthOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          lang={lang}
          currentUserName={currentProfile.phoneNumber ? currentProfile.name : ''}
          currentUserPhone={currentProfile.phoneNumber || ''}
          onCompleteOnboarding={(name, phone, cat) => {
            handleSaveProfileDirect(name, phone);
            setIsOnboardingOpen(false);
          }}
          onSignOut={() => {
            signOutUser();
            setCurrentProfile(INITIAL_PROFILES[2]);
            setTrialStats(getTrialStats());
          }}
        />

        <FullVideoTutorialModal
          isOpen={isVideoTutorialOpen}
          onClose={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('mydailypa_seen_intro_video_v1', 'true');
            }
            setIsVideoTutorialOpen(false);
          }}
          lang={lang}
        />
      </div>
    );
  }

  // 2. Full Classic MSME Dashboard View (Accessible anytime by tapping Dashboard)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Top Navbar */}
      <TopNavbar
        currentProfile={currentProfile}
        allProfiles={INITIAL_PROFILES}
        onSelectProfile={(p) => setCurrentProfile(p)}
        adminPhoneNumbers={['0887712862']}
        voiceTtsEnabled={voiceTtsEnabled}
        onToggleVoiceTts={() => setVoiceTtsEnabled(!voiceTtsEnabled)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenVoicePLDigest={() => setIsVoicePLDigestOpen(true)}
        onOpenCreditDebtBook={() => setIsCreditDebtOpen(true)}
        onOpenSummaryGraph={(tf) => handleOpenSummaryGraph(tf || 'week', '', false)}
        onOpenHelperLabor={() => setIsHelperLaborOpen(true)}
        onOpenContacts={() => setIsContactsOpen(true)}
        onSwitchToSimplified={() => handleToggleViewMode('simplified')}
        onOpenTrial={() => setIsPricingTiersOpen(true)}
        onOpenAdminHub={() => setIsAdminHubOpen(true)}
        onOpenVoiceTemplates={() => {}}
        onOpenContactInfo={() => {}}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        trialStats={trialStats}
        onOpenVideoTutorial={() => setIsVideoTutorialOpen(true)}
        onOpenInstallGateway={() => setIsInstallGatewayOpen(true)}
        onOpenTwoAppsModal={() => setIsTwoAppsModalOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenCurrencySettings={() => setIsCurrencySettingsOpen(true)}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        isPersonalMayanyMode={appMode === 'personal'}
        isFounderMode={appMode === 'founder'}
        isStandalone={false}
        lang={lang}
        onToggleLang={() => handleSelectLanguageAndCurrency(lang === 'km' ? 'en' : 'km')}
        onSelectLanguage={handleSelectLanguageAndCurrency}
        onQuickSpeak={() => {
          const greetings: Record<string, string> = {
            km: 'ជម្រាបសួរ! សូមស្វាគមន៍មកកាន់ MyDailyPA ជំនួយការខ្ញុំ។ ខ្ញុំជាជំនួយការផ្ទាល់ខ្លួនរបស់អ្នក។ អ្នកអាចកត់ត្រាចំណូល ចំណាយ ជាប្រាក់រៀល ឬជាដុល្លារ។ សូមចុចប៊ូតុងមីក្រូហ្វូនដើម្បីនិយាយ។',
            en: 'Welcome to MyDailyPA, your personal voice assistant. You can record income and expenses in Riels or Dollars. Please tap the microphone to speak.',
            nl: 'Welkom bij MyDailyPA, uw persoonlijke assistent! Welke taal wilt u gebruiken? Tik op de microfoon om het mij te vertellen.',
            de: 'Willkommen bei MyDailyPA, Ihrem persönlichen Assistenten! Welche Sprache möchten Sie verwenden? Bitte tippen Sie auf das Mikrofon.',
            vi: 'Chào mừng bạn đến với MyDailyPA, trợ lý của bạn! Bạn muốn sử dụng ngôn ngữ nào? Hãy chạm vào micrô để nói cho tôi biết.',
            th: 'ยินดีต้อนรับสู่ MyDailyPA ผู้ช่วยส่วนตัวของคุณ! คุณต้องการใช้ภาษาอะไร? โปรดแตะไมโครโฟนเพื่อบอกฉัน',
            fr: 'Bienvenue sur MyDailyPA, votre assistant personnel! Quelle langue souhaitez-vous utiliser? Veuillez appuyer sur le micro pour me le dire.',
            es: '¡Bienvenido a MyDailyPA, su asistente personal! ¿Qué idioma desea usar? Por favor toque el micrófono para decirme.',
            it: 'Benvenuto su MyDailyPA, il tuo assistente personale! Che lingua vuoi usare? Tocca il microfono per dirmelo.',
            pt: 'Bem-vindo ao MyDailyPA, seu assistente pessoal! Qual idioma você deseja usar? Toque no microfone para me dizer.',
            zh: '欢迎使用 MyDailyPA，您的智能个人助手！请问您想使用哪种语言？请点击麦克风告诉我。',
            ko: 'MyDailyPA에 오신 것을 환영합니다! 어떤 언어를 사용하시겠습니까? 마이크를 눌러 말씀해 주세요.',
            id: 'Selamat datang di MyDailyPA, asisten pribadi Anda! Bahasa apa yang ingin Anda gunakan? Silakan ketuk mikrofon untuk memberi tahu saya.',
            ms: 'Selamat datang ke MyDailyPA, pembantu peribadi anda! Bahasa apa yang anda ingin gunakan? Sila ketik mikrofon untuk memberitahu saya.',
            fil: 'Maligayang pagdating sa MyDailyPA, ang iyong voice assistant! Anong wika ang gusto mong gamitin? I-tap ang mikropono upang sabihin sa akin.',
            lo: 'ຍິນດີຕ້ອນຮັບສູ່ MyDailyPA, ຜູ້ຊ່ວຍສ່ວນຕົວຂອງທ່ານ! ທ່ານຕ້ອງການໃຊ້ພາສາຫຍັງ? ກະລຸນາກົດປຸ່ມໄມເພື່ອບອກຂ້ອຍ.',
            my: 'MyDailyPA မှ ကြိုဆိုပါသည်။ ဘယ်ဘာသာစကားကို သုံးချင်ပါသလဲ။ ကျေးဇူးပြု၍ မိုက်ခရိုဖုန်းကို နှိပ်ပြီး ပြောပြပေးပါ။',
            sg: 'Welcome to MyDailyPA! What language do you want to use? Please tap the microphone to tell me.',
            bn: 'Selamat datang ke MyDailyPA! Bahasa apa yang anda ingin gunakan? Sila ketik mikrofon untuk memberitahu saya.',
          };
          speakText(greetings[lang] || greetings.en, lang, { 
            playChime: false,
            englishFallbackText: 'Welcome to MyDailyPA, your personal voice assistant. You can record income and expenses in Riels or Dollars. Please tap the microphone to speak.'
          });
        }}
        onClearAllData={handleResetAllData}
        onLoadSampleData={handleLoadSampleData}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 space-y-5">
        
        {/* Telegram In-App Browser Notice with 1-Tap External Browser Launcher */}
        {!isTgBrowserNoticeDismissed && isTelegramInAppBrowser() && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-indigo-500/10 border border-sky-300 text-sky-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">🚀</span>
              <div className="text-xs">
                <p className="font-black text-sky-900">
                  {lang === 'km' 
                    ? 'កំពុងបើកក្នុង Telegram Browser៖ ប្រើ Voice Mic និងជៀសវាង PDF' 
                    : 'Viewing in Telegram Browser: Optimal Voice & No PDF Prompts'}
                </p>
                <p className="text-[11px] text-slate-600">
                  {lang === 'km'
                    ? 'ចុចប៊ូតុងខាងស្ដាំដើម្បីបើកលើ Chrome/Safari សម្រាប់មុខងារសំឡេង ១០០%'
                    : 'Open in Chrome/Safari for 100% native microphone and voice recording.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => openInExternalBrowser()}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'km' ? 'បើកលើ Chrome / Safari' : 'Open in Browser'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTgBrowserNoticeDismissed(true)}
                className="p-2 rounded-xl bg-white/70 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Hero Voice Capture Session — Positioned at the very top for instant 1-tap voice access */}
        <CaptureBar
          onAddEntry={handleAddEntry}
          voiceTtsEnabled={voiceTtsEnabled}
          lang={lang}
          onToggleLang={(l) => handleSelectLanguageAndCurrency(l || (lang === 'km' ? 'en' : 'km'))}
          currentUserId={currentProfile.id}
          onOpenVideoTutorial={() => setIsVideoTutorialOpen(true)}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          onVoiceCommand={handleVoiceCommand}
          totalEntriesCount={entries.length}
          onOpenPricingTiers={() => setIsPricingTiersOpen(true)}
          onQuickSpeak={() => {
            const greetings: Record<string, string> = {
              km: 'ជម្រាបសួរ! សូមស្វាគមន៍មកកាន់ MyDailyPA។ ខ្ញុំជាលេខាសំឡេងផ្ទាល់ខ្លួនរបស់អ្នក។ អ្នកអាចកត់ត្រាចំណូល ចំណាយ ជាប្រាក់រៀល ឬជាដុល្លារ។ សូមចុចប៊ូតុងមីក្រូហ្វូនដើម្បីនិយាយ។',
              en: 'Welcome to MyDailyPA, your personal voice assistant. You can record income and expenses in Riels or Dollars. Please tap the microphone to speak.',
              nl: 'Welkom bij MyDailyPA, uw persoonlijke assistent! Welke taal wilt u gebruiken? Tik op de microfoon om het mij te vertellen.',
              de: 'Willkommen bei MyDailyPA, Ihrem persönlichen Assistenten! Welche Sprache möchten Sie verwenden? Bitte tippen Sie auf das Mikrofon.',
              vi: 'Chào mừng bạn đến với MyDailyPA, trợ lý của bạn! Bạn muốn sử dụng ngôn ngữ nào? Hãy chạm vào micrô để nói cho tôi biết.',
              th: 'ยินดีต้อนรับสู่ MyDailyPA ผู้ช่วยส่วนตัวของคุณ! คุณต้องการใช้ภาษาอะไร? โปรดแตะไมโครโฟนเพื่อบอกฉัน',
              fr: 'Bienvenue sur MyDailyPA, votre assistant personnel! Quelle langue souhaitez-vous utiliser? Veuillez appuyer sur le micro pour me le dire.',
              es: '¡Bienvenido a MyDailyPA, su asistente personal! ¿Qué idioma desea usar? Por favor toque el micrófono para decirme.',
              it: 'Benvenuto su MyDailyPA, il tuo assistente personale! Che lingua vuoi usare? Tocca il microfono per dirmelo.',
              pt: 'Bem-vindo ao MyDailyPA, seu assistente pessoal! Qual idioma você deseja usar? Toque no microfone para me dizer.',
              zh: '欢迎使用 MyDailyPA，您的智能个人助手！请问您想使用哪种语言？请点击麦克风告诉我。',
              ko: 'MyDailyPA에 오신 것을 환영합니다! 어떤 언어를 사용하시겠습니까? 마이크를 눌러 말씀해 주세요.',
              id: 'Selamat datang di MyDailyPA, asisten pribadi Anda! Bahasa apa yang ingin Anda gunakan? Silakan ketuk mikrofon untuk memberi tahu saya.',
              ms: 'Selamat datang ke MyDailyPA, pembantu peribadi anda! Bahasa apa yang anda ingin gunakan? Sila ketik mikrofon untuk memberitahu saya.',
              fil: 'Maligayang pagdating sa MyDailyPA, ang iyong voice assistant! Anong wika ang gusto mong gamitin? I-tap ang mikropono upang sabihin sa akin.',
              lo: 'ຍິນດີຕ້ອນຮັບສູ່ MyDailyPA, ຜູ້ຊ່ວຍສ່ວນຕົວຂອງທ່ານ! ທ່ານຕ້ອງການໃຊ້ພາສາຫຍັງ? ກະລຸນາກົດປຸ່ມໄມដើម្បីບອກຂ້ອຍ.',
              my: 'MyDailyPA မှ ကြိုဆိုပါသည်။ ဘယ်ဘာသာစကားကို သုံးချင်ပါသလဲ။ ကျေးဇူးပြု၍ မိုက်ခရိုဖုန်းကို နှိပ်ပြီး ပြောပြပေးပါ။',
              sg: 'Welcome to MyDailyPA! What language do you want to use? Please tap the microphone to tell me.',
              bn: 'Selamat datang ke MyDailyPA! Bahasa apa yang anda ingin gunakan? Sila ketik mikrofon untuk memberitahu saya.',
            };
            speakText(greetings[lang] || greetings.en, lang, { playChime: true });
          }}
          defaultCurrency={currencyConfig.primaryCurrency}
          trialStats={trialStats}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />

        {/* Revolut-Style Hero Balance Billboard */}
        <RevolutHero
          entries={entries}
          currentProfile={currentProfile}
          lang={lang}
          selectedTypeFilter={selectedType}
          onSelectTypeFilter={(t) => setSelectedType(t)}
          onOpenVoiceRecord={() => {
            const micBtn = document.getElementById('big-red-mic-button');
            if (micBtn) micBtn.click();
          }}
          onOpenQuickAdd={() => {
            const input = document.getElementById('manual-entry-text-input');
            if (input) input.focus();
          }}
          onOpenBriefing={() => setIsBriefingOpen(true)}
          onOpenVoicePLDigest={() => setIsVoicePLDigestOpen(true)}
          onOpenCreditDebtBook={() => setIsCreditDebtOpen(true)}
          onOpenHelperLabor={() => setIsHelperLaborOpen(true)}
          onOpenAdminHub={() => setIsAdminHubOpen(true)}
          onOpenVideoTutorial={() => setIsVideoTutorialOpen(true)}
          onOpenVoiceTemplates={() => {
            const tplBtn = document.getElementById('voice-templates-dropdown-button');
            if (tplBtn) tplBtn.click();
          }}
          onOpenCurrencySettings={() => setIsCurrencySettingsOpen(true)}
          currencyRate={currencyConfig.usdToKhrRate}
          currencyRateLabel={currencyConfig.sourceLabel}
          secondaryCurrency={currencyConfig.secondaryCurrency}
          secondaryCurrencySymbol={currencyConfig.secondaryCurrencySymbol}
          usdToSecondaryRate={currencyConfig.usdToSecondaryRate}
          isFounderMode={appMode === 'founder'}
          isPersonalMayanyMode={appMode === 'personal'}
          onOpenInstallGateway={() => setIsInstallGatewayOpen(true)}
          onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
          onSelectLanguage={handleSelectLanguageAndCurrency}
        />

        {/* 4-Tier Socio-Economic Filters & Search */}
        <BoxTabs
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => setSelectedCategory(c)}
          selectedType={selectedType}
          onSelectType={(t) => setSelectedType(t)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          lang={lang}
          sortOrder={sortOrder}
          onToggleSortOrder={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          onClearData={handleResetAllData}
          onLoadSamples={handleLoadSampleData}
        />

        {/* Entries Feed */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black text-slate-800 px-1">
            <span>
              {t('recentEntriesTitle', lang)} ({filteredEntries.length})
            </span>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              {sortOrder === 'desc' ? t('sortNewest', lang) : t('sortOldest', lang)}
            </button>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-white border border-slate-200 p-6 space-y-3">
              <div className="text-4xl">🎙️</div>
              <h4 className="text-sm sm:text-base font-black text-slate-800">
                {t('cleanSlateTitle', lang)}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('cleanSlateDesc', lang)}
              </p>
              <button
                onClick={handleLoadSampleData}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                {t('loadSampleData', lang)}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  lang={lang}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteEntry}
                  currencyRate={currencyConfig.usdToKhrRate}
                  secondaryCurrencySymbol={currencyConfig.secondaryCurrencySymbol}
                  usdToSecondaryRate={currencyConfig.usdToSecondaryRate}
                />
              ))}
            </div>
          )}
        </section>

        {/* Official Contact Card (Luxury Dark Card) */}
        <OfficialContactCard lang={lang} />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-bold flex-wrap">
          <span>MyDailyPA</span>
          <span>•</span>
          <span className="font-mono text-rose-600">mydailypa.com</span>
          <span>•</span>
          <span>{t('footerPersonalAi', lang)}</span>
          <span>•</span>
          <span className="text-emerald-700">{t('footerVoiceEntry', lang)}</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-lg mx-auto">
          {t('privacySiloFooterBadge', lang)}
        </p>
      </footer>

      {/* All Companion Modals */}
      <DailyVoicePLDigestModal
        isOpen={isVoicePLDigestOpen}
        onClose={() => setIsVoicePLDigestOpen(false)}
        entries={entries}
        currencyRate={currencyConfig.usdToKhrRate}
        lang={lang}
      />

      <CustomerCreditDebtModal
        isOpen={isCreditDebtOpen}
        onClose={() => setIsCreditDebtOpen(false)}
        debtRecords={debtRecords}
        onAddDebtRecord={handleAddDebtRecord}
        onRecordPayment={handleRecordPayment}
        onDeleteDebtRecord={handleDeleteDebtRecord}
        currencyRate={currencyConfig.usdToKhrRate}
        lang={lang}
      />

      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLang={lang}
        onSelectLang={(l) => handleSelectLanguageAndCurrency(l)}
      />

      <CurrencySettingsModal
        isOpen={isCurrencySettingsOpen}
        onClose={() => setIsCurrencySettingsOpen(false)}
        currencyConfig={currencyConfig}
        onUpdateConfig={(cfg) => setCurrencyConfig(cfg)}
        lang={lang}
      />

      <AuthOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleteOnboarding={(name, phone, cat) => {
          setCurrentProfile((prev) => ({
            ...prev,
            name,
            phoneNumber: phone,
            businessCategory: cat,
          }));
          setTrialStats(getTrialStats());
        }}
        onSignOut={() => {
          signOutUser();
          setCurrentProfile(INITIAL_PROFILES[2]);
          setTrialStats(getTrialStats());
        }}
        currentUserName={currentProfile.phoneNumber ? currentProfile.name : ''}
        currentUserPhone={currentProfile.phoneNumber || ''}
        lang={lang}
      />

      <InstallHomeScreenGateway
        isOpen={isInstallGatewayOpen}
        onClose={() => setIsInstallGatewayOpen(false)}
        lang={lang}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
      />

      <TelegramMiniAppModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        lang={lang}
      />

      <AdminHubModal
        isOpen={isAdminHubOpen}
        onClose={() => setIsAdminHubOpen(false)}
        entries={entries}
        currentProfile={currentProfile}
        onResetAllData={handleResetAllData}
        onLoadSampleData={handleLoadSampleData}
        lang={lang}
        onOpenLeanCanvas={() => setIsLeanCanvasOpen(true)}
      />

      <LeanCanvasModal
        isOpen={isLeanCanvasOpen}
        onClose={() => setIsLeanCanvasOpen(false)}
        lang={lang}
      />

      <BriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        entries={entries}
        debts={debtRecords}
        currencyRate={currencyConfig.usdToSecondaryRate || currencyConfig.usdToKhrRate}
        lang={lang}
        schedule={scheduleConfig}
        onUpdateSchedule={handleUpdateSchedule}
        onAddEntry={handleAddEntry}
      />


      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        contacts={contacts}
        onAddContact={handleAddContact}
        onDeleteContact={handleDeleteContact}
        lang={lang}
      />

      <FullVideoTutorialModal
        isOpen={isVideoTutorialOpen}
        onClose={() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('mydailypa_seen_intro_video_v1', 'true');
          }
          setIsVideoTutorialOpen(false);
        }}
        lang={lang}
      />

      <TwoAppsInstallModal
        isOpen={isTwoAppsModalOpen}
        onClose={() => setIsTwoAppsModalOpen(false)}
        lang={lang}
      />

      <PricingTiersModal
        isOpen={isPricingTiersOpen}
        onClose={() => setIsPricingTiersOpen(false)}
        lang={lang}
        usedRecordsCount={Math.max(entries.length, trialStats.voiceRecordingsCount)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        lang={lang}
      />

      <HelperLaborModal
        isOpen={isHelperLaborOpen}
        onClose={() => setIsHelperLaborOpen(false)}
        helpers={helpers}
        laborLogs={laborLogs}
        onAddHelper={handleAddHelper}
        onUpdateHelper={handleUpdateHelper}
        onDeleteHelper={handleDeleteHelper}
        onAddLaborLog={handleAddLaborLog}
        onDeleteLaborLog={handleDeleteLaborLog}
        currencyConfig={currencyConfig}
        lang={lang}
      />

      <SummaryGraphModal
        isOpen={isSummaryGraphOpen}
        onClose={() => setIsSummaryGraphOpen(false)}
        entries={entries}
        currencyConfig={currencyConfig}
        lang={lang}
        initialTimeframe={summaryTimeframe}
        initialSearchQuery={summarySearchQuery}
        autoSpeakOnOpen={summaryAutoSpeak}
      />

    </div>
  );
};
