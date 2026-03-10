import { ImageWithFallback } from './ImageWithFallback';

export function ThumbnailImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-800/70 ${className}`}>
      <ImageWithFallback
        src={src}
        fallbackSrc="/images/home/seasonal-dashboard.svg"
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  );
}
