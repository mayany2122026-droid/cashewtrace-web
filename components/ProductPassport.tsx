import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Calendar, ArrowRightLeft, User, 
  MapPin, Phone, Award, FileText, CheckCircle2, ChevronRight, ExternalLink, Printer,
  Play, Video, X, Film, Sparkles, Layers, QrCode, Download, Tag, Globe,
  BookOpen, Check, AlertCircle, Copy, Share2, Info, Building2, Flame, HeartHandshake,
  CheckSquare, ArrowLeft, RefreshCw, Facebook, MessageCircle, Volume2, VolumeX, Pause,
  Send, Mail
} from 'lucide-react';
import { Batch, Supplier, StorySection, ContactInfo, NutritionFacts } from '../types';
import QRCodePrinter from './QRCodePrinter';
import VoiceStoryRecorder from './VoiceStoryRecorder';
import QRCode from 'qrcode';
import { useLanguage, AppLanguage, SUPPORTED_LANGUAGES } from '../lib/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { formatBotanicalRows, formatWeightBadge } from './PackagingLabelDesigner';
import { calculateNutritionFromRecipe } from '../lib/nutritionCalculator';
import { 
  cleanseSupplierStringsFromIngredients, 
  translateIngredientsToLanguage, 
  translateAllergenToLanguage, 
  translateStorageToLanguage, 
  translateUsageToLanguage,
  ensureKhmerProductName,
  getStandardKoreanProductName,
  cleanIngredientsToKhmerOnly
} from '../lib/ingredientTranslator';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PRODUCT_PRESETS } from '../data/productPresets';
import { getMayanyProductStory } from '../data/mayanyProductDescriptions';
import { 
  resolveMayanyProduct, 
  MAYANY_PRODUCT_REGISTRY, 
  CANONICAL_DOMAIN,
  buildCanonicalProductPassportUrl 
} from '../data/mayanyProductRegistry';
import { CERTIFICATE_TRANSLATIONS, CERTIFICATE_LANGUAGES } from '../lib/certificateTranslations';
import { formatEan13, ean13ToBinary } from '../utils/barcodeGenerator';
import MayanyLogo from './MayanyLogo';
import { MayanyRoyalGoldSeal } from './MayanyRoyalGoldSeal';
import { DEFAULT_DEDICATED_PRODUCTS } from './PitchDeckQuickQRs';

export interface ParsedIngredient {
  name: string;
  percent: number;
  badge: string;
  color: string;
}

export function parseIngredientsWithPercentages(
  ingredientsText: string,
  fallbackCashewPct = 92,
  fallbackSpice = '',
  fallbackSpicePct = 3,
  fallbackSugarPct = 3,
  fallbackSaltPct = 2,
  isFlour = false,
  isKhmer = true,
  langCode = 'kh'
): ParsedIngredient[] {
  let normLang = (langCode || (isKhmer ? 'km' : 'en')).toLowerCase();
  if (normLang === 'kh') normLang = 'km';
  if (!isKhmer && (normLang === 'km')) {
    normLang = 'en';
  }
  const isKhmerMode = isKhmer && (normLang === 'km');
  const lowerText = (ingredientsText || '').toLowerCase();
  const isCashewFlourProduct = Boolean(
    isFlour || (
      (lowerText.includes('ម្សៅគ្រាប់ស្វាយចន្ទី') || lowerText.includes('cashew flour') || lowerText.includes('cashew kernel flour')) &&
      !lowerText.includes('ទឹកដោះគោ') &&
      !lowerText.includes('milk') &&
      !lowerText.includes('ទឹកចម្រោះ') &&
      !lowerText.includes('water')
    )
  );

  if (isCashewFlourProduct) {
    let flourName = isKhmerMode ? 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%' : '100% Pure Cashew Kernel Flour';
    let flourBadge = isKhmerMode ? 'វត្ថុធាតុដើមសុទ្ធ ១០០%' : '100% Pure Raw Material';
    if (normLang === 'en' || normLang.startsWith('en')) {
      flourName = '100% Pure Cashew Kernel Flour';
      flourBadge = '100% Pure Raw Material';
    } else if (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko')) {
      flourName = '100% 순수 캄보디아산 캐슈넛 파우더 / 플라워';
      flourBadge = '100% 순수 원료';
    } else if (normLang === 'de') {
      flourName = '100% Reines Cashewkernmehl';
      flourBadge = '100% Reiner Rohstoff';
    } else if (normLang === 'zh' || normLang === 'cn') {
      flourName = '100% 纯正柬埔寨腰果仁粉';
      flourBadge = '100% 纯正天然原料';
    } else if (normLang === 'ja' || normLang === 'jp') {
      flourName = '100% 純粋カンボジア産カシューナッツフラワー';
      flourBadge = '100% 純粋原料';
    } else if (normLang === 'fr') {
      flourName = '100% Farine Pure de Noix de Cajou du Cambodge';
      flourBadge = '100% Matière Première Pure';
    }
    return [
      {
        name: flourName,
        percent: 100,
        badge: flourBadge,
        color: 'bg-amber-600'
      }
    ];
  }

  const khmerDigits: Record<string, string> = {
    '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4',
    '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9'
  };

  let raw = (ingredientsText || '').trim();
  // Strip leading prefixes like "គ្រឿងផ្សំ៖", "គ្រឿងផ្សំ:", "Ingredients:", "សមាសភាព៖"
  raw = raw.replace(/^(?:គ្រឿងផ្សំ|សមាសភាព|បញ្ជីគ្រឿងផ្សំ|Ingredients?|Composition)[:៖\s-]+/i, '').trim();

  let normalized = raw;
  Object.entries(khmerDigits).forEach(([k, v]) => {
    normalized = normalized.split(k).join(v);
  });

  // Split by any standard delimiter: comma, arabic comma, semicolon, bullet, newline, pipe, khmer fullstop (។), slash, plus
  const parts = normalized
    .split(/[,،;•\n\r|។/+]|(?:\s*[-–—]\s*)/)
    .map(p => p.trim())
    .filter(Boolean);

  const palette = [
    'bg-amber-600',
    'bg-rose-600',
    'bg-emerald-600',
    'bg-sky-700',
    'bg-slate-800',
    'bg-amber-700',
    'bg-indigo-600'
  ];

  const results: ParsedIngredient[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Extract percentage with or without % sign
    let match = part.match(/(\d+(?:\.\d+)?)\s*(?:%|ភាគរយ|pct)/i);
    if (!match) {
      // Check for trailing number like "ខ្ទឹមស 2" or "(2)"
      const trailingNum = part.match(/(?:^|[^\d])(\d+(?:\.\d+)?)\s*$/);
      if (trailingNum) match = trailingNum;
    }

    let pct = match ? parseFloat(match[1]) : 0;
    
    // Clean name without stripping product grades like WW180
    let name = part
      .replace(/\(?\s*\d+(?:\.\d+)?\s*(?:%|ភាគរយ|pct)\s*\)?/gi, '')
      .replace(/\s*\(\d+(?:\.\d+)?\)\s*/g, ' ')
      .replace(/^[\d១-៩០]+[.)\s-]+/, '')
      .replace(/^[:•\s-]+|[:•\s-]+$/g, '')
      .trim();
    if (match && !match[0].includes('%') && !match[0].includes('ភាគរយ')) {
      name = name.replace(new RegExp(`\\s*${match[1]}\\s*$`), '').trim();
    }

    if (isKhmerMode) {
      // 100% PURE KHMER: If Khmer characters exist, clean out English in parens or trailing text
      const hasKhmer = /[\u1780-\u17FF]/.test(name);
      if (hasKhmer) {
        name = name.replace(/\([A-Za-z0-9\s/&.-]+\)/g, '').trim();
        name = name.replace(/[A-Za-z]+.*$/g, '').trim();
        name = name.replace(/\s+/g, ' ');
      } else {
        // Pure English/Latin ingredient name - translate authentically to Khmer!
        const lowerName = name.toLowerCase();
        if (lowerName.includes('water') || lowerName.includes('aqua')) name = 'ទឹកចម្រោះ';
        else if (lowerName.includes('pandan')) name = 'ម្សៅស្លឹកតើយ';
        else if (lowerName.includes('cashew flour') || lowerName.includes('kernel flour')) name = 'ម្សៅគ្រាប់ស្វាយចន្ទី';
        else if (lowerName.includes('pepper') || lowerName.includes('piper')) name = 'ម្រេចខ្មៅកំពត GI';
        else if (lowerName.includes('chili') || lowerName.includes('capsicum')) name = 'ម្ទេសធម្មជាតិ';
        else if (lowerName.includes('sugar') || lowerName.includes('cane')) name = 'ស្ករ';
        else if (lowerName.includes('salt')) name = 'អំបិល';
        else if (lowerName.includes('garlic')) name = 'ខ្ទឹមសធម្មជាតិ';
        else if (lowerName.includes('cashew') || lowerName.includes('anacardium') || lowerName.includes('ws') || lowerName.includes('ww') || lowerName.includes('broken')) name = 'គ្រាប់ស្វាយចន្ទី';
        else name = cleanIngredientsToKhmerOnly(name) || 'គ្រឿងផ្សំធម្មជាតិ';
      }
    } else {
      // Multilingual mode: translate known Khmer terms or extract English inside brackets
      const engMatch = part.match(/\(([A-Za-z\s/&.-]+)\)/);
      if (engMatch && engMatch[1].trim()) {
        name = engMatch[1].trim();
      } else if (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko')) {
        if (name.includes('ទឹក') || name.toLowerCase().includes('water')) name = '정제수 (Purified Water)';
        else if (name.includes('ស្លឹកតើយ') || name.includes('ស្លឹកតយ') || name.toLowerCase().includes('pandan')) name = '천연 판단 분말 (Pandan Powder)';
        else if (name.includes('ម្សៅគ្រាប់ស្វាយចន្ទី') || name.toLowerCase().includes('cashew flour')) name = '100% 순수 캄보디아산 캐슈넛 파우더';
        else if (name.includes('ចន្ទី') || name.toLowerCase().includes('cashew') || name.includes('កម្ពុជា')) name = '캄보디아산 캐슈넛';
        else if (name.includes('ម្ទេស') || name.toLowerCase().includes('chili')) name = '천연 칠리';
        else if (name.includes('ម្រេច') || name.toLowerCase().includes('pepper')) name = '깜폿 흑후추 GI';
        else if (name.includes('ស្ករ') || name.toLowerCase().includes('sugar')) name = '정제 설탕 (Sugar)';
        else if (name.includes('អំបិល') || name.toLowerCase().includes('salt')) name = '깜폿 천일염 (Salt)';
        else if (name.includes('ខ្ទឹម') || name.toLowerCase().includes('garlic')) name = '신선한 천연 마늘';
        else name = '천연 원료';
      } else {
        if (name.includes('ទឹក') || name.toLowerCase().includes('water')) name = 'Purified Water';
        else if (name.includes('ស្លឹកតើយ') || name.includes('ស្លឹកតយ') || name.toLowerCase().includes('pandan')) name = 'Natural Pandan Leaf Powder';
        else if (name.includes('ម្សៅគ្រាប់ស្វាយចន្ទី') || name.toLowerCase().includes('cashew flour')) name = '100% Pure Cashew Kernel Flour';
        else if (name.includes('ចន្ទី') || name.toLowerCase().includes('cashew') || name.includes('កម្ពុជា')) name = 'Cambodian Cashew Kernels';
        else if (name.includes('ម្ទេស') || name.toLowerCase().includes('chili')) name = 'Natural Khmer Chili';
        else if (name.includes('ម្រេច') || name.toLowerCase().includes('pepper')) name = 'GI Kampot Black Pepper';
        else if (name.includes('ស្ករ') || name.toLowerCase().includes('sugar')) name = 'Refined Cane Sugar';
        else if (name.includes('អំបិល') || name.toLowerCase().includes('salt')) name = 'Kampot Sea Salt';
        else if (name.includes('ខ្ទឹម') || name.toLowerCase().includes('garlic')) name = 'Fresh Natural Garlic';
        else name = 'Natural Ingredient';
      }
    }

    if (!name) continue;

    let badge = isKhmerMode ? 'គ្រឿងផ្សំធម្មជាតិ' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '천연 원료' : 'Natural Ingredient');
    let color = palette[i % palette.length];

    if (name.includes('ទឹក') || name.toLowerCase().includes('water') || name.includes('정제수')) {
      badge = isKhmerMode ? 'ទឹកចម្រោះបរិសុទ្ធ' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '정제수' : 'Purified Water');
      color = 'bg-sky-600';
    } else if (name.includes('ស្លឹកតើយ') || name.includes('ស្លឹកតយ') || name.toLowerCase().includes('pandan') || name.includes('판단')) {
      badge = isKhmerMode ? 'ម្សៅស្លឹកតើយធម្មជាតិ' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '천연 판단 분말' : 'Natural Pandan Powder');
      color = 'bg-emerald-600';
    } else if (name.includes('ម្សៅគ្រាប់ស្វាយចន្ទី') || name.toLowerCase().includes('cashew flour') || name.toLowerCase().includes('kernel flour')) {
      badge = isKhmerMode ? 'វត្ថុធាតុដើមសុទ្ធ ១០០%' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '100% 순수 원료' : '100% Pure Raw Material');
      color = 'bg-amber-600';
    } else if (name.includes('ចន្ទី') || name.toLowerCase().includes('cashew') || name.includes('캐슈넛') || name.includes('កម្ពុជា')) {
      badge = isKhmerMode ? 'កសិផលចម្បងកម្ពុជា' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '주원료 캐슈넛' : 'Primary Cambodian Cashew');
      color = 'bg-amber-600';
    } else if (name.includes('ម្ទេស') || name.toLowerCase().includes('chili') || name.includes('칠리')) {
      badge = isKhmerMode ? 'ម្ទេសហឹរខ្មែរធម្មជាតិ' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '천연 매콤 칠리' : 'Natural Khmer Chili');
      color = 'bg-rose-600';
    } else if (name.includes('ម្រេច') || name.toLowerCase().includes('pepper') || name.includes('후추')) {
      badge = isKhmerMode ? 'ម្រេចខ្មៅកំពត GI' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '깜폿 흑후추 GI' : 'GI Kampot Black Pepper');
      color = 'bg-slate-800';
    } else if (name.includes('ខ្ទឹម') || name.toLowerCase().includes('garlic') || name.includes('마늘')) {
      badge = isKhmerMode ? 'ខ្ទឹមសធម្មជាតិ' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '천연 생마늘' : 'Fresh Natural Garlic');
      color = 'bg-emerald-600';
    } else if (name.includes('ស្ករ') || name.toLowerCase().includes('sugar') || name.includes('설탕') || name.includes('팜슈가')) {
      badge = isKhmerMode ? 'ស្ករត្នោត / ស្ករសចម្រាញ់' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '정제 설탕' : 'Refined / Palm Sugar');
      color = 'bg-amber-700';
    } else if (name.includes('អំបិល') || name.toLowerCase().includes('salt') || name.includes('천일염')) {
      badge = isKhmerMode ? 'អំបិលសមុទ្រកំពត' : (normLang === 'ko' || normLang === 'kr' || normLang.startsWith('ko') ? '깜폿 천일염' : 'Kampot Sea Salt');
      color = 'bg-sky-700';
    }

    results.push({
      name,
      percent: pct,
      badge,
      color
    });
  }

  // Handle percentages if unassigned or partial:
  const declaredTotal = results.reduce((acc, r) => acc + r.percent, 0);
  const unassigned = results.filter(r => r.percent === 0);

  if (unassigned.length > 0 && declaredTotal > 0 && declaredTotal < 100) {
    const share = Number(((100 - declaredTotal) / unassigned.length).toFixed(1));
    unassigned.forEach(r => { r.percent = share; });
  } else if (results.length > 0 && results.every(r => r.percent === 0)) {
    // Apportion intelligently among listed items so total is 100%
    if (results.length === 1) {
      results[0].percent = 100;
    } else if (results.length === 2) {
      results[0].percent = 90;
      results[1].percent = 10;
    } else if (results.length === 3) {
      const isPepperList = results.some(r => r.name.includes('ម្រេច') || r.name.toLowerCase().includes('pepper'));
      const isSugarList = results.some(r => r.name.includes('ស្ករ') || r.name.toLowerCase().includes('sugar'));
      if (isPepperList) {
        results[0].percent = 93;
        results[1].percent = 5;
        results[2].percent = 2;
      } else if (isSugarList) {
        results[0].percent = 90;
        results[1].percent = 8;
        results[2].percent = 2;
      } else {
        results[0].percent = 90;
        results[1].percent = 8;
        results[2].percent = 2;
      }
    } else if (results.length === 4) {
      results[0].percent = 92;
      results[1].percent = 4;
      results[2].percent = 2;
      results[3].percent = 2;
    } else {
      results[0].percent = 85;
      const rem = Number(((100 - 85) / (results.length - 1)).toFixed(1));
      for (let j = 1; j < results.length; j++) {
        results[j].percent = rem;
      }
    }
  }

  // If results is empty, return complete fallback
  if (results.length === 0) {
    const isChili = fallbackSpice.includes('ម្ទេស') || fallbackSpice.toLowerCase().includes('chili');
    const isPepper = fallbackSpice.includes('ម្រេច') || fallbackSpice.toLowerCase().includes('pepper');
    const isSugar = fallbackSugarPct > 0 || fallbackSpice.includes('ស្ករ');

    if (isChili) {
      return [
        {
          name: isKhmer ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា' : 'Cambodian Cashew Kernels',
          percent: 92,
          badge: isKhmer ? 'កសិផលចម្បងកម្ពុជា' : 'Primary Cambodian Cashew',
          color: 'bg-amber-600'
        },
        {
          name: isKhmer ? 'ម្ទេសហិរធម្មជាតិ' : 'Natural Khmer Chili',
          percent: 4,
          badge: isKhmer ? 'ម្ទេសហឹរខ្មែរធម្មជាតិ' : 'Natural Khmer Chili',
          color: 'bg-rose-600'
        },
        {
          name: isKhmer ? 'ខ្ទឹមសធម្មជាតិ' : 'Fresh Natural Garlic',
          percent: 2,
          badge: isKhmer ? 'ខ្ទឹមសធម្មជាតិ' : 'Fresh Natural Garlic',
          color: 'bg-emerald-600'
        },
        {
          name: isKhmer ? 'អំបិលសមុទ្រកំពត' : 'Kampot Sea Salt',
          percent: 2,
          badge: isKhmer ? 'អំបិលសមុទ្រកំពត' : 'Kampot Sea Salt',
          color: 'bg-sky-700'
        }
      ];
    }

    if (isPepper) {
      return [
        {
          name: isKhmer ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា' : 'Cambodian Cashew Kernels',
          percent: 93,
          badge: isKhmer ? 'កសិផលចម្បងកម្ពុជា' : 'Primary Cambodian Cashew',
          color: 'bg-amber-600'
        },
        {
          name: isKhmer ? 'ម្រេចខ្មៅកំពត GI YAS' : 'GI YAS Kampot Black Pepper 5%',
          percent: 5,
          badge: isKhmer ? 'ម្រេចខ្មៅកំពត GI' : 'GI Kampot Black Pepper',
          color: 'bg-slate-800'
        },
        {
          name: isKhmer ? 'អំបិលសមុទ្រកំពត' : 'Kampot Sea Salt',
          percent: 2,
          badge: isKhmer ? 'អំបិលសមុទ្រកំពត' : 'Kampot Sea Salt',
          color: 'bg-sky-700'
        }
      ];
    }

    if (isSugar) {
      return [
        {
          name: isKhmer ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា' : 'Cambodian Cashew Kernels',
          percent: 90,
          badge: isKhmer ? 'កសិផលចម្បងកម្ពុជា' : 'Primary Cambodian Cashew',
          color: 'bg-amber-600'
        },
        {
          name: isKhmer ? 'ស្ករត្នោតធម្មជាតិ' : 'Natural Palm Sugar',
          percent: 8,
          badge: isKhmer ? 'ស្ករត្នោតធម្មជាតិ' : 'Natural Palm Sugar',
          color: 'bg-amber-700'
        },
        {
          name: isKhmer ? 'អំបិលសមុទ្រកំពត' : 'Kampot Sea Salt',
          percent: 2,
          badge: isKhmer ? 'អំបិលសមុទ្រកំពត' : 'Kampot Sea Salt',
          color: 'bg-sky-700'
        }
      ];
    }

    return [
      {
        name: isKhmer ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា' : 'Cambodian Cashew Kernels',
        percent: fallbackCashewPct || 100,
        badge: isKhmer ? 'កសិផលចម្បងកម្ពុជា' : 'Primary Cambodian Cashew',
        color: 'bg-amber-600'
      }
    ];
  }

  return results;
}

function translateBotanicalRowToKhmer(row: string): string {
  if (!row) return '';
  if (/[\u1780-\u17FF]/.test(row)) return row;
  const lower = row.toLowerCase();
  if (lower.includes('flour') || lower.includes('powder')) {
    return 'ម្សៅគ្រាប់ស្វាយចន្ទីធម្មជាតិសុទ្ធ ១០០% (Anacardium occidentale)';
  }
  if ((lower.includes('broken') || lower.includes('split') || lower.includes('ws')) && lower.includes('pepper')) {
    return 'គ្រាប់ស្វាយចន្ទីបែក/ពុះកម្ពុជា • ម្រេចខ្មៅកំពត GI ៥% • កញ្ចប់បាតឈរ ៥០g';
  }
  if (lower.includes('pepper') || lower.includes('piper')) {
    return 'ស្រោបម្រេចខ្មៅកំពត GI ៥% បែបសិប្បកម្មប្រណិត (Piper nigrum)';
  }
  if (lower.includes('chili') || lower.includes('capsicum')) {
    return 'ស្រោបម្ទេសធម្មជាតិប្រណិត (Capsicum frutescens)';
  }
  if (lower.includes('sugar') || lower.includes('sweet')) {
    return 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្នោតធម្មជាតិ';
  }
  if (lower.includes('cashew') || lower.includes('anacardium')) {
    if (lower.includes('broken') || lower.includes('split') || lower.includes('ws')) {
      return 'គ្រាប់ស្វាយចន្ទីបែក/ពុះកម្ពុជា (Anacardium occidentale)';
    }
    if (lower.includes('bb')) {
      return 'គ្រាប់ស្វាយចន្ទីកម្ពុជា BB (Anacardium occidentale)';
    }
    return 'គ្រាប់ស្វាយចន្ទីកម្ពុជាសម្រិតសម្រាំង (Anacardium occidentale)';
  }
  return row;
}

interface ProductPassportProps {
  batch: Batch;
  suppliers: Supplier[];
  storySections: StorySection[];
  contactInfo: ContactInfo;
  isConsumerMode?: boolean;
  allBatches?: Batch[];
  onSelectBatch?: (batchId: string) => void;
}

export default function ProductPassport({
  batch,
  suppliers,
  storySections,
  contactInfo,
  isConsumerMode = false,
  allBatches = [],
  onSelectBatch
}: ProductPassportProps) {
  const { language: globalLang, setLanguage: setGlobalLanguage, dict, t } = useLanguage();
  const [activeSupplierId, setActiveSupplierId] = useState<string | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [verificationTime, setVerificationTime] = useState<string>('');
  const [showPrinter, setShowPrinter] = useState<boolean>(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string>('');
  const [printPersonId, setPrintPersonId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [activeDisclosureTab, setActiveDisclosureTab] = useState<'all' | 'stories' | 'pepper_cashew' | 'korean' | 'gallery'>('all');

  // Multilingual state: Khmer (default), English, Korean & Japanese (日本語)
  const [passportLang, setPassportLangState] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const urlLang = p.get('lang')?.toLowerCase() as AppLanguage | undefined;
      if (urlLang === 'km' || urlLang === 'kh' || urlLang === 'en' || urlLang === 'ko' || urlLang === 'ja') {
        return urlLang === 'kh' ? 'km' : urlLang;
      }
    }
    if (globalLang === 'ja') return 'ja';
    if (globalLang === 'ko') return 'ko';
    if (globalLang === 'en') return 'en';
    return 'km'; // Default to Khmer as requested!
  });
  
  const setPassportLang = (lang: AppLanguage) => {
    setPassportLangState(lang);
    setGlobalLanguage(lang);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {
        console.warn('Could not update url lang', e);
      }
    }
  };
  
  // Check if session exists for enterprise management vs external consumer scanning
  const hasActiveSession = typeof window !== 'undefined' && Boolean(localStorage.getItem('cashewtrace_user_session'));
  const isExplicitScanOrCert = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('view') === 'certificate' ||
    new URLSearchParams(window.location.search).has('cert') ||
    new URLSearchParams(window.location.search).has('certificate') ||
    new URLSearchParams(window.location.search).get('project') === 'passport' ||
    new URLSearchParams(window.location.search).get('mode') === 'passport'
  );
  // Strict Consumer Privacy & Certification Isolation:
  // When consumers scan the QR code, they ONLY have access to the official CS 001 Technical Certificate.
  // Internal platform data (farm supply-chain GPS polygons, internal pricing, ledger tabs) are strictly hidden.
  const effectiveConsumerMode = isConsumerMode || !hasActiveSession || isExplicitScanOrCert;

  // Tab within Digital Passport: 'passport' (Smart E-Label) | 'certificate' (Official Technical Certificate) | 'misti_citation' (MISTI references & study)
  // Per customer requirement: Official MISTI CS 001 Technical Certificate is the only document shown to consumers upon QR code scanning
  const [activeSubView, setActiveSubView] = useState<'passport' | 'certificate' | 'misti_citation'>(() => {
    if (effectiveConsumerMode) return 'certificate';
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const v = p.get('view') || p.get('tab') || p.get('sub');
      if (v === 'passport') return 'passport';
      if (v === 'misti' || v === 'misti_citation') return 'misti_citation';
    }
    return 'certificate'; // Customer lands directly on the verified certificate!
  });

  const isKhmer = passportLang === 'km' || passportLang === 'kh';

  // Dynamic Packaging Query Extraction
  const [packagingData, setPackagingData] = useState<{
    batch: string;
    product: string;
    flavor: string;
    nameKh: string;
    nameKo: string;
    nameJa?: string;
    descriptionJa?: string;
    ingredientsJa?: string;
    packageFormatJa?: string;
    grade: string;
    spice: string;
    spicePct: number;
    cashewPct: number;
    sugarPct: number;
    saltPct: number;
    weight: string;
    company: string;
    mfd: string;
    exp: string;
    scheme: string;
    origin: string;
    customIngredients: string;
    storage: string;
    allergen: string;
    description: string;
    healthBenefits?: string;
    instructionsForUse: string;
    botanical: string;
    stampDatesOnBag?: boolean;
    shelfLifeMonths?: number;
    isPackagingScan: boolean;
    ean13?: string;
    packageFormat?: string;
    nutrition?: NutritionFacts;
    selectedSuppliers?: string[];
    customLogo?: string;
  }>({
    batch: batch.batch_id,
    product: '100% Pure Cashew Kernel Flour',
    flavor: 'Pure Flour',
    nameKh: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%',
    nameKo: '100% 순수 캄보디아산 캐슈넛 파우더 (100% Pure Cashew Kernel Flour)',
    nameJa: '純カシューナッツ粉末 / ローストフラワー (100% Pure Cashew Flour)',
    grade: 'WW180',
    spice: '',
    spicePct: 0,
    cashewPct: 100,
    sugarPct: 0,
    saltPct: 0,
    weight: '200g',
    company: 'Mayany Enterprise',
    mfd: '',
    exp: '',
    scheme: 'cs001_standard',
    origin: 'Kingdom of Cambodia (កម្ពុជា)',
    customIngredients: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០%',
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម.',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី',
    description: '',
    healthBenefits: '',
    instructionsForUse: '',
    botanical: '100% Pure Cashew Kernel Flour (Anacardium occidentale) • 100% Natural, Grain-Free & Plant-Based',
    stampDatesOnBag: false,
    shelfLifeMonths: 9,
    isPackagingScan: false,
    ean13: '8842120010017',
    packageFormat: 'Food-Grade Packaging',
    nutrition: {
      energyKcal: '575',
      energyKj: '2400',
      totalFat: '46.0',
      saturatedFat: '9.0',
      transFat: '0.0',
      cholesterol: '0',
      sodium: '8',
      totalCarb: '30.0',
      dietaryFiber: '3.3',
      totalSugars: '6.0',
      addedSugars: '0.0',
      protein: '18.0',
      salt: '0.00'
    }
  });

  const [liveQrDataUrl, setLiveQrDataUrl] = useState<string>('');
  const [productNotFound, setProductNotFound] = useState<{ notFound: boolean; queryId: string }>({ notFound: false, queryId: '' });

  useEffect(() => {
    // Parse URL query parameters on mount or URL change
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const prodIdP = (params.get('prodId') || params.get('id') || '').trim();
      const pnumP = (params.get('pnum') || params.get('itemNum') || '').trim();
      const hasExplicitBatch = Boolean(params.get('batch') || params.get('b') || params.get('lot'));
      const batchP = (params.get('batch') || params.get('b') || params.get('lot') || '').trim();
      const ean13P = (params.get('ean') || params.get('barcode') || params.get('gtin') || '').trim();
      const prodKeyP = (params.get('prodKey') || params.get('productKey') || '').trim();
      const rawProdP = (params.get('product') || params.get('p') || params.get('prod') || '').trim();
      const prodNameP = (params.get('pname') || params.get('productName') || '').trim();
      const flavorP = params.get('flavor') || params.get('flv') || params.get('f') || '';
      const nameKhP = (params.get('nameKh') || params.get('name') || params.get('kh') || '').trim();
      const gradeP = params.get('grade') || params.get('grd') || '';
      const spiceP = params.get('spice') || '';
      const spicePctP = Number(params.get('spicePct')) || 0;
      const cashewPctP = Number(params.get('cashewPct')) || 0;
      const sugarPctP = Number(params.get('sugarPct')) || 0;
      const saltPctP = Number(params.get('saltPct')) || 0;
      const rawWeightP = (params.get('weight') || params.get('wt') || params.get('w') || '').trim();
      const companyP = (params.get('company') || params.get('comp') || '').trim() || 'Mayany Enterprise';
      const pkgP = (params.get('pkg') || params.get('pkgFormat') || params.get('container') || '').trim();
      const presetP = (params.get('preset') || '').trim();

      // 1. Authoritative resolution via Mayany Enterprise Certified Product Registry
      const registryMatch = resolveMayanyProduct(params);

      // Requirement B: If an explicit product query was passed but not matched in the registry, flag not found
      const isExplicitProductQuery = Boolean(rawProdP || prodIdP || (presetP && presetP !== 'default'));
      if (isExplicitProductQuery && !registryMatch) {
        setProductNotFound({ notFound: true, queryId: rawProdP || prodIdP || presetP || ean13P });
      } else {
        setProductNotFound({ notFound: false, queryId: '' });
      }

      // Retrieve cached snapshot or build from registryMatch
      let localSnap: any = null;
      if (registryMatch) {
        localSnap = {
          batch: batchP || registryMatch.batch,
          isMakeToOrder: registryMatch.id === 'cashew-milk-1l',
          product: registryMatch.nameEn,
          nameKh: registryMatch.nameKh,
          nameKo: registryMatch.nameKo,
          flavor: registryMatch.flavor,
          weight: registryMatch.weight,
          ean13: registryMatch.ean13,
          shelfLifeMonths: registryMatch.shelfLifeMonths,
          customIngredients: registryMatch.ingredientsKh,
          ingredients: registryMatch.ingredientsKh,
          cashewPct: registryMatch.cashewPct,
          spicePct: registryMatch.spicePct,
          sugarPct: registryMatch.sugarPct,
          saltPct: registryMatch.saltPct,
          spice: registryMatch.activeSpice,
          storage: registryMatch.storageKh,
          allergen: registryMatch.allergenKh,
          instructionsForUse: registryMatch.instructionsKh,
          nutrition: registryMatch.nutrition,
          company: 'Mayany Enterprise',
          origin: registryMatch.originKh,
          description: registryMatch.descriptionKh,
          packageFormat: registryMatch.packageFormatKh,
          selectedSuppliers: registryMatch.flavor === 'sugar' 
            ? ['Mirarth Agri Tech Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'] 
            : registryMatch.flavor === 'pepper' 
            ? ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'] 
            : registryMatch.flavor === 'chili' 
            ? ['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng'] 
            : registryMatch.flavor === 'pure_flour' 
            ? ['Mayany Enterprise', 'Mirarth Agri Tech Co., Ltd.'] 
            : ['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng']
        };
      }
      try {
        if (!localSnap) {
          const stored = (prodIdP && localStorage.getItem(`cashewtrace_passport_${prodIdP}`)) ||
                         (pnumP && localStorage.getItem(`cashewtrace_passport_prod_${pnumP}`)) ||
                         (ean13P && localStorage.getItem(`cashewtrace_passport_${ean13P}`)) ||
                         (batchP && rawWeightP && localStorage.getItem(`cashewtrace_passport_${batchP}_${rawWeightP.replace(/\s+/g, '')}`)) ||
                         (prodKeyP && localStorage.getItem(`cashewtrace_passport_${prodKeyP}`)) ||
                         (presetP && localStorage.getItem(`cashewtrace_passport_${presetP}`));
          if (stored) {
            const parsed = JSON.parse(stored);
            const targetW = (rawWeightP || '').toLowerCase().replace(/\s+/g, '');
            const snapW = (parsed.weight || '').toLowerCase().replace(/\s+/g, '');
            if (!targetW || !snapW || targetW === snapW) {
              localSnap = parsed;
            }
          }
        }
        
        if (!localSnap) {
          // Check dedicated products cache or fallback directly to DEFAULT_DEDICATED_PRODUCTS
          const dedicatedRaw = localStorage.getItem('cashewtrace_dedicated_products_v6') ||
                               localStorage.getItem('cashewtrace_dedicated_products_v5') ||
                               localStorage.getItem('cashewtrace_dedicated_products_v4');
          const dedicatedList: any[] = dedicatedRaw ? JSON.parse(dedicatedRaw) : DEFAULT_DEDICATED_PRODUCTS;
          
          const foundDedicated = dedicatedList.find(p => {
            if (prodIdP && (p.id === prodIdP || p.presetId === prodIdP)) return true;
            if (pnumP && String(p.productNumber) === pnumP) return true;
            if (ean13P && p.ean13 === ean13P) return true;
            if (batchP && rawWeightP) {
              const pWeight = (p.weight || '').toLowerCase().replace(/\s+/g, '');
              const qWeight = rawWeightP.toLowerCase().replace(/\s+/g, '');
              if (p.batch === batchP && pWeight === qWeight) return true;
            }
            if (prodKeyP && (p.id === prodKeyP || p.presetId === prodKeyP)) return true;
            if (presetP && p.presetId === presetP) return true;
            if (rawProdP && (p.nameEn?.toLowerCase() === rawProdP.toLowerCase() || p.id === rawProdP)) return true;
            if (batchP && p.batch === batchP) return true;
            return false;
          }) || DEFAULT_DEDICATED_PRODUCTS.find(p => {
            if (prodIdP && (p.id === prodIdP || p.presetId === prodIdP)) return true;
            if (pnumP && String(p.productNumber) === pnumP) return true;
            if (ean13P && p.ean13 === ean13P) return true;
            if (batchP && p.batch === batchP) return true;
            return false;
          });
            if (foundDedicated) {
              const cashewMatch = (foundDedicated.ingredientsKh || '').match(/(?:ចន្ទី|cashew)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
              const chiliMatch = (foundDedicated.ingredientsKh || '').match(/(?:ម្ទេស|chili)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
              const pepperMatch = (foundDedicated.ingredientsKh || '').match(/(?:ម្រេច|pepper)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
              const sugarMatch = (foundDedicated.ingredientsKh || '').match(/(?:ស្ករ|sugar)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
              const saltMatch = (foundDedicated.ingredientsKh || '').match(/(?:អំបិល|salt)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
              const toNum = (str: string | undefined, fallback: number) => {
                if (!str) return fallback;
                const khmerDigits: Record<string, string> = { '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4', '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9' };
                let s = str;
                Object.entries(khmerDigits).forEach(([k, v]) => { s = s.split(k).join(v); });
                const n = parseFloat(s);
                return isNaN(n) ? fallback : n;
              };

              // Sourcing partners resolution
              let rawSupps: string[] = foundDedicated.selectedSuppliers || [];
              if (!rawSupps || rawSupps.length === 0) {
                if (foundDedicated.flavor === 'chili') {
                  rawSupps = ['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng'];
                } else if (foundDedicated.flavor === 'sugar') {
                  rawSupps = ['Mirarth Agri Tech Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'];
                } else if (foundDedicated.flavor === 'pure_flour') {
                  rawSupps = ['Mayany Enterprise', 'Mirarth Agri Tech Co., Ltd.'];
                } else {
                  rawSupps = ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'];
                }
              }

              // Always ensure pepper and sugar products preserve Angkor Sugar
              if ((foundDedicated.flavor === 'pepper' || foundDedicated.flavor === 'sugar' || foundDedicated.productNumber === 2 || foundDedicated.productNumber === 3) && !rawSupps.some((s: string) => s.toLowerCase().includes('angkor') || s.includes('ស្ករ'))) {
                rawSupps = [...rawSupps, 'Angkor Sugar'];
              }

              const cleanSupps = rawSupps && foundDedicated.flavor === 'chili'
                ? rawSupps.filter((s: string) => !s.includes('BOH') && !s.includes('ម្រេច') && !s.toLowerCase().includes('pepper'))
                : rawSupps;

              // Guard against Product 3 vs Product 6 weight corruption
              let finalWeight = foundDedicated.weight;
              let finalEan = foundDedicated.ean13;
              let finalBatch = hasExplicitBatch ? (foundDedicated.batch || batchP) : 'Make-to-Order (Stamped on Package)';
              if (foundDedicated.id === 'ww180-sugar-pouch-50g' || foundDedicated.productNumber === 3) {
                if (finalWeight.includes('175') || finalEan === '8847116350085' || finalEan === '8847116350122') {
                  finalWeight = '50g';
                  finalEan = '8847116350023';
                }
              }

              localSnap = {
                batch: finalBatch,
                isMakeToOrder: !hasExplicitBatch,
                product: foundDedicated.nameEn,
                nameKh: foundDedicated.nameKh,
                flavor: foundDedicated.flavor,
                weight: finalWeight,
                ean13: finalEan,
                shelfLifeMonths: foundDedicated.shelfLifeMonths || 6,
                mfd: foundDedicated.mfd,
                exp: foundDedicated.exp,
                customIngredients: foundDedicated.ingredientsKh,
                ingredients: foundDedicated.ingredientsKh,
                cashewPct: toNum(cashewMatch?.[1], 92),
                spicePct: toNum(chiliMatch?.[1] || pepperMatch?.[1], 4),
                sugarPct: toNum(sugarMatch?.[1], 0),
                saltPct: toNum(saltMatch?.[1], 2),
                storage: foundDedicated.storage,
                allergen: foundDedicated.allergen,
                nutrition: foundDedicated.nutrition,
                company: foundDedicated.companyName || 'Mayany Enterprise',
                origin: 'Kingdom of Cambodia (កម្ពុជា)',
                selectedSuppliers: cleanSupps
              };
            }
          }
        if (!localSnap && !prodKeyP && !batchP && !presetP && !rawProdP) {
          const latest = localStorage.getItem('cashewtrace_latest_passport');
          if (latest) localSnap = JSON.parse(latest);
        }
      } catch (e) {
        console.warn('Could not read cached passport snapshot:', e);
      }

      const weightP = rawWeightP || localSnap?.weight || '50g';

      const stampP = params.get('stamp') === '1' || localSnap?.stampDatesOnBag === true;
      const shelfLifeP = Number(params.get('sl')) || localSnap?.shelfLifeMonths || 9;
      const rawMfdParam = params.get('mfd');
      const rawExpParam = params.get('exp');
      const mfdP = stampP ? '' : (rawMfdParam !== null ? rawMfdParam : (localSnap?.mfd !== undefined ? localSnap?.mfd : ''));
      const expP = stampP ? '' : (rawExpParam !== null ? rawExpParam : (localSnap?.exp !== undefined ? localSnap?.exp : ''));
      const schemeP = params.get('scheme') || localSnap?.scheme || 'cs001_standard';
      const originP = params.get('origin') || params.get('orig') || 'Kingdom of Cambodia (កម្ពុជា)';
      const ingredientsP = params.get('ingredients') || params.get('ing') || '';
      const storageP = params.get('storage') || params.get('stor') || '';
      const allergenP = params.get('allergen') || params.get('alg') || '';
      const descP = params.get('description') || params.get('desc') || '';
      const instructionsP = params.get('instructions') || params.get('use') || '';
      const botanicalP = params.get('botanical') || params.get('bot') || '';
      const langP = (params.get('lang') || '').toLowerCase();
      const viewP = (params.get('view') || params.get('v') || '').toLowerCase();

      if (viewP === 'cert' || viewP === 'certificate' || params.has('certificate') || params.has('cert')) {
        setActiveSubView('certificate');
      }

      if (langP) {
        if (langP.includes('ko') || langP.includes('korea')) {
          setPassportLang('ko');
        } else {
          setPassportLang('en');
        }
      }

      const lowerProd = (prodNameP || localSnap?.product || '').toLowerCase();
      const lowerKh = (nameKhP || localSnap?.nameKh || '').toLowerCase();
      const lowerRaw = (rawProdP || '').toLowerCase();
      const lowerFlv = (flavorP || localSnap?.flavor || '').toLowerCase();

      // Check explicit flavor categories first from registryMatch, product name, khmer text, flavor code, or batch code
      const isMilk = Boolean(
        registryMatch?.id === 'cashew-milk-1l' ||
        (!registryMatch && (
          prodIdP === 'cashew-milk-1l' ||
          params.get('preset') === 'cashew-milk-1l' ||
          presetP === 'cashew-milk-1l' ||
          ean13P === '8847116350054' ||
          flavorP === 'milk_natural' ||
          flavorP === 'cashew_milk' ||
          lowerFlv.includes('milk') ||
          lowerProd.includes('milk') ||
          lowerRaw.includes('milk') ||
          lowerKh.includes('ទឹកដោះគោ') ||
          batchP.toLowerCase().includes('cm-1l') ||
          batchP.toLowerCase().includes('mto-cm')
        ))
      );
      const isChili = !isMilk && (
        registryMatch?.flavor === 'chili' ||
        lowerProd.includes('chili') || 
        lowerRaw.includes('chili') ||
        lowerKh.includes('ម្ទេស') || 
        lowerFlv === 'chili' || 
        lowerFlv.includes('chili') || 
        batchP.toLowerCase().includes('ckc') || 
        batchP.toLowerCase().includes('chl') ||
        presetP.includes('chili')
      );
      const isPepper = !isMilk && !isChili && (
        registryMatch?.flavor === 'pepper' ||
        lowerProd.includes('pepper') || 
        lowerRaw.includes('pepper') ||
        lowerKh.includes('ម្រេច') || 
        (lowerKh.includes('កំពត') && !lowerKh.includes('អំបិល')) || 
        lowerFlv === 'pepper' || 
        lowerFlv.includes('pepper') || 
        batchP.toLowerCase().includes('pep') || 
        batchP.toLowerCase().includes('ckp') || 
        presetP.includes('pepper')
      );
      const isSugar = !isMilk && !isChili && !isPepper && (
        registryMatch?.flavor === 'sugar' ||
        lowerProd.includes('sugar') || 
        lowerRaw.includes('sugar') ||
        lowerKh.includes('ស្ករ') || 
        lowerFlv === 'sugar' || 
        lowerFlv.includes('sugar') || 
        batchP.toLowerCase().includes('sug') ||
        batchP.toLowerCase().includes('cks')
      );
      const isTomYum = !isMilk && !isChili && !isPepper && !isSugar && (
        lowerProd.includes('tom yum') || 
        lowerKh.includes('តុងយ៉ាំ') || 
        lowerKh.includes('tomyum') || 
        lowerFlv.includes('tom-yum')
      );
      const isHoney = !isMilk && !isChili && !isPepper && !isSugar && !isTomYum && (
        lowerProd.includes('honey') || 
        lowerKh.includes('ឃ្មុំ') || 
        lowerFlv.includes('honey')
      );
      const isRoasted = !isMilk && !isChili && !isPepper && !isSugar && !isTomYum && !isHoney && (
        lowerProd.includes('roasted') || 
        lowerKh.includes('លីង') || 
        lowerFlv.includes('roasted')
      );

      // Healthy Cashew Noodles check
      const isNoodle = !isMilk && Boolean(
        lowerProd.includes('noodle') || 
        lowerKh.includes('មី') || 
        lowerKh.includes('គុយទាវ') || 
        batchP.includes('NOODLE') ||
        lowerFlv === 'noodle'
      );

      // Cashew Flour is ONLY true if explicitly named flour/powder and NOT one of the seasoned kernel products or noodles above!
      const isFlour = !isMilk && !isNoodle && !isChili && !isPepper && !isSugar && !isTomYum && !isHoney && !isRoasted && Boolean(
        params.get('flour') === '1' ||
        params.get('isFlour') === '1' ||
        lowerProd.includes('flour') || 
        lowerProd.includes('powder') ||
        lowerRaw.includes('flour') || 
        lowerRaw.includes('powder') ||
        lowerKh.includes('ម្សៅ') ||
        batchP.includes('CKF') ||
        batchP.includes('FLR') ||
        (lowerFlv === 'pure_flour' && !lowerProd.includes('kernel') && !lowerProd.includes('chili') && !lowerProd.includes('pepper')) ||
        (ingredientsP && (ingredientsP.includes('ម្សៅ') || ingredientsP.toLowerCase().includes('flour'))) ||
        (localSnap?.customIngredients && (localSnap.customIngredients.includes('ម្សៅ') || localSnap.customIngredients.toLowerCase().includes('flour')))
      );

      // Check if this is a specialized packaging / SME batch
      const isSpecialPackaging = Boolean(
        flavorP || 
        nameKhP || 
        localSnap ||
        batchP.startsWith('MY-') || 
        batchP.startsWith('KH-') || 
        batchP.includes('PEP') || 
        batchP.includes('CKP') || 
        batchP.includes('SUG') || 
        batchP.includes('CKS') || 
        batchP.includes('CHL') ||
        batchP.includes('CKC') ||
        batchP.includes('CKF') ||
        batchP.includes('FLR') ||
        batchP.includes('NOODLE') ||
        params.get('mode') === 'passport' ||
        params.get('project') === 'passport'
      );

      // Detect kernel grade dynamically from param, local snapshot, or ingredient/botanical string
      const gradeRegex = /(WW\s*180|WW\s*210|WW\s*240|WW\s*320|WW\s*450|WS|LSP|LP|SP|BB)/i;
      const detectedGradeMatch = (ingredientsP || localSnap?.ingredients || localSnap?.customIngredients || botanicalP || localSnap?.botanical || '').match(gradeRegex);
      const activeGrade = isNoodle ? 'Cashew Flour Noodle' : (gradeP || localSnap?.grade || localSnap?.cashewGrade || (detectedGradeMatch ? detectedGradeMatch[0].toUpperCase().replace(/\s+/g, '') : 'WW180'));

      // Look up preset if provided in query params or inferred from flavor / batch
      const presetParam = params.get('preset') || params.get('prodKey')?.replace(/^prod_/, '') || params.get('prod')?.replace(/^prod_/, '') || '';
      let matchedPreset = presetParam ? PRODUCT_PRESETS.find(p => p.id === presetParam || p.id.includes(presetParam)) : null;
      if (!matchedPreset) {
        if (isMilk) matchedPreset = PRODUCT_PRESETS.find(p => p.id === 'cashew-milk-1l');
        else if (isNoodle) matchedPreset = PRODUCT_PRESETS.find(p => p.id === 'mayany-cashew-noodle-150g') || PRODUCT_PRESETS.find(p => p.id.includes('noodle'));
        else if (isChili) matchedPreset = PRODUCT_PRESETS.find(p => p.id === 'mayany-ww180-chili');
        else if (isPepper) matchedPreset = PRODUCT_PRESETS.find(p => p.id === 'mayany-ww180-pepper-5');
        else if (isSugar) matchedPreset = PRODUCT_PRESETS.find(p => p.id === 'mayany-ww180-sugar');
        else if (isFlour) matchedPreset = PRODUCT_PRESETS.find(p => p.id === 'cashew-powder-200g') || PRODUCT_PRESETS.find(p => p.id.includes('powder') && !p.id.includes('defatted'));
      }

      // Determine active flavor and product name
      let effectiveFlavor = isMilk ? 'cashew_milk' : (isNoodle ? 'noodle' : (isChili ? 'chili' : (isPepper ? 'pepper' : (isSugar ? 'sugar' : (isFlour ? 'pure_flour' : (flavorP || localSnap?.flavor || 'natural').toLowerCase())))));
      let koreanName = '캄보디아산 프리미엄 캐シュ넛';
      let defaultKhName = nameKhP || localSnap?.nameKh || matchedPreset?.nameKhmerDefault || 'គ្រាប់ស្វាយចន្ទីកែច្នៃគុណភាពខ្ពស់';
      let defaultIngredients = cleanseSupplierStringsFromIngredients(ingredientsP || localSnap?.ingredients || localSnap?.customIngredients || matchedPreset?.defaultIngredients || '');
      let defaultBotanical = botanicalP || localSnap?.botanical || '';
      let activeSpice = spiceP || localSnap?.spice || '';
      let activeSpicePct = spicePctP || localSnap?.spicePct || 0;
      let activeCashewPct = cashewPctP || localSnap?.cashewPct || 92;
      let activeSugarPct = sugarPctP || localSnap?.sugarPct || 0;
      let activeSaltPct = saltPctP || localSnap?.saltPct || 0;

      let resolvedEnglishProduct = prodNameP || localSnap?.product || matchedPreset?.nameEnglishDefault || '';
      let computedKhName = nameKhP || localSnap?.nameKh || matchedPreset?.nameKhmerDefault || '';

      if (isMilk) {
        koreanName = '100% 순수 식물성 프리미엄 캐슈넛 밀크 (100% Plant-Based Cashew Milk 1L)';
        defaultKhName = 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០%';
        computedKhName = 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០%';
        resolvedEnglishProduct = '100% Plant-Based Cashew Milk';
        effectiveFlavor = 'cashew_milk';
        defaultIngredients = 'ទឹកចម្រោះ 86%, គ្រាប់ស្វាយចន្ទី 12.9%, ស្ករ 0.86%, ម្សៅស្លឹកតើយ 0.13%, អំបិល 0.09%';
        defaultBotanical = 'Fresh Artisan Pressed Cambodian Cashew Milk (Anacardium occidentale) • 100% Plant-Based, Dairy-Free & Vegan';
        activeSpice = 'ម្សៅស្លឹកតើយ (Pandan)';
        activeSpicePct = 0.13;
        activeCashewPct = 12.9;
        activeSugarPct = 0.86;
        activeSaltPct = 0.09;
      } else if (isNoodle) {
        koreanName = '캄보디아산 프리미엄 캐슈넛 건면 (Healthy Cashew Nut Noodles)';
        if (!nameKhP && !localSnap?.nameKh) defaultKhName = matchedPreset?.nameKhmerDefault || 'មីគ្រាប់ស្វាយចន្ទីសុខភាពធម្មជាតិ';
        if (!computedKhName || !/[\u1780-\u17FF]/.test(computedKhName)) computedKhName = matchedPreset?.nameKhmerDefault || 'មីគ្រាប់ស្វាយចន្ទីសុខភាពធម្មជាតិ';
        if (!resolvedEnglishProduct) resolvedEnglishProduct = prodNameP || matchedPreset?.nameEnglishDefault || 'Healthy Cashew Flour Noodles';
        if (!defaultIngredients) defaultIngredients = matchedPreset?.defaultIngredients || 'ម្សៅស្រូវសាលីគុណភាពខ្ពស់ ៧០%, ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ Mayany ២៥%, អំបិលសមុទ្រកំពត ៣%, ទឹក ២%';
        if (!defaultBotanical) defaultBotanical = matchedPreset?.botanicalOrSubtext || 'Premium Cambodian Healthy Artisan Noodles with 25% Pure Cashew Kernel Flour • 150g Box/Bag';
        activeSpice = '';
        activeSpicePct = 0;
        activeCashewPct = 25;
        activeSugarPct = 0;
        activeSaltPct = 3;
      } else if (isChili) {
        koreanName = '칠리 코팅 매콤 캐슈넛 (Chili Coated Spicy Cashew)';
        if (!defaultKhName || defaultKhName.includes('ម្សៅ') || defaultKhName === 'គ្រាប់ស្វាយចន្ទីកែច្នៃគុណភាពខ្ពស់') {
          defaultKhName = 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរ';
        }
        if (!computedKhName || computedKhName.includes('ម្សៅ')) {
          computedKhName = 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរ';
        }
        if (!resolvedEnglishProduct || resolvedEnglishProduct.includes('Flour')) {
          resolvedEnglishProduct = 'Chili Coated Cashew Kernels';
        }
        if (!defaultIngredients) defaultIngredients = 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩២%, ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%';
        if (!defaultBotanical) defaultBotanical = 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរធម្មជាតិខ្មែរ (Capsicum frutescens)';
        
        // Parse actual percentage numbers from ingredients if provided
        const cashewMatch = defaultIngredients.match(/(?:ចន្ទី|cashew)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const chiliMatch = defaultIngredients.match(/(?:ម្ទេស|chili)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const saltMatch = defaultIngredients.match(/(?:អំបិល|salt)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const toNum = (str: string | undefined, fallback: number) => {
          if (!str) return fallback;
          const khmerDigits: Record<string, string> = { '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4', '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9' };
          let s = str;
          Object.entries(khmerDigits).forEach(([k, v]) => { s = s.split(k).join(v); });
          const n = parseFloat(s);
          return isNaN(n) ? fallback : n;
        };

        activeSpice = 'ម្ទេសហិរធម្មជាតិ';
        activeSpicePct = spicePctP || localSnap?.spicePct || toNum(chiliMatch?.[1], 4);
        activeCashewPct = cashewPctP || localSnap?.cashewPct || toNum(cashewMatch?.[1], 92);
        activeSugarPct = sugarPctP || localSnap?.sugarPct || 0;
        activeSaltPct = saltPctP || localSnap?.saltPct || toNum(saltMatch?.[1], 2);
      } else if (isPepper) {
        koreanName = '후추 코팅 프리미엄 캐슈넛 (Black Pepper Coated Cashew)';
        if (!defaultKhName || defaultKhName.includes('ម្សៅ') || defaultKhName === 'គ្រាប់ស្វាយចន្ទីកែច្នៃគុណភាពខ្ពស់') {
          defaultKhName = 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពតGI';
        }
        if (!computedKhName || computedKhName.includes('ម្សៅ')) {
          computedKhName = 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពតGI';
        }
        if (!resolvedEnglishProduct || resolvedEnglishProduct.includes('Flour')) {
          resolvedEnglishProduct = 'GI Kampot Black Pepper Coated Cashew Kernels';
        }
        if (!defaultIngredients) defaultIngredients = 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៣%, ម្រេចខ្មៅកំពត GI YAS ៥%, អំបិលសមុទ្រ ២%';
        if (!defaultBotanical) defaultBotanical = 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI YAS ៥% (Piper nigrum)';
        activeSpice = 'ម្រេចខ្មៅកំពត GI YAS';
        activeSpicePct = 5;
        activeCashewPct = 93;
        activeSugarPct = 0;
        activeSaltPct = 2;
      } else if (isSugar) {
        koreanName = '슈가 코팅 프리미엄 캐슈넛 (Sugar Coated Cashew)';
        if (!defaultKhName || defaultKhName.includes('ម្សៅ') || defaultKhName === 'គ្រាប់ស្វាយចន្ទីកែច្នៃគុណភាពខ្ពស់') {
          defaultKhName = 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ';
        }
        if (!computedKhName || computedKhName.includes('ម្សៅ')) {
          computedKhName = 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ';
        }
        if (!resolvedEnglishProduct || resolvedEnglishProduct.includes('Flour')) {
          resolvedEnglishProduct = 'Sugar coated cashew kernels';
        }
        if (!defaultIngredients) defaultIngredients = 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩០%, ស្ករត្នោតធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%';
        if (!defaultBotanical) defaultBotanical = 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្នោតធម្មជាតិកំពង់ស្ពឺ (Borassus flabellifer)';
        activeSpice = 'ស្ករត្នោតធម្មជាតិ';
        activeSpicePct = 8;
        activeCashewPct = 90;
        activeSugarPct = 8;
        activeSaltPct = 2;
      } else if (isFlour) {
        koreanName = '100% 순수 캄보디아산 캐슈넛 파우더 (100% Pure Cashew Kernel Flour)';
        if (!nameKhP && !localSnap?.nameKh) defaultKhName = matchedPreset?.nameKhmerDefault || 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%';
        if (!computedKhName || !/[\u1780-\u17FF]/.test(computedKhName)) computedKhName = matchedPreset?.nameKhmerDefault || 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%';
        if (!resolvedEnglishProduct) resolvedEnglishProduct = prodNameP || matchedPreset?.nameEnglishDefault || '100% Pure Cashew Kernel Flour';
        if (!defaultIngredients) defaultIngredients = matchedPreset?.defaultIngredients || 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០%';
        if (!defaultBotanical) defaultBotanical = matchedPreset?.botanicalOrSubtext || '100% Pure Cashew Kernel Flour (Anacardium occidentale) • 100% Natural, Grain-Free & Plant-Based';
        activeSpice = '';
        activeSpicePct = 0;
        activeCashewPct = 100;
        activeSugarPct = 0;
        activeSaltPct = 0;
      } else {
        koreanName = '캄보디아산 프리미엄 내추럴 캐슈넛 (Natural Cashew Kernel)';
        if (!nameKhP && !localSnap?.nameKh) defaultKhName = 'គ្រាប់ស្វាយចន្ទីធម្មជាតិកម្ពុជា';
        if (!computedKhName || !/[\u1780-\u17FF]/.test(computedKhName)) computedKhName = defaultKhName;
        if (!resolvedEnglishProduct) {
          resolvedEnglishProduct = (rawProdP && !rawProdP.startsWith('prod_') && !rawProdP.includes('-') ? rawProdP : 'Cashew Kernel');
        }
        if (!defaultIngredients) defaultIngredients = `គ្រាប់ស្វាយចន្ទីកម្ពុជា ${activeGrade} (100%)`;
        if (!defaultBotanical) defaultBotanical = 'គ្រាប់ស្វាយចន្ទីធម្មជាតិកម្ពុជាសម្រិតសម្រាំង (Anacardium occidentale)';
        activeSpice = '';
        activeSpicePct = 0;
        activeCashewPct = activeCashewPct || 100;
        activeSugarPct = 0;
        activeSaltPct = 0;
      }

      // If custom ingredients are inputted by user or loaded from preset, dynamically parse percentage ratios!
      if (defaultIngredients) {
        const khmerDigits: Record<string, string> = {
          '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4',
          '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9'
        };
        let normalized = defaultIngredients;
        Object.entries(khmerDigits).forEach(([k, v]) => {
          normalized = normalized.split(k).join(v);
        });

        const cashewMatch = normalized.match(/(?:គ្រាប់ស្វាយចន្ទី|ចន្ទី|cashew|cashews|kernel)[^\d%]*?(\d+(?:\.\d+)?)\s*%/i);
        const chiliMatch = normalized.match(/(?:ម្ទេស|chili|spicy)[^\d%]*?(\d+(?:\.\d+)?)\s*%/i);
        const pepperMatch = normalized.match(/(?:ម្រេច|ម្រេចកំពត|pepper)[^\d%]*?(\d+(?:\.\d+)?)\s*%/i);
        const sugarMatch = normalized.match(/(?:ស្ករ|sugar|palm sugar)[^\d%]*?(\d+(?:\.\d+)?)\s*%/i);
        const saltMatch = normalized.match(/(?:អំបិល|salt|sea salt)[^\d%]*?(\d+(?:\.\d+)?)\s*%/i);

        if (cashewMatch) activeCashewPct = parseFloat(cashewMatch[1]);
        if (chiliMatch) {
          activeSpice = 'ម្ទេសហិរធម្មជាតិ';
          activeSpicePct = parseFloat(chiliMatch[1]);
        } else if (pepperMatch) {
          activeSpice = 'ម្រេចខ្មៅកំពត GI YAS';
          activeSpicePct = parseFloat(pepperMatch[1]);
        }
        if (sugarMatch) activeSugarPct = parseFloat(sugarMatch[1]);
        if (saltMatch) activeSaltPct = parseFloat(saltMatch[1]);
      }

      const resolvedKhmerName = registryMatch ? registryMatch.nameKh : ensureKhmerProductName(computedKhName || defaultKhName, resolvedEnglishProduct);
      const isMilkDedicated = Boolean(
        registryMatch?.id === 'cashew-milk-1l' ||
        (!registryMatch && (
          prodIdP === 'cashew-milk-1l' ||
          pnumP === '9' ||
          presetP === 'cashew-milk-1l' ||
          flavorP === 'cashew_milk' ||
          (!isSugar && !isPepper && !isChili && (
            resolvedEnglishProduct.toLowerCase().includes('milk') ||
            resolvedEnglishProduct.toLowerCase().includes('drink') ||
            resolvedKhmerName.includes('ទឹកដោះគោ')
          )) ||
          (matchedPreset && matchedPreset.id === 'cashew-milk-1l')
        ))
      );
      const resolvedWeight = registryMatch ? registryMatch.weight : (isMilkDedicated ? '1L' : (rawWeightP || localSnap?.weight || weightP || '50g'));

      setPackagingData({
        batch: batchP || (registryMatch ? registryMatch.batch : (localSnap?.batch || batch.batch_id)),
        product: registryMatch ? registryMatch.nameEn : resolvedEnglishProduct,
        flavor: registryMatch
          ? (registryMatch.flavor === 'cashew_milk' ? 'cashew_milk' : registryMatch.flavor === 'sugar' ? 'Sugar Coated' : registryMatch.flavor === 'pepper' ? 'Pepper Coated' : registryMatch.flavor === 'chili' ? 'Chili Coated' : registryMatch.flavor === 'pure_flour' ? '' : registryMatch.flavor)
          : isMilkDedicated
          ? 'cashew_milk'
          : isNoodle
          ? 'Healthy Noodles'
          : isFlour 
          ? '' 
          : isChili
          ? 'Chili Coated'
          : isPepper
          ? 'Pepper Coated'
          : isSugar
          ? 'Sugar Coated'
          : isTomYum
          ? 'Tom Yum Coated'
          : isHoney
          ? 'Honey Glazed'
          : isRoasted
          ? 'Roasted'
          : (flavorP && flavorP !== 'roasted' && flavorP !== 'pure_flour' && flavorP !== 'natural' ? flavorP : (localSnap?.flavor && localSnap.flavor !== 'roasted' && localSnap.flavor !== 'pure_flour' ? localSnap.flavor : ((batchP.includes('PEP') || batchP.includes('CKP')) ? 'Pepper Coated' : (batchP.includes('SUG') || batchP.includes('CKS')) ? 'Sugar Coated' : (batchP.includes('CHL') || batchP.includes('CKC') || (prodNameP && prodNameP.toLowerCase().includes('chili'))) ? 'Chili Coated' : ''))),
        nameKh: resolvedKhmerName,
        nameKo: registryMatch ? registryMatch.nameKo : getStandardKoreanProductName(resolvedKhmerName, resolvedEnglishProduct, isFlour),
        nameJa: registryMatch ? registryMatch.nameJa : '',
        descriptionJa: registryMatch ? registryMatch.descriptionJa : '',
        ingredientsJa: registryMatch ? registryMatch.ingredientsJa : '',
        packageFormatJa: registryMatch ? registryMatch.packageFormatJa : '',
        grade: registryMatch ? registryMatch.grade : activeGrade,
        spice: isFlour ? '' : (registryMatch ? registryMatch.activeSpice : activeSpice),
        spicePct: isFlour ? 0 : (registryMatch ? registryMatch.spicePct : activeSpicePct),
        cashewPct: isFlour ? 100 : (registryMatch ? registryMatch.cashewPct : activeCashewPct),
        sugarPct: isFlour ? 0 : (registryMatch ? registryMatch.sugarPct : activeSugarPct),
        saltPct: isFlour ? 0 : (registryMatch ? registryMatch.saltPct : activeSaltPct),
        weight: resolvedWeight,
        company: companyP || localSnap?.company || 'Mayany Enterprise',
        stampDatesOnBag: stampP,
        shelfLifeMonths: registryMatch ? registryMatch.shelfLifeMonths : shelfLifeP,
        mfd: mfdP,
        exp: expP,
        scheme: schemeP,
        origin: originP || (registryMatch ? registryMatch.originKh : (localSnap?.origin || 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)')),
        customIngredients: registryMatch ? registryMatch.ingredientsKh : defaultIngredients,
        storage: storageP || (registryMatch ? registryMatch.storageKh : (localSnap?.storage || (isMilkDedicated ? 'រក្សាទុកក្នុងទូទឹកកកក្រោម ៤°C ក្រោយពេលបើក។ ក្រឡុកដបឱ្យសព្វមុនពេលទទួលទាន។' : 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ បិទគម្របឱ្យជិតក្រោយពេលបើក។'))),
        allergen: allergenP || (registryMatch ? registryMatch.allergenKh : (localSnap?.allergen || 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)')),
        description: descP || (registryMatch ? registryMatch.descriptionKh : (localSnap?.description || localSnap?.productDescription || (isMilkDedicated ? 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០% (Make-to-Order)។ តម្លាភាពតម្លៃសរុប ៤.៥០$ (ទឹកដោះគោ ៣.០០$ + ថ្លៃដបកែវ ១.៥០$)។ អតិថិជនអាចយកដបមកប្តូរទិញទឹកដោះគោលើកក្រោយក្នុងតម្លៃត្រឹមតែ ៣.០០$។' : matchedPreset?.productDescriptionKhmer || ''))),
        healthBenefits: params.get('benefits') || localSnap?.healthBenefits || matchedPreset?.healthBenefitsKhmer || '',
        instructionsForUse: instructionsP || (registryMatch ? registryMatch.instructionsKh : (localSnap?.instructionsForUse || matchedPreset?.instructionsForUse || '')),
        botanical: botanicalP || localSnap?.botanical || localSnap?.subheadingOrBotanical || defaultBotanical,
        isPackagingScan: isSpecialPackaging,
        selectedSuppliers: localSnap?.selectedSuppliers || [],
        ean13: (registryMatch ? registryMatch.ean13 : (ean13P || localSnap?.ean13 || matchedPreset?.ean13Default || '')),
        packageFormat: pkgP || (registryMatch ? registryMatch.packageFormatKh : (localSnap?.packageFormat || (isMilkDedicated ? 'ដបកែវ ១ លីត្រ (1L Glass Bottle)' : matchedPreset?.suggestedPackaging || ''))),
        nutrition: (registryMatch ? registryMatch.nutrition : (localSnap?.nutrition || (matchedPreset?.typicalNutrition ? matchedPreset.typicalNutrition : calculateNutritionFromRecipe(defaultIngredients).nutrition))),
        customLogo: (typeof window !== 'undefined' ? (localStorage.getItem('cashewtrace_sme_brand_logo') || undefined) : undefined) || localSnap?.customBrandLogo || localSnap?.logo || undefined
      });

      // Background sync from Firestore: check product ID, weight-specific batch, batch, product name, product key
      const lookupKeys = registryMatch ? [] : [prodIdP, (batchP && rawWeightP) ? `${batchP}_${rawWeightP.replace(/\s+/g, '')}` : '', pnumP ? `prod_${pnumP}` : '', batchP, prodNameP, prodKeyP, rawProdP, rawProdP ? `prod_${rawProdP}` : ''].filter(Boolean);
      const fetchPassportSnapshot = async () => {
        for (const key of lookupKeys) {
          try {
            // Guard with a 2-second timeout so slow/offline cellular connection never blocks the page
            const snapPromise = getDoc(doc(db, 'packaging_passports', key));
            const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
            const snap = await Promise.race([snapPromise, timeoutPromise]) as any;

            if (snap && typeof snap.exists === 'function' && snap.exists()) {
              const fsData = snap.data();
              setPackagingData(prev => {
                const rawIng = fsData.ingredients || fsData.customIngredients || prev.customIngredients;
                const ing = cleanseSupplierStringsFromIngredients(rawIng);
                const grd = fsData.grade || fsData.cashewGrade || prev.grade;
                const isFsStamp = fsData.stampDatesOnBag !== undefined ? fsData.stampDatesOnBag : prev.stampDatesOnBag;
                return {
                  ...prev,
                  batch: fsData.batch || prev.batch,
                  product: fsData.product || prev.product,
                  flavor: fsData.flavor || prev.flavor,
                  nameKh: fsData.nameKh || prev.nameKh,
                  grade: grd,
                  weight: fsData.weight || prev.weight,
                  stampDatesOnBag: isFsStamp,
                  shelfLifeMonths: fsData.shelfLifeMonths || prev.shelfLifeMonths,
                  mfd: isFsStamp ? '' : (fsData.mfd !== undefined ? fsData.mfd : prev.mfd),
                  exp: isFsStamp ? '' : (fsData.exp !== undefined ? fsData.exp : prev.exp),
                  company: fsData.company || prev.company,
                  origin: fsData.origin || prev.origin,
                  customIngredients: ing,
                  allergen: fsData.allergen || prev.allergen,
                  storage: fsData.storage || prev.storage,
                  instructionsForUse: fsData.instructionsForUse || prev.instructionsForUse,
                  description: fsData.description || fsData.productDescription || prev.description,
                  healthBenefits: fsData.healthBenefits || prev.healthBenefits,
                  botanical: fsData.botanical || fsData.subheadingOrBotanical || prev.botanical,
                  ean13: fsData.ean13 || prev.ean13,
                  selectedSuppliers: fsData.selectedSuppliers || prev.selectedSuppliers,
                  nutrition: fsData.nutrition || prev.nutrition,
                  cashewPct: fsData.cashewPct !== undefined ? fsData.cashewPct : prev.cashewPct,
                  spicePct: fsData.spicePct !== undefined ? fsData.spicePct : prev.spicePct,
                  sugarPct: fsData.sugarPct !== undefined ? fsData.sugarPct : prev.sugarPct,
                  saltPct: fsData.saltPct !== undefined ? fsData.saltPct : prev.saltPct,
                  customLogo: (fsData.customBrandLogo && fsData.customBrandLogo !== '/mayany_official_logo.jpg') 
                    ? fsData.customBrandLogo 
                    : (fsData.logo && fsData.logo !== '/mayany_official_logo.jpg' ? fsData.logo : prev.customLogo)
                };
              });
              break;
            }
          } catch (err) {
            console.info('Firestore passport lookup fallback for key', key, err);
          }
        }
      };
      if (lookupKeys.length > 0) {
        fetchPassportSnapshot();
      }

      // Generate Live QR code image of the current passport URL
      QRCode.toDataURL(window.location.href, {
        width: 480,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#ffffff' }
      }).then(url => setLiveQrDataUrl(url)).catch(() => {});
    }
  }, [batch.batch_id]);

  useEffect(() => {
    // Set a live-updating verification check timestamp
    const now = new Date();
    setVerificationTime(now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }));
  }, [batch.batch_id, packagingData.batch]);

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Read Aloud Text-to-Speech (TTS) Narration state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechLang, setSpeechLang] = useState<'km' | 'en'>('km');
  const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = (targetLang?: 'km' | 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('មុខងារអានសំឡេង Text-to-Speech មិនត្រូវបានគាំទ្រលើ Browser នេះទេ។ សូមប្រើប្រាស់ Google Chrome, Safari ឬ Edge។');
      return;
    }

    const currentLang = targetLang || speechLang;

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    window.speechSynthesis.cancel();

    const usageClauseKh = packagingData.instructionsForUse ? `របៀបប្រើប្រាស់ ឬ ទទួលទាន៖ ${packagingData.instructionsForUse}។ ` : '';
    const storageClauseKh = packagingData.storage ? `លក្ខខណ្ឌរក្សាទុក៖ ${packagingData.storage}។ ` : '';
    const allergenClauseKh = packagingData.allergen ? `ការណែនាំអាលែកហ្ស៊ី៖ ${packagingData.allergen}។ ` : '';

    const usageClauseEn = packagingData.instructionsForUse ? `Directions for use and preparation: ${packagingData.instructionsForUse}. ` : '';
    const storageClauseEn = packagingData.storage ? `Storage instructions: ${packagingData.storage}. ` : '';
    const allergenClauseEn = packagingData.allergen ? `Allergen warning: ${packagingData.allergen}. ` : '';

    const ingredientsSpeechKh = isFlour 
      ? 'ម្សៅគ្រាប់ស្វាយចន្ទីកម្ពុជាធម្មជាតិសុទ្ធ ១០០ ភាគរយ គ្មានបន្ថែមអំបិល គ្មានស្ករ គ្មានសារធាតុរក្សាទុក' 
      : (packagingData.customIngredients || 'គ្រាប់ស្វាយចន្ទីធម្មជាតិ');
    const ingredientsSpeechEn = isFlour
      ? 'Pure 100% Cambodian Cashew Kernel Flour, zero added salt, zero sugar, no preservatives'
      : (packagingData.customIngredients || 'Selected Cambodian Cashews');

    const dateSpeechKh = `កាលបរិច្ឆេទផលិត និងផុតកំណត់ ត្រូវបានបោះត្រាផ្ទាល់លើកញ្ចប់វេចខ្ចប់ជាក់ស្តែង, អាយុកាលរក្សាទុក ${packagingData.shelfLifeMonths || 6} ខែ, លេខឡូតិ៍៖ ${packagingData.batch}។`;

    const dateSpeechEn = `Production and Expiry dates are stamped directly on the packaging bag, shelf life ${packagingData.shelfLifeMonths || 6} months, Batch Lot: ${packagingData.batch}.`;

    const textToRead = currentLang === 'km'
      ? `ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ។ វិញ្ញាបនបត្របច្ចេកទេសគុណភាពកសិផលស្តង់ដារជាតិ CS 001។ ឈ្មោះផលិតផល៖ ${packagingData.nameKh}។ ផលិតដោយ៖ ${packagingData.company || 'Mayany Enterprise'}។ ប្រភពដើម៖ ព្រះរាជាណាចក្រកម្ពុជា។ គ្រឿងផ្សំ៖ ${ingredientsSpeechKh}។ ${allergenClauseKh}${usageClauseKh}${storageClauseKh}ព័ត៌មានអាហារូបត្ថម្ភ៖ កាឡូរី ${packagingData.nutrition?.energyKcal || '410'} គីឡូកាឡូរី, ប្រូតេអ៊ីន ${packagingData.nutrition?.protein || '26.0'} ក្រាម, ខ្លាញ់ ${packagingData.nutrition?.totalFat || '14.0'} ក្រាម។ ${dateSpeechKh} ទំនាក់ទំនង៖ ទូរស័ព្ទ តេឡេក្រាម និងវ៉ាត់សាប់ លេខ +855 88 771 2862, អ៊ីមែល mayany@mayanyenterprise.com, គេហទំព័រ mayanyenterprise.com, ហ្វេសប៊ុក Mayany Enterprise។ វិញ្ញាបនបត្រឌីជីថលនេះបញ្ជាក់ពីប្រភពកសិករខ្មែរ ១០០ ភាគរយ មានប្រព័ន្ធបញ្ជាក់គុណភាពស្តង់ដារ CS 001 ច្បាស់លាស់។`
      : `Kingdom of Cambodia, Nation Religion King. Official Technical Certificate of Conformance under National Standard CS 001. Product: ${packagingData.product || packagingData.nameKh}. Produced by ${packagingData.company || 'Mayany Enterprise'}. Country of Origin: Kingdom of Cambodia. Ingredients: ${ingredientsSpeechEn}. ${allergenClauseEn}${usageClauseEn}${storageClauseEn}Nutritional profile: Energy ${packagingData.nutrition?.energyKcal || '410'} kilocalories, Protein ${packagingData.nutrition?.protein || '26.0'} grams, Fats ${packagingData.nutrition?.totalFat || '14.0'} grams. ${dateSpeechEn} Official Contacts: Telephone, Telegram, and WhatsApp at +855 88 771 2862, Email mayany@mayanyenterprise.com, Website mayanyenterprise.com, Facebook Page Mayany Enterprise. This digital certificate authenticates genuine Cambodian smallholder cashew origin with full conformance to CS 001 food packaging standards.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.lang = currentLang === 'km' ? 'km-KH' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const targetPrefix = currentLang === 'km' ? 'km' : 'en';
    const foundVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));
    if (foundVoice) {
      utterance.voice = foundVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setShowAudioPlayer(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
    setShowAudioPlayer(true);
  };

  const handleStopSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleChangeSpeechLang = (newLang: 'km' | 'en') => {
    setSpeechLang(newLang);
    if (isSpeaking) {
      handleStopSpeak();
      setTimeout(() => handleToggleSpeak(newLang), 100);
    }
  };

  const handleChangeSpeechRate = (newRate: number) => {
    setSpeechRate(newRate);
    if (isSpeaking && !isPaused) {
      handleStopSpeak();
      setTimeout(() => handleToggleSpeak(), 100);
    }
  };

  // Excel serial date to readable date
  const parseExcelDate = (excelDate: number) => {
    const base = new Date(Date.UTC(1899, 11, 30));
    const msInDay = 24 * 60 * 60 * 1000;
    const date = new Date(base.getTime() + excelDate * msInDay);
    
    const khmerMonths = [
      'មករា (Jan)', 'កុម្ភៈ (Feb)', 'មីនា (Mar)', 'មេសា (Apr)',
      'ឧសភា (May)', 'មិថុនា (Jun)', 'កក្កដា (Jul)', 'សីហា (Aug)',
      'កញ្ញា (Sep)', 'តុលា (Oct)', 'វិច្ឆិកា (Nov)', 'ធ្នូ (Dec)'
    ];
    
    const day = date.getUTCDate();
    const month = khmerMonths[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    
    return `${day} ${month} ${year}`;
  };

  const isFlour = Boolean(
    packagingData.product.toLowerCase().includes('flour') || 
    packagingData.product.toLowerCase().includes('powder') || 
    packagingData.flavor === 'Pure Flour' || 
    packagingData.nameKh.includes('ម្សៅ') || 
    packagingData.customIngredients.includes('ម្សៅ')
  );

  const isNoodle = Boolean(
    packagingData.product.toLowerCase().includes('noodle') || 
    packagingData.flavor.toLowerCase().includes('noodle') || 
    packagingData.nameKh.includes('មី') || 
    packagingData.nameKh.includes('គុយទាវ') || 
    packagingData.customIngredients.includes('មី') ||
    packagingData.batch.includes('NOODLE')
  );

  const isPepper = Boolean(
    packagingData.flavor?.toLowerCase().includes('pepper') ||
    packagingData.product?.toLowerCase().includes('pepper') ||
    packagingData.nameKh?.includes('ម្រេច') ||
    packagingData.customIngredients?.includes('ម្រេច') ||
    packagingData.spice?.toLowerCase().includes('pepper') ||
    packagingData.spice?.includes('ម្រេច')
  );

  const isChili = Boolean(
    packagingData.flavor?.toLowerCase().includes('chili') ||
    packagingData.product?.toLowerCase().includes('chili') ||
    packagingData.nameKh?.includes('ម្ទេស') ||
    packagingData.customIngredients?.includes('ម្ទេស') ||
    packagingData.spice?.toLowerCase().includes('chili') ||
    packagingData.spice?.includes('ម្ទេស')
  );

  const isSugar = Boolean(
    packagingData.flavor?.toLowerCase().includes('sugar') ||
    packagingData.product?.toLowerCase().includes('sugar') ||
    packagingData.nameKh?.includes('ស្ករ') ||
    packagingData.customIngredients?.includes('ស្ករ') ||
    packagingData.batch?.includes('CKS')
  );

  const userCustomDesc = (packagingData.description && packagingData.description.trim()) || '';
  const isDescKhmer = Boolean(userCustomDesc && /[\u1780-\u17FF]/.test(userCustomDesc));

  const passportStoryData = getMayanyProductStory(packagingData.nameKh, packagingData.product, passportLang);

  const parsedIngredientList = parseIngredientsWithPercentages(
    packagingData.customIngredients,
    packagingData.cashewPct,
    packagingData.spice,
    packagingData.spicePct,
    packagingData.sugarPct,
    packagingData.saltPct,
    isFlour,
    isKhmer,
    passportLang
  );

  const maskNationalId = (id: number | undefined) => {
    if (!id) return 'N/A';
    const str = id.toFixed(0);
    if (str.length < 5) return str;
    return `${str.slice(0, 3)}****${str.slice(-2)}`;
  };

  const translateProvince = (engProv: string) => {
    const map: Record<string, string> = {
      'BATTAMBANG': 'បាត់ដំបង / Battambang',
      'KAMPONG SPEU': 'កំពង់ស្ពឺ / Kampong Speu',
      'BATTAMBANG, KAMPONG SPEU': 'បាត់ដំបង & កំពង់ស្ពឺ / Battambang & Kampong Speu',
      'KAMPONG THOM': 'កំពង់ធំ / Kampong Thom',
      'KRATIE': 'ក្រចេះ / Kratie',
      'PREAH VIHEAR': 'ព្រះវិហារ / Preah Vihear',
      'SIEM REAP': 'សៀមរាប / Siem Reap',
      'MONDULKIRI': 'មណ្ឌលគិរី / Mondulkiri',
      'RATANAKIRI': 'រតនគិរី / Ratanakiri',
      'PURSAT': 'ពោធិ៍សាត់ / Pursat'
    };
    return map[engProv?.toUpperCase()] || engProv || 'Cambodia';
  };

  // Mass Balance Calculation for farm batch view
  const totalInput = batch.total_input_kg || 1;
  const ingredientsBreakdown = batch.sourcing_records.map((record) => {
    const percentage = totalInput > 0 ? (record.quantity_kg / totalInput) * 100 : 0;
    return {
      name: record.supplier_name,
      id: record.ct_id,
      kg: record.quantity_kg,
      percent: percentage,
      province: record.province
    };
  });

  let cumulativePercentage = 0;
  const donutSlices = ingredientsBreakdown.map((ing, idx) => {
    const startAngle = cumulativePercentage;
    cumulativePercentage += ing.percent;
    const strokeDasharray = `${ing.percent} ${100 - ing.percent}`;
    const strokeDashoffset = 100 - startAngle + 25;
    const colors = ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];
    const hoverColors = ['#059669', '#D97706', '#2563EB', '#DB2777', '#7C3AED'];
    return {
      ...ing,
      strokeDasharray,
      strokeDashoffset,
      color: colors[idx % colors.length],
      hoverColor: hoverColors[idx % hoverColors.length],
    };
  });

  if (productNotFound.notFound) {
    return (
      <div id="product-passport" className="space-y-6 font-sans text-slate-900 pb-16 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-amber-300 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
            <AlertCircle size={36} />
          </div>
          
          <div className="space-y-2 max-w-lg mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
              Notice: Product Not Found
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-sans">
              {isKhmer ? 'រកមិនឃើញវិញ្ញាបនបត្រផលិតផលនេះទេ' : 'Product Certificate Not Found'}
            </h2>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              {isKhmer 
                ? `កូដផលិតផល ឬកូដ QR "${productNotFound.queryId}" មិនមាននៅក្នុងបញ្ជីផលិតផលផ្លូវការរបស់ Mayany Enterprise ឡើយ។ សូមជ្រើសរើសផលិតផលខាងក្រោមដើម្បីពិនិត្យវិញ្ញាបនបត្រត្រឹមត្រូវ៖` 
                : `The product identifier or QR code link "${productNotFound.queryId}" was not found in Mayany Enterprise's registered product catalog. Please select a verified product certificate below:`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
            <a
              href="?mode=passport&batch=2026-cks-261j&product=sugar-jar-175g&view=certificate&project=passport"
              className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 transition flex items-center gap-3 group"
            >
              <span className="text-2xl">🍯</span>
              <div>
                <h4 className="font-bold text-sm text-slate-950 group-hover:text-amber-800">
                  គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (175g Jar)
                </h4>
                <p className="text-xs text-slate-500 font-mono">Sugar Coated • EAN: 8847116350085</p>
              </div>
            </a>

            <a
              href="?mode=passport&batch=MTO-CM-1L&product=cashew-milk-1l&view=certificate&project=passport"
              className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition flex items-center gap-3 group"
            >
              <span className="text-2xl">🥛</span>
              <div>
                <h4 className="font-bold text-sm text-slate-950 group-hover:text-emerald-800">
                  ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០% (1L Bottle)
                </h4>
                <p className="text-xs text-slate-500 font-mono">100% Plant-Based • EAN: 8847116350054</p>
              </div>
            </a>

            <a
              href="?mode=passport&batch=2026-ckp-261j&product=pepper-jar-175g&view=certificate&project=passport"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-300 transition flex items-center gap-3 group"
            >
              <span className="text-2xl">🫘</span>
              <div>
                <h4 className="font-bold text-sm text-slate-950 group-hover:text-slate-800">
                  គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពត GI (175g Jar)
                </h4>
                <p className="text-xs text-slate-500 font-mono">GI Kampot Pepper • EAN: 8847116350061</p>
              </div>
            </a>

            <a
              href="?mode=passport&batch=2026-ckc-261j&product=chili-jar-175g&view=certificate&project=passport"
              className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 transition flex items-center gap-3 group"
            >
              <span className="text-2xl">🌶️</span>
              <div>
                <h4 className="font-bold text-sm text-slate-950 group-hover:text-rose-800">
                  គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (175g Jar)
                </h4>
                <p className="text-xs text-slate-500 font-mono">Chili Coated • EAN: 8847116350092</p>
              </div>
            </a>
          </div>

          <div className="pt-2">
            <a
              href="/?project=store"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
            >
              <span>{isKhmer ? 'ត្រឡប់ទៅទំព័រទំនិញ Mayany Store' : 'Return to Mayany Enterprise Store'}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="product-passport" className="space-y-6 font-sans text-slate-900 pb-16">
      
      {/* TOP NAVIGATION & VERIFICATION STATUS BAR */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-400" />
                <span>{effectiveConsumerMode ? 'វិញ្ញាបនបត្របច្ចេកទេសផលិតផល & វេចខ្ចប់ CS 001 ផ្លូវការ' : 'លិខិតឆ្លងដែនឌីជីថលស្តង់ដារជាតិ (MISTI CS 001 Verified Digital Passport)'}</span>
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                ឡូត៍ (LOT): {packagingData.batch}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {effectiveConsumerMode
                ? 'ឯកសារផ្ទៀងផ្ទាត់គុណភាព និងការនាំចេញស្តង់ដារជាតិ CS 001:2000'
                : 'លិខិតឆ្លងដែនវេចខ្ចប់ឌីជីថល និងតារាងយោងស្តង់ដារជាតិ (Digital Product Passport & MISTI Citation)'}
            </h2>
          </div>
        </div>

        {/* Action Buttons: Multi-Market Language Selector & Share */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Multilingual Selector: English & Korean */}
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setPassportLang('en')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                passportLang === 'en' ? 'bg-amber-400 text-slate-950 shadow-sm font-black' : 'text-slate-300 hover:text-white'
              }`}
              title="English (International & Global)"
            >
              <span>🌐 English</span>
            </button>
            <button
              type="button"
              onClick={() => setPassportLang('ko')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                passportLang === 'ko' ? 'bg-amber-400 text-slate-950 shadow-sm font-black' : 'text-slate-300 hover:text-white'
              }`}
              title="한국어 (Korean Market)"
            >
              <span>🇰🇷 한국어</span>
            </button>
          </div>

          {/* Share / Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Copy Public Scannable Passport Link"
          >
            {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedLink ? 'បានចម្លង Link (Copied)' : 'ចម្លង Link (Copy Link)'}</span>
          </button>
        </div>
      </div>

      {/* SCANNED FROM PACKAGING QUICK VERIFICATION BANNER */}
      {packagingData.isPackagingScan && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-4 sm:p-5 rounded-3xl border-2 border-emerald-500/50 shadow-xl space-y-3.5 animate-fade-in no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0 border border-emerald-500/30">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                    ✓ បានផ្ទៀងផ្ទាត់កូដ QR ពីស្លាកវេចខ្ចប់ដោយជោគជ័យ
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono font-bold">
                    VERIFIED QR SCAN
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  LOT: <strong className="text-amber-300">{packagingData.batch}</strong> • {packagingData.nameKh} ({packagingData.weight})
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleToggleSpeak()}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isSpeaking
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black'
                }`}
                title="អានឮៗ / Read Aloud Audio Narration"
              >
                {isSpeaking ? (isPaused ? <Play size={15} /> : <Pause size={15} />) : <Volume2 size={15} />}
                <span>{isSpeaking ? (isPaused ? 'បន្ត (Resume)' : 'ផ្អាក (Pause)') : 'អានឮៗ (Audio 🔊)'}</span>
              </button>
              {effectiveConsumerMode ? (
                <span className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-400 text-slate-950 shadow-md flex items-center gap-1.5">
                  <ShieldCheck size={15} />
                  <span>វិញ្ញាបនបត្រផ្លូវការ (Official CS 001)</span>
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveSubView('certificate')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeSubView === 'certificate'
                        ? 'bg-emerald-400 text-slate-950 font-black shadow-md'
                        : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/40'
                    }`}
                  >
                    <ShieldCheck size={15} />
                    <span>មើលវិញ្ញាបនបត្រ (View Certificate)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubView('passport')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeSubView === 'passport'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Tag size={15} />
                    <span>មើលស្លាក E-Label</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Consumer Language Choice Bar upon QR Scan */}
          <div className="pt-2.5 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-bold text-amber-300">
                🌐 ជ្រើសរើសភាសារបស់អ្នក / Choose Your Language:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {CERTIFICATE_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setPassportLang(l.code as AppLanguage)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    passportLang === l.code
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                  title={l.nativeName}
                >
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3-TAB SUBVIEW SELECTOR: Hidden for consumers so they only see the official verified Certificate */}
      {!effectiveConsumerMode && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 no-print">
          <button
            type="button"
            onClick={() => setActiveSubView('passport')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold font-sans transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubView === 'passport'
                ? 'bg-white text-slate-950 shadow-md border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Tag size={15} className={activeSubView === 'passport' ? 'text-amber-500' : 'text-slate-400'} />
            <span>១. ស្លាកឌីជីថល (Smart E-Label)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('certificate')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold font-sans transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubView === 'certificate'
                ? 'bg-white text-slate-950 shadow-md border border-slate-200 ring-2 ring-emerald-400/40 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck size={15} className={activeSubView === 'certificate' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>២. វិញ្ញាបនបត្របច្ចេកទេស (Certificate)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('misti_citation')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold font-sans transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubView === 'misti_citation'
                ? 'bg-white text-slate-950 shadow-md border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen size={15} className={activeSubView === 'misti_citation' ? 'text-blue-600' : 'text-slate-400'} />
            <span>៣. តារាងយោងច្បាប់ MISTI</span>
          </button>
        </div>
      )}

      {/* VIEW 1: SMART E-LABEL & DIGITAL PRODUCT PASSPORT (FOR INTERNAL ENTERPRISE MANAGERS ONLY) */}
      {!effectiveConsumerMode && activeSubView === 'passport' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* MAIN PRODUCT PASSPORT CARD */}
          <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-xl overflow-hidden">
            
            {/* Card Header with Golden Crest & Title */}
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-amber-400">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-950 text-amber-300 text-[10px] font-mono font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {packagingData.flavor && 
                     packagingData.flavor.toLowerCase() !== 'roasted' && 
                     packagingData.flavor.toLowerCase() !== 'natural' && 
                     packagingData.flavor.toLowerCase() !== 'pure' 
                      ? `${packagingData.flavor} • ` 
                      : ''}{formatWeightBadge(packagingData.weight)}
                  </span>
                  <span className="bg-white/80 text-slate-900 text-[10px] font-mono font-bold px-2 py-1 rounded-full">
                    LOT: {packagingData.batch}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-serif">
                  {passportLang === 'ko' 
                    ? packagingData.nameKo 
                    : passportLang === 'en' 
                    ? (packagingData.flavor && 
                       packagingData.flavor.toLowerCase() !== 'roasted' && 
                       packagingData.flavor.toLowerCase() !== 'natural' && 
                       packagingData.flavor.toLowerCase() !== 'pure' && 
                       packagingData.flavor.toLowerCase() !== 'pure flour' &&
                       !packagingData.product.toLowerCase().includes(packagingData.flavor.toLowerCase())
                        ? `${packagingData.product} - ${packagingData.flavor}` 
                        : packagingData.product)
                    : packagingData.nameKh}
                </h1>

                {/* 2-Row Botanical & Flavor Subtitle */}
                {packagingData.botanical && (() => {
                  const rows = formatBotanicalRows(packagingData.botanical);
                  return (
                    <div className="bg-slate-950/10 border border-slate-950/15 rounded-xl px-3.5 py-2.5 text-left space-y-1 font-sans shadow-inner">
                      <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-950/80 flex items-center gap-1.5 font-mono">
                        <span>🌿 ឈ្មោះវិទ្យាសាស្ត្រ & អនុចំណងជើង (Botanical / Flavor Subtitle)</span>
                      </div>
                      {rows[0] && (
                        <div className="text-xs sm:text-sm font-black text-slate-950 leading-snug">
                          {isKhmer ? translateBotanicalRowToKhmer(rows[0]) : rows[0]}
                        </div>
                      )}
                      {rows[1] && (
                        <div className="text-xs sm:text-sm font-extrabold text-emerald-950 leading-snug">
                          {isKhmer ? translateBotanicalRowToKhmer(rows[1]) : rows[1]}
                        </div>
                      )}
                    </div>
                  );
                })()}
                
                <div className="text-xs sm:text-sm font-bold text-slate-900 font-sans flex flex-wrap items-center gap-2">
                  <span>{isKhmer ? (packagingData.nameKh || ensureKhmerProductName(packagingData.nameKh, packagingData.product)) : packagingData.product}</span>
                  <span>•</span>
                  <span>{isKhmer ? (packagingData.flavor?.toLowerCase().includes('pepper') || packagingData.nameKh?.includes('ម្រេច') ? 'ម្រេចខ្មៅកំពត GI ៥%' : packagingData.flavor?.toLowerCase().includes('chili') ? 'ម្ទេសធម្មជាតិ' : packagingData.flavor?.toLowerCase().includes('sugar') ? 'ស្ករត្នោតធម្មជាតិ' : packagingData.flavor) : packagingData.flavor}</span>
                  <span>•</span>
                  <span className="text-slate-800">{packagingData.company}</span>
                </div>
              </div>

              {/* Verified Origin Stamp */}
              <div className="bg-slate-950 text-white p-4 rounded-2xl border border-amber-300/60 text-center shadow-md shrink-0 flex flex-col items-center justify-center min-w-[160px]">
                <span className="text-amber-400 font-sans text-[10px] font-bold uppercase tracking-wider block">
                  {dict.authenticTitle}
                </span>
                <span className="text-xs font-black text-white mt-1 font-sans">
                  {dict.authenticSubtitle}
                </span>
                <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                  MISTI CS 001:2000
                </span>
              </div>
            </div>

            {/* PRODUCT SPECIFICATION & INGREDIENT BREAKDOWN (EXACT SELECTED INFORMATION ONLY) */}
            <div className="p-6 sm:p-8 space-y-6">

              {/* 0. INTERACTIVE VOICE STORY & HACCP QUALITY MESSAGE */}
              <VoiceStoryRecorder
                batchId={packagingData.batch}
                productName={packagingData.product}
                activeLanguage={passportLang}
                isConsumerMode={isConsumerMode}
              />

              {/* TWO-TIER PACKAGING ARCHITECTURE BANNER (Permanent QR vs Variable Direct-Print) */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 text-white p-4 sm:p-5 rounded-3xl border-2 border-emerald-500/50 shadow-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                      Eco-Smart Architecture
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-emerald-300 font-sans">
                      ប្រព័ន្ធព័ត៌មានវេចខ្ចប់ ២កម្រិត (Permanent QR vs Variable Direct-Print)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-amber-300 font-bold bg-black/40 px-3 py-1 rounded-xl border border-amber-400/30">
                    15/15 Items Verified ✓
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Box A: Variable Data on 2nd Label (Secondary Sticker) on Pouches or Jars */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2 backdrop-blur-xs">
                    <div className="flex items-center justify-between gap-1.5 text-amber-300 font-bold text-xs">
                      <span className="flex items-center gap-1.5">
                        <span>🏷️</span>
                        <span>{passportLang === 'kh' ? 'ព័ត៌មានលើស្លាកទី ២ (2nd Label Sticker):' : passportLang === 'ko' ? '제2라벨 부착 정보 (2nd Label):' : '2nd Label (Secondary Sticker Info):'}</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">
                        {passportLang === 'kh' ? 'បិទលើគម្រប/បាតដប ឬកញ្ចប់' : passportLang === 'ko' ? '뚜껑/바닥 또는 파우치 부착' : 'Affixed to Lid/Jar/Pouch'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {passportLang === 'kh' 
                        ? 'លេខឡូតិ៍ (Lot No.), កាលបរិច្ឆេទផលិត (MFD), និងកាលបរិច្ឆេទផុតកំណត់ (EXP) មិនមាននៅលើស្លាកអចិន្ត្រៃយ៍មុខដបឡើយ គឺត្រូវបានបោះពុម្ពនៅលើ «ស្លាកទី ២ (Secondary Label Sticker)» ដែលបានបិទផ្ទាល់នៅលើកំប៉ុង PET (គម្រប ឬបាតកំប៉ុង) ឬលើកញ្ចប់ថង់។'
                        : passportLang === 'ko'
                        ? '로트 번호(Lot No.), 제조일자(MFD), 소비기한(EXP)은 전면 영구 라벨이 아닌, 용기 뚜껑(Lid) 또는 하단/후면에 별도 부착된 «제2라벨 스티커»에 개별 인쇄되어 있습니다.'
                        : 'Lot Number, Manufacturing Date (MFD), and Expiration Date (EXP) are not printed on the permanent front brand label; they are printed on the "2nd Label (Secondary Sticker)" applied directly to the jars (lid or bottom) or pouches.'}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-0.5 text-[10.5px] font-mono font-bold">
                      <span className="bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/40">
                        MFD: {packagingData.mfd || (isKhmer ? 'បោះលើស្លាកទី២' : 'On 2nd Label')}
                      </span>
                      <span className="bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/40">
                        EXP: {packagingData.exp || (isKhmer ? 'បោះលើស្លាកទី២' : 'On 2nd Label')}
                      </span>
                      <span className="bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/40">
                        LOT: {packagingData.batch}
                      </span>
                    </div>
                  </div>

                  {/* Box B: Permanent 15-Point Digital QR Passport */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2 backdrop-blur-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                      <span>📱 ផ្ទាំងផលិតផលឌីជីថលស្កេនតាម QR (Permanent 15-Item Digital Page):</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      ផ្ទុកព័ត៌មានលម្អិតផ្លូវការទាំង ១៥ ចំណុចស្របតាមស្តង់ដារ CS 001 និងទីផ្សារនាំចេញ (EU / Korea / Germany):
                    </p>
                    <div className="text-[10px] text-emerald-200 font-sans flex flex-wrap gap-1 pt-0.5 font-medium">
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">1.គ្រឿងផ្សំពេញលេញ</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">2.អាឡែហ្ស៊ី</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">3.អាហារូបត្ថម្ភ</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">4.ពិពណ៌នា</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">5.ប្រភព</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">6.ផលិតករ</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">7.បាច់</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">8.រក្សាទុក</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">9.រឿងរ៉ាវផលិតផល</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">10.ចន្ទីខ្មែរ</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">11.ម្រេចកំពត GI</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">12.រូបថត/វីដេអូ</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">13.Traceability</span>
                      <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">14.ទំនាក់ទំនង</span>
                      <span className="bg-emerald-500/30 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/40">15.한글 표시사항</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 1. Core Identification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-sans">
                    {dict.lotCode}
                  </span>
                  <span className="text-slate-950 font-bold text-sm">{packagingData.batch}</span>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-sans">
                    {(() => {
                      const isPouch = Boolean(
                        (packagingData.packageFormat && (packagingData.packageFormat.toLowerCase().includes('pouch') || packagingData.packageFormat.includes('កញ្ចប់') || packagingData.packageFormat.includes('ថង់'))) ||
                        packagingData.weight.includes('50g') ||
                        packagingData.weight.includes('50 g')
                      );
                      const isJar = Boolean(
                        packagingData.packageFormat && (packagingData.packageFormat.toLowerCase().includes('jar') || packagingData.packageFormat.includes('កំប៉ុង') || packagingData.packageFormat.includes('ក្រឡ') || packagingData.packageFormat.includes('tub'))
                      );
                      const isNet = !isPouch && (
                        isJar ||
                        (packagingData.weight && (packagingData.weight.toLowerCase().includes('net') || packagingData.weight.includes('សុទ្ធ')))
                      );
                      if (isNet) return dict.netWeight;
                      return passportLang === 'ko' ? '중량 (Weight)' : 'ទម្ងន់ (Weight)';
                    })()}
                  </span>
                  <span className="text-emerald-700 font-bold text-sm">{formatWeightBadge(packagingData.weight)}</span>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-sans">
                    {dict.mfdDate}
                  </span>
                  <span className="text-slate-900 font-bold">
                    {packagingData.mfd || (isKhmer ? 'បោះត្រាផ្ទាល់លើកញ្ចប់' : passportLang === 'ko' ? '포장재에 직접 날인' : 'Stamped on packaging')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-sans">
                    {dict.expDate}
                  </span>
                  <span className="text-amber-800 font-bold">
                    {packagingData.exp || `${packagingData.shelfLifeMonths || 6} ${isKhmer ? 'ខែ (បោះត្រាលើកញ្ចប់)' : passportLang === 'ko' ? '개월 (포장재 날인)' : 'months (stamped on bag)'}`}
                  </span>
                </div>
              </div>

              {/* 2. Ingredients with Exact Percentages Selected */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>{dict.fullDeclaration}</span>
                  </h3>
                  <span className="text-[11px] font-sans text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                    {dict.eudrBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Cashew Percentage */}
                  <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-1">
                    <span className="text-[10px] text-amber-800 font-sans font-bold block uppercase">
                      {dict.cashews} {packagingData.grade ? `(${packagingData.grade})` : ''}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-amber-950 font-mono">{packagingData.cashewPct}%</span>
                      <span className="text-[10px] text-amber-700 font-sans">{isKhmer ? (packagingData.grade ? `កម្រិត ${packagingData.grade} គុណភាពខ្ពស់` : 'ប្រភពខេត្តកំពង់ធំ') : (packagingData.grade ? `Grade ${packagingData.grade} Premium` : 'Kampong Thom Origin')}</span>
                    </div>
                    <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-amber-600 h-full rounded-full" style={{ width: `${packagingData.cashewPct}%` }} />
                    </div>
                  </div>

                  {/* Spice Percentage */}
                  <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] text-emerald-800 font-sans font-bold block uppercase truncate">
                      {dict.kampotPepper || packagingData.spice}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-emerald-950 font-mono">{packagingData.spicePct}%</span>
                      <span className="text-[10px] text-emerald-700 font-sans">
                        {isKhmer 
                          ? (isFlour || packagingData.spicePct === 0 ? 'គ្មាន (០%)' : 'ម្រេចកំពត GI សរីរាង្គ') 
                          : (isFlour || packagingData.spicePct === 0 ? 'None (0%)' : 'GI Kampot Organic')}
                      </span>
                    </div>
                    <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${packagingData.spicePct * 10}%` }} />
                    </div>
                  </div>

                  {/* Sugar Percentage */}
                  <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-1">
                    <span className="text-[10px] text-blue-800 font-sans font-bold block uppercase">
                      {dict.naturalSugar}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-blue-950 font-mono">{packagingData.sugarPct}%</span>
                      <span className="text-[10px] text-blue-700 font-sans">
                        {isKhmer 
                          ? (isFlour || packagingData.sugarPct === 0 ? 'គ្មានជាតិស្ករ (០%)' : 'ស្រោបស្ករកម្រិតទាប') 
                          : (isFlour || packagingData.sugarPct === 0 ? 'Zero Sugar (0%)' : 'Low Sugar Glaze')}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${packagingData.sugarPct * 10}%` }} />
                    </div>
                  </div>

                  {/* Salt Percentage */}
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-700 font-sans font-bold block uppercase">
                      {dict.seaSalt}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-slate-900 font-mono">{packagingData.saltPct}%</span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        {isKhmer 
                          ? (isFlour || packagingData.saltPct === 0 ? 'គ្មានជាតិអំបិល (០%)' : 'អំបិលសមុទ្រកំពត') 
                          : (isFlour || packagingData.saltPct === 0 ? 'Zero Salt (0%)' : 'Kampot Sea Salt')}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-slate-600 h-full rounded-full" style={{ width: `${packagingData.saltPct * 10}%` }} />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-sans bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong>
                    {dict.fullDeclaration}:
                  </strong>{' '}
                  {packagingData.customIngredients ||
                    `${dict.cashews} (${packagingData.cashewPct}%), ${dict.kampotPepper || packagingData.spice} (${packagingData.spicePct}%), ${dict.naturalSugar} (${packagingData.sugarPct}%), ${dict.seaSalt} (${packagingData.saltPct}%)。`}
                </p>

                {/* Sourcing Partners & Suppliers Traceability */}
                <div className="space-y-3 bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-200 mt-4">
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌾</span>
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-950 font-sans">
                        {isKhmer ? 'ដៃគូផ្គត់ផ្គង់វត្ថុធាតុដើម & ប្រភពដាន (Official Sourcing Partners)' : 'Official Sourcing Partners & Traceability'}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-950 px-2.5 py-0.5 rounded-full">
                      100% CAMBODIA ORIGIN
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                    {/* Cashew Supplier */}
                    <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-1 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-bold block">
                        🥜 {isKhmer ? 'គ្រាប់ស្វាយចន្ទី' : 'Cashew Kernels'}:
                      </span>
                      <p className="font-black text-slate-950 text-xs truncate">Mirarth Agri Tech Co., Ltd.</p>
                      <span className="text-[10px] text-emerald-700 font-medium block">
                        {isKhmer ? 'ខេត្តកំពង់ធំ • រោងចក្រកែច្នៃស្ដង់ដារ' : 'Kampong Thom Province'}
                      </span>
                    </div>

                    {/* Pepper Supplier */}
                    {(isPepper || packagingData.flavor.toLowerCase().includes('pepper') || (packagingData.selectedSuppliers && packagingData.selectedSuppliers.some(s => s.toLowerCase().includes('boh') || s.toLowerCase().includes('pepper') || s.includes('ម្រេច')))) && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-1 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold block">
                          🌿 {isKhmer ? 'ម្រេចកំពត GI' : 'GI Kampot Pepper'}:
                        </span>
                        <p className="font-black text-slate-950 text-xs truncate">BOH Co., Ltd.</p>
                        <span className="text-[10px] text-indigo-700 font-medium block">
                          {isKhmer ? 'ខេត្តកំពត • សមាគមម្រេចកំពត GI' : 'Kampot Province • PGI'}
                        </span>
                      </div>
                    )}

                    {/* Pandan Powder Supplier - Ringacam Enterprise */}
                    {(packagingData.product.toLowerCase().includes('milk') || packagingData.nameKh.includes('ទឹកដោះគោ') || packagingData.customIngredients.includes('ស្លឹកតើយ') || packagingData.customIngredients.includes('ស្លឹកតយ') || packagingData.customIngredients.toLowerCase().includes('pandan') || (packagingData.selectedSuppliers && packagingData.selectedSuppliers.some(s => (s.toLowerCase().includes('ringacam') || s.toLowerCase().includes('rincagam')) && (s.includes('ស្លឹកតើយ') || s.includes('ស្លឹកតយ') || s.toLowerCase().includes('pandan') || packagingData.nameKh.includes('ទឹកដោះគោ') || packagingData.product.toLowerCase().includes('milk'))))) && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-1 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold block">
                          🌿 {isKhmer ? 'ម្សៅស្លឹកតើយ' : 'Pandan Powder'}:
                        </span>
                        <p className="font-black text-slate-950 text-xs truncate">Ringacam Enterprise</p>
                        <span className="text-[10px] text-emerald-700 font-medium block">
                          {isKhmer ? 'រាជធានីភ្នំពេញ • ម្សៅស្លឹកតើយធម្មជាតិ G.D.G' : 'Phnom Penh • Natural Pandan Powder'}
                        </span>
                      </div>
                    )}

                    {/* Chili Supplier - strictly excluded for Milk and non-chili products */}
                    {!packagingData.nameKh.includes('ទឹកដោះគោ') && !packagingData.product.toLowerCase().includes('milk') && (isChili || packagingData.flavor.toLowerCase().includes('chili') || (packagingData.selectedSuppliers && packagingData.selectedSuppliers.some(s => s.toLowerCase().includes('ringacam') || s.toLowerCase().includes('chili') || s.includes('ម្ទេស')))) && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-1 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold block">
                          🌶️ {isKhmer ? 'ម្សៅម្ទេសធម្មជាតិ G.D.G' : 'Natural Chili Powder'}:
                        </span>
                        <p className="font-black text-slate-950 text-xs truncate">Ringacam Enterprise</p>
                        <span className="text-[10px] text-emerald-700 font-medium block">
                          {isKhmer ? 'រាជធានីភ្នំពេញ • ស្តង់ដារជាតិ' : 'Phnom Penh • Food Safety'}
                        </span>
                      </div>
                    )}

                    {/* Sugar Supplier - displays whenever Angkor Sugar is in selectedSuppliers, flavor is sugar or pepper, or contains sugar */}
                    {(isPepper || isSugar || packagingData.flavor.toLowerCase().includes('sugar') || (packagingData.selectedSuppliers && packagingData.selectedSuppliers.some(s => s.toLowerCase().includes('angkor') || s.toLowerCase().includes('sugar') || s.includes('ស្ករ')))) && (
                      <div className="p-3 bg-white rounded-xl border border-amber-300 space-y-1 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold block">
                          🍯 {isKhmer ? 'ស្ករត្នោត / ស្ករសចម្រាញ់' : 'Palm Sugar / Refined Sugar'}:
                        </span>
                        <p className="font-black text-slate-950 text-xs truncate">Angkor Sugar</p>
                        <span className="text-[10px] text-amber-700 font-medium block">
                          {isKhmer ? 'ខេត្តកំពង់ស្ពឺ • សិប្បកម្មស្ករត្នោតធម្មជាតិ' : 'Kampong Speu Province'}
                        </span>
                      </div>
                    )}

                    {/* Salt Supplier */}
                    {!isFlour && (
                      <div className="p-3 bg-white rounded-xl border border-slate-300 space-y-1 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold block">
                          🧂 {isKhmer ? 'អំបិលសមុទ្រកំពត' : 'Kampot Sea Salt'}:
                        </span>
                        <p className="font-black text-slate-950 text-xs truncate">Ngov Heng</p>
                        <span className="text-[10px] text-emerald-700 font-medium block">
                          {isKhmer ? 'ខេត្តកំពត • អំបិលសមុទ្រធម្មជាតិ' : 'Kampot Province'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Nutrition Facts Panel & Allergen Warning */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Nutrition Panel */}
                <div className="md:col-span-2 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-amber-400 font-sans">
                        {dict.nutritionFacts}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-sans">{isKhmer ? 'ចំណែកបរិភោគ៖ ៣០g / សរុប ១០០g' : 'Serving: 30g / Net 100g'}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">
                      {packagingData.nutrition?.energyKcal || '580'} kcal / {packagingData.nutrition?.energyKj || '2426'} kJ
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                    <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                      <span className="text-[9px] text-slate-400 block font-sans">
                        {dict.protein}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {packagingData.nutrition?.protein || '18.2'} g
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                      <span className="text-[9px] text-slate-400 block font-sans">
                        {dict.totalFat}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {packagingData.nutrition?.totalFat || '43.8'} g
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                      <span className="text-[9px] text-slate-400 block font-sans">
                        {dict.carbs}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {packagingData.nutrition?.totalCarb || '30.1'} g
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                      <span className="text-[9px] text-slate-400 block font-sans">
                        {dict.sugars}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {packagingData.nutrition?.totalSugars || '5.9'} g
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                      <span className="text-[9px] text-slate-400 block font-sans">
                        {dict.fiber}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {packagingData.nutrition?.dietaryFiber || '3.3'} g
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                      <span className="text-[9px] text-slate-400 block font-sans">
                        {dict.sodium}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {packagingData.nutrition?.sodium || '210'} mg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Allergen & Storage Warning Box */}
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-300 space-y-3 font-sans">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-xs border-b border-amber-200 pb-1.5">
                    <AlertCircle size={15} className="text-amber-600 shrink-0" />
                    <span>{dict.allergenWarning}</span>
                  </div>

                  <div className="text-xs text-amber-900 space-y-2 leading-relaxed">
                    <p className="font-bold">
                      ⚠️ {isKhmer 
                          ? translateAllergenToLanguage(packagingData.allergen || dict.allergenDetails, 'km') 
                          : (dict.allergenDetails || translateAllergenToLanguage(packagingData.allergen, passportLang))}
                    </p>
                    {packagingData.instructionsForUse && (
                      <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300/80 text-amber-950 text-xs">
                        <strong className="block text-[10px] uppercase font-bold text-amber-900 tracking-wider mb-0.5">
                          🍵 {isKhmer ? 'របៀបប្រើប្រាស់ និងការណែនាំ៖' : passportLang === 'ko' ? '음용 및 섭취 방법:' : 'Directions for Use & Preparation:'}
                        </strong>
                        <p className="text-[11px] font-medium leading-relaxed">
                          {translateUsageToLanguage(packagingData.instructionsForUse, passportLang, isFlour)}
                        </p>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-700">
                      {translateStorageToLanguage(packagingData.storage || dict.storageWarning, passportLang)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Manufacturer & Certification Footer Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">
                    {dict.manufacturerExporter}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {packagingData.company} (Mayany Enterprise)
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {dict.factoryPhnomPenh} • {dict.farmersKampongThom} • Tel/Telegram/WhatsApp: +855 88 771 2862 • mayany@mayanyenterprise.com • mayanyenterprise.com
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-[10px]">
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-lg border border-emerald-300 font-sans">
                    ✓ GHP / GMP
                  </span>
                  <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-300 font-sans">
                    ✓ CS 001:2000
                  </span>
                  <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-lg border border-blue-300 font-sans">
                    ✓ EUDR Ready
                  </span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* COMPREHENSIVE 15-POINT DIGITAL PASSPORT DISCLOSURE & STORYTELLING HUB */}
              {/* ========================================================================= */}
              <div className="space-y-4 pt-2">
                
                {/* Header & Filter Controls for the 15 Disclosures */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full font-mono">
                        QR DIGITAL PASSPORT
                      </span>
                      <h3 className="text-sm font-black text-white font-sans">
                        ព័ត៌មានលម្អិតផ្លូវការ ១៥ ចំណុច (15-Point Mandatory & Story Disclosure)
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      រាល់ព័ត៌មានស្តង់ដារអន្តរជាតិ សាច់រឿងចន្ទីខ្មែរ ម្រេចកំពត GI រូបភាពវីដេអូ និងស្លាកនាំចេញកូរ៉េ
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-1.5 text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => setActiveDisclosureTab('all')}
                      className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer text-[11px] ${
                        activeDisclosureTab === 'all'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      បង្ហាញទាំងអស់ (All)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDisclosureTab('pepper_cashew')}
                      className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer text-[11px] flex items-center gap-1 ${
                        activeDisclosureTab === 'pepper_cashew'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{isFlour ? '🌾 ម្សៅចន្ទី & ដំណើរការ' : 'ម្រេចកំពត & ចន្ទី'}</span>
                    </button>
                    {(passportLang === 'ko' || packagingData.scheme === 'export_korea') && (
                      <button
                        type="button"
                        onClick={() => setActiveDisclosureTab('korean')}
                        className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer text-[11px] flex items-center gap-1 ${
                          activeDisclosureTab === 'korean'
                            ? 'bg-rose-500 text-white font-black shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>🇰🇷 한글 표시사항</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveDisclosureTab('gallery')}
                      className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer text-[11px] flex items-center gap-1 ${
                        activeDisclosureTab === 'gallery'
                          ? 'bg-sky-500 text-slate-950 font-black shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>📸 រូបថត & វីដេអូ</span>
                    </button>
                  </div>
                </div>

                {/* 4 & 8: PRODUCT DESCRIPTION & STORAGE INFORMATION CARDS */}
                {(activeDisclosureTab === 'all' || activeDisclosureTab === 'stories') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Item 4: Product Description */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-mono font-bold">
                            4
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 uppercase font-sans">
                            សេចក្តីពិពណ៌នាផលិតផល (Product Description)
                          </h4>
                        </div>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                          {isFlour ? '100% Pure Flour' : (isKhmer ? 'រូបមន្តប្រណិត' : 'Gourmet Recipe')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {isKhmer
                          ? (isDescKhmer
                              ? packagingData.description
                              : (passportStoryData.paragraphs && passportStoryData.paragraphs.length > 0
                                  ? passportStoryData.paragraphs.join('\n\n')
                                  : (isFlour
                                      ? 'ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ រាល់ដំណាក់កាលនៃការផលិតត្រូវបានយកចិត្តទុកដាក់ និងសម្រិតសម្រាំង ដើម្បីរក្សាបាននូវគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមគោលការណ៍សុវត្ថិភាពម្ហូបអាហារ។ មិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។'
                                      : (isPepper
                                          ? 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ និងម្រេចខ្មៅកំពត GI ដ៏ល្បីល្បាញលើពិភពលោក។ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ CS 001 ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពតផ្តល់នូវរសជាតិឈ្ងុយហឹរស្រាល ស្រួយឆ្ងាញ់ធម្មជាតិ និងជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។'
                                          : `គ្រាប់ស្វាយចន្ទីខ្មែរលេខ១ ${packagingData.grade ? `កម្រិត ${packagingData.grade}` : ''} ត្រូវបានឆ្លងកាត់ការកែច្នៃស្របតាមស្តង់ដារគុណភាពខ្ពស់ គ្មានសារធាតុរក្សាទុក ឬម្សៅស៊ុប MSG ឡើយ។`))))
                          : (!isDescKhmer
                              ? (packagingData.description || (passportStoryData.paragraphs && passportStoryData.paragraphs.length > 0 ? passportStoryData.paragraphs.join('\n\n') : ''))
                              : (passportStoryData.paragraphs && passportStoryData.paragraphs.length > 0
                                  ? passportStoryData.paragraphs.join('\n\n')
                                  : (passportLang === 'ko'
                                      ? '100% 순수 캐슈넛 가루는 캄보디아 왕국 캄퐁톰(Kampong Thom) 지역에서 재배되고 탈각된 프리미엄 캐슈넛으로 제조됩니다. 모든 생산 과정은 식품 안전 원칙에 따라 품질, 안전 및 위생을 철저히 유지하기 위해 세심하게 관리됩니다.'
                                      : 'Pure cashew kernel flour produced from cashew nuts grown and shelled in Kampong Thom province, Kingdom of Cambodia. Meticulously cold-milled under strict food safety protocols with zero added salt, zero sugar, and no preservatives.')))}
                      </p>
                      <p className="text-[11px] text-slate-500 italic font-sans">
                        {isKhmer
                          ? `"${translateBotanicalRowToKhmer(packagingData.botanical) || (isFlour
                              ? 'ម្សៅគ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០% (Anacardium occidentale) • គ្មានជាតិ Gluten គ្មានបន្ថែមអំបិល ឬស្ករ'
                              : (isPepper
                                  ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា • ស្រោបម្រេចខ្មៅកំពត GI ៥% • កញ្ចប់បាតឈរ ៥០g'
                                  : `គ្រាប់ស្វាយចន្ទីកម្ពុជាសម្រិតសម្រាំង (${packagingData.grade || 'WW180'}) • ផលិតចេញពីការប្រមូលផលចន្ទីខេត្តកំពង់ធំ`))}"`
                          : (packagingData.botanical ? `"${packagingData.botanical}"` : (isFlour
                              ? '"100% Pure Cambodian Cashew Kernel Flour (Anacardium occidentale) • 100% Plant-Based, Gluten-Free & Keto Friendly • Zero Added Salt & Zero Sugar"'
                              : `"Selected Cambodian Cashews (${packagingData.grade || 'WW180'}) • Naturally processed from Kampong Thom cashew harvest."`
                            ))}
                      </p>
                    </div>

                    {/* Item 8: Storage Information & Shelf-Life */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-mono font-bold">
                            8
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 uppercase font-sans">
                            ការណែនាំអំពីការរក្សាទុក (Storage Information)
                          </h4>
                        </div>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                          {isKhmer ? `អាយុកាលរក្សាទុក៖ ${packagingData.shelfLifeMonths || 9} ខែ` : passportLang === 'ko' ? `유통기한: ${packagingData.shelfLifeMonths || 9}개월` : `Shelf-Life: ${packagingData.shelfLifeMonths || 9} Mo`}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 block">🌡️ សីតុណ្ហភាពរក្សាទុក៖</span>
                          <span className="text-slate-600">{translateStorageToLanguage(packagingData.storage || (isKhmer ? 'រក្សាទុកក្នុងកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។' : 'Store in a cool, dry place (< 25°C). Keep away from direct sunlight and moisture.'), passportLang)}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 block">🔒 បន្ទាប់ពីបើកគម្រប៖</span>
                          <span className="text-slate-600">{translateUsageToLanguage(packagingData.instructionsForUse || (isKhmer ? 'ត្រូវបិទខ្សែហ្ស៊ីប ឬគម្របឲ្យជិត និងទទួលទានក្នុងរយៈពេល ៣០ ថ្ងៃ។' : 'Reseal tightly after opening and consume within 30 days.'), passportLang, isFlour)}</span>
                        </div>
                      </div>

                      {passportLang === 'ko' && (
                        <div className="bg-slate-50 p-2 rounded-xl text-[10px] text-slate-600 font-sans border border-slate-200">
                          <strong className="text-slate-800">🇰🇷 보관 안내:</strong> {packagingData.storage ? `${packagingData.storage} (직사광선 및 고온 다습한 곳을 피하여 건냉한 곳에 밀봉 보관)` : '직사광선 및 고온 다습한 곳을 피하여 건냉한 곳에 밀봉 보관하십시오. 개봉 후에는 밀봉하여 빠른 시일 내에 섭취하십시오.'}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 10 & 11: CAMBODIAN CASHEW STORY & GI KAMPOT BLACK PEPPER */}
                {(activeDisclosureTab === 'all' || activeDisclosureTab === 'pepper_cashew' || activeDisclosureTab === 'stories') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Item 10: Cambodian Cashew Story */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-mono font-bold">
                            10
                          </span>
                          <h4 className="text-xs font-black text-amber-950 uppercase font-sans">
                            ដំណើររឿងគ្រាប់ស្វាយចន្ទីកម្ពុជា (Cambodian Cashew Story)
                          </h4>
                        </div>
                        <span className="text-[10px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full font-bold font-mono">
                          M23 Variety
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-sans">
                        ប្រទេសកម្ពុជា គឺជាជង្រុកគ្រាប់ស្វាយចន្ទីធំជាងគេមួយក្នុងពិភពលោក ដែលមានពូជ <strong>M23 (M023)</strong> ត្រូវបានគេទទួលស្គាល់ថាជាគ្រាប់ស្វាយចន្ទីខ្នាតធំ (Jumbo Size) រសជាតិផ្អែមធម្មជាតិ ជាតិខ្លាញ់ល្អ Oleic Acid ខ្ពស់ និងសាច់ណែនស្រួយពិសេសជាងគេ។
                      </p>

                      <div className="bg-white/80 p-3 rounded-xl border border-amber-200 space-y-1 text-[11px] font-sans">
                        <div className="font-bold text-amber-950 flex items-center gap-1.5">
                          <span>🤝 ការគាំទ្រកសិករខ្នាតតូចខេត្តកំពង់ធំ៖</span>
                        </div>
                        <p className="text-slate-600">
                          សហគ្រាស Mayany ប្រមូលទិញផ្ទាល់ពីកសិករខ្នាតតូចក្នុងតម្លៃខ្ពស់ជាងទីផ្សារ +២០% ទៅ +៣០% ដោយមិនឆ្លងកាត់ឈ្មួញកណ្តាល ជួយលើកកម្ពស់ជីវភាពសហគមន៍ជនបទ និងស្ត្រីកែច្នៃ។
                        </p>
                      </div>
                    </div>

                    {/* Item 11: GI Kampot Black Pepper Information / Pure Cashew Flour Process */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                            11
                          </span>
                          <h4 className="text-xs font-black text-emerald-950 uppercase font-sans">
                            {isFlour ? 'ដំណើរការផលិតម្សៅចន្ទីធម្មជាតិ (Pure Cashew Kernel Flour Process)' : 'ព័ត៌មានម្រេចខ្មៅកំពត GI (GI Kampot Black Pepper)'}
                          </h4>
                        </div>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold font-mono">
                          {isFlour ? '100% Pure Plant Flour' : 'PGI Certified'}
                        </span>
                      </div>

                      {isFlour ? (
                        <div className="space-y-2 text-xs text-slate-800 font-sans leading-relaxed">
                          <p>
                            {passportLang === 'ko'
                              ? 'Mayany 100% 순수 캐슈넛 파우더는 식품 등급 정밀 분쇄 기술을 통해 뭉침 없이 부드러우며 장기 보관이 가능한 프리미엄 품질을 자랑합니다.'
                              : passportLang === 'en'
                              ? 'Mayany 100% Pure Cashew Kernel Flour is produced using food-grade precision milling to achieve an ultra-fine, lump-free flour with extended natural shelf life.'
                              : 'ម្សៅគ្រាប់ស្វាយចន្ទី Mayany ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីខ្មែរ ១០០% តាមរយៈបច្ចេកវិទ្យាកិនកម្រិតស្តង់ដារចំណីអាហារ ដើម្បីទទួលបានម្សៅស្ងួត ម៉ដ្ឋស្រាល មិនកកដុំ និងរក្សាទុកបានយូរ។'}
                          </p>
                          <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 font-sans space-y-1">
                            <div className="font-bold">
                              {passportLang === 'ko'
                                ? '✓ 글루텐 프리 • 무설탕 • 무염 • 무방부제'
                                : passportLang === 'en'
                                ? '✓ Gluten-Free • Zero Sugar • Zero Salt • No Preservatives'
                                : '✓ គ្មានជាតិ Gluten • គ្មានជាតិស្ករ • គ្មានជាតិអំបិល • គ្មានសារធាតុគីមីរក្សាទុក'}
                            </div>
                            <div className="text-slate-600 text-[10.5px]">
                              {passportLang === 'ko'
                                ? '식물성 단백질, 식이섬유 및 천연 미네랄(철분, 마그네슘, 아연)이 풍부합니다.'
                                : passportLang === 'en'
                                ? 'Rich in plant-based protein, dietary fiber, and natural minerals (Iron, Magnesium, Zinc).'
                                : 'សម្បូរដោយជាតិប្រូតេអ៊ីនរុក្ខជាតិ កាកសរសៃអាហារ និងជាតិរ៉ែធម្មជាតិ (Iron, Magnesium, Zinc)។'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <img
                            src="/images/kampot_pepper_gi.jpg"
                            alt="GI Kampot Black Pepper"
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-emerald-300 shadow-sm shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="space-y-1.5 text-xs text-slate-800 font-sans leading-relaxed">
                            <p>
                              ម្រេចកំពត ត្រូវបានចុះបញ្ជីជា <strong>ម៉ាកសម្គាល់ភូមិសាស្ត្រទំនិញ (PGI)</strong> ដោយសមាគមលើកកម្ពស់ម្រេចកំពត (KPPA) និងសហភាពអឺរ៉ុប។ ដាំដុះលើដីភ្នំដំរីដែលសំបូរសារធាតុរ៉ែ ក្រោមខ្យល់សមុទ្រឈូងសមុទ្រថៃ។
                            </p>
                            <p className="text-[11px] text-emerald-900 font-semibold">
                              ✓ រសជាតិហឹរស្រាល ក្លិនប្រហើរ eucalyptus និងក្រូចឆ្មារធម្មជាតិ មិនក្តៅឆួលក។
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 text-[10.5px] text-slate-700 font-mono flex items-center justify-between">
                        <span>{isFlour ? 'Standard: CS 001:2000' : 'KPPA License: GI-CAM-001'}</span>
                        <span className="font-bold text-emerald-800">{isFlour ? 'Grade: Ultra-Pure Cashew' : 'EU Reg: 2016/C 55/06'}</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* 9: PRODUCT STORY & ARTISANAL PROCESS */}
                {(activeDisclosureTab === 'all' || activeDisclosureTab === 'stories') && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-mono font-bold">
                          9
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 uppercase font-sans">
                          ដំណើររឿងផលិតផល (Product Story & Artisan Craft)
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">
                        Heritage × Innovation
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700 font-sans leading-relaxed">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 text-xs block">១. ជ្រើសរើសដោយដៃ</span>
                        <p className="text-[11px] text-slate-600">
                          គ្រាប់ស្វាយចន្ទីនីមួយៗត្រូវបានជ្រើសរើសដោយដៃ ធានាថាជាគ្រាប់គុណភាពខ្ពស់ ({packagingData.grade ? `Grade ${packagingData.grade}` : 'Whole Kernel'}) គ្មានបាក់បែក ឬប្រហោង។
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 text-xs block">២. បច្ចេកទេសស្រោបម្រេច</span>
                        <p className="text-[11px] text-slate-600">
                          ប្រើប្រាស់ស្រទាប់ glaze ស្តើងបំផុតពីស្ករអំពៅធម្មជាតិ ដើម្បីផ្សារភ្ជាប់គ្រាប់ម្រេចកំពតបុកថ្មីៗជាប់លើគ្រាប់ ដោយមិនប្រើម្សៅគីមី។
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 text-xs block">៣. វេចខ្ចប់រក្សាភាពស្រួយ</span>
                        <p className="text-[11px] text-slate-600">
                          វេចខ្ចប់ជាមួយបច្ចេកវិទ្យាបូមខ្យល់ Nitrogen Flush ក្នុងថង់បាតឈរ ឬកំប៉ុង PET ដើម្បីធានាភាពស្រួយឆ្ងាញ់រហូតដល់ ១៨ ខែ។
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 12: PHOTOS & VIDEO MEDIA GALLERY */}
                {(activeDisclosureTab === 'all' || activeDisclosureTab === 'gallery') && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center text-xs font-mono font-bold">
                          12
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 uppercase font-sans">
                          វិចិត្រសាលរូបភាព & វីដេអូកសិដ្ឋាន (Photos & Video Showcase)
                        </h4>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setShowVideoModal(true)}
                        className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                      >
                        <Play size={13} className="fill-white" />
                        <span>🎬 មើលវីដេអូខ្លី (Watch Story Video Clip)</span>
                      </button>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 shadow-xs">
                        <img
                          src="/images/cambodia_cashew_farmer_1787965007571.jpg"
                          alt="Cambodian Cashew Farmer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] text-white font-bold leading-tight font-sans">
                            កសិករកំពង់ធំ (Smallholder Farmer)
                          </span>
                        </div>
                      </div>

                      <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 shadow-xs">
                        <img
                          src="/images/cashew_harvest_tray_1785138921355.jpg"
                          alt="Cashew Harvest"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] text-white font-bold leading-tight font-sans">
                            ប្រមូលផលចន្ទី (Cashew Harvest Tray)
                          </span>
                        </div>
                      </div>

                      <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 shadow-xs">
                        <img
                          src="/images/cashew_drying_grading_1787965024347.jpg"
                          alt="Drying & Grading"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] text-white font-bold leading-tight font-sans">
                            ហាល & តម្រៀបគ្រាប់ (Sun-Drying & Grading)
                          </span>
                        </div>
                      </div>

                      <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 shadow-xs">
                        <img
                          src="/images/kampot_pepper_gi.jpg"
                          alt="GI Kampot Pepper Harvest"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] text-white font-bold leading-tight font-sans">
                            ម្រេចកំពត GI (Kampot Pepper Harvest)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 13: TRACEABILITY & EUDR DEFORESTATION-FREE LEDGER */}
                {(activeDisclosureTab === 'all' || activeDisclosureTab === 'pepper_cashew') && (
                  <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-mono font-bold">
                          13
                        </span>
                        <h4 className="text-xs font-bold text-white uppercase font-sans">
                          ព័ត៌មានតាមដានដានប្រភព & EUDR (Traceability Information)
                        </h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono font-bold">
                        EUDR Verified (Post-2020 Zero Deforestation)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-sans">កូអរដោនេចម្ការ (Cashew GPS):</span>
                        <span className="text-emerald-400 font-bold">12.7112° N, 104.8876° E</span>
                        <span className="text-[10px] text-slate-400 block font-sans">{isKhmer ? 'ចង្កោមកសិដ្ឋានចន្ទីខេត្តកំពង់ធំ' : 'Kampong Thom Cashew Cluster'}</span>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-sans">កូអរដោនេម្រេច (Pepper GPS):</span>
                        <span className="text-emerald-400 font-bold">10.6104° N, 104.1815° E</span>
                        <span className="text-[10px] text-slate-400 block font-sans">{isKhmer ? 'សហគមន៍ម្រេចកំពត GI' : 'Kampot PGI Cooperative'}</span>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-sans">កូដផ្ទៀងផ្ទាត់ Ledger Hash:</span>
                        <span className="text-amber-400 font-bold truncate block">0x9F4C...7A21E</span>
                        <span className="text-[10px] text-slate-400 block font-sans">{isKhmer ? 'កំណត់ត្រាបាច់ស្របតាមពេលវេលាជាក់ស្តែង' : 'Timestamped Batch Ledger'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 15: KOREAN-LANGUAGE FOOD LABEL SPECIFICATIONS (식품위생법에 의한 한글 표시사항) */}
                {(activeDisclosureTab === 'korean' || (passportLang === 'ko' && activeDisclosureTab === 'all')) && (
                  <div className="bg-white p-5 rounded-2xl border-2 border-rose-300 shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                          15
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-rose-950 uppercase font-sans">
                            식품위생법에 의한 한글 표시사항 (Korean-Language Mandatory Food Label)
                          </h4>
                          <span className="text-[10px] text-slate-500 font-sans">
                            대한민국 식품의약품안전처 (MFDS) 수입식품안전관리 특별법 준수
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full font-bold font-mono">
                        KOREA EXPORT READY 🇰🇷
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-sans text-slate-800 border-collapse border border-slate-300">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold w-1/4 border-r border-slate-300 text-[11px]">제품명</td>
                            <td className="px-3 py-2 font-semibold">{getStandardKoreanProductName(packagingData.nameKh, packagingData.product, isFlour)}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">식품유형</td>
                            <td className="px-3 py-2">땅콩 또는 견과류가공품</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">원산지 및 제조국</td>
                            <td className="px-3 py-2 font-bold text-emerald-800">캄보디아 (Kingdom of Cambodia)</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">제조원</td>
                            <td className="px-3 py-2">{packagingData.company || 'Mayany Enterprise'} (캄보디아 프놈펜 특별시)</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">수입원 및 판매원</td>
                            <td className="px-3 py-2 text-slate-600">마야니 코리아 파트너스 (수입 협의 진행 중 / Mayany Korea Partners)</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">내용량</td>
                            <td className="px-3 py-2 font-mono font-bold text-slate-900">{packagingData.weight || '50g'} (또는 용기 표기 용량)</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">원재료명 및 함량</td>
                            <td className="px-3 py-2 leading-relaxed">
                              {packagingData.customIngredients ? (
                                <span>{packagingData.customIngredients}</span>
                              ) : (
                                <span>
                                  <strong>캐슈넛(캄보디아산 {packagingData.grade || ''}) {packagingData.cashewPct}%</strong>
                                  {packagingData.spicePct > 0 && <>, <strong>{packagingData.spice || '양념'} {packagingData.spicePct}%</strong></>}
                                  {packagingData.sugarPct > 0 && <>, 정제설탕 {packagingData.sugarPct}%</>}
                                  {packagingData.saltPct > 0 && <>, 깜뽓 천일염 {packagingData.saltPct}%</>}
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">소비기한 (Best Before)</td>
                            <td className="px-3 py-2 font-mono font-bold text-amber-900">
                              용기 상단 또는 포장 상단 별도 표기일까지 (제조일: {packagingData.mfd} / 소비기한: {packagingData.exp})
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">보관방법</td>
                            <td className="px-3 py-2">
                              {packagingData.storage ? `${packagingData.storage} (직사광선 및 고온 다습한 곳을 피해 건냉한 곳에 실온 보관)` : '직사광선 및 고온 다습한 곳을 피해 건냉한 곳에 실온 보관하십시오. 개봉 후에는 밀봉하여 냉장 보관하거나 빠른 시일 내 드시기 바랍니다.'}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">알레르기 유발물질</td>
                            <td className="px-3 py-2 font-bold text-rose-700">
                              ⚠️ <strong>{packagingData.allergen || '캐슈넛(견과류) 함유'}</strong> (본 제품은 땅콩, 참깨를 사용한 제품과 같은 제조 시설에서 제조하고 있습니다.)
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-slate-100 px-3 py-2 font-bold border-r border-slate-300 text-[11px]">포장재질</td>
                            <td className="px-3 py-2 font-mono text-slate-700">용기: PET, 캡: 알루미늄 / 파우치: 다층 필름 (내면: 폴리에틸렌)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>

              {/* 5. Official Verification & Digital Contacts Banner */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                        {passportLang === 'kh' ? 'បណ្តាញទំនាក់ទំនង & ផ្ទៀងផ្ទាត់ផ្លូវការ' : 'Official Verification & Channels'}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        CashewTrace Protocol • Mayany Enterprise
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono font-bold">
                      LIVE VERIFIED
                    </span>
                  </div>
                </div>

                {/* 6 Official Contact & Support Channels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {/* 1. Direct Telephone Call */}
                  <a
                    href="tel:+855887712862"
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                        <Phone size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-sans">Telephone Support</span>
                        <span className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 font-mono truncate block">
                          +855 88 771 2862
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-emerald-400 shrink-0 ml-1" />
                  </a>

                  {/* 2. Telegram Support */}
                  <a
                    href="https://t.me/+855887712862"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-sky-950/40 border border-slate-700 hover:border-sky-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
                        <Send size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-sans">Telegram</span>
                        <span className="text-xs font-bold text-sky-300 group-hover:text-sky-200 font-mono truncate block">
                          +855 88 771 2862
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-sky-300 shrink-0 ml-1" />
                  </a>

                  {/* 3. WhatsApp Inquiries */}
                  <a
                    href="https://wa.me/855887712862"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 group-hover:scale-105 transition-transform">
                        <MessageCircle size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-sans">WhatsApp Business</span>
                        <span className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 font-mono truncate block">
                          +855 88 771 2862
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-emerald-400 shrink-0 ml-1" />
                  </a>

                  {/* 4. Official Email */}
                  <a
                    href="mailto:mayany@mayanyenterprise.com"
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-sans">Official Email</span>
                        <span className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 font-mono truncate block">
                          mayany@mayanyenterprise.com
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-indigo-400 shrink-0 ml-1" />
                  </a>

                  {/* 5. Official Facebook Page */}
                  <a
                    href={contactInfo?.facebook_url || "https://www.facebook.com/MayanyEnterprise"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-105 transition-transform">
                        <Facebook size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-sans">Facebook Page</span>
                        <span className="text-xs font-bold text-blue-300 group-hover:text-blue-200 truncate block">
                          Mayany Enterprise
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-blue-300 shrink-0 ml-1" />
                  </a>

                  {/* 6. Official Website */}
                  <a
                    href="https://mayanyenterprise.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                        <Globe size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-sans">Official Website</span>
                        <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200 font-mono truncate block">
                          mayanyenterprise.com
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-amber-300 shrink-0 ml-1" />
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Phone size={11} className="text-emerald-400" />
                      <a href="tel:+855887712862" className="hover:underline">+855 88 771 2862</a>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Send size={11} className="text-sky-400" />
                      <a href="https://t.me/+855887712862" target="_blank" rel="noopener noreferrer" className="hover:underline text-sky-400">Telegram</a>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <MessageCircle size={11} className="text-emerald-400" />
                      <a href="https://wa.me/855887712862" target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-400">WhatsApp</a>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Mail size={11} className="text-indigo-400" />
                      <a href="mailto:mayany@mayanyenterprise.com" className="hover:underline text-indigo-300">mayany@mayanyenterprise.com</a>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans">
                    {passportLang === 'kh' ? 'រក្សាសិទ្ធិគ្រប់យ៉ាង ២០២៦ Mayany Enterprise' : '© 2026 Mayany Enterprise • CashewTrace'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: OFFICIAL TECHNICAL CERTIFICATE & CONFORMANCE PASSPORT */}
      {activeSubView === 'certificate' && (
        <div className="space-y-6 animate-fade-in">
          {/* Certificate Actions Bar (Print, Share, Language) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md no-print">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                  {isKhmer ? 'វិញ្ញាបនបត្របច្ចេកទេសគុណភាពកសិផលស្តង់ដារជាតិ' : 'Official Technical Product Certificate'}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  {isKhmer ? 'លេខយោង' : 'REF'}: MISTI-CS001-2026-{packagingData.batch}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Read Aloud Audio Button */}
              <button
                type="button"
                onClick={() => handleToggleSpeak()}
                className={`font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                  isSpeaking
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black'
                }`}
                title={isKhmer ? 'អានវិញ្ញាបនបត្រឮៗ' : 'Read Aloud Audio Narration'}
              >
                {isSpeaking ? (isPaused ? <Play size={14} /> : <Pause size={14} />) : <Volume2 size={14} />}
                <span>
                  {isSpeaking 
                    ? (isPaused ? (isKhmer ? 'បន្តអាន' : 'Resume') : (isKhmer ? 'ផ្អាកអាន' : 'Pause'))
                    : (isKhmer ? 'អានឮៗ 🔊' : 'Read Aloud 🔊')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Printer size={14} />
                <span>{isKhmer ? 'បោះពុម្ពវិញ្ញាបនបត្រ' : 'Print Certificate (PDF)'}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              >
                {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedLink ? (isKhmer ? 'បានចម្លង' : 'Copied') : (isKhmer ? 'ចម្លងតំណភ្ជាប់' : 'Copy Link')}</span>
              </button>
            </div>
          </div>

          {/* DEDICATED MULTI-LANGUAGE SWITCHER FOR CERTIFICATE */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/95 text-white p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400/40 shadow-lg no-print">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-sans">
                {isKhmer ? 'ជ្រើសរើសភាសាចេញវិញ្ញាបនបត្រផ្លូវការ៖' : passportLang === 'ko' ? '인증서 발급 언어 선택:' : 'Choose Certificate Language:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {CERTIFICATE_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setPassportLang(l.code as AppLanguage)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    passportLang === l.code
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  <span className="text-sm">{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* INTERACTIVE READ ALOUD AUDIO NARRATION BANNER */}
          {(isSpeaking || showAudioPlayer) && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500/60 shadow-xl text-white space-y-3 animate-fade-in no-print">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <Volume2 className={`w-5 h-5 ${isSpeaking && !isPaused ? 'animate-bounce' : ''}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                        {isSpeaking ? (isPaused ? '⏸️ បានផ្អាកការអាន (Paused)' : '🔊 កំពុងអានវិញ្ញាបនបត្រឮៗ (Reading Aloud)') : '🔈 ម៉ាស៊ីនអានសំឡេងឌីជីថល'}
                      </span>
                      {isSpeaking && !isPaused && (
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          <span className="w-1 h-6 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '75ms' }} />
                          <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '225ms' }} />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans">
                      អានបញ្ជាក់ស្ដង់ដារ CS 001, គ្រឿងផ្សំ, តារាងអាហារូបត្ថម្ភ, និងប្រភពកសិករ
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Language Selector */}
                  <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => handleChangeSpeechLang('km')}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                        speechLang === 'km' ? 'bg-emerald-500 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      🇰🇭 ភាសាខ្មែរ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeSpeechLang('en')}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                        speechLang === 'en' ? 'bg-emerald-500 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      🌐 English
                    </button>
                  </div>

                  {/* Play / Pause Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleSpeak()}
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition cursor-pointer"
                    title={isSpeaking && !isPaused ? 'ផ្អាកការអាន' : 'បន្តការអាន'}
                  >
                    {isSpeaking && !isPaused ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  {/* Stop Button */}
                  <button
                    type="button"
                    onClick={handleStopSpeak}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 border border-slate-700 transition cursor-pointer"
                    title="បញ្ឈប់ការអាន"
                  >
                    <VolumeX size={16} />
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 text-[11px] font-mono bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px]">ល្បឿន:</span>
                    {[0.9, 1.0, 1.2].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleChangeSpeechRate(rate)}
                        className={`px-1.5 py-0.5 rounded text-xs cursor-pointer ${
                          speechRate === rate ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  {/* Close Player */}
                  <button
                    type="button"
                    onClick={() => {
                      handleStopSpeak();
                      setShowAudioPlayer(false);
                    }}
                    className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
                    title="បិទ"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Subtitle / Live Transcript Card */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs text-emerald-100 leading-relaxed font-sans shadow-inner">
                <span className="text-amber-400 font-bold mr-2 text-[10px] uppercase font-mono tracking-wider">អត្ថបទកំពុងអាន (Live Audio Narration):</span>
                {speechLang === 'km' ? (
                  <span>
                    «ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ។ វិញ្ញាបនបត្របច្ចេកទេសគុណភាពកសិផលស្តង់ដារជាតិ CS 001 សម្រាប់ផលិតផល៖ <strong className="text-amber-300">{packagingData.nameKh}</strong> ផលិតដោយ <strong className="text-white">{packagingData.company || 'Mayany Enterprise'}</strong>។ គ្រឿងផ្សំ៖ {packagingData.customIngredients || 'គ្រាប់ស្វាយចន្ទីធម្មជាតិ'}... កាលបរិច្ឆេទ MFD / EXP ត្រូវបានបោះពុម្ពផ្ទាល់លើកញ្ចប់ស្របតាមស្តង់ដារប្រទេសនាំចេញ...»
                  </span>
                ) : (
                  <span>
                    "Official Technical Certificate of Conformance under Standard CS 001 for product: <strong className="text-amber-300">{packagingData.product || packagingData.nameKh}</strong> produced by <strong className="text-white">{packagingData.company || 'Mayany Enterprise'}</strong>. Manufacturing and expiration dates stamped directly on pouch..."
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Certificate Document Body (Printable Paper Layout) - 20 Sections in Exact Requested Order */}
          {(() => {
            const tCert = CERTIFICATE_TRANSLATIONS[passportLang] || CERTIFICATE_TRANSLATIONS['en'];
            const rawEan = packagingData.ean13 || '8847116350221';
            const formattedEan = formatEan13(rawEan);
            const barcodeBinary = ean13ToBinary(formattedEan);

            const isMilkDedicated = Boolean(
              packagingData.product?.toLowerCase().includes('milk') ||
              packagingData.product?.toLowerCase().includes('drink') ||
              packagingData.nameKh?.includes('ទឹកដោះគោ') ||
              packagingData.flavor === 'cashew_milk' ||
              packagingData.batch?.includes('CM') ||
              packagingData.packageFormat?.toLowerCase().includes('bottle')
            );

            const isLiquidProduct = isMilkDedicated || Boolean(
              packagingData.weight?.toLowerCase().includes('l') ||
              packagingData.weight?.toLowerCase().includes('ml') ||
              packagingData.packageFormat?.toLowerCase().includes('bottle')
            );

            const effectiveWeight = isMilkDedicated ? '1L' : packagingData.weight;

            const packageFormatText = isKhmer 
              ? (isMilkDedicated || packagingData.packageFormat?.toLowerCase().includes('bottle')
                  ? 'ដបកែវសុវត្ថិភាពម្ហូបអាហារ (Food-Grade Glass Bottle)'
                  : isNoodle
                  ? 'កញ្ចប់/ប្រអប់មីអាហារូបត្ថម្ភ (150g Noodle Bag / Box)'
                  : packagingData.packageFormat 
                  ? (packagingData.packageFormat.toLowerCase().includes('jar') ? 'ក្រឡកែវ/PET សុវត្ថិភាពម្ហូបអាហារ បិទត្រាការពារខ្យល់ (Food-Grade Jar)' : 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)')
                  : (effectiveWeight.includes('175') || effectiveWeight.includes('200')
                      ? 'ក្រឡកែវ/PET សុវត្ថិភាពម្ហូបអាហារ បិទត្រាការពារខ្យល់ (Food-Grade Jar)' 
                      : 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)'))
              : passportLang === 'ja'
              ? (isMilkDedicated || packagingData.packageFormat?.toLowerCase().includes('bottle')
                  ? '1000ml 食品用衛生ガラスボトル（密閉キャップ）'
                  : isNoodle
                  ? '栄養カシューナッツ乾麺 パウチ/ボックス (150g)'
                  : packagingData.packageFormatJa || (packagingData.packageFormat?.toLowerCase().includes('jar') || effectiveWeight.includes('175') || effectiveWeight.includes('200')
                      ? '食品用誘導シール密閉ガラス瓶 (Jar)'
                      : 'チャック付き自立型アルミ防湿パウチ (50g Standing Pouch)'))
              : passportLang === 'ko'
              ? (isMilkDedicated || packagingData.packageFormat?.toLowerCase().includes('bottle')
                  ? '식품 등급 1L 위생 유리병 (1L Food-Grade Glass Bottle)'
                  : isNoodle
                  ? '영양 캐슈넛 건면 포장/상자 (150g Noodle Bag / Box)'
                  : packagingData.packageFormat?.toLowerCase().includes('jar') || effectiveWeight.includes('175') || effectiveWeight.includes('200')
                  ? '식품 등급 밀폐 보관 용기 (Jar)'
                  : '스탠드형 지퍼 밀봉 파우치 (50g Standing Pouch)')
              : (isMilkDedicated || packagingData.packageFormat?.toLowerCase().includes('bottle')
                  ? 'Food-Grade Glass Bottle (1L Glass Bottle with Tamper Seal)'
                  : isNoodle
                  ? '150g Nutrient-Rich Cashew Flour Noodle Bag / Box'
                  : packagingData.packageFormat?.toLowerCase().includes('jar') || effectiveWeight.includes('175') || effectiveWeight.includes('200')
                  ? 'Food-Grade Induction Sealed Jar'
                  : 'Food-Grade Stand-Up Barrier Pouch with Zipper (50g Standing Pouch)');

            const isPouchWeight = !isMilkDedicated && Boolean(
              (packagingData.packageFormat && (packagingData.packageFormat.toLowerCase().includes('pouch') || packagingData.packageFormat.includes('កញ្ចប់') || packagingData.packageFormat.includes('ថង់'))) ||
              effectiveWeight.includes('50g') ||
              effectiveWeight.includes('50 g')
            );
            const isJarWeight = !isMilkDedicated && Boolean(
              packagingData.packageFormat && (packagingData.packageFormat.toLowerCase().includes('jar') || packagingData.packageFormat.includes('កំប៉ុង') || packagingData.packageFormat.includes('ក្រឡ') || packagingData.packageFormat.includes('tub'))
            );
            const isExplicitNetWeight = isMilkDedicated || (!isPouchWeight && (
              isJarWeight ||
              (effectiveWeight && (effectiveWeight.toLowerCase().includes('net') || effectiveWeight.includes('សុទ្ធ')))
            ));

            const storyData = getMayanyProductStory(packagingData.nameKh, packagingData.product, passportLang);
            const userCustomDesc = (packagingData.description && packagingData.description.trim()) || '';
            const isDescKhmer = userCustomDesc && /[\u1780-\u17FF]/.test(userCustomDesc);
            const isPepper = Boolean(
              packagingData.flavor?.toLowerCase().includes('pepper') ||
              packagingData.product?.toLowerCase().includes('pepper') ||
              packagingData.nameKh?.includes('ម្រេច') ||
              packagingData.customIngredients?.includes('ម្រេច')
            );
            const isChili = Boolean(
              packagingData.flavor?.toLowerCase().includes('chili') ||
              packagingData.product?.toLowerCase().includes('chili') ||
              packagingData.nameKh?.includes('ម្ទេស') ||
              packagingData.customIngredients?.includes('ម្ទេស')
            );
            const officialDescription = (isKhmer && !isDescKhmer)
              ? (storyData.paragraphs && storyData.paragraphs.length > 0
                  ? storyData.paragraphs.join('\n\n')
                  : (isFlour
                      ? 'ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ រាល់ដំណាក់កាលនៃការផលិតត្រូវបានយកចិត្តទុកដាក់ និងសម្រិតសម្រាំង ដើម្បីរក្សាបាននូវគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមគោលការណ៍សុវត្ថិភាពម្ហូបអាហារ។ ផលិតផលនេះមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។'
                      : (isPepper
                          ? 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ និងម្រេចខ្មៅកំពត GI ដ៏ល្បីល្បាញលើពិភពលោក។ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ CS 001 ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពតផ្តល់នូវរសជាតិឈ្ងុយហឹរស្រាល ស្រួយឆ្ងាញ់ធម្មជាតិ និងជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។'
                          : `${packagingData.nameKh || ensureKhmerProductName(packagingData.nameKh, packagingData.product)} ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាធម្មជាតិដែលប្រមូលផលដោយដៃពីចម្ការកសិករក្នុងខេត្តកំពង់ធំ។ ឆ្លងកាត់ការកែច្នៃសម្រិតសម្រាំង និងលីងស្រោបគ្រឿងទេសធម្មជាតិកម្ពុជា ស្របតាមស្តង់ដារគុណភាព និងអនាម័យខ្ពស់បំផុត។`)))
              : (!isKhmer && isDescKhmer)
              ? (storyData.paragraphs && storyData.paragraphs.length > 0
                  ? storyData.paragraphs.join('\n\n')
                  : (passportLang === 'ko'
                      ? (isFlour
                          ? '100% 순수 캐슈넛 가루는 캄보디아 왕국 캄퐁톰(Kampong Thom) 지역에서 재배되고 탈각된 프리미엄 캐슈넛으로 제조됩니다. 모든 생산 과정은 식품 안전 원칙에 따라 품질, 안전 및 위생을 철저히 유지하기 위해 세심하게 관리됩니다. 방부제, 인공 향료 및 색소를 일체 첨가하지 않았습니다.'
                          : `${packagingData.nameKo || packagingData.product}은(는) 캄보디아 캄퐁톰 지역의 현지 농가에서 직접 수확한 프리미엄 캐슈넛으로 제조되며, 엄격한 위생 및 안전 기준을 준수하여 생산됩니다.`)
                      : (isFlour
                          ? 'Pure cashew kernel flour produced from cashew nuts grown and shelled in Kampong Thom province, Kingdom of Cambodia. Meticulously cold-milled under strict food safety protocols with zero added salt, zero sugar, and no preservatives.'
                          : `${packagingData.product} is crafted from selected Cambodian cashews hand-harvested by local farming communities in Kampong Thom province, naturally seasoned to perfection.`)))
              : (userCustomDesc || (storyData.paragraphs && storyData.paragraphs.length > 0
                  ? storyData.paragraphs.join('\n\n')
                  : (isFlour
                      ? (isKhmer
                          ? 'ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ រាល់ដំណាក់កាលនៃការផលិតត្រូវបានយកចិត្តទុកដាក់ និងសម្រិតសម្រាំង ដើម្បីរក្សាបាននូវគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមគោលការណ៍សុវត្ថិភាពម្ហូបអាហារ។ ផលិតផលនេះមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។'
                          : passportLang === 'ko'
                          ? '100% 순수 캐슈넛 가루는 캄보디아 왕국 캄퐁톰(Kampong Thom) 지역에서 재배되고 탈각된 프리미엄 캐슈넛으로 제조됩니다. 모든 생산 과정은 식품 안전 원칙에 따라 품질, 안전 및 위생을 철저히 유지하기 위해 세심하게 관리됩니다. 방부제, 인공 향료 및 색소를 일체 첨가하지 않았습니다.'
                          : 'Pure cashew kernel flour produced from cashew nuts grown and shelled in Kampong Thom province, Kingdom of Cambodia. Meticulously cold-milled under strict food safety protocols with zero added salt, zero sugar, and no preservatives.')
                      : (isKhmer
                          ? `${packagingData.nameKh} ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាធម្មជាតិដែលប្រមូលផលដោយដៃពីចម្ការកសិករក្នុងខេត្តកំពង់ធំ។ ឆ្លងកាត់ការកែច្នៃសម្រិតសម្រាំង និងលីងស្រោបគ្រឿងទេសធម្មជាតិកម្ពុជា ស្របតាមស្តង់ដារគុណភាព និងអនាម័យខ្ពស់បំផុត។`
                          : passportLang === 'ko'
                          ? `${packagingData.nameKo || packagingData.product}은(는) 캄보디아 캄퐁톰 지역의 현지 농가에서 직접 수확한 프리미엄 캐슈넛으로 제조되며, 엄격한 위생 및 안전 기준을 준수하여 생산됩니다.`
                          : `${packagingData.product} is crafted from selected Cambodian cashews hand-harvested by local farming communities in Kampong Thom province, naturally seasoned to perfection.`))));

            const userCustomStory = (packagingData.botanical && packagingData.botanical.trim() && !packagingData.botanical.includes('Anacardium')) ? packagingData.botanical.trim() : '';
            const isStoryKhmer = userCustomStory && /[\u1780-\u17FF]/.test(userCustomStory);
            const storyParagraphs = (isKhmer && !isStoryKhmer)
              ? storyData.paragraphs
              : (!isKhmer && isStoryKhmer)
              ? storyData.paragraphs
              : (userCustomStory
                  ? userCustomStory.split('\n').filter(p => p.trim())
                  : storyData.paragraphs);

            const benefitsList = (storyData.benefits && storyData.benefits.length > 0) ? storyData.benefits : [];

            const certParsedIngredients = parseIngredientsWithPercentages(
              packagingData.customIngredients,
              packagingData.cashewPct,
              packagingData.spice,
              packagingData.spicePct,
              packagingData.sugarPct,
              packagingData.saltPct,
              isFlour,
              isKhmer,
              passportLang
            );

            return (
              <div 
                id="printable-product-certificate"
                className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 border-2 border-slate-800 shadow-xl space-y-6 text-slate-900 max-w-4xl mx-auto"
              >
                {/* 1. LOGO AND BRAND NAME */}
                <div className="text-center space-y-2 border-b-2 border-slate-800 pb-5">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pb-2">
                    <MayanyLogo customLogo={(typeof window !== 'undefined' ? (localStorage.getItem('cashewtrace_sme_brand_logo') || undefined) : undefined) || packagingData.customLogo} className="h-16 sm:h-20 w-auto object-contain" />
                    <div className="hidden sm:block h-12 w-px bg-amber-300" />
                    <div className="text-center sm:text-left space-y-0.5">
                      <p className="text-sm font-black text-slate-950 font-serif tracking-wider">
                        {tCert.brandName}
                      </p>
                      <p className="text-[11px] text-slate-600 font-sans">
                        {tCert.brandSubtitle}
                      </p>
                      <p className="text-[10px] text-emerald-800 font-mono font-bold">
                        {tCert.mistiBadge}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-bold tracking-widest text-slate-900 font-sans">
                    {tCert.kingdomHeader}
                  </p>
                  <p className="text-xs font-semibold tracking-wider text-slate-600 font-serif">
                    {tCert.motto}
                  </p>
                  <div className="text-amber-800 text-xs my-1 font-mono">❖ ❖ ❖</div>
                  
                  <div className="inline-block px-4 py-1.5 rounded-xl bg-amber-100/90 border border-amber-300 mt-1">
                    <span className="text-xs sm:text-sm font-black text-amber-950 tracking-wide block font-sans">
                      🇰🇭 {tCert.certTitle}
                    </span>
                    <span className="text-[10px] text-slate-700 font-medium block font-sans">
                      {tCert.certSubtitle}
                    </span>
                  </div>
                </div>

                {/* 2. PRODUCT NAME IN KHMER AND ENGLISH */}
                <div className="text-center py-4 space-y-2.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block font-mono">
                    {tCert.productNameSectionHeader}
                  </span>
                  
                  {/* Khmer Name */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-500 font-sans">
                      {tCert.productNameKhmerLabel}:
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-sans">
                      {ensureKhmerProductName(packagingData.nameKh, packagingData.product)}
                    </h2>
                  </div>

                  {/* English Name */}
                  <div className="space-y-0.5 pt-1 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 font-sans">
                      {tCert.productNameEnLabel}:
                    </div>
                    <p className="text-base font-bold text-slate-800 font-sans">
                      {packagingData.product}
                      {packagingData.flavor && 
                       !isFlour && 
                       packagingData.flavor.toLowerCase() !== 'roasted' && 
                       packagingData.flavor.toLowerCase() !== 'pure' && 
                       packagingData.flavor.toLowerCase() !== 'pure flour' && 
                       packagingData.flavor.toLowerCase() !== 'pure_flour' && 
                       packagingData.flavor.toLowerCase() !== 'pure natural flour' && 
                       !packagingData.product.toLowerCase().includes(packagingData.flavor.toLowerCase()) 
                        ? ` (${packagingData.flavor})` 
                        : ''}
                    </p>
                  </div>

                  {/* Korean Name (when Korean is selected) */}
                  {passportLang === 'ko' && (
                    <div className="space-y-0.5 pt-1 border-t border-slate-100">
                      <div className="text-xs font-semibold text-indigo-700 font-sans">
                        {tCert.productNameKoLabel}:
                      </div>
                      <p className="text-sm sm:text-base font-bold text-indigo-950 font-sans">
                        {getStandardKoreanProductName(packagingData.nameKh, packagingData.product, isFlour)}
                      </p>
                    </div>
                  )}

                  {/* Japanese Name (when Japanese is selected) */}
                  {passportLang === 'ja' && (
                    <div className="space-y-0.5 pt-1 border-t border-slate-100">
                      <div className="text-xs font-semibold text-rose-700 font-sans">
                        {tCert.productNameKoLabel || '日本語名称'}:
                      </div>
                      <p className="text-sm sm:text-base font-bold text-rose-950 font-sans">
                        {packagingData.nameJa || packagingData.product}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. SCIENTIFIC NAME IN ENGLISH */}
                <div className="text-center py-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 block font-mono">
                    {tCert.scientificNameSectionHeader}
                  </span>
                  <div className="text-base sm:text-lg font-bold text-amber-950 italic font-serif tracking-wide">
                    {isPepper
                      ? 'Anacardium occidentale & Piper nigrum L.'
                      : isChili
                      ? 'Anacardium occidentale & Capsicum frutescens'
                      : tCert.scientificClassification}
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium font-sans">
                    {isKhmer 
                      ? (isPepper ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា & ម្រេចខ្មៅកំពត GI' : isChili ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា & ម្ទេសធម្មជាតិ' : tCert.scientificNameLabel)
                      : tCert.scientificNameLabel}
                  </p>
                </div>

                {/* 4. PRODUCT DESCRIPTION */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2 text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                    <span className="font-black text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>📜</span>
                      <span>{tCert.descriptionHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                      {tCert.descriptionSub}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12px] text-slate-800 leading-relaxed font-sans text-justify indent-2 whitespace-pre-line">
                    {officialDescription}
                  </p>
                </div>

                {/* 5. WEIGHT / VOLUME */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>{isLiquidProduct ? '🥛' : '⚖️'}</span>
                      <span>
                        {isLiquidProduct 
                          ? (tCert.volumeHeader || 'ចំណុះសុទ្ធ & ទម្រង់វេចខ្ចប់ផ្លូវការ') 
                          : (isExplicitNetWeight ? tCert.weightHeader : tCert.weightHeaderGeneral)}
                      </span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                      {formatWeightBadge(effectiveWeight)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold block">
                        {isLiquidProduct 
                          ? (tCert.netVolumeLabel || 'ចំណុះសុទ្ធផ្លូវការ') 
                          : (isExplicitNetWeight ? tCert.netWeightLabel : tCert.weightLabelGeneral)}:
                      </span>
                      <p className="text-base font-black text-slate-900 font-mono">
                        {formatWeightBadge(effectiveWeight)}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold block">{tCert.packagingFormatLabel}:</span>
                      <p className="text-xs font-semibold text-slate-800">{packageFormatText}</p>
                    </div>
                  </div>
                </div>

                {/* 6. INGREDIENT LIST */}
                <div className="space-y-4 text-xs bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm font-sans">
                        {tCert.ingredientsSectionHeader}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                        {tCert.ingredientsSub}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold border border-emerald-200 flex items-center gap-1">
                      ✓ {isKhmer ? 'ម៉ាស់សរុប ១០០%' : passportLang === 'ko' ? '총 함량 100%' : 'Total 100% Mass'}
                    </span>
                  </div>

                  {/* Dynamic Percentage Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
                    {certParsedIngredients.map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 text-xs truncate" title={item.name}>
                            {item.name}
                          </span>
                          <span className="font-black text-slate-950 font-mono text-sm bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs shrink-0">
                            {item.percent > 0 ? `${item.percent}%` : '—'}
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`${item.color} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(100, Math.max(3, item.percent))}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{item.badge}</span>
                          <span>{item.percent > 0 ? (packagingData.product.toLowerCase().includes('milk') || packagingData.nameKh.includes('ទឹកដោះគោ') || packagingData.weight?.includes('L') || packagingData.weight?.includes('ml') ? `${item.percent} ml / 100ml` : `${item.percent} ${isKhmer ? 'ក្រាម / ១០០g' : 'g / 100g'}`) : (isKhmer ? 'ដានតិចតួច' : 'Trace')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Full Declaration */}
                  <div className="text-xs text-slate-700 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 leading-relaxed font-sans space-y-1">
                    <div className="font-black text-amber-950 flex items-center gap-1.5">
                      <span>📜</span>
                      <span>{tCert.fullDeclarationHeader}</span>
                    </div>
                    <div className="text-slate-800">
                      {translateIngredientsToLanguage(
                        packagingData.customIngredients || (isFlour
                          ? 'ម្សៅគ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០% • គ្មានបន្ថែមអំបិល គ្មានស្ករ គ្មានសារធាតុរក្សាទុក គ្មានបន្ថែមក្លិន គ្មានបន្ថែមពណ៌'
                          : `${packagingData.nameKh || packagingData.product}៖ គ្រាប់ស្វាយចន្ទី ${packagingData.grade || ''} (${packagingData.cashewPct || 92}%), គ្រឿងទេសធម្មជាតិ (${packagingData.spicePct || 5}%), ស្ករត្នោត (${packagingData.sugarPct || 2}%), អំបិលសមុទ្រ (${packagingData.saltPct || 1}%)។`),
                        passportLang
                      )}
                    </div>
                  </div>

                  {/* Explicit Ingredient Suppliers Traceability List */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200 pb-1.5">
                      <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                        <span>🌱</span>
                        <span>{isKhmer ? 'បញ្ជីអ្នកផ្គត់ផ្គង់តាមគ្រឿងផ្សំនីមួយៗ' : passportLang === 'ko' ? '원재료별 공급업체 목록 (Ingredient Suppliers)' : 'Ingredient Suppliers Traceability List'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        ✓ {isKhmer ? 'ប្រភពកម្ពុជា ១០០%' : '100% Cambodian Sourced'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                      {/* Cashew Supplier */}
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-bold block">
                          🥜 {isKhmer ? 'គ្រាប់ស្វាយចន្ទី' : 'Cashew Kernels'}:
                        </span>
                        <p className="font-black text-slate-950 text-xs">Mirarth Agri Tech Co., Ltd.</p>
                        <span className="text-[10px] text-emerald-700 font-medium block">
                          {isKhmer ? 'កំពង់ធំ • រោងចក្របកសំបក' : 'Kampong Thom • Peeling Facility'}
                        </span>
                      </div>

                      {/* Pepper Supplier - strictly excluded for Chili products and when not in selectedSuppliers */}
                      {(!isChili && (packagingData.flavor.toLowerCase().includes('pepper') || packagingData.product.toLowerCase().includes('pepper') || packagingData.nameKh.includes('ម្រេច') || packagingData.customIngredients.includes('ម្រេច')) && (packagingData.selectedSuppliers && packagingData.selectedSuppliers.some(s => s.includes('BOH') || s.includes('ម្រេច') || s.toLowerCase().includes('pepper')))) && (
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
                          <span className="text-[10px] text-slate-500 font-bold block">
                            🌿 {isKhmer ? 'ម្រេចខ្មៅកំពត GI' : 'GI Kampot Pepper'}:
                          </span>
                          <p className="font-black text-slate-950 text-xs">BOH Co., Ltd.</p>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            {isKhmer ? 'ខេត្តកំពត • សមាគមម្រេចកំពត GI' : 'Kampot • Certified GI Association'}
                          </span>
                        </div>
                      )}

                      {/* Pandan Powder Supplier - Ringacam Enterprise */}
                      {(packagingData.product.toLowerCase().includes('milk') || packagingData.nameKh.includes('ទឹកដោះគោ') || packagingData.customIngredients.includes('ស្លឹកតើយ') || packagingData.customIngredients.includes('ស្លឹកតយ') || packagingData.customIngredients.toLowerCase().includes('pandan') || (packagingData.selectedSuppliers && packagingData.selectedSuppliers.some(s => (s.toLowerCase().includes('ringacam') || s.toLowerCase().includes('rincagam')) && (s.includes('ស្លឹកតើយ') || s.includes('ស្លឹកតយ') || s.toLowerCase().includes('pandan') || packagingData.nameKh.includes('ទឹកដោះគោ') || packagingData.product.toLowerCase().includes('milk'))))) && (
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
                          <span className="text-[10px] text-slate-500 font-bold block">
                            🌿 {isKhmer ? 'ម្សៅស្លឹកតើយ' : 'Pandan Powder'}:
                          </span>
                          <p className="font-black text-slate-950 text-xs">Ringacam Enterprise</p>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            {isKhmer ? 'រាជធានីភ្នំពេញ • ម្សៅស្លឹកតើយធម្មជាតិ G.D.G' : 'Phnom Penh • Natural Pandan Powder'}
                          </span>
                        </div>
                      )}

                      {/* Chili Supplier - strictly excluded for Milk and non-chili products */}
                      {!packagingData.nameKh.includes('ទឹកដោះគោ') && !packagingData.product.toLowerCase().includes('milk') && (isChili || packagingData.flavor.toLowerCase().includes('chili') || packagingData.product.toLowerCase().includes('chili') || packagingData.nameKh.includes('ម្ទេស') || packagingData.customIngredients.includes('ម្ទេស')) && (!packagingData.selectedSuppliers || packagingData.selectedSuppliers.length === 0 || packagingData.selectedSuppliers.some(s => s.includes('Ringacam') || s.includes('ម្ទេស') || s.toLowerCase().includes('chili'))) && (
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
                          <span className="text-[10px] text-slate-500 font-bold block">
                            🌶️ {isKhmer ? 'ម្សៅម្ទេសធម្មជាតិ G.D.G' : 'Natural Chili Powder'}:
                          </span>
                          <p className="font-black text-slate-950 text-xs">Ringacam Enterprise</p>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            {isKhmer ? 'រាជធានីភ្នំពេញ • ស្តង់ដារជាតិ' : 'Phnom Penh • Food Safety Standard'}
                          </span>
                        </div>
                      )}

                      {/* Sugar Supplier - displays whenever Angkor Sugar is in selectedSuppliers OR product is pepper / sugar OR contains sugar */}
                      {(isPepper || packagingData.flavor.toLowerCase().includes('pepper') || (packagingData.selectedSuppliers && packagingData.selectedSuppliers.some(s => s.toLowerCase().includes('angkor') || s.toLowerCase().includes('sugar') || s.includes('ស្ករ'))) || (!isChili && (packagingData.flavor.toLowerCase().includes('sugar') || packagingData.product.toLowerCase().includes('sugar') || packagingData.nameKh.includes('ស្ករ') || packagingData.customIngredients.includes('ស្ករ')))) && (
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
                          <span className="text-[10px] text-slate-500 font-bold block">
                            🍯 {isKhmer ? 'ស្ករត្នោត / ស្ករសចម្រាញ់' : 'Refined / Artisan Sugar'}:
                          </span>
                          <p className="font-black text-slate-950 text-xs">Angkor Sugar</p>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            {isKhmer ? 'ខេត្តកំពង់ស្ពឺ • ស្ករសចម្រាញ់សុទ្ធ' : 'Kampong Speu • Refined Sugar'}
                          </span>
                        </div>
                      )}

                      {/* Salt Supplier */}
                      {!isFlour && (!packagingData.selectedSuppliers || packagingData.selectedSuppliers.length === 0 || packagingData.selectedSuppliers.some(s => s.includes('Ngov Heng') || s.includes('អំបិល') || s.toLowerCase().includes('salt'))) && (
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
                          <span className="text-[10px] text-slate-500 font-bold block">
                            🧂 {isKhmer ? 'អំបិលសមុទ្រកំពត' : 'Kampot Sea Salt'}:
                          </span>
                          <p className="font-black text-slate-950 text-xs">Ngov Heng</p>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            {isKhmer ? 'ខេត្តកំពត • អំបិលសមុទ្រធម្មជាតិ' : 'Kampot Province • Natural Salt'}
                          </span>
                        </div>
                      )}

                      {/* Custom / Additional Selected Suppliers */}
                      {packagingData.selectedSuppliers && packagingData.selectedSuppliers
                        .filter(s => 
                          !s.toLowerCase().includes('mirarth') && 
                          !s.toLowerCase().includes('boh') && 
                          !s.toLowerCase().includes('ringacam') && 
                          !s.toLowerCase().includes('angkor') && 
                          !s.toLowerCase().includes('ngov') &&
                          !s.includes('ស្វាយចន្ទី') &&
                          !s.includes('ម្រេច') &&
                          !s.includes('ម្ទេស') &&
                          !s.includes('ស្ករ') &&
                          !s.includes('អំបិល')
                        )
                        .map((customSup, idx) => (
                          <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
                            <span className="text-[10px] text-slate-500 font-bold block">
                              🌾 {isKhmer ? 'ដៃគូផ្គត់ផ្គង់បន្ថែម' : 'Additional Sourcing Partner'}:
                            </span>
                            <p className="font-black text-slate-950 text-xs truncate">{customSup}</p>
                            <span className="text-[10px] text-emerald-700 font-medium block">
                              {isKhmer ? 'ដៃគូដែលបានផ្ទៀងផ្ទាត់' : 'Verified Partner'}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* 7. NUTRITION FACT */}
                <div className="space-y-3 text-xs bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span>{tCert.nutritionHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {tCert.nutritionSub}
                    </span>
                  </div>

                  {/* Complete Nutrient Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs font-mono">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.energyLabel}</span>
                      <span className="font-black text-slate-950 text-sm">{packagingData.nutrition?.energyKcal || '580'} kcal</span>
                      <span className="text-[9.5px] text-slate-500 block">({packagingData.nutrition?.energyKj || '2426'} kJ)</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.proteinLabel}</span>
                      <span className="font-black text-emerald-800 text-sm">{packagingData.nutrition?.protein || '18.2'} g</span>
                      <span className="text-[9.5px] text-emerald-700 block font-sans">{isKhmer ? 'ប្រូតេអ៊ីនរុក្ខជាតិ' : passportLang === 'ko' ? '식물성 단백질' : 'Plant Protein'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.totalFatLabel}</span>
                      <span className="font-black text-slate-950 text-sm">{packagingData.nutrition?.totalFat || '43.8'} g</span>
                      <span className="text-[9.5px] text-slate-500 block font-sans">{isKhmer ? 'ខ្លាញ់ល្អមិនឆ្អែត' : passportLang === 'ko' ? '건강한 불포화지방' : 'Healthy Fats'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.saturatedFatLabel}</span>
                      <span className="font-bold text-slate-800">{packagingData.nutrition?.saturatedFat || '7.8'} g</span>
                      <span className="text-[9.5px] text-slate-400 block font-sans">{isKhmer ? 'ខ្លាញ់ឆ្អែតធម្មជាតិ' : passportLang === 'ko' ? '천연 포화지방' : 'Naturally occurring'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.transFatLabel}</span>
                      <span className="font-bold text-slate-800">{packagingData.nutrition?.transFat || '0.0'} g</span>
                      <span className="text-[9.5px] text-emerald-700 block font-sans">{isKhmer ? 'គ្មានខ្លាញ់ឆ្លង (០%)' : passportLang === 'ko' ? '트랜스지방 0%' : '0% Trans Fat'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.cholesterolLabel}</span>
                      <span className="font-bold text-slate-800">{packagingData.nutrition?.cholesterol || '0'} mg</span>
                      <span className="text-[9.5px] text-emerald-700 block font-sans">{isKhmer ? 'គ្មានកូឡេស្តេរ៉ុល' : passportLang === 'ko' ? '콜레스테롤 0%' : 'Cholesterol Free'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.totalCarbLabel}</span>
                      <span className="font-black text-slate-950 text-sm">{packagingData.nutrition?.totalCarb || '30.1'} g</span>
                      <span className="text-[9.5px] text-slate-500 block font-sans">{isKhmer ? 'ថាមពលយូរអង្វែង' : passportLang === 'ko' ? '복합 탄수화물' : 'Complex Carbs'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.dietaryFiberLabel}</span>
                      <span className="font-bold text-slate-800">{packagingData.nutrition?.dietaryFiber || '3.3'} g</span>
                      <span className="text-[9.5px] text-slate-500 block font-sans">{isKhmer ? 'ជំនួយការរំលាយអាហារ' : passportLang === 'ko' ? '장 건강 지원' : 'Digestive health'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.totalSugarsLabel}</span>
                      <span className="font-bold text-slate-800">{packagingData.nutrition?.totalSugars || '5.9'} g</span>
                      <span className="text-[9.5px] text-slate-400 block font-sans">{isKhmer ? 'ស្ករធម្មជាតិពីគ្រាប់' : passportLang === 'ko' ? '견과 천연 당' : 'Natural nut sugars'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.addedSugarsLabel}</span>
                      <span className="font-bold text-slate-800">{packagingData.nutrition?.addedSugars || '0.0'} g</span>
                      <span className="text-[9.5px] text-emerald-700 block font-sans">{isKhmer ? 'គ្មានស្ករបន្ថែមគីមី' : passportLang === 'ko' ? '인공 첨가당 0%' : 'No refined sugars'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.sodiumLabel}</span>
                      <span className="font-bold text-slate-800">{packagingData.nutrition?.sodium || '8'} mg</span>
                      <span className="text-[9.5px] text-slate-400 block font-sans">{isKhmer ? 'កម្រិតទាប' : passportLang === 'ko' ? '저나트륨' : 'Low Sodium'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{tCert.saltLabel}</span>
                      <span className="font-bold text-slate-800">{packagingData.nutrition?.salt || '0.02'} g</span>
                      <span className="text-[9.5px] text-slate-400 block font-sans">{isKhmer ? 'អំបិលធម្មជាតិ' : passportLang === 'ko' ? '천연 식염' : 'Natural salt'}</span>
                    </div>
                  </div>
                </div>

                {/* 8. HEALTH BENEFITS */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 text-slate-900">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="font-black text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>✨</span>
                      <span>{tCert.benefitsHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full">
                      {tCert.benefitsBadge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
                    {benefitsList.map((benefit, bIdx) => (
                      <div key={bIdx} className="p-2.5 rounded-xl bg-white border border-emerald-200/90 shadow-2xs space-y-0.5">
                        <span className="font-bold text-emerald-900 flex items-center gap-1">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{benefit.title}</span>
                        </span>
                        {benefit.desc && (
                          <p className="text-slate-600 text-[10.5px] leading-tight pl-2.5">
                            {benefit.desc}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 9. HOW TO USE */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>🥣</span>
                      <span>{tCert.usageHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                      {tCert.usageSub}
                    </span>
                  </div>
                  <div className="text-xs sm:text-[12px] text-slate-800 leading-relaxed font-sans whitespace-pre-line font-medium">
                    {translateUsageToLanguage(
                      (isFlour && (packagingData.instructionsForUse?.includes('250ml') || packagingData.instructionsForUse?.includes('៨៥°C') || !packagingData.instructionsForUse?.trim()))
                        ? '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ'
                        : (packagingData.instructionsForUse || (isFlour
                            ? '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ'
                            : 'អាចទទួលទានភ្លាមៗជាអាហារសម្រន់សុខភាព ឬប្រើជាគ្រឿងបន្ថែមរសជាតិលើសាឡាត់ បបរ និងម្ហូបអាហារផ្សេងៗ។ ក្រោយបើកកញ្ចប់រួច ត្រូវបិទខ្សែរូតឱ្យជិតដើម្បីរក្សាភាពស្រួយឆ្ងាញ់។')),
                      passportLang,
                      isFlour
                    )}
                  </div>
                </div>

                {/* 10. STORAGE INFO */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="font-black text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>❄️</span>
                      <span>{tCert.storageHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                      {tCert.storageSub}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12px] text-slate-800 leading-relaxed font-sans">
                    {translateStorageToLanguage(packagingData.storage || (isKhmer ? 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ ក្រោយបើកប្រើរួច ត្រូវបិទខ្សែរូត ឬគម្របឱ្យជិត។' : 'Store in a cool, dry place (< 25°C). Keep away from direct sunlight and moisture. Reseal tightly after opening.'), passportLang)}
                  </p>
                </div>

                {/* 11. ALLERGEN INFO */}
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 font-sans space-y-1.5">
                  <div className="flex items-center justify-between border-b border-rose-200/80 pb-1.5">
                    <span className="font-black text-rose-950 text-xs sm:text-sm flex items-center gap-1.5">
                      <AlertCircle size={15} className="text-rose-600 shrink-0" />
                      <span>{tCert.allergenAdvisoryHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-rose-200 text-rose-950 px-2 py-0.5 rounded-full">
                      {tCert.allergenSub}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12px] text-rose-900 leading-relaxed pl-1 font-medium">
                    {translateAllergenToLanguage(packagingData.allergen || 'Contains tree nuts: Cashew Nuts (ផ្ទុកសារធាតុអាឡែហ្ស៊ី៖ គ្រាប់ស្វាយចន្ទី)', passportLang)}
                  </p>
                </div>

                {/* 12. PRODUCT STORY */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 border-2 border-amber-300/80 space-y-3 shadow-xs text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200/90 pb-2">
                    <span className="font-black text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>🌾</span>
                      <span>{tCert.storyHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300">
                      {tCert.storyBadge}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-[12px] text-slate-800 leading-relaxed font-sans text-justify">
                    {storyParagraphs.map((para, pIdx) => (
                      <p key={pIdx} className="indent-2">
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-amber-100">
                    {storyData.badges.map((badge, idx) => (
                      <span key={idx} className="bg-white text-emerald-950 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs">
                        ✓ {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 13. MANUFACTURED BY (EXCLUSIVELY MAYANY ENTERPRISE) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-900">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                    {tCert.producerHeader}:
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950 text-base font-sans flex items-center gap-2">
                        <span>{tCert.producerName}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full font-mono">
                          {isKhmer ? 'សហគ្រាសផលិតផ្តាច់មុខ' : passportLang === 'ko' ? '단독 공식 제조원' : 'Sole Manufacturer'}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                        {tCert.producerNameLabel} • {isKhmer ? 'ទទួលខុសត្រូវលើរូបមន្ត ការកែច្នៃ និងការវេចខ្ចប់ស្តង់ដារជាតិ CS 001:2000' : passportLang === 'ko' ? '국가 표준 CS 001:2000 가공 및 패키징 책임 제조 기업' : 'Responsible for Formulation, Processing & Packaging under CS 001:2000'}
                      </p>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-sans flex items-center gap-2 text-amber-950 shrink-0">
                      <span className="text-base">🏛️</span>
                      <div>
                        <span className="text-[10px] text-amber-800 font-medium block">{isKhmer ? 'សហគ្រាសផលិតផ្លូវការ' : 'Official Manufacturer'}</span>
                        <strong className="text-amber-950 font-black">Mayany Enterprise</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 14. ADDRESS */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 text-slate-900 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                    {tCert.addressHeader}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold block">{tCert.addressLabel}:</span>
                      <p className="text-slate-900 font-medium">{tCert.addressText}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold block">{tCert.originSourcingLabel}:</span>
                      <p className="text-emerald-950 font-bold">{tCert.originSourcingText}</p>
                    </div>
                  </div>
                </div>

                {/* 15. CONTACT INFO */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-slate-900">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                    {tCert.contactHeader}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      <Phone size={14} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">{tCert.phoneLabel}</span>
                        <a href="tel:+855887712862" className="font-bold text-emerald-900 font-mono hover:underline">+855 88 771 2862</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      <Mail size={14} className="text-indigo-600 shrink-0" />
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">{tCert.emailLabel}</span>
                        <a href="mailto:mayany@mayanyenterprise.com" className="font-bold text-indigo-900 hover:underline text-[11px]">mayany@mayanyenterprise.com</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      <Globe size={14} className="text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">{tCert.websiteLabel}</span>
                        <a href="https://mayanyenterprise.com" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-900 font-mono hover:underline text-[11px]">mayanyenterprise.com</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      <Facebook size={14} className="text-blue-600 shrink-0" />
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">{tCert.facebookLabel}</span>
                        <a href="https://www.facebook.com/MayanyEnterprise" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-900 hover:underline text-[11px]">Mayany Enterprise</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 16, 17, 18. DATES, LOT NUMBER & SECONDARY LABEL (2ND LABEL) SPECIFICATION */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 border-2 border-amber-300 space-y-4 text-slate-900 shadow-xs">
                  {/* Secondary Label Official Regulatory Callout Banner */}
                  <div className="bg-amber-100/90 border border-amber-300/80 rounded-xl p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🏷️</span>
                        <h4 className="text-xs sm:text-sm font-black text-amber-950 font-sans">
                          {tCert.secondLabelNoticeTitle}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full border border-amber-500 shadow-2xs">
                        {tCert.secondLabelBadge}
                      </span>
                    </div>

                    <p className="text-xs text-amber-950 leading-relaxed font-sans font-medium">
                      {tCert.secondLabelNoticeText}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] font-sans">
                      <div className="bg-white/80 p-2 rounded-lg border border-amber-200 text-slate-700">
                        <span className="font-bold text-amber-950 block">🫙 {tCert.secondLabelJarNotice}</span>
                      </div>
                      <div className="bg-white/80 p-2 rounded-lg border border-amber-200 text-slate-700">
                        <span className="font-bold text-amber-950 block">🛍️ {tCert.secondLabelPouchNotice}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3-Column Specifications Grid: 16. MFD, 17. EXP, 18. LOT */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                    {/* 16. Manufacturing Date (MFD) */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                          16. {tCert.mfdLabel}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                          {tCert.secondLabelBadge}
                        </span>
                      </div>
                      <p className="text-sm font-black text-slate-900 font-mono">
                        {packagingData.mfd || (isKhmer ? 'បោះលើស្លាកបន្ថែម (MTO)' : passportLang === 'ja' ? '別添ラベル打刻 (受注生産)' : passportLang === 'ko' ? '동봉 라벨 날인' : 'Printed on Companion Label (MTO)')}
                      </p>
                      <span className="text-[9.5px] text-slate-500 block">
                        {tCert.mfdSub}
                      </span>
                    </div>

                    {/* 17. Expiry Date (EXP) */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                          17. {tCert.expLabel}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                          {tCert.secondLabelBadge}
                        </span>
                      </div>
                      <p className="text-sm font-black text-slate-900 font-mono">
                        {packagingData.exp || (isKhmer ? 'បោះលើស្លាកបន្ថែម (MTO)' : passportLang === 'ja' ? '別添ラベル打刻 (受注生産)' : passportLang === 'ko' ? '동봉 라벨 날인' : 'Printed on Companion Label (MTO)')}
                      </p>
                      <span className="text-[9.5px] text-slate-600 block">
                        {tCert.shelfLifeLabel}: <strong>{packagingData.shelfLifeMonths || 6} {tCert.shelfLifeMonthsSuffix}</strong>
                      </span>
                    </div>

                    {/* 18. Lot Number (LOT / Batch) */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                          18. {tCert.lotLabel}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                          {(!packagingData.batch || packagingData.batch.toLowerCase().startsWith('mto') || (typeof window !== 'undefined' && !new URLSearchParams(window.location.search).has('batch')))
                            ? 'MTO'
                            : packagingData.batch}
                        </span>
                      </div>
                      <p className="text-sm font-black text-amber-950 font-mono">
                        {(!packagingData.batch || packagingData.batch.toLowerCase().startsWith('mto') || (typeof window !== 'undefined' && !new URLSearchParams(window.location.search).has('batch')))
                          ? (isKhmer 
                              ? 'ស្រស់ៗតាមការបញ្ជាទិញ (Make to Order - សូមពិនិត្យស្លាកបន្ថែម)' 
                              : passportLang === 'ja' 
                              ? '受注生産 (Make to Order - 別添ラベル参照)' 
                              : passportLang === 'ko' 
                              ? '주문 즉시 생산 (Make to Order - 동봉 라벨 확인)' 
                              : 'Make-to-Order (Freshly Batched on Companion Label)')
                          : packagingData.batch}
                      </p>
                      <span className="text-[9.5px] text-slate-500 block truncate" title={tCert.lotSub}>
                        {tCert.lotSub}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-amber-200/60 text-[10.5px] font-sans">
                    <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      ✓ {isKhmer ? 'អនុលោមតាមស្តង់ដារជាតិ CS 001 មាត្រា ៤.៤ & ការនាំចេញអន្តរជាតិ' : passportLang === 'ja' ? 'カンボジア国家規格 CS 001 第4.4条および国際輸出規格適合' : passportLang === 'ko' ? '캄보디아 국가 표준 CS 001 제4.4조 및 수출 규격 준수' : 'Fully Compliant with CS 001 Rule 4.4 & International Export Standard'}
                    </span>
                    <span className="text-slate-600 font-mono">
                      REF: MISTI-CS001-2026-{packagingData.ean13 || packagingData.batch || 'MTO'}
                    </span>
                  </div>
                </div>

                {/* 19. BARCODE */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs space-y-3 text-slate-900 text-center">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-left">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>📊</span>
                      <span>{tCert.barcodeLabel}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      GS1 Cambodia EAN-13
                    </span>
                  </div>

                  {barcodeBinary ? (
                    <div className="inline-block bg-white p-3 rounded-xl border border-slate-200 shadow-inner">
                      <svg
                        className="h-12 w-48 max-w-full mx-auto"
                        viewBox={`0 0 ${barcodeBinary.length} 50`}
                        preserveAspectRatio="none"
                      >
                        {barcodeBinary.split('').map((bit, idx) => (
                          bit === '1' ? (
                            <rect
                              key={idx}
                              x={idx}
                              y={0}
                              width={1}
                              height={50}
                              fill="#0f172a"
                            />
                          ) : null
                        ))}
                      </svg>
                      <div className="text-xs font-mono font-black tracking-widest text-slate-950 mt-1">
                        {formattedEan}
                      </div>
                    </div>
                  ) : (
                    <div className="font-mono text-sm font-bold text-slate-800">{rawEan}</div>
                  )}

                  <p className="text-[10.5px] text-slate-500 font-sans max-w-lg mx-auto">
                    {tCert.barcodeSub}
                  </p>
                </div>

                {/* 20. PRODUCT OF CAMBODIA */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/60 border-2 border-amber-300 space-y-4 text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="font-black text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>🇰🇭</span>
                      <span>{tCert.productOfCambodiaTitle}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full">
                      {tCert.standardsBadge}
                    </span>
                  </div>

                  {/* Standards Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-sans">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">🇰🇭</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{tCert.stdCs001Title}</span>
                        <span className="text-[9.5px] text-slate-500">{tCert.stdCs001Sub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">✓</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{tCert.stdGhpTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{tCert.stdGhpSub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">✓</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{tCert.stdGmpTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{tCert.stdGmpSub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">🛡️</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{tCert.stdHaccpTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{tCert.stdHaccpSub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">🌲</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{tCert.stdEudrTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{tCert.stdEudrSub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">🌾</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{tCert.stdCamGapTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{tCert.stdCamGapSub}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Icons */}
                  <div className="pt-2 border-t border-amber-200/80 space-y-1.5">
                    <span className="font-bold text-slate-900 text-[11px] block font-sans">
                      {tCert.complianceIconsHeader}:
                    </span>
                    <div className="flex flex-wrap items-center gap-2 font-sans">
                      <span className="bg-white text-emerald-950 border border-emerald-300 text-[10.5px] font-bold px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1.5">
                        <span>♻️</span>
                        <span>{tCert.iconRecyclable}</span>
                      </span>
                      <span className="bg-white text-emerald-950 border border-emerald-300 text-[10.5px] font-bold px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1.5">
                        <span>🚫</span>
                        <span>{tCert.iconAntiDrug}</span>
                      </span>
                      <span className="bg-white text-emerald-950 border border-emerald-300 text-[10.5px] font-bold px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1.5">
                        <span>🍽️</span>
                        <span>{tCert.iconFoodGrade}</span>
                      </span>
                      <span className="bg-white text-emerald-950 border border-emerald-300 text-[10.5px] font-bold px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1.5">
                        <span>🌿</span>
                        <span>{tCert.iconNoChemicals}</span>
                      </span>
                      <span className="bg-white text-emerald-950 border border-emerald-300 text-[10.5px] font-bold px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1.5">
                        <span>🇰🇭</span>
                        <span>{tCert.iconSupportKhmer}</span>
                      </span>
                    </div>
                  </div>

                  {/* Verification QR Code and Official Conformance Stamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-4 border-t-2 border-slate-800">
                    <div className="flex items-center gap-4">
                      {liveQrDataUrl ? (
                        <img 
                          src={liveQrDataUrl} 
                          alt="Certificate QR Verification" 
                          className="w-20 h-20 rounded-xl border border-slate-300 p-1 bg-white shadow-xs shrink-0" 
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                          <QrCode size={30} className="text-slate-400" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                          {tCert.verificationHeader}:
                        </span>
                        <p className="text-xs text-slate-800 font-sans leading-tight">
                          {tCert.qrScanNotice}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-mono font-bold">
                          ✓ CASHEWTRACE-VERIFIED-{packagingData.batch}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                      <MayanyRoyalGoldSeal size={56} className="shrink-0" />
                      <div className="text-right space-y-0.5">
                        <div className="inline-block px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-center">
                          <span className="text-[9px] font-bold text-amber-950 uppercase block font-mono">
                            {tCert.digitalSealTitle}
                          </span>
                          <span className="text-xs font-black text-amber-900 block font-sans">
                            {tCert.conformanceSealBadge}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-mono">
                          {tCert.cashewTraceProtocolBadge}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
    </div>
  )}

      {/* VIEW 3: MISTI CITATION & REFERENCES + FEASIBILITY STUDY (FOR INTERNAL ENTERPRISE MANAGERS ONLY) */}
      {!effectiveConsumerMode && activeSubView === 'misti_citation' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* MISTI Official Collaboration Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-blue-500/40 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">
                MISTI Digital Standard Reference
              </span>
              <span className="text-xs font-bold text-amber-300">
                ឯកសារយោងផ្លូវការ និងការសិក្សាលទ្ធភាពវេចខ្ចប់ QR សម្រាប់សហគ្រាសធុនតូច & មធ្យម (MSME)
              </span>
            </div>
            
            <h2 className="text-base sm:text-lg font-bold text-white font-sans">
              តារាងយោងបទដ្ឋានគតិយុត្ត ស្តង់ដារជាតិ CS 001:2000 និងការសិក្សាលទ្ធភាព E-Labeling សម្រាប់ទីផ្សារអន្តរជាតិ
            </h2>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              រៀបចំឡើងជូន <strong>លោកស្រី សេង ម៉ូលីកា (Ms. Seng Molika)</strong> និងក្រុមការងារបច្ចេកវិទ្យាឌីជីថលនៃ <strong>ក្រសួងឧស្សាហកម្ម វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា និងនវានុវត្តន៍ (MISTI)</strong> ជាន់ទី១០ ដើម្បីផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវនៃទិន្នន័យ មុនពេលដាក់ឱ្យប្រើប្រាស់ជាផ្លូវការទូទាំងប្រទេស និងការនាំចេញទៅកាន់ទីផ្សារប្រទេសកូរ៉េ និងអាស៊ាន។
            </p>
          </div>

          {/* POINT 1: OFFICIAL CITATION & REGULATORY REFERENCES TABLE */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-sans">
                    ១. តារាងយោងបទដ្ឋានគតិយុត្ត និងស្តង់ដារបច្ចេកទេស (Legal Citations & Regulatory References)
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    យោងតាមច្បាប់ ស្តង់ដារជាតិកម្ពុជា អនុក្រឹត្យ និងបទប្បញ្ញត្តិនាំចេញអន្តរជាតិ (MISTI, Codex, MFDS Korea)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">
                6 Verified Standards
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Citation 1: CS 001:2000 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition-all space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                    CS 001:2000
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">MISTI / ISC Cambodia</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs font-sans">
                  ស្តង់ដារជាតិកម្ពុជា CS 001:2000៖ ការកត់ស្លាកលើម្ហូបអាហារវេចខ្ចប់ជាស្រេច
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>ចំណុចយោង 4.1 & 4.2៖</strong> កំណត់ពីព័ត៌មានជាកាតព្វកិច្ច (ឈ្មោះផលិតផលជាភាសាខ្មែរ គ្រឿងផ្សំ ទម្ងន់សុទ្ធ ឡូត៍ផលិត ថ្ងៃខែផលិត-ផុតកំណត់ អាសយដ្ឋានផលិតករ) និងការធានាថាកម្ពស់អក្សរខ្មែរត្រូវធំជាង ឬស្មើនឹងអក្សរបរទេស។
                </p>
              </div>

              {/* Citation 2: Sub-Decree 64 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition-all space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                    អនុក្រឹត្យ ៦៤ អនក្រ.បក
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Royal Government of Cambodia</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs font-sans">
                  អនុក្រឹត្យលេខ ៦៤ អនក្រ.បក ស្តីពីការគ្រប់គ្រងពាណិជ្ជកម្មលើការកត់ស្លាកសញ្ញាផលិតផល
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>មាត្រា ៣ & ៥៖</strong> គ្រប់ទំនិញដែលចរាចរលើទីផ្សារព្រះរាជាណាចក្រកម្ពុជាត្រូវមានស្លាកសញ្ញាត្រឹមត្រូវ ហាមឃាត់ការបន្លំ ឬការផ្តល់ព័ត៌មានមិនពិតអំពីប្រភពដើម និងសមាសធាតុផ្សំ។
                </p>
              </div>

              {/* Citation 3: Codex CXS 1-1985 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition-all space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                    CODEX CXS 1-1985
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">FAO / WHO Codex Alimentarius</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs font-sans">
                  Codex Alimentarius General Standard for the Labelling of Prepackaged Foods
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>Section 4.7 & 5.1៖</strong> ស្តង់ដារកាលបរិច្ឆេទអន្តរជាតិ Best Before (BBD) សម្រាប់គ្រាប់ស្វាយចន្ទី និងការអនុញ្ញាតឱ្យប្រើប្រាស់មធ្យោបាយឌីជីថល (Electronic Labelling) សម្រាប់ការបង្ហាញព័ត៌មានបន្ថែមដល់អតិថិជន។
                </p>
              </div>

              {/* Citation 4: MFDS Korea Food Code */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition-all space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                    MFDS Korea Food Code
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">식품의약품안전처 (South Korea)</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs font-sans">
                  대한민국 식품 등의 표시기준 및 식품공전 (Korean Food Labeling Standards)
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>소비기한 (Use-by Date Standard):</strong> ច្បាប់កូរ៉េឆ្នាំ ២០២៣ តម្រូវឱ្យប្តូរពី 유통기한 (Sell-by) មកប្រើ <strong>소비기한 (EXP/Use-by)</strong> រួមជាមួយការប្រកាសសារធាតុបង្កប្រតិកម្ម (캐슈넛 함유) និងព័ត៌មានអាហារូបត្ថម្ភជាភាសាកូរ៉េ។
                </p>
              </div>

              {/* Citation 5: Law on Metrology */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition-all space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                    ច្បាប់មាត្រាសាស្ត្រ
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">National Metrology Center</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs font-sans">
                  ច្បាប់ស្តីពីមាត្រាសាស្ត្រនៃព្រះរាជាណាចក្រកម្ពុជា (Law on Metrology)
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>ជំពូកទី ៤៖</strong> ការបញ្ជាក់បរិមាណសុទ្ធត្រូវប្រើប្រាស់ប្រព័ន្ធខ្នាតអន្តរជាតិ Metric System (ក្រាម g, គីឡូក្រាម kg, មីលីលីត្រ ml) ជាមួយនឹងសញ្ញា ℮ (Estimated Sign) បញ្ជាក់ពីភាពសុក្រឹតនៃទម្ងន់។
                </p>
              </div>

              {/* Citation 6: ASEAN E-Labeling */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition-all space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="bg-purple-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                    ASEAN Framework
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ASEAN Agri-Food Sector</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs font-sans">
                  ក្របខ័ណ្ឌអាស៊ានស្តីពី Smart Packaging & Digital Product Traceability
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>គោលការណ៍ E-Labeling អាស៊ាន៖</strong> ជំរុញការប្រើប្រាស់ Dynamic QR Code ដើម្បីកាត់បន្ថយថ្លៃដើមបោះពុម្ពស្លាកលើកញ្ចប់តូច និងជួយសម្រួលដល់ការធ្វើពាណិជ្ជកម្មឆ្លងដែនក្នុងតំបន់អាស៊ាន និងអាស៊ីបូព៌ា។
                </p>
              </div>

            </div>
          </div>

          {/* POINT 2: FEASIBILITY STUDY & JUSTIFICATION FOR QR-ONLY PACKAGING */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 sm:p-8 rounded-3xl border border-amber-300 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <QrCode size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950 font-sans">
                    ២. ការសិក្សាលទ្ធភាព៖ ដាក់តែ QR Code សម្រាប់ព័ត៌មានលម្អិត Packaging (Feasibility Study)
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    របាយការណ៍បច្ចេកទេសឆ្លើយតបសំណើរបស់ MISTI សម្រាប់ការវេចខ្ចប់ខ្នាតតូច ៥០g/១០០g និងការនាំចេញទៅកូរ៉េ
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2.5 py-1 rounded-full">
                MISTI Feasibility Report
              </span>
            </div>

            <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-sans">
              
              {/* Finding 1 */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-1.5 shadow-2xs">
                <h4 className="font-bold text-slate-950 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>ក. ដោះស្រាយបញ្ហាទំហំស្លាកចង្អៀតលើកញ្ចប់តូច (Micro-Packaging Surface Constraint)</span>
                </h4>
                <p className="text-slate-600 text-[11.5px]">
                  លើកញ្ចប់គំរូ <strong>៥០ ក្រាម</strong> ឬកំប៉ុង <strong>១០០ ក្រាម</strong> (ដូចកញ្ចប់ ៣០០ ដែលរៀបចំជូនអនុព័ន្ធពាណិជ្ជកម្មកម្ពុជាប្រចាំប្រទេសកូរ៉េ) ផ្ទៃកញ្ចប់មានទំហំតូច។ ប្រសិនបើដាក់អត្ថបទពេញលេញ ៣ ភាសា (ខ្មែរ អង់គ្លេស កូរ៉េ) រួមជាមួយតារាងអាហារូបត្ថម្ភ វានឹងធ្វើឱ្យទំហំអក្សរតូចខ្លាំង (&lt; 4pt) ពិបាកមើល និងបាត់បង់សោភ័ណភាព។ ការដាក់ <strong>ស្លាកមុខសាមញ្ញ + QR Code</strong> គឺជាដំណោះស្រាយបច្ចេកវិទ្យាឆ្លាតវៃបំផុត។
                </p>
              </div>

              {/* Finding 2 */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-1.5 shadow-2xs">
                <h4 className="font-bold text-slate-950 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>ខ. ភាពបត់បែនពហុភាសាសម្រាប់ទីផ្សារនាំចេញ (Multi-Language Dynamic Switcher)</span>
                </h4>
                <p className="text-slate-600 text-[11.5px]">
                  នៅពេលអតិថិជន ឬអ្នកត្រួតពិនិត្យនៅប្រទេសកូរ៉េស្កេន QR Code ប្រព័ន្ធនឹងបង្ហាញព័ត៌មានជាភាសាកូរ៉េ (한국어) ភ្លាមៗ ហើយនៅពេលអតិថិជនខ្មែរស្កេន វានឹងបង្ហាញជាភាសាខ្មែរពេញលេញ។ នេះជួយឱ្យសហគ្រាសខ្មែរមិនចាំបាច់បោះពុម្ពថង់ប្លាស្ទិកច្រើនម៉ូតសម្រាប់ប្រទេសនីមួយៗនោះឡើយ។
                </p>
              </div>

              {/* Finding 3 */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-1.5 shadow-2xs">
                <h4 className="font-bold text-slate-950 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>គ. ការពារការក្លែងបន្លំ និងបញ្ជាក់ប្រភពកសិករពិតប្រាកដ (Anti-Counterfeiting & Live Ledger)</span>
                </h4>
                <p className="text-slate-600 text-[11.5px]">
                  ស្លាកក្រដាសធម្មតាអាចត្រូវគេចម្លង ឬបន្លំបានងាយ ប៉ុន្តែ QR Code ភ្ជាប់ដោយផ្ទាល់ទៅកាន់ប្រព័ន្ធ <strong>CashewTrace Verified Ledger</strong> បង្ហាញកាលបរិច្ឆេទផលិតពិតប្រាកដ ប្រភពចន្ទីកំពង់ធំ ម្រេចកំពត GI និងរបាយការណ៍សវនកម្មដែលមិនអាចកែបន្លំបាន។
                </p>
              </div>

              {/* Conclusion Recommendation for MISTI */}
              <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-5 rounded-2xl border border-emerald-500/40 space-y-2">
                <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider block">
                  អនុសាសន៍បច្ចេកទេសសម្រាប់ក្រសួង MISTI (Technical Recommendation):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  អនុញ្ញាតឱ្យសហគ្រាសប្រើប្រាស់គំរូ <strong>"Hybrid Smart Packaging"</strong>៖ ស្លាករូបវន្ត (Physical Label) រក្សាទុកនូវព័ត៌មានសំខាន់ៗបំផុត (ឈ្មោះ ភាសាខ្មែរ/អង់គ្លេស ទម្ងន់ ឡូត៍ និង MFD/EXP) រីឯព័ត៌មានលម្អិតស៊ីជម្រៅ (គ្រឿងផ្សំលម្អិតជាភាគរយ តារាងអាហារូបត្ថម្ភ ប្រវត្តិប្រភពកសិករ និងវិញ្ញាបនបត្រ) ត្រូវផ្តល់ជូនតាមរយៈ <strong>QR Code Smart Passport</strong>។ នេះជាគំរូជឿនលឿនដែលកម្ពុជាអាចមានមោទកភាពក្នុងតំបន់អាស៊ាន!
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* VIEW 4 (FARM TRACE & LEDGER) REMOVED AS REQUESTED */}
      {false && (
        <div className="space-y-6 animate-fade-in">
          
          {/* 8 Batches Explorer Bar */}
          {allBatches.length > 0 && onSelectBatch && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 font-sans flex items-center gap-1.5">
                  <Layers size={15} />
                  <span>បញ្ជីក្រុមផលិតផល និងទំព័រទាំង ៨ (8 Verified Ledger Pages):</span>
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  ទំព័រសកម្ម៖ <strong className="text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">Batch {batch.batch_id}</strong> — {batch.product_name || batch.product} ({batch.output_kg} kg)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {allBatches.map((b, bIdx) => {
                  const isCurrent = b.batch_id === batch.batch_id;
                  return (
                    <button
                      key={b.batch_id}
                      onClick={() => onSelectBatch(b.batch_id)}
                      className={`p-2.5 rounded-xl text-left font-mono transition-all border cursor-pointer flex flex-col justify-between ${
                        isCurrent 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg font-bold ring-2 ring-emerald-400/40' 
                          : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold">Page {bIdx + 1}</span>
                        <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-slate-950' : 'bg-emerald-400'}`}></span>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs font-black block tracking-tight">{b.batch_id}</span>
                        <span className={`text-[10px] block truncate ${isCurrent ? 'text-slate-950 font-semibold' : 'text-slate-400'}`}>
                          {b.output_kg} kg
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Farm Sourcing & Mass Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 font-sans">តុល្យភាពបរិមាណគ្រឿងផ្សំ / Ingredient Mass Balance</h3>
                  <p className="text-xs text-slate-400 font-mono">ការប្រៀបធៀបបរិមាណធាតុចូល និងទិន្នផលសម្រេច / Input vs Output Material Accounting</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">ធាតុចូលសរុប / Total Raw Input</span>
                  <span className="text-sm font-bold text-slate-800">{totalInput} គីឡូក្រាម / kg</span>
                </div>
              </div>

              <div className="space-y-3">
                {donutSlices.map((slice, idx) => (
                  <div 
                    key={slice.id}
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-3 rounded-xl border transition-all ${
                      hoveredSlice === idx ? 'bg-slate-50 border-emerald-500 shadow-xs' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
                        <span className="font-bold text-slate-800">{slice.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {slice.id}
                        </span>
                      </div>
                      <div className="font-mono text-right">
                        <span className="font-bold text-slate-800">{slice.kg} kg</span>
                        <span className="text-slate-400 text-[10px] ml-1.5">({slice.percent.toFixed(1)}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${slice.percent}%`, backgroundColor: slice.color }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                      <span>ប្រភពដើម៖ {translateProvince(slice.province)}</span>
                      <span>ផ្ទៀងផ្ទាត់រួចរាល់ / Audited</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transformation Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  សមាមាត្រទិន្នផល / Processing Yield
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">
                    {((batch.output_kg / (totalInput || 1)) * 100).toFixed(2)}%
                  </span>
                  <span className="text-xs text-slate-500">Yield Ratio</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-sans leading-relaxed">
                  ទិន្នផលសម្រេច <strong>{batch.output_kg} គីឡូក្រាម</strong> ផលិតចេញពីវត្ថុធាតុដើមសរុប <strong>{totalInput} គីឡូក្រាម</strong> ដែលបានចុះបញ្ជីតាមដានត្រឹមត្រូវ។
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200 text-xs font-sans">
                <div className="flex justify-between text-slate-600">
                  <span>សហគ្រាសផលិត៖</span>
                  <span className="font-bold text-slate-900">{batch.enterprise_name || 'MAYANY ENTERPRISE'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ទីតាំងកែច្នៃ៖</span>
                  <span className="font-bold text-slate-900">{translateProvince(batch.enterprise_location || 'BATTAMBANG')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>វិញ្ញាបនបត្រ៖</span>
                  <span className="font-bold text-emerald-600">{batch.certification || 'GHP & CS 001'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Supplier Profiles */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                  <User size={16} className="text-emerald-600" />
                  <span>កសិករ និងអ្នកផ្គត់ផ្គង់ម្នាក់ៗដែលបានផ្ទៀងផ្ទាត់ (Verified Contributors & Individual Info)</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  ព័ត៌មានលម្អិត ប័ណ្ណសម្គាល់ខ្លួន និងប្រវត្តិផ្គត់ផ្គង់របស់បុគ្គលម្នាក់ៗសម្រាប់ក្រុមផលិតផល {batch.batch_id}
                </p>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-mono px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
                {batch.sourcing_records.length} បុគ្គល / Contributors Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {batch.sourcing_records.map((record) => {
                const supDetails = suppliers.find(s => s['ST ID'] === record.ct_id);
                const isPrinting = printPersonId === record.ct_id;

                return (
                  <div
                    key={record.ct_id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all duration-200 shadow-sm relative flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                          {record.ct_id}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-full border border-emerald-200">
                          <CheckCircle2 size={11} /> VERIFIED
                        </span>
                      </div>

                      <div className="flex items-start gap-3 pt-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono text-sm shrink-0 border border-emerald-300">
                          {record.supplier_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {record.supplier_name}
                          </h4>
                          <p className="text-[11px] text-emerald-700 font-mono mt-0.5 font-semibold">
                            ផ្គត់ផ្គង់៖ {record.quantity_kg} kg
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 text-[11px] font-mono space-y-2 text-slate-700">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-1">
                          <span className="text-slate-400">អត្តសញ្ញាណប័ណ្ណ:</span>
                          <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {maskNationalId(supDetails?.['National ID Number'])}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">ទីតាំង:</span>
                          <span className="font-bold text-slate-800 text-right truncate max-w-[140px]">
                            {translateProvince(record.province)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPrintPersonId(isPrinting ? null : record.ct_id)}
                        className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer font-sans shadow-xs"
                      >
                        <QrCode size={13} />
                        <span>{isPrinting ? 'បិទស្លាកកសិករ' : 'បង្ហាញស្លាកសម្គាល់កសិករ'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE VIDEO SHOWCASE MODAL (Item 12: Video / Documentary) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-white space-y-4"
            >
              {/* Modal Top Bar */}
              <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Film size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white font-sans">
                      ដំណើររឿងសហគ្រាស Mayany, ចន្ទីខ្មែរ & ម្រេចកំពត GI
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Documentary Short: From Kampong Thom Trees to Seoul Gourmet Shelves
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="p-1.5 rounded-xl bg-slate-700/80 hover:bg-rose-600 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Video Player Display */}
              <div className="relative aspect-16/9 bg-black rounded-2xl mx-4 overflow-hidden border border-slate-800 flex items-center justify-center group">
                <img
                  src="/images/cashew_farm_golden_hour_1785138906165.jpg"
                  alt="Cashew Farm Video Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />

                <div className="relative z-10 text-center space-y-3 p-4">
                  <div className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center mx-auto shadow-2xl transition cursor-pointer hover:scale-110">
                    <Play size={28} className="fill-white translate-x-0.5" />
                  </div>
                  <div>
                    <span className="bg-black/60 text-amber-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-amber-400/40">
                      Mayany Enterprise • 02:30 Min Documentary
                    </span>
                    <h4 className="text-sm font-black text-white mt-2 font-serif drop-shadow-md">
                      "Taste the True Heritage of Cambodia"
                    </h4>
                  </div>
                </div>

                {/* Simulated Player Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-white">
                    <Play size={14} className="fill-white cursor-pointer" />
                    <span className="text-[10px] text-slate-300">00:45 / 02:30</span>
                  </div>
                  <div className="flex-1 mx-4 bg-slate-700 h-1 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-1/3" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-[10px]">
                    <span>1080p HD</span>
                    <span>🇰🇭 / 🇰🇷 / 🌐</span>
                  </div>
                </div>
              </div>

              {/* Subtitles & Documentary Synopsis */}
              <div className="p-4 bg-slate-950/60 rounded-2xl mx-4 mb-4 border border-slate-800 space-y-2 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                  <Sparkles size={13} />
                  <span>ខ្លឹមសារសង្ខេបវីដេអូ (Video Synopsis & Subtitles):</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  «យើងចាប់ផ្តើមពីចម្ការគ្រាប់ស្វាយចន្ទីខេត្តកំពង់ធំ ដែលដាំដុះដោយដៃកសិករខ្មែរផ្ទាល់ រហូតដល់ចម្ការម្រេចកំពត GI ជាប់សមុទ្រ។ សហគ្រាស Mayany រួមបញ្ចូលគ្នានូវសម្បត្តិធម្មជាតិទាំងពីរ ដើម្បីបង្កើតជាគ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពតកម្រិត Premium ឈានមុខគេលើពិភពលោក។»
                </p>
                <div className="pt-1 text-[10.5px] text-slate-400 italic">
                  "Sourced directly from Cambodian smallholders, glazed with certified GI Kampot Pepper, and crafted for discerning palates globally."
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
