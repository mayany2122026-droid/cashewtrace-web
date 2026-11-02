import React, { useState } from 'react';
import { X, DollarSign, RefreshCw, Volume2, Check } from 'lucide-react';
import { CurrencyConfig, SupportedLanguage } from '../types';
import { speakText } from '../utils/speech';

interface CurrencySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencyConfig: CurrencyConfig;
  onUpdateConfig: (cfg: CurrencyConfig) => void;
  lang: SupportedLanguage;
}

export const CurrencySettingsModal: React.FC<CurrencySettingsModalProps> = ({
  isOpen,
  onClose,
  currencyConfig,
  onUpdateConfig,
  lang,
}) => {
  const [rate, setRate] = useState(currencyConfig.usdToKhrRate.toString());
  const [mode, setMode] = useState(currencyConfig.exchangeRateMode);
  const [allowFluctuation, setAllowFluctuation] = useState(currencyConfig.allowFluctuation);

  if (!isOpen) return null;

  const isKm = lang === 'km';

  const handleSave = () => {
    const numericRate = parseFloat(rate) || 4030;
    onUpdateConfig({
      ...currencyConfig,
      usdToKhrRate: numericRate,
      exchangeRateMode: mode,
      allowFluctuation,
      lastUpdated: new Date().toISOString(),
      sourceLabel: mode === 'nbc' ? 'ធនាគារជាតិនៃកម្ពុជា (NBC)' : mode === 'market' ? 'ទីផ្សារសេរី (Free Market)' : 'ផ្ទាល់ខ្លួន (Custom)',
    });
    onClose();
  };

  const handleAnnounceRate = () => {
    const text = isKm 
      ? `អត្រាប្តូរប្រាក់បច្ចុប្បន្ន ១ ដុល្លារស្មើនឹង ${rate} រៀល តាម${mode === 'nbc' ? 'ធនាគារជាតិ NBC' : 'ទីផ្សារសេរី'}`
      : `Current exchange rate: 1 USD equals ${rate} Cambodian Riel.`;
    speakText(text, lang, { playChime: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isKm ? 'កំណត់អត្រាប្តូរប្រាក់ (USD / KHR)' : 'Currency & Exchange Rate'}
              </h3>
              <p className="text-xs text-slate-500">1 USD = ? KHR (រៀល)</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Radio options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">ប្រភពអត្រាប្តូរប្រាក់៖</label>
          
          <button
            type="button"
            onClick={() => { setMode('nbc'); setRate('4030'); }}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              mode === 'nbc' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <h4 className="text-xs font-black text-slate-900">ធនាគារជាតិនៃកម្ពុជា (NBC Official)</h4>
              <p className="text-[11px] text-slate-500">1 USD = 4,030 KHR (ស្ដង់ដារផ្លូវការ)</p>
            </div>
            {mode === 'nbc' && <Check className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            type="button"
            onClick={() => { setMode('market'); setRate('4100'); }}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              mode === 'market' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <h4 className="text-xs font-black text-slate-900">អត្រាទីផ្សារសេរី (Market Cash Rate)</h4>
              <p className="text-[11px] text-slate-500">1 USD = 4,100 KHR (ចាយវាយជាក់ស្តែង)</p>
            </div>
            {mode === 'market' && <Check className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              mode === 'custom' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <h4 className="text-xs font-black text-slate-900">កំណត់ផ្ទាល់ខ្លួន (Custom Business Rate)</h4>
              <p className="text-[11px] text-slate-500">បញ្ចូលអត្រាគណនេយ្យផ្ទាល់ខ្លួនរបស់ហាង</p>
            </div>
            {mode === 'custom' && <Check className="w-4 h-4 text-amber-600" />}
          </button>
        </div>

        {/* Input for rate */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            អត្រា ១ ដុល្លារ គិតជារៀល (1 USD = X ៛)
          </label>
          <div className="relative">
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              disabled={mode !== 'custom'}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:border-amber-500 disabled:opacity-75"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              រៀល (KHR)
            </span>
          </div>
        </div>

        {/* Voice Announcement button */}
        <button
          type="button"
          onClick={handleAnnounceRate}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
          <span>🔊 ស្តាប់ការប្រកាសអត្រាប្តូរប្រាក់ជាសំឡេង</span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
          >
            បោះបង់
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs"
          >
            រក្សាទុក
          </button>
        </div>

      </div>
    </div>
  );
};
