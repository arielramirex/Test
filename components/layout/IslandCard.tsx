export function IslandCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="leaf-accent rounded-island bg-white/90 p-4 shadow-float backdrop-blur dark:bg-slate-900/80">
      <header className="mb-3">
        <h2 className="text-lg font-extrabold">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}