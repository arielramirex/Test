import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
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
      <body>
        <ThemeProvider>
          {children}
          <FloatingNavigationBar />
        </ThemeProvider>
      </body>
    </html>
  );
}