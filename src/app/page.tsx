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
