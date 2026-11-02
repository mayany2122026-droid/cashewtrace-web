import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Smartphone, 
  CheckCircle2, Sparkles, UserPlus, FileText, QrCode, 
  ArrowRight, ShieldCheck, MapPin, Layers, Check, ExternalLink
} from 'lucide-react';
import CashewTraceLogo, { CashewTraceIcon } from './CashewTraceLogo';

interface FarmerGuideProps {
  onSelectAction?: (action: 'register' | 'login' | 'demo') => void;
}

export default function FarmerVideoGuideBanner({ onSelectAction }: FarmerGuideProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [activeVideoScene, setActiveVideoScene] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [customVideoUrl, setCustomVideoUrl] = useState<string>('');

  const scenes = [
    {
      id: 0,
      title: 'ជំហានទី ១៖ ចុះឈ្មោះ ឬជ្រើសរើស "⚡ គណនីគំរូ"',
      titleKhmer: 'របៀបចុះឈ្មោះ និងចូលប្រើប្រាស់',
      description: 'បំពេញឈ្មោះ លេខអត្តសញ្ញាណប័ណ្ណ និងទូរស័ព្ទ ឬចុចយកគណនីគំរូរបស់ លោក អួន ស៊ីឡុត (Silot) ចូលភ្លាមៗ!',
      uiVisual: 'register',
      color: 'from-emerald-600 to-teal-700',
      durationSec: 6
    },
    {
      id: 1,
      title: 'ជំហានទី ២៖ កត់ត្រាសកម្មភាព និងចាប់ទីតាំង GPS ចម្ការ',
      titleKhmer: 'កត់ត្រាការដាក់ជី កាត់តម្រឹមមែក និង GPS',
      description: 'ជ្រើសរើសប្រភេទជីធម្មជាតិ ឬថ្នាំជីវសាស្ត្រ រួចចុច "ចាប់យកទីតាំង GPS" ពីក្នុងចម្ការជាក់ស្តែង។',
      uiVisual: 'record',
      color: 'from-amber-600 to-orange-700',
      durationSec: 7
    },
    {
      id: 2,
      title: 'ជំហានទី ៣៖ បង្កើត និងបោះពុម្ព EUDR QR Passport',
      titleKhmer: 'ទាញយក QR Code ភ្ជាប់ប្រភពចម្ការ',
      description: 'ប្រព័ន្ធនឹងបង្កើត QR Code បញ្ជាក់ប្រភពចម្ការស្របច្បាប់ មិនកាប់ព្រៃឈើ (EUDR Compliance) សម្រាប់បិទលើបាវស្វាយចន្ទី!',
      uiVisual: 'qr',
      color: 'from-blue-600 to-indigo-700',
      durationSec: 7
    }
  ];

  // Auto-play timer for animated walkthrough simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && videoModalOpen) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            // Loop or cycle scenes
            setActiveVideoScene((curr) => {
              const next = (curr + 1) % scenes.length;
              return next;
            });
            return 0;
          }
          return prev + 1.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoModalOpen, scenes.length]);

  const handlePlayVideo = () => {
    setVideoModalOpen(true);
    setIsPlaying(true);
    setPlaybackProgress(0);
    setActiveVideoScene(0);
  };

  const steps = [
    {
      step: 1,
      title: '១. ចុះឈ្មោះ ឬ ចូលគណនី (Register / Login)',
      description: 'បំពេញឈ្មោះ លេខអត្តសញ្ញាណប័ណ្ណ និងលេខទូរស័ព្ទ រួចចុច "ចុះឈ្មោះ" ប្រព័ន្ធនឹងបង្កើត Login ID & Password ជូនភ្លាមៗ។',
      actionKey: 'register' as const,
      color: 'emerald',
      icon: '📝',
      tip: 'សម្រាប់លោក អួន ស៊ីឡុត (Silot) ឬចម្ការគំរូ អាចចុចផ្ទាំង "⚡ គណនីគំរូ" ដើម្បីចូលភ្លាមៗក្នុង ១វិនាទី!'
    },
    {
      step: 2,
      title: '២. កត់ត្រាសកម្មភាពចម្ការ (Record Farm Activities)',
      description: 'ជ្រើសរើសសកម្មភាពដូចជា ដាក់ជី កាត់តម្រឹមមែក បាញ់ថ្នាំជីវសាស្ត្រ ឬច្រូតកាត់ និងចុច "ចាប់យកទីតាំង GPS" ពីចម្ការជាក់ស្តែង។',
      actionKey: 'demo' as const,
      color: 'amber',
      icon: '🌿',
      tip: 'ប្រព័ន្ធដំណើរការបានសូម្បីតែគ្មានអ៊ីនធឺណិត (Offline Mode) ហើយរក្សាទុកទិន្នន័យលើទូរស័ព្ទដោយសុវត្ថិភាព។'
    },
    {
      step: 3,
      title: '៣. បង្កើត & បោះពុម្ព QR Passport (Generate QR Code)',
      description: 'ក្រោយពីកត់ត្រារួច ប្រព័ន្ធនឹងបង្កើត QR Code លិខិតឆ្លងដែនចម្ការ EUDR Passport ដែលអាចស្កេនពិនិត្យប្រភព និងបោះពុម្ពបិទលើបាវស្វាយចន្ទី។',
      actionKey: 'demo' as const,
      color: 'blue',
      icon: '📲',
      tip: 'រោងចក្រ និងអ្នកទិញអន្តរជាតិអាចស្កេន QR ឃើញប្រវត្តិចម្ការ កូអរដោនេ GPS និងស្តង់ដារ GAP ភ្លាមៗ!'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl border-2 border-emerald-500/50 shadow-2xl p-5 sm:p-7 space-y-5 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag & Title */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase tracking-wide shadow-md">
              <Sparkles size={13} className="animate-spin" />
              <span>សេចក្តីណែនាំពិសេសសម្រាប់កសិករ និងលោក អួន ស៊ីឡុត (Silot)</span>
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[11px] font-mono font-bold border border-emerald-400/30">
              Cashew Nut Sector Only
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-white flex items-center gap-2">
            <span>🎬 វីដេអូ & របៀបប្រើប្រាស់ប្រព័ន្ធកសិករស្វាយចន្ទី (Farmer Video & Visual Guide)</span>
          </h2>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            តើត្រូវចាប់ផ្តើមដូចម្តេច? សូមចុចប៊ូតុង <strong>"ចាក់វីដេអូណែនាំ (Play Video Tutorial)"</strong> ខាងក្រោម ដើម្បីទស្សនាការបង្ហាញផ្ទាល់ជំហាននីមួយៗ៖
          </p>
        </div>

        {/* Video Tutorial Launcher Button */}
        <button
          type="button"
          onClick={handlePlayVideo}
          className="self-start md:self-center px-5 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-2xl shadow-xl hover:shadow-red-500/40 transition-all transform hover:scale-105 flex items-center gap-3 shrink-0 cursor-pointer border-2 border-red-400/50"
        >
          <div className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center shadow-md animate-pulse">
            <Play size={18} className="fill-red-600 translate-x-0.5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-black tracking-wide flex items-center gap-1.5">
              <span>▶ ចាក់វីដេអូណែនាំ (Play Video)</span>
            </div>
            <div className="text-[10px] text-amber-200 font-normal">វីដេអូបង្រៀនដំណើរការផ្ទាល់ • ២នាទី</div>
          </div>
        </button>
      </div>

      {/* 3 Step Interactive Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
        {steps.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              activeStep === idx
                ? 'bg-slate-900/90 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">{item.icon}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  activeStep === idx ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  ជំហានទី {idx + 1}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white font-sans line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-amber-300 font-sans flex items-start gap-1">
                <span className="shrink-0">💡</span>
                <span>{item.tip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Bar */}
      <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2.5 text-slate-300 text-xs">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>
            សម្រាប់លោក <strong>អួន ស៊ីឡុត (Silot)</strong> សូមចុចប៊ូតុង <strong>"⚡ គណនីគំរូ"</strong> នៅប្រអប់ខាងក្រោម ដើម្បីចូលភ្លាមៗ!
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onSelectAction && (
            <button
              type="button"
              onClick={() => onSelectAction('demo')}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>⚡ ចូលគណនីគំរូភ្លាម (1-Click Demo)</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE FULL-FEATURED ANIMATED VIDEO PLAYER MODAL */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md">
                  <Play size={18} className="fill-white translate-x-0.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-sans text-white flex items-center gap-2">
                    <span>វីដេអូណែនាំការប្រើប្រាស់ CashewTrace App</span>
                    <span className="bg-red-500/20 text-red-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-red-400/30">
                      LIVE TUTORIAL
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    សម្រាប់កសិករដាំដុះស្វាយចន្ទី • សមាគមស្វាយចន្ទីកម្ពុជា (CAC) & លោក អួន ស៊ីឡុត
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setVideoModalOpen(false);
                  setIsPlaying(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* VIDEO PLAYER SCREEN & ANIMATED ACTIVE WALKTHROUGH */}
            <div className="relative bg-slate-950 p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-between">
              
              {/* Scene Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {scenes.map((scene, idx) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setActiveVideoScene(idx);
                      setPlaybackProgress(0);
                    }}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer flex items-center gap-2 ${
                      activeVideoScene === idx
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      activeVideoScene === idx ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold truncate">
                      {scene.titleKhmer}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main Video Simulation Display Window */}
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-700/80 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6">
                
                {/* Scene Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${scenes[activeVideoScene].color} opacity-20 transition-all duration-700`} />

                {/* Top Overlay Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs backdrop-blur-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <span className="font-bold text-amber-300">
                      {scenes[activeVideoScene].title}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                    Scene {activeVideoScene + 1}/3
                  </div>
                </div>

                {/* Center Dynamic Visual Animation per Step */}
                <div className="relative z-10 py-3 flex flex-col items-center justify-center text-center space-y-3">
                  {/* SCENE 0: Registration */}
                  {activeVideoScene === 0 && (
                    <div className="space-y-3 animate-fade-in max-w-md w-full">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 text-2xl shadow-lg">
                        📝
                      </div>
                      <div className="bg-slate-900/90 border border-emerald-500/40 p-3.5 rounded-xl text-left space-y-1.5 shadow-xl">
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                          <span>1. បំពេញឈ្មោះកសិករ៖</span>
                          <span className="text-white bg-emerald-600 px-2 py-0.5 rounded text-[9px]">ឧ. លោក អួន ស៊ីឡុត</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>2. លេខទូរស័ព្ទ៖</span>
                          <span className="text-white font-mono">012 345 678</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>3. ខេត្ត៖</span>
                          <span className="text-amber-300 font-bold">កំពង់ធំ (Kampong Thom)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENE 1: Log Farm & GPS */}
                  {activeVideoScene === 1 && (
                    <div className="space-y-3 animate-fade-in max-w-md w-full">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-300 text-2xl shadow-lg animate-pulse">
                        📍
                      </div>
                      <div className="bg-slate-900/90 border border-amber-500/40 p-3.5 rounded-xl text-left space-y-1.5 shadow-xl">
                        <div className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                          <span>សកម្មភាពថែទាំ៖</span>
                          <span className="text-white font-sans text-[10px]">ដាក់ជីសរីរាង្គ Meltert + កាត់មែក</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>កូអរដោនេ GPS ចម្ការ៖</span>
                          <span className="text-emerald-300 font-mono text-[10px]">Lat: 12.7112, Lng: 104.8887</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>ទិន្នផលរំពឹងទុក៖</span>
                          <span className="text-amber-300 font-bold">៤៥,០០០ គីឡូក្រាម (៤៥ តោន)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENE 2: EUDR QR Passport */}
                  {activeVideoScene === 2 && (
                    <div className="space-y-3 animate-fade-in max-w-md w-full">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center mx-auto text-blue-300 text-2xl shadow-lg">
                        📲
                      </div>
                      <div className="bg-slate-900/90 border border-blue-500/40 p-3.5 rounded-xl text-left space-y-1.5 shadow-xl">
                        <div className="text-[11px] font-bold text-blue-400 flex items-center justify-between">
                          <span>EUDR QR Passport៖</span>
                          <span className="bg-blue-600 text-white font-mono px-2 py-0.5 rounded text-[9px]">KM-CASHEW-2026</span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 size={13} />
                          <span>ផ្ទៀងផ្ទាត់រួចរាល់៖ មិនពាក់ព័ន្ធការកាប់បំផ្លាញព្រៃឈើ</span>
                        </div>
                        <div className="text-[10px] text-slate-300">
                          អាចបោះពុម្ព (Print) បិទលើបាវស្វាយចន្ទី ឬផ្ញើតាម Telegram
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scene Description Subtitle */}
                  <p className="text-xs text-slate-200 font-sans max-w-lg mx-auto bg-slate-950/90 px-4 py-2 rounded-xl border border-slate-800 shadow-md">
                    {scenes[activeVideoScene].description}
                  </p>
                </div>

                {/* Video Playback Progress Bar */}
                <div className="relative z-10 space-y-2">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 transition-all duration-100"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-slate-950" />}
                        <span>{isPlaying ? 'ផ្អាក (Pause)' : 'ចាក់បន្ត (Play)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPlaybackProgress(0);
                          setIsPlaying(true);
                        }}
                        className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>ចាក់ឡើងវិញ (Replay)</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVideoScene((prev) => (prev > 0 ? prev - 1 : scenes.length - 1));
                          setPlaybackProgress(0);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                      >
                        ◀ ថយក្រោយ
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVideoScene((prev) => (prev + 1) % scenes.length);
                          setPlaybackProgress(0);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                      >
                        បន្ទាប់ ▶
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-400 font-sans">
                💡 ចុចប៊ូតុងខាងស្តាំ ដើម្បីចូលទៅកាន់គណនីគំរូ និងអនុវត្តភ្លាមៗ!
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setVideoModalOpen(false);
                    setIsPlaying(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  បិទផ្ទាំង (Close)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoModalOpen(false);
                    setIsPlaying(false);
                    if (onSelectAction) onSelectAction('demo');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer transition flex items-center gap-1.5 shadow-lg"
                >
                  <span>⚡ ចូលសាកល្បងភ្លាម (Try Demo Now)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
