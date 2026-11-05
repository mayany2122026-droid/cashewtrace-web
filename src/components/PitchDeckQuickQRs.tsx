import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, Copy, Check, Download, ExternalLink, Sparkles, 
  Printer, ArrowRight, ShieldCheck, Flame, CheckCircle2, ChevronRight,
  Edit3, Barcode, Save, X, Calendar, AlertCircle, Scale, FileText, RefreshCw, Eye, Filter, Tag
} from 'lucide-react';
import { PRODUCT_PRESETS, ProductPreset } from '../data/productPresets';
import { getPublicOrigin, setPublicOriginOverride, isLocalhostOrigin } from '../utils/publicOrigin';
import { formatEan13, calculateEan13CheckDigit, ean13ToBinary } from '../utils/barcodeGenerator';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { DEFAULT_OFFICIAL_SUPPLIERS } from '../lib/ingredientTranslator';
import CashewMilk1LLabelModal from './CashewMilk1LLabelModal';
import Jar175gLabelStudioModal from './Jar175gLabelStudioModal';

interface PitchDeckQuickQRsProps {
  onApplyPreset: (preset: ProductPreset, customLot?: string, customWeight?: string) => void;
  onOpenPassport: (url: string) => void;
  triggerToast: (msg: string) => void;
  onEditIn13Stages?: (item: QuickQRItem, step?: number) => void;
  activeDedicatedItemId?: string | null;
}

export interface QuickQRItem {
  id: string;
  productNumber?: number;
  nameKh: string;
  nameEn: string;
  batch: string;
  weight: string;
  flavor: string;
  presetId: string;
  ingredientsKh: string;
  tagKh: string;
  tagColor: string;
  icon: string;
  description: string;
  ean13: string;
  shelfLifeMonths: number;
  grade?: string;
  packageFormat?: string;
  containerType?: string;
  categoryGroup?: 'all' | 'pouch' | 'jar' | 'ww180' | 'bb_broken' | 'flour' | string;
  strategyTier?: 'tier1' | 'tier2' | 'tier3';
  deliveredTo?: string;
  futureBatch?: string;
  mfd?: string;
  exp?: string;
  stampDatesOnBag?: boolean;
  storage?: string;
  allergen?: string;
  healthBenefits?: string;
  instructionsForUse?: string;
  subheadingOrBotanical?: string;
  companyName?: string;
  companyAddress?: string;
  price?: string;
  priceBreakdown?: string;
  selectedSuppliers?: string[];
  packagingSymbols?: string[];
  nutrition?: {
    energyKcal: string;
    energyKj?: string;
    totalFat: string;
    saturatedFat: string;
    cholesterol: string;
    sodium: string;
    totalCarb: string;
    dietaryFiber: string;
    totalSugars: string;
    addedSugars?: string;
    protein: string;
    salt?: string;
  };
}

export const OFFICIAL_MAYANY_BARCODES: Record<string, string> = {
  'flour-jar-200g': '8847116350047',
  'ww180-sugar-jar-175g': '8847116350085',
  'ww180-sugar-pouch-50g': '8847116350023',
  'ww180-pepper-jar-175g': '8847116350061',
  'pepper-pouch-50g': '8847116350016',
  'ww180-chili-jar-175g': '8847116350092',
  'ww180-chili-pouch-50g': '8847116350078',
  'bb-pepper-pouch-50g': '8847116350108',
  'cashew-milk-1l': '8847116350054'
};

export const DEFAULT_DEDICATED_PRODUCTS: QuickQRItem[] = [
  // 1. 100% Pure Cashew Kernel Flour, 200g jar (Barcode: 884 711635 0047)
  {
    id: 'flour-jar-200g',
    productNumber: 1,
    nameKh: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%',
    nameEn: '100% Pure Cashew Kernel Flour',
    batch: 'LOT-PENDING',
    futureBatch: '2026-MAY-FLR',
    deliveredTo: 'CK99 Khmer Mart (Suwon, Korea) • 15 តុលា 2026',
    weight: '200g',
    flavor: 'pure_flour',
    presetId: 'cashew-powder-200g',
    grade: 'Pure Cashew Flour (ម្សៅសុទ្ធ)',
    packageFormat: '200g Clear Food-Grade Jar (ក្រឡកែវ/PET ២០០g)',
    containerType: 'pp-jar-200g',
    categoryGroup: 'jar',
    strategyTier: 'tier2',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០%',
    tagKh: '១. ម្សៅសុទ្ធ ១០០% • 200g Jar',
    tagColor: 'bg-emerald-700 text-white',
    icon: '🌾',
    description: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% គ្មានសារធាតុរក្សាទុក គ្មានជាតិគីមី សម្រាប់ឆុងកាហ្វេ (Cashew Latte / Creamer) ធ្វើទឹកដោះគ្រាប់ ធ្វើនំ និងអាហារសុខភាព (ក្រឡ ២០០g)',
    ean13: '8847116350047',
    shelfLifeMonths: 9,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mayany Enterprise', 'Mirarth Agri Tech Co., Ltd.'],
    nutrition: {
      energyKcal: '575',
      energyKj: '2400',
      totalFat: '46',
      saturatedFat: '9.0',
      cholesterol: '0',
      sodium: '8',
      totalCarb: '30',
      dietaryFiber: '3.3',
      totalSugars: '6.0',
      addedSugars: '0',
      protein: '18',
      salt: '0.00'
    }
  },

  // 2. Sugar coated Cashew Kernels, 175g jar WW180 (Barcode: 884 711635 0085)
  {
    id: 'ww180-sugar-jar-175g',
    productNumber: 2,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (WW180)',
    nameEn: 'Sugar Coated Cashew kernels',
    batch: '2026-cks-261j',
    futureBatch: 'WW-SUG-175',
    deliveredTo: 'CK99 Khmer Mart (Suwon, Korea) • 15 តុលា 2026',
    weight: '175g',
    flavor: 'sugar',
    presetId: 'mayany-ww180-sugar-jar-175g',
    grade: 'WW180 (King Size Jumbo)',
    packageFormat: '175g Clear Air-Tight Jar (ក្រឡកែវ/PET ១៧៥g)',
    containerType: 'pp-jar-200g',
    categoryGroup: 'jar',
    strategyTier: 'tier3',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩០%, ស្ករសធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%',
    tagKh: '២. WW180 ស្រោបស្ករ • 175g Jar',
    tagColor: 'bg-amber-600 text-white',
    icon: '🥥',
    description: 'គ្រាប់ស្វាយចន្ទី WW180 ស្រោបស្ករសធម្មជាតិ ស្រួយឈ្ងុយឆ្ងាញ់ ក្នុងក្រឡបិទជិត ១៧៥ ក្រាម (175g Induction-Sealed Jar)',
    ean13: '8847116350085',
    shelfLifeMonths: 9,
    mfd: '',
    exp: '',
    stampDatesOnBag: false,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងកម្ដៅ',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'],
    nutrition: {
      energyKcal: '590',
      energyKj: '2468',
      totalFat: '43.0',
      saturatedFat: '8.4',
      cholesterol: '0',
      sodium: '320',
      totalCarb: '37.0',
      dietaryFiber: '3.2',
      totalSugars: '15.6',
      addedSugars: '11.0',
      protein: '17.6',
      salt: '0.80'
    }
  },

  // 3. Sugar Coated Cashew Kernels, 50g pouch WW180 (Barcode: 884 711635 0023)
  {
    id: 'ww180-sugar-pouch-50g',
    productNumber: 3,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (WW180)',
    nameEn: 'Sugar Coated Cashew kernels',
    batch: '2026-cks-261',
    futureBatch: 'WW-SUG-050',
    deliveredTo: 'AKC (11 តុលា) & CK99 Suwon (15 តុលា 2026)',
    weight: '50g',
    flavor: 'sugar',
    presetId: 'mayany-ww180-sugar',
    grade: 'WW180 (King Size Jumbo)',
    packageFormat: '50g Standing Pouch (កញ្ចប់បាតឈរ ៥០g)',
    containerType: 'standup-pouch-50g',
    categoryGroup: 'pouch',
    strategyTier: 'tier3',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩០%, ស្ករសធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%',
    tagKh: '៣. WW180 ស្រោបស្ករ • 50g Pouch',
    tagColor: 'bg-amber-600 text-white',
    icon: '🥥',
    description: 'គ្រាប់ស្វាយចន្ទី WW180 ស្រោបស្ករសធម្មជាតិ ស្រួយឈ្ងុយឆ្ងាញ់ កញ្ចប់បាតឈរ ៥០ ក្រាម (50g Standing Pouch)',
    ean13: '8847116350023',
    shelfLifeMonths: 6,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងកម្ដៅ',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'],
    nutrition: {
      energyKcal: '284',
      energyKj: '1188',
      totalFat: '21.5',
      saturatedFat: '4.2',
      cholesterol: '0',
      sodium: '185',
      totalCarb: '17.5',
      dietaryFiber: '1.6',
      totalSugars: '6.8',
      addedSugars: '4.2',
      protein: '8.8',
      salt: '0.46'
    }
  },

  // 4. GI Kampot Black Pepper Coated Cashew Kernels, 175g jar WW180 (Barcode: 884 711635 0061)
  {
    id: 'ww180-pepper-jar-175g',
    productNumber: 4,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI (WW180)',
    nameEn: 'GI Kampot Black Pepper coated Cashew Kernels',
    batch: '2026-ckp-261j',
    futureBatch: 'WW-PEP-175',
    deliveredTo: 'CK99 Khmer Mart (Suwon, Korea) • 15 តុលា 2026',
    weight: '175g',
    flavor: 'pepper',
    presetId: 'mayany-ww180-pepper-jar-175g',
    grade: 'WW180 (King Size Jumbo)',
    packageFormat: '175g Clear Air-Tight PET Jar (កំប៉ុង PET ១៧៥g)',
    containerType: 'pp-jar-200g',
    categoryGroup: 'jar',
    strategyTier: 'tier1',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩៣%, ម្រេចខ្មៅកំពត GI YAS ៥%, អំបិលសមុទ្រ ២%',
    tagKh: '៤. WW180 ម្រេចកំពត GI • 175g Jar',
    tagColor: 'bg-slate-900 text-amber-300',
    icon: '🫘',
    description: 'ម្រេចខ្មៅកំពត GI ៥% ស្រោបលើគ្រាប់ស្វាយចន្ទី WW180 ក្នុងក្រឡបិទជិត ១៧៥ ក្រាម (175g Induction-Sealed Jar)',
    ean13: '8847116350061',
    shelfLifeMonths: 9,
    mfd: '',
    exp: '',
    stampDatesOnBag: false,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'],
    nutrition: {
      energyKcal: '572',
      energyKj: '2392',
      totalFat: '45.6',
      saturatedFat: '9.0',
      cholesterol: '0',
      sodium: '390',
      totalCarb: '28.4',
      dietaryFiber: '3.8',
      totalSugars: '5.0',
      addedSugars: '0',
      protein: '18.8',
      salt: '0.98'
    }
  },

  // 5. GI Kampot Black Pepper Coated Cashew Kernels, 50g pouch WW180 (Barcode: 884 711635 0016)
  {
    id: 'pepper-pouch-50g',
    productNumber: 5,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI',
    nameEn: 'GI Kampot Black Pepper coated Cashew Kernels',
    batch: '2026-ckp-261',
    futureBatch: 'WW-PEP-050',
    deliveredTo: 'AKC (11 តុលា) & CK99 Suwon (15 តុលា 2026)',
    weight: '50g',
    flavor: 'pepper',
    presetId: 'mayany-ww180-pepper-5',
    grade: 'WW180 (King Size Jumbo)',
    packageFormat: '50g Standing Pouch (កញ្ចប់បាតឈរ ៥០g)',
    containerType: 'standup-pouch-50g',
    categoryGroup: 'pouch',
    strategyTier: 'tier1',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩៣%, ម្រេចខ្មៅកំពត GI YAS ៥%, អំបិលសមុទ្រ ២%',
    tagKh: '៥. WW180 ម្រេចកំពត GI • 50g Pouch',
    tagColor: 'bg-indigo-900 text-amber-300',
    icon: '🫘',
    description: 'គ្រាប់ស្វាយចន្ទី WW180 ស្រោបម្រេចខ្មៅកំពត GI ៥% ស្រួយឈ្ងុយ កញ្ចប់បាតឈរ ៥០ ក្រាម (50g Standing Pouch)',
    ean13: '8847116350016',
    shelfLifeMonths: 6,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ បិទខ្សែរូតឱ្យជិតក្រោយពេលបើក។',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'],
    nutrition: {
      energyKcal: '286',
      energyKj: '1196',
      totalFat: '22.8',
      saturatedFat: '4.5',
      cholesterol: '0',
      sodium: '195',
      totalCarb: '14.2',
      dietaryFiber: '1.9',
      totalSugars: '2.5',
      addedSugars: '0',
      protein: '9.4',
      salt: '0.49'
    }
  },

  // 6. Chili Coated Cashew Kernels, 175g jar WW180 (Barcode: 884 711635 0092)
  {
    id: 'ww180-chili-jar-175g',
    productNumber: 6,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (WW180)',
    nameEn: 'Chili Coated Cashew Kernels',
    batch: '2026-ckc-261j',
    futureBatch: 'WW-CHI-175',
    deliveredTo: 'CK99 Khmer Mart (Suwon, Korea) • 15 តុលា 2026',
    weight: '175g',
    flavor: 'chili',
    presetId: 'mayany-ww180-chili-jar-175g',
    grade: 'WW180 (King Size Jumbo)',
    packageFormat: '175g Clear Air-Tight PET Jar (កំប៉ុង PET ១៧៥g)',
    containerType: 'pp-jar-200g',
    categoryGroup: 'jar',
    strategyTier: 'tier3',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩២%, ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%',
    tagKh: '៦. WW180 ស្រោបម្ទេស • 175g Jar',
    tagColor: 'bg-red-600 text-white',
    icon: '🌶️',
    description: 'រសជាតិម្ទេសហឹរខ្មែរធម្មជាតិ ស្រោបលើគ្រាប់ស្វាយចន្ទីពេញគ្រាប់ WW180 ក្នុងក្រឡបិទជិត ១៧៥ ក្រាម (175g Induction-Sealed Jar)',
    ean13: '8847116350092',
    shelfLifeMonths: 9,
    mfd: '',
    exp: '',
    stampDatesOnBag: false,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ បិទគម្របក្រឡឱ្យជិត',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng'],
    nutrition: {
      energyKcal: '580',
      energyKj: '2426',
      totalFat: '45.2',
      saturatedFat: '8.8',
      cholesterol: '0',
      sodium: '440',
      totalCarb: '29.0',
      dietaryFiber: '4.0',
      totalSugars: '4.8',
      addedSugars: '0',
      protein: '18.4',
      salt: '1.10'
    }
  },

  // 7. Chili Coated Cashew Kernels, 50g pouch WW180 (Barcode: 884 711635 0078)
  {
    id: 'ww180-chili-pouch-50g',
    productNumber: 7,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (WW180)',
    nameEn: 'Chili Coated Cashew Kernels',
    batch: '2026-ckc-261',
    futureBatch: 'WW-CHI-050',
    deliveredTo: 'AKC (11 តុលា) & CK99 Suwon (15 តុលា 2026)',
    weight: '50g',
    flavor: 'chili',
    presetId: 'mayany-ww180-chili',
    grade: 'WW180 (King Size Jumbo)',
    packageFormat: '50g Standing Pouch (កញ្ចប់បាតឈរ ៥០g)',
    containerType: 'standup-pouch-50g',
    categoryGroup: 'pouch',
    strategyTier: 'tier3',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩២%, ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%',
    tagKh: '៧. WW180 ស្រោបម្ទេស • 50g Pouch',
    tagColor: 'bg-red-600 text-white',
    icon: '🌶️',
    description: 'រសជាតិម្ទេសហឹរខ្មែរធម្មជាតិ ស្រោបលើគ្រាប់ស្វាយចន្ទីពេញគ្រាប់ WW180 កញ្ចប់បាតឈរ ៥០ ក្រាម (50g Standing Pouch)',
    ean13: '8847116350078',
    shelfLifeMonths: 6,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ បិទមាត់ថង់ឱ្យជិត',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng'],
    nutrition: {
      energyKcal: '290',
      energyKj: '1213',
      totalFat: '22.6',
      saturatedFat: '4.4',
      cholesterol: '0',
      sodium: '220',
      totalCarb: '14.5',
      dietaryFiber: '2.0',
      totalSugars: '2.4',
      addedSugars: '0',
      protein: '9.2',
      salt: '0.55'
    }
  },

  // 8. GI Kampot Black Pepper Coated Cashew Kernels, 50g pouch BB (Barcode: 884 711635 0108)
  {
    id: 'bb-pepper-pouch-50g',
    productNumber: 8,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI (BB)',
    nameEn: 'GI Kampot Black Pepper Coated Cashew Kernels BB',
    batch: '2026-ckp-261',
    weight: '50g',
    flavor: 'pepper',
    presetId: 'mayany-bb-pepper-pouch-50g',
    grade: 'BB (Broken / Baby Cashews)',
    packageFormat: '50g Standing Pouch (កញ្ចប់បាតឈរ ៥០g)',
    containerType: 'standup-pouch-50g',
    categoryGroup: 'pouch',
    strategyTier: 'tier1',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា (Grade BB) ៩៣%, ម្រេចខ្មៅកំពត GI YAS ៥%, អំបិលសមុទ្រ ២%',
    tagKh: '៨. BB ម្រេចកំពត GI • 50g Pouch',
    tagColor: 'bg-slate-900 text-amber-300',
    icon: '🫘',
    description: 'គ្រាប់ស្វាយចន្ទីបែក និងកូនគ្រាប់ BB ស្រោបម្រេចខ្មៅកំពត GI ៥% ស្រួយឈ្ងុយ កញ្ចប់បាតឈរ ៥០ ក្រាម (50g Standing Pouch)',
    ean13: '8847116350108',
    shelfLifeMonths: 6,
    mfd: '',
    exp: '',
    stampDatesOnBag: false,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ បិទខ្សែរូតឱ្យជិតក្រោយពេលបើក។',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'],
    nutrition: {
      energyKcal: '286',
      energyKj: '1196',
      totalFat: '22.8',
      saturatedFat: '4.5',
      cholesterol: '0',
      sodium: '195',
      totalCarb: '14.2',
      dietaryFiber: '1.9',
      totalSugars: '2.5',
      addedSugars: '0',
      protein: '9.4',
      salt: '0.49'
    }
  },

  // 9. Cashew Drink (100% Plant-Based Cashew Milk) (Barcode: 884 711635 0054)
  {
    id: 'cashew-milk-1l',
    productNumber: 9,
    nameKh: 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០%',
    nameEn: '100% Plant-Based Cashew Milk',
    batch: 'MTO-CM-1L',
    futureBatch: '2026-MAY-MILK',
    deliveredTo: 'Phnom Penh & Local Direct Deliveries • ផលិតតាមការកុម្ម៉ង់ (Make to Order)',
    weight: '1L',
    flavor: 'cashew_milk',
    presetId: 'cashew-milk-1l',
    grade: 'Artisanal Make to Order (ផលិតស្រស់ៗតាមការកុម្ម៉ង់ ១L)',
    packageFormat: '1L Sanitary Glass/PET Bottle with Tamper Seal',
    containerType: 'bottle-1l',
    categoryGroup: 'beverage',
    strategyTier: 'tier1',
    ingredientsKh: 'ទឹកចម្រោះ 86%, គ្រាប់ស្វាយចន្ទី 12.9%, ស្ករ 0.86%, ម្សៅស្លឹកតើយ 0.13%, អំបិល 0.09%',
    tagKh: '៩. ទឹកដោះគោ ១០០% • 1L Bottle (Make-to-Order)',
    tagColor: 'bg-emerald-900 text-white',
    icon: '🥛',
    price: '$4.50',
    priceBreakdown: 'Drink $3.00 + Bottle $1.50 (ភេសជ្ជៈ ៣.០០$ + ដបកែវ ១.៥០$ = សរុប ៤.៥០$)',
    description: 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០% (Make-to-Order)។ តម្លាភាពតម្លៃសរុប ៤.៥០$ (ទឹកដោះគោ ៣.០០$ + ថ្លៃដបកែវ ១.៥០$)។ ភេសជ្ជៈប្រណិត អាចទទួលទានផ្ទាល់ភ្លាមៗ ឬលាយជាមួយកាហ្វេ។ អតិថិជនដឹងពីថ្លៃដើមដបយ៉ាងច្បាស់លាស់ ហើយអាចយកដបមកប្តូរទិញទឹកដោះគោលើកក្រោយក្នុងតម្លៃត្រឹមតែ ៣.០០$។ ស្កេនកូដ QR លើដបដើម្បីកុម្ម៉ង់ទិញផ្ទាល់តាម WhatsApp។',
    ean13: '8847116350054',
    shelfLifeMonths: 3,
    mfd: '26-OCT-2026',
    exp: '26-JAN-2027',
    stampDatesOnBag: false,
    storage: 'រក្សាទុកក្នុងទូទឹកកកក្រោម ៤°C ក្រោយពេលបើក។ ភេសជ្ជៈប្រណិត អាចទទួលទានផ្ទាល់ភ្លាមៗ ឬលាយជាមួយកាហ្វេ។',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'Angkor Sugar (ស្ករសចម្រាញ់សុទ្ធ)', 'Ngov Heng (អំបិលសមុទ្រកំពត)', 'Ringacam Enterprise (ម្សៅស្លឹកតើយ G.D.G)'],
    nutrition: {
      energyKcal: '150',
      energyKj: '628',
      totalFat: '8.5',
      saturatedFat: '1.5',
      cholesterol: '0',
      sodium: '60',
      totalCarb: '16',
      dietaryFiber: '1.0',
      totalSugars: '3.5',
      addedSugars: '0',
      protein: '4.0',
      salt: '0.15'
    }
  },

  // 10. Sugar coated cashew kernels 50g pouch BB (Unlisted / Not in Active Production)
  {
    id: 'bb-sugar-pouch-50g',
    productNumber: 10,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (BB) [មិនទាន់ផលិត]',
    nameEn: 'Sugar Coated Cashew Kernels BB (Unlisted / Inactive)',
    batch: 'LOT-2026-KT-BB-SUG-50',
    weight: '50g',
    flavor: 'sugar',
    presetId: 'mayany-bb-sugar-pouch-50g',
    grade: 'BB (Broken / Baby Cashews)',
    packageFormat: '50g Standing Pouch (កញ្ចប់បាតឈរ ៥០g)',
    containerType: 'standup-pouch-50g',
    categoryGroup: 'pouch',
    strategyTier: 'tier3',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា (Grade BB) ៩០%, ស្ករសធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%',
    tagKh: '១០. BB ស្រោបស្ករ • មិនទាន់ផលិត (Unlisted)',
    tagColor: 'bg-slate-600 text-slate-100',
    icon: '🥥',
    description: 'គ្រាប់ស្វាយចន្ទីបែក និងកូនគ្រាប់ BB ស្រោបស្ករសធម្មជាតិ (មិនទាន់មានក្នុងខ្សែច្រវាក់ផលិតកម្មសកម្មបច្ចុប្បន្ន)',
    ean13: '8847116350092',
    shelfLifeMonths: 6,
    mfd: '',
    exp: '',
    stampDatesOnBag: false,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងកម្ដៅ និងសំណើម។ បិទខ្សែរូតឱ្យជិត។',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'Angkor Sugar', 'Ngov Heng'],
    nutrition: {
      energyKcal: '284',
      energyKj: '1188',
      totalFat: '21.5',
      saturatedFat: '4.2',
      cholesterol: '0',
      sodium: '185',
      totalCarb: '17.5',
      dietaryFiber: '1.6',
      totalSugars: '6.8',
      addedSugars: '4.2',
      protein: '8.8',
      salt: '0.46'
    }
  },

  // 11. Chili coated cashew kernels 50g pouch BB (Unlisted / Not in Active Production)
  {
    id: 'bb-chili-pouch-50g',
    productNumber: 11,
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (BB) [មិនទាន់ផលិត]',
    nameEn: 'Chili Coated Cashew Kernels BB (Unlisted / Inactive)',
    batch: 'LOT-2026-KT-BB-CHIL-50',
    weight: '50g',
    flavor: 'chili',
    presetId: 'mayany-bb-chili-pouch-50g',
    grade: 'BB (Broken / Baby Cashews)',
    packageFormat: '50g Standing Pouch (កញ្ចប់បាតឈរ ៥០g)',
    containerType: 'standup-pouch-50g',
    categoryGroup: 'pouch',
    strategyTier: 'tier3',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា (Grade BB) ៩២%, ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%',
    tagKh: '១១. BB ស្រោបម្ទេស • មិនទាន់ផលិត (Unlisted)',
    tagColor: 'bg-slate-600 text-slate-100',
    icon: '🌶️',
    description: 'រសជាតិម្ទេសហឹរខ្មែរធម្មជាតិ ស្រោបលើគ្រាប់ស្វាយចន្ទីបែក និងកូនគ្រាប់ BB (មិនទាន់មានក្នុងខ្សែច្រវាក់ផលិតកម្មសកម្មបច្ចុប្បន្ន)',
    ean13: '8847116350238',
    shelfLifeMonths: 6,
    mfd: '',
    exp: '',
    stampDatesOnBag: false,
    storage: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ បិទមាត់ថង់ឱ្យជិត ជៀសវាងសំណើម',
    allergen: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    companyName: 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
    selectedSuppliers: ['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng'],
    nutrition: {
      energyKcal: '290',
      energyKj: '1213',
      totalFat: '22.6',
      saturatedFat: '4.4',
      cholesterol: '0',
      sodium: '220',
      totalCarb: '14.5',
      dietaryFiber: '2.0',
      totalSugars: '2.4',
      addedSugars: '0',
      protein: '9.2',
      salt: '0.55'
    }
  }
];

export const QUICK_PITCH_PRODUCTS: QuickQRItem[] = DEFAULT_DEDICATED_PRODUCTS;

// Helper to reconcile dedicated product state with stored data while strictly preventing cross-pack contamination
function reconcileDedicatedProduct(def: QuickQRItem, match?: QuickQRItem): QuickQRItem {
  if (!match) return def;

  let resolvedWeight = match.weight || def.weight;
  // Always enforce official registered GS1 barcode from Mayany Enterprise
  let resolvedEan = OFFICIAL_MAYANY_BARCODES[def.id] || def.ean13;
  let resolvedBatch = match.batch || def.batch;
  let resolvedFormat = match.packageFormat || def.packageFormat;
  let resolvedContainer = match.containerType || def.containerType;

  // Protect 50g pouches from accidental 175g jar cross-contamination
  if (def.categoryGroup === 'pouch' && def.weight.includes('50')) {
    if (
      resolvedWeight.includes('175') || 
      resolvedWeight.includes('200') || 
      resolvedBatch.includes('261j') ||
      resolvedBatch.includes('175')
    ) {
      resolvedWeight = def.weight;
      resolvedEan = OFFICIAL_MAYANY_BARCODES[def.id] || def.ean13;
      resolvedFormat = def.packageFormat;
      resolvedContainer = def.containerType;
      resolvedBatch = def.batch;
    }
  }

  // Protect 175g jars from accidental 50g pouch cross-contamination
  if (def.categoryGroup === 'jar' && def.weight.includes('175')) {
    if (
      resolvedWeight.includes('50') || 
      (resolvedBatch.includes('261') && !resolvedBatch.includes('261j')) ||
      resolvedBatch.includes('050')
    ) {
      resolvedWeight = def.weight;
      resolvedEan = OFFICIAL_MAYANY_BARCODES[def.id] || def.ean13;
      resolvedFormat = def.packageFormat;
      resolvedContainer = def.containerType;
      resolvedBatch = def.batch;
    }
  }

  // Enforce 50g Standing Pouch without Window wording
  if (def.categoryGroup === 'pouch' && (resolvedFormat.includes('Window') || resolvedFormat.includes('បង្អួច'))) {
    resolvedFormat = def.packageFormat;
  }

  // Reconcile and ensure exact delivered lots for batches delivered to AKC & CK99 Khmer Mart
  if (
    !resolvedBatch || 
    resolvedBatch.startsWith('LOT-2026-KT-WW180-') || 
    resolvedBatch === 'LOT-2026-KT-PEP-50' || 
    resolvedBatch === 'LOT-2026-KT-0816' || 
    resolvedBatch === 'WW-PEP-050' ||
    resolvedBatch === 'WW-SUG-050' ||
    resolvedBatch === 'WW-CHI-050' ||
    resolvedBatch === 'WW-PEP-175' ||
    resolvedBatch === 'WW-SUG-175' ||
    resolvedBatch === 'WW-CHI-175' ||
    resolvedBatch === '2026-CKP-050' ||
    resolvedBatch === '2026-CKS-050' ||
    resolvedBatch === '2026-CKC-050' ||
    resolvedBatch === '2026-CKP-175' ||
    resolvedBatch === '2026-CKS-175' ||
    resolvedBatch === '2026-CKC-175' ||
    resolvedBatch === 'LOT-2026-KT-FLOUR-200'
  ) {
    resolvedBatch = def.batch;
  }

  // Sourcing partners reconciliation: for pepper & sugar products, preserve Angkor Sugar
  let resolvedSuppliers = match.selectedSuppliers || def.selectedSuppliers || [];
  if (
    def.productNumber === 2 || 
    def.productNumber === 3 || 
    def.productNumber === 5 || 
    def.productNumber === 6 || 
    def.flavor === 'sugar' || 
    def.flavor === 'pepper' || 
    def.id === 'pepper-pouch-50g' || 
    def.id === 'ww180-sugar-pouch-50g'
  ) {
    if (!resolvedSuppliers.some(s => s.toLowerCase().includes('angkor') || s.includes('ស្ករ'))) {
      resolvedSuppliers = [...resolvedSuppliers, 'Angkor Sugar'];
    }
  }

  return {
    ...def,
    ...match,
    productNumber: def.productNumber,
    nameKh: match.nameKh || def.nameKh,
    nameEn: match.nameEn || def.nameEn,
    batch: resolvedBatch,
    ean13: resolvedEan,
    weight: resolvedWeight,
    grade: match.grade || def.grade,
    packageFormat: resolvedFormat,
    containerType: resolvedContainer,
    ingredientsKh: match.ingredientsKh || def.ingredientsKh,
    shelfLifeMonths: match.shelfLifeMonths || def.shelfLifeMonths,
    mfd: match.mfd !== undefined ? match.mfd : def.mfd,
    exp: match.exp !== undefined ? match.exp : def.exp,
    stampDatesOnBag: match.stampDatesOnBag !== undefined ? match.stampDatesOnBag : (def.stampDatesOnBag ?? false),
    storage: match.storage || def.storage,
    allergen: match.allergen || def.allergen,
    nutrition: match.nutrition || def.nutrition,
    categoryGroup: def.categoryGroup,
    deliveredTo: def.deliveredTo,
    futureBatch: def.futureBatch,
    selectedSuppliers: resolvedSuppliers
  };
}

export default function PitchDeckQuickQRs({
  onApplyPreset,
  onOpenPassport,
  triggerToast,
  onEditIn13Stages,
  activeDedicatedItemId
}: PitchDeckQuickQRsProps) {
  // Live state for dedicated official products
  const [products, setProducts] = useState<QuickQRItem[]>(() => {
    try {
      const saved = localStorage.getItem('cashewtrace_dedicated_products_v6') ||
                    localStorage.getItem('cashewtrace_dedicated_products_v5') || 
                    localStorage.getItem('cashewtrace_dedicated_products_v4') || 
                    localStorage.getItem('cashewtrace_dedicated_products_v2');
      if (saved) {
        const parsed: QuickQRItem[] = JSON.parse(saved);
        return DEFAULT_DEDICATED_PRODUCTS.map(def => {
          const match = parsed.find(p => p.id === def.id || (p.productNumber && p.productNumber === def.productNumber));
          return reconcileDedicatedProduct(def, match);
        });
      }
    } catch (e) {
      console.warn('Could not read cached dedicated products', e);
    }
    return DEFAULT_DEDICATED_PRODUCTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tier1' | 'tier2' | 'tier3' | 'akc' | 'ck99' | 'future_batch' | 'pouch' | 'jar' | 'ww180' | 'bb_broken' | 'flour'>('all');

  // Filtered products list based on active category
  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'tier1') return p.strategyTier === 'tier1' || p.flavor === 'pepper';
    if (selectedCategory === 'tier2') return p.strategyTier === 'tier2' || p.flavor === 'pure_flour';
    if (selectedCategory === 'tier3') return p.strategyTier === 'tier3' || p.flavor === 'sugar' || p.flavor === 'chili';
    if (selectedCategory === 'akc') {
      // Products delivered to ASEAN-Korea Centre on October 11, 2026:
      // 1. chili coated cashew kernels 50g pouch lot: 2026-ckc-261
      // 2. sugar coated cashew kernels 50g pouch lot: 2026-cks-261
      // 3. gi kampot black pepper cashew kernels 50g pouch lot: 2026-ckp-261
      return (
        p.id === 'pepper-pouch-50g' || 
        p.id === 'ww180-sugar-pouch-50g' || 
        p.id === 'ww180-chili-pouch-50g' ||
        p.productNumber === 2 ||
        p.productNumber === 3 ||
        p.productNumber === 4
      );
    }
    if (selectedCategory === 'ck99') {
      // Products delivered to CK99 Khmer Mart in Suwon, Republic of Korea on October 15, 2026:
      // 1. chili coated 50g pouch lot: 2026-ckc-261
      // 2. sugar coated 50g pouch lot: 2026-cks-261
      // 3. gi kampot black pepper 50g pouch lot: 2026-ckp-261
      // 4. chili coated 175g jar lot: 2026-ckc-261j
      // 5. sugar coated 175g jar lot: 2026-cks-261j
      // 6. gi kampot black pepper 175g jar lot: 2026-ckp-261j
      // 7. 100% pure cashew kernel flour 200g net weight (lot pending)
      return (
        p.id === 'flour-jar-200g' ||
        p.id === 'pepper-pouch-50g' || 
        p.id === 'ww180-sugar-pouch-50g' || 
        p.id === 'ww180-chili-pouch-50g' ||
        p.id === 'ww180-pepper-jar-175g' ||
        p.id === 'ww180-sugar-jar-175g' ||
        p.id === 'ww180-chili-jar-175g' ||
        (p.productNumber && [1, 2, 3, 4, 5, 6, 7].includes(p.productNumber))
      );
    }
    if (selectedCategory === 'future_batch') {
      return Boolean(p.futureBatch);
    }
    if (selectedCategory === 'pouch') return p.weight.includes('50') || p.packageFormat?.includes('Pouch') || p.id.includes('pouch');
    if (selectedCategory === 'jar') return p.weight.includes('175') || p.weight.includes('200') || p.packageFormat?.includes('Jar') || p.id.includes('jar');
    if (selectedCategory === 'ww180') return (p.grade || '').includes('WW180') || p.id.includes('ww180') || (p.nameKh || '').includes('WW180');
    if (selectedCategory === 'bb_broken') return (p.grade || '').includes('BB') || (p.nameKh || '').includes('BB') || p.id.includes('bb-') || p.id.includes('broken');
    if (selectedCategory === 'flour') return p.flavor === 'pure_flour' || (p.nameKh || '').includes('ម្សៅ') || p.id.includes('flour');
    return true;
  });

  // Listen to custom updates from 13-stage wizard
  useEffect(() => {
    const handleUpdateEvent = (e: Event) => {
      const customEvt = e as CustomEvent<QuickQRItem>;
      if (customEvt?.detail) {
        const updatedItem = customEvt.detail;
        setProducts(prev => prev.map(p => {
          if (p.id === updatedItem.id || (updatedItem.productNumber && p.productNumber === updatedItem.productNumber)) {
            return {
              ...p,
              ...updatedItem,
              productNumber: p.productNumber || updatedItem.productNumber,
              categoryGroup: p.categoryGroup
            };
          }
          return p;
        }));
        return;
      }

      try {
        const saved = localStorage.getItem('cashewtrace_dedicated_products_v6') || 
                      localStorage.getItem('cashewtrace_dedicated_products_v5') || 
                      localStorage.getItem('cashewtrace_dedicated_products_v4') || 
                      localStorage.getItem('cashewtrace_dedicated_products_v2');
        if (saved) {
          const parsed: QuickQRItem[] = JSON.parse(saved);
          setProducts(DEFAULT_DEDICATED_PRODUCTS.map(def => {
            const match = parsed.find(p => p.id === def.id || (p.productNumber && p.productNumber === def.productNumber));
            return reconcileDedicatedProduct(def, match);
          }));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('cashewtrace_dedicated_updated', handleUpdateEvent);
    return () => window.removeEventListener('cashewtrace_dedicated_updated', handleUpdateEvent);
  }, []);

  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publicOrigin, setPublicOriginState] = useState<string>(() => getPublicOrigin());
  const [isEditingDomain, setIsEditingDomain] = useState<boolean>(false);
  const [customDomainInput, setCustomDomainInput] = useState<string>('');

  // Editing state for updating the dedicated product QR without generating a new QR
  const [editingItem, setEditingItem] = useState<QuickQRItem | null>(null);
  const [editBarcode, setEditBarcode] = useState<string>('');
  const [editBatch, setEditBatch] = useState<string>('');
  const [editNameKh, setEditNameKh] = useState<string>('');
  const [editNameEn, setEditNameEn] = useState<string>('');
  const [editWeight, setEditWeight] = useState<string>('');
  const [editIngredientsKh, setEditIngredientsKh] = useState<string>('');
  const [editShelfLifeMonths, setEditShelfLifeMonths] = useState<number>(6);
  const [editMfd, setEditMfd] = useState<string>('');
  const [editExp, setEditExp] = useState<string>('');
  const [editStorage, setEditStorage] = useState<string>('');
  const [editAllergen, setEditAllergen] = useState<string>('');
  const [editSuppliers, setEditSuppliers] = useState<string[]>([]);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [isMilkModalOpen, setIsMilkModalOpen] = useState<boolean>(false);
  const [isJar175ModalOpen, setIsJar175ModalOpen] = useState<boolean>(false);
  const [jar175Product, setJar175Product] = useState<'pepper' | 'chili'>('pepper');

  const isLocalhost = isLocalhostOrigin();

  const handleSaveDomain = () => {
    setPublicOriginOverride(customDomainInput);
    const updated = getPublicOrigin();
    setPublicOriginState(updated);
    setIsEditingDomain(false);
    triggerToast(customDomainInput ? `✓ បានកំណត់ Domain សាធារណៈ៖ ${updated}` : '✓ បានកំណត់ Domain មកលំនាំដើមវិញ');
  };

  // Sync latest details from Firestore and seed the 4 official batches
  useEffect(() => {
    let isMounted = true;
    const syncAndSeedFirestore = async () => {
      try {
        // Check if any batch has custom updates in Firestore, preserving user customizations
        const updatedList = await Promise.all(
          products.map(async (prod) => {
            try {
              const snapPromise = getDoc(doc(db, 'packaging_passports', prod.batch));
              const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
              const snap = await Promise.race([snapPromise, timeoutPromise]) as any;
              if (snap && typeof snap.exists === 'function' && snap.exists()) {
                const data = snap.data();
                const officialEan = OFFICIAL_MAYANY_BARCODES[prod.id] || prod.ean13;
                if (data.ean13 !== officialEan) {
                  setDoc(doc(db, 'packaging_passports', prod.batch), { ean13: officialEan }, { merge: true }).catch(() => {});
                  setDoc(doc(db, 'packaging_passports', prod.id), { ean13: officialEan }, { merge: true }).catch(() => {});
                  setDoc(doc(db, 'packaging_passports', prod.presetId), { ean13: officialEan }, { merge: true }).catch(() => {});
                }
                return {
                  ...prod,
                  ean13: officialEan,
                  mfd: data.mfd || prod.mfd,
                  exp: data.exp || prod.exp,
                  ingredientsKh: data.customIngredients || data.ingredients || prod.ingredientsKh,
                  selectedSuppliers: data.selectedSuppliers || prod.selectedSuppliers,
                  nameKh: data.nameKh || prod.nameKh,
                  nameEn: data.product || data.nameEn || prod.nameEn,
                  weight: data.weight || prod.weight,
                  nutrition: data.nutrition || prod.nutrition,
                  description: data.description || data.productDescription || prod.description,
                };
              } else {
                // Seed initial document if it does not exist yet
                const officialEan = OFFICIAL_MAYANY_BARCODES[prod.id] || prod.ean13;
                const snapshot = {
                  batch: prod.batch,
                  product: prod.nameEn,
                  nameKh: prod.nameKh,
                  flavor: prod.flavor,
                  weight: prod.weight,
                  ean13: officialEan,
                  shelfLifeMonths: prod.shelfLifeMonths,
                  customIngredients: prod.ingredientsKh,
                  storage: prod.storage,
                  allergen: prod.allergen,
                  company: prod.companyName || 'Mayany Enterprise',
                  origin: 'Kingdom of Cambodia (កម្ពុជា)',
                  nutrition: prod.nutrition,
                  selectedSuppliers: prod.selectedSuppliers,
                  updatedAt: new Date().toISOString()
                };
                setDoc(doc(db, 'packaging_passports', prod.batch), snapshot, { merge: true }).catch(() => {});
                setDoc(doc(db, 'packaging_passports', prod.presetId), snapshot, { merge: true }).catch(() => {});
                setDoc(doc(db, 'packaging_passports', prod.id), snapshot, { merge: true }).catch(() => {});
              }
            } catch {
              // fallback gracefully
            }
            return prod;
          })
        );
        if (isMounted) {
          setProducts(updatedList);
          try {
            localStorage.setItem('cashewtrace_dedicated_products_v6', JSON.stringify(updatedList));
            localStorage.setItem('cashewtrace_dedicated_products_v5', JSON.stringify(updatedList));
            localStorage.setItem('cashewtrace_dedicated_products_v2', JSON.stringify(updatedList));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.info('Background sync completed', err);
      }
    };

    syncAndSeedFirestore();
    return () => { isMounted = false; };
  }, []);

  const getTargetUrl = (item: QuickQRItem) => {
    const origin = (publicOrigin && !publicOrigin.includes('localhost') && !publicOrigin.includes('run.app')) 
      ? publicOrigin 
      : 'https://cashewtrace.com';
    const queryParams = new URLSearchParams();
    queryParams.set('mode', 'passport');
    if (item.ean13) queryParams.set('ean', item.ean13);
    if (item.id) queryParams.set('prodId', item.id);
    if (item.flavor) queryParams.set('flv', item.flavor);
    if (item.weight) queryParams.set('wt', item.weight);
    if (item.productNumber) queryParams.set('pnum', String(item.productNumber));
    queryParams.set('view', 'certificate');
    return `${origin}/?${queryParams.toString()}`;
  };

  // Generate verified URLs and QR images for each of the dedicated products
  useEffect(() => {
    const generateAllQrs = async () => {
      const generated: Record<string, string> = {};
      for (const item of products) {
        const targetUrl = getTargetUrl(item);
        try {
          const dataUrl = await QRCode.toDataURL(targetUrl, {
            width: 1024,
            margin: 4,
            errorCorrectionLevel: 'M',
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          generated[item.id] = dataUrl;
        } catch (e) {
          console.error('Failed to generate QR for item', item.id, e);
        }
      }
      setQrImages(generated);
    };

    generateAllQrs();
  }, [publicOrigin, products]);

  const handleCopy = (item: QuickQRItem) => {
    const url = getTargetUrl(item);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      triggerToast(`✓ បានចម្លងតំណភ្ជាប់ QR សម្រាប់ ${item.nameKh}`);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const handleDownloadPng = (item: QuickQRItem) => {
    const dataUrl = qrImages[item.id];
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Mayany_QR_${item.ean13}_${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`✓ បានទាញយក QR Code 1024px PNG (${item.nameEn}) សម្រាប់រោងពុម្ព!`);
  };

  const handleDownloadSvg = async (item: QuickQRItem) => {
    try {
      const url = getTargetUrl(item);
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        margin: 4,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Mayany_QR_${item.ean13}_${item.id}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      triggerToast(`✓ បានទាញយក Vector SVG QR (${item.nameEn}) សម្រាប់រោងពុម្ព!`);
    } catch (e) {
      console.error('Failed to export SVG', e);
    }
  };

  const handleApplyToDesigner = (item: QuickQRItem, step: number = 1) => {
    if (onEditIn13Stages) {
      onEditIn13Stages(item, step);
      return;
    }
    let preset = PRODUCT_PRESETS.find(p => p.id === item.presetId);
    if (!preset) {
      preset = PRODUCT_PRESETS.find(p => p.id.includes(item.flavor)) || PRODUCT_PRESETS[0];
    }
    if (preset) {
      // Create enhanced preset reflecting user's updated data
      const dynamicPreset: ProductPreset = {
        ...preset,
        nameKhmerDefault: item.nameKh,
        nameEnglishDefault: item.nameEn,
        defaultNetWeight: item.weight,
        defaultIngredients: item.ingredientsKh,
        shelfLifeMonths: item.shelfLifeMonths || (item.weight === '175g' ? 9 : 6),
        ean13Default: item.ean13 || preset.ean13Default,
        storageInstructions: item.storage || preset.storageInstructions,
        allergenAdvice: item.allergen || preset.allergenAdvice,
        suggestedPackaging: item.packageFormat || preset.suggestedPackaging
      };
      onApplyPreset(dynamicPreset, item.batch, item.weight);
      triggerToast(`✓ បានបញ្ចូលទិន្នន័យ ${item.nameKh} ទៅក្នុងផ្ទាំងរចនាស្លាក!`);
    }
  };

  const handleDownloadAll = async () => {
    for (const item of filteredProducts) {
      handleDownloadPng(item);
      await new Promise(r => setTimeout(r, 200));
    }
    triggerToast(`✓ បានទាញយក QR Code ទាំង ${filteredProducts.length} មុខរួចរាល់សម្រាប់រោងពុម្ព និង Pitch Deck!`);
  };

  // Open Edit Modal for a specific product QR
  const handleOpenEditModal = (item: QuickQRItem) => {
    setEditingItem(item);
    setEditBarcode(item.ean13 || '');
    setEditBatch(item.batch || '');
    setEditNameKh(item.nameKh || '');
    setEditNameEn(item.nameEn || '');
    setEditWeight(item.weight || '50g');
    setEditIngredientsKh(item.ingredientsKh || '');
    setEditShelfLifeMonths(item.shelfLifeMonths || 6);
    setEditMfd(item.mfd || '');
    if (item.mfd && item.exp) {
      setEditExp(item.exp);
    } else if (item.mfd) {
      const baseDate = new Date(item.mfd);
      baseDate.setMonth(baseDate.getMonth() + (item.shelfLifeMonths || 6));
      setEditExp(!isNaN(baseDate.getTime()) ? baseDate.toISOString().split('T')[0] : '');
    } else {
      setEditExp(item.exp || '');
    }

    setEditStorage(item.storage || 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ជៀសវាងពន្លឺថ្ងៃ និងខ្យល់អាកាស');
    setEditAllergen(item.allergen || 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី');
    setEditSuppliers(item.selectedSuppliers || ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng']);
  };

  // When shelf life months change in modal, update EXP date automatically
  const handleShelfLifeChange = (months: number) => {
    setEditShelfLifeMonths(months);
    if (editMfd) {
      try {
        const d = new Date(editMfd);
        if (!isNaN(d.getTime())) {
          d.setMonth(d.getMonth() + months);
          setEditExp(d.toISOString().split('T')[0]);
        }
      } catch {
        // ignore
      }
    }
  };

  // Reset current editing product back to default values
  const handleResetCurrentEditToDefault = () => {
    if (!editingItem) return;
    const def = DEFAULT_DEDICATED_PRODUCTS.find(p => p.id === editingItem.id || p.productNumber === editingItem.productNumber);
    if (!def) return;
    setEditBarcode(def.ean13 || '');
    setEditBatch(def.batch || '');
    setEditNameKh(def.nameKh || '');
    setEditNameEn(def.nameEn || '');
    setEditWeight(def.weight || '50g');
    setEditIngredientsKh(def.ingredientsKh || '');
    setEditShelfLifeMonths(def.shelfLifeMonths || 6);
    setEditStorage(def.storage || '');
    setEditAllergen(def.allergen || '');
    if (def.selectedSuppliers) setEditSuppliers(def.selectedSuppliers);
    triggerToast(`✓ បានកំណត់ផលិតផល «${def.nameEn}» មកតាមតម្លៃលំនាំដើមវិញ`);
  };

  // Save changes to this dedicated product
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setIsSavingEdit(true);

    try {
      const formattedBarcode = editBarcode.trim() ? formatEan13(editBarcode) : editingItem.ean13;
      const cleanBatch = editBatch.trim() || editingItem.batch;

      const cleanSuppliers = editSuppliers && editSuppliers.length > 0
        ? editSuppliers
        : (editingItem.selectedSuppliers || ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng']);

      const updatedItem: QuickQRItem = {
        ...editingItem,
        batch: cleanBatch,
        ean13: formattedBarcode,
        nameKh: editNameKh.trim() || editingItem.nameKh,
        nameEn: editNameEn.trim() || editingItem.nameEn,
        weight: editWeight.trim() || editingItem.weight,
        ingredientsKh: editIngredientsKh.trim() || editingItem.ingredientsKh,
        shelfLifeMonths: editShelfLifeMonths,
        mfd: editMfd,
        exp: editExp,
        storage: editStorage.trim() || editingItem.storage,
        allergen: editAllergen.trim() || editingItem.allergen,
        selectedSuppliers: cleanSuppliers
      };

      // 1. Update React state
      const updatedProducts = products.map(p => p.id === editingItem.id ? updatedItem : p);
      setProducts(updatedProducts);

      // 2. Persist to localStorage
      try {
        localStorage.setItem('cashewtrace_dedicated_products_v6', JSON.stringify(updatedProducts));
        localStorage.setItem('cashewtrace_dedicated_products_v5', JSON.stringify(updatedProducts));
        localStorage.setItem('cashewtrace_dedicated_products_v4', JSON.stringify(updatedProducts));
        localStorage.setItem('cashewtrace_dedicated_products_v2', JSON.stringify(updatedProducts));
        
        // Parse explicit percentage numbers from updated ingredients
        const cashewMatch = updatedItem.ingredientsKh.match(/(?:ចន្ទី|cashew)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const chiliMatch = updatedItem.ingredientsKh.match(/(?:ម្ទេស|chili)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const pepperMatch = updatedItem.ingredientsKh.match(/(?:ម្រេច|pepper)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const sugarMatch = updatedItem.ingredientsKh.match(/(?:ស្ករ|sugar)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const saltMatch = updatedItem.ingredientsKh.match(/(?:អំបិល|salt)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const parseNum = (str: string | undefined, fallback: number) => {
          if (!str) return fallback;
          const khmerDigits: Record<string, string> = { '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4', '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9' };
          let s = str;
          Object.entries(khmerDigits).forEach(([k, v]) => { s = s.split(k).join(v); });
          const n = parseFloat(s);
          return isNaN(n) ? fallback : n;
        };

        const fullPassportSnapshot = {
          batch: updatedItem.batch,
          product: updatedItem.nameEn,
          nameKh: updatedItem.nameKh,
          flavor: updatedItem.flavor,
          weight: updatedItem.weight,
          ean13: updatedItem.ean13,
          shelfLifeMonths: updatedItem.shelfLifeMonths,
          mfd: updatedItem.mfd,
          exp: updatedItem.exp,
          customIngredients: updatedItem.ingredientsKh,
          ingredients: updatedItem.ingredientsKh,
          cashewPct: parseNum(cashewMatch?.[1], 92),
          spicePct: parseNum(chiliMatch?.[1] || pepperMatch?.[1], 4),
          sugarPct: parseNum(sugarMatch?.[1], 0),
          saltPct: parseNum(saltMatch?.[1], 2),
          storage: updatedItem.storage,
          allergen: updatedItem.allergen,
          company: 'Mayany Enterprise',
          origin: 'Kingdom of Cambodia (កម្ពុជា)',
          selectedSuppliers: updatedItem.selectedSuppliers,
          nutrition: updatedItem.nutrition,
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem(`cashewtrace_passport_${updatedItem.id}`, JSON.stringify(fullPassportSnapshot));
        if (updatedItem.productNumber) {
          localStorage.setItem(`cashewtrace_passport_prod_${updatedItem.productNumber}`, JSON.stringify(fullPassportSnapshot));
        }
        localStorage.setItem(`cashewtrace_passport_${updatedItem.presetId}`, JSON.stringify(fullPassportSnapshot));
        localStorage.setItem(`cashewtrace_passport_${updatedItem.batch}_${updatedItem.weight.replace(/\s+/g, '')}`, JSON.stringify(fullPassportSnapshot));
        localStorage.setItem(`cashewtrace_passport_${updatedItem.batch}`, JSON.stringify(fullPassportSnapshot));
        localStorage.setItem('cashewtrace_latest_passport', JSON.stringify(fullPassportSnapshot));

        // Sync custom catalog in localStorage by replacing legacy items with these dedicated products
        const currentCustomCatalog = updatedProducts.map(p => ({
          id: p.presetId,
          name: `${p.nameEn} (${p.nameKh})`,
          category: 'Mayany Enterprise Official Dedicated Products',
          containerType: p.weight.includes('200') || p.weight.includes('175') ? 'pp-jar-200g' : 'standup-pouch-50g',
          nameKhmerDefault: p.nameKh,
          nameEnglishDefault: p.nameEn,
          botanicalOrSubtext: 'Premium Cambodian Cashews (Anacardium occidentale)',
          defaultNetWeight: p.weight,
          defaultIngredients: p.ingredientsKh,
          allergenAdvice: p.allergen || 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី',
          mayContainTraces: 'ផលិតក្នុងខ្សែច្រវាក់កែច្នៃស្វាយចន្ទីសុទ្ធសាធ។ គ្មានសារធាតុគីមីរក្សាទុក។',
          storageInstructions: p.storage || 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ជៀសវាងពន្លឺថ្ងៃ និងខ្យល់អាកាស',
          instructionsForUse: 'អាហារសម្រន់ប្រណិតញ៉ាំភ្លាមៗ',
          requiresRefrigeration: false,
          typicalNutrition: p.nutrition,
          ean13Default: p.ean13,
          shelfLifeMonths: p.shelfLifeMonths,
          barrierTech: 'PET/AL/PE 8cm Barrier Pouch'
        }));
        localStorage.setItem('cashewtrace_sme_custom_catalog', JSON.stringify(currentCustomCatalog));
      } catch (e) {
        console.warn('Could not save to localStorage', e);
      }

      // 3. Write directly to Cloud Firestore so physical packaging scanned with printed QR gets the updated data!
      try {
        const cashewMatch = updatedItem.ingredientsKh.match(/(?:ចន្ទី|cashew)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const chiliMatch = updatedItem.ingredientsKh.match(/(?:ម្ទេស|chili)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const pepperMatch = updatedItem.ingredientsKh.match(/(?:ម្រេច|pepper)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const sugarMatch = updatedItem.ingredientsKh.match(/(?:ស្ករ|sugar)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const saltMatch = updatedItem.ingredientsKh.match(/(?:អំបិល|salt)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
        const parseNum = (str: string | undefined, fallback: number) => {
          if (!str) return fallback;
          const khmerDigits: Record<string, string> = { '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4', '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9' };
          let s = str;
          Object.entries(khmerDigits).forEach(([k, v]) => { s = s.split(k).join(v); });
          const n = parseFloat(s);
          return isNaN(n) ? fallback : n;
        };

        const fullPassportSnapshot = {
          batch: updatedItem.batch,
          product: updatedItem.nameEn,
          nameKh: updatedItem.nameKh,
          flavor: updatedItem.flavor,
          weight: updatedItem.weight,
          ean13: updatedItem.ean13,
          shelfLifeMonths: updatedItem.shelfLifeMonths,
          mfd: updatedItem.mfd,
          exp: updatedItem.exp,
          customIngredients: updatedItem.ingredientsKh,
          ingredients: updatedItem.ingredientsKh,
          cashewPct: parseNum(cashewMatch?.[1], 92),
          spicePct: parseNum(chiliMatch?.[1] || pepperMatch?.[1], 4),
          sugarPct: parseNum(sugarMatch?.[1], 0),
          saltPct: parseNum(saltMatch?.[1], 2),
          storage: updatedItem.storage,
          allergen: updatedItem.allergen,
          company: 'Mayany Enterprise',
          origin: 'Kingdom of Cambodia (កម្ពុជា)',
          selectedSuppliers: updatedItem.selectedSuppliers,
          nutrition: updatedItem.nutrition,
          updatedAt: new Date().toISOString()
        };

        const fsWrites = [
          setDoc(doc(db, 'packaging_passports', updatedItem.id), fullPassportSnapshot, { merge: true }),
          setDoc(doc(db, 'packaging_passports', `${updatedItem.batch}_${updatedItem.weight.replace(/\s+/g, '')}`), fullPassportSnapshot, { merge: true }),
          setDoc(doc(db, 'packaging_passports', updatedItem.presetId), fullPassportSnapshot, { merge: true }),
          setDoc(doc(db, 'packaging_passports', updatedItem.batch), fullPassportSnapshot, { merge: true }),
          setDoc(doc(db, 'packaging_passports', updatedItem.nameEn), fullPassportSnapshot, { merge: true })
        ];
        if (updatedItem.productNumber) {
          fsWrites.push(setDoc(doc(db, 'packaging_passports', `prod_${updatedItem.productNumber}`), fullPassportSnapshot, { merge: true }));
        }
        await Promise.allSettled(fsWrites);
      } catch (fsErr) {
        console.warn('Firestore passport sync error:', fsErr);
      }

      // 4. Dispatch event to notify components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cashewtrace_dedicated_updated', { detail: updatedItem }));
      }

      triggerToast(`✓ បានធ្វើបច្ចុប្បន្នភាពទិន្នន័យផលិតផល ${updatedItem.nameKh} និងបាកូដ ${formattedBarcode} ជោគជ័យ! QR Code សម្រាប់រោងពុម្ពនៅរក្សាដដែល និងបានធ្វើសមកាលកម្ម!`);
      setEditingItem(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleToggleBatch = (item: QuickQRItem) => {
    const isUsingFuture = item.batch === item.futureBatch;
    const defaultItem = DEFAULT_DEDICATED_PRODUCTS.find(d => d.id === item.id);
    const targetBatch = isUsingFuture 
      ? (defaultItem?.batch || item.batch) 
      : (item.futureBatch || item.batch);
    
    const updated: QuickQRItem = {
      ...item,
      batch: targetBatch
    };

    setProducts(prev => {
      const next = prev.map(p => p.id === item.id ? updated : p);
      try {
        localStorage.setItem('cashewtrace_dedicated_products_v6', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    window.dispatchEvent(new CustomEvent('cashewtrace_dedicated_updated', { detail: updated }));
    triggerToast(
      isUsingFuture 
        ? `✓ បានត្រឡប់ទៅលេខឡូតិ៍ដែលបានប្រគល់៖ ${targetBatch}`
        : `✓ បានប្តូរទៅលេខឡូតិ៍គ្រោងសម្រាប់បាច់បន្ទាប់៖ ${targetBatch}`
    );
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-slate-50 border-2 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-md space-y-5 no-print animate-fade-in">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200 pb-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black text-xl">
            ⚡
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                QR Code ផ្លូវការ Mayany Enterprise & គណៈប្រតិភូ AKC
              </span>
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <CheckCircle2 size={11} /> 100% Smartphone Verified & CS 001 Certified
              </span>
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                🇰🇷 ASEAN-Korea Centre Ready
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-950 font-sans mt-1">
              QR Code ឌីជីថលផ្លូវការ Mayany Enterprise (ផលិតផលនាំចេញ, Passport & ការប្រគល់ជូន AKC)
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              🇰🇷 <strong>AKC Showcase:</strong> គ្រាប់ស្វាយចន្ទីស្រោប ៣ រសជាតិ ៣០០ កញ្ចប់ (WW180 50g: ម្រេចកំពត GI, ស្ករត្នោត, ម្ទេស)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/assets/Mayany_Enterprise_Official_Printer_QR_Pack.zip"
            download="Mayany_Enterprise_Official_Printer_QR_Pack.zip"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-sm transition flex items-center gap-1.5 cursor-pointer border border-emerald-500"
            title="ទាញយកកញ្ចប់ឯកសារ Printer Pack (.ZIP) ពេញលេញរួមមាន Vector SVG, 1024px PNG និងសៀវភៅណែនាំរោងពុម្ព"
          >
            <Download size={14} className="text-amber-300" />
            <span>ទាញយកកញ្ចប់រោងពុម្ពពេញលេញ (.ZIP)</span>
          </a>
          <button
            type="button"
            onClick={handleDownloadAll}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} className="text-amber-400" />
            <span>ទាញយក PNG ទាំងអស់ ({filteredProducts.length} មុខ)</span>
          </button>
        </div>
      </div>

      {/* Public Domain Verification Bar (Fixes "Site can't be reached" at print shop) */}
      <div className="bg-white/95 rounded-2xl border border-amber-300 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
              🌐
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  អាសយដ្ឋាន Domain សាធារណៈក្នុង QR Code៖
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  LIVE PUBLIC DOMAIN
                </span>
              </div>
              <div className="text-xs font-mono text-slate-600 break-all">
                <strong className="text-emerald-700">{publicOrigin || 'https://...'}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`${publicOrigin}/?project=passport&batch=LOT-2026-PEP-26&view=certificate`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="សាកល្បងបើកក្នុង Tab ថ្មី ដើម្បីធានាថាមិនមានបញ្ហា Site can't be reached"
            >
              <ExternalLink size={13} />
              <span>សាកល្បងបើកតំណភ្ជាប់</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setCustomDomainInput(publicOrigin);
                setIsEditingDomain(!isEditingDomain);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition cursor-pointer"
            >
              <span>{isEditingDomain ? 'បិទ' : '⚙️ ប្តូរ Domain'}</span>
            </button>
          </div>
        </div>

        {/* Localhost Warning if applicable */}
        {isLocalhost && !isEditingDomain && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-2">
            <span>
              ⚠️ <strong>ចំណាំ៖</strong> កំពុងដំណើរការលើ Localhost (ទូរស័ព្ទដៃនឹងមិនអាចស្កេនបានទេបើគ្មាន Public URL)។ សូមចុច <strong>«ប្តូរ Domain»</strong> ដើម្បីដាក់ Cloud Run ឬ Public Preview URL របស់អ្នក។
            </span>
            <button
              type="button"
              onClick={() => {
                setCustomDomainInput(publicOrigin);
                setIsEditingDomain(true);
              }}
              className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[11px] rounded-lg shrink-0 cursor-pointer"
            >
              កំណត់ឥឡូវ
            </button>
          </div>
        )}

        {/* Inline Domain Editor */}
        {isEditingDomain && (
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              បញ្ចូល Domain សាធារណៈ ឬ Cloud Run URL (ឧ. https://ais-pre-...run.app)៖
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                placeholder="https://ais-pre-...run.app"
                className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <button
                type="button"
                onClick={handleSaveDomain}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer"
              >
                រក្សាទុក
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomDomainInput('');
                  setPublicOriginOverride('');
                  setPublicOriginState(getPublicOrigin());
                  setIsEditingDomain(false);
                }}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                លំនាំដើម
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              QR Code ទាំងអស់នឹងធ្វើបច្ចុប្បន្នភាពជាមួយ Domain ថ្មីនេះភ្លាមៗ ដើម្បីធានាថាមិនមានបញ្ហា Site can't be reached នៅរោងពុម្ព។
            </p>
          </div>
        )}
      </div>

      {/* MAKE-TO-ORDER PRINTER QR PACK: DOWNLOAD ONE BY ONE OR FULL ZIP */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 sm:p-6 border-2 border-amber-400 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-400/30 pb-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
              🖨️
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Make-to-Order Official Printer QRs
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  ✓ គ្មានលេខឡូតិ៍រឹងលើស្លាកអចិន្ត្រៃយ៍ (Zero Hardcoded Lot)
                </span>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                  ISO/IEC 18004 Compliant
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-amber-300 font-sans mt-1">
                ទាញយកកូដ QR មួយម្តងៗសម្រាប់រោងពុម្ព (Download QR Codes One by One for Print Shop)
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                កូដ QR អចិន្ត្រៃយ៍ទាំង ៩ មុខទំនិញត្រូវបានបង្កើតជាប្រភេទ <strong>Vector (.SVG)</strong> និង <strong>1024px PNG</strong> ភ្ជាប់ជាមួយបាកូដ GS1 EAN-13 ផ្លូវការ។
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="/assets/Mayany_Enterprise_Official_Printer_QR_Pack.zip"
              download="Mayany_Enterprise_Official_Printer_QR_Pack.zip"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer border border-amber-300"
              title="ទាញយកកញ្ចប់ ZIP រួមមានឯកសារ SVG, PNG និងសៀវភៅណែនាំរោងពុម្ព"
            >
              <Download size={15} className="text-slate-950" />
              <span>ទាញយកកញ្ចប់រោងពុម្ព (.ZIP)</span>
            </a>
          </div>
        </div>

        {/* Make-to-Order Architecture Explanation Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-amber-400/30 text-xs text-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Sparkles size={16} />
            <span className="text-xs sm:text-sm">គោលការណ៍ផលិតកម្ម Make-to-Order & ស្លាកអចិន្ត្រៃយ៍៖</span>
          </div>
          <p className="text-[11.5px] leading-relaxed text-slate-300 font-sans">
            • <strong>កូដ QR និងស្លាកអចិន្ត្រៃយ៍៖</strong> កូដ QR ខាងក្រោមភ្ជាប់ទៅកាន់លេខកូដទំនិញ GS1 EAN-13 អចិន្ត្រៃយ៍ គ្មានដាក់លេខឡូតិ៍រឹង (No Hardcoded Lot) ឡើយ។ លោកអ្នកអាចបញ្ជាឱ្យរោងពុម្ពបោះពុម្ពស្លាករាប់ពាន់សន្លឹកដោយមិនបារម្ភរឿងខុសបាច់ ឬផុតកាលបរិច្ឆេទ។<br />
            • <strong>ការបោះត្រាលេខឡូតិ៍ជាក់ស្តែង (Packaging Line Coding)៖</strong> រាល់ពេលមានការបញ្ជាទិញ (Make-to-Order) លោកអ្នកគ្រាន់តែប្រើម៉ាស៊ីនបាញ់កាលបរិច្ឆេទ (Handheld Coder) ឬត្រាក្តៅ (Hot Stamp) បោះត្រាលេខឡូតិ៍ (LOT), ថ្ងៃផលិត (MFD), និងថ្ងៃផុតកំណត់ (EXP) លើចន្លោះត្រៀមលើសំបកកញ្ចប់ ឬគម្របក្រឡ។
          </p>
        </div>

        {/* 9 PRODUCTS ONE-BY-ONE DOWNLOAD TABLE */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-amber-300 font-sans block">
            បញ្ជីកូដ QR ទាំង ៩ ផលិតផល (ចុចទាញយកមួយៗភ្លាមៗ)៖
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                num: 1,
                id: 'flour-jar-200g',
                sku: 'FLR-200G-JAR',
                nameKh: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%',
                nameEn: '100% Pure Cashew Flour',
                format: 'ក្រឡ ២០០g (200g Jar)',
                ean13: '8847116350047',
                icon: '🌾',
                badgeColor: 'bg-emerald-700 text-white',
                fileName: '01_Mayany_QR_PureCashewFlour_200g_Jar'
              },
              {
                num: 2,
                id: 'ww180-sugar-jar-175g',
                sku: 'WW180-SUG-175G-JAR',
                nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (WW180)',
                nameEn: 'Sugar Coated Cashews WW180',
                format: 'ក្រឡ PET ១៧៥g (175g Jar)',
                ean13: '8847116350085',
                icon: '🥥',
                badgeColor: 'bg-amber-600 text-white',
                fileName: '02_Mayany_QR_SugarCoated_175g_Jar'
              },
              {
                num: 3,
                id: 'ww180-sugar-pouch-50g',
                sku: 'WW180-SUG-50G-POUCH',
                nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (WW180)',
                nameEn: 'Sugar Coated Cashews WW180',
                format: 'កញ្ចប់បាតឈរ ៥០g (50g Pouch)',
                ean13: '8847116350023',
                icon: '🥥',
                badgeColor: 'bg-amber-600 text-white',
                fileName: '03_Mayany_QR_SugarCoated_50g_Pouch'
              },
              {
                num: 4,
                id: 'ww180-pepper-jar-175g',
                sku: 'WW180-PEP-175G-JAR',
                nameKh: 'គ្រាប់ចន្ទីស្រោបម្រេចខ្មៅកំពត GI (WW180)',
                nameEn: 'GI Kampot Pepper Cashews WW180',
                format: 'ក្រឡ PET ១៧៥g (175g Jar)',
                ean13: '8847116350061',
                icon: '🫘',
                badgeColor: 'bg-slate-900 text-amber-300',
                fileName: '04_Mayany_QR_KampotPepper_175g_Jar'
              },
              {
                num: 5,
                id: 'pepper-pouch-50g',
                sku: 'WW180-PEP-50G-POUCH',
                nameKh: 'គ្រាប់ចន្ទីស្រោបម្រេចខ្មៅកំពត GI (WW180)',
                nameEn: 'GI Kampot Pepper Cashews WW180',
                format: 'កញ្ចប់បាតឈរ ៥០g (50g Pouch)',
                ean13: '8847116350016',
                icon: '🫘',
                badgeColor: 'bg-indigo-900 text-amber-300',
                fileName: '05_Mayany_QR_KampotPepper_50g_Pouch'
              },
              {
                num: 6,
                id: 'ww180-chili-jar-175g',
                sku: 'WW180-CHI-175G-JAR',
                nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (WW180)',
                nameEn: 'Chili Coated Cashews WW180',
                format: 'ក្រឡ PET ១៧៥g (175g Jar)',
                ean13: '8847116350092',
                icon: '🌶️',
                badgeColor: 'bg-red-600 text-white',
                fileName: '06_Mayany_QR_ChiliCoated_175g_Jar'
              },
              {
                num: 7,
                id: 'ww180-chili-pouch-50g',
                sku: 'WW180-CHI-50G-POUCH',
                nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (WW180)',
                nameEn: 'Chili Coated Cashews WW180',
                format: 'កញ្ចប់បាតឈរ ៥០g (50g Pouch)',
                ean13: '8847116350078',
                icon: '🌶️',
                badgeColor: 'bg-red-600 text-white',
                fileName: '07_Mayany_QR_ChiliCoated_50g_Pouch'
              },
              {
                num: 8,
                id: 'bb-pepper-pouch-50g',
                sku: 'BB-PEP-50G-POUCH',
                nameKh: 'គ្រាប់ចន្ទីស្រោបម្រេចខ្មៅកំពត GI (BB)',
                nameEn: 'GI Kampot Pepper Cashews (Grade BB)',
                format: 'កញ្ចប់បាតឈរ ៥០g (50g Pouch)',
                ean13: '8847116350108',
                icon: '🫘',
                badgeColor: 'bg-slate-900 text-amber-300',
                fileName: '08_Mayany_QR_KampotPepper_BB_50g_Pouch'
              },
              {
                num: 9,
                id: 'cashew-milk-1l',
                sku: 'CASHEW-MILK-1L',
                nameKh: 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទីធម្មជាតិ ១០០%',
                nameEn: '100% Plant-Based Cashew Milk (1L)',
                format: 'ដបកែវ ១L (1000ml Bottle)',
                ean13: '8847116350054',
                icon: '🥛',
                badgeColor: 'bg-emerald-900 text-white',
                fileName: '09_Mayany_QR_CashewDrink_1L_Bottle'
              }
            ].map((p) => {
              const svgPath = `/assets/printer_qr_pack/${p.fileName}.svg`;
              const pngPath = `/assets/printer_qr_pack/${p.fileName}.png`;
              const targetUrl = `https://cashewtrace.com/?mode=passport&ean=${p.ean13}&prodId=${p.id}&view=certificate`;

              return (
                <div
                  key={p.id}
                  className="bg-white/5 border border-white/10 hover:border-amber-400/60 rounded-2xl p-3.5 space-y-2.5 transition flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
                          #{p.num}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono truncate">
                          {p.sku}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                        EAN: {p.ean13}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white font-sans flex items-center gap-1 leading-snug">
                        <span>{p.icon}</span>
                        <span className="truncate">{p.nameKh}</span>
                      </h4>
                      <p className="text-[10.5px] text-slate-300 font-serif truncate">
                        {p.nameEn}
                      </p>
                      <span className="text-[10px] text-amber-300 font-mono block pt-0.5 font-bold">
                        {p.format}
                      </span>
                    </div>

                    <div className="flex items-center justify-center py-2 bg-white rounded-xl border border-white/20">
                      <img
                        src={pngPath}
                        alt={p.nameEn}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  </div>

                  {/* Action Buttons for this product */}
                  <div className="space-y-1.5 pt-1 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={svgPath}
                        download={`${p.fileName}.svg`}
                        className="py-1.5 px-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10.5px] rounded-lg transition flex items-center justify-center gap-1 shadow-xs cursor-pointer text-center"
                        title="ទាញយក Vector SVG សម្រាប់រោងពុម្ព (Illustrator / InDesign)"
                      >
                        <Download size={12} />
                        <span>Vector (.SVG)</span>
                      </a>
                      <a
                        href={pngPath}
                        download={`${p.fileName}.png`}
                        className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10.5px] rounded-lg border border-white/20 transition flex items-center justify-center gap-1 shadow-xs cursor-pointer text-center"
                        title="ទាញយក 1024px PNG Ultra-HD"
                      >
                        <Download size={12} className="text-amber-400" />
                        <span>PNG (1024px)</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator?.clipboard?.writeText) {
                            navigator.clipboard.writeText(targetUrl);
                            triggerToast(`✓ បានចម្លងតំណភ្ជាប់ QR សម្រាប់ #${p.num} ${p.nameKh}`);
                          }
                        }}
                        className="py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                      >
                        <Copy size={11} />
                        <span>ចម្លង Link</span>
                      </button>
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-2 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-1 cursor-pointer transition text-center"
                      >
                        <ExternalLink size={11} />
                        <span>តេស្តស្កេន</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Korea Institutions Handover Dossier (October 2026 Deliveries) */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-4 sm:p-5 border-2 border-amber-400 shadow-md space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-md shrink-0">
              🇰🇷
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Official Institutional Delivery Dossier (តុលា ២០២៦)
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  ✓ បាកូដ GS1 EAN-13 & QR ភ្ជាប់លេខឡូតិ៍ត្រឹមត្រូវ
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-amber-300 font-sans mt-0.5">
                ទំនិញដែលបានប្រគល់ជូនមជ្ឈមណ្ឌលអាស៊ាន-កូរ៉េ (AKC) និង CK99 Khmer Mart (សាធារណរដ្ឋកូរ៉េ)
              </h3>
            </div>
          </div>
          <div className="text-right text-xs font-mono text-slate-300">
            <div>កាលបរិច្ឆេទប្រគល់៖ <strong className="text-amber-300">11 & 15 តុលា 2026</strong></div>
            <div className="text-[10.5px] text-slate-400 font-sans">កញ្ចប់បាតឈរ ៥០g (50g Standing Pouch) & ក្រឡ 175g/200g</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* I. AKC Card */}
          <div className="bg-white/5 border border-amber-400/40 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-amber-300 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <span>🏛️</span>
                <span>I. ASEAN-Korea Centre (AKC) • 11 តុលា 2026</span>
              </strong>
              <span className="text-[10px] font-mono bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded-md border border-blue-500/40 font-bold">
                ៣ មុខ • 50g Pouch
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              ផលិតផលគ្រាប់ស្វាយចន្ទីស្រោប ៣ រសជាតិ វេចខ្ចប់ជាកញ្ចប់បាតឈរ ៥០g សម្រាប់គណៈប្រតិភូ៖
            </p>
            <ul className="space-y-1.5 text-[11px] font-mono">
              <li className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/10">
                <span className="flex items-center gap-1">🌶️ Chili Coated 50g:</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-black">LOT: 2026-ckc-261</span>
                  <span className="text-slate-400 text-[10px] font-mono">(EAN: 8847116350078)</span>
                </div>
              </li>
              <li className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/10">
                <span className="flex items-center gap-1">🥥 Sugar Coated 50g:</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-black">LOT: 2026-cks-261</span>
                  <span className="text-slate-400 text-[10px] font-mono">(EAN: 8847116350023)</span>
                </div>
              </li>
              <li className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/10">
                <span className="flex items-center gap-1">🫘 Pepper GI 50g:</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-black">LOT: 2026-ckp-261</span>
                  <span className="text-slate-400 text-[10px] font-mono">(EAN: 8847116350016)</span>
                </div>
              </li>
            </ul>
          </div>

          {/* II. CK99 Khmer Mart Card */}
          <div className="bg-white/5 border border-amber-400/40 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-amber-300 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <span>🏪</span>
                <span>II. CK99 Khmer Mart (Suwon, Korea) • 15 តុលា 2026</span>
              </strong>
              <span className="text-[10px] font-mono bg-indigo-900/80 text-indigo-200 px-2 py-0.5 rounded-md border border-indigo-500/40 font-bold">
                ៧ មុខ • Pouches & Jars
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-mono">
              <div className="bg-black/40 p-2 rounded-lg border border-white/10 space-y-1">
                <span className="text-slate-400 block text-[9.5px] font-bold uppercase">50g Standing Pouches:</span>
                <div className="flex items-center justify-between">
                  <span>🌶️ Chili 50g:</span>
                  <strong className="text-amber-300 font-black">2026-ckc-261</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>🥥 Sugar 50g:</span>
                  <strong className="text-amber-300 font-black">2026-cks-261</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>🫘 Pepper 50g:</span>
                  <strong className="text-amber-300 font-black">2026-ckp-261</strong>
                </div>
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-white/10 space-y-1">
                <span className="text-slate-400 block text-[9.5px] font-bold uppercase">175g Jars & 200g Flour:</span>
                <div className="flex items-center justify-between">
                  <span>🌶️ Chili 175g:</span>
                  <strong className="text-amber-300 font-black">2026-ckc-261j</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>🥥 Sugar 175g:</span>
                  <strong className="text-amber-300 font-black">2026-cks-261j</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>🫘 Pepper 175g:</span>
                  <strong className="text-amber-300 font-black">2026-ckp-261j</strong>
                </div>
                <div className="flex items-center justify-between pt-0.5 border-t border-white/10">
                  <span>🌾 Flour 200g:</span>
                  <strong className="text-emerald-300 font-bold text-[9.5px]">Unassigned (TBD)</strong>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-sans italic">
              * លេខបាច់បន្ទាប់ (Next Batch) នឹងប្រើ: WW-PEP-050, WW-SUG-050, WW-CHI-050, WW-PEP-175, WW-SUG-175, WW-CHI-175
            </p>
          </div>
        </div>
      </div>

      {/* 3-Tier Product & Production Strategy Dossier */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white rounded-3xl p-4 sm:p-5 border-2 border-amber-400/90 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              🎯
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Approved Strategic Road-Map
                </span>
                <span className="text-[10px] font-sans font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  ✓ ការពារដើមទុនបង្វិល & ផ្តោតលើ Hero SKU (100% Conversion)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-amber-300 font-sans mt-0.5">
                យុទ្ធសាស្ត្រផលិតកម្ម និងការគ្រប់គ្រងមុខទំនិញ ៣ កម្រិត (3-Tier Product Strategy)
              </h3>
            </div>
          </div>
          <div className="text-right text-xs font-mono text-slate-300">
            <div>គោលការណ៍ផលិត៖ <strong className="text-amber-300">80/20 Rule</strong></div>
            <div className="text-[10px] text-slate-400 font-sans">ការពារកុំឱ្យកកស្ទះដើមទុនលើសំបកកញ្ចប់ & ស្តុកយឺត</div>
          </div>
        </div>

        {/* 3 Tier Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Tier 1 Card */}
          <div className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
            selectedCategory === 'tier1'
              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/60'
              : 'bg-white/5 border-amber-400/40 hover:bg-white/10'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                  Tier 1 (៨០% នៃការផ្តោត)
                </span>
                <span className="text-[10px] font-bold text-amber-300">★ CORE HERO SKU</span>
              </div>
              <h4 className="text-sm font-black text-white font-sans flex items-center gap-1.5">
                <span>🫘</span>
                <span>GI Kampot Pepper Coated</span>
              </h4>
              <p className="text-[11px] text-amber-100 font-sans leading-relaxed">
                គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពត GI (WW180 50g/175g & Broken 50g)។ ទទួលបានការកុម្ម៉ង់ភ្លាមៗ 100% ពីអតិថិជនសាកល្បង!
              </p>
              <div className="pt-1 space-y-1 text-[10.5px] font-sans text-slate-300">
                <div>📦 <strong>ការវេចខ្ចប់៖</strong> កញ្ចប់ Foil & ក្រឡបោះពុម្ពម៉ាកផ្លូវការ</div>
                <div>🏭 <strong>ផលិតកម្ម៖</strong> Mass Production រក្សាស្តុកជាប់លាប់</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory('tier1')}
              className="mt-3 w-full py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer text-center"
            >
              បង្ហាញទំនិញ Tier 1 (#2, #5, #9)
            </button>
          </div>

          {/* Tier 2 Card */}
          <div className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
            selectedCategory === 'tier2'
              ? 'bg-emerald-600/20 border-emerald-400 ring-2 ring-emerald-400/60'
              : 'bg-white/5 border-emerald-400/40 hover:bg-white/10'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                  Tier 2 (High Margin)
                </span>
                <span className="text-[10px] font-bold text-emerald-300">🌾 FUNCTIONAL / B2B</span>
              </div>
              <h4 className="text-sm font-black text-white font-sans flex items-center gap-1.5">
                <span>🌾</span>
                <span>100% Pure Cashew Flour</span>
              </h4>
              <p className="text-[11px] text-emerald-100 font-sans leading-relaxed">
                ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% ក្រឡ ២០០ក្រាម (200g Jar)។ គ្មានជាតិគីមី គ្មានសារធាតុរក្សាទុក ទីផ្សារគ្មានគូប្រជែង!
              </p>
              <div className="pt-1 space-y-1 text-[10.5px] font-sans text-slate-300">
                <div>📦 <strong>ការវេចខ្ចប់៖</strong> ក្រឡកែវថ្លា + ស្លាកមុខក្រោយ (Sticker Labels)</div>
                <div>🏪 <strong>គោលដៅ៖</strong> ហាងនំ Bakery, Keto, ទឹកដោះគោ Vegan, ផ្សារទំនើប</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory('tier2')}
              className="mt-3 w-full py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer text-center"
            >
              បង្ហាញទំនិញ Tier 2 (#1)
            </button>
          </div>

          {/* Tier 3 Card */}
          <div className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
            selectedCategory === 'tier3'
              ? 'bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/60'
              : 'bg-white/5 border-indigo-400/40 hover:bg-white/10'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-black bg-indigo-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                  Tier 3 (Zero Capital Risk)
                </span>
                <span className="text-[10px] font-bold text-indigo-300">📦 MADE-TO-ORDER</span>
              </div>
              <h4 className="text-sm font-black text-white font-sans flex items-center gap-1.5">
                <span>🌶️ 🥥</span>
                <span>WW180 Chili & Sugar Coated</span>
              </h4>
              <p className="text-[11px] text-indigo-100 font-sans leading-relaxed">
                គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស និងស្រោបស្ករស (WW180 Chili & White Sugar)។ មិនផលិតស្តុកទុកច្រើន ការពារការកកស្ទះដើមទុន!
              </p>
              <div className="pt-1 space-y-1 text-[10.5px] font-sans text-slate-300">
                <div>📦 <strong>ការវេចខ្ចប់៖</strong> ប្រើកញ្ចប់ទូទៅ (Generic Pouch) + បិទស្ទីកឃ័រ</div>
                <div>🤝 <strong>ផលិតកម្ម៖</strong> ផលិតតែពេលមានការបញ្ជាទិញជាក់លាក់ (Confirmed PO)</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory('tier3')}
              className="mt-3 w-full py-1.5 px-3 bg-indigo-400 hover:bg-indigo-300 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer text-center"
            >
              បង្ហាញទំនិញ Tier 3 (#3, #4, #6, #7, #8, #10)
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Rescue Banner for 3m² Printed Labels with QR issues */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-white rounded-3xl p-4 sm:p-5 border-2 border-red-500/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600/30 text-red-300 border border-red-500/50 flex items-center justify-center text-2xl shrink-0">
            🚨
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">
                Emergency QR Rescue
              </span>
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                សង្គ្រោះស្លាក ៣ ម៉ែត្រការ៉េ (3m² Labels)
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-amber-300 font-sans">
              បានបោះពុម្ពស្លាក Pepper ឬ Chili (175g) រួចហើយស្កេន QR មិនស្គាល់?
            </h4>
            <p className="text-xs text-slate-300 font-sans max-w-2xl leading-relaxed">
              កុំបោះបង់ស្លាកដែលបានបោះពុម្ពចោល! យើងបានរៀបចំ <strong>សន្លឹកស្ទីគ័រសង្គ្រោះ A4</strong> (ទំហំ ២cm × ២cm) សម្រាប់បោះពុម្ពកាត់បិទពីលើកូដ QR ចាស់បានភ្លាមៗ និងផ្ដល់ឯកសារស្លាក Ultra-HD ត្រឹមត្រូវ ១០០% សម្រាប់រោងពុម្ព។
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setJar175Product('pepper');
              setIsJar175ModalOpen(true);
            }}
            className="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🫘 សង្គ្រោះស្លាក Pepper</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setJar175Product('chili');
              setIsJar175ModalOpen(true);
            }}
            className="py-2 px-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🌶️ សង្គ្រោះស្លាក Chili</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mr-1">
            <Filter size={13} className="text-amber-800" />
            <span>យុទ្ធសាស្ត្រ & ផ្នែកទំនិញ៖</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-950 text-amber-300 border-slate-900 shadow-sm ring-2 ring-amber-400'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>✨ ទាំងអស់ ({products.length} មុខ)</span>
          </button>

          {/* Strategy Tier Filters */}
          <button
            type="button"
            onClick={() => setSelectedCategory('tier1')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'tier1'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100 font-bold'
            }`}
            title="Tier 1: Core Hero SKUs (GI Kampot Pepper WW180 + Broken)"
          >
            <span>🎯 Tier 1: Hero SKUs (80%)</span>
            <span className="text-[10px] bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">3 មុខ</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('tier2')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'tier2'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 font-bold'
            }`}
            title="Tier 2: Functional / B2B (100% Pure Cashew Flour)"
          >
            <span>🌾 Tier 2: B2B Flour</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono font-bold">1 មុខ</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('tier3')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'tier3'
                ? 'bg-indigo-900 text-white border-indigo-950 shadow-md ring-2 ring-indigo-400'
                : 'bg-indigo-50 text-indigo-950 border-indigo-300 hover:bg-indigo-100 font-bold'
            }`}
            title="Tier 3: Made-to-Order (WW180 Chili & Sugar)"
          >
            <span>📦 Tier 3: Made-to-Order</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded-full font-mono font-bold">6 មុខ</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('akc')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'akc'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 font-bold'
            }`}
            title="ផលិតផលប្រគល់ជូនមជ្ឈមណ្ឌលអាស៊ាន-កូរ៉េ (AKC Handover: 300 Pouches 3 Flavors • 11 តុលា 2026)"
          >
            <span>🏛️ I. AKC Handover (11 តុលា)</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono font-bold">3 មុខ</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('ck99')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'ck99'
                ? 'bg-indigo-900 text-white border-indigo-950 shadow-md ring-2 ring-indigo-400'
                : 'bg-indigo-50 text-indigo-950 border-indigo-300 hover:bg-indigo-100 font-bold'
            }`}
            title="ផលិតផលប្រគល់ជូន CK99 Khmer Mart Suwon, Korea (15 តុលា 2026)"
          >
            <span>🏪 II. CK99 Suwon (15 តុលា)</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded-full font-mono font-bold">7 មុខ</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('future_batch')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'future_batch'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
            title="ឡូតិ៍ដែលបានរៀបចំសម្រាប់បាច់ផលិតបន្ទាប់ (WW-PEP-050, WW-SUG-050...)"
          >
            <span>🔜 Next Batch Lots (WW-...)</span>
            <span className="text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">7 មុខ</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('pouch')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'pouch'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            <span>🛍️ 50g Pouches (#2, #3, #4, #8, #9, #10)</span>
            <span className="text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">6 QRs</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('jar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'jar'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            <span>🍯 ក្រឡ 175g/200g (#1, #5, #6, #7)</span>
            <span className="text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">4 QRs</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('ww180')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'ww180'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            <span>👑 WW180 Jumbo (#3, #4, #5, #6, #7)</span>
            <span className="text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">5 QRs</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('bb_broken')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'bb_broken'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            <span>🌾 BB Broken (#2, #8, #9, #10)</span>
            <span className="text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">4 QRs</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('flour')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              selectedCategory === 'flour'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            <span>🥣 ម្សៅសុទ្ធ ១០០% (#1)</span>
            <span className="text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">1 QR</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-600 font-bold">
          បង្ហាញ {filteredProducts.length} ក្នុងចំណោម {products.length} ផលិតផល
        </span>
      </div>

      {/* Dedicated Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((item, idx) => {
          const qrUrl = qrImages[item.id];
          const targetUrl = getTargetUrl(item);
          const isCopied = copiedId === item.id;

          const isEditingThis = activeDedicatedItemId === item.id;

          return (
            <div 
              key={item.id}
              className={`bg-white rounded-2xl border-2 p-4 shadow-sm flex flex-col justify-between transition-all space-y-3.5 relative overflow-hidden group ${
                isEditingThis 
                  ? 'border-emerald-500 ring-4 ring-emerald-300 shadow-md' 
                  : 'border-amber-300 hover:border-amber-500'
              }`}
            >
              {isEditingThis && (
                <div className="absolute top-0 inset-x-0 bg-emerald-600 text-white text-[10px] font-black py-0.5 text-center font-mono">
                  ✓ កំពុងកែប្រែក្នុងផ្ទាំង ១៣ ជំហាន
                </div>
              )}
              {/* Product Info Header */}
              <div className={`space-y-2 ${isEditingThis ? 'pt-2' : ''}`}>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-amber-950 text-amber-300 font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs border border-amber-800">
                      #{item.productNumber || idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.tagColor} font-sans truncate`}>
                      {item.tagKh}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-amber-300 px-2 py-0.5 rounded">
                      {item.batch}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 font-sans flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.nameKh}</span>
                  </h3>
                  <div className="text-[11px] font-mono text-slate-600 font-semibold truncate">
                    {item.nameEn}
                  </div>
                </div>

                {/* Net Weight, Barcode & Shelf Life Bar */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-mono">
                    ⚖️ {item.weight}
                  </span>
                  {item.grade && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded font-mono">
                      ⭐ {item.grade}
                    </span>
                  )}
                  {item.packageFormat && (
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-950 border border-indigo-200 px-2 py-0.5 rounded">
                      📦 {item.packageFormat.includes('Jar') ? 'ក្រឡ (Jar)' : item.packageFormat.includes('Pouch') ? 'កញ្ចប់បាតឈរ ៥០g' : 'កញ្ចប់'}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ⏳ {item.shelfLifeMonths || 6} ខែ
                  </span>
                  {item.strategyTier === 'tier1' && (
                    <span className="text-[9.5px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-2xs border border-amber-600 font-sans flex items-center gap-1">
                      <span>🎯 Tier 1: Hero SKU (80%)</span>
                    </span>
                  )}
                  {item.strategyTier === 'tier2' && (
                    <span className="text-[9.5px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded shadow-2xs border border-emerald-800 font-sans flex items-center gap-1">
                      <span>🌾 Tier 2: B2B Flour</span>
                    </span>
                  )}
                  {item.strategyTier === 'tier3' && (
                    <span className="text-[9.5px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-sans flex items-center gap-1">
                      <span>📦 Tier 3: Made-to-Order</span>
                    </span>
                  )}
                  {(item.id === 'pepper-pouch-50g' || item.id === 'ww180-sugar-pouch-50g' || item.id === 'ww180-chili-pouch-50g') && (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded flex items-center gap-1 font-sans">
                      <span>🇰🇷 AKC Handover</span>
                    </span>
                  )}
                  <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <Barcode size={11} />
                    <span>{item.ean13 || '884...'}</span>
                  </span>
                  {item.price && (
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md font-mono shadow-2xs border border-amber-500 flex items-center gap-1">
                      <span>💰</span>
                      <span>{item.price} USD</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {/* Transparent Pricing Card if specified */}
                  {item.price && item.priceBreakdown && (
                    <div className="p-2 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100/90 border border-amber-300 text-[10.5px] font-sans space-y-0.5">
                      <div className="flex items-center justify-between text-amber-950 font-bold">
                        <span className="flex items-center gap-1">
                          <span>💰</span>
                          <span className="font-extrabold">តម្លាភាពតម្លៃ (Transparent Price)៖</span>
                        </span>
                        <span className="font-mono font-black text-xs text-slate-950 bg-amber-300 px-2 py-0.5 rounded shadow-2xs border border-amber-400">
                          {item.price} USD
                        </span>
                      </div>
                      <div className="text-[9.5px] text-amber-900 font-mono font-bold pt-0.5">
                        {item.priceBreakdown}
                      </div>
                    </div>
                  )}

                  {/* Photo Mockup Preview for Cashew Milk 1L */}
                  {item.id === 'cashew-milk-1l' && (
                    <div
                      onClick={() => setIsMilkModalOpen(true)}
                      className="p-2 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/50 hover:border-amber-400 text-white flex items-center justify-between gap-3 cursor-pointer transition shadow-xs group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src="/images/mayany_cashew_milk_1l.jpg"
                          alt="1L Cashew Milk Mockup"
                          className="w-11 h-11 object-cover rounded-lg border border-emerald-400/50 group-hover:scale-105 transition-transform shrink-0"
                          onError={(e) => { 
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg'; 
                          }}
                        />
                        <div>
                          <div className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                            <span>📸 រូបថតដបជាក់ស្តែង (Real Bottle Photo)</span>
                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-black">ថ្មី</span>
                          </div>
                          <div className="text-[9.5px] text-emerald-200">
                            ដបកែវ ១L • ទឹកដោះគោ $3.00 + ថ្លៃដប $1.50 = សរុប $4.50
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-600 group-hover:bg-emerald-500 text-white px-2 py-1 rounded-lg font-bold shrink-0 transition">
                        មើលដប →
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200 font-sans leading-tight">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-[10px] uppercase font-bold text-amber-950">គ្រឿងផ្សំផ្លូវការ៖</strong>
                      <span className="text-[9px] font-mono text-slate-600">សហគ្រាសផលិត៖ Mayany Enterprise</span>
                    </div>
                    <span className="line-clamp-2">{item.ingredientsKh}</span>
                  </div>

                  {/* Explicit Ingredient Suppliers Traceability List */}
                  <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-[10px] font-sans space-y-1">
                    <div className="flex items-center justify-between text-emerald-950 font-bold">
                      <span className="flex items-center gap-1">🌱 <span>អ្នកផ្គត់ផ្គង់តាមគ្រឿងផ្សំ (Suppliers)៖</span></span>
                      <span className="text-[9px] font-mono text-emerald-800">100% វត្ថុធាតុដើមកម្ពុជា</span>
                    </div>
                    <div className="flex flex-wrap gap-1 text-[9.5px]">
                      <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-800 font-medium">
                        🥜 គ្រាប់ស្វាយចន្ទី៖ <strong className="text-emerald-950 font-bold">Mirarth Agri Tech Co., Ltd.</strong>
                      </span>
                      {(item.flavor === 'pepper' || item.ingredientsKh.includes('ម្រេច') || (item.selectedSuppliers && item.selectedSuppliers.some(s => s.toLowerCase().includes('boh') || s.toLowerCase().includes('pepper') || s.includes('ម្រេច')))) && (
                        <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-800 font-medium">
                          🌿 ម្រេចកំពត GI៖ <strong className="text-indigo-950 font-bold">BOH Co., Ltd.</strong>
                        </span>
                      )}
                      {(item.id === 'cashew-milk-1l' || item.nameKh.includes('ទឹកដោះគោ') || item.ingredientsKh.includes('ស្លឹកតើយ') || item.ingredientsKh.includes('ស្លឹកតយ') || (item.selectedSuppliers && item.selectedSuppliers.some(s => (s.toLowerCase().includes('ringacam') || s.toLowerCase().includes('rincagam')) && (s.includes('ស្លឹកតើយ') || s.includes('ស្លឹកតយ') || item.nameKh.includes('ទឹកដោះគោ'))))) && (
                        <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-800 font-medium">
                          🌿 ម្សៅស្លឹកតើយ៖ <strong className="text-emerald-950 font-bold">Ringacam Enterprise</strong>
                        </span>
                      )}
                      {!item.nameKh.includes('ទឹកដោះគោ') && (item.flavor === 'chili' || item.ingredientsKh.includes('ម្ទេស') || (item.selectedSuppliers && item.selectedSuppliers.some(s => s.toLowerCase().includes('ringacam') || s.toLowerCase().includes('chili') || s.includes('ម្ទេស')))) && (
                        <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-800 font-medium">
                          🌶️ ម្សៅម្ទេស៖ <strong className="text-red-950 font-bold">Ringacam Enterprise</strong>
                        </span>
                      )}
                      {(item.flavor === 'sugar' || item.flavor === 'pepper' || item.ingredientsKh.includes('ស្ករ') || (item.selectedSuppliers && item.selectedSuppliers.some(s => s.toLowerCase().includes('angkor') || s.toLowerCase().includes('sugar') || s.includes('ស្ករ')))) && (
                        <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-800 font-medium">
                          🍯 ស្ករស (Granulated Sugar)៖ <strong className="text-amber-950 font-bold">Angkor Sugar</strong>
                        </span>
                      )}
                      {item.flavor !== 'pure_flour' && (
                        <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-800 font-medium">
                          🧂 អំបិល៖ <strong className="text-slate-900 font-bold">Ngov Heng</strong>
                        </span>
                      )}
                      {item.selectedSuppliers && item.selectedSuppliers
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
                        .map((cs, cIdx) => (
                          <span key={cIdx} className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-800 font-medium">
                            🌾 ដៃគូ៖ <strong className="text-slate-950 font-bold">{cs}</strong>
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Large Scannable QR Code Card with Update Option */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col items-center justify-center space-y-2">
                <div className="w-44 h-44 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center relative group/qr">
                  {qrUrl ? (
                    <img 
                      src={qrUrl} 
                      alt={`QR Code for ${item.nameEn}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                      <QrCode size={24} className="animate-spin" />
                      កំពុងបង្កើត QR...
                    </div>
                  )}

                  {/* Permanent GS1 Badge on QR */}
                  <span className="absolute bottom-1 bg-slate-900/95 text-amber-300 text-[9.5px] font-mono px-2.5 py-0.5 rounded-full font-bold shadow-xs flex items-center gap-1 border border-amber-500/40">
                    <span className="text-amber-400">GS1:</span> {item.ean13}
                  </span>
                </div>

                {/* Make-to-Order Permanent Packaging Indicator */}
                <div className="w-full bg-emerald-50 border border-emerald-300 rounded-lg px-2.5 py-1 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-950 font-bold flex items-center gap-1 font-sans">
                    <span>🏷️</span>
                    <span>ប្រភេទទំនិញ៖</span>
                  </span>
                  <span className="font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300 text-[9.5px] font-sans">
                    ផលិតតាមការកុម្ម៉ង់ (Make-to-Order)
                  </span>
                </div>

                {/* Official GS1 Cambodia Barcode */}
                <div className="w-full bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col items-center space-y-1.5 shadow-2xs">
                  <div className="w-full flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-700 flex items-center gap-1 font-sans">
                      <Barcode size={13} className="text-indigo-700" />
                      <span>បាកូដ GS1 EAN-13 ផ្លូវការ៖</span>
                    </span>
                    <span className="font-mono text-[9px] font-bold bg-indigo-50 text-indigo-900 px-1.5 py-0.2 rounded border border-indigo-200">
                      884 Cambodia
                    </span>
                  </div>

                  {(() => {
                    const binary = ean13ToBinary(item.ean13);
                    const formatted = formatEan13(item.ean13);
                    if (!binary) return <span className="font-mono text-[11px] font-bold text-slate-900">{formatted || item.ean13}</span>;
                    return (
                      <div className="flex flex-col items-center w-full pt-0.5">
                        <svg viewBox={`0 0 ${binary.length} 30`} className="w-40 h-7" preserveAspectRatio="none">
                          {binary.split('').map((bit, bIdx) => (
                            bit === '1' ? (
                              <rect key={bIdx} x={bIdx} y={0} width={1} height={30} fill="#0f172a" />
                            ) : null
                          ))}
                        </svg>
                        <span className="font-mono text-[10.5px] font-black tracking-widest text-slate-900 mt-0.5">
                          {formatted}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Make-to-order Stamping Indicator */}
                  <div className="w-full bg-amber-50/90 border border-amber-300/80 rounded-lg px-2 py-1 text-center text-[9.5px] text-amber-950 font-sans font-bold">
                    <span>LOT / MFD / EXP ៖ បោះត្រាជាក់ស្តែងពេលច្រក (Stamped at packaging)</span>
                  </div>

                  {/* Delivered Institution */}
                  {item.deliveredTo && (
                    <div className="w-full flex items-center justify-between text-[9.5px] font-sans pt-0.5 border-t border-slate-100 text-slate-600">
                      <span className="text-slate-400">ប្រគល់ជូន៖</span>
                      <span className="font-bold text-slate-800 truncate max-w-[170px]" title={item.deliveredTo}>
                        {item.deliveredTo}
                      </span>
                    </div>
                  )}

                  {/* Future Batch Toggle */}
                  {item.futureBatch && (
                    <div className="w-full flex items-center justify-between text-[9px] font-mono pt-0.5 border-t border-slate-100 text-slate-500">
                      <span>បាច់បន្ទាប់: <strong className="text-indigo-950 font-bold">{item.futureBatch}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleToggleBatch(item)}
                        className="text-[8.5px] font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                      >
                        {item.batch === item.futureBatch ? 'ប្រើ Lot ចាស់' : 'ប្តូរយក Lot ថ្មី'}
                      </button>
                    </div>
                  )}
                </div>

                {/* 13 STAGES UPDATE & REVIEW BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    if (onEditIn13Stages) {
                      onEditIn13Stages(item, 1);
                    } else {
                      handleOpenEditModal(item);
                    }
                  }}
                  className={`w-full py-2.5 px-3 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition border ${
                    activeDedicatedItemId === item.id
                      ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 border-amber-500 hover:shadow-md'
                  }`}
                  title="ចូលទៅកែប្រែទិន្នន័យ និងពិនិត្យគ្រប់ ១៣ ជំហានសម្រាប់ QR Code នេះ"
                >
                  <Edit3 size={14} />
                  <span>កែប្រែទិន្នន័យ & ពិនិត្យគ្រប់ ១៣ ជំហាន</span>
                </button>

                {/* Quick Stage Jump Buttons */}
                <div className="w-full grid grid-cols-3 gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onEditIn13Stages ? onEditIn13Stages(item, 3) : handleApplyToDesigner(item, 3)}
                    className="py-1 px-1 text-[10px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition text-center truncate cursor-pointer"
                    title="ជំហានទី ៣-៤៖ ឈ្មោះផលិតផល & រឿងរ៉ាវ"
                  >
                    🏷️ ឈ្មោះ & រឿង
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditIn13Stages ? onEditIn13Stages(item, 5) : handleApplyToDesigner(item, 5)}
                    className="py-1 px-1 text-[10px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition text-center truncate cursor-pointer"
                    title="ជំហានទី ៥៖ គ្រឿងផ្សំ & អាហារូបត្ថម្ភ"
                  >
                    🥣 គ្រឿងផ្សំ
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditIn13Stages ? onEditIn13Stages(item, 8) : handleApplyToDesigner(item, 8)}
                    className="py-1 px-1 text-[10px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition text-center truncate cursor-pointer"
                    title="ជំហានទី ៨៖ បាកូដ EAN-13 & QR"
                  >
                    📲 បាកូដ
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditIn13Stages ? onEditIn13Stages(item, 9) : handleApplyToDesigner(item, 9)}
                    className="py-1 px-1 text-[10px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition text-center truncate cursor-pointer"
                    title="ជំហានទី ៩៖ កាលបរិច្ឆេទ MFD & EXP"
                  >
                    📅 កាលបរិច្ឆេទ
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditIn13Stages ? onEditIn13Stages(item, 10) : handleApplyToDesigner(item, 10)}
                    className="py-1 px-1 text-[10px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition text-center truncate cursor-pointer"
                    title="ជំហានទី ១០៖ លេខឡូតិ៍ផលិតកម្ម"
                  >
                    🔢 លេខឡូតិ៍
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditIn13Stages ? onEditIn13Stages(item, 13) : handleApplyToDesigner(item, 13)}
                    className="py-1 px-1 text-[10px] font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 transition text-center truncate cursor-pointer"
                    title="ជំហានទី ១៣៖ ពិនិត្យ & បោះពុម្ពស្លាក"
                  >
                    🖨️ ពិនិត្យ ១៣
                  </button>
                </div>

                <div className="text-center pt-0.5">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    ✓ ស្កេនផ្ទាល់លើអេក្រង់
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                {/* 1. Apply to Designer */}
                <button
                  type="button"
                  onClick={() => handleApplyToDesigner(item, 1)}
                  className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Sparkles size={13} className="text-amber-400" />
                  <span>បើកផ្ទាំង ១៣ ជំហាន (Step 1)</span>
                </button>

                {/* 2. Download PNG & SVG */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadPng(item)}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg border border-slate-200 flex items-center justify-center gap-1 cursor-pointer transition"
                    title="ទាញយក 1024px PNG សម្រាប់រោងពុម្ព"
                  >
                    <Download size={11} className="text-amber-600" />
                    <span>PNG (1024px)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadSvg(item)}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg border border-slate-300 flex items-center justify-center gap-1 cursor-pointer transition"
                    title="ទាញយក Vector SVG សម្រាប់រោងពុម្ព"
                  >
                    <Download size={11} />
                    <span>Vector (SVG)</span>
                  </button>
                </div>

                {/* 3. Copy Link & Open Test */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition border ${
                      isCopied 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isCopied ? <Check size={11} /> : <Copy size={11} />}
                    <span>{isCopied ? 'បានចម្លង!' : 'ចម្លង URL'}</span>
                  </button>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 cursor-pointer transition shadow-xs text-center"
                    title="បើកមើលក្នុងផ្ទាំង Browser ថ្មី"
                  >
                    <ExternalLink size={11} />
                    <span>តេស្តបើកមើល</span>
                  </a>
                </div>

                {/* 4. Special Cashew Milk 1L Label & Photo Mockup Action */}
                {item.id === 'cashew-milk-1l' && (
                  <button
                    type="button"
                    onClick={() => setIsMilkModalOpen(true)}
                    className="w-full mt-1.5 py-2 px-3 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 hover:from-emerald-800 hover:to-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs border border-emerald-500/40 hover:border-amber-400 cursor-pointer"
                  >
                    <QrCode size={13} className="text-amber-400" />
                    <span>🏷️ មើលស្លាកដប ១L & រូបថតដបជាក់ស្តែង</span>
                  </button>
                )}

                {/* 5. Special 175g Jar Label Studio & QR Rescue Action (Pepper & Chili) */}
                {(item.id === 'ww180-pepper-jar-175g' || item.id === 'ww180-chili-jar-175g') && (
                  <button
                    type="button"
                    onClick={() => {
                      setJar175Product(item.id === 'ww180-chili-jar-175g' ? 'chili' : 'pepper');
                      setIsJar175ModalOpen(true);
                    }}
                    className="w-full mt-1.5 py-2 px-3 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 hover:from-amber-500 hover:to-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs border border-amber-400/50 cursor-pointer"
                  >
                    <span>🩹 ស្លាក ១៧៥g & សង្គ្រោះកូដ QR ៣ ម៉ែត្រការ៉េ</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT/UPDATE MODAL FOR DEDICATED QR CODE PRODUCT */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-amber-400 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editingItem.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-950 text-amber-300 px-2 py-0.5 rounded">
                      {editingItem.batch}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full font-sans">
                      🔒 QR Code ថេរសម្រាប់រោងពុម្ព
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-sans leading-tight mt-0.5">
                    កែប្រែទិន្នន័យលើ QR Code៖ {editingItem.nameKh}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Reassurance Notice */}
            <div className="bg-amber-50 p-3.5 border-b border-amber-200 text-xs text-amber-950 flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block font-bold">QR Code នេះត្រូវបានផ្ញើរទៅរោងពុម្ពរួចហើយ ({editingItem.batch})៖</strong>
                  <p className="text-[11.5px] leading-relaxed text-amber-900">
                    ការកែប្រែទិន្នន័យខាងក្រោម ឬចូលទៅកាន់ប្រព័ន្ធ ១៣ ជំហាន នឹងធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិទៅកាន់ Digital Passport & Cloud Firestore។ អតិថិជនដែលស្កេន QR Code លើកញ្ចប់ដែលបានបោះពុម្ព នឹងឃើញទិន្នន័យថ្មីនេះភ្លាមៗ ដោយមិនបាច់ប្តូររូបភាព QR Code ឡើយ!
                  </p>
                </div>
              </div>

              {onEditIn13Stages && (
                <button
                  type="button"
                  onClick={() => {
                    const itemToEdit = editingItem;
                    setEditingItem(null);
                    onEditIn13Stages(itemToEdit, 1);
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:to-emerald-800 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>🚀 បើកកែប្រែក្នុងប្រព័ន្ធ ១៣ ជំហានពេញលេញ (Review All 13 Stages)</span>
                </button>
              )}
            </div>

            {/* Modal Body Form */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* 1. Barcode Section (Crucial: User just received barcodes!) */}
              <div className="bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/40 p-4 rounded-2xl border-2 border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Barcode size={18} className="text-indigo-700" />
                    <label className="text-xs font-black text-indigo-950 font-sans">
                      បាកូដទំនិញផ្លូវការ (GS1 EAN-13 Barcode)
                    </label>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-300">
                    🇰🇭 GS1 Cambodia 884 Prefix
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={editBarcode}
                    onChange={(e) => setEditBarcode(e.target.value.replace(/\D/g, '').slice(0, 13))}
                    placeholder="8842120005017"
                    maxLength={13}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none font-mono text-sm font-bold bg-white text-slate-900"
                  />
                  {editBarcode.length === 12 && (
                    <button
                      type="button"
                      onClick={() => {
                        const check = calculateEan13CheckDigit(editBarcode);
                        setEditBarcode(`${editBarcode}${check}`);
                        triggerToast(`✓ បានគណនា Check Digit: ${check}`);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shrink-0 cursor-pointer transition shadow-xs"
                    >
                      + បន្ថែម Check Digit
                    </button>
                  )}
                </div>

                {/* Live SVG Barcode Preview */}
                <div className="bg-white p-3 rounded-xl border border-indigo-100 flex flex-col items-center justify-center">
                  {(() => {
                    const binary = ean13ToBinary(editBarcode);
                    if (!binary) {
                      return (
                        <div className="py-2 text-[11px] text-slate-400 font-mono text-center">
                          សូមបញ្ចូលលេខបាកូដ EAN-13 ចំនួន ១២ ឬ ១៣ ខ្ទង់ ដើម្បីមើលរូបបាកូដ
                        </div>
                      );
                    }
                    const formatted = formatEan13(editBarcode);
                    return (
                      <div className="flex flex-col items-center space-y-1">
                        <svg viewBox="0 0 115 45" className="w-56 h-12" preserveAspectRatio="none">
                          {binary.split('').map((bit, idx) => (
                            <rect
                              key={idx}
                              x={idx}
                              y={0}
                              width={1}
                              height={40}
                              fill={bit === '1' ? '#000000' : 'transparent'}
                            />
                          ))}
                        </svg>
                        <div className="font-mono text-xs font-black tracking-widest text-slate-950">
                          {formatted.slice(0, 1)} {formatted.slice(1, 7)} {formatted.slice(7, 13)}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* 2. Lot Number / Batch Code */}
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 font-sans flex items-center gap-1.5">
                    <Tag size={14} className="text-amber-700" />
                    <span>លេខឡូតិ៍ / លេខកូដសម្គាល់ផលិតផល (Lot Number / Batch)៖</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                    {editingItem?.batch || (editingItem?.weight?.includes('175') ? (editingItem?.flavor === 'pepper' ? 'WW-PEP-175' : editingItem?.flavor === 'chili' ? 'WW-CHI-175' : 'WW-SUG-175') : (editingItem?.flavor === 'pepper' ? 'WW-PEP-050' : editingItem?.flavor === 'chili' ? 'WW-CHI-050' : 'WW-SUG-050'))}
                  </span>
                </div>
                <input
                  type="text"
                  value={editBatch}
                  onChange={(e) => setEditBatch(e.target.value)}
                  placeholder="ឧ. WW-PEP-050, WW-SUG-050, WW-CHI-050, WW-PEP-175, WW-SUG-175, WW-CHI-175"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-xs font-mono font-bold text-slate-900 bg-white"
                />
                <p className="text-[11px] text-amber-800 font-sans">
                  * លេខឡូតិ៍នេះនឹងបង្ហាញលើវិញ្ញាបនបត្រ QR Code និងផ្លាកសញ្ញាវេចខ្ចប់ដោយស្វ័យប្រវត្តិ
                </p>
              </div>

              {/* 3. Product Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans">
                    ឈ្មោះផលិតផលជាភាសាខ្មែរ៖
                  </label>
                  <input
                    type="text"
                    value={editNameKh}
                    onChange={(e) => setEditNameKh(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs font-sans font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans">
                    ឈ្មោះផលិតផលជាភាសាអង់គ្លេស៖
                  </label>
                  <input
                    type="text"
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs font-sans text-slate-900"
                  />
                </div>
              </div>

              {/* 3. Net Weight & Shelf Life */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans flex items-center gap-1">
                    <Scale size={13} />
                    <span>ទម្ងន់ (Weight / 50g Pouch: 50g Total Weight)៖</span>
                  </label>
                  <input
                    type="text"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    placeholder="50g ឬ 150g"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans">
                    អាយុកាលរក្សាទុក (Shelf Life):
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[3, 6, 9, 12, 18, 24].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleShelfLifeChange(m)}
                        className={`flex-1 py-1.5 text-xs rounded-xl font-bold font-sans transition cursor-pointer ${
                          editShelfLifeMonths === m
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {m} ខែ
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Production Dates (MFD & EXP) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 font-sans flex items-center gap-1">
                    <Calendar size={12} />
                    <span>កាលបរិច្ឆេទផលិត (MFD Date):</span>
                  </label>
                  <input
                    type="date"
                    value={editMfd}
                    onChange={(e) => {
                      setEditMfd(e.target.value);
                      if (e.target.value) {
                        try {
                          const d = new Date(e.target.value);
                          d.setMonth(d.getMonth() + editShelfLifeMonths);
                          setEditExp(d.toISOString().split('T')[0]);
                        } catch {
                          // ignore
                        }
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none text-xs font-mono bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 font-sans flex items-center gap-1">
                    <Calendar size={12} />
                    <span>កាលបរិច្ឆេទផុតកំណត់ (EXP Date):</span>
                  </label>
                  <input
                    type="date"
                    value={editExp}
                    onChange={(e) => setEditExp(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
              </div>

              {/* 5. Ingredients Formula */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 font-sans">
                  រូបមន្តគ្រឿងផ្សំជាភាសាខ្មែរ (Ingredients Formula):
                </label>
                <textarea
                  rows={2}
                  value={editIngredientsKh}
                  onChange={(e) => setEditIngredientsKh(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs font-sans text-slate-900 leading-relaxed"
                />
              </div>

              {/* 6. Storage & Allergen Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans">
                    លក្ខខណ្ឌរក្សាទុក (Storage Advice):
                  </label>
                  <input
                    type="text"
                    value={editStorage}
                    onChange={(e) => setEditStorage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-none text-xs font-sans text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans">
                    សារធាតុបង្កអាឡែហ្ស៊ី (Allergen Advice):
                  </label>
                  <input
                    type="text"
                    value={editAllergen}
                    onChange={(e) => setEditAllergen(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-none text-xs font-sans text-slate-900"
                  />
                </div>
              </div>

              {/* 7. Official Sourcing Partners & Suppliers */}
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 font-sans flex items-center gap-1.5">
                    <span>🌾</span>
                    <span>ដៃគូផ្គត់ផ្គង់វត្ថុធាតុដើម (Sourcing Partners & Suppliers)៖</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                    {editSuppliers.length} បានជ្រើសរើស
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {DEFAULT_OFFICIAL_SUPPLIERS.map((sup) => {
                    const isSelected = editSuppliers.some(s => 
                      s === sup.badgeTitle || 
                      s === sup.supplierName || 
                      s.includes(sup.supplierName) || 
                      (sup.id === 'angkor-sugar' && (s.toLowerCase().includes('angkor') || s.includes('ស្ករ') || s.toLowerCase().includes('sugar'))) ||
                      (sup.id === 'mirarth-ww180' && (s.toLowerCase().includes('mirarth') || s.includes('ចន្ទី'))) ||
                      (sup.id === 'boh-pepper' && (s.toLowerCase().includes('boh') || s.includes('ម្រេច'))) ||
                      (sup.id === 'ngov-heng-salt' && (s.toLowerCase().includes('ngov') || s.includes('អំបិល'))) ||
                      (sup.id === 'ringacam-chili' && (s.toLowerCase().includes('ringacam') || s.includes('ម្ទេស')))
                    );
                    return (
                      <button
                        key={sup.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setEditSuppliers(prev => prev.filter(s => {
                              if (s === sup.badgeTitle || s === sup.supplierName || s.includes(sup.supplierName)) return false;
                              if (sup.id === 'angkor-sugar' && (s.toLowerCase().includes('angkor') || s.includes('ស្ករ') || s.toLowerCase().includes('sugar'))) return false;
                              if (sup.id === 'boh-pepper' && (s.toLowerCase().includes('boh') || s.includes('ម្រេច'))) return false;
                              if (sup.id === 'ngov-heng-salt' && (s.toLowerCase().includes('ngov') || s.includes('អំបិល'))) return false;
                              if (sup.id === 'ringacam-chili' && (s.toLowerCase().includes('ringacam') || s.includes('ម្ទេស'))) return false;
                              return true;
                            }));
                          } else {
                            setEditSuppliers(prev => [...prev, sup.badgeTitle]);
                          }
                        }}
                        className={`p-2 rounded-xl border text-left text-xs font-sans transition cursor-pointer flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{sup.icon} {sup.supplierName}</span>
                        <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isSelected ? '✓ ជ្រើស' : '+ បន្ថែម'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="button"
                  onClick={handleResetCurrentEditToDefault}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition cursor-pointer flex items-center gap-1 border border-amber-300"
                  title="កំណត់តម្លៃផលិតផលនេះមកតាមលំនាំដើមរបស់សហគ្រាសវិញ"
                >
                  <RefreshCw size={12} />
                  <span>លំនាំដើម (Reset)</span>
                </button>
              </div>

              <button
                type="button"
                disabled={isSavingEdit}
                onClick={handleSaveEdit}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSavingEdit ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>កំពុងរក្សាទុកក្នុង Cloud...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>រក្សាទុក & ធ្វើបច្ចុប្បន្នភាពលើ QR Code នេះ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1L Cashew Milk Label & Photo Mockup Modal */}
      <CashewMilk1LLabelModal
        isOpen={isMilkModalOpen}
        onClose={() => setIsMilkModalOpen(false)}
      />

      {/* 175g Jar Label Studio & 3m² QR Rescue Modal */}
      <Jar175gLabelStudioModal
        isOpen={isJar175ModalOpen}
        onClose={() => setIsJar175ModalOpen(false)}
        defaultProduct={jar175Product}
      />
    </div>
  );
}
