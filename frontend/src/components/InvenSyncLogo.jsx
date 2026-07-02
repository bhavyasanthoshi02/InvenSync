import React from 'react';

/**
 * InvenSyncLogo — the house/inventory SVG used in the LoadingScreen.
 * Drop-in replacement for the <Box> icon across the site.
 *
 * Props:
 *   size   — pixel size (default 32)
 *   color  — stroke/fill color (default "var(--accent)")
 *   style  — extra inline styles
 *   className — extra class names
 */
export default function InvenSyncLogo({ size = 32, color = 'var(--accent)', style = {}, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, ...style }}
      className={className}
      aria-label="InvenSync logo"
    >
      <path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12h6v10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="1.5" fill={color} />
    </svg>
  );
}
