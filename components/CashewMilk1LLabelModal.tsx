import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { 
  X, Printer, Download, QrCode, Sparkles, Check, Copy, 
  ExternalLink, Phone, MessageCircle, ShieldCheck, Award, 
  Coffee, RefreshCw, Layers, Eye, Tag, Heart, Milk, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface CashewMilk1LLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchCode?: string;
  mfdDate?: string;
  expDate?: string;
}

export default function CashewMilk1LLabelModal({
  isOpen,
  onClose,
  batchCode = 'MTO-CM-1L',
  mfdDate = '27-OCT-2026',
  expDate = '03-NOV-2026'
}: CashewMilk1LLabelModalProps) {
  const { isKhmer, isKorean } = useLanguage();
  const labelRef = useRef<HTMLDivElement>(null);

  // Editable fields for printing
  const [currentBatch, setCurrentBatch] = useState(batchCode);
  const [currentMfd, setCurrentMfd] = useState(mfdDate);
  const [currentExp, setCurrentExp] = useState(expDate);
  const [flavorVariant, setFlavorVariant] = useState<'natural' | 'pandan' | 'custom'>('pandan');
  const [currentIngredients, setCurrentIngredients] = useState<string>(
    'ទឹកចម្រោះ 86%, គ្រាប់ស្វាយចន្ទី 12.9%, ស្ករ 0.86%, ម្សៅស្លឹកតើយ 0.13%, អំបិល 0.09%'
  );
  // Transparent product pricing: $3.00 Drink + $1.50 Bottle = $4.50 Total
  const [drinkPrice, setDrinkPrice] = useState<number>(3.00);
  const [bottlePrice, setBottlePrice] = useState<number>(1.50);
  const totalPrice = drinkPrice + bottlePrice;

  const [qrDestination, setQrDestination] = useState<'whatsapp' | 'passport'>('whatsapp');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<'compact' | 'mockup' | 'sheet' | 'original'>('compact');

  // Compute live URL for the QR code with transparent price info
  const getQrUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin.replace('ais-dev-', 'ais-pre-') : 'https://cashewtrace.com';
    if (qrDestination === 'whatsapp') {
      const msg = encodeURIComponent(
        `Hello Mayany Enterprise! I tasted your 100% Plant-Based Cashew Milk (1L Bottle) and would like to order directly. Total Price: $${totalPrice.toFixed(2)} USD ($${drinkPrice.toFixed(2)} Drink + $${bottlePrice.toFixed(2)} Glass Bottle).`
      );
      return `https://wa.me/855887712862?text=${msg}`;
    }
    return 'https://mayanyenterprise.com/?mode=passport&product=cashew-milk-1l&view=certificate&project=passport';
  };

  // Generate QR Code image data
  useEffect(() => {
    if (!isOpen) return;
    const generateQr = async () => {
      try {
        const url = getQrUrl();
        const dataUrl = await QRCode.toDataURL(url, {
          width: 512,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#022c22', // Dark emerald
            light: '#ffffff'
          }
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    };
    generateQr();
  }, [isOpen, qrDestination, currentBatch, drinkPrice, bottlePrice]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getQrUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!labelRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(labelRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#022c22'
      });
      const link = document.createElement('a');
      link.download = `Mayany_Cashew_Milk_1L_Label_${currentBatch}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('Could not download image. You can use the Print button instead.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-emerald-500/30 overflow-hidden my-auto flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-500/30 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center">
                <Milk size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  {isKorean 
                    ? '1L 캐슈 밀크 병 라벨 & 직통 주문 QR 코드' 
                    : isKhmer 
                    ? 'ស្លាកដប ១L & កូដ QR បញ្ជាទិញផ្ទាល់ (Cashew Milk)' 
                    : '1L Cashew Milk Compact Label & Direct-Order QR'}
                </h3>
                <p className="text-xs text-emerald-300">
                  Mayany Enterprise • 100% Plant-Based Cashew Milk (1 Liter)
                </p>
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
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Top Controls: View Selector & QR Destination */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 print:hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600 mr-1">
                  {isKorean ? '라벨 뷰:' : isKhmer ? 'ទម្រង់ស្លាក:' : 'Label View:'}
                </span>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  ✨ {isKorean ? '컴팩트 병 라벨 (추천)' : isKhmer ? 'ស្លាកដបបង្រួម (Compact)' : 'Compact Bottle Label'}
                </button>
                <button
                  onClick={() => setViewMode('mockup')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'mockup'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>📸 {isKorean ? '실제 병 사진' : isKhmer ? 'រូបថតដបជាក់ស្តែង (Mockup)' : 'Real Bottle Photo'}</span>
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">ថ្មី NEW</span>
                </button>
                <button
                  onClick={() => setViewMode('sheet')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    viewMode === 'sheet'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  📄 {isKorean ? 'A4 인쇄용 시트 (4장)' : isKhmer ? 'សន្លឹកបោះពុម្ព A4 (៤ ស្លាក)' : 'A4 Print Sheet (4x)'}
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    viewMode === 'original'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  🖼️ {isKorean ? '기존 전체 라벨 사진' : isKhmer ? 'ស្លាកដើមធំ (Original)' : 'Full Wrap Reference'}
                </button>
              </div>

              {/* QR Destination Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                  {isKorean ? 'QR 스캔 시 이동:' : isKhmer ? 'ទិសដៅ QR Code:' : 'QR Destination:'}
                </span>
                <select
                  value={qrDestination}
                  onChange={(e) => setQrDestination(e.target.value as any)}
                  className="text-xs font-bold bg-white text-slate-800 border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="whatsapp">📱 WhatsApp ផ្ទាល់ (+855 88 771 2862)</option>
                  <option value="passport">🌐 Product Passport & Store Web</option>
                </select>
              </div>
            </div>

            {/* Editable Batch & Dates Toolbar for Make-to-Order */}
            <div className="bg-amber-50/70 border border-amber-200/90 p-3 rounded-2xl text-xs space-y-2.5 print:hidden">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <span>🏷️ ព័ត៌មានឡូត៍ & កាលបរិច្ឆេទ (Lot & Fresh Production):</span>
                </span>
                <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  Make-to-Order (ផលិត ១ លីត្រម្ដង)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-amber-900">
                      {isKorean ? '배치 번호 (Batch/Lot)' : isKhmer ? 'លេខកូដឡូត៍ (Batch/Lot)' : 'Batch / Lot Code'}:
                    </label>
                  </div>
                  <input
                    type="text"
                    value={currentBatch}
                    onChange={(e) => setCurrentBatch(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1 font-mono text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setCurrentBatch('MTO-CM-1L')}
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer ${
                        currentBatch === 'MTO-CM-1L' ? 'bg-amber-700 text-white' : 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      ⭐ MTO-CM-1L (Fixed Master)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
                        setCurrentBatch(`MTO-${ymd}`);
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      📅 តាមថ្ងៃ (Daily)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-amber-900">
                      {isKorean ? '제조일자 (MFD)' : isKhmer ? 'កាលបរិច្ឆេទផលិត (MFD)' : 'Manufactured Date (MFD)'}:
                    </label>
                  </div>
                  <input
                    type="text"
                    value={currentMfd}
                    onChange={(e) => setCurrentMfd(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1 font-mono text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                        setCurrentMfd(`${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`);
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      ថ្ងៃនេះ (Today)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-amber-900">
                      {isKorean ? '유통기한 (EXP)' : isKhmer ? 'ផុតកំណត់ (EXP)' : 'Best Before / Expiry (EXP)'}:
                    </label>
                  </div>
                  <input
                    type="text"
                    value={currentExp}
                    onChange={(e) => setCurrentExp(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1 font-mono text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 7);
                        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                        setCurrentExp(`${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`);
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      +7 ថ្ងៃ (Fresh 7d)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 14);
                        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                        setCurrentExp(`${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`);
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      +14 ថ្ងៃ (Cold 14d)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setMonth(d.getMonth() + 1);
                        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                        setCurrentExp(`${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`);
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      +1 ខែ (+1 Mo)
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-amber-900/80 bg-white/70 p-2 rounded-xl border border-amber-200">
                💡 <strong>ការសម្រេចលើលេខកូដឡូត៍ (Lot Number Decision)</strong>៖ សម្រាប់ភេសជ្ជៈស្រស់កុម្ម៉ង់ ១ លីត្រម្ដង យើងសូមណែនាំឱ្យប្រើលេខកូដឡូត៍គោលថេរ <strong>«MTO-CM-1L»</strong> (Make-to-Order Cashew Milk 1L) លើស្លាកធំ។ អត្ថប្រយោជន៍គឺកូដ QR លើដបនឹងមានសុពលភាពជាអចិន្ត្រៃយ៍ អ្នកអាចបោះពុម្ពស្លាកស្ទីគ័រទុកជាមុន ៥០ ឬ ១០០ សន្លឹក ហើយពេលភ្ញៀវកុម្ម៉ង់ ១ លីត្រម្ដង អ្នកគ្រាន់តែបិទស្ទីគ័រតូច ឬសរសេរកាលបរិច្ឆេទ <strong>MFD</strong> (ថ្ងៃផលិត) និង <strong>EXP</strong> (ផុតកំណត់ ៧ ទៅ ១៤ ថ្ងៃ) លើដបជាការស្រេច!
              </div>
            </div>

            {/* Flavor & Ingredients Selector Toolbar */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-2xl text-xs space-y-2 print:hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>🍃 រូបមន្តគ្រឿងផ្សំ & រសជាតិ (Recipe & Ingredients):</span>
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setFlavorVariant('pandan');
                      setCurrentIngredients('ទឹកចម្រោះ 86%, គ្រាប់ស្វាយចន្ទី 12.9%, ស្ករ 0.86%, ម្សៅស្លឹកតើយ 0.13%, អំបិល 0.09%');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      flavorVariant === 'pandan'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span>🍃 ម្សៅស្លឹកតើយ (Pandan Powder)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFlavorVariant('natural');
                      setCurrentIngredients('ទឹកចម្រោះ ៨៥%, សាច់គ្រាប់ស្វាយចន្ទីកម្ពុជា ១៤.៥%, អំបិលសមុទ្រកំពត ០.៥%');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      flavorVariant === 'natural'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span>🥛 ធម្មជាតិដើម (Original)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-emerald-900 block mb-0.5">
                  បញ្ជីគ្រឿងផ្សំលើស្លាកដប (Ingredients on Label):
                </label>
                <input
                  type="text"
                  value={currentIngredients}
                  onChange={(e) => {
                    setCurrentIngredients(e.target.value);
                    setFlavorVariant('custom');
                  }}
                  className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="បញ្ជូលគ្រឿងផ្សំ..."
                />
              </div>
            </div>

            {/* Transparent Product Pricing Settings Toolbar */}
            <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border border-amber-300/80 p-3.5 rounded-2xl text-xs space-y-2.5 print:hidden shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="text-base">💰</span>
                  <span className="font-extrabold text-amber-950">តម្លាភាពតម្លៃផលិតផល (Transparent Product Pricing):</span>
                </span>
                <span className="text-xs bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                  សរុប = ${totalPrice.toFixed(2)} USD (៤.៥០$)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                      <span>🥛</span> <span>ថ្លៃទឹកដោះគោ (Drink Price):</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.1"
                      value={drinkPrice}
                      onChange={(e) => setDrinkPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-2.5 py-1 font-mono text-xs font-black text-emerald-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">USD</span>
                  </div>
                  <div className="text-[9px] text-emerald-800 mt-1">ភេសជ្ជៈស្រស់ ១ លីត្រ (Drink only)</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-indigo-300 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-indigo-950 flex items-center gap-1">
                      <span>🍾</span> <span>ថ្លៃដបកែវ (Bottle Cost/Deposit):</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.1"
                      value={bottlePrice}
                      onChange={(e) => setBottlePrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-indigo-300 rounded-lg px-2.5 py-1 font-mono text-xs font-black text-indigo-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">USD</span>
                  </div>
                  <div className="text-[9px] text-indigo-800 mt-1">ដបកែវអនាម័យ ១L (Reusable bottle)</div>
                </div>

                <div className="bg-amber-100/90 p-2.5 rounded-xl border border-amber-400 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-950">តម្លៃលក់សរុប (Total):</span>
                    <span className="text-xs font-bold text-amber-900 font-mono">1L Bottle</span>
                  </div>
                  <div className="text-lg font-black font-mono text-slate-950">
                    ${totalPrice.toFixed(2)} <span className="text-xs font-bold font-sans text-amber-900">(៤.៥០ ដុល្លារ)</span>
                  </div>
                  <div className="text-[9.5px] text-amber-900 font-sans font-medium">
                    = ភេសជ្ជៈ ${drinkPrice.toFixed(2)} + ដប ${bottlePrice.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-700 bg-white/90 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
                💡 <strong>តម្លាភាព ១០០% ជូនអតិថិជន (Transparency Policy)</strong>៖ ការបំបែកតម្លៃ $3.00 (ភេសជ្ជៈ) និង $1.50 (ដប) ជួយឱ្យអតិថិជន និងមិត្តភក្តិយល់ច្បាស់ពីថ្លៃដើមដបកែវ។ លើសពីនេះ លើកទឹកចិត្តឱ្យអតិថិជនយកដបមកប្តូរទិញទឹកដោះគោម្តងទៀត (Eco Bottle Refill & Exchange) ដោយគិតថ្លៃតែ <strong>$3.00</strong> ប៉ុណ្ណោះ ជួយសន្សំប្រាក់អតិថិជន និងការពារបរិស្ថាន!
              </div>
            </div>

            {/* VIEW 1: THE NEW COMPACT 1L BOTTLE LABEL */}
            {viewMode === 'compact' && (
              <div className="flex flex-col items-center justify-center p-2 sm:p-4">
                
                {/* The Printable Label Container (Clean, Elegant, Proportionate for 1L Glass/PET Bottle) */}
                <div
                  ref={labelRef}
                  id="cashew-milk-compact-label"
                  className="w-full max-w-[340px] sm:max-w-[360px] bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] text-white rounded-3xl p-5 border-2 border-amber-400 shadow-2xl space-y-3.5 text-center relative overflow-hidden"
                  style={{
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {/* Subtle decorative gold inner border */}
                  <div className="absolute inset-1.5 border border-amber-400/40 rounded-[22px] pointer-events-none" />
                  
                  {/* Brand Crest & Header */}
                  <div className="flex items-center justify-center gap-2 pt-1 relative z-10">
                    <img
                      src="/assets/aistudio/Mayany_Enterprise_Logo_August_26_2026_4cdf6a3d.jpg"
                      alt="Mayany Enterprise"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 shadow-sm bg-white"
                    />
                    <div className="text-left">
                      <div className="text-[12px] font-black tracking-wider text-amber-300 uppercase leading-tight font-serif">
                        MAYANY ENTERPRISE
                      </div>
                      <div className="text-[9px] text-emerald-200 font-sans">
                        សហគ្រាស ម៉ាយ៉ានី • Artisan Agro-Processing
                      </div>
                    </div>
                  </div>

                  {/* Main Product Title */}
                  <div className="space-y-0.5 relative z-10">
                    <h2 className="text-base sm:text-lg font-black text-amber-200 tracking-tight leading-tight font-sans">
                      ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០%
                    </h2>
                    <div className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase font-serif">
                      100% PLANT-BASED CASHEW MILK
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/50 rounded-full text-[10px] font-bold">
                      <Sparkles size={11} className="text-amber-400" />
                      {flavorVariant === 'pandan' ? (
                        <span>🍃 PANDAN INFUSED • PLANT-BASED • DAIRY-FREE</span>
                      ) : (
                        <span>SMOOTH • CREAMY • DAIRY-FREE • VEGAN</span>
                      )}
                    </div>
                  </div>

                  {/* Origin & Volume Highlights */}
                  <div className="grid grid-cols-2 gap-2 text-left bg-emerald-950/70 border border-amber-400/30 rounded-xl p-2.5 text-[10px] relative z-10">
                    <div>
                      <span className="text-amber-300/80 block text-[9px] font-bold uppercase">Volume (ចំណុះ):</span>
                      <span className="font-extrabold text-white text-xs font-mono">1 LITER (១ លីត្រ)</span>
                    </div>
                    <div>
                      <span className="text-amber-300/80 block text-[9px] font-bold uppercase">Origin (ប្រភព):</span>
                      <span className="font-bold text-white text-[11px]">Kampong Thom, Cambodia</span>
                    </div>
                  </div>

                  {/* TRANSPARENT PRICING BREAKDOWN BADGE ON LABEL */}
                  <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 rounded-2xl p-2.5 border-2 border-amber-200 shadow-md relative z-10 text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-950 flex items-center gap-1 font-sans">
                        <span>💰 តម្លាភាពតម្លៃ (TRANSPARENT PRICING)</span>
                      </span>
                      <span className="text-[10px] font-mono font-black bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md shadow-xs">
                        TOTAL ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono pt-0.5 border-t border-amber-500/40">
                      <div className="bg-white/90 rounded-lg px-2 py-1 flex items-center justify-between">
                        <span className="text-slate-700 font-sans font-bold">🥛 ទឹកដោះគោ:</span>
                        <strong className="text-emerald-900 font-mono font-black">${drinkPrice.toFixed(2)}</strong>
                      </div>
                      <div className="bg-white/90 rounded-lg px-2 py-1 flex items-center justify-between">
                        <span className="text-slate-700 font-sans font-bold">🍾 ដបកែវ:</span>
                        <strong className="text-indigo-950 font-mono font-black">${bottlePrice.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="text-[7.5px] text-amber-950 font-sans text-center italic leading-tight">
                      *ដបកែវអាចប្តូរទិញម្តងទៀតបាន (គិតត្រឹម ${drinkPrice.toFixed(2)} សម្រាប់ Refill)
                    </div>
                  </div>

                  {/* CORE FEATURE: The Live Scannable Direct Order QR Code */}
                  <div className="bg-white rounded-2xl p-3 border-2 border-amber-400 shadow-md flex flex-col items-center justify-center space-y-1 relative z-10">
                    <div className="text-[10px] font-extrabold text-[#022c22] uppercase tracking-wider flex items-center gap-1">
                      <QrCode size={13} className="text-emerald-700" />
                      <span>SCAN TO ORDER DIRECT ស្កេនកុម្ម៉ង់</span>
                    </div>
                    
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Scan to Order 1L Cashew Milk"
                        className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                        Generating QR...
                      </div>
                    )}

                    <div className="text-[10px] font-mono font-black text-emerald-900 flex items-center gap-1">
                      <Phone size={11} className="text-emerald-700" />
                      <span>+855 88 771 2862</span>
                    </div>
                    <div className="text-[8px] text-slate-500 font-sans">
                      Friends & Buyers Scan to Order Direct via WhatsApp
                    </div>
                  </div>

                  {/* Clean Ingredients & Nutritional Highlights */}
                  {/* Clean Ingredients & Nutritional Highlights */}
                  <div className="space-y-1 text-left text-[9px] text-emerald-100/90 relative z-10">
                    <div className="flex items-start gap-1">
                      <span className="text-amber-300 font-bold shrink-0">គ្រឿងផ្សំ:</span>
                      <span className="leading-snug">{currentIngredients}</span>
                    </div>
                    {/* Explicit 4 Cambodian Suppliers */}
                    <div className="grid grid-cols-2 gap-1 text-[8px] pt-1 border-t border-emerald-800/80">
                      <div className="bg-emerald-900/60 p-1 rounded border border-emerald-700/50 flex items-center gap-1">
                        <span>🥜</span>
                        <span className="truncate"><strong>ចន្ទី៖</strong> Mirarth Agri Tech</span>
                      </div>
                      <div className="bg-emerald-900/60 p-1 rounded border border-emerald-700/50 flex items-center gap-1">
                        <span>🍯</span>
                        <span className="truncate"><strong>ស្ករ៖</strong> Angkor Sugar</span>
                      </div>
                      <div className="bg-emerald-900/60 p-1 rounded border border-emerald-700/50 flex items-center gap-1">
                        <span>🧂</span>
                        <span className="truncate"><strong>អំបិល៖</strong> Ngov Heng</span>
                      </div>
                      <div className="bg-emerald-900/60 p-1 rounded border border-emerald-700/50 flex items-center gap-1">
                        <span>🌿</span>
                        <span className="truncate"><strong>ស្លឹកតើយ៖</strong> Ringacam</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-amber-200/90 pt-0.5 border-t border-emerald-800">
                      <span>✓ 100% Cambodian Sourced</span>
                      <span>✓ Zero Cholesterol</span>
                      <span>✓ No Preservatives</span>
                    </div>
                  </div>

                  {/* Batch, Dates & Storage Footer */}
                  <div className="bg-emerald-950/80 rounded-xl p-2 border border-emerald-800 text-[9px] font-mono text-left space-y-0.5 relative z-10">
                    <div className="flex justify-between text-slate-300">
                      <span>BATCH: <strong className="text-amber-300">{currentBatch}</strong></span>
                      <span>NET: <strong className="text-white">1000 ml</strong></span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>MFD: <strong className="text-white">{currentMfd}</strong></span>
                      <span>EXP: <strong className="text-amber-300">{currentExp}</strong></span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300 pt-0.5 border-t border-emerald-900/60 text-[8.5px]">
                      <span>PRICE: <strong className="text-amber-300 font-mono">${totalPrice.toFixed(2)}</strong> (${drinkPrice.toFixed(2)} Drink + ${bottlePrice.toFixed(2)} Bottle)</span>
                      <span className="text-amber-300 font-bold font-sans">តម្លាភាព ១០០%</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300 pt-0.5 border-t border-emerald-900/60">
                      <span>BARCODE: <strong className="text-emerald-300 font-mono">884 711635 0054</strong></span>
                      <span className="text-[7.5px] text-amber-300 font-mono">EAN-13 GS1</span>
                    </div>
                    <div className="text-[8px] text-emerald-200 font-sans text-center pt-0.5 border-t border-emerald-800/60 leading-tight">
                      ភេសជ្ជៈប្រណិត អាចទទួលទានផ្ទាល់ភ្លាមៗ ឬលាយជាមួយកាហ្វេ។ រក្សាទុកក្នុងទូទឹកកកក្រោម ៤°C។
                    </div>
                  </div>

                  {/* Legal & Standards Micro Line */}
                  <div className="text-[8px] text-emerald-300/70 text-center relative z-10 flex items-center justify-center gap-2 pt-0.5">
                    <span>CS 001:2000 National Standard</span>
                    <span>•</span>
                    <span>Phnom Penh, Cambodia</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 mt-3 max-w-md w-full">
                  <p className="text-xs text-slate-500 text-center">
                    💡 <strong>ទំហំស្លាកបង្រួម (Compact 1L Sticker)</strong>៖ ស័ក្តិសមឥតខ្ចោះសម្រាប់បិទលើដបកែវ ឬដប PET ១ លីត្រ។ មិត្តភក្តិ ឬអតិថិជនគ្រាន់តែបើកកាមេរ៉ាទូរស័ព្ទស្កេនកូដ QR លើដប គឺអាច Chat កុម្ម៉ង់ទិញផ្ទាល់តាម WhatsApp បានភ្លាមៗ!
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('mockup')}
                    className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <span>📸 មើលរូបថតដបជាក់ស្តែងលើតុ (View Real Bottle Mockup Photo)</span>
                    <span className="text-[10px] text-amber-700 font-black">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: REALISTIC BOTTLE MOCKUP PHOTO & EVALUATION */}
            {viewMode === 'mockup' && (
              <div className="space-y-4">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-4 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                        📸 Realistic Product Photography
                      </span>
                      <span className="text-xs font-sans font-bold bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full">
                        ដបកែវ ១ លីត្រ (1L Glass Bottle)
                      </span>
                    </div>
                    <h4 className="text-base font-black text-amber-300 font-sans mt-1">
                      រូបថតដបជាក់ស្តែងក្នុងបរិយាកាសចម្ការស្វាយចន្ទីកម្ពុជា
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewMode('compact')}
                      className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
                    >
                      <span>✨ ប្តូរទៅស្លាកបោះពុម្ព (Printable Label)</span>
                    </button>
                  </div>
                </div>

                {/* Main Showcase Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Photo Display */}
                  <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden border border-emerald-500/30 shadow-xl relative group">
                    <img
                      src="/images/mayany_cashew_milk_1l.jpg"
                      alt="100% Plant-Based Cashew Milk 1L Bottle in Cambodian Plantation"
                      className="w-full h-auto object-cover max-h-[580px] mx-auto"
                      onError={(e) => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg'; 
                      }}
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-white text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🥛</span>
                        <div>
                          <div className="font-bold text-amber-300">Mayany Enterprise 1L Cashew Milk</div>
                          <div className="text-[10px] text-slate-300 font-mono">Price: $4.50 ($3.00 Drink + $1.50 Bottle)</div>
                        </div>
                      </div>
                      <a
                        href="/images/mayany_cashew_milk_1l.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-2.5 bg-white/20 hover:bg-white/30 text-white text-[11px] rounded-lg font-bold flex items-center gap-1 transition"
                      >
                        <ExternalLink size={12} />
                        <span>ពង្រីកធំ</span>
                      </a>
                    </div>
                  </div>

                  {/* Design & Marketing Evaluation Panel */}
                  <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
                    {/* Strengths Card */}
                    <div className="bg-emerald-50/80 border border-emerald-300/80 rounded-2xl p-4 text-xs space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                        <Sparkles size={16} className="text-emerald-700" />
                        <span>ចំណុចលេចធ្លោ & សោភ័ណភាព (Design Strengths)</span>
                      </div>
                      <ul className="space-y-2 text-slate-700 font-sans text-[11px] leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold shrink-0">✓</span>
                          <span><strong>ពន្លឺថ្ងៃធម្មជាតិ & បរិយាកាសចម្ការ៖</strong> ពន្លឺថ្ងៃពណ៌មាសជះលើស្លឹកឈើ និងចម្ការស្វាយចន្ទីកម្ពុជា បង្កើតអារម្មណ៍ស្រស់ស្រាយបែប Organic Farm-to-Bottle។</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold shrink-0">✓</span>
                          <span><strong>ការរៀបចំសម្ភារសិប្បកម្ម (Artisanal Styling)៖</strong> ចានឈើដាក់គ្រាប់ស្វាយចន្ទីស្រស់, ក្តារឈើមានគ្រាប់លីង និងស្លឹកតយធម្មជាតិ ធ្វើឱ្យផលិតផលមើលទៅគួរឱ្យចង់ទទួលទាន និងមានតម្លៃខ្ពស់។</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold shrink-0">✓</span>
                          <span><strong>ភាពថ្លានៃដប & គុណភាពទឹកដោះគោ៖</strong> ដបកែវថ្លា ១ លីត្របង្ហាញយ៉ាងច្បាស់ពីសាច់ទឹកដោះគោខាប់រលោង (Creamy viscosity) គ្មានកករ ផ្តល់ទំនុកចិត្តខ្ពស់ដល់អតិថិជន។</span>
                        </li>
                      </ul>
                    </div>

                    {/* Quality Catch / Typo Alert Card */}
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                        <AlertCircle size={16} className="text-amber-700 shrink-0" />
                        <span>ការសង្កេតបច្ចេកទេសលើអក្សរ AI (Quality Catch)</span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed font-sans">
                        នៅលើស្លាកក្នុងរូបថត ខាងក្រោមអក្សរខ្មែរ "ទឹកដោះគោគ្រាប់ស្វាយចន្ទីធម្មជាតិ" ម៉ូដែល AI បានបង្កើតជាលេខ <strong className="text-red-700 bg-red-100 px-1 py-0.2 rounded font-mono">"900%"</strong> ជំនួសឱ្យ <strong className="text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded font-mono">"100%"</strong> (AI text artifact) ទោះបីជាភាសាអង់គ្លេសខាងក្រោមកត់ត្រាត្រូវ "100% Plant-Based" ក៏ដោយ។
                      </p>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[10.5px] text-slate-800 space-y-1">
                        <div className="font-bold text-emerald-900 flex items-center gap-1">
                          <Check size={13} className="text-emerald-700" />
                          <span>ស្លាកបោះពុម្ពក្នុងប្រព័ន្ធយើងត្រឹមត្រូវ ១០០% រួចរាល់៖</span>
                        </div>
                        <p className="text-slate-600">
                          ស្លាកបង្រួមឌីជីថល (Compact Label) ក្នុងផ្ទាំងទី ១ ត្រូវបានរៀបចំត្រឹមត្រូវ ១០០% ទាំងអក្សរខ្មែរ-អង់គ្លេស កូដ QR បញ្ជាទិញ WhatsApp បាកូដ GS1 និងតម្លាភាពតម្លៃ $4.50 សម្រាប់បោះពុម្ពបិទលើដបពិត!
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-600">
                        ប្រើប្រាស់រូបភាពនេះសម្រាប់ផ្សព្វផ្សាយលើបណ្តាញសង្គម ឬ Pitch Deck!
                      </div>
                      <button
                        type="button"
                        onClick={() => setViewMode('compact')}
                        className="py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                      >
                        មើលស្លាកបោះពុម្ព →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: MULTI-LABEL A4 SHEET FOR PRINTING */}
            {viewMode === 'sheet' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <strong>📄 សន្លឹកបោះពុម្ព A4 (A4 Sticker Sheet Preview)</strong>
                    <p className="text-[11px] text-emerald-700">
                      បោះពុម្ព ៤ ស្លាកក្នុងមួយសន្លឹក A4 លើក្រដាសស្ទីគ័រ ដើម្បីកាត់បិទលើដប ៥ លីត្របានភ្លាមៗ។
                    </p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="py-2 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer shrink-0"
                  >
                    <Printer size={15} />
                    <span>បោះពុម្ព A4 ឥឡូវនេះ (Print)</span>
                  </button>
                </div>

                {/* 4-Up Grid on A4 Simulation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100 p-4 rounded-3xl border border-slate-300 print:grid print:grid-cols-2 print:gap-4 print:p-0 print:bg-white print:border-none">
                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] text-white rounded-2xl p-4 border border-amber-400 shadow-md space-y-2 text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <img
                          src="/assets/aistudio/Mayany_Enterprise_Logo_August_26_2026_4cdf6a3d.jpg"
                          alt="Mayany Enterprise"
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400 bg-white"
                        />
                        <div className="text-left">
                          <div className="text-[10px] font-black tracking-wider text-amber-300 uppercase leading-tight">
                            MAYANY ENTERPRISE
                          </div>
                          <div className="text-[8px] text-emerald-200">
                            100% Plant-Based Cashew Milk (1L)
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-black text-amber-200">
                        {flavorVariant === 'pandan' ? 'ទឹកដោះគ្រាប់ស្វាយចន្ទីរសជាតិស្លឹកតយ ១L' : 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទីធម្មជាតិ ១០០%'}
                      </div>
                      <div className="text-[7.5px] text-emerald-200/90 truncate px-2">
                        {currentIngredients}
                      </div>

                      {/* Transparent Price on A4 */}
                      <div className="bg-amber-400 text-slate-950 rounded-lg px-2 py-0.5 text-[8.5px] font-black font-mono flex items-center justify-between mx-2 shadow-2xs">
                        <span>PRICE: ${totalPrice.toFixed(2)}</span>
                        <span className="text-[7px] font-sans font-bold">(${drinkPrice.toFixed(2)} Drink + ${bottlePrice.toFixed(2)} Bottle)</span>
                      </div>

                      {/* QR */}
                      <div className="bg-white rounded-xl p-2 border border-amber-400 flex flex-col items-center justify-center mx-auto w-32">
                        {qrDataUrl && (
                          <img src={qrDataUrl} alt="QR" className="w-24 h-24 object-contain" />
                        )}
                        <span className="text-[8px] font-bold text-emerald-950 font-mono">
                          +855 88 771 2862
                        </span>
                      </div>

                      <div className="text-[8px] text-emerald-200 font-mono flex justify-between px-2">
                        <span>LOT: {currentBatch}</span>
                        <span>1 LITER • 1000ml</span>
                      </div>
                      <div className="text-[7.5px] text-emerald-300 font-mono flex justify-between px-2 border-t border-emerald-800/50 pt-0.5">
                        <span>BARCODE: 884 711635 0054</span>
                        <span>GS1 EAN-13</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: FULL ORIGINAL WRAP REFERENCE */}
            {viewMode === 'original' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      រូបភាពស្លាកដើមធំ (Wide Wrap-Around Label Reference):
                    </span>
                    <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-mono font-bold">
                      Original 400g/ml Wrap
                    </span>
                  </div>
                  <p className="text-slate-500">
                    នេះជារូបភាពស្លាកដបដើមទំហំធំដែលលោកអ្នកបានភ្ជាប់មក។ យើងបានដកស្រង់ព័ត៌មានរូបមន្ត គុណប្រយោជន៍ និងទម្រង់ពណ៌បៃតងត្បូងមរកត (Emerald Green) យកមកបង្កើតជា **ស្លាកបង្រួម ១ លីត្រ (Compact 1L Label)** ខាងលើ ដែលងាយស្រួលបិទ និងមាន QR Code ធំច្បាស់សម្រាប់កុម្ម៉ង់ទិញ!
                  </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 flex items-center justify-center p-2">
                  <img
                    src="/mayany_ke_application_product_collage.jpg"
                    alt="Original Cashew Milk Bottle Label"
                    className="max-h-[450px] w-auto object-contain rounded-xl"
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = '/images/mayany_ke_application_product_collage_1785131513154.jpg'; 
                    }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Actions */}
          <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>
                {isKorean 
                  ? 'QR 코드가 마얀 대표 직통 왓츠앱으로 연결됩니다' 
                  : isKhmer 
                  ? 'កូដ QR តភ្ជាប់ទៅកាន់ WhatsApp ផ្ទាល់របស់កញ្ញា ម៉ាយ៉ានី' 
                  : 'QR connects directly to Mayany WhatsApp (+855 88 771 2862)'}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Copy QR Order Link"
              >
                {copiedLink ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                <span>{copiedLink ? 'បានចម្លង!' : 'ចម្លង Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
              >
                <Download size={15} />
                <span>{isExporting ? 'កំពុងទាញយក...' : 'ទាញយក PNG (Download)'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
              >
                <Printer size={15} />
                <span>បោះពុម្ពស្លាក (Print)</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
