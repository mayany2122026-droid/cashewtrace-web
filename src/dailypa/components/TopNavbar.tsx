import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Sparkles, BookOpen, Users, 
  HelpCircle, Smartphone, Globe, ChevronDown, Check,
  CreditCard, PieChart, BarChart3, ShieldCheck, Film, ExternalLink,
  ArrowLeftRight, RefreshCw, LogIn, Settings, Mic,
  Menu, X, Share2, Copy, Send, User, Play
} from 'lucide-react';
import { UserProfile, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES_INFO, t } from '../utils/i18n';
import { isRunningInTelegram } from '../utils/telegram';
import { TrialStats } from '../utils/trialTracker';

interface TopNavbarProps {
  currentProfile: UserProfile;
  allProfiles: UserProfile[];
  onSelectProfile: (p: UserProfile) => void;
  adminPhoneNumbers: string[];
  voiceTtsEnabled: boolean;
  onToggleVoiceTts: () => void;
  onOpenBriefing: () => void;
  onOpenVoicePLDigest: () => void;
  onOpenCreditDebtBook: () => void;
  onOpenSummaryGraph?: (timeframe?: 'day' | 'week' | 'month' | 'all') => void;
  onOpenHelperLabor?: () => void;
  onOpenContacts: () => void;
  onOpenTrial: () => void;
  onOpenAdminHub: () => void;
  onOpenVoiceTemplates: () => void;
  onOpenContactInfo: () => void;
  onOpenOnboarding: () => void;
  trialStats?: TrialStats;
  onOpenVideoTutorial: () => void;
  onOpenInstallGateway: () => void;
  onOpenTwoAppsModal: () => void;
  onOpenLanguageModal: () => void;
  onOpenCurrencySettings: () => void;
  onOpenTelegramModal?: () => void;
  onOpenShareModal?: () => void;
  onSwitchToSimplified?: () => void;
  isPersonalMayanyMode: boolean;
  isFounderMode: boolean;
  isStandalone: boolean;
  lang: SupportedLanguage;
  onToggleLang: () => void;
  onSelectLanguage: (l: SupportedLanguage) => void;
  onQuickSpeak: () => void;
  onClearAllData: () => void;
  onLoadSampleData: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentProfile,
  allProfiles,
  onSelectProfile,
  voiceTtsEnabled,
  onToggleVoiceTts,
  onOpenBriefing,
  onOpenVoicePLDigest,
  onOpenCreditDebtBook,
  onOpenSummaryGraph,
  onOpenHelperLabor,
  onOpenContacts,
  onOpenTrial,
  onOpenAdminHub,
  onOpenVideoTutorial,
  onOpenVoiceTemplates,
  onOpenInstallGateway,
  onOpenTwoAppsModal,
  onOpenLanguageModal,
  onOpenCurrencySettings,
  onOpenTelegramModal,
  onOpenShareModal,
  onOpenOnboarding,
  trialStats,
  onSwitchToSimplified,
  isPersonalMayanyMode,
  isFounderMode,
  isStandalone,
  lang,
  onSelectLanguage,
  onQuickSpeak,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const inTelegram = isRunningInTelegram();

  const activeLangInfo = SUPPORTED_LANGUAGES_INFO.find((l) => l.code === lang) || SUPPORTED_LANGUAGES_INFO[0];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}${window.location.pathname}?app=dailypa`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const triggerVoiceRecord = () => {
    const micBtn = document.getElementById('big-red-mic-button');
    if (micBtn) micBtn.click();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 flex-wrap">
        
        {/* Left: Brand Identity + Voice Assistant Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 select-none">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-sm">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-none">
                  MyDailyPA
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>{lang === 'km' ? 'ជំនួយការខ្ញុំ' : t('voiceAssistantStatus', lang)}</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-rose-600 leading-none mt-0.5">
                {lang === 'km' ? 'ជំនួយការខ្ញុំ' : t('brandSubtitle', lang)}
              </p>
            </div>
          </div>
        </div>

        {/* Center/Desktop Quick Actions Navbar (Screenshot 3 layout) */}
        <div className="hidden lg:flex items-center gap-1.5">
          {/* Settings button */}
          <button
            onClick={onOpenCurrencySettings}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('navSettings', lang)}</span>
          </button>

          {/* Member / Admin Profile button */}
          <button
            onClick={onOpenAdminHub}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title={currentProfile.role === 'founder' ? 'Founder Admin & Hub' : 'User Account & Data Vault'}
          >
            <span>{currentProfile.avatar || (currentProfile.role === 'founder' ? '👑' : '👤')}</span>
            <span className="max-w-32 truncate">{currentProfile.name}</span>
            {currentProfile.phoneNumber && (
              <span className="text-[11px] text-slate-500 font-mono">({currentProfile.phoneNumber})</span>
            )}
          </button>

          {/* Big Red Record Voice Button in Navbar */}
          <button
            onClick={triggerVoiceRecord}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>🔴 {t('navRecordVoice', lang)}</span>
          </button>

          {/* Navigation Pills */}
          {onOpenSummaryGraph && (
            <button
              id="top-nav-summary-graph-btn"
              onClick={() => onOpenSummaryGraph('week')}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Visual Summary & Graph (Day, Week, Month with Spoken Voice Narration)"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'km' ? 'ក្រាហ្វ & សង្ខេប' : 'Graphs & Summary'}</span>
            </button>
          )}

          <button
            onClick={onOpenVoicePLDigest}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>📈</span>
            <span>{t('navVoicePL', lang)}</span>
          </button>

          <button
            onClick={onOpenCreditDebtBook}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>📖</span>
            <span>{t('navDebtBook', lang)}</span>
          </button>

          {/* Helper & Labor Cost Manager */}
          {onOpenHelperLabor && (
            <button
              id="top-nav-helper-labor-btn"
              onClick={onOpenHelperLabor}
              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Helper & Labor Manager (Salary, Advances, Absences)"
            >
              <span>👥</span>
              <span>{lang === 'km' ? 'ពលកម្ម' : 'Helpers'}</span>
            </button>
          )}

          <button
            onClick={onOpenBriefing}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>📊</span>
            <span>{t('navBriefing', lang)}</span>
          </button>

          <button
            onClick={onOpenVoiceTemplates}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>✨</span>
            <span>{t('navTemplates', lang)}</span>
          </button>

          {/* Pricing Tiers & Free Trial Bank button */}
          <button
            onClick={onOpenTrial}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
            title="Pricing Tiers ($1 - $5/month) & Free Trial"
          >
            <span>💎</span>
            <span>{lang === 'km' ? 'តម្លៃ 1$-5$' : 'Tiers ($1-$5)'}</span>
            {trialStats && (
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white border border-amber-300 text-[10px] font-mono font-bold text-amber-950">
                {trialStats.recordsRemaining}/300
              </span>
            )}
          </button>
        </div>

        {/* Right Controls: Prominent Language Dropdown + Audio Toggle + Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Prominent Video Guide Button (First to Watch) */}
          {onOpenVideoTutorial && (
            <button
              id="top-nav-video-tutorial-btn"
              type="button"
              onClick={onOpenVideoTutorial}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95 transition-all hover:scale-105 ring-2 ring-indigo-400/40"
              title={lang === 'km' ? 'វីដេអូណែនាំ៖ តើ MyDailyPA ជាអ្វី និងដោះស្រាយបញ្ហាអ្វី?' : 'Video Guide: What is MyDailyPA & How to use it'}
            >
              <Play className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
              <span className="whitespace-nowrap">{lang === 'km' ? '🎬 វីដេអូណែនាំ' : '🎬 Video Guide'}</span>
            </button>
          )}

          {/* Switch to Simplified Secretary Mode */}
          {onSwitchToSimplified && (
            <button
              type="button"
              onClick={onSwitchToSimplified}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white text-xs font-black shadow-xs cursor-pointer active:scale-98 transition-all"
              title={lang === 'km' ? 'ប្តូរទៅរបៀបលេខាសំឡេងសាមញ្ញ' : 'Switch to Simplified Voice Secretary'}
            >
              <span>🎙️</span>
              <span className="hidden md:inline">{lang === 'km' ? 'របៀបសំឡេងសាមញ្ញ' : 'Voice Mode'}</span>
            </button>
          )}

          {/* Sign In with Name & Phone Button / Connected Profile Badge */}
          {currentProfile.phoneNumber && currentProfile.phoneNumber.trim().length > 0 ? (
            <button
              id="top-nav-account-profile-btn"
              type="button"
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title={lang === 'km' ? 'មើលគណនី & កូតា ៣០០ ដង' : 'View Account & Trial Usage'}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[90px] sm:max-w-[120px] font-black">{currentProfile.name}</span>
              <span className="text-[10.5px] font-mono text-slate-500 hidden xl:inline">({currentProfile.phoneNumber})</span>
            </button>
          ) : (
            <button
              id="top-nav-sign-in-btn"
              type="button"
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white shadow-xs text-xs font-black transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Sign In with Name & Phone Number"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>{lang === 'km' ? 'ចូលគណនី' : 'Sign In'}</span>
            </button>
          )}
          
          {/* Quick Share to Messenger, Telegram & Web */}
          <button
            id="top-navbar-share-btn"
            type="button"
            onClick={onOpenShareModal || handleCopyLink}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-xs text-xs font-bold transition-all cursor-pointer"
            title="Share via Facebook Messenger, Telegram & Web"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline">
              {lang === 'km' ? 'ចែករំលែក' : lang === 'vi' ? 'Chia sẻ' : lang === 'th' ? 'แชร์' : lang === 'id' ? 'Bagikan' : lang === 'my' ? 'မျှဝေပါ' : lang === 'zh' ? '分享' : 'Share'}
            </span>
          </button>

          {/* Telegram Mini App Quick Action / Status */}
          {inTelegram ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <Send className="w-3.5 h-3.5 text-emerald-600 fill-current -rotate-12" />
              <span>TMA</span>
            </span>
          ) : (
            onOpenTelegramModal && (
              <button
                type="button"
                onClick={onOpenTelegramModal}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
                title="Telegram Mini App (Zero Install for iOS & Android)"
              >
                <Send className="w-3.5 h-3.5 fill-current -rotate-12" />
                <span className="hidden xl:inline">Telegram App</span>
              </button>
            )
          )}

          {/* PROMINENT LANGUAGE DROPDOWN BOX */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-400 text-slate-800 shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider leading-none">
                  {t('navLanguage', lang)}
                </span>
                <span className="text-xs sm:text-sm font-bold flex items-center gap-1 mt-0.5">
                  <span className="leading-none">{activeLangInfo.flag}</span>
                  <span className="inline">{activeLangInfo.nativeName}</span>
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold ml-0.5">
                    {activeLangInfo.defaultCurrencySymbol} {activeLangInfo.defaultCurrency}
                  </span>
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-indigo-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown Menu */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-700 uppercase">
                    {t('selectLanguageTitle', lang)}
                  </span>
                  <button
                    onClick={() => {
                      setLangDropdownOpen(false);
                      onOpenLanguageModal();
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    {t('viewAll', lang)}
                  </button>
                </div>

                <div className="py-1 space-y-0.5 max-h-80 overflow-y-auto">
                  {SUPPORTED_LANGUAGES_INFO.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        onSelectLanguage(item.code as SupportedLanguage);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        lang === item.code ? 'bg-indigo-50 text-indigo-900 font-black' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{item.flag}</span>
                        <span className="truncate">{item.nativeName}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-normal">
                          ({item.defaultCurrencySymbol} {item.defaultCurrency})
                        </span>
                      </span>
                      {lang === item.code && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 mt-1 border-t border-slate-100 flex gap-1">
                  <button
                    onClick={() => {
                      setLangDropdownOpen(false);
                      onOpenLanguageModal();
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold text-center cursor-pointer"
                  >
                    🌏 {SUPPORTED_LANGUAGES_INFO.length} Languages & Currencies
                  </button>
                  <button
                    onClick={() => {
                      setLangDropdownOpen(false);
                      onOpenCurrencySettings();
                    }}
                    className="py-1.5 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold text-center cursor-pointer"
                  >
                    {t('exchangeRateBtn', lang)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Voice Greeting & Language Choice Prompt Button */}
          <button
            onClick={onQuickSpeak}
            className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
            title={lang === 'km' ? 'ស្តាប់សេចក្តីស្វាគមន៍ & ជ្រើសរើសភាសា' : 'Listen: Welcome & Choose Language'}
          >
            <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />
          </button>

          {/* Voice Audio Speaker Toggle (Silent vs Spoken Mode) */}
          <button
            onClick={onToggleVoiceTts}
            className={`p-2 rounded-2xl border transition-all cursor-pointer ${
              voiceTtsEnabled 
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 shadow-2xs' 
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
            title={voiceTtsEnabled ? t('muteSpeech', lang) : t('enableSpeech', lang)}
          >
            {voiceTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
            title={t('navMenu', lang)}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu when open */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          
          {/* Mobile Profile & Sign In Card */}
          {currentProfile.phoneNumber && currentProfile.phoneNumber.trim().length > 0 ? (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black">
                  👤
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 leading-tight">{currentProfile.name}</p>
                  <p className="text-[10.5px] font-mono text-slate-500">{currentProfile.phoneNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOnboarding();
                }}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
              >
                {lang === 'km' ? 'គណនី & កូតា' : 'Account'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOnboarding();
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
            >
              <User className="w-4 h-4 text-white" />
              <span>{lang === 'km' ? 'ចូលគណនី (ឈ្មោះ & លេខទូរស័ព្ទ) • កូតា ៣០០ ដង' : 'Sign In (Name & Phone) • 300 Records'}</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                triggerVoiceRecord();
              }}
              className="py-2 px-3 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🔴</span>
              <span>{t('navRecordVoice', lang)}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBriefing();
              }}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📊</span>
              <span>{t('navBriefing', lang)}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVoicePLDigest();
              }}
              className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📈</span>
              <span>{t('navVoicePL', lang)}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreditDebtBook();
              }}
              className="py-2 px-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📖</span>
              <span>{t('navDebtBook', lang)}</span>
            </button>
          </div>

          {/* Graphs & Visual Summary Action in Mobile Menu */}
          {onOpenSummaryGraph && (
            <button
              id="mobile-nav-summary-graph-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSummaryGraph('week');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'km' ? 'ក្រាហ្វវិភាគ & សង្ខេបសំឡេង (Day/Week/Month)' : 'Graphs & Voice Summary (Day/Week/Month)'}</span>
            </button>
          )}

          {/* Helper & Labor Manager in Mobile Menu */}
          {onOpenHelperLabor && (
            <button
              id="mobile-nav-helper-labor-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHelperLabor();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
            >
              <Users className="w-4 h-4 text-amber-700" />
              <span>{lang === 'km' ? 'គ្រប់គ្រងបុគ្គលិក & ថ្លៃពលកម្ម (Helper & Labor)' : 'Helper & Labor Cost Manager'}</span>
            </button>
          )}

          {/* Pricing Tiers Action in Mobile Menu */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrial();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
          >
            <span>💎</span>
            <span>{lang === 'km' ? 'តារាងតម្លៃ 1$-5$/ខែ (សាកល្បង 300 ដង ឬ 60 ថ្ងៃ)' : 'Pricing Tiers ($1-$5/mo) (300 Records or 60 Days Free)'}</span>
          </button>

          {/* Share with Friends in Mobile Menu */}
          <button
            id="mobile-nav-share-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenShareModal) onOpenShareModal();
              else handleCopyLink();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'km' ? 'ចែករំលែកទៅកាន់មិត្តភក្តិ (Messenger, Telegram & Web)' : 'Share with Friends (Messenger, Telegram & Web)'}</span>
          </button>

          {/* Telegram Mini App Action in Mobile Menu */}
          {onOpenTelegramModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTelegramModal();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-current -rotate-12" />
              <span>Telegram Mini App (Zero Install)</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCurrencySettings();
              }}
              className="flex items-center gap-1 text-indigo-700"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t('navSettings', lang)} ({t('exchangeRateBtn', lang)})</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-sky-700"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
