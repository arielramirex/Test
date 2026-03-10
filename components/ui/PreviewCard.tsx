import { ThemedButton } from './ThemedButton';
import { ThumbnailImage } from './ThumbnailImage';

export function PreviewCard({
  href,
  image,
  title,
  description
}: {
  href: string;
  image: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-island bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <ThumbnailImage src={image} alt={title} className="h-36 w-full" />
      <h3 className="mt-3 text-lg font-extrabold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-200">{description}</p>
      <div className="mt-3">
        <ThemedButton href={href}>Open Guide</ThemedButton>
      </div>
    </article>
  );
}
