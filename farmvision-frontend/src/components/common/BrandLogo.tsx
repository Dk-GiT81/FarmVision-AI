import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 22, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brandGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Pomegranate Silhouette Body */}
      <path
        d="M12 21.5C6.75 21.5 2.5 17.25 2.5 12C2.5 7.5 5.5 3.75 9.75 2.8L10.5 4.5C11 4.3 11.5 4.2 12 4.2C12.5 4.2 13 4.3 13.5 4.5L14.25 2.8C18.5 3.75 21.5 7.5 21.5 12C21.5 17.25 17.25 21.5 12 21.5Z"
        fill="url(#brandGrad)"
      />
      {/* Precision Leaf Accent */}
      <path
        d="M12 2C14.5 1.5 17 2.5 18 5C15.5 5.5 13 4.5 12 2Z"
        fill="#10b981"
      />
      {/* Inner Diagnostic Focal Reticle */}
      <circle cx="12" cy="13" r="3.5" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 1.5" opacity="0.9" />
      <circle cx="12" cy="13" r="1.2" fill="#ffffff" />
    </svg>
  );
};

export default BrandLogo;
