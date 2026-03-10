import type { PlannerObjectInstance } from '@/src/data/islandPlanner';
import { objectConfigMap, type TerrainType } from '@/src/data/islandPlanner';
import { PlannerTile } from './PlannerTile';

export function PlannerGrid({
  gridSize,
  terrains,
  objects,
  zoom,
  showGrid,
  selectedObjectId,
  onTileClick
}: {
  gridSize: number;
  terrains: TerrainType[];
  objects: PlannerObjectInstance[];
  zoom: number;
  showGrid: boolean;
  selectedObjectId: string | null;
  onTileClick: (x: number, y: number) => void;
}) {
  return (
    <div className="overflow-auto rounded-2xl border border-white/40 bg-white/70 p-2 shadow-float dark:border-slate-700 dark:bg-slate-900/60">
      <div
        className="relative"
        style={{
          width: gridSize * zoom,
          height: gridSize * zoom
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: gridSize * zoom,
            height: gridSize * zoom
          }}
        >
          {terrains.map((terrain, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            return (
              <PlannerTile
                key={`${x}-${y}`}
                x={x}
                y={y}
                terrain={terrain}
                zoom={zoom}
                showGrid={showGrid}
                onClick={onTileClick}
              />
            );
          })}
        </div>

        {objects.map((entry) => {
          const config = objectConfigMap[entry.objectId];
          if (!config) return null;
          const selected = selectedObjectId === entry.instanceId;
          return (
            <div
              key={entry.instanceId}
              className="pointer-events-none absolute flex items-center justify-center rounded-md text-[10px] font-extrabold uppercase tracking-wide text-slate-900"
              style={{
                left: entry.x * zoom,
                top: entry.y * zoom,
                width: config.width * zoom,
                height: config.height * zoom,
                backgroundColor: config.color,
                border: selected ? '2px solid #0f766e' : '1px solid rgba(15,23,42,0.3)',
                boxShadow: selected ? '0 0 0 2px rgba(240,253,250,0.9)' : 'none'
              }}
            >
              <span className="rounded bg-white/75 px-1.5 py-0.5">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
