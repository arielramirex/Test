import type { GridCalibration } from '@/src/data/islandPlanner';

export function GridCalibrationPanel({
  settings,
  onChange,
  onSnapImageCenter,
  onSnapGridCenter
}: {
  settings: GridCalibration;
  onChange: (next: Partial<GridCalibration>) => void;
  onSnapImageCenter: () => void;
  onSnapGridCenter: () => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Grid Alignment</h3>

      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Grid Size: {settings.gridSize}
        <input
          type="range"
          min={20}
          max={36}
          step={1}
          value={settings.gridSize}
          onChange={(event) => onChange({ gridSize: Number(event.target.value) })}
          className="mt-1 w-full"
        />
      </label>

      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Tile Size: {settings.tileSize}px
        <input
          type="range"
          min={16}
          max={40}
          step={1}
          value={settings.tileSize}
          onChange={(event) => onChange({ tileSize: Number(event.target.value) })}
          className="mt-1 w-full"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
          Grid Offset X
          <input
            type="range"
            min={-200}
            max={200}
            step={2}
            value={settings.offsetX}
            onChange={(event) => onChange({ offsetX: Number(event.target.value) })}
            className="mt-1 w-full"
          />
        </label>
        <label className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
          Grid Offset Y
          <input
            type="range"
            min={-200}
            max={200}
            step={2}
            value={settings.offsetY}
            onChange={(event) => onChange({ offsetY: Number(event.target.value) })}
            className="mt-1 w-full"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onChange({ showLines: !settings.showLines })} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">
          {settings.showLines ? 'Hide Grid Lines' : 'Show Grid Lines'}
        </button>
        <button type="button" onClick={() => onChange({ highContrastLines: !settings.highContrastLines })} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">
          {settings.highContrastLines ? 'Normal Grid Contrast' : 'High Contrast Grid'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onSnapImageCenter} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">
          Snap Image Center
        </button>
        <button type="button" onClick={onSnapGridCenter} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">
          Snap Grid Center
        </button>
      </div>
    </section>
  );
}
