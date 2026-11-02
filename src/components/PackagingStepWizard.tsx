import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Check, ArrowRight, ArrowLeft, FastForward, Sparkles, 
  Printer, Download, ShieldCheck, Tag, Package, Calendar, MapPin, 
  Phone, Building, QrCode, FileText, CheckCircle2, RotateCcw,
  RefreshCw, Layers, Award, Info, Eye, Image as ImageIcon,
  Plus, CheckSquare, Sparkle, ExternalLink, ChevronDown, Trash2,
  Scale, AlertTriangle, X, Search, Barcode, Save, Loader2
} from 'lucide-react';
import type { QuickQRItem } from './PitchDeckQuickQRs';
import { useLanguage } from '../lib/LanguageContext';
import { smartTranslateKhmerAgro, ContainerType } from './PackagingLabelDesigner';
import { CAMBODIA_PROVINCES } from '../data/provinces';
import { calculateDateWithMonths } from '../data/labelAddressPresets';
import { 
  STRUCTURED_INGREDIENT_CATEGORIES, 
  BaseIngredient, 
  IngredientVariant,
  autoTranslateFullIngredientsList,
  combineDuplicateIngredients,
  addOrMergeIngredientToList,
  detectDuplicateIngredients,
  balanceIngredientsTo100,
  calculateIngredientsTotalPercent,
  hasSupplierStringsInIngredients,
  cleanseSupplierStringsFromIngredients,
  cleanIngredientsToKhmerOnly,
  cleanKhmerAllergenOnly,
  cleanKhmerStorageOnly,
  cleanKhmerUsageOnly,
  DEFAULT_OFFICIAL_SUPPLIERS,
  ensureKhmerProductName
} from '../lib/ingredientTranslator';
import { ProductPreset, PRODUCT_PRESETS } from '../data/productPresets';
import { NutritionFacts } from '../types';
import { NutritionFactsManager } from './NutritionFactsManager';
import { MISTI_COMPLIANCE_ICONS, STORAGE_PRESET_OPTIONS } from '../data/complianceIcons';
import SuppliersDirectoryModal from './SuppliersDirectoryModal';
import { formatEan13, ean13ToBinary, calculateEan13CheckDigit } from '../utils/barcodeGenerator';

export interface PackagingWizardData {
  customBrandLogo: string;
  companyName: string;
  productNameKhmer: string;
  productNameEnglish: string;
  subheadingOrBotanical: string;
  productDescription?: string;
  healthBenefits?: string;
  netWeight: string;
  containerType: ContainerType;
  ingredientsList: string;
  allergenBox: string;
  mfdDate: string;
  expDate: string;
  shelfLifeMonths: number;
  lotNumber: string;
  addressProvince: string;
  addressDetails: string;
  contactPhone: string;
  ean13Code: string;
  storageInstructions: string;
  instructionsForUse?: string;
  selectedCertifications: string[];
  packagingSymbols?: string[];
  stampDatesOnBag?: boolean;
  nutrition?: NutritionFacts;
  nutritionMode?: 'general_calc' | 'lab_tested';
  selectedSuppliers?: string[];
}

interface PackagingStepWizardProps {
  data: PackagingWizardData;
  onChange: (data: Partial<PackagingWizardData>) => void;
  onPrint: () => void;
  onDownload: () => void;
  onSaveToCatalog: () => void;
  onResetNewProduct: () => void;
  userPhone?: string;
  userName?: string;
  userTitle?: string;
  onSwitchToFullStudio?: () => void;
  renderLivePreviewNode: React.ReactNode;
  isDownloading?: boolean;
  onOpenCertificate?: () => void;
  qrDataUrl?: string;
  passportFullUrl?: string;
  smeCatalog?: ProductPreset[];
  onSelectCatalogProduct?: (preset: ProductPreset) => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  activeDedicatedProduct?: QuickQRItem | null;
  onSaveDedicatedProductUpdate?: () => Promise<boolean | void> | void;
  onReturnToQuickQrs?: () => void;
}

const STEP_DEFINITIONS = [
  { step: 1, titleKh: 'ឡូហ្គោម៉ាកសញ្ញា', titleEn: 'Brand Logo', icon: '🖼️' },
  { step: 2, titleKh: 'ឈ្មោះម៉ាក ឬ សហគ្រាស', titleEn: 'Brand / Enterprise Name', icon: '🏢' },
  { step: 3, titleKh: 'ឈ្មោះផលិតផល', titleEn: 'Product Name', icon: '🏷️' },
  { step: 4, titleKh: 'អនុចំណងជើង & រឿងរ៉ាវផលិតផល', titleEn: 'Botanical Subtitle & Product Story', icon: '🌿' },
  { step: 5, titleKh: 'បញ្ជីគ្រឿងផ្សំ & តារាងអាហារូបត្ថម្ភ', titleEn: 'Ingredients & Nutrition Facts', icon: '🥣' },
  { step: 6, titleKh: 'របៀបប្រើប្រាស់ & អត្ថប្រយោជន៍សុខភាព', titleEn: 'Instructions for Use & Health Benefits', icon: '🍵' },
  { step: 7, titleKh: 'ទម្ងន់សុទ្ធ & ទម្រង់វេចខ្ចប់', titleEn: 'Net Weight & Package Format', icon: '⚖️' },
  { step: 8, titleKh: 'បាកូដ EAN-13 & ឃ្យូអរកូដតាមដាន', titleEn: 'Barcode & QR Code', icon: '📲' },
  { step: 9, titleKh: 'កាលបរិច្ឆេទផលិត & ផុតកំណត់', titleEn: 'Mfg & Expiry Dates', icon: '📅' },
  { step: 10, titleKh: 'លេខឡូតិ៍ផលិតកម្ម', titleEn: 'Lot / Batch Number', icon: '🔢' },
  { step: 11, titleKh: 'អាសយដ្ឋានផលិត និងលេខទំនាក់ទំនង', titleEn: 'Manufacturer Address & Contact', icon: '📍' },
  { step: 12, titleKh: 'ផលិតផលកម្ពុជា & ស្តង់ដាររក្សាទុក', titleEn: 'Product of Cambodia, Storage & Standards', icon: '🇰🇭' },
  { step: 13, titleKh: 'ផ្ទៀងផ្ទាត់ & បោះពុម្ពស្លាក', titleEn: 'Review & Print Label', icon: '🖨️' },
];

const QUICK_KHMER_PRODUCTS = [
  'ម្សៅគ្រាប់ស្វាយចន្ទី',
  'គ្រាប់ស្វាយចន្ទីលីងអំបិលធម្មជាតិ',
  'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពត',
  'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្នោត',
  'ដំណាប់ស្វាយកែវរមៀត',
  'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ',
  'ប័រគ្រាប់ស្វាយចន្ទីធម្មជាតិ',
  'កាហ្វេមណ្ឌលគិរី',
  'ទឹកឃ្មុំព្រៃធម្មជាតិ',
  'សាច់ក្រកត្រីអត់ឆ្អឹង'
];

const COMMON_WEIGHTS = ['50g', '100g', '150g', '200g', '250g', '500g', '1kg'];

const COMMON_SPICES = [
  { kh: 'គ្រាប់ស្វាយចន្ទី ៩៨%', en: 'Cashews 98%' },
  { kh: 'អំបិលសមុទ្រ ២%', en: 'Sea Salt 2%' },
  { kh: 'ម្រេចកំពត GI ៥%', en: 'Kampot Pepper 5%' },
  { kh: 'ស្ករត្នោត ៣%', en: 'Palm Sugar 3%' },
  { kh: 'ម្ទេសធម្មជាតិ ២%', en: 'Chili 2%' },
  { kh: 'ខ្ទឹមស ២%', en: 'Garlic 2%' },
];

export function parseBotanicalTwoRows(text: string, contextProduct?: string): { row1: string; row2: string } {
  if (!text || text.trim().length === 0) {
    const lower = (contextProduct || '').toLowerCase();
    if (lower.includes('flour') || lower.includes('ម្សៅ') || lower.includes('powder')) {
      return {
        row1: '100% Pure Cashew Kernel Flour (Anacardium occidentale)',
        row2: '100% Natural, Grain-Free & Plant-Based'
      };
    }
    if (lower.includes('sugar') || lower.includes('ស្ករ')) {
      return {
        row1: 'Cambodian Cashews (Anacardium occidentale)',
        row2: 'Sugar coated cashew kernels'
      };
    }
    if (lower.includes('chili') || lower.includes('ម្ទេស')) {
      return {
        row1: 'Cambodian Cashews (Anacardium occidentale)',
        row2: 'Spicy Natural Chili Coated'
      };
    }
    if (lower.includes('pepper') || lower.includes('ម្រេច')) {
      return {
        row1: 'Selected Cambodian Cashews (Anacardium occidentale)',
        row2: 'Artisanal GI Kampot Pepper Coated (Piper nigrum)'
      };
    }
    return {
      row1: 'Selected Cambodian Cashews (Anacardium occidentale)',
      row2: 'Pure Natural Cambodian Cashew Kernels'
    };
  }
  let row1 = '';
  let row2 = '';
  if (text.includes('\n')) {
    const lines = text.split('\n');
    row1 = lines[0].trim();
    row2 = lines.slice(1).join(' ').trim();
  } else if (text.includes(' • ')) {
    const parts = text.split(' • ');
    row1 = parts[0].trim();
    row2 = parts.slice(1).join(' • ').trim();
  } else if (text.includes('•')) {
    const parts = text.split('•');
    row1 = parts[0].trim();
    row2 = parts.slice(1).join(' ').trim();
  } else {
    row1 = text.trim();
    row2 = '';
  }
  row2 = row2.replace(/^[•\-\*]\s*/, '').trim();
  return { row1, row2 };
}

export default function PackagingStepWizard({
  data,
  onChange,
  onPrint,
  onDownload,
  onSaveToCatalog,
  onResetNewProduct,
  userPhone,
  userName,
  userTitle,
  onSwitchToFullStudio,
  renderLivePreviewNode,
  isDownloading = false,
  onOpenCertificate,
  qrDataUrl,
  passportFullUrl,
  smeCatalog = [],
  onSelectCatalogProduct,
  currentStep: propCurrentStep,
  onStepChange,
  activeDedicatedProduct,
  onSaveDedicatedProductUpdate,
  onReturnToQuickQrs
}: PackagingStepWizardProps) {
  const { isKhmer: ctxIsKhmer } = useLanguage();
  // Wizard steps for preparing packaging labels default strictly to Khmer language
  const isKhmer = true;
  const [internalStep, setInternalStep] = useState<number>(propCurrentStep || 1);

  useEffect(() => {
    if (propCurrentStep !== undefined) {
      setInternalStep(propCurrentStep);
    }
  }, [propCurrentStep]);

  const currentStep = propCurrentStep !== undefined ? propCurrentStep : internalStep;

  const setCurrentStep = (newStep: number | ((prev: number) => number)) => {
    const nextVal = typeof newStep === 'function' ? newStep(currentStep) : newStep;
    setInternalStep(nextVal);
    if (onStepChange) {
      onStepChange(nextVal);
    }
  };
  const [showMobilePreview, setShowMobilePreview] = useState<boolean>(false);
  const [showSuppliersModal, setShowSuppliersModal] = useState<boolean>(false);
  const [showStep3Extras, setShowStep3Extras] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistent brand products map from localStorage
  const [brandProductsMap, setBrandProductsMap] = useState<Record<string, string[]>>(() => {
    try {
      const raw = localStorage.getItem('cashewtrace_brand_products_v1');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [justSavedToCatalog, setJustSavedToCatalog] = useState<boolean>(false);
  const [isSavingDedicatedProduct, setIsSavingDedicatedProduct] = useState<boolean>(false);
  const [dedicatedProductSavedNotice, setDedicatedProductSavedNotice] = useState<string | null>(null);
  const [dedicatedProductSavedTime, setDedicatedProductSavedTime] = useState<string | null>(null);

  const handleDedicatedSaveClick = async () => {
    if (!onSaveDedicatedProductUpdate || isSavingDedicatedProduct) return;
    setIsSavingDedicatedProduct(true);
    setDedicatedProductSavedNotice(null);
    try {
      await Promise.resolve(onSaveDedicatedProductUpdate());
      const now = new Date();
      const timeStr = now.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) || now.toLocaleTimeString();
      setDedicatedProductSavedTime(timeStr);
      setDedicatedProductSavedNotice('✓ បានធ្វើបច្ចុប្បន្នភាព និងសមកាលកម្មទិន្នន័យទាំង ១៣ ជំហានលើ QR Code និង Cloud ជោគជ័យ!');
    } catch (err) {
      console.error('Save dedicated product error:', err);
      setDedicatedProductSavedNotice('⚠️ មានបញ្ហាបន្តិចបន្តួចក្នុងការព្យាយាមរក្សាទុក សូមសាកល្បងម្ដងទៀត');
    } finally {
      setIsSavingDedicatedProduct(false);
    }
  };

  const handleSaveCatalogClick = () => {
    onSaveToCatalog();
    setJustSavedToCatalog(true);
    setTimeout(() => setJustSavedToCatalog(false), 5000);
  };

  const activeBrandName = (data.companyName || '').trim();
  const activeBrandKey = activeBrandName ? activeBrandName.toLowerCase() : '__general__';
  const brandSavedProducts = brandProductsMap[activeBrandKey] || [];

  const persistProductName = (rawName?: string) => {
    const nameToSave = (rawName !== undefined ? rawName : data.productNameKhmer || '').trim();
    if (!nameToSave || nameToSave.length < 2) return;

    const bKey = (data.companyName || '').trim() ? (data.companyName || '').trim().toLowerCase() : '__general__';

    setBrandProductsMap((prev) => {
      const list = prev[bKey] || [];
      if (list.includes(nameToSave)) return prev;
      const updated = [nameToSave, ...list];
      const newMap = { ...prev, [bKey]: updated };
      try {
        localStorage.setItem('cashewtrace_brand_products_v1', JSON.stringify(newMap));
      } catch {
        // ignore
      }
      return newMap;
    });

    setSavedNotice(nameToSave);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  // Proactively cleanse any supplier strings accidentally added to ingredientsList
  useEffect(() => {
    if (data.ingredientsList && hasSupplierStringsInIngredients(data.ingredientsList)) {
      const cleansed = cleanseSupplierStringsFromIngredients(data.ingredientsList);
      if (cleansed !== data.ingredientsList) {
        onChange({ ingredientsList: cleansed });
      }
    }
  }, [data.ingredientsList, onChange]);

  const handleRemoveSavedProduct = (productToRemove: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const bKey = (data.companyName || '').trim() ? (data.companyName || '').trim().toLowerCase() : '__general__';
    setBrandProductsMap((prev) => {
      const list = prev[bKey] || [];
      const updated = list.filter(p => p !== productToRemove);
      const newMap = { ...prev, [bKey]: updated };
      try {
        localStorage.setItem('cashewtrace_brand_products_v1', JSON.stringify(newMap));
      } catch {
        // ignore
      }
      return newMap;
    });
  };

  const totalSteps = STEP_DEFINITIONS.length;
  const currentStepDef = STEP_DEFINITIONS[currentStep - 1];

  const handleNext = () => {
    if (currentStep === 3 && data.productNameKhmer?.trim()) {
      persistProductName(data.productNameKhmer);
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBypass = () => {
    handleNext();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange({ customBrandLogo: result });
        try {
          localStorage.setItem('cashewtrace_sme_brand_logo', result);
          window.dispatchEvent(new Event('cashewtrace_logo_updated'));
        } catch (e) {
          console.warn('Could not save logo to localStorage', e);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    onChange({ customBrandLogo: '/mayany_official_logo.jpg' });
    try {
      localStorage.removeItem('cashewtrace_sme_brand_logo');
      window.dispatchEvent(new Event('cashewtrace_logo_updated'));
    } catch (e) {
      console.warn('Could not remove logo from localStorage', e);
    }
  };

  const handleAutoTranslateName = () => {
    if (!data.productNameKhmer) return;
    const res = smartTranslateKhmerAgro(data.productNameKhmer);
    onChange({
      productNameEnglish: res.english,
      subheadingOrBotanical: res.botanical
    });
  };

  const handleSelectShelfLife = (months: number) => {
    const calculated = calculateDateWithMonths(data.mfdDate, months);
    onChange({
      shelfLifeMonths: months,
      expDate: calculated
    });
  };

  const handleGenerateFreshLot = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const newLot = `LOT-${dateStr}-${randomNum}`;
    onChange({ lotNumber: newLot });
  };

  // Step 5: Structured Ingredients Builder & Category Dropdowns
  const [selectedBaseIngredient, setSelectedBaseIngredient] = useState<BaseIngredient | null>(null);
  const [selectedVariantNameKh, setSelectedVariantNameKh] = useState<string>('');
  const [selectedVariantNameEn, setSelectedVariantNameEn] = useState<string>('');
  const [customIngredientKh, setCustomIngredientKh] = useState<string>('');
  const [customIngredientEn, setCustomIngredientEn] = useState<string>('');
  const [ingredientPercent, setIngredientPercent] = useState<string>('');
  const [isCustomVariant, setIsCustomVariant] = useState<boolean>(false);
  const [addedSuccessToast, setAddedSuccessToast] = useState<string | null>(null);

  const handleSelectBaseIngredient = (item: BaseIngredient) => {
    setSelectedBaseIngredient(item);
    setIsCustomVariant(false);
    setSelectedVariantNameKh(item.nameKh);
    setSelectedVariantNameEn(item.nameEn);
    setIngredientPercent(item.defaultPercent ? item.defaultPercent.toString() : '');
  };

  const handleSelectVariant = (variant: IngredientVariant) => {
    setIsCustomVariant(false);
    setSelectedVariantNameKh(variant.nameKh);
    setSelectedVariantNameEn(variant.nameEn);
    if (variant.defaultPercent) {
      setIngredientPercent(variant.defaultPercent.toString());
    }
  };

  const handleAddCurrentIngredient = () => {
    let nameKh = selectedVariantNameKh.trim();
    let nameEn = selectedVariantNameEn.trim();

    if (!nameKh && selectedBaseIngredient) {
      nameKh = selectedBaseIngredient.nameKh;
      nameEn = selectedBaseIngredient.nameEn;
    }

    if (!nameKh) return;

    const pct = ingredientPercent.trim();

    // Intelligently combine and sum percentage if the ingredient already exists in the list
    const mergeResult = addOrMergeIngredientToList(data.ingredientsList || '', {
      nameKh,
      nameEn,
      percent: pct || undefined
    });

    onChange({ ingredientsList: mergeResult.updatedList });

    if (mergeResult.mergedWithExisting) {
      setAddedSuccessToast(
        isKhmer
          ? `✓ បានកំណត់ «${mergeResult.itemName}» ទៅជា ${mergeResult.combinedPercent}% រួចរាល់`
          : `✓ Updated "${mergeResult.itemName}" to ${mergeResult.combinedPercent}%`
      );
    } else {
      const pctNumber = pct.replace('%', '');
      const entryDesc = pctNumber ? `${nameKh} ${pctNumber}%` : nameKh;
      setAddedSuccessToast(
        isKhmer
          ? `✓ បានបន្ថែម «${entryDesc}» ទៅក្នុងបញ្ជី`
          : `✓ Added "${entryDesc}" to ingredients list`
      );
    }
    setTimeout(() => setAddedSuccessToast(null), 4000);

    // Reset percent
    setIngredientPercent('');
  };

  const handleBalanceTo100 = () => {
    if (!data.ingredientsList) return;
    const balanced = balanceIngredientsTo100(data.ingredientsList);
    onChange({ ingredientsList: balanced });
    setAddedSuccessToast(
      isKhmer
        ? '✓ បានថ្លឹងភាគរយគ្រឿងផ្សំឱ្យគ្រប់ ១០០% តាមស្ដង់ដារជាតិ CS 001 រួចរាល់!'
        : '✓ Balanced ingredients to exactly 100% CS 001 standard!'
    );
    setTimeout(() => setAddedSuccessToast(null), 3500);
  };

  const handleAutoTranslateIngredients = () => {
    if (!data.ingredientsList) return;
    const translated = autoTranslateFullIngredientsList(data.ingredientsList);
    const combined = combineDuplicateIngredients(translated);
    onChange({ ingredientsList: combined });
    setAddedSuccessToast(
      isKhmer 
        ? '✓ បានបកប្រែជាភាសាអង់គ្លេស និងបង្រួមមុខដូចគ្នាដោយស្វ័យប្រវត្តិ'
        : '✓ Auto-translated and combined duplicate ingredients'
    );
    setTimeout(() => setAddedSuccessToast(null), 3500);
  };

  const handleCombineDuplicateIngredients = () => {
    if (!data.ingredientsList) return;
    const combined = combineDuplicateIngredients(data.ingredientsList);
    onChange({ ingredientsList: combined });
    setAddedSuccessToast(
      isKhmer 
        ? '✓ បានបង្រួម និងបូកសរុបភាគរយមុខដូចគ្នារួចរាល់'
        : '✓ Combined & summed duplicate ingredients'
    );
    setTimeout(() => setAddedSuccessToast(null), 3500);
  };

  const isCustomLogoActive = data.customBrandLogo && data.customBrandLogo !== '/mayany_official_logo.jpg';

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const [localCatalog, setLocalCatalog] = useState<ProductPreset[]>(() => {
    try {
      const saved = localStorage.getItem('cashewtrace_sme_custom_catalog');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState<string>('');

  // Received Enterprise Barcodes (GS1 / EAN-13 barcodes received by SME)
  const [receivedBarcodes, setReceivedBarcodes] = useState<Array<{ id: string; code: string; label: string }>>(() => {
    try {
      const saved = localStorage.getItem('cashewtrace_received_barcodes');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: 'bc-1', code: '8842120005093', label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពត' },
      { id: 'bc-2', code: '8842120005109', label: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្នោត' },
      { id: 'bc-3', code: '8842120005116', label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសខ្ទឹម' },
      { id: 'bc-4', code: '8842120005123', label: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ' }
    ];
  });

  const handleSaveReceivedBarcode = (codeToSave: string, labelText?: string) => {
    if (!codeToSave || !codeToSave.trim()) return;
    const cleanDigits = codeToSave.replace(/\D/g, '');
    const validCode = cleanDigits.length === 12 ? formatEan13(cleanDigits) : cleanDigits;
    const prodLabel = labelText || data.productNameKhmer || data.productNameEnglish || 'ផលិតផល';
    const updated = [
      { id: `bc-${Date.now()}`, code: validCode, label: prodLabel.split('(')[0].trim() },
      ...receivedBarcodes.filter(b => b.code !== validCode)
    ].slice(0, 30);
    setReceivedBarcodes(updated);
    try {
      localStorage.setItem('cashewtrace_received_barcodes', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setToastNotice(`✓ បានរក្សាទុកបាកូដ ${validCode} សម្រាប់ «${prodLabel.slice(0, 25)}»!`);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const handleDeleteCustomProduct = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const saved = localStorage.getItem('cashewtrace_sme_custom_catalog');
      if (saved) {
        const list: ProductPreset[] = JSON.parse(saved);
        const filtered = list.filter(item => item.id !== productId);
        localStorage.setItem('cashewtrace_sme_custom_catalog', JSON.stringify(filtered));
        setLocalCatalog(filtered);
      }
    } catch {
      // ignore
    }
  };

  // Clean out legacy / conflicting catalog items per user request (removes old test entries)
  const isLegacyUnwantedItem = (item: ProductPreset) => {
    const kh = (item.nameKhmerDefault || '').toLowerCase();
    const ing = (item.defaultIngredients || '').toLowerCase();
    return (
      kh.includes('ដកប្រេង') ||
      ing.includes('ដកប្រេង') ||
      ing.includes('0.05%') ||
      kh.includes('លីងម្រេចខ្មៅកំពត gi yas 5%') ||
      kh.includes('គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរ (ww180')
    );
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cashewtrace_sme_custom_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleaned = Array.isArray(parsed) ? parsed.filter((p: ProductPreset) => !isLegacyUnwantedItem(p)) : [];
        setLocalCatalog(cleaned);
        if (cleaned.length !== (parsed?.length || 0)) {
          localStorage.setItem('cashewtrace_sme_custom_catalog', JSON.stringify(cleaned));
        }
      }
    } catch {
      // ignore
    }
  }, [justSavedToCatalog, smeCatalog]);

  // Guard against dedicated product weight/barcode cross-pack pollution (e.g. 50g pouch getting 175g jar barcode)
  useEffect(() => {
    if (!activeDedicatedProduct) return;
    
    // Product 1: Pure Flour 200g Jar
    if (activeDedicatedProduct.id === 'flour-jar-200g' || activeDedicatedProduct.productNumber === 1) {
      if (data.netWeight !== '200g' || data.ean13Code !== '8847116350047') {
        onChange({
          netWeight: '200g',
          ean13Code: '8847116350047',
          containerType: 'pp-jar-200g'
        });
      }
    }
    // Product 2: Sugar 175g Jar
    else if (activeDedicatedProduct.id === 'ww180-sugar-jar-175g' || activeDedicatedProduct.productNumber === 2) {
      if (data.netWeight?.includes('50') || data.ean13Code === '8847116350023' || data.lotNumber === '2026-CKS-050' || data.ean13Code !== '8847116350085') {
        onChange({
          netWeight: '175g',
          ean13Code: '8847116350085',
          containerType: 'pp-jar-200g',
          lotNumber: '2026-CKS-175'
        });
      }
    }
    // Product 3: Sugar 50g Pouch
    else if (activeDedicatedProduct.id === 'ww180-sugar-pouch-50g' || activeDedicatedProduct.productNumber === 3) {
      if (data.netWeight?.includes('175') || data.netWeight?.includes('200') || data.ean13Code === '8847116350085' || data.ean13Code === '8847116350122' || data.lotNumber === '2026-CKS-175' || data.lotNumber === '2026-CKS-261') {
        onChange({
          netWeight: '50g',
          ean13Code: '8847116350023',
          containerType: 'standup-pouch-50g',
          lotNumber: '2026-CKS-050'
        });
      }
    }
    // Product 4: Pepper 175g Jar
    else if (activeDedicatedProduct.id === 'ww180-pepper-jar-175g' || activeDedicatedProduct.productNumber === 4) {
      if (data.netWeight?.includes('50') || data.ean13Code === '8847116350016' || data.lotNumber === '2026-CKP-050' || data.ean13Code !== '8847116350061') {
        onChange({
          netWeight: '175g',
          ean13Code: '8847116350061',
          containerType: 'pp-jar-200g',
          lotNumber: '2026-CKP-175'
        });
      }
    }
    // Product 5: Pepper 50g Pouch
    else if (activeDedicatedProduct.id === 'pepper-pouch-50g' || activeDedicatedProduct.productNumber === 5) {
      if (data.netWeight?.includes('175') || data.netWeight?.includes('200') || data.ean13Code === '8847116350061' || data.ean13Code === '8847116350115' || data.lotNumber === '2026-CKP-175' || data.lotNumber === '2026-CKP-261') {
        onChange({
          netWeight: '50g',
          ean13Code: '8847116350016',
          containerType: 'standup-pouch-50g',
          lotNumber: '2026-CKP-050'
        });
      }
    }
    // Product 6: Chili 175g Jar
    else if (activeDedicatedProduct.id === 'ww180-chili-jar-175g' || activeDedicatedProduct.productNumber === 6) {
      if (data.netWeight?.includes('50') || data.ean13Code === '8847116350078' || data.lotNumber === '2026-CKC-050' || data.ean13Code !== '8847116350092') {
        onChange({
          netWeight: '175g',
          ean13Code: '8847116350092',
          containerType: 'pp-jar-200g',
          lotNumber: '2026-CKC-175'
        });
      }
    }
    // Product 7: Chili 50g Pouch
    else if (activeDedicatedProduct.id === 'ww180-chili-pouch-50g' || activeDedicatedProduct.productNumber === 7) {
      if (data.netWeight?.includes('175') || data.netWeight?.includes('200') || data.ean13Code === '8847116350092' || data.ean13Code === '8847116350139' || data.lotNumber === '2026-CKC-175' || data.lotNumber === '2026-CKC-261') {
        onChange({
          netWeight: '50g',
          ean13Code: '8847116350078',
          containerType: 'standup-pouch-50g',
          lotNumber: '2026-CKC-050'
        });
      }
    }
    // Product 8: BB Pepper 50g Pouch
    else if (activeDedicatedProduct.id === 'bb-pepper-pouch-50g' || activeDedicatedProduct.productNumber === 8) {
      if (data.ean13Code !== '8847116350108') {
        onChange({
          netWeight: '50g',
          ean13Code: '8847116350108',
          containerType: 'standup-pouch-50g'
        });
      }
    }
    // Product 9: Cashew Drink 1L Bottle
    else if (activeDedicatedProduct.id === 'cashew-milk-1l' || activeDedicatedProduct.productNumber === 9) {
      if (data.ean13Code !== '8847116350054') {
        onChange({
          netWeight: '1L',
          ean13Code: '8847116350054',
          containerType: 'bottle-1l'
        });
      }
    }
  }, [activeDedicatedProduct]);

  const rawEffectiveCatalog = (smeCatalog && smeCatalog.length > 0) ? smeCatalog : localCatalog;
  const effectiveCatalog = rawEffectiveCatalog.filter((p: ProductPreset) => !isLegacyUnwantedItem(p));

  const corePresetIds = ['cashew-powder-200g', 'mayany-ww180-pepper-5', 'mayany-ww180-sugar', 'mayany-ww180-chili'];
  const defaultCorePresets = corePresetIds
    .map(id => PRODUCT_PRESETS.find(p => p.id === id))
    .filter(Boolean) as ProductPreset[];

  // Display catalog: clean custom saved products first, followed by the 4 dedicated verified presets
  const displayCatalogList: ProductPreset[] = [
    ...effectiveCatalog,
    ...defaultCorePresets.filter(dp => !effectiveCatalog.some(ep => ep.nameKhmerDefault === dp.nameKhmerDefault || ep.id === dp.id))
  ];

  const handleSelectCatalogProduct = (preset: ProductPreset) => {
    if (onSelectCatalogProduct) {
      onSelectCatalogProduct(preset);
    }
    onChange({
      productNameKhmer: ensureKhmerProductName(preset.nameKhmerDefault, preset.nameEnglishDefault),
      productNameEnglish: preset.nameEnglishDefault,
      subheadingOrBotanical: preset.botanicalOrSubtext,
      netWeight: preset.defaultNetWeight,
      containerType: preset.containerType,
      ingredientsList: cleanIngredientsToKhmerOnly(preset.defaultIngredients),
      allergenBox: cleanKhmerAllergenOnly(preset.allergenAdvice),
      storageInstructions: cleanKhmerStorageOnly(preset.storageInstructions),
      instructionsForUse: cleanKhmerUsageOnly(preset.instructionsForUse),
      productDescription: preset.productDescriptionKhmer || '',
      healthBenefits: preset.healthBenefitsKhmer || '',
      nutrition: preset.typicalNutrition,
      shelfLifeMonths: preset.shelfLifeMonths || 6,
      expDate: calculateDateWithMonths(data.mfdDate, preset.shelfLifeMonths || 6),
      ean13Code: preset.ean13Default,
      lotNumber: data.lotNumber || `LOT-2026-${(preset.id || 'CSH').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}-01`
    });
    setToastNotice(`✓ បានយកទិន្នន័យ «${preset.nameKhmerDefault.split('(')[0]}» ពីកាតាឡុកមកប្រើ!`);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const currentProdEn = (data.productNameEnglish || '').toLowerCase();
  const currentProdKh = (data.productNameKhmer || '').toLowerCase();
  const activeCoreProduct: 'flour' | 'pepper' | 'sugar' | 'chili' | 'other' = 
    (currentProdEn.includes('flour') || currentProdKh.includes('ម្សៅ') || currentProdEn.includes('powder')) ? 'flour' :
    (currentProdEn.includes('pepper') || currentProdKh.includes('ម្រេច')) ? 'pepper' :
    (currentProdEn.includes('sugar') || currentProdKh.includes('ស្ករ')) ? 'sugar' :
    (currentProdEn.includes('chili') || currentProdKh.includes('ម្ទេស')) ? 'chili' : 'other';

  return (
    <div id="packaging-step-wizard-container" className="space-y-6 scroll-mt-6">
      {/* Active Dedicated QR Code Product Mode Banner */}
      {activeDedicatedProduct && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-2 border-amber-500 rounded-3xl p-4 sm:p-5 text-slate-950 shadow-md space-y-3 animate-fade-in no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 text-xl font-black shadow-sm">
                {activeDedicatedProduct.icon || '📦'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full font-mono">
                    កែប្រែទិន្នន័យលើ QR Code ផ្លូវការ (រោងពុម្ព)
                  </span>
                  <span className="text-[10px] font-bold bg-white/90 text-slate-900 px-2 py-0.5 rounded font-mono">
                    LOT: {activeDedicatedProduct.batch}
                  </span>
                  <span className="text-[10px] font-bold bg-white/90 text-slate-900 px-2 py-0.5 rounded font-mono">
                    BARCODE: {activeDedicatedProduct.ean13}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                  {activeDedicatedProduct.nameKh} • <span className="font-sans font-bold">{activeDedicatedProduct.nameEn}</span> ({activeDedicatedProduct.weight})
                </h3>
                <p className="text-xs text-slate-900 font-medium">
                  កំពុងស្ថិតក្នុងប្រព័ន្ធ ១៣ ជំហានពេញលេញ។ លោកអ្នកអាចកែប្រែទិន្នន័យ ឬពិនិត្យគ្រប់ជំហានទាំង ១៣ ដោយមិនបង្កើត QR Code ថ្មីឡើយ។
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              {onSaveDedicatedProductUpdate && (
                <button
                  type="button"
                  disabled={isSavingDedicatedProduct}
                  onClick={handleDedicatedSaveClick}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-80"
                >
                  {isSavingDedicatedProduct ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-amber-400" />
                      <span>កំពុងរក្សាទុក...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} className="text-amber-400" />
                      <span>រក្សាទុកទៅ QR Code & Cloud</span>
                    </>
                  )}
                </button>
              )}
              {onReturnToQuickQrs && (
                <button
                  type="button"
                  onClick={onReturnToQuickQrs}
                  className="px-3.5 py-2.5 bg-white/90 hover:bg-white text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer border border-amber-300"
                >
                  <span>⬆️ មើល QR Codes ទាំង ១០</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Jump Bar across all 13 stages */}
          <div className="pt-2 border-t border-amber-600/20">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
              <span>ចុចដើម្បីលោតទៅកាន់ជំហានណាមួយក្នុងចំណោម ១៣ ជំហាន៖</span>
              <span className="font-mono text-[11px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
                ជំហានបច្ចុប្បន្ន៖ {currentStep} នៃ {totalSteps}
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {STEP_DEFINITIONS.map((def) => {
                const isActive = def.step === currentStep;
                return (
                  <button
                    key={def.step}
                    type="button"
                    onClick={() => setCurrentStep(def.step)}
                    className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 text-amber-300 ring-2 ring-slate-950 shadow-xs'
                        : 'bg-white/80 hover:bg-white text-slate-800 border border-amber-300/80'
                    }`}
                    title={`${def.step}. ${def.titleKh} (${def.titleEn})`}
                  >
                    <span>{def.icon}</span>
                    <span>{def.step}. {def.titleKh.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top Header Card: Minimal, serene, with user identity & step indicator */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-200">
              {isKhmer ? 'ស្តង់ដារ CS 001:2000' : 'CS 001:2000 Wizard'}
            </span>
            {userName && (
              <span className="text-xs font-bold text-slate-600">
                👤 {userName} {userTitle ? `(${userTitle})` : ''}
              </span>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 font-sans tracking-tight">
            {isKhmer ? 'ប្រព័ន្ធបង្កើតស្លាកវេចខ្ចប់មួយជំហានម្តងៗ' : 'Step-by-Step Packaging Label Studio'}
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            {isKhmer 
              ? 'បំពេញទិន្នន័យ ៩ ទៅ ១២ ព័ត៌មានម្តងមួយផ្ទាំង — បើគ្មានទិន្នន័យអាចចុច «រំលង»' 
              : 'Enter label data one screen at a time — skip anytime if data is not available'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {toastNotice && (
            <div className="text-xs font-bold text-emerald-950 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl animate-fade-in flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-700" />
              <span>{toastNotice}</span>
            </div>
          )}

          {/* Quick Catalog Trigger */}
          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-xs cursor-pointer"
            title={isKhmer ? 'កាតាឡុកផលិតផល' : 'Product Catalog'}
          >
            <Package size={14} />
            <span>{isKhmer ? 'កាតាឡុក' : 'Catalog'}</span>
          </button>

          {/* Mobile Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            <span>{showMobilePreview ? (isKhmer ? 'លាក់ស្លាក' : 'Hide Preview') : (isKhmer ? 'មើលស្លាកផ្ទាល់' : 'Live Preview')}</span>
          </button>

          {/* Switch to Full Studio if needed */}
          {onSwitchToFullStudio && (
            <button
              type="button"
              onClick={onSwitchToFullStudio}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
              title="Advanced Full Studio Mode"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{isKhmer ? 'ផ្ទាំងរចនាពេញលេញ' : 'Full Studio'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs no-print">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-700 flex items-center gap-1.5 font-sans">
            <span className="text-base">{currentStepDef.icon}</span>
            <span>{isKhmer ? `ជំហានទី ${currentStep} នៃ ${totalSteps}: ${currentStepDef.titleKh}` : `Step ${currentStep} of ${totalSteps}: ${currentStepDef.titleEn}`}</span>
          </span>
          <span className="font-mono font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>

        {/* Visual Progress Track */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-amber-600 to-emerald-700 h-full rounded-full"
            initial={false}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Quick Navigation Bar (Horizontal scrollable chips) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 no-scrollbar">
          {STEP_DEFINITIONS.map((def) => {
            const isDone = def.step < currentStep;
            const isCurrent = def.step === currentStep;
            return (
              <button
                key={def.step}
                type="button"
                onClick={() => setCurrentStep(def.step)}
                className={`shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isCurrent 
                    ? 'bg-amber-600 text-white shadow-xs' 
                    : isDone 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <span>{def.icon}</span>
                <span>{def.step}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Step Wizard Card on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start print:!block print:!w-full print:!m-0 print:!p-0">
        
        {/* Left Column: Focused Single-Screen Wizard Step */}
        <div className={`xl:col-span-6 2xl:col-span-7 no-print ${showMobilePreview ? 'hidden xl:block' : 'block'}`}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md relative min-h-[460px] flex flex-col justify-between">
            
            {/* Step Inner Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-500/20 flex items-center justify-center text-2xl">
                    {currentStepDef.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                      {isKhmer ? `ជំហាន ${currentStep} / ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                      {isKhmer ? currentStepDef.titleKh : currentStepDef.titleEn}
                    </h2>
                  </div>
                </div>

                {/* Bypass / Skip Top Button */}
                {currentStep < totalSteps && (
                  <button
                    type="button"
                    onClick={handleBypass}
                    className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-amber-700 transition-colors px-2.5 py-1 rounded-lg hover:bg-amber-50 cursor-pointer"
                  >
                    <span>{isKhmer ? 'រំលង' : 'Bypass'}</span>
                    <FastForward className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dynamic Step Screens */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* STEP 1: Brand Logo */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {isKhmer 
                          ? 'ផ្ទុកឡើងឡូហ្គោ ឬ ម៉ាកសញ្ញាអាជីវកម្មរបស់អ្នក។ បើលោកអ្នកមានឡូហ្គោរួចហើយ វានឹងប្រើសម្រាប់ផលិតផលទាំងអស់ដោយស្វ័យប្រវត្តិ។' 
                          : 'Upload your brand or enterprise logo. Once uploaded, it is automatically remembered for all your products.'}
                      </p>

                      {/* Current Logo Display */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs shrink-0">
                          {data.customBrandLogo ? (
                            <img 
                              src={data.customBrandLogo} 
                              alt="Brand Logo" 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                          )}
                        </div>

                        <div className="space-y-2 text-center sm:text-left flex-1">
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              {isCustomLogoActive 
                                ? (isKhmer ? 'ឡូហ្គោផ្ទាល់ខ្លួនបានតម្កល់' : 'Custom Logo Active')
                                : (isKhmer ? 'ឡូហ្គោគំរូស្តង់ដារ CS 001' : 'Default Mayany / CS 001 Logo')}
                            </span>
                            <p className="text-xs text-slate-500 mt-1 font-sans">
                              {isCustomLogoActive
                                ? (isKhmer ? 'ឡូហ្គោនេះនឹងបោះពុម្ពលើផលិតផលរបស់អ្នក។' : 'This logo will be placed on the label.')
                                : (isKhmer ? 'លោកអ្នកអាចប្រើឡូហ្គោនេះ ឬផ្ទុកឡើងឡូហ្គោផ្ទាល់ខ្លួន។' : 'You can keep this logo or upload your custom logo.')}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isKhmer ? 'ផ្ទុកឡើងឡូហ្គោថ្មី' : 'Upload New Logo'}</span>
                            </button>

                            {isCustomLogoActive && (
                              <button
                                type="button"
                                onClick={handleResetLogo}
                                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                {isKhmer ? 'ប្រើឡូហ្គោគំរូដើម' : 'Reset to Default'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          {isKhmer 
                            ? 'ចំណាំ៖ បើលោកអ្នកមានឡូហ្គោរួចហើយ លោកអ្នកគ្រាន់តែចុច «បន្ទាប់» ឬ «រំលង» ដើម្បីបន្តទៅឈ្មោះផលិតផល។'
                            : 'Tip: If your logo is already set, simply click "Next" or "Bypass" to proceed to the Product Name.'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Brand / Company Name */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {isKhmer ? 'ឈ្មោះម៉ាកយីហោ ឬ សហគ្រាស' : 'Brand / Company Name'}
                      </label>
                      <input
                        type="text"
                        value={data.companyName}
                        onChange={(e) => onChange({ companyName: e.target.value })}
                        placeholder={isKhmer ? 'ឧ. សហគ្រាស ម៉ាយ៉ានី ឬ សហគ្រាសកែច្នៃកម្ពុជា' : 'e.g. Mayany Enterprise'}
                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm text-slate-900 font-bold transition-all"
                        autoFocus
                      />
                    </div>
                  )}

                  {/* STEP 3: Product Name in Khmer */}
                  {/* STEP 3: Product Name in Khmer & English */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            {isKhmer ? 'ឈ្មោះផលិតផលជាភាសាខ្មែរ' : 'Khmer Product Name'} <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-md">
                            CS 001:2000
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">
                          {isKhmer 
                            ? 'ស្តង់ដារតម្រូវឱ្យអក្សរខ្មែរធំជាងគេ និងច្បាស់ជាងគេលើក្បាលកញ្ចប់ (បកប្រែជាអង់គ្លេសស្វ័យប្រវត្តិខាងក្រោម)' 
                            : 'Khmer name must be primary and largest; English name auto-syncs below for export'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 pb-1">
                          <span className="text-[11px] font-bold text-slate-700">
                            {isKhmer ? 'បញ្ចូលឈ្មោះដោយផ្ទាល់ ឬជ្រើសរើសពីកាតាឡុក៖' : 'Type name or select from catalog:'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowCatalogModal(true)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                          >
                            <span>📂</span>
                            <span>{isKhmer ? `បើកមើលកាតាឡុក (${displayCatalogList.length} មុខ)` : `View Catalog (${displayCatalogList.length})`}</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          value={data.productNameKhmer}
                          onChange={(e) => {
                            const val = e.target.value;
                            const tr = val ? smartTranslateKhmerAgro(val) : null;
                            onChange({ 
                              productNameKhmer: val,
                              ...(tr ? { productNameEnglish: tr.english, subheadingOrBotanical: tr.botanical } : {})
                            });
                          }}
                          onBlur={() => {
                            if (data.productNameKhmer?.trim()) {
                              if (!/[\u1780-\u17FF]/.test(data.productNameKhmer)) {
                                const kh = ensureKhmerProductName(data.productNameKhmer, data.productNameEnglish);
                                onChange({ productNameKhmer: kh });
                                persistProductName(kh);
                              } else {
                                persistProductName(data.productNameKhmer);
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (data.productNameKhmer?.trim()) {
                                if (!/[\u1780-\u17FF]/.test(data.productNameKhmer)) {
                                  const kh = ensureKhmerProductName(data.productNameKhmer, data.productNameEnglish);
                                  onChange({ productNameKhmer: kh });
                                  persistProductName(kh);
                                } else {
                                  persistProductName(data.productNameKhmer);
                                }
                              }
                            }
                          }}
                          placeholder="ឧ. គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅGIកំពត"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-base text-slate-900 font-black transition-all"
                          autoFocus
                        />

                        {/* CS 001 Khmer Language Protection: Convert English to authentic Khmer name */}
                        {data.productNameKhmer?.trim() && !/[\u1780-\u17FF]/.test(data.productNameKhmer) && (
                          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-2 text-xs">
                            <div className="text-amber-950 font-sans text-[11px]">
                              <span className="font-bold">⚠️ CS 001:2000 តម្រូវឱ្យឈ្មោះទី ១ ជាភាសាខ្មែរ៖</span>{' '}
                              <span>បម្លែងទៅជា «{ensureKhmerProductName(data.productNameKhmer, data.productNameEnglish)}»</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const kh = ensureKhmerProductName(data.productNameKhmer, data.productNameEnglish);
                                onChange({ productNameKhmer: kh });
                                persistProductName(kh);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shrink-0 cursor-pointer shadow-2xs"
                            >
                              ប្តូរជាភាសាខ្មែរភ្លាម
                            </button>
                          </div>
                        )}

                        {/* Save status notification and quick add for new brand products */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                          {savedNotice ? (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                              <Check size={13} className="text-emerald-600" />
                              <span>{isKhmer ? `បានរក្សាទុក «${savedNotice}» ក្នុងបញ្ជី ${activeBrandName || 'ម៉ាកយីហោ'}` : `Saved "${savedNotice}" to brand list`}</span>
                            </span>
                          ) : data.productNameKhmer?.trim() && !brandSavedProducts.includes(data.productNameKhmer.trim()) && !QUICK_KHMER_PRODUCTS.includes(data.productNameKhmer.trim()) ? (
                            <button
                              type="button"
                              onClick={() => persistProductName(data.productNameKhmer)}
                              className="text-[11px] font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Plus size={12} />
                              <span>{isKhmer ? `រក្សាទុកឈ្មោះថ្មីនេះក្នុងបញ្ជី ${activeBrandName || 'ម៉ាកយីហោ'}` : 'Save to brand list'}</span>
                            </button>
                          ) : brandSavedProducts.includes(data.productNameKhmer.trim()) ? (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                              <span>✓ ផលិតផលក្នុងបញ្ជី {activeBrandName || 'ម៉ាកយីហោ'}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              {isKhmer ? 'ឈ្មោះថ្មីនឹងរក្សាទុកដោយស្វ័យប្រវត្តិចូលក្នុងបញ្ជីទម្លាក់ចុះសម្រាប់ប្រើលើកក្រោយ' : 'New product names auto-save to the dropdown list'}
                            </span>
                          )}

                          {brandSavedProducts.includes(data.productNameKhmer.trim()) && (
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSavedProduct(data.productNameKhmer.trim(), e)}
                              className="text-[10px] text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
                              title="លុបមុខទំនិញនេះចេញពីបញ្ជី"
                            >
                              <Trash2 size={11} />
                              <span>{isKhmer ? 'លុបចេញពីបញ្ជី' : 'Remove from list'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dropdown Select with brand-saved products for future reference */}
                      <div className="space-y-1.5 pt-0.5">
                        <div className="relative">
                          <select
                            id="wizard-quick-product-select"
                            value={
                              brandSavedProducts.includes(data.productNameKhmer) || QUICK_KHMER_PRODUCTS.includes(data.productNameKhmer)
                                ? data.productNameKhmer
                                : ''
                            }
                            onChange={(e) => {
                              const prod = e.target.value;
                              if (prod) {
                                const tr = smartTranslateKhmerAgro(prod);
                                onChange({ 
                                  productNameKhmer: prod,
                                  productNameEnglish: tr.english, 
                                  subheadingOrBotanical: tr.botanical 
                                });
                                persistProductName(prod);
                              }
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-xs sm:text-sm font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden transition-all cursor-pointer appearance-none pr-10 shadow-2xs hover:border-amber-300"
                          >
                            <option value="">
                              {isKhmer 
                                ? (activeBrandName ? `-- ជ្រើសរើសមុខទំនិញ (${activeBrandName}) --` : '-- ជ្រើសរើសមុខទំនិញពីបញ្ជី --')
                                : '-- Select from product list --'}
                            </option>

                            {/* Brand-Specific Saved Products */}
                            {brandSavedProducts.length > 0 && (
                              <optgroup label={isKhmer ? `★ ផលិតផលរបស់ «${activeBrandName || 'ម៉ាកយីហោ'}»` : `★ Products of ${activeBrandName || 'Brand'}`}>
                                {brandSavedProducts.map((prod) => (
                                  <option key={`brand-${prod}`} value={prod}>
                                    {prod}
                                  </option>
                                ))}
                              </optgroup>
                            )}

                            {/* Standard Catalog */}
                            <optgroup label={isKhmer ? 'មុខទំនិញគំរូទូទៅ' : 'Standard Catalog'}>
                              {QUICK_KHMER_PRODUCTS.filter(p => !brandSavedProducts.includes(p)).map((prod) => (
                                <option key={`std-${prod}`} value={prod}>
                                  {prod}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Explicit English Product Name Field that directly reflects Khmer */}
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {isKhmer ? 'ឈ្មោះផលិតផលជាភាសាអង់គ្លេស' : 'English Product Name'} <span className="text-rose-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (data.productNameKhmer) {
                                const tr = smartTranslateKhmerAgro(data.productNameKhmer);
                                onChange({ 
                                  productNameEnglish: tr.english, 
                                  subheadingOrBotanical: tr.botanical 
                                });
                              }
                            }}
                            className="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2.5 py-0.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                            title="បកប្រែឡើងវិញពីឈ្មោះខ្មែរ"
                          >
                            <Sparkles size={11} className="text-amber-700" />
                            <span>{isKhmer ? 'បកប្រែឡើងវិញ' : 'Re-Translate'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {isKhmer 
                            ? 'ឆ្លុះបញ្ចាំងពីឈ្មោះខ្មែរដោយស្វ័យប្រវត្តិ ហើយលោកអ្នកក៏អាចកែប្រែដោយផ្ទាល់បានភ្លាមៗ' 
                            : 'Auto-reflects the Khmer product name; you can also customize or edit directly'}
                        </p>

                        <input
                          type="text"
                          value={data.productNameEnglish}
                          onChange={(e) => onChange({ productNameEnglish: e.target.value })}
                          placeholder="e.g. GI Kampot Black Pepper Coated Cashew Kernels"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm font-bold text-slate-900 bg-white"
                        />
                      </div>

                      {/* Live Bilingual Packaging Badge */}
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 border-b border-amber-200/60 pb-1">
                          <span className="flex items-center gap-1.5">
                            <Eye size={12} className="text-amber-700" />
                            <span>{isKhmer ? 'ការបង្ហាញជាក់ស្តែងលើស្លាកសញ្ញា' : 'Live Packaging Preview'}</span>
                          </span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full font-mono">
                            {isKhmer ? 'បោះពុម្ពលើកំប៉ុង/កញ្ចប់' : 'Printed on Jar/Pouch'}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-sm sm:text-base font-black text-slate-900 font-sans leading-tight">
                            {data.productNameKhmer || (isKhmer ? 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅGIកំពត' : 'Cashew Product')}
                          </div>
                          <div className="text-xs font-bold text-amber-950 font-mono tracking-tight">
                            {data.productNameEnglish || (isKhmer ? 'GI Kampot Black Pepper Coated Cashew Kernels' : 'Cashew Product')}
                          </div>
                        </div>
                      </div>

                      {/* Option to input Product Description & Health Benefits directly in Step 3 */}
                      <div className="mt-4 pt-3.5 border-t-2 border-amber-200/90 rounded-2xl bg-amber-50/70 p-4 border border-amber-300/80 space-y-3.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📝</span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-amber-950 font-sans">
                                {isKhmer ? 'ការពិពណ៌នាផលិតផល & អត្ថប្រយោជន៍សុខភាព' : 'Product Description & Health Benefits'}
                              </h4>
                              <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                                {isKhmer 
                                  ? 'លោកអ្នកអាចបញ្ចូលការពិពណ៌នា និងអត្ថប្រយោជន៍សុខភាពផ្ទាល់ខ្លួននៅទីនេះជាមួយឈ្មោះផលិតផល ឬកែប្រែនៅជំហានបន្ទាប់' 
                                  : 'Add custom product description & health benefits here with the product name or in next steps'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowStep3Extras(!showStep3Extras)}
                            className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            <span>{showStep3Extras ? (isKhmer ? 'បង្រួម' : 'Collapse') : (isKhmer ? 'បើកកែប្រែ' : 'Expand / Edit')}</span>
                            <ChevronDown size={14} className={`transform transition-transform ${showStep3Extras ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        {showStep3Extras && (
                          <div className="space-y-4 pt-2 border-t border-amber-200/70 font-sans">
                            {/* Product Description / Story Area */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <span>📖</span>
                                  <span>{isKhmer ? 'ការពិពណ៌នាអំពីផលិតផល' : 'Product Description'}</span>
                                </label>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {data.productDescription?.length || 0} {isKhmer ? 'តួអក្សរ' : 'chars'}
                                </span>
                              </div>
                              <textarea
                                rows={3}
                                value={data.productDescription || ''}
                                onChange={(e) => onChange({ productDescription: e.target.value })}
                                placeholder={isKhmer 
                                  ? 'បញ្ចូលការពិពណ៌នាអំពីផលិតផល...' 
                                  : 'Enter custom product description / narrative...'}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs sm:text-sm text-slate-900 bg-white font-sans leading-relaxed"
                              />
                            </div>

                            {/* Health Benefits Area */}
                            <div className="space-y-1.5 pt-2 border-t border-amber-200/60">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <span>🌿</span>
                                  <span>{isKhmer ? 'អត្ថប្រយោជន៍សុខភាព' : 'Health Benefits'}</span>
                                </label>
                                <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                                  {isKhmer ? 'បង្ហាញលើ QR Passport' : 'Shown on QR Passport'}
                                </span>
                              </div>
                              <textarea
                                rows={3}
                                value={data.healthBenefits || ''}
                                onChange={(e) => onChange({ healthBenefits: e.target.value })}
                                placeholder={isKhmer 
                                  ? 'បញ្ចូលអត្ថប្រយោជន៍សុខភាព...' 
                                  : 'Enter health benefits (one per line)...'}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs sm:text-sm text-slate-900 bg-white font-sans leading-relaxed"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Product Name in English & 2-Row Subtitle */}
                  {currentStep === 4 && (() => {
                    const isFlourContext = (data.productNameEnglish || '').toLowerCase().includes('flour') || (data.productNameKhmer || '').includes('ម្សៅ');
                    const isSugarContext = (data.productNameEnglish || '').toLowerCase().includes('sugar') || (data.productNameKhmer || '').includes('ស្ករ');
                    const isChiliContext = (data.productNameEnglish || '').toLowerCase().includes('chili') || (data.productNameKhmer || '').includes('ម្ទេស');
                    const placeholderRow1 = isFlourContext 
                      ? '100% Pure Cashew Kernel Flour (Anacardium occidentale)' 
                      : isSugarContext 
                      ? 'Cambodian Cashews (Anacardium occidentale)' 
                      : isChiliContext
                      ? 'Cambodian Cashews (Anacardium occidentale)'
                      : 'Selected Cambodian Cashews (Anacardium occidentale)';
                    const placeholderRow2 = isFlourContext 
                      ? '100% Natural, Grain-Free & Plant-Based' 
                      : isSugarContext 
                      ? 'Sugar coated cashew kernels' 
                      : isChiliContext
                      ? 'Spicy Natural Chili Coated'
                      : 'Artisanal GI Kampot Pepper Coated (Piper nigrum)';

                    const { row1, row2 } = parseBotanicalTwoRows(data.subheadingOrBotanical, data.productNameEnglish || data.productNameKhmer);

                    const handleRow1Change = (newRow1: string) => {
                      const combined = newRow1 ? (row2 ? `${newRow1}\n${row2}` : newRow1) : (row2 ? `\n${row2}` : '');
                      onChange({ subheadingOrBotanical: combined });
                    };

                    const handleRow2Change = (newRow2: string) => {
                      const combined = `${row1}\n${newRow2}`;
                      onChange({ subheadingOrBotanical: combined });
                    };

                    return (
                      <div className="space-y-5">
                        {/* Dedicated 2-Row Botanical & Flavor Subtitle Container */}
                        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-amber-200/60 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-900 font-sans">
                                  {isKhmer ? 'អនុចំណងជើង ឬ ឈ្មោះវិទ្យាសាស្ត្រ' : 'Botanical / Flavor Subtitle'}
                                </span>
                                <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                                  {isKhmer ? '២ ជួរ' : '2 Rows'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 font-sans leading-relaxed">
                                {isKhmer 
                                  ? 'រៀបចំជា ២ ជួរដាច់ដោយឡែកពីគ្នា ជួយឱ្យអតិថិជនអានបានងាយស្រួល និងស្កេនពិនិត្យមើលតាមទូរស័ព្ទឃើញច្បាស់ល្អ' 
                                  : 'Formatted into 2 distinct rows for easy reading and clear customer QR scanning view'}
                              </p>
                            </div>
                          </div>

                          {/* Row 1: Botanical Name / Species & Origin */}
                          <div>
                            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              <span className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                                <span>{isKhmer ? 'ជួរទី១៖ ឈ្មោះវិទ្យាសាស្ត្រ និងប្រភពដើម' : 'Row 1: Botanical Species & Origin'}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans">{isKhmer ? 'ជួរទី១' : 'Row 1'}</span>
                            </label>
                            <input
                              type="text"
                              value={row1}
                              onChange={(e) => handleRow1Change(e.target.value)}
                              placeholder={placeholderRow1}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs sm:text-sm font-semibold text-slate-900 bg-white"
                              autoFocus
                            />
                          </div>

                          {/* Row 2: Flavor Profile & Artisanal Subtitle */}
                          <div>
                            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              <span className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                                <span>{isKhmer ? 'ជួរទី២៖ រសជាតិ និងអនុចំណងជើងពិពណ៌នា' : 'Row 2: Flavor Profile & Artisanal Subtitle'}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans">{isKhmer ? 'ជួរទី២' : 'Row 2'}</span>
                            </label>
                            <input
                              type="text"
                              value={row2}
                              onChange={(e) => handleRow2Change(e.target.value)}
                              placeholder={placeholderRow2}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-hidden text-xs sm:text-sm font-semibold text-emerald-950 bg-white"
                            />
                          </div>

                          {/* Live Scan Preview Box */}
                          <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1.5 shadow-inner">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                                <span>📱</span>
                                <span>{isKhmer ? 'ទម្រង់បង្ហាញពេលអតិថិជនស្កេន' : 'Customer Scan View'}</span>
                              </span>
                              <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded text-[9px]">
                                {isKhmer ? 'ប្លង់លិខិតឆ្លងដែនឌីជីថល' : 'E-Passport Layout'}
                              </span>
                            </div>
                            <div className="pt-1 border-t border-slate-800 space-y-1">
                              <div className="text-xs sm:text-sm font-black text-amber-300 leading-snug">
                                {row1 || 'Selected Cambodian Cashews (Anacardium occidentale)'}
                              </div>
                              <div className="text-xs font-semibold text-emerald-300 leading-snug">
                                {row2 || 'Artisanal GI Kampot Pepper Coated (Piper nigrum)'}
                              </div>
                            </div>
                          </div>

                          {/* Dedicated Editable Product Story & Description Input for All Products */}
                          <div className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                              <label className="text-xs font-black text-slate-900 uppercase tracking-wider font-sans flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-amber-600" />
                                <span>{isKhmer ? 'ការពិពណ៌នាអំពីផលិតផល ឬ រឿងរ៉ាវផលិតផល (Product Story & Description)' : 'Product Story & Description:'}</span>
                              </label>
                              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                                {isKhmer ? 'បង្ហាញលើវិញ្ញាបនបត្រពេលស្កេន' : 'Digital Certificate'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                              {isKhmer
                                ? 'បញ្ចូល ឬកែប្រែរឿងរ៉ាវផលិតផល ប្រភពកសិដ្ឋាន និងវិធីសាស្ត្រផលិតជាភាសាខ្មែរ។ ព័ត៌មាននេះនឹងបង្ហាញលើវិញ្ញាបនបត្រឌីជីថល និងបកប្រែពហុភាសា (អង់គ្លេស កូរ៉េ អាល្លឺម៉ង់...) ជូនអតិថិជនពេលស្កេន QR Code។'
                                : 'Enter authentic product story & craftsmanship in Khmer. Automatically translated to multiple languages upon customer QR scan.'}
                            </p>
                            <textarea
                              rows={5}
                              value={data.productDescription || ''}
                              onChange={(e) => onChange({ productDescription: e.target.value })}
                              placeholder={isKhmer 
                                ? 'បញ្ចូលការពិពណ៌នា ឬរឿងរ៉ាវផលិតផល...'
                                : 'Enter product story in Khmer...'}
                              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs text-slate-900 leading-relaxed font-sans bg-slate-50/50"
                            />
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  {/* STEP 5: Ingredients & Allergens */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      {/* Step 5 Intro Banner */}
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>{isKhmer ? 'បញ្ជីគ្រឿងផ្សំតាមក្រុម' : 'Categorized Ingredients'}</span>
                          </span>
                          <span className="text-[10px] font-bold bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded-md">
                            {isKhmer ? '៥ ក្រុមគ្រឿងផ្សំ' : '5 Core Categories'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {isKhmer 
                            ? 'ជ្រើសរើសគ្រឿងផ្សំគោលតាមប្រអប់នីមួយៗ (សាច់, គ្រាប់ធញ្ញជាតិ, គ្រឿងទេស, បន្លែ, ផ្លែឈើ) ឬសរសេរដោយផ្ទាល់។' 
                            : 'Select base ingredients from category dropdowns (Meat, Grain, Spices, Vegetables, Fruits) or type freely.'}
                        </p>
                      </div>

                      {/* 5 Category Dropdowns Grid */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                          <span>{isKhmer ? 'ជ្រើសរើសគ្រឿងផ្សំតាមក្រុម' : 'Select Ingredient by Category'}</span>
                          <span className="text-[11px] font-normal text-slate-500 font-sans">{isKhmer ? '៥ ក្រុម' : '5 Dropdowns'}</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {STRUCTURED_INGREDIENT_CATEGORIES.map(category => (
                            <div 
                              key={category.id} 
                              className={`p-3 rounded-2xl border transition-all ${
                                selectedBaseIngredient?.id && category.items.some(it => it.id === selectedBaseIngredient.id)
                                  ? 'border-amber-500 bg-amber-50/40 shadow-xs ring-1 ring-amber-300'
                                  : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                                  <span>{category.icon}</span>
                                  <span className="truncate">{category.nameKh}</span>
                                </label>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                  {category.items.length} មុខ
                                </span>
                              </div>

                              <div className="relative">
                                <select
                                  value={category.items.some(it => it.id === selectedBaseIngredient?.id) ? selectedBaseIngredient?.id : ''}
                                  onChange={(e) => {
                                    const found = category.items.find(it => it.id === e.target.value);
                                    if (found) {
                                      handleSelectBaseIngredient(found);
                                    }
                                  }}
                                  className="w-full text-xs font-semibold bg-slate-50 hover:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden cursor-pointer appearance-none pr-8 transition shadow-2xs"
                                >
                                  <option value="">{category.placeholderKh}</option>
                                  {category.items.map(item => (
                                    <option key={item.id} value={item.id}>
                                      {isKhmer ? item.nameKh : `${item.nameKh} (${item.nameEn})`}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Ingredient Customizer & Translation Builder */}
                      {selectedBaseIngredient && (
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border-2 border-amber-300 shadow-xs space-y-4">
                          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                                ✓
                              </span>
                              <div>
                                <h4 className="text-sm font-black text-slate-900 font-sans">
                                  {isKhmer ? 'កំណត់លម្អិតគ្រឿងផ្សំ៖' : 'Configure Ingredient:'}{' '}
                                  <span className="text-amber-700">{selectedBaseIngredient.nameKh}</span>
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                  {isKhmer 
                                    ? 'កំណត់ភាគរយ % និងបន្ថែមទៅក្នុងបញ្ជីគ្រឿងផ្សំ' 
                                    : 'Specify percentage % and add to ingredients list'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedBaseIngredient(null)}
                              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                              ✕ {isKhmer ? 'បិទ' : 'Close'}
                            </button>
                          </div>

                          {/* Percentage Input */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                {isKhmer ? 'ភាគរយគ្រឿងផ្សំ (% ស្រេចចិត្ត)៖' : 'Percentage (% Optional):'}
                              </label>
                              <span className="text-[11px] text-slate-400 font-mono">{isKhmer ? 'ឧ. 95, 5, 2' : 'e.g. 95%, 5%, 2%'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="relative w-36">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={ingredientPercent}
                                  onChange={(e) => setIngredientPercent(e.target.value)}
                                  placeholder="%"
                                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm font-bold text-slate-900 bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Formatted Preview & Action Button */}
                          <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono text-amber-800 uppercase tracking-wider block font-bold">
                                {isKhmer ? 'គំរូគ្រឿងផ្សំដែលត្រូវបន្ថែម៖' : 'Ingredient Output:'}
                              </span>
                              <div className="text-xs sm:text-sm font-black text-slate-900 bg-amber-100/70 border border-amber-300/80 px-3 py-1.5 rounded-xl inline-block">
                                {(() => {
                                  const nameKh = selectedBaseIngredient.nameKh;
                                  const pct = ingredientPercent.trim();
                                  if (pct) {
                                    return `${nameKh} ${pct}%`;
                                  }
                                  return nameKh;
                                })()}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddCurrentIngredient}
                              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0"
                            >
                              <Plus className="w-4 h-4" />
                              <span>{isKhmer ? '+ បន្ថែមទៅក្នុងបញ្ជីគ្រឿងផ្សំ' : '+ Add to Ingredients'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Success Toast */}
                      {addedSuccessToast && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fade-in shadow-2xs">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{isKhmer ? 'បានបន្ថែមដោយជោគជ័យ៖ ' : 'Added: '} <strong>{addedSuccessToast}</strong></span>
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">✓ CS 001</span>
                        </div>
                      )}

                      {/* Main Ingredients Textarea with Live Auto-Translator */}
                      <div className="space-y-2 pt-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {(() => {
                            const formulaStatus = calculateIngredientsTotalPercent(data.ingredientsList || '');
                            return (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                  <span>{isKhmer ? 'បញ្ជីគ្រឿងផ្សំពេញលេញ' : 'Full Ingredients List'}</span>
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    {isKhmer ? 'ក្បៀសញែកគ្នា (,)' : 'Comma separated'}
                                  </span>
                                  {formulaStatus.totalPercent > 0 && (
                                    formulaStatus.isBalanced ? (
                                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 font-mono">
                                        ✓ {isKhmer ? 'សរុប ១០០%' : 'Total 100%'}
                                      </span>
                                    ) : formulaStatus.hasOver100 ? (
                                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-300 font-mono">
                                        ⚠️ {isKhmer ? `សរុប ${formulaStatus.totalPercent}% (លើស 100%)` : `Total ${formulaStatus.totalPercent}% (>100%)`}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 font-mono">
                                        {isKhmer ? `សរុប ${formulaStatus.totalPercent}%` : `Total ${formulaStatus.totalPercent}%`}
                                      </span>
                                    )
                                  )}
                                </label>

                                <div className="flex flex-wrap items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={handleAutoTranslateIngredients}
                                    title="បកប្រែគ្រឿងផ្សំខ្មែរទាំងអស់ជាភាសាអង់គ្លេសស្វ័យប្រវត្តិ"
                                    className="flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-200 px-3 py-1 rounded-xl border border-amber-300 cursor-pointer transition-all shadow-2xs"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                                    <span>{isKhmer ? '✨ បកប្រែជាភាសាអង់គ្លេសស្វ័យប្រវត្តិ' : '✨ Translate to English'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={handleCombineDuplicateIngredients}
                                    title="ស្វែងរកគ្រឿងផ្សំដែលដូចគ្នា ហើយបង្រួមបញ្ចូលគ្នា និងកែសម្រួលភាគរយត្រឹមត្រូវ"
                                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 hover:text-indigo-950 bg-indigo-100/80 hover:bg-indigo-200 px-3 py-1 rounded-xl border border-indigo-300 cursor-pointer transition-all shadow-2xs"
                                  >
                                    <Layers className="w-3.5 h-3.5 text-indigo-700" />
                                    <span>{isKhmer ? '✨ បង្រួម & បូកភាគរយមុខដូចគ្នា' : '✨ Combine Duplicates'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={handleBalanceTo100}
                                    title="ថ្លឹង និងកែសម្រួលរូបមន្តឱ្យគ្រប់ ១០០% ស្វ័យប្រវត្តិតាមស្ដង់ដារជាតិ CS 001"
                                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200 px-3 py-1 rounded-xl border border-emerald-300 cursor-pointer transition-all shadow-2xs"
                                  >
                                    <Scale className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>{isKhmer ? '⚖️ ថ្លឹងឱ្យគ្រប់ 100%' : '⚖️ Balance to 100%'}</span>
                                  </button>

                                  {data.ingredientsList && (
                                    <button
                                      type="button"
                                      onClick={() => onChange({ ingredientsList: '' })}
                                      className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200 cursor-pointer transition shadow-2xs"
                                      title="សម្អាតបញ្ជីគ្រឿងផ្សំ"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>{isKhmer ? 'សម្អាត' : 'Clear'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                        {/* Real-time Over-100% Warning & 1-Click Fix Banner */}
                        {(() => {
                          const formulaStatus = calculateIngredientsTotalPercent(data.ingredientsList || '');
                          if (!formulaStatus.hasOver100) return null;
                          return (
                            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-fade-in text-rose-950">
                              <div className="flex items-center gap-2.5">
                                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                                <div>
                                  <div className="font-black text-rose-900">
                                    {isKhmer
                                      ? `រកឃើញភាគរយលើសពី ១០០% (${formulaStatus.totalPercent}%)៖`
                                      : `Percentages exceed 100% (${formulaStatus.totalPercent}%):`}
                                  </div>
                                  <div className="text-[11px] text-rose-800 mt-0.5 font-sans">
                                    {isKhmer
                                      ? 'ស្តង់ដារ CS 001 តម្រូវឱ្យគ្រឿងផ្សំសរុបស្មើ ១០០%។ ចុចប៊ូតុងខាងស្តាំដើម្បីកែសម្រួលរូបមន្តឱ្យគ្រប់ ១០០% ភ្លាមៗ។'
                                      : 'CS 001 standard requires ingredients to total 100%. Click the button to balance to 100% now.'}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleBalanceTo100}
                                className="shrink-0 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition active:scale-95"
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>{isKhmer ? '⚖️ កែសម្រួលឱ្យគ្រប់ ១០០% ភ្លាមៗ' : 'Fix to 100% Now'}</span>
                              </button>
                            </div>
                          );
                        })()}
                        </div>

                        {/* Real-time Duplicate Ingredients Warning & 1-Click Sum Banner */}
                        {(() => {
                          const dupInfo = detectDuplicateIngredients(data.ingredientsList || '');
                          if (!dupInfo.hasDuplicates) return null;
                          return (
                            <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-fade-in">
                              <div className="flex items-start sm:items-center gap-2.5 text-amber-950">
                                <span className="text-xl shrink-0 leading-none">💡</span>
                                <div>
                                  <div className="font-black text-amber-900">
                                    {isKhmer
                                      ? `រកឃើញគ្រឿងផ្សំដដែលៗ៖ ${dupInfo.duplicates.map(d => `«${d.nameKh}» (${d.individualPercents.map(p => `${p}%`).join(' + ')})`).join(', ')}`
                                      : `Duplicate ingredients found: ${dupInfo.duplicates.map(d => `"${d.nameKh || d.nameEn}" (${d.individualPercents.map(p => `${p}%`).join(' + ')})`).join(', ')}`}
                                  </div>
                                  <div className="text-[11px] text-amber-800 mt-0.5">
                                    {isKhmer
                                      ? `តើចង់បូកសរុបភាគរយបញ្ចូលគ្នាទៅជា «${dupInfo.duplicates.map(d => `${d.nameKh} ${d.combinedPercent}%`).join(', ')}» ដែរឬទេ?`
                                      : `Combine duplicates into "${dupInfo.duplicates.map(d => `${d.nameKh || d.nameEn} ${d.combinedPercent}%`).join(', ')}"?`}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  onChange({ ingredientsList: dupInfo.combinedText });
                                  setAddedSuccessToast(
                                    isKhmer
                                      ? `✓ បានបូកសរុបភាគរយគ្រឿងផ្សំដដែលៗទៅជា ${dupInfo.duplicates.map(d => `${d.combinedPercent}%`).join(', ')} រួចរាល់!`
                                      : `✓ Combined duplicates into ${dupInfo.duplicates.map(d => `${d.combinedPercent}%`).join(', ')}!`
                                  );
                                  setTimeout(() => setAddedSuccessToast(null), 3500);
                                }}
                                className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition active:scale-95"
                              >
                                <Layers className="w-3.5 h-3.5" />
                                <span>{isKhmer ? 'បូកបញ្ចូលគ្នាភ្លាមៗ' : 'Combine & Sum Now'}</span>
                              </button>
                            </div>
                          );
                        })()}

                        <textarea
                          rows={3}
                          value={data.ingredientsList}
                          onChange={(e) => onChange({ ingredientsList: e.target.value })}
                          placeholder="ឧ. គ្រាប់ស្វាយចន្ទី ៩២%, ទឹកដោះគោខាប់ ៥%, អំបិលកំពត ២%, ម្ទេស ១%"
                          className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-white shadow-2xs"
                        />

                        <p className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{isKhmer ? '💡 អាចចុចជ្រើសរើសខាងលើដើម្បីបញ្ចូល ឬសរសេរដោយផ្ទាល់' : '💡 Select from dropdowns above or type freely'}</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {data.ingredientsList ? `${data.ingredientsList.split(',').filter(Boolean).length} មុខ` : '0 មុខ'}
                          </span>
                        </p>
                      </div>

                      {/* Allergen Advice Section */}
                      <div className="pt-3 border-t border-slate-200/80 space-y-2">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          {isKhmer ? 'ព័ត៌មានអាឡែហ្ស៊ី' : 'Allergen Advice'}
                        </label>
                        <input
                          type="text"
                          value={data.allergenBox}
                          onChange={(e) => onChange({ allergenBox: e.target.value })}
                          placeholder={isKhmer ? 'ឧ. មានផ្ទុកគ្រាប់ផ្លែឈើ (ស្វាយចន្ទី)' : 'e.g. Contains Tree Nuts (Cashews)'}
                          className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs sm:text-sm text-slate-800 font-medium bg-white"
                        />

                        {/* Allergen Quick Suggestions */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {[
                            { kh: 'មានផ្ទុកគ្រាប់ផ្លែឈើ (ស្វាយចន្ទី)', en: 'Contains Tree Nuts (Cashews)' },
                            { kh: 'មានផ្ទុកទឹកដោះគោ', en: 'Contains Milk / Dairy' },
                            { kh: 'មានផ្ទុកសណ្តែកសៀង', en: 'Contains Soybeans' },
                            { kh: 'មានផ្ទុកគ្រឿងសមុទ្រ ឬ ត្រី', en: 'Contains Seafood / Fish' },
                            { kh: 'គ្មានសារធាតុបង្កអាឡែហ្ស៊ី', en: 'No Known Allergens' }
                          ].map(al => (
                            <button
                              key={al.kh}
                              type="button"
                              onClick={() => onChange({ allergenBox: isKhmer ? al.kh : `${al.kh} (${al.en})` })}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition"
                            >
                              + {isKhmer ? al.kh : `${al.kh} (${al.en})`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Nutrition Facts Dual-Mode Manager in Step 5 */}
                      <div className="pt-2 space-y-2">
                        {/* Notice for user modification with lab test results */}
                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🧪</span>
                            <div>
                              <span className="font-bold text-amber-950">
                                {isKhmer ? 'កែប្រែព័ត៌មានអាហារូបត្ថម្ភតាមលទ្ធផលតេស្តមន្ទីរពិសោធន៍' : 'Modify Nutrition Facts with Lab Test Results'}
                              </span>
                              <p className="text-[11px] text-slate-600">
                                {isKhmer 
                                  ? 'ប្រសិនបើលោកអ្នកមានលទ្ធផលធ្វើតេស្តជាក់ស្តែងពីមន្ទីរពិសោធន៍ លោកអ្នកអាចចុច «តេស្តមន្ទីរពិសោធន៍» ដើម្បីកែប្រែលេខគ្រប់ជួរ' 
                                  : 'Switch to "Lab Tested" mode anytime to freely edit all nutrition values according to your lab COA'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => onChange({ nutritionMode: 'lab_tested' })}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                                data.nutritionMode === 'lab_tested'
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                                  : 'bg-white text-emerald-800 hover:bg-emerald-50 border-emerald-300'
                              }`}
                            >
                              🧪 {isKhmer ? 'របៀបតេស្តមន្ទីរពិសោធន៍' : 'Lab Tested Mode'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onChange({ nutritionMode: 'general_calc' })}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                                data.nutritionMode !== 'lab_tested'
                                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                              }`}
                            >
                              💡 {isKhmer ? 'គណនាស្វ័យប្រវត្តិ' : 'Auto-Calc'}
                            </button>
                          </div>
                        </div>

                        <NutritionFactsManager
                          ingredientsText={data.ingredientsList}
                          nutrition={data.nutrition || {
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
                          }}
                          onChange={(newNutrition) => onChange({ nutrition: newNutrition })}
                          mode={data.nutritionMode || 'general_calc'}
                          onModeChange={(newMode) => onChange({ nutritionMode: newMode })}
                        />
                      </div>

                      {/* Dedicated Sourcing Partners & Supplier List Section */}
                      <div className="pt-4 border-t border-slate-200/90 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-orange-50/30 p-3.5 rounded-2xl border border-amber-300/80">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center text-base shadow-xs shrink-0">
                              🌾
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider font-sans">
                                  {isKhmer ? 'បញ្ជីដៃគូផ្គត់ផ្គង់វត្ថុធាតុដើមផ្លូវការ' : 'Official Sourcing Partners & Suppliers'}
                                </label>
                                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                                  {(data.selectedSuppliers || []).length} {isKhmer ? 'បានជ្រើសរើស' : 'Selected'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 font-sans">
                                {isKhmer 
                                  ? 'ជ្រើសរើសដៃគូផ្គត់ផ្គង់វត្ថុធាតុដើមផ្លូវការ ដើម្បីភ្ជាប់ទៅកាន់លិខិតឆ្លងដែនឌីជីថល និងអាចកែប្រែបានគ្រប់ពេល' 
                                  : 'Select official sourcing partners to link to your digital traceability passport and manage changes'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                            {(data.selectedSuppliers || []).length > 0 && (
                              <button
                                type="button"
                                onClick={() => onChange({ selectedSuppliers: [] })}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 text-[11px] font-bold cursor-pointer transition shadow-2xs"
                                title="សម្អាតបញ្ជីអ្នកផ្គត់ផ្គង់"
                              >
                                {isKhmer ? 'សម្អាត' : 'Clear All'}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowSuppliersModal(true)}
                              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition shrink-0"
                            >
                              <Plus size={14} />
                              <span>{isKhmer ? 'មើលបញ្ជី & + បន្ថែមថ្មី' : 'Directory & + Add Supplier'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Selected Suppliers Display Box - Users see what is selected so they can make changes */}
                        <div className="p-3.5 bg-amber-50/60 rounded-2xl border-2 border-amber-300/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 font-sans">
                              <span>📋</span>
                              <span>{isKhmer ? 'អ្នកផ្គត់ផ្គង់ដែលបានជ្រើសរើស (Selected Suppliers - ចុច ✕ ដើម្បីដកចេញ)៖' : 'Active Selected Suppliers (Click ✕ to remove or change):'}</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-sans">
                              {(data.selectedSuppliers || []).length} ក្រុមហ៊ុន
                            </span>
                          </div>

                          {(data.selectedSuppliers && data.selectedSuppliers.length > 0) ? (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {data.selectedSuppliers.map((sup) => {
                                const getIcon = (name: string) => {
                                  if (name.includes('ស្វាយចន្ទី') || name.includes('Cashew')) return '🥜';
                                  if (name.includes('ស្ករស') || name.includes('Sugar')) return '🍯';
                                  if (name.includes('ម្រេច') || name.includes('Pepper')) return '🌿';
                                  if (name.includes('អំបិល') || name.includes('Salt')) return '🧂';
                                  if (name.includes('ម្ទេស') || name.includes('Chili')) return '🌶️';
                                  return '🌾';
                                };
                                return (
                                  <div
                                    key={sup}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-amber-400 text-slate-900 text-xs font-bold shadow-2xs group hover:border-amber-600 transition"
                                  >
                                    <span>{getIcon(sup)}</span>
                                    <span className="truncate max-w-[280px] sm:max-w-md">{sup}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = (data.selectedSuppliers || []).filter(s => s !== sup);
                                        onChange({ selectedSuppliers: next });
                                        setAddedSuccessToast(isKhmer ? `✓ បានដកចេញ៖ ${sup}` : `✓ Removed: ${sup}`);
                                        setTimeout(() => setAddedSuccessToast(null), 3000);
                                      }}
                                      className="w-5 h-5 rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer text-xs"
                                      title={isKhmer ? 'ដកចេញ' : 'Remove'}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-3 bg-white rounded-xl border border-dashed border-amber-300 text-center text-xs text-slate-500 font-sans">
                              {isKhmer 
                                ? 'មិនទាន់មានអ្នកផ្គត់ផ្គង់ដែលបានជ្រើសរើសនៅឡើយទេ។ សូមចុចជ្រើសរើសពីបញ្ជីស្ដង់ដារទាំង ៤ ខាងក្រោម ឬចុច «+ មើលបញ្ជី & + បន្ថែមថ្មី»។' 
                                : 'No suppliers selected yet. Click below to add from standard approved suppliers or open directory.'}
                            </div>
                          )}
                        </div>

                        {/* 1-Click Toggle for Approved Core Suppliers List */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                            {isKhmer ? 'ជ្រើសរើសអ្នកផ្គត់ផ្គង់ស្ដង់ដារ៖' : 'Standard Approved Sourcing Partners:'}
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {DEFAULT_OFFICIAL_SUPPLIERS.map((sup) => {
                              const isSelected = (data.selectedSuppliers || []).some(s => 
                                s === sup.badgeTitle || 
                                s === sup.supplierName || 
                                s.includes(sup.supplierName) || 
                                (sup.id === 'angkor-sugar' && (s.toLowerCase().includes('angkor') || s.includes('ស្ករ') || s.toLowerCase().includes('sugar'))) ||
                                (sup.id === 'mirarth-ww180' && (s.toLowerCase().includes('mirarth') || s.includes('ចន្ទី'))) ||
                                (sup.id === 'boh-pepper' && (s.toLowerCase().includes('boh') || s.includes('ម្រេច'))) ||
                                (sup.id === 'ngov-heng-salt' && (s.toLowerCase().includes('ngov') || s.includes('អំបិល'))) ||
                                (sup.id === 'ringacam-chili' && (s.toLowerCase().includes('ringacam') || s.includes('ម្ទេស'))) ||
                                (sup.id === 'tl-agri-cashew' && (s.toLowerCase().includes('tl agri') || s.toLowerCase().includes('tl-agri')))
                              );
                              return (
                                <button
                                  key={sup.id}
                                  type="button"
                                  onClick={() => {
                                    const currentList = data.selectedSuppliers || [];
                                    let nextList: string[];
                                    if (isSelected) {
                                      nextList = currentList.filter(s => {
                                        if (s === sup.badgeTitle || s === sup.supplierName || s.includes(sup.supplierName)) return false;
                                        if (sup.id === 'angkor-sugar' && (s.toLowerCase().includes('angkor') || s.includes('ស្ករ') || s.toLowerCase().includes('sugar'))) return false;
                                        if (sup.id === 'boh-pepper' && (s.toLowerCase().includes('boh') || s.includes('ម្រេច') || s.toLowerCase().includes('pepper'))) return false;
                                        if (sup.id === 'ngov-heng-salt' && (s.toLowerCase().includes('ngov') || s.includes('អំបិល') || s.toLowerCase().includes('salt'))) return false;
                                        if (sup.id === 'ringacam-chili' && (s.toLowerCase().includes('ringacam') || s.includes('ម្ទេស') || s.toLowerCase().includes('chili'))) return false;
                                        if (sup.id === 'tl-agri-cashew' && (s.toLowerCase().includes('tl agri') || s.toLowerCase().includes('tl-agri'))) return false;
                                        return true;
                                      });
                                      setAddedSuccessToast(isKhmer ? `✓ បានដកចេញ៖ ${sup.badgeTitle}` : `✓ Removed: ${sup.badgeTitle}`);
                                    } else {
                                      nextList = [...currentList, sup.badgeTitle];
                                      setAddedSuccessToast(isKhmer ? `✓ បានបន្ថែម៖ ${sup.badgeTitle}` : `✓ Added: ${sup.badgeTitle}`);
                                    }
                                    onChange({ selectedSuppliers: nextList });
                                    setTimeout(() => setAddedSuccessToast(null), 3000);
                                  }}
                                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2 shadow-2xs ${
                                    isSelected 
                                      ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-300' 
                                      : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/30'
                                  }`}
                                >
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
                                      <span>{sup.icon}</span>
                                      <span className="truncate">{sup.supplierName}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-600 truncate pt-0.5 font-medium">
                                      {sup.productName} • <span className="text-slate-400">{sup.province}</span>
                                    </div>
                                  </div>
                                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                    isSelected 
                                      ? 'bg-emerald-600 text-white font-mono' 
                                      : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {isSelected ? '✓ ជ្រើស' : '+ បន្ថែម'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 9: Manufacturing & Expiry Dates */}
                  {currentStep === 9 && (
                    <div className="space-y-5">
                      {/* SME Date Stamping Strategy */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <span>🏷️</span>
                            <span>{isKhmer ? 'យុទ្ធសាស្ត្រកាលបរិច្ឆេទលើស្លាក & កញ្ចប់' : 'Date Marking Strategy'}</span>
                          </label>
                          <span className="text-[10px] font-bold text-emerald-950 bg-emerald-200/90 px-2 py-0.5 rounded-full font-mono">
                            {data.stampDatesOnBag === true ? (isKhmer ? 'បោះត្រាលើកញ្ចប់' : 'Stamp on Bag') : (isKhmer ? '✓ បោះពុម្ពលើស្លាក' : '✓ Print on Label')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {isKhmer
                            ? '💡 ស្តង់ដារកំណត់៖ កាលបរិច្ឆេទផលិត (MFD) និងផុតកំណត់ (EXP) នឹងត្រូវបោះពុម្ពបញ្ជាក់យ៉ាងច្បាស់លើស្លាក ឬស្ទីកឃ័រដែលបិទផ្ទាល់លើកញ្ចប់បាតឈរ ៥០g ឬក្រឡ ១៧៥g/២០០g ងាយស្រួលស្កេន និងត្រួតពិនិត្យនៅ CK99 Khmer Mart និងផ្សារទំនើប។'
                            : '💡 Recommended Standard: MFD and EXP dates are clearly printed on the sticker label affixed directly onto 50g pouches and 175g/200g jars.'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onChange({ stampDatesOnBag: false })}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                              data.stampDatesOnBag !== true
                                ? 'bg-slate-900 text-white border-slate-950 shadow-xs ring-2 ring-amber-400'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <span className="text-lg">🖨️</span>
                            <div>
                              <div className="text-xs font-black flex items-center gap-1.5">
                                <span>{isKhmer ? 'បោះពុម្ពកាលបរិច្ឆេទលើស្លាក' : 'Print Dates on Label'}</span>
                                <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                                  {isKhmer ? '★ ស្តង់ដារ' : '★ Standard'}
                                </span>
                              </div>
                              <div className={`text-[10px] leading-tight mt-0.5 ${data.stampDatesOnBag !== true ? 'text-slate-300' : 'text-slate-500'}`}>
                                {isKhmer ? 'បោះពុម្ព MFD & EXP ជាប់ស្លាក/ស្ទីកឃ័របិទផ្ទាល់លើកញ្ចប់ ឬក្រឡ' : 'Prints exact date values directly onto the sticker labels'}
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => onChange({ stampDatesOnBag: true })}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                              data.stampDatesOnBag === true
                                ? 'bg-amber-600 text-white border-amber-700 shadow-xs ring-2 ring-amber-300'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <span className="text-lg">📦</span>
                            <div>
                              <div className="text-xs font-black">
                                {isKhmer ? 'ទុកកន្លែងបោះត្រាលើកញ្ចប់' : 'Leave Space to Stamp on Bag'}
                              </div>
                              <div className={`text-[10px] leading-tight mt-0.5 ${data.stampDatesOnBag === true ? 'text-amber-100' : 'text-slate-500'}`}>
                                {isKhmer ? 'ទុកចន្លោះទទេសម្រាប់បាញ់កាលបរិច្ឆេទដោយម៉ាស៊ីនឡាស៊ែរ' : 'Leave blank space for laser or hand stamping'}
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {data.stampDatesOnBag !== true ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-950 flex items-start gap-2 shadow-2xs">
                          <span className="text-emerald-600 font-black text-sm">✓</span>
                          <span>
                            {isKhmer
                              ? 'កាលបរិច្ឆេទទាំង ២ (MFD & EXP) ត្រូវបានកំណត់ឱ្យបោះពុម្ពបញ្ជាក់យ៉ាងច្បាស់លើស្លាក ឬស្ទីកឃ័រដែលបិទផ្ទាល់លើកញ្ចប់បាតឈរ (Pouch 50g) និងកំប៉ុង (Jar 175g/200g)។'
                              : 'Both MFD & EXP dates will be printed and stated clearly on the labels affixed directly to pouches and jars.'}
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-950 flex items-start gap-2">
                          <span className="text-amber-600 font-bold mt-0.5">ℹ️</span>
                          <span>
                            {isKhmer
                              ? 'អ្នកបានជ្រើសរើស «ទុកកន្លែងបោះត្រាលើកញ្ចប់»៖ ស្លាកនឹងបង្ហាញ «សូមមើលត្រាបោះលើកញ្ចប់»។'
                              : 'You selected "Stamp on Bag": Labels will show "See stamp on package".'}
                          </span>
                        </div>
                      )}

                      {/* Quick Date Helper Presets */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mr-1">
                          {isKhmer ? 'ជ្រើសរើសរហ័ស៖' : 'Quick Presets:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onChange({ mfdDate: '', expDate: '' })}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-sans font-bold cursor-pointer transition shadow-2xs flex items-center gap-1.5 ${
                            !data.mfdDate && !data.expDate
                              ? 'bg-indigo-900 text-white border-indigo-950 ring-2 ring-indigo-400'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border-indigo-300'
                          }`}
                        >
                          <span>📦</span>
                          <span>{isKhmer ? 'ផលិតតាមការកុម្ម៉ង់ (Make-to-Order / MTO)' : 'Make-to-Order (MTO)'}</span>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                            {isKhmer ? 'បោះត្រារូបវន្ត' : 'Physical Stamp'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            const dd = String(now.getDate()).padStart(2, '0');
                            const mm = String(now.getMonth() + 1).padStart(2, '0');
                            const yyyy = now.getFullYear();
                            const todayStr = `${dd}/${mm}/${yyyy}`;
                            const expStr = calculateDateWithMonths(todayStr, data.shelfLifeMonths || 6);
                            onChange({ mfdDate: todayStr, expDate: expStr });
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-[10.5px] font-mono font-bold cursor-pointer transition flex items-center gap-1"
                        >
                          <span>⚡</span>
                          <span>{isKhmer ? 'ថ្ងៃនេះ (Today)' : 'Today'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onChange({ mfdDate: '', expDate: '' })}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-[10.5px] font-sans font-bold cursor-pointer transition"
                        >
                          ❌ {isKhmer ? 'សម្អាតកាលបរិច្ឆេទទាំងពីរ' : 'Clear Both Dates'}
                        </button>
                      </div>

                      {/* Make-to-Order Production Rule Box */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 text-[11px] text-slate-800 space-y-1 shadow-2xs">
                        <div className="font-bold text-indigo-950 flex items-center gap-1.5 font-sans">
                          <span>💡</span>
                          <span>{isKhmer ? 'គោលការណ៍ផលិតតិចៗតាមការកុម្ម៉ង់ (Make-to-Order / Small Batches):' : 'Make-to-Order Small Batch Rule:'}</span>
                        </div>
                        <p className="leading-relaxed text-slate-700 font-sans">
                          {isKhmer
                            ? 'កាលបរិច្ឆេទផលិត និងផុតកំណត់មិនត្រូវកំណត់រឹង (Hardcode) លើស្លាកឡើយ! លោកអ្នកអាចទុកប្រអប់កាលបរិច្ឆេទទាំងពីរឱ្យនៅទំនេរ (Blank) ដើម្បីឱ្យស្លាកដែលបោះពុម្ពចេញមក មានចន្លោះត្រៀម «MFD: ................ | EXP: ................ | LOT: ' + (data.lotNumber || '...') + '» សម្រាប់បាញ់កាលបរិច្ឆេទ ឬបោះត្រារូបវន្តជាក់ស្តែង (Handheld Coder / Hot Stamp) រាល់ពេលផលិតបាច់នីមួយៗ។'
                            : 'Do not hardcode fixed dates on labels! Leave date fields blank so the printed sticker has designated placeholder lines (MFD: ......... | EXP: .........) ready for physical handheld coding/stamping upon each order.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                              {isKhmer ? 'កាលបរិច្ឆេទផលិត (ថ្ងៃ/ខែ/ឆ្នាំ)' : 'Mfg Date (MFD)'}
                            </label>
                            {data.mfdDate ? (
                              <button
                                type="button"
                                onClick={() => onChange({ mfdDate: '', expDate: '' })}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer hover:underline"
                              >
                                {isKhmer ? 'សម្អាត' : 'Clear'}
                              </button>
                            ) : null}
                          </div>
                          <input
                            type="text"
                            value={data.mfdDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val.trim()) {
                                onChange({ mfdDate: '', expDate: '' });
                              } else {
                                const newExp = calculateDateWithMonths(val, data.shelfLifeMonths || 6);
                                onChange({ mfdDate: val, ...(newExp ? { expDate: newExp } : {}) });
                              }
                            }}
                            placeholder="DD/MM/YYYY"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-sm font-mono font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                              {isKhmer ? 'កាលបរិច្ឆេទផុតកំណត់ (ថ្ងៃ/ខែ/ឆ្នាំ)' : 'Expiry Date (EXP)'}
                            </label>
                            {data.expDate ? (
                              <button
                                type="button"
                                onClick={() => onChange({ expDate: '' })}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer hover:underline"
                              >
                                {isKhmer ? 'សម្អាត' : 'Clear'}
                              </button>
                            ) : null}
                          </div>
                          <input
                            type="text"
                            value={data.expDate}
                            onChange={(e) => onChange({ expDate: e.target.value })}
                            placeholder="DD/MM/YYYY"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-sm font-mono font-bold text-emerald-800 bg-emerald-50/50"
                          />
                        </div>
                      </div>

                      {/* Shelf Life Dropdown Selector (1 to 36 Months) */}
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="shelf-life-select" className="text-xs font-black text-amber-900 block font-sans">
                            {isKhmer ? 'គណនាស្វ័យប្រវត្តិតាមរយៈពេលរក្សាទុក៖' : 'Auto-Calculate Shelf Life:'}
                          </label>
                          <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full">
                            {data.shelfLifeMonths || 6} {isKhmer ? 'ខែ' : 'Months'}
                          </span>
                        </div>
                        <div className="relative">
                          <select
                            id="shelf-life-select"
                            value={data.shelfLifeMonths || 6}
                            onChange={(e) => handleSelectShelfLife(Number(e.target.value))}
                            className="w-full text-xs sm:text-sm font-bold bg-white border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl px-4 py-2.5 text-slate-800 outline-hidden cursor-pointer appearance-none pr-10 shadow-2xs"
                          >
                            {Array.from({ length: 36 }, (_, i) => i + 1).map((m) => (
                              <option key={m} value={m}>
                                {isKhmer 
                                  ? `${m} ខែ ${m === 6 || m === 12 || m === 18 || m === 24 ? '★ ស្តង់ដារពេញនិយម' : ''}` 
                                  : `${m} ${m === 1 ? 'Month' : 'Months'} ${m === 6 || m === 12 || m === 18 || m === 24 ? '★ Popular Standard' : ''}`}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-amber-800 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-amber-900 pt-1 font-medium">
                          {isKhmer 
                            ? `ជ្រើសរើស ${data.shelfLifeMonths || 6} ខែ — កាលបរិច្ឆេទផុតកំណត់គណនាទៅថ្ងៃទី ${data.expDate} ដោយស្វ័យប្រវត្តិ។`
                            : `Selected ${data.shelfLifeMonths || 6} months — EXP date calculated automatically to ${data.expDate}.`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 10: Lot / Batch Number */}
                  {currentStep === 10 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          {isKhmer ? 'លេខឡូតិ៍ផលិតកម្ម' : 'Lot Number'}
                        </label>
                        <p className="text-[11px] text-slate-500 mb-2">
                          {isKhmer ? 'លេខកូដសម្គាល់ឡូតិ៍ផលិតកម្មសម្រាប់ការត្រួតពិនិត្យ និងតាមដានដាន' : 'Batch code for traceability and EUDR compliance'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={data.lotNumber}
                          onChange={(e) => onChange({ lotNumber: e.target.value })}
                          placeholder={isKhmer ? "ឧ. LOT-2026-CSH-001 (ទុកទទេបើមិនចង់បង្ហាញ)" : "e.g. LOT-2026-CSH-001 (leave blank if not needed)"}
                          className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden font-mono font-bold text-sm text-slate-900"
                        />
                        {data.lotNumber ? (
                          <button
                            type="button"
                            onClick={() => onChange({ lotNumber: '' })}
                            className="px-3.5 py-3 rounded-2xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer shrink-0 border border-slate-200"
                            title={isKhmer ? 'សម្អាតលេខឡូតិ៍ (កុំបង្ហាញលើកញ្ចប់ និងរបាយការណ៍)' : 'Clear Lot Number'}
                          >
                            {isKhmer ? 'សម្អាត' : 'Clear'}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={handleGenerateFreshLot}
                          className="px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{isKhmer ? 'បង្កើតលេខថ្មី' : 'Generate'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 11: Manufacturer Address & Contact */}
                  {currentStep === 11 && (() => {
                    const normalizedProv = CAMBODIA_PROVINCES.find(
                      p => p.kh === data.addressProvince || p.en === data.addressProvince || p.value === data.addressProvince
                    )?.kh || data.addressProvince || 'កំពង់ធំ';

                    const cleanDetails = (data.addressDetails === 'National Road 6, Trapeang Russei, Kampong Thom' || data.addressDetails === 'National Road 6')
                      ? 'ផ្លូវជាតិលេខ ៦ ភូមិត្រពាំងឫស្សី ស្រុកកំពង់ស្វាយ'
                      : (data.addressDetails ?? '');

                    const currentContactPhone = data.contactPhone !== undefined ? data.contactPhone : (userPhone || '');

                    return (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            {isKhmer ? 'ឈ្មោះសហគ្រាសផលិត' : 'Manufactured By Enterprise Name'}
                          </label>
                          <input
                            type="text"
                            value={data.companyName || 'សហគ្រាស ម៉ាយ៉ានី'}
                            onChange={(e) => onChange({ companyName: e.target.value })}
                            placeholder="ឧ. សហគ្រាស ម៉ាយ៉ានី"
                            className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs font-bold text-slate-900 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            {isKhmer ? 'ខេត្ត ឬ រាជធានីផលិត' : 'Province / City'}
                          </label>
                          <select
                            value={normalizedProv}
                            onChange={(e) => onChange({ addressProvince: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-sm font-semibold text-slate-800 bg-white cursor-pointer"
                          >
                            {CAMBODIA_PROVINCES.map(p => (
                              <option key={p.value} value={p.kh}>
                                {isKhmer ? p.kh : `${p.kh} (${p.en})`}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                              {isKhmer ? 'ទីតាំងលម្អិត ភូមិ ឃុំ ស្រុក ឬផ្លូវ' : 'Detailed Location / Street'}
                            </label>
                            {cleanDetails ? (
                              <button
                                type="button"
                                onClick={() => onChange({ addressDetails: '' })}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer hover:underline"
                              >
                                {isKhmer ? 'សម្អាត' : 'Clear'}
                              </button>
                            ) : null}
                          </div>
                          <input
                            type="text"
                            value={cleanDetails}
                            onChange={(e) => onChange({ addressDetails: e.target.value })}
                            placeholder={isKhmer ? "ឧ. ផ្ទះលេខ... ផ្លូវ... (ទុកទទេបើមិនត្រូវការ)" : "e.g. Street / Village / Commune (leave blank if not needed)"}
                            className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs text-slate-800"
                          />

                          {/* Quick Khmer Location Preset Chips */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {[
                              { label: 'ភូមិត្រពាំងឫស្សី ស្រុកកំពង់ស្វាយ', prov: 'កំពង់ធំ' },
                              { label: 'ផ្លូវវេងស្រេង សង្កាត់ស្ទឹងមានជ័យ', prov: 'ភ្នំពេញ' },
                              { label: 'ផ្លូវជាតិលេខ ៤ ឃុំត្រពាំងគង', prov: 'កំពង់ស្ពឺ' },
                              { label: 'ផ្លូវលេខ ៣៣ ឃុំដំណាក់កន្ទួត', prov: 'កំពត' },
                            ].map((item) => (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => onChange({ addressDetails: item.label, addressProvince: item.prov })}
                                className="text-[10.5px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors cursor-pointer"
                              >
                                + {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                              {isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនងលើកញ្ចប់' : 'Contact Phone'}
                            </label>
                            {currentContactPhone ? (
                              <button
                                type="button"
                                onClick={() => onChange({ contactPhone: '' })}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer hover:underline"
                              >
                                {isKhmer ? 'សម្អាត' : 'Clear'}
                              </button>
                            ) : null}
                          </div>
                          <input
                            type="tel"
                            value={currentContactPhone}
                            onChange={(e) => onChange({ contactPhone: e.target.value })}
                            placeholder={isKhmer ? "ឧ. 012 345 678 (ទុកទទេបើមិនត្រូវការ)" : "e.g. 012 345 678 (leave blank if not needed)"}
                            className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs font-mono font-bold text-slate-800"
                          />
                        </div>

                        {/* Live Khmer Address Summary Card */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 space-y-2">
                          <span className="text-[11px] font-black text-amber-900 block uppercase tracking-wider">
                            {isKhmer ? 'ទម្រង់អាសយដ្ឋានផ្លូវការលើស្លាកវេចខ្ចប់៖' : 'Official Packaging Label Address Statement:'}
                          </span>
                          <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5 text-xs">
                            <p className="font-black text-slate-900">
                              <span className="text-amber-800">{isKhmer ? 'ផលិតដោយ ៖ ' : 'Manufactured by: '}</span>
                              <span>{data.companyName || 'សហគ្រាស ម៉ាយ៉ានី'}</span>
                            </p>
                            <p className="font-semibold text-slate-800">
                              <span className="text-slate-500 font-bold">{isKhmer ? 'អាសយដ្ឋាន ៖ ' : 'Address: '}</span>
                              {cleanDetails ? `${cleanDetails}, ` : ''}{normalizedProv ? `${normalizedProv}, ` : ''}{isKhmer ? 'ព្រះរាជាណាចក្រកម្ពុជា' : 'Cambodia'}
                            </p>
                            {currentContactPhone && (
                              <p className="font-semibold text-slate-700">
                                <span className="text-slate-500 font-bold">{isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនង ៖ ' : 'Contact: '}</span>
                                <span className="font-mono">{currentContactPhone}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* STEP 8: Barcode EAN-13 & QR Code */}
                  {currentStep === 8 && (() => {
                    const cleanInputDigits = (data.ean13Code || '').replace(/\D/g, '');
                    const formattedEan = formatEan13(data.ean13Code);
                    const barcodeBinary = formattedEan ? ean13ToBinary(formattedEan) : '';
                    const isCambodiaPrefix = formattedEan.startsWith('884');
                    const isValid13 = cleanInputDigits.length === 13;
                    const is12Digits = cleanInputDigits.length === 12;

                    return (
                      <div className="space-y-5">
                        {/* Received Barcode Celebration & Announcement Banner */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-50 to-amber-50 border-2 border-emerald-400 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🎉</span>
                              <h4 className="text-sm sm:text-base font-black text-slate-950 font-sans">
                                {isKhmer ? 'អបអរសាទរ! បញ្ចូលលេខបាកូដដែលអ្នកទើបទទួលបាន' : 'Congratulations! Enter Your Received Barcodes'}
                              </h4>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-emerald-700 text-white px-2.5 py-0.5 rounded-full">
                              GS1 CAMBODIA 884
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-sans">
                            {isKhmer 
                              ? 'លេខកូដទំនិញអន្តរជាតិ EAN-13 (ចាប់ផ្តើមដោយ 884 សម្រាប់កម្ពុជា) អនុញ្ញាតឱ្យផលិតផលរបស់អ្នកស្កេនលក់នៅផ្សារទំនើប ម៉ាត និងប្រព័ន្ធ POS អន្តរជាតិ។ លោកអ្នកអាចបញ្ចូលលេខ ១៣ ខ្ទង់ ឬជ្រើសរើសពីបញ្ជីបាកូដដែលបានរក្សាទុកខាងក្រោម។' 
                              : 'Official GS1 Cambodia EAN-13 barcode (starts with 884) enables your products to scan at supermarkets, modern trade, and POS systems worldwide.'}
                          </p>
                        </div>

                        {/* Barcode Input & Live Visual Barcode Generator */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider font-sans">
                              {isKhmer ? 'លេខបាកូដទំនិញ EAN-13 (១៣ ខ្ទង់)' : 'EAN-13 Barcode Number (13 Digits)'} <span className="text-rose-500">*</span>
                            </label>

                            {is12Digits && (
                              <button
                                type="button"
                                onClick={() => {
                                  const auto13 = formatEan13(cleanInputDigits);
                                  onChange({ ean13Code: auto13 });
                                }}
                                className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <span>💡 {isKhmer ? 'គណនាខ្ទង់ទី ១៣ ដោយស្វ័យប្រវត្តិ' : 'Calculate 13th Check Digit'}</span>
                              </button>
                            )}
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={data.ean13Code}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                                onChange({ ean13Code: val });
                              }}
                              placeholder="8842120005093"
                              maxLength={13}
                              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-mono font-black text-lg text-slate-950 tracking-wider bg-slate-50/50"
                            />
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400 font-bold">
                              {cleanInputDigits.length}/13
                            </div>
                          </div>

                          {/* Barcode Validation Badge */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {isValid13 ? (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-xl">
                                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                                <span>
                                  {isCambodiaPrefix
                                    ? (isKhmer ? '✓ លេខបាកូដកម្ពុជា GS1 (Prefix 884) ត្រឹមត្រូវ — ត្រៀមស្កេនលក់នៅផ្សារទំនើប' : '✓ Verified GS1 Cambodia Barcode (884) — Ready for Retail')
                                    : (isKhmer ? '✓ លេខបាកូដ EAN-13 អន្តរជាតិត្រឹមត្រូវ' : '✓ Valid International EAN-13 Barcode')}
                                </span>
                              </div>
                            ) : is12Digits ? (
                              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl">
                                ℹ️ {isKhmer ? 'បានបញ្ចូល ១២ ខ្ទង់ — ចុច «គណនាខ្ទង់ទី ១៣» ឬបញ្ចូលខ្ទង់ចុងក្រោយ' : '12 digits entered — calculate check digit or type 13th'}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500">
                                {isKhmer ? 'សូមបញ្ចូលលេខ ១៣ ខ្ទង់ (ឧ. 884...)' : 'Please enter 13 digits (e.g. 884...)'}
                              </div>
                            )}

                            {isValid13 && (
                              <div className="text-xs text-emerald-800 font-bold ml-auto font-mono">
                                EAN-13 GS1
                              </div>
                            )}
                          </div>

                          {/* Contextual guidance for Sugar Coated Cashews */}
                          {((data.productNameEnglish?.toLowerCase().includes('sugar') || data.productNameKhmer?.includes('ស្ករ')) || activeDedicatedProduct?.productNumber === 2 || activeDedicatedProduct?.productNumber === 3) && (
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 font-sans space-y-1">
                              <div className="font-bold flex items-center gap-1.5">
                                <span>🥥</span>
                                <span>{isKhmer ? 'កំណត់សម្គាល់បាកូដរសជាតិស្រោបស្ករ (Sugar Coated Cashews):' : 'Sugar Coated Cashew Barcode Note:'}</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-slate-800">
                                {isKhmer ? (
                                  <>
                                    • <strong>ក្រឡកែវ/PET ១៧៥g (Product 2 Jar):</strong> ប្រើបាកូដផ្លូវការ <strong className="text-amber-900 font-mono">8847116350085</strong><br />
                                    • <strong>កញ្ចប់បាតឈរ ៥០g (Product 3 Pouch):</strong> ប្រើបាកូដផ្លូវការ <strong className="text-amber-900 font-mono">8847116350023</strong>
                                  </>
                                ) : (
                                  <>
                                    • <strong>175g Table Jar (Product 2):</strong> Registered barcode is <strong className="text-amber-900 font-mono">8847116350085</strong><br />
                                    • <strong>50g Standup Pouch (Product 3):</strong> Registered barcode is <strong className="text-amber-900 font-mono">8847116350023</strong>
                                  </>
                                )}
                              </p>
                            </div>
                          )}

                          {/* Mayany Enterprise Pre-Registered Barcode Shortcuts */}
                          <div className="pt-2 border-t border-slate-100 space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-700 block font-sans">
                              {isKhmer ? 'បាកូដ GS1 ផ្លូវការរបស់សហគ្រាស ម៉ាយ៉ានី ទាំង ៩ ផលិតផល (Official GS1 Barcodes):' : 'Official Registered GS1 Barcodes (All 9 Products):'}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 text-xs">
                              {/* 1. 200g Flour Jar */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350047', netWeight: '200g', containerType: 'pp-jar-200g' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350047'
                                    ? 'bg-emerald-100 border-emerald-500 font-black text-emerald-950 ring-2 ring-emerald-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-emerald-400'
                                }`}
                              >
                                <span>🌾 1. ម្សៅសុទ្ធ 200g Jar:</span>
                                <strong className="text-emerald-900 font-bold">8847116350047</strong>
                              </button>

                              {/* 2. 175g Sugar Jar */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350085', netWeight: '175g', containerType: 'pp-jar-200g' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350085'
                                    ? 'bg-amber-100 border-amber-500 font-black text-amber-950 ring-2 ring-amber-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-amber-400'
                                }`}
                              >
                                <span>🥥 2. ស្រោបស្ករ 175g Jar:</span>
                                <strong className="text-amber-900 font-bold">8847116350085</strong>
                              </button>

                              {/* 3. 50g Sugar Pouch */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350023', netWeight: '50g', containerType: 'standup-pouch-50g' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350023'
                                    ? 'bg-amber-100 border-amber-500 font-black text-amber-950 ring-2 ring-amber-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-amber-400'
                                }`}
                              >
                                <span>🥥 3. ស្រោបស្ករ 50g Pouch:</span>
                                <strong className="text-amber-900 font-bold">8847116350023</strong>
                              </button>

                              {/* 4. 175g Pepper Jar */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350061', netWeight: '175g', containerType: 'pp-jar-200g' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350061'
                                    ? 'bg-indigo-100 border-indigo-500 font-black text-indigo-950 ring-2 ring-indigo-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-indigo-400'
                                }`}
                              >
                                <span>🫘 4. ម្រេចកំពត 175g Jar:</span>
                                <strong className="text-indigo-900 font-bold">8847116350061</strong>
                              </button>

                              {/* 5. 50g Pepper Pouch */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350016', netWeight: '50g', containerType: 'standup-pouch-50g' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350016'
                                    ? 'bg-indigo-100 border-indigo-500 font-black text-indigo-950 ring-2 ring-indigo-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-indigo-400'
                                }`}
                              >
                                <span>🫘 5. ម្រេចកំពត 50g Pouch:</span>
                                <strong className="text-indigo-900 font-bold">8847116350016</strong>
                              </button>

                              {/* 6. 175g Chili Jar */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350092', netWeight: '175g', containerType: 'pp-jar-200g' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350092'
                                    ? 'bg-red-100 border-red-500 font-black text-red-950 ring-2 ring-red-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-red-400'
                                }`}
                              >
                                <span>🌶️ 6. ស្រោបម្ទេស 175g Jar:</span>
                                <strong className="text-red-900 font-bold">8847116350092</strong>
                              </button>

                              {/* 7. 50g Chili Pouch */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350078', netWeight: '50g', containerType: 'standup-pouch-50g' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350078'
                                    ? 'bg-red-100 border-red-500 font-black text-red-950 ring-2 ring-red-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-red-400'
                                }`}
                              >
                                <span>🌶️ 7. ស្រោបម្ទេស 50g Pouch:</span>
                                <strong className="text-red-900 font-bold">8847116350078</strong>
                              </button>

                              {/* 8. 50g BB Pepper Pouch */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350108', netWeight: '50g', containerType: 'standup-pouch-50g' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350108'
                                    ? 'bg-indigo-100 border-indigo-500 font-black text-indigo-950 ring-2 ring-indigo-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-indigo-400'
                                }`}
                              >
                                <span>🫘 8. BB ម្រេចកំពត 50g Pouch:</span>
                                <strong className="text-indigo-900 font-bold">8847116350108</strong>
                              </button>

                              {/* 9. 1L Cashew Drink Bottle */}
                              <button
                                type="button"
                                onClick={() => onChange({ ean13Code: '8847116350054', netWeight: '1L', containerType: 'bottle-1l' })}
                                className={`px-2.5 py-1.5 rounded-xl border text-left font-mono transition cursor-pointer flex items-center justify-between gap-1.5 ${
                                  data.ean13Code === '8847116350054'
                                    ? 'bg-emerald-100 border-emerald-500 font-black text-emerald-950 ring-2 ring-emerald-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-emerald-400'
                                }`}
                              >
                                <span>🥛 9. Cashew Drink 1L:</span>
                                <strong className="text-emerald-900 font-bold">8847116350054</strong>
                              </button>
                            </div>
                          </div>

                          {/* Live Rendered SVG Barcode Box */}
                          {barcodeBinary && formattedEan ? (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-2">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                {isKhmer ? 'គំរូបាកូដពិតប្រាកដដែលនឹងបោះពុម្ពលើស្លាក៖' : 'Live Rendered Printable SVG Barcode:'}
                              </span>
                              <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-2xs flex flex-col items-center">
                                <svg
                                  viewBox={`0 0 ${barcodeBinary.length} 45`}
                                  className="w-64 h-16 max-w-full"
                                  shapeRendering="crispEdges"
                                >
                                  {barcodeBinary.split('').map((bit, idx) => (
                                    bit === '1' ? (
                                      <rect key={idx} x={idx} y="0" width="1" height="45" fill="#000000" />
                                    ) : null
                                  ))}
                                </svg>
                                <div className="font-mono text-sm tracking-[0.25em] font-black text-slate-900 mt-1">
                                  {formattedEan.slice(0, 1)} {formattedEan.slice(1, 7)} {formattedEan.slice(7, 13)}
                                </div>
                              </div>
                              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                ✓ SCANNER VERIFIED • HIGH DENSITY GS1 SYMBOLOGY
                              </span>
                            </div>
                          ) : null}
                        </div>

                      <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 bg-white p-1 rounded-xl border-2 border-emerald-500 flex items-center justify-center shrink-0 shadow-xs">
                          {qrDataUrl ? (
                            <img src={qrDataUrl} alt="Traceability QR Code" className="w-full h-full object-contain rounded-lg" />
                          ) : (
                            <QrCode className="w-14 h-14 text-emerald-800" />
                          )}
                        </div>
                        <div className="text-xs text-slate-700 font-sans space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                            <span className="text-emerald-700 font-sans">
                              {isKhmer ? 'លិខិតឆ្លងដែនឌីជីថល & តាមដានប្រភព QR កូដ' : 'Digital QR Passport & Traceability'}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                              LINKED
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            {isKhmer 
                              ? 'QR Code នេះភ្ជាប់ទៅនឹងឈ្មោះផលិតផល និងទម្ងន់សុទ្ធដែលអ្នកបានបញ្ចូលដោយស្វ័យប្រវត្តិ។ ពេលអតិថិជនស្កេន វានឹងបង្ហាញព័ត៌មានពិតប្រាកដដែលបានបំពេញក្នុង ១៣ ជំហាននេះ។' 
                              : 'This QR Code is permanently anchored to the exact product name and net weight entered in these 13 steps.'}
                          </p>

                          {/* Data Binding Verification Pills */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                            <div className="p-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/90 truncate">
                              <span className="font-bold text-emerald-950">📦 {isKhmer ? 'ឈ្មោះផលិតផល៖ ' : 'Product: '}</span>
                              <span className="text-slate-800 font-medium truncate">{data.productNameKhmer || data.productNameEnglish || 'Mayany Cashew'}</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/90 truncate">
                              <span className="font-bold text-emerald-950">⚖️ {isKhmer ? 'ទម្ងន់សុទ្ធ៖ ' : 'Net Weight: '}</span>
                              <span className="text-slate-800 font-bold font-mono">{data.netWeight || '50g'}</span>
                            </div>
                          </div>

                          {passportFullUrl && (
                            <div className="pt-1.5">
                              <a
                                href={passportFullUrl}
                                onClick={(e) => {
                                  if (typeof window !== 'undefined' && window.location.hostname.includes('run.app')) {
                                    e.preventDefault();
                                    const searchStr = passportFullUrl.split('?')[1] || '';
                                    window.location.href = `/?${searchStr}`;
                                  }
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                              >
                                <ExternalLink size={13} />
                                <span>{isKhmer ? '🔍 សាកល្បងបើកមើលលិខិតឆ្លងដែន QR' : '🔍 Test Scan / View QR Passport'}</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Name & Weight QR Permanent Linkage Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-400 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <span>🔗</span>
                            <span>{isKhmer ? 'QR Code ភ្ជាប់ទៅនឹងឈ្មោះផលិតផល & ទម្ងន់សុទ្ធ' : 'QR Code Anchored to Product Name & Net Weight'}</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-950 bg-emerald-200/90 px-2.5 py-0.5 rounded-full font-mono">
                            VERIFIED ANCHOR
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">
                          {isKhmer 
                            ? `✓ បញ្ជាក់៖ QR Code នេះត្រូវបានភ្ជាប់ទៅឈ្មោះ «${data.productNameKhmer || data.productNameEnglish || 'ផលិតផលកម្ពុជា'}» និងទម្ងន់ «${data.netWeight || '50g'}»។ ទោះបីជាកាលបរិច្ឆេទ (MFD/EXP) និងលេខឡូតិ៍ (Lot #) ត្រូវបោះត្រាជាក់ស្តែងលើកញ្ចប់ ឬកំប៉ុងនៅរាល់ពេលច្រកក៏ដោយ QR Code នេះនៅតែអាចស្កេនមើលឈ្មោះផលិតផល ទម្ងន់ និងប្រភពដើមបានយ៉ាងត្រឹមត្រូវ ១០០%!`
                            : `✓ Confirmed: This QR code is securely anchored to product "${data.productNameEnglish || data.productNameKhmer || 'Product'}" and weight "${data.netWeight || '50g'}". You can safely pre-print this QR code in bulk (e.g. 10,000+ packaging pouches) in advance!`}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                  {/* STEP 12: Product of Cambodia, Storage & Certifications */}
                  {currentStep === 12 && (
                    <div className="space-y-6">
                      {/* Product of Cambodia (CS 001 Mandatory Requirement) */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-emerald-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <span>🇰🇭</span>
                            <span>{isKhmer ? 'ប្រភពដើមផលិតផល' : 'Country of Origin'}</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono border border-emerald-300">
                            CS 001:2000 MANDATORY
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">
                          {isKhmer 
                            ? 'យោងតាមស្តង់ដារ CS 001:2000 និងច្បាប់នាំចេញអន្តរជាតិ ស្លាកទាំងអស់ត្រូវតែបញ្ជាក់ «ផលិតផលនៃព្រះរាជាណាចក្រកម្ពុជា»។ ប្រព័ន្ធបានបញ្ចូលស្វ័យប្រវត្តិនូវការបញ្ជាក់នេះលើស្លាក និងលិខិតឆ្លងដែន QR។'
                            : 'Mandatory origin statement required by Cambodian National Standard CS 001:2000 and international trade regulations. System automatically prints "Product of Cambodia" on the label and links to the digital QR passport.'}
                        </p>
                      </div>

                      {/* 1. Storage Conditions (ការរក្សាទុក) */}
                      <div className="p-4 rounded-2xl bg-white border-2 border-amber-200/90 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <span>📦</span>
                            <span>{isKhmer ? '១. ការរក្សាទុក' : '1. Storage Conditions'}</span>
                          </label>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md font-sans">
                            {isKhmer ? 'តម្រូវជាកាតព្វកិច្ច' : 'Mandatory'}
                          </span>
                        </div>

                        {/* Storage Preset Dropdown */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            {isKhmer ? 'ជ្រើសរើសគំរូលក្ខខណ្ឌរក្សាទុក៖' : 'Storage Preset Dropdown:'}
                          </label>
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                onChange({ storageInstructions: e.target.value });
                              }
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white text-xs font-semibold text-slate-800 cursor-pointer focus:border-amber-500 focus:outline-hidden"
                          >
                            <option value="">-- {isKhmer ? 'ជ្រើសរើសគំរូការរក្សាទុកស្តង់ដារ' : 'Select standard storage preset'} --</option>
                            {STORAGE_PRESET_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.textKh}>
                                {opt.textKh} ({opt.tag})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Direct Input */}
                        <div>
                          <input
                            type="text"
                            value={data.storageInstructions}
                            onChange={(e) => onChange({ storageInstructions: e.target.value })}
                            placeholder="ឧ. បិទមាត់ថង់ឱ្យជិតបន្ទាប់ពីបើករួច និងរក្សាទុកនៅកន្លែងត្រជាក់ ស្ងួត ជៀសវាងពន្លឺថ្ងៃ"
                            className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs text-slate-800 font-medium bg-white"
                          />
                        </div>

                        {/* Quick Clickable Storage Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => onChange({ storageInstructions: 'បិទមាត់ថង់ឱ្យជិតបន្ទាប់ពីបើករួច និងរក្សាទុកនៅកន្លែងត្រជាក់ ស្ងួត ជៀសវាងពន្លឺថ្ងៃ' })}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-200 transition cursor-pointer"
                          >
                            + បិទមាត់ថង់ឱ្យជិតបន្ទាប់ពីបើករួច និងរក្សាទុកនៅកន្លែងត្រជាក់ ស្ងួត (ពេញនិយម)
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange({ storageInstructions: 'រក្សាទុកនៅកន្លែងត្រជាក់ និងស្ងួត ជៀសវាងពន្លឺថ្ងៃ និងសំណើម' })}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            + រក្សាទុកកន្លែងត្រជាក់ស្ងួត ជៀសវាងពន្លឺថ្ងៃ
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange({ storageInstructions: 'ក្រោយពេលបើកកញ្ចប់ សូមបិទមាត់ថង់ឱ្យជិត ឬច្រកក្នុងកំប៉ុងបិទជិត' })}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            + ច្រកក្នុងកំប៉ុងបិទជិត
                          </button>
                        </div>
                      </div>

                      {/* 2. MISTI & Certification Body Training Icons (និមិត្តសញ្ញាអប់រំ និងស្តង់ដារ MISTI) */}
                      <div className="p-4 rounded-2xl bg-white border-2 border-indigo-200 shadow-2xs space-y-3.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-indigo-100 pb-2.5">
                          <div>
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span className="text-base">♻️</span>
                              <span>{isKhmer ? '២. និមិត្តសញ្ញាអប់រំ និងស្តង់ដារ' : '2. Compliance Icons'}</span>
                            </label>
                            <p className="text-[11px] text-slate-600 font-sans">
                              {isKhmer 
                                ? 'និមិត្តសញ្ញាដែល MISTI និងស្ថាប័នបញ្ជាក់គុណភាពបានណែនាំក្នុងវគ្គបណ្តុះបណ្តាលវេចខ្ចប់' 
                                : 'Icons recommended in MISTI & packaging certification training'}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0 self-start sm:self-center">
                            {(data.packagingSymbols || []).length} SELECTED
                          </span>
                        </div>

                        {/* Dropdown to Add/Select Icons */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {isKhmer ? 'ជ្រើសរើសនិមិត្តសញ្ញាពីបញ្ជីទម្លាក់ចុះ៖' : 'Select icon from dropdown list:'}
                          </label>
                          <select
                            value=""
                            onChange={(e) => {
                              const iconId = e.target.value;
                              if (iconId) {
                                const current = data.packagingSymbols || [];
                                if (!current.includes(iconId)) {
                                  onChange({ packagingSymbols: [...current, iconId] });
                                }
                              }
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white text-xs font-semibold text-slate-800 cursor-pointer focus:border-indigo-500 focus:outline-hidden"
                          >
                            <option value="">-- {isKhmer ? 'ជ្រើសរើសនិមិត្តសញ្ញាដែលបានរៀនក្នុងវគ្គបណ្តុះបណ្តាល' : 'Select MISTI training icon'} --</option>
                            {MISTI_COMPLIANCE_ICONS.map((ic) => (
                              <option key={ic.id} value={ic.id}>
                                {ic.icon} {ic.labelKh}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Multi-Select Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {MISTI_COMPLIANCE_ICONS.map((item) => {
                            const isSelected = (data.packagingSymbols || []).includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  const current = data.packagingSymbols || [];
                                  const updated = isSelected 
                                    ? current.filter(id => id !== item.id)
                                    : [...current, item.id];
                                  onChange({ packagingSymbols: updated });
                                }}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                                  isSelected 
                                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 shadow-xs ring-1 ring-indigo-300' 
                                    : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                                    <span className="text-base shrink-0">{item.icon}</span>
                                    <span className="truncate">{item.labelKh}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 leading-tight pt-0.5 line-clamp-1">
                                    {item.descriptionKh}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. National Standards & Quality Certifications */}
                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          {isKhmer ? '៣. សញ្ញាស្តង់ដារ និងវិញ្ញាបនបត្រជាតិ៖' : '3. Certifications & Quality Badges:'}
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { id: 'cs-mark', label: '🇰🇭 ស្តង់ដារកម្ពុជា CS 001' },
                            { id: 'ghp-cambodia', label: '🛡️ អនាម័យ GHP Cambodia' },
                            { id: 'haccp-cambodia', label: '🏭 សុវត្ថិភាព HACCP' },
                            { id: 'cam-quality', label: isKhmer ? '🥇 គុណភាពកម្ពុជា' : '🥇 Cambodia Quality Mark' },
                            { id: 'halal', label: isKhmer ? '🟢 ហាឡាល' : '🟢 Halal' },
                            { id: 'eudr-compliant', label: isKhmer ? '🇪🇺 អនុលោមភាពអឺរ៉ុប EUDR' : '🇪🇺 EUDR Compliant' }
                          ].map(cert => {
                            const isSelected = data.selectedCertifications.includes(cert.id);
                            return (
                              <button
                                key={cert.id}
                                type="button"
                                onClick={() => {
                                  const updated = isSelected 
                                    ? data.selectedCertifications.filter(c => c !== cert.id)
                                    : [...data.selectedCertifications, cert.id];
                                  onChange({ selectedCertifications: updated });
                                }}
                                className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer flex items-center gap-2 ${
                                  isSelected 
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-2xs' 
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3" />}
                                </div>
                                <span className="truncate">{cert.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: Instructions for Use / Ready to Eat */}
                  {currentStep === 6 && (
                    <div className="space-y-5">
                      {/* Header with quick tip */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                        <span className="text-xl shrink-0">🍵</span>
                        <div className="space-y-0.5">
                          <p className="font-bold text-amber-900">
                            {isKhmer ? 'របៀបប្រើប្រាស់ ឬ ទទួលទាន' : 'Instructions for Use & Preparation'}
                          </p>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {isKhmer 
                              ? 'បញ្ជាក់ឱ្យច្បាស់ថាតើផលិតផលជាអាហារទទួលទានភ្លាមៗ ឬត្រូវឆុងជាមួយទឹកក្តៅ ២៥០ មីលីលីត្រ, ក្រឡុក, ដុតនំ, ឬចម្អិនមុនពេលទទួលទាន។'
                              : 'Specify whether the product is Ready to Eat, requires brewing with 250ml hot water, blending in smoothies, or cooking.'}
                          </p>
                        </div>
                      </div>

                      {/* Combined Single Dropdown List */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="usage-instruction-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {isKhmer ? 'ជម្រើសគំរូការណែនាំ៖' : 'Instruction Template:'}
                          </label>
                          {data.instructionsForUse ? (
                            <button
                              type="button"
                              onClick={() => onChange({ instructionsForUse: '' })}
                              className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer hover:underline"
                            >
                              {isKhmer ? 'សម្អាត' : 'Clear'}
                            </button>
                          ) : null}
                        </div>

                        <select
                          id="usage-instruction-select"
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              onChange({ instructionsForUse: e.target.value });
                            }
                          }}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs text-slate-900 bg-white cursor-pointer shadow-2xs font-sans"
                        >
                          <option value="">
                            -- {isKhmer ? 'ជ្រើសរើសគំរូការណែនាំប្រើប្រាស់ ឬ ទទួលទាន' : 'Select instructions for use template'} --
                          </option>

                          <optgroup label={isKhmer ? '⭐ ជម្រើសគំរូពេញនិយមទូទៅ' : '⭐ Popular General Presets'}>
                            <option value="អាហារសម្រន់ប្រណិត អាចទទួលទានផ្ទាល់ភ្លាមៗ ឬញ៉ាំជាមួយភេសជ្ជៈ។">
                              {isKhmer ? '⚡ ទទួលទានភ្លាមៗ (Ready to Eat)' : '⚡ Ready to Eat Snack'}
                            </option>
                            <option value="• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)&#10;• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ&#10;• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ">
                              {isKhmer ? '🥛 ម្សៅស្វាយចន្ទី - ទឹកដោះ, ស្មូធី & ធ្វើនំ' : '🥛 Cashew Flour - Cashew Milk, Smoothies & Baking'}
                            </option>
                            <option value="ដាក់ម្សៅ ២ ស្លាបព្រាបាយលាយជាមួយទឹកក្រឡុក ភេសជ្ជៈ បបរពេលព្រឹក ឬឆុងទឹកក្តៅឧណ្ហៗ។">
                              {isKhmer ? '🥤 ក្រឡុក / បបរ / ភេសជ្ជៈ' : '🥤 Smoothie / Porridge / Warm Water'}
                            </option>
                            <option value="លាបលើនំបុ័ង ជ្រលក់ផ្លែឈើស្រស់ ឬលាយក្នុងទឹកជ្រលក់ស៊ុប និងសាឡាដបន្លែ។">
                              {isKhmer ? '🍞 លាបលើនំបុ័ង ឬ ជ្រលក់' : '🍞 Toast Spread & Dips'}
                            </option>
                            <option value="ឆុងជាមួយទឹកក្តៅពុះ ៨៥°C - ៩៥°C ចំនួន ២៥០ មីលីលីត្រ រយៈពេល ៣ ទៅ ៥ នាទី រួចកូរឱ្យសព្វទទួលទាន។">
                              {isKhmer ? '🍵 ឆុងជាមួយទឹកក្តៅ (សម្រាប់តែ / កាហ្វេ)' : '🍵 Hot Water Brew (Tea / Coffee)'}
                            </option>
                            <option value="ចម្អិន អាំង ឬចៀនលើភ្លើងមធ្យម ៥ ទៅ ៨ នាទីរហូតដល់ឆ្អិនល្អ និងឈ្ងុយឆ្ងាញ់។">
                              {isKhmer ? '🍳 ចម្អិន ឬ ចៀន / អាំង' : '🍳 Cook / Fry / Grill'}
                            </option>
                            <option value="លាងអង្ករ ១ ទៅ ២ ដង ដាំជាមួយទឹកក្នុងសមាមាត្រ អង្ករ ១កែវ ៖ ទឹក ១.២ ទៅ ១.៣កែវ។">
                              {isKhmer ? '🍚 ដាំបាយក្រអូប' : '🍚 Steamed Fragrant Rice'}
                            </option>
                          </optgroup>

                          <optgroup label={isKhmer ? '📦 ជម្រើសតាមប្រភេទផលិតផលជាក់លាក់' : '📦 By Product Category'}>
                            <option value="កសិផលសម្រន់សុខភាព អាចទទួលទានផ្ទាល់ ញ៉ាំជាមួយភេសជ្ជៈ ឬលាយជាមួយសាឡាដបន្លែធម្មជាតិ។">
                              {isKhmer ? 'គ្រាប់ស្វាយចន្ទីស្រោប & លីង - ញ៉ាំផ្ទាល់' : 'Coated & Roasted Cashews - Direct Snack'}
                            </option>
                            <option value="ដាក់ម្សៅ ២ ស្លាបព្រាបាយក្នុងទឹកក្រឡុក បបរពេលព្រឹក ធ្វើនំដុត ឬលាយទឹកក្តៅឧណ្ហៗធ្វើជាទឹកដោះគោគ្រាប់ស្វាយចន្ទីស្រស់។">
                              {isKhmer ? 'ម្សៅស្វាយចន្ទី - ក្រឡុក & ដុតនំ' : 'Cashew Flour - Smoothie & Baking'}
                            </option>
                            <option value="ញ៉ាំផ្ទាល់ជាអាហារសម្រន់ធម្មជាតិផ្អែមឆ្ងាញ់ លាយជាមួយទឹកដោះគោជូរ ធញ្ញជាតិពេលព្រឹក ឬនំខេក។">
                              {isKhmer ? 'ផ្លែឈើស្ងួត - ញ៉ាំផ្ទាល់ & អាហារសម្រន់' : 'Dried Fruits - Ready to Eat Snack'}
                            </option>
                            <option value="ប្រើឆុងជាមួយតែ កាហ្វេ ទឹកក្រូចឆ្មា ឬបន្ថែមរសជាតិផ្អែមឈ្ងុយក្នុងមុខម្ហូប និងបង្អែមខ្មែរ។">
                              {isKhmer ? 'ទឹកឃ្មុំព្រៃ & ស្ករត្នោត - ភេសជ្ជៈ & បង្អែម' : 'Wild Honey & Palm Sugar - Sweetener'}
                            </option>
                            <option value="ឆុងជាមួយទឹកក្តៅពុះ ៩០°C - ៩៥°C រយៈពេល ៣ ទៅ ៥ នាទី។ អាចបន្ថែមទឹកដោះគោ ឬទឹកកកតាមចំណូលចិត្ត។">
                              {isKhmer ? 'កាហ្វេម្សៅ & តែ - ឆុងក្តៅ ឬ ត្រជាក់' : 'Ground Coffee & Tea - Hot/Cold Brew'}
                            </option>
                            <option value="ប្រើជាទឹកជ្រលក់ផ្ទាល់សម្រាប់អាហារសមុទ្រ សាច់អាំង ឬចម្អិនជាគ្រឿងផ្សំសម្ល។">
                              {isKhmer ? 'ទឹកត្រី & ទឹកម្ទេស - ជ្រលក់ & ស្ល' : 'Fish Sauce & Chili Dip - Dipping & Seasoning'}
                            </option>
                            <option value="លាងអង្ករ ១ ទៅ ២ ដង ដាំជាមួយទឹកក្នុងសមាមាត្រ អង្ករ ១កែវ ៖ ទឹក ១.២ ទៅ ១.៣កែវ។">
                              {isKhmer ? 'អង្ករផ្ការំដួល - ដាំបាយក្រអូប' : 'Jasmine Fragrant Rice - Steamed Rice'}
                            </option>
                            <option value="ចៀន អាំង ឬចំហុយលើភ្លើងមធ្យម ៥ ទៅ ៨ នាទីរហូតដល់ឆ្អិនល្អ និងឈ្ងុយឆ្ងាញ់។">
                              {isKhmer ? 'ត្រីងៀត & សាច់ក្រក - ចម្អិន អាំង ស្ល' : 'Dried Fish & Sausage - Cook / Grill'}
                            </option>
                            <option value="លាបលើនំបុ័ង ជ្រលក់ផ្លែប៉ោម ចេក ឬលាយក្នុងទឹកជ្រលក់ស៊ុប និងទឹកសាឡាដ។">
                              {isKhmer ? 'ប៊ឺស្វាយចន្ទី - លាបនំបុ័ង & ជ្រលក់' : 'Cashew Butter - Toast Spread & Dips'}
                            </option>
                          </optgroup>
                        </select>
                      </div>

                      {/* Custom Textarea */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {isKhmer ? 'ខ្លឹមសារការណែនាំលើកញ្ចប់ (អាចកែប្រែដោយសេរី)៖' : 'Custom Instruction Text on Packaging:'}
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {data.instructionsForUse?.length || 0} {isKhmer ? 'តួអក្សរ' : 'chars'}
                          </span>
                        </div>

                        {/* Quick Insert Badge Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-[10px] text-slate-500 font-bold self-center">
                            {isKhmer ? 'បញ្ចូលពាក្យរហ័ស៖' : 'Quick add:'}
                          </span>
                          {(isKhmer
                            ? [
                                'ទទួលទានភ្លាមៗ',
                                'ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទី',
                                'លាយក្នុងស្មូធី & កាហ្វេ',
                                'ប្រើធ្វើនំ & ដុតនំ',
                                'ក្រឡុកឱ្យសព្វមុនប្រើ',
                                'កូរឱ្យសព្វមុនទទួលទាន'
                              ]
                            : [
                                'Ready to eat',
                                'Make cashew milk',
                                'Blend in smoothies & coffee',
                                'Use in baking & cooking',
                                'Shake well before use',
                                'Stir well before consuming'
                              ]
                          ).map(phrase => (
                            <button
                              key={phrase}
                              type="button"
                              onClick={() => {
                                const current = (data.instructionsForUse || '').trim();
                                const updated = current ? `${current} ${phrase}។` : `${phrase}។`;
                                onChange({ instructionsForUse: updated });
                              }}
                              className="text-[10.5px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors cursor-pointer"
                            >
                              + {phrase}
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={3}
                          value={data.instructionsForUse || ''}
                          onChange={(e) => onChange({ instructionsForUse: e.target.value })}
                          placeholder={isKhmer 
                            ? "ឧ. អាហារសម្រន់ប្រណិត អាចទទួលទានផ្ទាល់ ឬធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ/ត្រជាក់ លាយក្នុងស្មូធី កាហ្វេ និងធ្វើនំ។ (ទុកទទេបើមិនចង់បង្ហាញ)" 
                            : "e.g. Ready to eat snack, or make hot/cold cashew milk, blend into smoothies/coffee, and baking. (leave blank if not needed)"}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs text-slate-900 leading-relaxed font-sans"
                        />
                      </div>

                      {/* Live Khmer Instruction Summary Card */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                            <span>🍵</span>
                            <span>{isKhmer ? 'ទម្រង់ការណែនាំលើកញ្ចប់ផលិតផល៖' : 'Live Instruction on Packaging:'}</span>
                          </span>
                          {(data.instructionsForUse?.includes('ទទួលទានភ្លាមៗ') || data.instructionsForUse?.includes('ញ៉ាំភ្លាមៗ') || data.instructionsForUse?.toLowerCase().includes('ready to eat')) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <span>✓</span>
                              <span>{isKhmer ? 'ទទួលទានភ្លាមៗ' : 'Ready to Eat'}</span>
                            </span>
                          )}
                          {(data.instructionsForUse?.includes('២៥០') || data.instructionsForUse?.toLowerCase().includes('250')) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                              <span>💧</span>
                              <span>{isKhmer ? 'ទឹកក្តៅ ២៥០ មីលីលីត្រ' : '250ml Hot Water'}</span>
                            </span>
                          )}
                        </div>
                        {data.instructionsForUse?.trim() ? (
                          <p className="text-xs font-semibold text-slate-800 leading-relaxed font-sans">
                            {data.instructionsForUse}
                          </p>
                        ) : (
                          <p className="text-xs italic text-slate-400 font-sans">
                            {isKhmer ? '(គ្មានការណែនាំប្រើប្រាស់ - នឹងមិនបង្ហាញលើកញ្ចប់ឡើយ)' : '(No usage instructions provided - will be hidden)'}
                          </p>
                        )}
                      </div>

                      {/* Dedicated Health Benefits & Nutrition Highlights for All Products */}
                      <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                          <label className="text-xs font-black text-slate-900 uppercase tracking-wider font-sans flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span>{isKhmer ? 'អត្ថប្រយោជន៍ចំពោះសុខភាព (Health & Nutritional Benefits):' : 'Health & Nutritional Benefits:'}</span>
                          </label>
                          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                            {isKhmer ? 'បង្ហាញលើវិញ្ញាបនបត្រពេលស្កេន' : 'Digital Certificate'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                          {isKhmer
                            ? 'បញ្ចូល ឬកែប្រែចំណុចអត្ថប្រយោជន៍សុខភាពនៃផលិតផល។ ព័ត៌មាននេះនឹងត្រូវបានបង្ហាញក្នុងវិញ្ញាបនបត្របច្ចេកទេស និងបកប្រែពហុភាសា (កូរ៉េ អង់គ្លេស អាល្លឺម៉ង់...) ជូនអតិថិជនពេលស្កេន QR Code។'
                            : 'Enter health benefits bullet points. Automatically translated to Korean, English, German upon QR code scan.'}
                        </p>
                        <textarea
                          rows={6}
                          value={data.healthBenefits || ''}
                          onChange={(e) => onChange({ healthBenefits: e.target.value })}
                          placeholder={isKhmer 
                            ? '• ប្រូតេអ៊ីនពីរុក្ខជាតិ៖ គ្រាប់ស្វាយចន្ទីមានផ្ទុកប្រូតេអ៊ីន...\n• ខ្លាញ់មិនឆ្អែត៖ ...\n• ម៉ាញេស្យូម៖ ...'
                            : 'Enter health benefits bullet points...'}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs text-slate-900 leading-relaxed font-sans bg-slate-50/50"
                        />
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[10.5px] font-bold text-slate-500">{isKhmer ? 'គំរូអត្ថប្រយោជន៍៖' : 'Quick Presets:'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const benefits = '• ប្រូតេអ៊ីនពីរុក្ខជាតិ: គ្រាប់ស្វាយចន្ទីមានផ្ទុកប្រូតេអ៊ីន ដែលជាសារធាតុចិញ្ចឹមសំខាន់សម្រាប់រាងកាយ និងការថែរក្សាសាច់ដុំ。\n• ខ្លាញ់មិនឆ្អែត: គ្រាប់ស្វាយចន្ទីមានខ្លាញ់មិនឆ្អែតជាចម្បង ដែលជាផ្នែកមួយនៃរបបអាហារដែលមានតុល្យភាព。\n• ម៉ាញេស្យូម: ជាសារធាតុរ៉ែដែលរាងកាយត្រូវការសម្រាប់មុខងារសាច់ដុំ ប្រព័ន្ធប្រសាទ ឆ្អឹង និងការបង្កើតថាមពល。\n• ទង់ដែង ស័ង្កសី និងជាតិដែក: ជាសារធាតុរ៉ែសំខាន់ៗដែលចូលរួមក្នុងមុខងារផ្សេងៗរបស់រាងកាយ ដូចជា ប្រព័ន្ធភាពស៊ាំ ការបង្កើតកោសិកាឈាមក្រហម និងការរំលាយអាហារ。\n• ផូស្វ័រ: ជួយគាំទ្រមុខងារធម្មតារបស់ឆ្អឹង និងធ្មេញ ព្រមទាំងដំណើរការផលិតថាមពលរបស់រាងកាយ。\n• វីតាមីន និងសារធាតុប្រឆាំងអុកស៊ីតកម្ម: គ្រាប់ស្វាយចន្ទីមានផ្ទុកវីតាមីន និងសារធាតុប្រឆាំងអុកស៊ីតកម្មមួយចំនួន ដែលចូលរួមក្នុងការគាំទ្រសុខភាព និងការការពារកោសិកា。\n• គ្មានផលិតផលទឹកដោះគោ និងគ្មានជាតិឡាក់តូស: ម្សៅគ្រាប់ស្វាយចន្ទីជាផលិតផលពីរុក្ខជាតិ និងមិនមានការបន្ថែមផលិតផលទឹកដោះគោ ឬឡាក់តូស。\n• ប្រើប្រាស់បានច្រើនមុខ: អាចយកទៅប្រើក្នុងការធ្វើនំ ភេសជ្ជៈ កាហ្វេ ទឹកជ្រលក់ ស៊ុប និងការចម្អិនម្ហូបអាហារប្រចាំថ្ងៃ។';
                              onChange({ healthBenefits: benefits });
                              setAddedSuccessToast(isKhmer ? '✓ បានបញ្ចូលអត្ថប្រយោជន៍ ៨ ចំណុចគ្រាប់ស្វាយចន្ទី' : '✓ Applied 8 Health Benefits');
                              setTimeout(() => setAddedSuccessToast(null), 3000);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10.5px] font-bold transition cursor-pointer"
                          >
                            ✨ អត្ថប្រយោជន៍ ៨ ចំណុចគ្រាប់ស្វាយចន្ទី
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 7: Net Weight & Packaging Format (Dropdowns) */}
                  {currentStep === 7 && (
                    <div className="space-y-5">
                      {/* Net Weight Dropdown */}
                      <div className="space-y-2">
                        <label htmlFor="net-weight-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {isKhmer ? 'ទម្ងន់សុទ្ធ' : 'Net Weight'}
                        </label>
                        <div className="relative">
                          <select
                            id="net-weight-select"
                            value={data.netWeight}
                            onChange={(e) => onChange({ netWeight: e.target.value })}
                            className="w-full text-xs sm:text-sm font-bold bg-white border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-2xl px-4 py-3 text-slate-800 outline-hidden cursor-pointer appearance-none pr-10 shadow-2xs"
                          >
                            <option value="">{isKhmer ? '-- ជ្រើសរើសទម្ងន់សុទ្ធ --' : '-- Select Net Weight --'}</option>
                            <option value="50g">{isKhmer ? '៥០ ក្រាម' : '50g'}</option>
                            <option value="100g">{isKhmer ? '១០០ ក្រាម' : '100g'}</option>
                            <option value="150g">{isKhmer ? '១៥០ ក្រាម' : '150g'}</option>
                            <option value="200g">{isKhmer ? '២០០ ក្រាម' : '200g'}</option>
                            <option value="250g">{isKhmer ? '២៥០ ក្រាម' : '250g'}</option>
                            <option value="300g">{isKhmer ? '៣០០ ក្រាម' : '300g'}</option>
                            <option value="350g">{isKhmer ? '៣៥០ ក្រាម' : '350g'}</option>
                            <option value="400g">{isKhmer ? '៤០០ ក្រាម' : '400g'}</option>
                            <option value="500g">{isKhmer ? '៥០០ ក្រាម' : '500g'}</option>
                            <option value="750g">{isKhmer ? '៧៥០ ក្រាម' : '750g'}</option>
                            <option value="1kg">{isKhmer ? '១ គីឡូក្រាម' : '1kg'}</option>
                            <option value="2kg">{isKhmer ? '២ គីឡូក្រាម' : '2kg'}</option>
                            <option value="5kg">{isKhmer ? '៥ គីឡូក្រាម' : '5kg'}</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Optional text input for custom weight specification */}
                        <div className="pt-1">
                          <span className="text-[11px] text-slate-500 block mb-1">
                            {isKhmer ? 'ឬវាយបញ្ចូលទម្ងន់ជាក់លាក់ដោយផ្ទាល់៖' : 'Or type custom net weight:'}
                          </span>
                          <input
                            type="text"
                            value={data.netWeight}
                            onChange={(e) => onChange({ netWeight: e.target.value })}
                            placeholder="ឧ. 50g ឬ 100g"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs sm:text-sm font-bold text-slate-800 bg-slate-50/50"
                          />
                        </div>
                      </div>

                      {/* Packaging Format Dropdown */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label htmlFor="packaging-format-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {isKhmer ? 'ប្រភេទវេចខ្ចប់' : 'Packaging Type'}
                        </label>
                        <div className="relative">
                          <select
                            id="packaging-format-select"
                            value={data.containerType}
                            onChange={(e) => onChange({ containerType: e.target.value as ContainerType })}
                            className="w-full text-xs sm:text-sm font-bold bg-white border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-2xl px-4 py-3 text-slate-800 outline-hidden cursor-pointer appearance-none pr-10 shadow-2xs"
                          >
                            <option value="standup-pouch-50g">{isKhmer ? 'ថង់ហ្ស៊ីបបាតឈរ ៥០g' : '50g Standing Pouch'}</option>
                            <option value="standup-pouch-100g">{isKhmer ? 'ថង់ឈរ ១០០g' : '100g Standup Pouch'}</option>
                            <option value="pp-jar-200g">{isKhmer ? 'កំប៉ុងជ័រ ២០០g' : '200g Food-Grade PP Jar'}</option>
                            <option value="glass-jar-180g">{isKhmer ? 'កំប៉ុងកែវ ១៨០g' : '180g Glass Jar'}</option>
                            <option value="kraft-pouch-250g">{isKhmer ? 'ថង់ក្រដាសក្រាហ្វ ២៥០g' : '250g Kraft Pouch'}</option>
                            <option value="standup-pouch-500g">{isKhmer ? 'ថង់វេចខ្ចប់ ៥០០g' : '500g Standup Pouch'}</option>
                            <option value="vacuum-bag-1kg">{isKhmer ? 'ថង់បូមខ្យល់ ១kg' : '1kg Vacuum Bag'}</option>
                            <option value="bottle-glass">{isKhmer ? 'ដបកែវ ឬ ដបជ័រ' : 'Glass / Plastic Bottle'}</option>
                            <option value="can-metal">{isKhmer ? 'កំប៉ុងដែកអាលុយមីញ៉ូម' : 'Metal / Aluminum Can'}</option>
                            <option value="box-cardboard">{isKhmer ? 'ប្រអប់ក្រដាសរឹង' : 'Rigid Paper Box'}</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 13: Final Review & Print */}
                  {currentStep === 13 && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-950 space-y-2 font-sans">
                          <strong>{isKhmer ? 'ស្លាកវេចខ្ចប់របស់អ្នកបានរៀបចំរួចរាល់ ១០០%!' : 'Your packaging label is 100% ready!'}</strong>
                          <p className="text-emerald-800 leading-relaxed">
                            {isKhmer 
                              ? 'រាល់ព័ត៌មានទាំង ១៣ ចំណុចស្របតាមស្តង់ដារជាតិ CS 001:2000 រួមមានបាកូដ របៀបប្រើប្រាស់ ឃ្យូអរ និងឡូហ្គោម៉ាករបស់អ្នក ត្រូវបានដាក់បញ្ចូលយ៉ាងត្រឹមត្រូវ។' 
                              : 'All CS 001:2000 requirements, instructions for use, QR code passport, and brand logos are successfully composed.'}
                          </p>
                          <div className="bg-emerald-100/70 p-2.5 rounded-xl text-[11px] text-emerald-950 font-medium leading-relaxed">
                            🖨️ {isKhmer 
                              ? 'ពេលចុច «បោះពុម្ពស្លាកឥឡូវនេះ» ប្រព័ន្ធនឹងបញ្ជូនតែ «ស្លាកវេចខ្ចប់ CS 001» មួយផ្ទាំងគត់ទៅកាន់ម៉ាស៊ីនព្រីន (ដោយលាក់បាំងផ្ទាំងវេបសាយ ម៉ឺនុយ និងប៊ូតុងទាំងអស់)។ លោកអ្នកអាចព្រីនលើក្រដាសស្ទីកគ័រ ឬរក្សាទុកជា PDF បានយ៉ាងស្អាត។'
                              : 'Clicking "Print Label Now" sends ONLY the clean CS 001 packaging label to your printer (all web UI, menus, and buttons are automatically hidden). You can print directly to sticker paper or save as PDF.'}
                          </div>
                        </div>
                      </div>

                      {/* Dedicated 13-Stage Verification & Cloud Sync Card */}
                      {activeDedicatedProduct && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-white to-emerald-500/10 border-2 border-amber-400 shadow-md space-y-4 animate-fade-in font-sans">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center text-lg font-black shrink-0">
                                {activeDedicatedProduct.icon || '⚡'}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold bg-slate-900 text-amber-300 px-2 py-0.5 rounded">
                                    LOT: {data.lotNumber || activeDedicatedProduct.batch}
                                  </span>
                                  <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                                    🔒 QR Code រោងពុម្ពដដែល
                                  </span>
                                </div>
                                <h4 className="text-sm sm:text-base font-black text-slate-950 mt-0.5">
                                  ផ្ទៀងផ្ទាត់ & រក្សាទុកទិន្នន័យទាំង ១៣ ជំហានលើ QR Code ផ្លូវការ
                                </h4>
                              </div>
                            </div>

                            <span className="text-[11px] font-mono font-bold bg-amber-200 text-amber-950 px-3 py-1 rounded-full border border-amber-300 self-start sm:self-auto">
                              បាកូដ៖ {data.ean13Code || activeDedicatedProduct.ean13}
                            </span>
                          </div>

                          {/* 13 Stages Data Recap Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                ជំហាន ៣-៤៖ ឈ្មោះ & អនុចំណងជើង
                              </span>
                              <div className="font-bold text-slate-900">
                                {data.productNameKhmer} ({data.productNameEnglish})
                              </div>
                              <div className="text-[11px] text-slate-600 line-clamp-1">
                                {data.subheadingOrBotanical || 'Cambodian Cashews'}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                ជំហាន ៧-៨-១០៖ ទម្ងន់ • បាកូដ • ឡូតិ៍
                              </span>
                              <div className="font-mono font-bold text-slate-900">
                                {data.netWeight} • EAN: {data.ean13Code}
                              </div>
                              <div className="text-[11px] font-mono text-emerald-800 font-bold">
                                LOT: {data.lotNumber}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                ជំហាន ៥៖ គ្រឿងផ្សំផ្លូវការ
                              </span>
                              <div className="text-slate-800 line-clamp-2">
                                {data.ingredientsList || 'គ្រាប់ស្វាយចន្ទីកម្ពុជា...'}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                ជំហាន ៩ & ១២៖ កាលបរិច្ឆេទ & អាយុកាល
                              </span>
                              <div className="text-slate-900 font-bold">
                                MFD: {data.mfdDate || '---'} • EXP: {data.expDate || '---'}
                              </div>
                              <div className="text-[11px] text-slate-600">
                                អាយុកាល៖ {data.shelfLifeMonths || 6} ខែ • {data.storageInstructions?.slice(0, 35)}...
                              </div>
                            </div>
                          </div>

                          {/* Dedicated Product Saved Confirmation Banner */}
                          {dedicatedProductSavedNotice && (
                            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-emerald-950 font-bold text-xs flex items-center gap-2.5 shadow-xs animate-fade-in">
                              <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
                              <div className="space-y-0.5 min-w-0">
                                <div className="text-emerald-900 font-black">
                                  {dedicatedProductSavedNotice}
                                </div>
                                {dedicatedProductSavedTime && (
                                  <div className="text-[11px] text-emerald-800 font-mono font-normal">
                                    🕒 ពេលវេលាធ្វើសមកាលកម្ម៖ {dedicatedProductSavedTime} • ឡូតិ៍៖ {data.lotNumber || activeDedicatedProduct.batch} (ទិន្នន័យ ១៣ ជំហានមានសុពលភាពលើ QR Code & Cloud រួចរាល់)
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Save & Sync Buttons */}
                          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                            {onSaveDedicatedProductUpdate && (
                              <button
                                type="button"
                                disabled={isSavingDedicatedProduct}
                                onClick={handleDedicatedSaveClick}
                                className={`w-full sm:flex-1 py-3.5 px-4 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                                  dedicatedProductSavedNotice && !isSavingDedicatedProduct
                                    ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white'
                                    : 'bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:to-emerald-800 text-white'
                                } ${isSavingDedicatedProduct ? 'opacity-80 cursor-wait' : ''}`}
                              >
                                {isSavingDedicatedProduct ? (
                                  <>
                                    <Loader2 size={18} className="animate-spin text-amber-300" />
                                    <span>កំពុងរក្សាទុក & ធ្វើសមកាលកម្មទិន្នន័យទាំង ១៣ ជំហាន...</span>
                                  </>
                                ) : dedicatedProductSavedNotice ? (
                                  <>
                                    <CheckCircle2 size={18} className="text-emerald-300 animate-pulse" />
                                    <span>✓ បានរក្សាទុក & ធ្វើសមកាលកម្មរួចរាល់ (ចុចដើម្បីរក្សាទុកម្ដងទៀត)</span>
                                  </>
                                ) : (
                                  <>
                                    <Save size={18} className="text-amber-300" />
                                    <span>💾 រក្សាទុក & ធ្វើសមកាលកម្មទិន្នន័យទាំង ១៣ ជំហានលើ QR Code និង Cloud</span>
                                  </>
                                )}
                              </button>
                            )}

                            {onReturnToQuickQrs && (
                              <button
                                type="button"
                                onClick={onReturnToQuickQrs}
                                className="w-full sm:w-auto py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-amber-300 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <span>⬆️ ត្រឡប់ទៅប្រអប់ QR Code ទាំង ១០ វិញ</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Digital QR Passport Verification Card */}
                      <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-300 shadow-2xs flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-14 bg-white p-1 rounded-xl border border-emerald-400 shrink-0 flex items-center justify-center">
                            {qrDataUrl ? (
                              <img src={qrDataUrl} alt="Traceability QR" className="w-full h-full object-contain rounded" />
                            ) : (
                              <QrCode className="w-8 h-8 text-emerald-700" />
                            )}
                          </div>
                          <div className="min-w-0 text-xs font-sans">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
                              <span>📦 {data.productNameKhmer || data.productNameEnglish || 'Mayany Product'}</span>
                              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                {data.netWeight || '50g'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate pt-0.5">
                              {isKhmer 
                                ? '✓ QR Code ភ្ជាប់ទៅនឹងឈ្មោះផលិតផល & ទម្ងន់សុទ្ធនេះជាអចិន្ត្រៃយ៍' 
                                : '✓ QR permanently tied to this product name & weight'}
                            </p>
                            {data.selectedSuppliers && data.selectedSuppliers.length > 0 && (
                              <div className="pt-1 flex flex-wrap gap-1">
                                {data.selectedSuppliers.map(s => (
                                  <span key={s} className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                    🌾 {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {passportFullUrl && (
                          <a
                            href={passportFullUrl}
                            onClick={(e) => {
                              if (typeof window !== 'undefined' && window.location.hostname.includes('run.app')) {
                                e.preventDefault();
                                const searchStr = passportFullUrl.split('?')[1] || '';
                                window.location.href = `/?${searchStr}`;
                              }
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs shrink-0 flex items-center gap-1 transition"
                          >
                            <ExternalLink size={12} />
                            <span>{isKhmer ? 'សាកល្បងស្កេន' : 'Test Scan'}</span>
                          </a>
                        )}
                      </div>

                      {/* Main Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          id="wizard-print-label-btn"
                          onClick={onPrint}
                          className="py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:to-emerald-800 text-white font-black text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Printer className="w-5 h-5" />
                          <span>{isKhmer ? 'បោះពុម្ពស្លាកឥឡូវនេះ' : 'Print Label Now'}</span>
                        </button>

                        <button
                          type="button"
                          id="wizard-download-label-btn"
                          onClick={onDownload}
                          disabled={isDownloading}
                          className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce text-amber-300' : ''}`} />
                          <span>{isDownloading ? (isKhmer ? 'កំពុងទាញយក...' : 'Downloading...') : (isKhmer ? 'ទាញយករូបភាពស្លាក' : 'Download Image')}</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
                        {onOpenCertificate && (
                          <button
                            type="button"
                            onClick={onOpenCertificate}
                            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Award className="w-4 h-4 text-amber-300" />
                            <span>{isKhmer ? 'វិញ្ញាបនបត្របច្ចេកទេស' : 'Export Technical Certificate (Multi-Lang)'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleSaveCatalogClick}
                          className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                            justSavedToCatalog
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {justSavedToCatalog ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>{isKhmer ? '✓ បានរក្សាទុករួចរាល់!' : '✓ Saved to Catalog!'}</span>
                            </>
                          ) : (
                            <>
                              <Package className="w-3.5 h-3.5 text-amber-700" />
                              <span>{isKhmer ? 'រក្សាទុកផលិតផលនេះក្នុងកាតាឡុក' : 'Save to My Catalog'}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={onResetNewProduct}
                          className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isKhmer ? 'រចនាផលិតផលថ្មីមួយទៀត' : 'Create Another Product'}</span>
                        </button>
                      </div>

                      {/* Prominent Save Confirmation Alert Banner */}
                      {justSavedToCatalog && (
                        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center justify-between text-xs text-emerald-950 font-bold shadow-sm animate-fade-in">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-black text-emerald-950 text-xs sm:text-sm">
                                {isKhmer ? '✓ បានរក្សាទុកក្នុងកាតាឡុកសហគ្រាសជោគជ័យ!' : '✓ Successfully Saved to My Catalog!'}
                              </p>
                              <p className="text-[11px] font-normal text-emerald-800">
                                {isKhmer 
                                  ? `មុខទំនិញ "${data.productNameKhmer || data.productNameEnglish}" ត្រូវបានរក្សាទុកយ៉ាងមានសុវត្ថិភាព។` 
                                  : `Product "${data.productNameEnglish || data.productNameKhmer}" has been safely saved.`}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full font-mono font-bold shrink-0">
                            LOT: {data.lotNumber || 'SAVED'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Step Navigation Controls */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStep === 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100 bg-white'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ថយក្រោយ' : 'Back'}</span>
              </button>

              {/* Center Bypass / Skip Button */}
              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={handleBypass}
                  className="px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-500 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  {isKhmer ? 'រំលង' : 'Bypass / Skip'}
                </button>
              )}

              {/* Next or Finish Button */}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  id="wizard-next-btn"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>{isKhmer ? 'បន្ទាប់' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  id="wizard-print-final-step-btn"
                  onClick={onPrint}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isKhmer ? 'បោះពុម្ពស្លាក' : 'Print'}</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Real-Time Interactive Live Preview */}
        <div className={`xl:col-span-6 2xl:col-span-5 print:!block print:!w-full print:!m-0 print:!p-0 print:!static ${showMobilePreview ? 'block' : 'hidden xl:block'}`}>
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-md sticky top-24 print:!p-0 print:!border-none print:!shadow-none print:!static print:!w-full print:!m-0 print:!bg-transparent">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 no-print">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider font-sans">
                  {isKhmer ? 'រូបរាងស្លាកផ្សាយផ្ទាល់' : 'Live Label Preview'}
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                {isKhmer ? 'ធ្វើបច្ចុប្បន្នភាពស្វ័យប្រវត្តិ' : 'Auto-Updating'}
              </span>
            </div>

            {/* Injected Live Preview Node */}
            <div className="max-h-[620px] overflow-y-auto no-scrollbar rounded-2xl bg-slate-50/50 p-2 border border-slate-100 print:!max-h-none print:!overflow-visible print:!p-0 print:!border-none print:!bg-transparent print:!w-full">
              {renderLivePreviewNode}
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3 font-sans no-print">
              {isKhmer ? 'ស្លាកនេះនឹងត្រូវបោះពុម្ពចេញតាមខ្នាតស្តង់ដារ CS 001' : 'Standard CS 001 compliant label preview'}
            </p>
          </div>
        </div>

      </div>

      {/* Enterprise Saved Product Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fade-in no-print">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-2 border-amber-300">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-between gap-3 border-b border-amber-300">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-xl shadow-xs">
                  📂
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black font-sans">
                      {isKhmer ? 'កាតាឡុកផលិតផលសហគ្រាស' : 'Enterprise Product Catalog'}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-950 text-white font-mono font-bold">
                      {displayCatalogList.length} {isKhmer ? 'មុខទំនិញ' : 'Items'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-900/80 font-sans mt-0.5">
                    {isKhmer 
                      ? 'ផលិតផលដែលអ្នកបានរក្សាទុក (ឈ្មោះខ្មែរ ទម្ងន់ គ្រឿងផ្សំ អាយុកាល និងបាកូដ) — ចុច «យកមកប្រើ» ដើម្បីផ្ទុកភ្លាមៗ' 
                      : 'Saved enterprise products (Khmer name, weight, ingredients, shelf life & barcode) — Click to load'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search & Actions Bar */}
            <div className="p-4 bg-amber-50/60 border-b border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={catalogSearchTerm}
                  onChange={(e) => setCatalogSearchTerm(e.target.value)}
                  placeholder={isKhmer ? 'ស្វែងរកតាមឈ្មោះផលិតផល ឬទម្ងន់...' : 'Search by product name or weight...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-amber-300 focus:border-amber-500 outline-hidden text-xs text-slate-800 font-sans"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.removeItem('cashewtrace_sme_custom_catalog');
                      setLocalCatalog([]);
                      if (onSaveToCatalog) onSaveToCatalog();
                    } catch {
                      // ignore
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-300"
                  title="សម្អាតកាតាឡុកចាស់ និងកំណត់មក ៤ មុខផ្លូវការ"
                >
                  <RefreshCw size={13} />
                  <span>{isKhmer ? 'កំណត់មក ៤ មុខផ្លូវការ' : 'Reset to 4 Official'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCatalogClick}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{justSavedToCatalog ? '✓ បានរក្សាទុក!' : (isKhmer ? '+ រក្សាទុកផលិតផលបច្ចុប្បន្នចូលកាតាឡុក' : '+ Save Current to Catalog')}</span>
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 max-h-[60vh]">
              {(() => {
                const filtered = displayCatalogList.filter(p => {
                  if (!catalogSearchTerm.trim()) return true;
                  const term = catalogSearchTerm.toLowerCase();
                  return (
                    (p.nameKhmerDefault && p.nameKhmerDefault.toLowerCase().includes(term)) ||
                    (p.nameEnglishDefault && p.nameEnglishDefault.toLowerCase().includes(term)) ||
                    (p.defaultNetWeight && p.defaultNetWeight.toLowerCase().includes(term)) ||
                    (p.ean13Default && p.ean13Default.includes(term))
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-500 font-sans space-y-2">
                      <p className="text-sm font-bold">{isKhmer ? 'មិនមានផលិតផលត្រូវនឹងពាក្យស្វែងរកឡើយ' : 'No products match search'}</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filtered.map((preset, idx) => {
                      const isCustomSaved = effectiveCatalog.some(c => c.id === preset.id);
                      const isSelected = data.productNameKhmer && preset.nameKhmerDefault && (
                        data.productNameKhmer.trim() === preset.nameKhmerDefault.trim()
                      );

                      return (
                        <div
                          key={preset.id || `modal-cat-${idx}`}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-300'
                              : 'bg-white hover:bg-amber-50/40 border-slate-200/90 hover:border-amber-300 shadow-2xs'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-sans ${
                                isCustomSaved ? 'bg-amber-200 text-amber-950 border border-amber-300' : 'bg-emerald-100 text-emerald-950'
                              }`}>
                                {isCustomSaved ? '★ កាតាឡុកផ្ទាល់ខ្លួន' : '★ ស្តង់ដារ CS 001'}
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                {preset.defaultNetWeight || '50g'}
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-base font-black font-sans text-slate-950 leading-snug">
                              {preset.nameKhmerDefault.split('(')[0].trim()}
                            </h4>

                            {preset.nameEnglishDefault && (
                              <p className="text-xs text-slate-600 font-medium italic">
                                {preset.nameEnglishDefault}
                              </p>
                            )}

                            <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                              <strong className="text-slate-700">{isKhmer ? 'គ្រឿងផ្សំ៖ ' : 'Ingredients: '}</strong>
                              {cleanIngredientsToKhmerOnly(preset.defaultIngredients)}
                            </div>

                            {/* Barcode and Shelf Life */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Barcode size={12} />
                                <span>{preset.ean13Default || '8842120005093'}</span>
                              </span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                ⏳ {isKhmer ? `អាយុកាល៖ ${preset.shelfLifeMonths || 6} ខែ` : `Shelf Life: ${preset.shelfLifeMonths || 6} Mos`}
                              </span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            {isCustomSaved && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustomProduct(preset.id, e)}
                                className="text-[11px] text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 size={12} />
                                <span>{isKhmer ? 'លុប' : 'Delete'}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                handleSelectCatalogProduct(preset);
                                setShowCatalogModal(false);
                              }}
                              className={`ml-auto px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xs'
                              }`}
                            >
                              <Check size={14} />
                              <span>{isSelected ? (isKhmer ? '✓ កំពុងប្រើលើស្លាក' : '✓ Active') : (isKhmer ? 'យកមកប្រើលើស្លាក' : 'Apply to Label')}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
              >
                {isKhmer ? 'បិទ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Directory & Sourcing Management Modal */}
      {showSuppliersModal && (
        <SuppliersDirectoryModal
          isOpen={showSuppliersModal}
          onClose={() => setShowSuppliersModal(false)}
          onSelectSupplier={(supplierText) => {
            const currentSuppliers = data.selectedSuppliers || [];
            if (!currentSuppliers.includes(supplierText)) {
              const nextSuppliers = [...currentSuppliers, supplierText];
              onChange({ selectedSuppliers: nextSuppliers });
              setAddedSuccessToast(isKhmer ? `✓ បានបន្ថែមអ្នកផ្គត់ផ្គង់៖ ${supplierText}` : `✓ Added supplier: ${supplierText}`);
              setTimeout(() => setAddedSuccessToast(null), 3500);
            }
          }}
          isKhmer={isKhmer}
        />
      )}
    </div>
  );
}
