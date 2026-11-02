import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, X, Sparkles, QrCode } from 'lucide-react';

interface InstallAppBannerProps {
  onOpenModal: () => void;
  deferredPrompt: any;
  onNativeInstall?: () => void;
}

export default function InstallAppBanner({ onOpenModal, deferredPrompt, onNativeInstall }: InstallAppBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('cashewtrace_install_banner_dismissed') === 'true';
    }
    return false;
  });
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone === true ||
             localStorage.getItem('cashewtrace_app_installed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true ||
                  localStorage.getItem('cashewtrace_app_installed') === 'true';
    setIsStandalone(isPWA);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cashewtrace_install_banner_dismissed', 'true');
    }
  };

  const handleAction = () => {
    if (deferredPrompt && onNativeInstall) {
      onNativeInstall();
    } else {
      onOpenModal();
    }
  };

  // If already standalone PWA or user dismissed it, don't show the sticky banner
  if (isStandalone || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-b border-emerald-500/30 px-3 py-2 sm:px-6 relative z-30 shadow-md no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center p-0.5 shrink-0 shadow-xs">
            <img src="/icon.svg" alt="App" className="w-5 h-5 rounded" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="truncate">
            <span className="font-bold text-amber-300">📲 ដាក់ App លើទូរស័ព្ទដៃ</span>
            <span className="text-slate-300 hidden md:inline font-sans ml-1.5">
              (Install CashewTrace App on Android / Chrome & iOS in 1 Click)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAction}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download size={13} />
            <span>{deferredPrompt ? 'ដំឡើង & បន្ថែមទៅអេក្រង់ដើម' : 'ដំឡើង & បន្ថែមទៅអេក្រង់ដើម (Install)'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
