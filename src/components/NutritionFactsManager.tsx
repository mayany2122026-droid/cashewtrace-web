import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Sparkles, RefreshCw, FlaskConical, Sliders, 
  Info, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, 
  Percent, Calculator, FileCheck
} from 'lucide-react';
import { NutritionFacts } from '../types';
import { 
  calculateNutritionFromRecipe, 
  parseIngredientsAndRatios, 
  FOOD_NUTRITION_DATABASE 
} from '../lib/nutritionCalculator';

export interface NutritionFactsManagerProps {
  ingredientsText: string;
  nutrition: NutritionFacts;
  onChange: (nutrition: NutritionFacts) => void;
  presetNutrition?: NutritionFacts;
  mode?: 'general_calc' | 'lab_tested';
  onModeChange?: (mode: 'general_calc' | 'lab_tested') => void;
  isCompact?: boolean;
}

export const NutritionFactsManager: React.FC<NutritionFactsManagerProps> = ({
  ingredientsText,
  nutrition,
  onChange,
  presetNutrition,
  mode: controlledMode,
  onModeChange,
  isCompact = false
}) => {
  const [internalMode, setInternalMode] = useState<'general_calc' | 'lab_tested'>(controlledMode || 'general_calc');
  const activeMode = controlledMode || internalMode;

  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [customRatios, setCustomRatios] = useState<{ [id: string]: number }>({});
  const [lastIngredientsHash, setLastIngredientsHash] = useState<string>('');

  // Calculate live nutrition based on recipe text
  const calculationResult = useMemo(() => {
    return calculateNutritionFromRecipe(ingredientsText, Object.keys(customRatios).length > 0 ? customRatios : undefined);
  }, [ingredientsText, customRatios]);

  // When ingredients change significantly and we are in auto mode, update nutrition
  useEffect(() => {
    if (activeMode === 'general_calc') {
      const currentHash = ingredientsText.trim();
      if (currentHash !== lastIngredientsHash && currentHash.length > 0) {
        setLastIngredientsHash(currentHash);
        onChange(calculationResult.nutrition);
      }
    }
  }, [ingredientsText, activeMode, calculationResult.nutrition, lastIngredientsHash, onChange]);

  const handleSetMode = (newMode: 'general_calc' | 'lab_tested') => {
    setInternalMode(newMode);
    if (onModeChange) onModeChange(newMode);

    if (newMode === 'general_calc') {
      onChange(calculationResult.nutrition);
    }
  };

  const handleRecalculate = () => {
    setCustomRatios({});
    const fresh = calculateNutritionFromRecipe(ingredientsText);
    onChange(fresh.nutrition);
  };

  const handleRatioSliderChange = (id: string, value: number) => {
    const updated = { ...customRatios, [id]: value };
    setCustomRatios(updated);
    const fresh = calculateNutritionFromRecipe(ingredientsText, updated);
    onChange(fresh.nutrition);
  };

  const handleFieldChange = (field: keyof NutritionFacts, val: string) => {
    // If user manually modifies a field, automatically switch to lab_tested mode
    if (activeMode === 'general_calc') {
      handleSetMode('lab_tested');
    }
    const updated = { ...nutrition, [field]: val };
    // If energyKcal changes, calculate kJ automatically if appropriate
    if (field === 'energyKcal') {
      const kcalNum = parseFloat(val);
      if (!isNaN(kcalNum)) {
        updated.energyKj = String(Math.round(kcalNum * 4.184));
      }
    }
    // If sodium changes, calculate approximate salt
    if (field === 'sodium') {
      const sodNum = parseFloat(val);
      if (!isNaN(sodNum)) {
        updated.salt = (sodNum * 2.5 / 1000).toFixed(2);
      }
    }
    onChange(updated);
  };

  const handleResetToPreset = () => {
    if (presetNutrition) {
      onChange(presetNutrition);
    } else {
      handleRecalculate();
    }
  };

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-xs space-y-4 transition-all ${
      activeMode === 'general_calc' ? 'border-amber-400/90' : 'border-emerald-600/90'
    } ${isCompact ? 'p-3 sm:p-4' : 'p-4 sm:p-6'}`}>
      {/* Header & Mode Switcher */}
      <div className="space-y-3 border-b border-slate-200 pb-3.5">
        {/* Top: Spread title, badge, and descriptive guideline across full width */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs ${
                activeMode === 'general_calc' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeMode === 'general_calc' ? <Calculator size={15} /> : <FlaskConical size={15} />}
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 font-sans flex flex-wrap items-center gap-2">
                <span>តារាងព័ត៌មានអាហារូបត្ថម្ភ (Nutrition Facts per 100g)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  CS 001:2000
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            {activeMode === 'general_calc'
              ? '💡 ណែនាំ៖ គណនាស្វ័យប្រវត្តិតាមសមាមាត្រគ្រឿងផ្សំ (ស្វាយចន្ទី, ម្រេចកំពត, ស្ករ, អំបិល) តាមស្តង់ដារ Codex / ASEAN'
              : '🧪 ទិន្នន័យមន្ទីរពិសោធន៍ជាក់ស្តែង៖ បញ្ចូលលេខលទ្ធផលធ្វើតេស្តផ្ទាល់ពី CamControl / MISTI / Eurofins'}
          </p>
        </div>

        {/* Bottom: Dual Mode Switch Pills sitting side-by-side underneath */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 text-xs font-sans">
          <button
            type="button"
            onClick={() => handleSetMode('general_calc')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'general_calc'
                ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
            title="គណនាស្វ័យប្រវត្តិតាមរូបមន្តគ្រឿងផ្សំទូទៅ"
          >
            <Sparkles size={13} className={activeMode === 'general_calc' ? 'text-slate-950' : 'text-amber-600'} />
            <span>ស្តង់ដារទូទៅ (Auto-Calc)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetMode('lab_tested')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'lab_tested'
                ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
            title="បញ្ចូលលទ្ធផលតេស្តពីមន្ទីរពិសោធន៍ផ្ទាល់"
          >
            <FlaskConical size={13} className={activeMode === 'lab_tested' ? 'text-white' : 'text-emerald-600'} />
            <span>តេស្តមន្ទីរពិសោធន៍ (Lab Tested)</span>
          </button>
        </div>
      </div>

      {/* Auto-Calculation Recipe Breakdown View */}
      {activeMode === 'general_calc' && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3 sm:p-3.5 space-y-2.5 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
              <Percent size={14} className="text-amber-700" />
              <span>គ្រឿងផ្សំ និងសមាមាត្រគណនាក្នុងរូបមន្ត (Formula Breakdown):</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
              >
                <Sliders size={11} />
                <span>{showBreakdown ? 'លាក់សមាមាត្រ' : 'កែតម្រូវភាគរយ %'}</span>
                {showBreakdown ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
              <button
                type="button"
                onClick={handleRecalculate}
                className="text-[10px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition"
                title="គណនាឡើងវិញពីអត្ថបទគ្រឿងផ្សំ"
              >
                <RefreshCw size={10} />
                <span>គណនាឡើងវិញ</span>
              </button>
            </div>
          </div>

          {/* Ingredient Chips Breakdown */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            {calculationResult.breakdown.map((item) => (
              <div 
                key={item.id}
                className="bg-white px-2.5 py-1.5 rounded-lg border border-amber-200 shadow-2xs flex items-center gap-2 font-mono text-slate-800"
              >
                <span className="font-sans font-bold text-amber-950">{item.nameKh.split('(')[0].trim()}:</span>
                <span className="font-black text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">{item.percentage}%</span>
                <span className="text-[10px] text-slate-500 font-sans">({item.contributionKcal} kcal)</span>
              </div>
            ))}
          </div>

          {/* Sliders Drawer for fine-tuning % */}
          {showBreakdown && (
            <div className="pt-2 border-t border-amber-200/80 space-y-2.5">
              <p className="text-[10px] text-amber-900">
                អូសរបារដើម្បីកែប្រែភាគរយជាក់ស្តែងនៃគ្រឿងផ្សំនីមួយៗ ប្រព័ន្ធនឹងគណនាតម្លៃអាហារូបត្ថម្ភថ្មីភ្លាមៗ៖
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {calculationResult.breakdown.map((item) => (
                  <div key={item.id} className="bg-white p-2 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="font-bold text-slate-800">{item.nameKh.split('(')[0]}</span>
                      <span className="font-mono font-black text-amber-800">{item.percentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={item.percentage}
                      onChange={(e) => handleRatioSliderChange(item.id, parseFloat(e.target.value))}
                      className="w-full accent-amber-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lab-Tested Notice Banner */}
      {activeMode === 'lab_tested' && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3.5 space-y-2.5 text-emerald-950 font-sans shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <FileCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black">កំពុងប្រើប្រាស់របៀប «ទិន្នន័យតេស្តមន្ទីរពិសោធន៍ផ្ទាល់»</span>
                  <span className="text-[9.5px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.2 rounded-full">
                    COA / Lab Test Active
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                  លោកអ្នកអាចកែប្រែ ឬបញ្ចូលលេខតាមវិញ្ញាបនបត្រវិភាគ (COA / Test Report) ពី CamControl, MISTI ឬ Eurofins ដោយសេរី។ លេខទាំងនេះនឹងឆ្លុះបញ្ចាំងលើស្លាកវេចខ្ចប់ និងវិញ្ញាបនបត្រឌីជីថលភ្លាមៗ។
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetToPreset}
              className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shrink-0 cursor-pointer transition"
            >
              កំណត់ស្តង់ដារឡើងវិញ
            </button>
          </div>

          {/* Quick Lab Test Result Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-emerald-200/80">
            <span className="text-[10px] font-bold text-emerald-900">គំរូលទ្ធផលតេស្តមន្ទីរពិសោធន៍៖</span>
            <button
              type="button"
              onClick={() => {
                onChange({
                  energyKcal: '596',
                  energyKj: '2494',
                  totalFat: '46.2',
                  saturatedFat: '9.1',
                  transFat: '0.0',
                  cholesterol: '0',
                  sodium: '16',
                  totalCarb: '25.8',
                  dietaryFiber: '4.1',
                  totalSugars: '5.2',
                  addedSugars: '0.0',
                  protein: '21.0',
                  salt: '0.04'
                });
              }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 transition cursor-pointer"
            >
              🌾 តេស្តម្សៅស្វាយចន្ទី (Cashew Flour Lab COA)
            </button>
            <button
              type="button"
              onClick={() => {
                onChange({
                  energyKcal: '582',
                  energyKj: '2435',
                  totalFat: '43.8',
                  saturatedFat: '7.8',
                  transFat: '0.0',
                  cholesterol: '0',
                  sodium: '14',
                  totalCarb: '30.1',
                  dietaryFiber: '3.3',
                  totalSugars: '5.9',
                  addedSugars: '0.0',
                  protein: '18.2',
                  salt: '0.03'
                });
              }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 transition cursor-pointer"
            >
              🥜 តេស្តគ្រាប់ស្វាយចន្ទីធម្មជាតិ (Cashew Kernel Lab COA)
            </button>
          </div>
        </div>
      )}

      {/* Nutrition Facts Input / Display Grid (per 100g) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-sans">
        {/* Energy kcal */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-600 uppercase">ថាមពល (Energy kcal)</label>
            <span className="text-[9px] font-mono text-slate-400">kcal</span>
          </div>
          <input
            type="text"
            value={nutrition.energyKcal}
            onChange={(e) => handleFieldChange('energyKcal', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Energy kJ */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-600 uppercase">ថាមពល (Energy kJ)</label>
            <span className="text-[9px] font-mono text-slate-400">kJ</span>
          </div>
          <input
            type="text"
            value={nutrition.energyKj}
            onChange={(e) => handleFieldChange('energyKj', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Total Fat */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-600 uppercase">ខ្លាញ់សរុប (Total Fat)</label>
            <span className="text-[9px] font-mono text-slate-400">g</span>
          </div>
          <input
            type="text"
            value={nutrition.totalFat}
            onChange={(e) => handleFieldChange('totalFat', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Saturated Fat */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-600 uppercase">ខ្លាញ់ឆ្អែត (Saturates)</label>
            <span className="text-[9px] font-mono text-slate-400">g</span>
          </div>
          <input
            type="text"
            value={nutrition.saturatedFat}
            onChange={(e) => handleFieldChange('saturatedFat', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Total Carbohydrate */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-600 uppercase">កាបូអ៊ីដ្រាត (Carbs)</label>
            <span className="text-[9px] font-mono text-slate-400">g</span>
          </div>
          <input
            type="text"
            value={nutrition.totalCarb}
            onChange={(e) => handleFieldChange('totalCarb', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Total Sugars */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-600 uppercase">ជាតិស្ករ (Sugars)</label>
            <span className="text-[9px] font-mono text-slate-400">g</span>
          </div>
          <input
            type="text"
            value={nutrition.totalSugars}
            onChange={(e) => handleFieldChange('totalSugars', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Protein */}
        <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-black text-emerald-900 uppercase">ប្រូតេអ៊ីន (Protein)</label>
            <span className="text-[9px] font-mono text-emerald-700 font-bold">g</span>
          </div>
          <input
            type="text"
            value={nutrition.protein}
            onChange={(e) => handleFieldChange('protein', e.target.value)}
            className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1 text-xs font-mono font-black text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Salt */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-bold text-slate-600 uppercase">អំបិល (Salt)</label>
            <span className="text-[9px] font-mono text-slate-400">g</span>
          </div>
          <input
            type="text"
            value={nutrition.salt}
            onChange={(e) => handleFieldChange('salt', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Secondary Nutrients (Sodium, Dietary Fiber) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] font-mono text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-sans font-bold text-slate-700">សូដ្យូម (Sodium):</span>
          <input
            type="text"
            value={nutrition.sodium}
            onChange={(e) => handleFieldChange('sodium', e.target.value)}
            className="w-16 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[11px] font-mono text-slate-900 text-right"
          />
          <span>mg</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-sans font-bold text-slate-700">ជាតិសរសៃ (Fibre):</span>
          <input
            type="text"
            value={nutrition.dietaryFiber}
            onChange={(e) => handleFieldChange('dietaryFiber', e.target.value)}
            className="w-16 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[11px] font-mono text-slate-900 text-right"
          />
          <span>g</span>
        </div>

        <div className="text-[10px] text-slate-400 font-sans ml-auto">
          {activeMode === 'general_calc' ? '✓ Auto-calculated per 100g' : '✓ Custom COA values per 100g'}
        </div>
      </div>
    </div>
  );
};
