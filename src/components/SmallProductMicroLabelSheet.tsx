import React, { useState } from 'react';
import { Printer, Download, Sparkles, Scissors, Info, ArrowDown, ShieldCheck, CheckCircle2, QrCode, Tag, ExternalLink, Image } from 'lucide-react';
import { CAMBODIA_CERTIFICATION_STANDARDS, RECYCLE_BADGE_OPTIONS } from '../data/labelAddressPresets';

interface SmallProductMicroLabelSheetProps {
  productNameKhmer: string;
  productNameEnglish: string;
  subheadingOrBotanical: string;
  netWeight: string;
  ingredientsList: string;
  allergenBox: string;
  companyName: string;
  companyAddress: string;
  countryOfOrigin: string;
  lotNumber: string;
  mfdDate: string;
  expDate: string;
  bbdDate?: string;
  pkdDate?: string;
  dateMarkingScheme?: string;
  ean13Code: string;
  formattedEan: string;
  barcodeBinary: string;
  qrDataUrl: string;
  registrationMark: string;
  trademarkLogoText: string;
  labelTheme: 'supermarket-clean' | 'artisan-kraft' | 'premium-black' | 'modern-green';
  retailPrice?: string;
  brandLogoUrl?: string;
  selectedCertifications?: string[];
  selectedRecycle?: string;
  selectedSlogan?: string;
  customSloganText?: string;
  showRecycleBadge?: boolean;
  showSocialSlogan?: boolean;
}

export default function SmallProductMicroLabelSheet({
  productNameKhmer,
  productNameEnglish,
  subheadingOrBotanical,
  netWeight,
  ingredientsList,
  allergenBox,
  companyName,
  companyAddress,
  countryOfOrigin,
  lotNumber,
  mfdDate,
  expDate,
  bbdDate,
  pkdDate,
  dateMarkingScheme = 'cs001_standard',
  formattedEan,
  barcodeBinary,
  qrDataUrl,
  registrationMark,
  trademarkLogoText,
  labelTheme,
  retailPrice = 'Sample (៥០ក្រាម)',
  brandLogoUrl = '/mayany_official_logo.jpg',
  selectedCertifications = ['cs-mark', 'ghp-cambodia', 'gmp-cambodia'],
  selectedRecycle = 'pp-05',
  selectedSlogan = 'anti_drug',
  customSloganText = 'ចូលរួមទាំងអស់គ្នាដើម្បីជីវិត និងសហគមន៍គ្មានគ្រឿងញៀន!',
  showRecycleBadge = true,
  showSocialSlogan = true
}: SmallProductMicroLabelSheetProps) {
  const [sheetMode, setSheetMode] = useState<'micro-label-60x40' | 'mini-qr-35x35'>('mini-qr-35x35');

  const handlePrintA4Sheet = () => {
    window.print();
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Brand Asset Download & 50g Sample Helper */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 p-4 rounded-2xl border border-emerald-500/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded font-mono uppercase">
              Brand Asset & Sample Kit
            </span>
            <span className="text-xs font-bold text-amber-300">
              កញ្ចប់គំរូ ៥០g សម្រាប់ Techo Startup Center (300 កញ្ចប់)
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            ទាញយក Logo ផ្លូវការរបស់ Mayany Enterprise & CashewTrace ឬបោះពុម្ព QR ស្ទីកឃ័រ <strong>៣៥ សន្លឹកក្នុងមួយទំព័រ A4</strong> សម្រាប់បិទលើកញ្ចប់គំរូ ៥០g។
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={brandLogoUrl}
            download={brandLogoUrl === '/mayany_official_logo.jpg' ? 'Mayany_Enterprise_Official_Logo.jpg' : 'SME_Brand_Logo.png'}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer text-[11px]"
          >
            <Download size={13} />
            <span>{brandLogoUrl === '/mayany_official_logo.jpg' ? 'ទាញយក Mayany Logo' : 'ទាញយក Brand Logo'}</span>
          </a>
          <a
            href="/icon.svg"
            download="CashewTrace_Official_Logo.svg"
            className="bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold px-3 py-2 rounded-xl transition border border-emerald-500/40 flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Download size={13} />
            <span>CashewTrace Logo</span>
          </a>
        </div>
      </div>

      {/* Mode Selector Header Bar */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded uppercase font-mono">
              {sheetMode === 'mini-qr-35x35' ? 'Mini QR Sticker (35x35mm)' : 'Micro-Label (60x40mm)'}
            </span>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold font-sans">
              {sheetMode === 'mini-qr-35x35' 
                ? 'ទំហំតូចពិសេស 35mm × 35mm (៣៥ ស្ទីកឃ័រ/សន្លឹក A4 - សម្រាប់កញ្ចប់ 50g)' 
                : 'ទំហំតូច 60mm × 40mm (២១ ស្លាក/សន្លឹក A4)'}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSheetMode('mini-qr-35x35')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                sheetMode === 'mini-qr-35x35'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <QrCode size={13} />
              <span>1. Mini QR Sticker (35x35mm - 35 Stickers/A4)</span>
            </button>
            <button
              type="button"
              onClick={() => setSheetMode('micro-label-60x40')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                sheetMode === 'micro-label-60x40'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Tag size={13} />
              <span>2. Micro-Label (60x40mm - 21 Labels/A4)</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrintA4Sheet}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
        >
          <Printer size={15} />
          <span>ព្រីនសន្លឹក A4 ({sheetMode === 'mini-qr-35x35' ? 'Print 35 Mini QR' : 'Print 21-up'})</span>
        </button>
      </div>

      {/* SINGLE ITEM PREVIEW */}
      <div className="no-print">
        {sheetMode === 'mini-qr-35x35' ? (
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
              <span className="flex items-center gap-1.5">
                <QrCode size={14} />
                <span>គំរូ Mini QR Sticker 35mm × 35mm (សម្រាប់បិទលើកញ្ចប់គំរូ ៥០ក្រាម):</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Live Scannable Passport</span>
            </div>

            <div className="flex justify-center p-3">
              <div className="w-[200px] h-[200px] rounded-2xl bg-white text-slate-950 p-2.5 shadow-2xl border-2 border-amber-400 flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between border-b border-slate-200 pb-1">
                  <span className="text-[8px] font-black uppercase text-amber-600 tracking-wider font-mono">
                    ★ MAYANY ★
                  </span>
                  <span className="text-[7.5px] font-bold bg-amber-500 text-slate-950 px-1 py-0.2 rounded">
                    {netWeight || '50 g ℮'}
                  </span>
                </div>

                <div className="my-0.5">
                  <p className="text-[9.5px] font-black leading-tight text-slate-900 truncate max-w-[170px]">
                    {productNameKhmer.split('(')[0]}
                  </p>
                  <p className="text-[7.5px] font-bold text-slate-600 truncate max-w-[170px]">
                    {productNameEnglish.split('(')[0]}
                  </p>
                </div>

                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Trace QR" className="w-20 h-20 rounded bg-white p-1 border border-slate-300 shadow-sm" />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                    <QrCode size={32} />
                  </div>
                )}

                <div className="w-full pt-1 border-t border-slate-200 flex items-center justify-between text-[7px] font-mono text-slate-600">
                  <span className="font-bold text-emerald-700 truncate max-w-[90px]">LOT: {lotNumber}</span>
                  <span className="text-amber-700 font-bold">SCAN FOR TRACE</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Micro-Label Card */
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Scissors size={13} />
                <span>គំរូស្លាកសញ្ញាទំហំតូច (Single Micro-Label 60mm × 40mm Preview):</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">CS 001 Compliant</span>
            </div>

            <div className="flex justify-center p-3">
              <div className={`w-full max-w-[340px] rounded-xl border-2 p-3 shadow-xl flex flex-col justify-between transition ${
                labelTheme === 'artisan-kraft' ? 'bg-[#f4ebe1] text-slate-900 border-[#b89569]' :
                labelTheme === 'premium-black' ? 'bg-slate-950 text-white border-amber-500 ring-1 ring-amber-500/30' :
                labelTheme === 'modern-green' ? 'bg-emerald-950 text-white border-emerald-500' :
                'bg-white text-slate-900 border-amber-400'
              }`}>
                
                {/* Top Row: Brand & Price */}
                <div className="flex items-center justify-between border-b border-current/15 pb-1 mb-1">
                  <span className="text-[9px] font-black uppercase font-mono tracking-wider text-amber-600">
                    ★ {trademarkLogoText || 'MAYANY ENTERPRISE'} ★
                  </span>
                  <span className="text-[8px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-mono">
                    {retailPrice}
                  </span>
                </div>

                {/* Product Title Bilingual */}
                <div className="my-1">
                  <h4 className="text-xs font-black leading-tight">
                    {productNameKhmer.split('(')[0]}
                  </h4>
                  <p className="text-[9px] font-bold uppercase tracking-tight opacity-80 mt-0.5">
                    {productNameEnglish.split('(')[0]}
                  </p>
                  <p className="text-[8px] font-mono font-bold text-amber-600 mt-0.5">
                    {netWeight}
                  </p>
                </div>

                {/* Micro Ingredients List */}
                <div className="text-[7.5px] leading-tight opacity-90 my-1 bg-black/5 dark:bg-white/5 p-1 rounded">
                  <p className="font-bold">
                    <span className="underline">គ្រឿងផ្សំ (Ingredients):</span> {ingredientsList.slice(0, 110)}...
                  </p>
                  {allergenBox && (
                    <p className="text-[7px] text-red-600 dark:text-red-400 font-bold mt-0.5">
                      ⚠ {allergenBox}
                    </p>
                  )}
                </div>

                {/* Micro Certifications & Eco / Social Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1 text-[6.5px] py-0.5 border-t border-current/10 font-mono">
                  {selectedCertifications && selectedCertifications.length > 0 && (
                    <div className="flex flex-wrap items-center gap-0.5">
                      {selectedCertifications.slice(0, 4).map(certId => {
                        const cert = CAMBODIA_CERTIFICATION_STANDARDS.find(c => c.id === certId);
                        return cert ? (
                          <span key={certId} className="bg-slate-900 text-amber-300 dark:bg-amber-400/20 dark:text-amber-200 font-bold px-1 rounded flex items-center gap-0.5">
                            <span>{cert.icon}</span>
                            <span>{cert.badgeLabel}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                  {showRecycleBadge && (
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                      {RECYCLE_BADGE_OPTIONS.find(r => r.id === selectedRecycle)?.resinCode || '♷ 05 PP'} ♻️
                    </span>
                  )}
                </div>

                {showSocialSlogan && (customSloganText || selectedSlogan) && (
                  <div className="text-[6px] text-center font-bold px-1 py-0.2 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 truncate">
                    {customSloganText || '🚫 ចូលរួមទាំងអស់គ្នាដើម្បីជីវិត និងសហគមន៍គ្មានគ្រឿងញៀន!'}
                  </div>
                )}

                {/* Bottom Row: Barcode + QR + Producer */}
                <div className="pt-1 border-t border-current/15 flex items-center justify-between gap-1.5">
                  <div className="space-y-0.5 text-[7px] leading-tight">
                    <p className="font-bold truncate max-w-[140px]">{companyName.split('(')[0]}</p>
                    <p className="opacity-70 truncate max-w-[140px]">{companyAddress.split(',').slice(-2).join(',')}</p>
                    <p className="font-mono text-[6.5px]">
                      {mfdDate?.trim() ? <>MFD: {mfdDate} | </> : <>MFD: ........ | </>}
                      {expDate?.trim() ? (dateMarkingScheme === 'export_bbd' ? `BBD: ${bbdDate || expDate}` : dateMarkingScheme === 'export_eu_uk' ? `BBE: ${bbdDate || expDate}` : dateMarkingScheme === 'export_usa' ? `BEST BY: ${bbdDate || expDate}` : `EXP: ${expDate}`) : 'EXP: ........'}
                      {lotNumber?.trim() && <> | LOT: {lotNumber}</>}
                    </p>
                    <p className="font-mono text-[6.5px] text-emerald-600 font-bold">{countryOfOrigin}</p>
                  </div>

                  {/* Barcode / QR Minimal Stamp */}
                  <div className="flex items-center gap-1 shrink-0">
                    {qrDataUrl && (
                      <img 
                        src={qrDataUrl} 
                        alt="Trace QR" 
                        className="w-9 h-9 rounded bg-white p-0.5 border border-slate-300"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}
                    {barcodeBinary && formattedEan ? (
                      <div className="text-right">
                        <div className="flex justify-center h-4 items-end bg-white p-0.5 rounded border border-slate-300">
                          {barcodeBinary.split('').slice(0, 45).map((bit, bIdx) => (
                            <div key={bIdx} className={`w-[1px] h-full ${bit === '1' ? 'bg-black' : 'bg-transparent'}`} />
                          ))}
                        </div>
                        <span className="text-[6px] font-mono font-bold">{formattedEan.slice(0, 8)}...</span>
                      </div>
                    ) : null}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Screen Layout View */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 no-print">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Printer size={14} className="text-amber-600" />
            <span>
              {sheetMode === 'mini-qr-35x35' 
                ? 'ប្លង់សន្លឹក A4 សម្រាប់ព្រីន Mini QR Sticker (35 Stickers Grid - 5x7)' 
                : 'ប្លង់សន្លឹក A4 សម្រាប់រោងពុម្ព ឬម៉ាស៊ីនព្រីន (A4 Print Layout - 21 Labels Grid)'}
            </span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {sheetMode === 'mini-qr-35x35' ? '35mm × 35mm each (35-up)' : '60mm × 40mm each (21-up)'}
          </span>
        </div>

        {/* Scaled-down Sheet representation */}
        <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex justify-center overflow-x-auto">
          {sheetMode === 'mini-qr-35x35' ? (
            <div className="bg-white p-2 rounded shadow-md border border-slate-300 w-[320px] h-[450px] grid grid-cols-5 grid-rows-7 gap-1 text-[4px] select-none pointer-events-none">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="border border-amber-300 rounded p-1 flex flex-col justify-between items-center bg-amber-50/50 text-slate-900">
                  <div className="text-[4px] font-black text-amber-700 font-mono truncate w-full text-center">MAYANY</div>
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR" className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 bg-black/10 rounded" />
                  )}
                  <div className="text-[3.5px] font-mono font-bold text-slate-700 truncate w-full text-center">50g • {lotNumber.slice(-6)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-2 rounded shadow-md border border-slate-300 w-[300px] h-[420px] grid grid-cols-3 grid-rows-7 gap-1 text-[5px] select-none pointer-events-none">
              {Array.from({ length: 21 }).map((_, i) => (
                <div key={i} className="border border-slate-300 rounded p-1 flex flex-col justify-between overflow-hidden bg-amber-50/40">
                  <div>
                    <div className="flex justify-between font-mono font-bold text-amber-800">
                      <span className="truncate">{trademarkLogoText || 'MAYANY'}</span>
                      <span>50g</span>
                    </div>
                    <p className="font-bold truncate text-slate-900 leading-tight">{productNameKhmer.split('(')[0]}</p>
                  </div>
                  <div className="flex justify-between items-center text-[4px] font-mono text-slate-500 pt-0.5 border-t border-slate-200">
                    <span className="truncate">{netWeight}</span>
                    <span className="text-emerald-700 font-bold">KH-LOT</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tip for SME / Print Shop for 300 bags */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-950 dark:text-emerald-200 text-[11px] space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>ការគណនាបោះពុម្ពសម្រាប់កញ្ចប់គំរូ ៣០០ កញ្ចប់ (Techo Startup Center 300 Sample Bags):</span>
          </p>
          <p className="leading-relaxed">
            • <strong>ម្រេច (Pepper) 100 កញ្ចប់:</strong> ព្រីន Mini QR សន្លឹក A4 ចំនួន <strong>៣ សន្លឹក</strong> (បាន ១០៥ ស្ទីកឃ័រ)<br />
            • <strong>ម្ទេស (Chili) 100 កញ្ចប់:</strong> ព្រីន Mini QR សន្លឹក A4 ចំនួន <strong>៣ សន្លឹក</strong> (បាន ១០៥ ស្ទីកឃ័រ)<br />
            • <strong>ស្ករត្នោត (Palm Sugar) 100 កញ្ចប់:</strong> ព្រីន Mini QR សន្លឹក A4 ចំនួន <strong>៣ សន្លឹក</strong> (បាន ១០៥ ស្ទីកឃ័រ)<br />
            ➔ <strong>សរុបត្រឹមតែ ៩ សន្លឹក A4</strong> (ចំណាយថ្លៃក្រដាសស្ទីកឃ័រត្រឹមតែ <strong>~$3</strong> ប៉ុណ្ណោះ)!
          </p>
        </div>
      </div>

      {/* DEDICATED PRINTABLE A4 SHEET (ONLY VISIBLE DURING PRINT) */}
      <div id="printable-a4-sheet-canvas" className="hidden print:block w-full bg-white text-black p-0 m-0">
        {sheetMode === 'mini-qr-35x35' ? (
          <div className="w-[190mm] h-[277mm] mx-auto grid grid-cols-5 grid-rows-7 gap-[2mm] p-[2mm] box-border">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="border border-black rounded-[2mm] p-[1.5mm] flex flex-col justify-between items-center text-center bg-white">
                <div className="w-full flex items-center justify-between border-b border-black/30 pb-[0.5mm]">
                  <span className="text-[6pt] font-black uppercase font-mono">
                    ★ MAYANY ★
                  </span>
                  <span className="text-[5pt] font-bold border border-black px-[1mm] rounded">
                    {netWeight || '50g'}
                  </span>
                </div>

                <div className="my-[0.5mm]">
                  <p className="text-[6.5pt] font-black leading-tight text-black truncate max-w-[32mm]">
                    {productNameKhmer.split('(')[0]}
                  </p>
                  <p className="text-[5pt] font-bold text-gray-700 truncate max-w-[32mm]">
                    {productNameEnglish.split('(')[0]}
                  </p>
                </div>

                {qrDataUrl && (
                  <img src={qrDataUrl} alt="Trace QR" className="w-[18mm] h-[18mm] p-[0.5mm] border border-black/40 rounded" />
                )}

                <div className="w-full pt-[0.5mm] border-t border-black/30 flex items-center justify-between text-[5pt] font-mono text-black">
                  <span className="font-bold truncate max-w-[16mm]">LOT: {lotNumber.slice(-8)}</span>
                  <span className="font-bold">VERIFIED CS001</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-[190mm] h-[277mm] mx-auto grid grid-cols-3 grid-rows-7 gap-[2mm] p-[2mm] box-border">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="border border-black rounded-[2mm] p-[2mm] flex flex-col justify-between bg-white text-black">
                <div className="flex items-center justify-between border-b border-black/30 pb-[1mm]">
                  <span className="text-[7pt] font-black uppercase font-mono">
                    ★ {trademarkLogoText || 'MAYANY ENTERPRISE'} ★
                  </span>
                  <span className="text-[6pt] font-bold border border-black px-[1mm] rounded">
                    {netWeight || '50g'}
                  </span>
                </div>

                <div className="my-[1mm]">
                  <h4 className="text-[8pt] font-black leading-tight">
                    {productNameKhmer.split('(')[0]}
                  </h4>
                  <p className="text-[6pt] font-bold uppercase tracking-tight text-gray-700">
                    {productNameEnglish.split('(')[0]}
                  </p>
                </div>

                <div className="text-[5.5pt] leading-tight border border-black/20 p-[1mm] rounded my-[0.5mm]">
                  <p className="font-bold truncate">
                    <span className="underline">គ្រឿងផ្សំ:</span> {ingredientsList.slice(0, 90)}...
                  </p>
                  {allergenBox && (
                    <p className="text-[5pt] font-bold mt-[0.5mm]">
                      ⚠ {allergenBox.slice(0, 50)}
                    </p>
                  )}
                </div>

                <div className="pt-[1mm] border-t border-black/30 flex items-center justify-between gap-[1mm]">
                  <div className="space-y-[0.5mm] text-[5pt] leading-tight">
                    <p className="font-bold truncate max-w-[28mm]">{companyName.split('(')[0]}</p>
                    <p className="font-mono text-[4.5pt]">
                      LOT: {lotNumber} | {dateMarkingScheme === 'export_bbd' ? `BBD: ${bbdDate || expDate}` : dateMarkingScheme === 'export_eu_uk' ? `BBE: ${bbdDate || expDate}` : `EXP: ${expDate}`}
                    </p>
                    <p className="font-mono text-[4.5pt] font-bold text-gray-800">{countryOfOrigin}</p>
                  </div>

                  {qrDataUrl && (
                    <img src={qrDataUrl} alt="QR" className="w-[10mm] h-[10mm] border border-black/40 rounded p-[0.5mm]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
