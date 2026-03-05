'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/art', label: 'Art' },
  { href: '/critters', label: 'Critters' },
  { href: '/flowers', label: 'Flowers' },
  { href: '/seasonal', label: 'Seasonal' },
  { href: '/items', label: 'Items' },
  { href: '/villagers', label: 'Villagers' }
];

export function FloatingNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[95%] max-w-3xl -translate-x-1/2 rounded-full border border-white/50 bg-white/90 px-2 py-2 shadow-float backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
      <ul className="flex items-center justify-between gap-1 overflow-x-auto text-xs font-bold sm:text-sm">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-flex rounded-full px-3 py-2 transition ${active ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}