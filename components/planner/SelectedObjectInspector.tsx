import { getObjectFootprint, objectConfigMap, type PlannerMarker, type PlannerObjectInstance } from '@/src/data/islandPlanner';

export function SelectedObjectInspector({
  selected,
  selectedMarker,
  onMove,
  onDelete,
  onDuplicate,
  onRotate,
  onFocus,
  onMoveMarker,
  onDeleteMarker
}: {
  selected: PlannerObjectInstance | null;
  selectedMarker: PlannerMarker | null;
  onMove: (dx: number, dy: number) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRotate: () => void;
  onFocus: () => void;
  onMoveMarker: (dx: number, dy: number) => void;
  onDeleteMarker: () => void;
}) {
  if (!selected && !selectedMarker) {
    return (
      <section className="rounded-2xl bg-white/85 p-4 text-sm shadow-float dark:bg-slate-900/75">
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Selected Object</h3>
        <p className="text-slate-600 dark:text-slate-300">Select a building or marker on the canvas to inspect and edit.</p>
      </section>
    );
  }

  if (selectedMarker) {
    return (
      <section className="space-y-3 rounded-2xl bg-white/85 p-4 text-sm shadow-float dark:bg-slate-900/75">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Selected Marker</h3>
        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <p className="font-bold">{selectedMarker.label}</p>
          <p>Type: Marker</p>
          <p>Position: ({selectedMarker.x}, {selectedMarker.y})</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => onMoveMarker(0, -1)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Up</button>
          <button type="button" onClick={() => onMoveMarker(-1, 0)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Left</button>
          <button type="button" onClick={() => onMoveMarker(1, 0)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Right</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onFocus} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Focus</button>
          <button type="button" onClick={onDeleteMarker} className="rounded-lg bg-rose-100 px-2 py-1 font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">Delete</button>
        </div>
      </section>
    );
  }

  const selectedObject = selected;
  if (!selectedObject) return null;

  const config = objectConfigMap[selectedObject.objectId];
  const footprint = getObjectFootprint(selectedObject.objectId, selectedObject.orientation ?? 'horizontal');

  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 text-sm shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Selected Object</h3>
      <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
        <p className="font-bold">{config?.name ?? selectedObject.objectId}</p>
        <p>Footprint: {footprint.width}x{footprint.height}</p>
        <p>Position: ({selectedObject.x}, {selectedObject.y})</p>
        <p>Type: {config?.type ?? 'building'}</p>
        <p>Orientation: {selectedObject.orientation ?? 'horizontal'}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => onMove(0, -1)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Up</button>
        <button type="button" onClick={() => onMove(-1, 0)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Left</button>
        <button type="button" onClick={() => onMove(1, 0)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Right</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button type="button" onClick={onRotate} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Rotate</button>
        <button type="button" onClick={onDuplicate} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Duplicate</button>
        <button type="button" onClick={onFocus} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Focus</button>
        <button type="button" onClick={onDelete} className="rounded-lg bg-rose-100 px-2 py-1 font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">Delete</button>
      </div>
    </section>
  );
}
