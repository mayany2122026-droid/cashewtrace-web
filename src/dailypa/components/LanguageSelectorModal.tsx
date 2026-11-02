import React from 'react';
import { X, Globe, Check, Volume2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES_INFO } from '../utils/i18n';
import { speakText } from '../utils/speech';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLang,
}) => {
  if (!isOpen) return null;

  const handleSpeakPreview = (l: typeof SUPPORTED_LANGUAGES_INFO[0]) => {
    speakText(l.code === 'ko' ? '안녕하세요, MyDailyPA 음성 비서입니다.' : 'Hello, welcome to MyDailyPA voice assistant.', l.code);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
      <div className="relative w-full max-w-[calc(100vw-16px)] sm:max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden mx-auto my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 truncate">
                {currentLang === 'ko' ? '언어 및 통화 선택' : 'Select Language & Currency'}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {currentLang === 'ko' ? '영어 & 한국어 음성 비서' : 'English & Korean Voice Assistant'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Options List */}
        <div className="p-4 space-y-3">
          {SUPPORTED_LANGUAGES_INFO.map((item) => {
            const isSelected = currentLang === item.code;
            return (
              <div
                key={item.code}
                onClick={() => {
                  onSelectLang(item.code);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-indigo-50/60 border-indigo-600 ring-4 ring-indigo-500/10 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-3xl shrink-0 mt-0.5">{item.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-sm font-black truncate ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>
                      {item.nativeName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 shrink-0">
                      {item.defaultCurrencySymbol} {item.defaultCurrency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {item.description || item.nameEnglish}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      {item.code.toUpperCase()} • 1 USD = {item.defaultRateToUsd.toLocaleString()} {item.defaultCurrency}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakPreview(item);
                      }}
                      className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100/60 transition cursor-pointer"
                      title="Audio Sample"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{currentLang === 'ko' ? '실시간 음성 및 통화 프로필 지원' : 'Instant voice & currency profiles'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
          >
            {currentLang === 'ko' ? '확인' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
