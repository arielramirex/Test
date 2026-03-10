import type { PlannerObjectInstance } from '@/src/data/islandPlanner';
import { objectConfigMap } from '@/src/data/islandPlanner';

export function PlannerLegend({ objects }: { objects: PlannerObjectInstance[] }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3 text-sm shadow-float dark:bg-slate-900/70">
      <h3 className="mb-2 font-extrabold">Planner Legend</h3>
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
    </div>
  );
}
