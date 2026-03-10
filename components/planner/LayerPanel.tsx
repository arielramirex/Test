import type { PlannerLayerVisibility } from '@/src/data/islandPlanner';

const orderedLayers: Array<{ key: keyof PlannerLayerVisibility; label: string }> = [
  { key: 'image', label: 'Island Image' },
  { key: 'grid', label: 'Grid' },
  { key: 'terrain', label: 'Terrain' },
  { key: 'paths', label: 'Paths' },
  { key: 'water', label: 'Water' },
  { key: 'cliffs', label: 'Cliffs' },
  { key: 'buildings', label: 'Buildings' },
  { key: 'markers', label: 'Markers' }
];

export function LayerPanel({
  layers,
  onToggle,
  terrainOpacity,
  onTerrainOpacity
}: {
  layers: PlannerLayerVisibility;
  onToggle: (key: keyof PlannerLayerVisibility) => void;
  terrainOpacity: number;
  onTerrainOpacity: (value: number) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Layer Visibility</h3>
      <div className="grid grid-cols-2 gap-2">
        {orderedLayers.map((layer) => (
          <button
            key={layer.key}
            type="button"
            onClick={() => onToggle(layer.key)}
            className={`rounded-xl px-3 py-2 text-left text-xs font-bold ${
              layers[layer.key] ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {layers[layer.key] ? 'Visible' : 'Hidden'}: {layer.label}
          </button>
        ))}
      </div>

      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Terrain Opacity: {Math.round(terrainOpacity * 100)}%
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

