'use client';

import { useMemo, useState } from 'react';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { critterData } from '@/src/data/critters';
import { DataCard } from '@/components/ui/DataCard';
import { SectionHero } from '@/components/ui/SectionHero';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';

const months = ['All Months', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CritterPage() {
  const [selectedType, setSelectedType] = useState<'All' | 'Fish' | 'Bug' | 'Sea Creature'>('All');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [sort, setSort] = useState<'Price High-Low' | 'Price Low-High'>('Price High-Low');

  const filtered = useMemo(() => {
    const byType = selectedType === 'All' ? critterData : critterData.filter((entry) => entry.type === selectedType);
    const byMonth = selectedMonth === 'All Months' ? byType : byType.filter((entry) => entry.monthsNorth.includes(selectedMonth));
    return byMonth.slice().sort((a, b) => (sort === 'Price High-Low' ? b.sellPrice - a.sellPrice : a.sellPrice - b.sellPrice));
  }, [selectedMonth, selectedType, sort]);

  const highValue = useMemo(() => filtered.slice().sort((a, b) => b.sellPrice - a.sellPrice).slice(0, 3), [filtered]);

  return (
    <main className="page-shell space-y-4">
      <SectionHero
        label="Blathers + CJ"
        tint="#bfe5ff"
        title="Critter Price Guide"
        subtitle="Fish, bugs, and sea creatures with image thumbnails, rarity tags, and month filters."
      />

      <IslandCard title="Critter Filters" subtitle="Sort by bells and availability">
        <div className="mb-2 flex flex-wrap gap-2">
          {(['All', 'Fish', 'Bug', 'Sea Creature'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedType(tab)}
              className={`rounded-full px-3 py-1 text-sm font-bold transition ${selectedType === tab ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <FilterBar>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={selectedType} onChange={(event) => setSelectedType(event.target.value as 'All' | 'Fish' | 'Bug' | 'Sea Creature')}>
            <option value="All">All Types</option>
            <option value="Fish">Fish</option>
            <option value="Bug">Bugs</option>
            <option value="Sea Creature">Sea Creatures</option>
          </select>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={sort} onChange={(event) => setSort(event.target.value as 'Price High-Low' | 'Price Low-High')}>
            <option value="Price High-Low">Price High-Low</option>
            <option value="Price Low-High">Price Low-High</option>
          </select>
        </FilterBar>
      </IslandCard>

      <IslandCard title="High-Value Highlights">
        <div className="grid gap-2 sm:grid-cols-3">
          {highValue.map((entry) => (
            <div key={entry.id} className="rounded-2xl bg-sand/70 p-3 text-sm dark:bg-slate-800">
              <p className="font-bold">{entry.name}</p>
              <p>{entry.sellPrice.toLocaleString()} bells</p>
            </div>
          ))}
        </div>
      </IslandCard>

      <section className="grid gap-3">
        {filtered.length ? (
          filtered.map((entry) => (
            <DataCard
              key={entry.id}
              title={entry.name}
              subtitle={`${entry.type} | ${entry.location}`}
              image={entry.image}
              badges={<LeafBadge label={entry.rarity} tone={entry.rarity === 'Common' ? 'default' : 'good'} />}
            >
              <p><span className="font-bold">Sell Price:</span> {entry.sellPrice.toLocaleString()} bells</p>
              <p><span className="font-bold">Time:</span> {entry.timeAvailable}</p>
              <p><span className="font-bold">North Months:</span> {entry.monthsNorth.join(', ')}</p>
              <p><span className="font-bold">Weather:</span> {entry.weather}</p>
              <p><span className="font-bold">Shadow Size:</span> {entry.shadowSize}</p>
            </DataCard>
          ))
        ) : (
          <EmptyState title="No critters match your filters" description="Try selecting a different month, category, or price sort." />
        )}
      </section>
    </main>
  );
}
