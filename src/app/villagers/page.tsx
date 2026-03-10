'use client';

import { useMemo, useState } from 'react';
import { IslandCard } from '@/components/layout/IslandCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { DataCard } from '@/components/ui/DataCard';
import { villagerData } from '@/src/data/villagers';
import { SectionHero } from '@/components/ui/SectionHero';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';

export default function VillagersPage() {
  const [species, setSpecies] = useState('All Species');
  const [personality, setPersonality] = useState('All Personalities');

  const speciesOptions = useMemo(() => ['All Species', ...Array.from(new Set(villagerData.map((entry) => entry.species)))], []);
  const personalityOptions = useMemo(() => ['All Personalities', ...Array.from(new Set(villagerData.map((entry) => entry.personality)))], []);

  const filtered = useMemo(() => {
    return villagerData.filter((entry) => {
      const matchesSpecies = species === 'All Species' || entry.species === species;
      const matchesPersonality = personality === 'All Personalities' || entry.personality === personality;
      return matchesSpecies && matchesPersonality;
    });
  }, [personality, species]);

  return (
    <main className="page-shell space-y-4">
      <SectionHero
        label="Village Radar"
        tint="#e5cbff"
        title="Villager Guide"
        subtitle="Portrait cards with species, personality, and popularity tier filters."
      />

      <IslandCard title="Villager Filters">
        <FilterBar>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={species} onChange={(event) => setSpecies(event.target.value)}>
            {speciesOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={personality} onChange={(event) => setPersonality(event.target.value)}>
            {personalityOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </FilterBar>
      </IslandCard>

      <section className="grid gap-3 sm:grid-cols-2">
        {filtered.length ? (
          filtered.map((villager) => (
            <DataCard
              key={villager.id}
              title={villager.name}
              subtitle={`${villager.species} | ${villager.personality}`}
              image={villager.image}
              badges={<LeafBadge label={villager.popularityTier} tone={villager.popularityTier === 'S Tier' ? 'good' : 'default'} />}
            >
              <p><span className="font-bold">Birthday:</span> {villager.birthday}</p>
              <p><span className="font-bold">Style:</span> {villager.style}</p>
            </DataCard>
          ))
        ) : (
          <EmptyState title="No villagers match those filters" description="Try selecting a different species or personality." />
        )}
      </section>
    </main>
  );
}
