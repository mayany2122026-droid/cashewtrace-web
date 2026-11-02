import { useState } from 'react';
import { SupportedLanguage } from '../types';
import { speakText } from '../utils/speech';
import { 
  shareAppUniversally, 
  detectPlatformEnvironment,
  SHARE_INVITE_MESSAGES 
} from '../utils/socialShare';
import { PUBLIC_APP_URL } from '../utils/telegram';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Volume2, 
  Globe2, 
  Send, 
  MessageCircle, 
  Mail,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const ShareAppModal = ({ isOpen, onClose, lang }: ShareAppModalProps) => {
  const [copied, setCopied] = useState(false);
  const platform = detectPlatformEnvironment();

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      const text = `${SHARE_INVITE_MESSAGES[lang] || SHARE_INVITE_MESSAGES.en}\n${PUBLIC_APP_URL}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
    }
  };

  const speakExplanation = () => {
    const speechExplanations: Record<string, string> = {
      km: 'អ្នកអាចផ្ញើតំណភ្ជាប់ MyDailyPA ទៅកាន់មិត្តភក្តិរបស់អ្នកតាមរយៈ Facebook Messenger, Telegram, WhatsApp ឬកម្មវិធីរុករកណាក៏បាន។ មិត្តភក្តិរបស់អ្នកមិនបាច់ដំឡើងអ្វីទាំងអស់ គ្រាន់តែចុចលើតំណភ្ជាប់គឺអាចប្រើប្រាស់សំឡេងបាន ១០០ ភាគរយដូចគ្នា!',
      en: 'You can send the MyDailyPA link to friends on Facebook Messenger, Telegram, WhatsApp, or any browser. They do not need to install anything from an app store; simply tap the link to use full voice features in all languages!',
      vi: 'Bạn có thể gửi liên kết MyDailyPA cho bạn bè qua Facebook Messenger, Telegram, WhatsApp hoặc bất kỳ trình duyệt nào. Bạn bè không cần cài đặt gì cả, chỉ cần bấm vào liên kết là dùng được giọng nói 100% ngay lập tức!',
      th: 'คุณสามารถส่งลิงก์ MyDailyPA ให้เพื่อนๆ ผ่าน Facebook Messenger, Telegram, WhatsApp หรือเบราว์เซอร์ใดก็ได้ค่ะ เพื่อนไม่ต้องติดตั้งแอปใดๆ เพียงกดลิงก์ก็สามารถใช้งานเสียงได้ 100% ทันทีค่ะ!',
      id: 'Anda dapat membagikan tautan MyDailyPA ke teman-teman di Facebook Messenger, Telegram, WhatsApp, atau peramban apa pun tanpa perlu menginstal aplikasi!',
      ms: 'Anda boleh berkongsi pautan MyDailyPA kepada rakan-rakan di Facebook Messenger, Telegram, WhatsApp atau mana-mana pelayar tanpa perlu memasang aplikasi!',
      sg: 'Share MyDailyPA on Facebook Messenger, Telegram, WhatsApp, or any browser with zero installation needed!',
      bn: 'Kongsi pautan MyDailyPA kepada rakan di Messenger atau Telegram tanpa perlu memasang aplikasi.',
      fil: 'Maaari mong ibahagi ang link ng MyDailyPA sa Facebook Messenger, Telegram, WhatsApp, o anumang browser nang hindi kailangang mag-install!',
      lo: 'ທ່ານສາມາດສົ່ງລິ້ງ MyDailyPA ໃຫ້ໝູ່ເພື່ອນຜ່ານ Facebook Messenger, Telegram, WhatsApp ຫຼື browser ໃດກໍໄດ້ ໂດຍບໍ່ຕ້ອງຕິດຕັ້ງແອັບເລີຍ!',
      my: 'MyDailyPA လင့်ခ်ကို Facebook Messenger, Telegram, WhatsApp သို့မဟုတ် မည်သည့်ဘရောက်ဇာတွင်မဆို သူငယ်ချင်းများထံ ပေးပို့နိုင်ပါသည်။ အက်ပ်ဒေါင်းလုဒ်လုပ်ရန် မလိုဘဲ အသံဖြင့် တိုက်ရိုက် အသုံးပြုနိုင်ပါသည်။',
      zh: '您可以将 MyDailyPA 链接分享给 Facebook Messenger、Telegram、WhatsApp 或任意浏览器上的朋友。对方无需下载安装任何 App，点击即可立即使用全功能语音助手！',
      ko: 'Facebook Messenger, Telegram, WhatsApp 또는 모든 웹 브라우저를 통해 친구들에게 MyDailyPA를 공유할 수 있습니다. 앱 설치 없이 링크 클릭만으로 모든 음성 기능을 즉시 사용 가능합니다!',
      fr: 'Partagez MyDailyPA sur Facebook Messenger, Telegram, WhatsApp ou tout navigateur. Aucune installation requise, vos amis accèdent immédiatement aux fonctions vocales !',
      de: 'Teilen Sie MyDailyPA über Facebook Messenger, Telegram, WhatsApp oder jeden Browser. Keine Installation nötig, sofort mit voller Sprachsteuerung nutzbar!',
      es: 'Puedes enviar el enlace de MyDailyPA a tus amigos por Facebook Messenger, Telegram, WhatsApp o cualquier navegador sin necesidad de instalar nada.',
      it: 'Condividi MyDailyPA su Facebook Messenger, Telegram, WhatsApp o qualsiasi browser. Nessuna installazione richiesta, subito attivo con comandi vocali!',
      nl: 'Deel MyDailyPA via Facebook Messenger, Telegram, WhatsApp of elke browser zonder installatie. Direct te bedienen met de stem!',
      pt: 'Compartilhe o MyDailyPA no Facebook Messenger, Telegram, WhatsApp ou qualquer navegador sem instalar nada. Funciona 100% por voz!',
    };
    speakText(speechExplanations[lang] || speechExplanations.en, lang, { playChime: true });
  };

  return (
    <div 
      id="share-app-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        id="share-app-modal-card"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-6 text-white relative">
          <button 
            id="share-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {lang === 'km' ? 'ចែករំលែកទៅកាន់មិត្តភក្តិ' : 'Share with Friends Globally'}
              </h2>
              <p className="text-blue-100 text-xs mt-0.5">
                {lang === 'km' ? 'ដំណើរការលើ Facebook Messenger, Telegram & Web' : 'Works on Messenger, Telegram & Any Browser'}
              </p>
            </div>
          </div>

          {/* Voice Guidance Button */}
          <button
            id="share-modal-speak-btn"
            onClick={speakExplanation}
            className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/25 hover:bg-white/35 text-white text-xs font-semibold backdrop-blur-sm transition-all border border-white/30"
          >
            <Volume2 className="w-4 h-4 animate-pulse text-amber-300" />
            <span>{lang === 'km' ? 'ស្តាប់ការពន្យល់ជាសំឡេង' : 'Listen to Voice Guide'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-700">
          {/* Current Environment Notice */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-slate-700">
                {platform === 'facebook_messenger' && 'Detected: Facebook Messenger In-App Browser'}
                {platform === 'telegram' && 'Detected: Telegram Mini App'}
                {platform === 'browser' && 'Detected: Standalone Web / PWA'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-600" /> 100% Voice Ready
            </span>
          </div>

          {/* Core Explanation for Facebook Messenger vs Telegram */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs leading-relaxed text-blue-900 space-y-2">
            <p className="font-semibold text-blue-950 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-blue-600" />
              {lang === 'km' 
                ? 'តើមិត្តភក្តិដែលប្រើ Facebook Messenger អាចប្រើបានដូចគ្នាទេ?' 
                : 'Will it work the same on Facebook Messenger?'}
            </p>
            <p>
              {lang === 'km'
                ? 'បាទ! MyDailyPA ដំណើរការយ៉ាងរលូន ១០០ ភាគរយនៅក្នុង Facebook Messenger In-App Browser។ មិត្តភក្តិគ្រាន់តែចុចលើតំណភ្ជាប់ នោះកម្មវិធីនឹងបើកភ្លាមៗដោយមិនបាច់ដំឡើងពី App Store ឬ Play Store ឡើយ។ មុខងារសំឡេងទាំង ១៩ ភាសា ដំណើរការដូចគ្នាបេះបិទ!'
                : 'YES! MyDailyPA works seamlessly inside Facebook Messenger. When friends tap the link in Messenger, it opens instantly in their in-app browser with zero installation needed. All voice recording, evening recaps, reminders, and 19 languages work 100% identically!'}
            </p>
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'km' ? 'ជ្រើសរើសបណ្តាញចែករំលែក' : 'Direct Share Channels'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Facebook Messenger */}
              <button
                id="share-to-messenger-btn"
                onClick={() => shareAppUniversally(lang, 'messenger')}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span className="truncate">Messenger</span>
              </button>

              {/* Telegram */}
              <button
                id="share-to-telegram-btn"
                onClick={() => shareAppUniversally(lang, 'telegram')}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs shadow-sm transition-all"
              >
                <Send className="w-4 h-4 fill-white shrink-0" />
                <span className="truncate">Telegram</span>
              </button>

              {/* WhatsApp */}
              <button
                id="share-to-whatsapp-btn"
                onClick={() => shareAppUniversally(lang, 'whatsapp')}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span className="truncate">WhatsApp</span>
              </button>

              {/* Email */}
              <button
                id="share-to-email-btn"
                onClick={() => shareAppUniversally(lang, 'email')}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-700 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-all"
              >
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">Email</span>
              </button>
            </div>
          </div>

          {/* Copy Direct Link Section */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {lang === 'km' ? 'ចម្លងតំណភ្ជាប់ផ្ទាល់' : 'Copy Direct App Link'}
            </p>
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <input 
                id="share-url-input"
                type="text"
                readOnly
                value={PUBLIC_APP_URL}
                className="flex-1 bg-transparent px-3 text-xs text-slate-600 font-mono focus:outline-none select-all truncate"
              />
              <button
                id="share-copy-link-btn"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-sm shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (lang === 'km' ? 'បានចម្លង!' : 'Copied!') : (lang === 'km' ? 'ចម្លង' : 'Copy')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            {lang === 'km' ? 'ឥតគិតថ្លៃ ៣០០ កំណត់ត្រា ឬ ៦០ ថ្ងៃដំបូង' : 'Free: 300 voice entries or 60 days'}
          </p>
          <button
            id="share-modal-done-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
          >
            {lang === 'km' ? 'រួចរាល់' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
