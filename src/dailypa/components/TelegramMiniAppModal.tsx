import React, { useState } from 'react';
import { 
  X, Send, Copy, Check, ExternalLink, Bot, Sparkles, 
  CheckCircle2, ShieldCheck, Zap, Smartphone, Globe, MessageCircle, AlertCircle, Compass
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { 
  getCleanPublicAppUrl, 
  isRunningInTelegram, 
  isTelegramInAppBrowser,
  openInExternalBrowser,
  getTelegramUser, 
  shareToTelegram, 
  openTelegramLink,
  triggerTelegramHaptic 
} from '../utils/telegram';

interface TelegramMiniAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const TelegramMiniAppModal: React.FC<TelegramMiniAppModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBotUrl, setCopiedBotUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'botfather' | 'help'>('quick');

  if (!isOpen) return null;

  const isKm = lang === 'km';
  const inTelegram = isRunningInTelegram();
  const inTgBrowser = isTelegramInAppBrowser();
  const tgUser = getTelegramUser();
  const currentAppUrl = getCleanPublicAppUrl('dailypa');

  const handleCopyPublicUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedLink(true);
    triggerTelegramHaptic('success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareTelegram = () => {
    triggerTelegramHaptic('medium');
    shareToTelegram(
      isKm 
        ? 'សាកល្បង MyDailyPA (Voice-First AI Assistant) លើ Telegram Mini App មិនបាច់ Install មិនបាច់ Add to Home Screen:'
        : 'Try MyDailyPA Voice-First AI Assistant on Telegram Mini App (Zero install, native on iOS & Android):',
      'dailypa'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <Send className="w-6 h-6 fill-current -rotate-12 translate-x-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {isKm ? 'Telegram Mini App (TMA)' : 'Telegram Mini App (TMA)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-200">
                  Zero Install ⚡
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isKm 
                  ? 'ដំណោះស្រាយដំបូន្មានពី Digital Mentors៖ គ្មានបញ្ហាដំឡើងលើ iOS និង Android!' 
                  : 'Recommended by Digital Mentors: Resolves all Add-to-Home-Screen hurdles!'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Environment Status Banner */}
        {inTelegram ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <p className="font-black">
                {isKm ? '✅ កំពុងដំណើរការក្នុង Telegram Mini App រួចរាល់!' : '✅ Running natively inside Telegram Mini App!'}
              </p>
              <p className="text-emerald-700 mt-0.5">
                {tgUser ? `Telegram User: ${tgUser.first_name} (@${tgUser.username || 'user'})` : 'Haptics & full-screen enabled'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black flex items-center gap-1.5 text-sky-900">
                <Zap className="w-4 h-4 text-sky-600 fill-current" />
                {isKm ? 'ហេតុអ្វីបានជាត្រូវប្រើ Telegram Mini App?' : 'Why use Telegram Mini App?'}
              </span>
              <span className="text-[10px] font-bold text-sky-600 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                100% Instant
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isKm 
                ? 'អ្នកប្រើប្រាស់ កសិករ និងអាជីវករ មិនបាច់ស្វែងរកប៊ូតុង Share លើ iPhone Safari ឬចុច 3-dots លើ Android Chrome ទៀតឡើយ។ គ្រាន់តែចុច Link ក្នុង Telegram គឺ App បើកដំណើរការពេញអេក្រង់ភ្លាមៗ!'
                : 'Users, farmers, and mentors do not need to hunt for iOS Safari "Share > Add to Home Screen" or Android 3-dot menus. One tap inside Telegram opens the full app natively!'}
            </p>
          </div>
        )}

        {/* Tab Switcher: 1-Click Launch vs BotFather Setup vs Help */}
        <div className="flex rounded-2xl bg-slate-100 p-1 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-sky-500" />
            <span>{isKm ? '១. ចុចបើក / ចែករំលែក' : '1. Launch & Share'}</span>
          </button>

          <button
            onClick={() => setActiveTab('botfather')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'botfather'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isKm ? '២. បង្កើត Bot' : '2. Setup Bot'}</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'help'
                ? 'bg-amber-100 text-amber-950 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isKm ? '៣. ដោះស្រាយ "Save as PDF"' : '3. Fix "Save as PDF"'}</span>
          </button>
        </div>

        {/* TAB 1: QUICK LAUNCH & SHARING */}
        {activeTab === 'quick' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Share directly into Telegram */}
              <button
                type="button"
                onClick={handleShareTelegram}
                className="p-3.5 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs flex flex-col items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer text-center"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Send className="w-4 h-4 fill-current -rotate-12 translate-x-0.5" />
                </div>
                <span>{isKm ? 'ផ្ញើទៅកាន់ Telegram' : 'Share to Telegram'}</span>
                <span className="text-[10px] font-normal text-sky-100 line-clamp-1">
                  {isKm ? 'ចែករំលែកចូល Chat / Group' : 'Opens chat picker'}
                </span>
              </button>

              {/* Open in external Chrome/Safari */}
              <button
                type="button"
                onClick={() => openInExternalBrowser(currentAppUrl)}
                className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex flex-col items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-center"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <span>{isKm ? 'បើកលើ Chrome / Safari' : 'Open in Chrome/Safari'}</span>
                <span className="text-[10px] font-normal text-emerald-100 line-clamp-1">
                  {isKm ? 'ប្រើ Voice Mic បាន ១០០%' : '100% Native Voice Mic'}
                </span>
              </button>

              {/* Copy App Link */}
              <button
                type="button"
                onClick={handleCopyPublicUrl}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-black text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer text-center"
              >
                <div className="w-9 h-9 rounded-full bg-slate-200/70 text-slate-700 flex items-center justify-center">
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </div>
                <span>{copiedLink ? (isKm ? 'បានចម្លងរួចរាល់!' : 'Copied Link!') : (isKm ? 'ចម្លង Link សាធារណៈ' : 'Copy Clean Link')}</span>
                <span className="text-[10px] font-normal text-slate-500 truncate max-w-[130px]">
                  {currentAppUrl.replace('https://', '')}
                </span>
              </button>

            </div>

            {/* Feature Checklist for Mentors */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {isKm ? 'លក្ខណៈពិសេសរបស់ Telegram Mini App លើ DailyPA:' : 'TMA Features in DailyPA:'}
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Zero Installation:</strong> {isKm ? 'មិនបាច់ដំឡើង App ពី App Store/Play Store ឬ Save to Home Screen' : 'Runs inside Telegram on iOS, Android, and Desktop'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Native Haptic Feedback:</strong> {isKm ? 'រំញ័រទូរស័ព្ទជាក់ស្ដែងពេលចុច Record សំឡេង ឬកត់ត្រាទិន្នន័យ' : 'Physical phone vibrations on mic record and button taps'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Instant Fullscreen:</strong> {isKm ? 'ពង្រីកពេញអេក្រង់ទូរស័ព្ទ (Full Viewport) ដោយស្វ័យប្រវត្តិ' : 'Auto-expands to full screen with clean Telegram header'}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: BOTFATHER STEP-BY-STEP SETUP */}
        {activeTab === 'botfather' && (
          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs">
              <p className="font-bold flex items-center gap-1">
                <Bot className="w-4 h-4 text-indigo-600" />
                {isKm ? 'របៀបភ្ជាប់ Bot ជាមួយ @BotFather ក្នុង ២ នាទី:' : '2-Minute Setup with @BotFather:'}
              </p>
              <p className="text-slate-600 mt-1">
                {isKm 
                  ? 'អ្នកអាចបង្កើត Telegram Bot ផ្ទាល់ខ្លួន ដើម្បីឱ្យ Mentors ឬអតិថិជនចុចបើក App ពីក្នុង Telegram Bot បានភ្លាមៗ៖' 
                  : 'Create a custom Telegram Bot so users and mentors can launch DailyPA directly via the bot menu button:'}
              </p>
            </div>

            <ol className="text-xs text-slate-700 space-y-2.5 list-decimal pl-5">
              <li>
                {isKm ? 'បើកកម្មវិធី Telegram ហើយស្វែងរក ' : 'Open Telegram and search for '}
                <button
                  type="button"
                  onClick={() => openTelegramLink('https://t.me/BotFather')}
                  className="font-black text-sky-600 hover:underline inline-flex items-center gap-0.5"
                >
                  @BotFather <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </li>
              <li>
                {isKm ? 'ផ្ញើពាក្យ ' : 'Send command '}
                <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">/newbot</code>
                {isKm ? ' ហើយដាក់ឈ្មោះ Bot (ឧ. ' : ' and choose a name (e.g. '}
                <strong>MyDailyPABot</strong>)
              </li>
              <li>
                {isKm ? 'ផ្ញើពាក្យ ' : 'Send command '}
                <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">/newapp</code>
                {isKm ? ' រួចរើស Bot របស់អ្នក និងដាក់ឈ្មោះ App' : ' to link your Web App'}
              </li>
              <li>
                {isKm ? 'នៅពេល BotFather សួររក Web App URL សូមបិទភ្ជាប់ (Paste) តំណភ្ជាប់នេះ៖' : 'When BotFather asks for the Web App URL, paste this URL:'}
                <div className="mt-1.5 flex items-center gap-2 p-2 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="font-mono text-[11px] text-slate-800 break-all flex-1">
                    {currentAppUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPublicUrl}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 shrink-0 border border-slate-200 cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-sky-600" />}
                  </button>
                </div>
              </li>
              <li>
                {isKm ? 'ផ្ញើពាក្យ ' : 'Send command '}
                <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">/setmenubutton</code>
                {isKm 
                  ? ' ដើម្បីកំណត់ឱ្យប៊ូតុង Menu ក្នុង Bot បើក App នេះភ្លាមៗជាការស្រេច!' 
                  : ' to set the bot menu button to launch your DailyPA app with one tap!'}
              </li>
              <li>
                {isKm ? 'កំណត់រូបភាព Profile Bot ដោយផ្ញើពាក្យ ' : 'Set Bot Profile Picture by sending command '}
                <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">/setuserpic</code>
                {isKm ? ' រួចផ្ញើរូបភាពផ្លូវការរបស់ MyDailyPA នេះ៖' : ' and upload this official MyDailyPA avatar:'}
                <div className="mt-2 p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/mydailypa_bot_avatar.jpg" 
                      alt="MyDailyPA Bot Avatar" 
                      className="w-12 h-12 rounded-full border-2 border-rose-500 shadow-md object-cover" 
                    />
                    <div>
                      <p className="text-xs font-black text-white">MyDailyPA Official Avatar</p>
                      <p className="text-[10px] text-slate-400">High-res 512x512 circular profile</p>
                    </div>
                  </div>
                  <a
                    href="/mydailypa_bot_avatar.jpg"
                    download="mydailypa_bot_avatar.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span>Download</span>
                  </a>
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* TAB 3: RESOLVING SAVE AS PDF / TELEGRAM IN-APP BROWSER ISSUES */}
        {activeTab === 'help' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-black">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{isKm ? 'មូលហេតុដែល Telegram លោតចេញ "Save as PDF":' : 'Why does Telegram prompt "Save as PDF"?'}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {isKm 
                  ? 'នៅលើទូរស័ព្ទ Android/iOS នៅពេលអ្នកចុចតំណភ្ជាប់ក្នុង Telegram កម្មវិធី Telegram អាចនឹងបើកតាម Webview របស់វា ឬប្រព័ន្ធ Android បញ្ជូនវាទៅកាន់ Print Spooler / PDF Viewer ("Save as PDF") ដោយសារតែច្រឡំជាមួយ File ឯកសារ (ដូចជាស្លាយ ឬលិខិត)។'
                  : 'On mobile devices, clicking an external link inside Telegram may open in Telegram\'s built-in webview, or Android may delegate it to the Print Spooler / Drive PDF Viewer ("Save as PDF") if the link was confused with a document file (like pitch deck or declaration letter).'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {isKm ? 'វិធីដោះស្រាយ ២ ជំហានងាយៗ៖' : '2 Easy Steps to Fix & Run Smoothly:'}
              </h4>
              
              <div className="space-y-2 text-slate-700">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <p className="font-bold text-slate-900">
                    {isKm ? 'វិធីទី ១ (លឿនបំផុត)៖ បើកលើ Chrome ឬ Safari ដោយផ្ទាល់' : 'Method 1 (Fastest): Open in Chrome or Safari directly'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {isKm 
                      ? 'ចុចប៊ូតុងខាងក្រោមនេះ ដើម្បីបើកក្នុងកម្មវិធី Browser ធម្មតា ដែលគាំទ្រមីក្រូហ្វូនសំឡេង ១០០% និងគ្មានបញ្ហា PDF ឡើយ៖'
                      : 'Tap the button below to launch in your device browser with full microphone support and zero PDF prompts:'}
                  </p>
                  <button
                    type="button"
                    onClick={() => openInExternalBrowser(currentAppUrl)}
                    className="mt-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{isKm ? 'បើកដំណើរការ MyDailyPA លើ Browser' : 'Open MyDailyPA in Browser'}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <p className="font-bold text-slate-900">
                    {isKm ? 'វិធីទី ២៖ ចុចសញ្ញាចុច ៣ (⋮) ក្នុង Telegram' : 'Method 2: Tap the 3 dots (⋮) inside Telegram'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {isKm 
                      ? 'ប្រសិនបើអ្នកកំពុងមើលក្នុង Telegram សូមចុចសញ្ញាចុច ៣ (⋮) នៅជ្រុងខាងស្ដាំខាងលើ ហើយជ្រើសរើស "Open in Chrome" (លើ Android) ឬ "Open in Safari" (លើ iPhone)។'
                      : 'If you are currently inside Telegram\'s in-app screen, tap the 3-dots menu (⋮) at the top-right corner and select "Open in Chrome" (Android) or "Open in Safari" (iPhone).'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <p className="font-bold text-slate-900">
                    {isKm ? 'វិធីទី ៣៖ ប្រើប្រាស់តំណភ្ជាប់ស្អាត (?app=dailypa)' : 'Method 3: Ensure Clean Link (?app=dailypa)'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {isKm 
                      ? 'ជៀសវាងចុចតំណភ្ជាប់ដែលបញ្ចប់ដោយ .html។ សូមប្រើតំណភ្ជាប់ដើម៖'
                      : 'Avoid clicking links ending in .html. Use the clean live URL:'}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 p-2 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px]">
                    <span className="truncate flex-1">{currentAppUrl}</span>
                    <button
                      type="button"
                      onClick={handleCopyPublicUrl}
                      className="px-2 py-1 rounded bg-white text-slate-800 border border-slate-200 font-sans text-xs font-bold"
                    >
                      {copiedLink ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TMA Ready (SDK v7.10+)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {isKm ? 'យល់ព្រម (Close)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
