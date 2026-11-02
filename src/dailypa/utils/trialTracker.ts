import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getOrCreateVisitorId } from '../../lib/firebaseService';

export const MAX_FREE_VOICE_RECORDS = 300;
export const MAX_FREE_TRIAL_DAYS = 60;

export interface TrialStats {
  voiceRecordingsCount: number;
  recordsRemaining: number;
  firstActiveAt: number;
  daysUsed: number;
  daysRemaining: number;
  isExpired: boolean;
  expiryReason: 'none' | 'records_limit' | 'days_limit' | 'both';
  userPhoneNumber?: string;
  userName?: string;
  isRegistered: boolean;
}

const STORAGE_KEYS = {
  VOICE_COUNT: 'dailypa_voice_recordings_count',
  FIRST_ACTIVE: 'dailypa_trial_first_active_at',
  USER_PHONE: 'dailypa_current_phone',
  USER_NAME: 'dailypa_current_user_name',
  USER_CATEGORY: 'dailypa_current_category',
};

/**
 * Get the current trial statistics for the active user / device
 */
export function getTrialStats(): TrialStats {
  if (typeof window === 'undefined') {
    return {
      voiceRecordingsCount: 0,
      recordsRemaining: MAX_FREE_VOICE_RECORDS,
      firstActiveAt: Date.now(),
      daysUsed: 0,
      daysRemaining: MAX_FREE_TRIAL_DAYS,
      isExpired: false,
      expiryReason: 'none',
      isRegistered: false,
    };
  }

  // 1. Get voice recordings count
  const storedCount = localStorage.getItem(STORAGE_KEYS.VOICE_COUNT);
  const voiceRecordingsCount = storedCount ? parseInt(storedCount, 10) || 0 : 0;

  // 2. Get first active timestamp (start of 60 days countdown)
  let firstActiveAt = 0;
  const storedFirstActive = localStorage.getItem(STORAGE_KEYS.FIRST_ACTIVE);
  if (storedFirstActive) {
    firstActiveAt = parseInt(storedFirstActive, 10) || Date.now();
  } else {
    firstActiveAt = Date.now();
    localStorage.setItem(STORAGE_KEYS.FIRST_ACTIVE, firstActiveAt.toString());
  }

  // 3. Calculate days used (1 day = 86,400,000 ms)
  const elapsedMs = Math.max(0, Date.now() - firstActiveAt);
  const daysUsed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, MAX_FREE_TRIAL_DAYS - daysUsed);
  const recordsRemaining = Math.max(0, MAX_FREE_VOICE_RECORDS - voiceRecordingsCount);

  // 4. Determine expiration
  const recordsExceeded = voiceRecordingsCount >= MAX_FREE_VOICE_RECORDS;
  const daysExceeded = daysUsed >= MAX_FREE_TRIAL_DAYS;
  const isExpired = recordsExceeded || daysExceeded;

  let expiryReason: 'none' | 'records_limit' | 'days_limit' | 'both' = 'none';
  if (recordsExceeded && daysExceeded) expiryReason = 'both';
  else if (recordsExceeded) expiryReason = 'records_limit';
  else if (daysExceeded) expiryReason = 'days_limit';

  const userPhone = localStorage.getItem(STORAGE_KEYS.USER_PHONE) || undefined;
  const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME) || undefined;

  return {
    voiceRecordingsCount,
    recordsRemaining,
    firstActiveAt,
    daysUsed,
    daysRemaining,
    isExpired,
    expiryReason,
    userPhoneNumber: userPhone,
    userName,
    isRegistered: Boolean(userPhone && userPhone.trim().length > 0),
  };
}

/**
 * Increment the voice recording count by 1 (called whenever a voice recording or entry is saved)
 * Also syncs with Firestore if user is signed in or has device telemetry
 */
export async function incrementVoiceRecordingCount(): Promise<TrialStats> {
  if (typeof window === 'undefined') return getTrialStats();

  const current = getTrialStats();
  const newCount = current.voiceRecordingsCount + 1;
  localStorage.setItem(STORAGE_KEYS.VOICE_COUNT, newCount.toString());

  // Update in Firestore asynchronously
  try {
    const phone = localStorage.getItem(STORAGE_KEYS.USER_PHONE);
    const visitorId = getOrCreateVisitorId();
    const smeId = phone ? `sme_${phone.replace(/\D/g, '')}` : `device_${visitorId}`;

    const smeRef = doc(db, 'registered_smes', smeId);
    await setDoc(
      smeRef,
      {
        id: smeId,
        smeName: current.userName || 'Anonymous Voice User',
        phoneOrTelegram: phone || `Device: ${visitorId}`,
        registeredAt: current.firstActiveAt,
        lastActiveAt: Date.now(),
        labelsCreatedCount: newCount,
        selectedSector: localStorage.getItem(STORAGE_KEYS.USER_CATEGORY) || 'msme',
        notes: `Trial Usage: ${newCount}/${MAX_FREE_VOICE_RECORDS} recordings, Day ${current.daysUsed + 1}/${MAX_FREE_TRIAL_DAYS}`,
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Asynchronous telemetry sync notice:', err);
  }

  return getTrialStats();
}

/**
 * Register or Sign in a user with Name and Phone Number
 * Syncs with Firestore to restore existing account data if previously registered
 */
export async function registerOrSignInWithPhone(
  name: string,
  phone: string,
  category: string = 'msme'
): Promise<{ success: boolean; stats: TrialStats; isExistingUser: boolean }> {
  if (typeof window === 'undefined') {
    return { success: false, stats: getTrialStats(), isExistingUser: false };
  }

  const cleanPhone = phone.trim();
  const cleanName = name.trim();
  const cleanId = `sme_${cleanPhone.replace(/\D/g, '')}`;

  let isExistingUser = false;
  let voiceRecordingsCount = 0;
  let firstActiveAt = Date.now();

  try {
    // 1. Check if user already exists in Firestore
    const smeRef = doc(db, 'registered_smes', cleanId);
    const existingDoc = await getDoc(smeRef);

    if (existingDoc.exists()) {
      const data = existingDoc.data();
      isExistingUser = true;
      voiceRecordingsCount = typeof data.labelsCreatedCount === 'number' ? data.labelsCreatedCount : 0;
      firstActiveAt = typeof data.registeredAt === 'number' ? data.registeredAt : Date.now();
    } else {
      // User is new: carry over any local usage they made before signing in
      const currentLocal = getTrialStats();
      voiceRecordingsCount = currentLocal.voiceRecordingsCount;
      firstActiveAt = currentLocal.firstActiveAt || Date.now();

      // Write new user document to Firestore
      await setDoc(smeRef, {
        id: cleanId,
        smeName: cleanName,
        phoneOrTelegram: cleanPhone,
        registeredAt: firstActiveAt,
        lastActiveAt: Date.now(),
        labelsCreatedCount: voiceRecordingsCount,
        selectedSector: category,
        notes: `Registered with ${voiceRecordingsCount} initial recordings`,
      });
    }

    // 2. Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.USER_PHONE, cleanPhone);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, cleanName);
    localStorage.setItem(STORAGE_KEYS.USER_CATEGORY, category);
    localStorage.setItem(STORAGE_KEYS.VOICE_COUNT, voiceRecordingsCount.toString());
    localStorage.setItem(STORAGE_KEYS.FIRST_ACTIVE, firstActiveAt.toString());

    return {
      success: true,
      stats: getTrialStats(),
      isExistingUser,
    };
  } catch (error) {
    console.error('Failed to sign in/register with Firestore, saving locally:', error);
    // Offline fallback: save locally
    localStorage.setItem(STORAGE_KEYS.USER_PHONE, cleanPhone);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, cleanName);
    localStorage.setItem(STORAGE_KEYS.USER_CATEGORY, category);

    return {
      success: true,
      stats: getTrialStats(),
      isExistingUser: false,
    };
  }
}

/**
 * Sign out the current user and switch back to guest mode
 */
export function signOutUser(): TrialStats {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_PHONE);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(STORAGE_KEYS.USER_CATEGORY);
  }
  return getTrialStats();
}
