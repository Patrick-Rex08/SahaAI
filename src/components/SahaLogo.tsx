import React from 'react';

export const SahaLogo: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer soft shadow circle */}
      <defs>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Main speech bubble shape */}
      <path
        d="M50 10 C28 10 12 26 12 47 C12 59 17 69 26 76 L22 90 L38 83 C42 84 46 84 50 84 C72 84 88 68 88 47 C88 26 72 10 50 10 Z"
        fill="url(#purpleGrad)"
      />

      {/* Person head circle (white) */}
      <circle cx="50" cy="36" r="9" fill="white" />

      {/* Person body (white) */}
      <path
        d="M34 62 C34 52 41 47 50 47 C59 47 66 52 66 62 C66 64 64 66 62 66 L38 66 C36 66 34 64 34 62 Z"
        fill="white"
      />

      {/* Golden petal / wing on right */}
      <path
        d="M62 40 C72 40 80 48 80 58 C70 58 62 50 62 40 Z"
        fill="url(#yellowGrad)"
      />
    </svg>
  );
};
