import React from 'react';

/**
 * Official CashewTrace Icon Mark
 * Magnifying glass with the orange cashew nut kernel & white gloss reflection highlight
 * Exactly matching the official brand identity
 */
export function CashewTraceIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 140 140" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CashewTrace Icon"
    >
      <defs>
        <linearGradient id="cashewGradV3" x1="20" y1="25" x2="85" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f36c1a" />
          <stop offset="45%" stopColor="#e85806" />
          <stop offset="100%" stopColor="#d34700" />
        </linearGradient>
      </defs>

      {/* Magnifying Glass Frame: Circle Lens */}
      <circle 
        cx="72" 
        cy="52" 
        r="44" 
        stroke="#1c1917" 
        strokeWidth="11" 
        fill="#ffffff" 
      />

      {/* Magnifying Glass Solid Black Handle at 45 degree angle */}
      <path 
        d="M 103 82 L 126 106" 
        stroke="#1c1917" 
        strokeWidth="18" 
        strokeLinecap="round" 
      />

      {/* The Cashew Nut: Kidney bean shape extending left outside the lens */}
      <path 
        d="M 16 58 C 12 36, 32 16, 56 16 C 80 16, 96 34, 93 60 C 90 79, 72 90, 48 88 C 26 86, 20 74, 16 58 Z" 
        fill="url(#cashewGradV3)" 
        stroke="#ffffff"
        strokeWidth="3.5"
      />
      
      {/* Gloss Reflection: Top-right major bean highlight */}
      <ellipse 
        cx="72" 
        cy="39" 
        rx="8.5" 
        ry="15" 
        transform="rotate(32 72 39)" 
        fill="#ffffff" 
      />

      {/* Gloss Reflection: Left crescent curve highlight */}
      <path 
        d="M 24 50 C 22 41, 31 30, 46 25" 
        stroke="#ffffff" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />

      {/* Small top specular gloss dot */}
      <circle 
        cx="82" 
        cy="31" 
        r="2.5" 
        fill="#ffffff" 
      />
    </svg>
  );
}

/**
 * Pure Cashew Nut Kernel Icon Mark
 */
export function CashewNutIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cashew Nut Icon"
    >
      <defs>
        <linearGradient id="cashewNutKernelGrad" x1="15" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="85%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
      </defs>

      {/* Cashew kidney-shaped nut kernel */}
      <path 
        d="M 20 54 C 15 32, 34 14, 58 14 C 82 14, 94 32, 90 58 C 86 78, 66 88, 44 86 C 24 84, 23 70, 20 54 Z" 
        fill="url(#cashewNutKernelGrad)" 
        stroke="#ffffff"
        strokeWidth="2.5"
      />
      
      {/* Top-Right Oval Gloss Reflection */}
      <ellipse 
        cx="68" 
        cy="36" 
        rx="8" 
        ry="14" 
        transform="rotate(32 68 36)" 
        fill="#ffffff" 
        opacity="0.85"
      />

      {/* Inner curve indent shadow/detail */}
      <path 
        d="M 36 48 C 42 42, 52 44, 56 52 C 58 58, 54 66, 46 70" 
        stroke="#7c2d12" 
        strokeWidth="3" 
        strokeLinecap="round" 
        fill="none" 
        opacity="0.4"
      />

      {/* Left Crescent Curve Highlight */}
      <path 
        d="M 27 46 C 25 38, 33 27, 46 22" 
        stroke="#ffffff" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        opacity="0.9"
      />

      {/* Specular dot */}
      <circle 
        cx="77" 
        cy="28" 
        r="2.5" 
        fill="#ffffff" 
      />
    </svg>
  );
}

/**
 * Official CashewTrace Full Logo
 * Clean, high-fidelity vector replica matching the official "CashewTrace Logo 2026.jpg":
 * - Icon: Black magnifying glass with vibrant orange glossy cashew nut
 * - Title: "CashewTrace" in heavy sans-serif Forest Green (#15733d)
 * - Tagline: "From Farm to Market" in Bold Italic Warm Amber/Orange (#e85806)
 */
export default function CashewTraceLogo({ 
  className = "h-9",
  variant = "standard"
}: { 
  className?: string;
  variant?: 'standard' | 'whiteText' | 'light';
}) {
  const isWhiteText = variant === 'whiteText';

  return (
    <svg 
      viewBox="0 0 580 145" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CashewTrace - From Farm to Market"
    >
      <defs>
        <linearGradient id="cashewGradOfficial2026" x1="20" y1="25" x2="85" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>

      {/* --- ICON MARK: Magnifying Glass + Orange Glossy Cashew --- */}
      <g transform="translate(10, 8)">
        {/* Magnifying Glass Lens Frame */}
        <circle 
          cx="72" 
          cy="52" 
          r="44" 
          stroke={isWhiteText ? "#f8fafc" : "#18181b"} 
          strokeWidth="11" 
          fill="#ffffff" 
        />

        {/* Magnifying Glass Solid Black Handle */}
        <path 
          d="M 103 82 L 128 107" 
          stroke={isWhiteText ? "#f8fafc" : "#18181b"} 
          strokeWidth="18" 
          strokeLinecap="round" 
        />

        {/* Vibrant Orange Cashew Nut Kidney Shape */}
        <path 
          d="M 16 58 C 12 36, 32 16, 56 16 C 80 16, 96 34, 93 60 C 90 79, 72 90, 48 88 C 26 86, 20 74, 16 58 Z" 
          fill="url(#cashewGradOfficial2026)" 
          stroke="#ffffff"
          strokeWidth="3.8"
        />
        
        {/* Top-Right Oval Gloss Reflection */}
        <ellipse 
          cx="72" 
          cy="39" 
          rx="8.5" 
          ry="15" 
          transform="rotate(32 72 39)" 
          fill="#ffffff" 
        />

        {/* Left Curve Gloss Streak */}
        <path 
          d="M 24 50 C 22 41, 31 30, 46 25" 
          stroke="#ffffff" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />

        {/* Top Specular Dot */}
        <circle 
          cx="82" 
          cy="31" 
          r="2.5" 
          fill="#ffffff" 
        />
      </g>

      {/* --- TYPOGRAPHY: Exact Official Brand Alignment --- */}
      {/* "CashewTrace" in heavy bold forest green (or bright emerald if on dark theme) */}
      <g transform="translate(156, 78)">
        <text 
          x="0" 
          y="0" 
          fill={isWhiteText ? "#4ade80" : "#15733d"} 
          fontSize="54" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif" 
          fontWeight="900"
          letterSpacing="-0.5px"
        >
          CashewTrace
        </text>
      </g>

      {/* "From Farm to Market" in bold italic warm orange */}
      <g transform="translate(162, 114)">
        <text 
          x="0" 
          y="0" 
          fill="#ea580c" 
          fontSize="23" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontWeight="700"
          fontStyle="italic"
          letterSpacing="0.2px"
        >
          From Farm to Market
        </text>
      </g>
    </svg>
  );
}

/**
 * Authentic Kampot Peppercorn Icon
 * Cluster of organic textured Kampot peppercorn corns with natural botanical stem
 */
export function PepperCornIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="GI Organic Kampot Peppercorns"
    >
      {/* Botanical vine twig */}
      <path 
        d="M24 5 C24 11, 22 16, 21 22 C20 28, 23 34, 25 41" 
        stroke="#78350f" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M23 14 C26 13, 30 12, 33 10" 
        stroke="#78350f" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path 
        d="M21 25 C17 24, 13 24, 11 22" 
        stroke="#78350f" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      
      {/* Peppercorn 1 (Top right) */}
      <circle cx="34" cy="11" r="7" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
      <circle cx="32" cy="9" r="1.5" fill="#fef3c7" opacity="0.8" />
      <circle cx="36" cy="12" r="1" fill="#d97706" />

      {/* Peppercorn 2 (Upper left) */}
      <circle cx="14" cy="18" r="7.5" fill="#292524" stroke="#fbbf24" strokeWidth="1.8" />
      <circle cx="12" cy="16" r="1.6" fill="#fef3c7" opacity="0.8" />
      <circle cx="16" cy="19" r="1.1" fill="#d97706" />

      {/* Peppercorn 3 (Center main) */}
      <circle cx="25" cy="24" r="8.5" fill="#1c1917" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="22.5" cy="21.5" r="1.8" fill="#ffffff" opacity="0.85" />
      <circle cx="27" cy="26" r="1.2" fill="#f59e0b" />
      <circle cx="21" cy="27" r="0.9" fill="#78350f" />

      {/* Peppercorn 4 (Bottom right) */}
      <circle cx="34" cy="32" r="7" fill="#451a03" stroke="#fbbf24" strokeWidth="1.8" />
      <circle cx="32.5" cy="30" r="1.4" fill="#fef3c7" opacity="0.75" />

      {/* Peppercorn 5 (Bottom center/left) */}
      <circle cx="19" cy="35" r="7" fill="#292524" stroke="#f59e0b" strokeWidth="1.8" />
      <circle cx="17.5" cy="33" r="1.4" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}




