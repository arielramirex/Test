'use client';

import { useMemo, useState } from 'react';
import villagerData from '@/data/villagers.json';
import type { Villager } from '@/lib/types';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { CharacterPlaceholder } from '@/components/ui/CharacterPlaceholder';

const villagers = villagerData as Villager[];

export default function VillagersPage() {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sorted = useMemo(() => {
    return villagers.slice().sort((a, b) => (sortOrder === 'desc' ? b.popularity - a.popularity : a.popularity - b.popularity));
  }, [sortOrder]);

  return (
    <main className="page-shell space-y-4">
      <header className="wood-header">
        <div className="mb-2">
          <CharacterPlaceholder label="Village Radar" tint="#e5cbff" />
        </div>
        <h1 className="text-2xl font-extrabold">Villager Popularity Board</h1>
        <p className="text-sm text-cream/90">Stylized community ranking for top villagers.</p>
      </header>

      <IslandCard title="Popularity Rankings">
        <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'desc' | 'asc')}>
          <option value="desc">Highest to lowest</option>
          <option value="asc">Lowest to highest</option>
        </select>

        <div className="mt-3 grid gap-2">
          {sorted.map((villager) => (
            <article key={villager.id} className="rounded-2xl bg-white/80 p-3 shadow-float dark:bg-slate-900/70">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="font-bold">{villager.name}</p>
                <LeafBadge label={`Score ${villager.popularity}`} tone="default" />
              </div>
              <p className="text-sm">{villager.species} | {villager.personality}</p>
            </article>
          ))}
        </div>
      </IslandCard>
    </main>
  );
}
