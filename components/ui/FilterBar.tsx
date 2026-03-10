export function FilterBar({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2 rounded-2xl bg-white/65 p-2 dark:bg-slate-900/60 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
