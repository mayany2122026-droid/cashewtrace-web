import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import EcosystemHeader, { ALL_PROJECTS } from './components/EcosystemHeader';
import ProjectSignInModal, { UserProfile } from './components/ProjectSignInModal';

// Project and Portal Components
import HomePortal from './components/HomePortal';
import FarmerPortal from './components/FarmerPortal';
import MayanyEnterprise from './components/MayanyEnterprise';
import MayanyStore from './components/MayanyStore';
import MangoPilot from './components/MangoPilot';
import OtherAgriPortal from './components/OtherAgriPortal';
import PackagingLabelDesigner from './components/PackagingLabelDesigner';
import { DailyPaApp } from './dailypa/DailyPaApp';
import ProductPassport from './components/ProductPassport';
import InventoryChart from './components/InventoryChart';
import AdminPortal from './components/AdminPortal';
import SocialContentScheduler from './components/SocialContentScheduler';
import AppGreetingScreen from './components/AppGreetingScreen';
import UnifiedSectorOnboardingModal from './components/UnifiedSectorOnboardingModal';
import MobileAppInstallModal from './components/MobileAppInstallModal';
import CloudflareDeployModal from './components/CloudflareDeployModal';

// Data & Services
import cleanSheetDataRaw from './data/clean_sheet_data.json';
import { CleanSheetData } from './types';
import { seedDatabaseIfNeeded } from './lib/firebaseService';

function CashewTraceEcosystem() {
  const { isKhmer } = useLanguage();
  const [data, setData] = useState<CleanSheetData>(cleanSheetDataRaw as unknown as CleanSheetData);
  
  // Default to Mayany Store as requested by the user
  const [currentProject, setCurrentProject] = useState<string>('store');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(data.batches[0]?.batch_id || 'B001');

  // Cloudflare deploy & clean site zip download modal
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // PWA Install and Add to Home Screen state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // User session state (name, telephone & title)
  const [userSession, setUserSession] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('cashewtrace_user_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Greeting Screen: Kept false by default so customers and buyers land directly on the store
  const [showGreetingScreen, setShowGreetingScreen] = useState<boolean>(false);

  // Project Sign-In Modal state
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);

  // Additional feature modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingSector, setOnboardingSector] = useState<'farmer' | 'mayany' | 'mango' | 'map' | 'packaging' | undefined>(undefined);

  // Seed database once in background and setup PWA install listeners
  useEffect(() => {
    seedDatabaseIfNeeded();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleOpenInstallModal = () => {
      setIsInstallModalOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('open-install-modal', handleOpenInstallModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-install-modal', handleOpenInstallModal);
    };
  }, []);

  // Read URL query parameter on initial load and guarantee viewport starts at top
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reset scroll restoration so visitors always start from the top hero banner
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const params = new URLSearchParams(window.location.search);
    
    // Check if this is a QR code scan directly targeted at the Product Passport & Certificate
    const modeParam = params.get('mode');
    const projectParam = params.get('project') || params.get('tab') || params.get('app');
    const hasBatchParam = Boolean(params.get('batch') || params.get('b') || params.get('lot'));
    const hasEanParam = Boolean(params.get('ean') || params.get('gtin') || params.get('barcode'));
    const isPassportScan = 
      modeParam === 'passport' || 
      projectParam === 'passport' || 
      params.has('certificate') ||
      params.has('cert') ||
      hasEanParam ||
      hasBatchParam;

    if (isPassportScan) {
      setShowGreetingScreen(false);
      setIsSignInModalOpen(false);
      setCurrentProject('passport');
      const bId = params.get('batch') || params.get('b') || params.get('lot');
      if (bId) {
        setSelectedBatchId(bId);
      }
      return;
    }

    const requestedProject = projectParam;
    if (requestedProject && ALL_PROJECTS.some((p) => p.id === requestedProject)) {
      setCurrentProject(requestedProject);
    }

    const storedSession = localStorage.getItem('cashewtrace_user_session');
    let session: UserProfile | null = null;
    if (storedSession) {
      try {
        session = JSON.parse(storedSession);
        setUserSession(session);
      } catch (e) {
        console.warn('Error reading stored session:', e);
      }
    }

    // Check if visitor arrived from mayanyenterprise.com or explicit store param
    const isFromMayany = 
      typeof window !== 'undefined' && 
      (window.location.hostname.includes('mayanyenterprise') ||
       document.referrer.includes('mayanyenterprise') ||
       params.get('mode') === 'mayany' ||
       params.get('project') === 'store' ||
       params.get('store') === '1' ||
       params.get('shop') === '1');

    // Secret shortcut or URL param for owner: ?deploy=1 or Ctrl+Shift+D
    if (params.get('deploy') === '1' || params.get('deploy') === 'true') {
      setIsDeployModalOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsDeployModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle selecting a project from the dropdown or cards
  const handleSelectProject = (projectId: string) => {
    setCurrentProject(projectId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (projectId === 'store') {
        url.searchParams.delete('project');
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('project', projectId);
      }
      window.history.replaceState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Callback when user signs in via ProjectSignInModal
  const handleSignInSuccess = (profile: UserProfile) => {
    setUserSession(profile);
    setIsSignInModalOpen(false);
    setCurrentProject('store');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('project');
      url.searchParams.delete('tab');
      window.history.replaceState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPendingProjectId(null);
  };

  // Sign out / switch user
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cashewtrace_user_session');
      localStorage.removeItem('cashewtrace_user_name');
      localStorage.removeItem('cashewtrace_user_phone');
      const url = new URL(window.location.href);
      url.searchParams.delete('project');
      url.searchParams.delete('tab');
      window.history.replaceState({}, '', url.toString());
    }
    setUserSession(null);
    setCurrentProject('store');
  };

  // Active batch for Passport & Inventory
  const activeBatch = data.batches.find((b) => b.batch_id === selectedBatchId) || data.batches[0];

  // Metadata for pending project in modal
  const targetMeta = ALL_PROJECTS.find((p) => p.id === (pendingProjectId || 'farmer')) || ALL_PROJECTS[1];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Show Ecosystem Header on management portals, but keep Passport/Certificate 100% clean for external scanning customers */}
      {currentProject !== 'passport' ? (
        <>
          <EcosystemHeader
            currentProject={currentProject}
            onSelectProject={handleSelectProject}
            userSession={userSession}
            onOpenSignIn={() => {
              setPendingProjectId(currentProject === 'home' ? 'farmer' : currentProject);
              setIsSignInModalOpen(true);
            }}
            onSignOut={handleSignOut}
            onOpenGreeting={() => setShowGreetingScreen(true)}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
          />
        </>
      ) : (
        <header className="bg-slate-950 text-white border-b border-amber-500/40 px-4 py-2.5 flex items-center justify-between no-print sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
              🇰🇭
            </span>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white font-sans flex items-center gap-1.5">
                <span>វិញ្ញាបនបត្របច្ចេកទេសផលិតផល & វេចខ្ចប់ CS 001 ផ្លូវការ</span>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">CS 001:2000 MISTI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-sans hidden sm:block">
                ឯកសារផ្ទៀងផ្ទាត់គុណភាព និងការនាំចេញស្តង់ដារជាតិ • Mayany Enterprise
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <span className="text-emerald-400">✓</span>
              <span>បានផ្ទៀងផ្ទាត់ជាផ្លូវការ (CS 001 Certified)</span>
            </span>
          </div>
        </header>
      )}

      {/* Main View Portals */}
      <main className="flex-1 w-full">
        {/* 1. CashewTrace Home & 5 Sectors Overview */}
        {currentProject === 'home' && (
          <HomePortal
            data={data}
            onNavigate={(tab) => handleSelectProject(tab)}
            onSelectBatch={(bId) => {
              setSelectedBatchId(bId);
              handleSelectProject('passport');
            }}
            onOpenOnboarding={(sector) => {
              setOnboardingSector(sector);
              setIsOnboardingOpen(true);
            }}
            isOwnerLoggedIn={Boolean(userSession)}
          />
        )}

        {/* 2. Cashew Supply Chain Portal (Orchard Owners, Traders, Processors, Exporters, Logistics) */}
        {currentProject === 'farmer' && <FarmerPortal />}

        {/* Mayany Enterprise Official Storefront & Orders Desk */}
        {currentProject === 'store' && (
          <MayanyStore 
            onOpenPassport={(bId) => {
              setSelectedBatchId(bId);
              handleSelectProject('passport');
            }}
            onOpenPackaging={() => {
              handleSelectProject('packaging');
            }}
            onOpenDeploy={() => {
              setIsDeployModalOpen(true);
            }}
          />
        )}

        {/* 3. Mayany Enterprise & Agro-SMEs */}
        {currentProject === 'mayany' && <MayanyEnterprise />}

        {/* 4. Mango Supply Chain Portal (Orchard Owners, Traders, Processors, Exporters, Logistics) */}
        {currentProject === 'mango' && <MangoPilot />}

        {/* 5. Pepper & Spices Supply Chain Portal (Orchard Owners, Traders, Processors, Exporters, Logistics) */}
        {currentProject === 'map' && <OtherAgriPortal />}

        {/* 6. Digital Packaging Label Studio (CS 001) */}
        {currentProject === 'packaging' && (
          <PackagingLabelDesigner
            userName={userSession?.name}
            userPhone={userSession?.phone}
            userTitle={userSession?.title}
            onOpenGreeting={() => setShowGreetingScreen(true)}
          />
        )}

        {/* 7. MyDailyPA — Voice-First AI Assistant for MSMEs */}
        {currentProject === 'dailypa' && (
          <div className="bg-slate-50 min-h-screen">
            <DailyPaApp />
          </div>
        )}

        {/* 8. EUDR Digital Product Passport & Official CS 001 Certificate */}
        {currentProject === 'passport' && (
          <ProductPassport
            batch={activeBatch}
            suppliers={data.suppliers}
            storySections={data.story_sections}
            contactInfo={data.contact_info}
            allBatches={data.batches}
            onSelectBatch={(bId) => setSelectedBatchId(bId)}
            isConsumerMode={true}
          />
        )}

        {/* 9. Inventory & Warehouse Ledger */}
        {currentProject === 'inventory' && (
          <InventoryChart
            inventory={data.inventory}
            batches={data.batches}
            activeBatch={activeBatch}
          />
        )}

        {/* 10. Admin & Master Data Management */}
        {currentProject === 'admin' && (
          <AdminPortal
            data={data}
            onUpdateData={(newData) => setData(newData)}
            onResetData={() => setData(cleanSheetDataRaw as unknown as CleanSheetData)}
          />
        )}

        {/* 11. Social Media & Farmer Quotes Hub */}
        {currentProject === 'social' && <SocialContentScheduler />}
      </main>

      {/* Mandatory Sign-In Modal (Name & Telephone Number) */}
      <ProjectSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => {
          setIsSignInModalOpen(false);
          setPendingProjectId(null);
        }}
        targetProjectId={targetMeta.id}
        targetProjectTitleKhmer={targetMeta.titleKhmer}
        targetProjectTitleEnglish={targetMeta.titleEnglish}
        targetProjectIcon={targetMeta.icon}
        onSuccess={handleSignInSuccess}
      />

      {/* Greeting Onboarding Screen Modal / Full View */}
      {showGreetingScreen && (
        <AppGreetingScreen
          initialProfile={userSession}
          onContinueToPackaging={(profile) => {
            setUserSession(profile);
            setShowGreetingScreen(false);
            setCurrentProject('packaging');
          }}
        />
      )}

      {/* Unified Sector Onboarding Modal */}
      <UnifiedSectorOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        defaultSector={onboardingSector}
        onComplete={(sector, profile) => {
          setIsOnboardingOpen(false);
          if (profile.name && profile.phone) {
            handleSignInSuccess({
              name: profile.name,
              phone: profile.phone,
              organization: profile.location || profile.sector,
              signedInAt: Date.now()
            });
          }
          handleSelectProject(sector);
        }}
      />

      {/* Mobile PWA Install & Add to Home Screen Modal */}
      <MobileAppInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        currentSector={
          currentProject === 'farmer' ? 'farmer' :
          currentProject === 'mango' ? 'mango' :
          currentProject === 'map' ? 'spices' :
          currentProject === 'mayany' ? 'mayany' :
          currentProject === 'packaging' ? 'packaging' :
          'farmer'
        }
      />

      {/* Cloudflare Pages Deployment & Clean Site ZIP Modal */}
      <CloudflareDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Floating Direct ZIP Download Pill (Hidden from public view) */}
      <div className="hidden" aria-hidden="true">
        <button
          type="button"
          onClick={() => setIsDeployModalOpen(true)}
          id="floating-zip-download-btn"
          className="hidden"
          title="Download website ZIP archive for Cloudflare Pages or IONOS"
        >
          <span>📥 Download Site (.zip)</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary fallbackTitle="CashewTrace Protocol">
        <CashewTraceEcosystem />
      </ErrorBoundary>
    </LanguageProvider>
  );
}


