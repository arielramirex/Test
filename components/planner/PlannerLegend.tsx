import type { PlannerCategoryFilter, PlannerMarker, PlannerObjectInstance } from '@/src/data/islandPlanner';
import { markerTemplates, objectConfigMap, terrainPalette } from '@/src/data/islandPlanner';

const filterOptions: { key: PlannerCategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'housing', label: 'Housing' },
  { key: 'shops', label: 'Shops' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'terrain', label: 'Terrain' },
  { key: 'markers', label: 'Markers' }
];

export function PlannerLegend({
  objects,
  markers,
  categoryFilter,
  onCategoryFilter
}: {
  objects: PlannerObjectInstance[];
  markers: PlannerMarker[];
  categoryFilter: PlannerCategoryFilter;
  onCategoryFilter: (filter: PlannerCategoryFilter) => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl bg-white/70 p-3 text-sm shadow-float dark:bg-slate-900/70">
      <h3 className="mb-2 font-extrabold">Planner Legend</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onCategoryFilter(option.key)}
            className={`rounded-xl px-2 py-1 text-xs font-bold ${
              option.key === categoryFilter ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {terrainPalette.map((terrain) => (
          <div key={terrain.key} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: terrain.color }} />
            <span className="text-xs font-bold">{terrain.label}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {objects.length ? (
          objects.map((entry) => {
            const config = objectConfigMap[entry.objectId];
            if (!config) return null;
            return (
              <div key={entry.instanceId} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
                <span className="h-4 w-4 rounded" style={{ backgroundColor: config.color }} />
                <span className="font-bold">{config.name}</span>
                <span className="text-xs text-slate-500">({entry.x}, {entry.y})</span>
              </div>
            );
          })
        ) : (
          <p className="text-slate-600 dark:text-slate-300">No structures placed yet.</p>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
          <p className="text-xs font-bold">Marker Colors</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {markerTemplates.slice(0, 5).map((template) => (
              <span key={template.label} className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: template.color }}>
                {template.label}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
          <p className="text-xs font-bold">Infrastructure</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">Bridge and incline blocks use rotatable footprints.</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Active markers: {markers.length}</p>
        </div>
      </div>
    </div>
  );
}
