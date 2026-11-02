import React, { useState, useEffect } from 'react';
import { 
  X, Check, ShieldCheck, Sparkles, Zap, 
  HelpCircle, CreditCard, Volume2, ArrowRight, Clock, Mic, User
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { speakText } from '../utils/speech';
import { getTrialStats, TrialStats, MAX_FREE_VOICE_RECORDS, MAX_FREE_TRIAL_DAYS } from '../utils/trialTracker';

interface PricingTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  usedRecordsCount?: number;
  onOpenOnboarding?: () => void;
}

export const PRICING_TIERS = [
  {
    tier: 1,
    nameKm: 'កម្រិត ១៖ សិស្ស & និស្សិត (Students & Daily Study)',
    nameEn: 'Tier 1: Students & Daily Study',
    range: '1 – 10 ដង/ថ្ងៃ (1–10 logs/day)',
    monthlyUsd: 1,
    monthlyKhr: '4,000 ៛',
    popular: false,
    idealForKm: 'សិស្ស និស្សិត កាលវិភាគរៀន និងប្រាក់ឧបត្ថម្ភប្រចាំថ្ងៃ',
    idealForEn: 'Exam deadlines, homework, class schedules, personal allowances',
  },
  {
    tier: 2,
    nameKm: 'កម្រិត ២៖ គ្រួសារ & ថែទាំផ្ទះ (Family Care & Elder Medicine)',
    nameEn: 'Tier 2: Family Care & Elder Medicine',
    range: '11 – 20 ដង/ថ្ងៃ (11–20 logs/day)',
    monthlyUsd: 2,
    monthlyKhr: '8,000 ៛',
    popular: false,
    idealForKm: 'អ្នកថែទាំគ្រួសារ ម្ដាយ មេផ្ទះ ថ្នាំពេទ្យ និងចំណាយផ្ទះសម្បែង',
    idealForEn: 'Busy mothers, family health, medicine schedules, daily household expenses',
  },
  {
    tier: 3,
    nameKm: 'កម្រិត ៣៖ អ្នកធ្វើការឯករាជ្យ (Freelancers & Project Work)',
    nameEn: 'Tier 3: Freelancers & Project Work',
    range: '21 – 30 ដង/ថ្ងៃ (21–30 logs/day)',
    monthlyUsd: 3,
    monthlyKhr: '12,000 ៛',
    popular: true,
    idealForKm: 'អ្នកធ្វើការឯករាជ្យ កិច្ចការប្រចាំថ្ងៃ ជំនួប និងគម្រោងការងារ',
    idealForEn: 'Freelancers, project tracking, daily meetings, client expenses',
  },
  {
    tier: 4,
    nameKm: 'កម្រិត ៤៖ អាជីវកម្ម MSME & ហាងលក់ដូរ (MSMEs, Salons, Coffee Shops)',
    nameEn: 'Tier 4: MSMEs, Salons, Coffee Shops',
    range: '31 – 40 ដង/ថ្ងៃ (31–40 logs/day)',
    monthlyUsd: 4,
    monthlyKhr: '16,000 ៛',
    popular: false,
    idealForKm: 'ហាងលក់ចាប់ហួយ តូបផ្សារ ហាងកាហ្វេ កត់ត្រាចំណូល-ចំណាយ និងលុយជំពាក់',
    idealForEn: 'Local shop owners, sales logs, customer receivables/debts, client contacts',
  },
  {
    tier: 5,
    nameKm: 'កម្រិត ៥៖ អ្នកប្រើប្រាស់កម្រិតខ្ពស់ (Wholesalers & Power Users)',
    nameEn: 'Tier 5: Wholesalers & Power Users',
    range: '> 40 ដង/ថ្ងៃ (>40 logs/day)',
    monthlyUsd: 5,
    monthlyKhr: '20,000 ៛',
    popular: false,
    badgeKm: 'កញ្ចប់ពេញនិយម MSME',
    badgeEn: 'Full Power',
    idealForKm: 'អាជីវកម្មមមាញឹក ដេប៉ូបោះដុំ និងអ្នកគ្រប់គ្រងការងារច្រើន',
    idealForEn: 'High-volume shop owners, multi-entry bookkeeping, unlimited voice logging',
  },
];

export const PricingTiersModal: React.FC<PricingTiersModalProps> = ({
  isOpen,
  onClose,
  lang,
  usedRecordsCount = 0,
  onOpenOnboarding,
}) => {
  const [selectedTier, setSelectedTier] = useState<number>(3);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'khqr' | 'card'>('khqr');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [stats, setStats] = useState<TrialStats>(() => getTrialStats());

  useEffect(() => {
    if (isOpen) {
      setStats(getTrialStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isKm = lang === 'km';
  const displayVoiceCount = Math.max(usedRecordsCount, stats.voiceRecordingsCount);
  const remainingFreeRecords = Math.max(0, MAX_FREE_VOICE_RECORDS - displayVoiceCount);

  const handleSimulatePayment = (tierNum: number) => {
    setSelectedTier(tierNum);
    setShowPaymentSuccess(true);
    const chosen = PRICING_TIERS.find(t => t.tier === tierNum);
    if (chosen) {
      const methodLabel = paymentMethod === 'khqr' ? 'KHQR Bakong' : 'Visa / Mastercard';
      speakText(
        isKm 
          ? `អរគុណ! អ្នកបានជ្រើសរើសកញ្ចប់ ${chosen.nameKm} តម្លៃ ${chosen.monthlyUsd} ដុល្លារក្នុងមួយខែ តាម ${methodLabel}។`
          : `Thank you! You selected ${chosen.nameEn} for ${chosen.monthlyUsd} dollars per month via ${methodLabel}.`,
        lang,
        { playChime: true }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-rose-500/20">
              💎
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                {isKm ? 'តារាងតម្លៃសមរម្យសម្រាប់ MSME & បុគ្គល' : 'Fair Pricing Tiers for MSMEs & Individuals'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isKm ? 'តម្លៃចាប់ពី ១$ ដល់ ៥$ ក្នុងមួយខែ (គ្មានកិច្ចសន្យា អាចឈប់គ្រប់ពេល)' : 'From $1 to $5/month. Simple, affordable, no hidden fees.'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Generous Trial Explanation Banner with 300 Records & 60 Days Breakdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              <span>🎁</span>
              <span>{isKm ? 'កូតាកត់ត្រាឥតគិតថ្លៃ (Free Trial)' : 'Generous Free Trial'}</span>
            </span>
            <span className={`font-mono text-xs font-black px-3 py-1 rounded-xl border shadow-2xs ${
              stats.isExpired 
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-white text-emerald-900 border-emerald-200'
            }`}>
              {stats.isExpired 
                ? (isKm ? '⚠️ ផុតកំណត់កូតាសាកល្បង' : '⚠️ Free Trial Expired')
                : (isKm ? '✅ កំពុងសាកល្បងឥតគិតថ្លៃ' : '✅ Active Free Trial')}
            </span>
          </div>

          {/* 2 Progress Bars: Voice Records & Active Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Voice Records Bar */}
            <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isKm ? 'សំឡេងកត់ត្រា' : 'Voice Records'}</span>
                </span>
                <span className="font-mono text-emerald-900 font-black">
                  {displayVoiceCount} / {MAX_FREE_VOICE_RECORDS}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (displayVoiceCount / MAX_FREE_VOICE_RECORDS) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{isKm ? 'នៅសល់៖' : 'Remaining:'}</span>
                <span className="font-bold text-emerald-700">{remainingFreeRecords} {isKm ? 'ដង' : 'records'}</span>
              </div>
            </div>

            {/* Active Days Bar */}
            <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isKm ? 'រយៈពេល ៦០ ថ្ងៃ' : '60 Days Trial'}</span>
                </span>
                <span className="font-mono text-indigo-900 font-black">
                  {stats.daysUsed} / {MAX_FREE_TRIAL_DAYS} {isKm ? 'ថ្ងៃ' : 'days'}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.daysUsed / MAX_FREE_TRIAL_DAYS) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{isKm ? 'នៅសល់៖' : 'Remaining:'}</span>
                <span className="font-bold text-indigo-700">{stats.daysRemaining} {isKm ? 'ថ្ងៃ' : 'days'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-emerald-200/60">
            <p className="text-xs font-medium text-emerald-950 leading-relaxed">
              {isKm 
                ? '⭐ អ្នកមានសិទ្ធិកត់ត្រា ៣០០ ដង ឬ ៦០ ថ្ងៃ (មួយណាមកដល់មុន) ដោយឥតគិតថ្លៃ! ប្រសិនបើអ្នកភ្ជាប់ឈ្មោះ និងលេខទូរស័ព្ទ កូតានឹងមិនបាត់បង់ពេលប្តូរទូរស័ព្ទ។'
                : '⭐ You get 300 voice records or 60 days (whichever comes first) completely free! Signing in with your phone secures your trial balance across all devices.'}
            </p>

            {onOpenOnboarding && !stats.isRegistered && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOnboarding();
                }}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isKm ? 'ភ្ជាប់លេខទូរស័ព្ទរក្សាទុកកូតា' : 'Sign In with Phone'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Billing Cycle Toggle: Monthly vs Annual Pass */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-300">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎟️</span>
            <div>
              <p className="text-xs font-black text-amber-950">
                {isKm ? 'ជម្រើសសំបុត្រប្រចាំឆ្នាំ (Annual Pass Option)' : 'Annual Pass Option (Best Value)'}
              </p>
              <p className="text-[11px] text-amber-800 font-medium">
                {isKm ? 'បង់ត្រឹម ១០ ខែ ទទួលបានឥតគិតថ្លៃ ២ ខែ (ចំណេញ ២ខែពេញ)' : 'Pay 10 months, get 2 free (e.g. $40 / 160,000 KHR / year for MSMEs)'}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-amber-300 shadow-2xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isKm ? 'ប្រចាំខែ (Monthly)' : 'Monthly'}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                billingCycle === 'annual'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{isKm ? 'ប្រចាំឆ្នាំ (Annual Pass)' : 'Annual Pass'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-300 text-amber-950 text-[9px] font-black uppercase">
                {isKm ? 'ឥតគិតថ្លៃ ២ខែ' : '2 Mo Free'}
              </span>
            </button>
          </div>
        </div>

        {/* 5-Tier Pricing Table */}
        <div className="space-y-2.5">
          <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span>{isKm ? 'ជ្រើសរើសកញ្ចប់ដែលសមនឹងអ្នក' : 'Choose Your Tier'}</span>
            <span className="text-[11px] text-slate-500 font-bold">
              {billingCycle === 'annual'
                ? (isKm ? '១០$ – ៥០$ / ឆ្នាំ (គិតថ្លៃត្រឹម ១០ ខែ)' : '$10 – $50 / year (Pay 10 mo, get 2 free)')
                : (isKm ? '១$ – ៥$ / ខែ' : '$1 – $5 / mo')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRICING_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.tier;
              const priceUsd = billingCycle === 'annual' ? tier.monthlyUsd * 10 : tier.monthlyUsd;
              const priceKhr = billingCycle === 'annual' 
                ? (tier.monthlyUsd * 10 * 4000).toLocaleString() + ' ៛'
                : tier.monthlyKhr;
              const cycleLabel = billingCycle === 'annual' 
                ? (isKm ? '/ ឆ្នាំ (12 ខែ)' : '/ yr (12 mo)')
                : (isKm ? '/ ខែ' : '/ mo');

              return (
                <div
                  key={tier.tier}
                  onClick={() => setSelectedTier(tier.tier)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-rose-50/50 border-rose-500 shadow-sm ring-1 ring-rose-500/30' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {isKm ? 'ពេញនិយមបំផុត' : 'Most Popular'}
                    </span>
                  )}
                  {tier.badgeKm && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {isKm ? tier.badgeKm : tier.badgeEn}
                    </span>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {isKm ? tier.nameKm : tier.nameEn}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
                        ${priceUsd}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {cycleLabel} ({priceKhr})
                      </span>
                      {billingCycle === 'annual' && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                          {isKm ? 'ចំណេញ 2 ខែ' : 'Save 2 Mo'}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg inline-block">
                      🎯 {tier.range}
                    </div>

                    <p className="text-[11px] text-slate-500 pt-1 leading-snug">
                      {isKm ? tier.idealForKm : tier.idealForEn}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">
                      {isSelected ? '✓ ' + (isKm ? 'បានជ្រើសរើស' : 'Selected') : (isKm ? 'ចុចដើម្បីជ្រើសរើស' : 'Tap to select')}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTier(tier.tier);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isSelected ? (isKm ? 'ជ្រើសរើស' : 'Selected') : (isKm ? 'ជ្រើសរើស' : 'Select')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Toggle: KHQR vs Visa / Mastercard */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
              {isKm ? 'វិធីសាស្ត្រទូទាត់ប្រាក់ (Payment Method)' : 'Payment Method'}
            </span>
            <span className="text-[11px] text-slate-400">
              {isKm ? 'ជ្រើសរើស KHQR ឬ កាតអន្តរជាតិ' : 'Choose local KHQR or International Card'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('khqr')}
              className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                paymentMethod === 'khqr'
                  ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500/30'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                KH
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-900 leading-tight">KHQR Bakong</p>
                <p className="text-[10px] text-slate-500 truncate">ABA, Acleda, Wing, Canadia</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                paymentMethod === 'card'
                  ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500/30'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                💳
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-900 leading-tight">Visa & Mastercard</p>
                <p className="text-[10px] text-slate-500 truncate">{isKm ? 'ក្រៅស្រុក & អន្តរជាតិ' : 'Outside Cambodia / Global'}</p>
              </div>
            </button>
          </div>

          {/* If KHQR selected */}
          {paymentMethod === 'khqr' ? (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>🇰🇭 {isKm ? 'ស្កេនទូទាត់ជាមួយ KHQR គ្រប់ធនាគារ' : 'Instant KHQR Scan from Any Bank'}</span>
                <span className="font-mono text-rose-600 font-black">${PRICING_TIERS.find(t => t.tier === selectedTier)?.monthlyUsd}/mo</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isKm 
                  ? 'គាំទ្រកម្មវិធីធនាគារក្នុងស្រុកទាំងអស់ (ABA Mobile, ACLEDA Mobile, Wing Bank, Sathapana, Canadia) ដោយស្កេន KHQR តែមួយគត់។'
                  : 'Supports all Cambodian mobile banking apps via Bakong KHQR standard with zero transaction fees.'}
              </p>
              <button
                type="button"
                onClick={() => handleSimulatePayment(selectedTier)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-md shadow-rose-600/20 cursor-pointer transition-all active:scale-95"
              >
                {isKm ? `បញ្ជាក់កញ្ចប់កម្រិត ${selectedTier} ($${PRICING_TIERS.find(t => t.tier === selectedTier)?.monthlyUsd}/ខែ) តាម KHQR` : `Confirm Tier ${selectedTier} ($${PRICING_TIERS.find(t => t.tier === selectedTier)?.monthlyUsd}/mo) via KHQR`}
              </button>
            </div>
          ) : (
            /* If Visa / Mastercard selected */
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>🌍 {isKm ? 'ទូទាត់តាមកាតអន្តរជាតិ (Visa / Mastercard)' : 'International Visa / Mastercard Checkout'}</span>
                <span className="font-mono text-rose-600 font-black">${PRICING_TIERS.find(t => t.tier === selectedTier)?.monthlyUsd}/mo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    {isKm ? 'ឈ្មោះលើកាត (Cardholder Name)' : 'Cardholder Name'}
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Sokha Chea"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    {isKm ? 'លេខកាត (Card Number)' : 'Card Number'}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-mono focus:outline-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    {isKm ? 'កាលបរិច្ឆេទផុតកំណត់ (MM/YY)' : 'Expiry (MM/YY)'}
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    maxLength={5}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-mono focus:outline-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    {isKm ? 'លេខកូដសម្ងាត់ (CVC/CVV)' : 'CVC / CVV'}
                  </label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-mono focus:outline-rose-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePayment(selectedTier)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-95"
              >
                {isKm ? `បង់ប្រាក់ $${PRICING_TIERS.find(t => t.tier === selectedTier)?.monthlyUsd}/ខែ ជាមួយ Visa / Mastercard` : `Pay $${PRICING_TIERS.find(t => t.tier === selectedTier)?.monthlyUsd}/mo with Visa / Mastercard`}
              </button>
            </div>
          )}
        </div>

        {/* Simulated KHQR / Bakong Payment Notice */}
        {showPaymentSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{isKm ? 'បានជ្រើសរើសកញ្ចប់ជោគជ័យ (KHQR ត្រៀមរួចជាស្រេច)' : 'Subscription Tier Ready via KHQR'}</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              {isKm 
                ? `កញ្ចប់កម្រិត ${selectedTier} ត្រូវបានកត់ត្រា។ អ្នកនៅតែអាចបន្តប្រើប្រាស់ ៣០០ ដងឥតគិតថ្លៃរហូតដល់អស់ ដោយមិនមានការកាត់ប្រាក់ឡើយ!`
                : `Tier ${selectedTier} selected. Your 300 free recordings remain active until fully used with zero unexpected charges.`}
            </p>
          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-[11px] text-slate-500 font-medium">
            🔒 {isKm ? 'ទូទាត់ងាយស្រួលតាម KHQR ធនាគារក្នុងស្រុកទាំងអស់ (ABA, Acleda, Wing...)' : 'Accepts all local banks via KHQR'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs cursor-pointer transition-all active:scale-95"
          >
            {isKm ? 'យល់ព្រម & ត្រឡប់ទៅកត់ត្រា' : 'Got It & Back to Voice App'}
          </button>
        </div>

      </div>
    </div>
  );
};
