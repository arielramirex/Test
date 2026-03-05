'use client';

import { useMemo, useState } from 'react';
import artData from '@/data/art.json';
import type { ArtItem } from '@/lib/types';
import { IslandCard } from '@/components/layout/IslandCard';
import { SpeechBubbleCard } from '@/components/ui/SpeechBubbleCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { CharacterPlaceholder } from '@/components/ui/CharacterPlaceholder';

const artItems = artData as ArtItem[];

export default function ArtPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'real' | 'fake'>('all');

  const filtered = useMemo(() => {
    return artItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (filter === 'fake') return item.hasFake;
      return true;
    });
  }, [search, filter]);

  return (
    <main className="page-shell space-y-4">
      <header className="wood-header">
        <div className="mb-2">
          <CharacterPlaceholder label="Redd Vibes" tint="#ffe08f" />
        </div>
        <h1 className="text-2xl font-extrabold">Redd-Inspired Art Guide</h1>
        <p className="text-sm text-cream/90">Stylized market board to compare genuine and fake variants.</p>
      </header>

      <IslandCard title="Art Lookup">
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Search artwork" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={filter} onChange={(event) => setFilter(event.target.value as 'all' | 'real' | 'fake')}>
            <option value="all">All</option>
            <option value="real">Real + Fake Notes</option>
            <option value="fake">Only Art With Fake Variants</option>
          </select>
        </div>
        <div className="mt-3 grid gap-2">
          {filtered.map((item) => (
            <SpeechBubbleCard key={item.id}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-bold">{item.name}</p>
                {item.hasFake ? <LeafBadge label="Fake Exists" tone="alert" /> : <LeafBadge label="Always Real" tone="good" />}
              </div>
              <p className="text-sm"><span className="font-bold">Real:</span> {item.realHint}</p>
              <p className="text-sm"><span className="font-bold">Fake:</span> {item.fakeHint}</p>
            </SpeechBubbleCard>
          ))}
        </div>
      </IslandCard>
    </main>
  );
}
