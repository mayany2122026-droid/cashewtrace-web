import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, Download, QrCode, Sparkles, CheckCircle2, Copy, Check, Eye, 
  Tag, Package, ShieldCheck, Flame, Info, ExternalLink, RefreshCw, Upload,
  Layers, ChevronRight, Sliders, Scissors, Award, AlertCircle, FileText,
  Smartphone, Share2, ZoomIn, CheckSquare, Plus, Trash2, Edit3, Settings2, Percent, ListPlus, Building2
} from 'lucide-react';
import QRCode from 'qrcode';
import { MayanyRoyalGoldSeal } from './MayanyRoyalGoldSeal';
import { CashewNutIcon } from './CashewTraceLogo';
import { CAMBODIA_CERTIFICATION_STANDARDS } from '../data/labelAddressPresets';
import VoiceStoryRecorder from './VoiceStoryRecorder';

export interface CustomFlavorItem {
  id: string;
  nameKh: string;
  nameEnLine1: string;
  nameEnLine2: string;
  flavorTagKh: string;
  flavorTagEn: string;
  textColorLine2: string;
  spiceColor: string;
  kernelGlazeColor: string;
  pepperSpecks: boolean;
  chiliFlakes: boolean;
  sugarGlaze: boolean;
  // Customizable percentages & spices
  cashewPercent: number; // e.g. 90%
  spiceNameKh: string;   // e.g. ម្រេចកំពត GI, ម្ទេសធម្មជាតិ (ស្រាល), ម្ទេសហឹរខ្លាំង, ស្ករត្នោត
  spiceNameEn: string;   // e.g. GI Kampot Pepper, Light Chili, Hot Chili, Pure Sugar
  spicePercent: number;  // e.g. 2% or 5%
  sugarPercent: number;  // e.g. 3% or 0%
  saltPercent: number;   // e.g. 2%
  otherSeasoning: string; // e.g. ខ្ទឹមស (4%), ល្ងស (2%)
  defaultBatchLot: string;
  bagCountTarget: number;
}

export const USER_INITIAL_FLAVOR_PRESETS: CustomFlavorItem[] = [
  {
    id: 'flavor-pepper',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេច (Coated Pepper 5%)',
    nameEnLine1: 'Cashew Kernel',
    nameEnLine2: 'Coated Pepper',
    flavorTagKh: 'ម្រេច 5%',
    flavorTagEn: '5% Pepper Coated',
    textColorLine2: '#8b1e1b', // Deep rich red/burgundy
    spiceColor: '#2b2319',
    kernelGlazeColor: '#c99a61',
    pepperSpecks: true,
    chiliFlakes: false,
    sugarGlaze: false,
    cashewPercent: 90,
    spiceNameKh: 'ម្រេចកំពត GI / ម្រេចខ្មៅ',
    spiceNameEn: 'Kampot Pepper',
    spicePercent: 5,
    sugarPercent: 3,
    saltPercent: 2,
    otherSeasoning: '',
    defaultBatchLot: '2026-ckp-261',
    bagCountTarget: 100
  },
  {
    id: 'flavor-sugar',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (Coated Sugar)',
    nameEnLine1: 'Cashew Kernel',
    nameEnLine2: 'Coated sugar',
    flavorTagKh: 'ស្រោបស្ករស (Sugar)',
    flavorTagEn: 'Coated Sugar',
    textColorLine2: '#92400e', // Warm amber brown
    spiceColor: '#8a4b12',
    kernelGlazeColor: '#e0a96d',
    pepperSpecks: false,
    chiliFlakes: false,
    sugarGlaze: true,
    cashewPercent: 88,
    spiceNameKh: 'ស្ករសធម្មជាតិ (Granulated Sugar)',
    spiceNameEn: 'Granulated Sugar',
    spicePercent: 8,
    sugarPercent: 0,
    saltPercent: 2,
    otherSeasoning: 'ល្ងស (2%)',
    defaultBatchLot: '2026-cks-261',
    bagCountTarget: 100
  },
  {
    id: 'flavor-light-chili',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរស្រាល (Coated Light Chili 2%)',
    nameEnLine1: 'Cashew Kernel',
    nameEnLine2: 'Coated light Chili',
    flavorTagKh: 'ម្ទេសស្រាល 2% Chili',
    flavorTagEn: 'Coated Light Chili (2%)',
    textColorLine2: '#c2410c', // Bright pleasant orange-red
    spiceColor: '#ea580c',
    kernelGlazeColor: '#f97316',
    pepperSpecks: false,
    chiliFlakes: true,
    sugarGlaze: false,
    cashewPercent: 92,
    spiceNameKh: 'ម្ទេសធម្មជាតិ (កម្រិតហឹរស្រាល)',
    spiceNameEn: 'Light Natural Chili (2%)',
    spicePercent: 2,
    sugarPercent: 4,
    saltPercent: 2,
    otherSeasoning: '',
    defaultBatchLot: '2026-ckc-261',
    bagCountTarget: 100
  },
  {
    id: 'flavor-hot-chili',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរខ្លាំង (Coated Hot Chili 5%)',
    nameEnLine1: 'Cashew Kernel',
    nameEnLine2: 'Coated hot Chili',
    flavorTagKh: 'ម្ទេសហឹរខ្លាំង 5% Chili',
    flavorTagEn: 'Coated Hot Chili (5%)',
    textColorLine2: '#b91c1c', // Fiery deep red
    spiceColor: '#991b1b',
    kernelGlazeColor: '#dc2626',
    pepperSpecks: false,
    chiliFlakes: true,
    sugarGlaze: false,
    cashewPercent: 89,
    spiceNameKh: 'ម្ទេសអាចម៍សត្វស្រស់ (កម្រិតហឹរខ្លាំង)',
    spiceNameEn: 'Hot Bird Chili (5%)',
    spicePercent: 5,
    sugarPercent: 3,
    saltPercent: 3,
    otherSeasoning: '',
    defaultBatchLot: '2026-ckc-261',
    bagCountTarget: 100
  }
];

export const THREE_FLAVOR_PRESETS = USER_INITIAL_FLAVOR_PRESETS;
export type FlavorPackPreset = CustomFlavorItem;

interface WindowPouchMiniLabelDesignerProps {
  currentBrandLogo?: string;
  trademarkLogoText?: string;
  companyName?: string;
  companyAddress?: string;
  currentLotNumber?: string;
  onSelectFlavor?: (flavor: CustomFlavorItem) => void;
}

export default function WindowPouchMiniLabelDesigner({
  currentBrandLogo = '/mayany_official_logo.jpg',
  trademarkLogoText = 'Mayany ENTERPRISE',
  companyName = 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
  companyAddress = 'ភូមិ១ សង្កាត់៤ ក្រុងព្រះសីហនុ ខេត្តព្រះសីហនុ',
  currentLotNumber = 'KH-PEP-50G-001',
  onSelectFlavor
}: WindowPouchMiniLabelDesignerProps) {
  // Product List state (defaults to user's 4 exact products + fully editable)
  const [flavorList, setFlavorList] = useState<CustomFlavorItem[]>(() => {
    const saved = localStorage.getItem('mayany_50g_custom_flavors_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing saved 50g flavors:', e);
      }
    }
    return USER_INITIAL_FLAVOR_PRESETS;
  });

  const [selectedFlavorId, setSelectedFlavorId] = useState<string>('flavor-pepper');
  const activeFlavor = flavorList.find(f => f.id === selectedFlavorId) || flavorList[0] || USER_INITIAL_FLAVOR_PRESETS[0];

  // 3-Color 50g Bag Selector (Black, Brown Kraft, White)
  const [bagColorMode, setBagColorMode] = useState<'black-matte' | 'brown-kraft' | 'white-matte'>('black-matte');
  const [labelThemeMode, setLabelThemeMode] = useState<'unified-gold-white' | 'bag-contrast'>('unified-gold-white');
  const [showDimensionGuides, setShowDimensionGuides] = useState<boolean>(true);

  // Customizable inputs for active flavor
  const [line1Text, setLine1Text] = useState<string>(activeFlavor.nameEnLine1 || 'Cashew Kernel');
  const [line2Text, setLine2Text] = useState<string>(activeFlavor.nameEnLine2 || 'Coated Pepper');
  const [customNameKhmer, setCustomNameKhmer] = useState<string>(activeFlavor.nameKh || '');
  const [showKhmerSubtext, setShowKhmerSubtext] = useState<boolean>(false);
  const [netWeightDisplay, setNetWeightDisplay] = useState<string>('50g');
  const [lotCode, setLotCode] = useState<string>(activeFlavor.defaultBatchLot || currentLotNumber);

  // Ingredients & Percentage fields
  const [cashewPct, setCashewPct] = useState<number>(activeFlavor.cashewPercent || 90);
  const [spiceNameInput, setSpiceNameInput] = useState<string>(activeFlavor.spiceNameKh || 'ម្រេច 5%');
  const [spicePct, setSpicePct] = useState<number>(activeFlavor.spicePercent || 5);
  const [sugarPct, setSugarPct] = useState<number>(activeFlavor.sugarPercent || 3);
  const [saltPct, setSaltPct] = useState<number>(activeFlavor.saltPercent || 2);
  const [otherSeasoningInput, setOtherSeasoningInput] = useState<string>(activeFlavor.otherSeasoning || '');

  // Brand Logo State & Direct Upload in Pouch Designer
  const [activeBrandLogo, setActiveBrandLogo] = useState<string>(() => {
    return localStorage.getItem('cashewtrace_sme_brand_logo') || currentBrandLogo || '/mayany_official_logo.jpg';
  });
  const pouchLogoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentBrandLogo && currentBrandLogo !== activeBrandLogo) {
      setActiveBrandLogo(currentBrandLogo);
    }
  }, [currentBrandLogo]);

  const handlePouchLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setActiveBrandLogo(result);
        localStorage.setItem('cashewtrace_sme_brand_logo', result);
        setBrandSealStyle('custom-uploaded');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPouchLogo = () => {
    setActiveBrandLogo('/mayany_official_logo.jpg');
    localStorage.setItem('cashewtrace_sme_brand_logo', '/mayany_official_logo.jpg');
  };

  // Dynamic QR Code generation state
  const [qrTargetUrl, setQrTargetUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrEncodingMode, setQrEncodingMode] = useState<'url-passport' | 'full-text-dossier'>('url-passport');
  
  // Design customization (Default to official enterprise logo so user logo appears immediately)
  const [brandSealStyle, setBrandSealStyle] = useState<'royal-gold-seal' | 'custom-uploaded'>('custom-uploaded');
  
  // Bottom Sticker Dimension (Within the 70mm × 30mm Bag Bottom Area)
  // Default to 40mm × 20mm for comfortable 15mm side margins & 5mm top/bottom margins (easy manual application)
  const [bottomStickerSizePreset, setBottomStickerSizePreset] = useState<'40x20' | '45x22' | '50x25' | 'custom'>('40x20');
  const [bottomStickerWidthMm, setBottomStickerWidthMm] = useState<number>(40);
  const [bottomStickerHeightMm, setBottomStickerHeightMm] = useState<number>(20);

  const [printSheetType, setPrintSheetType] = useState<'bottom-qr-40x20-50up' | 'bottom-qr-35up' | 'top-seal-title-24up' | 'paired-combo-20up' | 'all-user-flavors-mix-35up'>('bottom-qr-40x20-50up');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);
  const [showAddFlavorModal, setShowAddFlavorModal] = useState<boolean>(false);

  // Save changes to localStorage
  const saveFlavors = (newList: CustomFlavorItem[]) => {
    setFlavorList(newList);
    localStorage.setItem('mayany_50g_custom_flavors_v2', JSON.stringify(newList));
  };

  // Helper to build human-readable ingredient list with exact percentages
  const buildCurrentIngredients = (
    cPct: number = cashewPct,
    sName: string = spiceNameInput,
    sPct: number = spicePct,
    sugPct: number = sugarPct,
    sltPct: number = saltPct,
    other: string = otherSeasoningInput
  ) => {
    const parts = [
      `គ្រាប់ស្វាយចន្ទី (Cashews ${cPct}%)`,
      sPct > 0 && sName ? `${sName} (${sPct}%)` : null,
      sugPct > 0 ? `ស្ករត្នោត/ស្ករស (${sugPct}%)` : null,
      sltPct > 0 ? `អំបិល (${sltPct}%)` : null,
      other ? other : null
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Build optimized, low-density QR payload pointing directly to Certificate & Passport
  const buildQrDataContent = () => {
    if (typeof window === 'undefined') return 'https://cashewtrace.app/?project=passport';
    
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const cleanLot = (lotCode || 'KH-PEP-50G-001').trim();
    const batchParam = encodeURIComponent(cleanLot);
    const prodParam = encodeURIComponent(line1Text || 'Cashew Kernel');
    const wtParam = encodeURIComponent(netWeightDisplay || '50g');

    // Determine compact flavor code
    let flvCode = 'pepper';
    const l2 = (line2Text || '').toLowerCase();
    if (l2.includes('sugar') || cleanLot.includes('SUG')) flvCode = 'sugar';
    else if (l2.includes('chili') || cleanLot.includes('CHL')) flvCode = 'chili';
    else if (l2.includes('roasted') || l2.includes('salt')) flvCode = 'roasted';
    else if (l2.includes('honey')) flvCode = 'honey';
    else if (l2.includes('tom yum')) flvCode = 'tom-yum';

    // Cache passport snapshot locally so full custom data renders on passport view
    try {
      const snapshot = {
        batch: cleanLot,
        product: line1Text || 'Cashew Kernel',
        flavor: line2Text || 'Coated Pepper',
        nameKh: customNameKhmer || activeFlavor.nameKh,
        spice: spiceNameInput || 'Pepper',
        spicePct: spicePct || 5,
        cashewPct: cashewPct || 90,
        sugarPct: sugarPct || 3,
        saltPct: saltPct || 2,
        weight: netWeightDisplay || '50g',
        company: companyName || 'Mayany Enterprise',
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(`cashewtrace_passport_${cleanLot}`, JSON.stringify(snapshot));
      localStorage.setItem('cashewtrace_latest_passport', JSON.stringify(snapshot));
    } catch (e) {
      console.warn('Could not cache 50g passport:', e);
    }

    if (qrEncodingMode === 'url-passport') {
      // Short, high-performance URL (under 120 characters) ensures Version 5 QR Code with large, ultra-scannable squares
      return `${origin}${pathname}?project=passport&mode=passport&batch=${batchParam}&flv=${flvCode}&wt=${wtParam}&p=${prodParam}`;
    } else {
      // Standalone text dossier
      return `MAYANY ENTERPRISE (សហគ្រាស ម៉ាយ៉ានី)
----------------------------------------
PRODUCT: ${line1Text} ${line2Text} (${netWeightDisplay})
KHMER: ${customNameKhmer || 'គ្រាប់ស្វាយចន្ទីស្រោបគ្រឿងទេស'}
LOT: ${lotCode}
CERTIFICATIONS: CS 001:2008 • GHP • GMP
VERIFIED AT: ${origin}${pathname}?project=passport&batch=${batchParam}`;
    }
  };

  // Update QR target URL dynamically when any data field changes
  useEffect(() => {
    const content = buildQrDataContent();
    setQrTargetUrl(content);
  }, [lotCode, line1Text, line2Text, customNameKhmer, netWeightDisplay, cashewPct, spiceNameInput, spicePct, sugarPct, saltPct, otherSeasoningInput, companyName, companyAddress, qrEncodingMode]);

  // Generate high-density, easily scannable QR Code (Width 500 for razor-sharp clarity)
  useEffect(() => {
    const generateQr = async () => {
      try {
        const content = qrTargetUrl || 'https://cashewtrace.app';
        const url = await QRCode.toDataURL(content, {
          errorCorrectionLevel: 'M', // Medium error correction ensures fast readability on all phones
          margin: 1,
          width: 500,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('QR generation error:', err);
      }
    };
    generateQr();
  }, [qrTargetUrl]);

  // Sync state when active flavor switches
  const handleFlavorChange = (flavorId: string) => {
    setSelectedFlavorId(flavorId);
    const found = flavorList.find(f => f.id === flavorId);
    if (found) {
      setLine1Text(found.nameEnLine1);
      setLine2Text(found.nameEnLine2);
      setCustomNameKhmer(found.nameKh);
      setLotCode(found.defaultBatchLot);
      setCashewPct(found.cashewPercent);
      setSpiceNameInput(found.spiceNameKh);
      setSpicePct(found.spicePercent);
      setSugarPct(found.sugarPercent);
      setSaltPct(found.saltPercent);
      setOtherSeasoningInput(found.otherSeasoning || '');
      
      // Auto-pair recommended bag color based on flavor profile
      if (flavorId === 'flavor-pepper') {
        setBagColorMode('black-matte');
      } else if (flavorId === 'flavor-sugar') {
        setBagColorMode('brown-kraft');
      } else if (flavorId.includes('chili')) {
        setBagColorMode('white-matte');
      }

      if (onSelectFlavor) {
        onSelectFlavor(found);
      }
    }
  };

  // Update current flavor in active state & flavorList
  const handleUpdateCurrentFlavor = (updates: Partial<CustomFlavorItem>) => {
    const updatedList = flavorList.map(item => {
      if (item.id === selectedFlavorId) {
        return { ...item, ...updates };
      }
      return item;
    });
    saveFlavors(updatedList);
  };

  // Add a new custom flavor
  const handleAddNewFlavor = (newName: string, newSpicePct: number) => {
    const newId = `flavor-custom-${Date.now()}`;
    const newFlavor: CustomFlavorItem = {
      id: newId,
      nameKh: `គ្រាប់ស្វាយចន្ទីស្រោប ${newName}`,
      nameEnLine1: 'Cashew Kernel',
      nameEnLine2: newName,
      flavorTagKh: `${newName} ${newSpicePct}%`,
      flavorTagEn: `${newSpicePct}% ${newName}`,
      textColorLine2: '#b91c1c',
      spiceColor: '#8a4b12',
      kernelGlazeColor: '#d67d4b',
      pepperSpecks: newName.toLowerCase().includes('pepper'),
      chiliFlakes: newName.toLowerCase().includes('chili'),
      sugarGlaze: newName.toLowerCase().includes('sugar'),
      cashewPercent: 100 - newSpicePct - 5,
      spiceNameKh: newName,
      spiceNameEn: newName,
      spicePercent: newSpicePct,
      sugarPercent: 3,
      saltPercent: 2,
      otherSeasoning: '',
      defaultBatchLot: `KH-CT-${Date.now().toString().slice(-4)}`,
      bagCountTarget: 100
    };

    const updatedList = [...flavorList, newFlavor];
    saveFlavors(updatedList);
    setSelectedFlavorId(newId);
    handleFlavorChange(newId);
    setShowAddFlavorModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyQrLink = () => {
    navigator.clipboard.writeText(qrTargetUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* Top Banner Explaining the 2-Sticker 50g Window Pouch System */}
      <div className="bg-gradient-to-r from-[#2c1d11] via-[#1c1917] to-[#2c1d11] text-white p-5 rounded-2xl border-2 border-amber-500/60 shadow-xl no-print space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono shadow-xs">
                2-Sticker System • 50g Standing Pouch
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                100% User Editable • Guaranteed Scannable QR
              </span>
            </div>
            <h2 className="text-base font-black text-amber-300 flex items-center gap-2 font-serif">
              <span>រចនាសម្ព័ន្ធស្ទីកឃ័រ ២ ផ្ទាំង (Top 20mm Brand Logo + Bottom 40mm × 20mm លើផ្ទៃ 70mm × 30mm)</span>
            </h2>
            <p className="text-stone-300 text-xs leading-relaxed max-w-3xl font-sans">
              <strong>ស្ទីកឃ័រទី ១ (Top):</strong> ម៉ាកសញ្ញា <strong>Mayany Enterprise</strong> ទំហំ <strong>20mm គ្មានស៊ុម (Borderless)</strong> បិទផ្នែកខាងលើកញ្ចប់បាតឈរ។ <br />
              <strong>ស្ទីកឃ័រទី ២ (Bottom - 40mm × 20mm):</strong> ផ្ទៃទំនេរផ្នែកខាងក្រោមមានទំហំ <strong>70mm × 30mm</strong> ដូច្នេះស្ទីកឃ័រទំហំ <strong>40mm × 20mm</strong> (សល់គែម 15mm សងខាង & 5mm លើក្រោម) គឺ <strong>ងាយស្រួលបកបិទបំផុត</strong> ស័ក្តិសមទាំងកញ្ចប់អាលុយមីញ៉ូម និងក្រដាសក្រាហ្វ!
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-black px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg cursor-pointer text-xs"
            >
              <Printer size={16} />
              <span>ព្រីនសន្លឹកស្ទីកឃ័រ A4 ({printSheetType === 'bottom-qr-40x20-50up' ? '50 QR Stickers (40×20mm)' : printSheetType === 'top-seal-title-24up' ? '24 Top Seals' : 'Print Sticker Sheet'})</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPassportModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 text-[11px] shadow-sm cursor-pointer"
            >
              <Smartphone size={13} />
              <span>តេស្តស្កេន QR (Test Scan Scannability)</span>
            </button>
          </div>
        </div>

        {/* User's Exact Flavors Bar (Pepper, Sugar, Light Chili, Hot Chili + Custom Add) */}
        <div className="pt-2.5 border-t border-amber-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Sparkles size={13} />
              <span>ជ្រើសរើសមុខទំនិញជាក់ស្តែងរបស់សហគ្រាស (Your Products):</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-stone-400">
                Total Products: <strong>{flavorList.length}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowAddFlavorModal(true)}
                className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 px-2 py-0.5 rounded text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>បន្ថែមមុខទំនិញថ្មី</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {flavorList.map((flavor, pIdx) => {
              const isSelected = flavor.id === selectedFlavorId;
              return (
                <button
                  key={flavor.id}
                  type="button"
                  onClick={() => handleFlavorChange(flavor.id)}
                  className={`p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-300 shadow-md ring-2 ring-amber-400/50 scale-[1.02]' 
                      : 'bg-stone-900/90 hover:bg-stone-800 text-white border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={isSelected ? 'text-stone-950 font-black' : 'text-amber-400'}>
                      #{pIdx + 1} • {flavor.nameEnLine2}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-stone-950 text-amber-300' : 'bg-stone-800 text-stone-300 border border-stone-700'
                    }`}>
                      {flavor.spicePercent > 0 ? `${flavor.spicePercent}% Spice` : 'Sweet'}
                    </span>
                  </div>

                  <div className="font-serif">
                    <h4 className="text-xs font-black leading-tight line-clamp-1">
                      {flavor.nameEnLine1} <span style={{ color: isSelected ? '#5c1d11' : flavor.textColorLine2 }}>{flavor.nameEnLine2}</span>
                    </h4>
                    <p className={`text-[10px] leading-tight line-clamp-1 mt-0.5 ${isSelected ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                      {flavor.nameKh}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-current/20 flex items-center justify-between text-[9px] font-mono">
                    <span className="font-bold">{flavor.flavorTagKh}</span>
                    <span>50g (17 គ្រាប់)</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* WORKSPACE: Left Controls & Right Realistic Kraft Window Pouch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Input Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-4 no-print">
          
          {/* Card 1: Top Brand Logo (Sticker 1 - Above Window) */}
          <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Tag size={15} className="text-amber-600" />
                <span>ស្ទីកឃ័រទី ១ (Top): Mayany Enterprise Brand Logo</span>
              </h3>
              <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Above Window
              </span>
            </div>

            {/* Logo Style Selection */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-bold text-stone-700">
                ទម្រង់ Logo ម៉ាកសញ្ញា (Brand Seal Style):
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setBrandSealStyle('custom-uploaded')}
                  className={`p-2 rounded-xl text-left border text-[10.5px] font-bold transition flex items-center gap-2 cursor-pointer ${
                    brandSealStyle === 'custom-uploaded'
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-2xs font-extrabold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Building2 size={14} className="shrink-0 text-amber-900" />
                  <span>Official Brand Logo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBrandSealStyle('royal-gold-seal')}
                  className={`p-2 rounded-xl text-left border text-[10.5px] font-bold transition flex items-center gap-2 cursor-pointer ${
                    brandSealStyle === 'royal-gold-seal'
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-2xs font-extrabold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Sparkles size={14} className="shrink-0 text-amber-900" />
                  <span>Royal Gold Emblem</span>
                </button>
              </div>

              {/* Direct Upload & Logo Live Preview */}
              <div className="p-3 bg-stone-50/90 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white p-1 border-2 border-amber-300 shadow-2xs flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={activeBrandLogo}
                      alt="Brand Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-stone-900 font-sans truncate">
                      Mayany Enterprise Logo
                    </p>
                    <p className="text-[9.5px] text-stone-500 font-sans truncate">
                      {activeBrandLogo === '/mayany_official_logo.jpg' ? 'រូបភាពផ្លូវការស្រេច' : 'រូបភាពបានផ្ទុកឡើង (Uploaded)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    ref={pouchLogoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePouchLogoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => pouchLogoInputRef.current?.click()}
                    className="text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    <Upload size={12} />
                    <span>ប្តូរ Logo</span>
                  </button>
                  {activeBrandLogo !== '/mayany_official_logo.jpg' && (
                    <button
                      type="button"
                      onClick={handleResetPouchLogo}
                      className="text-[10px] font-mono text-stone-600 hover:text-stone-950 px-1.5 py-1 rounded bg-stone-200/80 cursor-pointer"
                      title="Reset to official logo"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Bottom Sticker (Sticker 2 - Product Name + QR + 50g) */}
          <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <QrCode size={15} className="text-emerald-700" />
                <span>ស្ទីកឃ័រទី ២ (Bottom): Name + QR + MADE IN CAMBODIA + 50g</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Under Window (70×30mm space)
              </span>
            </div>

            {/* Sticker Size Selection (Inside 70mm × 30mm Space) */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-900 flex items-center gap-1">
                  <Tag size={12} className="text-amber-700" />
                  <span>ទំហំស្ទីកឃ័របិទបាតថង់ (Sticker Physical Size):</span>
                </label>
                <span className="text-[9.5px] font-mono text-amber-800 font-bold">
                  ផ្ទៃថង់: 70mm × 30mm
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setBottomStickerSizePreset('40x20');
                    setBottomStickerWidthMm(40);
                    setBottomStickerHeightMm(20);
                  }}
                  className={`p-2 rounded-lg text-center border transition cursor-pointer flex flex-col items-center justify-between ${
                    bottomStickerSizePreset === '40x20'
                      ? 'bg-amber-500 text-stone-950 font-black border-amber-400 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-[10.5px] font-mono font-bold">40mm × 20mm</span>
                  <span className="text-[8.5px] mt-0.5 leading-tight text-emerald-900 font-sans">
                    ★ ងាយបិទបំផុត (សល់គែម 15mm)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBottomStickerSizePreset('45x22');
                    setBottomStickerWidthMm(45);
                    setBottomStickerHeightMm(22);
                  }}
                  className={`p-2 rounded-lg text-center border transition cursor-pointer flex flex-col items-center justify-between ${
                    bottomStickerSizePreset === '45x22'
                      ? 'bg-amber-500 text-stone-950 font-black border-amber-400 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-[10.5px] font-mono font-bold">45mm × 22mm</span>
                  <span className="text-[8.5px] mt-0.5 leading-tight text-stone-600 font-sans">
                    ស្តង់ដារល្មម (សល់គែម 12.5mm)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBottomStickerSizePreset('50x25');
                    setBottomStickerWidthMm(50);
                    setBottomStickerHeightMm(25);
                  }}
                  className={`p-2 rounded-lg text-center border transition cursor-pointer flex flex-col items-center justify-between ${
                    bottomStickerSizePreset === '50x25'
                      ? 'bg-amber-500 text-stone-950 font-black border-amber-400 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-[10.5px] font-mono font-bold">50mm × 25mm</span>
                  <span className="text-[8.5px] mt-0.5 leading-tight text-stone-600 font-sans">
                    មធ្យម (សល់គែម 10mm)
                  </span>
                </button>
              </div>

              <div className="text-[9.5px] text-stone-600 bg-white/90 p-1.5 rounded-md border border-amber-200/60 font-sans flex items-center justify-between">
                <span>
                  ✓ បច្ចុប្បន្ន៖ <strong>{bottomStickerWidthMm}mm × {bottomStickerHeightMm}mm</strong> (សល់គែមសងខាង {((70 - bottomStickerWidthMm) / 2).toFixed(1)}mm, លើក្រោម {((30 - bottomStickerHeightMm) / 2).toFixed(1)}mm)
                </span>
                <span className="text-emerald-700 font-bold font-mono">100% Easy to Stick</span>
              </div>
            </div>

            {/* Product Name Top Line (User editable) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-800">
                  ឈ្មោះជួរទី ១ (Line 1):
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLine1Text('Cashew Kernel');
                      handleUpdateCurrentFlavor({ nameEnLine1: 'Cashew Kernel' });
                    }}
                    className="text-[9.5px] font-mono px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                  >
                    Cashew Kernel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLine1Text('Roasted Cashew');
                      handleUpdateCurrentFlavor({ nameEnLine1: 'Roasted Cashew' });
                    }}
                    className="text-[9.5px] font-mono px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                  >
                    Roasted Cashew
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={line1Text}
                onChange={(e) => {
                  setLine1Text(e.target.value);
                  handleUpdateCurrentFlavor({ nameEnLine1: e.target.value });
                }}
                placeholder="Cashew Kernel"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-serif text-stone-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Product Name Flavor Subtitle (User editable: Coated Pepper, Coated sugar, Coated light Chili, Coated hot Chili) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-800">
                  ឈ្មោះជួរទី ២ (Flavor Line 2 - Your Exact Name):
                </label>
                <span className="text-[10px] text-amber-700 font-mono">
                  {activeFlavor.spicePercent > 0 ? `Spice: ${activeFlavor.spicePercent}%` : ''}
                </span>
              </div>
              <input
                type="text"
                value={line2Text}
                onChange={(e) => {
                  setLine2Text(e.target.value);
                  handleUpdateCurrentFlavor({ nameEnLine2: e.target.value });
                }}
                placeholder="Coated Pepper / Coated sugar / Coated light Chili / Coated hot Chili"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-serif italic text-stone-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{ color: activeFlavor.textColorLine2 }}
              />

              {/* Quick User Names Presets */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[9px] text-stone-500 font-mono">Quick Set:</span>
                {[
                  { label: 'Coated Pepper', color: '#8b1e1b', pct: 5, spice: 'ម្រេច 5%' },
                  { label: 'Coated sugar', color: '#92400e', pct: 8, spice: 'ស្ករស/ស្ករត្នោត' },
                  { label: 'Coated light Chili', color: '#c2410c', pct: 2, spice: 'ម្ទេសស្រាល 2%' },
                  { label: 'Coated hot Chili', color: '#b91c1c', pct: 5, spice: 'ម្ទេសហឹរ 5%' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setLine2Text(item.label);
                      setSpicePct(item.pct);
                      setSpiceNameInput(item.spice);
                      handleUpdateCurrentFlavor({
                        nameEnLine2: item.label,
                        textColorLine2: item.color,
                        spicePercent: item.pct,
                        spiceNameKh: item.spice
                      });
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-serif cursor-pointer border ${
                      line2Text === item.label ? 'bg-amber-100 border-amber-400 font-bold text-stone-950' : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Khmer Subtitle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={showKhmerSubtext}
                  onChange={(e) => setShowKhmerSubtext(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>បង្ហាញឈ្មោះជាភាសាខ្មែរបន្ថែម (Bilingual Khmer Subtitle)</span>
              </label>

              {showKhmerSubtext && (
                <input
                  type="text"
                  value={customNameKhmer}
                  onChange={(e) => {
                    setCustomNameKhmer(e.target.value);
                    handleUpdateCurrentFlavor({ nameKh: e.target.value });
                  }}
                  placeholder="គ្រាប់ស្វាយចន្ទីស្រោបម្រេច / ស្ករ / ម្ទេស"
                  className="w-full mt-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-sans text-stone-900 focus:bg-white"
                />
              )}
            </div>

            {/* Weight Display (Bottom) */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-stone-800">
                  អក្សរទម្ងន់ខាងក្រោម QR (Weight Below QR):
                </label>
                <div className="flex items-center gap-1">
                  {['50g', '50 g', '50 Grams'].map((wt) => (
                    <button
                      key={wt}
                      type="button"
                      onClick={() => setNetWeightDisplay(wt)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition ${
                        netWeightDisplay === wt
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {wt}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={netWeightDisplay}
                onChange={(e) => setNetWeightDisplay(e.target.value)}
                placeholder="50g"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-serif text-stone-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Card 3: Labelling Inputting Section (Percentages % & Trace Data for QR Generation) */}
          <div className="bg-white p-4.5 rounded-2xl border-2 border-emerald-600/60 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h3 className="text-xs font-bold text-emerald-950 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Percent size={15} className="text-emerald-700" />
                <span>ផ្នែកបញ្ចូលទិន្នន័យគ្រឿងផ្សំ % (Labelling & Percentage Input)</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                QR Auto-Synced
              </span>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
              សូមបញ្ចូលទិន្នន័យជាក់ស្តែងដែលអ្នកមាន (ឧទាហរណ៍៖ <strong>Light Chili 2%</strong>, <strong>Hot Chili 5%</strong>, ឬ <strong>Pepper 5%</strong>)។ រាល់ទិន្នន័យទាំងអស់នឹងត្រូវបញ្ចូលទៅក្នុង <strong>QR Code ស្វ័យប្រវត្ត</strong> ធានាថាពេលស្កេននឹងឃើញព័ត៌មានលម្អិត ១០០% មិន Error ឬ Not Found ឡើយ!
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Cashew Percentage */}
              <div>
                <label className="block text-[10.5px] font-bold text-stone-700 mb-1">
                  % គ្រាប់ស្វាយចន្ទី (Cashew %):
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={cashewPct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCashewPct(val);
                    handleUpdateCurrentFlavor({ cashewPercent: val });
                  }}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900 font-bold"
                />
              </div>

              {/* Spice / Flavor Percentage (e.g. 2% or 5%) */}
              <div>
                <label className="block text-[10.5px] font-bold text-stone-700 mb-1">
                  % គ្រឿងទេស (Spice / Chili %):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={spicePct}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSpicePct(val);
                      handleUpdateCurrentFlavor({ spicePercent: val });
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono text-emerald-950 font-bold"
                  />
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSpicePct(2);
                        handleUpdateCurrentFlavor({ spicePercent: 2 });
                      }}
                      className="px-1.5 py-1 bg-stone-100 hover:bg-emerald-100 text-[10px] font-mono rounded font-bold"
                    >
                      2%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSpicePct(5);
                        handleUpdateCurrentFlavor({ spicePercent: 5 });
                      }}
                      className="px-1.5 py-1 bg-stone-100 hover:bg-emerald-100 text-[10px] font-mono rounded font-bold"
                    >
                      5%
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Spice Name / Detail Input */}
            <div>
              <label className="block text-[10.5px] font-bold text-stone-700 mb-1">
                ឈ្មោះគ្រឿងទេសជាក់ស្តែង (Spice Detail & Notes):
              </label>
              <input
                type="text"
                value={spiceNameInput}
                onChange={(e) => {
                  setSpiceNameInput(e.target.value);
                  handleUpdateCurrentFlavor({ spiceNameKh: e.target.value });
                }}
                placeholder="ឧ. ម្ទេសស្រាល 2%, ម្ទេសហឹរ 5%, ម្រេចកំពត 5%, ស្ករត្នោត"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Sugar % */}
              <div>
                <label className="block text-[10.5px] font-bold text-stone-700 mb-1">
                  % ស្ករ (Sugar %):
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={sugarPct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSugarPct(val);
                    handleUpdateCurrentFlavor({ sugarPercent: val });
                  }}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900"
                />
              </div>

              {/* Salt % */}
              <div>
                <label className="block text-[10.5px] font-bold text-stone-700 mb-1">
                  % អំបិល (Salt %):
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={saltPct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSaltPct(val);
                    handleUpdateCurrentFlavor({ saltPercent: val });
                  }}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900"
                />
              </div>
            </div>

            {/* LOT Code Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10.5px] font-bold text-stone-700">
                  លេខសម្គាល់ឡូត៍ (LOT / Batch Number):
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newLot = `KH-50G-${Date.now().toString().slice(-4)}`;
                    setLotCode(newLot);
                    handleUpdateCurrentFlavor({ defaultBatchLot: newLot });
                  }}
                  className="text-[9.5px] text-emerald-700 hover:underline font-mono"
                >
                  Generate New LOT
                </button>
              </div>
              <input
                type="text"
                value={lotCode}
                onChange={(e) => {
                  setLotCode(e.target.value);
                  handleUpdateCurrentFlavor({ defaultBatchLot: e.target.value });
                }}
                placeholder="KH-PEP-50G-001"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900 font-bold"
              />
            </div>

            {/* QR Encoding Mode Switcher */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-stone-800">
                  ទម្រង់ផ្ទុកទិន្នន័យក្នុង QR (QR Data Encoding Mode):
                </label>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setQrEncodingMode('url-passport')}
                  className={`p-2 rounded-xl text-left border text-[10.5px] font-bold transition cursor-pointer ${
                    qrEncodingMode === 'url-passport'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>🌐 Web Passport URL</span>
                  <span className="block text-[9px] font-normal opacity-90">ស្កេនបើកមើលលើទូរសព្ទ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQrEncodingMode('full-text-dossier')}
                  className={`p-2 rounded-xl text-left border text-[10.5px] font-bold transition cursor-pointer ${
                    qrEncodingMode === 'full-text-dossier'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>📄 Full Text Dossier</span>
                  <span className="block text-[9px] font-normal opacity-90">ស្កេនឃើញទិន្នន័យភ្លាម (Offline)</span>
                </button>
              </div>
            </div>

            {/* Live Ingredients Preview */}
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 font-sans space-y-1">
              <span className="font-bold block text-[10px] uppercase font-mono text-emerald-800">
                ✓ Live Ingredients Formula:
              </span>
              <p>{buildCurrentIngredients()}</p>
            </div>
          </div>

          {/* Card 4: Voice Story & HACCP Guarantee Voice Note */}
          <VoiceStoryRecorder
            batchId={lotCode}
            productName={`${line1Text} ${line2Text}`}
            activeLanguage="kh"
            isConsumerMode={false}
          />

          {/* Card 5: Batch Sticker Sheet Print Setup */}
          <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Printer size={15} className="text-amber-600" />
                <span>ជម្រើសព្រីនសន្លឹកស្ទីកឃ័រ A4 (Print Sheet Mode)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrintSheetType('bottom-qr-35up')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  printSheetType === 'bottom-qr-35up'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-2xs ring-1 ring-amber-400'
                    : 'bg-stone-50 hover:bg-white text-stone-800 border-stone-200'
                }`}
              >
                <div>
                  <span className="text-[8.5px] font-mono uppercase tracking-wider block opacity-80">Option 1</span>
                  <p className="text-[11.5px] font-black mt-0.5">Bottom Sticker: Name + QR + 50g</p>
                  <p className="text-[9.5px] mt-0.5 opacity-90 leading-tight">
                    35 ស្ទីកឃ័រ / A4 (បិទខាងក្រោមបង្អួច).
                  </p>
                </div>
                <span className="mt-1 text-[8.5px] font-mono font-bold">35 Up / Page</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintSheetType('top-seal-title-24up')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  printSheetType === 'top-seal-title-24up'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-2xs ring-1 ring-amber-400'
                    : 'bg-stone-50 hover:bg-white text-stone-800 border-stone-200'
                }`}
              >
                <div>
                  <span className="text-[8.5px] font-mono uppercase tracking-wider block opacity-80">Option 2</span>
                  <p className="text-[11.5px] font-black mt-0.5">Top Sticker: Mayany Logo Seal</p>
                  <p className="text-[9.5px] mt-0.5 opacity-90 leading-tight">
                    24 ស្ទីកឃ័រ / A4 (បិទខាងលើបង្អួច).
                  </p>
                </div>
                <span className="mt-1 text-[8.5px] font-mono font-bold">24 Up / Page</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintSheetType('paired-combo-20up')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  printSheetType === 'paired-combo-20up'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-2xs ring-1 ring-amber-400'
                    : 'bg-stone-50 hover:bg-white text-stone-800 border-stone-200'
                }`}
              >
                <div>
                  <span className="text-[8.5px] font-mono uppercase tracking-wider block opacity-80">Option 3 (គូ)</span>
                  <p className="text-[11.5px] font-black mt-0.5">Paired Combo (Top Seal + Bottom QR)</p>
                  <p className="text-[9.5px] mt-0.5 opacity-90 leading-tight">
                    16 គូក្នុងមួយសន្លឹក A4.
                  </p>
                </div>
                <span className="mt-1 text-[8.5px] font-mono font-bold">Paired Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintSheetType('all-user-flavors-mix-35up')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  printSheetType === 'all-user-flavors-mix-35up'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-2xs ring-1 ring-amber-400'
                    : 'bg-stone-50 hover:bg-white text-stone-800 border-stone-200'
                }`}
              >
                <div>
                  <span className="text-[8.5px] font-mono uppercase tracking-wider block opacity-80">Option 4 (ចម្រុះមុខទំនិញ)</span>
                  <p className="text-[11.5px] font-black mt-0.5">All Flavors Mix Sheet (Pepper + Sugar + Chili)</p>
                  <p className="text-[9.5px] mt-0.5 opacity-90 leading-tight">
                    35 ស្ទីកឃ័រចម្រុះគ្រប់មុខ.
                  </p>
                </div>
                <span className="mt-1 text-[8.5px] font-mono font-bold">Mix All Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Realistic Standup Window Pouch (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Visualizer Container */}
          <div className="bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl text-center relative overflow-hidden no-print">
            
            {/* Header Toolbar with 3-Bag Color Switcher */}
            <div className="text-left flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  3-Color 50g Standing Pouch Simulation (30mm Height Zones)
                </span>
                <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                  <span>
                    {bagColorMode === 'black-matte' && 'ថង់ពណ៌ខ្មៅ Matte Black (Coated Pepper)'}
                    {bagColorMode === 'brown-kraft' && 'ថង់ក្រដាសត្នោត Natural Kraft (Coated Sugar)'}
                    {bagColorMode === 'white-matte' && 'ថង់ពណ៌ស Matte White (Coated Chili)'}
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9.5px] font-bold px-2 py-0.5 rounded-full font-sans">
                    {line2Text}
                  </span>
                </h4>
              </div>

              {/* Bag Color Selector Quick Buttons */}
              <div className="flex items-center gap-1.5 bg-stone-900/90 p-1 rounded-xl border border-stone-700">
                <button
                  type="button"
                  onClick={() => setBagColorMode('black-matte')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition ${
                    bagColorMode === 'black-matte'
                      ? 'bg-black text-amber-300 border border-amber-500 shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Black Pouch - Best for Pepper Coated"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-700 inline-block"></span>
                  <span>Black (ម្រេច)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBagColorMode('white-matte')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition ${
                    bagColorMode === 'white-matte'
                      ? 'bg-white text-stone-900 border border-amber-500 shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="White Pouch - Best for Chili Coated"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-300 inline-block"></span>
                  <span>White (ម្ទេស)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBagColorMode('brown-kraft')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition ${
                    bagColorMode === 'brown-kraft'
                      ? 'bg-[#b89163] text-stone-950 border border-amber-300 shadow-xs font-black'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Kraft Brown Pouch - Best for Sugar Coated"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a37d50] border border-[#614526] inline-block"></span>
                  <span>Brown (ស្ករ)</span>
                </button>
              </div>
            </div>

            {/* Toggle 30mm Measurement Guides */}
            <div className="flex items-center justify-between text-xs mb-3 px-1">
              <label className="flex items-center gap-2 text-stone-300 font-mono text-[11px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDimensionGuides}
                  onChange={(e) => setShowDimensionGuides(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>បង្ហាញបន្ទាត់វាស់ 30mm Height Guides (Above & Below Window)</span>
              </label>

              <button
                type="button"
                onClick={() => setShowPassportModal(true)}
                className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition"
              >
                <Eye size={13} />
                <span>Test Scan Preview</span>
              </button>
            </div>

            {/* THE STANDUP POUCH - EXACT PIXEL-PERFECT REPLICA (BLACK, BROWN KRAFT, OR WHITE) */}
            <div className="py-2 flex flex-col items-center justify-center select-none relative">
              
              {/* Standup Pouch Silhouette Container */}
              <div 
                id="kraft-pouch-master-canvas"
                className={`w-[290px] sm:w-[320px] rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col justify-between transition-colors duration-300 ${
                  bagColorMode === 'black-matte'
                    ? 'border border-stone-700'
                    : bagColorMode === 'white-matte'
                    ? 'border border-slate-300'
                    : 'border border-[#9b764b]/80'
                }`}
                style={{
                  background:
                    bagColorMode === 'black-matte'
                      ? 'radial-gradient(ellipse at 50% 30%, #262626 0%, #171717 50%, #0a0a0a 100%)'
                      : bagColorMode === 'white-matte'
                      ? 'radial-gradient(ellipse at 50% 30%, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)'
                      : 'radial-gradient(ellipse at 50% 30%, #d8ba93 0%, #c9a478 50%, #b89163 100%)',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), inset 0 2px 5px rgba(255,255,255,0.45), inset 0 -5px 12px rgba(0,0,0,0.35)'
                }}
              >
                {/* Texture Grain Overlay */}
                <div 
                  className={`absolute inset-0 pointer-events-none ${
                    bagColorMode === 'black-matte'
                      ? 'opacity-15 mix-blend-screen'
                      : bagColorMode === 'white-matte'
                      ? 'opacity-10 mix-blend-multiply'
                      : 'opacity-25 mix-blend-multiply'
                  }`}
                  style={{
                    backgroundImage:
                      bagColorMode === 'black-matte'
                        ? 'radial-gradient(#ffffff 0.75px, transparent 0.75px)'
                        : 'radial-gradient(#7c5529 0.75px, transparent 0.75px)',
                    backgroundSize: '4px 4px'
                  }}
                />

                {/* 1. TOP HEAT-SEAL BAR & TEAR NOTCHES */}
                <div className={`h-12 border-b flex items-center justify-between px-3 relative ${
                  bagColorMode === 'black-matte'
                    ? 'border-stone-800 bg-stone-900/90'
                    : bagColorMode === 'white-matte'
                    ? 'border-slate-300 bg-slate-200/90'
                    : 'border-[#a37d50] bg-[#be976b]/70'
                }`}>
                  {/* Left Tear Notch */}
                  <div className={`w-2.5 h-3.5 rounded-r-full shadow-inner ${
                    bagColorMode === 'black-matte' ? 'bg-black' : bagColorMode === 'white-matte' ? 'bg-slate-400' : 'bg-stone-900/40'
                  }`} />
                  
                  {/* Heat Seal Vertical Grip Lines */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-0.5 opacity-50 px-2">
                    <div className={`w-full h-[1px] ${bagColorMode === 'white-matte' ? 'bg-slate-400' : 'bg-[#614526]'}`} />
                    <div className="w-full h-[1px] bg-white/50" />
                    <div className={`w-full h-[1px] ${bagColorMode === 'white-matte' ? 'bg-slate-400' : 'bg-[#614526]'}`} />
                  </div>

                  {/* Right Tear Notch */}
                  <div className={`w-2.5 h-3.5 rounded-l-full shadow-inner ${
                    bagColorMode === 'black-matte' ? 'bg-black' : bagColorMode === 'white-matte' ? 'bg-slate-400' : 'bg-stone-900/40'
                  }`} />
                </div>

                {/* 2. ZIPPER LOCK PRESS LINE */}
                <div className={`h-3 border-b flex items-center justify-center ${
                  bagColorMode === 'black-matte'
                    ? 'border-stone-800 bg-stone-950/80'
                    : bagColorMode === 'white-matte'
                    ? 'border-slate-300 bg-slate-100'
                    : 'border-[#a37d50]/70 bg-[#b08b5f]/40'
                }`}>
                  <div className={`w-5/6 h-[1px] border-b border-dashed ${
                    bagColorMode === 'white-matte' ? 'border-slate-400/50' : 'border-[#614526]/50'
                  }`} />
                </div>

                {/* 3. TOP ZONE: 30mm HEIGHT AREA (ABOVE WINDOW) - 20mm BORDERLESS LOGO */}
                <div className="pt-2.5 pb-1 px-4 flex flex-col items-center justify-center relative z-10">
                  
                  {/* Visual 30mm Height Zone Guideline */}
                  {showDimensionGuides && (
                    <div className="absolute top-1 left-2 right-2 border-y border-dashed border-amber-400/70 bg-amber-500/10 rounded px-1.5 py-0.5 flex items-center justify-between text-[7.5px] font-mono text-amber-300 pointer-events-none">
                      <span>▲ 30mm Height Zone (Above Window)</span>
                      <span className="bg-stone-900/90 text-amber-400 px-1.5 py-0.2 rounded font-bold">20mm Round Logo (Thick Cut Border)</span>
                    </div>
                  )}

                  {/* 20mm Exact Brand Logo Directly on Label (Borderless, Clean, No Box) */}
                  <div className="transition-transform duration-300 hover:scale-105 filter drop-shadow-xs mt-1 flex flex-col items-center justify-center">
                    {brandSealStyle === 'royal-gold-seal' ? (
                      <MayanyRoyalGoldSeal 
                        className="w-14 h-14 sm:w-16 sm:h-16"
                        brandName="Mayany"
                        subText="ENTERPRISE"
                        goldTone="bright"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                        <img 
                          src={activeBrandLogo} 
                          alt="Mayany Enterprise Logo" 
                          className="max-w-full max-h-full object-contain" 
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. TRANSPARENT WINDOW WITH 17 JUMBO WHOLE CASHEWS */}
                <div className="my-1 mx-5 relative z-10">
                  {/* The Clear Window Container */}
                  <div 
                    className={`w-full h-32 rounded-2xl border-2 overflow-hidden relative shadow-inner flex flex-col items-center justify-center p-2 ${
                      bagColorMode === 'black-matte'
                        ? 'border-amber-500/70'
                        : bagColorMode === 'white-matte'
                        ? 'border-slate-400'
                        : 'border-[#8f6a40]/90'
                    }`}
                    style={{
                      background:
                        bagColorMode === 'black-matte'
                          ? 'radial-gradient(ellipse at center, rgba(40, 30, 20, 0.4) 0%, rgba(20, 15, 10, 0.75) 100%)'
                          : 'radial-gradient(ellipse at center, rgba(250, 242, 230, 0.4) 0%, rgba(200, 175, 145, 0.75) 100%)',
                      backdropFilter: 'blur(0.4px)'
                    }}
                  >
                    {/* Realistic Glass Reflection Sheen */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/25 rounded-full blur-md pointer-events-none transform rotate-45" />

                    {/* 17 Whole Roasted Coated Cashews Inside Window */}
                    <div className="w-full h-full relative flex flex-wrap items-center justify-center gap-1 p-1 select-none">
                      {Array.from({ length: 17 }).map((_, kIdx) => {
                        const rotations = [-28, 42, -12, 35, -48, 18, -32, 58, -16, 22, -38, 32, -18, 48, -8, 38, -25];
                        const rot = rotations[kIdx % rotations.length];
                        return (
                          <div 
                            key={kIdx} 
                            className="relative transition-transform duration-300 hover:scale-125 cursor-pointer"
                            style={{ transform: `rotate(${rot}deg)` }}
                            title={`Cashew Kernel #${kIdx + 1} • ${line2Text}`}
                          >
                            <svg className="w-7.5 h-7.5 filter drop-shadow-sm" viewBox="0 0 100 100">
                              <defs>
                                <radialGradient id={`nutGradV3-${kIdx}`} cx="38%" cy="38%" r="62%">
                                  <stop offset="0%" stopColor="#fdf0d5" />
                                  <stop offset="45%" stopColor="#e3b888" />
                                  <stop offset="80%" stopColor={activeFlavor.kernelGlazeColor} />
                                  <stop offset="100%" stopColor="#784417" />
                                </radialGradient>
                              </defs>
                              <path 
                                d="M 28,18 C 65,8 92,32 86,64 C 81,84 56,94 38,80 C 24,69 29,54 42,51 C 55,47 60,34 45,29 C 34,26 24,29 19,39 C 14,29 18,20 28,18 Z" 
                                fill={`url(#nutGradV3-${kIdx})`}
                                stroke="#5c3411"
                                strokeWidth="2.2"
                              />
                              <path 
                                d="M 38,36 C 46,32 54,34 58,42 C 60,48 56,56 46,60" 
                                stroke="#5c3411" 
                                strokeWidth="2.2" 
                                strokeLinecap="round" 
                                fill="none" 
                                opacity="0.45"
                              />
                              {activeFlavor.pepperSpecks && (
                                <>
                                  <circle cx="44" cy="32" r="2.5" fill="#140f0c" />
                                  <circle cx="64" cy="44" r="2.2" fill="#241b15" />
                                  <circle cx="53" cy="63" r="2.4" fill="#140f0c" />
                                  <circle cx="73" cy="58" r="1.8" fill="#2d221a" />
                                  <circle cx="36" cy="70" r="2.1" fill="#140f0c" />
                                  <circle cx="50" cy="48" r="1.6" fill="#140f0c" />
                                </>
                              )}
                              {activeFlavor.chiliFlakes && (
                                <>
                                  <polygon points="44,32 48,30 46,36" fill="#991b1b" />
                                  <polygon points="65,48 70,45 68,52" fill="#dc2626" />
                                  <polygon points="48,65 52,62 50,68" fill="#b91c1c" />
                                  <circle cx="58" cy="38" r="1.6" fill="#eab308" />
                                </>
                              )}
                              {activeFlavor.sugarGlaze && (
                                <>
                                  <path d="M 38,24 Q 54,18 64,28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
                                  <circle cx="62" cy="52" r="2" fill="#fffbeb" />
                                  <circle cx="46" cy="62" r="1.6" fill="#fef3c7" />
                                </>
                              )}
                            </svg>
                          </div>
                        );
                      })}
                    </div>

                    {/* Window Bottom Badge */}
                    <div className="absolute bottom-1 bg-stone-950/70 backdrop-blur-xs text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="text-amber-300">★ 17 Whole Kernels</span>
                      <span>•</span>
                      <span className="text-emerald-300">{netWeightDisplay || '50g'}</span>
                    </div>
                  </div>
                </div>

                {/* 5. BOTTOM ZONE: 30mm HEIGHT AREA (BELOW WINDOW) - WITH 40mm × 20mm STICKER */}
                <div className="pb-3 pt-1 px-3 flex flex-col items-center justify-center relative z-10 w-full">
                  
                  {/* Visual 70mm × 30mm Flat Zone Guideline with Margins */}
                  {showDimensionGuides && (
                    <div className="w-full max-w-[270px] border-y border-dashed border-amber-400/80 bg-amber-500/10 rounded-lg px-2 py-0.5 mb-1 flex items-center justify-between text-[7.5px] font-mono text-amber-300 pointer-events-none">
                      <span>▲ 70mm × 30mm Available Bag Space</span>
                      <span className="bg-stone-900/90 text-amber-400 px-1.5 py-0.2 rounded font-bold">
                        Sticker: {bottomStickerWidthMm}mm × {bottomStickerHeightMm}mm ({((70 - bottomStickerWidthMm) / 2).toFixed(1)}mm Margin)
                      </span>
                    </div>
                  )}

                  {/* Physical Sticker Container (40mm × 20mm or Selected Size) - Perfectly Scaled & Centered */}
                  <div 
                    className={`bg-white p-2 rounded-xl shadow-md border border-stone-300 flex flex-col justify-between text-center transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                      bottomStickerSizePreset === '40x20'
                        ? 'w-[210px] min-h-[96px]'
                        : bottomStickerSizePreset === '45x22'
                        ? 'w-[235px] min-h-[102px]'
                        : 'w-[260px] min-h-[108px]'
                    }`}
                    onClick={() => setShowPassportModal(true)}
                    title={`Click to Test Scan (${bottomStickerWidthMm}mm × ${bottomStickerHeightMm}mm Sticker)`}
                  >
                    {/* A. PRODUCT NAME ON TOP */}
                    <div className="font-serif mb-0.5 w-full text-center border-b border-stone-100 pb-0.5">
                      <h4 className="text-[13px] sm:text-[14px] font-bold text-stone-950 leading-tight">
                        {line1Text || 'Cashew Kernel'}
                      </h4>
                      <p 
                        className="text-[12px] sm:text-[13px] font-semibold italic leading-tight mt-0.5"
                        style={{ color: activeFlavor.textColorLine2 }}
                      >
                        {line2Text || 'Coated Pepper'}
                      </p>
                      {showKhmerSubtext && customNameKhmer && (
                        <p className="text-[8px] font-sans text-stone-600 truncate mt-0.5">
                          {customNameKhmer}
                        </p>
                      )}
                    </div>

                    {/* B. MIDDLE SECTION: QR CODE WITH 'SCAN QR PASSPORT' (LEFT) + 'READY TO EAT' & 'MADE IN CAMBODIA' TEXT (RIGHT) */}
                    <div className="flex items-center justify-between gap-2.5 px-1 my-1">
                      {/* Scannable QR Code (Larger) with 'SCAN QR PASSPORT' underneath */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <div className="w-16 h-16 sm:w-17 sm:h-17 bg-white p-0.5 rounded-md border border-stone-300 flex items-center justify-center shadow-xs">
                          {qrDataUrl ? (
                            <img 
                              src={qrDataUrl} 
                              alt="Digital Passport QR Code" 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <QrCode size={46} className="text-stone-700" />
                          )}
                        </div>
                        <span className="text-[6.5px] sm:text-[7px] font-mono font-bold text-stone-800 tracking-tight mt-0.5 uppercase whitespace-nowrap">
                          SCAN QR PASSPORT
                        </span>
                      </div>

                      {/* Direct READY TO EAT + MADE IN CAMBODIA Typography with Double Space */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
                        <p className="text-[12px] sm:text-[13.5px] font-black uppercase tracking-wider text-stone-950 leading-tight">
                          READY TO EAT
                        </p>
                        {/* Double space gap */}
                        <div className="h-2 sm:h-2.5" />
                        <p className="text-[8px] sm:text-[8.5px] font-serif font-black uppercase tracking-widest text-stone-900 leading-tight">
                          MADE IN CAMBODIA
                        </p>
                      </div>
                    </div>

                    {/* C. 50G ON THE BOTTOM IN THE MIDDLE */}
                    <div className="mt-0.5 pt-0.5 border-t border-stone-100 flex items-center justify-center w-full font-serif">
                      <p className="text-[12px] sm:text-[13px] font-black text-stone-950 tracking-wide text-center">
                        {netWeightDisplay || '50g'}
                      </p>
                    </div>
                  </div>

                </div>

                {/* 6. STANDUP POUCH BOTTOM GUSSET FOLD */}
                <div className={`h-4 border-t ${
                  bagColorMode === 'black-matte'
                    ? 'bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-stone-700'
                    : bagColorMode === 'white-matte'
                    ? 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 border-slate-300'
                    : 'bg-gradient-to-r from-[#9e794e] via-[#b89163] to-[#9e794e] border-[#805e38]'
                }`} />
              </div>

              {/* Shelf Reflection / Drop Shadow */}
              <div className="w-64 h-3.5 bg-black/60 rounded-full blur-xs mx-auto mt-2" />
              <p className="text-[10px] text-stone-400 font-mono mt-1">
                ថង់បាតឈរ ៥០g (50g Standing Pouch) • 30mm Top Zone / 30mm Bottom Zone
              </p>
            </div>
          </div>

          {/* STRATEGIC PACKAGING & COLOR-CODING DECISION GUIDE */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-900/90 to-stone-950 text-white p-5 rounded-2xl border-2 border-amber-500/50 shadow-md space-y-3.5 font-sans no-print">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles size={16} className="text-amber-400" />
              <span>យុទ្ធសាស្ត្រជ្រើសរើសពណ៌ថង់ និងផ្លាកសញ្ញា (Packaging & Labeling Strategy):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Black Bag */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-700 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="w-3 h-3 rounded-full bg-black border border-stone-600 inline-block"></span>
                  <span>ថង់ខ្មៅ (Black Bag)</span>
                </div>
                <p className="text-[11px] font-bold text-amber-400">
                  ➡️ ស្រោបម្រេច (Pepper Coated)
                </p>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  ពណ៌ខ្មៅតំណាងឱ្យម្រេចកំពតខ្មៅ លេចធ្លោបែបប្រណិត (Luxury / Premium) និងការពារពន្លឺ។
                </p>
              </div>

              {/* White Bag */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-700 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="w-3 h-3 rounded-full bg-white border border-stone-300 inline-block"></span>
                  <span>ថង់ស (White Bag)</span>
                </div>
                <p className="text-[11px] font-bold text-rose-400">
                  ➡️ ស្រោបម្ទេស (Chili Coated)
                </p>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  ពណ៌សស្អាត ធ្វើឱ្យពណ៌ក្រហមនៃម្ទេសនៅក្នុងបង្អួចថ្លាលេចធ្លោខ្លាំងទាក់ទាញភ្នែក (High-contrast Pop)។
                </p>
              </div>

              {/* Brown Bag */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-700 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="w-3 h-3 rounded-full bg-[#b89163] border border-[#614526] inline-block"></span>
                  <span>ថង់ត្នោត (Brown Kraft)</span>
                </div>
                <p className="text-[11px] font-bold text-amber-300">
                  ➡️ ស្រោបស្ករ (Sugar Coated)
                </p>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  ពណ៌ក្រដាសត្នោតធម្មជាតិ សមឥតខ្ចោះជាមួយស្ករត្នោតខ្មែរផ្អែមឈ្ងុយបែប Organic Artisanal។
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-300 space-y-1.5">
              <p>
                <strong>១. អំពីទំហំផ្លាក (30mm Height Clearance):</strong> នៅខាងលើបង្អួចមានកំពស់ 30mm យើងប្រើស្ទីកឃ័រ Logo កំពស់ <strong>26mm</strong> (សល់គែម 2mm លើក្រោមមិនប៉ះខ្សែរូត និងបង្អួច)។ នៅខាងក្រោមបង្អួចមាន 30mm យើងប្រើស្ទីកឃ័រ QR កំពស់ <strong>26mm</strong> សមល្មមឥតខ្ចោះ។
              </p>
              <p>
                <strong>២. យុទ្ធសាស្ត្រពណ៌ផ្លាក (Labeling Recommendation):</strong> គួររក្សា <strong>Unified Luxury Gold & Crisp White Label (ពណ៌ផ្លាកស-មាសដូចគ្នាទាំង ៣ រសជាតិ)</strong> ព្រោះពណ៌ថង់ទាំង ៣ (ខ្មៅ ស ត្នោត) បានបែងចែករសជាតិរួចស្រេចហើយ។ ការប្រើប្រព័ន្ធផ្លាកដូចគ្នានេះ ជួយឱ្យម៉ាក Mayany Enterprise មើលទៅមានស្តង់ដាររួមមួយ និងកាត់បន្ថយថ្លៃដើមបោះពុម្ព!
              </p>
            </div>
          </div>

          {/* Scannability Guarantee & Value Info */}
          <div className="bg-gradient-to-br from-emerald-950/80 via-stone-900 to-stone-950 text-white p-5 rounded-2xl border border-emerald-500/40 shadow-md space-y-2.5 font-sans no-print">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck size={16} className="shrink-0 text-emerald-400" />
              <span>ការធានាសុពលភាពស្កេន QR (100% Guaranteed Scannable):</span>
            </div>
            <ul className="text-[11px] text-stone-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong>ផ្ទុកទិន្នន័យពិតប្រាកដ (Real Input Data):</strong> ព័ត៌មានដែលអ្នកបញ្ចូល (ឈ្មោះផលិតផល, ភាគរយគ្រឿងផ្សំ {spicePct}%, លេខឡូត៍ {lotCode}) ត្រូវបានភ្ជាប់ទៅក្នុង QR ភ្លាមៗ។
              </li>
              <li>
                <strong>មិន Error / Not Found (Fixed):</strong> កូដ QR ត្រូវបានបង្កើតឡើងដោយប្រើ standard URL និងទម្រង់ Offline Text Dossier ដែលទូរសព្ទគ្រប់ម៉ាក (iPhone / Android) អាចស្កេនមើលឃើញភ្លាម។
              </li>
              <li>
                <strong>ប្លង់ស្ទីកឃ័រ ២ ផ្ទាំងងាយស្រួលព្រីន (2-Sticker Print Sheet):</strong> ផ្ទាំងលើ Logo Mayany + ផ្ទាំងក្រោម (Name + QR + 50g)។
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* MODAL: ADD CUSTOM FLAVOR PRODUCT */}
      {showAddFlavorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 font-sans text-stone-900 border-2 border-amber-500 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-xs font-bold font-mono text-stone-900 uppercase flex items-center gap-1.5">
                <Plus size={14} className="text-amber-600" />
                <span>បន្ថែមមុខទំនិញថ្មី (Add New Product)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddFlavorModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = (formData.get('flavorName') as string) || 'Coated Flavor';
                const pct = Number(formData.get('spicePct')) || 5;
                handleAddNewFlavor(name, pct);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ឈ្មោះរសជាតិ (English Flavor Name):
                </label>
                <input
                  name="flavorName"
                  type="text"
                  required
                  placeholder="ឧ. Coated Pepper, Coated light Chili, Coated Wasabi"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-serif"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  % គ្រឿងទេស (Spice Percentage %):
                </label>
                <input
                  name="spicePct"
                  type="number"
                  defaultValue={5}
                  min={0}
                  max={30}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFlavorModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-1.5 rounded-lg text-xs"
                >
                  បន្ថែម (Add Product)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LIVE DIGITAL PRODUCT PASSPORT (WHAT CONSUMERS SEE WHEN SCANNING THE QR) */}
      {showPassportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-amber-500 flex flex-col font-sans">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-4 sticky top-0 z-10 flex items-center justify-between border-b border-amber-500/40">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className="text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300">
                    Cambodia Digital Product Passport
                  </h4>
                  <p className="text-[9.5px] text-stone-300 font-mono">
                    Scanned for: {line1Text} {line2Text}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPassportModal(false)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center font-bold cursor-pointer transition text-xs"
              >
                ✕
              </button>
            </div>

            {/* Modal Content: Full CS 001 Compliant Data with exact percentages inputted */}
            <div className="p-5 space-y-4 text-stone-800">
              
              {/* Top Banner */}
              <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <div className="w-12 h-12 shrink-0">
                  <MayanyRoyalGoldSeal size={48} className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    {line1Text} {line2Text}
                  </h3>
                  <p className="text-xs font-bold text-amber-900 font-sans">
                    {customNameKhmer || 'គ្រាប់ស្វាយចន្ទីស្រោបគ្រឿងទេស'}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono">
                    Lot: {lotCode} • {netWeightDisplay || '50g'} (17 Kernels)
                  </p>
                </div>
              </div>

              {/* Verified Badges */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-mono">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-xl">
                  <CheckCircle2 size={13} className="mx-auto mb-0.5 text-emerald-600" />
                  <span className="font-bold block">CS 001:2008</span>
                  <span className="text-[8px] opacity-75">Certified</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl">
                  <Award size={13} className="mx-auto mb-0.5 text-amber-600" />
                  <span className="font-bold block">{spicePct}% {line2Text}</span>
                  <span className="text-[8px] opacity-75">Quality Formulated</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 text-blue-900 p-2 rounded-xl">
                  <ShieldCheck size={13} className="mx-auto mb-0.5 text-blue-600" />
                  <span className="font-bold block">GHP / GMP</span>
                  <span className="text-[8px] opacity-75">Verified Safety</span>
                </div>
              </div>

              {/* Founder Voice Note (HACCP & Love Guarantee) */}
              <VoiceStoryRecorder
                batchId={lotCode}
                productName={`${line1Text} ${line2Text}`}
                activeLanguage="kh"
                isConsumerMode={true}
              />

              {/* 1. Full Ingredients List with exact percentages */}
              <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <h5 className="text-[11px] font-bold text-stone-900 uppercase font-mono tracking-wider flex items-center gap-1">
                  <Tag size={12} className="text-amber-600" />
                  <span>បញ្ជីគ្រឿងផ្សំពេញលេញ (Ingredients & Percentages %):</span>
                </h5>
                <p className="text-xs text-stone-800 leading-relaxed font-sans font-medium">
                  {buildCurrentIngredients()}
                </p>
                <div className="mt-1 pt-1 border-t border-stone-200 text-[10px] text-red-700 font-bold">
                  ⚠️ ព័ត៌មានប្រតិកម្ម (Allergen): មានផ្ទុកគ្រាប់រុក្ខជាតិ (Contains Tree Nuts/Cashews).
                </div>
              </div>

              {/* 2. Raw Scanned Payload Preview */}
              <div className="p-3 bg-stone-900 text-emerald-300 rounded-xl font-mono text-[10px] space-y-1">
                <span className="text-stone-400 text-[9px] uppercase tracking-wider block">
                  Scanned Payload Content ({qrEncodingMode}):
                </span>
                <p className="break-all whitespace-pre-line text-[9.5px] bg-stone-950 p-2 rounded border border-stone-800">
                  {qrTargetUrl}
                </p>
              </div>

              {/* 3. Producer & Facility Details */}
              <div className="text-[10.5px] text-stone-600 space-y-0.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200 font-sans">
                <p><strong>សហគ្រាសផលិត (Manufacturer):</strong> {companyName}</p>
                <p><strong>ទីតាំង (Address):</strong> {companyAddress}</p>
                <p><strong>ប្រភពគ្រាប់ (Origin):</strong> ខេត្តកំពង់ធំ (Cambodia 100% Kampong Thom)</p>
                <p><strong>កាលបរិច្ឆេទ (MFG & EXP):</strong> ផលិតតាមការកុម្ម៉ង់ (Make-to-Order • បោះត្រារូបវន្តលើកញ្ចប់)</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPassportModal(false)}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  បិទផ្ទាំង (Close)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* DEDICATED PRINTABLE A4 SHEET FOR 50G POUCH LABELS (ONLY RENDERS DURING PRINT) */}
      <div id="window-pouch-printable-canvas" className="hidden print:block w-full bg-white text-black p-0 m-0">
        
        {/* MODE 1: 35 Bottom Stickers (70mm × 30mm: Product Name + QR Code + READY TO EAT + MADE IN CAMBODIA + 50g) */}
        {printSheetType === 'bottom-qr-35up' && (
          <div className="w-[190mm] h-[277mm] mx-auto grid grid-cols-5 grid-rows-7 gap-[2mm] p-[2mm] box-border">
            {Array.from({ length: 35 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-black rounded-[2mm] p-[1.2mm] flex flex-col justify-between items-center text-center bg-white box-border overflow-hidden"
              >
                {/* 1. PRODUCT NAME ON TOP (LARGER) */}
                <div className="w-full text-center font-serif leading-tight border-b border-black/20 pb-[0.3mm]">
                  <p className="text-[7.5pt] font-bold text-black truncate">
                    {line1Text || 'Cashew Kernel'}
                  </p>
                  <p className="text-[6.8pt] font-semibold italic text-black truncate mt-[0.2mm]">
                    {line2Text || 'Coated Pepper'}
                  </p>
                </div>

                {/* 2. QR CODE (LARGER) WITH 'SCAN QR PASSPORT' + DIRECT 'READY TO EAT' & 'MADE IN CAMBODIA' WITH DOUBLE SPACE */}
                <div className="w-full flex items-center justify-between gap-[1mm] my-[0.3mm] px-[0.5mm]">
                  {qrDataUrl && (
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <img 
                        src={qrDataUrl} 
                        alt="Trace QR" 
                        className="w-[18mm] h-[18mm] object-contain" 
                      />
                      <span className="text-[3.2pt] font-mono font-bold text-black uppercase tracking-tight leading-none mt-[0.3mm]">
                        SCAN QR PASSPORT
                      </span>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-[0.5mm]">
                    <p className="text-[6.5pt] font-mono font-black uppercase text-black tracking-wider leading-tight">
                      READY TO EAT
                    </p>
                    {/* Double space */}
                    <div className="h-[1.2mm]" />
                    <p className="text-[4.5pt] font-serif font-black uppercase text-black tracking-widest leading-tight">
                      MADE IN CAMBODIA
                    </p>
                  </div>
                </div>

                {/* 3. 50G ON THE BOTTOM IN THE MIDDLE */}
                <div className="w-full pt-[0.3mm] border-t border-black/30 flex items-center justify-center">
                  <p className="text-[7pt] font-serif font-black text-black leading-tight text-center">
                    {netWeightDisplay || '50g'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 2: 24 Top Stickers (20mm Borderless Brand Logo Direct on Sheet) */}
        {printSheetType === 'top-seal-title-24up' && (
          <div className="w-[190mm] h-[277mm] mx-auto grid grid-cols-4 grid-rows-6 gap-[3.5mm] p-[3mm] box-border">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className="flex flex-col justify-center items-center text-center bg-transparent box-border p-0 m-0"
              >
                {/* 20mm Official Brand Logo Clean Direct Display */}
                <div className="w-[20mm] h-[20mm] flex items-center justify-center">
                  {brandSealStyle === 'custom-uploaded' ? (
                    <img 
                      src={activeBrandLogo} 
                      alt="Logo" 
                      className="max-w-full max-h-full object-contain" 
                    />
                  ) : (
                    <MayanyRoyalGoldSeal size={75} className="w-[20mm] h-[20mm]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 3: Paired Combo (Top 20mm Seal + Bottom 40mm × 20mm Sticker) */}
        {printSheetType === 'paired-combo-20up' && (
          <div className="w-[190mm] h-[277mm] mx-auto grid grid-cols-4 grid-rows-4 gap-[3mm] p-[3mm] box-border">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border-2 border-black rounded-[2.5mm] p-[2mm] flex flex-col justify-between items-center text-center bg-white">
                {/* Top Section: 20mm Brand Seal Direct */}
                <div className="w-full flex items-center justify-center gap-[1.5mm] border-b border-black/30 pb-[1mm]">
                  <div className="w-[14mm] h-[14mm] flex items-center justify-center shrink-0">
                    {brandSealStyle === 'custom-uploaded' ? (
                      <img 
                        src={activeBrandLogo} 
                        alt="Logo" 
                        className="max-w-full max-h-full object-contain" 
                      />
                    ) : (
                      <MayanyRoyalGoldSeal size={50} className="w-[14mm] h-[14mm]" />
                    )}
                  </div>
                  <div className="text-left font-serif">
                    <p className="text-[6.5pt] font-bold text-black leading-tight">Mayany</p>
                    <p className="text-[5pt] font-mono text-gray-700 leading-tight">ENTERPRISE</p>
                  </div>
                </div>

                {/* Bottom Section: Product Name, QR & READY TO EAT / MADE IN CAMBODIA */}
                <div className="my-[0.5mm] flex flex-col items-center justify-center font-serif text-center w-full">
                  <p className="text-[6.5pt] font-bold leading-tight">{line1Text}</p>
                  <p className="text-[5.8pt] font-semibold italic leading-tight">{line2Text}</p>
                  <div className="flex items-center justify-between gap-[1mm] my-[0.5mm] w-full px-[0.5mm]">
                    {qrDataUrl && (
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <img src={qrDataUrl} alt="QR" className="w-[15mm] h-[15mm] object-contain" />
                        <span className="text-[2.8pt] font-mono font-bold text-black uppercase tracking-tight leading-none mt-[0.2mm]">
                          SCAN QR PASSPORT
                        </span>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-[0.5mm]">
                      <p className="text-[5.5pt] font-mono font-black uppercase text-black tracking-wider leading-tight">
                        READY TO EAT
                      </p>
                      {/* Double space */}
                      <div className="h-[0.8mm]" />
                      <p className="text-[4pt] font-serif font-black uppercase text-black tracking-widest leading-tight">
                        MADE IN CAMBODIA
                      </p>
                    </div>
                  </div>
                  <p className="text-[6pt] font-serif font-black text-center mt-[0.5mm]">
                    {netWeightDisplay || '50g'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 4: Mixed User Flavors Sheet (Pepper + Sugar + Light Chili + Hot Chili) */}
        {printSheetType === 'all-user-flavors-mix-35up' && (
          <div className="w-[190mm] h-[277mm] mx-auto grid grid-cols-5 grid-rows-7 gap-[2mm] p-[2mm] box-border">
            {Array.from({ length: 35 }).map((_, i) => {
              const flavor = flavorList[i % flavorList.length] || flavorList[0];
              return (
                <div 
                  key={i} 
                  className="border border-black rounded-[2mm] p-[1.2mm] flex flex-col justify-between items-center text-center bg-white box-border overflow-hidden"
                >
                  {/* Top: Product Line 1 & Line 2 (Larger) */}
                  <div className="w-full text-center font-serif leading-tight border-b border-black/20 pb-[0.3mm]">
                    <p className="text-[7pt] font-bold text-black truncate">
                      {flavor.nameEnLine1}
                    </p>
                    <p className="text-[6.2pt] font-semibold italic text-black truncate mt-[0.2mm]">
                      {flavor.nameEnLine2}
                    </p>
                  </div>

                  {/* Center: QR (Larger) with 'SCAN QR PASSPORT' & direct READY TO EAT / MADE IN CAMBODIA With Double Space */}
                  <div className="w-full flex items-center justify-between gap-[1mm] my-[0.3mm] px-[0.5mm]">
                    {qrDataUrl && (
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <img src={qrDataUrl} alt="QR" className="w-[18mm] h-[18mm] object-contain" />
                        <span className="text-[3.2pt] font-mono font-bold text-black uppercase tracking-tight leading-none mt-[0.3mm]">
                          SCAN QR PASSPORT
                        </span>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-[0.5mm]">
                      <p className="text-[6.2pt] font-mono font-black uppercase text-black tracking-wider leading-tight">
                        READY TO EAT
                      </p>
                      {/* Double space */}
                      <div className="h-[1.2mm]" />
                      <p className="text-[4.2pt] font-serif font-black uppercase text-black tracking-widest leading-tight">
                        MADE IN CAMBODIA
                      </p>
                    </div>
                  </div>

                  {/* Bottom: 50g in center */}
                  <div className="w-full pt-[0.3mm] border-t border-black/30 flex items-center justify-center">
                    <span className="text-[6.5pt] font-serif font-black text-black">
                      {netWeightDisplay || '50g'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
