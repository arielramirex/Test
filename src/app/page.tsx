import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PreviewCard } from '@/components/ui/PreviewCard';
import { IslandCard } from '@/components/layout/IslandCard';
import { seasonalData } from '@/src/data/seasonal';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { SectionHero } from '@/components/ui/SectionHero';

const sections = [
  {
    href: '/art',
    title: 'Redd Art Guide',
    description: 'Quickly compare genuine and fake art details side by side.',
    image: '/images/home/art-guide.svg'
  },
  {
    href: '/critters',
    title: 'Critter Prices',
    description: 'Track valuable fish, bugs, and sea creatures with rarity badges.',
    image: '/images/home/critter-prices.svg'
  },
  {
    href: '/flowers',
    title: 'Flower Breeding',
    description: 'Scan hybrid combinations by species, color, and result chance.',
    image: '/images/home/flower-breeding.svg'
  },
  {
    href: '/items',
    title: 'High Value Items',
    description: 'Sort top bell earners and find premium catalog highlights.',
    image: '/images/home/high-value-items.svg'
  },
  {
    href: '/villagers',
    title: 'Villager Guide',
    description: 'Browse villager portraits by species, personality, and tier.',
    image: '/images/home/villager-guide.svg'
  },
  {
    href: '/seasonal',
    title: 'Seasonal Dashboard',
    description: 'See monthly arrivals, departures, events, and featured items.',
    image: '/images/home/seasonal-dashboard.svg'
  },
  {
    href: '/planner',
    title: 'Island Planner',
    description: 'Map terraforming ideas with a grid tool for paths, rivers, cliffs, and buildings.',
    image: '/images/home/island-planner.svg'
  }
];

const featured = seasonalData.find((entry) => entry.month === 'June') ?? seasonalData[0];

export default function HomePage() {
  return (
    <main className="page-shell relative space-y-5 overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-2 h-44 w-44 rounded-full bg-meadow/40 blur-3xl dark:bg-aurora/15" />
      <div className="pointer-events-none absolute -right-16 top-14 h-44 w-44 rounded-full bg-sky/70 blur-3xl dark:bg-indigo-500/20" />

      <SectionHero
        label="Island Companion"
        tint="#b8f0ce"
        title="Cozy Animal Crossing Companion Guide"
        subtitle="A polished static guide for critters, flowers, art checks, villagers, and seasonal planning, fully local and GitHub Pages friendly."
        rightSlot={<ThemeToggle />}
      />

      <section className="relative overflow-hidden rounded-island bg-white/80 p-4 shadow-float dark:bg-slate-900/70">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-mint/35 via-sky/30 to-sand/35 dark:from-emerald-900/20 dark:via-sky-900/10 dark:to-amber-900/20" />
        <div className="relative grid gap-4 sm:grid-cols-[1.2fr_1fr] sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">Island Visual</p>
            <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">Plan Your Island Day In One Cozy Dashboard</h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              Browse critters, flowers, villagers, art checks, and seasonal highlights with image-first cards and fast local filters.
            </p>
          </div>
          <div className="relative h-40 overflow-hidden rounded-2xl">
            <ImageWithFallback
              src="/images/home/spring-featured.svg"
              fallbackSrc="/images/home/seasonal-dashboard.svg"
              alt="Island hero illustration"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <PreviewCard
            key={section.href}
            href={section.href}
            image={section.image}
            title={section.title}
            description={section.description}
          />
        ))}
      </section>

      <IslandCard title={`${featured.month} Seasonal Spotlight`} subtitle="Featured content this month">
        <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-start">
          <div className="relative h-36 overflow-hidden rounded-2xl">
            <ImageWithFallback
              src="/images/home/spring-featured.svg"
              fallbackSrc="/images/home/seasonal-dashboard.svg"
              alt="Featured seasonal content"
              fill
              className="object-cover"
              sizes="180px"
            />
          </div>
          <div className="grid gap-2 text-sm">
            <p><span className="font-bold">New Critters:</span> {featured.newCritters.join(', ')}</p>
            <p><span className="font-bold">Leaving Soon:</span> {featured.leavingCritters.join(', ')}</p>
            <p><span className="font-bold">Featured Items:</span> {featured.featuredItems.join(', ')}</p>
            <p><span className="font-bold">Events:</span> {featured.events.join(', ')}</p>
          </div>
        </div>
      </IslandCard>
    </main>
  );
}
