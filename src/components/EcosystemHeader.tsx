import React, { useState } from 'react';
import { 
  Layers, ChevronDown, User, Phone, LogOut, 
  Home, Sparkles, ShieldCheck, Check, Lock, BookOpen,
  Facebook, Globe, ShoppingBag, Download
} from 'lucide-react';
import CashewTraceLogo, { CashewTraceIcon } from './CashewTraceLogo';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../lib/LanguageContext';
import { UserProfile } from './ProjectSignInModal';

export interface ProjectOption {
  id: string;
  titleKhmer: string;
  titleEnglish: string;
  shortKhmer: string;
  shortEnglish: string;
  icon: string;
  badgeKhmer: string;
  badgeEnglish: string;
  badgeColor: string;
  requiresSignIn: boolean;
  hidden?: boolean;
}

export const ALL_PROJECTS: ProjectOption[] = [
  {
    id: 'store',
    titleKhmer: '🛍️ ហាងទំនិញ & កុម្ម៉ង់ទិញ Mayany Enterprise (ទំព័រដើមចម្បង)',
    titleEnglish: '🛍️ Mayany Enterprise Official Store & Order Desk (Main Page)',
    shortKhmer: 'ហាងទំនិញ (Mayany Store)',
    shortEnglish: 'Mayany Store & Order',
    icon: '🛍️',
    badgeKhmer: 'ទំព័រដើមចម្បង',
    badgeEnglish: 'Main Page',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    requiresSignIn: false
  },
  {
    id: 'home',
    titleKhmer: 'ទំព័រដើម CashewTrace & វិស័យទាំង ៥',
    titleEnglish: 'CashewTrace Home & 5 Agricultural Sectors',
    shortKhmer: 'ទំព័រដើម (Home)',
    shortEnglish: 'Home Portal',
    icon: '🏠',
    badgeKhmer: 'ទូទៅ',
    badgeEnglish: 'Overview',
    badgeColor: 'bg-slate-100 text-slate-700',
    requiresSignIn: true,
    hidden: true
  },
  {
    id: 'farmer',
    titleKhmer: 'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទី (ម្ចាស់ចម្ការ, អ្នកប្រមូលទិញ, រោងចក្រកែច្នៃ, អ្នកនាំចេញ, ដៃគូដឹកជញ្ជូន)',
    titleEnglish: 'Cashew Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)',
    shortKhmer: 'ខ្សែច្រវ៉ាក់ស្វាយចន្ទី (Supply Chain)',
    shortEnglish: 'Cashew Supply Chain',
    icon: '🥜',
    badgeKhmer: 'EUDR Supply Chain',
    badgeEnglish: 'EUDR Supply Chain',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    requiresSignIn: true
  },
  {
    id: 'mayany',
    titleKhmer: 'សហគ្រាស Mayany & រោងចក្រកែច្នៃកសិផល',
    titleEnglish: 'Mayany Enterprise & Agro-SMEs',
    shortKhmer: 'រោងចក្រ Mayany (Processing)',
    shortEnglish: 'Mayany Agro-SME',
    icon: '🏢',
    badgeKhmer: 'GHP/HACCP',
    badgeEnglish: 'GHP/HACCP',
    badgeColor: 'bg-amber-100 text-amber-900',
    requiresSignIn: true
  },
  {
    id: 'mango',
    titleKhmer: 'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយកែវរមៀត (ម្ចាស់ចម្ការ, អ្នកប្រមូលទិញ, រោងចក្រកែច្នៃ, អ្នកនាំចេញ, ដៃគូដឹកជញ្ជូន)',
    titleEnglish: 'Mango Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)',
    shortKhmer: 'ខ្សែច្រវ៉ាក់ស្វាយកែវរមៀត (Supply Chain)',
    shortEnglish: 'Mango Supply Chain',
    icon: '🥭',
    badgeKhmer: 'CamGAP & Export',
    badgeEnglish: 'CamGAP & Export',
    badgeColor: 'bg-orange-100 text-orange-900',
    requiresSignIn: true
  },
  {
    id: 'map',
    titleKhmer: 'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ម្រេច & គ្រឿងទេស (ម្ចាស់ចម្ការ, អ្នកប្រមូលទិញ, រោងចក្រកែច្នៃ, អ្នកនាំចេញ, ដៃគូដឹកជញ្ជូន)',
    titleEnglish: 'Pepper & Spices Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)',
    shortKhmer: 'ខ្សែច្រវ៉ាក់ម្រេច & គ្រឿងទេស (Supply Chain)',
    shortEnglish: 'Pepper & Spices Supply Chain',
    icon: '🌿',
    badgeKhmer: 'GI & Supply Chain',
    badgeEnglish: 'GI & Supply Chain',
    badgeColor: 'bg-teal-100 text-teal-900',
    requiresSignIn: true
  },
  {
    id: 'packaging',
    titleKhmer: 'ស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល',
    titleEnglish: 'Digital Packaging Label',
    shortKhmer: 'ស្លាកវេចខ្ចប់ឌីជីថល',
    shortEnglish: 'Digital Packaging Label',
    icon: '🏷️',
    badgeKhmer: 'CS 001',
    badgeEnglish: 'CS 001',
    badgeColor: 'bg-blue-100 text-blue-900',
    requiresSignIn: false
  },
  {
    id: 'dailypa',
    titleKhmer: 'ជំនួយការសំឡេងឆ្លាតវៃ MyDailyPA (Voice AI សម្រាប់អាជីវកម្ម)',
    titleEnglish: 'MyDailyPA — Voice-First AI Assistant for MSMEs',
    shortKhmer: 'MyDailyPA (Voice AI)',
    shortEnglish: 'MyDailyPA Assistant',
    icon: '📱',
    badgeKhmer: 'Voice AI',
    badgeEnglish: 'Voice AI',
    badgeColor: 'bg-indigo-100 text-indigo-900',
    requiresSignIn: true,
    hidden: true
  },
  {
    id: 'passport',
    titleKhmer: 'លិខិតឆ្លងដែនកសិផលឌីជីថល (Digital Product Passport & QR)',
    titleEnglish: 'EUDR Digital Product Passport & QR Verification',
    shortKhmer: 'លិខិតឆ្លងដែន (Passport)',
    shortEnglish: 'Product Passport',
    icon: '📜',
    badgeKhmer: 'QR Trace',
    badgeEnglish: 'QR Trace',
    badgeColor: 'bg-purple-100 text-purple-900',
    requiresSignIn: false
  },
  {
    id: 'inventory',
    titleKhmer: 'ឃ្លាំងស្តុក និងសារពើភ័ណ្ឌ (Warehouse & Stock Ledger)',
    titleEnglish: 'Inventory & Warehouse Ledger',
    shortKhmer: 'សារពើភ័ណ្ឌ (Inventory)',
    shortEnglish: 'Inventory Ledger',
    icon: '📦',
    badgeKhmer: 'Real-time',
    badgeEnglish: 'Real-time',
    badgeColor: 'bg-slate-100 text-slate-900',
    requiresSignIn: true
  },
  {
    id: 'admin',
    titleKhmer: 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល & ទិន្នន័យមេ (Admin & Master Data)',
    titleEnglish: 'Admin Hub & Master Data Management',
    shortKhmer: 'រដ្ឋបាល (Admin Hub)',
    shortEnglish: 'Admin Portal',
    icon: '🛡️',
    badgeKhmer: 'Admin',
    badgeEnglish: 'Admin',
    badgeColor: 'bg-rose-100 text-rose-900',
    requiresSignIn: true
  },
  {
    id: 'social',
    titleKhmer: 'មាតិកាបណ្តាញសង្គម & សម្រង់សម្តីកសិករ (Social Media Scheduler)',
    titleEnglish: 'Social Media & Farmer Quotes Campaign Hub',
    shortKhmer: 'មាតិកាសង្គម (Social)',
    shortEnglish: 'Social Content Hub',
    icon: '📢',
    badgeKhmer: 'Marketing',
    badgeEnglish: 'Marketing',
    badgeColor: 'bg-pink-100 text-pink-900',
    requiresSignIn: true
  }
];

interface EcosystemHeaderProps {
  currentProject: string;
  onSelectProject: (projectId: string) => void;
  userSession: UserProfile | null;
  onOpenSignIn: () => void;
  onSignOut: () => void;
  onOpenGreeting?: () => void;
  onOpenDeployModal?: () => void;
}

export default function EcosystemHeader({
  currentProject,
  onSelectProject,
  userSession,
  onOpenSignIn,
  onSignOut,
  onOpenGreeting,
  onOpenDeployModal
}: EcosystemHeaderProps) {
  const { isKhmer, isKorean, isJapanese } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeProjectMeta = ALL_PROJECTS.find(p => p.id === currentProject) || ALL_PROJECTS[0];

  return (
    <header 
      id="ecosystem-global-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 min-h-[74px] sm:min-h-[84px] flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-5">
        
        {/* Left: Brand Identity & Home Link */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            id="header-brand-home-btn"
            onClick={() => onSelectProject('store')}
            className="flex items-center gap-2 sm:gap-3 text-left group transition-transform active:scale-98 cursor-pointer shrink-0"
            title="MAYANY Enterprise • Powered by CashewTrace"
          >
            {/* 1. MAYANY Enterprise Logo FIRST */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <img
                src="/assets/aistudio/Mayany_Enterprise_Logo_August_26_2026_4cdf6a3d.jpg"
                alt="MAYANY Enterprise"
                className="h-10 sm:h-12 md:h-13.5 w-10 sm:w-12 md:w-13.5 rounded-full object-cover ring-2 ring-amber-400 shadow-md shrink-0 transition-transform group-hover:scale-105"
              />
              <div className="text-left">
                <span className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-slate-900 block leading-tight whitespace-nowrap">
                  MAYANY Enterprise
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-amber-700 font-bold uppercase tracking-wider block">
                  Artisan Agro-Food
                </span>
              </div>
            </div>

            {/* "powered by" connector */}
            <div className="flex items-center px-0.5 sm:px-1 text-slate-500 shrink-0">
              <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-500 font-sans tracking-tight">
                powered by
              </span>
            </div>

            {/* 2. CashewTrace Logo SECOND */}
            <div className="relative shrink-0 transition-transform group-hover:scale-105">
              <CashewTraceLogo className="h-7 sm:h-9 md:h-10 w-auto" />
            </div>

            {/* EUDR & CS 001 */}
            <div className="hidden sm:block shrink-0">
              <span className="inline-block px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs whitespace-nowrap">
                EUDR & CS 001
              </span>
            </div>
          </button>
        </div>

        {/* Right: Actions in EXACT requested order:
            1. cashewtrace.com (next to EUDR & CS 001)
            2. Mayany Enterprise FB (FULL NAME)
            3. Purchase Order button
            4. Language selector (last one)
            Arranged in 2 neat rows on mobile screens to comfortably fit cellphones without clipping!
        */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-2.5 md:gap-3 w-full lg:w-auto shrink-0">

          {/* Row 1 on mobile: cashewtrace.com & Mayany Enterprise FB (Full Name) */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {/* 1. Direct Website Quick Link (next to EUDR & CS 001) */}
            <a
              href="https://cashewtrace.com"
              target="_blank"
              rel="noopener noreferrer"
              id="header-website-link"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer font-mono whitespace-nowrap"
              title="cashewtrace.com • CashewTrace Official Platform"
            >
              <CashewTraceIcon className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 shrink-0" />
              <span className="font-extrabold tracking-tight text-emerald-950 text-xs sm:text-sm">
                cashewtrace.com
              </span>
            </a>

            {/* 2. Direct Mayany Enterprise Facebook Page Link (FULL NAME) */}
            <a
              href="https://www.facebook.com/share/p/18sWyRnWDV/"
              target="_blank"
              rel="noopener noreferrer"
              id="header-facebook-link"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 hover:text-blue-950 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title={isJapanese ? 'マヤン・エンタープライズ公式Facebook' : isKorean ? '마얀 엔터프라이즈 공식 페이스북 (MAYANY Enterprise Facebook)' : isKhmer ? 'ទំព័រ Facebook ផ្លូវការ MAYANY Enterprise' : 'MAYANY Enterprise Official Facebook'}
            >
              <Facebook className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 shrink-0" />
              <span className="font-bold text-xs sm:text-sm">Mayany Enterprise FB</span>
            </a>

            {/* Direct Website ZIP Download Button */}
            <a
              href="/download"
              download="product-certificate-fix.zip"
              id="header-download-zip-btn"
              className="flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap border border-amber-600"
              title={isJapanese ? '最新コードパッケージ (.zip) をダウンロード' : 'Download latest code updates (.zip)'}
            >
              <Download className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{isJapanese ? 'ダウンロード (.zip)' : isKhmer ? 'ទាញយក (.zip)' : 'Download (.zip)'}</span>
            </a>
          </div>

          {/* Row 2 on mobile: Purchase Order button & Language Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {/* 3. Mayany Store & Purchase Order Quick Action Button */}
            <button
              type="button"
              id="header-store-quick-btn"
              onClick={() => {
                if (currentProject !== 'store') {
                  onSelectProject('store');
                } else {
                  window.scrollTo({ top: 460, behavior: 'smooth' });
                }
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title={isJapanese ? 'マヤン・エンタープライズ商品のご注文' : isKorean ? '마얀 엔터프라이즈 상품 주문' : isKhmer ? 'កុម្ម៉ង់ទិញផលិតផល MAYANY Enterprise' : 'Order MAYANY Enterprise Products'}
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-100 shrink-0" />
              <span>{isJapanese ? '🛍️ ご注文' : isKorean ? '🛍️ 상품 주문' : isKhmer ? '🛍️ កុម្ម៉ង់ទិញ' : '🛍️ Shop'}</span>
            </button>

            {/* 3b. 13-Step Packaging Studio Quick Switcher */}
            {currentProject === 'packaging' ? (
              <button
                type="button"
                onClick={() => onSelectProject('store')}
                className="flex items-center justify-center gap-1 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap border border-amber-500"
                title="Return to Mayany Storefront"
              >
                <span>🏪</span>
                <span>{isJapanese ? '店舗' : isKhmer ? 'ហាងទំនិញ' : 'Store'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectProject('packaging')}
                className="flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                title="13-Step Packaging Label Studio (CS 001)"
              >
                <span>🏷️</span>
                <span className="font-extrabold">{isJapanese ? '13工程ラベル' : isKhmer ? 'ស្លាក ១៣ ជំហាន' : '13 Steps'}</span>
              </button>
            )}

            {/* 4. Language Selector (Last one) */}
            <div className="shrink-0">
              <LanguageToggle variant="compact" />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
