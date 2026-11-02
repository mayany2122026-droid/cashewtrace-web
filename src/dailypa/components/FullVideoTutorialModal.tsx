import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Volume2, Film, Sparkles, Mic, VolumeX, 
  Pause, Check, RotateCcw, Share2, Copy, ArrowRight, DollarSign, BookOpen, Clock, HelpCircle
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { speakText, stopSpeaking } from '../utils/speech';

interface FullVideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const FullVideoTutorialModal: React.FC<FullVideoTutorialModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const isKm = lang === 'km';

  // 4 Crystal-clear video scenes that directly answer:
  // 1. What is MyDailyPA?
  // 2. What 4 critical problems does it solve?
  // 3. How does it work (The 1-second voice experience)?
  // 4. Who is it for (Market sellers, busy people, non-readers, elders)?
  const SCENES = [
    {
      id: 'what_is_it',
      titleKm: '១. តើ MyDailyPA គឺជាអ្វី? (What is it?)',
      titleEn: '1. What is MyDailyPA?',
      headlineKm: 'ជំនួយការផ្ទាល់ខ្លួនដំណើរការដោយសំឡេង (Voice Personal Assistant)',
      headlineEn: 'Cambodia’s 1-Tap Voice Daily Personal Assistant',
      descriptionKm: 'MyDailyPA គឺជាលេខា និងជំនួយការឆ្លាតវៃផ្ទាល់ខ្លួន ដែលអ្នកគ្រាន់តែ «ចុចលើមីក្រូហ្វូន ហើយនិយាយ» ដូចនិយាយជាមួយមនុស្សពិត។ មិនបាច់រៀនប្រើកម្មវិធីស្មុគស្មាញ មិនបាច់វាយអក្សរទាល់តែសោះ។',
      descriptionEn: 'MyDailyPA is your personal voice secretary. You simply tap the clean microphone and speak naturally—just like talking to a real human secretary. Zero typing, zero complex menus.',
      speechKm: 'ជំរាបសួរ! តើ MyDailyPA គឺជាអ្វី? MyDailyPA គឺជាជំនួយការផ្ទាល់ខ្លួនដំណើរការដោយសំឡេង ១០០%។ អ្នកមិនបាច់ចេះវាយអក្សរលើទូរសព្ទឡើយ។ អ្នកគ្រាន់តែចុចលើមីក្រូហ្វូន ហើយនិយាយជាភាសាខ្មែរតាមទម្លាប់ធម្មតា។',
      speechEn: 'Hello! What is MyDailyPA? It is Cambodia’s 1-tap voice personal assistant. You never have to type on a small screen. Just tap the microphone and speak naturally.',
      icon: '🎙️',
      color: 'from-rose-600 to-amber-500',
    },
    {
      id: 'what_it_solves',
      titleKm: '២. តើ MyDailyPA ដោះស្រាយបញ្ហាអ្វីខ្លះ? (What Does it Solve?)',
      titleEn: '2. What Problems Does it Solve?',
      headlineKm: 'ដោះស្រាយបញ្ហាធំៗ ៤ យ៉ាងក្នុងជីវភាពរស់នៅ និងអាជីវកម្ម',
      headlineEn: 'Solving 4 Critical Frustrations in Daily Life & Commerce',
      descriptionKm: '១. ពិបាកវាយអក្សរខ្មែរ៖ ក្តារចុចទូរសព្ទមានជើង និងស្រៈច្រើន វាយយឺត។\n២. ច្រឡំលុយរៀល និងដុល្លារ៖ ពិបាកគិតលេខ ងាយខាតលុយ។\n៣. បាត់លុយជំពាក់៖ កត់លើក្រដាសរហែកបាត់ ឬភ្លេចទារ។\n៤. អ្នកមិនសូវចេះអក្សរ៖ មិនអាចប្រើកម្មវិធីស្មុគស្មាញបាន។',
      descriptionEn: '1. Painful Khmer Typing: Mobile keyboards with complex subscripts make typing slow.\n2. Dual-Currency Chaos: Juggling Riels and Dollars causes math errors and lost money.\n3. Lost Customer Debts: Paper slips get torn and forgotten.\n4. Non-Readers Excluded: Traditional apps require reading and writing.',
      speechKm: 'តើ MyDailyPA ដោះស្រាយបញ្ហាអ្វី? ទី១ លែងពិបាកវាយអក្សរខ្មែរដែលមានជើងនិងស្រៈច្រើន។ ទី២ ដោះស្រាយភាពច្របូកច្របល់រវាងលុយរៀលនិងដុល្លារ ដោយគិតលេខស្វ័យប្រវត្តិ។ ទី៣ សៀវភៅបំណុលមិនឱ្យបាត់បង់លុយជំពាក់។ និងទី៤ មនុស្សចាស់ឬអ្នកមិនចេះអក្សរក៏អាចប្រើបានដោយគ្រាន់តែស្តាប់សំឡេង។',
      speechEn: 'What does MyDailyPA solve? First: zero painful Khmer keyboard typing. Second: automatic conversion between Riels and Dollars. Third: never lose customer debts written on scrap paper. Fourth: fully accessible for non-reading elders via voice.',
      icon: '🎯',
      color: 'from-amber-600 to-emerald-600',
    },
    {
      id: 'how_it_works',
      titleKm: '៣. របៀបដំណើរការ៖ ងាយបំផុតត្រឹមតែ ១ វិនាទី! (How it Works)',
      titleEn: '3. How It Works in 1 Second',
      headlineKm: 'ចុចមីក្រូហ្វូន ➔ និយាយ ➔ ជំនួយការឆ្លើយតប និងកត់ត្រាភ្លាម',
      headlineEn: 'Tap Microphone ➔ Speak ➔ Instant Voice Confirmation',
      descriptionKm: 'ឧទាហរណ៍៖ ចុចមីក្រូហ្វូន ហើយនិយាយថា «លក់កាហ្វេបាន ២ម៉ឺនរៀល» ឬ «ពូសុខ ជំពាក់ $15» ឬ «សួស្តី តើថ្ងៃនេះចំណេញបានប៉ុន្មាន?»។ ជំនួយការនឹងឆ្លើយតបជាសំឡេង និងកត់ត្រាទុកយ៉ាងមានរបៀប។',
      descriptionEn: 'Example: Tap mic and say "Sold 2 coffees for 20,000 Riels" or "Uncle Sok owes $15" or "How much profit today?". The assistant speaks back and organizes everything instantly.',
      speechKm: 'របៀបប្រើប្រាស់គឺងាយស្រួលបំផុត៖ ចុចលើមីក្រូហ្វូន ហើយនិយាយដូចជា លក់កាហ្វេបាន ២ម៉ឺនរៀល ឬ ពូសុខជំពាក់ ១៥ដុល្លារ។ ជំនួយការនឹងឆ្លើយតបបញ្ជាក់ជាសំឡេង និងរក្សាទុកភ្លាមៗ។',
      speechEn: 'How to use: Simply tap the microphone and speak. For instance: Sold coffee for 20,000 Riel, or Uncle Sok owes 15 dollars. The assistant speaks back to confirm and logs it.',
      icon: '⚡',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'who_is_it_for',
      titleKm: '៤. តើកម្មវិធីនេះស័ក្តិសមសម្រាប់អ្នកណា? (Who is it for?)',
      titleEn: '4. Who is MyDailyPA For?',
      headlineKm: 'អ្នកលក់ដូរ អាជីវកម្មខ្នាតតូច មនុស្សចាស់ និងគ្រប់គ្នា',
      headlineEn: 'Market Vendors, MSMEs, Busy Families, and Elders',
      descriptionKm: 'ស័ក្តិសមបំផុតសម្រាប់៖ អ្នកលក់ចាប់ហួយ អ្នកលក់តាមផ្សារ កសិករ មេផ្ទះ មនុស្សចាស់ និងអ្នកដែលមិនចូលចិត្តវាយអក្សរលើទូរសព្ទ។ MyDailyPA ធ្វើឱ្យការកត់ត្រាប្រចាំថ្ងៃក្លាយជារឿងសាមញ្ញបំផុត។',
      descriptionEn: 'Perfect for: Market vendors, grocery stall owners, farmers, busy parents, elders, and anyone tired of typing on small smartphone screens.',
      speechKm: 'MyDailyPA ស័ក្តិសមសម្រាប់អ្នកលក់ដូរតាមផ្សារ អាជីវកម្មខ្នាតតូច មនុស្សចាស់ និងគ្រប់គ្នាដែលចង់កត់ត្រាចំណូលចំណាយដោយមិនបាច់វាយអក្សរ។',
      speechEn: 'MyDailyPA is built for market vendors, small business owners, elders, and anyone who wants to record daily money effortlessly using voice.',
      icon: '👥',
      color: 'from-emerald-600 to-teal-700',
    }
  ];

  const currentScene = SCENES[currentSceneIndex];

  // Play narration of current scene
  const playCurrentSceneNarration = () => {
    stopSpeaking();
    const textToSpeak = isKm ? currentScene.speechKm : currentScene.speechEn;
    speakText(textToSpeak, isKm ? 'km' : 'en', {
      playChime: true,
      onEnd: () => {
        if (isPlayingAuto) {
          if (currentSceneIndex < SCENES.length - 1) {
            setTimeout(() => {
              setCurrentSceneIndex(prev => prev + 1);
            }, 800);
          } else {
            setIsPlayingAuto(false);
          }
        }
      }
    });
  };

  useEffect(() => {
    if (isPlayingAuto) {
      playCurrentSceneNarration();
    }
  }, [currentSceneIndex, isPlayingAuto]);

  const handleToggleAutoPlay = () => {
    if (isPlayingAuto) {
      stopSpeaking();
      setIsPlayingAuto(false);
    } else {
      setIsPlayingAuto(true);
      playCurrentSceneNarration();
    }
  };

  const handleClose = () => {
    stopSpeaking();
    setIsPlayingAuto(false);
    onClose();
  };

  const fullPitchText = `【តើ MyDailyPA គឺជាអ្វី?】
MyDailyPA គឺជាជំនួយការផ្ទាល់ខ្លួនដំណើរការដោយសំឡេង (Voice Daily Personal Assistant) ដំបូងបង្អស់នៅកម្ពុជា។ អ្នកប្រើប្រាស់គ្រាន់តែចុចលើមីក្រូហ្វូន ហើយនិយាយ មិនបាច់វាយអក្សរទាល់តែសោះ។

【តើវាដោះស្រាយបញ្ហាអ្វីខ្លះ?】
១. ពិបាកវាយអក្សរខ្មែរលើទូរសព្ទ ➔ និយាយ ១ វិនាទី កត់ត្រាភ្លាម!
២. ច្របូកច្របល់រវាងលុយរៀល (៛) និងដុល្លារ ($) ➔ គណនា និងប្តូររូបិយប័ណ្ណស្វ័យប្រវត្តិ ៤០០០៛ = $1!
៣. បាត់លុយជំពាក់ («លុយជំពាក់») ➔ កត់ឈ្មោះ និងចំនួនលុយដោយសំឡេង មិនបាត់បង់!
៤. សម្រាប់អ្នកមិនសូវចេះអក្សរ និងមនុស្សចាស់ ➔ ចុចស្តាប់ ឬសួរឮៗ ជំនួយការឆ្លើយប្រាប់ភ្លាម!`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(fullPitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-base font-black shadow-md shadow-rose-600/30">
              🎬
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>{isKm ? 'តើ MyDailyPA គឺជាអ្វី & ដោះស្រាយអ្វី?' : 'What is MyDailyPA & What Does it Solve?'}</span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {isKm ? 'ការពន្យល់ខ្លី និងងាយយល់បំផុតក្នុងរយៈពេល ១ នាទី' : '1-minute clear visual explanation'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation Screen / Presentation Player */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Main Visual Player Card */}
          <div className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-br ${currentScene.color} text-white shadow-xl relative overflow-hidden transition-all duration-300`}>
            
            {/* Background Decorative Rings */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            
            {/* Scene Header */}
            <div className="flex items-center justify-between gap-2 relative z-10 mb-3">
              <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider">
                {isKm ? currentScene.titleKm : currentScene.titleEn}
              </span>

              <span className="text-xs font-bold text-white/80">
                {currentSceneIndex + 1} / {SCENES.length}
              </span>
            </div>

            {/* Visual Icon & Headline */}
            <div className="relative z-10 space-y-2 mb-4">
              <div className="text-4xl sm:text-5xl">{currentScene.icon}</div>
              <h4 className="text-xl sm:text-2xl font-black leading-snug">
                {isKm ? currentScene.headlineKm : currentScene.headlineEn}
              </h4>
            </div>

            {/* Explanation Box */}
            <div className="relative z-10 p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white space-y-2">
              <p className="text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line">
                {isKm ? currentScene.descriptionKm : currentScene.descriptionEn}
              </p>
            </div>

            {/* Animated Mic Simulation inside the Video */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full ${isPlayingAuto ? 'bg-white text-rose-600 animate-pulse' : 'bg-white/20 text-white'} flex items-center justify-center font-black shadow-md`}>
                  <Mic className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-black text-amber-200">
                    {isPlayingAuto ? '🔊 កំពុងអានពន្យល់ឮៗ...' : 'ចុច Play ដើម្បីស្តាប់សំឡេងពន្យល់'}
                  </p>
                  <p className="text-[11px] text-white/80">
                    {isKm ? 'ជំនួយការផ្ទាល់ខ្លួននិយាយភាសាខ្មែរ' : 'Cambodia’s Voice Assistant'}
                  </p>
                </div>
              </div>

              {/* Play / Listen Button */}
              <button
                type="button"
                onClick={handleToggleAutoPlay}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform cursor-pointer"
              >
                {isPlayingAuto ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-900" />
                    <span>ផ្អាកសំឡេង</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-900" />
                    <span>▶️ ចាក់វីដេអូ & ស្តាប់</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scene Navigation Bar */}
          <div className="grid grid-cols-4 gap-2">
            {SCENES.map((scene, idx) => {
              const isActive = idx === currentSceneIndex;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setIsPlayingAuto(false);
                    setCurrentSceneIndex(idx);
                  }}
                  className={`p-2.5 rounded-2xl text-center text-xs font-black transition-all cursor-pointer border ${
                    isActive 
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-rose-400' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="text-base mb-0.5">{scene.icon}</div>
                  <div className="truncate">{scene.titleKm.split('.')[1] || scene.titleKm}</div>
                </button>
              );
            })}
          </div>

          {/* Direct Plain Answers Card (For Mentors & Users) */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <h5 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <span>💡</span>
              <span>ចម្លើយសង្ខេបសម្រាប់ឆ្លើយប្រាប់គេភ្លាមៗ (Quick Summary)</span>
            </h5>

            <div className="space-y-2 text-xs sm:text-sm text-slate-800">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="font-black text-rose-700">❓ តើវាជាអ្វី (What is it)? </span>
                <span className="font-medium">
                  ជា «ជំនួយការសំឡេង» សម្រាប់កត់ត្រាចំណូល-ចំណាយ និងលុយជំពាក់ ដោយគ្រាន់តែចុចមីក្រូហ្វូននិយាយ ១ វិនាទី។
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="font-black text-emerald-700">🎯 តើវាដោះស្រាយអ្វី (What does it solve)? </span>
                <span className="font-medium">
                  ដោះស្រាយបញ្ហាធុញទ្រាន់នឹងការវាយអក្សរខ្មែរលើទូរសព្ទ, ការច្រឡំលុយរៀល-ដុល្លារ, និងការបាត់បង់លុយជំពាក់លើក្រដាស។
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
              >
                {copiedPitch ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>បានចម្លងអត្ថបទពន្យល់!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>ចម្លងអត្ថបទពន្យល់ដើម្បីផ្ញើឱ្យគេ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer active:scale-95 transition-all shadow-sm"
              >
                ចូលទៅសាកល្បងមីក្រូហ្វូន ➔
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
