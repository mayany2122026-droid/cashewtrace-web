import React, { useState, useEffect } from 'react';

// Official high-resolution Mayany logo asset
import mayanyLogoFile from '../assets/images/mayany_official_logo_1785158778520.jpg';

export default function MayanyLogo({ 
  className = "h-14 md:h-18 w-auto", 
  alt = "Mayany Enterprise Official Logo",
  customLogo,
  src,
  variant
}: { 
  className?: string; 
  alt?: string;
  variant?: string;
  customLogo?: string;
  src?: string;
}) {
  const getResolvedLogo = () => {
    if (src) return src;
    if (customLogo && customLogo.trim() && customLogo !== '/mayany_official_logo.jpg') {
      return customLogo;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cashewtrace_sme_brand_logo');
        if (stored && stored.trim() && stored !== '/mayany_official_logo.jpg') {
          return stored;
        }
      } catch (e) {
        // Ignore localStorage error
      }
    }
    return mayanyLogoFile;
  };

  const [activeLogo, setActiveLogo] = useState<string>(getResolvedLogo);

  useEffect(() => {
    if (src) {
      setActiveLogo(src);
      return;
    }

    const syncLogoFromStorage = () => {
      if (customLogo && customLogo.trim() && customLogo !== '/mayany_official_logo.jpg') {
        setActiveLogo(customLogo);
        return;
      }
      try {
        const stored = localStorage.getItem('cashewtrace_sme_brand_logo');
        if (stored && stored.trim() && stored !== '/mayany_official_logo.jpg') {
          setActiveLogo(stored);
          return;
        }
      } catch (e) {
        // Ignore localStorage error
      }
      setActiveLogo(mayanyLogoFile);
    };

    syncLogoFromStorage();

    window.addEventListener('storage', syncLogoFromStorage);
    window.addEventListener('cashewtrace_logo_updated', syncLogoFromStorage);

    return () => {
      window.removeEventListener('storage', syncLogoFromStorage);
      window.removeEventListener('cashewtrace_logo_updated', syncLogoFromStorage);
    };
  }, [src, customLogo]);

  return (
    <img 
      src={activeLogo} 
      alt={alt} 
      className={`object-contain max-w-full ${className}`}
      onError={(e) => {
        // Fallback to bundled logo file if custom URL fails to load
        const target = e.currentTarget;
        if (target.src !== mayanyLogoFile) {
          target.src = mayanyLogoFile;
        }
      }}
    />
  );
}
