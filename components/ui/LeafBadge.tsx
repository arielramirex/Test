export function LeafBadge({ label, tone = 'default' }: { label: string; tone?: 'default' | 'good' | 'alert' }) {
  const toneClass =
    tone === 'good'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
      : tone === 'alert'
        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
        : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${toneClass}`}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M13 2c-4.4 1.1-8 4.7-9 9 3.3-.9 5.6-1 8-.1-1.1 1.5-1.7 3.3-1.8 5.3 2.9-.4 5.2-1.7 7-4.1 1.7-2.5 2.2-5.2 1.8-8.1-1.8.1-3.7.6-6 2.9z" />
      </svg>
      {label}
    </span>
  );
}