// Telegram Mini App (TMA) Integration for DailyPA & CashewTrace
// Solves all iOS & Android Add-to-Home-Screen installation friction

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: string;
    hash?: string;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text: string }> }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (result: boolean) => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

/**
 * Dynamically resolves the clean live application URL
 */
export const getCleanPublicAppUrl = (appParam: string = 'dailypa'): string => {
  if (typeof window !== 'undefined' && window.location.origin) {
    const origin = window.location.origin;
    // Use active live domain if available
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return `${origin}/?app=${appParam}`;
    }
  }
  return 'https://ais-pre-cxzfaif4uhfgp73v7prekv-224364798918.asia-east1.run.app?app=dailypa';
};

export const PUBLIC_APP_URL = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')
  ? `${window.location.origin}/?app=dailypa`
  : 'https://ais-pre-cxzfaif4uhfgp73v7prekv-224364798918.asia-east1.run.app?app=dailypa';

/**
 * Check if the app is currently running inside Telegram WebApp container (TMA)
 */
export const isRunningInTelegram = (): boolean => {
  if (typeof window === 'undefined') return false;
  const tg = window.Telegram?.WebApp;
  if (!tg) return false;
  // If platform is not unknown or initData exists or hash contains tgWebAppData
  return Boolean(
    tg.initData || 
    (tg.platform && tg.platform !== 'unknown') ||
    window.location.hash.includes('tgWebAppData') ||
    window.location.search.includes('tgWebAppPlatform')
  );
};

/**
 * Check if user is viewing via standard Telegram In-App Browser (Webview),
 * which may restrict microphone access or prompt system PDF download.
 */
export const isTelegramInAppBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || '';
  return /Telegram/i.test(ua) && !isRunningInTelegram();
};

/**
 * Safely launches the app in the user's external default browser (Chrome on Android, Safari on iOS),
 * bypassing Telegram Webview restrictions and preventing PDF viewer prompts.
 */
export const openInExternalBrowser = (targetUrl?: string) => {
  const url = targetUrl || getCleanPublicAppUrl('dailypa');
  const tg = window.Telegram?.WebApp;
  
  if (tg?.openLink) {
    tg.openLink(url);
    return;
  }

  // If in mobile browser, open new window/tab
  try {
    const win = window.open(url, '_blank');
    if (!win) {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
};

/**
 * Retrieve Telegram user details if running inside Telegram
 */
export const getTelegramUser = (): TelegramUser | null => {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
};

/**
 * Initialize Telegram Mini App runtime:
 * - Signals ready to Telegram client
 * - Expands to 100% viewport height
 * - Sets brand header colors
 * - Enables closing confirmation
 */
export const initTelegramWebApp = (): TelegramUser | null => {
  if (typeof window === 'undefined') return null;
  const tg = window.Telegram?.WebApp;
  if (!tg) return null;

  try {
    tg.ready();
    tg.expand();
    
    // Set matching header color
    if (typeof tg.setHeaderColor === 'function') {
      tg.setHeaderColor('#0f172a'); // slate-900
    }
    if (typeof tg.setBackgroundColor === 'function') {
      tg.setBackgroundColor('#f8fafc'); // slate-50
    }
    if (typeof tg.enableClosingConfirmation === 'function') {
      tg.enableClosingConfirmation();
    }
  } catch (err) {
    console.debug('Telegram WebApp init notice:', err);
  }

  return tg.initDataUnsafe?.user || null;
};

/**
 * Native Haptic Feedback for buttons, voice recording & actions
 */
export const triggerTelegramHaptic = (
  style: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' = 'light'
) => {
  if (typeof window === 'undefined') return;
  const haptic = window.Telegram?.WebApp?.HapticFeedback;
  if (!haptic) return;

  try {
    if (style === 'selection') {
      haptic.selectionChanged();
    } else if (style === 'success' || style === 'warning' || style === 'error') {
      haptic.notificationOccurred(style);
    } else {
      haptic.impactOccurred(style);
    }
  } catch (err) {
    // Non-blocking fallback
  }
};

/**
 * Open Telegram Share dialog to send DailyPA to any chat, mentor, or farmer group
 */
export const shareToTelegram = (
  customText = 'MyDailyPA - កម្មវិធីជំនួយការកត់ត្រាសំឡេងឆ្លាតវៃ (Telegram Mini App No-Install):',
  appParam = 'dailypa'
) => {
  const cleanUrl = getCleanPublicAppUrl(appParam);
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(cleanUrl)}&text=${encodeURIComponent(customText)}`;
  const tg = window.Telegram?.WebApp;
  
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, '_blank');
  }
};

/**
 * Open a Telegram link (bot, channel, or chat)
 */
export const openTelegramLink = (url: string) => {
  const tg = window.Telegram?.WebApp;
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
};
