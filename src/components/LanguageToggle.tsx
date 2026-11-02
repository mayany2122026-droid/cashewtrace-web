import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage, AppLanguage, SUPPORTED_LANGUAGES } from '../lib/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'header' | 'footer';
  showLabel?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className = '',
  variant = 'compact'
}) => {
  const { language, setLanguage, currentLanguageMeta } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: AppLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const isKm = language === 'km' || language === 'kh';
  const isEn = language === 'en';
  const isKo = language === 'ko';

  // Desktop Direct 3-Button Segmented Selector & Mobile Dropdown
  return (
    <div className={`relative inline-flex items-center ${className}`} ref={containerRef}>
      {/* 3-Language Segmented Switcher for Desktop / Tablets */}
      <div className="hidden sm:inline-flex items-center bg-slate-100/90 hover:bg-slate-200/80 p-1 rounded-2xl border border-slate-200 shadow-2xs transition-all">
        {/* 1. Khmer */}
        <button
          type="button"
          onClick={() => handleSelectLanguage('km')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
            isKm 
              ? 'bg-emerald-700 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
          }`}
          title="ភាសាខ្មែរ (Khmer National)"
        >
          <span className="text-sm">🇰🇭</span>
          <span className="font-semibold text-xs">ខ្មែរ</span>
        </button>

        {/* 2. English */}
        <button
          type="button"
          onClick={() => handleSelectLanguage('en')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
            isEn 
              ? 'bg-emerald-700 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
          }`}
          title="English (International)"
        >
          <span className="text-sm">🌐</span>
          <span className="font-semibold text-xs">EN</span>
        </button>

        {/* 3. Korean */}
        <button
          type="button"
          onClick={() => handleSelectLanguage('ko')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
            isKo 
              ? 'bg-emerald-700 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
          }`}
          title="한국어 (Korean)"
        >
          <span className="text-sm">🇰🇷</span>
          <span className="font-semibold text-xs">한국어</span>
        </button>
      </div>

      {/* Mobile Compact Dropdown Trigger */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition cursor-pointer"
        >
          <span className="text-sm">{currentLanguageMeta.flag}</span>
          <span className="text-xs font-bold">
            {isKo ? '한국어' : isKm ? 'ខ្មែរ' : 'EN'}
          </span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Mobile Dropdown Modal */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 text-left">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Select Language / ជ្រើសរើសភាសា / 언어 선택
            </div>
            <div className="space-y-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                    language === lang.code || (language === 'kh' && lang.code === 'km')
                      ? 'bg-emerald-50 text-emerald-900 font-bold' 
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                  {(language === lang.code || (language === 'kh' && lang.code === 'km')) && (
                    <Check size={14} className="text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageToggle;
