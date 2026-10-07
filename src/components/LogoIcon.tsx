import React from "react";

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

export default function LogoIcon({
  className = "w-8 h-8",
  size,
  ...props
}: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      fill="none"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="D Logo"
      {...props}
    >
      <defs>
        {/* Deep Space Navy Background Gradient */}
        <linearGradient id="logoBg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0c233c" />
          <stop offset="55%" stopColor="#071524" />
          <stop offset="100%" stopColor="#030811" />
        </linearGradient>

        {/* Glowing Cybernetic Cyan Border */}
        <linearGradient id="logoBorder" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#7cb8e8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1b4c78" stopOpacity="0.75" />
        </linearGradient>

        {/* Liquid Chrome Silk Gradient for Glyph D */}
        <linearGradient id="logoGlyph" x1="26" y1="22" x2="104" y2="106" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="18%" stopColor="#e0f2fe" />
          <stop offset="42%" stopColor="#7dd3fc" />
          <stop offset="72%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Core Ambient Cyan Bloom */}
        <radialGradient id="logoCoreGlow" cx="64" cy="64" r="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>

        {/* Inner Counter Dark Dimension Depth */}
        <linearGradient id="logoCounterDepth" x1="46" y1="42" x2="86" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#040d18" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0a2038" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Squircle Base with Smooth 30px Radius */}
      <rect
        x="3"
        y="3"
        width="122"
        height="122"
        rx="30"
        fill="url(#logoBg)"
        stroke="url(#logoBorder)"
        strokeWidth="2.5"
      />

      {/* Radial Core Atmosphere Bloom */}
      <circle cx="64" cy="64" r="48" fill="url(#logoCoreGlow)" />

      {/* The Architectural Monogram D */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M 38 24
          H 68
          C 87.8823 24 104 40.1177 104 60
          V 68
          C 104 87.8823 87.8823 104 68 104
          H 34
          C 30.6863 104 28 101.314 28 98
          V 34
          C 28 31.8783 29.117 29.9189 30.9289 28.107
          L 34.5 24.5355
          C 35.4378 24.1925 36.6863 24 38 24
          Z
          M 46 46
          C 46 43.7909 47.7909 42 50 42
          H 66
          C 77.0457 42 86 50.9543 86 62
          V 66
          C 86 77.0457 77.0457 86 66 86
          H 50
          C 47.7909 86 46 84.2091 46 82
          V 46
          Z
        "
        fill="url(#logoGlyph)"
      />

      {/* Inner Counter Depth & Recess */}
      <path
        d="
          M 46 46
          C 46 43.7909 47.7909 42 50 42
          H 66
          C 77.0457 42 86 50.9543 86 62
          V 66
          C 86 77.0457 77.0457 86 66 86
          H 50
          C 47.7909 86 46 84.2091 46 82
          V 46
          Z
        "
        fill="url(#logoCounterDepth)"
      />

      {/* Liquid Chrome Top Rim Highlight */}
      <path
        d="M 38 25.5 H 68 C 84 25.5 98 38.5 100 54"
        stroke="#ffffff"
        strokeOpacity="0.8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Spine Precision Tech Hairline */}
      <path
        d="M 33 36 L 33 93"
        stroke="#ffffff"
        strokeOpacity="0.32"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Inner Counter Luminous Cyan Crest */}
      <path
        d="M 48 43.5 H 66 C 76 43.5 84.5 51.5 84.5 62"
        stroke="#38bdf8"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
