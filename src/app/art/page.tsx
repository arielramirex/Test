'use client';

import { useMemo, useState } from 'react';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { artData } from '@/src/data/art';
import { SectionHero } from '@/components/ui/SectionHero';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export default function ArtPage() {
  const [category, setCategory] = useState<'All' | 'Painting' | 'Statue'>('All');
  const [showOnlyFakeVariants, setShowOnlyFakeVariants] = useState(false);

  const filtered = useMemo(() => {
    return artData.filter((entry) => {
      const matchesCategory = category === 'All' || entry.category === category;
      const matchesFakeToggle = showOnlyFakeVariants ? !entry.alwaysReal : true;
      return matchesCategory && matchesFakeToggle;
    });
  }, [category, showOnlyFakeVariants]);

  return (
    <main className="page-shell space-y-4">
      <SectionHero
        label="Redd Vibes"
        tint="#ffe08f"
        title="Redd Art Comparison Guide"
        subtitle="Side-by-side real vs fake references with quick authenticity badges."
      />

      <IslandCard title="Art Filters" subtitle="Compare paintings and statues">
        <FilterBar>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={category} onChange={(event) => setCategory(event.target.value as 'All' | 'Painting' | 'Statue')}>
            <option value="All">All Categories</option>
            <option value="Painting">Painting</option>
            <option value="Statue">Statue</option>
          </select>
          <label className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
            <input type="checkbox" checked={showOnlyFakeVariants} onChange={(event) => setShowOnlyFakeVariants(event.target.checked)} />
            Has fake only
          </label>
        </FilterBar>
      </IslandCard>

      <section className="grid gap-3">
        {filtered.length ? (
          filtered.map((entry) => (
            <article key={entry.id} className="rounded-island bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold">{entry.name}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-200">{entry.category}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entry.alwaysReal ? <LeafBadge label="Always Real" tone="good" /> : <LeafBadge label="Fake Exists" tone="alert" />}
                  {entry.haunted ? <LeafBadge label="Haunted" tone="alert" /> : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-2 dark:bg-emerald-950/30">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Real</p>
                  <div className="relative h-36 overflow-hidden rounded-xl">
                    <ImageWithFallback src={entry.realImage} fallbackSrc="/images/art/real.svg" alt={`${entry.name} real`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                </div>
                <div className="rounded-2xl bg-rose-50 p-2 dark:bg-rose-950/30">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-200">Fake</p>
                  <div className="relative h-36 overflow-hidden rounded-xl">
                    <ImageWithFallback src={entry.fakeImage} fallbackSrc="/images/art/fake.svg" alt={`${entry.name} fake`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm"><span className="font-bold">Difference:</span> {entry.differenceDescription}</p>
            </article>
          ))
        ) : (
          <EmptyState title="No art entries found" description="Try selecting a broader category or disable the fake-only filter." />
        )}
      </section>
    </main>
  );
}
