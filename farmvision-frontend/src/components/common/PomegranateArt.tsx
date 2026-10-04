import React from 'react';

export const PomegranateArt: React.FC<{ size?: number; className?: string }> = ({
  size = 280,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 15px 30px rgba(185, 28, 28, 0.25))' }}
    >
      <defs>
        <radialGradient id="pomGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pomBodyGrad" x1="40" y1="30" x2="260" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="45%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id="pomCrownGrad" x1="140" y1="20" x2="180" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="seedGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="200" y1="30" x2="280" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Ambient background glow circle */}
      <circle cx="160" cy="160" r="140" fill="url(#pomGlow)" />

      {/* Green Leaves */}
      <path
        d="M170 65 C220 20 270 40 280 80 C270 120 210 110 170 65 Z"
        fill="url(#leafGrad)"
        opacity="0.95"
      />
      <path
        d="M170 65 Q230 70 280 80"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M165 60 C130 15 90 25 80 50 C85 85 130 80 165 60 Z"
        fill="url(#leafGrad)"
        opacity="0.85"
      />

      {/* Main Pomegranate Outer Silhouette */}
      <path
        d="M160 55 C168 40 175 35 185 30 L180 55 C190 42 200 40 205 38 L195 62 C255 75 285 135 280 200 C272 265 215 295 155 295 C90 295 40 255 40 185 C40 120 85 68 150 58 L142 35 C150 40 155 45 160 55 Z"
        fill="url(#pomBodyGrad)"
      />

      {/* Top Calyx / Crown */}
      <path
        d="M145 52 L150 30 L160 48 L175 26 L180 50 L195 32 L192 56 Z"
        fill="url(#pomCrownGrad)"
      />

      {/* Glossy Light Reflection Highlight */}
      <path
        d="M75 125 C65 155 68 190 85 220"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M95 105 C115 85 145 75 175 75"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Cut Opening Window showing glistening seeds */}
      <path
        d="M140 125 C205 110 255 155 245 225 C235 270 175 280 135 255 C105 235 110 180 140 125 Z"
        fill="#4c0519"
      />
      <path
        d="M140 125 C195 115 245 155 240 220 C232 262 178 272 140 250 C115 232 118 178 140 125 Z"
        fill="#881337"
        opacity="0.8"
      />
      {/* Pomegranate inner membrane */}
      <path
        d="M145 140 C170 135 200 150 205 175 C190 205 160 215 145 140 Z"
        fill="#fff1f2"
        opacity="0.25"
      />

      {/* Glistening Ruby Seeds */}
      <ellipse cx="150" cy="155" rx="8" ry="10" transform="rotate(-20 150 155)" fill="url(#seedGrad1)" />
      <circle cx="148" cy="153" r="2" fill="#ffffff" opacity="0.8" />

      <ellipse cx="168" cy="150" rx="9" ry="11" transform="rotate(15 168 150)" fill="url(#seedGrad1)" />
      <circle cx="166" cy="147" r="2.5" fill="#ffffff" opacity="0.8" />

      <ellipse cx="188" cy="155" rx="8" ry="10" transform="rotate(35 188 155)" fill="url(#seedGrad1)" />
      <circle cx="186" cy="153" r="2" fill="#ffffff" opacity="0.8" />

      <ellipse cx="155" cy="178" rx="9" ry="11" transform="rotate(-10 155 178)" fill="url(#seedGrad1)" />
      <circle cx="153" cy="175" r="2" fill="#ffffff" opacity="0.8" />

      <ellipse cx="176" cy="175" rx="10" ry="12" transform="rotate(25 176 175)" fill="url(#seedGrad1)" />
      <circle cx="174" cy="172" r="2.5" fill="#ffffff" opacity="0.85" />

      <ellipse cx="198" cy="176" rx="8" ry="10" transform="rotate(40 198 176)" fill="url(#seedGrad1)" />
      <circle cx="196" cy="174" r="2" fill="#ffffff" opacity="0.8" />

      <ellipse cx="218" cy="180" rx="8" ry="9" transform="rotate(20 218 180)" fill="url(#seedGrad1)" />
      <circle cx="216" cy="178" r="2" fill="#ffffff" opacity="0.75" />

      <ellipse cx="145" cy="202" rx="9" ry="11" transform="rotate(-30 145 202)" fill="url(#seedGrad1)" />
      <circle cx="143" cy="199" r="2" fill="#ffffff" opacity="0.8" />

      <ellipse cx="166" cy="200" rx="10" ry="12" transform="rotate(5 166 200)" fill="url(#seedGrad1)" />
      <circle cx="164" cy="197" r="2.5" fill="#ffffff" opacity="0.85" />

      <ellipse cx="188" cy="202" rx="9" ry="11" transform="rotate(30 188 202)" fill="url(#seedGrad1)" />
      <circle cx="186" cy="199" r="2" fill="#ffffff" opacity="0.8" />

      <ellipse cx="208" cy="202" rx="8" ry="10" transform="rotate(45 208 202)" fill="url(#seedGrad1)" />
      <circle cx="206" cy="200" r="2" fill="#ffffff" opacity="0.75" />

      <ellipse cx="152" cy="226" rx="9" ry="11" transform="rotate(-15 152 226)" fill="url(#seedGrad1)" />
      <circle cx="150" cy="223" r="2" fill="#ffffff" opacity="0.8" />

      <ellipse cx="174" cy="225" rx="10" ry="12" transform="rotate(15 174 225)" fill="url(#seedGrad1)" />
      <circle cx="172" cy="222" r="2.5" fill="#ffffff" opacity="0.85" />

      <ellipse cx="196" cy="226" rx="9" ry="11" transform="rotate(35 196 226)" fill="url(#seedGrad1)" />
      <circle cx="194" cy="223" r="2" fill="#ffffff" opacity="0.8" />

      <ellipse cx="162" cy="248" rx="8" ry="10" transform="rotate(5 162 248)" fill="url(#seedGrad1)" />
      <circle cx="160" cy="246" r="2" fill="#ffffff" opacity="0.75" />

      <ellipse cx="184" cy="248" rx="8" ry="10" transform="rotate(25 184 248)" fill="url(#seedGrad1)" />
      <circle cx="182" cy="246" r="2" fill="#ffffff" opacity="0.75" />
    </svg>
  );
};

export default PomegranateArt;

