'use client';

import { useState } from 'react';

export function HeroLogo({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex w-full max-w-[420px] flex-col items-center justify-center rounded-[1.6rem] bg-[linear-gradient(180deg,#f8e7c8_0%,#d9f3e4_100%)] px-6 py-5 text-center shadow-inner dark:bg-[linear-gradient(180deg,#2d4564_0%,#1c2c49_100%)]">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Nook</span>
        <span className="mt-1 text-3xl font-extrabold text-slate-800 dark:text-white sm:text-4xl">Companion</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="hero-logo-image"
      onError={() => setHasError(true)}
    />
  );
}
