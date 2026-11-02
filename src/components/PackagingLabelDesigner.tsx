import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, Download, Upload, Mic, MicOff, Volume2, VolumeX, Sparkles, CheckCircle2, 
  AlertCircle, Info, RefreshCw, Copy, Check, ChevronRight, ChevronDown, HelpCircle, 
  FileText, ShieldCheck, Tag, Box, ArrowRight, Eye, Layout, Sliders, Smartphone, QrCode,
  Package, ShoppingCart, Zap, BarChart3, Layers, Award, Scale, HelpCircle as HelpIcon,
  Flame, Clock, Wrench, DollarSign, Store, ExternalLink, Scissors, Plus, Trash2, FolderHeart, Lightbulb, BookOpen,
  Calendar, Globe, Search, Filter, CheckSquare, ListOrdered, Percent, RotateCcw, Heart, Play, Pause, Square,
  X, Phone, Mail, Facebook
} from 'lucide-react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { CashewNutIcon } from './CashewTraceLogo';
import UniversalSectorVideoGuide from './UniversalSectorVideoGuide';
import SmeRegistrationBanner, { RegisteredSmeRecord } from './SmeRegistrationBanner';
import SmallProductMicroLabelSheet from './SmallProductMicroLabelSheet';
import WindowPouchMiniLabelDesigner, { THREE_FLAVOR_PRESETS } from './WindowPouchMiniLabelDesigner';
import JarBanner100gDesigner from './JarBanner100gDesigner';
import AccessibleVoiceAssistant from './AccessibleVoiceAssistant';
import PackagingStepWizard, { PackagingWizardData, parseBotanicalTwoRows } from './PackagingStepWizard';
import { NutritionFactsManager } from './NutritionFactsManager';
import { PouchHeader8cmPrinterModal } from './PouchHeader8cmPrinterModal';
import { FtcDefattingLabModal } from './FtcDefattingLabModal';
import { MayanyProductMatrixSelector, KernelGrade, FlavorType, PackagingFormat } from './MayanyProductMatrixSelector';
import { 
  combineDuplicateIngredients, 
  addOrMergeIngredientToList, 
  detectDuplicateIngredients,
  balanceIngredientsTo100,
  calculateIngredientsTotalPercent,
  cleanIngredientsToKhmerOnly,
  cleanKhmerAllergenOnly,
  cleanKhmerStorageOnly,
  cleanKhmerUsageOnly,
  translateIngredientsToLanguage,
  translateAllergenToLanguage,
  translateStorageToLanguage,
  translateUsageToLanguage,
  cleanseSupplierStringsFromIngredients,
  ensureKhmerProductName,
  getStandardKoreanProductName
} from '../lib/ingredientTranslator';
import { 
  CERTIFICATE_LANGUAGES, 
  CERTIFICATE_TRANSLATIONS 
} from '../lib/certificateTranslations';
import { PRODUCT_PRESETS, ProductPreset } from '../data/productPresets';
import { getMayanyProductStory } from '../data/mayanyProductDescriptions';
import PitchDeckQuickQRs, { QuickQRItem, DEFAULT_DEDICATED_PRODUCTS } from './PitchDeckQuickQRs';
import { getPublicOrigin } from '../utils/publicOrigin';
import { formatEan13, ean13ToBinary } from '../utils/barcodeGenerator';
import MayanyLogo from './MayanyLogo';
import { parseIngredientsWithPercentages } from './ProductPassport';
import { CAMBODIA_PROVINCES } from '../data/provinces';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  COMMON_KHMER_ADDRESS_PRESETS, 
  INGREDIENT_DROPDOWN_OPTIONS, 
  SPICE_AND_SEASONING_ADDONS,
  INDIVIDUAL_INGREDIENT_CATALOG,
  INGREDIENT_CATEGORY_GROUPS,
  IndividualIngredientItem,
  IngredientCategoryGroup,
  ALLERGEN_DROPDOWN_OPTIONS, 
  STORAGE_DROPDOWN_OPTIONS, 
  USAGE_DROPDOWN_OPTIONS,
  COUNTRY_ORIGIN_OPTIONS,
  NET_WEIGHT_VOLUME_PRESETS,
  AI_DESIGN_PRESETS,
  AiDesignStylePreset,
  StandardAddress,
  DateMarkingScheme,
  DateMarkingOption,
  DATE_MARKING_SCHEME_OPTIONS,
  SHELF_LIFE_QUICK_PRESETS,
  calculateDateWithMonths,
  CAMBODIA_CERTIFICATION_STANDARDS,
  StandardCertificationItem,
  RECYCLE_BADGE_OPTIONS,
  RecycleOption,
  SOCIAL_SLOGAN_OPTIONS,
  SocialSloganOption
} from '../data/labelAddressPresets';

export interface NutritionFacts {
  energyKcal: string;
  energyKj: string;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  cholesterol: string;
  sodium: string;
  totalCarb: string;
  dietaryFiber: string;
  totalSugars: string;
  addedSugars: string;
  protein: string;
  salt: string;
}

export type ContainerType = 
  | 'pp-jar-200g' 
  | 'pp-tub-150g'
  | 'pp-tub-500g'
  | 'pet-canister-300g'
  | 'standup-pouch-50g'
  | 'pouch-micro-35g'
  | 'pouch-snack-45g'
  | 'standup-pouch-100g'
  | 'standup-pouch-250g'
  | 'standup-pouch-500g'
  | 'standup-pouch-1kg'
  | 'kraft-pouch-250g'
  | 'vacuum-retort-250g'
  | 'vacuum-retort-500g'
  | 'glass-jar-180g'
  | 'glass-jar-350g' 
  | 'glass-jar-500g'
  | 'spice-jar-100g' 
  | 'tin-can-150g'
  | 'glass-bottle-250ml'
  | 'glass-bottle-500ml'
  | 'bulk-sack-5kg'
  | 'bulk-sack-10kg'
  | 'bulk-sack-20kg'
  | string;

export const CONTAINER_CATALOG: { [key: string]: { label: string; spec: string; desc: string } } = {
  'standup-pouch-50g': { label: 'ថង់គំរូ ៥០g សន្លឹកអាលុយមីញ៉ូម / ក្រដាស / ផ្លាស្ទិក', spec: '100mm × 150mm', desc: 'ស្រទាប់របាំង ៣ជាន់ ការពារពន្លឺ សំណើម និងអុកស៊ីហ្សែន សម្រាប់កញ្ចប់គំរូនាំចេញ (Tri-laminate barrier)' },
  'pouch-micro-35g': { label: 'កញ្ចប់តូច ៣៥g ស្រទាប់លោហធាតុ ១,០០០៛ (35g Mini Metallized Sachet - $0.25 / 1,000៛)', spec: '80mm × 120mm', desc: 'កញ្ចប់តូចងាយស្រួលទិញញ៉ាំភ្លាមៗតម្លៃសមរម្យ (Single-serve micro packaging)' },
  'pouch-snack-45g': { label: 'ថង់ហោប៉ៅ ៤៥g មានខ្សែរូតបិទជិត', spec: '95mm × 140mm', desc: 'ថង់សម្រន់ច្រកហោប៉ៅអាចបិទបើកបាន (Resealable on-the-go snack bag)' },
  'standup-pouch-100g': { label: 'ថង់ឈរ ១០០g ស្រទាប់រលោងមានខ្សែរូត', spec: '120mm × 180mm', desc: 'សន្លឹកអាលុយមីញ៉ូមការពារសំណើម និងអុកស៊ីហ្សែនខ្ពស់ (High moisture & oxygen barrier)' },
  'standup-pouch-250g': { label: 'ថង់ឈរ ២៥០g សន្លឹកអាលុយមីញ៉ូមច្រើនជាន់', spec: '150mm × 220mm', desc: 'ថង់ឈរខ្នាតស្តង់ដារដាក់តាំងលើធ្នើផ្សារទំនើប (Supermarket shelf-ready pouch)' },
  'standup-pouch-500g': { label: 'ថង់របាំងការពារ ៥០០g មានចង្អូរហែក', spec: '180mm × 260mm', desc: 'កញ្ចប់ខ្នាតគ្រួសារស្រទាប់ការពារច្រើនជាន់ (Family-size multi-layer pack)' },
  'standup-pouch-1kg': { label: 'ថង់ឈរខ្នាតធំ ១kg ធន់មាំខ្ពស់', spec: '220mm × 320mm', desc: 'ទំហំពាណិជ្ជកម្មលក់ដុំ និងផ្គត់ផ្គង់ភោជនីយដ្ឋាន (Commercial retail & food service size)' },
  'kraft-pouch-250g': { label: 'ថង់ក្រដាសក្រាហ្វ ២៥០g ស្រទាប់ក្នុងការពារខ្យល់', spec: '150mm × 220mm', desc: 'ម៉ូតក្រដាសក្រាហ្វធម្មជាតិអមដោយស្រទាប់អាលុយមីញ៉ូមខាងក្នុង (Natural eco-artisan look)' },
  'vacuum-retort-250g': { label: 'ថង់បូមខ្យល់ ២៥០g ធន់កម្ដៅចម្អិនខ្ពស់', spec: '140mm × 200mm', desc: 'សម្រាប់ត្រី សាច់ និងប្រហុកចំហុយកម្ដៅ ១២១°C (121°C Retort sterilization)' },
  'vacuum-retort-500g': { label: 'ថង់បូមខ្យល់ ៥០០g សម្រាប់សាច់ក្រក', spec: '160mm × 250mm', desc: 'ថង់បូមខ្យល់ស្វិតធន់ការពារការធ្លាយ (Heavy-duty puncture-resistant vacuum)' },
  'pp-jar-200g': { label: 'កំប៉ុងជ័រ PP ២០០g កម្រិតអាហារដ្ឋាន PP 05', spec: 'Ø 72mm × 80mm', desc: 'កំប៉ុងជ័រស្រអាប់ការពារកាំរស្មី UV និងការកកិត (Prevents UV & light oxidation)' },
  'pp-tub-150g': { label: 'ធុងជ័រ PP ១៥០g មានគន្លឹះសុវត្ថិភាព', spec: 'Ø 85mm × 50mm', desc: 'សម្រាប់ប័រស្វាយចន្ទី ទឹកជ្រលក់ និងម្ហូបក្លាសេ (For cashew dips, pastes & chilled items)' },
  'pp-tub-500g': { label: 'ធុងជ័រ PP ៥០០g ថ្លា ឬ ស្រអាប់', spec: 'Ø 115mm × 75mm', desc: 'ធុងជ័រអាចតម្រៀបលើគ្នាបានសម្រាប់ផ្ទះបាយ និងផ្សារទំនើប (Stackable retail food tub)' },
  'pet-canister-300g': { label: 'កំប៉ុងជ័រ PET ៣០០g មានក្រវិលទាញបើកងាយ', spec: 'Ø 85mm × 100mm', desc: 'កំប៉ុងថ្លាដូចកញ្ចក់បិទគម្របដែកទាញបើក (Crystal clear presentation with metal pull-ring)' },
  'glass-jar-180g': { label: 'កំប៉ុងកែវ ៦ជ្រុង ១៨០g ប្រណិត', spec: 'Ø 65mm × 75mm', desc: 'កំប៉ុងកែវប្រណិតសម្រាប់កាដូ និងគ្រឿងទេសពិសេស (Premium gift & artisanal condiment)' },
  'glass-jar-350g': { label: 'កំប៉ុងកែវមូល ៣៥០g គម្របបិទជិតខ្យល់', spec: 'Ø 75mm × 110mm', desc: 'បិទជិតខ្យល់សូន្យភាគរយសម្រាប់ប័រ និងដំណាប់ (Zero oxygen transmission for pure butters)' },
  'glass-jar-500g': { label: 'កំប៉ុងកែវ ៥០០g សម្រាប់ត្រាំ និងរក្សាទុក', spec: 'Ø 85mm × 130mm', desc: 'កំប៉ុងកែវបិទជិតខ្យល់សម្រាប់រក្សាទុកម្ហូបអាហារ (Airtight hermetic canning & pantry glass jar)' },
  'spice-jar-100g': { label: 'កំប៉ុងកែវគ្រឿងទេស ១០០g មានក្បាលកិន', spec: 'Ø 45mm × 130mm', desc: 'កំប៉ុងកែវមានក្បាលកិនសេរ៉ាមិចស្រាប់សម្រាប់ម្រេចកំពត (Built-in ceramic grinder cap)' },
  'tin-can-150g': { label: 'កំប៉ុងដែក ១៥០g គ្មានថ្នេរមានក្រវិលទាញ', spec: 'Ø 73mm × 55mm', desc: 'បិទជិតការពារពន្លឺ ឧស្ម័ន និងសំណើម ១០០% (Total light, gas & moisture hermetic lock)' },
  'glass-bottle-250ml': { label: 'ដបកែវទឹកជ្រលក់ ២៥០ml មានក្បាលចាក់', spec: 'Ø 55mm × 190mm', desc: 'សម្រាប់ទឹកជ្រលក់ស្វាយចន្ទី ទឹកត្រី និងប្រេងចម្រាញ់ (For cashew sauces & infused oils)' },
  'glass-bottle-500ml': { label: 'ដបកែវប្រេង ឬ ទឹកស៊ីរ៉ូ ៥០០ml', spec: 'Ø 68mm × 240mm', desc: 'ដបកែវពណ៌តែការពារពន្លឺ UV សម្រាប់ប្រេងត្រជាក់ (UV amber/flint glass for oils)' },
  'bulk-sack-5kg': { label: 'បាវក្រដាសក្រាហ្វ ៥kg មានវ៉ាល់បញ្ចេញឧស្ម័ន', spec: '280mm × 450mm', desc: 'សម្រាប់កាហ្វេ និងគ្រាប់ធញ្ញជាតិលីង (Commercial coffee & roasted nut pouch)' },
  'bulk-sack-10kg': { label: 'បាវក្រដាសក្រាហ្វ ១០kg មានស្រទាប់ PE', spec: '350mm × 550mm', desc: 'បាវលក់ដុំ B2B ការពារសំណើម (Wholesale B2B moisture-protected sack)' },
  'bulk-sack-20kg': { label: 'បាវក្រដាសក្រាហ្វពាណិជ្ជកម្ម ២០kg', spec: '450mm × 750mm', desc: 'បាវស្តង់ដាររោងចក្រ និងការនាំចេញ (Industrial bakery & exporter grade sack)' },
};

export interface BotanicalTemplate {
  labelKhmer: string;
  englishDefault: string;
  botanicalSubtitle: string;
  category: string;
}

export const BOTANICAL_DESCRIPTOR_TEMPLATES: BotanicalTemplate[] = [
  {
    labelKhmer: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពត',
    englishDefault: 'Cashew Kernel Coated Kampot Pepper',
    botanicalSubtitle: 'Selected Cambodian Cashews (Anacardium occidentale)\nArtisanal GI Kampot Pepper Coated (Piper nigrum)',
    category: 'Cashew Snacks'
  },
  {
    labelKhmer: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស & ខ្ទឹមស',
    englishDefault: 'Cashew Kernel Coated Chili & Garlic',
    botanicalSubtitle: 'Crunchy Cambodian Cashews (Anacardium occidentale) • Spicy Bird Chili (Capsicum frutescens)',
    category: 'Cashew Snacks'
  },
  {
    labelKhmer: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្នោត',
    englishDefault: 'Cashew Kernel Sugar Coated',
    botanicalSubtitle: 'Artisan Kettle-Glazed Sweet Cashews • Pure GI Kampong Speu Palm Sugar (Borassus flabellifer)',
    category: 'Cashew Snacks'
  },
  {
    labelKhmer: 'គ្រាប់ស្វាយចន្ទីលីងអំបិលធម្មជាតិ',
    englishDefault: 'Artisan Roasted Cashews with Kampot Sea Salt',
    botanicalSubtitle: 'Premium Grade W240 Jumbo Whole Cashews (Anacardium occidentale) • Natural Sea Salt',
    category: 'Cashew Snacks'
  },
  {
    labelKhmer: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ',
    englishDefault: '100% Pure Cambodian Cashew Flour',
    botanicalSubtitle: 'Ultra-Fine Stone Milled (Anacardium occidentale) • Grain-Free, Gluten-Free & Keto',
    category: 'Processed Powders'
  },
  {
    labelKhmer: 'ប័រគ្រាប់ស្វាយចន្ទី',
    englishDefault: 'Natural Creamy Cashew Butter',
    botanicalSubtitle: '100% Single-Origin Cambodian Cashews (Anacardium occidentale) • Smooth Stone Ground',
    category: 'Spreads & Pastes'
  },
  {
    labelKhmer: 'ដំណាប់ស្វាយកែវរមៀត',
    englishDefault: 'Soft Dried Cambodian Keo Romeat Mango',
    botanicalSubtitle: 'Natural Sun-Ripened Cambodian Mango (Mangifera indica) • Low Sugar & High Fiber',
    category: 'Dried Fruits'
  },
  {
    labelKhmer: 'ដំណាប់ចេក / ចេកបំពង',
    englishDefault: 'Crispy Artisan Banana Chips',
    botanicalSubtitle: 'Authentic Cambodian Namwa Banana (Musa acuminata × balbisiana)',
    category: 'Dried Fruits'
  },
  {
    labelKhmer: 'ប្រហុកខ្មែរប្រពៃណី',
    englishDefault: 'Traditional Cambodian Fermented Fish Paste (Prahok)',
    botanicalSubtitle: 'Artisanal Fermented Tonle Sap Freshwater Fish (Henicorhynchus siamensis)',
    category: 'Fishery Products'
  },
  {
    labelKhmer: 'សាច់ក្រកត្រីអត់ឆ្អឹង',
    englishDefault: 'Artisan Cambodian Boneless Fish Sausage',
    botanicalSubtitle: 'Wild Tonle Sap Snakehead Fish (Channa striata) • High Protein & Low Fat',
    category: 'Fishery Products'
  },
  {
    labelKhmer: 'កាហ្វេមណ្ឌលគិរី',
    englishDefault: 'Mondulkiri Highland Roasted Coffee',
    botanicalSubtitle: 'Cambodian Highland Coffee Blend (Coffea canephora / Coffea arabica)',
    category: 'Beverages'
  },
  {
    labelKhmer: 'ទឹកឃ្មុំព្រៃធម្មជាតិ',
    englishDefault: 'Pure Cambodian Wild Forest Honey',
    botanicalSubtitle: 'Raw Organic Forest Honey (Apis dorsata) • Unpasteurized & 100% Natural',
    category: 'Natural Honey'
  }
];

export function smartTranslateKhmerAgro(khmerText: string): { english: string; botanical: string } {
  if (!khmerText || khmerText.trim().length === 0) {
    return {
      english: 'Cambodian Cashew Product',
      botanical: 'Selected Cambodian Cashews (Anacardium occidentale)'
    };
  }
  const text = khmerText.trim();
  const lower = text.toLowerCase();

  // Extract cashew grade if specified (e.g. WW180, WW210, WW240, WW320, W240, WS, etc.)
  const gradeMatch = text.match(/(WW\s*180|WW\s*210|WW\s*240|WW\s*320|WW\s*450|W\s*240|W\s*210|W\s*180|WS|LSP|LP|SP|BB)/i);
  const gradeStr = gradeMatch ? gradeMatch[0].toUpperCase().replace(/\s+/g, '') : '';
  const gradeSuffix = gradeStr ? ` (${gradeStr})` : '';

  // 1. Pepper Cashew combinations (e.g. គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅGIកំពត)
  if (lower.includes('ម្រេច') || lower.includes('pepper')) {
    const isBlack = text.includes('ខ្មៅ') || lower.includes('black');
    const isWhite = text.includes('ម្រេចស') || text.includes(' ពណ៌ស') || lower.includes('white');
    const isRed = text.includes('ក្រហម') || lower.includes('red');
    const isGreen = text.includes('បៃតង') || lower.includes('green');
    const isKampot = text.includes('កំពត') || lower.includes('kampot');
    const isGI = text.includes('GI') || text.includes('gi') || text.includes('ភូមិសាស្ត្រ') || isKampot;

    let pepperDesc = 'Pepper';
    if (isBlack) pepperDesc = 'Black Pepper';
    else if (isWhite) pepperDesc = 'White Pepper';
    else if (isRed) pepperDesc = 'Red Pepper';
    else if (isGreen) pepperDesc = 'Green Pepper';

    const originOrBrand = isKampot 
      ? (isGI ? `GI Kampot ${pepperDesc}` : `Kampot ${pepperDesc}`)
      : (isGI ? `GI Cambodian ${pepperDesc}` : pepperDesc);

    const isCoated = text.includes('ស្រោប') || lower.includes('coated') || lower.includes('glaze');
    const isRoasted = text.includes('លីង') || lower.includes('roasted');

    let englishTitle = '';
    if (isCoated) {
      englishTitle = `${originOrBrand} Coated Cashew Kernels${gradeSuffix}`;
    } else if (isRoasted) {
      englishTitle = `Roasted Cashew Kernels with ${originOrBrand}${gradeSuffix}`;
    } else {
      englishTitle = `${originOrBrand} Cashew Kernels${gradeSuffix}`;
    }

    const botanicalPepper = isBlack 
      ? `Artisanal ${originOrBrand} (Piper nigrum)`
      : isWhite 
        ? `Sun-Dried ${originOrBrand} (Piper nigrum)`
        : `Artisanal ${originOrBrand} (Piper nigrum)`;

    return {
      english: englishTitle,
      botanical: `Selected Cambodian Cashews (Anacardium occidentale)\n${botanicalPepper}`
    };
  }

  // 2. Chili & Garlic Coated / Spicy Cashews
  if (lower.includes('ម្ទេស') || lower.includes('chili') || lower.includes('chilli') || lower.includes('ហឹរ')) {
    const isGarlic = text.includes('ខ្ទឹម') || lower.includes('garlic');
    const isExtraSpicy = text.includes('ហឹរខ្លាំង') || lower.includes('extra spicy');
    const isCoated = text.includes('ស្រោប') || lower.includes('coated');

    const flavorName = isGarlic ? 'Chili & Garlic' : (isExtraSpicy ? 'Extra Spicy Chili' : 'Spicy Chili');
    const englishTitle = isCoated 
      ? `${flavorName} Coated Cashew Kernels${gradeSuffix}`
      : `Roasted ${flavorName} Cashew Kernels${gradeSuffix}`;

    return {
      english: englishTitle,
      botanical: `Crunchy Cambodian Cashews (Anacardium occidentale)\nSpicy Cambodian Bird Chili (Capsicum frutescens)${isGarlic ? ' & Fragrant Garlic' : ''}`
    };
  }

  // 3. Palm Sugar / Sugar Glazed Cashews
  if (lower.includes('ស្ករត្នោត') || lower.includes('ស្ករ') || lower.includes('sugar') || lower.includes('caramel')) {
    const isPalmSugar = text.includes('ត្នោត') || lower.includes('palm');
    const isSpeu = text.includes('កំពង់ស្ពឺ') || lower.includes('speu') || text.includes('GI') || isPalmSugar;
    const isCoated = text.includes('ស្រោប') || lower.includes('coated') || lower.includes('glazed');

    const sugarDesc = isSpeu ? 'GI Kampong Speu Palm Sugar' : (isPalmSugar ? 'Natural Palm Sugar' : 'Natural Cane Sugar');
    const englishTitle = isCoated
      ? `${sugarDesc} Coated Cashew Kernels${gradeSuffix}`
      : `Artisan Sweet Glazed Cashews (${sugarDesc})${gradeSuffix}`;

    return {
      english: englishTitle,
      botanical: `Selected Cambodian Cashews (Anacardium occidentale)\nPure ${sugarDesc} Glaze (Borassus flabellifer)`
    };
  }

  // 4. Salted / Roasted Cashews
  if (lower.includes('អំបិល') || lower.includes('salt') || lower.includes('លីង') || lower.includes('roasted')) {
    const isKampotSalt = text.includes('កំពត') || lower.includes('kampot');
    const isNatural = text.includes('ធម្មជាតិ') || lower.includes('natural');
    const saltDesc = isKampotSalt ? 'Kampot Sea Salt' : 'Natural Sea Salt';

    const englishTitle = isNatural 
      ? `Natural Roasted Cashew Kernels with ${saltDesc}${gradeSuffix}`
      : `Artisan Roasted Cashews with ${saltDesc}${gradeSuffix}`;

    return {
      english: englishTitle,
      botanical: `Premium Cambodian Cashews (Anacardium occidentale)\nArtisan Roasted with Natural ${saltDesc}`
    };
  }

  // 5. Tom Yum & Specialty Flavors
  if (lower.includes('តុងយ៉ាំ') || lower.includes('tomyum') || lower.includes('tom yum')) {
    return {
      english: `Tom Yum Spiced Cashew Kernels${gradeSuffix}`,
      botanical: 'Selected Cambodian Cashews (Anacardium occidentale)\nAromatic Lemongrass, Kaffir Lime & Galangal Spice'
    };
  }

  if (lower.includes('ឈីស') || lower.includes('cheese')) {
    return {
      english: `Savory Cheese Flavored Cashew Kernels${gradeSuffix}`,
      botanical: 'Selected Cambodian Cashews (Anacardium occidentale)\nRich Savory Cheese Seasoning'
    };
  }

  // 6. Flour / Powder
  if (lower.includes('ម្សៅ') || lower.includes('flour') || lower.includes('powder')) {
    return {
      english: '100% Pure Cashew Kernel Flour',
      botanical: '100% Pure Cashew Kernel Flour (Anacardium occidentale)\n100% Natural, Grain-Free & Plant-Based'
    };
  }

  // 7. Butter
  if (lower.includes('ប័រ') || lower.includes('butter')) {
    return {
      english: 'Natural Creamy Cashew Butter',
      botanical: '100% Single-Origin Cambodian Cashews (Anacardium occidentale) • Smooth Stone Ground'
    };
  }

  // 8. Mango
  if ((lower.includes('ស្វាយ') && !lower.includes('ចន្ទី')) || lower.includes('mango')) {
    const isKeoRomeat = text.includes('កែវរមៀត') || lower.includes('keo') || lower.includes('romeat');
    return {
      english: isKeoRomeat ? 'Soft Dried Cambodian Keo Romeat Mango' : 'Natural Soft Dried Cambodian Mango',
      botanical: 'Natural Sun-Ripened Cambodian Mango (Mangifera indica) • Low Sugar & High Fiber'
    };
  }

  // 9. Pineapple
  if (lower.includes('ម្នាស់') || lower.includes('pineapple')) {
    return {
      english: 'Sun-Dried Sweet Cambodian Pineapple',
      botanical: 'Authentic Cambodian Queen Pineapple (Ananas comosus) • 100% All-Natural'
    };
  }

  // 10. Banana
  if (lower.includes('ចេក') || lower.includes('banana')) {
    return {
      english: 'Crispy Artisan Cambodian Banana Chips',
      botanical: 'Authentic Cambodian Namwa Banana (Musa acuminata × balbisiana)'
    };
  }

  // 11. Prahok / Fermented fish
  if (lower.includes('ប្រហុក') || lower.includes('prahok')) {
    return {
      english: 'Traditional Cambodian Fermented Fish Paste (Prahok)',
      botanical: 'Artisanal Fermented Tonle Sap Freshwater Fish (Henicorhynchus siamensis)'
    };
  }

  // 12. Sausage
  if (lower.includes('សាច់ក្រក') || lower.includes('sausage')) {
    const isFish = text.includes('ត្រី') || lower.includes('fish');
    return {
      english: isFish ? 'Artisan Boneless Freshwater Fish Sausage' : 'Artisan Cambodian Sausage',
      botanical: 'Traditional Cured Meat with Natural Spices & GI Palm Sugar'
    };
  }

  // 13. Coffee
  if (lower.includes('កាហ្វេ') || lower.includes('coffee')) {
    const isMondulkiri = text.includes('មណ្ឌលគិរី') || lower.includes('mondulkiri');
    return {
      english: isMondulkiri ? 'Mondulkiri Highland Roasted Coffee' : 'Cambodian Roasted Coffee Blend',
      botanical: 'Cambodian Highland Coffee Blend (Coffea canephora / Coffea arabica)'
    };
  }

  // 14. Honey
  if (lower.includes('ទឹកឃ្មុំ') || lower.includes('honey')) {
    return {
      english: 'Pure Cambodian Wild Forest Honey',
      botanical: 'Raw Organic Forest Honey (Apis dorsata) • Unpasteurized & 100% Natural'
    };
  }

  // 15. Cashew Milk / Drink
  if (lower.includes('ទឹកដោះគោ') || lower.includes('milk') || lower.includes('drink') || lower.includes('ភេសជ្ជៈ')) {
    return {
      english: '100% Plant-Based Cashew Milk (1L Bottle)',
      botanical: '100% Plant-Based Artisanal Cashew Milk (Anacardium occidentale)\nFreshly Made to Order • Total $4.50 ($3.00 Drink + $1.50 Bottle)'
    };
  }

  // 16. General Cashews
  if (lower.includes('ស្វាយចន្ទី') || lower.includes('cashew')) {
    return {
      english: `Premium Cambodian Cashew Kernels${gradeSuffix}`,
      botanical: 'Selected Cambodian Cashews (Anacardium occidentale) • Premium Grade Wholes'
    };
  }

  return {
    english: 'Cambodian Agro-Food Product',
    botanical: 'Authentic Cambodian Natural Agriculture & Agro-Industry Product'
  };
}

export { PRODUCT_PRESETS, type ProductPreset } from '../data/productPresets';

export function formatBotanicalRows(text: string): string[] {
  if (!text) return [];
  let lines: string[] = [];
  if (text.includes('\n')) {
    lines = text.split('\n');
  } else if (text.includes(' • ')) {
    lines = text.split(' • ');
  } else if (text.includes('•')) {
    lines = text.split('•');
  } else {
    lines = [text];
  }
  return lines
    .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);
}

export function formatWeightBadge(weightStr: string): string {
  if (!weightStr) return '50g';
  let cleaned = weightStr
    .replace(/^ទម្ងន់សុទ្ធ\s*\/\s*NET\s*WT:?\s*/i, '')
    .replace(/^NET\s*WT:?\s*/i, '')
    .replace(/^ទម្ងន់សុទ្ធ:?\s*/i, '')
    .trim();
  if (cleaned.includes('(ក្រាម)')) {
    cleaned = cleaned.replace(/\s*\(ក្រាម\)/g, '').trim();
  }
  return cleaned || '50g';
}

export const cleanKhmerIngredients = (text: string): string => {
  if (!text) return '';
  let cleaned = text
    .replace(/\(([a-zA-Z\s]+)\s*(\d+%?)\)/g, '($2)')
    .replace(/\/\s*([a-zA-Z\s0-9%]+)/g, '')
    .replace(/\(([a-zA-Z\s]+)\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  cleaned = cleaned.replace(/\b(\d+)\s*%/g, (_, n) => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    const khN = n.split('').map((d: string) => khmerDigits[Number(d)] || d).join('');
    return `${khN}%`;
  });

  return cleaned;
};

export const cleanKhmerAllergen = (text: string): string => {
  if (!text) return '';
  return text.split('/')[0].trim();
};

export const cleanKhmerAddress = (addr: string): string => {
  if (!addr) return '';
  return addr
    .replace(/,\s*Cambodia/gi, ', កម្ពុជា')
    .replace(/,\s*Kingdom of Cambodia/gi, ', ព្រះរាជាណាចក្រកម្ពុជា');
};

export const formatWeightBadgeKhmer = (weightStr: string): string => {
  if (!weightStr) return '១០០ ក្រាម';
  let cleaned = formatWeightBadge(weightStr)
    .replace(/\(.*?\)/g, '')
    .replace(/℮/g, '')
    .trim();
  return cleaned || '១០០ ក្រាម';
};

export interface PackagingLabelDesignerProps {
  isMistiMode?: boolean;
  userPhone?: string;
  userName?: string;
  userTitle?: string;
  onOpenGreeting?: () => void;
}

export default function PackagingLabelDesigner({
  isMistiMode = false,
  userPhone,
  userName,
  userTitle,
  onOpenGreeting
}: PackagingLabelDesignerProps = {}) {
  // Studio Display Mode: 'wizard' (13-step guided screen by screen) vs 'classic' (advanced technical layout)
  const [studioMode, setStudioMode] = useState<'wizard' | 'classic'>('wizard');
  const [wizardCurrentStep, setWizardCurrentStep] = useState<number>(1);
  const [activeDedicatedItem, setActiveDedicatedItem] = useState<QuickQRItem | null>(null);

  // Contact phone and address details state
  const [contactPhone, setContactPhone] = useState<string>(() => {
    return userPhone || (typeof window !== 'undefined' ? localStorage.getItem('cashewtrace_user_phone') : '') || '+855 88 771 2862';
  });
  const [addressDetails, setAddressDetails] = useState<string>('ផ្លូវជាតិលេខ ៦ ភូមិត្រពាំងឫស្សី ស្រុកកំពង់ស្វាយ');

  useEffect(() => {
    if (userPhone) {
      setContactPhone(userPhone);
    }
  }, [userPhone]);

  // Active Preset Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('cashew-powder-200g');
  const activePreset = PRODUCT_PRESETS.find(p => p.id === selectedPresetId) || PRODUCT_PRESETS[0];

  // Container Type & Form Factor
  const [containerType, setContainerType] = useState<ContainerType>(activePreset.containerType);

  // Active Tab View in Preview
  const [previewTab, setPreviewTab] = useState<'3d-container' | 'wrap-label' | 'lid-sticker' | 'micro-label-sheet' | 'shelf-life-guide' | 'buyer-dossier' | 'window-pouch-50g' | 'jar-banner-100g'>('jar-banner-100g');

  // Accessible Voice-First Simplified Mode (Default for all users, low-literacy friendly)
  const [isSimplifiedMode, setIsSimplifiedMode] = useState<boolean>(false);

  // Accessible Voice Command Handler
  const handleVoiceCommand = (spokenText: string) => {
    const s = spokenText.toLowerCase();

    // 1. Switch product by voice
    if (s.includes('ស្វាយ') || s.includes('mango')) {
      const p = PRODUCT_PRESETS.find(pr => pr.id.includes('mango') || pr.nameKhmerDefault.includes('ស្វាយ'));
      if (p) handlePresetSelect(p);
    } else if (s.includes('ទឹកឃ្មុំ') || s.includes('honey')) {
      const p = PRODUCT_PRESETS.find(pr => pr.id.includes('honey'));
      if (p) handlePresetSelect(p);
    } else if (s.includes('តុងយ៉ាំ') || s.includes('tom yum') || s.includes('ហឹរ')) {
      const p = PRODUCT_PRESETS.find(pr => pr.id.includes('tom-yum'));
      if (p) handlePresetSelect(p);
    } else if (s.includes('ម្រេច') || s.includes('pepper')) {
      const p = PRODUCT_PRESETS.find(pr => pr.id.includes('pepper'));
      if (p) handlePresetSelect(p);
    } else if (s.includes('ម្សៅ') || s.includes('powder')) {
      const p = PRODUCT_PRESETS.find(pr => pr.id.includes('powder'));
      if (p) handlePresetSelect(p);
    } else if (s.includes('ចន្ទី') || s.includes('cashew') || s.includes('លីង')) {
      const p = PRODUCT_PRESETS[0];
      if (p) handlePresetSelect(p);
    }

    // 2. Change weights by voice
    if (s.includes('៥០') || s.includes('50g') || s.includes('50 ក្រាម')) {
      setNetWeight('50g (ក្រាម)');
    } else if (s.includes('១០០') || s.includes('100g') || s.includes('100 ក្រាម')) {
      setNetWeight('100g (ក្រាម)');
    } else if (s.includes('២០០') || s.includes('200g') || s.includes('200 ក្រាម')) {
      setNetWeight('200g (ក្រាម)');
    } else if (s.includes('២៥០') || s.includes('250g') || s.includes('250 ក្រាម')) {
      setNetWeight('250g (ក្រាម)');
    } else if (s.includes('៥០០') || s.includes('500g') || s.includes('500 ក្រាម')) {
      setNetWeight('500g (ក្រាម)');
    } else if (s.includes('១គីឡូ') || s.includes('1kg')) {
      setNetWeight('1kg (គីឡូក្រាម)');
    }

    // 3. Expiry dates by voice
    if (s.includes('៦ខែ') || s.includes('6 months')) {
      handleApplyShelfLife(6);
    } else if (s.includes('១២ខែ') || s.includes('12 months') || s.includes('១ឆ្នាំ')) {
      handleApplyShelfLife(12);
    } else if (s.includes('១៨ខែ') || s.includes('18 months')) {
      handleApplyShelfLife(18);
    } else if (s.includes('២៤ខែ') || s.includes('24 months') || s.includes('២ឆ្នាំ')) {
      handleApplyShelfLife(24);
    }

    // 4. Print by voice
    if (s.includes('បោះពុម្ព') || s.includes('print')) {
      handlePrint();
    }
  };

  const handleReadLabelAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      triggerToast('ឧបករណ៍របស់អ្នកមិនគាំទ្រមុខងារអានជាសំឡេងទេ (Text-to-speech not supported on this browser)');
      return;
    }

    if (isSpeakingAudio || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeakingAudio(false);
      triggerToast('បានបញ្ឈប់ការអានសំឡេង (Stopped audio reading)');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      let voices = window.speechSynthesis.getVoices();
      const khmerVoice = voices.find(v => 
        v.lang.toLowerCase().includes('km') || 
        v.name.toLowerCase().includes('khmer') || 
        v.name.toLowerCase().includes('cambodia')
      );

      const hasKhmerVoice = Boolean(khmerVoice);
      const textKhmer = `ស្លាកសញ្ញាស្តង់ដារជាតិ CS 001៖ ${productNameKhmer}។ ឈ្មោះអង់គ្លេស៖ ${productNameEnglish}។ ទម្ងន់សុទ្ធ៖ ${netWeight}។ ផលិតនៅកម្ពុជា។ ផលិតនៅថ្ងៃទី៖ ${mfdDate}។ ផុតកំណត់នៅថ្ងៃទី៖ ${expDate}។ រក្សាទុកបាន ${shelfLifeMonths} ខែ។`;
      const textEnglish = `Cambodia Standard CS 001 Product Label: ${productNameEnglish}. Net weight: ${netWeight}. Origin: Made in Cambodia. Manufactured date: ${mfdDate}. Expiry date: ${expDate}. Shelf life: ${shelfLifeMonths} months. Ingredients: ${ingredientsList}. Lot: ${lotNumber}.`;

      const textToSpeak = hasKhmerVoice ? textKhmer : textEnglish;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      if (hasKhmerVoice && khmerVoice) {
        utterance.voice = khmerVoice;
        utterance.lang = 'km-KH';
      } else {
        const engVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (engVoice) utterance.voice = engVoice;
        utterance.lang = 'en-US';
      }

      utterance.rate = 0.95;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeakingAudio(true);
        triggerToast(hasKhmerVoice ? '🔊 កំពុងអានព័ត៌មានស្លាកជាសំឡេង... (Playing Khmer audio...)' : '🔊 កំពុងអានព័ត៌មានស្លាកជាភាសាអង់គ្លេស (Reading specifications aloud...)');
      };
      utterance.onend = () => {
        setIsSpeakingAudio(false);
      };
      utterance.onerror = (e) => {
        console.warn('Speech error:', e);
        setIsSpeakingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
      setIsSpeakingAudio(false);
      triggerToast('មិនអាចចាក់សំឡេងបានទេ (Could not play audio)');
    }
  };

  // SME Multiple Custom Products Catalog (Local + Saved)
  const [smeCatalog, setSmeCatalog] = useState<ProductPreset[]>(() => {
    const saved = localStorage.getItem('cashewtrace_sme_custom_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((item: ProductPreset) => {
            const kh = (item.nameKhmerDefault || '').toLowerCase();
            const ing = (item.defaultIngredients || '').toLowerCase();
            return !(
              kh.includes('ដកប្រេង') ||
              ing.includes('ដកប្រេង') ||
              ing.includes('0.05%') ||
              kh.includes('លីងម្រេចខ្មៅកំពត gi yas 5%') ||
              kh.includes('គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរ (ww180')
            );
          });
          return cleaned;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Saved Custom Net Weights & Volumes (allows MSMEs to type e.g. 12g, 18g, 75g and remember permanently)
  const [customSavedWeights, setCustomSavedWeights] = useState<string[]>(() => {
    const saved = localStorage.getItem('cashewtrace_custom_weights');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['12 g ℮ (Net Wt. 0.42 oz)', '18 g ℮ (Net Wt. 0.63 oz)', '75 g ℮ (Net Wt. 2.65 oz)'];
  });

  const handleSaveCustomWeight = (weightStr: string) => {
    if (!weightStr || !weightStr.trim()) return;
    const clean = weightStr.trim();
    if (!customSavedWeights.includes(clean)) {
      const updated = [clean, ...customSavedWeights].slice(0, 20);
      setCustomSavedWeights(updated);
      localStorage.setItem('cashewtrace_custom_weights', JSON.stringify(updated));
    }
  };

  const handleRemoveCustomWeight = (weightStr: string) => {
    const updated = customSavedWeights.filter(w => w !== weightStr);
    setCustomSavedWeights(updated);
    localStorage.setItem('cashewtrace_custom_weights', JSON.stringify(updated));
  };

  const [activeSmeProfile, setActiveSmeProfile] = useState<RegisteredSmeRecord | null>(null);

  // Label Form Fields (CS 001:2000 Compliant)
  const [productNameKhmer, setProductNameKhmer] = useState<string>(() => 
    ensureKhmerProductName(activePreset.nameKhmerDefault, activePreset.nameEnglishDefault)
  );
  const [productNameEnglish, setProductNameEnglish] = useState<string>(activePreset.nameEnglishDefault);
  const [subheadingOrBotanical, setSubheadingOrBotanical] = useState<string>(activePreset.botanicalOrSubtext);
  const [netWeight, setNetWeight] = useState<string>(activePreset.defaultNetWeight);
  const [ingredientsList, setIngredientsList] = useState<string>(cleanseSupplierStringsFromIngredients(activePreset.defaultIngredients));
  const [allergenBox, setAllergenBox] = useState<string>(activePreset.allergenAdvice);
  const [mayContainTraces, setMayContainTraces] = useState<string>(activePreset.mayContainTraces);
  const [storageInstructions, setStorageInstructions] = useState<string>(activePreset.storageInstructions);
  const [instructionsForUse, setInstructionsForUse] = useState<string>(() => {
    const raw = activePreset.instructionsForUse || '';
    const isFlourCheck = activePreset.id.includes('powder') || activePreset.id.includes('flour') || activePreset.nameEnglishDefault.toLowerCase().includes('flour') || activePreset.nameKhmerDefault.includes('ម្សៅ');
    return cleanKhmerUsageOnly(raw, isFlourCheck);
  });
  const [productDescription, setProductDescription] = useState<string>(activePreset.productDescriptionKhmer || '');
  const [healthBenefits, setHealthBenefits] = useState<string>(activePreset.healthBenefitsKhmer || '');
  const [companyName, setCompanyName] = useState<string>('Mayany Enterprise');
  const [companyAddress, setCompanyAddress] = useState<string>('ផ្លូវជាតិលេខ ៦, ភូមិត្រពាំងឫស្សី, ឃុំត្រពាំងឫស្សី, ស្រុកកំពង់ស្វាយ, ខេត្តកំពង់ធំ');
  
  // Structured Address States (with dropdown + custom text support)
  const [useStructuredAddress, setUseStructuredAddress] = useState<boolean>(true);
  const [addressHouse, setAddressHouse] = useState<string>('ផ្ទះលេខ ៤៨');
  const [addressStreet, setAddressStreet] = useState<string>('ផ្លូវជាតិលេខ ៦');
  const [addressGroup, setAddressGroup] = useState<string>('ក្រុមទី ០៣');
  const [addressVillage, setAddressVillage] = useState<string>('ភូមិត្រពាំងឫស្សី');
  const [addressCommune, setAddressCommune] = useState<string>('ឃុំត្រពាំងឫស្សី');
  const [addressDistrict, setAddressDistrict] = useState<string>('ស្រុកកំពង់ស្វាយ');
  const [addressProvince, setAddressProvince] = useState<string>('កំពង់ធំ');

  const [countryOfOrigin, setCountryOfOrigin] = useState<string>('🇰🇭 ផលិតនៅកម្ពុជា');
  const [lotNumber, setLotNumber] = useState<string>('WW-PEP-050');
  
  // Date Marking Scheme (Domestic CS 001 + International Export Schemes: Codex, EU, USA, Japan, Korea, China, Aus, GSO)
  const [dateMarkingScheme, setDateMarkingScheme] = useState<DateMarkingScheme>('cs001_standard');
  const [mfdDate, setMfdDate] = useState<string>('');
  const [pkdDate, setPkdDate] = useState<string>('');
  const [bbdDate, setBbdDate] = useState<string>('');
  const [expDate, setExpDate] = useState<string>('');
  const [shelfLifeMonths, setShelfLifeMonths] = useState<number>(activePreset.shelfLifeMonths || 6);
  const [showExportDateGuide, setShowExportDateGuide] = useState<boolean>(false);

  const handleApplyShelfLife = (months: number) => {
    setShelfLifeMonths(months);
    if (mfdDate.trim()) {
      const calculated = calculateDateWithMonths(mfdDate, months);
      setExpDate(calculated);
      setBbdDate(calculated);
    }
  };

  const handleMfdChange = (newMfd: string) => {
    setMfdDate(newMfd);
    if (!newMfd.trim()) {
      setExpDate('');
      setBbdDate('');
    } else if (shelfLifeMonths > 0) {
      const calculated = calculateDateWithMonths(newMfd, shelfLifeMonths);
      setExpDate(calculated);
      setBbdDate(calculated);
    }
  };

  const [registrationMark, setRegistrationMark] = useState<string>('ISC CS 001:2000 / MISTI #KH-78921');
  const [requiresRefrigeration, setRequiresRefrigeration] = useState<boolean>(activePreset.requiresRefrigeration);
  const [trademarkLogoText, setTrademarkLogoText] = useState<string>('MAYANY • CASHEWTRACE');
  const [ean13Code, setEan13Code] = useState<string>(activePreset.ean13Default);
  const [includeBarcodeOnCertificate, setIncludeBarcodeOnCertificate] = useState<boolean>(true);
  const [isCertSpeaking, setIsCertSpeaking] = useState<boolean>(false);
  const [isCertPaused, setIsCertPaused] = useState<boolean>(false);
  const [passportFullUrl, setPassportFullUrl] = useState<string>('');
  const [heroBadges, setHeroBadges] = useState<string[]>(activePreset.heroBadges);
  const [culinaryRecipes, setCulinaryRecipes] = useState<string[]>(activePreset.culinaryRecipes);

  // Standard Certifications (GHP, GMP, HACCP, CS, ISO, Halal, GI, Organic)
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([
    'cs-mark',
    'ghp-cambodia',
    'gmp-cambodia',
    'haccp-cambodia'
  ]);
  const [packagingSymbols, setPackagingSymbols] = useState<string[]>([
    'recycle',
    'anti_drug',
    'food_grade',
    'no_chemicals',
    'support_khmer'
  ]);
  const [customCertNumber, setCustomCertNumber] = useState<string>('ISC-CS-001-2000 / MISTI-2026');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([
    'Mirarth Agri Tech Co., Ltd.',
    'Angkor Sugar (ស្ករសចម្រាញ់សុទ្ធ)',
    'BOH Co., Ltd. (ម្រេចខ្មៅកំពត GI)',
    'Ngov Heng (អំបិលសមុទ្រកំពត)'
  ]);

  // Eco Recycle Badge and Packaging Material Code
  const [selectedRecycle, setSelectedRecycle] = useState<string>('pp-05');
  const [showRecycleBadge, setShowRecycleBadge] = useState<boolean>(true);

  // Social Responsibility & National Campaigns Slogan
  const [selectedSlogan, setSelectedSlogan] = useState<string>('anti_drug');
  const [customSloganText, setCustomSloganText] = useState<string>('ចូលរួមទាំងអស់គ្នាដើម្បីជីវិត និងសហគមន៍គ្មានគ្រឿងញៀន! (Say No to Drugs)');
  const [showSocialSlogan, setShowSocialSlogan] = useState<boolean>(true);

  // Quick Spice & INS Addon Dropdown State
  const [selectedSpiceDropdown, setSelectedSpiceDropdown] = useState<string>('');

  const handleToggleCertification = (certId: string) => {
    setSelectedCertifications(prev => 
      prev.includes(certId) ? prev.filter(c => c !== certId) : [...prev, certId]
    );
  };

  // Multi-Ingredient Selector and Formula Builder States
  const [ingredientFormulaMode, setIngredientFormulaMode] = useState<'append' | 'replace'>('append');
  const [ingredientActiveCategory, setIngredientActiveCategory] = useState<string>('all');
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState<string>('');
  const [showIngredientMatrix, setShowIngredientMatrix] = useState<boolean>(true);

  // Catalog View Mode: 'dropdowns' (per-category clean dropdowns) or 'compact' or 'all'
  const [catalogViewMode, setCatalogViewMode] = useState<'dropdowns' | 'search' | 'matrix' | 'dropdown' | 'grid'>('dropdowns');

  const handleDropdownSelectIngredient = (item: IndividualIngredientItem) => {
    if (!item) return;
    const rawKhmer = item.nameKh.replace(/\s*\([^)]*\)/g, '').trim();
    const newEntry = cleanIngredientsToKhmerOnly(item.displayText || `${rawKhmer} ${item.defaultPercent}%`);
    
    if (ingredientFormulaMode === 'replace' || ingredientsList.trim().length === 0) {
      setIngredientsList(newEntry);
      return;
    }

    const mergeResult = addOrMergeIngredientToList(ingredientsList, {
      nameKh: rawKhmer,
      nameEn: item.nameEn,
      percent: item.defaultPercent
    });

    setIngredientsList(cleanIngredientsToKhmerOnly(mergeResult.updatedList));
  };

  const handleToggleIndividualIngredient = (item: IndividualIngredientItem) => {
    const rawKhmer = item.nameKh.replace(/\s*\([^)]*\)/g, '').trim();
    const newEntry = cleanIngredientsToKhmerOnly(item.displayText || `${rawKhmer} ${item.defaultPercent}%`);
    const cleanKh = rawKhmer.replace(/[0-9០-៩.%()（）\s]+/g, '').trim().toLowerCase();
    const cleanEn = item.nameEn.replace(/[0-9.%()（）\s]+/g, '').trim().toLowerCase();

    const parts = ingredientsList.split(/[,،]+/).map(p => p.trim()).filter(Boolean);
    const existingIdx = parts.findIndex(p => {
      const pLower = p.toLowerCase();
      return pLower === newEntry.toLowerCase() ||
             (cleanKh.length >= 4 && pLower.includes(cleanKh)) ||
             (cleanEn.length >= 4 && pLower.includes(cleanEn));
    });

    if (existingIdx !== -1) {
      parts.splice(existingIdx, 1);
      setIngredientsList(parts.join(', '));
    } else {
      if (ingredientFormulaMode === 'replace' || ingredientsList.trim().length === 0) {
        setIngredientsList(newEntry);
      } else {
        setIngredientsList(`${ingredientsList.trim()}, ${newEntry}`);
      }
    }
  };

  const handleRemoveIngredientChip = (rawChunk: string) => {
    const parts = ingredientsList.split(/[,،]+/).map(p => p.trim()).filter(Boolean);
    const filtered = parts.filter(p => p !== rawChunk);
    setIngredientsList(filtered.join(', '));
  };

  const handleSortDescendingCS001 = () => {
    const parts = ingredientsList.split(/[,،]+/).map(p => p.trim()).filter(Boolean);
    if (parts.length <= 1) return;

    // Helper to extract numeric percentage
    const parsePercent = (str: string): number => {
      const match = str.match(/(\d+(?:\.\d+)?)\s*%/);
      if (match) return parseFloat(match[1]);
      // Khmer numbers support
      const khmerDigits: Record<string, string> = { '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4', '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9' };
      const converted = str.replace(/[០-៩]/g, d => khmerDigits[d] || d);
      const khMatch = converted.match(/(\d+(?:\.\d+)?)\s*%/);
      return khMatch ? parseFloat(khMatch[1]) : 0;
    };

    const sorted = [...parts].sort((a, b) => parsePercent(b) - parsePercent(a));
    setIngredientsList(sorted.join(', '));
  };

  const handleApplyPresetFormula = (formulaVal: string) => {
    if (!formulaVal) return;
    if (ingredientFormulaMode === 'replace' || ingredientsList.trim().length === 0) {
      setIngredientsList(formulaVal);
    } else {
      setIngredientsList(`${ingredientsList.trim()}, ${formulaVal}`);
    }
  };

  // Sync structured address to single string for packaging labels
  const updateCombinedAddress = (
    house = addressHouse,
    street = addressStreet,
    group = addressGroup,
    village = addressVillage,
    commune = addressCommune,
    district = addressDistrict,
    province = addressProvince
  ) => {
    const parts = [house, street, group, village, commune, district, province].filter(p => p && p.trim().length > 0);
    const combined = parts.join(', ');
    setCompanyAddress(combined);
  };

  const handleAddressPresetSelect = (presetAddress: StandardAddress) => {
    setAddressHouse(presetAddress.houseNumber);
    setAddressStreet(presetAddress.streetNumber);
    setAddressGroup(presetAddress.groupNumber);
    setAddressVillage(presetAddress.village);
    setAddressCommune(presetAddress.commune);
    setAddressDistrict(presetAddress.district);
    setAddressProvince(presetAddress.province);
    updateCombinedAddress(
      presetAddress.houseNumber,
      presetAddress.streetNumber,
      presetAddress.groupNumber,
      presetAddress.village,
      presetAddress.commune,
      presetAddress.district,
      presetAddress.province
    );
  };

  // Shelf-Life & Barrier Tech Engineering State
  const [barrierType, setBarrierType] = useState<string>('induction-foil'); // 'induction-foil' | 'nitrogen-flush' | 'desiccant' | 'none'
  const [hasOxygenAbsorber, setHasOxygenAbsorber] = useState<boolean>(true);

  // Nutrition Facts State & Dual-Mode Calculation
  const [nutrition, setNutrition] = useState<NutritionFacts>(activePreset.typicalNutrition);
  const [nutritionMode, setNutritionMode] = useState<'general_calc' | 'lab_tested'>('general_calc');

  // QR Code Data URL
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Voice Interaction State
  const [isListening, setIsListening] = useState<string | null>(null);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');
  const [voiceWizardStep, setVoiceWizardStep] = useState<number | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

  // SME Brand Logo State & File Upload
  const [customBrandLogo, setCustomBrandLogo] = useState<string>(() => {
    return localStorage.getItem('cashewtrace_sme_brand_logo') || '/mayany_official_logo.jpg';
  });
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('សូមជ្រើសរើសឯកសាររូបភាព Logo (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomBrandLogo(result);
        localStorage.setItem('cashewtrace_sme_brand_logo', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setCustomBrandLogo('/mayany_official_logo.jpg');
    localStorage.removeItem('cashewtrace_sme_brand_logo');
  };

  const handleDownloadLogo = () => {
    const link = document.createElement('a');
    link.href = customBrandLogo;
    link.download = customBrandLogo.startsWith('data:') ? 'SME_Brand_Logo.png' : 'Mayany_Enterprise_Official_Logo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Label Visual Theme
  const [labelTheme, setLabelTheme] = useState<'supermarket-clean' | 'artisan-kraft' | 'premium-black' | 'modern-green'>('supermarket-clean');
  const [labelPreviewFormat, setLabelPreviewFormat] = useState<'dual-band-pouch' | 'pet-jar' | 'standard'>('pet-jar');
  const [jarLabelStyle, setJarLabelStyle] = useState<'direct-print' | 'horizontal' | 'vertical'>('direct-print');
  const [pouchColor, setPouchColor] = useState<'black' | 'white' | 'kraft'>('black');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [stampDatesOnBag, setStampDatesOnBag] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showEnlargedQr, setShowEnlargedQr] = useState<boolean>(false);
  const [certificateLanguage, setCertificateLanguage] = useState<string>('km');
  const [showPrinterHeaderModal, setShowPrinterHeaderModal] = useState<boolean>(false);
  const [showFtcModal, setShowFtcModal] = useState<boolean>(false);
  const [mayanyGrade, setMayanyGrade] = useState<KernelGrade>('WW180');
  const [mayanyFlavor, setMayanyFlavor] = useState<FlavorType>('pepper-5');
  const [mayanyPackaging, setMayanyPackaging] = useState<PackagingFormat>('pouch-50g');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleUpdateMayanyMatrix = (grade: KernelGrade, flavor: FlavorType, packaging: PackagingFormat) => {
    setMayanyGrade(grade);
    setMayanyFlavor(flavor);
    setMayanyPackaging(packaging);

    const gradeTitleEn = grade === 'WW180' ? 'WW180 Jumbo Wholes' : grade === 'WS' ? 'WS White Splits' : 'LSP Large Pieces';

    let nameKh = '';
    let nameEn = '';
    let ingredients = '';
    const allergen = 'CONTAINS: TREE NUTS (CASHEW) / ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី';

    if (flavor === 'flour') {
      nameKh = 'ម្សៅគ្រាប់ស្វាយចន្ទី';
      nameEn = '100% Pure Cashew Kernel Flour';
      ingredients = 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០% • គ្មានបន្ថែមអំបិល គ្មានស្ករ គ្មានសារធាតុរក្សាទុក គ្មានបន្ថែមក្លិន គ្មានបន្ថែមពណ៌';
      const weightVal = packaging === 'pouch-50g' ? '50g' : packaging === 'jar-100g' ? '100g' : packaging === 'jar-150g' ? '150g' : '200g';
      setNetWeight(weightVal);
      setContainerType(packaging === 'pouch-50g' ? 'standup-pouch-50g' : 'pp-jar-200g');
      setSubheadingOrBotanical('100% Pure Cashew Kernel Flour (Anacardium occidentale)\n100% Natural, Grain-Free & Plant-Based');
      setAllergenBox('ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី');
      setProductDescription('ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ រាល់ដំណាក់កាលនៃការផលិតត្រូវបានយកចិត្តទុកដាក់ និងសម្រិតសម្រាំង ដើម្បីរក្សាបាននូវគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមគោលការណ៍សុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី。\n\nម្សៅគ្រាប់ស្វាយចន្ទីមានផ្ទុកប្រូតេអ៊ីន រួមជាមួយសារធាតុរ៉ែ និងសារធាតុចិញ្ចឹមជាច្រើន។ វាអាចប្រើប្រាស់ជាគ្រឿងផ្សំសម្រាប់ធ្វើនំ ភេសជ្ជៈ កាហ្វេ អាហារប្រចាំថ្ងៃ និងមុខម្ហូបផ្សេងៗ។ វាក៏អាចប្រើជាជម្រើសគ្រឿងផ្សំដែលមិនមែនជាផលិតផលទឹកដោះគោ សម្រាប់អ្នកដែលចៀសវាងផលិតផលទឹកដោះគោ ឬជ្រើសរើសអាហារដែលមានប្រភពពីរុក្ខជាតិ។');
      setHealthBenefits('• ប្រូតេអ៊ីនពីរុក្ខជាតិ: គ្រាប់ស្វាយចន្ទីមានផ្ទុកប្រូតេអ៊ីន ដែលជាសារធាតុចិញ្ចឹមសំខាន់សម្រាប់រាងកាយ និងការថែរក្សាសាច់ដុំ。\n• ខ្លាញ់មិនឆ្អែត: គ្រាប់ស្វាយចន្ទីមានខ្លាញ់មិនឆ្អែតជាចម្បង ដែលជាផ្នែកមួយនៃរបបអាហារដែលមានតុល្យភាព。\n• ម៉ាញេស្យូម: ជាសារធាតុរ៉ែដែលរាងកាយត្រូវការសម្រាប់មុខងារសាច់ដុំ ប្រព័ន្ធប្រសាទ ឆ្អឹង និងការបង្កើតថាមពល。\n• ទង់ដែង ស័ង្កសី និងជាតិដែក: ជាសារធាតុរ៉ែសំខាន់ៗដែលចូលរួមក្នុងមុខងារផ្សេងៗរបស់រាងកាយ ដូចជា ប្រព័ន្ធភាពស៊ាំ ការបង្កើតកោសិកាឈាមក្រហម និងការរំលាយអាហារ。\n• ផូស្វ័រ: ជួយគាំទ្រមុខងារធម្មតារបស់ឆ្អឹង និងធ្មេញ ព្រមទាំងដំណើរការផលិតថាមពលរបស់រាងកាយ。\n• វីតាមីន និងសារធាតុប្រឆាំងអុកស៊ីតកម្ម: គ្រាប់ស្វាយចន្ទីមានផ្ទុកវីតាមីន និងសារធាតុប្រឆាំងអុកស៊ីតកម្មមួយចំនួន ដែលចូលរួមក្នុងការគាំទ្រសុខភាព និងការការពារកោសិកា。\n• គ្មានផលិតផលទឹកដោះគោ និងគ្មានជាតិឡាក់តូស: ម្សៅគ្រាប់ស្វាយចន្ទីជាផលិតផលពីរុក្ខជាតិ និងមិនមានការបន្ថែមផលិតផលទឹកដោះគោ ឬឡាក់តូស。\n• ប្រើប្រាស់បានច្រើនមុខ: អាចយកទៅប្រើក្នុងការធ្វើនំ ភេសជ្ជៈ កាហ្វេ ទឹកជ្រលក់ ស៊ុប និងការចម្អិនម្ហូបអាហារប្រចាំថ្ងៃ។');
      setInstructionsForUse('ម្សៅអាហារបំប៉នសុខភាព៖ ប្រើ ២ ស្លាបព្រាបាយលាយជាមួយភេសជ្ជៈ ទឹកក្រឡុក បបរ ឬឆុងទឹកក្តៅផឹកភ្លាមៗ។');
      setStorageInstructions('រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម.');
      setShelfLifeMonths(18);
      setEan13Code('8842120005093');
      setNutrition({
        energyKcal: '580',
        energyKj: '2426',
        totalFat: '43.8',
        saturatedFat: '7.8',
        transFat: '0.0',
        cholesterol: '0',
        sodium: '12',
        totalCarb: '30.1',
        dietaryFiber: '3.3',
        totalSugars: '5.9',
        addedSugars: '0.0',
        protein: '18.2',
        salt: '0.03'
      });
      const pkgLabelKh = packaging === 'pouch-50g' ? 'កញ្ចប់ 50g' : packaging === 'jar-100g' ? 'ក្រឡ 100g' : packaging === 'jar-150g' ? 'ក្រឡ 150g' : 'ក្រឡ 200g';
      triggerToast(`✓ បានកំណត់មុខទំនិញ៖ ម្សៅគ្រាប់ស្វាយចន្ទី ១០០% • ${pkgLabelKh}`);
      return;
    }

    if (flavor === 'pepper-5') {
      nameKh = `គ្រាប់ស្វាយចន្ទីលីងម្រេចខ្មៅកំពត GI YAS 5% (${grade})`;
      nameEn = `GI YAS Kampot Black Pepper 5% Coated Cashews (${gradeTitleEn})`;
      ingredients = `គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៣% (${grade}), ម្រេចខ្មៅកំពត GI YAS ៥%, អំបិលសមុទ្រកំពត ២%`;
    } else if (flavor === 'pepper-3') {
      nameKh = `គ្រាប់ស្វាយចន្ទីលីងម្រេចខ្មៅកំពត GI YAS 3% សម្រាប់កុមារ (${grade})`;
      nameEn = `Mild GI YAS Kampot Black Pepper 3% Coated Cashews for Kids (${gradeTitleEn})`;
      ingredients = `គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៥% (${grade}), ម្រេចខ្មៅកំពត GI YAS ៣%, អំបិលសមុទ្រកំពត ២%`;
    } else if (flavor === 'sugar') {
      nameKh = `គ្រាប់ស្វាយចន្ទីស្រោបស្ករធម្មជាតិ (${grade})`;
      nameEn = `Artisanal Sugar Glazed Roasted Cashews (${gradeTitleEn})`;
      ingredients = `គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩០% (${grade}), ស្ករត្នោតធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%`;
    } else {
      nameKh = `គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរ (${grade})`;
      nameEn = `Crispy Spicy Chili Coated Roasted Cashews (${gradeTitleEn})`;
      ingredients = `គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩២% (${grade}), ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%`;
    }

    setProductNameKhmer(nameKh);
    setProductNameEnglish(nameEn);
    setIngredientsList(ingredients);
    setAllergenBox(allergen);
    setSubheadingOrBotanical(`Selected Cambodian Cashews (Anacardium occidentale • Grade ${grade})\nArtisanal Cambodian Coated Series`);

    if (packaging === 'pouch-50g') {
      setNetWeight('50g');
      setContainerType('standup-pouch-50g');
    } else if (packaging === 'jar-100g') {
      setNetWeight('100g');
      setContainerType('spice-jar-100g');
    } else if (packaging === 'jar-200g') {
      setNetWeight('200g');
      setContainerType('pp-jar-200g');
    } else {
      setNetWeight('150g');
      setContainerType('pp-tub-150g');
    }

    const flavorLabelKh = flavor === 'pepper-5' ? 'ម្រេចកំពត 5% (អ្នកធំ)' : flavor === 'pepper-3' ? 'ម្រេចកំពត 3% (កុមារ)' : flavor === 'sugar' ? 'ស្រោបស្ករ' : 'ស្រោបម្ទេស';
    const pkgLabelKh = packaging === 'pouch-50g' ? 'កញ្ចប់ 50g' : packaging === 'jar-100g' ? 'ក្រឡ 100g' : packaging === 'jar-150g' ? 'ក្រឡ 150g' : 'ក្រឡ 200g';
    triggerToast(`✓ បានកំណត់មុខទំនិញ៖ ${grade} • ${flavorLabelKh} • ${pkgLabelKh}`);
  };
  const [downloadedModalImage, setDownloadedModalImage] = useState<{ url: string; filename: string } | null>(null);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string>('');

  // When Preset Changes, update fields
  const handlePresetSelect = (preset: ProductPreset) => {
    setSelectedPresetId(preset.id);
    setContainerType(preset.containerType);
    setProductNameKhmer(ensureKhmerProductName(preset.nameKhmerDefault, preset.nameEnglishDefault));
    setProductNameEnglish(preset.nameEnglishDefault);
    setSubheadingOrBotanical(preset.botanicalOrSubtext);
    setNetWeight(preset.defaultNetWeight);
    setIngredientsList(cleanIngredientsToKhmerOnly(preset.defaultIngredients));
    setAllergenBox(cleanKhmerAllergenOnly(preset.allergenAdvice));
    setMayContainTraces(cleanKhmerAllergenOnly(preset.mayContainTraces));
    setStorageInstructions(cleanKhmerStorageOnly(preset.storageInstructions));
    const isPresetFlour = preset.id.includes('powder') || preset.id.includes('flour') || preset.nameEnglishDefault.toLowerCase().includes('flour') || preset.nameKhmerDefault.includes('ម្សៅ');
    setInstructionsForUse(cleanKhmerUsageOnly(preset.instructionsForUse, isPresetFlour));
    setProductDescription(preset.productDescriptionKhmer || '');
    setHealthBenefits(preset.healthBenefitsKhmer || '');
    setRequiresRefrigeration(preset.requiresRefrigeration);
    setNutrition(preset.typicalNutrition);
    setHeroBadges(preset.heroBadges);
    setCulinaryRecipes(preset.culinaryRecipes);
    setEan13Code(preset.ean13Default);
    setShelfLifeMonths(preset.shelfLifeMonths);
    setBarrierType(preset.id === 'cashew-roasted-250g' ? 'nitrogen-flush' : 'induction-foil');
    setHasOxygenAbsorber(true);

    // Sync flavor and dedicated suppliers to prevent pepper showing on chili/sugar products
    const isChiliPreset = preset.id.includes('chili') || preset.nameEnglishDefault.toLowerCase().includes('chili') || preset.nameKhmerDefault.includes('ម្ទេស');
    const isPepperPreset = preset.id.includes('pepper') || preset.nameEnglishDefault.toLowerCase().includes('pepper') || preset.nameKhmerDefault.includes('ម្រេច');
    const isSugarPreset = preset.id.includes('sugar') || preset.nameEnglishDefault.toLowerCase().includes('sugar') || preset.nameKhmerDefault.includes('ស្ករ');

    if (isChiliPreset) {
      setMayanyFlavor('chili');
      setSelectedSuppliers(['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng']);
      if (!lotNumber || lotNumber.startsWith('2026-CK') || lotNumber === '2026-CKP-261' || lotNumber === 'LOT-2026-KT-0816' || lotNumber.startsWith('LOT-2026-KT-WW180-')) {
        setLotNumber('WW-CHI-050');
      }
    } else if (isSugarPreset) {
      setMayanyFlavor('sugar');
      setSelectedSuppliers(['Mirarth Agri Tech Co., Ltd.', 'Angkor Sugar', 'Ngov Heng']);
      if (!lotNumber || lotNumber.startsWith('2026-CK') || lotNumber === '2026-CKP-261' || lotNumber === 'LOT-2026-KT-0816' || lotNumber.startsWith('LOT-2026-KT-WW180-')) {
        setLotNumber('WW-SUG-050');
      }
    } else if (isPresetFlour) {
      setMayanyFlavor('flour');
      setSelectedSuppliers(['Mayany Enterprise', 'Mirarth Agri Tech Co., Ltd.']);
      if (!lotNumber || lotNumber.startsWith('2026-CK') || lotNumber === '2026-CKP-261' || lotNumber === 'LOT-2026-KT-0816' || lotNumber.startsWith('LOT-2026-KT-WW180-')) {
        setLotNumber('LOT-2026-KT-FLOUR-200');
      }
    } else if (isPepperPreset) {
      setMayanyFlavor('pepper-5');
      setSelectedSuppliers(['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng']);
      if (!lotNumber || lotNumber.startsWith('2026-CK') || lotNumber === 'LOT-2026-KT-0816' || lotNumber.startsWith('LOT-2026-KT-WW180-')) {
        setLotNumber('WW-PEP-050');
      }
    }
  };

  // Quick Apply from Pitch Deck & Print Shop Bar
  const handleQuickApply = (preset: ProductPreset, customLot?: string, customWeight?: string) => {
    handlePresetSelect(preset);
    if (customLot) setLotNumber(customLot);
    if (customWeight) setNetWeight(customWeight);
  };

  // Dedicated 13-Stage Editor for QR Code Products already sent to print shop
  const handleEditDedicatedProductIn13Stages = (item: QuickQRItem, targetStep: number = 1) => {
    setActiveDedicatedItem(item);
    setStudioMode('wizard');
    setWizardCurrentStep(targetStep);

    let preset = PRODUCT_PRESETS.find(p => p.id === item.presetId);
    if (!preset) {
      preset = PRODUCT_PRESETS.find(p => p.id.includes(item.flavor)) || PRODUCT_PRESETS[0];
    }
    if (preset) {
      handlePresetSelect(preset);
    }

    // Set matrix flavor to match the dedicated product
    if (item.flavor === 'chili') setMayanyFlavor('chili');
    else if (item.flavor === 'sugar') setMayanyFlavor('sugar');
    else if (item.flavor === 'pure_flour') setMayanyFlavor('flour');
    else if (item.flavor.includes('pepper')) setMayanyFlavor('pepper-5');

    // Try reading cached snapshot for any customized fields saved previously
    let cachedSnap: any = null;
    try {
      const stored = (item.id && localStorage.getItem(`cashewtrace_passport_${item.id}`)) ||
                     (item.productNumber && localStorage.getItem(`cashewtrace_passport_prod_${item.productNumber}`)) ||
                     (item.batch && item.weight && localStorage.getItem(`cashewtrace_passport_${item.batch}_${item.weight.replace(/\s+/g, '')}`)) ||
                     (item.presetId && localStorage.getItem(`cashewtrace_passport_${item.presetId}`));
      if (stored) {
        const parsed = JSON.parse(stored);
        const targetW = (item.weight || '').toLowerCase().replace(/\s+/g, '');
        const snapW = (parsed.weight || '').toLowerCase().replace(/\s+/g, '');
        if (!targetW || !snapW || targetW === snapW) {
          cachedSnap = parsed;
        }
      }
    } catch {
      // ignore
    }

    // Guard against cross-product weight & barcode pollution (e.g. 50g pouch getting 175g jar barcode)
    let resolvedWeight = item.weight || '50g';
    let resolvedBarcode = item.ean13 || '';
    let resolvedBatch = item.batch || '';

    if (cachedSnap?.weight && (!item.weight || cachedSnap.weight.toLowerCase().replace(/\s+/g, '') === item.weight.toLowerCase().replace(/\s+/g, ''))) {
      resolvedWeight = cachedSnap.weight;
      if (cachedSnap.ean13) resolvedBarcode = cachedSnap.ean13;
      if (cachedSnap.batch) resolvedBatch = cachedSnap.batch;
    }

    // Specific protection for Product 3: Sugar 50g Pouch vs Product 6: Sugar 175g Jar
    if (
      item.id === 'ww180-sugar-pouch-50g' || 
      item.productNumber === 3 || 
      item.presetId === 'mayany-ww180-sugar' ||
      (item.flavor === 'sugar' && (item.categoryGroup === 'pouch' || (item.weight && item.weight.includes('50'))))
    ) {
      if (resolvedWeight.includes('175') || resolvedWeight.includes('200') || resolvedBarcode === '8847116350122' || resolvedBatch.includes('175') || resolvedBatch.includes('261j')) {
        resolvedWeight = '50g';
        resolvedBarcode = '8847116350023';
        resolvedBatch = item.batch || '2026-cks-261';
      }
    }
    // Specific protection for Product 2: Pepper 50g Pouch vs Product 5: Pepper 175g Jar
    if (
      item.id === 'pepper-pouch-50g' || 
      item.productNumber === 2 || 
      item.presetId === 'mayany-ww180-pepper-5' ||
      (item.flavor === 'pepper' && (item.categoryGroup === 'pouch' || (item.weight && item.weight.includes('50'))))
    ) {
      if (resolvedWeight.includes('175') || resolvedWeight.includes('200') || resolvedBarcode === '8847116350115' || resolvedBatch.includes('175') || resolvedBatch.includes('261j')) {
        resolvedWeight = '50g';
        resolvedBarcode = '8847116350016';
        resolvedBatch = item.batch || '2026-ckp-261';
      }
    }
    // Specific protection for Product 4: Chili 50g Pouch vs Product 7: Chili 175g Jar
    if (
      item.id === 'ww180-chili-pouch-50g' || 
      item.productNumber === 4 || 
      item.presetId === 'mayany-ww180-chili' ||
      (item.flavor === 'chili' && (item.categoryGroup === 'pouch' || (item.weight && item.weight.includes('50'))))
    ) {
      if (resolvedWeight.includes('175') || resolvedWeight.includes('200') || resolvedBarcode === '8847116350139' || resolvedBatch.includes('175') || resolvedBatch.includes('261j')) {
        resolvedWeight = '50g';
        resolvedBarcode = '8847116350078';
        resolvedBatch = item.batch || '2026-ckc-261';
      }
    }
    // Specific protection for Product 6: Sugar 175g Jar vs Product 3: Sugar 50g Pouch
    if (
      item.id === 'ww180-sugar-jar-175g' || 
      item.productNumber === 2 || 
      item.productNumber === 6 || 
      item.presetId === 'mayany-ww180-sugar-jar-175g' ||
      (item.flavor === 'sugar' && (item.categoryGroup === 'jar' || (item.weight && item.weight.includes('175'))))
    ) {
      if (resolvedWeight.includes('50') || resolvedBarcode === '8847116350023' || (resolvedBatch.includes('261') && !resolvedBatch.includes('261j')) || resolvedBatch.includes('050')) {
        resolvedWeight = '175g';
        resolvedBarcode = '8847116350085';
        resolvedBatch = item.batch || '2026-cks-261j';
      } else {
        resolvedBarcode = '8847116350085';
      }
    }
    // Specific protection for Pepper 175g Jar vs Pepper 50g Pouch
    if (
      item.id === 'ww180-pepper-jar-175g' || 
      item.productNumber === 4 || 
      item.productNumber === 5 || 
      item.presetId === 'mayany-ww180-pepper-jar-175g' ||
      (item.flavor === 'pepper' && (item.categoryGroup === 'jar' || (item.weight && item.weight.includes('175'))))
    ) {
      if (resolvedWeight.includes('50') || resolvedBarcode === '8847116350016' || (resolvedBatch.includes('261') && !resolvedBatch.includes('261j')) || resolvedBatch.includes('050')) {
        resolvedWeight = '175g';
        resolvedBarcode = '8847116350061';
        resolvedBatch = item.batch || '2026-ckp-261j';
      } else {
        resolvedBarcode = '8847116350061';
      }
    }
    // Specific protection for Chili 175g Jar vs Chili 50g Pouch
    if (
      item.id === 'ww180-chili-jar-175g' || 
      item.productNumber === 6 || 
      item.productNumber === 7 || 
      item.presetId === 'mayany-ww180-chili-jar-175g' ||
      (item.flavor === 'chili' && (item.categoryGroup === 'jar' || (item.weight && item.weight.includes('175'))))
    ) {
      if (resolvedWeight.includes('50') || resolvedBarcode === '8847116350078' || resolvedBarcode === '8847116350030' || (resolvedBatch.includes('261') && !resolvedBatch.includes('261j')) || resolvedBatch.includes('050')) {
        resolvedWeight = '175g';
        resolvedBarcode = '8847116350092';
        resolvedBatch = item.batch || '2026-ckc-261j';
      } else {
        resolvedBarcode = '8847116350092';
      }
    }
    // Specific protection for Product 1: Pure Cashew Flour 200g Jar
    if (
      item.id === 'flour-jar-200g' ||
      item.productNumber === 1 ||
      item.presetId === 'cashew-powder-200g' ||
      item.flavor === 'pure_flour'
    ) {
      resolvedWeight = '200g';
      resolvedBarcode = '8847116350047';
      if (!resolvedBatch || resolvedBatch.includes('261') || resolvedBatch.includes('050') || resolvedBatch.includes('175')) {
        resolvedBatch = item.batch || 'LOT-PENDING';
      }
    }
    // Specific protection for Cashew Milk 1L Bottle
    if (
      item.id === 'cashew-milk-1l' ||
      item.productNumber === 9 ||
      item.productNumber === 11 ||
      item.presetId === 'cashew-milk-1l' ||
      item.flavor === 'cashew_milk'
    ) {
      resolvedWeight = item.weight || '1L';
      resolvedBarcode = '8847116350054';
      if (!resolvedBatch || resolvedBatch.includes('261') || resolvedBatch.includes('050') || resolvedBatch.includes('175')) {
        resolvedBatch = item.batch || 'MTO-CM-1L';
      }
    }

    setProductNameKhmer(cachedSnap?.nameKh || item.nameKh || ensureKhmerProductName(activePreset.nameKhmerDefault, item.nameEn));
    setProductNameEnglish(cachedSnap?.product || item.nameEn || '');
    setLotNumber(resolvedBatch);
    if (resolvedBarcode) setEan13Code(resolvedBarcode);
    setNetWeight(resolvedWeight);
    const effectiveIng = cachedSnap?.customIngredients || cachedSnap?.ingredients || item.ingredientsKh || '';
    setIngredientsList(cleanIngredientsToKhmerOnly(effectiveIng));
    setShelfLifeMonths(cachedSnap?.shelfLifeMonths || item.shelfLifeMonths || 6);
    if (cachedSnap?.storage || item.storage) setStorageInstructions(cleanKhmerStorageOnly(cachedSnap?.storage || item.storage));
    if (cachedSnap?.allergen || item.allergen) setAllergenBox(cleanKhmerAllergenOnly(cachedSnap?.allergen || item.allergen));
    if (cachedSnap?.description || cachedSnap?.productDescription || item.description) {
      setProductDescription(cachedSnap?.description || cachedSnap?.productDescription || item.description);
    }
    if (cachedSnap?.healthBenefits || item.healthBenefits) {
      setHealthBenefits(cachedSnap?.healthBenefits || item.healthBenefits);
    }
    if (cachedSnap?.instructionsForUse || item.instructionsForUse) {
      setInstructionsForUse(cachedSnap?.instructionsForUse || item.instructionsForUse);
    }
    if (cachedSnap?.botanical || cachedSnap?.subheadingOrBotanical || item.subheadingOrBotanical) {
      setSubheadingOrBotanical(cachedSnap?.botanical || cachedSnap?.subheadingOrBotanical || item.subheadingOrBotanical);
    }
    if (cachedSnap && cachedSnap.mfd !== undefined) {
      setMfdDate(cachedSnap.mfd);
    } else {
      setMfdDate(item.mfd || '');
    }
    if (cachedSnap && cachedSnap.exp !== undefined) {
      setExpDate(cachedSnap.exp);
    } else {
      setExpDate(item.exp || '');
    }
    if (cachedSnap && cachedSnap.stampDatesOnBag !== undefined) {
      setStampDatesOnBag(cachedSnap.stampDatesOnBag);
    } else {
      setStampDatesOnBag(item.stampDatesOnBag ?? false);
    }
    let resolvedSupps = cachedSnap?.selectedSuppliers || item.selectedSuppliers || (
      item.flavor === 'chili'
        ? ['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng']
        : item.flavor === 'sugar'
        ? ['Mirarth Agri Tech Co., Ltd.', 'Angkor Sugar', 'Ngov Heng']
        : item.flavor === 'pure_flour'
        ? ['Mayany Enterprise', 'Mirarth Agri Tech Co., Ltd.']
        : ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng']
    );
    // Guarantee Angkor Sugar is present for pepper & sugar
    if ((item.flavor === 'pepper' || item.flavor === 'sugar') && !resolvedSupps.some(s => s.toLowerCase().includes('angkor') || s.includes('ស្ករ'))) {
      resolvedSupps = [...resolvedSupps, 'Angkor Sugar'];
    }
    setSelectedSuppliers(resolvedSupps);
    if (cachedSnap?.nutrition || item.nutrition) {
      const nut = cachedSnap?.nutrition || item.nutrition;
      setNutrition(prev => ({
        ...prev,
        ...nut,
        transFat: nut.transFat || prev.transFat || '0',
        energyKj: nut.energyKj || prev.energyKj || '0'
      }));
    }
    if (item.presetId) setSelectedPresetId(item.presetId);
    setContainerType(cachedSnap?.containerType || item.containerType || (item.weight.includes('200') || item.weight.includes('175') ? 'pp-jar-200g' : 'standup-pouch-50g'));

    setTimeout(() => {
      const el = document.getElementById('packaging-step-wizard-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    triggerToast(`✓ បានបើកផ្ទាំង ១៣ ជំហានសម្រាប់ «${item.nameKh}» (${item.batch}) — លោកអ្នកអាចកែប្រែទិន្នន័យ ឬពិនិត្យគ្រប់ជំហានទាំង ១៣!`);
  };

  // Sync state automatically when dedicated products are updated from QuickQRs modal or external components
  useEffect(() => {
    const handleDedicatedUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<QuickQRItem>;
      if (!customEvt.detail) return;
      const item = customEvt.detail;

      // Check if this update corresponds to the active product being edited
      if (item.batch === lotNumber || item.id === activeDedicatedItem?.id || item.presetId === selectedPresetId || item.nameEn === productNameEnglish) {
        if (item.nameKh) setProductNameKhmer(item.nameKh);
        if (item.nameEn) setProductNameEnglish(item.nameEn);
        if (item.ingredientsKh) setIngredientsList(item.ingredientsKh);
        if (item.weight) setNetWeight(item.weight);
        if (item.batch) setLotNumber(item.batch);
        if (item.ean13) setEan13Code(item.ean13);
        if (item.selectedSuppliers) setSelectedSuppliers(item.selectedSuppliers);
        if (item.flavor === 'chili') setMayanyFlavor('chili');
        else if (item.flavor === 'sugar') setMayanyFlavor('sugar');
        else if (item.flavor === 'pure_flour') setMayanyFlavor('flour');
        else if (item.flavor.includes('pepper')) setMayanyFlavor('pepper-5');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('cashewtrace_dedicated_updated', handleDedicatedUpdate);
      return () => window.removeEventListener('cashewtrace_dedicated_updated', handleDedicatedUpdate);
    }
  }, [lotNumber, activeDedicatedItem, selectedPresetId, productNameEnglish]);

  // Save changes made in 13-stage wizard back to the dedicated product & Firestore & localStorage
  const handleSaveDedicatedProductUpdate = async (): Promise<boolean> => {
    // Inferred flavor if not explicit - prioritize chili to avoid accidental pepper classification
    let resolvedFlavor = activeDedicatedItem?.flavor || 'natural';
    const normName = `${productNameEnglish} ${productNameKhmer} ${selectedPresetId}`.toLowerCase();
    if (normName.includes('chili') || normName.includes('ម្ទេស')) resolvedFlavor = 'chili';
    else if (normName.includes('pepper') || normName.includes('ម្រេច')) resolvedFlavor = 'pepper';
    else if (normName.includes('sugar') || normName.includes('ស្ករ')) resolvedFlavor = 'sugar';
    else if (normName.includes('flour') || normName.includes('ម្សៅ') || normName.includes('powder')) resolvedFlavor = 'pure_flour';

    // Resolve dedicated product id and batch accurately with distinct SKU lots
    let defaultId = 'pepper-pouch-50g';
    let defaultBatch = '2026-CKP-050';
    if (selectedPresetId.includes('broken')) {
      defaultId = 'broken-pepper-pouch-50g';
      defaultBatch = 'LOT-2026-KT-BB-PEP-50';
    } else if (resolvedFlavor === 'chili' || selectedPresetId.includes('chili')) {
      const isJar = netWeight.includes('175') || containerType === 'pp-jar-200g' || selectedPresetId.includes('jar');
      defaultId = isJar ? 'ww180-chili-jar-175g' : 'ww180-chili-pouch-50g';
      defaultBatch = isJar ? '2026-CKC-175' : '2026-CKC-050';
    } else if (resolvedFlavor === 'sugar' || selectedPresetId.includes('sugar')) {
      const isJar = netWeight.includes('175') || containerType === 'pp-jar-200g' || selectedPresetId.includes('jar');
      defaultId = isJar ? 'ww180-sugar-jar-175g' : 'ww180-sugar-pouch-50g';
      defaultBatch = isJar ? '2026-CKS-175' : '2026-CKS-050';
    } else if (resolvedFlavor === 'pure_flour' || selectedPresetId.includes('flour')) {
      defaultId = 'cashew-powder-200g';
      defaultBatch = 'LOT-2026-KT-FLOUR-200';
    } else if (resolvedFlavor === 'cashew_milk' || selectedPresetId.includes('milk') || normName.includes('milk') || normName.includes('ទឹកដោះ')) {
      defaultId = 'cashew-milk-1l';
      defaultBatch = 'MTO-CM-1L';
    } else if (selectedPresetId.includes('ww180') || resolvedFlavor === 'pepper') {
      const isJar = netWeight.includes('175') || containerType === 'pp-jar-200g';
      defaultId = isJar ? 'ww180-pepper-jar-175g' : 'pepper-pouch-50g';
      defaultBatch = isJar ? '2026-CKP-175' : '2026-CKP-050';
    }

    let cleanLot = (lotNumber || activeDedicatedItem?.batch || defaultBatch).trim();
    const resolvedId = activeDedicatedItem?.id || defaultId;

    const formattedBarcode = ean13Code.trim() 
      ? formatEan13(ean13Code) 
      : (activeDedicatedItem?.ean13 || (
          resolvedId === 'cashew-milk-1l' ? '8847116350054' :
          resolvedId === 'flour-jar-200g' ? '8847116350047' :
          resolvedId === 'ww180-sugar-jar-175g' ? '8847116350085' :
          resolvedId === 'ww180-pepper-jar-175g' ? '8847116350061' :
          resolvedId === 'ww180-chili-jar-175g' ? '8847116350092' :
          resolvedId === 'bb-pepper-pouch-50g' ? '8847116350108' :
          resolvedFlavor === 'chili' ? '8847116350078' :
          resolvedFlavor === 'sugar' ? '8847116350023' : '8847116350016'
        ));

    // Filter suppliers so chili products never retain black pepper supplier (BOH Co., Ltd.)
    let cleanSuppliers = (selectedSuppliers && selectedSuppliers.length > 0)
      ? selectedSuppliers.filter(s => resolvedFlavor === 'chili' ? (!s.includes('BOH') && !s.includes('ម្រេច') && !s.toLowerCase().includes('pepper')) : true)
      : (resolvedFlavor === 'chili'
          ? ['Mirarth Agri Tech Co., Ltd.', 'Ringacam Enterprise', 'Ngov Heng']
          : ['Mirarth Agri Tech Co., Ltd.', 'BOH Co., Ltd.', 'Angkor Sugar', 'Ngov Heng']);

    // If product is pepper or sugar, or user selected sugar, ensure Angkor Sugar is preserved
    if ((resolvedFlavor === 'pepper' || resolvedFlavor === 'sugar' || ingredientsList.includes('ស្ករ') || ingredientsList.toLowerCase().includes('sugar') || (selectedSuppliers && selectedSuppliers.some(s => s.toLowerCase().includes('angkor') || s.toLowerCase().includes('sugar') || s.includes('ស្ករ')))) && !cleanSuppliers.some(s => s.toLowerCase().includes('angkor') || s.includes('ស្ករ'))) {
      cleanSuppliers = [...cleanSuppliers, 'Angkor Sugar'];
    }

    const updatedItem: QuickQRItem = {
      id: resolvedId,
      productNumber: activeDedicatedItem?.productNumber,
      nameKh: ensureKhmerProductName(productNameKhmer.trim() || activeDedicatedItem?.nameKh || activePreset.nameKhmerDefault, productNameEnglish),
      nameEn: productNameEnglish.trim() || activeDedicatedItem?.nameEn || 'Cashew Product',
      batch: cleanLot,
      ean13: formattedBarcode,
      weight: netWeight.trim() || activeDedicatedItem?.weight || '50g',
      flavor: resolvedFlavor,
      presetId: activeDedicatedItem?.presetId || selectedPresetId,
      ingredientsKh: ingredientsList.trim() || activeDedicatedItem?.ingredientsKh || '',
      tagKh: activeDedicatedItem?.tagKh || (resolvedFlavor === 'chili' ? 'WW180 ស្រោបម្ទេស' : 'ស្តង់ដារ CS 001'),
      tagColor: activeDedicatedItem?.tagColor || (resolvedFlavor === 'chili' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'),
      icon: activeDedicatedItem?.icon || (resolvedFlavor === 'chili' ? '🌶️' : '🫘'),
      shelfLifeMonths: shelfLifeMonths || activeDedicatedItem?.shelfLifeMonths || 6,
      mfd: mfdDate !== undefined ? mfdDate : (activeDedicatedItem?.mfd || ''),
      exp: expDate !== undefined ? expDate : (activeDedicatedItem?.exp || ''),
      stampDatesOnBag: stampDatesOnBag,
      storage: storageInstructions.trim() || activeDedicatedItem?.storage || '',
      allergen: allergenBox.trim() || activeDedicatedItem?.allergen || '',
      description: productDescription.trim() || activeDedicatedItem?.description || '',
      healthBenefits: healthBenefits.trim() || (activeDedicatedItem as any)?.healthBenefits || '',
      instructionsForUse: instructionsForUse.trim() || (activeDedicatedItem as any)?.instructionsForUse || '',
      subheadingOrBotanical: subheadingOrBotanical.trim() || (activeDedicatedItem as any)?.subheadingOrBotanical || '',
      grade: activeDedicatedItem?.grade || (selectedPresetId.includes('broken') ? 'WS / Broken' : 'WW180'),
      packageFormat: activeDedicatedItem?.packageFormat || (containerType === 'pp-jar-200g' ? '200g Clear Food-Grade Jar' : '50g Standing Pouch'),
      containerType: containerType || activeDedicatedItem?.containerType || 'standup-pouch-50g',
      categoryGroup: activeDedicatedItem?.categoryGroup || (selectedPresetId.includes('broken') ? 'broken' : selectedPresetId.includes('ww180') ? 'ww180' : 'sample'),
      selectedSuppliers: cleanSuppliers,
      packagingSymbols: packagingSymbols || activeDedicatedItem?.packagingSymbols || [],
      companyName: companyName || activeDedicatedItem?.companyName || 'Mayany Enterprise',
      companyAddress: companyAddress || activeDedicatedItem?.companyAddress || 'កំពង់ធំ, កម្ពុជា',
      nutrition: nutrition || activeDedicatedItem?.nutrition
    };

    setActiveDedicatedItem(updatedItem);

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
      description: updatedItem.description,
      productDescription: updatedItem.description,
      healthBenefits: updatedItem.healthBenefits,
      instructionsForUse: updatedItem.instructionsForUse,
      botanical: updatedItem.subheadingOrBotanical,
      subheadingOrBotanical: updatedItem.subheadingOrBotanical,
      grade: updatedItem.grade,
      packageFormat: updatedItem.packageFormat,
      containerType: updatedItem.containerType,
      categoryGroup: updatedItem.categoryGroup,
      selectedSuppliers: updatedItem.selectedSuppliers,
      packagingSymbols: updatedItem.packagingSymbols,
      company: companyName || 'Mayany Enterprise',
      origin: companyAddress || 'Kingdom of Cambodia (កម្ពុជា)',
      nutrition: updatedItem.nutrition,
      updatedAt: new Date().toISOString()
    };

    // 1. Update localStorage dedicated products across all versions (v6, v5, v4 and v2)
    try {
      const raw6 = localStorage.getItem('cashewtrace_dedicated_products_v6');
      const raw5 = localStorage.getItem('cashewtrace_dedicated_products_v5');
      const raw4 = localStorage.getItem('cashewtrace_dedicated_products_v4');
      const raw2 = localStorage.getItem('cashewtrace_dedicated_products_v2');
      let list: QuickQRItem[] = raw6 ? JSON.parse(raw6) : (raw5 ? JSON.parse(raw5) : (raw4 ? JSON.parse(raw4) : (raw2 ? JSON.parse(raw2) : DEFAULT_DEDICATED_PRODUCTS)));
      
      let matched = false;
      list = list.map(p => {
        const isTarget = p.id === updatedItem.id || 
                         (updatedItem.id === 'ww180-pepper-pouch-50g' && p.id === 'pepper-pouch-50g') ||
                         (updatedItem.id === 'pepper-pouch-50g' && p.id === 'ww180-pepper-pouch-50g') ||
                         (updatedItem.productNumber && p.productNumber === updatedItem.productNumber);
        if (isTarget) {
          matched = true;
          return {
            ...p,
            ...updatedItem,
            id: p.id,
            productNumber: p.productNumber || updatedItem.productNumber
          };
        }
        return p;
      });
      if (!matched) {
        list.push(updatedItem);
      }
      localStorage.setItem('cashewtrace_dedicated_products_v6', JSON.stringify(list));
      localStorage.setItem('cashewtrace_dedicated_products_v5', JSON.stringify(list));
      localStorage.setItem('cashewtrace_dedicated_products_v4', JSON.stringify(list));
      localStorage.setItem('cashewtrace_dedicated_products_v2', JSON.stringify(list));

      localStorage.setItem(`cashewtrace_passport_${updatedItem.id}`, JSON.stringify(fullPassportSnapshot));
      if (updatedItem.productNumber) {
        localStorage.setItem(`cashewtrace_passport_prod_${updatedItem.productNumber}`, JSON.stringify(fullPassportSnapshot));
      }
      localStorage.setItem(`cashewtrace_passport_${updatedItem.presetId}`, JSON.stringify(fullPassportSnapshot));
      localStorage.setItem(`cashewtrace_passport_${updatedItem.batch}_${updatedItem.weight.replace(/\s+/g, '')}`, JSON.stringify(fullPassportSnapshot));
      localStorage.setItem(`cashewtrace_passport_${updatedItem.batch}`, JSON.stringify(fullPassportSnapshot));
      localStorage.setItem('cashewtrace_latest_passport', JSON.stringify(fullPassportSnapshot));

      // Sync custom SME catalog in localStorage
      const currentCustomCatalog = list.map(p => ({
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
      console.warn('LocalStorage save error', e);
    }

    // 2. Write to Cloud Firestore
    try {
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

    // 3. Dispatch event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cashewtrace_dedicated_updated', { detail: updatedItem }));
    }

    triggerToast(`✓ បានធ្វើបច្ចុប្បន្នភាពទិន្នន័យទាំង ១៣ ជំហានលើ QR Code រោងពុម្ព (${cleanLot}) និង Cloud ជោគជ័យ!`);
    return true;
  };

  const handleReturnToQuickQrs = () => {
    const el = document.getElementById('pitch-deck-quick-qrs-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickOpenPassport = (url: string) => {
    const searchStr = url.split('?')[1] || '';
    window.location.href = `/?${searchStr}`;
  };

  // Generate high-readability, low-density QR Code pointing directly to Certificate & Passport
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const cleanLot = (lotNumber || 'LOT-2026-KT-0816').trim();
    const batchParam = encodeURIComponent(cleanLot);
    const prodParam = encodeURIComponent(productNameEnglish || 'Cashew Kernel');
    const wtParam = encodeURIComponent(netWeight || '50g');

    // Generate persistent, deterministic product key linked directly to Product Name and Net Weight
    const userDefinedName = (productNameEnglish || '').trim() || (productNameKhmer || '').trim();
    const rawProdIdentifier = userDefinedName
      ? userDefinedName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
      : (activePreset?.id || 'mayany-cashew-product');
    const cleanWeightSlug = (netWeight || '50g').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanProductSlug = rawProdIdentifier || 'mayany-cashew-product';
    const productKey = `prod_${cleanProductSlug}_${cleanWeightSlug}`;

    // Determine flavor first from user's custom product names or lot number
    let flavorCode = 'natural';
    const lowerEn = (productNameEnglish || '').toLowerCase();
    const lowerKh = (productNameKhmer || '').toLowerCase();
    const isChili = lowerEn.includes('chili') || lowerKh.includes('ម្ទេស') || cleanLot.includes('CHL') || cleanLot.includes('CKC');
    const isPepper = lowerEn.includes('pepper') || lowerKh.includes('ម្រេច') || cleanLot.includes('PEP');
    const isSugar = lowerEn.includes('sugar') || lowerKh.includes('ស្ករ') || cleanLot.includes('SUG');
    const isHoney = lowerEn.includes('honey') || lowerKh.includes('ឃ្មុំ');
    const isTomYum = lowerEn.includes('tom yum') || lowerKh.includes('tomyum') || lowerKh.includes('តុងយ៉ាំ');
    const isRoasted = lowerEn.includes('roasted') || lowerKh.includes('លីង');

    // Flour is only true if explicitly named flour/powder AND not a seasoned kernel product
    const isFlour = !isChili && !isPepper && !isSugar && !isHoney && !isTomYum && (
      lowerEn.includes('flour') || 
      lowerEn.includes('powder') || 
      lowerKh.includes('ម្សៅ') ||
      activePreset.id.includes('flour') || 
      activePreset.id.includes('powder')
    );

    if (isFlour) {
      flavorCode = 'pure_flour';
    } else if (isChili) {
      flavorCode = 'chili';
    } else if (isPepper) {
      flavorCode = 'pepper';
    } else if (isSugar) {
      flavorCode = 'sugar';
    } else if (isHoney) {
      flavorCode = 'honey';
    } else if (isTomYum) {
      flavorCode = 'tom-yum';
    } else if (isRoasted) {
      flavorCode = 'roasted';
    }

    const effectiveMfd = stampDatesOnBag ? '' : (mfdDate?.trim() || '');
    const effectiveExp = stampDatesOnBag ? '' : (expDate?.trim() || '');

    const fullPassportSnapshot = {
      productKey: productKey,
      productSlug: cleanProductSlug,
      product: productNameEnglish || (isFlour ? '100% Pure Cashew Kernel Flour' : 'Cashew Kernel'),
      nameKh: productNameKhmer || '',
      batch: cleanLot,
      flavor: isFlour ? 'Pure Natural Flour' : (flavorCode === 'roasted' ? 'Roasted' : flavorCode),
      grade: mayanyGrade,
      cashewGrade: mayanyGrade,
      weight: netWeight || '50g',
      stampDatesOnBag: stampDatesOnBag,
      shelfLifeMonths: shelfLifeMonths || 9,
      mfd: effectiveMfd,
      exp: effectiveExp,
      company: companyName || 'Mayany Enterprise',
      origin: countryOfOrigin || 'Kingdom of Cambodia',
      ingredients: ingredientsList,
      customIngredients: ingredientsList,
      allergen: allergenBox,
      storage: storageInstructions,
      instructionsForUse: instructionsForUse,
      description: productDescription,
      healthBenefits: healthBenefits,
      botanical: subheadingOrBotanical,
      scheme: dateMarkingScheme || 'cs001_standard',
      contactPhone: contactPhone || '+855 88 771 2862',
      telegram: '+855 88 771 2862',
      whatsapp: '+855 88 771 2862',
      email: 'mayany@mayanyenterprise.com',
      website: 'mayanyenterprise.com',
      facebook: 'Mayany Enterprise',
      nutrition: nutrition,
      selectedSuppliers: selectedSuppliers,
      savedAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`cashewtrace_passport_${productKey}`, JSON.stringify(fullPassportSnapshot));
        localStorage.setItem(`cashewtrace_passport_${cleanProductSlug}`, JSON.stringify(fullPassportSnapshot));
        if (cleanLot) localStorage.setItem(`cashewtrace_passport_${cleanLot}`, JSON.stringify(fullPassportSnapshot));
        if (activePreset?.id) {
          localStorage.setItem(`cashewtrace_passport_${activePreset.id}`, JSON.stringify(fullPassportSnapshot));
          localStorage.setItem(`cashewtrace_passport_prod_${activePreset.id}`, JSON.stringify(fullPassportSnapshot));
        }
        localStorage.setItem('cashewtrace_latest_passport', JSON.stringify(fullPassportSnapshot));
      } catch (e) {
        console.warn('Could not cache passport snapshot locally:', e);
      }
    }

    // Background sync to Firestore linked directly to Product Name/Key and Lot Code
    try {
      setDoc(doc(db, 'packaging_passports', productKey), fullPassportSnapshot, { merge: true }).catch(() => {});
      setDoc(doc(db, 'packaging_passports', cleanProductSlug), fullPassportSnapshot, { merge: true }).catch(() => {});
      if (cleanLot) {
        setDoc(doc(db, 'packaging_passports', cleanLot), fullPassportSnapshot, { merge: true }).catch(() => {});
      }
      if (productNameEnglish) {
        setDoc(doc(db, 'packaging_passports', productNameEnglish), fullPassportSnapshot, { merge: true }).catch(() => {});
      }
      if (activePreset?.id) {
        setDoc(doc(db, 'packaging_passports', activePreset.id), fullPassportSnapshot, { merge: true }).catch(() => {});
        setDoc(doc(db, 'packaging_passports', `prod_${activePreset.id}`), fullPassportSnapshot, { merge: true }).catch(() => {});
      }
    } catch (e) {
      console.warn('Could not trigger Firestore sync:', e);
    }

    // Concise, high-contrast, ultra-scannable QR URL optimized for instant smartphone camera scanning
    // We intentionally exclude heavy Khmer Unicode strings from query params because
    // percent-encoded UTF-8 Khmer blows up the URL by 350+ characters, creating a dense Version 19
    // QR code with 8,600+ microscopic dots that smartphone cameras cannot focus on.
    // Instead, all full Khmer details, ingredients, nutrition, and certifications are stored
    // in Firestore and localStorage under the clean Lot / batch ID, productKey, and cleanProductSlug.
    const queryParams = new URLSearchParams();
    queryParams.set('project', 'passport');
    if (cleanLot) queryParams.set('batch', cleanLot);
    if (isChili) {
      queryParams.set('flv', 'chili');
    } else if (isPepper) {
      queryParams.set('flv', 'pepper');
    } else if (isSugar) {
      queryParams.set('flv', 'sugar');
    } else if (isFlour) {
      queryParams.set('flv', 'pure_flour');
    } else if (flavorCode && flavorCode !== 'natural') {
      queryParams.set('flv', flavorCode);
    }
    if (netWeight) {
      queryParams.set('wt', netWeight);
    }
    if (productNameEnglish) {
      queryParams.set('pname', productNameEnglish);
    }
    if (activePreset?.id) {
      queryParams.set('preset', activePreset.id);
    }
    if (ingredientsList && ingredientsList.trim() && ingredientsList.length <= 350) {
      queryParams.set('ing', ingredientsList.trim());
    }
    if (shelfLifeMonths) {
      queryParams.set('sl', String(shelfLifeMonths));
    }
    queryParams.set('view', 'certificate');

    const cleanOrigin = getPublicOrigin().replace(/\/+$/, '');
    const passportUrl = `${cleanOrigin}/?${queryParams.toString()}`;
    setPassportFullUrl(passportUrl);
    
    // Generate low-density, high-contrast QR code with large dots for 100% instant smartphone reading
    QRCode.toDataURL(passportUrl, {
      width: 1024,
      margin: 2, // 2-module clean quiet zone allows maximum dot size
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [
    lotNumber, productNameEnglish, productNameKhmer, subheadingOrBotanical, netWeight, 
    mfdDate, expDate, shelfLifeMonths, companyName, countryOfOrigin, ingredientsList, dateMarkingScheme, 
    contactPhone, nutrition, mayanyGrade, allergenBox, storageInstructions, instructionsForUse,
    productDescription, healthBenefits, activePreset
  ]);

  // Voice Recognition Web Speech API
  const handleStartListening = (fieldKey: string, setter: (val: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(fieldKey);
        setSpeechFeedback('Listening... Speak now into your microphone.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setter(transcript);
        setSpeechFeedback(`Captured: "${transcript}"`);
        setIsListening(null);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(null);
        setSpeechFeedback(`Voice recognition failed: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(null);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(null);
    }
  };

  // 1-Click AI Supermarket Ready Optimizer
  const handleAiSupermarketOptimize = () => {
    setAiGenerating(true);
    setTimeout(() => {
      if (selectedPresetId.includes('cashew-powder')) {
        setProductNameKhmer('ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% (កម្រិតម៉ដ្ឋពិសេស)');
        setProductNameEnglish('100% Pure Cambodian Cashew Flour (Powder)');
        setSubheadingOrBotanical('Superfood Bakery & Smoothie Powder • Ultra-Fine Stone Milled • Grain-Free');
        setNetWeight('200 g ℮ (Net Wt. 7.05 oz)');
        setHeroBadges(['100% Cambodian Origin', 'Grain-Free & Gluten-Free', '18g Plant Protein', 'Keto & Vegan Superfood', 'No Added Sugar / Oils']);
        setStorageInstructions('Store in a cool, dry place (< 25°C). Reseal induction inner liner after each use to prevent moisture absorption.');
        setInstructionsForUse('Add 2 tablespoons to morning smoothies, whisk into oatmeal, use 1:1 as grain-free flour for keto waffles & pancakes, or blend with warm water for fresh cashew milk.');
        setCulinaryRecipes([
          'Morning Protein Smoothie: 2 tbsp cashew powder + 1 frozen banana + 200ml plant milk.',
          'Grain-Free Cashew Pancakes: 100g cashew powder + 2 eggs + 1/2 tsp baking powder + splash of honey.'
        ]);
        setShelfLifeMonths(18);
        setBarrierType('induction-foil');
        setHasOxygenAbsorber(true);
      }
      setAiGenerating(false);
      setAiSuccessMsg('Label successfully optimized for Modern Supermarket Trade (Aeon, Lucky, Chip Mong) with 18-month shelf-life barrier!');
      setTimeout(() => setAiSuccessMsg(''), 5000);
    }, 900);
  };

  // Compliance Scoring (0-100%)
  const complianceChecks = [
    { title: '1. Product Name in Khmer (ភាសាខ្មែរ ≥ English)', status: productNameKhmer.trim().length > 3, detail: 'Mandatory primary language under CS 001:2000' },
    { title: '2. Net Contents Metric (200 g ℮ / g / kg)', status: netWeight.includes('g') || netWeight.includes('kg'), detail: 'Accurate metric declaration per Law on Metrology' },
    { title: '3. Ingredients in Descending Order of Weight', status: ingredientsList.trim().length > 5, detail: 'Discloses 100% Cashew with percentage' },
    { title: '4. Boxed Allergen Warning (Tree Nuts / Cashew)', status: allergenBox.toLowerCase().includes('cashew') || allergenBox.toLowerCase().includes('tree nuts') || allergenBox.includes('ស្វាយចន្ទី'), detail: 'Crucial for modern supermarket buyer acceptance' },
    { title: '5. Manufacturer Legal Entity & Address in Cambodia', status: companyName.length > 3 && companyAddress.length > 5, detail: 'Domestic producer accountability' },
    { title: '6. Country of Origin (Cambodia / ផលិតផលកម្ពុជា)', status: countryOfOrigin.toLowerCase().includes('cambodia') || countryOfOrigin.includes('កម្ពុជា'), detail: 'National Origin declaration' },
    { title: '7. LOT Batch Number & MFD/EXP Dates', status: lotNumber.length > 3 && mfdDate.length > 4 && expDate.length > 4, detail: 'Traceability & Shelf-life durability' },
    { title: '8. Storage & Culinary Instructions', status: storageInstructions.length > 5 && instructionsForUse.length > 5, detail: 'Protects powder against ambient humidity' },
    { title: '9. GS1 / EAN-13 Cambodia Barcode (884...)', status: ean13Code.length === 13, detail: 'Required for supermarket POS checkout scanning' },
    { title: '10. Nutrition Facts Panel per 100 g', status: Number(nutrition.energyKcal) > 0 && Number(nutrition.protein) > 0, detail: 'Full macronutrient disclosure' },
    { title: `11. Shelf-Life & Barrier Tech (${shelfLifeMonths} Months Target)`, status: (barrierType !== 'none' || hasOxygenAbsorber || shelfLifeMonths <= 6), detail: 'Barrier protection & sealing prevents moisture & rancidity' }
  ];

  const passedCount = complianceChecks.filter(c => c.status).length;
  const supermarketScore = Math.round((passedCount / complianceChecks.length) * 100);

  // Formatted EAN-13
  const formattedEan = formatEan13(ean13Code);
  const barcodeBinary = ean13ToBinary(formattedEan);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // High-Resolution Label Image Generator with Robust Multi-Tier Fallback
  const generateLabelPngDataUrl = async (el: HTMLElement): Promise<string> => {
    // Tier 1: Modern DOM-to-PNG serialization with pixel ratio 2.5
    try {
      return await toPng(el, {
        quality: 1.0,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        cacheBust: true,
        style: {
          margin: '0 auto',
        },
        filter: (node) => {
          if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.getAttribute('role') === 'toolbar')) {
            return false;
          }
          return true;
        }
      });
    } catch (err1) {
      console.warn('html-to-image standard rendering failed, retrying with skipFonts:', err1);
    }

    // Tier 2: html-to-image skipping external fonts (immune to font CORS or network restrictions)
    try {
      return await toPng(el, {
        quality: 1.0,
        pixelRatio: 2.0,
        backgroundColor: '#ffffff',
        skipFonts: true,
      });
    } catch (err2) {
      console.warn('html-to-image skipFonts failed, trying SVG foreignObject fallback:', err2);
    }

    // Tier 3: Native Canvas foreignObject rendering fallback
    const width = el.offsetWidth || 480;
    const height = el.offsetHeight || 600;
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print').forEach(n => n.remove());
    const serializedHtml = new XMLSerializer().serializeToString(clone);
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${serializedHtml}</foreignObject></svg>`;
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(svgUrl);
          resolve(canvas.toDataURL('image/png'));
        } else {
          URL.revokeObjectURL(svgUrl);
          reject(new Error('Canvas 2D context unavailable'));
        }
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(svgUrl);
        reject(e);
      };
      img.src = svgUrl;
    });
  };

  // Download Image Handler (High-Resolution PNG)
  const handleDownloadImage = async () => {
    const labelEl = document.getElementById('wizard-printable-label') || document.getElementById('printable-label-canvas');
    if (!labelEl) {
      triggerToast('រកមិនឃើញផ្ទាំងស្លាកសញ្ញា (Label element not found)');
      return;
    }

    setIsDownloading(true);
    triggerToast('⏳ កំពុងបង្កើតរូបភាពស្លាកកម្រិតច្បាស់ខ្ពស់... (Generating high-res PNG...)');

    try {
      const dataUrl = await generateLabelPngDataUrl(labelEl as HTMLElement);
      const cleanName = (productNameEnglish || productNameKhmer || 'CS001_Label').replace(/[^a-zA-Z0-9_\u1780-\u17FF]/g, '_');
      const filename = `CS001_Label_${cleanName}_${(netWeight || 'Pack').replace(/[^a-zA-Z0-9]/g, '')}.png`;

      // Trigger standard browser download via Blob Object URL
      let downloadUrl = dataUrl;
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        downloadUrl = URL.createObjectURL(blob);
      } catch (blobErr) {
        console.warn('Blob conversion fallback to dataUrl:', blobErr);
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);

      // Open interactive download & preview modal
      setDownloadedModalImage({
        url: dataUrl,
        filename,
      });

      triggerToast('✅ បានបង្កើតរូបភាពស្លាក PNG ជោគជ័យ! (Label PNG ready)');
    } catch (err) {
      console.error('Download error:', err);
      triggerToast('❌ មានបញ្ហាក្នុងការទាញយក សូមសាកល្បងម្ដងទៀត (Download failed, please try again)');
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy Dossier Summary with robust fallback
  const handleCopySummary = async () => {
    const summary = `
=====================================================
SUPERMARKET PACKAGING & REGULATORY DOSSIER (CS 001:2000)
=====================================================
Product: ${productNameEnglish} / ${productNameKhmer}
Packaging Format: ${containerType}
Net Contents: ${netWeight}
Barcode (EAN-13): ${formattedEan}
Shelf-Life: ${shelfLifeMonths} Months (Engineered with ${barrierType} + Oxygen Absorber)
Manufacturer: ${companyName}
Address: ${companyAddress}
Origin: ${countryOfOrigin}
Batch / LOT: ${lotNumber} (MFD: ${mfdDate} | EXP: ${expDate})
Ingredients: ${ingredientsList}
Allergen Statement: ${allergenBox} | ${mayContainTraces}
Storage Instructions: ${storageInstructions}
Usage Instructions: ${instructionsForUse}
Registration: ${registrationMark}

Nutrition Facts (per 100g):
- Energy: ${nutrition.energyKcal} kcal / ${nutrition.energyKj} kJ
- Total Fat: ${nutrition.totalFat}g (Saturates: ${nutrition.saturatedFat}g)
- Total Carbohydrates: ${nutrition.totalCarb}g (Sugars: ${nutrition.totalSugars}g)
- Dietary Fibre: ${nutrition.dietaryFiber}g
- Protein: ${nutrition.protein}g
- Salt: ${nutrition.salt}g (Sodium: ${nutrition.sodium}mg)

Supermarket Readiness Score: ${supermarketScore}%
Target Retailers: Aeon Mall, Lucky Supermarket, Chip Mong, Makro Cambodia, Export
=====================================================
    `.trim();

    let success = false;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(summary);
        success = true;
      } catch (err) {
        console.warn('Clipboard writeText failed, using fallback:', err);
      }
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = summary;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const res = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (res) success = true;
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
    }

    setCopiedText(true);
    triggerToast('✅ បានចម្លងព័ត៌មានស្លាកពេញលេញទៅ Clipboard! (Copied dossier)');
    setTimeout(() => setCopiedText(false), 3000);
  };

  // 12-Step Wizard Data State & Handlers
  const wizardData: PackagingWizardData = {
    customBrandLogo,
    companyName,
    productNameKhmer,
    productNameEnglish,
    subheadingOrBotanical,
    productDescription,
    healthBenefits,
    netWeight,
    containerType,
    ingredientsList,
    allergenBox,
    mfdDate,
    expDate,
    shelfLifeMonths,
    lotNumber,
    addressProvince,
    addressDetails,
    contactPhone,
    ean13Code,
    storageInstructions,
    instructionsForUse,
    selectedCertifications,
    packagingSymbols,
    stampDatesOnBag,
    nutrition,
    nutritionMode,
    selectedSuppliers
  };

  const handleWizardChange = (patch: Partial<PackagingWizardData>) => {
    if (patch.nutrition !== undefined) setNutrition(patch.nutrition);
    if (patch.nutritionMode !== undefined) setNutritionMode(patch.nutritionMode);
    if (patch.selectedSuppliers !== undefined) setSelectedSuppliers(patch.selectedSuppliers);
    if (patch.customBrandLogo !== undefined) setCustomBrandLogo(patch.customBrandLogo);
    if (patch.companyName !== undefined) {
      setCompanyName(patch.companyName);
      setTrademarkLogoText(patch.companyName.toUpperCase());
    }
    if (patch.productNameKhmer !== undefined) setProductNameKhmer(patch.productNameKhmer);
    if (patch.productNameEnglish !== undefined) setProductNameEnglish(patch.productNameEnglish);
    if (patch.subheadingOrBotanical !== undefined) setSubheadingOrBotanical(patch.subheadingOrBotanical);
    if (patch.productDescription !== undefined) setProductDescription(patch.productDescription);
    if (patch.healthBenefits !== undefined) setHealthBenefits(patch.healthBenefits);
    if (patch.netWeight !== undefined) setNetWeight(patch.netWeight);
    if (patch.containerType !== undefined) setContainerType(patch.containerType);
    if (patch.ingredientsList !== undefined) setIngredientsList(cleanseSupplierStringsFromIngredients(patch.ingredientsList));
    if (patch.allergenBox !== undefined) setAllergenBox(patch.allergenBox);
    if (patch.mfdDate !== undefined) setMfdDate(patch.mfdDate);
    if (patch.expDate !== undefined) setExpDate(patch.expDate);
    if (patch.shelfLifeMonths !== undefined) setShelfLifeMonths(patch.shelfLifeMonths);
    if (patch.lotNumber !== undefined) setLotNumber(patch.lotNumber);

    const nextProv = patch.addressProvince !== undefined ? patch.addressProvince : addressProvince;
    const nextDetails = patch.addressDetails !== undefined ? patch.addressDetails : addressDetails;

    if (patch.addressProvince !== undefined) setAddressProvince(patch.addressProvince);
    if (patch.addressDetails !== undefined) setAddressDetails(patch.addressDetails);

    if (patch.addressProvince !== undefined || patch.addressDetails !== undefined) {
      const trimmedDetails = nextDetails?.trim();
      const trimmedProv = nextProv?.trim();
      if (trimmedDetails && trimmedProv) {
        setCompanyAddress(`${trimmedDetails}, ${trimmedProv}, កម្ពុជា`);
      } else if (trimmedDetails) {
        setCompanyAddress(`${trimmedDetails}, កម្ពុជា`);
      } else if (trimmedProv) {
        setCompanyAddress(`${trimmedProv}, កម្ពុជា`);
      } else {
        setCompanyAddress('កម្ពុជា');
      }
    }

    if (patch.contactPhone !== undefined) setContactPhone(patch.contactPhone);
    if (patch.ean13Code !== undefined) setEan13Code(patch.ean13Code);
    if (patch.storageInstructions !== undefined) setStorageInstructions(patch.storageInstructions);
    if (patch.instructionsForUse !== undefined) setInstructionsForUse(patch.instructionsForUse);
    if (patch.selectedCertifications !== undefined) setSelectedCertifications(patch.selectedCertifications);
    if (patch.packagingSymbols !== undefined) setPackagingSymbols(patch.packagingSymbols);
    if (patch.stampDatesOnBag !== undefined) setStampDatesOnBag(patch.stampDatesOnBag);
  };

  const handleResetNewProduct = () => {
    setProductNameKhmer('គ្រាប់ស្វាយចន្ទីថ្មី');
    setProductNameEnglish('New Cashew Product');
    setSubheadingOrBotanical('Selected Cambodian Cashews (Anacardium occidentale)');
    setNetWeight('100 g ℮ (Net Wt. 3.5 oz)');
    setIngredientsList('គ្រាប់ស្វាយចន្ទី (Cashews 95%), អំបិលធម្មជាតិ (Natural Salt 2%), ស្ករត្នោត (Palm Sugar 3%)');
    setAllergenBox('មានផ្ទុក៖ គ្រាប់ផ្លែឈើ (ស្វាយចន្ទី) / Contains: Tree Nuts (Cashews)');
    setInstructionsForUse('អាហារសម្រន់ប្រណិត អាចទទួលទានផ្ទាល់ភ្លាមៗ ឬញ៉ាំជាមួយភេសជ្ជៈ។');
    setLotNumber(`LOT-${new Date().getFullYear()}-SME-${String(Date.now()).slice(-4)}`);
    setAiSuccessMsg('✓ បានបង្កើតផលិតផលថ្មីសម្រាប់រចនា!');
    setTimeout(() => setAiSuccessMsg(''), 3000);
  };

  const handleSaveToCatalog = () => {
    const newCustomItem: ProductPreset = {
      id: `custom_${Date.now()}`,
      name: `${productNameKhmer.slice(0, 24)} (${netWeight.split(' ')[0]} ${netWeight.split(' ')[1] || 'Pack'})`,
      category: 'SME Custom Product',
      containerType: containerType,
      nameKhmerDefault: productNameKhmer,
      nameEnglishDefault: productNameEnglish,
      botanicalOrSubtext: subheadingOrBotanical,
      productDescriptionKhmer: productDescription,
      healthBenefitsKhmer: healthBenefits,
      defaultNetWeight: netWeight,
      defaultIngredients: ingredientsList,
      allergenAdvice: allergenBox,
      mayContainTraces: mayContainTraces,
      storageInstructions: storageInstructions,
      instructionsForUse: instructionsForUse,
      requiresRefrigeration: requiresRefrigeration,
      typicalNutrition: nutrition,
      suggestedPackaging: `${containerType.toUpperCase()}`,
      regulatoryNotes: 'SME Saved Custom Formula',
      heroBadges: heroBadges,
      culinaryRecipes: culinaryRecipes,
      ean13Default: ean13Code,
      shelfLifeMonths: shelfLifeMonths,
      barrierTech: barrierType
    };

    const updatedCatalog = [newCustomItem, ...smeCatalog.filter(item => item.nameKhmerDefault !== productNameKhmer)];
    setSmeCatalog(updatedCatalog);
    localStorage.setItem('cashewtrace_sme_custom_catalog', JSON.stringify(updatedCatalog));
    triggerToast(`✓ បានរក្សាទុកមុខទំនិញ "${productNameKhmer.slice(0, 30)}" ក្នុងកាតាឡុកសហគ្រាសដោយជោគជ័យ!`);
    setAiSuccessMsg(`✓ បានរក្សាទុកមុខទំនិញ "${productNameKhmer.slice(0, 30)}" ក្នុងកាតាឡុកសហគ្រាសដោយជោគជ័យ!`);
    try {
      setDoc(doc(db, 'sme_catalogs', newCustomItem.id), newCustomItem, { merge: true }).catch(() => {});
    } catch {
      // ignore
    }
    setTimeout(() => setAiSuccessMsg(''), 4000);
  };

  const renderLiveLabelPreview = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-md p-5 sm:p-6 space-y-4 print:p-0 print:border-none print:shadow-none">
        {/* Format & Style Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3 no-print">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLabelPreviewFormat('pet-jar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                labelPreviewFormat === 'pet-jar'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🫙 កំប៉ុងជ័រ PET ២៩០ml (PET Jar)</span>
            </button>
            <button
              type="button"
              onClick={() => setLabelPreviewFormat('dual-band-pouch')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                labelPreviewFormat === 'dual-band-pouch'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🛍️ ថង់ ២កម្រាលសន្សំសំចៃ (Dual-Band Pouch)</span>
            </button>
            <button
              type="button"
              onClick={() => setLabelPreviewFormat('standard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                labelPreviewFormat === 'standard'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🏷️ ស្លាកបិទតែមួយ (Single Label)</span>
            </button>
          </div>

          {/* Sub-options for Pouch */}
          {labelPreviewFormat === 'dual-band-pouch' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <span className="text-[10px] text-slate-500 px-1">ពណ៌ថង់៖</span>
              <button
                type="button"
                onClick={() => setPouchColor('black')}
                className={`px-2 py-0.5 rounded-lg text-xs cursor-pointer ${
                  pouchColor === 'black' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                ⬛ ខ្មៅ
              </button>
              <button
                type="button"
                onClick={() => setPouchColor('white')}
                className={`px-2 py-0.5 rounded-lg text-xs cursor-pointer ${
                  pouchColor === 'white' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                ⬜ ស
              </button>
              <button
                type="button"
                onClick={() => setPouchColor('kraft')}
                className={`px-2 py-0.5 rounded-lg text-xs cursor-pointer ${
                  pouchColor === 'kraft' ? 'bg-amber-800 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                🟫 ក្រាហ្វ
              </button>
            </div>
          )}

          {/* Sub-options for PET Jar */}
          {labelPreviewFormat === 'pet-jar' && (
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setJarLabelStyle('direct-print')}
                className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer transition ${
                  jarLabelStyle === 'direct-print' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-700 hover:text-slate-950'
                }`}
                title="បោះពុម្ពទឹកថ្នាំសផ្ទាល់លើកំប៉ុង គ្មានក្រដាសស្ទីកឃ័រ"
              >
                🌱 បោះពុម្ពផ្ទាល់ (Direct Print - No Sticker)
              </button>
              <button
                type="button"
                onClick={() => setJarLabelStyle('horizontal')}
                className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer transition ${
                  jarLabelStyle === 'horizontal' ? 'bg-amber-500 text-slate-950 shadow-2xs font-black' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                ↔️ ស្លាកទទឹង (Horizontal)
              </button>
              <button
                type="button"
                onClick={() => setJarLabelStyle('vertical')}
                className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer transition ${
                  jarLabelStyle === 'vertical' ? 'bg-amber-500 text-slate-950 shadow-2xs font-black' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                ↕️ ស្លាកបណ្តោយ (Vertical)
              </button>
            </div>
          )}
        </div>

        {/* FORMAT 1: PET JAR (290ml, Ø83mm × 74mm, Clear Container) */}
        {labelPreviewFormat === 'pet-jar' ? (
          <div className="space-y-4 max-w-xl mx-auto">
            {/* Eco Impact Mission Banner for Direct Print */}
            {jarLabelStyle === 'direct-print' && (
              <div className="bg-emerald-900/95 text-white p-4 rounded-2xl border-2 border-emerald-500/50 shadow-md space-y-2 no-print">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <span>🍃</span>
                  <span>A SMALL CHANGE MAKES A BIG IMPACT</span>
                </div>
                <p className="text-[11px] text-emerald-100 leading-relaxed font-sans">
                  ការបោះពុម្ពព័ត៌មានចាំបាច់ផ្ទាល់លើកំប៉ុងជ័រ (Direct printing on jar without label sticker) ជួយ៖
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10.5px]">
                  <div className="bg-emerald-800/60 p-2 rounded-xl border border-emerald-700/50 flex items-center gap-2">
                    <span>♻️</span>
                    <span>កាត់បន្ថយកាកសំណល់ប្លាស្ទិកស្ទីកឃ័រ</span>
                  </div>
                  <div className="bg-emerald-800/60 p-2 rounded-xl border border-emerald-700/50 flex items-center gap-2">
                    <span>🌍</span>
                    <span>កាត់បន្ថយផលប៉ះពាល់បរិស្ថាន</span>
                  </div>
                  <div className="bg-emerald-800/60 p-2 rounded-xl border border-emerald-700/50 flex items-center gap-2">
                    <span>✨</span>
                    <span>ស្អាត ទំនើប និងមាននិរន្តរភាពខ្ពស់</span>
                  </div>
                </div>
                <div className="text-[10px] text-amber-300 italic font-serif pt-1 text-center sm:text-right">
                  "Good for your product. Better for our planet."
                </div>
              </div>
            )}

            {/* Simulated 3D PET Jar */}
            <div 
              id="wizard-printable-label"
              className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-300/80 bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900"
              style={{ minHeight: '430px' }}
            >
              {/* 1. Aluminum Easy-Open Lid (Canister Pull-Ring Top) */}
              <div className="relative h-12 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-400 border-b-4 border-slate-500 shadow-md flex items-center justify-between px-5">
                {/* Easy Open Pull Tab */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded-full border-2 border-slate-500 bg-slate-200 flex items-center justify-center shadow-inner">
                    <div className="w-3 h-2 rounded-full bg-slate-400/60" />
                  </div>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-slate-700 font-bold">
                    EASY-OPEN PULL TAB
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-600">
                  Ø 83 mm • 290 ml
                </span>
              </div>

              {/* 2. Transparent Jar Body with Cashews Filling Texture */}
              <div className="relative p-4 sm:p-5 flex flex-col justify-between" style={{ minHeight: '340px' }}>
                {/* Background Cashew Texture Layer */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

                {/* Floating Nut Emojis to depict crunchy pepper coated cashews */}
                <div className="absolute inset-0 flex flex-wrap items-center justify-around opacity-35 text-2xl select-none pointer-events-none p-4 overflow-hidden">
                  <span>🥜</span><span>🌰</span><span>🥜</span><span>🌰</span><span>🥜</span>
                  <span>🌰</span><span>🥜</span><span>🌰</span><span>🥜</span><span>🌰</span>
                  <span>🥜</span><span>🌰</span><span>🥜</span><span>🌰</span><span>🥜</span>
                </div>

                {/* --- A: DIRECT PRINTING ON JAR (Crisp White Screen Print) --- */}
                {jarLabelStyle === 'direct-print' && (
                  <div className="relative z-10 space-y-4 text-white">
                    {/* Top Brand & Product Header in Crisp White */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full border-2 border-amber-400/90 bg-white overflow-hidden flex items-center justify-center shrink-0 p-0.5 shadow-lg">
                        {customBrandLogo ? (
                          <img src={customBrandLogo} alt="Logo" className="w-full h-full object-contain rounded-full" />
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-[8px] font-serif uppercase tracking-tighter leading-none font-bold text-amber-900">Mayany</span>
                            <span className="text-[6px] font-sans font-black tracking-widest leading-none pt-0.5 text-amber-950">ENTERPRISE</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xs sm:text-sm font-bold font-moul tracking-normal leading-snug drop-shadow-md text-white">
                          {productNameKhmer || 'គ្រាប់ចន្ទីស្រោបម្រេចខ្មៅ'}
                        </h2>
                        <p className="text-[10.5px] sm:text-xs font-medium font-serif leading-snug text-amber-100/95 drop-shadow-xs pt-0.5">
                          {productNameEnglish || 'GI Kampot Black Pepper Coated Cashews'}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section: QR Code & Direct Print Contact Lines */}
                    <div className="flex items-center gap-4 bg-black/50 p-3 rounded-2xl border border-white/40 backdrop-blur-xs shadow-lg">
                      {qrDataUrl && (
                        <div className="bg-white p-1.5 rounded-xl shrink-0 shadow-md">
                          <img src={qrDataUrl} alt="Certificate QR" className="w-16 h-16 object-contain" />
                        </div>
                      )}
                      <div className="flex-1 text-xs space-y-1 font-sans text-white/95">
                        <div className="text-[10px] text-amber-300 font-bold truncate">
                          🏢 <strong>ផលិតដោយ ៖</strong> {companyName || 'MAYANY ENTERPRISE'}
                        </div>
                        {companyAddress && (
                          <div className="text-[9px] text-white/90 line-clamp-2 leading-tight">
                            📍 <strong>អាសយដ្ឋាន ៖</strong> {cleanKhmerAddress(companyAddress)}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[11px]">📞</span>
                          <span className="font-mono font-bold text-[11px] sm:text-xs text-amber-200">
                            {contactPhone || '+855 88 771 2862'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold">f</span>
                          <span className="font-bold text-[11px] truncate">
                            {companyName || 'Mayany Enterprise'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px]">🌐</span>
                          <span className="font-mono text-[10.5px] truncate">
                            mayanyenterprise.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- B: HORIZONTAL LABEL (Cream Sticker with Gold Border) --- */}
                {jarLabelStyle === 'horizontal' && (
                  <div className="relative z-10 my-auto bg-[#fcf7ea] text-slate-900 rounded-2xl border-2 border-[#cbb377] overflow-hidden shadow-2xl">
                    <div className="p-3.5 sm:p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        {/* Brand Logo Medallion */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-700 flex flex-col items-center justify-center text-amber-950 shrink-0 p-1 shadow-xs">
                          {customBrandLogo ? (
                            <img src={customBrandLogo} alt="Logo" className="w-10 h-10 object-contain rounded-full bg-white p-0.5" />
                          ) : (
                            <>
                              <span className="text-[8px] font-serif uppercase tracking-tighter leading-none font-bold">Mayany</span>
                              <span className="text-[6.5px] font-sans font-black tracking-widest leading-none pt-0.5">ENTERPRISE</span>
                            </>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm sm:text-base font-black text-slate-950 font-moul tracking-tight leading-snug line-clamp-1">
                            {productNameKhmer || 'គ្រាប់ចន្ទីស្រោបម្រេចខ្មៅ'}
                          </h2>
                          <p className="text-xs font-bold text-slate-800 font-serif leading-snug pt-0.5 line-clamp-1">
                            {productNameEnglish || 'GI Kampot Black Pepper Coated Cashews'}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Info Row */}
                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-amber-200">
                        {qrDataUrl && (
                          <div className="bg-white p-1 rounded-lg border border-slate-300 shrink-0">
                            <img src={qrDataUrl} alt="QR" className="w-12 h-12 object-contain" />
                          </div>
                        )}
                        <div className="flex-1 text-[10.5px] space-y-0.5 text-slate-800 font-sans">
                          {instructionsForUse?.trim() && (
                            <div className="text-[9.5px] text-amber-950 font-bold truncate">
                              🍵 {instructionsForUse}
                            </div>
                          )}
                          <div>📞 <strong className="font-mono">{contactPhone || '+855887712862'}</strong></div>
                          <div>f <strong className="truncate">{companyName || 'Mayany Enterprise'}</strong></div>
                          <div className="font-mono text-[9.5px]">mayanyenterprise.com</div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Golden Kbach Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#b38827] via-[#f7df8b] to-[#b38827]" />
                  </div>
                )}

                {/* --- C: VERTICAL LABEL (Tall Artisanal Strip) --- */}
                {jarLabelStyle === 'vertical' && (
                  <div className="relative z-10 mx-auto w-48 sm:w-52 bg-[#fcf7ea] text-slate-900 rounded-2xl border-2 border-[#cbb377] overflow-hidden shadow-2xl p-3 text-center space-y-2">
                    {/* Brand Medallion */}
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-700 flex flex-col items-center justify-center text-amber-950 p-1 shadow-xs">
                      {customBrandLogo ? (
                        <img src={customBrandLogo} alt="Logo" className="w-9 h-9 object-contain rounded-full bg-white p-0.5" />
                      ) : (
                        <span className="text-[7.5px] font-serif font-black">Mayany</span>
                      )}
                    </div>
                    {/* Titles */}
                    <div className="space-y-0.5">
                      <h2 className="text-xs sm:text-sm font-black text-slate-950 font-moul leading-snug">
                        {productNameKhmer || 'គ្រាប់ចន្ទីស្រោបម្រេចខ្មៅ'}
                      </h2>
                      <p className="text-[10px] font-bold text-slate-800 font-serif leading-tight">
                        {productNameEnglish || 'GI Kampot Black Pepper Coated Cashews'}
                      </p>
                    </div>
                    {/* QR */}
                    {qrDataUrl && (
                      <div className="inline-block bg-white p-1 rounded-lg border border-slate-300">
                        <img src={qrDataUrl} alt="QR" className="w-14 h-14 object-contain mx-auto" />
                      </div>
                    )}
                    {/* Contact details */}
                    <div className="text-[9px] space-y-0.5 text-slate-800 font-sans border-t border-amber-200 pt-1">
                      {instructionsForUse?.trim() && (
                        <div className="text-[8.5px] text-amber-950 font-bold pb-0.5 line-clamp-2">
                          🍵 {instructionsForUse}
                        </div>
                      )}
                      <div>📞 {contactPhone || '+855887712862'}</div>
                      <div>f {companyName || 'Mayany Enterprise'}</div>
                      <div className="font-mono text-[8.5px]">mayanyenterprise.com</div>
                    </div>
                  </div>
                )}

                {/* 3. Base Stamped Dates (Laser / White Inkjet Direct on PET Base) */}
                {(() => {
                  const showMfd = !stampDatesOnBag && !!mfdDate?.trim();
                  const showExp = !stampDatesOnBag && !!expDate?.trim();
                  const showLot = !!lotNumber?.trim();

                  if (!showMfd && !showExp && !showLot) return null;

                  return (
                    <div className="relative z-10 mt-4 text-center">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-black/75 border border-white/30 text-[9.5px] sm:text-[10px] font-mono text-white/95 backdrop-blur-xs shadow-md">
                        {showMfd || showExp ? (
                          <>
                            {showMfd && <span>MFG: {mfdDate}</span>}
                            {showMfd && (showExp || showLot) && <span>•</span>}
                            {showExp && <span>EXP: {expDate}</span>}
                            {showExp && showLot && <span>•</span>}
                            {showLot && <span className="text-amber-300 font-bold">LOT: {lotNumber}</span>}
                          </>
                        ) : (
                          <>
                            <span>MFG: ................</span>
                            <span>•</span>
                            <span>EXP: ................</span>
                            {showLot && <span>•</span>}
                            {showLot && <span className="text-amber-300 font-bold">LOT: {lotNumber}</span>}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Jar Bottom Base Lip */}
              <div className="h-4 bg-gradient-to-t from-slate-400 via-slate-200 to-transparent opacity-40 border-t border-white/20" />
            </div>
          </div>
        ) : labelPreviewFormat === 'dual-band-pouch' ? (
          /* FORMAT 2: DUAL-BAND ECO-POUCH (Identical to real packaging mockup) */
          <div 
            id="wizard-printable-label"
            className={`rounded-3xl border-2 p-4 sm:p-6 space-y-4 shadow-xl text-slate-900 max-w-md mx-auto transition-colors ${
              pouchColor === 'black' 
                ? 'bg-[#18181b] border-stone-800 text-white' 
                : pouchColor === 'white' 
                ? 'bg-[#f4f4f5] border-slate-300 text-slate-900' 
                : 'bg-[#a3794d] border-[#875f36] text-[#2d1b09]'
            }`}
          >
            {/* 1. Direct Pouch Laser / Inkjet Date Stamping Seal */}
            {(() => {
              const showMfd = !stampDatesOnBag && !!mfdDate?.trim();
              const showExp = !stampDatesOnBag && !!expDate?.trim();
              const showLot = !!lotNumber?.trim();

              return (
                <div className="border-b border-dashed border-white/20 pb-2.5 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/40 text-[10px] font-mono font-bold tracking-wider text-amber-300 border border-amber-500/30">
                    {showMfd || showExp ? (
                      <>
                        <span>⚡ កាលបរិច្ឆេទលើស្លាក (LABEL DATES):</span>
                        {showMfd && <span>MFD: {mfdDate}</span>}
                        {showMfd && (showExp || showLot) && <span>•</span>}
                        {showExp && <span>EXP: {expDate}</span>}
                        {showExp && showLot && <span>•</span>}
                        {showLot && <span>LOT: {lotNumber}</span>}
                      </>
                    ) : (
                      <>
                        <span>📦 ផលិតតាមការកុម្ម៉ង់ (MAKE-TO-ORDER):</span>
                        <span>MFD: ................</span>
                        <span>•</span>
                        <span>EXP: ................</span>
                        {showLot && <span>•</span>}
                        {showLot && <span>LOT: {lotNumber}</span>}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* 2. TOP STICKER STRIP: Brand Logo + Khmer & English Product Name */}
            <div className="bg-[#fcf7ea] text-slate-900 rounded-2xl border-2 border-[#cbb377] overflow-hidden shadow-md">
              <div className="p-3.5 sm:p-4 flex items-center gap-3">
                {/* Brand Logo Medallion */}
                <div className="shrink-0">
                  {customBrandLogo ? (
                    <img src={customBrandLogo} alt="Logo" className="w-14 h-14 object-contain rounded-full border-2 border-amber-600 bg-white p-1 shadow-xs" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-700 flex flex-col items-center justify-center text-amber-950 p-1 shadow-xs">
                      <span className="text-[8px] font-serif uppercase tracking-tighter leading-none font-bold">Mayany</span>
                      <span className="text-[6.5px] font-sans font-black tracking-widest leading-none pt-0.5">ENTERPRISE</span>
                    </div>
                  )}
                </div>

                {/* Product Titles */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-950 font-moul tracking-normal leading-snug line-clamp-2">
                    {productNameKhmer || 'គ្រាប់ចន្ទីស្រោបម្រេចខ្មៅ'}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-800 font-serif leading-snug pt-0.5 line-clamp-1">
                    {productNameEnglish || 'GI Kampot Black Pepper Coated Cashews'}
                  </p>
                </div>
              </div>

              {/* Decorative Golden Khmer Kbach Border */}
              <div className="h-2 w-full bg-gradient-to-r from-[#b38827] via-[#f7df8b] to-[#b38827] flex items-center justify-around overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="text-[7px] text-[#5c440d] font-black select-none">❖</span>
                ))}
              </div>
            </div>

            {/* 3. TRANSPARENT WINDOW WITH NUTS */}
            <div className="relative rounded-2xl border-2 border-white/20 overflow-hidden h-32 sm:h-36 bg-linear-to-br from-amber-900/90 via-amber-800 to-amber-950 flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/40 via-transparent to-black/60" />
              {/* Cashews Texture Overlay */}
              <div className="relative z-10 text-center space-y-1 p-3">
                <div className="text-3xl">🥜 🌰 🥜</div>
                <span className="text-xs font-bold text-amber-200/90 tracking-wide uppercase font-mono block drop-shadow-md">
                  កញ្ចប់បាតឈរ ៥០g គ្រាប់ស្វាយចន្ទីកម្ពុជា
                </span>
                <span className="text-[10px] text-white/80 block drop-shadow-sm font-sans">
                  50g Standing Pouch • Grade WW180 Cambodian Cashews • {netWeight || '50g'}
                </span>
              </div>
              {/* Glass Reflection Highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/25 pointer-events-none" />
            </div>

            {/* 4. BOTTOM STICKER STRIP: QR Code + Contact Info */}
            <div className="bg-[#fcf7ea] text-slate-900 rounded-2xl border-2 border-[#cbb377] overflow-hidden shadow-md">
              <div className="p-3 sm:p-4 flex items-center justify-between gap-4">
                {/* QR Code */}
                {qrDataUrl && (
                  <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-slate-300 shadow-2xs shrink-0">
                    <img src={qrDataUrl} alt="Certificate QR" className="w-16 h-16 sm:w-18 sm:h-18 object-contain" />
                    <span className="text-[7px] font-bold text-slate-700 mt-1 font-mono">SCAN CERTIFICATE</span>
                  </div>
                )}

                {/* Vertical Divider */}
                <div className="w-px h-16 bg-slate-300 shrink-0" />

                {/* Contact Information with Icons */}
                <div className="flex-1 text-xs space-y-1.5 font-sans">
                  {instructionsForUse?.trim() && (
                    <div className="text-[9.5px] sm:text-[10px] text-amber-950 font-bold bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300/80 leading-snug">
                      <span>🍵 {instructionsForUse}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                      📞
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs font-mono">
                      {contactPhone || '+855 88 771 2862'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                      f
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs truncate">
                      {companyName || 'Mayany Enterprise'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-[#a36928] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                      🌐
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs font-mono truncate">
                      mayanyenterprise.com
                    </span>
                  </div>

                  {/* Physical Printed Dates on Bottom Sticker Strip */}
                  <div className="pt-1.5 mt-1 border-t border-[#cbb377]/60 flex items-center justify-between text-[8.5px] font-mono text-slate-900 font-bold">
                    <span>{mfdDate?.trim() ? <><strong>MFD:</strong> {mfdDate} </> : <><strong>MFD:</strong> ................ </>}{expDate?.trim() ? <>| <strong>EXP:</strong> {expDate}</> : <>| <strong>EXP:</strong> ................</>}</span>
                    {lotNumber?.trim() && <span className="bg-amber-200/90 text-amber-950 px-1.5 py-0.2 rounded border border-amber-400">LOT: {lotNumber}</span>}
                  </div>
                </div>
              </div>

              {/* Decorative Golden Khmer Kbach Border */}
              <div className="h-2 w-full bg-gradient-to-r from-[#b38827] via-[#f7df8b] to-[#b38827] flex items-center justify-around overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="text-[7px] text-[#5c440d] font-black select-none">❖</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* FORMAT B: TRADITIONAL SINGLE PHYSICAL LABEL */
          <div 
            id="wizard-printable-label"
            className="bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 rounded-2xl border-2 border-slate-900 p-5 sm:p-6 space-y-5 shadow-inner text-slate-900"
          >
            {/* Top Badge & Brand - Pure Khmer Identity */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b-2 border-slate-900 pb-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                {customBrandLogo ? (
                  <img src={customBrandLogo} alt="Logo" className="w-9 h-9 object-contain rounded-lg border border-slate-300 bg-white" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 text-lg font-black">
                    🇰🇭
                  </div>
                )}
                <div>
                  <div className="text-sm sm:text-base font-black tracking-wider text-slate-900 font-moul">
                    {companyName || 'ម៉ាយ៉ានី'}
                  </div>
                  <div className="text-[9.5px] text-amber-900 font-bold">
                    សហគ្រាសក្នុងស្រុក • ផលិតផលខ្មែរ
                  </div>
                </div>
              </div>
            </div>

            {/* Titles: Khmer Primary & English Secondary ONLY */}
            <div className="text-center py-2 space-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-sans tracking-tight leading-snug">
                {productNameKhmer}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-700 font-sans">
                {productNameEnglish}
              </p>
            </div>

            {/* Middle: Ingredients & Contact Phone */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="space-y-1">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-600 block">
                  គ្រឿងផ្សំ៖
                </span>
                <p className="font-medium text-slate-700 leading-snug text-[9px] sm:text-[9.5px]">
                  {cleanKhmerIngredients(ingredientsList) || 'គ្រាប់ស្វាយចន្ទីខ្មែរ ៩៨%, អំបិលធម្មជាតិ ២%'}
                </p>
                {allergenBox && (
                  <p className="text-[8.5px] font-bold text-rose-700 pt-0.5">
                    ⚠️ {cleanKhmerAllergen(allergenBox)}
                  </p>
                )}
              </div>

              {instructionsForUse?.trim() && (
                <div className="pt-1.5 border-t border-slate-100 text-[8.5px] sm:text-[9px] text-slate-700 leading-snug">
                  <span className="font-bold text-amber-900">🍵 របៀបទទួលទាន/ប្រើប្រាស់៖ </span>
                  <span>{instructionsForUse}</span>
                </div>
              )}

              {contactPhone && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px]">
                  <span className="font-semibold text-slate-600 text-[8.5px] sm:text-[9px]">📞 ទូរស័ព្ទ៖</span>
                  <strong className="font-bold font-mono text-slate-800 text-[8.5px] sm:text-[9px]">{contactPhone}</strong>
                </div>
              )}
            </div>

            {/* Bottom: Net Weight & QR Code */}
            <div className="space-y-2 pt-2.5 border-t-2 border-slate-900">
              <div className="flex items-center justify-center bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl">
                <span className="text-base sm:text-lg font-black text-emerald-950 font-mono tracking-tight">
                  {formatWeightBadgeKhmer(netWeight)}
                </span>
              </div>

              {/* Printed MFD & EXP on Physical Label */}
              <div className="flex items-center justify-between bg-amber-50/90 border border-amber-300/80 px-2.5 py-1 rounded-lg text-[9px] font-mono">
                <span className="font-bold text-slate-800">
                  {mfdDate?.trim() ? <>MFD: {mfdDate} </> : <>MFD: ................ </>}
                  {expDate?.trim() ? <>| EXP: {expDate}</> : <>| EXP: ................</>}
                </span>
                {lotNumber?.trim() && (
                  <span className="font-black text-amber-900 bg-amber-200/90 px-1.5 py-0.2 rounded border border-amber-400">
                    LOT: {lotNumber}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-0.5">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[9px] font-black">
                    <span>🇰🇭</span>
                    <span>ផលិតនៅកម្ពុជា</span>
                  </div>
                  <p className="text-[8.5px] text-slate-500 font-medium">
                    {cleanKhmerAddress(companyAddress)}
                  </p>
                </div>

                {qrDataUrl && (
                  <div className="flex flex-col items-center bg-white p-2 rounded-xl border-2 border-emerald-500 shadow-xs">
                    <img src={qrDataUrl} alt="QR Code" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
                    <span className="text-[7.5px] font-bold text-slate-700 mt-0.5">ស្កេនពិនិត្យប្រភព QR</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions & Export Bar */}
        <div className="space-y-2 pt-1 no-print">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              title="បោះពុម្ពស្លាក (Print Standard Label)"
            >
              <Printer size={14} />
              <span>បោះពុម្ព</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
              title="ទាញយករូបភាពស្លាកកម្រិតច្បាស់ខ្ពស់ PNG (Download High-Res PNG)"
            >
              <Download size={14} className={isDownloading ? 'animate-bounce' : ''} />
              <span>{isDownloading ? 'កំពុងទាញ...' : 'ទាញយក PNG'}</span>
            </button>
            <button
              type="button"
              onClick={handleReadLabelAloud}
              className={`py-2.5 px-3 rounded-xl text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer ${
                isSpeakingAudio ? 'bg-rose-600 hover:bg-rose-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              title="អានព័ត៌មានស្លាកជាសំឡេង (Listen to label specifications)"
            >
              <Volume2 size={14} />
              <span>{isSpeakingAudio ? 'ឈប់អាន' : 'អានស្លាក'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopySummary}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center gap-1.5 border border-slate-300 transition cursor-pointer"
              title="ចម្លងព័ត៌មានស្លាកបច្ចេកទេសទៅ Clipboard (Copy Complete Dossier)"
            >
              {copiedText ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedText ? 'បានចម្លង!' : 'ចម្លងព័ត៌មាន'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="py-2.5 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              title="បើកមើលវិញ្ញាបនបត្របច្ចេកទេសផលិតផលពេញលេញ (Product Certificate)"
            >
              <Award size={14} />
              <span>វិញ្ញាបនបត្រ</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPrinterHeaderModal(true)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer col-span-2 sm:col-span-1"
              title="មើលប្លង់បោះពុម្ពក្បាលកញ្ចប់ ៨cm (3cm Logo + 3cm Info លើកញ្ចប់ 8cm)"
            >
              <span>🏷️</span>
              <span>ប្លង់ 8cm Logo+Info</span>
            </button>
          </div>

          {/* 8cm Pouch Header Banner Quick Access Card */}
          <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border border-amber-300/80 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shrink-0 shadow-xs">
                🏷️
              </div>
              <div>
                <div className="text-xs font-black text-amber-950 flex items-center gap-2">
                  <span>ប្លង់បោះពុម្ពក្បាលកញ្ចប់ ៨cm (3cm Logo + 3cm Info)</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-200 text-amber-900 font-mono font-bold">80mm Bag Spec</span>
                </div>
                <p className="text-[11px] text-amber-900/90 font-medium">
                  ឡូហ្គោខាងឆ្វេង (3×3 cm) + ព័ត៌មានទំនាក់ទំនងខាងស្តាំ (Tel/TG/WA, FB, Web) សម្រាប់ផ្ញើទៅរោងពុម្ព
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPrinterHeaderModal(true)}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
            >
              <span>មើលប្លង់កញ្ចប់ 8cm</span>
              <span>➔</span>
            </button>
          </div>

          {/* Interactive Feedback Toast */}
          {toastMessage && (
            <div className="bg-slate-900 text-amber-300 text-[11px] font-bold px-3 py-2 rounded-xl shadow-md border border-amber-400/30 flex items-center justify-center gap-2 animate-fade-in">
              <Sparkles size={13} className="text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  {/* Official CS 001:2000 Product Packaging Certificate & Technical Dossier Modal */}
  const renderCertificateModal = () => {
    if (!showCertificateModal) return null;

    const certLangCode = certificateLanguage || 'km';
    const isKhmer = certLangCode === 'km' || certLangCode === 'kh';
    const cTrans = CERTIFICATE_TRANSLATIONS[certLangCode] || CERTIFICATE_TRANSLATIONS.km;
    const isModalFlour = Boolean(
      productNameEnglish?.toLowerCase().includes('flour') || 
      productNameEnglish?.toLowerCase().includes('powder') || 
      productNameKhmer?.includes('ម្សៅ') ||
      ingredientsList?.includes('ម្សៅ') ||
      mayanyFlavor === 'flour' ||
      selectedPresetId.includes('powder') ||
      selectedPresetId.includes('flour')
    );

    const handlePrintCertificate = () => {
      window.print();
    };

    const handleCopyCertificateText = () => {
      const translatedIng = translateIngredientsToLanguage(ingredientsList, certLangCode);
      const translatedAllergen = allergenBox ? translateAllergenToLanguage(allergenBox, certLangCode) : '';
      const translatedStorage = storageInstructions ? translateStorageToLanguage(storageInstructions, certLangCode) : '';
      const translatedUsage = translateUsageToLanguage(instructionsForUse, certLangCode, isModalFlour);
      const cleanDesc = (productDescription && productDescription.trim()) || '';
      const storyData = getMayanyProductStory(productNameKhmer, productNameEnglish, certLangCode);
      const benefitsSummary = (storyData.benefits || []).map(b => `${b.title}: ${b.desc}`).join('; ');

      const isPouchWeight = Boolean(
        containerType?.toLowerCase().includes('pouch') ||
        containerType?.includes('កញ្ចប់') ||
        containerType?.includes('ថង់') ||
        netWeight?.includes('50g') ||
        netWeight?.includes('50 g')
      );
      const isJarWeight = Boolean(
        containerType?.toLowerCase().includes('jar') ||
        containerType?.includes('កំប៉ុង') ||
        containerType?.includes('ក្រឡ') ||
        containerType?.includes('tub')
      );
      const isExplicitNetWeight = !isPouchWeight && (
        isJarWeight ||
        (netWeight && (netWeight.toLowerCase().includes('net') || netWeight.includes('សុទ្ធ')))
      );

      const text = [
        `1. ${cTrans.kingdomHeader} | ${cTrans.motto} | ${cTrans.certTitle} (${cTrans.brandName})`,
        `2. ${cTrans.productNameSectionHeader}: ${cTrans.productNameKhmerLabel}: ${ensureKhmerProductName(productNameKhmer, productNameEnglish)} | ${cTrans.productNameEnLabel}: ${productNameEnglish || ''}${certLangCode === 'ko' ? ` | ${cTrans.productNameKoLabel}: ${getStandardKoreanProductName(productNameKhmer, productNameEnglish, isModalFlour)}` : ''}`,
        `3. ${cTrans.scientificNameSectionHeader}: Anacardium occidentale`,
        `4. ${cTrans.descriptionHeader}: ${cleanDesc || storyData.paragraphs.join(' ')}`,
        `5. ${isExplicitNetWeight ? cTrans.weightHeader : cTrans.weightHeaderGeneral}: ${formatWeightBadge(netWeight)} (${cTrans.packagingFormatLabel}: ${containerType || ''})`,
        `6. ${cTrans.ingredientsSectionHeader}: ${translatedIng}`,
        `7. ${cTrans.nutritionHeader}: Energy: ${nutrition?.energyKcal || 580} kcal, Protein: ${nutrition?.protein || 18.2} g, Total Fat: ${nutrition?.totalFat || 43.8} g, Carbs: ${nutrition?.totalCarb || 30.1} g, Fiber: ${nutrition?.dietaryFiber || 3.3} g, Sodium: ${nutrition?.sodium || 8} mg`,
        `8. ${cTrans.benefitsHeader}: ${benefitsSummary}`,
        `9. ${cTrans.usageHeader}: ${translatedUsage}`,
        `10. ${cTrans.storageHeader}: ${translatedStorage}`,
        `11. ${cTrans.allergenAdvisoryHeader}: ${translatedAllergen || (isKhmer ? 'គ្មានសារធាតុអាឡែហ្ស៊ីបន្ថែម' : 'None')}`,
        `12. ${cTrans.storyHeader}: ${storyData.paragraphs.join(' ')}`,
        `13. ${cTrans.producerHeader}: ${cTrans.producerName} (Sole Manufacturer: Mayany Enterprise)`,
        `14. ${cTrans.addressHeader}: ${cTrans.addressText} | ${cTrans.originSourcingText}`,
        `15. ${cTrans.contactHeader}: Tel: ${contactPhone || '+855 88 771 2862'} | Email: mayany@mayanyenterprise.com | Web: mayanyenterprise.com`,
        `16. ${cTrans.lotLabel}: ${lotNumber || '2026-CKP-261'} (REF: MISTI-CS001-2026-${lotNumber || 'KT-2610'}) | ${cTrans.shelfLifeLabel}: ${shelfLifeMonths || 6} ${cTrans.shelfLifeMonthsSuffix} (MFG & EXP: ${cTrans.stampedNotice})`,
        `17. ${cTrans.barcodeLabel}: ${formattedEan || ''}`,
        `18. ${cTrans.productOfCambodiaTitle}: CS 001:2000 • GHP • GMP • HACCP • EUDR • CamGAP`
      ].join('\n\n');

      navigator.clipboard.writeText(text).then(() => {
        triggerToast(`✓ Copied Certificate (${certLangCode.toUpperCase()}) to Clipboard!`);
      });
    };

    // Voice Read-Aloud (SpeechSynthesis) for Customers who cannot read
    const handleToggleCertSpeak = () => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        alert('Browser does not support text-to-speech. Please use Google Chrome or a modern browser.');
        return;
      }

      if (isCertSpeaking) {
        if (isCertPaused) {
          window.speechSynthesis.resume();
          setIsCertPaused(false);
        } else {
          window.speechSynthesis.pause();
          setIsCertPaused(true);
        }
        return;
      }

      window.speechSynthesis.cancel();

      const isKh = isKhmer;
      const cleanIng = translateIngredientsToLanguage(ingredientsList, certLangCode);
      const cleanAllergen = allergenBox ? translateAllergenToLanguage(allergenBox, certLangCode) : '';
      const cleanUsage = translateUsageToLanguage(instructionsForUse, certLangCode, isModalFlour);
      const cleanStorage = storageInstructions ? translateStorageToLanguage(storageInstructions, certLangCode) : '';

      const isPouchWeight = Boolean(
        containerType?.toLowerCase().includes('pouch') ||
        containerType?.includes('កញ្ចប់') ||
        containerType?.includes('ថង់') ||
        netWeight?.includes('50g') ||
        netWeight?.includes('50 g')
      );
      const isJarWeight = Boolean(
        containerType?.toLowerCase().includes('jar') ||
        containerType?.includes('កំប៉ុង') ||
        containerType?.includes('ក្រឡ') ||
        containerType?.includes('tub')
      );
      const isExplicitNetWeight = !isPouchWeight && (
        isJarWeight ||
        (netWeight && (netWeight.toLowerCase().includes('net') || netWeight.includes('សុទ្ធ')))
      );

      const weightSpeechKh = isExplicitNetWeight ? `ទម្ងន់សុទ្ធ៖ ${formatWeightBadge(netWeight)}` : `ទម្ងន់៖ ${formatWeightBadge(netWeight)}`;
      const weightSpeechEn = isExplicitNetWeight ? `Official Net Weight: ${formatWeightBadge(netWeight)}` : `Official Weight: ${formatWeightBadge(netWeight)}`;

      const textToRead = isKh
        ? `ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ។ វិញ្ញាបនបត្របច្ចេកទេសផលិតផល និងការវេចខ្ចប់ ស្តង់ដារជាតិកម្ពុជា CS 001:2000។ ឈ្មោះផលិតផល៖ ${productNameKhmer || 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅ'}។ ឈ្មោះជាភាសាអង់គ្លេស៖ ${productNameEnglish || 'GI Kampot Black Pepper Coated Cashews'}។ ${weightSpeechKh}។ សហគ្រាសផលិត៖ ${companyName || 'Mayany Enterprise'}។ អាសយដ្ឋាន៖ ${companyAddress || 'រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា'}។ លេខទូរស័ព្ទ៖ ${contactPhone || '+855 88 771 2862'}។ គ្រឿងផ្សំពេញលេញ៖ ${cleanIng}។ ${cleanAllergen ? `ការណែនាំអាលែកហ្ស៊ី៖ ${cleanAllergen}។ ` : ''}${cleanUsage ? `របៀបប្រើប្រាស់ ឬ ទទួលទាន៖ ${cleanUsage}។ ` : ''}${cleanStorage ? `លក្ខខណ្ឌរក្សាទុក៖ ${cleanStorage}។ ` : ''}លេខឡូតិ៍៖ ${lotNumber || '2026-CKP-050'}។ កាលបរិច្ឆេទផលិត និងផុតកំណត់ ត្រូវបានបោះត្រាផ្ទាល់លើកញ្ចប់វេចខ្ចប់ជាក់ស្តែង។ អាយុកាលរក្សាទុក ${shelfLifeMonths || 6} ខែ។ ផលិតផលកម្ពុជា ពិតប្រាកដ ១០០ ភាគរយ ស្របតាមស្តង់ដារគុណភាពជាតិកម្ពុជា។`
        : `Kingdom of Cambodia, Nation Religion King. Official Technical Certificate of Conformance under Cambodian National Standard CS 001:2000. Product Name: ${productNameEnglish || 'GI Kampot Black Pepper Coated Cashews'}, Khmer: ${productNameKhmer || 'Cashew Kernels'}. ${weightSpeechEn}. Manufacturer: ${companyName || 'Mayany Enterprise'}. Address: ${companyAddress || 'Phnom Penh, Kingdom of Cambodia'}. Telephone: ${contactPhone || '+855 88 771 2862'}. Full Ingredients List: ${cleanIng}. ${cleanAllergen ? `Allergen Advisory Notice: ${cleanAllergen}. ` : ''}${cleanUsage ? `Instructions for Use and Preparation: ${cleanUsage}. ` : ''}${cleanStorage ? `Recommended Storage Conditions: ${cleanStorage}. ` : ''}Lot Number: ${lotNumber || '2026-CKP-050'}. Production and Expiry dates are stamped directly on the packaging bag. Shelf Life: ${shelfLifeMonths || 6} months. Product of Cambodia, genuine smallholder verified origin.`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = isKh ? 'km-KH' : 'en-US';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const targetPrefix = isKh ? 'km' : 'en';
      const foundVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));
      if (foundVoice) {
        utterance.voice = foundVoice;
      }

      utterance.onstart = () => {
        setIsCertSpeaking(true);
        setIsCertPaused(false);
      };
      utterance.onend = () => {
        setIsCertSpeaking(false);
        setIsCertPaused(false);
      };
      utterance.onerror = () => {
        setIsCertSpeaking(false);
        setIsCertPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsCertSpeaking(true);
      setIsCertPaused(false);
    };

    const handleStopCertSpeak = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsCertSpeaking(false);
      setIsCertPaused(false);
    };

    // Download High-Resolution 1024x1024 PNG QR Code for printing on Jar Labels
    const handleDownloadQrPng = () => {
      if (!qrDataUrl) return;
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `Mayany_Jar_QR_${(lotNumber || '2026-CKP-261').replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('✓ បានទាញយក QR Code កម្រិតច្បាស់ខ្ពស់ (1024px PNG) សម្រាប់បិទលើកំប៉ុង!');
    };

    // Download Vector SVG QR Code for Print Shops & Packaging Artwork
    const handleDownloadQrSvg = async () => {
      try {
        const cleanLot = (lotNumber || '2026-CKP-261').trim();
        const publicOrigin = getPublicOrigin();
        const urlToEncode = passportFullUrl || `${publicOrigin}/?project=passport&batch=${encodeURIComponent(cleanLot)}&view=certificate`;
        const svgString = await QRCode.toString(urlToEncode, {
          type: 'svg',
          margin: 2,
          errorCorrectionLevel: 'M'
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Mayany_Jar_QR_${cleanLot.replace(/[^a-zA-Z0-9_-]/g, '_')}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        triggerToast('✓ បានទាញយក Vector QR Code (SVG) សម្រាប់រោងពុម្ព!');
      } catch (err) {
        console.error('Failed to generate SVG QR:', err);
      }
    };

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in no-print"
        onClick={() => setShowCertificateModal(false)}
      >
        <div 
          className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-xl shadow-xs">
                📜
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-sans">
                  {cTrans.certTitle}
                </h3>
                <p className="text-xs text-amber-800 font-bold font-mono">
                  {cTrans.certSubtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer transition"
            >
              ✕
            </button>
          </div>

          {/* Certificate Language Selector Pills */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 font-sans">
                <span>🌐</span>
                <span>{cTrans.langSelectLabel}:</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                {isKhmer ? 'មាន ១០ ភាសានាំចេញជាផ្លូវការ' : certLangCode === 'ko' ? '10개 수출 공식 언어 지원' : '10 Export Languages Available'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {CERTIFICATE_LANGUAGES.map((lang) => {
                const isSelected = certificateLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setCertificateLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-400/50 scale-[1.03]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Certificate Paper Body (Printable & Exportable) - 20 Sections in Exact Requested Order */}
          {(() => {
            const isKhmer = certLangCode === 'km' || certLangCode === 'kh';
            const isChili = Boolean(
              mayanyFlavor === 'chili' ||
              productNameEnglish?.toLowerCase().includes('chili') ||
              productNameKhmer?.includes('ម្ទេស') ||
              ingredientsList?.includes('ម្ទេស') ||
              selectedPresetId.includes('chili') ||
              activeDedicatedItem?.flavor === 'chili' ||
              activeDedicatedItem?.id?.includes('chili') ||
              lotNumber?.includes('CHIL') ||
              lotNumber?.includes('CKC')
            );
            const isPepper = !isChili && Boolean(
              mayanyFlavor === 'pepper-5' ||
              mayanyFlavor === 'pepper-3' ||
              productNameEnglish?.toLowerCase().includes('pepper') ||
              productNameKhmer?.includes('ម្រេច') ||
              ingredientsList?.includes('ម្រេច')
            );
            const isSugar = !isChili && !isPepper && Boolean(
              mayanyFlavor === 'sugar' ||
              productNameEnglish?.toLowerCase().includes('sugar') ||
              productNameKhmer?.includes('ស្ករ') ||
              ingredientsList?.includes('ស្ករ')
            );
            const isFlour = !isChili && !isPepper && !isSugar && Boolean(
              productNameEnglish?.toLowerCase().includes('flour') || 
              productNameEnglish?.toLowerCase().includes('powder') || 
              productNameKhmer?.includes('ម្សៅ') ||
              ingredientsList?.includes('ម្សៅ') ||
              mayanyFlavor === 'flour'
            );

            const packageFormatText = isKhmer 
              ? (containerType 
                  ? (containerType.toLowerCase().includes('jar') ? 'ក្រឡកែវ/PET សុវត្ថិភាពម្ហូបអាហារ បិទត្រាការពារខ្យល់ (Food-Grade Jar)' : 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)')
                  : (netWeight?.includes('175') || netWeight?.includes('200')
                      ? 'ក្រឡកែវ/PET សុវត្ថិភាពម្ហូបអាហារ បិទត្រាការពារខ្យល់ (Food-Grade Jar)' 
                      : 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)'))
              : certLangCode === 'ko'
              ? (containerType?.toLowerCase().includes('jar') || netWeight?.includes('175') || netWeight?.includes('200')
                  ? '식품 등급 밀폐 보관 용기 (Jar)'
                  : '스탠드형 지퍼 밀봉 파우치 (50g Standing Pouch)')
              : (containerType?.toLowerCase().includes('jar') || netWeight?.includes('175') || netWeight?.includes('200')
                  ? 'Food-Grade Induction Sealed Jar'
                  : 'Food-Grade Stand-Up Barrier Pouch with Zipper (50g Standing Pouch)');

            const isPouchWeight = Boolean(
              containerType?.toLowerCase().includes('pouch') ||
              containerType?.includes('កញ្ចប់') ||
              containerType?.includes('ថង់') ||
              netWeight?.includes('50g') ||
              netWeight?.includes('50 g')
            );
            const isJarWeight = Boolean(
              containerType?.toLowerCase().includes('jar') ||
              containerType?.includes('កំប៉ុង') ||
              containerType?.includes('ក្រឡ') ||
              containerType?.includes('tub')
            );
            const isExplicitNetWeight = !isPouchWeight && (
              isJarWeight ||
              (netWeight && (netWeight.toLowerCase().includes('net') || netWeight.includes('សុទ្ធ')))
            );

            const storyData = getMayanyProductStory(productNameKhmer, productNameEnglish, certLangCode);
            const userCustomDesc = (productDescription && productDescription.trim()) || '';
            const isDescKhmer = userCustomDesc && /[\u1780-\u17FF]/.test(userCustomDesc);
            const officialDescription = (isKhmer && !isDescKhmer)
              ? (storyData.paragraphs && storyData.paragraphs.length > 0
                  ? storyData.paragraphs.join('\n\n')
                  : (isFlour
                      ? 'ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ រាល់ដំណាក់កាលនៃការផលិតត្រូវបានយកចិត្តទុកដាក់ និងសម្រិតសម្រាំង ដើម្បីរក្សាបាននូវគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមគោលការណ៍សុវត្ថិភាពម្ហូបអាហារ។ ផលិតផលនេះមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។'
                      : (isPepper
                          ? 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ និងម្រេចខ្មៅកំពត GI ដ៏ល្បីល្បាញលើពិភពលោក។ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ CS 001 ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពតផ្តល់នូវរសជាតិឈ្ងុយហឹរស្រាល ស្រួយឆ្ងាញ់ធម្មជាតិ និងជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។'
                          : `${productNameKhmer || ensureKhmerProductName(productNameKhmer, productNameEnglish)} ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាធម្មជាតិដែលប្រមូលផលដោយដៃពីចម្ការកសិករក្នុងខេត្តកំពង់ធំ។ ឆ្លងកាត់ការកែច្នៃសម្រិតសម្រាំង និងលីងស្រោបគ្រឿងទេសធម្មជាតិកម្ពុជា ស្របតាមស្តង់ដារគុណភាព និងអនាម័យខ្ពស់បំផុត។`)))
              : (!isKhmer && isDescKhmer)
              ? (storyData.paragraphs && storyData.paragraphs.length > 0
                  ? storyData.paragraphs.join('\n\n')
                  : (certLangCode === 'ko'
                      ? (isFlour
                          ? '100% 순수 캐슈넛 가루는 캄보디아 왕국 캄퐁톰(Kampong Thom) 지역에서 재배되고 탈각된 프리미엄 캐슈넛으로 제조됩니다. 모든 생산 과정은 식품 안전 원칙에 따라 품질, 안전 및 위생을 철저히 유지하기 위해 세심하게 관리됩니다. 방부제, 인공 향료 및 색소를 일체 첨가하지 않았습니다.'
                          : `${productNameEnglish}은(는) 캄보디아 캄퐁톰 지역의 현지 농가에서 직접 수확한 프리미엄 캐슈넛으로 제조되며, 엄격한 위생 및 안전 기준을 준수하여 생산됩니다.`)
                      : (isFlour
                          ? 'Pure cashew kernel flour produced from cashew nuts grown and shelled in Kampong Thom province, Kingdom of Cambodia. Meticulously cold-milled under strict food safety protocols with zero added salt, zero sugar, and no preservatives.'
                          : `${productNameEnglish} is crafted from selected Cambodian cashews hand-harvested by local farming communities in Kampong Thom province, naturally seasoned to perfection.`)))
              : (userCustomDesc || (storyData.paragraphs && storyData.paragraphs.length > 0
                  ? storyData.paragraphs.join('\n\n')
                  : (isFlour
                      ? (isKhmer
                          ? 'ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ រាល់ដំណាក់កាលនៃការផលិតត្រូវបានយកចិត្តទុកដាក់ និងសម្រិតសម្រាំង ដើម្បីរក្សាបាននូវគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមគោលការណ៍សុវត្ថិភាពម្ហូបអាហារ។ ផលិតផលនេះមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។'
                          : certLangCode === 'ko'
                          ? '100% 순수 캐슈넛 가루는 캄보디아 왕국 캄퐁톰(Kampong Thom) 지역에서 재배되고 탈각된 프리미엄 캐슈넛으로 제조됩니다. 모든 생산 과정은 식품 안전 원칙에 따라 품질, 안전 및 위생을 철저히 유지하기 위해 세심하게 관리됩니다. 방부제, 인공 향료 및 색소를 일체 첨가하지 않았습니다.'
                          : 'Pure cashew kernel flour produced from cashew nuts grown and shelled in Kampong Thom province, Kingdom of Cambodia. Meticulously cold-milled under strict food safety protocols with zero added salt, zero sugar, and no preservatives.')
                      : (isKhmer
                          ? `${productNameKhmer} ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាធម្មជាតិដែលប្រមូលផលដោយដៃពីចម្ការកសិករក្នុងខេត្តកំពង់ធំ។ ឆ្លងកាត់ការកែច្នៃសម្រិតសម្រាំង និងលីងស្រោបគ្រឿងទេសធម្មជាតិកម្ពុជា ស្របតាមស្តង់ដារគុណភាព និងអនាម័យខ្ពស់បំផុត។`
                          : certLangCode === 'ko'
                          ? `${productNameEnglish}은(는) 캄보디아 캄퐁톰 지역의 현지 농가에서 직접 수확한 프리미엄 캐슈넛으로 제조되며, 엄격한 위생 및 안전 기준을 준수하여 생산됩니다.`
                          : `${productNameEnglish} is crafted from selected Cambodian cashews hand-harvested by local farming communities in Kampong Thom province, naturally seasoned to perfection.`))));

            const userCustomStory = ((subheadingOrBotanical && subheadingOrBotanical.trim() && !subheadingOrBotanical.includes('Anacardium')) ? subheadingOrBotanical.trim() : '');
            const isStoryKhmer = userCustomStory && /[\u1780-\u17FF]/.test(userCustomStory);
            const storyParagraphs = (isKhmer && !isStoryKhmer)
              ? storyData.paragraphs
              : (!isKhmer && isStoryKhmer)
              ? storyData.paragraphs
              : (userCustomStory
                  ? userCustomStory.split('\n').filter(p => p.trim())
                  : storyData.paragraphs);

            const benefitsList = (storyData.benefits && storyData.benefits.length > 0) ? storyData.benefits : [];

            // Parse actual percentage numbers dynamically from ingredientsList
            const cashewMatch = ingredientsList.match(/(?:ចន្ទី|cashew)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
            const chiliMatch = ingredientsList.match(/(?:ម្ទេស|chili)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
            const pepperMatch = ingredientsList.match(/(?:ម្រេច|pepper)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
            const sugarMatch = ingredientsList.match(/(?:ស្ករ|sugar)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
            const saltMatch = ingredientsList.match(/(?:អំបិល|salt)[^,]*?(\d+(?:\.\d+)?|[\u17E0-\u17E9]+)\s*%/i);
            const toNum = (str: string | undefined, fallback: number) => {
              if (!str) return fallback;
              const khmerDigits: Record<string, string> = { '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4', '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9' };
              let s = str;
              Object.entries(khmerDigits).forEach(([k, v]) => { s = s.split(k).join(v); });
              const n = parseFloat(s);
              return isNaN(n) ? fallback : n;
            };

            const parsedIngredientList = parseIngredientsWithPercentages(
              ingredientsList,
              toNum(cashewMatch?.[1], 92),
              isChili ? 'ម្ទេសហិរធម្មជាតិ' : isPepper ? 'ម្រេចខ្មៅកំពត' : '',
              toNum(isChili ? chiliMatch?.[1] : pepperMatch?.[1], isChili ? 4 : 5),
              toNum(sugarMatch?.[1], 0),
              toNum(saltMatch?.[1], 2),
              isFlour,
              isKhmer,
              certLangCode
            );

            return (
              <div 
                id="printable-product-certificate"
                className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 border-2 border-slate-800 shadow-xl space-y-6 text-slate-900 max-w-4xl mx-auto"
              >
                {/* 1. LOGO AND BRAND NAME */}
                <div className="text-center space-y-2 border-b-2 border-slate-800 pb-5">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pb-2">
                    <MayanyLogo customLogo={(typeof window !== 'undefined' ? (localStorage.getItem('cashewtrace_sme_brand_logo') || undefined) : undefined) || customBrandLogo} className="h-16 sm:h-20 w-auto object-contain" />
                    <div className="hidden sm:block h-12 w-px bg-amber-300" />
                    <div className="text-center sm:text-left space-y-0.5">
                      <p className="text-sm font-black text-slate-950 font-serif tracking-wider">
                        {cTrans.brandName}
                      </p>
                      <p className="text-[11px] text-slate-600 font-sans">
                        {cTrans.brandSubtitle}
                      </p>
                      <p className="text-[10px] text-emerald-800 font-mono font-bold">
                        {cTrans.mistiBadge}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-bold tracking-widest text-slate-900 font-sans">
                    {cTrans.kingdomHeader}
                  </p>
                  <p className="text-xs font-semibold tracking-wider text-slate-600 font-serif">
                    {cTrans.motto}
                  </p>
                  <div className="text-amber-800 text-xs my-1 font-mono">❖ ❖ ❖</div>
                  
                  <div className="inline-block px-4 py-1.5 rounded-xl bg-amber-100/90 border border-amber-300 mt-1">
                    <span className="text-xs sm:text-sm font-black text-amber-950 tracking-wide block font-sans">
                      🇰🇭 {cTrans.certTitle}
                    </span>
                    <span className="text-[10px] text-slate-700 font-medium block font-sans">
                      {cTrans.certSubtitle}
                    </span>
                  </div>
                </div>

                {/* 2. PRODUCT NAME IN KHMER AND ENGLISH */}
                <div className="text-center py-4 space-y-2.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block font-mono">
                    {cTrans.productNameSectionHeader}
                  </span>
                  
                  {/* Khmer Name */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-500 font-sans">
                      {cTrans.productNameKhmerLabel}:
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-sans">
                      {ensureKhmerProductName(productNameKhmer, productNameEnglish)}
                    </h2>
                  </div>

                  {/* English Name */}
                  <div className="space-y-0.5 pt-1 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 font-sans">
                      {cTrans.productNameEnLabel}:
                    </div>
                    <p className="text-base font-bold text-slate-800 font-sans">
                      {productNameEnglish}
                    </p>
                  </div>

                  {/* Korean Name (when Korean is selected) */}
                  {certLangCode === 'ko' && (
                    <div className="space-y-0.5 pt-1 border-t border-slate-100">
                      <div className="text-xs font-semibold text-indigo-700 font-sans">
                        {cTrans.productNameKoLabel}:
                      </div>
                      <p className="text-sm sm:text-base font-bold text-indigo-950 font-sans">
                        {getStandardKoreanProductName(productNameKhmer, productNameEnglish, isModalFlour)}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. SCIENTIFIC NAME IN ENGLISH */}
                <div className="text-center py-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 block font-mono">
                    {cTrans.scientificNameSectionHeader}
                  </span>
                  <div className="text-base sm:text-lg font-bold text-amber-950 italic font-serif tracking-wide">
                    {isPepper
                      ? 'Anacardium occidentale & Piper nigrum L.'
                      : isChili
                      ? 'Anacardium occidentale & Capsicum frutescens'
                      : cTrans.scientificClassification}
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium font-sans">
                    {isKhmer 
                      ? (isPepper ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា & ម្រេចខ្មៅកំពត GI' : isChili ? 'គ្រាប់ស្វាយចន្ទីកម្ពុជា & ម្ទេសធម្មជាតិ' : cTrans.scientificNameLabel)
                      : cTrans.scientificNameLabel}
                  </p>
                </div>

                {/* 4. PRODUCT DESCRIPTION */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2 text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                    <span className="font-black text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>📜</span>
                      <span>{cTrans.descriptionHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                      {cTrans.descriptionSub}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12px] text-slate-800 leading-relaxed font-sans text-justify indent-2 whitespace-pre-line">
                    {officialDescription}
                  </p>
                </div>

                {/* 5. WEIGHT */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>⚖️</span>
                      <span>{isExplicitNetWeight ? cTrans.weightHeader : cTrans.weightHeaderGeneral}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                      {formatWeightBadge(netWeight)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold block">
                        {isExplicitNetWeight ? cTrans.netWeightLabel : cTrans.weightLabelGeneral}:
                      </span>
                      <p className="text-base font-black text-slate-900 font-mono">{formatWeightBadge(netWeight)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold block">{cTrans.packagingFormatLabel}:</span>
                      <p className="text-xs font-semibold text-slate-800">{packageFormatText}</p>
                    </div>
                  </div>
                </div>

                {/* 6. INGREDIENT LIST */}
                <div className="space-y-4 text-xs bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm font-sans">
                        {cTrans.ingredientsSectionHeader}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                        {cTrans.ingredientsSub}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold border border-emerald-200 flex items-center gap-1">
                      ✓ {isKhmer ? 'ម៉ាស់សរុប ១០០%' : certLangCode === 'ko' ? '총 함량 100%' : 'Total 100% Mass'}
                    </span>
                  </div>

                  {/* Dynamic Percentage Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
                    {parsedIngredientList.map((item, idx) => (
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
                          <span>{item.percent > 0 ? `${item.percent} ${isKhmer ? 'ក្រាម / ១០០g' : 'g / 100g'}` : (isKhmer ? 'ដានតិចតួច' : 'Trace')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Full Declaration */}
                  <div className="text-xs text-slate-700 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 leading-relaxed font-sans space-y-1">
                    <div className="font-black text-amber-950 flex items-center gap-1.5">
                      <span>📜</span>
                      <span>{cTrans.fullDeclarationHeader}</span>
                    </div>
                    <div className="text-slate-800">
                      {translateIngredientsToLanguage(
                        ingredientsList || (isFlour
                          ? 'ម្សៅគ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០% • គ្មានបន្ថែមអំបិល គ្មានស្ករ គ្មានសារធាតុរក្សាទុក គ្មានបន្ថែមក្លិន គ្មានបន្ថែមពណ៌'
                          : `${productNameKhmer || productNameEnglish}៖ គ្រាប់ស្វាយចន្ទី WW180 (92%), គ្រឿងទេសធម្មជាតិ (5%), ស្ករត្នោត (2%), អំបិលសមុទ្រ (1%)។`),
                        certLangCode
                      )}
                    </div>
                  </div>

                  {/* Explicit Ingredient Suppliers Traceability List */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200 pb-1.5">
                      <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                        <span>🌱</span>
                        <span>{isKhmer ? 'បញ្ជីអ្នកផ្គត់ផ្គង់តាមគ្រឿងផ្សំនីមួយៗ' : certLangCode === 'ko' ? '원재료별 공급업체 목록 (Ingredient Suppliers)' : 'Ingredient Suppliers Traceability List'}</span>
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
                      {(!isChili && (isPepper || ingredientsList?.includes('ម្រេច') || ingredientsList?.toLowerCase().includes('pepper')) && (selectedSuppliers && selectedSuppliers.some(s => s.includes('BOH') || s.includes('ម្រេច') || s.toLowerCase().includes('pepper')))) && (
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

                      {/* Chili Supplier */}
                      {(isChili || ingredientsList?.includes('ម្ទេស') || ingredientsList?.includes('Chili')) && (!selectedSuppliers || selectedSuppliers.length === 0 || selectedSuppliers.some(s => s.includes('Ringacam') || s.includes('ម្ទេស') || s.toLowerCase().includes('chili'))) && (
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

                      {/* Sugar Supplier - displays whenever Angkor Sugar is in selectedSuppliers OR product contains sugar / is sugar flavored */}
                      {((selectedSuppliers && selectedSuppliers.some(s => s.toLowerCase().includes('angkor') || s.toLowerCase().includes('sugar') || s.includes('ស្ករ'))) || (!isChili && (isSugar || ingredientsList?.includes('ស្ករ') || ingredientsList?.toLowerCase().includes('sugar')))) && (
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
                      {!isFlour && (!selectedSuppliers || selectedSuppliers.length === 0 || selectedSuppliers.some(s => s.includes('Ngov Heng') || s.includes('អំបិល') || s.toLowerCase().includes('salt'))) && (
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
                      {selectedSuppliers && selectedSuppliers
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
                      <span>{cTrans.nutritionHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {cTrans.nutritionSub}
                    </span>
                  </div>

                  {/* Complete Nutrient Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs font-mono">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.energyLabel}</span>
                      <span className="font-black text-slate-950 text-sm">{nutrition?.energyKcal || '580'} kcal</span>
                      <span className="text-[9.5px] text-slate-500 block">({nutrition?.energyKj || '2426'} kJ)</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.proteinLabel}</span>
                      <span className="font-black text-emerald-800 text-sm">{nutrition?.protein || '18.2'} g</span>
                      <span className="text-[9.5px] text-emerald-700 block font-sans">{isKhmer ? 'ប្រូតេអ៊ីនរុក្ខជាតិ' : certLangCode === 'ko' ? '식물성 단백질' : 'Plant Protein'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.totalFatLabel}</span>
                      <span className="font-black text-slate-950 text-sm">{nutrition?.totalFat || '43.8'} g</span>
                      <span className="text-[9.5px] text-slate-500 block font-sans">{isKhmer ? 'ខ្លាញ់ល្អមិនឆ្អែត' : certLangCode === 'ko' ? '건강한 불포화지방' : 'Healthy Fats'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.saturatedFatLabel}</span>
                      <span className="font-bold text-slate-800">{nutrition?.saturatedFat || '7.8'} g</span>
                      <span className="text-[9.5px] text-slate-400 block font-sans">{isKhmer ? 'ខ្លាញ់ឆ្អែតធម្មជាតិ' : certLangCode === 'ko' ? '천연 포화지방' : 'Naturally occurring'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.transFatLabel}</span>
                      <span className="font-bold text-slate-800">{nutrition?.transFat || '0.0'} g</span>
                      <span className="text-[9.5px] text-emerald-700 block font-sans">{isKhmer ? 'គ្មានខ្លាញ់ឆ្លង (០%)' : certLangCode === 'ko' ? '트랜스지방 0%' : '0% Trans Fat'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.cholesterolLabel}</span>
                      <span className="font-bold text-slate-800">{nutrition?.cholesterol || '0'} mg</span>
                      <span className="text-[9.5px] text-emerald-700 block font-sans">{isKhmer ? 'គ្មានកូឡេស្តេរ៉ុល' : certLangCode === 'ko' ? '콜레스테롤 0%' : 'Cholesterol Free'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.totalCarbLabel}</span>
                      <span className="font-black text-slate-950 text-sm">{nutrition?.totalCarb || '30.1'} g</span>
                      <span className="text-[9.5px] text-slate-500 block font-sans">{isKhmer ? 'ថាមពលយូរអង្វែង' : certLangCode === 'ko' ? '복합 탄수화물' : 'Complex Carbs'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.dietaryFiberLabel}</span>
                      <span className="font-bold text-slate-800">{nutrition?.dietaryFiber || '3.3'} g</span>
                      <span className="text-[9.5px] text-slate-500 block font-sans">{isKhmer ? 'ជំនួយការរំលាយអាហារ' : certLangCode === 'ko' ? '장 건강 지원' : 'Digestive health'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.totalSugarsLabel}</span>
                      <span className="font-bold text-slate-800">{nutrition?.totalSugars || '5.9'} g</span>
                      <span className="text-[9.5px] text-slate-400 block font-sans">{isKhmer ? 'ស្ករធម្មជាតិពីគ្រាប់' : certLangCode === 'ko' ? '견과 천연 당' : 'Natural nut sugars'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.addedSugarsLabel}</span>
                      <span className="font-bold text-slate-800">{nutrition?.addedSugars || '0.0'} g</span>
                      <span className="text-[9.5px] text-emerald-700 block font-sans">{isKhmer ? 'គ្មានស្ករបន្ថែមគីមី' : certLangCode === 'ko' ? '인공 첨가당 0%' : 'No refined sugars'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.sodiumLabel}</span>
                      <span className="font-bold text-slate-800">{nutrition?.sodium || '8'} mg</span>
                      <span className="text-[9.5px] text-slate-400 block font-sans">{isKhmer ? 'កម្រិតទាប' : certLangCode === 'ko' ? '저나트륨' : 'Low Sodium'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10.5px] text-slate-500 font-sans block">{cTrans.saltLabel}</span>
                      <span className="font-bold text-slate-800">{nutrition?.salt || '0.02'} g</span>
                      <span className="text-[9.5px] text-slate-400 block font-sans">{isKhmer ? 'អំបិលធម្មជាតិ' : certLangCode === 'ko' ? '천연 식염' : 'Natural salt'}</span>
                    </div>
                  </div>
                </div>

                {/* 8. HEALTH BENEFITS */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 text-slate-900">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="font-black text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>✨</span>
                      <span>{cTrans.benefitsHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full">
                      {cTrans.benefitsBadge}
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
                      <span>{cTrans.usageHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                      {cTrans.usageSub}
                    </span>
                  </div>
                  <div className="text-xs sm:text-[12px] text-slate-800 leading-relaxed font-sans whitespace-pre-line font-medium">
                    {translateUsageToLanguage(
                      (isFlour && (instructionsForUse?.includes('250ml') || instructionsForUse?.includes('៨៥°C') || !instructionsForUse?.trim()))
                        ? '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ'
                        : (instructionsForUse || (isFlour
                            ? '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ'
                            : 'អាចទទួលទានភ្លាមៗជាអាហារសម្រន់សុខភាព ឬប្រើជាគ្រឿងបន្ថែមរសជាតិលើសាឡាត់ បបរ និងម្ហូបអាហារផ្សេងៗ។ ក្រោយបើកកញ្ចប់រួច ត្រូវបិទខ្សែរូតឱ្យជិតដើម្បីរក្សាភាពស្រួយឆ្ងាញ់។')),
                      certLangCode,
                      isFlour
                    )}
                  </div>
                </div>

                {/* 10. STORAGE INFO */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="font-black text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>❄️</span>
                      <span>{cTrans.storageHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                      {cTrans.storageSub}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12px] text-slate-800 leading-relaxed font-sans">
                    {translateStorageToLanguage(storageInstructions || (isKhmer ? 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ ក្រោយបើកប្រើរួច ត្រូវបិទខ្សែរូត ឬគម្របឱ្យជិត។' : 'Store in a cool, dry place (< 25°C). Keep away from direct sunlight and moisture. Reseal tightly after opening.'), certLangCode)}
                  </p>
                </div>

                {/* 11. ALLERGEN INFO */}
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 font-sans space-y-1.5">
                  <div className="flex items-center justify-between border-b border-rose-200/80 pb-1.5">
                    <span className="font-black text-rose-950 text-xs sm:text-sm flex items-center gap-1.5">
                      <AlertCircle size={15} className="text-rose-600 shrink-0" />
                      <span>{cTrans.allergenAdvisoryHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-rose-200 text-rose-950 px-2 py-0.5 rounded-full">
                      {cTrans.allergenSub}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12px] text-rose-900 leading-relaxed pl-1 font-medium">
                    {translateAllergenToLanguage(allergenBox || 'Contains tree nuts: Cashew Nuts (ផ្ទុកសារធាតុអាឡែហ្ស៊ី៖ គ្រាប់ស្វាយចន្ទី)', certLangCode)}
                  </p>
                </div>

                {/* 12. PRODUCT STORY */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 border-2 border-amber-300/80 space-y-3 shadow-xs text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200/90 pb-2">
                    <span className="font-black text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>🌾</span>
                      <span>{cTrans.storyHeader}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300">
                      {cTrans.storyBadge}
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
                    {cTrans.producerHeader}:
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950 text-base font-sans flex items-center gap-2">
                        <span>{cTrans.producerName}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full font-mono">
                          {isKhmer ? 'សហគ្រាសផលិតផ្តាច់មុខ' : certLangCode === 'ko' ? '단독 공식 제조원' : 'Sole Manufacturer'}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                        {cTrans.producerNameLabel} • {isKhmer ? 'ទទួលខុសត្រូវលើរូបមន្ត ការកែច្នៃ និងការវេចខ្ចប់ស្តង់ដារជាតិ CS 001:2000' : certLangCode === 'ko' ? '국가 표준 CS 001:2000 가공 및 패키징 책임 제조 기업' : 'Responsible for Formulation, Processing & Packaging under CS 001:2000'}
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
                    {cTrans.addressHeader}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold block">{cTrans.addressLabel}:</span>
                      <p className="text-slate-900 font-medium">{cTrans.addressText}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold block">{cTrans.originSourcingLabel}:</span>
                      <p className="text-emerald-950 font-bold">{cTrans.originSourcingText}</p>
                    </div>
                  </div>
                </div>

                {/* 15. CONTACT INFO */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-slate-900">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                    {cTrans.contactHeader}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      <Phone size={14} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">{cTrans.phoneLabel}</span>
                        <a href="tel:+855887712862" className="font-bold text-emerald-900 font-mono hover:underline">+855 88 771 2862</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      <Mail size={14} className="text-indigo-600 shrink-0" />
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">{cTrans.emailLabel}</span>
                        <a href="mailto:mayany@mayanyenterprise.com" className="font-bold text-indigo-900 hover:underline text-[11px]">mayany@mayanyenterprise.com</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      <Globe size={14} className="text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">{cTrans.websiteLabel}</span>
                        <a href="https://mayanyenterprise.com" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-900 font-mono hover:underline text-[11px]">mayanyenterprise.com</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                      <Facebook size={14} className="text-blue-600 shrink-0" />
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">{cTrans.facebookLabel}</span>
                        <a href="https://www.facebook.com/MayanyEnterprise" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-900 hover:underline text-[11px]">Mayany Enterprise</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 16. LOT NUMBER */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2 text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>🏷️</span>
                      <span>{cTrans.lotLabel}:</span>
                    </span>
                    <span className="text-sm font-black text-amber-950 font-mono bg-amber-200/80 px-3 py-0.5 rounded-lg border border-amber-300">
                      {lotNumber || '2026-CKP-261'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-600">
                    <span>REF: MISTI-CS001-2026-{lotNumber || 'KT-2610'}</span>
                    <span className="font-sans text-slate-500">{cTrans.lotSub}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-amber-200/60 text-[10.5px] font-sans">
                    <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      ✓ {isKhmer ? 'កាលបរិច្ឆេទផលិត (MFG) & ផុតកំណត់ (EXP) បោះត្រាផ្ទាល់លើកញ្ចប់' : certLangCode === 'ko' ? '제조일자 및 소비기한은 포장재에 직접 날인' : 'MFG & EXP stamped directly on packaging bag'}
                    </span>
                    <span className="text-slate-600 font-medium">
                      {cTrans.shelfLifeLabel}: <strong>{shelfLifeMonths || 6} {cTrans.shelfLifeMonthsSuffix}</strong>
                    </span>
                  </div>
                </div>

                {/* 19. BARCODE */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs space-y-3 text-slate-900 text-center">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-left">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>📊</span>
                      <span>{cTrans.barcodeLabel}</span>
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
                    <div className="font-mono text-sm font-bold text-slate-800">{formattedEan || '8847116350221'}</div>
                  )}

                  <p className="text-[10.5px] text-slate-500 font-sans max-w-lg mx-auto">
                    {cTrans.barcodeSub}
                  </p>
                </div>

                {/* 20. PRODUCT OF CAMBODIA */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/60 border-2 border-amber-300 space-y-4 text-slate-900">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="font-black text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                      <span>🇰🇭</span>
                      <span>{cTrans.productOfCambodiaTitle}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full">
                      {cTrans.standardsBadge}
                    </span>
                  </div>

                  {/* Standards Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-sans">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">🇰🇭</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{cTrans.stdCs001Title}</span>
                        <span className="text-[9.5px] text-slate-500">{cTrans.stdCs001Sub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">✓</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{cTrans.stdGhpTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{cTrans.stdGhpSub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">✓</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{cTrans.stdGmpTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{cTrans.stdGmpSub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">🛡️</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{cTrans.stdHaccpTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{cTrans.stdHaccpSub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">🌲</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{cTrans.stdEudrTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{cTrans.stdEudrSub}</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-base">🌾</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">{cTrans.stdCamGapTitle}</span>
                        <span className="text-[9.5px] text-slate-500">{cTrans.stdCamGapSub}</span>
                      </div>
                    </div>
                  </div>

                  {/* Packaging Compliance Icons */}
                  <div className="p-3 bg-white/90 rounded-xl border border-amber-200 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-sans">
                    <div className="space-y-0.5">
                      <span className="text-base">♻️</span>
                      <span className="block font-bold text-slate-800">{cTrans.iconRecyclable}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-base">🚫</span>
                      <span className="block font-bold text-slate-800">{cTrans.iconAntiDrug}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-base">🍽️</span>
                      <span className="block font-bold text-slate-800">{cTrans.iconFoodGrade}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-base">🌿</span>
                      <span className="block font-bold text-slate-800">{cTrans.iconNoChemicals}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-base">🇰🇭</span>
                      <span className="block font-bold text-slate-800">{cTrans.iconSupportKhmer}</span>
                    </div>
                  </div>

                  {/* Digital QR Passport Verification Box */}
                  <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    {qrDataUrl && (
                      <div 
                        className="relative shrink-0 bg-white p-2 rounded-xl border border-slate-200 cursor-pointer group"
                        onClick={() => setShowEnlargedQr(true)}
                        title={isKhmer ? 'ចុចពង្រីកពេញអេក្រង់' : 'Click to enlarge'}
                      >
                        <img 
                          src={qrDataUrl} 
                          alt="Verification QR" 
                          className="w-24 h-24 object-contain group-hover:scale-105 transition" 
                        />
                        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition">
                          <Eye size={16} className="text-slate-900" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-1 flex-1">
                      <span className="text-xs font-black uppercase text-slate-950 font-mono tracking-wide block">
                        {cTrans.verificationHeader}
                      </span>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                        {cTrans.qrScanNotice}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowEnlargedQr(true)}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition border border-amber-300"
                        >
                          <Eye size={11} />
                          <span>{isKhmer ? 'ពង្រីក QR' : certLangCode === 'ko' ? 'QR 확대' : 'Enlarge QR'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadQrPng}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition border border-emerald-300"
                        >
                          <Download size={11} />
                          <span>PNG</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadQrSvg}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition border border-slate-300"
                        >
                          <span>SVG</span>
                        </button>
                        {passportFullUrl && (
                          <a
                            href={passportFullUrl}
                            onClick={(e) => {
                              if (window.location.hostname.includes('run.app')) {
                                e.preventDefault();
                                const searchStr = passportFullUrl.split('?')[1] || '';
                                window.location.href = `/?${searchStr}`;
                              }
                            }}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-950 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition border border-blue-300"
                          >
                            <ExternalLink size={11} />
                            <span>{isKhmer ? 'តេស្ត' : certLangCode === 'ko' ? '테스트' : 'Test'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Voice Read-Aloud Narration Banner (When speaking) */}
                {isCertSpeaking && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border-2 border-emerald-500/70 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fade-in no-print">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                        <Volume2 className="w-5 h-5 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {isKhmer ? '🎙️ កំពុងអានវិញ្ញាបនបត្រឮៗជូនអតិថិជន...' : certLangCode === 'ko' ? '🎙️ 고객을 위해 인증서를 소리 내어 읽는 중...' : '🎙️ Reading Certificate Aloud for Customer...'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Mayany Enterprise • CS 001 Technical Audio
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleCertSpeak}
                        className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer transition"
                      >
                        {isCertPaused ? <Play size={13} /> : <Pause size={13} />}
                        <span>{isCertPaused ? 'បន្ត (Resume)' : 'ផ្អាក (Pause)'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleStopCertSpeak}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                      >
                        <Square size={13} />
                        <span>បញ្ឈប់ (Stop)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Modal Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            {/* Microphone / Read Aloud Audio Button for Customers */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleCertSpeak}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-sm ${
                  isCertSpeaking
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
                title="អានវិញ្ញាបនបត្រឮៗសម្រាប់អតិថិជន (Read Certificate Aloud)"
              >
                {isCertSpeaking ? (isCertPaused ? <Play size={15} /> : <Pause size={15} />) : <Volume2 size={15} />}
                <span>
                  {isCertSpeaking 
                    ? (isCertPaused ? 'បន្តអាន (Resume)' : 'ផ្អាកអាន (Pause)')
                    : '🎙️ អានឮៗ (Read Aloud 🔊)'}
                </span>
              </button>

              {isCertSpeaking && (
                <button
                  type="button"
                  onClick={handleStopCertSpeak}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                  title="បញ្ឈប់ការអាន (Stop)"
                >
                  <Square size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCertificateText}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Copy size={14} />
                <span>{cTrans.copyBtn} ({certLangCode.toUpperCase()})</span>
              </button>
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Printer size={14} />
                <span>{cTrans.printBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleStopCertSpeak();
                  setShowCertificateModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                {cTrans.closeBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen Enlarge QR Modal for Effortless Smartphone Camera Scanning */}
        {showEnlargedQr && qrDataUrl && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in no-print"
            onClick={() => setShowEnlargedQr(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border-2 border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <QrCode size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-slate-900 font-sans">
                      {certLangCode === 'kh' ? 'ស្កេនពិនិត្យតាមទូរស័ព្ទ' : 'Scan with Phone Camera'}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-sans">
                      100% Smartphone Camera Scannable
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEnlargedQr(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Huge, crisp, high-contrast QR code display */}
              <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 shadow-md inline-block">
                <img 
                  src={qrDataUrl} 
                  alt="Enlarged Digital Passport QR" 
                  className="w-64 h-64 sm:w-72 sm:h-72 object-contain mx-auto"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 font-sans">
                  {productNameKhmer || 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពតGI'}
                </p>
                <p className="text-[11px] font-sans text-slate-600">
                  {productNameEnglish || 'GI Kampot Black Pepper Coated Cashew Kernels'} ({netWeight || '250g'})
                </p>
                <p className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 py-1 px-2 rounded-lg border border-emerald-200 inline-block">
                  LOT: {lotNumber || '2026-CKP-261'} • CS 001:2000
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (passportFullUrl) {
                      navigator.clipboard.writeText(passportFullUrl);
                      triggerToast('✓ បានចម្លងតំណភ្ជាប់ QR Passport រួចរាល់!');
                    }
                  }}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Copy size={13} />
                  <span>{certLangCode === 'kh' ? 'ចម្លងតំណ' : 'Copy Link'}</span>
                </button>
                {passportFullUrl && (
                  <a
                    href={passportFullUrl}
                    onClick={(e) => {
                      if (window.location.hostname.includes('run.app')) {
                        e.preventDefault();
                        const searchStr = passportFullUrl.split('?')[1] || '';
                        window.location.href = `/?${searchStr}`;
                      }
                    }}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <ExternalLink size={13} />
                    <span>{certLangCode === 'kh' ? 'បើកតេស្ត' : 'Open Test'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Downloaded Image Modal Preview & Direct Download Confirmation
  const renderDownloadModal = () => {
    if (!downloadedModalImage) return null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in no-print"
        onClick={() => setDownloadedModalImage(null)}
      >
        <div 
          className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 font-sans">
                  រូបភាពស្លាកត្រូវបានបង្កើតរួចរាល់!
                </h3>
                <p className="text-[11px] text-slate-500 font-medium font-mono">
                  National Standard CS 001:2000 PNG
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDownloadedModalImage(null)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Label Image Preview Thumbnail */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
            <img 
              src={downloadedModalImage.url} 
              alt="Label Preview" 
              className="max-h-72 w-auto object-contain rounded-xl shadow-md border border-slate-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-slate-600 font-mono break-all bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              📁 {downloadedModalImage.filename}
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              💡 <strong>គន្លឹះ៖</strong> ប្រសិនបើការទាញយកលើកម្មវិធីរុករករបស់អ្នកត្រូវបានរារាំង លោកអ្នកអាចចុចប៊ូតុង <strong>«ទាញយក PNG»</strong> ខាងក្រោម ឬចុចកណ្ដុរស្ដាំ (Right-Click) លើរូបភាព រួចជ្រើសរើស <em>"Save image as..."</em>។
            </p>
          </div>

          {/* Modal Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                const link = document.createElement('a');
                link.href = downloadedModalImage.url;
                link.download = downloadedModalImage.filename;
                link.setAttribute('download', downloadedModalImage.filename);
                document.body.appendChild(link);
                link.click();
                setTimeout(() => document.body.removeChild(link), 500);
                triggerToast('✅ កំពុងទាញយកឯកសារម្ដងទៀត...');
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download size={14} />
              <span>ទាញយក PNG</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const newWindow = window.open();
                if (newWindow) {
                  newWindow.document.write(`<title>${downloadedModalImage.filename}</title><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#0f172a;min-height:100vh;"><img src="${downloadedModalImage.url}" style="max-width:92%;max-height:92vh;border-radius:12px;box-shadow:0 15px 35px rgba(0,0,0,0.5);"/></body>`);
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>បើកទំហំពេញ</span>
            </button>

            <button
              type="button"
              onClick={() => setDownloadedModalImage(null)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center transition cursor-pointer"
            >
              រួចរាល់ (Done)
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (studioMode === 'wizard') {
    return (
      <div className="space-y-6 pb-20 max-w-7xl mx-auto print:!space-y-0 print:!p-0 print:!m-0 print:!max-w-none">
        {/* Top Clean Header with User Info & Mode Switcher */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                ស្តង់ដារជាតិ CS 001
              </span>
              <span className="text-xs font-bold text-slate-600 font-sans">
                ស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
              ស្តង់ដារស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល
            </h1>
            <p className="text-xs text-slate-500 font-sans">
              បំពេញទិន្នន័យមួយផ្ទាំងម្តង តាមលំដាប់លំដោយ ១២ ជំហាន (ឬចុចរំលង) ដើម្បីទទួលបានស្លាក និងបាកូដត្រឹមត្រូវ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* User Profile Pill */}
            {(userName || userPhone) && (
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
                  👤
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 leading-tight">
                    {userName || 'អ្នកប្រើប្រាស់'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {userTitle ? `${userTitle} • ` : ''}{userPhone}
                  </div>
                </div>
                {onOpenGreeting && (
                  <button
                    type="button"
                    onClick={onOpenGreeting}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 ml-1 underline cursor-pointer"
                  >
                    កែប្រែ
                  </button>
                )}
              </div>
            )}

            {/* Switch to Classic Studio Button */}
            <button
              type="button"
              onClick={() => setStudioMode('classic')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              title="ប្ដូរទៅស្ទូឌីយោលម្អិត"
            >
              <Sliders size={14} />
              <span>ស្ទូឌីយោលម្អិត</span>
            </button>
          </div>
        </div>

        {/* Global House Express: 4 Verified QR Codes for Pitch Deck & Print Shop */}
        <div id="pitch-deck-quick-qrs-container" className="scroll-mt-6">
          <PitchDeckQuickQRs 
            onApplyPreset={handleQuickApply}
            onOpenPassport={handleQuickOpenPassport}
            triggerToast={triggerToast}
            onEditIn13Stages={handleEditDedicatedProductIn13Stages}
            activeDedicatedItemId={activeDedicatedItem?.id}
          />
        </div>

        {/* 13-Step Guided Wizard Component */}
        <PackagingStepWizard
          data={wizardData}
          onChange={handleWizardChange}
          onPrint={handlePrint}
          onDownload={handleDownloadImage}
          onSaveToCatalog={handleSaveToCatalog}
          onResetNewProduct={handleResetNewProduct}
          userPhone={contactPhone}
          userName={userName}
          userTitle={userTitle}
          onSwitchToFullStudio={() => setStudioMode('classic')}
          renderLivePreviewNode={renderLiveLabelPreview()}
          isDownloading={isDownloading}
          onOpenCertificate={() => setShowCertificateModal(true)}
          qrDataUrl={qrDataUrl}
          passportFullUrl={passportFullUrl}
          smeCatalog={smeCatalog}
          onSelectCatalogProduct={handlePresetSelect}
          currentStep={wizardCurrentStep}
          onStepChange={setWizardCurrentStep}
          activeDedicatedProduct={activeDedicatedItem}
          onSaveDedicatedProductUpdate={handleSaveDedicatedProductUpdate}
          onReturnToQuickQrs={handleReturnToQuickQrs}
        />

        {/* Modal for Download Confirmation & High-Res Preview */}
        {renderDownloadModal()}
        {renderCertificateModal()}

        {/* Global floating toast notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-950/95 text-white border-2 border-emerald-400 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in max-w-[92vw]">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span className="text-amber-300 font-sans">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Return to 13-Step Wizard Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-4 rounded-3xl shadow-sm flex items-center justify-between gap-3 border border-amber-300">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h4 className="text-sm sm:text-base font-black font-sans">
              កំពុងស្ថិតក្នុងផ្ទាំងបច្ចេកទេសលម្អិត
            </h4>
            <p className="text-xs text-slate-800">
              ចង់ប្តូរទៅកាន់ផ្ទាំងណែនាំ ១៣ ជំហានម្តងមួយៗវិញទេ?
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStudioMode('wizard')}
          className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>បើកផ្ទាំង ១៣ ជំហាន</span>
        </button>
      </div>

      {/* MISTI & ISC National Standard Partner Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 text-blue-300">
            <ShieldCheck size={26} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                ស្តង់ដារជាតិ និងបច្ចេកទេស
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                ✓ CS 001:2000
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white font-sans">
              កម្មវិធីជំនួយបច្ចេកទេសរចនាស្លាកសញ្ញាផលិតផលសម្រាប់សហគ្រាស
            </h3>
            <p className="text-xs text-slate-300 font-sans">
              គំនិតផ្តួចផ្តើមដើម្បីគាំទ្រសហគ្រាសធុនតូច & មធ្យមទូទាំង ២៥ រាជធានី-ខេត្ត ឱ្យទទួលបានស្លាកសញ្ញាត្រឹមត្រូវតាមស្តង់ដារជាតិ និងងាយស្រួលដាក់លក់ក្នុងផ្សារទំនើប។
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="?mode=misti"
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 font-sans"
          >
            <span>តំណភ្ជាប់ផ្ទាល់</span>
          </a>
        </div>
      </div>

      {/* Global House Express: 3 Verified QR Codes for Pitch Deck & Print Shop */}
      <PitchDeckQuickQRs 
        onApplyPreset={handleQuickApply}
        onOpenPassport={handleQuickOpenPassport}
        triggerToast={triggerToast}
        onEditIn13Stages={handleEditDedicatedProductIn13Stages}
        activeDedicatedItemId={activeDedicatedItem?.id}
      />

      {/* 0. Top Universal Video & User Guide Banner for Packaging & Labels */}
      <UniversalSectorVideoGuide 
        sectorKey="packaging"
        onSelectAction={() => {
          handlePresetSelect(PRODUCT_PRESETS[0]);
        }}
      />

      {/* 0.1 Top SME Registration & Telemetry Banner */}
      <SmeRegistrationBanner 
        activeSector="Food Packaging & CS 001 Labels"
        onRegistered={(smeRecord) => {
          setActiveSmeProfile(smeRecord);
          if (smeRecord.smeName && companyName.includes('Mayany Enterprise')) {
            setCompanyName(`${smeRecord.smeName} (Enterprise)`);
            setTrademarkLogoText(smeRecord.smeName.toUpperCase());
          }
        }}
      />
      
      {/* Top Header Banner with MSME Problem Solver Highlight */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={12} className="text-amber-400" />
                <span>ស្តង់ដារជាតិ CS 001</span>
              </span>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full font-sans uppercase tracking-wider flex items-center gap-1">
                <Store size={12} />
                <span>ត្រៀមដាក់លក់គ្រប់ទីផ្សារ</span>
              </span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                រក្សាគុណភាពបានយូរ
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans">
              ស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល
              <span className="block text-lg sm:text-xl font-normal text-amber-300 mt-1">
                ស្តង់ដារស្លាកសញ្ញាវេចខ្ចប់ និងការអនុលោមតាមបទដ្ឋានជាតិ CS 001
              </span>
            </h1>
            
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              ជួយសម្រួលដល់សហគ្រាសធុនតូច & មធ្យម (MSMEs) បំប្លែងកសិផលដុល ទៅជា <strong className="text-amber-300">ផលិតផលសម្រេចវេចខ្ចប់តាមស្តង់ដារត្រឹមត្រូវ សម្រាប់ដាក់លក់គ្រប់ទីផ្សារ រួមមានផ្សារទំនើប (Aeon, Lucky, Chip Mong, Makro), ម៉ាត (Minimarts) និងផ្សារទូទៅ</strong> ជាមួយការធានាសុវត្ថិភាពចំណីអាហារ រក្សាគុណភាពបានយូរ ការបំពេញលក្ខខណ្ឌស្លាកសញ្ញា ២ភាសា (ខ្មែរ-អង់គ្លេស) និងបាកូដ EAN-13។
            </p>
          </div>

          {/* Quick Stats & Supermarket Score Pill */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[200px] shadow-inner text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Supermarket Readiness</span>
            <div className="text-3xl font-black font-mono text-emerald-400 my-1">
              {supermarketScore}%
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              supermarketScore >= 90 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {supermarketScore >= 90 ? '✓ គ្រប់ស្តង់ដារផ្សារទំនើប' : '⚠ មិនទាន់គ្រប់លក្ខខណ្ឌ'}
            </span>
          </div>
        </div>

        {/* 1-Click AI Supermarket Optimizer CTA & Design Theme Styler */}
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles size={16} className="text-amber-400 shrink-0" />
              <span>ចង់ឱ្យ AI ជួយរចនាម៉ូតស្លាកសញ្ញា (Design Aesthetic) និងបំពេញទិន្នន័យ CS 001 ស្វ័យប្រវត្ត?</span>
            </div>
            <button
              onClick={handleAiSupermarketOptimize}
              disabled={aiGenerating}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {aiGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>{aiGenerating ? 'កំពុងរចនាម៉ូតស្វ័យប្រវត្ត...' : '⚡ AI Designer: បង្កើតម៉ូត & ខ្លឹមសារ CS 001'}</span>
            </button>
          </div>

          {/* AI Style Presets Palette */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] text-amber-300 font-sans font-bold">
              <span className="flex items-center gap-1.5">
                <Layout size={13} className="text-amber-400" />
                <span>រចនាប័ទ្មម៉ូតស្លាកសញ្ញា (AI Packaging Label Themes):</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Select Theme Style</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {AI_DESIGN_PRESETS.map((style) => {
                const isActive = labelTheme === style.theme;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setLabelTheme(style.theme);
                      setHeroBadges(style.badgePills);
                      setTrademarkLogoText(style.sampleBrand);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isActive 
                        ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400 text-white' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-amber-400">{style.fontBadge}</span>
                        {isActive && <span className="text-[9px] font-mono text-emerald-400 font-bold">✓ ជ្រើសរើស</span>}
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{style.nameKhmer.split('(')[0]}</p>
                      <p className="text-[9px] text-slate-400 line-clamp-1">{style.name}</p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center gap-1 text-[8px] font-mono text-slate-400">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.accentColor }} />
                      <span className="truncate">{style.bannerCallout}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {aiSuccessMsg && (
          <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{aiSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* PRODUCT PRESET SELECTOR DROPDOWN & SME CUSTOM PRODUCT CATALOG (5-10 Products Support) */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-50/50 p-4 sm:p-5 rounded-3xl border border-amber-300 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider flex items-center gap-1">
                <Layers size={12} />
                <span>SME Product Catalog</span>
              </span>
              <span className="text-xs font-bold text-amber-900 font-sans">
                {PRODUCT_PRESETS.length + smeCatalog.length} មុខទំនិញស្រេចសម្រាប់រចនា
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 font-sans mt-1">
              កាតាឡុកមុខទំនិញសហគ្រាស (SME Multi-Product Catalog • ៥-១០ មុខទំនិញ)
            </h3>
            <p className="text-xs text-slate-600 font-sans">
              ជ្រើសរើសមុខទំនិញពីបញ្ជីទម្លាក់ចុះ (Dropdown) ដើម្បីទាញយកទិន្នន័យវេចខ្ចប់ CS 001 និងបោះពុម្ពស្លាកសញ្ញាភ្លាមៗ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* View Mode Toggle: Dropdown vs Grid */}
            <div className="bg-amber-200/60 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setCatalogViewMode('dropdown')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  catalogViewMode === 'dropdown'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Tag size={12} className="text-amber-600" />
                <span>បញ្ជីទម្លាក់ចុះ (Dropdown)</span>
              </button>
              <button
                type="button"
                onClick={() => setCatalogViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  catalogViewMode === 'grid'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Layout size={12} className="text-amber-600" />
                <span>តារាងកាត (Grid)</span>
              </button>
            </div>

            {/* Quick Save Current Custom Product Button */}
            <button
              type="button"
              onClick={() => {
                const newCustomItem: ProductPreset = {
                  id: `custom_${Date.now()}`,
                  name: `${productNameKhmer.slice(0, 24)} (${netWeight.split(' ')[0]} ${netWeight.split(' ')[1] || 'Pack'})`,
                  category: 'SME Custom Product',
                  containerType: containerType,
                  nameKhmerDefault: productNameKhmer,
                  nameEnglishDefault: productNameEnglish,
                  botanicalOrSubtext: subheadingOrBotanical,
                  defaultNetWeight: netWeight,
                  defaultIngredients: ingredientsList,
                  allergenAdvice: allergenBox,
                  mayContainTraces: mayContainTraces,
                  storageInstructions: storageInstructions,
                  instructionsForUse: instructionsForUse,
                  requiresRefrigeration: requiresRefrigeration,
                  typicalNutrition: nutrition,
                  suggestedPackaging: `${containerType.toUpperCase()} + ${barrierType}`,
                  regulatoryNotes: 'SME Saved Custom Formula',
                  heroBadges: heroBadges,
                  culinaryRecipes: culinaryRecipes,
                  ean13Default: ean13Code,
                  shelfLifeMonths: shelfLifeMonths,
                  barrierTech: barrierType
                };

                const updatedCatalog = [newCustomItem, ...smeCatalog.filter(item => item.nameKhmerDefault !== productNameKhmer)];
                setSmeCatalog(updatedCatalog);
                localStorage.setItem('cashewtrace_sme_custom_catalog', JSON.stringify(updatedCatalog));
                setAiSuccessMsg(`✓ បានរក្សាទុកមុខទំនិញ "${productNameKhmer.slice(0, 30)}" ក្នុងកាតាឡុកសហគ្រាសដោយជោគជ័យ!`);
                setTimeout(() => setAiSuccessMsg(''), 4000);
              }}
              className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={13} />
              <span>+ រក្សាទុកមុខទំនិញថ្មី (Save Product)</span>
            </button>
          </div>
        </div>

        {/* PRIMARY DROPDOWN SELECTOR */}
        <div className="space-y-2.5">
          <div className="relative">
            <label htmlFor="sme-product-catalog-select" className="block text-xs font-bold text-slate-800 mb-1 font-sans">
              ជ្រើសរើសមុខទំនិញសម្រាប់រចនាស្លាកសញ្ញា (Select Product Ready to Pack & Label):
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-amber-600">
                <Box size={18} />
              </div>
              <select
                id="sme-product-catalog-select"
                value={selectedPresetId}
                onChange={(e) => {
                  const val = e.target.value;
                  const foundPreset = [...PRODUCT_PRESETS, ...smeCatalog].find(p => p.id === val);
                  if (foundPreset) {
                    handlePresetSelect(foundPreset);
                  }
                }}
                className="w-full bg-white text-slate-950 font-sans font-bold text-xs sm:text-sm pl-10 pr-10 py-3 rounded-2xl border-2 border-amber-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition cursor-pointer appearance-none"
              >
                {/* 1. Trade & Export Sample 50g packs */}
                <optgroup label="★ កញ្ចប់គំរូ ៥០g សម្រាប់ផ្សព្វផ្សាយពាណិជ្ជកម្ម & នាំចេញ (50g Export Sample Packs)">
                  {PRODUCT_PRESETS.filter(p => p.category.includes('50g Sample Pack') || p.id.includes('50g-') || p.id.includes('sample-50g')).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 2. Artisan Coated Cashews (6-month Natural Shelf Life) */}
                <optgroup label="🥜 គ្រាប់ស្វាយចន្ទីស្រោប & អាហារសម្រន់ប្រណិត (Artisan Coated Snacks - 6 Months)">
                  {PRODUCT_PRESETS.filter(p => p.category === 'Artisan Coated Gourmet Snack').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 3. Dried Fruits & Chips */}
                <optgroup label="🥭 ផ្លែឈើកែច្នៃ & សម្ងួត (Dried Fruits & Artisan Snacks)">
                  {PRODUCT_PRESETS.filter(p => p.category === 'Dried Fruits & Artisan Snacks').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 4. Jasmine Rice & Grains */}
                <optgroup label="🌾 អង្ករផ្ការំដួល & ធញ្ញជាតិខ្មែរ (Jasmine Rice & Grains)">
                  {PRODUCT_PRESETS.filter(p => p.category === 'Jasmine Rice & Grains').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 5. Honey, Palm Sugar & Condiments */}
                <optgroup label="🍯 ទឹកឃ្មុំព្រៃ ស្ករត្នោត & ទឹកត្រី (Honey, Palm Sugar & Condiments)">
                  {PRODUCT_PRESETS.filter(p => p.category === 'Honey, Palm Sugar & Condiments').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 6. Coffee, Herbal Tea & Superfoods */}
                <optgroup label="☕ កាហ្វេមណ្ឌលគិរី តែ & ភេសជ្ជៈសុខភាព (Coffee, Herbal Tea & Superfoods)">
                  {PRODUCT_PRESETS.filter(p => p.category === 'Coffee, Herbal Tea & Superfoods').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 7. Supermarket Retail Packs */}
                <optgroup label="🏪 កញ្ចប់លក់ក្នុងផ្សារទំនើប (Supermarket Ready Retail Packs)">
                  {PRODUCT_PRESETS.filter(p => p.category === 'Retail Supermarket Pack').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 8. Spreads & Spices */}
                <optgroup label="🧈 ប័រ & គ្រឿងទេស (Spreads & Seasoning)">
                  {PRODUCT_PRESETS.filter(p => p.category === 'Spreads & Condiments' || p.category === 'Spices & Seasoning').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 9. Micro Retail Snacks $0.25 */}
                <optgroup label="🪙 កញ្ចប់ខ្នាតតូច Micro $0.25 (Small Retail Snacks)">
                  {PRODUCT_PRESETS.filter(p => p.category.includes('SMALL RETAIL') || p.category.includes('Small Retail') || p.category === 'Small Retail Snack ($0.25)').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 10. Traditional Meats & Fermented Foods */}
                <optgroup label="🐟 សាច់កែច្នៃ & ផលិតផលប្រពៃណី (Processed & Fermented Foods)">
                  {PRODUCT_PRESETS.filter(p => p.category.includes('TRADITIONAL') || p.category.includes('FERMENTED') || p.category === 'Traditional Processed Meat/Fish' || p.category === 'Fermented Foods & Pastes').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 11. Commercial B2B Bulk */}
                <optgroup label="🏢 ម្សៅដុំខ្នាតពាណិជ្ជកម្ម (Commercial B2B Bulk)">
                  {PRODUCT_PRESETS.filter(p => p.category.includes('COMMERCIAL') || p.category.includes('Commercial') || p.category === 'Commercial B2B Bulk').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.defaultNetWeight.split('(')[0]} [{p.shelfLifeMonths} ខែ]
                    </option>
                  ))}
                </optgroup>

                {/* 8. SME Custom Saved Products */}
                {smeCatalog.length > 0 && (
                  <optgroup label="📂 មុខទំនិញផ្ទាល់ខ្លួនដែលបានរក្សាទុក (SME Custom Saved Products)">
                    {smeCatalog.map(p => (
                      <option key={p.id} value={p.id}>
                        ★ {p.nameKhmerDefault.split('(')[0]} — {p.defaultNetWeight} (SME Custom)
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              <div className="absolute right-3.5 pointer-events-none text-slate-500 flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                  SELECT
                </span>
                <ChevronDown size={18} className="text-amber-700" />
              </div>
            </div>
          </div>

          {/* ACTIVE PRODUCT READY SNAPSHOT BADGE */}
          {activePreset && (
            <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-300/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>Ready to Pick & Label</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {activePreset.category}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">
                    {netWeight}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  {productNameKhmer}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium">
                  {productNameEnglish} • <span className="font-mono text-emerald-800 font-bold">{activePreset.shelfLifeMonths} Months Shelf-Life</span> • <span className="font-mono text-slate-500">EAN: {ean13Code}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Packaging Type</span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[200px] block">
                    {activePreset.suggestedPackaging.split('with')[0]}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Check size={18} />
                </div>
              </div>
            </div>
          )}

          {/* 50g Window Pouch Fast Action Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white p-3.5 rounded-2xl border border-amber-500/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300 font-sans">
                  រចនាស្លាកកញ្ចប់បាតឈរ ៥០g (Top Brand Logo + Bottom QR Code Label)
                </h4>
                <p className="text-[10.5px] text-slate-300">
                  រចនាជាពិសេសសម្រាប់កញ្ចប់តូច (១៧ គ្រាប់) • ៣ រសជាតិ × ១០០ កញ្ចប់ = ៣០០ កញ្ចប់សរុប
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewTab('window-pouch-50g')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
            >
              <Eye size={13} />
              <span>បើកម៉ូឌុល 50g Standing Pouch</span>
            </button>
          </div>

          {/* Custom SME Saved Products Quick Bar if available */}
          {smeCatalog.length > 0 && (
            <div className="p-2.5 bg-amber-100/60 border border-amber-200 rounded-xl flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1 mr-1">
                <FolderHeart size={13} className="text-amber-700" />
                <span>មុខទំនិញផ្ទាល់ខ្លួន:</span>
              </span>
              {smeCatalog.map((item) => (
                <div key={item.id} className="flex items-center bg-white border border-amber-300 rounded-lg pl-2 pr-1 py-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(item)}
                    className="text-[11px] font-bold text-slate-800 hover:text-amber-700 truncate max-w-[150px] cursor-pointer"
                  >
                    {item.nameKhmerDefault.split('(')[0]}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = smeCatalog.filter(c => c.id !== item.id);
                      setSmeCatalog(filtered);
                      localStorage.setItem('cashewtrace_sme_custom_catalog', JSON.stringify(filtered));
                    }}
                    title="Delete product"
                    className="ml-1 p-0.5 text-slate-400 hover:text-red-600 cursor-pointer rounded"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXPANDED CARD GRID VIEW (Optional when toggled) */}
        {catalogViewMode === 'grid' && (
          <div className="pt-3 border-t border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>ផ្ទាំងកាតមុខទំនិញទាំងអស់ ({PRODUCT_PRESETS.length} មុខ):</span>
              <span className="text-[10px] font-mono text-slate-500">Click any card to select</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRODUCT_PRESETS.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-2 ring-amber-500/30' 
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                    }`}
                  >
                    {preset.id === 'cashew-sesame-cracker-35g' && (
                      <span className="absolute -top-2 right-3 bg-amber-500 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        $0.25 PACK (MICRO)
                      </span>
                    )}
                    {preset.id === 'cashew-powder-200g' && (
                      <span className="absolute -top-2 right-3 bg-emerald-500 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        SUPERMARKET READY
                      </span>
                    )}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span className="uppercase">{preset.category}</span>
                        <span className="font-bold text-amber-700">{preset.defaultNetWeight.split(' ')[0]} {preset.defaultNetWeight.split(' ')[1]}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-950 leading-snug line-clamp-2">
                        {preset.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {preset.suggestedPackaging}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono">
                      <span className="text-emerald-700 font-semibold">{preset.shelfLifeMonths} Mo. Shelf-Life</span>
                      <ChevronRight size={12} className={isSelected ? "text-amber-600 font-bold" : "text-slate-400"} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Official Live Product Matrix for Mayany Enterprise (Sizes: WW180, WS, LSP | Flavors: Pepper 5%, Pepper 3%, Sugar, Chili | Pkg: 50g, 100g, 150g) */}
      <MayanyProductMatrixSelector
        selectedGrade={mayanyGrade}
        onSelectGrade={(g) => handleUpdateMayanyMatrix(g, mayanyFlavor, mayanyPackaging)}
        selectedFlavor={mayanyFlavor}
        onSelectFlavor={(f) => handleUpdateMayanyMatrix(mayanyGrade, f, mayanyPackaging)}
        selectedPackaging={mayanyPackaging}
        onSelectPackaging={(p) => handleUpdateMayanyMatrix(mayanyGrade, mayanyFlavor, p)}
        onOpenFtcModal={() => setShowFtcModal(true)}
      />

      {/* MAIN DUAL COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Form & Supermarket Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Supermarket Shelf-Life Booster & Packaging Engineering Card */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50/40 p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-100 pb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950 font-sans">
                    Shelf-Life Booster & Barrier Engineering (វិស្វកម្មវេចខ្ចប់ពន្យារគុណភាពផលិតផល)
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    ដោះស្រាយបញ្ហាឆាប់ខូច អុកស៊ីតកម្ម ធុំប្រេង និងសំណើម សម្រាប់គ្រប់ប្រភេទកញ្ចប់ ថង់ ដប កំប៉ុង និងការវេចខ្ចប់សហគ្រាស
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                Target: {shelfLifeMonths} Months Shelf-Life
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Container Material & Size Dropdown */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block font-sans">
                  សម្ភារៈ & ទំហំវេចខ្ចប់ (Container Material & Size):
                </label>
                <select
                  value={containerType}
                  onChange={(e) => setContainerType(e.target.value as ContainerType)}
                  className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:bg-white cursor-pointer"
                >
                  {/* Standup Pouches & Bags */}
                  <optgroup label="🛍️ ថង់ & កញ្ចប់បិទជិត (Standup Pouches & Bags)">
                    <option value="standup-pouch-50g">ថង់គំរូ ៥០g សន្លឹកអាលុយមីញ៉ូម / ក្រដាស (50g Sample Foil/Paper Pouch)</option>
                    <option value="pouch-micro-35g">កញ្ចប់តូច ៣៥g ស្រទាប់លោហធាតុ ១,០០០៛ (35g Mini Sachet - $0.25)</option>
                    <option value="pouch-snack-45g">ថង់ហោប៉ៅ ៤៥g មានខ្សែរូត (45g Pocket Zip Pouch)</option>
                    <option value="standup-pouch-100g">ថង់ឈរ ១០០g ស្រទាប់រលោងមានខ្សែរូត (100g Standup Matte Zipper Pouch)</option>
                    <option value="standup-pouch-250g">ថង់ឈរ ២៥០g សន្លឹកអាលុយមីញ៉ូមច្រើនជាន់ (250g Multi-Layer Foil Zipper Pouch)</option>
                    <option value="standup-pouch-500g">ថង់របាំងការពារ ៥០០g មានចង្អូរហែក (500g Standup Barrier Pouch)</option>
                    <option value="standup-pouch-1kg">ថង់ឈរខ្នាតធំ ១kg ធន់មាំខ្ពស់ (1kg Heavy-Duty Standup Pouch)</option>
                    <option value="kraft-pouch-250g">ថង់ក្រដាសក្រាហ្វ ២៥០g ស្រទាប់ក្នុងការពារខ្យល់ (250g Eco Kraft Pouch)</option>
                    <option value="vacuum-retort-250g">ថង់បូមខ្យល់ ២៥០g ធន់កម្ដៅចម្អិនខ្ពស់ (250g Retort High-Barrier Vacuum Pouch)</option>
                    <option value="vacuum-retort-500g">ថង់បូមខ្យល់ ៥០០g សម្រាប់សាច់ក្រក (500g Retort Vacuum Pouch - Sausages)</option>
                  </optgroup>

                  {/* Jars, Tubs & Cans */}
                  <optgroup label="🫙 កំប៉ុង កែវ & ធុង (Jars, Tubs & Cans)">
                    <option value="pp-jar-200g">កំប៉ុងជ័រ PP ២០០g កម្រិតអាហារដ្ឋាន PP 05 (200g Food-Grade PP Cylinder Jar)</option>
                    <option value="pp-tub-150g">ធុងជ័រ PP ១៥០g មានគន្លឹះសុវត្ថិភាព (150g PP Tamper-Evident Deli Tub)</option>
                    <option value="pp-tub-500g">ធុងជ័រ PP ៥០០g ថ្លា ឬ ស្រអាប់ (500g PP Clear/Frosted Food Tub)</option>
                    <option value="pet-canister-300g">កំប៉ុងជ័រ PET ៣០០g មានក្រវិលទាញបើកងាយ (300g Clear PET Canister)</option>
                    <option value="glass-jar-180g">កំប៉ុងកែវ ៦ជ្រុង ១៨០g ប្រណិត (180g Hexagonal Glass Jar)</option>
                    <option value="glass-jar-350g">កំប៉ុងកែវមូល ៣៥០g គម្របបិទជិតខ្យល់ (350g Round Glass Jar)</option>
                    <option value="glass-jar-500g">កំប៉ុងកែវ ៥០០g សម្រាប់ត្រាំ និងរក្សាទុក (500g Glass Preserve Jar)</option>
                    <option value="spice-jar-100g">កំប៉ុងកែវគ្រឿងទេស ១០០g មានក្បាលកិន (100g Glass Spice Jar with Grinder)</option>
                    <option value="tin-can-150g">កំប៉ុងដែក ១៥០g គ្មានថ្នេរមានក្រវិលទាញ (150g Metal Seamless Tin Can)</option>
                  </optgroup>

                  {/* Glass Bottles */}
                  <optgroup label="🍾 ដបកែវ & វត្ថុរាវ (Bottles & Liquids)">
                    <option value="glass-bottle-250ml">ដបកែវទឹកជ្រលក់ ២៥០ml មានក្បាលចាក់ (250ml Glass Sauce Bottle)</option>
                    <option value="glass-bottle-500ml">ដបកែវប្រេង ឬ ទឹកស៊ីរ៉ូ ៥០០ml (500ml Glass Oil / Syrup Bottle)</option>
                  </optgroup>

                  {/* Commercial Bulk */}
                  <optgroup label="📦 ការវេចខ្ចប់ខ្នាតដុំ (Commercial & Bulk Logistics)">
                    <option value="bulk-sack-5kg">បាវក្រដាសក្រាហ្វ ៥kg មានវ៉ាល់បញ្ចេញឧស្ម័ន (5kg Multi-wall Kraft Pouch)</option>
                    <option value="bulk-sack-10kg">បាវក្រដាសក្រាហ្វ ១០kg មានស្រទាប់ PE (10kg Multi-wall Kraft Bag)</option>
                    <option value="bulk-sack-20kg">បាវក្រដាសក្រាហ្វពាណិជ្ជកម្ម ២០kg (20kg Commercial Multi-wall Sack)</option>
                  </optgroup>
                </select>
                <span className="text-[9px] text-slate-500 block truncate">
                  {CONTAINER_CATALOG[containerType]?.desc || 'Standard barrier food packaging container'}
                </span>
              </div>

              {/* Cap Liner / Sealing Technology Dropdown */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block font-sans">
                  បច្ចេកវិទ្យាបិទជិត & គម្រប (Cap Liner & Sealing Tech):
                </label>
                <select
                  value={barrierType}
                  onChange={(e) => setBarrierType(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:bg-white cursor-pointer"
                >
                  <optgroup label="🔒 គម្របបិទជិតខ្យល់ & កម្ដៅ (Hermetic Jar/Tub Seals)">
                    <option value="induction-foil">បន្ទះអាលុយមីញ៉ូមបិទកម្ដៅ Induction (Induction Heat-Seal Foil)</option>
                    <option value="vented-induction">បន្ទះអាលុយមីញ៉ូមមានរន្ធដកដង្ហើមសម្រាប់ប្រហុក (Induction Vented Foil Liner)</option>
                    <option value="pressure-seal">បន្ទះស្នោបិទស្អិតដោយសម្ពាធ PS-22 (Pressure Sensitive Foam)</option>
                    <option value="plastisol-lug">គម្របដែកកៅស៊ូ Plastisol ចំហុយកម្ដៅ (Plastisol Lug Cap Liner)</option>
                  </optgroup>

                  <optgroup label="⚡ ថង់ & កញ្ចប់ខ្វះខ្យល់ (Pouch Barrier & Retort Closures)">
                    <option value="barrier-zipper">ខ្សែរូតការពារខ្យល់ និងបិទកម្ដៅមាត់ថង់ (Metallized Foil Zipper + Heat Seal)</option>
                    <option value="nitrogen-flush">បច្ចេកវិទ្យាបាញ់ឧស្ម័នអាសូត N₂ &gt; 98% (Nitrogen Flush MAP)</option>
                    <option value="vacuum-retort">បូមខ្យល់ និងសម្លាប់មេរោគកម្ដៅ ១២១°C (Vacuum Retort Heat-Seal)</option>
                    <option value="ultrasonic-seal">បិទជិតដោយរលកសំឡេង Ultrasonic គ្មានកម្ដៅ (Ultrasonic Hermetic Seal)</option>
                  </optgroup>

                  <optgroup label="🛡️ គម្របដែក & សុវត្ថិភាព (Metal Cans & Security Seals)">
                    <option value="easy-open-pull">គម្របដែកទាញបើកងាយស្រួល EZO (Aluminium Easy-Open Can End)</option>
                    <option value="tamper-shrink">ស្រោមផ្លាស្ទិកកម្ដៅរុំកគម្របសុវត្ថិភាព (Tamper-Evident Heat Shrink Band)</option>
                  </optgroup>

                  <optgroup label="🏢 ការវេចខ្ចប់ខ្នាតធំ (Bulk & Sacks)">
                    <option value="inner-pe-stitch">ដេរបិទមាត់បាវ + ស្រទាប់ PE 80µm ខាងក្នុង (Stitched + PE Inner Liner)</option>
                  </optgroup>

                  <optgroup label="⚪ គម្របធម្មតា">
                    <option value="none">គម្របមួលធម្មតា (Standard Screw Cap)</option>
                  </optgroup>
                </select>
                <span className="text-[9px] text-slate-500 block">
                  {barrierType === 'vented-induction' ? 'បញ្ចេញឧស្ម័ន fermentation ដោយមិនឱ្យខ្យល់ខាងក្រៅចូល' :
                   barrierType === 'nitrogen-flush' ? 'បណ្តេញអុកស៊ីហ្សែនចេញ N₂ > 98% ការពារធុំប្រេង' :
                   barrierType === 'vacuum-retort' ? 'ធន់នឹងកម្ដៅចំហុយ ១២១°C សម្លាប់មេរោគ ១០០%' :
                   barrierType === 'plastisol-lug' ? 'ស្រូបខ្យល់បង្កើត vacuum ពេលក្តៅ' :
                   'Blocks 100% moisture, dust & atmospheric oxygen ingress'}
                </span>
              </div>

              {/* Oxygen Scavenger / Absorber Checkbox */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block font-sans">
                  Oxygen / Moisture Absorber
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="o2-check"
                    checked={hasOxygenAbsorber}
                    onChange={(e) => setHasOxygenAbsorber(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="o2-check" className="text-xs text-slate-800 font-medium cursor-pointer">
                    Food-Grade Oxygen Absorber (50cc Sachet)
                  </label>
                </div>
                <span className="text-[9px] text-slate-500 block">
                  ស្រូបយកអុកស៊ីហ្សែនសេសសល់ &lt;0.01% ការពារការធុំប្រេង
                </span>
              </div>
            </div>

            <div className="bg-amber-100/70 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11.5px] leading-relaxed font-sans space-y-1.5">
                <div>
                  <strong>សារៈសំខាន់នៃវិស្វកម្មវេចខ្ចប់ (Why Barrier Packaging Matters):</strong> គ្រាប់ស្វាយចន្ទី ម្សៅ និងផលិតផលកែច្នៃមានផ្ទុកជាតិខ្លាញ់ធម្មជាតិល្អ (Unsaturated Fatty Acids) និងសារធាតុចិញ្ចឹមខ្ពស់។ ប្រសិនបើគ្មានការបិទជិតដោយ <span className="font-semibold text-amber-950">Induction Foil / Barrier Zipper</span> និងការការពារអុកស៊ីតកម្មទេ ខ្យល់និងសំណើមនឹងធ្វើឱ្យផលិតផលធុំប្រេងក្នុងរយៈពេល ២-៣ខែ។ ជាមួយការជ្រើសរើសសម្ភារៈត្រឹមត្រូវខាងលើ ផលិតផលអាចរក្សាគុណភាព ពណ៌ ក្លិន និងរសជាតិបានរហូតដល់ <strong className="text-emerald-800 font-bold font-mono">{shelfLifeMonths} ខែ (Months)</strong> យ៉ាងរឹងមាំលើធ្នើផ្សារ!
                </div>
                
                {/* Food Safety & Packaging Size Reassurance */}
                <div className="pt-1.5 border-t border-amber-300/80 text-[11px] text-amber-950 bg-white/60 p-2 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>🛡️ សុវត្ថិភាពសុខភាព និងទំហំកញ្ចប់ 50g / 100g (Food Safety & Sizing Clarity):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[10.5px]">
                    <li><strong>គ្មានផលប៉ះពាល់សុខភាព (100% Safe):</strong> បច្ចេកវិទ្យា Foil Barrier, ឧស្ម័ននីត្រូហ្សែន (N₂ Gas), ឬកញ្ចប់ស្រូបអុកស៊ីហ្សែន (Food-Grade Oxygen Absorber) គឺជាវិធីសាស្ត្ររូបវិទ្យាធម្មជាតិ <strong>គ្មានជាតិគីមី និងមិនជ្រាបចូលអាហារឡើយ</strong>។</li>
                    <li><strong>ទំហំ 50g / 100g សម្រាប់កញ្ចប់តូច:</strong> សម្រាប់កញ្ចប់ 50g គ្រាន់តែប្រើថង់ Foil 3 ស្រទាប់ (PET/AL/PE) និងកញ្ចប់ស្រូបតូច 20cc–30cc (ឬបិទកម្ដៅធម្មជាតិ) គឺអាចរក្សាភាពស្រួយបាន ៦ ខែ ដោយមិនបាច់ប្រើសារធាតុរក្សាទុកគីមី (No INS preservatives needed)។</li>
                    <li><strong>ចំណាំសុវត្ថិភាព:</strong> លើកញ្ចប់ដែលមានដាក់កញ្ចប់ស្រូបខ្យល់ ត្រូវតែមានសរសេរអក្សរច្បាស់លាស់ <em>"ហាមបរិភោគ / DO NOT EAT"</em> នៅលើកញ្ចប់តូចនោះ។</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Bilingual CS 001:2000 Mandatory Form (12 Regulated Items) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
                  <FileText size={16} className="text-amber-600" />
                  <span>ព័ត៌មានលើស្លាកវេចខ្ចប់ CS 001:2000 (Label Details & Customization)</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  ស្តង់ដារជាតិកម្ពុជាសម្រាប់ការវេចខ្ចប់ (បំពេញតាមអ្វីដែលលោកអ្នកមាន — មិនទាមទារបង្ខំឡើយ)
                </p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold self-start sm:self-auto">
                MSME Friendly • 100% Auto QR
              </span>
            </div>

            {/* MSME Flexible Notice Banner */}
            <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950 font-sans">
              <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <span className="font-bold block text-emerald-900">
                  🌱 ភាពបត់បែនសម្រាប់សហគ្រាសខ្នាតតូច & ស្តាតអាប់ (MSME & Startup Friendly):
                </span>
                <p className="text-[11px] text-emerald-800">
                  ប្រសិនបើសហគ្រាសមិនទាន់មាន <strong>លេខបាកូដ (Barcode)</strong>, មិនទាន់មាន <strong>លេខបញ្ជីការ ចបផ</strong> ឬមិនទាន់មាន <strong>វិញ្ញាបនបត្រស្តង់ដារ</strong> — <strong>គ្មានបញ្ហាទាល់តែសោះ!</strong> កម្មវិធីនៅតែបង្កើតកូដ QR និងស្លាកបោះពុម្ពស្វ័យប្រវត្តភ្លាមៗ ទៅតាមព័ត៌មានជាក់ស្តែងដែលលោកអ្នកមាន។
                </p>
              </div>
            </div>

            {/* SME Brand Logo Upload & Direct Download Hub (Above Product Name) */}
            <div className="p-4 bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-950 text-white rounded-xl border border-amber-500/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Hidden File Input for Phone Gallery / Camera / PC Logo Upload */}
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white p-1 border-2 border-amber-400 shadow-md flex items-center justify-center shrink-0 overflow-hidden relative group">
                  <img
                    src={customBrandLogo}
                    alt="Brand Logo"
                    className="w-full h-full object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    title="ចុចដើម្បីប្តូរ Logo"
                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[8px] font-bold transition cursor-pointer"
                  >
                    <Upload size={14} className="text-amber-400" />
                    <span>ប្តូរ Logo</span>
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded font-mono uppercase">
                      Brand Logo Hub
                    </span>
                    <span className="text-xs font-bold text-amber-300 font-sans">
                      {customBrandLogo === '/mayany_official_logo.jpg' ? 'ម៉ាកសញ្ញាផ្លូវការ Mayany Enterprise' : 'ម៉ាកសញ្ញាផ្ទាល់ខ្លួនរបស់សហគ្រាស (Custom SME Logo)'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-200 font-sans mt-0.5">
                    សហគ្រាសនីមួយៗអាចបញ្ចូល Logo ផ្ទាល់ខ្លួនពីទូរស័ព្ទ ឬកុំព្យូទ័រ ឬទាញយក Logo ច្បាស់សម្រាប់បោះពុម្ព
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer font-sans"
                >
                  <Upload size={13} />
                  <span>ផ្ទុកឡើង Logo (Upload)</span>
                </button>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadLogo}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow cursor-pointer font-sans"
                >
                  <Download size={13} />
                  <span>ទាញយក Logo</span>
                </button>

                {/* Reset Button (If custom logo loaded) */}
                {customBrandLogo !== '/mayany_official_logo.jpg' && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    title="ត្រឡប់មកប្រើ Mayany Logo ដើម"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-2 rounded-xl text-xs transition flex items-center gap-1 cursor-pointer font-sans border border-slate-600"
                  >
                    <RefreshCw size={12} />
                    <span>Mayany Logo</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. Product Name (Khmer & English) */}
            <div className="space-y-3 p-4 sm:p-5 bg-white rounded-2xl border-2 border-amber-600/80 shadow-xs">
              <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-mono font-bold">1</span>
                  <span>ឈ្មោះផលិតផលទ្វេភាសា (Product Names: Khmer & English)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CS 001 Rule 4.1</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1 font-sans">
                    <span>ឈ្មោះផលិតផលជាភាសាខ្មែរ (Khmer Product Name)</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {productNameKhmer.trim() && (
                      <button
                        type="button"
                        onClick={() => {
                          const res = smartTranslateKhmerAgro(productNameKhmer);
                          setProductNameEnglish(res.english);
                          setSubheadingOrBotanical(res.botanical);
                        }}
                        title="បកប្រែជាភាសាអង់គ្លេស & ឈ្មោះវិទ្យាសាស្ត្រស្វ័យប្រវត្ត"
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-md text-[10px] transition flex items-center gap-1 cursor-pointer font-sans"
                      >
                        <Sparkles size={11} className="text-amber-600" />
                        <span>បង្កើតស្វ័យប្រវត្ត (Auto-Generate)</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStartListening('productKhmer', setProductNameKhmer)}
                      className={`p-1 rounded-md text-xs flex items-center gap-1 cursor-pointer ${
                        isListening === 'productKhmer' ? 'bg-red-100 text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Mic size={13} />
                      <span className="text-[10px]">{isListening === 'productKhmer' ? 'Listening...' : 'Voice'}</span>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={productNameKhmer}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProductNameKhmer(val);
                    // Proactively suggest if English name matches previous auto-translation or default
                    const res = smartTranslateKhmerAgro(val);
                    if (val.trim()) {
                      if (!productNameEnglish || productNameEnglish === 'Cashew Kernel Coated Pepper' || productNameEnglish === 'Cashew Kernel Coated Kampot Pepper' || productNameEnglish.includes('Coated Cashew Kernels')) {
                        setProductNameEnglish(res.english);
                        setSubheadingOrBotanical(res.botanical);
                      }
                    }
                  }}
                  placeholder="ឧ. គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅGIកំពត (GI Kampot Black Pepper Coated Cashew Kernels)"
                  onBlur={() => {
                    if (productNameKhmer.trim() && !/[\u1780-\u17FF]/.test(productNameKhmer)) {
                      setProductNameKhmer(ensureKhmerProductName(productNameKhmer, productNameEnglish));
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans font-medium"
                />

                {/* Auto-Detection: If user accidentally typed English into the Khmer Name field */}
                {productNameKhmer.trim() && !/[\u1780-\u17FF]/.test(productNameKhmer) && (
                  <div className="mt-2 p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-2 text-xs">
                    <div className="text-amber-950 font-sans text-[11px]">
                      <span className="font-bold">⚠️ CS 001:2000 តម្រូវឱ្យឈ្មោះទី ១ ជាភាសាខ្មែរ៖</span>{' '}
                      <span>បម្លែងទៅជា «{ensureKhmerProductName(productNameKhmer, productNameEnglish)}»</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductNameKhmer(ensureKhmerProductName(productNameKhmer, productNameEnglish))}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shrink-0 cursor-pointer shadow-2xs"
                    >
                      ប្តូរជាភាសាខ្មែរភ្លាម
                    </button>
                  </div>
                )}

                {/* Smart Suggestion Live Banner for MSMEs */}
                {productNameKhmer.trim() && (
                  <div className="mt-2 p-2.5 bg-emerald-50/80 border border-emerald-300/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5 font-sans">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900">
                        <Sparkles size={13} className="text-emerald-600 shrink-0" />
                        <span>💡 ប្រព័ន្ធជំនួយការបកប្រែ & ឈ្មោះវិទ្យាសាស្ត្រ (Auto-Suggestions for MSMEs):</span>
                      </div>
                      <div className="text-[10.5px] text-slate-700 space-y-0.5">
                        <div>
                          <strong className="text-slate-900">English Name:</strong>{' '}
                          <span className="text-emerald-800 font-semibold">{smartTranslateKhmerAgro(productNameKhmer).english}</span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Botanical:</strong>{' '}
                          <span className="text-emerald-800 italic">{smartTranslateKhmerAgro(productNameKhmer).botanical}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const res = smartTranslateKhmerAgro(productNameKhmer);
                        setProductNameEnglish(res.english);
                        setSubheadingOrBotanical(res.botanical);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition shrink-0 cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 size={13} />
                      <span>អនុវត្តឈ្មោះ & វិទ្យាសាស្ត្រ</span>
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-slate-500 mt-1 font-sans">
                  * តាមបទប្បញ្ញត្តិ CS 001 អក្សរខ្មែរត្រូវតែធំជាង ឬស្មើនឹងអក្សរឡាតាំង (English) នៅលើផ្ទៃខាងមុខនៃកញ្ចប់។
                </p>
              </div>

              {/* English & Botanical Section with Comprehensive Explainer Card & Smart Suggestions */}
              <div className="space-y-2 pt-1 border-t border-slate-200">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>English Product Name & Botanical Subtitle (ឈ្មោះជាភាសាអង់គ្លេស & វិទ្យាសាស្ត្រ)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleStartListening('productEnglish', setProductNameEnglish)}
                    className={`p-1 rounded-md text-xs flex items-center gap-1 cursor-pointer ${
                      isListening === 'productEnglish' ? 'bg-red-100 text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Mic size={13} />
                    <span className="text-[10px]">{isListening === 'productEnglish' ? 'Listening...' : 'Voice'}</span>
                  </button>
                </div>

                {/* Educational Explainer Box for SME */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 font-sans">
                    <Lightbulb size={14} className="text-amber-600 shrink-0" />
                    <span>💡 ការពន្យល់ & ការណែនាំ (What to write in these boxes):</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-sans text-slate-700">
                    <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                      <strong className="text-slate-900 block font-bold mb-0.5">
                        ១. English Product Name (ប្រអប់ឆ្វេង):
                      </strong>
                      <span>
                        ឈ្មោះពាណិជ្ជកម្មជាភាសាអង់គ្លេស សម្រាប់អ្នកទិញបរទេស និងការនាំចេញ (ឧ. <em>Cashew Kernel Coated Pepper</em>, <em>Cashew Kernel Coated Chili</em>, <em>Cashew Kernel Sugar Coated</em>)។
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                      <strong className="text-slate-900 block font-bold mb-0.5">
                        ២. Botanical Subtitle / Descriptor (ប្រអប់ស្តាំ):
                      </strong>
                      <span>
                        ឈ្មោះរុក្ខសាស្ត្រវិទ្យាសាស្ត្រឡាតាំង (ឧ. <em>Anacardium occidentale</em>) ឬអត្ថបទរៀបរាប់ពីប្រភព និងលក្ខណៈពិសេសកសិផល (ឧ. <em>Selected Cambodian Cashews • Artisanal GI Kampot Pepper Coated</em>)។
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Dropdown Preset for Botanical & Agro Descriptors */}
                <div className="bg-slate-100 p-2 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <BookOpen size={13} className="text-amber-600" />
                    <span>ជ្រើសរើសគំរូឈ្មោះវិទ្យាសាស្ត្រ (Botanical Templates):</span>
                  </div>
                  <select
                    onChange={(e) => {
                      const selected = BOTANICAL_DESCRIPTOR_TEMPLATES.find(t => t.labelKhmer === e.target.value);
                      if (selected) {
                        setProductNameEnglish(selected.englishDefault);
                        setSubheadingOrBotanical(selected.botanicalSubtitle);
                        setProductNameKhmer(selected.labelKhmer);
                      }
                    }}
                    defaultValue=""
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="" disabled>-- ជ្រើសរើសគំរូផលិតផល & ឈ្មោះវិទ្យាសាស្ត្រ --</option>
                    {BOTANICAL_DESCRIPTOR_TEMPLATES.map((tmpl, idx) => (
                      <option key={idx} value={tmpl.labelKhmer}>
                        {tmpl.labelKhmer}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Two Input Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-600 mb-1">
                      ឈ្មោះជាភាសាអង់គ្លេស (English Product Name)
                    </span>
                    <input
                      type="text"
                      value={productNameEnglish}
                      onChange={(e) => setProductNameEnglish(e.target.value)}
                      placeholder="e.g. Cashew Kernel Coated Pepper"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-600 mb-1">
                      ឈ្មោះវិទ្យាសាស្ត្រ / អត្ថបទរៀបរាប់ (Botanical Subtitle)
                    </span>
                    <input
                      type="text"
                      value={subheadingOrBotanical}
                      onChange={(e) => setSubheadingOrBotanical(e.target.value)}
                      placeholder="e.g. Selected Cambodian Cashews (Anacardium occidentale)"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2 & 3. Net Contents & Barcode & Batch */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-slate-700/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-mono font-bold">2</span>
                  <span>ទម្ងន់សុទ្ធ / ចំណុះមាឌ (Net Contents: g, kg, ml, L)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CS 001 Rule 4.2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 font-sans">
                      ទម្ងន់ / ចំណុះ (Net Contents)
                    </label>
                    {netWeight.trim() && (
                      <button
                        type="button"
                        onClick={() => handleSaveCustomWeight(netWeight)}
                        title="រក្សាទុកទំហំនេះសម្រាប់ប្រើលើកក្រោយ"
                        className="text-[10px] text-amber-700 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-sans cursor-pointer transition font-semibold"
                      >
                        <Plus size={10} />
                        <span>ចងចាំទំហំនេះ (Save)</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        value={netWeight}
                        onChange={(e) => setNetWeight(e.target.value)}
                        placeholder="e.g. 12 g ℮ / 18 g ℮ / 200 g ℮ / 500 ml ℮"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900 pr-16"
                      />
                      {/* Auto-formatter button if user just types a raw number like "12" or "12g" */}
                      {(() => {
                        const numMatch = netWeight.match(/^(\d+(?:\.\d+)?)\s*(g|kg|ml|l|L)?$/i);
                        if (numMatch) {
                          const val = parseFloat(numMatch[1]);
                          const unit = (numMatch[2] || 'g').toLowerCase();
                          let formatted = '';
                          if (unit === 'g') {
                            const oz = (val * 0.035274).toFixed(2);
                            formatted = `${val} g ℮ (Net Wt. ${oz} oz)`;
                          } else if (unit === 'kg') {
                            const lbs = (val * 2.20462).toFixed(2);
                            formatted = `${val} kg ℮ (${lbs} lbs)`;
                          } else if (unit === 'ml') {
                            const flOz = (val * 0.033814).toFixed(2);
                            formatted = `${val} ml ℮ (${flOz} fl oz)`;
                          } else if (unit === 'l') {
                            const flOz = (val * 33.814).toFixed(1);
                            formatted = `${val} L ℮ (${flOz} fl oz)`;
                          }

                          if (formatted && formatted !== netWeight) {
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  setNetWeight(formatted);
                                  handleSaveCustomWeight(formatted);
                                }}
                                className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-sans font-bold px-1.5 rounded-lg flex items-center gap-0.5 cursor-pointer shadow-xs"
                                title="បម្លែងជាស្តង់ដារ CS 001 អន្តរជាតិ (Metric + Imperial Oz)"
                              >
                                <Sparkles size={10} />
                                <span>Format</span>
                              </button>
                            );
                          }
                        }
                        return null;
                      })()}
                    </div>

                    {/* Custom Saved Sizes by MSME */}
                    {customSavedWeights.length > 0 && (
                      <div className="p-1.5 bg-amber-50/70 border border-amber-200/80 rounded-lg">
                        <div className="flex items-center justify-between text-[9px] text-amber-900 font-sans font-bold mb-1">
                          <span className="flex items-center gap-1">
                            <FolderHeart size={11} className="text-amber-600" />
                            <span>ទំហំដែលលោកអ្នកបានរក្សាទុក (MSME Custom Sizes):</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {customSavedWeights.map((w, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-mono transition ${
                                netWeight === w 
                                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                                  : 'bg-white border border-amber-300 hover:bg-amber-100 text-slate-800'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => setNetWeight(w)}
                                className="cursor-pointer"
                              >
                                {w.split('(')[0].trim()}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveCustomWeight(w);
                                }}
                                title="លុបទំហំនេះ"
                                className="text-slate-400 hover:text-red-600 cursor-pointer ml-0.5"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Selection Filter for Weight (g/kg) & Volume (ml/L) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-sans font-semibold">
                        <span>ទម្ងន់រឹង (Grams & Kg):</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {NET_WEIGHT_VOLUME_PRESETS.filter(p => p.type === 'weight').map(w => (
                          <button
                            key={w.label}
                            type="button"
                            onClick={() => setNetWeight(w.value)}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono cursor-pointer transition ${
                              netWeight === w.value 
                                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                                : 'bg-slate-200 hover:bg-amber-200 text-slate-700'
                            }`}
                          >
                            {w.label.split('(')[0].trim()}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-blue-700 font-sans font-semibold pt-1">
                        <span>ចំណុះរាវ (ml, Liters):</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {NET_WEIGHT_VOLUME_PRESETS.filter(p => p.type === 'volume').map(v => (
                          <button
                            key={v.label}
                            type="button"
                            onClick={() => setNetWeight(v.value)}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono cursor-pointer transition ${
                              netWeight === v.value 
                                ? 'bg-blue-600 text-white font-bold shadow-xs' 
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                            }`}
                          >
                            {v.label.split('(')[0].trim()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    លេខកូដបាកូដ GS1 / EAN-13 (884...) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ean13Code}
                    maxLength={13}
                    onChange={(e) => setEan13Code(e.target.value)}
                    placeholder="8842120012004"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-emerald-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">884 = Cambodia GS1 Prefix</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    លេខឡូត៍ផលិតកម្ម (LOT Batch) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    placeholder="2026-CKP-261"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">QR Passport ភ្ជាប់ទៅលេខឡូត៍នេះ</span>
                </div>
              </div>
            </div>

            {/* 3. Dates: MFD, PKD, BBD & EXP (Domestic CS 001 + International Export Markets) */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-blue-700/80 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-mono font-bold">3</span>
                  <span className="text-xs font-bold text-slate-900 font-sans">
                    កាលបរិច្ឆេទផលិត, គុណភាព & ផុតកំណត់ (MFD, PKD, BBD & EXP Dates)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowExportDateGuide(!showExportDateGuide)}
                    className="text-[10px] text-amber-700 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1 font-sans cursor-pointer transition font-semibold"
                  >
                    <BookOpen size={11} />
                    <span>{showExportDateGuide ? 'បិទការណែនាំ (Close Guide)' : '📖 សៀវភៅណែនាំនាំចេញ (Export Date Guide)'}</span>
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">Codex & CS 001</span>
                </div>
              </div>

              {/* Educational Export Readiness Guide Accordion */}
              {showExportDateGuide && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 space-y-2 text-xs font-sans">
                  <div className="flex items-start justify-between">
                    <h5 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                      <Globe size={14} className="text-amber-600" />
                      <span>ចំណេះដឹងត្រៀមនាំចេញ៖ ស្តង់ដារកាលបរិច្ឆេទទីផ្សារអន្តរជាតិ (Export Readiness Date Standards)</span>
                    </h5>
                    <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                      CXS 1-1985
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px] text-slate-700 leading-relaxed">
                    <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1">
                        <Check size={12} className="text-emerald-600" />
                        <span>Best Before (BBD) vs. Expiry Date (EXP):</span>
                      </p>
                      <p>
                        សម្រាប់គ្រាប់ស្វាយចន្ទី និងអាហារក្រៀមដែលមិនងាយខូចភ្លាមៗ (Low-Moisture Foods) ទីផ្សារអន្តរជាតិ (Codex, EU, USA, Japan) និយមប្រើ <strong>"Best Before"</strong> ឬ <strong>"Best If Used By"</strong> ដែលបញ្ជាក់ពីកាលបរិច្ឆេទរក្សាបាននូវភាពស្រួយ រសជាតិ និងក្លិនឈ្ងុយល្អឥតខ្ចោះ មិនមែនជាការខូចទ្រង់ទ្រាយនោះទេ។
                      </p>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1">
                        <Check size={12} className="text-emerald-600" />
                        <span>ទម្រង់ពេញលេញ ៣-កាលបរិច្ឆេទ (Full 3-Date Spec):</span>
                      </p>
                      <p>
                        អ្នកនាំចូលធំៗ (Supermarkets/Importers) ចូលចិត្តស្លាកដែលមាន៖ <strong>MFD</strong> (ថ្ងៃលីងកែច្នៃ), <strong>PKD</strong> (ថ្ងៃច្រកកំប៉ុងបិទជិត/Foil), <strong>BBD</strong> (ថ្ងៃរក្សាគុណភាពល្អបំផុត) និង <strong>EXP</strong> (ថ្ងៃផុតកំណត់) រួមជាមួយលេខសម្គាល់ឡូត៍ <strong>LOT Code</strong>។
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3.A Scheme Selector: Country / Export Standard (Dropdown with full text details) */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label htmlFor="target-market-scheme-select" className="text-xs font-bold text-slate-800 font-sans flex items-center gap-1.5">
                    <Globe size={14} className="text-amber-500" />
                    <span>ជ្រើសរើសស្តង់ដារទីផ្សារគោលដៅ (Target Market Date Standard):</span>
                  </label>
                  <span className="text-[10.5px] font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200/80">
                    {DATE_MARKING_SCHEME_OPTIONS.find(s => s.id === dateMarkingScheme)?.standardCode}
                  </span>
                </div>

                {/* Clean Dropdown Selection Box */}
                <div className="relative">
                  <select
                    id="target-market-scheme-select"
                    value={dateMarkingScheme}
                    onChange={(e) => setDateMarkingScheme(e.target.value as DateMarkingScheme)}
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-sans font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs transition"
                  >
                    {DATE_MARKING_SCHEME_OPTIONS.map((scheme) => (
                      <option key={scheme.id} value={scheme.id} className="py-1 text-slate-900 font-medium">
                        {scheme.flag} {scheme.label} — [{scheme.targetMarket.split('(')[0].trim()}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scheme Rule Summary & Regulatory Details Card */}
                {(() => {
                  const active = DATE_MARKING_SCHEME_OPTIONS.find(s => s.id === dateMarkingScheme) || DATE_MARKING_SCHEME_OPTIONS[0];
                  return (
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2 text-xs text-slate-800">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{active.flag}</span>
                          <div>
                            <span className="font-bold text-amber-950 font-sans">{active.label}</span>
                            <span className="text-[10px] text-slate-600 block">{active.targetMarket}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded">
                          {active.standardCode}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-[11px] text-slate-700 leading-relaxed">
                        <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p><strong className="text-amber-950 font-sans">គោលការណ៍ណែនាំ៖</strong> {active.guidelineKhmer}</p>
                          <div className="mt-1.5 p-2 bg-white/90 rounded-lg border border-amber-200/90 font-mono text-[10.5px] text-amber-950 font-bold flex items-center justify-between">
                            <span>គំរូបោះពុម្ពលើស្លាក៖ {active.sampleFormat}</span>
                            {dateMarkingScheme === 'export_korea' && (
                              <span className="bg-blue-600 text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded">
                                ★ ណែនាំប្រើប្រាស់ 소비기한 (EXP)
                              </span>
                            )}
                            {dateMarkingScheme === 'export_usa' && (
                              <span className="bg-indigo-600 text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded">
                                ★ ណែនាំប្រើ Best If Used By (BBD)
                              </span>
                            )}
                            {dateMarkingScheme === 'cs001_standard' && (
                              <span className="bg-emerald-600 text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded">
                                ★ ស្តង់ដារជាតិ CS 001: MFD + EXP
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 3.B Shelf-Life Quick Calculator (ការគណនាអាយុកាលរក្សាទុកស្វ័យប្រវត្តិ - Dropdown Box) */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label htmlFor="shelf-life-months-dropdown" className="text-xs font-bold text-slate-800 font-sans flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-500" />
                    <span>គណនាអាយុកាលរក្សាទុកស្វ័យប្រវត្តិ (Auto Shelf-Life Calculator):</span>
                  </label>
                  <span className="text-[10px] text-emerald-800 font-sans font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    🗓️ បច្ចុប្បន្ន៖ {shelfLifeMonths} ខែ ({shelfLifeMonths >= 12 ? `${(shelfLifeMonths / 12).toFixed(1).replace('.0', '')} ឆ្នាំ` : `${shelfLifeMonths} ខែ`})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                  {/* Dropdown for selecting number of months */}
                  <div className="sm:col-span-2">
                    <select
                      id="shelf-life-months-dropdown"
                      value={shelfLifeMonths}
                      onChange={(e) => handleApplyShelfLife(Number(e.target.value))}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-sans font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                    >
                      {SHELF_LIFE_QUICK_PRESETS.map((p, idx) => (
                        <option key={idx} value={p.months}>
                          {p.labelKhmer} — [{p.tag}] ({p.descKhmer.split('(')[0].trim()})
                        </option>
                      ))}
                      {!SHELF_LIFE_QUICK_PRESETS.some(p => p.months === shelfLifeMonths) && (
                        <option value={shelfLifeMonths}>
                          {shelfLifeMonths} ខែ (Custom {shelfLifeMonths} Months)
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Manual Month Input Stepper */}
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={shelfLifeMonths}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value) || 1);
                          handleApplyShelfLife(val);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-sans pointer-events-none">ខែ</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyShelfLife(Math.max(1, shelfLifeMonths - 1))}
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                      title="ដក ១ ខែ"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyShelfLife(shelfLifeMonths + 1)}
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                      title="ថែម ១ ខែ"
                    >
                      +1
                    </button>
                  </div>
                </div>

                {/* Auto Calculated Result preview */}
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-sans text-slate-700 flex flex-wrap items-center justify-between gap-1">
                  <span>
                    📅 គណនាចេញពី <strong>MFD ({mfdDate})</strong> + <strong>{shelfLifeMonths} ខែ</strong> ➔ 
                  </span>
                  <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                    EXP / BBD: {expDate}
                  </span>
                </div>
              </div>

              {/* 3.C Dynamic Date Input Fields with Market-Smart Bolding & Highlighting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. MFD */}
                {(() => {
                  const isHighlighted = true; // MFD is required in all standards
                  return (
                    <div className={`p-2.5 rounded-xl border transition ${
                      isHighlighted ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300/60' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-900 font-sans">
                          {dateMarkingScheme === 'export_korea' ? '제조일자 (MFD)' :
                           dateMarkingScheme === 'export_japan' ? '製造年月日 (MFD)' :
                           dateMarkingScheme === 'export_china' ? '生产日期 (MFD)' :
                           'ថ្ងៃខែឆ្នាំផលិត (MFD)'} <span className="text-red-500 font-bold">*</span>
                        </label>
                        <span className="text-[8.5px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.2 rounded font-sans">
                          {dateMarkingScheme === 'export_korea' ? '★ Korea' :
                           dateMarkingScheme === 'export_japan' ? '★ Japan' :
                           dateMarkingScheme === 'export_china' ? '★ China' :
                           dateMarkingScheme === 'cs001_standard' ? '★ CS 001' : 'Required'}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={mfdDate}
                          onChange={(e) => handleMfdChange(e.target.value)}
                          placeholder="16/08/2026"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                        />
                        <Calendar size={12} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                      </div>
                      <span className="text-[9px] text-slate-600 font-sans block mt-1">DD/MM/YYYY (ឬ YYYY.MM.DD)</span>
                    </div>
                  );
                })()}

                {/* 2. PKD (Packaging Date) */}
                {(() => {
                  const isHighlighted = dateMarkingScheme === 'export_australia' || dateMarkingScheme === 'export_full_3dates';
                  return (
                    <div className={`p-2.5 rounded-xl border transition ${
                      isHighlighted ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-300 shadow-2xs font-bold' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`block text-[11px] font-sans ${isHighlighted ? 'font-bold text-amber-950' : 'font-medium text-slate-700'}`}>
                          {dateMarkingScheme === 'export_australia' ? 'PACKED ON (PKD)' : 'ថ្ងៃវេចខ្ចប់ (PKD)'}
                        </label>
                        {isHighlighted ? (
                          <span className="text-[8.5px] font-bold text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded font-sans">
                            ★ ណែនាំសម្រាប់ Aus
                          </span>
                        ) : (
                          <span className="text-[8.5px] text-slate-400 font-sans">ស្រេចចិត្ត</span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={pkdDate}
                          onChange={(e) => setPkdDate(e.target.value)}
                          placeholder="17/08/2026"
                          className={`w-full bg-white border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 ${
                            isHighlighted ? 'border-amber-400 font-bold' : 'border-slate-300'
                          }`}
                        />
                        <Calendar size={12} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                      </div>
                      <span className="text-[9px] text-slate-500 font-sans block mt-1">ថ្ងៃច្រកកញ្ចប់ ឬបូមខ្យល់</span>
                    </div>
                  );
                })()}

                {/* 3. BBD (Best Before Date) */}
                {(() => {
                  const isBbdRecommended = dateMarkingScheme === 'export_bbd' || 
                                           dateMarkingScheme === 'export_usa' || 
                                           dateMarkingScheme === 'export_eu_uk' || 
                                           dateMarkingScheme === 'export_japan' || 
                                           dateMarkingScheme === 'export_china' || 
                                           dateMarkingScheme === 'export_australia' || 
                                           dateMarkingScheme === 'export_full_3dates';
                  return (
                    <div className={`p-2.5 rounded-xl border transition ${
                      isBbdRecommended ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300 shadow-2xs font-bold' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`block text-[11px] font-sans ${isBbdRecommended ? 'font-bold text-amber-950' : 'font-medium text-slate-700'}`}>
                          {dateMarkingScheme === 'export_usa' ? 'Best If Used By (BBD)' :
                           dateMarkingScheme === 'export_japan' ? '賞味期限 (BBD)' :
                           dateMarkingScheme === 'export_china' ? '保质期至 (BBD)' :
                           dateMarkingScheme === 'export_eu_uk' ? 'Best Before End (BBD)' :
                           'គុណភាពល្អបំផុត (BBD)'}
                        </label>
                        {isBbdRecommended ? (
                          <span className="text-[8.5px] font-bold text-amber-950 bg-amber-200 px-1.5 py-0.2 rounded font-sans">
                            {dateMarkingScheme === 'export_usa' ? '★ US FDA' :
                             dateMarkingScheme === 'export_japan' ? '★ Japan' :
                             dateMarkingScheme === 'export_eu_uk' ? '★ EU/UK' :
                             dateMarkingScheme === 'export_china' ? '★ China' : '★ ណែនាំ'}
                          </span>
                        ) : (
                          <span className="text-[8.5px] text-slate-400 font-sans">ស្រេចចិត្ត</span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={bbdDate}
                          onChange={(e) => setBbdDate(e.target.value)}
                          placeholder="16/02/2028"
                          className={`w-full bg-white border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 ${
                            isBbdRecommended ? 'border-amber-400 font-bold' : 'border-slate-300'
                          }`}
                        />
                        <Calendar size={12} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                      </div>
                      <span className="text-[9px] text-slate-600 font-sans block mt-1">រក្សាភាពស្រួយ & រសជាតិល្អបំផុត</span>
                    </div>
                  );
                })()}

                {/* 4. EXP (Expiry / Use By Date) */}
                {(() => {
                  const isExpRecommended = dateMarkingScheme === 'export_korea' || 
                                           dateMarkingScheme === 'cs001_standard' || 
                                           dateMarkingScheme === 'export_gso_middle_east' || 
                                           dateMarkingScheme === 'export_china' || 
                                           dateMarkingScheme === 'export_full_3dates';
                  return (
                    <div className={`p-2.5 rounded-xl border transition ${
                      isExpRecommended ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300 shadow-2xs font-bold' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`block text-[11px] font-sans ${isExpRecommended ? 'font-bold text-amber-950' : 'font-medium text-slate-700'}`}>
                          {dateMarkingScheme === 'export_korea' ? '소비기한 (EXP)' :
                           dateMarkingScheme === 'export_gso_middle_east' ? 'EXP / Expiry Date' :
                           'ថ្ងៃផុតកំណត់ (EXP)'} <span className="text-red-500 font-bold">*</span>
                        </label>
                        {isExpRecommended ? (
                          <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded font-sans ${
                            dateMarkingScheme === 'export_korea' ? 'bg-blue-600 text-white' : 'text-amber-950 bg-amber-200'
                          }`}>
                            {dateMarkingScheme === 'export_korea' ? '★ Korea (소비기한)' :
                             dateMarkingScheme === 'cs001_standard' ? '★ CS 001' :
                             dateMarkingScheme === 'export_gso_middle_east' ? '★ GSO Halal' : '★ Required'}
                          </span>
                        ) : (
                          <span className="text-[8.5px] text-slate-400 font-sans">ស្រេចចិត្ត</span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={expDate}
                          onChange={(e) => setExpDate(e.target.value)}
                          placeholder="16/02/2028"
                          className={`w-full bg-white border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 ${
                            isExpRecommended ? 'border-amber-400 font-bold' : 'border-slate-300'
                          }`}
                        />
                        <Calendar size={12} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                      </div>
                      <span className="text-[9px] text-slate-600 font-sans block mt-1">សុវត្ថិភាពម្ហូបអាហារ & សុពលភាព</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 4. Ingredients List with Category Dropdowns, Preset Formula Picker & CS 001 Order */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-emerald-700/80 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                <span className="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono font-bold">4</span>
                  <span>បញ្ជីរាយមុខគ្រឿងផ្សំតាមជំពូក (Ingredients by Category Dropdown)</span>
                  <span className="text-red-500">*</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded font-mono">
                    CS 001:2000 Rule 4.3 (Descending Weight)
                  </span>
                  <button
                    type="button"
                    onClick={handleSortDescendingCS001}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer shadow-2xs font-sans"
                    title="រៀបចំលំដាប់គ្រឿងផ្សំតាម % ពីធំទៅតូច តាមស្តង់ដារជាតិ CS 001"
                  >
                    <ListOrdered size={12} className="text-amber-400" />
                    <span>រៀបតាម % ច្រើនទៅតិច (CS 001 Sort)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* 4.A Preset Formula Selector with Mode Switch (Append vs Replace) */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-[11px] font-bold text-slate-800 font-sans flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>ជ្រើសរើសរូបមន្តគ្រឿងផ្សំគំរូពេញលេញ (Select Preset Recipe):</span>
                    </label>

                    {/* Mode Switch Pills */}
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-sans">
                      <button
                        type="button"
                        onClick={() => setIngredientFormulaMode('append')}
                        className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                          ingredientFormulaMode === 'append'
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        + បន្ថែមបញ្ចូលគ្នា (Append)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIngredientFormulaMode('replace')}
                        className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                          ingredientFormulaMode === 'replace'
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        🔄 ជំនួសទាំងអស់ (Replace)
                      </button>
                    </div>
                  </div>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleApplyPresetFormula(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-sans shadow-2xs"
                    defaultValue=""
                  >
                    <option value="" disabled>-- ជ្រើសរើសរូបមន្តគ្រឿងផ្សំសម្រេច (Select Product Recipe Preset) --</option>
                    {INGREDIENT_DROPDOWN_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={opt.val}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* 4.B Category-Specific Dropdowns Grid */}
                <div className="bg-amber-50/50 border border-amber-200/80 p-3.5 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                    <div>
                      <div className="text-[11px] font-bold text-amber-950 font-sans flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-amber-700" />
                        <span>ជម្រើសទម្លាក់ចុះតាមជំពូកគ្រឿងផ្សំ (Category Dropdown Menus):</span>
                      </div>
                      <p className="text-[10px] text-amber-900/80 font-sans mt-0.5">
                        ជ្រើសរើសមុខទំនិញតាមជំពូកនីមួយៗ (គ្រាប់ធញ្ញជាតិ, ស្ករ/ជាតិផ្អែម, គ្រឿងទេស, អំបិល/ទឹកត្រី, ប្រេង/ខ្លាញ់, ផ្លែឈើ, សារធាតុបន្ថែម INS)
                      </p>
                    </div>

                    {/* Instant Search Bar */}
                    <div className="relative min-w-[200px] max-w-xs">
                      <input
                        type="text"
                        value={ingredientSearchQuery}
                        onChange={(e) => setIngredientSearchQuery(e.target.value)}
                        placeholder="🔍 ស្វែងរកឈ្មោះគ្រឿងផ្សំ..."
                        className="w-full text-[11px] bg-white border border-amber-300 rounded-lg pl-2.5 pr-6 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans placeholder-slate-400"
                      />
                      {ingredientSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setIngredientSearchQuery('')}
                          className="absolute right-2 top-1 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* If Search Query Active: Show Filtered Quick-Select Results */}
                  {ingredientSearchQuery.trim().length > 0 ? (
                    <div className="bg-white p-3 rounded-xl border border-amber-300 space-y-2">
                      <div className="text-[10px] font-bold text-slate-700 font-sans flex items-center justify-between">
                        <span>លទ្ធផលស្វែងរក ({INDIVIDUAL_INGREDIENT_CATALOG.filter(it => 
                          it.nameKh.toLowerCase().includes(ingredientSearchQuery.toLowerCase()) || 
                          it.nameEn.toLowerCase().includes(ingredientSearchQuery.toLowerCase())
                        ).length} មុខ) :</span>
                        <span className="text-[9px] text-slate-500 font-mono">ចុចដើម្បីបន្ថែមចូលបញ្ជី</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {INDIVIDUAL_INGREDIENT_CATALOG
                          .filter(it => 
                            it.nameKh.toLowerCase().includes(ingredientSearchQuery.toLowerCase()) || 
                            it.nameEn.toLowerCase().includes(ingredientSearchQuery.toLowerCase())
                          )
                          .map(item => {
                            const isPresent = ingredientsList.toLowerCase().includes(item.nameKh.toLowerCase()) || 
                                              ingredientsList.toLowerCase().includes(item.nameEn.toLowerCase());
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleToggleIndividualIngredient(item)}
                                className={`p-2 rounded-lg text-left transition border flex items-center justify-between gap-1.5 cursor-pointer text-[10.5px] font-sans ${
                                  isPresent
                                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-2xs ring-1 ring-amber-400'
                                    : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200'
                                }`}
                              >
                                <div className="truncate">
                                  <div className="truncate">{item.nameKh}</div>
                                  <div className={`text-[9px] truncate ${isPresent ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {item.nameEn} ({item.defaultPercent}%)
                                  </div>
                                </div>
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0 font-bold ${
                                  isPresent ? 'bg-slate-950 text-white' : 'border border-slate-300 bg-slate-50 text-transparent'
                                }`}>
                                  ✓
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ) : (
                    /* The 7 Organized Category Dropdowns */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {INGREDIENT_CATEGORY_GROUPS.map((group) => (
                        <div key={group.id} className="bg-white p-2.5 rounded-xl border border-amber-200/90 shadow-2xs space-y-1.5 min-w-0">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-900 font-sans flex items-center gap-1.5 truncate">
                              <span className="text-sm">{group.icon}</span>
                              <span className="truncate">{group.nameKh}</span>
                            </label>
                            <span className="text-[9px] font-mono text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded shrink-0">
                              {group.items.length} ជម្រើស
                            </span>
                          </div>
                          
                          <select
                            onChange={(e) => {
                              const selectedItem = group.items.find(it => it.id === e.target.value);
                              if (selectedItem) {
                                handleDropdownSelectIngredient(selectedItem);
                                e.target.value = '';
                              }
                            }}
                            className="w-full min-w-0 max-w-full text-[11px] bg-slate-50 hover:bg-white border border-slate-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-sans transition truncate"
                            defaultValue=""
                          >
                            <option value="" disabled>{group.placeholderKh}</option>
                            {group.items.map((item) => {
                              const isChecked = ingredientsList.toLowerCase().includes(item.nameKh.toLowerCase()) || 
                                                ingredientsList.toLowerCase().includes(item.nameEn.toLowerCase());
                              return (
                                <option key={item.id} value={item.id}>
                                  {isChecked ? '✓ ' : '+ '}{item.nameKh} ({item.defaultPercent}%)
                                </option>
                              );
                            })}
                          </select>
                          <p className="text-[9px] text-slate-500 font-sans truncate">
                            {group.descriptionKh}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4.C Selected Ingredients Badges & Interactive Chips */}
                {ingredientsList.trim().length > 0 && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 font-sans flex items-center gap-1">
                        <CheckSquare size={12} className="text-emerald-600" />
                        <span>គ្រឿងផ្សំដែលបានជ្រើសរើស (Selected Ingredients in Formula):</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleSortDescendingCS001}
                        className="text-[9px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ListOrdered size={10} />
                        <span>តម្រៀបតាម % (CS 001 Sort)</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {ingredientsList.split(/[,،]+/).map(p => p.trim()).filter(Boolean).map((chunk, cIdx) => (
                        <span
                          key={cIdx}
                          className="inline-flex items-center gap-1.5 text-[10px] bg-amber-100/80 text-amber-950 border border-amber-300/80 px-2 py-0.5 rounded-lg font-sans shadow-2xs"
                        >
                          <span className="font-medium">{chunk}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredientChip(chunk)}
                            className="text-amber-700 hover:text-red-600 hover:bg-amber-200 rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold text-xs cursor-pointer ml-0.5"
                            title="ដកចេញ"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4.D Quick Add Spices & Additives Dropdown (Space-Saving) */}
                <div className="p-3 bg-slate-100/90 border border-slate-300 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 font-sans flex items-center gap-1.5">
                      <Plus size={13} className="text-amber-600" />
                      <span>បន្ថែមគ្រឿងទេស & សារធាតុបន្ថែម INS (Quick Add Spices & Additives Dropdown):</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Select & Auto-Add</span>
                  </div>

                  <div className="w-full min-w-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 min-w-0 w-full">
                      <select
                        value={selectedSpiceDropdown}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedSpiceDropdown(val);
                          if (val) {
                            const spiceObj = SPICE_AND_SEASONING_ADDONS.find(s => s.text === val);
                            const textToAdd = spiceObj ? spiceObj.text : val;
                            if (ingredientsList.trim().length === 0) {
                              setIngredientsList(textToAdd);
                            } else if (!ingredientsList.includes(textToAdd)) {
                              setIngredientsList(`${ingredientsList.trim()}, ${textToAdd}`);
                            }
                            // Reset selection back to placeholder so user can pick again easily
                            setTimeout(() => setSelectedSpiceDropdown(''), 200);
                          }
                        }}
                        className="w-full min-w-0 max-w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer truncate shadow-2xs"
                      >
                        <option value="" disabled>-- ជ្រើសរើសគ្រឿងទេស ឬសារធាតុបន្ថែម (Select Addon) --</option>
                        <optgroup label="🧂 អំបិល & ម្រេច (Salts & Pepper)">
                          {SPICE_AND_SEASONING_ADDONS.filter(s => s.text.includes('Salt') || s.text.includes('Pepper') || s.label.includes('អំបិល') || s.label.includes('ម្រេច')).map((spice, sIdx) => (
                            <option key={sIdx} value={spice.text}>{spice.label}</option>
                          ))}
                        </optgroup>
                        <optgroup label="🌶️ ម្ទេស & គ្រឿងហឹរ (Chilis & Spices)">
                          {SPICE_AND_SEASONING_ADDONS.filter(s => s.text.includes('Chili') || s.text.includes('Garlic') || s.text.includes('Tom Yum') || s.text.includes('Curry') || s.label.includes('ម្ទេស') || s.label.includes('ខ្ទឹម')).map((spice, sIdx) => (
                            <option key={sIdx} value={spice.text}>{spice.label}</option>
                          ))}
                        </optgroup>
                        <optgroup label="🌿 ស្លឹកគ្រៃ ស្លឹកក្រូច & ឱសថធម្មជាតិ (Herbs & Leaves)">
                          {SPICE_AND_SEASONING_ADDONS.filter(s => s.text.includes('Kaffir') || s.text.includes('Lemongrass') || s.label.includes('ស្លឹក') || s.label.includes('រមៀត')).map((spice, sIdx) => (
                            <option key={sIdx} value={spice.text}>{spice.label}</option>
                          ))}
                        </optgroup>
                        <optgroup label="🍯 ស្ករ & ស្រោបផ្អែម (Sweeteners & Glazes)">
                          {SPICE_AND_SEASONING_ADDONS.filter(s => s.text.includes('Sugar') || s.text.includes('Honey') || s.label.includes('ស្ករ') || s.label.includes('ទឹកឃ្មុំ')).map((spice, sIdx) => (
                            <option key={sIdx} value={spice.text}>{spice.label}</option>
                          ))}
                        </optgroup>
                        <optgroup label="🧪 សារធាតុបន្ថែមស្តង់ដារ INS (Food Additives & Preservatives)">
                          {SPICE_AND_SEASONING_ADDONS.filter(s => s.text.includes('INS') || s.label.includes('INS') || s.text.includes('Gum')).map((spice, sIdx) => (
                            <option key={sIdx} value={spice.text}>{spice.label}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (selectedSpiceDropdown) {
                          if (ingredientsList.trim().length === 0) {
                            setIngredientsList(selectedSpiceDropdown);
                          } else if (!ingredientsList.includes(selectedSpiceDropdown)) {
                            setIngredientsList(`${ingredientsList.trim()}, ${selectedSpiceDropdown}`);
                          }
                          setSelectedSpiceDropdown('');
                        }
                      }}
                      disabled={!selectedSpiceDropdown}
                      className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center justify-center gap-1 transition ${
                        selectedSpiceDropdown ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus size={12} />
                      <span>បញ្ចូល (Add)</span>
                    </button>
                  </div>
                </div>

                {/* Direct Textarea Editor */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    {(() => {
                      const formulaStatus = calculateIngredientsTotalPercent(ingredientsList || '');
                      return (
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-700 font-sans block">
                            ខ្លឹមសារលម្អិតគ្រឿងផ្សំនៅលើស្លាក (Ingredients Text on Packaging):
                          </label>
                          {formulaStatus.totalPercent > 0 && (
                            formulaStatus.isBalanced ? (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 font-mono">
                                ✓ សរុប ១០០%
                              </span>
                            ) : formulaStatus.hasOver100 ? (
                              <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300 font-mono">
                                ⚠️ សរុប {formulaStatus.totalPercent}% (លើស 100%)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 font-mono">
                                សរុប {formulaStatus.totalPercent}%
                              </span>
                            )
                          )}
                        </div>
                      );
                    })()}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (!ingredientsList) return;
                          const combined = combineDuplicateIngredients(ingredientsList);
                          setIngredientsList(combined);
                        }}
                        title="បង្រួម និងបូកភាគរយគ្រឿងផ្សំដែលដូចគ្នាចូលគ្នាតែមួយ"
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-2 py-0.5 rounded-md border border-indigo-300 cursor-pointer transition font-sans"
                      >
                        <Layers size={11} className="text-indigo-700" />
                        <span>បង្រួម & បូកមុខដូចគ្នា (Combine Duplicates)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!ingredientsList) return;
                          const balanced = balanceIngredientsTo100(ingredientsList);
                          setIngredientsList(balanced);
                        }}
                        title="ថ្លឹងភាគរយគ្រឿងផ្សំឱ្យគ្រប់ ១០០% តាមស្ដង់ដារ CS 001"
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-300 cursor-pointer transition font-sans"
                      >
                        <span>⚖️ ថ្លឹងឱ្យគ្រប់ 100% (Balance to 100%)</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-time over 100% warning banner */}
                  {(() => {
                    const formulaStatus = calculateIngredientsTotalPercent(ingredientsList || '');
                    if (!formulaStatus.hasOver100) return null;
                    return (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-rose-950 font-sans animate-fade-in shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚠️</span>
                          <div>
                            <span className="font-bold text-rose-900">
                              រកឃើញភាគរយលើសពី ១០០% ({formulaStatus.totalPercent}%)៖
                            </span>
                            <div className="text-[10px] text-rose-800">
                              ស្តង់ដារ CS 001 តម្រូវឱ្យគ្រឿងផ្សំសរុបស្មើ ១០០%។ ចុច «កែសម្រួល» ដើម្បីថ្លឹងឱ្យគ្រប់ ១០០% ភ្លាមៗ។
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const balanced = balanceIngredientsTo100(ingredientsList || '');
                            setIngredientsList(balanced);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer shrink-0 transition flex items-center gap-1 shadow-2xs"
                        >
                          <span>⚖️ កែសម្រួលឱ្យគ្រប់ ១០០% (Fix to 100%)</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Real-time duplicate warning banner */}
                  {(() => {
                    const dupInfo = detectDuplicateIngredients(ingredientsList || '');
                    if (!dupInfo.hasDuplicates) return null;
                    return (
                      <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-amber-950 font-sans animate-fade-in shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">💡</span>
                          <div>
                            <span className="font-bold text-amber-900">
                              រកឃើញគ្រឿងផ្សំដដែលៗ៖ {dupInfo.duplicates.map(d => `«${d.nameKh}» (${d.individualPercents.map(p => `${p}%`).join(' + ')})`).join(', ')}
                            </span>
                            <div className="text-[10px] text-amber-800">
                              ចុច «បូកបញ្ចូលគ្នា» ដើម្បីបូកសរុបទៅជា {dupInfo.duplicates.map(d => `${d.nameKh} ${d.combinedPercent}%`).join(', ')}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIngredientsList(dupInfo.combinedText)}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] cursor-pointer shrink-0 transition flex items-center gap-1 shadow-2xs"
                        >
                          <Layers size={11} />
                          <span>បូកបញ្ចូលគ្នា (Combine Now)</span>
                        </button>
                      </div>
                    );
                  })()}

                  <textarea
                    rows={3}
                    value={ingredientsList}
                    onChange={(e) => setIngredientsList(e.target.value)}
                    placeholder="រៀបរាប់គ្រឿងផ្សំទាំងអស់តាមលំដាប់ទម្ងន់ពីច្រើនទៅតិច... ឧទាហរណ៍៖ គ្រាប់ស្វាយចន្ទីកម្ពុជា ៨៥%, ម្សៅស្រោបម្រេចកំពត GI ១២%, អំបិលសមុទ្រ ២%, ស្ករត្នោត ១%"
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans shadow-inner leading-relaxed"
                  />
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans">
                  <span>* គ្រឿងផ្សំត្រូវបានរៀបរាប់តាមលំដាប់ទម្ងន់ (%) និងបញ្ជាក់ច្បាស់សារធាតុបន្ថែម (CS 001)</span>
                  <button
                    type="button"
                    onClick={() => setIngredientsList('')}
                    className="text-red-500 hover:underline cursor-pointer text-[10px] font-bold"
                  >
                    លុបទាំងអស់ (Clear All)
                  </button>
                </div>
              </div>
            </div>

            {/* 4.E Nutrition Facts per 100g (Auto-Suggested from Recipe or Lab Tested) */}
            <div id="section-nutrition-facts" className="scroll-mt-6">
              <NutritionFactsManager
                ingredientsText={ingredientsList}
                nutrition={nutrition}
                onChange={setNutrition}
                presetNutrition={activePreset.typicalNutrition}
                mode={nutritionMode}
                onModeChange={setNutritionMode}
              />
            </div>

            {/* 5. Boxed Allergen Advisory */}
            <div className="p-4 sm:p-5 bg-amber-50/90 border-2 border-amber-500 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                <span className="text-xs font-bold text-amber-950 font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-mono font-bold">5</span>
                  <AlertCircle size={14} className="text-amber-800" />
                  <span>ការព្រមានអំពីសារធាតុបង្កប្រតិកម្ម (Allergen Advisory Box)</span>
                </span>
                <span className="text-[9px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded font-mono">
                  Mandatory Supermarket Box
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-[11px] font-bold text-amber-900 font-sans">
                    ជ្រើសរើសជម្រើសអាឡែហ្ស៊ី (Select Allergen Preset):
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) setAllergenBox(e.target.value);
                    }}
                    className="text-xs bg-white border border-amber-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-sans"
                    defaultValue=""
                  >
                    <option value="" disabled>-- ជ្រើសរើសការណែនាំអាឡែហ្ស៊ី --</option>
                    {ALLERGEN_DROPDOWN_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={opt.val}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-900 mb-0.5">Primary Allergen Statement (សេចក្តីប្រកាសចម្បង)</label>
                    <input
                      type="text"
                      value={allergenBox}
                      onChange={(e) => setAllergenBox(e.target.value)}
                      placeholder="CONTAINS: TREE NUTS (CASHEW) / ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី"
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-amber-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-900 mb-0.5">Facility Traces Advisory (ការផលិតរួមក្នុងរោងចក្រ)</label>
                    <input
                      type="text"
                      value={mayContainTraces}
                      onChange={(e) => setMayContainTraces(e.target.value)}
                      placeholder="Packed in a dedicated cashew facility. Gluten-free, dairy-free..."
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Storage & Usage Instructions */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-slate-700/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-mono font-bold">6</span>
                  <span>វិធីរក្សាទុក & របៀបប្រើប្រាស់ (Storage & Usage Guidelines)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CS 001 Rule 4.6</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-800 font-sans">
                      ការណែនាំរក្សាទុក (Storage Instructions)
                    </label>
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) setStorageInstructions(e.target.value);
                    }}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-sans"
                    defaultValue=""
                  >
                    <option value="" disabled>-- ជ្រើសរើសលក្ខខណ្ឌរក្សាទុកគំរូ --</option>
                    {STORAGE_DROPDOWN_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={opt.val}>{opt.label}</option>
                    ))}
                  </select>
                  <textarea
                    rows={2}
                    value={storageInstructions}
                    onChange={(e) => setStorageInstructions(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-800 font-sans">
                      របៀបប្រើប្រាស់ & មុខម្ហូប (Usage & Recipes)
                    </label>
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) setInstructionsForUse(e.target.value);
                    }}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-sans"
                    defaultValue=""
                  >
                    <option value="" disabled>-- ជ្រើសរើសការណែនាំប្រើប្រាស់គំរូ --</option>
                    {USAGE_DROPDOWN_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={opt.val}>{opt.label}</option>
                    ))}
                  </select>
                  <textarea
                    rows={2}
                    value={instructionsForUse}
                    onChange={(e) => setInstructionsForUse(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* 7. Producer Legal Entity, Origin & Standard Multi-level Address Builder */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-emerald-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                <span className="text-xs font-bold text-emerald-950 font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-mono font-bold">7</span>
                  <span>ឈ្មោះសហគ្រាស, ប្រភពដើម & អាសយដ្ឋានលម្អិត (Producer & Address Builder)</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-mono">CS 001 Rule 4.5</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 font-sans">
                    ឈ្មោះសហគ្រាសផលិត ឬអ្នកវេចខ្ចប់ (Company / Brand Entity)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ Mayany Enterprise"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[9.5px] text-slate-500 mt-1 font-sans">
                    គំរូសហគ្រាស៖ <span className="font-semibold text-emerald-800">Mayany Enterprise</span> (ឬឈ្មោះសហគ្រាសផ្ទាល់របស់លោកអ្នក)
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 font-sans">
                      ប្រភពដើមផលិតផល (Country of Origin)
                    </label>
                  </div>
                  <div className="space-y-1">
                    <select
                      onChange={(e) => {
                        if (e.target.value) setCountryOfOrigin(e.target.value);
                      }}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-sans"
                      defaultValue=""
                    >
                      <option value="" disabled>-- ជ្រើសរើសទម្រង់ប្រភពដើម (Select Origin) --</option>
                      {COUNTRY_ORIGIN_OPTIONS.map((opt, idx) => (
                        <option key={idx} value={opt.val}>{opt.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={countryOfOrigin}
                      onChange={(e) => setCountryOfOrigin(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Level Address Options: Select Preset or Write Specific Fields */}
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
                      <span>ឧបករណ៍បង្កើតអាសយដ្ឋានតាមរចនាសម្ព័ន្ធកម្ពុជា (Cambodian Address Builder)</span>
                    </h5>
                    <p className="text-[10px] text-slate-500 font-sans">
                      បំពេញផ្ទះលេខ ផ្លូវលេខ ក្រុម ភូមិ ឃុំ/សង្កាត់ ស្រុក/ខណ្ឌ ខេត្ត/រាជធានី
                    </p>
                  </div>
                  
                  {/* Address Quick Template Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <select
                      onChange={(e) => {
                        const selected = COMMON_KHMER_ADDRESS_PRESETS.find(p => p.name === e.target.value);
                        if (selected) handleAddressPresetSelect(selected.address);
                      }}
                      className="text-xs bg-emerald-50 border border-emerald-300 text-emerald-950 font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-sans"
                      defaultValue=""
                    >
                      <option value="" disabled>-- ជ្រើសរើសគំរូអាសយដ្ឋានរោងចក្រ (Select Factory Preset) --</option>
                      {COMMON_KHMER_ADDRESS_PRESETS.map((p, idx) => (
                        <option key={idx} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Structured Address 7-Field Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 font-sans">
                      ផ្ទះលេខ (House No.)
                    </label>
                    <input
                      type="text"
                      value={addressHouse}
                      onChange={(e) => {
                        setAddressHouse(e.target.value);
                        updateCombinedAddress(e.target.value, addressStreet, addressGroup, addressVillage, addressCommune, addressDistrict, addressProvince);
                      }}
                      placeholder="ឧ. ផ្ទះលេខ ៤៨"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 font-sans">
                      ផ្លូវលេខ (Street No.)
                    </label>
                    <input
                      type="text"
                      value={addressStreet}
                      onChange={(e) => {
                        setAddressStreet(e.target.value);
                        updateCombinedAddress(addressHouse, e.target.value, addressGroup, addressVillage, addressCommune, addressDistrict, addressProvince);
                      }}
                      placeholder="ឧ. ផ្លូវជាតិលេខ ៦"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 font-sans">
                      ក្រុមទី (Group No.)
                    </label>
                    <input
                      type="text"
                      value={addressGroup}
                      onChange={(e) => {
                        setAddressGroup(e.target.value);
                        updateCombinedAddress(addressHouse, addressStreet, e.target.value, addressVillage, addressCommune, addressDistrict, addressProvince);
                      }}
                      placeholder="ឧ. ក្រុមទី ០៣"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 font-sans">
                      ភូមិ (Village Name)
                    </label>
                    <input
                      type="text"
                      value={addressVillage}
                      onChange={(e) => {
                        setAddressVillage(e.target.value);
                        updateCombinedAddress(addressHouse, addressStreet, addressGroup, e.target.value, addressCommune, addressDistrict, addressProvince);
                      }}
                      placeholder="ឧ. ភូមិត្រពាំងឫស្សី"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 font-sans">
                      ឃុំ / សង្កាត់ (Commune/Sangkat)
                    </label>
                    <input
                      type="text"
                      value={addressCommune}
                      onChange={(e) => {
                        setAddressCommune(e.target.value);
                        updateCombinedAddress(addressHouse, addressStreet, addressGroup, addressVillage, e.target.value, addressDistrict, addressProvince);
                      }}
                      placeholder="ឧ. ឃុំត្រពាំងឫស្សី"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 font-sans">
                      ស្រុក / ខណ្ឌ (District/Khan)
                    </label>
                    <input
                      type="text"
                      value={addressDistrict}
                      onChange={(e) => {
                        setAddressDistrict(e.target.value);
                        updateCombinedAddress(addressHouse, addressStreet, addressGroup, addressVillage, addressCommune, e.target.value, addressProvince);
                      }}
                      placeholder="ឧ. ស្រុកកំពង់ស្វាយ"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5 font-sans">
                      ខេត្ត / រាជធានី (Province / City Selector)
                    </label>
                    <select
                      value={addressProvince}
                      onChange={(e) => {
                        setAddressProvince(e.target.value);
                        updateCombinedAddress(addressHouse, addressStreet, addressGroup, addressVillage, addressCommune, addressDistrict, e.target.value);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-medium"
                    >
                      {CAMBODIA_PROVINCES.map((prov, pIdx) => (
                        <option key={pIdx} value={`${prov.kh} (${prov.en})`}>
                          {prov.kh} | {prov.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Combined Live Label Address Preview */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 font-sans">
                    លទ្ធផលអាសយដ្ឋានពេញលេញបង្ហាញលើស្លាក (Combined Address on Final Label):
                  </label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-sans font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 8. Standard Certifications (GHP, GMP, HACCP, CS, ISO, Halal, GI, Organic) */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-indigo-700/80 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-indigo-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono font-bold">8</span>
                  <Award size={15} className="text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900 font-sans">
                    វិញ្ញាបនបត្រស្តង់ដារជាតិ & អន្តរជាតិ (Quality & Food Safety Certifications)
                  </span>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-900 font-bold px-2 py-0.5 rounded font-mono border border-indigo-200">
                  GHP • GMP • HACCP • CS • ISO
                </span>
              </div>

              {/* Certification Selection Dropdown with Categories */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label className="text-[11px] font-bold text-slate-800 font-sans flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-indigo-600" />
                    <span>ជ្រើសរើសស្តង់ដារដើម្បីបន្ថែមលើស្លាក (Select Standard to Add / Toggle):</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-sans">
                    បានជ្រើសរើស៖ <strong className="text-indigo-700 font-bold">{selectedCertifications.length}</strong> ស្តង់ដារ
                  </span>
                </div>

                {/* Dropdown with full-width container & no overflow */}
                <div className="w-full min-w-0">
                  <select
                    onChange={(e) => {
                      const certId = e.target.value;
                      if (certId) {
                        if (!selectedCertifications.includes(certId)) {
                          setSelectedCertifications(prev => [...prev, certId]);
                        }
                        // Auto-populate or append certificate number
                        const certObj = CAMBODIA_CERTIFICATION_STANDARDS.find(c => c.id === certId);
                        if (certObj && !customCertNumber.includes(certObj.code)) {
                          setCustomCertNumber(prev => prev ? `${prev} • ${certObj.code}` : certObj.defaultCertNumber);
                        }
                      }
                    }}
                    className="w-full min-w-0 max-w-full bg-indigo-50/50 border border-indigo-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer truncate shadow-2xs"
                    defaultValue=""
                  >
                    <option value="" disabled>-- ជ្រើសរើសស្តង់ដារជាតិ ឬអន្តរជាតិ (JAS, EU, USDA NOP, CS, GHP, GMP, HACCP, ISO...) --</option>
                    <optgroup label="🇰🇭 ស្តង់ដារជាតិកម្ពុជា & សុវត្ថិភាពម្ហូបអាហារ (MISTI / ISC / CCF / MAFF)">
                      {CAMBODIA_CERTIFICATION_STANDARDS.filter(c => c.category === 'national' || c.category === 'food_safety').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.code} — {c.nameKh}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🌐 ស្តង់ដារអន្តរជាតិ & ប្រព័ន្ធសុវត្ថិភាពម្ហូបអាហារ (ISO & Global FSMS)">
                      {CAMBODIA_CERTIFICATION_STANDARDS.filter(c => c.category === 'iso').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.code} — {c.nameKh}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🍃 ស្តង់ដារកសិកម្មសរីរាង្គអន្តរជាតិ & ជាតិ (JAS, EU Organic, USDA NOP, COrAA)">
                      {CAMBODIA_CERTIFICATION_STANDARDS.filter(c => c.category === 'organic').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.code} — {c.nameKh}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="✨ ហាឡាល់ ភូមិសាស្ត្រទំនិញ GI & ពាណិជ្ជកម្មយុត្តិធម៌ (Halal, GI, Fairtrade)">
                      {CAMBODIA_CERTIFICATION_STANDARDS.filter(c => c.category === 'origin_gi' || c.category === 'specialty').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.code} — {c.nameKh}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Quick Presets row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-sans font-medium mr-0.5">កញ្ចប់កំណត់ស្រាប់៖</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCertifications(['coraa-organic', 'jas-organic', 'eu-organic', 'usda-nop-organic']);
                      setCustomCertNumber('JAS-JP-8902 • KH-BIO-149 / EU-2026 • USDA-NOP-1938 • COrAA-1184');
                    }}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] rounded-lg transition cursor-pointer font-sans flex items-center gap-1"
                    title="ជ្រើសរើសកញ្ចប់ស្តង់ដារសរីរាង្គពេញលេញ សម្រាប់ទីផ្សារជប៉ុន សហភាពអឺរ៉ុប និងសហរដ្ឋអាមេរិក"
                  >
                    <span>🍃</span>
                    <span>សរីរាង្គនាំចេញ (JAS + EU + USDA NOP)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCertifications(['cs-mark', 'ghp-cambodia', 'gmp-cambodia', 'haccp-cambodia', 'iso-22000']);
                      setCustomCertNumber('ISC/CS-001/2026 • GHP-MISTI • GMP-KH • HACCP-CODEX • ISO-22000');
                    }}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold text-[11px] rounded-lg transition cursor-pointer font-sans flex items-center gap-1"
                  >
                    <span>🌐</span>
                    <span>FSMS (ISO 22000 + HACCP)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCertifications(['cs-mark', 'ghp-cambodia', 'gmp-cambodia']);
                      setCustomCertNumber('ISC-CS-001-2000 • GHP-MAFF-2026 • GMP-KH-2026');
                    }}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] rounded-lg transition cursor-pointer font-sans flex items-center gap-1"
                  >
                    <span>🇰🇭</span>
                    <span>ស្តង់ដារជាតិ (CS + GHP)</span>
                  </button>
                  {selectedCertifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCertifications([]);
                        setCustomCertNumber('');
                      }}
                      className="px-2 py-1 text-slate-500 hover:text-rose-600 font-medium text-[10px] rounded-lg transition cursor-pointer font-sans ml-auto"
                    >
                      ជម្រះទាំងអស់
                    </button>
                  )}
                </div>

                {/* Active Standard Badges / Chips */}
                <div className="pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {CAMBODIA_CERTIFICATION_STANDARDS.map((cert) => {
                      const isSelected = selectedCertifications.includes(cert.id);
                      return (
                        <button
                          key={cert.id}
                          type="button"
                          onClick={() => handleToggleCertification(cert.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-sans flex items-center gap-1.5 transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-bold'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{cert.icon}</span>
                          <span>{cert.code}</span>
                          {isSelected && <span className="text-[10px] ml-0.5 opacity-90">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Certificate Number Input */}
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 font-sans">
                    លេខវិញ្ញាបនបត្រ ឬលេខអនុញ្ញាត (License / Certificate Numbers on Label):
                  </label>
                  <input
                    type="text"
                    value={customCertNumber}
                    onChange={(e) => setCustomCertNumber(e.target.value)}
                    placeholder="ISC-CS-001-2000 • GHP-MAFF-2026 • HACCP-KH-7892 • ISO-22000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* 9. Recycle Icon & Packaging Resin Code (CS & Global Retail Requirement) */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-teal-700/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-teal-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-mono font-bold">9</span>
                  <RotateCcw size={15} className="text-teal-600" />
                  <span className="text-xs font-bold text-slate-900 font-sans">
                    និមិត្តសញ្ញាកែច្នៃ & ក្រមសម្គាល់ជ័រ (Recycle Icon & Packaging Resin Code)
                  </span>
                </div>
                
                {/* Display Toggle Switch */}
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRecycleBadge}
                    onChange={(e) => setShowRecycleBadge(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600 relative"></div>
                  <span className="text-[11px] font-bold text-slate-700 font-sans">បង្ហាញលើស្លាក (Show on Label)</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-800 font-sans flex items-center gap-1.5">
                  <span>ជ្រើសរើសប្រភេទជ័រ និងនិមិត្តសញ្ញាកែច្នៃ (Select Resin & Eco Badge):</span>
                </label>

                <select
                  value={selectedRecycle}
                  onChange={(e) => setSelectedRecycle(e.target.value)}
                  className="w-full bg-teal-50/50 border border-teal-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer font-medium"
                >
                  {RECYCLE_BADGE_OPTIONS.map((rec) => (
                    <option key={rec.id} value={rec.id}>
                      {rec.symbol} {rec.resinCode} — {rec.nameKh} ({rec.nameEn})
                    </option>
                  ))}
                </select>

                {/* Live Preview of Selected Recycle Badge */}
                {showRecycleBadge && (
                  <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono text-teal-800">
                        {RECYCLE_BADGE_OPTIONS.find(r => r.id === selectedRecycle)?.symbol || '♷'}
                      </span>
                      <div>
                        <span className="font-bold text-teal-950 block text-[11px]">
                          {RECYCLE_BADGE_OPTIONS.find(r => r.id === selectedRecycle)?.labelSnippet}
                        </span>
                        <span className="text-[10px] text-teal-700 font-sans">
                          បង្ហាញនៅផ្នែកខាងក្រោមនៃស្លាកវេចខ្ចប់ស្របតាមបទដ្ឋានបរិស្ថាន
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-teal-200 text-teal-900 font-bold px-2 py-0.5 rounded font-mono">
                      ECO READY
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 10. Social Responsibility Slogan & National Campaign */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-rose-700/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-rose-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-mono font-bold">10</span>
                  <Heart size={15} className="text-rose-600" />
                  <span className="text-xs font-bold text-slate-900 font-sans">
                    សារអប់រំសង្គម & យុទ្ធនាការជាតិ (Social Responsibility & National Campaign Slogans)
                  </span>
                </div>

                {/* Display Toggle Switch */}
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSocialSlogan}
                    onChange={(e) => setShowSocialSlogan(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-600 relative"></div>
                  <span className="text-[11px] font-bold text-slate-700 font-sans">បង្ហាញលើស្លាក (Show on Label)</span>
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-[11px] font-bold text-slate-800 font-sans">
                    ជ្រើសរើសសារអប់រំ ឬយុទ្ធនាការសង្គម (Select Slogan Preset):
                  </label>
                </div>

                <select
                  value={selectedSlogan}
                  onChange={(e) => {
                    const sId = e.target.value;
                    setSelectedSlogan(sId);
                    const found = SOCIAL_SLOGAN_OPTIONS.find(s => s.id === sId);
                    if (found) {
                      setCustomSloganText(found.sloganKh);
                    }
                  }}
                  className="w-full bg-rose-50/50 border border-rose-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer font-medium"
                >
                  {SOCIAL_SLOGAN_OPTIONS.map((slog) => (
                    <option key={slog.id} value={slog.id}>
                      {slog.icon} {slog.nameKh} ({slog.sloganKh})
                    </option>
                  ))}
                </select>

                {/* Editable Slogan Text */}
                <div className="pt-1">
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 font-sans">
                    ខ្លឹមសារពាក្យស្លោកបង្ហាញលើស្លាកជាក់ស្តែង (Editable Slogan Text on Label):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customSloganText}
                      onChange={(e) => setCustomSloganText(e.target.value)}
                      placeholder="ចូលរួមទាំងអស់គ្នាដើម្បីជីវិត និងសហគមន៍គ្មានគ្រឿងញៀន! (Say No to Drugs)"
                      className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs font-sans text-rose-950 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner"
                    />
                  </div>
                </div>

                {/* Quick 1-Click Slogan Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SOCIAL_SLOGAN_OPTIONS.map((slog) => (
                    <button
                      key={slog.id}
                      type="button"
                      onClick={() => {
                        setSelectedSlogan(slog.id);
                        setCustomSloganText(slog.sloganKh);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border font-sans flex items-center gap-1 transition cursor-pointer ${
                        selectedSlogan === slog.id
                          ? 'bg-rose-100 text-rose-950 border-rose-400 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{slog.icon}</span>
                      <span className="line-clamp-1">{slog.nameKh.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 11. Registration Mark & Trademark */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-slate-700/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-mono font-bold">11</span>
                  <span>លេខបញ្ជីការ & ម៉ាកសញ្ញាពាណិជ្ជកម្ម (MISTI Reg & Trademark)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CS 001 Rule 4.7</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 font-sans">
                    លេខចុះបញ្ជីស្តង់ដារជាតិ / ISC / MISTI License
                  </label>
                  <input
                    type="text"
                    value={registrationMark}
                    onChange={(e) => setRegistrationMark(e.target.value)}
                    placeholder="ISC CS 001:2000 / MISTI #KH-78921"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 font-sans">
                    ឈ្មោះម៉ាកពាណិជ្ជកម្ម (Trademark Header Brand Text)
                  </label>
                  <input
                    type="text"
                    value={trademarkLogoText}
                    onChange={(e) => setTrademarkLogoText(e.target.value)}
                    placeholder="MAYANY • CASHEWTRACE"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 12. Nutrition Facts per 100g (Synchronized Dual-Mode Manager) */}
          <div id="section-12-nutrition" className="scroll-mt-6">
            <NutritionFactsManager
              ingredientsText={ingredientsList}
              nutrition={nutrition}
              onChange={setNutrition}
              presetNutrition={activePreset.typicalNutrition}
              mode={nutritionMode}
              onModeChange={setNutritionMode}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Preview, Die-Cut Label Sheet & Supermarket Audit (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          
          {/* View Tab Selector Bar */}
          <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-700 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={14} />
                <span>Supermarket Packaging Visualizer</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLabelTheme('supermarket-clean')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                    labelTheme === 'supermarket-clean' ? 'bg-white text-slate-900 shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  White Gold
                </button>
                <button
                  onClick={() => setLabelTheme('artisan-kraft')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                    labelTheme === 'artisan-kraft' ? 'bg-amber-700 text-amber-100 shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Kraft Eco
                </button>
                <button
                  onClick={() => setLabelTheme('premium-black')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                    labelTheme === 'premium-black' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Noir Gold
                </button>
                <button
                  onClick={() => setLabelTheme('modern-green')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                    labelTheme === 'modern-green' ? 'bg-emerald-600 text-emerald-100 shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Botanical
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewTab('jar-banner-100g')}
                className={`py-1.5 px-1 text-center rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-sans ${
                  previewTab === 'jar-banner-100g' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black ring-2 ring-amber-300 shadow-md scale-[1.02]' 
                    : 'text-amber-300 hover:text-white bg-amber-950/60 border border-amber-500/50'
                }`}
              >
                <Store size={12} className="text-amber-400" />
                <span>កំប៉ុង 100g (Cafe/Jar)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('window-pouch-50g')}
                className={`py-1.5 px-1 text-center rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-sans ${
                  previewTab === 'window-pouch-50g' 
                    ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300 shadow-md' 
                    : 'text-amber-300 hover:text-white bg-amber-950/40 border border-amber-500/30'
                }`}
              >
                <Sparkles size={12} className="text-amber-400" />
                <span>ថង់បាតឈរ 50g (Top+QR)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('3d-container')}
                className={`py-1.5 px-1 text-center rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-sans ${
                  previewTab === '3d-container' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package size={12} />
                <span>3D កំប៉ុង (3D Jar)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('wrap-label')}
                className={`py-1.5 px-1 text-center rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-sans ${
                  previewTab === 'wrap-label' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layout size={12} />
                <span>ស្លាកជុំវិញ (Wrap)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('lid-sticker')}
                className={`py-1.5 px-1 text-center rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-sans ${
                  previewTab === 'lid-sticker' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tag size={12} />
                <span>ស្លាកគម្រប (Lid)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('micro-label-sheet')}
                className={`py-1.5 px-1 text-center rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-sans ${
                  previewTab === 'micro-label-sheet' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Scissors size={12} />
                <span>ស្លាកតូច $0.25 (Micro)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('shelf-life-guide')}
                className={`py-1.5 px-1 text-center rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-sans ${
                  previewTab === 'shelf-life-guide' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap size={12} />
                <span>តម្លៃ & ទីផ្សារ</span>
              </button>
            </div>
          </div>

          {/* TAB -1: 100G CLEAR PET JAR BANNER STICKER DESIGNER (GOLD MANGO COFFEE EDITION) */}
          {previewTab === 'jar-banner-100g' && (
            <JarBanner100gDesigner 
              currentBrandLogo={customBrandLogo}
              companyName={companyName}
              companyAddress={companyAddress}
              onSelectFlavor={(flavor) => {
                setProductNameKhmer(flavor.nameKh);
                setProductNameEnglish(`${flavor.nameEnLine1} ${flavor.nameEnLine2}`);
                setNetWeight('100 g ℮ (Net Wt. 3.5 oz)');
                setLotNumber(flavor.defaultBatchLot);
                const formula = `គ្រាប់ស្វាយចន្ទី (Cashews ${flavor.cashewPercent}%), ${flavor.spiceNameKh} (${flavor.spicePercent}%), ស្ករត្នោត/ស្ករស (${flavor.sugarPercent}%), អំបិល (${flavor.saltPercent}%)`;
                setIngredientsList(formula);
              }}
            />
          )}

          {/* TAB 0: 50G WINDOW KRAFT POUCH LABEL DESIGNER (TOP LOGO + BOTTOM QR) */}
          {previewTab === 'window-pouch-50g' && (
            <WindowPouchMiniLabelDesigner 
              currentBrandLogo={customBrandLogo}
              trademarkLogoText={trademarkLogoText}
              companyName={companyName}
              companyAddress={companyAddress}
              currentLotNumber={lotNumber}
              onSelectFlavor={(flavor) => {
                setProductNameKhmer(flavor.nameKh);
                setProductNameEnglish(`${flavor.nameEnLine1} ${flavor.nameEnLine2}`);
                setNetWeight('50 g ℮ (១៧ គ្រាប់ / 17 Kernels)');
                setLotNumber(flavor.defaultBatchLot);
                const formula = `គ្រាប់ស្វាយចន្ទី (Cashews ${flavor.cashewPercent}%), ${flavor.spiceNameKh} (${flavor.spicePercent}%), ស្ករ (${flavor.sugarPercent}%), អំបិល (${flavor.saltPercent}%)`;
                setIngredientsList(formula);
              }}
            />
          )}

          {/* TAB 1: 3D CONTAINER VISUALIZER (SUPERMARKET SHELF-READY MOCKUP) */}
          {previewTab === '3d-container' && (
            <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 p-6 rounded-2xl border border-slate-700 shadow-2xl text-center relative overflow-hidden">
              <div className="text-left flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">3D Realistic Mockup</span>
                  <h4 className="text-sm font-bold text-white font-sans">
                    {CONTAINER_CATALOG[containerType]?.label || `${netWeight} Standard Container`} ({CONTAINER_CATALOG[containerType]?.spec || 'Supermarket Spec'})
                  </h4>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 self-start sm:self-auto">
                  Multi-Market Shelf Ready
                </span>
              </div>

              {/* Container Graphic Simulation */}
              <div className="relative py-4 flex flex-col items-center justify-center">
                {/* Round Lid Top View Mini Sticker */}
                <div className="mb-3 w-28 h-28 rounded-full border-4 border-amber-400/60 bg-gradient-to-br from-amber-100 to-amber-50 shadow-lg p-2 flex flex-col items-center justify-center text-slate-900 transform hover:scale-105 transition">
                  {customBrandLogo ? (
                    <img src={customBrandLogo} alt="Logo" className="w-8 h-8 object-contain rounded mb-0.5" />
                  ) : (
                    <CashewNutIcon className="w-5 h-5 text-amber-800" />
                  )}
                  <p className="text-[8px] font-black uppercase tracking-tight text-center leading-tight mt-0.5">
                    {trademarkLogoText.split('•')[0] || 'MAYANY'}
                  </p>
                  <p className="text-[7px] font-bold text-emerald-800 text-center font-sans line-clamp-1">
                    {productNameKhmer.split('(')[0] || 'ម្សៅគ្រាប់ស្វាយចន្ទី'}
                  </p>
                  <span className="text-[6px] font-mono text-slate-500 font-bold">{netWeight.split('(')[0]} • SEALED</span>
                </div>

                {/* The Container Mockup */}
                <div className="w-48 relative shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-600/80 bg-white">
                  {/* Container Cap / Zipper Header */}
                  <div className="h-9 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 border-b-2 border-slate-900 flex items-center justify-center text-[9px] font-mono text-amber-300 font-bold tracking-wider uppercase">
                    <span>{containerType.includes('pouch') ? 'RESEALABLE ZIPPER' : 'SEALED FOR FRESHNESS'}</span>
                  </div>

                  {/* Barrier / Liner Callout Line */}
                  <div className="bg-amber-400 text-slate-950 text-[7px] font-black py-0.5 px-2 text-center uppercase tracking-widest font-mono">
                    ✦ {barrierType === 'vented-induction' ? 'VENTED INDUCTION SEAL' :
                        barrierType === 'nitrogen-flush' ? 'NITROGEN GAS FLUSH' :
                        barrierType === 'pressure-seal' ? 'PRESSURE-SENSITIVE SEAL' :
                        barrierType === 'plastisol-lug' ? 'PLASTISOL VACUUM SEAL' :
                        barrierType === 'vacuum-retort' ? '121°C RETORT VACUUM SEAL' :
                        barrierType === 'barrier-zipper' ? 'METALLIZED BARRIER ZIPPER' :
                        barrierType === 'easy-open-pull' ? 'EZO EASY-OPEN SEAL' :
                        'INDUCTION HEAT-SEAL FOIL INSIDE'} ✦
                  </div>

                  {/* Body Label Graphic */}
                  <div className={`p-4 text-center space-y-1.5 ${
                    labelTheme === 'artisan-kraft' ? 'bg-[#ebd6be] text-slate-900' :
                    labelTheme === 'premium-black' ? 'bg-slate-950 text-amber-100 border border-amber-500/40' :
                    labelTheme === 'modern-green' ? 'bg-emerald-950 text-white' : 'bg-white text-slate-900'
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[8px] font-mono font-bold text-amber-500 uppercase">
                      <span>{trademarkLogoText}</span>
                    </div>

                    <h5 className="text-xs font-black uppercase tracking-tight leading-tight">
                      {productNameEnglish.split('(')[0] || '100% PURE CASHEW FLOUR'}
                    </h5>
                    
                    <p className={`text-[10px] font-bold leading-none ${
                      labelTheme === 'modern-green' ? 'text-amber-300' : 
                      labelTheme === 'premium-black' ? 'text-amber-400' : 'text-emerald-800'
                    }`}>
                      {productNameKhmer.split('(')[0] || 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ'}
                    </p>

                    {/* Marketing Badges Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-1 pt-1">
                      {heroBadges.slice(0, 3).map((b, i) => (
                        <span key={i} className={`text-[7px] font-bold px-1.5 py-0.5 rounded ${
                          labelTheme === 'premium-black' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          labelTheme === 'modern-green' ? 'bg-emerald-800 text-white' :
                          labelTheme === 'artisan-kraft' ? 'bg-amber-900 text-amber-100' :
                          'bg-slate-900 text-white'
                        }`}>
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-300/50 text-[8px] font-mono">
                      <span className={`font-black text-xs ${labelTheme === 'premium-black' ? 'text-amber-300' : 'text-slate-900'}`}>{netWeight}</span>
                      <span className="text-[7px] opacity-75 uppercase">
                        {containerType.includes('pp') ? 'PP 05 • FOOD GRADE' :
                         containerType.includes('glass') ? 'FOOD GRADE GLASS' :
                         containerType.includes('pouch') ? 'FOIL BARRIER' : 'FOOD GRADE'}
                      </span>
                    </div>
                  </div>

                  {/* Transparent/Frosted Base Bottom */}
                  <div className="h-4 bg-gradient-to-r from-slate-200 via-white to-slate-200 border-t border-slate-300" />
                </div>

                {/* Shelf Reflection Shadow */}
                <div className="w-56 h-3 bg-black/40 rounded-full blur-xs mx-auto mt-2" />
                <div className="w-full border-t-2 border-slate-700 mt-2 pt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Supermarket Shelf Display</span>
                  <span>Aeon • Lucky • Chip Mong Spec</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL 215mm × 55mm WRAP-AROUND DIE-CUT SHEET */}
          {previewTab === 'wrap-label' && (
            <div className="space-y-3">
              {/* Single Label Print Action Header */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between no-print">
                <div>
                  <span className="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
                    <Tag size={13} className="text-amber-600" />
                    <span>ស្លាកតែ ១ផ្ទាំងពេញលេញ (Single 1-Piece Wrap-Around Label)</span>
                  </span>
                  <p className="text-[10.5px] text-slate-600 font-sans">
                    ចុចប៊ូតុងដើម្បីព្រីនស្លាក ១ផ្ទាំងគត់ (បិទជុំវិញកំប៉ុង ឬដប មានព័ត៌មានគ្រប់ជ្រុងជ្រោយ)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <Printer size={13} />
                  <span>ព្រីនស្លាក ១សន្លឹក (Print 1-Page Label)</span>
                </button>
              </div>

              <div 
                id="printable-label-canvas"
                className={`rounded-2xl border-2 p-5 transition-all shadow-xl relative select-text font-sans ${
                  labelTheme === 'artisan-kraft' 
                    ? 'bg-[#e8d7be] text-slate-900 border-[#c4a47c]' 
                    : labelTheme === 'premium-black'
                    ? 'bg-slate-950 text-amber-100 border-amber-500 shadow-amber-950/40'
                    : labelTheme === 'modern-green'
                    ? 'bg-emerald-950 text-white border-emerald-700'
                    : 'bg-white text-slate-950 border-slate-300'
                }`}
              >
                <div className="text-[9px] font-mono text-slate-400 mb-2 flex justify-between border-b pb-1 no-print">
                  <span>DIE-CUT SPEC: 215mm × 55mm (360° Body Wrap - 1 Single Piece)</span>
                  <span>BLEED: 2mm</span>
                </div>

              {/* 3-Panel Tri-fold Structure */}
              <div className="grid grid-cols-12 gap-3 text-left items-start">
                
                {/* Left Panel: Nutrition Facts & Serving Recipes (4 cols) */}
                <div className="col-span-4 space-y-2 border-r border-slate-400/30 pr-2">
                  <div className="border-b-2 border-slate-900 pb-0.5">
                    <h6 className="text-[9px] font-black uppercase tracking-tight">Nutrition Facts</h6>
                    <p className="text-[7px] opacity-75">Per 100 g Reference</p>
                  </div>
                  <div className="text-[8px] space-y-0.5 font-mono">
                    <div className="flex justify-between font-bold">
                      <span>Energy</span>
                      <span>{nutrition.energyKcal} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Fat</span>
                      <span>{nutrition.totalFat}g</span>
                    </div>
                    <div className="flex justify-between pl-1 opacity-80 text-[7px]">
                      <span>- Saturates</span>
                      <span>{nutrition.saturatedFat}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Carbs</span>
                      <span>{nutrition.totalCarb}g</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-800">
                      <span>Protein</span>
                      <span>{nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salt</span>
                      <span>{nutrition.salt}g</span>
                    </div>
                  </div>

                  {/* Recipes Callout */}
                  <div className="bg-amber-500/10 p-1.5 rounded text-[7px] leading-tight space-y-0.5 border border-amber-500/20">
                    <p className="font-bold text-amber-900 uppercase">★ Quick Recipe:</p>
                    <p className="text-slate-700">Add 2 tbsp to morning smoothies or grain-free baking.</p>
                  </div>
                </div>

                {/* Center Panel: Front-of-Pack Brand Hero (4 cols) */}
                <div className="col-span-4 text-center space-y-1.5 px-1">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center overflow-hidden p-0.5">
                    {customBrandLogo ? (
                      <img src={customBrandLogo} alt="Brand Logo" className="w-full h-full object-contain" />
                    ) : (
                      <CashewNutIcon className="w-4 h-4 text-amber-900" />
                    )}
                  </div>
                  
                  <p className="text-[8px] font-black uppercase tracking-wider font-mono">
                    {trademarkLogoText}
                  </p>

                  <h3 className="text-xs font-black uppercase tracking-tight leading-tight">
                    {productNameEnglish}
                  </h3>

                  <p className="text-[10px] font-bold text-emerald-800 leading-snug">
                    {productNameKhmer}
                  </p>

                  <div className="my-1.5 flex flex-wrap justify-center gap-1">
                    {heroBadges.slice(0, 3).map((badge, bIdx) => (
                      <span key={bIdx} className="bg-slate-900 text-white text-[6px] font-bold px-1.5 py-0.5 rounded">
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-slate-300">
                    <p className="text-xs font-black font-mono">{netWeight}</p>
                    <p className="text-[7px] uppercase tracking-wider font-mono opacity-80">{countryOfOrigin}</p>
                  </div>
                </div>

                {/* Right Panel: CS 001:2000 Regulatory & Barcode (4 cols) */}
                <div className="col-span-4 space-y-1.5 border-l border-slate-400/30 pl-2 text-[7px]">
                  <div>
                    <span className="font-bold block">Ingredients / គ្រឿងផ្សំ:</span>
                    <span className="opacity-90">{ingredientsList}</span>
                  </div>

                  <div className="border border-slate-900 p-1 rounded bg-amber-50/50 text-slate-950">
                    <span className="font-black block text-[6px] text-red-700 uppercase">⚠ ALLERGEN ADVICE:</span>
                    <span className="font-bold text-[7px] leading-tight block">{allergenBox}</span>
                  </div>

                  <div className="space-y-0.5 font-mono text-[7px]">
                    {lotNumber?.trim() && <p><strong>LOT:</strong> {lotNumber}</p>}
                    {stampDatesOnBag ? (
                      <p className="italic text-slate-600 font-sans">កាលបរិច្ឆេទ៖ សូមមើលលើកញ្ចប់</p>
                    ) : (
                      <>
                        {dateMarkingScheme === 'cs001_standard' && (mfdDate?.trim() || expDate?.trim()) && (
                          <p>{mfdDate?.trim() && <><strong>MFD:</strong> {mfdDate} </>}{expDate?.trim() && <>| <strong>EXP:</strong> {expDate}</>}</p>
                        )}
                        {dateMarkingScheme === 'export_bbd' && (mfdDate?.trim() || bbdDate?.trim()) && (
                          <p>{mfdDate?.trim() && <><strong>MFD:</strong> {mfdDate} </>}{bbdDate?.trim() && <>| <strong>BEST BEFORE:</strong> {bbdDate}</>}</p>
                        )}
                        {dateMarkingScheme === 'export_full_3dates' && (
                          <>
                            {(mfdDate?.trim() || pkdDate?.trim()) && <p>{mfdDate?.trim() && <><strong>MFD:</strong> {mfdDate} </>}{pkdDate?.trim() && <>| <strong>PKD:</strong> {pkdDate}</>}</p>}
                            {(bbdDate?.trim() || expDate?.trim()) && <p>{bbdDate?.trim() && <><strong>BBD:</strong> {bbdDate} </>}{expDate?.trim() && <>| <strong>EXP:</strong> {expDate}</>}</p>}
                          </>
                        )}
                        {dateMarkingScheme === 'export_eu_uk' && (mfdDate?.trim() || bbdDate?.trim()) && (
                          <p>{mfdDate?.trim() && <><strong>PROD:</strong> {mfdDate} </>}{bbdDate?.trim() && <>| <strong>BEST BEFORE END:</strong> {bbdDate}</>}</p>
                        )}
                        {dateMarkingScheme === 'export_usa' && (mfdDate?.trim() || bbdDate?.trim()) && (
                          <p>{mfdDate?.trim() && <><strong>MFG:</strong> {mfdDate} </>}{bbdDate?.trim() && <>| <strong>BEST IF USED BY:</strong> {bbdDate}</>}</p>
                        )}
                        {dateMarkingScheme === 'export_japan' && (mfdDate?.trim() || bbdDate?.trim()) && (
                          <p>{mfdDate?.trim() && <><strong>製造:</strong> {mfdDate} </>}{bbdDate?.trim() && <>| <strong>賞味期限:</strong> {bbdDate}</>}</p>
                        )}
                        {dateMarkingScheme === 'export_korea' && (mfdDate?.trim() || expDate?.trim()) && (
                          <p>{mfdDate?.trim() && <><strong>제조일자:</strong> {mfdDate} </>}{expDate?.trim() && <>| <strong>소비기한:</strong> {expDate}</>}</p>
                        )}
                        {dateMarkingScheme === 'export_china' && (mfdDate?.trim() || bbdDate?.trim()) && (
                          <p>{mfdDate?.trim() && <><strong>生产日期:</strong> {mfdDate} </>}{bbdDate?.trim() && <>| <strong>保质期至:</strong> {bbdDate} ({shelfLifeMonths}个月)</>}</p>
                        )}
                        {dateMarkingScheme === 'export_australia' && (pkdDate?.trim() || bbdDate?.trim()) && (
                          <p>{pkdDate?.trim() && <><strong>PACKED ON:</strong> {pkdDate} </>}{bbdDate?.trim() && <>| <strong>BEST BEFORE:</strong> {bbdDate}</>}</p>
                        )}
                        {dateMarkingScheme === 'export_gso_middle_east' && (mfdDate?.trim() || expDate?.trim()) && (
                          <p>{mfdDate?.trim() && <><strong>PROD:</strong> {mfdDate} </>}{expDate?.trim() && <>| <strong>EXP:</strong> {expDate}</>}</p>
                        )}
                      </>
                    )}
                    <p><strong>Storage:</strong> {storageInstructions.slice(0, 45)}...</p>
                  </div>

                  {/* SVG Barcode & QR Code */}
                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-300">
                    {formattedEan && barcodeBinary ? (
                      <div className="space-y-0.5">
                        {/* Barcode representation */}
                        <div className="bg-white p-1 rounded border border-slate-300">
                          <svg className="w-20 h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
                            {barcodeBinary.split('').map((bit, idx) => (
                              bit === '1' ? (
                                <rect key={idx} x={(idx / barcodeBinary.length) * 100} y="0" width="1" height="20" fill="#000" />
                              ) : null
                            ))}
                          </svg>
                          <p className="text-[6px] font-mono text-center font-bold tracking-widest text-slate-900">{formattedEan}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[7.5px] font-mono font-bold text-slate-500 italic">
                        Digital QR Passport
                      </div>
                    )}

                    {qrDataUrl && (
                      <img 
                        src={qrDataUrl} 
                        alt="Traceability QR" 
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded border border-slate-400 bg-white shrink-0 p-0.5" 
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}
                  </div>

                  {/* Certifications, Recycle & Anti-Drug Slogan Badges */}
                  <div className="pt-1 border-t border-slate-300/80 space-y-1">
                    <div className="flex flex-wrap items-center gap-1">
                      {selectedCertifications.map(certId => {
                        const cert = CAMBODIA_CERTIFICATION_STANDARDS.find(c => c.id === certId);
                        if (!cert) return null;
                        const badgeStyle = cert.category === 'organic'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : cert.category === 'iso'
                          ? 'bg-indigo-950 text-indigo-200 border border-indigo-500/50'
                          : cert.category === 'origin_gi'
                          ? 'bg-amber-950 text-amber-200 border border-amber-500/50'
                          : 'bg-slate-900 text-amber-300 border border-slate-700';
                        return (
                          <span key={certId} className={`${badgeStyle} text-[5.5px] font-bold px-1 py-0.5 rounded font-mono flex items-center gap-0.5`}>
                            <span>{cert.icon}</span>
                            <span>{cert.badgeLabel}</span>
                          </span>
                        );
                      })}
                      {showRecycleBadge && (
                        <span className="bg-teal-950 text-teal-200 border border-teal-500/50 text-[5.5px] font-bold px-1 py-0.5 rounded font-mono">
                          {RECYCLE_BADGE_OPTIONS.find(r => r.id === selectedRecycle)?.resinCode || '05 PP'}
                        </span>
                      )}
                    </div>

                    {showSocialSlogan && (
                      <div className="bg-slate-900/90 text-amber-200 text-[5.5px] px-1 py-0.5 rounded font-sans leading-tight text-center font-semibold">
                        ★ {selectedSlogan === 'custom' ? customSloganText : (SOCIAL_SLOGAN_OPTIONS.find(s => s.id === selectedSlogan)?.sloganKh || 'ចូលរួមទាំងអស់គ្នាដើម្បីជីវិត និងសហគមន៍គ្មានគ្រឿងញៀន!')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}

          {/* TAB 3: ROUND TOP LID STICKER (Ø 70mm DIE-CUT) */}
          {previewTab === 'lid-sticker' && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl text-center space-y-4">
              <div className="flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">Top Jar Lid Label</span>
                  <h4 className="text-sm font-bold text-white">Circular Die-Cut Sticker (Ø 65mm - 70mm)</h4>
                </div>
                <button
                  onClick={handlePrint}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <Printer size={13} />
                  <span>Print Lid</span>
                </button>
              </div>

              <div className="py-4 flex justify-center">
                <div className={`w-64 h-64 rounded-full border-4 border-amber-400 p-4 shadow-2xl flex flex-col items-center justify-between transition ${
                  labelTheme === 'artisan-kraft' ? 'bg-[#e8d7be] text-slate-900' :
                  labelTheme === 'premium-black' ? 'bg-slate-950 text-amber-100 border-amber-400' :
                  labelTheme === 'modern-green' ? 'bg-emerald-950 text-white' : 'bg-white text-slate-900'
                }`}>
                  <div className="text-center pt-2">
                    <p className={`text-[9px] font-black uppercase tracking-widest font-mono ${
                      labelTheme === 'premium-black' ? 'text-amber-400' : 'text-amber-800'
                    }`}>
                      ★ {trademarkLogoText} ★
                    </p>
                    <p className={`text-[10px] font-bold font-sans mt-0.5 ${
                      labelTheme === 'premium-black' ? 'text-amber-300' : 
                      labelTheme === 'modern-green' ? 'text-amber-300' : 'text-emerald-800'
                    }`}>
                      {productNameKhmer.split('(')[0]}
                    </p>
                  </div>

                  {/* Center Traceability QR and Icon */}
                  <div className="my-1 flex flex-col items-center justify-center space-y-1">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="Traceability QR" className="w-16 h-16 rounded-lg border-2 border-slate-900 bg-white p-1 shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-200 rounded" />
                    )}
                    <span className={`text-[7px] font-mono font-bold uppercase tracking-wider ${
                      labelTheme === 'premium-black' ? 'text-amber-300' : ''
                    }`}>
                      SCAN FOR FARM PASSPORT
                    </span>
                  </div>

                  <div className="text-center pb-2 border-t border-slate-300/40 w-full pt-1">
                    <h5 className="text-[10px] font-black uppercase tracking-tight">
                      {productNameEnglish.split('(')[0]}
                    </h5>
                    <p className={`text-[8px] font-mono font-bold ${
                      labelTheme === 'premium-black' ? 'text-amber-200/80' : 'text-slate-600'
                    }`}>
                      {netWeight} • 100% PURE & GRAIN-FREE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3.5: MICRO-LABEL A4 SHEET ($0.25 CHEAP RETAIL PACKS) */}
          {previewTab === 'micro-label-sheet' && (
            <SmallProductMicroLabelSheet 
              productNameKhmer={productNameKhmer}
              productNameEnglish={productNameEnglish}
              subheadingOrBotanical={subheadingOrBotanical}
              netWeight={netWeight}
              ingredientsList={ingredientsList}
              allergenBox={allergenBox}
              companyName={companyName}
              companyAddress={companyAddress}
              countryOfOrigin={countryOfOrigin}
              lotNumber={lotNumber}
              mfdDate={mfdDate}
              expDate={expDate}
              bbdDate={bbdDate}
              pkdDate={pkdDate}
              dateMarkingScheme={dateMarkingScheme}
              ean13Code={ean13Code}
              formattedEan={formattedEan}
              barcodeBinary={barcodeBinary}
              qrDataUrl={qrDataUrl}
              registrationMark={registrationMark}
              trademarkLogoText={trademarkLogoText}
              labelTheme={labelTheme}
              retailPrice="$0.25 (១,០០០៛)"
              brandLogoUrl={customBrandLogo}
              selectedCertifications={selectedCertifications}
              selectedRecycle={selectedRecycle}
              selectedSlogan={selectedSlogan}
              customSloganText={customSloganText}
              showRecycleBadge={showRecycleBadge}
              showSocialSlogan={showSocialSlogan}
            />
          )}

          {/* TAB 4: MSME SHELF-LIFE & PACKAGING SOURCING GUIDE */}
          {previewTab === 'shelf-life-guide' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Wrench size={16} className="text-amber-600" />
                  <span>ការគណនាថ្លៃដើមវេចខ្ចប់ & ទីផ្សារផ្គត់ផ្គង់ (MSME Packaging Cost & Sourcing Blueprint)</span>
                </h4>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  $0.22 / Unit Total Cost
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed font-sans">
                របៀបដែលសហគ្រាសធុនតូច និងមធ្យម (MSME) អាចបង្កើនតម្លៃបន្ថែម និងគុណភាពវេចខ្ចប់ដើម្បីដាក់លក់នៅផ្សារទំនើប អ៊ីអន (Aeon Mall), ឡាក់គី (Lucky Supermarket) និងទីផ្សារនាំចេញ ដោយមិនបាច់ចំណាយទុនធំ៖
              </p>

              <div className="space-y-2 font-sans">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">១. កំប៉ុងជ័រ PP ស្តង់ដារចំណីអាហារ ២០០ក្រាម + គម្របវីស (200g Food-Grade PP Jar)</p>
                    <p className="text-[10px] text-slate-500">Virgin homopolymer PP (Polypropylene 05). មានវិញ្ញាបនបត្រសុវត្ថិភាពម្ហូបអាហារ។</p>
                  </div>
                  <span className="font-mono font-bold text-slate-800">$0.12 - $0.15</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">២. បន្ទះអាលុយមីញ៉ូមបិទមាត់កំប៉ុងទប់ខ្យល់ (Induction Heat-Seal Foil Cap Liner Ø 70mm)</p>
                    <p className="text-[10px] text-slate-500">បិទជិតខ្យល់ ១០០% (Hermetic seal) ប្រើម៉ាស៊ីនបិទដៃអគ្គិសនីខ្នាតតូច (~$85 លើទីផ្សារក្នុងស្រុក)។</p>
                  </div>
                  <span className="font-mono font-bold text-slate-800">$0.02 - $0.03</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">៣. កញ្ចប់ស្រូបអុកស៊ីសែន 50cc (Food-Grade Oxygen Absorber Sachet)</p>
                    <p className="text-[10px] text-slate-500">ស្រូបអុកស៊ីសែនក្នុងកញ្ចប់ ការពារមិនឱ្យខូចក្លិន ពន្យារអាយុកាលពី ៣ខែ ទៅ ១៨ខែ។</p>
                  </div>
                  <span className="font-mono font-bold text-slate-800">$0.015 - $0.02</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">៤. ស្លាកស្ទីកឃ័រជ័រមិនជ្រាបទឹក Matte PP (Waterproof Synthetic PP Label)</p>
                    <p className="text-[10px] text-slate-500">បោះពុម្ពប្រព័ន្ធឌីជីថល Digital Roll នៅភ្នំពេញ (មិនចាំបាច់ឆ្លាក់ពុម្ពស៊ីឡាំង សម្រាប់ការកុម្ម៉ង់តិចតួច)។</p>
                  </div>
                  <span className="font-mono font-bold text-slate-800">$0.05 - $0.07</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-950 space-y-1 font-sans">
                <p className="font-bold flex items-center gap-1.5 text-xs">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>ផលប្រយោជន៍សេដ្ឋកិច្ច៖ លក់គ្រាប់ឆៅទល់នឹងកែច្នៃវេចខ្ចប់ (Farm Gate vs. Supermarket Retail)</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  ម្សៅគ្រាប់ស្វាយចន្ទីមិនទាន់វេចខ្ចប់លក់បានត្រឹម <strong>$5.50 / គ.ក្រ</strong> ($1.10 ក្នុង ២០០ក្រាម)។ ប៉ុន្តែពេលវេចខ្ចប់ក្នុងកំប៉ុងស្តង់ដារនេះ (ថ្លៃសម្ភារ $0.22) អាចលក់នៅផ្សារទំនើបបាន <strong>$4.50 - $6.00 ក្នុងមួយកំប៉ុង</strong> ($22.50 - $30.00 / គ.ក្រ) — បង្កើនប្រាក់ចំណេញ <strong>៤ ទៅ ៥ ដង</strong> សម្រាប់កសិករ និងសហគ្រាសខ្មែរ!
                </p>
              </div>
            </div>
          )}

          {/* Supermarket Readiness Audit Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <ShieldCheck size={15} className={supermarketScore >= 90 ? "text-emerald-600" : "text-amber-600"} />
                <span>ការវាយតម្លៃលក្ខខណ្ឌចូលផ្សារទំនើប (Supermarket Audit Checklist)</span>
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                supermarketScore >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {passedCount}/{complianceChecks.length} បានបំពេញ (Passed)
              </span>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {complianceChecks.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    {check.status ? (
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={13} className="text-amber-500 shrink-0" />
                    )}
                    <span className={check.status ? "text-slate-800 font-medium text-[11px]" : "text-amber-900 font-bold text-[11px]"}>
                      {check.title}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">{check.detail}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t flex items-center justify-between gap-2">
              <button
                onClick={handleCopySummary}
                className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1 transition px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                {copiedText ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedText ? 'បានចម្លងរួចរាល់! (Copied)' : 'ចម្លងឯកសារទិញដូរ (Copy Buyer Dossier)'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <Printer size={13} />
                <span>ព្រីនស្លាក Die-Cut (Print Label)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Modal for Download Confirmation & High-Res Preview */}
      {renderDownloadModal()}
      {renderCertificateModal()}
      <PouchHeader8cmPrinterModal
        isOpen={showPrinterHeaderModal}
        onClose={() => setShowPrinterHeaderModal(false)}
        customLogoUrl={customBrandLogo}
        brandName={companyName || 'Mayany Enterprise'}
        initialPhone={contactPhone || '+855887712862'}
        initialFacebook="Mayany Enterprise"
        initialWebsite="mayanyenterprise.com"
      />
      <FtcDefattingLabModal
        isOpen={showFtcModal}
        onClose={() => setShowFtcModal(false)}
        companyName={companyName || 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)'}
      />

      {/* Global floating toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-950/95 text-white border-2 border-emerald-400 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in max-w-[92vw]">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-amber-300 font-sans">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
