'use client';

import { useMemo, useState } from 'react';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { flowerBreedingData } from '@/src/data/flowers';
import { DataCard } from '@/components/ui/DataCard';
import { SectionHero } from '@/components/ui/SectionHero';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';

export default function FlowersPage() {
  const species = useMemo(() => ['All Species', ...Array.from(new Set(flowerBreedingData.map((entry) => entry.flowerSpecies)))], []);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('All Species');
  const [resultColor, setResultColor] = useState<string>('All Colors');

  const colorOptions = useMemo(() => ['All Colors', ...Array.from(new Set(flowerBreedingData.map((entry) => entry.resultColor)))], []);

  const filtered = useMemo(() => {
    return flowerBreedingData.filter((entry) => {
      const bySpecies = selectedSpecies === 'All Species' || entry.flowerSpecies === selectedSpecies;
      const byColor = resultColor === 'All Colors' || entry.resultColor === resultColor;
      return bySpecies && byColor;
    });
  }, [resultColor, selectedSpecies]);

  return (
    <main className="page-shell space-y-4">
      <SectionHero
        label="Leif Garden"
        tint="#c7f0bb"
        title="Flower Breeding Guide"
        subtitle="Filter hybrid recipes by species and result color with visual cards."
      />

      <IslandCard title="Breeding Filters" subtitle="Scan hybrids quickly">
        <FilterBar>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={selectedSpecies} onChange={(event) => setSelectedSpecies(event.target.value)}>
            {species.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={resultColor} onChange={(event) => setResultColor(event.target.value)}>
            {colorOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </FilterBar>
        <div className="mt-3 grid gap-2 rounded-2xl bg-sky/40 p-3 text-sm dark:bg-slate-800/70 sm:grid-cols-3">
          <p><span className="font-bold">Legend:</span> Parent A = rose badge</p>
          <p><span className="font-bold">Legend:</span> Parent B = amber badge</p>
          <p><span className="font-bold">Legend:</span> Result = green badge</p>
        </div>
      </IslandCard>

      <section className="grid gap-3">
        {filtered.length ? (
          filtered.map((entry) => (
            <DataCard
              key={entry.id}
              title={`${entry.flowerSpecies}: ${entry.resultColor}`}
              subtitle={`${entry.parentColor1} + ${entry.parentColor2}`}
              image={entry.image}
              badges={<LeafBadge label={`Chance ${entry.breedingChance}`} tone="good" />}
            >
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">{entry.parentColor1}</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">{entry.parentColor2}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">Result: {entry.resultColor}</span>
              </div>
            </DataCard>
          ))
        ) : (
          <EmptyState title="No flower hybrids found" description="Try a different species or result color filter." />
        )}
      </section>
    </main>
  );
}
