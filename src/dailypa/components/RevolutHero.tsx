import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, Sparkles, BookOpen, 
  ArrowRight, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft,
  Volume2, ShieldCheck, Video, HelpCircle, RefreshCw, Play,
  Smartphone, Share2, Copy, Check, Send, Users
} from 'lucide-react';
import { Entry, UserProfile, SupportedLanguage, EntryType } from '../types';
import { t, SUPPORTED_LANGUAGES_INFO } from '../utils/i18n';
import { isRunningInTelegram } from '../utils/telegram';

interface RevolutHeroProps {
  entries: Entry[];
  currentProfile: UserProfile;
  lang: SupportedLanguage;
  selectedTypeFilter: EntryType | 'all';
  onSelectTypeFilter: (type: EntryType | 'all') => void;
  onOpenVoiceRecord: () => void;
  onOpenQuickAdd: () => void;
  onOpenBriefing: () => void;
  onOpenVoicePLDigest: () => void;
  onOpenCreditDebtBook: () => void;
  onOpenHelperLabor?: () => void;
  onOpenAdminHub: () => void;
  onOpenVideoTutorial: () => void;
  onOpenVoiceTemplates: () => void;
  onOpenCurrencySettings: () => void;
  onOpenInstallGateway?: () => void;
  onOpenTelegramModal?: () => void;
  onSelectLanguage?: (l: SupportedLanguage) => void;
  currencyRate: number;
  currencyRateLabel: string;
  secondaryCurrency: string;
  secondaryCurrencySymbol: string;
  usdToSecondaryRate: number;
  isFounderMode: boolean;
  isPersonalMayanyMode: boolean;
}

export const RevolutHero: React.FC<RevolutHeroProps> = ({
  entries,
  currentProfile,
  lang,
  selectedTypeFilter,
  onSelectTypeFilter,
  onOpenVoiceRecord,
  onOpenQuickAdd,
  onOpenBriefing,
  onOpenVoicePLDigest,
  onOpenCreditDebtBook,
  onOpenHelperLabor,
  onOpenAdminHub,
  onOpenVideoTutorial,
  onOpenVoiceTemplates,
  onOpenCurrencySettings,
  onOpenInstallGateway,
  onOpenTelegramModal,
  onSelectLanguage,
  currencyRate,
  currencyRateLabel,
  secondaryCurrency,
  secondaryCurrencySymbol,
  usdToSecondaryRate,
}) => {
  const [activeCurrencyToggle, setActiveCurrencyToggle] = useState<'local' | 'usd'>('local');
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculate financial totals
  let totalIncomeUsd = 0;
  let totalExpenseUsd = 0;
  let totalTasks = 0;

  entries.forEach((e) => {
    const amt = e.amount || 0;
    const isKhr = e.currency === 'KHR';
    const valUsd = isKhr ? amt / currencyRate : amt;

    if (e.type === 'income') {
      totalIncomeUsd += valUsd;
    } else if (e.type === 'expense') {
      totalExpenseUsd += valUsd;
    } else if (e.type === 'reminder' || e.type === 'task') {
      totalTasks++;
    }
  });

  const netBalanceUsd = totalIncomeUsd - totalExpenseUsd;
  const netBalanceLocal = netBalanceUsd * usdToSecondaryRate;

  const totalIncomeLocal = totalIncomeUsd * usdToSecondaryRate;
  const totalExpenseLocal = totalExpenseUsd * usdToSecondaryRate;

  const formatFraction = (curr: string) => (curr === 'KHR' || curr === 'VND' ? 0 : 2);

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}${window.location.pathname}?app=dailypa`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* The Master Voice Financial Vault Box (Exact design matching screenshot) */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6 transition-all">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t('financialVaultBadge', lang)}</span>
          </div>

          {/* Right: Exchange Rate pill & Currency toggle pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCurrencySettings}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-mono text-slate-700 transition-all cursor-pointer"
              title="Click to adjust exchange rate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span>1$ = {usdToSecondaryRate.toLocaleString()} {secondaryCurrencySymbol}</span>
            </button>

            {/* Currency selector pills */}
            <div className="flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold font-mono">
              <button
                type="button"
                onClick={() => setActiveCurrencyToggle('local')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  activeCurrencyToggle === 'local'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {secondaryCurrencySymbol} {secondaryCurrency}
              </button>
              <button
                type="button"
                onClick={() => setActiveCurrencyToggle('usd')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  activeCurrencyToggle === 'usd'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>

        {/* Center: NET CASH BALANCE Title & Amounts */}
        <div className="text-center space-y-1.5 py-1">
          <p className="text-xs sm:text-sm font-black tracking-wider text-slate-500 uppercase">
            {t('netCashBalanceTitle', lang)}
          </p>
          
          <div className="flex items-baseline justify-center gap-2 flex-wrap">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-mono tracking-tight">
              {activeCurrencyToggle === 'local'
                ? `${netBalanceLocal.toLocaleString(undefined, { maximumFractionDigits: formatFraction(secondaryCurrency) })} ${secondaryCurrencySymbol}`
                : `$${netBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
            </span>
            <span className="text-lg sm:text-2xl font-bold text-slate-400 font-mono">
              {activeCurrencyToggle === 'local'
                ? `($${netBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                : `(${netBalanceLocal.toLocaleString(undefined, { maximumFractionDigits: formatFraction(secondaryCurrency) })} ${secondaryCurrencySymbol})`
              }
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            ≈ 1$ = {usdToSecondaryRate.toLocaleString()} {secondaryCurrencySymbol} ({secondaryCurrency})
          </p>
        </div>

        {/* 3 Metric Pills Row: Income, Expense, Tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Income */}
          <button
            type="button"
            onClick={() => onSelectTypeFilter(selectedTypeFilter === 'income' ? 'all' : 'income')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedTypeFilter === 'income'
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
            }`}
          >
            <div className="text-xs font-bold text-emerald-700 flex items-center justify-between">
              <span>↗ {t('metricIncome', lang)}:</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">+ IN</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono mt-1">
              {totalIncomeLocal.toLocaleString(undefined, { maximumFractionDigits: formatFraction(secondaryCurrency) })} {secondaryCurrencySymbol}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              (${totalIncomeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </div>
          </button>

          {/* Expense */}
          <button
            type="button"
            onClick={() => onSelectTypeFilter(selectedTypeFilter === 'expense' ? 'all' : 'expense')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedTypeFilter === 'expense'
                ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
                : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
            }`}
          >
            <div className="text-xs font-bold text-rose-700 flex items-center justify-between">
              <span>↘ {t('metricExpense', lang)}:</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-mono">- OUT</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono mt-1">
              {totalExpenseLocal.toLocaleString(undefined, { maximumFractionDigits: formatFraction(secondaryCurrency) })} {secondaryCurrencySymbol}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              (${totalExpenseUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </div>
          </button>

          {/* Tasks */}
          <button
            type="button"
            onClick={() => onSelectTypeFilter(selectedTypeFilter === 'task' || selectedTypeFilter === 'reminder' ? 'all' : 'task')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedTypeFilter === 'task' || selectedTypeFilter === 'reminder'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
            }`}
          >
            <div className="text-xs font-bold text-amber-800 flex items-center justify-between">
              <span>📅 {t('metricTasks', lang)}:</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono">TODO</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono mt-1">
              {totalTasks}
            </div>
            <div className="text-xs text-slate-500">
              {lang === 'th' 
                ? 'รายการนัดหมาย & สิ่งที่ต้องทำ' 
                : lang === 'vi' 
                ? 'Lịch hẹn & Việc cần làm' 
                : lang === 'km' 
                ? 'ប្រជុំ & រំលឹកថ្នាំ' 
                : lang === 'nl'
                ? 'Afspraken & herinneringen'
                : lang === 'de'
                ? 'Termine & Erinnerungen'
                : 'Meetings & reminders'}
            </div>
          </button>
        </div>

        {/* 3 High-Value MSME Feature Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Green Card: Daily Voice P&L Digest (1-Tap) */}
          <button
            type="button"
            onClick={onOpenVoicePLDigest}
            className="p-3.5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-all group flex items-center justify-between gap-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-emerald-950 truncate">
                  {t('digestCardTitle', lang)}
                </h4>
                <p className="text-[11px] text-emerald-800/90 line-clamp-1 leading-tight">
                  {t('digestCardDesc', lang)}
                </p>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 shrink-0">
              {t('badgeAudio', lang)}
            </span>
          </button>

          {/* Orange/Amber Card: Customer Debt & Credit Book */}
          <button
            type="button"
            onClick={onOpenCreditDebtBook}
            className="p-3.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-left transition-all group flex items-center justify-between gap-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-amber-950 truncate">
                  {t('debtCardTitle', lang)}
                </h4>
                <p className="text-[11px] text-amber-800/90 line-clamp-1 leading-tight">
                  {t('debtCardDesc', lang)}
                </p>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 shrink-0">
              {t('badgeLedger', lang)}
            </span>
          </button>

          {/* Indigo/Violet Card: MSME Helper & Labor Cost Tracker */}
          {onOpenHelperLabor && (
            <button
              id="hero-helper-labor-card-btn"
              type="button"
              onClick={onOpenHelperLabor}
              className="p-3.5 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200 text-left transition-all group flex items-center justify-between gap-2.5 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-indigo-950 truncate">
                    {lang === 'km' ? 'ជំនួយការ & ពលកម្ម' : 'Helpers & Labor'}
                  </h4>
                  <p className="text-[11px] text-indigo-800/90 line-clamp-1 leading-tight">
                    {lang === 'km' ? 'ប្រាក់ខែ, បុរេប្រទាន & ឈប់' : 'Salaries, advances & logs'}
                  </p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-200 text-indigo-900 shrink-0">
                MSME
              </span>
            </button>
          )}

        </div>

        {/* 3 Action Buttons Row: Record Voice, Quick Add, Summary Report */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* 1. Record Voice (Primary Black Button) */}
          <button
            type="button"
            onClick={onOpenVoiceRecord}
            className="py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-sm font-black flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <span className="text-base">🎙️</span>
            <span>{t('btnRecord', lang)}</span>
          </button>

          {/* 2. Quick Add (White Button) */}
          <button
            type="button"
            onClick={onOpenQuickAdd}
            className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-black flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer"
          >
            <span>{t('btnQuickAdd', lang)}</span>
          </button>

          {/* 3. Summary Report (White Button) */}
          <button
            type="button"
            onClick={onOpenBriefing}
            className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-black flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer"
          >
            <span className="text-base">📊</span>
            <span>{t('btnReport', lang)}</span>
          </button>
        </div>

        {/* 3 Quick Links Row under buttons */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap pt-1 text-xs font-bold text-slate-600 border-t border-slate-100">
          <button
            type="button"
            onClick={onOpenVoicePLDigest}
            className="hover:text-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('linkAudioSummary', lang)}</span>
          </button>

          <button
            type="button"
            onClick={onOpenVideoTutorial}
            className="hover:text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-rose-600" />
            <span>{t('linkVideoGuide', lang)}</span>
          </button>

          <button
            type="button"
            onClick={onOpenVoiceTemplates}
            className="hover:text-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('linkVoiceTemplates', lang)}</span>
          </button>

          {/* Copy link to share with users */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="hover:text-sky-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy link to send to users"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-sky-600" />}
            <span className={copiedLink ? 'text-emerald-700' : ''}>
              {copiedLink 
                ? (lang === 'th' ? 'คัดลอกลิงก์แล้ว!' : lang === 'vi' ? 'Đã sao chép liên kết!' : lang === 'km' ? 'បានចម្លងតំណភ្ជាប់!' : lang === 'nl' ? 'Link gekopieerd!' : lang === 'de' ? 'Link kopiert!' : 'Link copied!')
                : (lang === 'th' ? 'ลิงก์สำหรับผู้ใช้' : lang === 'vi' ? 'Liên kết cho người dùng' : lang === 'km' ? 'តំណភ្ជាប់ផ្ញើទៅកាន់អ្នកប្រើប្រាស់' : lang === 'nl' ? 'Link delen' : lang === 'de' ? 'Link teilen' : 'Share link for users')
              }
            </span>
          </button>
        </div>

      </section>

      {/* Video Tutorial Banner below the Master Box (Dark Theme Banner) */}
      <section className="rounded-3xl bg-slate-900 text-white p-4 sm:p-5 border border-slate-800 shadow-md flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black flex items-center gap-1.5">
              <span>🎬</span>
              <span>{t('videoBannerTitle', lang)}</span>
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
              HD 1080p
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {t('videoBannerDesc', lang)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenVideoTutorial}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('btnWatchVideo', lang)}</span>
          </button>
          
          {onOpenTelegramModal && (
            <button
              type="button"
              onClick={onOpenTelegramModal}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-current -rotate-12 translate-x-0.5" />
              <span>Telegram App (No Install)</span>
            </button>
          )}

          {onOpenInstallGateway && (
            <button
              type="button"
              onClick={onOpenInstallGateway}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('btnAddToScreen', lang)}</span>
            </button>
          )}
        </div>
      </section>

      {/* Language Indicator - Exclusively Khmer (KH) */}
      <section className="flex items-center justify-between gap-1.5 py-1 px-1 text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <div className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <span>🇰🇭</span>
            <span>ភាសាខ្មែរ (KH)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
