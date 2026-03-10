'use client';

import { useMemo, useState } from 'react';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { DataCard } from '@/components/ui/DataCard';
import { highValueItems } from '@/src/data/items';
import { SectionHero } from '@/components/ui/SectionHero';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ItemsPage() {
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort] = useState<'Price High-Low' | 'Price Low-High'>('Price High-Low');

  const categories = useMemo(() => ['All Categories', ...Array.from(new Set(highValueItems.map((item) => item.category)))], []);

  const filtered = useMemo(() => {
    const byCategory = category === 'All Categories' ? highValueItems : highValueItems.filter((item) => item.category === category);
    return byCategory.slice().sort((a, b) => (sort === 'Price High-Low' ? b.sellPrice - a.sellPrice : a.sellPrice - b.sellPrice));
  }, [category, sort]);

  const topEarning = useMemo(() => highValueItems.slice().sort((a, b) => b.sellPrice - a.sellPrice).slice(0, 3), []);

  return (
    <main className="page-shell space-y-4">
      <SectionHero
        label="Tom Nook Picks"
        tint="#f6d39b"
        title="High Value Items"
        subtitle="Visual item cards with rarity and top bell highlights."
      />

      <IslandCard title="Top Earning Highlights">
        <div className="grid gap-2 sm:grid-cols-3">
          {topEarning.map((item) => (
            <div key={item.id} className="rounded-2xl bg-sand/70 p-3 text-sm dark:bg-slate-800">
              <p className="font-bold">{item.name}</p>
              <p>{item.sellPrice.toLocaleString()} bells</p>
            </div>
          ))}
        </div>
      </IslandCard>

      <IslandCard title="Item Filters" subtitle="Sort premium catalog picks">
        <FilterBar>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={sort} onChange={(event) => setSort(event.target.value as 'Price High-Low' | 'Price Low-High')}>
            <option value="Price High-Low">Price High-Low</option>
            <option value="Price Low-High">Price Low-High</option>
          </select>
        </FilterBar>
      </IslandCard>

      <section className="grid gap-3 sm:grid-cols-2">
        {filtered.length ? (
          filtered.map((item) => (
            <DataCard
              key={item.id}
              title={item.name}
              subtitle={`${item.category} | Source: ${item.source}`}
              image={item.image}
              badges={<LeafBadge label={item.rarity} tone={item.rarity === 'Very Rare' ? 'good' : 'default'} />}
            >
              <p><span className="font-bold">Sell Price:</span> {item.sellPrice.toLocaleString()} bells</p>
            </DataCard>
          ))
        ) : (
          <EmptyState title="No items match your filters" description="Try changing the category or sort order." />
        )}
      </section>
    </main>
  );
}
