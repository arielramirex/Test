'use client';

import { useState } from 'react';
import { IslandCard } from '@/components/layout/IslandCard';
import { seasonalData } from '@/src/data/seasonal';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { SectionHero } from '@/components/ui/SectionHero';
import { critterData } from '@/src/data/critters';

export default function SeasonalPage() {
  const [month, setMonth] = useState(seasonalData[0]?.month ?? 'January');
  const current = seasonalData.find((entry) => entry.month === month) ?? seasonalData[0];
  const featuredCatches = critterData
    .filter((entry) => entry.monthsNorth.includes(month.slice(0, 3)))
    .sort((a, b) => b.sellPrice - a.sellPrice)
    .slice(0, 3)
    .map((entry) => `${entry.name} (${entry.sellPrice.toLocaleString()} bells)`);

  return (
    <main className="page-shell space-y-4">
      <SectionHero
        label="Isabelle Board"
        tint="#ffd6a6"
        title="Seasonal Dashboard"
        subtitle="Monthly planner for critters, events, and featured island items."
      />

      <IslandCard title="Month Selector" subtitle="Track seasonal changes quickly">
        <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={month} onChange={(event) => setMonth(event.target.value)}>
          {seasonalData.map((entry) => (
            <option key={entry.month} value={entry.month}>{entry.month}</option>
          ))}
        </select>
      </IslandCard>

      <IslandCard title={`${current.month} Highlights`}>
        <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-start">
          <div className="relative h-36 overflow-hidden rounded-2xl">
            <ImageWithFallback
              src="/images/home/seasonal-dashboard.svg"
              fallbackSrc="/images/home/spring-featured.svg"
              alt="Seasonal dashboard thumbnail"
              fill
              className="object-cover"
              sizes="180px"
            />
          </div>
          <div className="grid gap-3 text-sm">
            <div className="rounded-2xl bg-mint/60 p-3 dark:bg-slate-800">
              <p className="font-bold">New Critters</p>
              <p>{current.newCritters.join(', ')}</p>
            </div>
            <div className="rounded-2xl bg-sand/70 p-3 dark:bg-slate-800">
              <p className="font-bold">Leaving Critters</p>
              <p>{current.leavingCritters.join(', ')}</p>
            </div>
            <div className="rounded-2xl bg-sky/60 p-3 dark:bg-slate-800">
              <p className="font-bold">Featured Items</p>
              <p>{current.featuredItems.join(', ')}</p>
            </div>
            <div className="rounded-2xl bg-emerald-100/80 p-3 dark:bg-slate-800">
              <p className="font-bold">Featured High-Value Catches</p>
              <p>{featuredCatches.join(', ') || 'No special catches listed.'}</p>
            </div>
            <div className="rounded-2xl bg-rose-100/80 p-3 dark:bg-slate-800">
              <p className="font-bold">Events</p>
              <p>{current.events.join(', ')}</p>
            </div>
          </div>
        </div>
      </IslandCard>
    </main>
  );
}
