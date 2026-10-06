import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showBadge?: boolean;
  inverted?: boolean;
  className?: string;
  iconOnly?: boolean;
}

/**
 * Creative, Eye-Catchy Brand Emblem for QuickTools
 * Features a cosmic-indigo gradient squircle, glossy glass sheen,
 * precision calculation glyphs (+, %, =), and an electric gold speed bolt.
 */
export function BrandEmblem({ 
  size = 40, 
  className = '' 
}: { 
  size?: number; 
  className?: string;
}) {
  const rawId = React.useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9-_]/g, '');
  const bgId = `qtEmblemBg_${safeId}`;
  const lightningId = `qtLightningGrad_${safeId}`;
  const glassId = `qtGlassSheen_${safeId}`;
  const innerStrokeId = `qtInnerStroke_${safeId}`;
  const glowId = `qtBoltGlow_${safeId}`;

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300 ease-out ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg 
        viewBox="0 0 64 64" 
        width={size} 
        height={size} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md transition-transform duration-300 group-hover:rotate-1"
      >
        <defs>
          {/* Cosmic Royal-to-Violet Background Gradient */}
          <linearGradient id={bgId} x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="38%" stopColor="#6366F1" />
            <stop offset="72%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>

          {/* Electric Radiant Gold/Amber Lightning Gradient */}
          <linearGradient id={lightningId} x1="32" y1="20" x2="52" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="28%" stopColor="#FACC15" />
            <stop offset="68%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Glass Gloss Sheen Gradient */}
          <linearGradient id={glassId} x1="10" y1="4" x2="48" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Inner Border Specular Gradient */}
          <linearGradient id={innerStrokeId} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#A5B4FC" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow filter for lightning and neon accents */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#EA580C" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Outer Squircle Container */}
        <rect 
          x="3" 
          y="3" 
          width="58" 
          height="58" 
          rx="17" 
          fill={`url(#${bgId})`} 
        />

        {/* Specular Inner Stroke */}
        <rect 
          x="3.5" 
          y="3.5" 
          width="57" 
          height="57" 
          rx="16.5" 
          fill="none" 
          stroke={`url(#${innerStrokeId})`} 
          strokeWidth="1.2" 
        />

        {/* Upper Half Glass Reflection Curve */}
        <path 
          d="M 3.5 20 C 3.5 11 11 3.5 20 3.5 L 44 3.5 C 53 3.5 60.5 11 60.5 20 C 48 24 24 26 3.5 20 Z" 
          fill={`url(#${glassId})`} 
        />

        {/* Top Calculator Display Bar (Mini Digital HUD) */}
        <rect x="13" y="11.5" width="38" height="7.5" rx="3.75" fill="#090D1A" fillOpacity="0.5" />
        <rect x="15.5" y="13.2" width="7" height="4" rx="2" fill="#38BDF8" />
        <circle cx="27" cy="15.2" r="2" fill="#34D399" />
        <circle cx="33" cy="15.2" r="2" fill="#F43F5E" />
        <rect x="38" y="13.2" width="10.5" height="4" rx="2" fill="#F8FAFC" fillOpacity="0.85" />

        {/* Precision Math Glyph: Bold Plus (+) in Top-Left */}
        <path 
          d="M 22 26 L 22 34 M 18 30 L 26 30" 
          stroke="#FFFFFF" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Precision Math Glyph: Bold Percentage (%) in Mid-Left */}
        <circle cx="18" cy="42" r="2.2" fill="#E0E7FF" />
        <circle cx="25" cy="50" r="2.2" fill="#E0E7FF" />
        <path d="M 26 41 L 17 51" stroke="#E0E7FF" strokeWidth="2.2" strokeLinecap="round" />

        {/* Precision Math Glyph: Neon Equals (=) in Cyan */}
        <line x1="16" y1="56" x2="27" y2="56" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" opacity="0.9" />

        {/* Dynamic Electric Speed Bolt (Fast calculation engine) */}
        <path 
          d="M 44 24 L 32.5 39.5 L 40 39.5 L 36 53.5 L 51.5 35.5 L 43.5 35.5 Z" 
          fill={`url(#${lightningId})`} 
          stroke="#FFFFFF" 
          strokeWidth="1.2" 
          strokeLinejoin="round"
          filter={`url(#${glowId})`} 
        />

        {/* Core Electric Flash Highlight in Center of Bolt */}
        <path 
          d="M 42 27 L 35 38 L 40 38 L 38 47 L 46 36 L 41.5 36 Z" 
          fill="#FFFFFF" 
          fillOpacity="0.45" 
        />

        {/* Micro Spark / Energy Dot */}
        <circle cx="51" cy="23" r="1.5" fill="#FEF08A" />
      </svg>
    </div>
  );
}

/**
 * Full Brand Logo with Typographic Wordmark
 */
export function BrandLogo({
  size = 'md',
  showSubtitle = true,
  showBadge = true,
  inverted = false,
  className = '',
  iconOnly = false,
}: BrandLogoProps) {
  // Sizing configurations
  const config = {
    xs: {
      iconSize: 28,
      titleClass: 'text-base font-extrabold tracking-tight',
      badgeClass: 'text-[9px] px-1.5 py-0.2',
      subClass: 'text-[10px]',
    },
    sm: {
      iconSize: 32,
      titleClass: 'text-lg font-extrabold tracking-tight',
      badgeClass: 'text-[9px] px-1.5 py-0.5',
      subClass: 'text-[10px]',
    },
    md: {
      iconSize: 38,
      titleClass: 'text-lg sm:text-xl font-extrabold tracking-tight',
      badgeClass: 'text-[10px] px-2 py-0.5',
      subClass: 'text-[11px]',
    },
    lg: {
      iconSize: 44,
      titleClass: 'text-xl sm:text-2xl font-black tracking-tight',
      badgeClass: 'text-[11px] px-2 py-0.5',
      subClass: 'text-xs',
    },
    xl: {
      iconSize: 52,
      titleClass: 'text-2xl sm:text-3xl font-black tracking-tight',
      badgeClass: 'text-xs px-2.5 py-1',
      subClass: 'text-sm',
    }
  }[size];

  if (iconOnly) {
    return <BrandEmblem size={config.iconSize} className={className} />;
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Brand Icon Emblem */}
      <BrandEmblem size={config.iconSize} />

      {/* Brand Typography & Lockup */}
      <div className="min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`${config.titleClass} flex items-center leading-none`}>
            {/* "Quick" with energetic gradient */}
            <span className={
              inverted 
                ? "text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-amber-200 to-yellow-400 font-black"
                : "text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-indigo-700 to-violet-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-300 font-black"
            }>
              Quick
            </span>
            {/* "Tools" in solid high-contrast */}
            <span className={inverted ? "text-white font-extrabold" : "text-slate-900 dark:text-white font-extrabold"}>
              Tools
            </span>
          </span>

          {/* Free / Pro Instant Badge */}
          {showBadge && (
            <span 
              className={`font-bold uppercase tracking-wider rounded-full shrink-0 ${config.badgeClass} ${
                inverted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60'
              }`}
            >
              Free
            </span>
          )}
        </div>

        {/* Subtitle / Brand Promise */}
        {showSubtitle && (
          <p 
            className={`font-medium truncate -mt-0.5 sm:mt-0.5 ${config.subClass} ${
              inverted 
                ? 'text-slate-400' 
                : 'text-slate-500 dark:text-slate-400 hidden sm:block'
            }`}
          >
            Fast Online Tools & Daily Utilities
          </p>
        )}
      </div>
    </div>
  );
}
