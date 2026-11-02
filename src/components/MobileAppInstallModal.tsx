import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Download, CheckCircle2, QrCode, X, Copy, Check, 
  ExternalLink, Sparkles, Shield, ArrowRight, Share2, MoreVertical, Compass, Globe
} from 'lucide-react';

interface MobileAppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess?: () => void;
  currentSector?: 'mango' | 'farmer' | 'spices' | 'mayany' | 'packaging' | 'all' | null;
}

export default function MobileAppInstallModal({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess,
  currentSector
}: MobileAppInstallModalProps) {
  const getInitialSector = (): 'mango' | 'farmer' | 'spices' | 'mayany' | 'packaging' | 'all' => {
    if (currentSector) return currentSector;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = (params.get('mode') || params.get('tab') || '').toLowerCase();
      if (mode === 'mango') return 'mango';
      if (mode === 'farmer' || mode === 'cashew') return 'farmer';
      if (mode === 'spices' || mode === 'pepper' || mode === 'other') return 'spices';
      if (mode === 'mayany' || mode === 'sme') return 'mayany';
      if (mode === 'packaging' || mode === 'label' || mode === 'misti') return 'packaging';
      const stored = localStorage.getItem('cashewtrace_preferred_app');
      if (stored && ['mango', 'farmer', 'spices', 'mayany', 'packaging', 'all'].includes(stored)) {
        return stored as any;
      }
    }
    return 'mango';
  };

  const [activeSector, setActiveSector] = useState<'mango' | 'farmer' | 'spices' | 'mayany' | 'packaging' | 'all'>(getInitialSector);
  const [activeDeviceTab, setActiveDeviceTab] = useState<'chrome_android' | 'ios_safari' | 'qr_scan'>('chrome_android');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone PWA mode
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true;
    setIsStandalone(isPWA);

    // Auto detect sector based on prop or URL
    setActiveSector(getInitialSector());

    // Auto detect mobile OS if opening
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setActiveDeviceTab('ios_safari');
    } else {
      setActiveDeviceTab('chrome_android');
    }
  }, [isOpen, currentSector]);

  const handleNativeInstall = async () => {
    if (activeSector && activeSector !== 'all') {
      localStorage.setItem('cashewtrace_preferred_app', activeSector);
    }
    if (deferredPrompt) {
      try {
        setIsInstalling(true);
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          if (typeof window !== 'undefined') {
            localStorage.setItem('cashewtrace_app_installed', 'true');
          }
          if (onInstallSuccess) onInstallSuccess();
          onClose();
        }
      } catch (err) {
        console.error('PWA install prompt error:', err);
      } finally {
        setIsInstalling(false);
      }
    }
  };

  const getSectorUrl = (sector: 'mango' | 'farmer' | 'spices' | 'mayany' | 'packaging' | 'all') => {
    if (typeof window === 'undefined') return 'https://cashewtrace.app';
    const origin = window.location.origin;
    if (sector === 'all') return `${origin}/`;
    return `${origin}/?mode=${sector}`;
  };

  const targetAppUrl = getSectorUrl(activeSector);

  const copyAppUrl = () => {
    navigator.clipboard.writeText(targetAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(targetAppUrl)}&color=064e3b&bgcolor=ffffff&qzone=1`;

  const SECTOR_INFO = {
    mango: {
      nameKh: 'កម្មវិធីស្វាយកែវរមៀត',
      nameEn: 'Mango Keo Romeat Pilot App',
      icon: '🥭',
      badge: 'Mango Pilot App',
      themeBg: 'from-amber-900 via-emerald-950 to-slate-900',
      accentColor: 'border-amber-400 bg-amber-500/10 text-amber-900',
      desc: 'កម្មវិធីកត់ត្រាចម្ការស្វាយកែវរមៀត ចំណាត់ថ្នាក់ផ្លែលេខ ១/២/៣ & QR Code Passport'
    },
    farmer: {
      nameKh: 'កម្មវិធីគ្រាប់ស្វាយចន្ទី',
      nameEn: 'Cashew Nut EUDR App',
      icon: '🥜',
      badge: 'Cashew EUDR App',
      themeBg: 'from-emerald-900 via-teal-950 to-slate-900',
      accentColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-900',
      desc: 'កម្មវិធីកត់ត្រាចម្ការស្វាយចន្ទី ៣០ហិកតា ស៊ីឡូត & EUDR Passport'
    },
    spices: {
      nameKh: 'កម្មវិធីម្រេច & គ្រឿងទេស',
      nameEn: 'Spices & GI Pepper App',
      icon: '🌶️',
      badge: 'GI Pepper App',
      themeBg: 'from-rose-950 via-slate-900 to-emerald-950',
      accentColor: 'border-rose-400 bg-rose-500/10 text-rose-900',
      desc: 'ប្រព័ន្ធតាមដានម្រេចកំពត PGI និងគ្រឿងទេសកសិ-រុក្ខជាតិ'
    },
    mayany: {
      nameKh: 'កម្មវិធីសហគ្រាស M\'day',
      nameEn: 'SME & Lactation App',
      icon: '🤱',
      badge: 'SME Hub App',
      themeBg: 'from-blue-950 via-slate-900 to-indigo-950',
      accentColor: 'border-blue-400 bg-blue-500/10 text-blue-900',
      desc: 'ប្រព័ន្ធគ្រប់គ្រងសហគ្រាស M\'day & ផលិតផលសុខភាព'
    },
    packaging: {
      nameKh: 'ស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល',
      nameEn: 'Digital Packaging Label',
      icon: '🏷️',
      badge: 'CS 001',
      themeBg: 'from-purple-950 via-slate-900 to-slate-950',
      accentColor: 'border-purple-400 bg-purple-500/10 text-purple-900',
      desc: 'ប្រព័ន្ធរចនាស្លាកវេចខ្ចប់ឌីជីថលតាមស្តង់ដារជាតិ MISTI CS 001'
    },
    all: {
      nameKh: 'ផ្ទាំងគ្រប់គ្រងរួមគ្រប់វិស័យ',
      nameEn: 'All Sectors Master Portal',
      icon: '🌐',
      badge: 'Master View',
      themeBg: 'from-emerald-900 via-teal-900 to-slate-900',
      accentColor: 'border-slate-400 bg-slate-500/10 text-slate-900',
      desc: 'ផ្ទាំងគ្រប់គ្រងបណ្តុំគ្រប់វិស័យកសិកម្ម និងសហគ្រាស'
    }
  };

  const currentInfo = SECTOR_INFO[activeSector] || SECTOR_INFO.mango;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-auto"
      >
        {/* MODAL HEADER */}
        <div className={`bg-gradient-to-r ${currentInfo.themeBg} text-white p-5 sm:p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shrink-0 flex items-center justify-center text-3xl">
              <span>{currentInfo.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full uppercase">
                  {currentInfo.badge}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                  100% ឥតគិតថ្លៃ (Free Install)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-1">
                {currentInfo.nameKh}
              </h2>
              <p className="text-xs text-emerald-200/90 font-sans mt-0.5">
                {currentInfo.nameEn}
              </p>
            </div>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* FOCUSED APP CARD (Direct target - no confusing options) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                កម្មវិធីដែលនឹងត្រូវដំឡើង (App to be installed):
              </span>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                <span>{currentInfo.icon}</span>
                <span>{currentInfo.nameKh}</span>
              </h4>
              <p className="text-xs text-slate-600 font-sans">
                {currentInfo.desc}
              </p>
            </div>
            <button
              onClick={copyAppUrl}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Copy Direct Link"
            >
              {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copiedLink ? 'បានចម្លង!' : 'ចម្លងលីង'}</span>
            </button>
          </div>

          {isStandalone ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3.5 text-emerald-900">
              <CheckCircle2 size={28} className="text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">កម្មវិធីត្រូវបានដំឡើងរួចរាល់ហើយ! (App is Installed)</h4>
                <p className="text-xs text-emerald-700 mt-0.5 font-sans">
                  លោកអ្នកកំពុងប្រើប្រាស់កម្មវិធីទូរស័ព្ទពេញលេញ (Standalone Mobile Mode)។ ទិន្នន័យទាំងអស់នឹងរក្សាទុកដោយស្វ័យប្រវត្តិ។
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Native 1-Tap Google Chrome Install Button (If available) */}
              {deferredPrompt && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-300 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider font-mono">1-Tap Quick Install</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Android / Chrome / iOS</span>
                  </div>
                  <p className="text-xs text-emerald-50 leading-relaxed font-sans">
                    ចុចប៊ូតុងតែមួយគត់ខាងក្រោមដើម្បីដំឡើង និងដាក់រូបតំណាង App លើអេក្រង់ដើមទូរស័ព្ទភ្លាមៗ៖
                  </p>
                  <button
                    onClick={handleNativeInstall}
                    disabled={isInstalling}
                    className="w-full bg-slate-950 hover:bg-black text-amber-300 hover:text-amber-200 font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                  >
                    <Download size={18} className={isInstalling ? 'animate-bounce' : ''} />
                    <span>{isInstalling ? 'កំពុងដំឡើង...' : `📲 ដំឡើង & បន្ថែមទៅអេក្រង់ដើម (Install & Add to Home Screen)`}</span>
                  </button>
                </div>
              )}

              {/* OS / BROWSER TABS */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold font-sans">
                <button
                  onClick={() => setActiveDeviceTab('chrome_android')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeDeviceTab === 'chrome_android'
                      ? 'bg-white text-emerald-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe size={15} className="text-emerald-600" />
                  <span>Google Chrome / Android</span>
                </button>
                <button
                  onClick={() => setActiveDeviceTab('ios_safari')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeDeviceTab === 'ios_safari'
                      ? 'bg-white text-emerald-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone size={15} className="text-blue-600" />
                  <span>iPhone / Safari</span>
                </button>
                <button
                  onClick={() => setActiveDeviceTab('qr_scan')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeDeviceTab === 'qr_scan'
                      ? 'bg-white text-emerald-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode size={15} className="text-slate-700" />
                  <span>ស្កេន QR ពីកុំព្យូទ័រ</span>
                </button>
              </div>

              {/* TAB 1: GOOGLE CHROME / ANDROID */}
              {activeDeviceTab === 'chrome_android' && (
                <div className="space-y-4">
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                    <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-2">
                      <span>🇰🇭 របៀបដំឡើង & បន្ថែមទៅអេក្រង់ដើម (ងាយស្រួល ២ ជំហាន)</span>
                    </h3>
                    <p className="text-xs text-amber-900/90 font-sans mt-1">
                      សម្រាប់ទូរស័ព្ទ Android (Samsung, Oppo, Vivo, Xiaomi, Realme, etc.)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* STEP 1 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          1
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          ចុចលើសញ្ញាចុចបី (⋮) នៅលើ Chrome
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                        មើលទៅជ្រុងខាងលើស្តាំដៃបំផុតនៃ Chrome រួចចុចលើសញ្ញាចុចបី <strong>(More Menu ⋮)</strong>
                      </p>
                      <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                        <span className="font-mono text-[11px]">Chrome Menu</span>
                        <span className="px-2 py-1 bg-slate-100 rounded font-bold flex items-center gap-1 text-emerald-800">
                          <MoreVertical size={13} />
                          <span>ចុចត្រង់នេះ</span>
                        </span>
                      </div>
                    </div>

                    {/* STEP 2 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          2
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          ជ្រើសរើស «ដំឡើង & បន្ថែមទៅអេក្រង់ដើម»
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                        ចុចយកជម្រើស <strong>"Install app"</strong> ឬ <strong>"Add to Home screen" (ដំឡើង & បន្ថែមទៅអេក្រង់ដើម)</strong>
                      </p>
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-950">
                        <Download size={14} className="text-emerald-600" />
                        <span>ដំឡើង & បន្ថែមទៅអេក្រង់ដើម (Install & Add to Home Screen)</span>
                      </div>
                    </div>
                  </div>

                  {/* Troubleshooting Tip */}
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-3.5 text-xs flex items-start gap-2.5">
                    <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block text-emerald-950">💡 ដំណោះស្រាយប្រសិនបើធ្លាប់បង្ហាញថា «App not yet installed»៖</span>
                      <p className="text-[11px] text-emerald-800 font-sans leading-relaxed">
                        សូមចុចសង្កត់លើរូបតំណាងចាស់លើអេក្រង់ទូរស័ព្ទដើម្បី Remove/លុបចេញ រួចបើកតំណភ្ជាប់នេះឡើងវិញ ហើយចុច <strong>«ដំឡើង & បន្ថែមទៅអេក្រង់ដើម»</strong> ម្តងទៀត។ App នឹងដំណើរការយ៉ាងរលូន 100%!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: IPHONE / SAFARI */}
              {activeDeviceTab === 'ios_safari' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4">
                    <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wide flex items-center gap-2">
                      <span>🍎 របៀបដំឡើងលើ iPhone / Safari ឬ Chrome iOS</span>
                    </h3>
                    <p className="text-xs text-blue-900/90 font-sans mt-1">
                      សម្រាប់អ្នកប្រើប្រាស់ iPhone, iPad ឬ Apple Safari
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          1
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          ចុចប៊ូតុង Share (ចែករំលែក ⎋)
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                        នៅផ្នែកខាងក្រោមនៃអេក្រង់ Safari ចុចលើសញ្ញាព្រួញចង្អុលឡើងលើ <strong>(Share Icon ⎋)</strong>
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          2
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          ចុច «ដំឡើង & បន្ថែមទៅអេក្រង់ដើម»
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                        រំកិលចុះក្រោមបន្តិច រួចចុចយកពាក្យ <strong>«Add to Home Screen» (ដំឡើង & បន្ថែមទៅអេក្រង់ដើម [+])</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: QR CODE SCANNER */}
              {activeDeviceTab === 'qr_scan' && (
                <div className="space-y-4 text-center">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
                    <div className="p-3 bg-white rounded-2xl border-2 border-emerald-500 shadow-md">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code for Mobile Install" 
                        className="w-48 h-48 rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        ស្កេន QR Code ដើម្បីបើក {currentInfo.nameKh}
                      </h4>
                      <p className="text-xs text-slate-500 font-sans mt-1 max-w-sm">
                        បាញ់កាមេរ៉ាទូរស័ព្ទលើ QR Code ខាងលើនេះ ដើម្បីបើកកម្មវិធីលើទូរស័ព្ទដោយផ្ទាល់ រួចចុច Install ភ្លាម!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={copyAppUrl}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedLink ? 'បានចម្លងតំណភ្ជាប់ (Copied)' : 'ចម្លងតំណភ្ជាប់ (Copy App URL)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* HIGHLIGHTED BENEFITS */}
          <div className="pt-4 border-t border-slate-150 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
              <Shield size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-emerald-950 block">ប្រើបានទោះគ្មានអ៊ីនធឺណិត</span>
                <span className="text-[10px] text-slate-600 font-sans">Offline Local Logging for remote farms</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100/60">
              <Sparkles size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-amber-950 block">ទំហំតូច & មិនស៊ីមេម៉ូរី</span>
                <span className="text-[10px] text-slate-600 font-sans">Instant load, &lt; 2MB lightweight PWA</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/60">
              <Smartphone size={16} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-blue-950 block">មិនបាច់ចូលតាម Browser ទៀតទេ</span>
                <span className="text-[10px] text-slate-600 font-sans">Direct icon on mobile home screen</span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-sans text-[11px]">
            Mayany Enterprise & CashewTrace Cambodia • Silot Certified
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all cursor-pointer"
          >
            បិទ (Close)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
