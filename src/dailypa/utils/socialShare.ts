import { PUBLIC_APP_URL, isRunningInTelegram, shareToTelegram } from './telegram';
import { SupportedLanguage } from '../types';

/**
 * Detects if app is running inside Facebook or Messenger In-App Browser
 */
export function isRunningInFacebookOrMessenger(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  return /FBAN|FBAV|MessengerForiOS|Messenger/i.test(ua);
}

/**
 * Detects the current hosting platform environment
 */
export function detectPlatformEnvironment(): 'telegram' | 'facebook_messenger' | 'browser' {
  if (isRunningInTelegram()) return 'telegram';
  if (isRunningInFacebookOrMessenger()) return 'facebook_messenger';
  return 'browser';
}

/**
 * Localized share messages for English and Korean
 */
export const SHARE_INVITE_MESSAGES: Partial<Record<SupportedLanguage, string>> & { en: string; ko: string } = {
  en: 'MyDailyPA - Voice-First AI Assistant for MSMEs & Daily Life (Runs smoothly in Messenger, Telegram & any browser with zero install):',
  ko: 'MyDailyPA - 소상공인과 일상을 위한 음성 AI 비서 (설치 없이 메신저, 텔레그램, 웹 브라우저에서 바로 사용):',
};

/**
 * Universal Share Action:
 * Uses Web Share API when supported (allowing direct sharing to Messenger, Telegram, WhatsApp, Viber, etc.)
 * or provides fallback URL handling.
 */
export async function shareAppUniversally(
  lang: SupportedLanguage,
  targetChannel?: 'messenger' | 'telegram' | 'whatsapp' | 'email' | 'copy'
): Promise<{ success: boolean; method: string }> {
  const text = SHARE_INVITE_MESSAGES[lang] || SHARE_INVITE_MESSAGES.en;
  const fullUrl = PUBLIC_APP_URL;

  // 1. Explicit Channel: Telegram
  if (targetChannel === 'telegram') {
    shareToTelegram(text);
    return { success: true, method: 'telegram' };
  }

  // 2. Explicit Channel: WhatsApp
  if (targetChannel === 'whatsapp') {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${fullUrl}`)}`;
    window.open(waUrl, '_blank');
    return { success: true, method: 'whatsapp' };
  }

  // 3. Explicit Channel: Email
  if (targetChannel === 'email') {
    const emailSubject = encodeURIComponent('MyDailyPA - Voice AI Assistant for MSMEs & Daily Life');
    const emailBody = encodeURIComponent(`${text}\n\nApp Link: ${fullUrl}\n\n(No install required, open in Chrome, Safari, or mobile browser)`);
    const mailtoUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoUrl;
    return { success: true, method: 'email' };
  }

  // 4. Explicit Channel: Facebook Messenger
  if (targetChannel === 'messenger') {
    // Try Web Share or messenger direct share
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'MyDailyPA',
          text,
          url: fullUrl,
        });
        return { success: true, method: 'web_share' };
      } catch (err) {
        // user cancelled or fallback
      }
    }
    // Fallback Messenger send dialog or copy
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(text)}`;
    window.open(fbShareUrl, '_blank');
    return { success: true, method: 'facebook' };
  }

  // 4. Default: Try native OS Share Sheet first (presents Messenger, Telegram, WhatsApp, SMS directly)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'MyDailyPA - Smart Voice Assistant',
        text,
        url: fullUrl,
      });
      return { success: true, method: 'web_share' };
    } catch (err) {
      // If cancelled or rejected, copy to clipboard
    }
  }

  // 5. Fallback: Copy to clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${fullUrl}`);
      return { success: true, method: 'clipboard' };
    }
  } catch (err) {
    console.debug('Clipboard write error', err);
  }

  return { success: false, method: 'none' };
}
