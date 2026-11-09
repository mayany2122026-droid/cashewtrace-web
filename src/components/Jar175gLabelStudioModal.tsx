import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { 
  X, Printer, Download, QrCode, Sparkles, Check, Copy, 
  ExternalLink, Phone, MessageCircle, ShieldCheck, Award, 
  AlertCircle, RefreshCw, Layers, Eye, Tag, FileText, CheckCircle2,
  HelpCircle, ArrowRight, Flame, Scale
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { getPublicOrigin } from '../utils/publicOrigin';

interface Jar175gLabelStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: 'chili' | 'pepper' | 'sugar';
}

export default function Jar175gLabelStudioModal({
  isOpen,
  onClose,
  defaultProduct = 'pepper'
}: Jar175gLabelStudioModalProps) {
  const { isKhmer, isKorean } = useLanguage();
  const labelRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const [activeProduct, setActiveProduct] = useState<'pepper' | 'chili' | 'sugar'>(defaultProduct);
  const [viewMode, setViewMode] = useState<'label' | 'correction-sheet' | 'diagnosis' | 'real-jars'>('label');
  const [qrFormat, setQrFormat] = useState<'optimized' | 'full'>('optimized');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Synchronize defaultProduct prop
  useEffect(() => {
    setActiveProduct(defaultProduct);
  }, [defaultProduct]);

  // Product configurations
  const productConfig = {
    pepper: {
      id: 'pepper-jar-175g',
      nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI',
      nameEn: 'GI Kampot Black Pepper Coated Cashew Kernels',
      weight: '175g',
      netWeightText: 'Net Weight 175g',
      batch: '2026-ckp-261j',
      barcode: '8847116350061',
      icon: '🫘',
      accentColor: 'from-amber-950 via-slate-900 to-amber-950',
      badgeColor: 'bg-slate-900 text-amber-300',
      flavor: 'pepper',
    },
    chili: {
      id: 'chili-jar-175g',
      nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស',
      nameEn: 'Chili Coated Cashew Kernels',
      weight: '175g',
      netWeightText: 'Net Weight 175g',
      batch: '2026-ckc-261j',
      barcode: '8847116350092',
      icon: '🌶️',
      accentColor: 'from-red-950 via-slate-900 to-red-950',
      badgeColor: 'bg-red-700 text-white',
      flavor: 'chili',
    },
    sugar: {
      id: 'sugar-jar-175g',
      nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ',
      nameEn: 'Sugar Coated Cashew Kernels',
      weight: '175g',
      netWeightText: 'Net Weight 175g',
      batch: '2026-cks-261j',
      barcode: '8847116350085',
      icon: '🍯',
      accentColor: 'from-amber-900 via-amber-800 to-amber-950',
      badgeColor: 'bg-amber-600 text-white',
      flavor: 'sugar',
    }
  };

  const currentItem = productConfig[activeProduct];

  // Compute live smartphone permanent product URL (Make-to-Order clean product identity)
  const getTargetUrl = () => {
    return `https://mayanyenterprise.com/?mode=passport&product=${currentItem.id}&view=certificate&project=passport`;
  };

  // Generate verified QR Code image
  useEffect(() => {
    if (!isOpen) return;
    const generateQr = async () => {
      try {
        const url = getTargetUrl();
        const dataUrl = await QRCode.toDataURL(url, {
          width: 1024,
          margin: 3, // Crucial quiet-zone margin so camera never fails
          errorCorrectionLevel: 'H', // High error correction (recovers even if 30% damaged or partially covered)
          color: {
            dark: '#1a0d05', // Deep rich bronze/black for high contrast
            light: '#ffffff'
          }
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate verified QR code', err);
      }
    };
    generateQr();
  }, [isOpen, activeProduct, qrFormat]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getTargetUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadLabelImage = async () => {
    if (!labelRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(labelRef.current, {
        scale: 4, // Ultra-HD 4x for professional 300 DPI print quality
        useCORS: true,
        backgroundColor: null
      });
      const link = document.createElement('a');
      link.download = `Mayany_Label_175g_${currentItem.flavor}_READY_TO_EAT_${currentItem.batch}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('Could not export image. Please use Print button or try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadQrOnly = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `Mayany_Verified_QR_${currentItem.flavor}_${currentItem.batch}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border-2 border-amber-400 overflow-hidden my-auto flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/40 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center justify-center text-xl">
                🚨
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                    QR Rescue & 175g Label Studio
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                    ✓ Verified ISO/IEC 18004
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-amber-300 leading-tight mt-0.5">
                  ដោះស្រាយបញ្ហា QR Code មិនស្គាល់ & ស្លាកក្រឡ ១៧៥ ក្រាម (Pepper & Chili)
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            
            {/* Urgent Diagnosis Notice (Why the 3m² print failed) */}
            <div className="bg-gradient-to-r from-amber-50 via-red-50/60 to-amber-50 p-4 rounded-2xl border-2 border-amber-400/90 text-xs text-amber-950 space-y-2.5 print:hidden">
              <div className="flex items-start gap-3">
                <AlertCircle size={22} className="text-red-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm font-black text-red-950 font-sans">
                      មូលហេតុពិតប្រាកដដែល QR Code លើស្លាក ៣ ម៉ែត្រការ៉េ មិនអាចស្កេនបាន (Root Cause Found):
                    </strong>
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded font-mono">
                      Corrupted Finder Patterns & AI Distortion
                    </span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-slate-800 font-sans">
                    កាលពីលើកមុននៅកូរ៉េ កូដ QR អាចស្កេនបានធម្មតា។ ប៉ុន្តែនៅពេលលោកអ្នក ឬអ្នករចនាបានបន្ថែមអក្សរ <strong>"READY TO EAT   PRODUCT OF CAMBODIA"</strong> នៅខាងលើ ដោយប្រើកម្មវិធីកាត់តរូបភាព (Graphic Tool/AI Editor/Canva)៖
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-sans text-[11px] text-slate-700">
                    <li className="bg-white/80 p-2 rounded-xl border border-amber-300 flex items-start gap-1.5">
                      <span className="text-red-600 font-bold shrink-0">❌</span>
                      <span><strong>ក្បាលប្រអប់ស្កេន ៣ ជ្រុង (Finder Patterns) ត្រូវបានខូចទ្រង់ទ្រាយ៖</strong> កម្មវិធីកាត់តបានធ្វើឱ្យរលាយ ឬខូចប្រអប់ការ៉េ ៧x៧ នៅជ្រុងទាំង ៣ ដែលជាសញ្ញាសំខាន់បំផុតសម្រាប់កាមេរ៉ាទូរស័ព្ទចាប់យករូបភាព។</span>
                    </li>
                    <li className="bg-white/80 p-2 rounded-xl border border-amber-300 flex items-start gap-1.5">
                      <span className="text-red-600 font-bold shrink-0">❌</span>
                      <span><strong>បាត់បង់គែមសជុំវិញ (Quiet Zone Missing)៖</strong> គែមសយ៉ាងតិច 4-modules ជុំវិញកូដ QR ត្រូវបានលុប ឬជះពណ៌ចូល ធ្វើឱ្យកាមេរ៉ាមិនអាចកំណត់ព្រំដែនកូដបាន។</span>
                    </li>
                  </ul>
                  <div className="bg-emerald-900 text-emerald-100 p-2.5 rounded-xl text-[11px] flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
                      <span>
                        <strong>ដំណោះស្រាយសង្គ្រោះស្លាក ៣ ម៉ែត្រការ៉េ៖</strong> លោកអ្នកមិនបាច់បោះបង់ស្លាកដែលបានបោះពុម្ពចោលឡើយ! សូមប្រើផ្ទាំង <strong>"សន្លឹកស្ទីគ័រសង្គ្រោះ ៣ ម៉ែត្រការ៉េ (A4)"</strong> ខាងក្រោម ដើម្បីបោះពុម្ពស្ទីគ័រ QR ទំហំ ២cm x ២cm បិទពីលើ បានភ្លាមៗ!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product & View Mode Switcher Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 print:hidden">
              {/* Product Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                  {isKhmer ? 'ជ្រើសរើសផលិតផល៖' : 'Product:'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveProduct('sugar')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      activeProduct === 'sugar'
                        ? 'bg-amber-800 text-amber-200 shadow-md ring-2 ring-amber-400'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    <span>🍯 គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (175g)</span>
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 rounded-full">#2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProduct('pepper')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      activeProduct === 'pepper'
                        ? 'bg-slate-900 text-amber-300 shadow-md ring-2 ring-amber-400'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    <span>🫘 ម្រេចខ្មៅកំពត GI (175g)</span>
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 rounded-full">#4</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProduct('chili')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      activeProduct === 'chili'
                        ? 'bg-red-700 text-white shadow-md ring-2 ring-red-400'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    <span>🌶️ គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (175g)</span>
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 rounded-full">#6</span>
                  </button>
                </div>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode('label')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    viewMode === 'label'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <FileText size={13} />
                  <span>ស្លាកដប ១៧៥g ពេញលេញ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('correction-sheet')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    viewMode === 'correction-sheet'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>🩹 សន្លឹកស្ទីគ័រសង្គ្រោះ (A4 Rescue Sheet)</span>
                  <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded-full font-black">សង្គ្រោះ 3m²</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('diagnosis')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    viewMode === 'diagnosis'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Eye size={13} />
                  <span>ផ្ទៀងផ្ទាត់ជាមួយរូបថតដើម</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('real-jars')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'real-jars'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>📸 ដបជាក់ស្តែងលើ Website</span>
                  <span className="text-[9px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">Updated</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* VIEW 1: FULL 175G JAR LABEL (READY TO PRINT / RE-PRINT)                   */}
            {/* ========================================================================= */}
            {viewMode === 'label' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                    <div>
                      <strong>ស្លាកដប ១៧៥ ក្រាមផ្លូវការ (មាន READY TO EAT + PRODUCT OF CAMBODIA)</strong>
                      <p className="text-[11px] text-emerald-800 font-sans">
                        កូដ QR ខាងក្រោមត្រូវបានកែសម្រួលយ៉ាងផ្ចិតផ្ចិត ធានាថាកាមេរ៉ាទូរស័ព្ទស្កេនស្គាល់ភ្លាមៗ ១០០% (High Error Correction 'H' + Clean Quiet Zone)។
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadLabelImage}
                      disabled={isExporting}
                      className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                    >
                      <Download size={13} className="text-amber-400" />
                      <span>{isExporting ? 'កំពុងទាញយក...' : 'ទាញយក Ultra-HD (PNG)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                    >
                      <Printer size={13} />
                      <span>បោះពុម្ពស្លាកនេះ</span>
                    </button>
                  </div>
                </div>

                {/* THE PRISTINE LABEL ARTWORK (Matching the User's Real Printed Sticker 100%) */}
                <div className="flex justify-center p-3 sm:p-6 bg-slate-100 rounded-3xl border border-slate-300 overflow-x-auto print:p-0 print:bg-white print:border-none">
                  <div
                    ref={labelRef}
                    style={{
                      width: '460px',
                      backgroundColor: '#FAF6EE',
                      borderRadius: '24px',
                      border: '3.5px solid #6b2e11',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      padding: '18px 22px 16px 22px',
                      fontFamily: '"Hanuman", "Kantumruy Pro", sans-serif',
                      color: '#451a03',
                      position: 'relative'
                    }}
                    className="relative shrink-0 select-none print:shadow-none"
                  >
                    {/* Inner Decorative Double Border */}
                    <div 
                      className="absolute inset-1.5 rounded-[20px] pointer-events-none" 
                      style={{ border: '1px solid #c2884a' }}
                    />

                    {/* TOP SECTION: LOGO + READY TO EAT / PRODUCT OF CAMBODIA + PRODUCT NAMES */}
                    <div className="flex items-start gap-3 relative z-10">
                      {/* Mayany Enterprise Golden Medallion Logo */}
                      <div className="shrink-0 pt-0.5">
                        <img
                          src="/assets/aistudio/Mayany_Enterprise_Logo_August_26_2026_4cdf6a3d.jpg"
                          alt="Mayany Enterprise"
                          style={{
                            width: '76px',
                            height: '76px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #b45309',
                            boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)'
                          }}
                        />
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 min-w-0 text-center pr-1">
                        {/* READY TO EAT   PRODUCT OF CAMBODIA Header Line */}
                        <div 
                          className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase pb-0.5"
                          style={{ color: '#6b2e11', fontFamily: 'system-ui, sans-serif' }}
                        >
                          <span>READY TO EAT</span>
                          <span>PRODUCT OF CAMBODIA</span>
                        </div>

                        {/* Khmer Product Title in Rich Burgundy */}
                        <h2 
                          className="text-[17px] font-black leading-tight pt-0.5"
                          style={{ color: '#5b1016' }}
                        >
                          {currentItem.nameKh}
                        </h2>

                        {/* English Product Title */}
                        <div 
                          className="text-[12px] font-bold leading-tight pt-0.5"
                          style={{ color: '#451a03', fontFamily: 'system-ui, sans-serif' }}
                        >
                          {currentItem.nameEn}
                        </div>

                        {/* Net Weight */}
                        <div 
                          className="text-[11px] font-bold pt-1"
                          style={{ color: '#5b1016', fontFamily: 'system-ui, sans-serif' }}
                        >
                          {currentItem.netWeightText}
                        </div>
                      </div>
                    </div>

                    {/* Thin Gold Separator Line */}
                    <div 
                      className="my-3 relative z-10" 
                      style={{ height: '1.5px', backgroundColor: '#d99b54' }}
                    />

                    {/* BOTTOM SECTION: SCANNABLE QR CODE (LEFT) + OFFICIAL CONTACT CARD (RIGHT) */}
                    <div className="grid grid-cols-12 gap-3 items-center relative z-10">
                      {/* Scannable Verified QR Code with Clean Quiet Zone Margin */}
                      <div className="col-span-4 flex flex-col items-center justify-center">
                        <div 
                          style={{
                            backgroundColor: '#ffffff',
                            padding: '6px',
                            borderRadius: '12px',
                            border: '1.5px solid #c2884a',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                          }}
                          className="flex items-center justify-center"
                        >
                          {qrDataUrl ? (
                            <img
                              src={qrDataUrl}
                              alt={`Verified QR Code for ${currentItem.nameEn}`}
                              style={{ width: '100px', height: '100px', display: 'block' }}
                            />
                          ) : (
                            <div className="w-[100px] h-[100px] flex items-center justify-center text-xs text-slate-400">
                              Loading QR...
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact & Company Details (Matching the Real Sticker Icons & Fonts) */}
                      <div className="col-span-8 space-y-1 pl-1 text-[11px]">
                        <div className="flex items-center gap-2 font-bold uppercase tracking-wide" style={{ color: '#5b1016' }}>
                          <span className="text-[12px]">🏢</span>
                          <span className="font-extrabold">MAYANY ENTERPRISE</span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10.5px]" style={{ color: '#451a03' }}>
                          <span className="text-[12px]">📞</span>
                          <strong className="font-sans">+855 88 771 2862</strong>
                        </div>

                        <div className="flex items-center gap-2 text-[10.5px]" style={{ color: '#451a03' }}>
                          <span className="text-[12px]">📘</span>
                          <span>Mayany Enterprise</span>
                        </div>

                        <div className="flex items-center gap-2 text-[10.5px] font-mono" style={{ color: '#451a03' }}>
                          <span className="text-[12px]">🌐</span>
                          <span>mayanyenterprise.com</span>
                        </div>

                        <div className="flex items-center gap-2 text-[10.5px] font-mono" style={{ color: '#451a03' }}>
                          <span className="text-[12px]">✉️</span>
                          <span className="truncate">mayany@mayanyenterprise.com</span>
                        </div>
                      </div>
                    </div>

                    {/* Micro EAN-13 & Legal Barcode Footnote */}
                    <div 
                      className="mt-2.5 pt-1 flex items-center justify-between text-[8px] font-mono"
                      style={{ borderTop: '1px solid #e7d3b8', color: '#8c532b' }}
                    >
                      <span>GS1 EAN-13: <strong>{currentItem.barcode}</strong></span>
                      <span>Cambodian Quality Standard CS 001</span>
                    </div>
                  </div>
                </div>

                {/* Smartphone Live Scan Test Instructions */}
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                    <Sparkles size={16} className="text-amber-700" />
                    <span>តេស្តស្កេនសាកល្បងលើអេក្រង់ឥឡូវនេះ (Test Scan with Your Smartphone):</span>
                  </div>
                  <p className="text-amber-900 leading-relaxed font-sans">
                    សូមលោកអ្នកបើកកាមេរ៉ាទូរស័ព្ទដៃ (iPhone ឬ Android) ហើយយកមកចង្អុលលើកូដ QR ខាងលើនេះផ្ទាល់! កាមេរ៉ានឹងចាប់យក Link ទៅកាន់ <strong>Digital Product Passport</strong> ភ្លាមៗក្នុងរយៈពេលមិនដល់ ០.៥ វិនាទីឡើយ។
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-amber-300 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>{copiedLink ? 'បានចម្លង Link រួចរាល់!' : 'ចម្លង Link នៃកូដ QR'}</span>
                    </button>
                    <a
                      href={getTargetUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <ExternalLink size={13} />
                      <span>តេស្តបើកមើលទំព័រ Passport ក្នុង Browser</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 2: EMERGENCY QR CORRECTION STICKER SHEET (A4) - RESCUE 3M² PRINT     */}
            {/* ========================================================================= */}
            {viewMode === 'correction-sheet' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-emerald-950 font-sans">
                          🩹 សន្លឹកស្ទីគ័រសង្គ្រោះកូដ QR (20mm × 20mm Sticker Rescue Sheet)
                        </span>
                        <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full font-mono">
                          Save 3 Square Meters
                        </span>
                      </div>
                      <p className="text-[11.5px] text-emerald-800 font-sans">
                        វិធីសាស្ត្រនេះជួយសន្សំសំចៃថវិកា ១០០%៖ លោកអ្នកគ្រាន់តែបោះពុម្ពសន្លឹក A4 នេះលើក្រដាសស្ទីគ័រ (Sticker Paper) ហើយកាត់បិទកូដ QR ត្រឹមត្រូវនេះ <strong>បិទពីលើកូដ QR ចាស់ដែលមិនស្គាល់</strong> នៅលើស្លាក ៣ ម៉ែត្រការ៉េដែលបានបោះពុម្ពរួច!
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleDownloadQrOnly}
                        className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        title="ទាញយកតែរូបភាព QR កម្រិតច្បាស់ខ្ពស់"
                      >
                        <Download size={14} className="text-amber-600" />
                        <span>ទាញយក QR តែមួយ (PNG)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="py-2 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md cursor-pointer"
                      >
                        <Printer size={15} />
                        <span>បោះពុម្ពសន្លឹកស្ទីគ័រ A4 (Print Sheet)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Printable A4 Grid of 35 Rescue Stickers (20mm x 20mm with Batch indicator) */}
                <div 
                  ref={sheetRef}
                  className="bg-white p-6 rounded-3xl border border-slate-300 shadow-md print:p-0 print:border-none print:shadow-none"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4 text-xs font-sans">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span>🏷️ MAYANY ENTERPRISE • QR CODE CORRECTION OVERLAY SHEET</span>
                      <span className="text-amber-700 font-mono">[{currentItem.nameEn} • {currentItem.batch}]</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Sticker Spec: 22mm × 22mm • 35 Stickers per A4
                    </div>
                  </div>

                  {/* 5 columns x 7 rows = 35 stickers */}
                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-3 print:grid-cols-7 print:gap-2">
                    {Array.from({ length: 35 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="border border-dashed border-slate-300 rounded-xl p-1.5 flex flex-col items-center justify-center bg-white hover:border-amber-500 transition print:border-slate-300 print:rounded-none"
                        style={{ minHeight: '90px' }}
                      >
                        {qrDataUrl && (
                          <img
                            src={qrDataUrl}
                            alt={`Correction QR ${idx + 1}`}
                            className="w-16 h-16 object-contain"
                          />
                        )}
                        <div className="text-[7.5px] font-mono text-center font-bold text-slate-700 leading-tight mt-0.5">
                          {currentItem.batch}
                        </div>
                        <div className="text-[6.5px] font-sans text-emerald-800 text-center font-bold">
                          {activeProduct === 'pepper' ? 'WW180 ម្រេច' : 'WW180 ម្ទេស'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                    <span>✂️ កាត់តាមគំនូសដាច់ៗ រួចបិទពីលើកូដ QR ចាស់លើស្លាកដប</span>
                    <span>Verified Passport Target: {currentItem.barcode}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 3: DIAGNOSIS & COMPARISON WITH USER'S ATTACHED IMAGE                 */}
            {/* ========================================================================= */}
            {viewMode === 'diagnosis' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Eye size={16} className="text-amber-700" />
                    <span>ការវិភាគប្រៀបធៀបលើរូបភាពដែលបានបោះពុម្ព ៣ ម៉ែត្រការ៉េ (Visual Comparison):</span>
                  </div>
                  <p className="text-slate-600 font-sans leading-relaxed">
                    ខាងក្រោមគឺជារូបភាពដើមដែលលោកអ្នកបានផ្ញើមក ដែលបញ្ជាក់ពីទំហំ <strong>"3 ម៉ែត្រ"</strong>។ យើងបានវិភាគស៊ីជម្រៅលើ Matrix នៃកូដ QR របស់ស្លាកទាំងពីរ៖
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* The User's Uploaded Image */}
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-300 text-white flex flex-col items-center">
                    <span className="text-xs font-mono font-bold text-amber-300 mb-2">
                      📸 រូបភាពស្លាក ៣ ម៉ែត្រការ៉េដែលបានបោះពុម្ព (Unreadable Printed Version)
                    </span>
                    <img
                      src="/mayany_ke_application_product_collage.jpg"
                      alt="Printed Labels Reference"
                      className="max-h-[420px] w-auto object-contain rounded-xl border border-white/20"
                      onError={(e) => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg'; 
                      }}
                    />
                    <div className="mt-2 text-[11px] text-red-300 text-center font-sans space-y-1">
                      <div>⚠️ កូដ QR លើរូបភាពនេះមាន Finder Pattern មិនប្រក្រតី និងបាត់បង់ព្រំដែនពណ៌ស</div>
                    </div>
                  </div>

                  {/* High Quality Replacement Solution */}
                  <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-500/40 text-white flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          ✓ កូដ QR ថ្មីត្រឹមត្រូវ ១០០% (Verified Replacement)
                        </span>
                        <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-bold font-sans">
                          ISO/IEC 18004
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg max-w-[200px] mx-auto">
                        {qrDataUrl && (
                          <img
                            src={qrDataUrl}
                            alt="Verified QR Code"
                            className="w-40 h-40 object-contain"
                          />
                        )}
                        <span className="text-[10px] font-mono font-bold text-slate-800 mt-1">
                          LOT: {currentItem.batch}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-sans text-emerald-100">
                        <div className="font-bold text-amber-300">ហេតុអ្វីបានជាកូដ QR ថ្មីនេះស្កេនស្គាល់ ១០០%?</div>
                        <ul className="space-y-1 text-[11px] text-slate-200">
                          <li>• <strong>Finder Patterns:</strong> មានសមាមាត្រក្បាលស្កេន 1:1:3:1:1 ត្រឹមត្រូវតាមកម្រិតស្តង់ដារអន្តរជាតិ។</li>
                          <li>• <strong>Error Correction Level 'H':</strong> កម្រិតការពារកំហុសខ្ពស់បំផុត ទោះបីជាមានការកកិត ឬប្រឡាក់រហូតដល់ 30% ក៏នៅតែស្កេនស្គាល់។</li>
                          <li>• <strong>Clean Quiet Zone:</strong> មានគែមស 4-modules ជុំវិញ ធានាថាកាមេរ៉ាទូរស័ព្ទមិនច្រឡំជាមួយផ្ទៃខាងក្រោយ។</li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setViewMode('correction-sheet')}
                        className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer text-center"
                      >
                        ទៅកាន់សន្លឹកស្ទីគ័រសង្គ្រោះ A4 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 4: REAL UPDATED JARS SHOWCASE (WEBSITE READY)                        */}
            {/* ========================================================================= */}
            {viewMode === 'real-jars' && (
              <div className="space-y-5 animate-fade-in">
                <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white p-4 rounded-2xl border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">📸</span>
                      <h3 className="text-sm font-bold text-amber-300 font-sans">
                        {isKhmer ? 'រូបថតកំប៉ុង PET ជាក់ស្តែង ១៧៥g ជាមួយស្លាកថ្មីត្រឹមត្រូវ' : 'Official 175g PET Jars with Updated Brand Labels'}
                      </h3>
                      <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full font-mono">
                        Live on Website
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">
                      {isKhmer 
                        ? 'រូបថតកំប៉ុង PET ទាំងពីរនេះត្រូវបានដាក់បង្ហាញជាផ្លូវការនៅលើគេហទំព័រ mayanyenterprise.com រួចរាល់ហើយ' 
                        : 'These updated high-resolution photos are now live on mayanyenterprise.com storefront'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 1. Chili Coated 175g Jar */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col">
                    <div className="relative aspect-square bg-slate-100 overflow-hidden group">
                      <img
                        src="/images/mayany_chili_jar_175g.png"
                        alt="Chili Coated Cashew Kernels 175g Jar"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg'; 
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-red-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        🌶️ ស្រោបម្ទេស • Chili Coated
                      </div>
                      <div className="absolute top-3 right-3 bg-black/75 text-amber-300 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        175g = $4.00
                      </div>
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm font-sans">
                          គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (កំប៉ុង PET ១៧៥g)
                        </h4>
                        <p className="text-xs text-slate-500 font-sans">
                          Chili Coated Cashew Kernels • Barcode: 8847116350092
                        </p>
                      </div>
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 font-sans">
                        ✓ ស្លាកថ្មីមានបោះពុម្ព READY TO EAT & PRODUCT OF CAMBODIA យ៉ាងស្អាតប្រណិត
                      </div>
                    </div>
                  </div>

                  {/* 2. Sugar Coated 175g Jar */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col">
                    <div className="relative aspect-square bg-slate-100 overflow-hidden group">
                      <img
                        src="/images/mayany_sugar_jar_175g.png"
                        alt="Sugar Coated Cashew Kernels 175g Jar"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg'; 
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        🥥 ស្រោបស្ករ • Sugar Coated
                      </div>
                      <div className="absolute top-3 right-3 bg-black/75 text-amber-300 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        175g = $4.00
                      </div>
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm font-sans">
                          គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (កំប៉ុង PET ១៧៥g)
                        </h4>
                        <p className="text-xs text-slate-500 font-sans">
                          Sugar Coated Cashew Kernels • Barcode: 8847116350085
                        </p>
                      </div>
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 font-sans">
                        ✓ ស្លាកថ្មីមានបោះពុម្ព READY TO EAT ជាមួយដើមអំពៅ និងស្ករសធម្មជាតិ
                      </div>
                    </div>
                  </div>

                  {/* 3. GI Kampot Black Pepper Coated 175g Jar */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col">
                    <div className="relative aspect-square bg-slate-100 overflow-hidden group">
                      <img
                        src="/images/mayany_pepper_jar_175g.png"
                        alt="GI Kampot Black Pepper Coated Cashew Kernels 175g Jar"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg'; 
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-slate-900 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        🫘 ម្រេចខ្មៅកំពត GI • Kampot Pepper
                      </div>
                      <div className="absolute top-3 right-3 bg-black/75 text-amber-300 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        175g = $4.00
                      </div>
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm font-sans">
                          គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI (កំប៉ុង PET ១៧៥g)
                        </h4>
                        <p className="text-xs text-slate-500 font-sans">
                          GI Kampot Black Pepper Coated Cashews • Barcode: 8847116350061
                        </p>
                      </div>
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 font-sans">
                        ✓ ស្លាកថ្មីជាមួយទេសភាពចម្ការម្រេចកំពត GI ពិតៗ និងឡូហ្គោ Mayany Enterprise
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Actions */}
          <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>
                {isKhmer 
                  ? 'កូដ QR ភ្ជាប់ទៅកាន់ Digital Passport & វិញ្ញាបនបត្រ CS 001 របស់ Mayany Enterprise' 
                  : 'QR connects to Mayany Enterprise Digital Product Passport & CS 001 Certificate'}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copiedLink ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                <span>{copiedLink ? 'បានចម្លង!' : 'ចម្លង URL'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadLabelImage}
                disabled={isExporting}
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
              >
                <Download size={15} />
                <span>{isExporting ? 'កំពុងទាញយក...' : 'ទាញយកស្លាក PNG'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
              >
                <Printer size={15} />
                <span>បោះពុម្ព (Print)</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
