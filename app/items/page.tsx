'use client';

import { useMemo, useState } from 'react';
import itemData from '@/data/items.json';
import type { ItemValue } from '@/lib/types';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { CharacterPlaceholder } from '@/components/ui/CharacterPlaceholder';

const items = itemData as ItemValue[];

export default function ItemsPage() {
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => ['all', ...Array.from(new Set(items.map((item) => item.category)))], []);
  const filtered = useMemo(() => {
    const byCategory = category === 'all' ? items : items.filter((item) => item.category === category);
    return byCategory.slice().sort((a, b) => b.price - a.price);
  }, [category]);

  return (
    <main className="page-shell space-y-4">
      <header className="wood-header">
        <div className="mb-2">
          <CharacterPlaceholder label="Tom Nook Picks" tint="#f6d39b" />
        </div>
        <h1 className="text-2xl font-extrabold">Tom Nook-Inspired High Value Items</h1>
        <p className="text-sm text-cream/90">Curated static list of expensive catalog items.</p>
      </header>

      <IslandCard title="Item Value Board">
        <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((value) => <option key={value} value={value}>{value === 'all' ? 'All categories' : value}</option>)}
        </select>

        <div className="mt-3 grid gap-2">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-2xl bg-white/80 p-3 shadow-float dark:bg-slate-900/70">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="font-bold">{item.name}</p>
                <LeafBadge label={item.rarity === 'premium' ? 'Premium' : item.rarity === 'rare' ? 'Rare' : 'Popular'} tone={item.rarity === 'rare' ? 'alert' : 'good'} />
              </div>
              <p className="text-sm">Category: {item.category}</p>
              <p className="text-sm">Price: {item.price.toLocaleString()} bells</p>
            </article>
          ))}
        </div>
      </IslandCard>
    </main>
  );
}
