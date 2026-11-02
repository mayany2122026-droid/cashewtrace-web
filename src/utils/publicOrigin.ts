/**
 * Dynamic resolution of the public, smartphone-accessible URL origin.
 * In AI Studio, 'ais-dev-' requires Google authentication, whereas 'ais-pre-'
 * is the public preview URL reachable from any smartphone camera outside the sandbox.
 */
export function getPublicOrigin(): string {
  if (typeof window === 'undefined') return '';

  // Check if user set a custom public domain override in localStorage
  try {
    const customOverride = localStorage.getItem('cashewtrace_public_domain_override');
    if (customOverride && customOverride.trim().startsWith('http')) {
      return customOverride.trim().replace(/\/+$/, '');
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  const currentOrigin = window.location.origin || '';

  // AI Studio Dev URL -> Convert to Public Shared Preview URL (ais-pre-...)
  if (currentOrigin.includes('ais-dev-')) {
    return currentOrigin.replace('ais-dev-', 'ais-pre-');
  }

  // Already on public preview or any valid remote domain (e.g. *.run.app or custom domain)
  if (currentOrigin) {
    return currentOrigin.replace(/\/+$/, '');
  }

  return '';
}

export function setPublicOriginOverride(domain: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (!domain || !domain.trim()) {
      localStorage.removeItem('cashewtrace_public_domain_override');
    } else {
      let clean = domain.trim();
      if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = `https://${clean}`;
      }
      localStorage.setItem('cashewtrace_public_domain_override', clean.replace(/\/+$/, ''));
    }
  } catch (e) {
    console.warn('Could not save domain override', e);
  }
}

export function isLocalhostOrigin(): boolean {
  if (typeof window === 'undefined') return false;
  const origin = window.location.origin || '';
  return origin.includes('localhost') || origin.includes('127.0.0.1');
}
