import React, { useState } from 'react';
import { 
  X, Volume2, VolumeX, Play, Pause, Copy, Check, 
  TrendingUp, TrendingDown, DollarSign, Calendar, Sparkles, Send
} from 'lucide-react';
import { Entry, SupportedLanguage } from '../types';
import { speakText } from '../utils/speech';

interface DailyVoicePLDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
  currencyRate: number;
  lang: SupportedLanguage;
}

export const DailyVoicePLDigestModal: React.FC<DailyVoicePLDigestModalProps> = ({
  isOpen,
  onClose,
  entries,
  currencyRate,
  lang,
}) => {
  const [period, setPeriod] = useState<'today' | 'yesterday' | '7days' | 'month'>('today');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isKm = lang === 'km';

  // Filter entries by period
  const now = new Date();
  const filtered = entries.filter((e) => {
    const d = new Date(e.date);
    if (period === 'today') {
      return d.toDateString() === now.toDateString();
    } else if (period === 'yesterday') {
      const yest = new Date(now.getTime() - 86400000);
      return d.toDateString() === yest.toDateString();
    } else if (period === '7days') {
      return now.getTime() - d.getTime() <= 7 * 86400000;
    } else {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
  });

  let totalIncome = 0;
  let totalExpense = 0;
  filtered.forEach((e) => {
    const amt = e.amount || 0;
    const valUsd = e.currency === 'KHR' ? amt / currencyRate : amt;
    if (e.type === 'income') totalIncome += valUsd;
    if (e.type === 'expense') totalExpense += valUsd;
  });

  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  // Generate spoken script
  const getDigestScript = () => {
    if (isKm) {
      return `របាយការណ៍សង្ខេបប្រចាំថ្ងៃ៖ អ្នកមានចំណូលសរុប ${totalIncome.toFixed(2)} ដុល្លារ (ប្រហែល ${(totalIncome * currencyRate).toLocaleString()} រៀល) និងចំណាយសរុប ${totalExpense.toFixed(2)} ដុល្លារ។ ចំណេញសុទ្ធគឺ ${netProfit.toFixed(2)} ដុល្លារ (ប្រហែល ${(netProfit * currencyRate).toLocaleString()} រៀល)។ កត់ត្រាសរុបមាន ${filtered.length} ប្រតិបត្តិការ។`;
    }
    return `Daily Profit and Loss summary: Total income is $${totalIncome.toFixed(2)} and total expenses are $${totalExpense.toFixed(2)}. Your net cash profit is $${netProfit.toFixed(2)}. Total logged records: ${filtered.length}.`;
  };

  const handlePlayVoice = () => {
    const script = getDigestScript();
    setIsPlayingAudio(true);
    speakText(script, lang, { playChime: true });
    setTimeout(() => setIsPlayingAudio(false), 8000);
  };

  const handleCopyTelegram = () => {
    const text = `📊 DailyPA Report (${period.toUpperCase()}):
• ចំណូល (Income): $${totalIncome.toFixed(2)} (${(totalIncome * currencyRate).toLocaleString()} ៛)
• ចំណាយ (Expense): $${totalExpense.toFixed(2)} (${(totalExpense * currencyRate).toLocaleString()} ៛)
• ចំណេញសុទ្ធ (Net Profit): $${netProfit.toFixed(2)} (${(netProfit * currencyRate).toLocaleString()} ៛)
• កត់ត្រាសរុប: ${filtered.length} entries
✨ DailyPA Cambodian AI Voice Assistant`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isKm ? 'របាយការណ៍ P&L ជាសំឡេង (Voice Digest)' : 'Daily Voice P&L Digest'}
              </h3>
              <p className="text-xs text-slate-500">
                {isKm ? 'សង្ខេបចំណូល ចំណាយ និងប្រាក់ចំណេញ 1-Tap' : '1-Tap audio breakdown of profit and loss'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          {[
            { id: 'today', labelKm: 'ថ្ងៃនេះ', labelEn: 'Today' },
            { id: 'yesterday', labelKm: 'ម្សិលមិញ', labelEn: 'Yesterday' },
            { id: '7days', labelKm: '៧ ថ្ងៃចុងក្រោយ', labelEn: '7 Days' },
            { id: 'month', labelKm: 'ខែនេះ', labelEn: 'This Month' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                period === p.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isKm ? p.labelKm : p.labelEn}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-black uppercase text-emerald-800">ចំណូល (Income)</span>
            <p className="text-lg font-black font-mono text-emerald-700 mt-0.5">${totalIncome.toFixed(2)}</p>
            <span className="text-[10px] font-mono text-emerald-600">≈ {(totalIncome * currencyRate).toLocaleString()} ៛</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[10px] font-black uppercase text-rose-800">ចំណាយ (Expense)</span>
            <p className="text-lg font-black font-mono text-rose-700 mt-0.5">${totalExpense.toFixed(2)}</p>
            <span className="text-[10px] font-mono text-rose-600">≈ {(totalExpense * currencyRate).toLocaleString()} ៛</span>
          </div>
        </div>

        {/* Net Profit Banner */}
        <div className={`p-4 rounded-2xl border ${
          netProfit >= 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider">
                {isKm ? 'ចំណេញសុទ្ធ (Net Profit)' : 'Net Profit'}
              </span>
              <div className="text-2xl font-black font-mono mt-0.5">
                ${netProfit.toFixed(2)}
              </div>
              <p className="text-xs font-mono opacity-80">
                ≈ {(netProfit * currencyRate).toLocaleString()} ៛ (Margin: {margin.toFixed(1)}%)
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-xl">
              {netProfit >= 0 ? '📈' : '📉'}
            </div>
          </div>
        </div>

        {/* Audio Waveform & Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={handlePlayVoice}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? (isKm ? 'កំពុងអាន...' : 'Playing...') : (isKm ? '🔊 ស្តាប់សង្ខេបជាសំឡេង (Play Voice)' : 'Play Voice')}</span>
          </button>

          <button
            onClick={handleCopyTelegram}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            title="ចម្លងដើម្បីផ្ញើលើ Telegram / WhatsApp"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'បានចម្លង!' : 'ចម្លងដាក់ Telegram'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
