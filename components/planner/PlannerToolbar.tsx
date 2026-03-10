import type { PlannerTool, TerrainType } from '@/src/data/islandPlanner';
import { placeableObjects, terrainPalette } from '@/src/data/islandPlanner';

function ToolButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-left text-sm font-bold transition ${active ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
    >
      {children}
    </button>
  );
}

export function PlannerToolbar({
  activeTool,
  zoom,
  showGrid,
  onSelectTerrain,
  onSelectObject,
  onSelectErase,
  onSelectMove,
  onUndo,
  onReset,
  onZoom,
  onToggleGrid
}: {
  activeTool: PlannerTool;
  zoom: number;
  showGrid: boolean;
  onSelectTerrain: (terrain: TerrainType) => void;
  onSelectObject: (objectId: string) => void;
  onSelectErase: () => void;
  onSelectMove: () => void;
  onUndo: () => void;
  onReset: () => void;
  onZoom: (value: number) => void;
  onToggleGrid: () => void;
}) {
  return (
    <aside className="space-y-4 rounded-island bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <section>
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Terrain Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          {terrainPalette.map((terrain) => (
            <ToolButton
              key={terrain.key}
              active={activeTool.mode === 'terrain' && activeTool.terrain === terrain.key}
              onClick={() => onSelectTerrain(terrain.key)}
            >
              <span className="mr-2 inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: terrain.color }} />
              {terrain.label}
            </ToolButton>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Place Buildings</h3>
        <div className="grid gap-2">
          {placeableObjects.map((item) => (
            <ToolButton key={item.id} active={activeTool.mode === 'place' && activeTool.objectId === item.id} onClick={() => onSelectObject(item.id)}>
              <span className="mr-2 inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
              {item.name} ({item.width}x{item.height})
            </ToolButton>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Planner Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <ToolButton active={activeTool.mode === 'erase'} onClick={onSelectErase}>Erase</ToolButton>
          <ToolButton active={activeTool.mode === 'select'} onClick={onSelectMove}>Move</ToolButton>
          <ToolButton active={false} onClick={onUndo}>Undo</ToolButton>
          <ToolButton active={false} onClick={onReset}>Clear All</ToolButton>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">View</h3>
        <div className="grid gap-2">
          <label className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
            Zoom: {zoom}px
            <input
              type="range"
              min={16}
              max={40}
              step={2}
              value={zoom}
              onChange={(event) => onZoom(Number(event.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <ToolButton active={showGrid} onClick={onToggleGrid}>{showGrid ? 'Hide Grid Lines' : 'Show Grid Lines'}</ToolButton>
        </div>
      </section>
    </aside>
  );
}
