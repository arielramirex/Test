'use client';

import { useMemo, useState } from 'react';
import flowerData from '@/data/flowers.json';
import type { FlowerRecipe } from '@/lib/types';
import { IslandCard } from '@/components/layout/IslandCard';
import { SpeechBubbleCard } from '@/components/ui/SpeechBubbleCard';
import { LeafBadge } from '@/components/ui/LeafBadge';
import { CharacterPlaceholder } from '@/components/ui/CharacterPlaceholder';

const recipes = flowerData as FlowerRecipe[];

export default function FlowersPage() {
  const colors = useMemo(() => Array.from(new Set(recipes.flatMap((recipe) => [recipe.parentA, recipe.parentB]))), []);
  const [parentA, setParentA] = useState(colors[0] ?? '');
  const [parentB, setParentB] = useState(colors[1] ?? colors[0] ?? '');

  const results = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          (recipe.parentA === parentA && recipe.parentB === parentB) ||
          (recipe.parentA === parentB && recipe.parentB === parentA)
      ),
    [parentA, parentB]
  );

  return (
    <main className="page-shell space-y-4">
      <header className="wood-header">
        <div className="mb-2">
          <CharacterPlaceholder label="Leif Garden" tint="#c7f0bb" />
        </div>
        <h1 className="text-2xl font-extrabold">Leif-Inspired Flower Breeding</h1>
        <p className="text-sm text-cream/90">Hybrid calculator powered by static local recipes.</p>
      </header>

      <IslandCard title="Hybrid Calculator">
        <div className="grid gap-2 sm:grid-cols-2">
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={parentA} onChange={(event) => setParentA(event.target.value)}>
            {colors.map((color) => <option key={color} value={color}>Parent A: {color}</option>)}
          </select>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={parentB} onChange={(event) => setParentB(event.target.value)}>
            {colors.map((color) => <option key={color} value={color}>Parent B: {color}</option>)}
          </select>
        </div>

        <div className="mt-3">
          {results.length ? (
            results.map((recipe) => (
              <SpeechBubbleCard key={recipe.id} className="mb-2">
                <p className="font-bold">{recipe.parentA} + {recipe.parentB} = {recipe.result}</p>
                <LeafBadge label="Hybrid" tone="good" />
              </SpeechBubbleCard>
            ))
          ) : (
            <SpeechBubbleCard>
              <p className="font-bold">No matching hybrid in local dataset.</p>
            </SpeechBubbleCard>
          )}
        </div>
      </IslandCard>
    </main>
  );
}
