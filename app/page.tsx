import Link from 'next/link';
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
    <main className="page-shell relative overflow-hidden">
      <div className="pointer-events-none absolute -left-14 top-8 h-40 w-40 rounded-full bg-meadow/30 blur-2xl dark:bg-aurora/20" />
      <div className="pointer-events-none absolute -right-10 top-20 h-36 w-36 rounded-full bg-sky/70 blur-2xl dark:bg-indigo-500/20" />

      <header className="wood-header mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <div className="mb-3">
            <CharacterPlaceholder label="Island Guide" tint="#b8f0ce" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cream/90">Nook Companion</p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">Island Planner Dashboard</h1>
          <p className="mt-2 text-sm text-cream/90 sm:text-base">
            Cozy, static island tools with playful cards, soft colors, and fast no-backend filtering.
          </p>
        </div>
        <ThemeControl />
      </header>

      <section className="mb-5 grid gap-3 rounded-2xl bg-white/60 p-3 shadow-float backdrop-blur dark:bg-slate-900/50 sm:grid-cols-2 lg:grid-cols-3">
        {sections.slice(0, 3).map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl bg-sand/70 px-4 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-sand dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {section.title}
          </Link>
        ))}
        {sections.slice(3).map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl bg-mint/70 px-4 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-mint dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {section.title}
          </Link>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <IslandCard key={section.href} title={section.title} subtitle={section.desc}>
            <div className="mt-2">
              <PastelButton href={section.href}>Open Section</PastelButton>
            </div>
          </IslandCard>
        ))}
      </section>
    </main>
  );
}
