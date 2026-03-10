'use client';

import Image from 'next/image';
import { useState } from 'react';

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className,
  fill = false,
  sizes,
  width,
  height
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        onError={() => {
          if (fallbackSrc && imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
        }}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width ?? 320}
      height={height ?? 180}
      className={className}
      onError={() => {
        if (fallbackSrc && imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}
