'use client';

import { useMemo, useState } from 'react';
import critterData from '@/data/critters.json';
import type { Critter } from '@/lib/types';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { CharacterPlaceholder } from '@/components/ui/CharacterPlaceholder';

const critters = critterData as Critter[];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CritterPage() {
  const [month, setMonth] = useState<number | 'all'>('all');

  const sorted = useMemo(() => {
    const monthFiltered = month === 'all' ? critters : critters.filter((item) => item.months.includes(month));
    return monthFiltered.slice().sort((a, b) => b.price - a.price);
  }, [month]);

  return (
    <main className="page-shell space-y-4">
      <header className="wood-header">
        <div className="mb-2">
          <CharacterPlaceholder label="Blathers + CJ" tint="#bfe5ff" />
        </div>
        <h1 className="text-2xl font-extrabold">Blathers/CJ Critter Price Guide</h1>
        <p className="text-sm text-cream/90">Track high-value catches and seasonal windows.</p>
      </header>

      <IslandCard title="Price Board" subtitle="Sorted by bells value">
        <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={month} onChange={(event) => setMonth(event.target.value === 'all' ? 'all' : Number(event.target.value))}>
          <option value="all">All months</option>
          {monthNames.map((monthName, index) => (
            <option key={monthName} value={index + 1}>{monthName}</option>
          ))}
        </select>

        <div className="mt-3 grid gap-2">
          {sorted.map((critter) => (
            <article key={critter.id} className="rounded-2xl bg-white/80 p-3 shadow-float dark:bg-slate-900/70">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-bold">{critter.name}</p>
                <LeafBadge label={critter.rarity === 'rare' ? 'Rare' : 'Common'} tone={critter.rarity === 'rare' ? 'good' : 'default'} />
              </div>
              <p className="text-sm capitalize">Type: {critter.type}</p>
              <p className="text-sm">Price: {critter.price.toLocaleString()} bells</p>
              <p className="text-sm">Months: {critter.months.map((value) => monthNames[value - 1]).join(', ')}</p>
            </article>
          ))}
        </div>
      </IslandCard>
    </main>
  );
}
