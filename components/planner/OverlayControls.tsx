import type { OverlayMode } from '@/src/data/islandPlanner';

const overlayOptions: { key: OverlayMode; label: string }[] = [
  { key: 'image', label: 'Image Only' },
  { key: 'grid', label: 'Grid Only' },
  { key: 'image-grid', label: 'Image + Grid' },
  { key: 'full', label: 'Image + Grid + Objects' }
];

export function OverlayControls({
  overlayMode,
  terrainOpacity,
  onOverlayMode,
  onTerrainOpacity
}: {
  overlayMode: OverlayMode;
  terrainOpacity: number;
  onOverlayMode: (mode: OverlayMode) => void;
  onTerrainOpacity: (value: number) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Overlay Mode</h3>
      <div className="grid gap-2">
        {overlayOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onOverlayMode(option.key)}
            className={`rounded-xl px-3 py-2 text-left text-sm font-bold ${overlayMode === option.key ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Grid/Terrain Opacity: {Math.round(terrainOpacity * 100)}%
        <input
          type="range"
          min={20}
          max={100}
          step={5}
          value={terrainOpacity * 100}
          onChange={(event) => onTerrainOpacity(Number(event.target.value) / 100)}
          className="mt-1 w-full"
        />
      </label>
    </section>
  );
}
