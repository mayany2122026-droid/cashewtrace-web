import React, { useState } from 'react';
import { 
  FlaskConical, Sparkles, Printer, Copy, Check, Scale, ArrowRight, 
  TrendingUp, TrendingDown, ShieldCheck, AlertCircle, FileText, Download,
  CheckCircle2, Layers, Award, Factory, Info, X
} from 'lucide-react';

interface FtcDefattingLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
}

export const FtcDefattingLabModal: React.FC<FtcDefattingLabModalProps> = ({
  isOpen,
  onClose,
  companyName = 'សហគ្រាស ម៉ាយ៉ានី (Mayany Enterprise)'
}) => {
  if (!isOpen) return null;

  // Batch input for FTC testing & production calculator
  const [rawBatchKg, setRawBatchKg] = useState<number>(100);
  const [selectedKernelGrade, setSelectedKernelGrade] = useState<'WW180' | 'WS' | 'LSP'>('WS');
  const [copiedProtocol, setCopiedProtocol] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'nutrition-compare' | 'lab-protocol' | 'production-calc'>('nutrition-compare');

  // Defatting calculations based on standard hydraulic/screw cold-press efficiency (approx 70% oil recovery from 46.5% initial fat)
  const estimatedPowderKg = Number((rawBatchKg * 0.58).toFixed(1)); // 58% high-protein meal
  const estimatedOilLiters = Number((rawBatchKg * 0.40).toFixed(1));  // 40% virgin cashew oil
  const processLossKg = Number((rawBatchKg * 0.02).toFixed(1));      // 2% handling loss

  const handleCopyProtocol = () => {
    const protocolText = `📋 កិច្ចសន្យា & ពិធីការពិសោធន៍អាហារូបត្ថម្ភគ្រាប់ស្វាយចន្ទីមុន & ក្រោយចម្រាញ់ខ្លាញ់ (FTC Testing Protocol)
----------------------------------------------------------------------
សហគ្រាសស្នើសុំ (SME Enterprise)៖ ${companyName}
មន្ទីរពិសោធន៍ & រោងចក្រសាកល្បង៖ មជ្ឈមណ្ឌលបច្ចេកវិទ្យាម្ហូបអាហារ (Food Technology Center - FTC)
កាលបរិច្ឆេទគ្រោងផលិតកម្មធំ៖ សប្តាហ៍ក្រោយ (Next Week Large-Scale Production)

[វត្ថុធាតុដើម និងចំណាត់ថ្នាក់គ្រាប់ (Raw Material Grading)]:
• កម្រិតគ្រាប់ (Grade)៖ ${selectedKernelGrade} (${selectedKernelGrade === 'WW180' ? 'White Wholes 180 - គ្រាប់ធំពេញ' : selectedKernelGrade === 'WS' ? 'White Splits - គ្រាប់ពុះជាពីរ' : 'Large Small Pieces - គ្រាប់បែកធំ/កម្ទេច'})
• ទម្ងន់បាច់ពិសោធន៍៖ ${rawBatchKg} kg

[ដំណើរការបច្ចេកវិទ្យា (Processing Protocol)]:
1. សម្អាត និងកម្ដៅកម្រិតស្រាល (Conditioning 45-50°C - រក្សាគុណភាពប្រូតេអ៊ីន)
2. ចម្រាញ់ខ្លាញ់ដោយម៉ាស៊ីនសង្កត់ត្រជាក់ (Mechanical Cold-Press Defatting)
   => ទទួលបានប្រេងស្វាយចន្ទីព្រហ្មចារី (Virgin Cold-Pressed Cashew Oil)
3. កិនម៉ត់កាកចន្ទីចម្រាញ់រួច (Grinding & Micronization of Defatted Press-Cake)
   => ទទួលបានម្សៅស្វាយចន្ទីប្រូតេអ៊ីនខ្ពស់ (High-Protein Defatted Cashew Powder)
4. រែងកម្រិតល្អិត 60-80 Mesh និងច្រកកញ្ចប់បូមខ្យល់អសកម្ម Nitrogen Flush

[ប៉ារ៉ាម៉ែត្រវិភាគអាហារូបត្ថម្ភប្រៀបធៀប (Comparative Nutrition Lab Testing - AOAC Standards)]:
1. សំណើម (Moisture Content) - AOAC 925.40
2. ជាតិខ្លាញ់សរុប (Total Crude Fat) - AOAC 920.39 (Soxhlet / Acid Hydrolysis)
3. ប្រូតេអ៊ីនឆៅ (Crude Protein) - AOAC 992.15 / Kjeldahl (Factor 6.25 ឬ 5.46)
4. ផេះសរុប (Total Ash / Minerals) - AOAC 923.03
5. កាបូអ៊ីដ្រាតសរុប (Total Carbohydrates by Difference)
6. កាឡូរីសរុប (Energy Value kcal/100g)
7. កម្រិតរលួយខូចប្រេង (Peroxide Value & Free Fatty Acid FFA for Rancidity Shelf-life)

[ទិន្នផលប៉ាន់ស្មានពី ${rawBatchKg} kg គ្រាប់ ${selectedKernelGrade}]:
• ម្សៅស្វាយចន្ទីចម្រាញ់ខ្លាញ់ (Defatted Powder)៖ ~${estimatedPowderKg} kg
• ប្រេងស្វាយចន្ទីសុទ្ធ (Virgin Cashew Oil)៖ ~${estimatedOilLiters} L
• ការបាត់បង់ក្នុងចង្វាក់ផលិតកម្ម៖ ~${processLossKg} kg`;

    navigator.clipboard.writeText(protocolText).then(() => {
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 3000);
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
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-2xl shadow-xs">
              🔬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-sans">
                  មជ្ឈមណ្ឌល FTC ៖ ផលិតកម្មម្សៅ & ពិសោធន៍អាហារូបត្ថម្ភមុន/ក្រោយចម្រាញ់ខ្លាញ់
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-300">
                  FTC Facility Pilot
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                គម្រោងកិនម្សៅចន្ទីទ្រង់ទ្រាយធំសប្តាហ៍ក្រោយនៅ FTC (Defatting → Grinding → Comparative Nutrition Lab Testing)
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('nutrition-compare')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'nutrition-compare'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scale size={14} />
            <span>ប្រៀបធៀបអាហារូបត្ថម្ភ (Before vs After Defatting)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('production-calc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'production-calc'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Factory size={14} />
            <span>គណនាទិន្នផលបាច់ផលិតកម្ម FTC (Batch Yield)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lab-protocol')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'lab-protocol'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText size={14} />
            <span>ពិធីការមន្ទីរពិសោធន៍ FTC (Lab Protocol)</span>
          </button>
        </div>

        {/* TAB 1: COMPARATIVE NUTRITION FACTS TABLE */}
        {activeTab === 'nutrition-compare' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-indigo-50 p-4 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>ការផ្លាស់ប្តូរអាហារូបត្ថម្ភសំខាន់ៗពេលចម្រាញ់ខ្លាញ់រួច (Defatting Transformation):</span>
                </span>
                <p className="text-xs text-slate-600">
                  ការចម្រាញ់ខ្លាញ់ដោយម៉ាស៊ីនសង្កត់ត្រជាក់ជួយកាត់បន្ថយជាតិខ្លាញ់ <strong>-71%</strong> និងបង្កើនកម្រិតប្រូតេអ៊ីនរុក្ខជាតិឡើងដល់ <strong>34.8g (+91%)</strong> ព្រមទាំងជួយឱ្យម្សៅរក្សាទុកបានយូរមិនឡើងធុំប្រេង!
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs">
                  ✓ ប្រូតេអ៊ីនឡើងខ្ពស់
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-900 border border-blue-300 font-bold text-xs">
                  ✓ ខ្លាញ់ទាប ធន់ខ្យល់
                </span>
              </div>
            </div>

            {/* Side by Side Comparison Grid */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">សមាសធាតុអាហារូបត្ថម្ភ (ក្នុង 100g)</th>
                    <th className="p-3 bg-amber-50/70 text-amber-950 border-x border-amber-200">
                      🥜 គ្រាប់ចន្ទីមុនចម្រាញ់ (Before Defatting)
                      <span className="block text-[10px] font-normal text-amber-800">គ្រាប់ពេញលេញ (Full Fat Kernel)</span>
                    </th>
                    <th className="p-3 bg-indigo-50/70 text-indigo-950">
                      🌾 ម្សៅចន្ទីក្រោយចម្រាញ់ (After Defatting)
                      <span className="block text-[10px] font-normal text-indigo-800">ម្សៅប្រូតេអ៊ីន FTC (Defatted Powder)</span>
                    </th>
                    <th className="p-3 text-slate-800 text-right">បំរែបំរួល (Change / Advantage)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {/* Total Fat */}
                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold font-sans text-slate-900 flex items-center gap-1.5">
                      <TrendingDown size={14} className="text-rose-600" />
                      <span>ជាតិខ្លាញ់សរុប (Total Fat)</span>
                    </td>
                    <td className="p-3 font-bold text-amber-950 bg-amber-50/30 border-x border-amber-100">
                      46.5 g
                    </td>
                    <td className="p-3 font-black text-indigo-900 bg-indigo-50/30">
                      13.5 g
                    </td>
                    <td className="p-3 text-right font-bold text-rose-600 font-sans">
                      -71.0% (ខ្លាញ់ទាប មិនងាយធុំប្រេង)
                    </td>
                  </tr>

                  {/* Saturated Fat */}
                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-sans text-slate-700 pl-6">
                      - ខ្លាញ់ឆ្អែត (Saturated Fat)
                    </td>
                    <td className="p-3 text-amber-900 bg-amber-50/30 border-x border-amber-100">
                      9.2 g
                    </td>
                    <td className="p-3 text-indigo-900 bg-indigo-50/30">
                      2.8 g
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-600 font-sans">
                      -69.6% (ល្អចំពោះសរសៃឈាមបេះដូង)
                    </td>
                  </tr>

                  {/* Crude Protein */}
                  <tr className="hover:bg-slate-50/80 transition bg-emerald-50/30">
                    <td className="p-3 font-black font-sans text-slate-900 flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-emerald-600" />
                      <span>ប្រូតេអ៊ីនរុក្ខជាតិ (Crude Protein)</span>
                    </td>
                    <td className="p-3 font-bold text-amber-950 bg-amber-50/30 border-x border-amber-100">
                      18.2 g
                    </td>
                    <td className="p-3 font-black text-emerald-800 bg-emerald-100/40 text-sm">
                      34.8 g ★
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700 font-sans">
                      +91.2% (ស័ក្តិសមធ្វើម្សៅជំនួយសុខភាព)
                    </td>
                  </tr>

                  {/* Calories / Energy */}
                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold font-sans text-slate-900">
                      ថាមពលសរុប (Calories / Energy)
                    </td>
                    <td className="p-3 text-amber-900 bg-amber-50/30 border-x border-amber-100">
                      553 kcal (2,314 kJ)
                    </td>
                    <td className="p-3 text-indigo-900 bg-indigo-50/30">
                      405 kcal (1,695 kJ)
                    </td>
                    <td className="p-3 text-right font-bold text-blue-600 font-sans">
                      -26.8% (សមរម្យសម្រាប់របបអាហារ Keto)
                    </td>
                  </tr>

                  {/* Dietary Fiber */}
                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-sans text-slate-700">
                      កាកសរសៃអាហារ (Dietary Fiber)
                    </td>
                    <td className="p-3 text-amber-900 bg-amber-50/30 border-x border-amber-100">
                      3.3 g
                    </td>
                    <td className="p-3 font-bold text-indigo-900 bg-indigo-50/30">
                      6.8 g
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-600 font-sans">
                      +106% (ជំនួយដល់ការរំលាយអាហារ)
                    </td>
                  </tr>

                  {/* Total Carbohydrates */}
                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-sans text-slate-700">
                      កាបូអ៊ីដ្រាតសរុប (Total Carbohydrate)
                    </td>
                    <td className="p-3 text-amber-900 bg-amber-50/30 border-x border-amber-100">
                      30.2 g
                    </td>
                    <td className="p-3 text-indigo-900 bg-indigo-50/30">
                      41.5 g
                    </td>
                    <td className="p-3 text-right text-slate-600 font-sans">
                      ម្សៅកាបូអ៊ីដ្រាតធម្មជាតិ
                    </td>
                  </tr>

                  {/* Minerals: Iron, Zinc, Magnesium */}
                  <tr className="hover:bg-slate-50/80 transition bg-slate-50">
                    <td className="p-3 font-sans text-slate-900 font-bold">
                      សារធាតុរ៉ែ (Mg / Zn / Fe)
                    </td>
                    <td className="p-3 text-[11px] text-amber-900 bg-amber-50/30 border-x border-amber-100">
                      Mg: 292mg | Fe: 6.7mg
                    </td>
                    <td className="p-3 text-[11px] font-bold text-indigo-900 bg-indigo-50/30">
                      Mg: 580mg | Fe: 12.8mg
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-700 font-sans">
                      កំហាប់រ៉ែធម្មជាតិកើនឡើងទ្វេដង
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Info size={16} className="shrink-0 text-amber-700" />
              <span>
                <strong>ចំណាំបច្ចេកទេស៖</strong> ម្សៅស្វាយចន្ទីចម្រាញ់ខ្លាញ់រួច (Defatted Powder) មានអត្ថប្រយោជន៍ខ្ពស់បំផុតក្នុងការធ្វើជានំប៉័ង (Gluten-Free Bakery), ភេសជ្ជៈប្រូតេអ៊ីន (Smoothie/Protein Shake), និងគ្រឿងផ្សំម្ហូបអាហារ ដោយសារតែជាតិខ្លាញ់ទាបជួយកាត់បន្ថយអុកស៊ីតកម្ម (Lipid Oxidation) និងធ្វើឱ្យផលិតផលរក្សាទុកបានរហូតដល់ ១៨ ទៅ ២៤ ខែ!
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTION BATCH YIELD CALCULATOR */}
        {activeTab === 'production-calc' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                ⚙️ ប៉ាន់ប្រមាណទិន្នផលផលិតកម្មចម្រាញ់ និងកិនម្សៅនៅ FTC (Batch Simulator):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ជ្រើសរើសប្រភេទគ្រាប់ចន្ទី (Kernel Size / Grade):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedKernelGrade('WW180')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedKernelGrade === 'WW180'
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      <div>WW180</div>
                      <div className="text-[10px] font-normal">គ្រាប់ពេញ Jumbo</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedKernelGrade('WS')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedKernelGrade === 'WS'
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      <div>WS</div>
                      <div className="text-[10px] font-normal">គ្រាប់ពុះជាពីរ</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedKernelGrade('LSP')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedKernelGrade === 'LSP'
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      <div>LSP</div>
                      <div className="text-[10px] font-normal">កម្ទេច/បំណែកធំ</div>
                    </button>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    💡 សម្រាប់ផលិតកម្មម្សៅ ការប្រើប្រាស់ <strong>WS (Splits)</strong> ឬ <strong>LSP (Pieces)</strong> ផ្តល់ប្រសិទ្ធភាពសេដ្ឋកិច្ច និងថ្លៃដើមទាបបំផុត!
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    បរិមាណគ្រាប់បញ្ចូលផលិតកម្ម (Batch Input Weight):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="5000"
                      step="10"
                      value={rawBatchKg}
                      onChange={(e) => setRawBatchKg(Math.max(1, Number(e.target.value)))}
                      className="flex-1 px-3 py-2 text-sm font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-hidden"
                    />
                    <span className="font-bold text-slate-700 text-sm">គីឡូក្រាម (kg)</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[50, 100, 200, 500].map((kg) => (
                      <button
                        key={kg}
                        type="button"
                        onClick={() => setRawBatchKg(kg)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                      >
                        {kg} kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Output cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Defatted Powder */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/70 border border-indigo-200 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-indigo-900 uppercase block font-sans">
                  🌾 ម្សៅចន្ទីប្រូតេអ៊ីនខ្ពស់ (Defatted Powder)
                </span>
                <div className="text-2xl font-black text-indigo-950 font-mono">
                  ~{estimatedPowderKg} kg
                </div>
                <div className="text-[11px] text-indigo-800/90 leading-tight">
                  ស្មើនឹង <strong>{Math.round(estimatedPowderKg * 1000 / 50)}</strong> កញ្ចប់ (៥០g) ឬ <strong>{Math.round(estimatedPowderKg * 1000 / 150)}</strong> ក្រឡ (១៥០g)
                </div>
              </div>

              {/* Virgin Cashew Oil */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-amber-900 uppercase block font-sans">
                  🫒 ប្រេងស្វាយចន្ទីសុទ្ធ (Virgin Cashew Oil)
                </span>
                <div className="text-2xl font-black text-amber-950 font-mono">
                  ~{estimatedOilLiters} L
                </div>
                <div className="text-[11px] text-amber-800/90 leading-tight">
                  ប្រេងគុណភាពខ្ពស់ អាចច្រកដបលក់ក្នុងតម្លៃខ្ពស់សម្រាប់ចម្អិនម្ហូប ឬគ្រឿងសម្អាង
                </div>
              </div>

              {/* Handling / Moisture loss */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase block font-sans">
                  ⚖️ ការបាត់បង់សំណើម/ដំណើរការ
                </span>
                <div className="text-2xl font-black text-slate-800 font-mono">
                  ~{processLossKg} kg
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  អត្រាបាត់បង់ស្តង់ដារត្រឹមតែ ~២% ក្នុងអំឡុងពេលសង្កត់ និងរែងម្សៅ
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FTC LAB TESTING PROTOCOL */}
        {activeTab === 'lab-protocol' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <FileText size={16} />
                  <span>ពិធីការពិសោធន៍មន្ទីរពិសោធន៍ FTC (Laboratory Request Dossier)</span>
                </div>
                <span className="text-[10px] text-slate-400">AOAC & ISO Methods</span>
              </div>

              <div className="space-y-1 text-slate-300">
                <p><span className="text-amber-300 font-bold">សហគ្រាស៖</span> {companyName}</p>
                <p><span className="text-amber-300 font-bold">គោលបំណង៖</span> វិភាគផ្ទៀងផ្ទាត់ស្លាកអាហារូបត្ថម្ភ (Nutrition Facts) សម្រាប់ផលិតផលម្សៅស្វាយចន្ទីចម្រាញ់ខ្លាញ់ CS 001:2000 & FDA Export</p>
                <p><span className="text-amber-300 font-bold">គំរូបញ្ជូនពិសោធន៍៖</span> Sample A (គ្រាប់ដើមមុនចម្រាញ់) vs Sample B (ម្សៅក្រោយចម្រាញ់) vs Sample C (ប្រេងចន្ទី)</p>
              </div>

              <div className="border-t border-slate-800 pt-2 space-y-1 text-[11px] text-slate-400">
                <p>• ប៉ារ៉ាម៉ែត្រ Fat: AOAC 920.39 (Soxhlet Method)</p>
                <p>• ប៉ារ៉ាម៉ែត្រ Protein: AOAC 992.15 (Kjeldahl Nitrogen)</p>
                <p>• ប៉ារ៉ាម៉ែត្រ Moisture: AOAC 925.40 (Vacuum Oven Dry)</p>
                <p>• ប៉ារ៉ាម៉ែត្រ Peroxide Value: AOAC 965.33 (Lipid Stability Test)</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCopyProtocol}
                className="px-4 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-indigo-300"
              >
                {copiedProtocol ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedProtocol ? '✓ បានចម្លងពិធីការ!' : 'ចម្លងពិធីការផ្ញើទៅ FTC (Copy Protocol)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            គាំទ្រដោយ៖ <strong>FTC Facility (MISTI) & សហគ្រិនខ្មែរ (KE)</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            យល់ព្រម & បិទ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
