import React from 'react';

interface MayanyRoyalGoldSealProps {
  className?: string;
  size?: number;
  brandName?: string;
  subText?: string;
  goldTone?: 'antique' | 'bright' | 'rose';
}

/**
 * High-fidelity Ornate Royal Gold Filigree Crest Seal for Mayany Enterprise
 * Exactly matching the vintage circular filigree medallion in the user's reference packaging.
 */
export const MayanyRoyalGoldSeal: React.FC<MayanyRoyalGoldSealProps> = ({
  className = 'w-24 h-24',
  size = 180,
  brandName = 'Mayany',
  subText = 'ENTERPRISE',
  goldTone = 'bright'
}) => {
  const gradientId = `goldFiligreeGrad-${goldTone}`;
  const darkGradId = `goldFiligreeDarkGrad-${goldTone}`;

  return (
    <svg 
      viewBox="0 0 300 300" 
      width={size} 
      height={size} 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mayany Enterprise Royal Gold Seal"
    >
      <defs>
        {/* Rich multi-stop metallic gold gradient */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="18%" stopColor="#f7e199" />
          <stop offset="35%" stopColor="#b3821a" />
          <stop offset="55%" stopColor="#fdf0cd" />
          <stop offset="75%" stopColor="#c5942b" />
          <stop offset="90%" stopColor="#e8c15a" />
          <stop offset="100%" stopColor="#8c6114" />
        </linearGradient>

        <radialGradient id={darkGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbf3db" />
          <stop offset="70%" stopColor="#edd89f" />
          <stop offset="100%" stopColor="#cba043" />
        </radialGradient>

        {/* Curved Path for ENTERPRISE arched text */}
        <path
          id="enterpriseArchPath"
          d="M 68,198 A 95,95 0 0,0 232,198"
          fill="none"
        />
        <path
          id="enterpriseArchPathUpper"
          d="M 60,205 A 100,100 0 0,0 240,205"
          fill="none"
        />
      </defs>

      {/* 1. OUTER ORNATE FILIGREE PETALS & CROWN FLOURISHES (16-Point Symmetrical Mandala) */}
      <g stroke={`url(#${gradientId})`} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={i} transform={`rotate(${angle} 150 150)`}>
              {/* Outer Fleur-de-lis Crest Tip */}
              <path 
                d="M 150,12 C 146,24 135,32 142,42 C 146,48 154,48 158,42 C 165,32 154,24 150,12 Z" 
                fill={`url(#${gradientId})`} 
                opacity="0.9"
              />
              {/* Baroque Side Scroll Loops */}
              <path 
                d="M 142,42 C 130,40 120,48 126,60 C 132,68 144,62 145,52" 
                strokeWidth="2.2"
              />
              <path 
                d="M 158,42 C 170,40 180,48 174,60 C 168,68 156,62 155,52" 
                strokeWidth="2.2"
              />
              {/* Delicate Gold Pearl Dot */}
              <circle cx="150" cy="28" r="2.8" fill={`url(#${gradientId})`} />
              <circle cx="132" cy="50" r="1.8" fill={`url(#${gradientId})`} />
              <circle cx="168" cy="50" r="1.8" fill={`url(#${gradientId})`} />
            </g>
          );
        })}
      </g>

      {/* 2. OUTER BEADED PEARL RING */}
      <circle 
        cx="150" 
        cy="150" 
        r="114" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="2" 
        fill="none" 
      />
      <g fill={`url(#${gradientId})`}>
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 360) / 48;
          const rad = (angle * Math.PI) / 180;
          const cx = 150 + 114 * Math.cos(rad);
          const cy = 150 + 114 * Math.sin(rad);
          return <circle key={i} cx={cx} cy={cy} r="1.6" />;
        })}
      </g>

      {/* 3. ROPE / CORD TWIST ACCENT RING */}
      <circle 
        cx="150" 
        cy="150" 
        r="105" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="3.5" 
        strokeDasharray="4, 3" 
        fill="none" 
      />

      {/* 4. SOLID PARCHMENT GOLD CENTER MEDALLION DISC */}
      <circle 
        cx="150" 
        cy="150" 
        r="98" 
        fill={`url(#${darkGradId})`} 
        stroke={`url(#${gradientId})`} 
        strokeWidth="3" 
      />

      {/* 5. INNER SCALLOPED EMBOSSED RING */}
      <circle 
        cx="150" 
        cy="150" 
        r="90" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="1.5" 
        strokeDasharray="2, 4" 
        fill="none" 
      />

      {/* 6. VINTAGE TOP FLOURISH ACCENT */}
      <g transform="translate(150, 96)" stroke={`url(#${gradientId})`} fill="none" strokeWidth="2">
        <path d="M -30,-4 C -18,-14 -6,2 0,-4 C 6,2 18,-14 30,-4" strokeLinecap="round" />
        <circle cx="0" cy="-6" r="2.5" fill={`url(#${gradientId})`} />
        <circle cx="-16" cy="-8" r="1.5" fill={`url(#${gradientId})`} />
        <circle cx="16" cy="-8" r="1.5" fill={`url(#${gradientId})`} />
      </g>

      {/* 7. BRAND NAME "Mayany" SCRIPT CALLIGRAPHY */}
      <g transform="translate(150, 142)">
        {/* Soft shadow for depth */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fill="#5c3e07"
          opacity="0.3"
          fontSize="56"
          fontFamily="'Brush Script MT', 'Great Vibes', 'Edwardian Script ITC', 'Playfair Display', cursive, serif"
          fontStyle="italic"
          fontWeight="bold"
          dx="1.5"
          dy="1.5"
        >
          {brandName}
        </text>
        {/* Main Golden Script Text */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fill="#452a02"
          stroke={`url(#${gradientId})`}
          strokeWidth="0.8"
          fontSize="56"
          fontFamily="'Brush Script MT', 'Great Vibes', 'Edwardian Script ITC', 'Playfair Display', cursive, serif"
          fontStyle="italic"
          fontWeight="bold"
          letterSpacing="0.5px"
        >
          {brandName}
        </text>
      </g>

      {/* 8. ARCHED "ENTERPRISE" SUBTITLE WITH STARS */}
      <text
        fill="#3f2705"
        fontSize="17"
        fontFamily="'Cinzel', 'Playfair Display', 'Times New Roman', serif"
        fontWeight="800"
        letterSpacing="3.5px"
      >
        <textPath href="#enterpriseArchPath" startOffset="50%" textAnchor="middle">
          • {subText} •
        </textPath>
      </text>

      {/* 9. BOTTOM FLOURISH VINE */}
      <g transform="translate(150, 226)" stroke={`url(#${gradientId})`} fill="none" strokeWidth="1.8">
        <path d="M -24,0 C -12,6 0,-2 0,0 C 0,-2 12,6 24,0" strokeLinecap="round" />
        <circle cx="0" cy="2" r="2.2" fill={`url(#${gradientId})`} />
      </g>
    </svg>
  );
};

export default MayanyRoyalGoldSeal;
