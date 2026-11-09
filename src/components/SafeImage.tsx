import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-[16/10]", "aspect-square"
  fallbackInitials?: string;
  fallbackGradient?: 'sunrise' | 'lagoon' | 'ink' | 'neutral';
}

export function SafeImage({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[16/10]',
  fallbackInitials,
  fallbackGradient = 'sunrise',
}: SafeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Gradient styles for graceful fallback
  const gradientMap = {
    sunrise: 'from-[#FF5F45] via-[#FF8A3D] to-[#FFC04D]',
    lagoon: 'from-[#0EA5A0] to-[#22C3B5]',
    ink: 'from-[#0E1A2B] to-[#3B4A5E]',
    neutral: 'from-[#ECE6DC] to-[#FAF7F2]',
  };

  // Generate 2 initials if provided
  const initials = fallbackInitials
    ? fallbackInitials
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : alt
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'TJ';

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-[#ECE6DC]/40`}>
      {/* Shimmer skeleton while loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-shimmer z-10" />
      )}

      {/* Actual image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Graceful Fallback on error */}
      {hasError && (
        <div
          className={`w-full h-full bg-gradient-to-br ${gradientMap[fallbackGradient]} flex flex-col items-center justify-center p-3 text-white select-none`}
        >
          <span className="font-bold text-lg tracking-wider drop-shadow-sm font-editorial">
            {initials}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/80 mt-1 line-clamp-1 text-center font-medium">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}
