import { IslandCard } from '@/components/layout/IslandCard';
import { ThemeControl } from '@/components/features/ThemeControl';
import { PastelButton } from '@/components/ui/PastelButton';
import { CharacterPlaceholder } from '@/components/ui/CharacterPlaceholder';

const sections = [
  { href: '/art', title: "Redd-Inspired Art Guide", desc: 'Spot real and fake art using local reference notes.' },
  { href: '/critters', title: 'Blathers/CJ Critter Prices', desc: 'Sort high-value critters and filter by month.' },
  { href: '/flowers', title: 'Leif Flower Breeding', desc: 'Use pair combinations to calculate hybrid results.' },
  { href: '/seasonal', title: 'Isabelle Seasonal Dashboard', desc: 'Pick a month and see available critters quickly.' },
  { href: '/items', title: 'Tom Nook High Value Items', desc: 'Track premium items and sort by bells value.' },
  { href: '/villagers', title: 'Villager Popularity', desc: 'Browse sought-after villagers and sort rankings.' }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="wood-header mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2">
            <CharacterPlaceholder label="Island Guide" tint="#c2f1d8" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-cream/90">Nook Companion</p>
          <h1 className="text-3xl font-extrabold">Island Planner Dashboard</h1>
          <p className="text-sm text-cream/90">A static, cozy, and playful guide for your daily island routine.</p>
        </div>
        <ThemeControl />
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <IslandCard key={section.href} title={section.title} subtitle={section.desc}>
            <PastelButton href={section.href}>Open Section</PastelButton>
          </IslandCard>
        ))}
      </section>
    </main>
  );
}
