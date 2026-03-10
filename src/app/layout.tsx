import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from '@/lib/hooks/useTheme';
import { FloatingNavigationBar } from '@/components/layout/FloatingNavigationBar';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito'
});

export const metadata: Metadata = {
  title: 'Nook Companion',
  description: 'Static Animal Crossing-inspired companion app for art, critters, flowers, items, and seasonal planning.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <div className="min-h-screen">
            {children}
            <footer className="mx-auto mt-10 w-full max-w-6xl px-4 pb-28 text-center text-xs text-slate-600 dark:text-slate-300 sm:px-6">
              Static Animal Crossing companion guide. Local data only. Built for GitHub Pages export.
            </footer>
          </div>
          <FloatingNavigationBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
