import Link from 'next/link';

export function PastelButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-meadow px-4 py-2 text-sm font-bold text-slate-800 shadow-float transition hover:-translate-y-0.5 dark:bg-aurora dark:text-night"
    >
      {children}
    </Link>
  );
}