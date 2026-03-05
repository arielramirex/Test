'use client';

import { useMemo, useState } from 'react';
import artData from '@/data/art.json';
import crittersData from '@/data/critters.json';
import flowersData from '@/data/flowers.json';
import villagersData from '@/data/villagers.json';
import type { ArtItem, Critter, FlowerRecipe, Villager } from '@/lib/types';
import { Card } from '@/components/Card';
import { DarkModeToggle } from '@/components/DarkModeToggle';

const artItems = artData as ArtItem[];
const critters = crittersData as Critter[];
const flowerRecipes = flowersData as FlowerRecipe[];
const villagers = villagersData as Villager[];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Home() {
  const [artSearch, setArtSearch] = useState('');
  const [artFilter, setArtFilter] = useState<'all' | 'real' | 'fake'>('all');
  const [compareA, setCompareA] = useState(artItems[0]?.id ?? '');
  const [compareB, setCompareB] = useState(artItems[1]?.id ?? '');

  const [critterMonth, setCritterMonth] = useState<number | 'all'>('all');
  const [critterSort, setCritterSort] = useState<'desc' | 'asc'>('desc');

  const flowerColors = useMemo(
    () => Array.from(new Set(flowerRecipes.flatMap((recipe) => [recipe.parentA, recipe.parentB]))),
    []
  );
  const [parentA, setParentA] = useState(flowerColors[0] ?? '');
  const [parentB, setParentB] = useState(flowerColors[1] ?? '');

  const [villagerSort, setVillagerSort] = useState<'desc' | 'asc'>('desc');
  const [seasonMonth, setSeasonMonth] = useState(new Date().getMonth() + 1);

  const filteredArt = useMemo(() => {
    return artItems.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(artSearch.toLowerCase());
      if (!nameMatch) return false;
      if (artFilter === 'real') return true;
      if (artFilter === 'fake') return item.hasFake;
      return true;
    });
  }, [artFilter, artSearch]);

  const compareArtA = artItems.find((item) => item.id === compareA);
  const compareArtB = artItems.find((item) => item.id === compareB);

  const filteredCritters = useMemo(() => {
    const byMonth =
      critterMonth === 'all' ? critters : critters.filter((critter) => critter.months.includes(critterMonth));

    return byMonth.slice().sort((a, b) => (critterSort === 'desc' ? b.price - a.price : a.price - b.price));
  }, [critterMonth, critterSort]);

  const hybridResults = useMemo(() => {
    return flowerRecipes.filter(
      (recipe) =>
        (recipe.parentA === parentA && recipe.parentB === parentB) ||
        (recipe.parentA === parentB && recipe.parentB === parentA)
    );
  }, [parentA, parentB]);

  const sortedVillagers = useMemo(() => {
    return villagers
      .slice()
      .sort((a, b) => (villagerSort === 'desc' ? b.popularity - a.popularity : a.popularity - b.popularity));
  }, [villagerSort]);

  const seasonalCritters = useMemo(
    () => critters.filter((critter) => critter.months.includes(seasonMonth)).sort((a, b) => b.price - a.price),
    [seasonMonth]
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 pb-10 sm:p-6">
      <header className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Nook Companion</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Static Animal Crossing helper for art, critters, flowers, and villagers.</p>
        </div>
        <DarkModeToggle />
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Redd's Art Guide">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Search art"
              value={artSearch}
              onChange={(event) => setArtSearch(event.target.value)}
            />
            <select className="input" value={artFilter} onChange={(event) => setArtFilter(event.target.value as 'all' | 'real' | 'fake')}>
              <option value="all">All art</option>
              <option value="real">Show all genuine versions</option>
              <option value="fake">Has fake variant only</option>
            </select>
          </div>
          <div className="max-h-64 space-y-2 overflow-auto pr-1">
            {filteredArt.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                <p className="font-semibold">{item.name}</p>
                <p>Real: {item.realHint}</p>
                <p>Fake: {item.fakeHint}</p>
              </article>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Comparison View</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <select className="input" value={compareA} onChange={(event) => setCompareA(event.target.value)}>
                {artItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select className="input" value={compareB} onChange={(event) => setCompareB(event.target.value)}>
                {artItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[compareArtA, compareArtB].map((item) =>
                item ? (
                  <article key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                    <p className="font-semibold">{item.name}</p>
                    <p>Real: {item.realHint}</p>
                    <p>Fake: {item.fakeHint}</p>
                  </article>
                ) : null
              )}
            </div>
          </div>
        </Card>

        <Card title="High-Value Critter Price Guide">
          <div className="grid gap-2 sm:grid-cols-2">
            <select className="input" value={critterMonth} onChange={(event) => setCritterMonth(event.target.value === 'all' ? 'all' : Number(event.target.value))}>
              <option value="all">All months</option>
              {monthNames.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select className="input" value={critterSort} onChange={(event) => setCritterSort(event.target.value as 'desc' | 'asc')}>
              <option value="desc">Highest to lowest</option>
              <option value="asc">Lowest to highest</option>
            </select>
          </div>
          <div className="max-h-80 space-y-2 overflow-auto pr-1">
            {filteredCritters.map((critter) => (
              <article key={critter.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                <p className="font-semibold">{critter.name}</p>
                <p className="capitalize">Type: {critter.type}</p>
                <p>Price: {critter.price.toLocaleString()} bells</p>
                <p>Months: {critter.months.map((m) => monthNames[m - 1]).join(', ')}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card title="Flower Breeding Guide">
          <div className="grid gap-2 sm:grid-cols-2">
            <select className="input" value={parentA} onChange={(event) => setParentA(event.target.value)}>
              {flowerColors.map((color) => (
                <option key={color} value={color}>
                  Parent A: {color}
                </option>
              ))}
            </select>
            <select className="input" value={parentB} onChange={(event) => setParentB(event.target.value)}>
              {flowerColors.map((color) => (
                <option key={color} value={color}>
                  Parent B: {color}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
            {hybridResults.length > 0 ? (
              hybridResults.map((recipe) => (
                <p key={recipe.id}>
                  {recipe.parentA} + {recipe.parentB} = <span className="font-semibold">{recipe.result}</span>
                </p>
              ))
            ) : (
              <p>No known hybrid in local dataset for this pair.</p>
            )}
          </div>
          <div className="max-h-64 space-y-2 overflow-auto pr-1">
            {flowerRecipes.map((recipe) => (
              <p key={recipe.id} className="rounded-xl border border-slate-200 p-2 text-sm dark:border-slate-700">
                {recipe.parentA} + {recipe.parentB} = {recipe.result}
              </p>
            ))}
          </div>
        </Card>

        <Card title="High-Value Villagers">
          <div className="flex items-center gap-2">
            <select className="input" value={villagerSort} onChange={(event) => setVillagerSort(event.target.value as 'desc' | 'asc')}>
              <option value="desc">Popularity high to low</option>
              <option value="asc">Popularity low to high</option>
            </select>
          </div>
          <div className="max-h-80 space-y-2 overflow-auto pr-1">
            {sortedVillagers.map((villager) => (
              <article key={villager.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                <p className="font-semibold">{villager.name}</p>
                <p>
                  {villager.species} | {villager.personality}
                </p>
                <p>Popularity: {villager.popularity}</p>
              </article>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Seasonal Calendar Dashboard">
        <div className="grid gap-2 sm:max-w-xs">
          <select className="input" value={seasonMonth} onChange={(event) => setSeasonMonth(Number(event.target.value))}>
            {monthNames.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {seasonalCritters.map((critter) => (
            <article key={critter.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
              <p className="font-semibold">{critter.name}</p>
              <p className="capitalize">{critter.type}</p>
              <p>{critter.price.toLocaleString()} bells</p>
            </article>
          ))}
        </div>
      </Card>
    </main>
  );
}