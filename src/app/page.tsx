import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PreviewCard } from '@/components/ui/PreviewCard';
import { IslandCard } from '@/components/layout/IslandCard';
import { seasonalData } from '@/src/data/seasonal';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { HeroLogo } from '@/components/ui/HeroLogo';

const sections = [
  {
    href: '/planner',
    title: 'Island Planner',
    description: 'Sketch terraforming ideas with a grid tool for paths, rivers, cliffs, and buildings.',
    image: '/images/home/island-planner.svg'
  },
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

const quickLinks = [
  { href: '/planner', label: 'Island Planner' },
  { href: '/critters', label: 'Critter Guide' },
  { href: '/art', label: 'Art Guide' },
  { href: '/flowers', label: 'Flower Guide' }
];

const basePath = process.env.NODE_ENV === 'production' ? '/Test' : '';
const logoPath = `${basePath}/images/home/nook-companion-logo.png`;
const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
const featured = seasonalData.find((entry) => entry.month === currentMonth) ?? seasonalData[0];

export default function HomePage() {
  return (
    <main className="page-shell relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-meadow/45 blur-3xl dark:bg-aurora/15" />
      <div className="pointer-events-none absolute -right-20 top-10 h-52 w-52 rounded-full bg-sky/80 blur-3xl dark:bg-indigo-500/20" />

      <section className="hero-panel relative overflow-hidden px-4 py-6 sm:px-6 sm:py-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(255,255,255,0)_45%),linear-gradient(180deg,rgba(217,243,228,0.85),rgba(223,239,255,0.9)_48%,rgba(248,231,200,0.86))] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_rgba(255,255,255,0)_45%),linear-gradient(180deg,rgba(17,26,49,0.92),rgba(29,45,74,0.9)_48%,rgba(33,49,77,0.95))]" />
        <div className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-white/35 blur-2xl" />
        <div className="pointer-events-none absolute -right-8 bottom-10 h-32 w-32 rounded-full bg-meadow/50 blur-2xl dark:bg-aurora/15" />

        <div className="relative">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>

          <div className="mx-auto mt-2 flex max-w-4xl flex-col items-center text-center">
            <div className="hero-logo-shell">
              <HeroLogo src={logoPath} alt="Nook Companion logo" />
            </div>

            <span className="mt-4 rounded-full bg-white/75 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 shadow-sm dark:bg-slate-900/70 dark:text-slate-200">
              Animal Crossing Island Companion
            </span>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-slate-800 sm:text-4xl lg:text-5xl dark:text-white">
              Your Ultimate Animal Crossing Island Companion
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-700 sm:text-base dark:text-slate-200">
              Plan island layouts, track critters, compare Redd art, breed flowers, and browse seasonal highlights in one polished static guide built for GitHub Pages.
            </p>

            <div className="mt-5 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              {quickLinks.map((link) => (
                <ThemedButton key={link.href} href={link.href}>
                  {link.label}
                </ThemedButton>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="rounded-[1.75rem] bg-white/80 p-5 text-left shadow-float backdrop-blur-sm dark:bg-slate-950/55">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Welcome Home</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-800 dark:text-white">Cozy tools for planning, collecting, and checking your island progress</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                Jump into the sections you use most often, then explore the rest of the guide through image-first cards designed to feel at home with the Animal Crossing aesthetic.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-mint/65 px-4 py-3 dark:bg-emerald-900/35">
                  <p className="text-sm font-extrabold text-slate-800 dark:text-white">Static and reliable</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-200">Local data only, export-safe assets, and no backend features.</p>
                </div>
                <div className="rounded-3xl bg-sky/65 px-4 py-3 dark:bg-sky-950/35">
                  <p className="text-sm font-extrabold text-slate-800 dark:text-white">Made for daily checks</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-200">Fast access to critters, art, flowers, planners, and seasonal info.</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] bg-white/70 p-3 shadow-float dark:bg-slate-950/45">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-meadow/35 dark:from-white/5 dark:to-aurora/10" />
              <div className="relative h-56 overflow-hidden rounded-[1.35rem] sm:h-64 lg:h-full">
                <ImageWithFallback
                  src="/images/home/spring-featured.svg"
                  fallbackSrc="/images/home/seasonal-dashboard.svg"
                  alt="Animal Crossing inspired island illustration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-island bg-white/70 p-4 shadow-float backdrop-blur-sm dark:bg-slate-900/60">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">Explore The Guide</p>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Section previews for your most-used island tools</h2>
          </div>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-200">
            Browse the planner, critter guide, art checks, flowers, high-value items, seasonal dashboard, and villager resources from one welcoming homepage.
          </p>
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
