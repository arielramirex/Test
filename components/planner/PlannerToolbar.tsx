import type { PlannerTool, TerrainType } from '@/src/data/islandPlanner';
import { terrainPalette } from '@/src/data/islandPlanner';
import { PlaceableObjectPalette } from './PlaceableObjectPalette';
import type { ReactNode } from 'react';

function ToolButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
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
  brushEnabled,
  brushSize,
  orientation,
  onSelectTerrain,
  onSelectObject,
  onSelectErase,
  onSelectMove,
  onToggleBrush,
  onBrushSize,
  onRotatePlacement,
  onDuplicateSelected,
  onUndo,
  onReset,
  selectedObjectExists
}: {
  activeTool: PlannerTool;
  brushEnabled: boolean;
  brushSize: number;
  orientation: 'horizontal' | 'vertical';
  onSelectTerrain: (terrain: TerrainType) => void;
  onSelectObject: (objectId: string) => void;
  onSelectErase: () => void;
  onSelectMove: () => void;
  onToggleBrush: () => void;
  onBrushSize: (size: number) => void;
  onRotatePlacement: () => void;
  onDuplicateSelected: () => void;
  onUndo: () => void;
  onReset: () => void;
  selectedObjectExists: boolean;
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
        <div className="mt-2">
          <ToolButton active={brushEnabled} onClick={onToggleBrush}>{brushEnabled ? 'Brush: On' : 'Brush: Off'}</ToolButton>
        </div>
        <label className="mt-2 block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
          Brush Size: {brushSize}
          <input
            type="range"
            min={1}
            max={3}
            step={1}
            value={brushSize}
            onChange={(event) => onBrushSize(Number(event.target.value))}
            className="mt-1 w-full"
          />
        </label>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Place Buildings</h3>
        <PlaceableObjectPalette
          activeObjectId={activeTool.mode === 'place' ? activeTool.objectId : null}
          onSelectObject={onSelectObject}
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <ToolButton active={false} onClick={onRotatePlacement}>Rotate: {orientation}</ToolButton>
          <ToolButton active={false} onClick={onDuplicateSelected}>Duplicate</ToolButton>
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
        {!selectedObjectExists ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">Select an object to duplicate.</p> : null}
      </section>
    </aside>
  );
}
