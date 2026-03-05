'use client';

import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { useTheme } from '@/lib/hooks/useTheme';

export function ThemeControl() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-bold text-slate-800 shadow-float dark:bg-slate-900/80 dark:text-slate-100">
      <span>{theme === 'dark' ? 'Night Island' : 'Day Island'}</span>
      <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
    </div>
  );
}