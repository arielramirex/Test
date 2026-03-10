import { ThumbnailImage } from './ThumbnailImage';

export function DataCard({
  title,
  subtitle,
  image,
  badges,
  children
}: {
  title: string;
  subtitle?: string;
  image: string;
  badges?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <article className="rounded-island bg-white/85 p-3 shadow-float dark:bg-slate-900/75">
      <div className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-start">
        <ThumbnailImage src={image} alt={title} className="h-28 w-full sm:h-24" />
        <div>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-extrabold">{title}</h3>
            {badges}
          </div>
          {subtitle ? <p className="text-sm text-slate-600 dark:text-slate-200">{subtitle}</p> : null}
          {children ? <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">{children}</div> : null}
        </div>
      </div>
    </article>
  );
}
