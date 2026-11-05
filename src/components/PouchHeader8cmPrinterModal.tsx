import React, { useState } from 'react';
import { 
  Printer, Download, Copy, Check, Sparkles, X, Phone, Send, Globe, 
  Facebook, CheckCircle2, Eye, FileText, Layers, ExternalLink, ShieldCheck,
  MessageCircle, Info, QrCode, Sliders
} from 'lucide-react';
import { MayanyRoyalGoldSeal } from './MayanyRoyalGoldSeal';

interface PouchHeader8cmPrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  customLogoUrl?: string;
  brandName?: string;
  initialPhone?: string;
  initialFacebook?: string;
  initialWebsite?: string;
}

export const PouchHeader8cmPrinterModal: React.FC<PouchHeader8cmPrinterModalProps> = ({
  isOpen,
  onClose,
  customLogoUrl,
  brandName = 'Mayany Enterprise',
  initialPhone = '+855887712862',
  initialFacebook = 'Mayany Enterprise',
  initialWebsite = 'mayanyenterprise.com'
}) => {
  if (!isOpen) return null;

  // Contact info states
  const [phone, setPhone] = useState(initialPhone);
  const [telegram, setTelegram] = useState(initialPhone);
  const [whatsapp, setWhatsapp] = useState(initialPhone);
  const [facebook, setFacebook] = useState(initialFacebook);
  const [website, setWebsite] = useState(initialWebsite);
  const [taglineKhmer, setTaglineKhmer] = useState('🇰🇭 ផលិតផលកម្ពុជា • គ្រាប់ស្វាយចន្ទី');
  const [taglineEnglish, setTaglineEnglish] = useState('Premium Cambodian Cashews');

  // Display and layout options
  const [styleTheme, setStyleTheme] = useState<'luxury-dark' | 'artisan-kraft' | 'crisp-white' | 'gold-border'>('luxury-dark');
  const [layoutMode, setLayoutMode] = useState<'smart-compact' | 'expanded-lines'>('smart-compact');
  const [showRulerGuides, setShowRulerGuides] = useState<boolean>(true);
  const [showPouchMockup, setShowPouchMockup] = useState<boolean>(true);
  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Formatted telephone with spacing for readability: +855 88 771 2862
  const formattedPhone = phone.replace(/(\+855)(\d{2})(\d{3})(\d{3,4})/, '$1 $2 $3 $4');

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPrinterSpec = () => {
    const spec = `📐 ប្លង់បោះពុម្ពស្លាកក្បាលកញ្ចប់ 8cm (Pouch Header Banner Label Specification)
--------------------------------------------------
សហគ្រាស៖ ${brandName}
ទំហំកញ្ចប់ជាក់ស្តែង (Bag Width)៖ 80 mm (8 cm)
ទំហំស្លាកកាត់ចុងក្រោយ (Finished Label Size)៖ 70 mm × 30 mm (7.0 cm × 3.0 cm)
[គម្លាតសងខាងកញ្ចប់ (Side Margins)៖ 5 mm ឆ្វេង | 5 mm ស្ដាំ]

ការបែងចែកប្លង់ (Layout Grid):
1. ផ្នែកខាងឆ្វេង (Left Section - 30 mm × 30 mm):
   • ឡូហ្គោម៉ាក (Brand Medallion Logo): 3.0 cm × 3.0 cm
   • រូបរាង៖ មូលអមក្បាច់មាស Royal Gold Seal

2. ផ្នែកខាងស្តាំ (Right Section - 40 mm × 30 mm):
   • ទូរស័ព្ទ / Telegram / WhatsApp៖ ${phone}
   • ហ្វេសប៊ុក (Facebook)៖ ${facebook}
   • គេហទំព័រ (Website)៖ ${website}
   • ពាក្យស្លោកសម្គាល់៖ ${taglineKhmer} (${taglineEnglish})

ការណែនាំបច្ចេកទេសរោងពុម្ព (Technical Printing Spec):
• Bleed (គែមលើសសម្រាប់កាត់)៖ 2 mm ជុំវិញ (Artwork Size: 74 mm × 34 mm)
• Resolution (កម្រិតច្បាស់)៖ 300 DPI ឡើងទៅ
• Color Mode៖ CMYK / High-Density Metallic Gold Foiling (Hot Stamping Gold)
• ប្រភេទក្រដាស/ស្ទិកឃ័រ៖ ស្ទិកឃ័រមិនជ្រាបទឹក (Waterproof Matte Vinyl / Metallic Foil / Kraft Sticker)
• កាំកោងគែម (Corner Radius)៖ 2.0 mm (Die-cut Rounded Corners)`;

    navigator.clipboard.writeText(spec).then(() => {
      setCopiedSpec(true);
      setTimeout(() => setCopiedSpec(false), 3000);
    });
  };

  const handleCopyContactText = () => {
    const text = `Telephone: ${phone}\nTelegram: ${telegram}\nWhatsApp: ${whatsapp}\nFacebook: ${facebook}\nWebsite: ${website}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in no-print overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-6 my-6 max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 text-xl font-black shadow-xs">
              🏷️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-sans">
                  ប្លង់បោះពុម្ពស្លាកក្បាលកញ្ចប់ ៨cm (3cm Logo + 3cm Info)
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  80mm Pouch Header
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                ប្លង់តាមខ្នាតពិត៖ ឡូហ្គោខាងឆ្វេង (3cm) + ព័ត៌មានខាងស្តាំ (3cm - 4cm) ស័ក្តិសមឥតខ្ចោះលើកញ្ចប់ទទឹង 8cm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Style & Theme Selector Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 font-sans">
              រចនាបថពណ៌ (Color Theme):
            </span>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setStyleTheme('luxury-dark')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  styleTheme === 'luxury-dark'
                    ? 'bg-slate-950 text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-amber-400"></span>
                <span>Luxury Gold & Black</span>
              </button>
              <button
                type="button"
                onClick={() => setStyleTheme('artisan-kraft')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  styleTheme === 'artisan-kraft'
                    ? 'bg-amber-900 text-amber-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-700 border border-amber-300"></span>
                <span>Artisan Kraft</span>
              </button>
              <button
                type="button"
                onClick={() => setStyleTheme('crisp-white')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  styleTheme === 'crisp-white'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400"></span>
                <span>Crisp White</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLayoutMode(layoutMode === 'smart-compact' ? 'expanded-lines' : 'smart-compact')}
              className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Layers size={13} className="text-amber-600" />
              <span>{layoutMode === 'smart-compact' ? 'របៀបបង្រួមឆ្លាតវៃ (Smart Compact)' : 'បង្ហាញរាយបន្ទាត់ (Detailed Lines)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRulerGuides(!showRulerGuides)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                showRulerGuides ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <Sliders size={13} />
              <span>បន្ទាត់ខ្នាត (Ruler)</span>
            </button>
          </div>
        </div>

        {/* 1. ACTUAL 1:1 SCALE BANNER PREVIEW (70mm × 30mm for 80mm Pouch) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>📐</span>
              <span>ប្លង់ស្លាកខ្នាតជាក់ស្តែង (Actual 1:1 Scale Label: 70mm × 30mm)</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              សល់គែម 5mm សងខាងលើកញ្ចប់ 80mm
            </span>
          </div>

          {/* Label Container with Dimension Guides */}
          <div className="p-4 sm:p-6 bg-slate-100 rounded-2xl border border-slate-300 flex flex-col items-center justify-center relative overflow-hidden">
            {/* 80mm Bag Width Reference Frame */}
            {showRulerGuides && (
              <div className="w-full max-w-[480px] mb-2 flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 border-b border-dashed border-slate-400 pb-1">
                <span>|◄ 0 mm</span>
                <span className="text-amber-900 font-sans">ទទឹងកញ្ចប់សរុប ៨០ mm (8 cm Pouch Width)</span>
                <span>80 mm ►|</span>
              </div>
            )}

            {/* The 70mm × 30mm Banner Label */}
            <div 
              id="printable-8cm-header-banner"
              className={`w-full max-w-[440px] h-[160px] sm:h-[175px] rounded-2xl p-3 sm:p-4 shadow-xl border-2 transition-all flex items-center justify-between gap-3 relative select-none ${
                styleTheme === 'luxury-dark'
                  ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-amber-500/60 ring-1 ring-amber-400/30'
                  : styleTheme === 'artisan-kraft'
                  ? 'bg-gradient-to-r from-[#d9b88c] via-[#e6cca8] to-[#d9b88c] text-amber-950 border-[#a47b48]'
                  : 'bg-gradient-to-r from-white via-slate-50 to-white text-slate-900 border-slate-300'
              }`}
            >
              {/* Left Section: 3cm × 3cm Logo Zone */}
              <div className="w-[125px] sm:w-[135px] h-full flex flex-col items-center justify-center shrink-0 border-r border-dashed border-amber-400/40 pr-2 sm:pr-3 relative">
                {showRulerGuides && (
                  <span className="absolute -top-1 -left-1 text-[8px] font-mono px-1 rounded bg-black/50 text-amber-300">
                    30×30 mm
                  </span>
                )}
                
                {customLogoUrl ? (
                  <img 
                    src={customLogoUrl} 
                    alt="Mayany Brand Logo" 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-full drop-shadow-md"
                  />
                ) : (
                  <div className="relative flex flex-col items-center">
                    <MayanyRoyalGoldSeal 
                      size={92} 
                      className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg"
                      brandName="Mayany"
                      subText="ENTERPRISE"
                    />
                  </div>
                )}
              </div>

              {/* Right Section: 3cm to 4cm Contact Info Zone */}
              <div className="flex-1 flex flex-col justify-center space-y-1.5 pl-1 sm:pl-2">
                {showRulerGuides && (
                  <div className="flex items-center justify-between text-[8px] font-mono text-amber-400/80">
                    <span>◄ 40 mm Info Zone ►</span>
                    <span className="px-1 bg-amber-400/10 rounded">30 mm H</span>
                  </div>
                )}

                {/* Brand Name Headline */}
                <div>
                  <div className={`text-xs sm:text-sm font-black tracking-wide font-serif ${
                    styleTheme === 'luxury-dark' ? 'text-amber-300' : styleTheme === 'artisan-kraft' ? 'text-amber-950' : 'text-slate-950'
                  }`}>
                    {brandName}
                  </div>
                  <div className={`text-[8.5px] sm:text-[9px] font-bold ${
                    styleTheme === 'luxury-dark' ? 'text-amber-200/80' : 'text-amber-900'
                  }`}>
                    {taglineKhmer}
                  </div>
                </div>

                {/* Contact Rows */}
                {layoutMode === 'smart-compact' ? (
                  /* Option 1: Consolidated Smart Row */
                  <div className="space-y-1 text-[9.5px] sm:text-[10px]">
                    <div className="flex items-center gap-1.5 font-mono font-bold tracking-tight">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Phone size={11} className="shrink-0" />
                        <Send size={11} className="shrink-0" />
                        <MessageCircle size={11} className="shrink-0" />
                      </div>
                      <span className={styleTheme === 'luxury-dark' ? 'text-white' : 'text-slate-900'}>
                        {formattedPhone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Facebook size={11} className="text-blue-400 shrink-0" />
                      <span className="font-semibold truncate">
                        {facebook}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono">
                      <Globe size={11} className="text-emerald-400 shrink-0" />
                      <span className={`font-bold tracking-tight ${
                        styleTheme === 'luxury-dark' ? 'text-amber-300' : 'text-emerald-900'
                      }`}>
                        {website}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Option 2: Detailed 5-item rows */
                  <div className="space-y-0.5 text-[8.5px] sm:text-[9px] font-mono leading-tight">
                    <div className="flex items-center gap-1">
                      <Phone size={10} className="text-amber-400" />
                      <span>Tel: {formattedPhone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Send size={10} className="text-sky-400" />
                      <span>TG: {formattedPhone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={10} className="text-emerald-400" />
                      <span>WA: {formattedPhone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Facebook size={10} className="text-blue-400" />
                      <span className="truncate">FB: {facebook}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe size={10} className="text-amber-400" />
                      <span className="font-bold truncate">{website}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Guideline Info */}
            <div className="mt-3 text-center text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>
                ទំហំស្លាកសរុប <strong>70 mm × 30 mm</strong> — នៅសល់ចំហៀង <strong>5 mm</strong> សងខាង ធានាមិនជាន់គែមថង់ និងស្អាតប្រណិត!
              </span>
            </div>
          </div>
        </div>

        {/* 2. REALISTIC 8cm STANDUP POUCH SIMULATION */}
        {showPouchMockup && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>🛍️</span>
                <span>ទិដ្ឋភាពពេលបិទលើកញ្ចប់ជាក់ស្តែង (Realistic 8cm Pouch Simulation)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                ទទឹងកញ្ចប់ 8cm × កម្ពស់ 13cm
              </span>
            </div>

            <div className="bg-slate-900/95 p-6 rounded-2xl flex items-center justify-center overflow-hidden">
              {/* Standup Pouch Container (80mm Wide scaled proportionally) */}
              <div className="w-[260px] h-[370px] bg-gradient-to-b from-stone-800 via-stone-900 to-black rounded-3xl border-2 border-stone-700 shadow-2xl relative flex flex-col items-center p-3">
                {/* Zipper top & hang hole */}
                <div className="w-full flex items-center justify-between px-3 pt-1 pb-2 border-b border-stone-700/80">
                  <div className="w-2 h-1 bg-stone-600 rounded-sm"></div>
                  <div className="w-8 h-2.5 bg-stone-700 rounded-full border border-stone-600"></div>
                  <div className="w-2 h-1 bg-stone-600 rounded-sm"></div>
                </div>

                {/* Tear Notch */}
                <div className="w-full flex justify-between px-1 py-1 border-b border-dashed border-stone-700/50">
                  <span className="text-[8px] font-mono text-stone-500">◀ TEAR</span>
                  <span className="text-[8px] font-mono text-stone-500">TEAR ▶</span>
                </div>

                {/* THE 70mm × 30mm HEADER LABEL APPLIED HERE */}
                <div className="w-[230px] my-3">
                  <div className={`p-2 rounded-xl border shadow-lg flex items-center justify-between gap-2 ${
                    styleTheme === 'luxury-dark'
                      ? 'bg-black/90 text-white border-amber-500/70 ring-1 ring-amber-400/40'
                      : styleTheme === 'artisan-kraft'
                      ? 'bg-[#d9b88c] text-amber-950 border-[#a47b48]'
                      : 'bg-white text-slate-950 border-slate-300'
                  }`}>
                    {/* 3cm Logo on bag */}
                    <div className="w-14 h-14 flex items-center justify-center shrink-0">
                      {customLogoUrl ? (
                        <img src={customLogoUrl} alt="Logo" className="w-12 h-12 object-contain" />
                      ) : (
                        <MayanyRoyalGoldSeal size={52} className="w-12 h-12" />
                      )}
                    </div>

                    {/* 3cm Info on bag */}
                    <div className="flex-1 space-y-0.5 text-[8px] leading-tight">
                      <div className="font-bold text-[9px] font-serif text-amber-400">
                        {brandName}
                      </div>
                      <div className="flex items-center gap-1 font-mono font-bold">
                        <span>📞/TG:</span>
                        <span>{phone}</span>
                      </div>
                      <div className="truncate">
                        FB: {facebook}
                      </div>
                      <div className="font-mono text-amber-300 font-bold truncate">
                        {website}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Transparent Window with Golden Cashews */}
                <div className="w-[200px] h-[110px] rounded-2xl bg-black/40 border-2 border-stone-600/60 overflow-hidden relative flex items-center justify-center shadow-inner my-auto">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent"></div>
                  <div className="text-center space-y-1 z-10">
                    <span className="text-3xl">🥜</span>
                    <div className="text-[10px] font-bold text-amber-200/90 tracking-wide font-sans">
                      គ្រាប់ស្វាយចន្ទីម្រេចកំពត GI
                    </div>
                    <div className="text-[8px] text-stone-300 font-mono">
                      NET WT. 50g (ក្រាម)
                    </div>
                  </div>
                </div>

                {/* Bag bottom gusset indicator */}
                <div className="w-full text-center pb-1">
                  <span className="text-[8px] font-mono text-stone-500">
                    MADE IN CAMBODIA • 🇰🇭
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUTHENTIC 50g POUCH PHOTOGRAPHY SHOWCASE */}
        <div className="bg-gradient-to-r from-amber-50 via-slate-50 to-emerald-50 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📸</span>
              <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                រូបថតកញ្ចប់ជាក់ស្តែង ៥០g ទាំង ៣ ប្រភេទ (Authentic 50g Pouch Lineup):
              </span>
            </div>
            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono">
              50g = $1.00 USD (៤,១០០ ៛)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* 1. Chili Kraft Pouch */}
            <div className="bg-white rounded-xl border border-amber-200 p-2.5 shadow-xs flex flex-col items-center text-center space-y-1.5 group">
              <div className="w-full h-44 rounded-lg overflow-hidden bg-stone-100 flex items-center justify-center relative">
                <img
                  src="/images/mayany_chili_pouch_50g.jpg"
                  alt="Chili Coated Cashews 50g Kraft Pouch"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-[11px] font-bold text-amber-950 font-sans">
                🌶️ ស្រោបម្ទេស (Kraft Pouch)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Chili Coated • 50g = $1.00
              </div>
            </div>

            {/* 2. Sugar White Pouch */}
            <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex flex-col items-center text-center space-y-1.5 group">
              <div className="w-full h-44 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center relative">
                <img
                  src="/images/mayany_sugar_pouch_50g.jpg"
                  alt="Sugar Coated Cashews 50g White Pouch"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-[11px] font-bold text-slate-900 font-sans">
                🍯 ស្រោបស្ករ (White Pouch)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Sugar Coated • 50g = $1.00
              </div>
            </div>

            {/* 3. Pepper Black Pouch (Whole Kernels) */}
            <div className="bg-white rounded-xl border border-stone-800 p-2.5 shadow-xs flex flex-col items-center text-center space-y-1.5 group">
              <div className="w-full h-44 rounded-lg overflow-hidden bg-stone-900 flex items-center justify-center relative">
                <img
                  src="/images/mayany_pepper_pouch_50g.jpg"
                  alt="GI Kampot Black Pepper Cashews 50g Black Pouch Whole"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-[11px] font-bold text-stone-950 font-sans">
                🧂 ម្រេចកំពត GI (គ្រាប់ពេញ)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Whole Kernels • 50g = $1.00
              </div>
            </div>

            {/* 4. Pepper Black Pouch (BB Broken Kernels) */}
            <div className="bg-white rounded-xl border border-amber-600/70 p-2.5 shadow-xs flex flex-col items-center text-center space-y-1.5 group">
              <div className="w-full h-44 rounded-lg overflow-hidden bg-stone-900 flex items-center justify-center relative">
                <img
                  src="/images/mayany_pepper_broken_pouch_50g.jpg"
                  alt="GI Kampot Black Pepper Cashews 50g BB Broken Grade"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-[11px] font-bold text-stone-950 font-sans">
                🧂 ម្រេចកំពត GI (គ្រាប់បំណែក BB)
              </div>
              <div className="text-[10px] text-amber-700 font-mono font-bold">
                Broken Grade • 50g = $0.65
              </div>
            </div>
          </div>
        </div>

        {/* 3. QUICK EDIT FORM FOR CONTACT INFO */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            ✏️ កែប្រែព័ត៌មានទំនាក់ទំនង (Editable Contact Info):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                📞 លេខទូរស័ព្ទ / Telegram / WA:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setTelegram(e.target.value);
                  setWhatsapp(e.target.value);
                }}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-300 outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                📘 ឈ្មោះ Facebook Page:
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-300 outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                🌐 គេហទំព័រ (Website):
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-300 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPrinterSpec}
              className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-amber-300 shadow-2xs"
              title="ចម្លងលក្ខណៈបច្ចេកទេសដើម្បីផ្ញើទៅរោងពុម្ពតាម Telegram"
            >
              {copiedSpec ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
              <span>{copiedSpec ? '✓ បានចម្លង Spec ផ្ញើទៅរោងពុម្ព!' : 'ចម្លង Spec ផ្ញើរោងពុម្ព (Copy Spec)'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyContactText}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedText ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedText ? 'បានចម្លង!' : 'ចម្លងអត្ថបទ'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer size={14} />
              <span>បោះពុម្ពប្លង់ 1:1 (Print Label)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
            >
              បិទ (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
