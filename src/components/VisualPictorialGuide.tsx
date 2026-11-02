import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, Eye, CheckCircle2, 
  Sparkles, Smartphone, Sun, ShoppingBag, 
  ShieldCheck, HelpCircle, X, ChevronRight, ChevronLeft,
  Camera, Mic, Award
} from 'lucide-react';

export interface VisualStep {
  id: number;
  stepNumberKhmer: string;
  stepNumberEn: string;
  titleKhmer: string;
  titleEn: string;
  actionTextKhmer: string;
  actionTextEn: string;
  voiceScriptKhmer: string;
  imageSrc: string;
  badgeKhmer: string;
  badgeEn: string;
  badgeColor: string;
  keyPoints: { icon: string; textKhmer: string; textEn: string }[];
}

export const VISUAL_STEPS: VisualStep[] = [
  {
    id: 1,
    stepNumberKhmer: 'ជំហានទី ១',
    stepNumberEn: 'Step 1',
    titleKhmer: 'បេះ និងរើសគ្រាប់ស្វាយចន្ទីល្អៗ',
    titleEn: 'Harvest & Hand-Pick Ripe Cashews',
    actionTextKhmer: 'បេះផ្លែស្វាយចន្ទីដែលទុំល្អលើដើម ឬធ្លាក់ថ្មីៗ រើសយកតែគ្រាប់ថ្លោសៗ មិនមានដង្កូវ ឬខូចគុណភាព។',
    actionTextEn: 'Harvest naturally ripe cashew apples. Hand-pick only plump, dense nuts with no pest damage or defects.',
    voiceScriptKhmer: 'ជំហានទីមួយ៖ បេះផ្លែស្វាយចន្ទីដែលទុំល្អលើដើម ឬធ្លាក់ថ្មីៗ រើសយកតែគ្រាប់ថ្លោសៗ មិនមានដង្កូវ ឬខូចគុណភាព។',
    imageSrc: '/images/cambodia_cashew_farmer_1787965007571.jpg',
    badgeKhmer: 'ប្រមូលផលស្រស់ពីចម្ការ',
    badgeEn: 'Fresh Farm Harvest',
    badgeColor: 'bg-emerald-500 text-white',
    keyPoints: [
      { icon: '🧺', textKhmer: 'រើសតែគ្រាប់ទុំល្អ', textEn: 'Pick only mature nuts' },
      { icon: '🌿', textKhmer: 'មិនកាប់បំផ្លាញព្រៃឈើ (EUDR)', textEn: 'Non-deforest land' },
      { icon: '✨', textKhmer: 'មិនប្រើគីមីហាមឃាត់', textEn: 'No banned chemicals' }
    ]
  },
  {
    id: 2,
    stepNumberKhmer: 'ជំហានទី ២',
    stepNumberEn: 'Step 2',
    titleKhmer: 'ហាលថ្ងៃ និងរើសចំណាត់ថ្នាក់គ្រាប់លេខមួយ',
    titleEn: 'Sun-Drying & Quality Sorting',
    actionTextKhmer: 'ហាលថ្ងៃគ្រាប់លើកម្រាលស្អាត ឱ្យស្ងួតល្អ ជាតិសំណើមនៅសល់ត្រឹម ៨ ទៅ ១០% ហើយរើសបែងចែកចំណាត់ថ្នាក់។',
    actionTextEn: 'Sun-dry raw cashews on clean tarps until moisture reaches 8-10%. Screen and grade into top export quality.',
    voiceScriptKhmer: 'ជំហានទីពីរ៖ ហាលថ្ងៃគ្រាប់លើកម្រាលស្អាត ឱ្យស្ងួតល្អ ជាតិសំណើមនៅសល់ត្រឹម ៨ ទៅ ១០% ហើយរើសបែងចែកចំណាត់ថ្នាក់គ្រាប់លេខមួយ។',
    imageSrc: '/images/cashew_drying_grading_1787965024347.jpg',
    badgeKhmer: 'ហាលថ្ងៃស្ងួតស្អាត',
    badgeEn: 'Hygienic Sun-Drying',
    badgeColor: 'bg-amber-500 text-white',
    keyPoints: [
      { icon: '☀️', textKhmer: 'ហាលថ្ងៃធម្មជាតិ ២-៣ ថ្ងៃ', textEn: 'Sun-dry 2-3 days' },
      { icon: '⚖️', textKhmer: 'សំណើមស្ងួត ៨-១០%', textEn: 'Moisture 8-10%' },
      { icon: '🥇', textKhmer: 'បែងចែកគ្រាប់លេខ ១ និងលេខ ២', textEn: 'Sort Grade A & B' }
    ]
  },
  {
    id: 3,
    stepNumberKhmer: 'ជំហានទី ៣',
    stepNumberEn: 'Step 3',
    titleKhmer: 'ថតរូប និងចុចនិយាយថតសម្លេងតាមទូរស័ព្ទ',
    titleEn: 'Snap Photo & Speak Voice Story',
    actionTextKhmer: 'មិនបាច់ចេះអក្សរច្រើនទេ! គ្រាន់តែបើកទូរស័ព្ទ ចុចប៊ូតុងមីក្រូហ្វូនពណ៌ក្រហម និយាយរៀបរាប់ពីចម្ការ និងថតរូប។',
    actionTextEn: 'No writing needed! Just open your smartphone, tap the microphone button, talk about your harvest, and snap a farm photo.',
    voiceScriptKhmer: 'ជំហានទីបី៖ មិនបាច់ចេះអក្សរច្រើនទេ! គ្រាន់តែបើកទូរស័ព្ទ ចុចប៊ូតុងមីក្រូហ្វូនពណ៌ក្រហម និយាយរៀបរាប់ពីចម្ការ និងថតរូប នោះប្រព័ន្ធនឹងកត់ត្រាជូនភ្លាម។',
    imageSrc: '/images/farmer_recording_phone_1787965037853.jpg',
    badgeKhmer: 'និយាយតាមទូរស័ព្ទដៃ',
    badgeEn: 'Voice-First Recording',
    badgeColor: 'bg-rose-500 text-white',
    keyPoints: [
      { icon: '📱', textKhmer: 'ប្រើទូរស័ព្ទដៃសាមញ្ញ', textEn: 'Simple smartphone' },
      { icon: '🎙️', textKhmer: 'ចុចនិយាយ មិនបាច់សរសេរ', textEn: 'Just speak, no typing' },
      { icon: '📸', textKhmer: 'ថតរូបផ្លែ និងដីចម្ការ', textEn: 'Photo proof of plot' }
    ]
  },
  {
    id: 4,
    stepNumberKhmer: 'ជំហានទី ៤',
    stepNumberEn: 'Step 4',
    titleKhmer: 'រោងចក្រកែច្នៃអនាម័យ និងបិទត្រា QR Code',
    titleEn: 'Hygienic Roasting & QR Sealing',
    actionTextKhmer: 'គ្រាប់ស្វាយចន្ទីត្រូវបានលីងដោយអនាម័យខ្ពស់ វេចខ្ចប់ក្នុងដបស្អាត និងបិទស្ទីកឃ័រត្រា QR Code តាមដានប្រភពដើម។',
    actionTextEn: 'Cashews are hygienically roasted, vacuum-sealed into premium containers, and labeled with digital QR traceability stamps.',
    voiceScriptKhmer: 'ជំហានទីបួន៖ គ្រាប់ស្វាយចន្ទីត្រូវបានលីងដោយអនាម័យខ្ពស់ វេចខ្ចប់ក្នុងដបស្អាត និងបិទស្ទីកឃ័រត្រា QR Code តាមដានប្រភពដើម។',
    imageSrc: '/images/khmer_artisan_packaging_1787965050756.jpg',
    badgeKhmer: 'ស្តង់ដារអនាម័យ GHP/HACCP',
    badgeEn: 'GHP Hygiene Standard',
    badgeColor: 'bg-purple-600 text-white',
    keyPoints: [
      { icon: '🛡️', textKhmer: 'អនាម័យខ្ពស់ GHP/HACCP', textEn: 'GHP safety rules' },
      { icon: '🏷️', textKhmer: 'បិទត្រាស្ទីកឃ័រ QR Code', textEn: 'Affix QR code seal' },
      { icon: '🥫', textKhmer: 'វេចខ្ចប់ដបស្អាតតាមស្តង់ដារ', textEn: 'Hygienic jar sealing' }
    ]
  },
  {
    id: 5,
    stepNumberKhmer: 'ជំហានទី ៥',
    stepNumberEn: 'Step 5',
    titleKhmer: 'ដាក់លក់លើទីផ្សារទំនើប និងនាំចេញបានតម្លៃខ្ពស់',
    titleEn: 'Sell to Supermarkets & Export at High Price',
    actionTextKhmer: 'កសិផលមានត្រា QR Code និងប្រភពច្បាស់លាស់ អាចដាក់លក់ក្នុងផ្សារទំនើប ផ្សារទេសចរណ៍ និងនាំចេញក្នុងតម្លៃខ្ពស់។',
    actionTextEn: 'Verified products with QR passports enter modern supermarkets, souvenir boutiques, and international export channels at premium prices.',
    voiceScriptKhmer: 'ជំហានទីប្រាំ៖ កសិផលមានត្រា QR Code និងប្រភពច្បាស់លាស់ អាចដាក់លក់ក្នុងផ្សារទំនើប ផ្សារទេសចរណ៍ និងនាំចេញក្នុងតម្លៃខ្ពស់ ចំណេញច្រើនដល់កសិករ។',
    imageSrc: '/images/mayany_cashew_house_mockup_1785128863626.jpg',
    badgeKhmer: 'លក់បានតម្លៃខ្ពស់',
    badgeEn: 'Premium Value & Export',
    badgeColor: 'bg-blue-600 text-white',
    keyPoints: [
      { icon: '🏪', textKhmer: 'ដាក់លក់ផ្សារទំនើបធំៗ', textEn: 'Top supermarket shelves' },
      { icon: '🚢', textKhmer: 'នាំចេញទៅក្រៅប្រទេស', textEn: 'International export' },
      { icon: '💰', textKhmer: 'ចំណូលកើនឡើង ២០-៤០%', textEn: 'Farmer income +20-40%' }
    ]
  }
];

interface VisualPictorialGuideProps {
  onOpenFarmerPortal?: () => void;
  compact?: boolean;
}

export default function VisualPictorialGuide({ onOpenFarmerPortal, compact = false }: VisualPictorialGuideProps) {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [playingStepId, setPlayingStepId] = useState<number | null>(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<VisualStep | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const handlePlayVoice = (step: VisualStep) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert(`សម្លេងណែនាំ (Voice Script):\n"${step.voiceScriptKhmer}"`);
      return;
    }

    // If currently playing the same step, stop it
    if (playingStepId === step.id) {
      window.speechSynthesis.cancel();
      setPlayingStepId(null);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(step.voiceScriptKhmer);
    utterance.lang = 'km-KH'; // Khmer language code
    utterance.rate = 0.9; // Friendly gentle pace for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setPlayingStepId(step.id);
    };

    utterance.onend = () => {
      setPlayingStepId(null);
    };

    utterance.onerror = () => {
      setPlayingStepId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingStepId(null);
  };

  return (
    <section className="bg-gradient-to-b from-white to-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-md space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-200">
            <Camera size={14} className="text-emerald-700" />
            <span>មគ្គទេសក៍រូបភាពងាយយល់ (VISUAL PICTORIAL INSTRUCTIONS)</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            ៥ ជំហានរូបភាពសម្រាប់កសិករ & សហគ្រាស
            <span className="block text-emerald-700 text-base sm:text-lg font-semibold mt-0.5">
              5-Step Visual Photo Guide (ងាយស្រួលយល់ មិនបាច់ចេះអក្សរច្រើន)
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            រៀបចំឡើងយ៉ាងពិសេសសម្រាប់កសិករ និងម្ចាស់ចម្ការ — គ្រាន់តែមើលរូបភាព និងចុចស្តាប់សម្លេងណែនាំជាភាសាខ្មែរ! (Designed especially for non-readers and rural farm owners — just follow the photos and tap to listen to Khmer voice instructions.)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {playingStepId !== null ? (
            <button
              type="button"
              onClick={handleStopVoice}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer animate-pulse"
            >
              <VolumeX size={14} />
              <span>ផ្អាកសម្លេង (Stop Voice)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handlePlayVoice(VISUAL_STEPS[activeStepId - 1] || VISUAL_STEPS[0])}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Volume2 size={14} />
              <span>🔊 ចុចស្តាប់សម្លេងណែនាំ (Listen)</span>
            </button>
          )}

          {onOpenFarmerPortal && (
            <button
              type="button"
              onClick={onOpenFarmerPortal}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Mic size={14} />
              <span>ចុះបញ្ជីចម្ការឥឡូវនេះ (Start Now)</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {VISUAL_STEPS.map((step) => {
          const isPlaying = playingStepId === step.id;
          const isActive = activeStepId === step.id;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`group bg-white rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg cursor-pointer ${
                isPlaying 
                  ? 'border-amber-500 ring-2 ring-amber-300 shadow-md scale-[1.02]' 
                  : isActive
                    ? 'border-emerald-600 ring-1 ring-emerald-200'
                    : 'border-slate-200 hover:border-emerald-400'
              }`}
            >
              {/* Photo Container with Zoom Overlay */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={step.imageSrc}
                  alt={step.titleKhmer}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badge: Step Number */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                    {step.stepNumberKhmer}
                  </span>
                </div>

                {/* Top Right: Status Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs ${step.badgeColor}`}>
                    {step.badgeKhmer}
                  </span>
                </div>

                {/* Click to Zoom Overlay Icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoModal(step);
                  }}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition opacity-80 hover:opacity-100 cursor-pointer"
                  title="ពង្រីកមើលរូបភាព (Zoom Photo)"
                >
                  <Eye size={13} />
                </button>

                {/* Speaker indicator on top of photo */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-amber-900/30 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg animate-bounce">
                      <Volume2 size={15} />
                      <span>កំពុងអាន...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                    {step.titleKhmer}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                    {step.titleEn}
                  </p>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {step.actionTextKhmer}
                  </p>
                </div>

                {/* Visual Checklist Badges */}
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  {step.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-700 font-medium">
                      <span className="text-xs shrink-0">{point.icon}</span>
                      <span className="truncate">{point.textKhmer}</span>
                    </div>
                  ))}
                </div>

                {/* Voice Narration Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVoice(step);
                    }}
                    className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                      isPlaying
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <VolumeX size={13} />
                        <span>ផ្អាកសម្លេង</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={13} className="text-amber-700" />
                        <span>🔊 ស្តាប់សម្លេង</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Audio Tip for Illiterate Farmers */}
      <div className="bg-emerald-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
            🎙️
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-amber-300">
              កសិករមិនចេះសរសេរអក្សរក៏អាចចុះបញ្ជីបាន (Voice-First Farm Registration)
            </h4>
            <p className="text-xs text-emerald-100 leading-relaxed mt-0.5">
              គ្រាន់តែចុចលើប៊ូតុង "🔊 ស្តាប់សម្លេង" លើជំហាននីមួយៗ ឬប្រើប្រាស់មុខងារថតសម្លេងនិយាយប្រាប់ពីចម្ការ ប្រព័ន្ធនឹងជួយកត់ត្រាស្វ័យប្រវត្តជូន!
            </p>
          </div>
        </div>

        {onOpenFarmerPortal && (
          <button
            type="button"
            onClick={onOpenFarmerPortal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>ចូលទៅកាន់ទំព័រកសិករ (Go to Farmer Portal)</span>
            <ChevronRight size={15} />
          </button>
        )}
      </div>

      {/* High-Resolution Photo Zoom Modal */}
      <AnimatePresence>
        {selectedPhotoModal && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedPhotoModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs">
                    {selectedPhotoModal.stepNumberKhmer}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {selectedPhotoModal.titleKhmer}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoModal(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Large Image Preview */}
              <div className="relative aspect-4/3 w-full bg-slate-950">
                <img
                  src={selectedPhotoModal.imageSrc}
                  alt={selectedPhotoModal.titleKhmer}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Details & Voice Control */}
              <div className="p-5 space-y-3 bg-white">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    {selectedPhotoModal.badgeKhmer} ({selectedPhotoModal.badgeEn})
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-sans mt-1 leading-relaxed">
                    {selectedPhotoModal.actionTextKhmer}
                  </p>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    "{selectedPhotoModal.actionTextEn}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handlePlayVoice(selectedPhotoModal)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Volume2 size={15} />
                    <span>ស្តាប់សម្លេងណែនាំ (Listen to Audio)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPhotoModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    បិទផ្ទាំង (Close)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
