import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Printer, Check, Copy, Sliders, Languages, Award, ShieldCheck, Download, Sparkles, AlertCircle } from 'lucide-react';
import { Batch, Supplier } from '../types';

interface QRCodePrinterProps {
  batch: Batch;
  suppliers: Supplier[];
}

export default function QRCodePrinter({ batch, suppliers }: QRCodePrinterProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Customization states
  const [language, setLanguage] = useState<'bilingual' | 'khmer' | 'english'>('bilingual');
  const [labelSize, setLabelSize] = useState<'standard' | 'compact' | 'square' | 'mini' | 'micro'>('compact');
  const [qrOnlyMode, setQrOnlyMode] = useState<boolean>(false);
  const [customMsg, setCustomMsg] = useState<string>('');
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [includeDate, setIncludeDate] = useState<boolean>(true);
  const [includeStats, setIncludeStats] = useState<boolean>(true);

  // Derive the target application URL for the QR code
  useEffect(() => {
    // Standard landing page is the current app's origin + path with the batch parameter
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const url = `${origin}${pathname}?batch=${batch.batch_id}`;
    setTargetUrl(url);
  }, [batch.batch_id]);

  // Generate QR Code data URL when target URL or layout change
  useEffect(() => {
    if (!targetUrl) return;
    
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then(url => {
        setQrUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code:', err);
      });
  }, [targetUrl]);

  // Copy direct link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger standard browser print
  const handlePrint = () => {
    window.print();
  };

  // Convert Excel serial date to readable date strings
  const getReadableDate = (excelDate: number) => {
    const base = new Date(Date.UTC(1899, 11, 30));
    const msInDay = 24 * 60 * 60 * 1000;
    const date = new Date(base.getTime() + excelDate * msInDay);
    
    const enDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const khmerMonths = [
      'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 
      'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
    ];
    const day = date.getDate();
    const monthKh = khmerMonths[date.getMonth()];
    const yearKh = date.getFullYear();

    return {
      en: enDate,
      kh: `${day} ${monthKh} ${yearKh}`
    };
  };

  const dates = getReadableDate(batch.production_date_raw);

  // Count smallholders linked to this batch
  const farmerCount = batch.sourcing_records.length;
  const mainProvince = batch.sourcing_records[0]?.province || 'Cambodia';

  // Sizing definitions for screen preview
  const sizeClasses = {
    standard: 'w-full max-w-[400px] h-[300px]', // 4x3 aspect ratio
    compact: 'w-full max-w-[320px] h-[256px]',  // 2.5x2 aspect ratio
    square: 'w-full max-w-[280px] h-[280px]',   // 2.5x2.5 aspect ratio
    mini: 'w-full max-w-[240px] h-[170px]',     // 2x1.25 aspect ratio (small box)
    micro: 'w-full max-w-[180px] h-[180px]',    // 1.5x1.5 aspect ratio (micro square)
  };

  // Label Language Texts
  const texts = {
    headline: {
      kh: 'លិខិតបញ្ជាក់ប្រភពដើម',
      en: 'TRACEABILITY VERIFIED'
    },
    scanMe: {
      kh: 'ស្កេនទីនេះ ដើម្បីពិនិត្យប្រភពដើម',
      en: 'Scan to view full traceability certificate'
    },
    product: {
      kh: 'ផលិតផល៖',
      en: 'Product:'
    },
    batch: {
      kh: 'លេខកូដក្រុមផលិត៖',
      en: 'Batch ID:'
    },
    date: {
      kh: 'កាលបរិច្ឆេទផលិត៖',
      en: 'Mfg Date:'
    },
    farmers: {
      kh: 'កសិករខ្នាតតូចសរុប៖',
      en: 'Smallholders Sourced:'
    },
    origin: {
      kh: 'ប្រភពវត្ថុធាតុដើម៖',
      en: 'Source Area:'
    },
    certification: {
      kh: 'ប្រព័ន្ធធានាគុណភាព៖',
      en: 'Standard:'
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-6 space-y-6">
      
      {/* Dynamic Printing Style Injection */}
      <style>{`
        @media print {
          /* Hide all default web layout wrappers */
          body * {
            visibility: hidden;
          }
          /* Force only the sticker component and its children to print */
          #qr-print-sticker, #qr-print-sticker * {
            visibility: visible;
          }
          #qr-print-sticker {
            position: fixed;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: ${labelSize === 'standard' ? '100mm' : labelSize === 'compact' ? '60mm' : labelSize === 'square' ? '65mm' : labelSize === 'mini' ? '50mm' : '38mm'} !important;
            height: ${labelSize === 'standard' ? '75mm' : labelSize === 'compact' ? '50mm' : labelSize === 'square' ? '65mm' : labelSize === 'mini' ? '32mm' : '38mm'} !important;
            margin: 0 !important;
            padding: 4mm !important;
            border: ${showBorder ? '1px solid #000000' : 'none'} !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            box-sizing: border-box !important;
          }
          /* Remove headers and footers from browser printing */
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Printer size={16} className="text-emerald-500" />
            <span>Agricultural QR Sticker Label Maker</span>
          </h3>
          <p className="text-xs text-slate-500">
            Generate and print scan-ready product stickers for batch <strong className="font-mono text-slate-700">{batch.batch_id}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Copy digital trace URL"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Trace URL'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Control Panel: Options (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Preset size selectors */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Sticker Physical Dimensions
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setLabelSize('standard')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  labelSize === 'standard'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="font-bold text-xs font-mono">4" x 3"</div>
                <div className="text-[9px] text-slate-500">Box / Case</div>
              </button>
              <button
                onClick={() => setLabelSize('compact')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  labelSize === 'compact'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="font-bold text-xs font-mono">2.5" x 2"</div>
                <div className="text-[9px] text-slate-500">Pouch / Jar</div>
              </button>
              <button
                onClick={() => setLabelSize('square')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  labelSize === 'square'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="font-bold text-xs font-mono">2.5" x 2.5"</div>
                <div className="text-[9px] text-slate-500">Square Bag</div>
              </button>
              <button
                onClick={() => setLabelSize('mini')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  labelSize === 'mini'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="font-bold text-xs font-mono">2" x 1.25"</div>
                <div className="text-[9px] font-semibold text-emerald-700">Small Box</div>
              </button>
              <button
                onClick={() => setLabelSize('micro')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer col-span-2 ${
                  labelSize === 'micro'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="font-bold text-xs font-mono">1.5" x 1.5" (Micro)</div>
                <div className="text-[9px] font-semibold text-emerald-700">Tiny Box Packaging</div>
              </button>
            </div>
          </div>

          {/* Language selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Languages size={12} /> Sticker Typography Language
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setLanguage('bilingual')}
                className={`p-2 border text-center rounded-lg text-xs transition cursor-pointer ${
                  language === 'bilingual'
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700 font-semibold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                Bilingual (KH+EN)
              </button>
              <button
                onClick={() => setLanguage('khmer')}
                className={`p-2 border text-center rounded-lg text-xs transition cursor-pointer ${
                  language === 'khmer'
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700 font-semibold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                Khmer Only
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`p-2 border text-center rounded-lg text-xs transition cursor-pointer ${
                  language === 'english'
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700 font-semibold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                English Only
              </button>
            </div>
          </div>

          {/* Label Subtext Customization */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Custom Label Tagline</span>
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="e.g. ធម្មជាតិពិតៗពីខេត្តបាត់ដំបង! / 100% Traceable"
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-sans"
            />
          </div>

          {/* Toggle features */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 text-xs text-slate-700">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Layout Settings</span>
            
            <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
              <input
                type="checkbox"
                checked={qrOnlyMode}
                onChange={(e) => setQrOnlyMode(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span>Print QR Code Only (Minimalist Box Format)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showBorder}
                onChange={(e) => setShowBorder(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span>Include Sticker Outer Border Line</span>
            </label>

            {!qrOnlyMode && (
              <>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDate}
                    onChange={(e) => setIncludeDate(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span>Include Production Date</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeStats}
                    onChange={(e) => setIncludeStats(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span>Include Sourcing Counts (Smallholders, Province)</span>
                </label>
              </>
            )}
          </div>

          {/* Print Action Trigger */}
          <button
            onClick={handlePrint}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold tracking-wider py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer size={16} />
            <span>PRINT QR STICKER NOW</span>
          </button>

          {/* Mini Guide for Thermal Printing */}
          <div className="bg-emerald-50/50 border border-emerald-200/60 p-4 rounded-xl flex gap-3 text-xs text-emerald-800 leading-normal font-sans">
            <AlertCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-emerald-950">Dalin's Quick Thermal Sticker Guide:</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                In the print window that opens, select your <strong>thermal label printer</strong> (e.g. Xprinter or Zebra). Under <em>More Settings</em>: set <strong>Margins</strong> to <strong>None</strong> and uncheck <strong>Headers & Footers</strong> to print a perfect borderless adhesive sticker!
              </p>
            </div>
          </div>
        </div>

        {/* Right Preview Panel: (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center border border-slate-200 bg-slate-200/40 rounded-xl p-6 min-h-[380px] relative">
          
          <div className="absolute top-3 left-3 flex items-center gap-1 text-[9px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles size={10} className="text-amber-500" /> Print Alignment Preview
          </div>

          {/* Printable Label Structure */}
          <div 
            id="qr-print-sticker"
            className={`${sizeClasses[labelSize]} bg-white shadow-md border ${showBorder ? 'border-black' : 'border-dashed border-slate-300'} p-2.5 flex flex-col justify-between text-black transition-all overflow-hidden select-none`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {qrOnlyMode ? (
              /* Minimalist QR Only Layout for Small Packaging Boxes */
              <div className="h-full flex flex-col items-center justify-between py-1 text-center">
                <div className="flex items-center justify-between w-full border-b border-black/20 pb-1 px-1">
                  <span className="text-[7.5px] font-extrabold font-mono tracking-widest uppercase text-black">M'DAY VERIFIED</span>
                  <span className="text-[8px] font-black font-mono text-black">#{batch.batch_id}</span>
                </div>

                <div className="flex-1 flex items-center justify-center py-1">
                  {qrUrl ? (
                    <img 
                      src={qrUrl} 
                      alt="Traceability QR Code" 
                      className={`${labelSize === 'micro' ? 'w-16 h-16' : labelSize === 'mini' ? 'w-20 h-20' : 'w-28 h-28'} border border-black p-0.5 bg-white object-contain`}
                    />
                  ) : (
                    <div className="w-20 h-20 border border-dashed border-black/40 flex items-center justify-center bg-black/5">
                      <span className="text-[8px] font-mono text-black/40 text-center px-1">QR...</span>
                    </div>
                  )}
                </div>

                <div className="w-full border-t border-black/20 pt-1">
                  <span className="text-[7px] font-extrabold text-black font-sans tracking-tight uppercase block leading-tight">
                    {texts.scanMe.kh}
                  </span>
                  <span className="text-[6.5px] font-bold text-black font-mono tracking-widest uppercase block leading-none mt-0.5">
                    SCAN TO TRACE
                  </span>
                </div>
              </div>
            ) : (
              /* Standard Full Passport Sticker Layout */
              <>
                {/* 1. Header Area */}
                <div className="border-b border-black pb-1.5 flex justify-between items-center shrink-0">
                  <div className="space-y-0.5">
                    {(language === 'bilingual' || language === 'khmer') && (
                      <h4 className="text-[10px] font-extrabold tracking-tight font-sans text-black leading-none uppercase">
                        {texts.headline.kh}
                      </h4>
                    )}
                    {(language === 'bilingual' || language === 'english') && (
                      <h5 className="text-[8px] font-bold tracking-widest text-black leading-none uppercase font-mono">
                        {texts.headline.en}
                      </h5>
                    )}
                  </div>
                  <div className="border border-black px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-widest text-black bg-black/5 uppercase flex items-center gap-0.5">
                    <Award size={8} /> M'day verified
                  </div>
                </div>

                {/* 2. Middle Content Area: Left stats, Right QR */}
                <div className="flex-1 py-2 flex items-center justify-between gap-3 overflow-hidden">
                  
                  {/* Product and Batch Specs (Left) */}
                  <div className="space-y-1.5 flex-1 min-w-0 pr-1 text-black font-sans">
                    {/* Product Name */}
                    <div>
                      <span className="text-[7.5px] font-mono text-black/50 block font-bold leading-none uppercase">
                        {language === 'english' ? texts.product.en : texts.product.kh}
                      </span>
                      <p className="text-xs font-bold leading-tight text-black truncate uppercase">
                        {batch.product_name}
                      </p>
                    </div>

                    {/* Batch Number */}
                    <div className="flex items-baseline gap-1">
                      <div>
                        <span className="text-[7.5px] font-mono text-black/50 block font-bold leading-none uppercase">
                          {language === 'english' ? texts.batch.en : texts.batch.kh}
                        </span>
                        <span className="text-sm font-black font-mono leading-none tracking-wider text-black">
                          {batch.batch_id}
                        </span>
                      </div>
                    </div>

                    {/* Date specification */}
                    {includeDate && (
                      <div>
                        <span className="text-[7.5px] font-mono text-black/50 block font-bold leading-none uppercase">
                          {language === 'english' ? texts.date.en : texts.date.kh}
                        </span>
                        <p className="text-[9px] font-bold font-mono text-black leading-none">
                          {language === 'khmer' ? dates.kh : language === 'english' ? dates.en : `${dates.kh} / ${dates.en}`}
                        </p>
                      </div>
                    )}

                    {/* Custom User Tagline if present */}
                    {customMsg ? (
                      <p className="text-[8.5px] font-bold text-black border-t border-dashed border-black/20 pt-1 italic font-sans leading-snug truncate">
                        • {customMsg}
                      </p>
                    ) : (
                      includeStats && (
                        <div className="space-y-0.5 border-t border-dashed border-black/20 pt-1 text-[7.5px] font-medium leading-normal text-black font-sans">
                          <p className="truncate">
                            <strong>{language === 'english' ? texts.farmers.en : texts.farmers.kh}</strong> {farmerCount} farmers
                          </p>
                          <p className="truncate">
                            <strong>{language === 'english' ? texts.origin.en : texts.origin.kh}</strong> {mainProvince}, KH
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* QR Image Area (Right) */}
                  <div className="flex flex-col items-center shrink-0 justify-center">
                    {qrUrl ? (
                      <img 
                        src={qrUrl} 
                        alt="Traceability QR Code" 
                        className={`${labelSize === 'micro' ? 'w-14 h-14' : labelSize === 'mini' ? 'w-16 h-16' : labelSize === 'compact' ? 'w-20 h-20' : 'w-22 h-22'} border border-black p-0.5 bg-white object-contain`}
                      />
                    ) : (
                      <div className="w-20 h-20 border border-dashed border-black/40 flex items-center justify-center bg-black/5">
                        <span className="text-[8px] font-mono text-black/40 text-center px-2">Generating QR...</span>
                      </div>
                    )}
                    <span className="text-[7.5px] font-bold font-mono text-black mt-1 tracking-wider uppercase bg-black text-white px-1 rounded-sm leading-none py-0.5">
                      B-${batch.batch_id}
                    </span>
                  </div>

                </div>

                {/* 3. Bottom Footer Text */}
                <div className="border-t border-black pt-1 flex flex-col items-center justify-center shrink-0">
                  {(language === 'bilingual' || language === 'khmer') && (
                    <span className="text-[8.5px] font-extrabold text-black font-sans text-center leading-none tracking-tight">
                      {texts.scanMe.kh}
                    </span>
                  )}
                  {(language === 'bilingual' || language === 'english') && (
                    <span className="text-[7px] font-bold text-black font-mono text-center leading-none mt-0.5 tracking-tight uppercase">
                      {texts.scanMe.en}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
