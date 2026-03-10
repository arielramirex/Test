import { islandPresets } from '@/src/data/islandPlanner';

export function PresetStarterPanel({
  onApplyPreset
}: {
  onApplyPreset: (presetId: string) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Preset Starters</h3>
      <div className="grid gap-2">
        {islandPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset.id)}
            className="rounded-xl bg-slate-100 px-3 py-2 text-left text-sm dark:bg-slate-800"
          >
            <p className="font-bold">{preset.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">{preset.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

