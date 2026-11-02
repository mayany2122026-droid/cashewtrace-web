import React from 'react';
import { Sparkles, FlaskConical, Package, Check, Tag } from 'lucide-react';

export type KernelGrade = 'WW180' | 'WS' | 'LSP';
export type FlavorType = 'flour' | 'pepper-5' | 'pepper-3' | 'sugar' | 'chili';
export type PackagingFormat = 'pouch-50g' | 'jar-100g' | 'jar-150g' | 'jar-200g';

interface MayanyProductMatrixSelectorProps {
  selectedGrade: KernelGrade;
  onSelectGrade: (grade: KernelGrade) => void;
  selectedFlavor: FlavorType;
  onSelectFlavor: (flavor: FlavorType) => void;
  selectedPackaging: PackagingFormat;
  onSelectPackaging: (pkg: PackagingFormat) => void;
  onOpenFtcModal: () => void;
}

export const MayanyProductMatrixSelector: React.FC<MayanyProductMatrixSelectorProps> = ({
  selectedGrade,
  onSelectGrade,
  selectedFlavor,
  onSelectFlavor,
  selectedPackaging,
  onSelectPackaging,
  onOpenFtcModal
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-50/70 border border-amber-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3.5">
      {/* Top Banner with FTC CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shrink-0 shadow-xs">
            🥜
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 font-sans">
              <span>បញ្ជីផលិតផលទាំង ៤ ផ្លូវការ Mayany Enterprise</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-950 font-mono font-bold">4 Live Products</span>
            </h4>
            <p className="text-[11px] text-slate-600">
              ម្សៅស្វាយចន្ទី ១០០% • ម្រេចកំពត (5%/3%) • ស្រោបស្ករត្នោត • ស្រោបម្ទេស | ទម្ងន់ 50g, 100g, 150g, 200g
            </p>
          </div>
        </div>

        {/* FTC Defatting & Powder Button */}
        <button
          type="button"
          onClick={onOpenFtcModal}
          className="py-1.5 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
          title="បើកមើលកាលវិភាគផលិតកម្មម្សៅ & ពិសោធន៍អាហារូបត្ថម្ភនៅ FTC សប្តាហ៍ក្រោយ"
        >
          <FlaskConical size={14} className="text-amber-300" />
          <span>🔬 ពិសោធន៍ម្សៅ FTC Defatting</span>
        </button>
      </div>

      {/* 3-Row Matrix Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* ROW 1: KERNEL GRADES */}
        <div className="space-y-1.5 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
              <span>① ទំហំគ្រាប់ (Kernel Size)៖</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-700">
              {selectedGrade === 'WW180' ? 'គ្រាប់ពេញ Jumbo' : selectedGrade === 'WS' ? 'គ្រាប់ពុះជាពីរ' : 'កម្ទេច/បំណែកធំ'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => onSelectGrade('WW180')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedGrade === 'WW180'
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs ring-2 ring-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-mono">WW180</div>
              <div className="text-[9px] font-normal opacity-80">Jumbo Wholes</div>
            </button>
            <button
              type="button"
              onClick={() => onSelectGrade('WS')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedGrade === 'WS'
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs ring-2 ring-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-mono">WS</div>
              <div className="text-[9px] font-normal opacity-80">White Splits</div>
            </button>
            <button
              type="button"
              onClick={() => onSelectGrade('LSP')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedGrade === 'LSP'
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs ring-2 ring-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-mono">LSP</div>
              <div className="text-[9px] font-normal opacity-80">Large Pieces</div>
            </button>
          </div>
        </div>

        {/* ROW 2: 4 PRODUCTS / FLAVORS */}
        <div className="space-y-1.5 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
              <span>② ផលិតផលទាំង ៤ (Product Line)៖</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-800">
              {selectedFlavor === 'flour' ? '🌾 ម្សៅស្វាយចន្ទី' : selectedFlavor === 'pepper-5' ? 'ពេញនិយមបំផុត ★' : selectedFlavor === 'pepper-3' ? 'កុមារ/ហឹរស្រាល' : selectedFlavor === 'sugar' ? 'ស្រោបស្ករ' : 'ស្រោបម្ទេស'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {/* 1. Flour Product */}
            <button
              type="button"
              onClick={() => {
                onSelectFlavor('flour');
                if (selectedPackaging !== 'jar-200g' && selectedPackaging !== 'pouch-50g') {
                  onSelectPackaging('jar-200g');
                }
              }}
              className={`col-span-2 py-2 px-2.5 text-left rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedFlavor === 'flour'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs ring-2 ring-emerald-400'
                  : 'bg-emerald-50/70 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">🌾</span>
                  <span>១. ម្សៅគ្រាប់ស្វាយចន្ទី ១០០%</span>
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${selectedFlavor === 'flour' ? 'bg-emerald-950 text-emerald-200' : 'bg-emerald-200 text-emerald-900'}`}>
                  100% Pure Flour
                </span>
              </div>
              <div className="text-[9.5px] font-normal opacity-90 pl-5">100% Pure Cashew Kernel Flour (គ្មានស្ករ គ្មានអំបិល)</div>
            </button>

            {/* 2. Pepper 5% */}
            <button
              type="button"
              onClick={() => onSelectFlavor('pepper-5')}
              className={`py-1.5 px-2 text-left rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedFlavor === 'pepper-5'
                  ? 'bg-rose-800 text-white border-rose-900 shadow-2xs ring-2 ring-rose-400'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>២. ម្រេចកំពត 5%</span>
                <span className="text-[9px] bg-rose-950 px-1 py-0.2 rounded text-rose-200">អ្នកធំ</span>
              </div>
              <div className="text-[9px] font-normal opacity-80">GI YAS Pepper (Hot)</div>
            </button>

            {/* 3. Pepper 3% */}
            <button
              type="button"
              onClick={() => onSelectFlavor('pepper-3')}
              className={`py-1.5 px-2 text-left rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedFlavor === 'pepper-3'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-2xs ring-2 ring-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>ម្រេចកំពត 3%</span>
                <span className="text-[9px] bg-amber-800 px-1 py-0.2 rounded text-amber-100">កុមារ</span>
              </div>
              <div className="text-[9px] font-normal opacity-80">Mild Pepper (Kids)</div>
            </button>

            {/* 4. Sugar */}
            <button
              type="button"
              onClick={() => onSelectFlavor('sugar')}
              className={`py-1.5 px-2 text-left rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedFlavor === 'sugar'
                  ? 'bg-amber-800 text-white border-amber-900 shadow-2xs ring-2 ring-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>៣. ស្រោបស្ករត្នោត</div>
              <div className="text-[9px] font-normal opacity-80">Palm Sugar Coated</div>
            </button>

            {/* 5. Chili */}
            <button
              type="button"
              onClick={() => onSelectFlavor('chili')}
              className={`py-1.5 px-2 text-left rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedFlavor === 'chili'
                  ? 'bg-red-700 text-white border-red-800 shadow-2xs ring-2 ring-red-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>៤. ស្រោបម្ទេស & ខ្ទឹម</div>
              <div className="text-[9px] font-normal opacity-80">Chili & Garlic Coated</div>
            </button>
          </div>
        </div>

        {/* ROW 3: PACKAGING FORMATS */}
        <div className="space-y-1.5 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
              <span>③ ការវេចខ្ចប់ (Packaging)៖</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-indigo-700">
              {selectedPackaging === 'pouch-50g' ? 'កញ្ចប់ ៥០g' : selectedPackaging === 'jar-100g' ? 'ក្រឡ ១០០g' : selectedPackaging === 'jar-150g' ? 'ក្រឡ ១៥០g' : 'ក្រឡ ២០០g'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onSelectPackaging('pouch-50g')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedPackaging === 'pouch-50g'
                  ? 'bg-slate-950 text-amber-300 border-slate-900 shadow-2xs ring-2 ring-amber-400'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>50g Pouch</div>
              <div className="text-[9px] font-normal opacity-80">ថង់ 8cm Zipper</div>
            </button>
            <button
              type="button"
              onClick={() => onSelectPackaging('jar-100g')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedPackaging === 'jar-100g'
                  ? 'bg-slate-950 text-amber-300 border-slate-900 shadow-2xs ring-2 ring-amber-400'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>100g Jar</div>
              <div className="text-[9px] font-normal opacity-80">ក្រឡតូច 100g</div>
            </button>
            <button
              type="button"
              onClick={() => onSelectPackaging('jar-150g')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedPackaging === 'jar-150g'
                  ? 'bg-slate-950 text-amber-300 border-slate-900 shadow-2xs ring-2 ring-amber-400'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>150g Jar</div>
              <div className="text-[9px] font-normal opacity-80">ក្រឡមធ្យម 150g</div>
            </button>
            <button
              type="button"
              onClick={() => onSelectPackaging('jar-200g')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-black transition cursor-pointer border ${
                selectedPackaging === 'jar-200g'
                  ? 'bg-emerald-900 text-amber-300 border-emerald-950 shadow-2xs ring-2 ring-emerald-400'
                  : 'bg-emerald-50/60 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <div>200g Flour Jar</div>
              <div className="text-[9px] font-normal opacity-80">ក្រឡម្សៅ 200g</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
