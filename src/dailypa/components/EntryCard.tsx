import React from 'react';
import { 
  Volume2, CheckCircle2, Trash2, Clock, 
  ArrowDownLeft, ArrowUpRight, DollarSign, Calendar,
  User, CheckSquare, Square
} from 'lucide-react';
import { Entry, SupportedLanguage } from '../types';
import { speakText } from '../utils/speech';
import { t } from '../utils/i18n';

interface EntryCardProps {
  entry: Entry;
  lang: SupportedLanguage;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  currencyRate: number;
  secondaryCurrencySymbol?: string;
  usdToSecondaryRate?: number;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  lang,
  onToggleComplete,
  onDelete,
  currencyRate,
  secondaryCurrencySymbol = '៛',
  usdToSecondaryRate = 4030,
}) => {
  const isKm = lang === 'km';

  const handleSpeak = () => {
    const speech = isKm ? entry.titleKhmer : (entry.titleEnglish || entry.titleKhmer);
    speakText(speech, lang);
  };

  // Badge styles based on type
  const isIncome = entry.type === 'income';
  const isExpense = entry.type === 'expense';
  const isReminder = entry.type === 'reminder';

  const getTypeBadgeLabel = () => {
    if (isIncome) return `🟢 ${t('metricIncome', lang)}`;
    if (isExpense) return `🔴 ${t('metricExpense', lang)}`;
    if (isReminder) return `⏰ ${t('tabReminder', lang)}`;
    return `☑️ ${t('tabTask', lang)}`;
  };

  return (
    <div 
      className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition-all shadow-2xs hover:shadow-sm ${
        entry.isCompleted 
          ? 'opacity-70 border-slate-200 bg-slate-50/50' 
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        
        {/* Left: Completion toggle + Content */}
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => onToggleComplete(entry.id)}
            className="mt-0.5 text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
            title={entry.isCompleted ? t('btnSave', lang) : t('tabTask', lang)}
          >
            {entry.isCompleted ? (
              <CheckSquare className="w-5 h-5 text-emerald-600" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Type Badge */}
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isIncome 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : isExpense 
                  ? 'bg-rose-100 text-rose-800' 
                  : isReminder
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}>
                {getTypeBadgeLabel()}
              </span>

              {/* Time or date */}
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(entry.date).toLocaleDateString()}</span>
              </span>

              {entry.reminderTime && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{entry.reminderTime}</span>
                </span>
              )}
            </div>

            <h4 className={`text-sm sm:text-base font-bold text-slate-900 leading-snug break-words ${
              entry.isCompleted ? 'line-through text-slate-500' : ''
            }`}>
              {isKm ? entry.titleKhmer : (entry.titleEnglish || entry.titleKhmer)}
            </h4>

            {entry.personName && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>{entry.isLaborLog ? (lang === 'km' ? 'បុគ្គលិក៖' : 'Helper:') : t('customerPartnerLabel', lang)} <strong className="text-slate-700">{entry.personName}</strong></span>
              </p>
            )}

            {entry.notes && (
              <p className="text-xs text-slate-500 italic">
                "{entry.notes}"
              </p>
            )}

            {/* Grocery Basket Breakdown (Itemized Receipt) */}
            {entry.items && entry.items.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-600 flex items-center gap-1">
                  <span>🧺 {lang === 'km' ? 'កន្ត្រកទំនិញលក់' : 'Grocery Basket'}:</span>
                  <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-black">
                    {entry.items.length} {lang === 'km' ? 'មុខ' : 'items'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                  {entry.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-800">
                      <span>• {it}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Amount & Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {entry.amount !== undefined && (
            <div className="text-right">
              <span className={`text-base sm:text-lg font-black font-mono leading-none ${
                isIncome ? 'text-emerald-600' : isExpense ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {isIncome ? '+' : isExpense ? '-' : ''}
                {entry.currency === 'USD' 
                  ? `$${entry.amount.toFixed(2)}` 
                  : `${entry.amount.toLocaleString()} ${secondaryCurrencySymbol}`
                }
              </span>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {entry.currency === 'USD' 
                  ? `≈ ${(entry.amount * usdToSecondaryRate).toLocaleString(undefined, { maximumFractionDigits: secondaryCurrencySymbol === '៛' || secondaryCurrencySymbol === '₫' ? 0 : 2 })} ${secondaryCurrencySymbol}`
                  : `≈ $${(entry.amount / usdToSecondaryRate).toFixed(2)}`}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Audio Read Aloud button */}
            <button
              type="button"
              onClick={handleSpeak}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
              title={t('btnReadAloud', lang)}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
              title={t('btnDelete', lang)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
