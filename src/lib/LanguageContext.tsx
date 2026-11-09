import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  AppLanguage, 
  LanguageMeta, 
  SUPPORTED_LANGUAGES, 
  TRANSLATIONS, 
  TranslationDictionary 
} from './translations';

export type { AppLanguage, LanguageMeta, TranslationDictionary };
export { SUPPORTED_LANGUAGES, TRANSLATIONS };

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  isEnglish: boolean;
  isKorean: boolean;
  isJapanese: boolean;
  // Compatibility getters for legacy references
  isKhmer: boolean;
  isGerman: boolean;
  isFrench: boolean;
  isVietnamese: boolean;
  isThai: boolean;
  isIndonesian: boolean;
  isMalay: boolean;
  isFilipino: boolean;
  isLao: boolean;
  isBurmese: boolean;
  isChinese: boolean;
  isDutch: boolean;
  isItalian: boolean;
  isSpanish: boolean;
  isPortuguese: boolean;
  isSingapore: boolean;
  isBrunei: boolean;
  t: (khmerText: string, englishText?: string, other?: Partial<Record<AppLanguage, string>> | string) => string;
  translate: (key: keyof TranslationDictionary) => string;
  dict: TranslationDictionary;
  currentLanguageMeta: LanguageMeta;
}

const defaultMeta = SUPPORTED_LANGUAGES[0];

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isEnglish: true,
  isKorean: false,
  isJapanese: false,
  isKhmer: false,
  isGerman: false,
  isFrench: false,
  isVietnamese: false,
  isThai: false,
  isIndonesian: false,
  isMalay: false,
  isFilipino: false,
  isLao: false,
  isBurmese: false,
  isChinese: false,
  isDutch: false,
  isItalian: false,
  isSpanish: false,
  isPortuguese: false,
  isSingapore: false,
  isBrunei: false,
  t: (_khmerText: string, englishText?: string) => englishText || _khmerText,
  translate: (key: keyof TranslationDictionary) => TRANSLATIONS.en[key] || '',
  dict: TRANSLATIONS.en,
  currentLanguageMeta: defaultMeta,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cashewtrace_app_language') as AppLanguage | null;
      if (saved && (saved === 'en' || saved === 'ko' || saved === 'km' || saved === 'kh')) {
        return saved === 'kh' ? 'km' : saved;
      }
    }
    return 'km'; // Default to Khmer as requested
  });

  const setLanguage = (lang: AppLanguage) => {
    const targetLang: AppLanguage = (lang === 'km' || lang === 'kh') ? 'km' : (lang === 'ko' ? 'ko' : 'en');
    setLanguageState(targetLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cashewtrace_app_language', targetLang);
      document.documentElement.lang = targetLang;

      // Sync with DailyPA / MyDailyPA language & currency
      localStorage.setItem('dailypa_lang', targetLang);

      const meta = SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || defaultMeta;
      if (meta) {
        const curConfig = {
          primaryCurrency: meta.currency,
          secondaryCurrency: meta.currency,
          secondaryCurrencySymbol: meta.currencySymbol,
          secondaryCurrencyName: meta.name,
          exchangeRateMode: meta.currency === 'KRW' ? 'market' : 'nbc',
          usdToKhrRate: 4030,
          usdToSecondaryRate: meta.rateToUsd,
          lastUpdated: new Date().toISOString(),
          sourceLabel: `${meta.name} (${meta.currency} ${meta.currencySymbol})`,
          allowFluctuation: false,
        };
        localStorage.setItem('dailypa_currency_config', JSON.stringify(curConfig));
        window.dispatchEvent(new CustomEvent('app_language_currency_change', {
          detail: { 
            lang: targetLang, 
            currency: meta.currency, 
            symbol: meta.currencySymbol, 
            rate: meta.rateToUsd, 
            config: curConfig 
          }
        }));
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ko' : 'en');
  };

  const isEnglish = language === 'en';
  const isKorean = language === 'ko';
  const isJapanese = language === 'ja';
  const isKhmer = language === 'km' || language === 'kh';
  const isGerman = false;
  const isFrench = false;
  const isVietnamese = false;
  const isThai = false;
  const isIndonesian = false;
  const isMalay = false;
  const isFilipino = false;
  const isLao = false;
  const isBurmese = false;
  const isChinese = false;
  const isDutch = false;
  const isItalian = false;
  const isSpanish = false;
  const isPortuguese = false;
  const isSingapore = false;
  const isBrunei = false;

  const dict = useMemo(() => {
    return TRANSLATIONS[language] || TRANSLATIONS.en;
  }, [language]);

  const currentLanguageMeta = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || defaultMeta;
  }, [language]);

  const translate = (key: keyof TranslationDictionary): string => {
    return dict[key] || TRANSLATIONS.en[key] || '';
  };

  /**
   * Universal translation helper:
   * Returns Japanese, Korean, Khmer, or English based on active language.
   */
  const t = (
    khmerText: string, 
    englishText?: string, 
    other?: Partial<Record<AppLanguage, string>> | string
  ): string => {
    if (language === 'ja') {
      if (other && typeof other === 'object' && (other as any).ja) {
        return (other as any).ja;
      }
      return englishText || khmerText;
    }

    if (language === 'ko') {
      if (other && typeof other === 'object' && other.ko) {
        return other.ko;
      }
      if (typeof other === 'string' && other) {
        return other;
      }
      return englishText || khmerText;
    }

    if (language === 'km' || language === 'kh') {
      return khmerText;
    }

    return englishText || khmerText;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      isEnglish,
      isKorean,
      isJapanese,
      isKhmer,
      isGerman,
      isFrench,
      isVietnamese,
      isThai,
      isIndonesian,
      isMalay,
      isFilipino,
      isLao,
      isBurmese,
      isChinese,
      isDutch,
      isItalian,
      isSpanish,
      isPortuguese,
      isSingapore,
      isBrunei,
      t,
      translate,
      dict,
      currentLanguageMeta
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
