import React from 'react';
import { X, Smartphone, ArrowRight, Share, PlusSquare, Download, Check, Send, Zap, ExternalLink } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { shareToTelegram, PUBLIC_APP_URL, isRunningInTelegram, triggerTelegramHaptic } from '../utils/telegram';

interface InstallHomeScreenGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  onOpenTelegramModal?: () => void;
}

export const InstallHomeScreenGateway: React.FC<InstallHomeScreenGatewayProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenTelegramModal,
}) => {
  if (!isOpen) return null;

  const isKm = lang === 'km';
  const inTelegram = isRunningInTelegram();

  const handleShareTelegram = () => {
    triggerTelegramHaptic('medium');
    shareToTelegram(
      isKm 
        ? 'សាកល្បង MyDailyPA លើ Telegram Mini App (Zero Install មិនបាច់ដំឡើង):'
        : 'Try MyDailyPA on Telegram Mini App (Zero Installation on iOS & Android):'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-[calc(100vw-16px)] sm:max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-4 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
              📲
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isKm ? 'ជម្រើសប្រើប្រាស់ទូរស័ព្ទ (Mobile Access)' : 'Mobile Access & Installation'}
              </h3>
              <p className="text-xs text-slate-500">
                {isKm ? 'ដោះស្រាយបញ្ហាដំឡើងលើ iPhone និង Android' : 'Resolves installation hurdles on iOS and Android'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP RECOMMENDED: TELEGRAM MINI APP (Zero Install) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-300 text-slate-900 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-black text-sky-900">
              <Send className="w-4 h-4 text-sky-600 fill-current -rotate-12 translate-x-0.5" />
              <span>{isKm ? 'ជម្រើសទី ១ (ណែនាំដោយ Mentors): Telegram Mini App' : 'Option 1 (Recommended by Mentors): Telegram Mini App'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-600 text-white shadow-2xs">
              Zero Install ⚡
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {isKm 
              ? 'មិនបាច់រកប៊ូតុង Share ឬ 3-Dots! បើកដំណើរការភ្លាមៗក្នុង Telegram (iOS & Android) ជាមួយ Haptic Feedback និង Fullscreen ពេញលេញ!'
              : 'Zero installation! No searching for Safari Share or Chrome menus. Runs instantly inside Telegram on both iOS & Android with native haptics.'}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleShareTelegram}
              className="flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-current -rotate-12" />
              <span>{isKm ? 'ផ្ញើទៅ Telegram Chat' : 'Share to Telegram'}</span>
            </button>

            {onOpenTelegramModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTelegramModal();
                }}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-sky-200 text-sky-800 font-black text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>{isKm ? 'ការណែនាំ BotFather' : 'Bot Setup Guide'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Traditional PWA Install Options */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isKm ? 'ជម្រើសទី ២៖ ដំឡើងលើ Home Screen (PWA)' : 'Option 2: Add to Home Screen (PWA)'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* iPhone Safari */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <span className="text-base">🍎</span>
                <span>{isKm ? 'iPhone (Safari)' : 'iPhone (Safari)'}</span>
              </div>
              <ol className="text-[11px] text-slate-600 space-y-1 list-decimal pl-4 leading-relaxed">
                <li>បើកតំណភ្ជាប់ក្នុង <strong>Safari</strong></li>
                <li>ចុចប៊ូតុង <strong>Share</strong> (<Share className="w-2.5 h-2.5 inline text-sky-600" />)</li>
                <li>រើស <strong>"Add to Home Screen"</strong> (➕)</li>
                <li>ចុច <strong>"Add"</strong> ជាការស្រេច!</li>
              </ol>
            </div>

            {/* Android Chrome */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <span className="text-base">🤖</span>
                <span>{isKm ? 'Android (Chrome)' : 'Android (Chrome)'}</span>
              </div>
              <ol className="text-[11px] text-slate-600 space-y-1 list-decimal pl-4 leading-relaxed">
                <li>បើកតំណភ្ជាប់ក្នុង <strong>Chrome</strong></li>
                <li>ចុចសញ្ញាចុចបី <strong>[ ⋮ ]</strong> នៅជ្រុងស្តាំ</li>
                <li>រើស <strong>"Install App"</strong></li>
                <li>ចុច <strong>"Install"</strong> រួចរាល់!</li>
              </ol>
            </div>

          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer"
          >
            {isKm ? 'យល់ព្រម (Done)' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
