'use client';

import { useMemo, useState } from 'react';
import critterData from '@/data/critters.json';
import type { Critter } from '@/lib/types';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { CharacterPlaceholder } from '@/components/ui/CharacterPlaceholder';

const critters = critterData as Critter[];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SeasonalPage() {
  const [month, setMonth] = useState(1);

  const list = useMemo(() => critters.filter((entry) => entry.months.includes(month)).sort((a, b) => b.price - a.price), [month]);

  return (
    <main className="page-shell space-y-4">
      <header className="wood-header">
        <div className="mb-2">
          <CharacterPlaceholder label="Isabelle Board" tint="#ffd6a6" />
        </div>
        <h1 className="text-2xl font-extrabold">Isabelle-Inspired Seasonal Dashboard</h1>
        <p className="text-sm text-cream/90">Planner board for monthly catches and value windows.</p>
      </header>

      <IslandCard title="Monthly Snapshot">
        <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={month} onChange={(event) => setMonth(Number(event.target.value))}>
          {monthNames.map((name, index) => (
            <option key={name} value={index + 1}>{name}</option>
          ))}
        </select>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {list.map((entry) => (
            <article key={entry.id} className="rounded-2xl bg-white/80 p-3 shadow-float dark:bg-slate-900/70">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-bold">{entry.name}</p>
                <LeafBadge label={entry.rarity === 'rare' ? 'Rare' : 'Common'} tone={entry.rarity === 'rare' ? 'good' : 'default'} />
              </div>
              <p className="text-sm">{entry.price.toLocaleString()} bells</p>
              <p className="text-sm capitalize">{entry.type}</p>
            </article>
          ))}
        </div>
      </IslandCard>
    </main>
  );
}
