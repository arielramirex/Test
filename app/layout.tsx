import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nook Companion',
  description: 'Static Animal Crossing companion app for guides, prices, and seasonal planning.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}