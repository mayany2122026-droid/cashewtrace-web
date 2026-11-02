import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, Download, QrCode, Sparkles, CheckCircle2, Copy, Check, Eye, 
  Tag, Package, ShieldCheck, Flame, Info, ExternalLink, RefreshCw, Upload,
  Layers, ChevronRight, Sliders, Scissors, Award, AlertCircle, FileText,
  Smartphone, Share2, ZoomIn, CheckSquare, Plus, Trash2, Edit3, Settings2, 
  Percent, ListPlus, Building2, Store, Calendar, Clock, Coffee, Stamp,
  Maximize2, X, ZoomOut
} from 'lucide-react';
import QRCode from 'qrcode';
import VoiceStoryRecorder from './VoiceStoryRecorder';

export interface JarProductItem {
  id: string;
  flavorKey: 'pepper' | 'sugar' | 'light-chili' | 'hot-chili' | 'natural-salted';
  nameKh: string;
  nameEnLine1: string;
  nameEnLine2: string;
  flavorTagKh: string;
  flavorTagEn: string;
  accentColor: string; // Background / text accent
  badgeBg: string;
  badgeTextColor: string;
  kernelColor: string;
  spiceColor: string;
  pepperSpecks: boolean;
  chiliFlakes: boolean;
  sugarGlaze: boolean;
  defaultBatchLot: string;
  jarCountToday: number;
  cashewPercent: number;
  spiceNameKh: string;
  spiceNameEn: string;
  spicePercent: number;
  sugarPercent: number;
  saltPercent: number;
  bbdMonths: number;
}

// Universal / General Retail Presets for Minimarts, Cafes & Supermarkets
export const UNIVERSAL_JAR_PRESETS: JarProductItem[] = [
  {
    id: 'jar-pepper-5-adult',
    flavorKey: 'pepper',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពត GI YAS 5% (Pepper Coated)',
    nameEnLine1: 'Cashew Kernel',
    nameEnLine2: 'Pepper Coated 5%',
    flavorTagKh: 'ស្រោបម្រេច 5% (ពេញនិយម)',
    flavorTagEn: 'GI Pepper 5% (Adults)',
    accentColor: '#7f1d1d', // Rich burgundy / maroon
    badgeBg: '#450a0a',
    badgeTextColor: '#fecaca',
    kernelColor: '#b47b42',
    spiceColor: '#1c1917',
    pepperSpecks: true,
    chiliFlakes: false,
    sugarGlaze: false,
    defaultBatchLot: 'MY-PEP5-01',
    jarCountToday: 15,
    cashewPercent: 90,
    spiceNameKh: 'ម្រេចខ្មៅកំពត GI YAS ៥%',
    spiceNameEn: 'GI YAS Kampot Pepper 5%',
    spicePercent: 5,
    sugarPercent: 3,
    saltPercent: 2,
    bbdMonths: 12
  },
  {
    id: 'jar-pepper-3-kids',
    flavorKey: 'pepper',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពត GI YAS 3% សម្រាប់កុមារ',
    nameEnLine1: 'Cashew Kernel',
    nameEnLine2: 'Mild Pepper 3%',
    flavorTagKh: 'ស្រោបម្រេច 3% (កុមារ)',
    flavorTagEn: 'Mild Pepper 3% (Kids)',
    accentColor: '#991b1b', // Slightly softer red
    badgeBg: '#581c87',
    badgeTextColor: '#fae8ff',
    kernelColor: '#d97706',
    spiceColor: '#292524',
    pepperSpecks: true,
    chiliFlakes: false,
    sugarGlaze: false,
    defaultBatchLot: 'MY-PEP3-02',
    jarCountToday: 8,
    cashewPercent: 92,
    spiceNameKh: 'ម្រេចខ្មៅកំពត GI YAS ៣% (ហឹរស្រាល)',
    spiceNameEn: 'GI YAS Kampot Pepper 3% (Mild)',
    spicePercent: 3,
    sugarPercent: 3,
    saltPercent: 2,
    bbdMonths: 12
  },
  {
    id: 'jar-sugar-100g',
    flavorKey: 'sugar',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្នោត (Sugar Coated)',
    nameEnLine1: 'Cashew Kernel',
    nameEnLine2: 'Sugar Coated',
    flavorTagKh: 'ស្រោបស្ករ Sugar',
    flavorTagEn: 'Sugar Coated',
    accentColor: '#92400e', // Warm amber brown / caramel
    badgeBg: '#451a03',
    badgeTextColor: '#fde68a',
    kernelColor: '#d97706',
    spiceColor: '#78350f',
    pepperSpecks: false,
    chiliFlakes: false,
    sugarGlaze: true,
    defaultBatchLot: 'MY-SUG-03',
    jarCountToday: 6,
    cashewPercent: 88,
    spiceNameKh: 'ស្ករត្នោតធម្មជាតិ / ស្ករស',
    spiceNameEn: 'Pure Sugar Glaze',
    spicePercent: 8,
    sugarPercent: 0,
    saltPercent: 2,
    bbdMonths: 10
  },
  {
    id: 'jar-light-chili-100g',
    flavorKey: 'light-chili',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (Chili Coated)',
    nameEnLine1: 'Cashew Kernel',
    nameEnLine2: 'Chili Coated',
    flavorTagKh: 'ស្រោបម្ទេស Chili',
    flavorTagEn: 'Chili Coated',
    accentColor: '#c2410c', // Bright pleasant orange-red
    badgeBg: '#7c2d12',
    badgeTextColor: '#ffedd5',
    kernelColor: '#ea580c',
    spiceColor: '#9a3412',
    pepperSpecks: false,
    chiliFlakes: true,
    sugarGlaze: false,
    defaultBatchLot: 'MY-CHL-04',
    jarCountToday: 5,
    cashewPercent: 92,
    spiceNameKh: 'ម្ទេសធម្មជាតិ (Mild Chili)',
    spiceNameEn: 'Chili Seasoning',
    spicePercent: 2,
    sugarPercent: 4,
    saltPercent: 2,
    bbdMonths: 12
  }
];

interface JarBanner100gDesignerProps {
  currentBrandLogo?: string;
  companyName?: string;
  companyAddress?: string;
  onSelectFlavor?: (flavor: JarProductItem) => void;
}

export default function JarBanner100gDesigner({
  currentBrandLogo = '/mayany_official_logo.jpg',
  companyName = 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)',
  companyAddress = 'ភូមិ១ សង្កាត់៤ ក្រុងព្រះសីហនុ ខេត្តព្រះសីហនុ',
  onSelectFlavor
}: JarBanner100gDesignerProps) {
  // Universal products state (Standard for Minimarts, Cafes & Retailers)
  const [flavorList, setFlavorList] = useState<JarProductItem[]>(UNIVERSAL_JAR_PRESETS);
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>('jar-pepper-5-adult');
  const activeFlavor = flavorList.find(f => f.id === selectedFlavorId) || flavorList[0];

  // Editable label fields (Standard naming: Cashew Kernel Pepper Coated / Sugar Coated / Chili Coated)
  const [line1Text, setLine1Text] = useState<string>(activeFlavor.nameEnLine1);
  const [line2Text, setLine2Text] = useState<string>(activeFlavor.nameEnLine2);
  const [nameKhmerText, setNameKhmerText] = useState<string>(activeFlavor.nameKh);
  const [netWeightDisplay, setNetWeightDisplay] = useState<string>('100g');
  const [lotCode, setLotCode] = useState<string>(activeFlavor.defaultBatchLot);
  
  // Production Dates (For recording and stamping on jar)
  const todayStr = new Date().toISOString().split('T')[0];
  const [mfdDate, setMfdDate] = useState<string>(todayStr);
  const [bbdDate, setBbdDate] = useState<string>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  // Label Dimension & Style (Default 35mm height for 40mm jar body)
  const [bannerSizePreset, setBannerSizePreset] = useState<'95x35' | '105x35' | '115x35' | '85x35' | '80x30' | 'custom'>('95x35');
  const [customWidthMm, setCustomWidthMm] = useState<number>(95);
  const [customHeightMm, setCustomHeightMm] = useState<number>(35);
  const [logoSizePreset, setLogoSizePreset] = useState<'small' | 'standard' | 'classic'>('standard');
  const [bannerTheme, setBannerTheme] = useState<'flavor-auto' | 'black-noir' | 'crimson-red' | 'clean-white'>('flavor-auto');
  const [khmerFontPreset, setKhmerFontPreset] = useState<'moul' | 'moulpali' | 'kantumruy' | 'bayon' | 'battambang' | 'siemreap'>('moul');
  const [printLayoutMode, setPrintLayoutMode] = useState<'active-flavor-full-sheet' | 'mixed-batch-21jars'>('active-flavor-full-sheet');
  
  // Brand Logo
  const [activeBrandLogo, setActiveBrandLogo] = useState<string>(() => {
    return localStorage.getItem('cashewtrace_sme_brand_logo') || currentBrandLogo || '/mayany_official_logo.jpg';
  });
  const jarLogoInputRef = useRef<HTMLInputElement>(null);

  // Dynamic QR Code Generation
  const [qrTargetUrl, setQrTargetUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [showQrTester, setShowQrTester] = useState<boolean>(false);

  // Big Screen Label Inspection / Decision Modal
  const [isInspectModalOpen, setIsInspectModalOpen] = useState<boolean>(false);
  const [inspectZoomScale, setInspectZoomScale] = useState<number>(1.75);

  // Synchronize when switching flavor
  const handleSwitchFlavor = (flavorId: string) => {
    setSelectedFlavorId(flavorId);
    const found = flavorList.find(f => f.id === flavorId);
    if (found) {
      setLine1Text(found.nameEnLine1);
      setLine2Text(found.nameEnLine2);
      setNameKhmerText(found.nameKh);
      setLotCode(found.defaultBatchLot);
      if (onSelectFlavor) {
        onSelectFlavor(found);
      }
    }
  };

  // Update jar count for today's batch
  const handleUpdateJarCount = (flavorId: string, count: number) => {
    setFlavorList(prev => prev.map(f => f.id === flavorId ? { ...f, jarCountToday: Math.max(0, count) } : f));
  };

  // Construct Clean, Compact QR Target URL for Instant Optical Scannability
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const batchParam = encodeURIComponent(lotCode || 'MY-PEP100-01');
    const flavorParam = encodeURIComponent(line2Text || 'Pepper Coated');
    const prodParam = encodeURIComponent(line1Text || 'Cashew Kernel');
    const wtParam = encodeURIComponent(netWeightDisplay || '100g');
    const spicePctParam = activeFlavor.spicePercent || 5;
    const cashewPctParam = activeFlavor.cashewPercent || 90;
    const mfdParam = encodeURIComponent((activeFlavor as any).mfdDate || '16/08/2026');
    const expParam = encodeURIComponent((activeFlavor as any).expDate || '16/02/2028');

    // Compact URL ensures low-density QR matrix with large modules for effortless phone scanning
    const url = `${origin}${pathname}?project=passport&mode=passport&batch=${batchParam}&flavor=${flavorParam}&product=${prodParam}&weight=${wtParam}&cashewPct=${cashewPctParam}&spicePct=${spicePctParam}&mfd=${mfdParam}&exp=${expParam}`;
    setQrTargetUrl(url);
  }, [lotCode, line1Text, line2Text, activeFlavor, netWeightDisplay]);

  // Generate crisp, low-density QR code data URL (Error Correction L for largest dot size)
  useEffect(() => {
    const generateQr = async () => {
      try {
        const url = await QRCode.toDataURL(qrTargetUrl || 'https://cashewtrace.app', {
          errorCorrectionLevel: 'L',
          margin: 1,
          width: 480,
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

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setActiveBrandLogo(result);
        localStorage.setItem('cashewtrace_sme_brand_logo', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalJarsToday = flavorList.reduce((acc, f) => acc + (f.jarCountToday || 0), 0);

  // Render a Single Universal Rectangular Banner Sticker
  const renderStickerElement = (flavorItem: JarProductItem, isPrintMode: boolean = false) => {
    const flavorTitle1 = flavorItem.nameEnLine1 || 'Cashew Kernel';
    const flavorTitle2 = flavorItem.nameEnLine2;
    const titleKhmer = flavorItem.nameKh.split('(')[0].trim();

    // Determine theme mode: auto by flavor or manually forced
    const effectiveTheme = bannerTheme === 'flavor-auto'
      ? (flavorItem.flavorKey === 'pepper' ? 'black' : flavorItem.flavorKey === 'sugar' ? 'white' : 'red')
      : (bannerTheme === 'black-noir' ? 'black' : bannerTheme === 'crimson-red' ? 'red' : 'white');

    const isBlack = effectiveTheme === 'black';
    const isRed = effectiveTheme === 'red';
    const isWhite = effectiveTheme === 'white';

    // Theme style configurations
    const cardBgClass = isBlack
      ? 'bg-gradient-to-r from-stone-950 via-[#0d0d0d] to-stone-950 text-white border-2 border-amber-500/80 shadow-md'
      : isRed
      ? 'bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white border-2 border-amber-400 shadow-md'
      : 'bg-gradient-to-r from-white via-stone-50 to-white text-stone-950 border-2 border-stone-800 shadow-md';

    const innerBorderClass = isBlack
      ? 'border-amber-500/30'
      : isRed
      ? 'border-amber-300/35'
      : 'border-stone-300';

    const brandSectionBorder = isBlack
      ? 'border-amber-500/30'
      : isRed
      ? 'border-amber-400/30'
      : 'border-stone-300';

    const brandMayanyColor = isBlack
      ? 'text-amber-400'
      : isRed
      ? 'text-amber-300'
      : 'text-amber-700';

    const brandEnterpriseColor = isBlack
      ? 'text-stone-200'
      : isRed
      ? 'text-white'
      : 'text-stone-800';

    const brandCountryColor = isBlack
      ? 'text-amber-200/80'
      : isRed
      ? 'text-amber-200/90'
      : 'text-stone-500';

    const khmerTitleColor = (isBlack || isRed) ? 'text-white' : 'text-stone-950';

    const englishLine1Color = isBlack
      ? 'text-stone-300'
      : isRed
      ? 'text-amber-100'
      : 'text-stone-700';

    const englishLine2Color = isBlack
      ? '#fbbf24' // Bright amber gold on black
      : isRed
      ? '#fef08a' // Bright yellow on deep red
      : '#b45309'; // Rich caramel amber on white

    const readyToEatColor = isBlack
      ? 'text-amber-400'
      : isRed
      ? 'text-amber-300'
      : 'text-amber-800';

    const dividerBorderClass = isBlack
      ? 'border-amber-500/25'
      : isRed
      ? 'border-amber-300/30'
      : 'border-stone-300';

    const netWeightBadgeClass = isBlack
      ? 'bg-amber-400 text-stone-950 border border-amber-300 shadow-xs'
      : isRed
      ? 'bg-stone-950 text-amber-300 border border-amber-400/80 shadow-xs'
      : 'bg-stone-950 text-amber-300 border border-stone-800 shadow-xs';

    const qrLabelClass = (isBlack || isRed) ? 'text-amber-200/90' : 'text-stone-600';

    const logoSizeClass = logoSizePreset === 'small' 
      ? 'w-8 h-8 sm:w-9 sm:h-9' 
      : logoSizePreset === 'classic' 
      ? 'w-11 h-11 sm:w-12 sm:h-12' 
      : 'w-10 h-10 sm:w-10.5 sm:h-10.5';

    return (
      <div 
        className={`relative overflow-hidden transition-all select-none ${cardBgClass} ${
          isPrintMode ? 'w-full h-full' : 'w-full max-w-[440px] h-[140px] rounded-xl shadow-lg'
        }`}
        style={{
          boxSizing: 'border-box',
          padding: '6px 10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        {/* Subtle decorative inner framing */}
        <div className={`absolute inset-1 pointer-events-none border ${innerBorderClass} rounded-lg`} />

        {/* LEFT SECTION: BRAND LOGO & OFFICIAL SEAL (~27% width, downsized & balanced - 20mm BORDERLESS LOGO DIRECT) */}
        <div className={`w-[27%] shrink-0 h-full flex flex-col items-center justify-center text-center pr-1.5 border-r ${brandSectionBorder} relative z-10`}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center mb-1">
            <img 
              src={activeBrandLogo} 
              alt="Mayany Enterprise" 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <span className={`text-[8.5px] font-black uppercase tracking-wider leading-tight font-serif ${brandMayanyColor}`}>
            MAYANY
          </span>
          <span className={`text-[6.5px] font-bold tracking-tight uppercase leading-none ${brandEnterpriseColor}`}>
            ENTERPRISE
          </span>
          <span className={`text-[6px] font-semibold tracking-wider uppercase mt-0.5 ${brandCountryColor}`}>
            Cambodia
          </span>
        </div>

        {/* RIGHT SECTION: PRODUCT NAME (KHMER + 3 STRAIGHT ENGLISH LINES), 100G, QR CODE (~73% width) */}
        <div className="w-[73%] h-full flex flex-col justify-between pl-2 pr-1 relative z-10 py-1.5">
          
          {/* TOP / CENTER: PRODUCT TITLE (LOWERED DOWN WITH AMPLE CLEARANCE SO KHMER DIACRITICS ARE NEVER CLIPPED) */}
          <div className="space-y-1 pt-1">
            {/* Khmer Product Name with Selected Khmer Font (Moul / Mool Boran by default) - Full Height & Safe Clearance */}
            <div className="overflow-visible py-0.5">
              <h3 className={`leading-normal tracking-tight whitespace-nowrap overflow-visible ${
                khmerFontPreset === 'moul'
                  ? 'font-moul text-[8.5px]'
                  : khmerFontPreset === 'moulpali'
                  ? 'font-moulpali text-[8.5px]'
                  : khmerFontPreset === 'kantumruy'
                  ? 'font-kantumruy font-black text-[9px]'
                  : khmerFontPreset === 'bayon'
                  ? 'font-bayon text-[9px]'
                  : khmerFontPreset === 'battambang'
                  ? 'font-battambang font-bold text-[9px]'
                  : 'font-siemreap font-bold text-[9px]'
              } ${khmerTitleColor}`} title={titleKhmer}>
                {titleKhmer}
              </h3>
            </div>

            {/* 3 Straight English Lines: Cashew Kernel -> Flavor Coated -> Ready to Eat */}
            <div className="font-serif leading-tight space-y-0.5 pt-0.5">
              {/* Line 1: Cashew Kernel */}
              <p className={`text-[8.5px] font-bold tracking-wider uppercase ${englishLine1Color}`}>
                {flavorTitle1}
              </p>

              {/* Line 2: Pepper Coated / Chili Coated / Sugar Coated */}
              <p className="text-[10px] font-black tracking-normal uppercase" style={{ color: englishLine2Color }}>
                {flavorTitle2}
              </p>

              {/* Line 3: Ready to Eat */}
              <p className={`text-[7.5px] font-bold font-sans tracking-widest uppercase ${readyToEatColor}`}>
                Ready to Eat
              </p>
            </div>
          </div>

          {/* BOTTOM ROW: 100G (LEFT) + QR CODE PASSPORT (RIGHT) - BALANCED VERTICAL GAP */}
          <div className={`flex items-center justify-between gap-1.5 pt-1.5 border-t ${dividerBorderClass}`}>
            
            {/* LEFT: 100G NET WEIGHT BADGE */}
            <div className="flex items-center justify-start flex-1 min-w-0">
              <span className={`inline-flex items-center justify-center font-mono font-black text-[10.5px] px-2 py-0.5 rounded leading-none ${netWeightBadgeClass}`}>
                <span>{netWeightDisplay}</span>
              </span>
            </div>

            {/* RIGHT: QR Code Container (Clickable for Instant Phone Scanning Test) */}
            <div 
              className="flex items-center gap-1 shrink-0 cursor-pointer group"
              onClick={() => setShowQrTester(true)}
              title="ចុចដើម្បីតេស្តស្កេន QR Code (Click to test scan)"
            >
              <div className={`flex flex-col text-[6px] font-mono leading-tight text-right ${qrLabelClass}`}>
                <span className="font-bold tracking-tight">SCAN QR</span>
                <span className="text-[5px]">Passport</span>
              </div>
              <div className="w-8 h-8 bg-white p-0.5 rounded border border-stone-400 shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Traceability QR" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-[6px] font-mono">QR</div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* HEADER BANNER: GENERAL MULTI-PURPOSE RETAIL LABELS */}
      <div className="bg-gradient-to-r from-stone-900 via-[#1c1917] to-stone-900 text-white p-5 rounded-2xl border-2 border-amber-500/70 shadow-xl no-print space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center flex-wrap gap-2">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-[10.5px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider font-mono shadow-sm flex items-center gap-1.5">
                <Store size={13} />
                <span>General Retail & Mass Printing • ស្លាកបិទកំប៉ុងទូទៅ ១០០g</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Clean Bulk Label (ព្រីនទុកម្ដងរាប់រយសន្លឹក • បោះត្រាលើកំប៉ុងពេលផលិត)</span>
              </span>
            </div>

            <h2 className="text-lg font-black text-amber-300 font-serif flex items-center gap-2">
              <span>ស្លាកបដាផ្ដេកបិទកំប៉ុងថ្លា ១០០g (Universal 100g PET Jar Banner Sticker)</span>
            </h2>

            <p className="text-stone-300 text-xs leading-relaxed max-w-3xl font-sans">
              ស្លាកស្ទីកឃ័រស្តង់ដារទូទៅ ប្រើប្រាស់បានគ្រប់ទីកន្លែង (Minimart, ហាងកាហ្វេ, ផ្សារទំនើប)៖ 
              ឈ្មោះផលិតផលស្តង់ដារ <strong>Cashew Kernel Pepper Coated / Sugar Coated / Chili Coated</strong> 
              រចនាឡើងយ៉ាងស្អាតបាត <strong>គ្មានប្រអប់បោះត្រាលើស្លាកឡើយ</strong> ងាយស្រួលបញ្ជាព្រីនស្ទីកឃ័ររាប់រយ ឬរាប់ពាន់សន្លឹកទុកជាមុន 
              ហើយនៅពេលច្រកផលិតជាក់ស្ដែង ទើបយកត្រាមកបោះកាលបរិច្ឆេទ <strong>BBD / EXP & LOT ផ្ទាល់លើកំប៉ុងថ្លា PET</strong> យ៉ាងរហ័ស និងមានរបៀបរៀបរយបំផុត!
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col items-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-black px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg cursor-pointer text-xs"
            >
              <Printer size={16} />
              <span>ព្រីនសន្លឹកស្លាក A4 (Print Label Sheet)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrTester(!showQrTester)}
              className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 text-[11px] cursor-pointer"
            >
              <Smartphone size={13} />
              <span>{showQrTester ? 'បិទតេស្ត QR' : 'តេស្តស្កេន QR Passport (Test Scan)'}</span>
            </button>
          </div>
        </div>

        {/* 3 FLAVOR QUICK SELECTOR (GENERAL RETAIL FLAVORS) */}
        <div className="pt-3 border-t border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-3">
          {flavorList.map((flavor, fIdx) => {
            const isSelected = flavor.id === selectedFlavorId;
            return (
              <div
                key={flavor.id}
                onClick={() => handleSwitchFlavor(flavor.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-300 shadow-md ring-2 ring-amber-400/60 scale-[1.01]'
                    : 'bg-stone-900/90 hover:bg-stone-800 text-white border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10.5px] font-mono mb-1">
                  <span className={isSelected ? 'text-stone-950 font-black' : 'text-amber-400'}>
                    រសជាតិ #{fIdx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`w-2.5 h-2.5 rounded-full border ${
                      flavor.flavorKey === 'pepper' 
                        ? 'bg-black border-amber-400' 
                        : flavor.flavorKey === 'sugar' 
                        ? 'bg-white border-stone-400' 
                        : 'bg-red-700 border-amber-300'
                    }`} />
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-stone-950 text-amber-300' : 'bg-stone-800 text-stone-300 border border-stone-700'
                    }`}>
                      {flavor.flavorTagEn}
                    </span>
                  </div>
                </div>

                <div className="font-serif my-1">
                  <h4 className="text-sm font-black leading-tight">
                    {flavor.nameEnLine1}{' '}
                    <span style={{ color: isSelected ? '#5c1d11' : flavor.accentColor }}>
                      {flavor.nameEnLine2}
                    </span>
                  </h4>
                  <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                    {flavor.nameKh}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-current/20 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[9px] opacity-75">ទម្ងន់: 100g</span>
                  <span className="text-[9px] font-mono font-bold">{flavor.defaultBatchLot}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Scanner Tester Drawer */}
      {showQrTester && (
        <div className="bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-500/50 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white p-1 rounded-xl shrink-0">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 font-mono">
                <Sparkles size={13} />
                <span>QR Code Traceability Passport URL:</span>
              </span>
              <p className="text-[11px] text-stone-300 font-mono break-all max-w-xl">
                {qrTargetUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(qrTargetUrl);
                setCopiedUrl(true);
                setTimeout(() => setCopiedUrl(false), 2000);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"
            >
              {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedUrl ? 'បានចម្លង!' : 'ចម្លង Link QR'}</span>
            </button>
            <a
              href={qrTargetUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/40 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs"
            >
              <ExternalLink size={14} />
              <span>បើកមើល Passport</span>
            </a>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKBENCH: REALISTIC 3D PET JAR VISUALIZER (LEFT) + CONTROLS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
        
        {/* LEFT COLUMN: REALISTIC 100G CLEAR PET CYLINDER JAR MOCKUP (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-stone-900 via-stone-800 to-stone-950 p-6 rounded-2xl border border-stone-700 shadow-2xl text-center relative overflow-hidden">
            
            <div className="flex items-center justify-between text-left mb-3">
              <div>
                <span className="text-[9.5px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                  Realistic Clear PET Jar View
                </span>
                <h4 className="text-xs font-bold text-white">
                  100g Clear PET Jar (Ø 68mm × H 55mm)
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInspectModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-2.5 py-1 rounded-lg text-[10.5px] transition flex items-center gap-1 cursor-pointer shadow-sm"
                  title="ចុចពង្រីកមើលស្លាកធំ ឬចុចពីរដងលើស្លាក (Double click label to inspect)"
                >
                  <Maximize2 size={12} />
                  <span>ពង្រីកធំ (Inspect)</span>
                </button>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9.5px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {activeFlavor.nameEnLine2}
                </span>
              </div>
            </div>

            {/* REALISTIC PET CYLINDER JAR GRAPHIC */}
            <div className="relative py-6 flex flex-col items-center justify-center">
              
              {/* White Translucent Lid (Top) */}
              <div className="w-56 h-6 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 rounded-t-lg border-2 border-slate-300 shadow-md flex items-center justify-center relative z-20">
                <div className="w-full h-1 bg-white/80 rounded-full mb-1" />
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  Airtight Lid
                </span>
              </div>

              {/* Clear Transparent PET Jar Body */}
              <div className="w-52 h-44 bg-gradient-to-r from-white/30 via-white/10 to-white/30 backdrop-blur-xs rounded-b-xl border-2 border-white/40 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center z-10">
                
                {/* Background Cashews Simulation inside the clear jar */}
                <div className="absolute inset-0 p-2 opacity-90 flex flex-wrap gap-1.5 justify-center items-center overflow-hidden pointer-events-none">
                  {Array.from({ length: 14 }).map((_, kIdx) => (
                    <div 
                      key={kIdx}
                      className="w-10 h-7 rounded-full shadow-sm transform transition-transform"
                      style={{
                        backgroundColor: activeFlavor.kernelColor,
                        transform: `rotate(${((kIdx * 47) % 180) - 90}deg) scale(${0.85 + (kIdx % 3) * 0.1})`,
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    >
                      {activeFlavor.pepperSpecks && (
                        <div className="w-full h-full flex flex-wrap gap-0.5 p-0.5 justify-center items-center opacity-70">
                          <span className="w-1 h-1 bg-black rounded-full" />
                          <span className="w-0.5 h-0.5 bg-black rounded-full" />
                          <span className="w-1 h-1 bg-black rounded-full" />
                        </div>
                      )}
                      {activeFlavor.chiliFlakes && (
                        <div className="w-full h-full flex flex-wrap gap-0.5 p-0.5 justify-center items-center opacity-80">
                          <span className="w-1.5 h-1 bg-red-700 rounded-xs" />
                          <span className="w-1 h-1 bg-orange-600 rounded-xs" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Glare/Reflection on PET Jar surface */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

                {/* Rectangular Banner Sticker Adhered to Front of Jar (With Double-Click to Expand/Inspect) */}
                <div 
                  onDoubleClick={() => setIsInspectModalOpen(true)}
                  title="ចុចពីរដង (Double-Click) ដើម្បីពង្រីកមើលស្លាកធំ ឬបញ្ជាក់គុណភាពមុនព្រីន"
                  className="relative z-20 w-[92%] shadow-2xl transform hover:scale-105 transition-transform duration-200 cursor-zoom-in group"
                >
                  {renderStickerElement(activeFlavor, false)}
                  <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/10 transition-colors rounded-xl flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-amber-300 text-[8px] font-mono px-2 py-0.5 rounded-full border border-amber-400/50 shadow-md">
                      Double Click to Enlarge 🔍
                    </span>
                  </div>
                </div>

                {/* Direct Jar Date Ink Stamp Simulation (Direct on Jar Body / Bottom) */}
                <div className="relative z-20 mt-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs border border-white/20 rounded text-[7.5px] font-mono text-amber-200 flex items-center gap-1.5 shadow-sm">
                  <Stamp size={10} className="text-amber-400" />
                  <span>[បោះត្រាលើកំប៉ុងផ្ទាល់] EXP: {bbdDate} • LOT: {lotCode || activeFlavor.defaultBatchLot}</span>
                </div>

              </div>

              {/* Jar Bottom Shadow */}
              <div className="w-44 h-3 bg-black/60 rounded-full blur-xs mt-1" />
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-800 text-[10.5px] text-stone-400">
              <span>ចុចពីរដង (Double click) លើស្លាកដើម្បីពង្រីកធំ</span>
              <button
                type="button"
                onClick={() => setIsInspectModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 size={11} />
                <span>ពិនិត្យស្លាកកម្រិត HD</span>
              </button>
            </div>
          </div>

          {/* Direct Jar Stamping Workflow Guidance Card */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-sans">
              <Stamp size={14} className="text-emerald-600" />
              <span>របៀបដំណើរការបោះត្រាលើកំប៉ុង (Direct Jar Stamping Workflow):</span>
            </h4>

            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-2 text-stone-800">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-mono">1</span>
                <div>
                  <h5 className="text-[11.5px] font-bold text-emerald-950">ព្រីនស្លាកជាដុំរាប់រយសន្លឹក (Mass Label Printing)</h5>
                  <p className="text-[10px] text-emerald-900/80">
                    ស្លាកត្រូវបានរចនាស្អាតបាត គ្មានប្រអប់បោះត្រាលើស្លាកឡើយ ល្អបំផុតសម្រាប់ព្រីនរាប់រយ ឬរាប់ពាន់សន្លឹកទុកជាមុន។
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-emerald-200/60">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-mono">2</span>
                <div>
                  <h5 className="text-[11.5px] font-bold text-amber-950">បោះត្រាលើកំប៉ុងពេលផលិត (Stamp on Jar / Lid)</h5>
                  <p className="text-[10px] text-amber-900/80">
                    នៅពេលចាប់ផ្ដើមផលិតច្រកកំប៉ុងជាក់ស្ដែង ទើបយកត្រាទឹកថ្នាំមកបោះកាលបរិច្ឆេទ <strong>BBD/EXP និង LOT</strong> លើកំប៉ុង ឬគម្របដោយផ្ទាល់។
                  </p>
                </div>
              </div>
            </div>

            {/* Label Dimensions Specs (Standard 35mm Height for 40mm Jar Body) */}
            <div className="pt-2 border-t border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-stone-800">
                  ទំហំស្លាកបដាកំប៉ុង 35mm (35mm Height Standard Dimensions):
                </label>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  កម្ពស់ស្តង់ដារ 35mm
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setBannerSizePreset('95x35');
                    setCustomWidthMm(95);
                    setCustomHeightMm(35);
                  }}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    bannerSizePreset === '95x35'
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                  }`}
                >
                  <span className="block text-xs font-black font-mono">95 × 35 mm</span>
                  <span className="text-[8.5px] opacity-80 block">ស្តង់ដារ 14/A4</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBannerSizePreset('105x35');
                    setCustomWidthMm(105);
                    setCustomHeightMm(35);
                  }}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    bannerSizePreset === '105x35'
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                  }`}
                >
                  <span className="block text-xs font-black font-mono">105 × 35 mm</span>
                  <span className="text-[8.5px] opacity-80 block">បដាវែង 12/A4</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBannerSizePreset('115x35');
                    setCustomWidthMm(115);
                    setCustomHeightMm(35);
                  }}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    bannerSizePreset === '115x35'
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                  }`}
                >
                  <span className="block text-xs font-black font-mono">115 × 35 mm</span>
                  <span className="text-[8.5px] opacity-80 block">វែងទូលាយ 10/A4</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBannerSizePreset('85x35');
                    setCustomWidthMm(85);
                    setCustomHeightMm(35);
                  }}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    bannerSizePreset === '85x35'
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                  }`}
                >
                  <span className="block text-xs font-black font-mono">85 × 35 mm</span>
                  <span className="text-[8.5px] opacity-80 block">បដាខ្លី 16/A4</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBannerSizePreset('80x30');
                    setCustomWidthMm(80);
                    setCustomHeightMm(30);
                  }}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    bannerSizePreset === '80x30'
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                  }`}
                >
                  <span className="block text-xs font-black font-mono">80 × 30 mm</span>
                  <span className="text-[8.5px] opacity-80 block">តូចខ្លី 18/A4</span>
                </button>
              </div>

              {/* Lengthening Slider: Custom Width Control */}
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-stone-700">តម្រឹមប្រវែងបណ្ដោយស្លាក (Lengthen / Adjust Label Width):</span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                    {customWidthMm} mm × {customHeightMm} mm
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-stone-500 font-mono">75mm (ខ្លី)</span>
                  <input
                    type="range"
                    min={75}
                    max={125}
                    step={1}
                    value={customWidthMm}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCustomWidthMm(val);
                      if (val === 95 && customHeightMm === 35) setBannerSizePreset('95x35');
                      else if (val === 105 && customHeightMm === 35) setBannerSizePreset('105x35');
                      else if (val === 115 && customHeightMm === 35) setBannerSizePreset('115x35');
                      else if (val === 85 && customHeightMm === 35) setBannerSizePreset('85x35');
                      else if (val === 80 && customHeightMm === 30) setBannerSizePreset('80x30');
                      else setBannerSizePreset('custom');
                    }}
                    className="flex-1 accent-amber-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                  />
                  <span className="text-[10px] text-stone-500 font-mono">125mm (វែង)</span>
                </div>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="pt-2 border-t border-stone-200">
              <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                រចនាបថពណ៌ផ្ទៃស្លាក (Sticker Background Color Theme):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setBannerTheme('flavor-auto')}
                  className={`p-2 rounded-xl text-center border text-[10.5px] font-bold transition cursor-pointer ${
                    bannerTheme === 'flavor-auto'
                      ? 'bg-amber-500 text-stone-950 font-black border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
                  }`}
                >
                  🎨 តាមរសជាតិ (Auto)
                </button>
                <button
                  type="button"
                  onClick={() => setBannerTheme('black-noir')}
                  className={`p-2 rounded-xl text-center border text-[10.5px] font-bold transition cursor-pointer ${
                    bannerTheme === 'black-noir'
                      ? 'bg-stone-950 text-amber-300 font-black border-amber-500 shadow-xs ring-2 ring-stone-900'
                      : 'bg-stone-900 text-stone-200 border-stone-800'
                  }`}
                >
                  ⚫ Pepper (Black)
                </button>
                <button
                  type="button"
                  onClick={() => setBannerTheme('crimson-red')}
                  className={`p-2 rounded-xl text-center border text-[10.5px] font-bold transition cursor-pointer ${
                    bannerTheme === 'crimson-red'
                      ? 'bg-red-800 text-amber-200 font-black border-amber-400 shadow-xs ring-2 ring-red-700'
                      : 'bg-red-950 text-red-100 border-red-900'
                  }`}
                >
                  🔴 Chili (Red)
                </button>
                <button
                  type="button"
                  onClick={() => setBannerTheme('clean-white')}
                  className={`p-2 rounded-xl text-center border text-[10.5px] font-bold transition cursor-pointer ${
                    bannerTheme === 'clean-white'
                      ? 'bg-stone-100 text-stone-950 font-black border-stone-900 shadow-xs ring-2 ring-stone-400'
                      : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  ⚪ Sugar (White)
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DIRECT EDITORS & LIVE CONFIGURATION (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 1. BRAND LOGO & ENTERPRISE NAME */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2 font-sans">
                <Award size={15} className="text-amber-600" />
                <span>ម៉ាកសញ្ញា & ឈ្មោះសហគ្រាស (Brand Logo & Enterprise Header)</span>
              </h4>

              <button
                type="button"
                onClick={() => jarLogoInputRef.current?.click()}
                className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Upload size={12} />
                <span>ប្ដូរ Logo ថ្មី</span>
              </button>
              <input
                ref={jarLogoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-300 p-1 flex items-center justify-center shrink-0">
                <img src={activeBrandLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase block font-mono">
                  Official Enterprise Trademark
                </span>
                <p className="text-xs font-bold text-stone-900">
                  {companyName}
                </p>
                <span className="text-[10px] text-stone-500 block truncate">
                  {companyAddress}
                </span>
              </div>
            </div>

            {/* Logo Standardization with 50g Bag */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-700">ទំហំ Logo ម៉ាកសញ្ញា (20mm Borderless):</span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                ✓ ដូចគ្នាបេះបិទលើ 50g & 100g
              </span>
            </div>
          </div>

          {/* 2. PRODUCT NAME & FLAVOR CUSTOMIZER (GENERAL CLEAN TITLES) */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2 font-sans border-b border-stone-200 pb-2">
              <Tag size={15} className="text-emerald-600" />
              <span>ឈ្មោះផលិតផលស្តង់ដារទូទៅ (General Product Name)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ឈ្មោះអង់គ្លេស បន្ទាត់ទី ១ (Line 1)
                </label>
                <input
                  type="text"
                  value={line1Text}
                  onChange={(e) => setLine1Text(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-bold font-serif"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ឈ្មោះរសជាតិ បន្ទាត់ទី ២ (Flavor Line 2)
                </label>
                <input
                  type="text"
                  value={line2Text}
                  onChange={(e) => setLine2Text(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-bold font-serif"
                  style={{ color: activeFlavor.accentColor }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ឈ្មោះជាភាសាខ្មែរ (Khmer Product Name)
                </label>
                <input
                  type="text"
                  value={nameKhmerText}
                  onChange={(e) => setNameKhmerText(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-medium font-sans"
                />
              </div>

              {/* KHMER FONT SELECTION (MOUL BORAN, MOUL PALI, KANTUMRUY PRO, BAYON, BATTAMBANG) */}
              <div className="sm:col-span-2 pt-2 border-t border-stone-100">
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>ពុម្ពអក្សរខ្មែរ (Khmer Typography Font):</span>
                  <span className="text-[10px] text-amber-700 font-normal font-sans">
                    {khmerFontPreset === 'moul' ? '★ មូលបុរាណ (Moul Traditional)' : khmerFontPreset === 'moulpali' ? 'មូលបាលី (Moul Pali)' : khmerFontPreset === 'kantumruy' ? 'កន្ទុយរុយ (Kantumruy Round)' : khmerFontPreset === 'bayon' ? 'បាយ័ន (Bayon Display)' : khmerFontPreset === 'battambang' ? 'បាត់ដំបង (Battambang)' : 'សៀមរាប (Siemreap)'}
                  </span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setKhmerFontPreset('moul')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      khmerFontPreset === 'moul'
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span className="block text-xs font-moul leading-none mb-1">គ្រាប់ស្វាយ</span>
                    <span className="text-[8.5px] opacity-80 block font-mono">Moul បុរាណ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKhmerFontPreset('moulpali')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      khmerFontPreset === 'moulpali'
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span className="block text-xs font-moulpali leading-none mb-1">គ្រាប់ស្វាយ</span>
                    <span className="text-[8.5px] opacity-80 block font-mono">Moul Pali</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKhmerFontPreset('kantumruy')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      khmerFontPreset === 'kantumruy'
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span className="block text-xs font-kantumruy font-bold leading-none mb-1">គ្រាប់ស្វាយ</span>
                    <span className="text-[8.5px] opacity-80 block font-mono">Kantumruy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKhmerFontPreset('bayon')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      khmerFontPreset === 'bayon'
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span className="block text-xs font-bayon leading-none mb-1">គ្រាប់ស្វាយ</span>
                    <span className="text-[8.5px] opacity-80 block font-mono">Bayon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKhmerFontPreset('battambang')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      khmerFontPreset === 'battambang'
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span className="block text-xs font-battambang font-bold leading-none mb-1">គ្រាប់ស្វាយ</span>
                    <span className="text-[8.5px] opacity-80 block font-mono">Battambang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKhmerFontPreset('siemreap')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      khmerFontPreset === 'siemreap'
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs ring-2 ring-amber-400/50'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span className="block text-xs font-siemreap leading-none mb-1">គ្រាប់ស្វាយ</span>
                    <span className="text-[8.5px] opacity-80 block font-mono">Siemreap</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. NET WEIGHT & DIRECT JAR STAMPING SETTINGS */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2 font-sans border-b border-stone-200 pb-2">
              <Calendar size={15} className="text-amber-600" />
              <span>ទម្ងន់សុទ្ធលើស្លាក & ការបោះត្រាលើកំប៉ុង (Net Weight & Direct Jar Stamping)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-stone-700">
                    ទម្ងន់សុទ្ធលើស្លាក (Label Net Wt)
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setNetWeightDisplay('100g')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition cursor-pointer ${
                        netWeightDisplay === '100g'
                          ? 'bg-amber-500 text-stone-950 font-black'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      100g ក្រឡ
                    </button>
                    <button
                      type="button"
                      onClick={() => setNetWeightDisplay('150g')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition cursor-pointer ${
                        netWeightDisplay === '150g'
                          ? 'bg-amber-500 text-stone-950 font-black'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      150g ក្រឡ
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={netWeightDisplay}
                  onChange={(e) => setNetWeightDisplay(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900 font-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  លេខឡូត៍សម្រាប់បោះត្រាលើកំប៉ុង (Jar Stamp LOT)
                </label>
                <input
                  type="text"
                  value={lotCode}
                  onChange={(e) => setLotCode(e.target.value)}
                  placeholder="ឧ. LOT: KC-P2608-01"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono text-stone-900 font-bold"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10.5px] text-stone-500 font-sans">
              <span>* ស្លាកស្ទីកឃ័រត្រូវបានរចនាស្អាតគ្មាន LOT ឬ BBD (បោះត្រាទឹកថ្នាំផ្ទាល់លើកំប៉ុងពេលផលិត)</span>
              <span className="font-mono text-emerald-700 font-bold">✓ 100% Bulk Print Ready</span>
            </div>
          </div>

          {/* 4. PRINT SHEET SELECTION BAR */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Printer size={15} className="text-amber-600" />
                <span>ជម្រើសទម្រង់សន្លឹកព្រីន A4 (A4 Print Layout Mode):</span>
              </span>
              <span className="text-[11px] font-bold text-amber-900 font-mono">
                {customHeightMm >= 35 ? '14 Labels / Sheet (7 rows × 2 cols)' : '18 Labels / Sheet'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPrintLayoutMode('active-flavor-full-sheet')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  printLayoutMode === 'active-flavor-full-sheet'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-sm ring-2 ring-amber-400/50'
                    : 'bg-white hover:bg-amber-100/50 text-stone-800 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>📄 សន្លឹកពេញ {customHeightMm >= 35 ? '១៤ សន្លឹក' : '១៨ សន្លឹក'} (Active Flavor Sheet)</span>
                  <span className="font-mono text-[10px]">{customHeightMm >= 35 ? '14 Up' : '18 Up'}</span>
                </div>
                <p className="text-[10px] opacity-80 mt-1">
                  ព្រីនតែរសជាតិ <strong>{activeFlavor.nameEnLine2}</strong> ពេញមួយសន្លឹក A4 ({customWidthMm}×{customHeightMm}mm)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPrintLayoutMode('mixed-batch-21jars')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  printLayoutMode === 'mixed-batch-21jars'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-sm ring-2 ring-amber-400/50'
                    : 'bg-white hover:bg-amber-100/50 text-stone-800 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>🍱 សន្លឹកចម្រុះ ៣ រសជាតិ (Mixed Flavors Batch)</span>
                  <span className="font-mono text-[10px]">{customHeightMm >= 35 ? '14 Jars' : '21 Jars'}</span>
                </div>
                <p className="text-[10px] opacity-80 mt-1">
                  {customHeightMm >= 35 ? '១០ Pepper + ២ Sugar + ២ Chili' : '១៥ Pepper + ៤ Sugar + ២ Chili'}
                </p>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* PRINT AREA (PRINTED WHEN USER CLICKS PRINT) */}
      <div id="jar-banner-printable-a4-sheet" className="hidden print:block print:w-full">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .no-print {
              display: none !important;
            }
            .print-page {
              width: 210mm !important;
              min-height: 297mm !important;
              padding: 6mm 5mm !important;
              margin: 0 auto !important;
              box-sizing: border-box !important;
              page-break-after: always;
            }
            .jar-sticker-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 3mm !important;
            }
            .jar-sticker-item {
              height: ${customHeightMm}mm !important;
              border: 1px dashed #bbb !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `}} />

        <div className="print-page">
          <div className="text-center mb-2 pb-1 border-b border-stone-300">
            <h1 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Mayany Enterprise • 100g PET Jar Universal Banner Sticker Sheet ({customWidthMm}×{customHeightMm}mm)
            </h1>
            <span className="text-[9px] font-mono text-stone-600">
              Standard Die-Cut / Cut Guide • Bulk Printing Standard (BBD Stamped on Jar) • Mayany Enterprise Cambodia
            </span>
          </div>

          <div className="jar-sticker-grid">
            {printLayoutMode === 'mixed-batch-21jars' ? (
              <>
                {/* PEPPER JARS */}
                {Array.from({ length: customHeightMm >= 35 ? 10 : 15 }).map((_, idx) => (
                  <div key={`p-${idx}`} className="jar-sticker-item">
                    {renderStickerElement(flavorList[0], true)}
                  </div>
                ))}
                {/* SUGAR JARS */}
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={`s-${idx}`} className="jar-sticker-item">
                    {renderStickerElement(flavorList[1], true)}
                  </div>
                ))}
                {/* LIGHT CHILI JARS */}
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={`c-${idx}`} className="jar-sticker-item">
                    {renderStickerElement(flavorList[2], true)}
                  </div>
                ))}
              </>
            ) : (
              Array.from({ length: customHeightMm >= 35 ? 14 : 18 }).map((_, idx) => (
                <div key={`single-${idx}`} className="jar-sticker-item">
                  {renderStickerElement(activeFlavor, true)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FULL-SCREEN / HIGH-RESOLUTION LABEL INSPECTION MODAL */}
      {isInspectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-stone-900 border-2 border-amber-400 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 text-white relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                  <Eye size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                    <span>ផ្ទៀងផ្ទាត់ស្លាកកំប៉ុង 100g (High-Res Label Inspection & Audit)</span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-2 py-0.5 rounded-full font-mono">
                      {activeFlavor.nameEnLine2}
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    ពិនិត្យភាពច្បាស់នៃអក្សរខ្មែរ (Moul), អក្សរអង់គ្លេស 3 ជួរ, ទម្ងន់ 100g និង QR Code Passport
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectZoomScale(prev => Math.max(1, prev - 0.25))}
                  className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={15} />
                </button>
                <span className="font-mono text-xs text-amber-400 font-bold px-1">
                  {Math.round(inspectZoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setInspectZoomScale(prev => Math.min(2.5, prev + 0.25))}
                  className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsInspectModalOpen(false)}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-red-900/80 text-stone-400 hover:text-white transition cursor-pointer ml-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Scaled Label Preview */}
            <div className="bg-stone-950/90 p-8 rounded-2xl border border-stone-800 flex flex-col items-center justify-center overflow-x-auto min-h-[220px]">
              <div 
                style={{ transform: `scale(${inspectZoomScale})`, transformOrigin: 'center center' }}
                className="transition-transform duration-150 shadow-2xl"
              >
                {renderStickerElement(activeFlavor, false)}
              </div>
            </div>

            {/* Quick Flavor Switcher in Modal */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-stone-400 font-sans">ប្ដូររសជាតិពិនិត្យ៖</span>
              <div className="flex items-center gap-2">
                {flavorList.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSwitchFlavor(f.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      selectedFlavorId === f.id
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {f.nameEnLine2}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-800">
              <span className="text-[11px] text-stone-400 font-mono">
                ទំហំស្លាក: {bannerSizePreset} mm • ទម្រង់ម៉ូត: {bannerTheme}
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInspectModalOpen(false)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  បិទផ្ទាំង (Close)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsInspectModalOpen(false);
                    handlePrint();
                  }}
                  className="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 text-stone-950 px-5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Printer size={15} />
                  <span>ព្រីនស្លាក A4 ភ្លាមៗ (Print A4 Sheet)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DEDICATED HIGH-RES TEST SCAN MODAL FOR 100G JAR QR PASSPORT */}
      {showQrTester && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-stone-900 border-2 border-emerald-400 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-white relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                    <span>តេស្តស្កេន QR Passport កំប៉ុង 100g</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-2 py-0.5 rounded-full font-mono">
                      {activeFlavor.nameEnLine2}
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    សូមយកកាមេរ៉ាទូរសព្ទស្កេនផ្ទាល់លើកូដ QR ខាងក្រោម ដើម្បីបើកមើល E-Label
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowQrTester(false)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Giant Crisp QR Code Display */}
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center shadow-inner border border-stone-300">
              <div className="w-56 h-56 bg-white p-2 flex items-center justify-center">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="100g Jar Passport QR Code" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-xs font-mono text-stone-500">
                    Generating QR...
                  </div>
                )}
              </div>
              <p className="text-[11px] text-stone-800 font-mono font-bold mt-2">
                100g Jar • {activeFlavor.nameEnLine2} • LOT: {lotCode || activeFlavor.defaultBatchLot}
              </p>
            </div>

            {/* Founder Voice Story & HACCP Quality Guarantee */}
            <VoiceStoryRecorder
              batchId={lotCode || activeFlavor.defaultBatchLot}
              productName={`100g Jar ${activeFlavor.nameEnLine1} ${activeFlavor.nameEnLine2}`}
              activeLanguage="kh"
              isConsumerMode={true}
            />

            {/* Target URL & Quick Actions */}
            <div className="space-y-3">
              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>Target Smart E-Label Passport URL:</span>
                </span>
                <p className="text-[10.5px] text-stone-300 font-mono break-all select-all">
                  {qrTargetUrl}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(qrTargetUrl);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2500);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-xs flex-1 justify-center cursor-pointer shadow-md"
                >
                  {copiedUrl ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedUrl ? 'បានចម្លង Link រួចរាល់!' : 'ចម្លង Link Passport (Copy URL)'}</span>
                </button>

                <a
                  href={qrTargetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/40 font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-xs cursor-pointer"
                >
                  <ExternalLink size={15} />
                  <span>បើកមើលផ្ទាល់</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
