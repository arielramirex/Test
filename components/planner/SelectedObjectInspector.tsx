import { getObjectFootprint, objectConfigMap, type PlannerObjectInstance } from '@/src/data/islandPlanner';

export function SelectedObjectInspector({
  selected,
  onMove,
  onDelete,
  onDuplicate,
  onRotate
}: {
  selected: PlannerObjectInstance | null;
  onMove: (dx: number, dy: number) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRotate: () => void;
}) {
  if (!selected) {
    return (
      <section className="rounded-2xl bg-white/85 p-4 text-sm shadow-float dark:bg-slate-900/75">
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Selected Object</h3>
        <p className="text-slate-600 dark:text-slate-300">Select a placed object on the canvas to inspect and edit.</p>
      </section>
    );
  }

  const config = objectConfigMap[selected.objectId];
  const footprint = getObjectFootprint(selected.objectId, selected.orientation ?? 'horizontal');

  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 text-sm shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Selected Object</h3>
      <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
        <p className="font-bold">{config?.name ?? selected.objectId}</p>
        <p>Footprint: {footprint.width}x{footprint.height}</p>
        <p>Position: ({selected.x}, {selected.y})</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => onMove(0, -1)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Up</button>
        <button type="button" onClick={() => onMove(-1, 0)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Left</button>
        <button type="button" onClick={() => onMove(1, 0)} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Right</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={onRotate} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Rotate</button>
        <button type="button" onClick={onDuplicate} className="rounded-lg bg-slate-100 px-2 py-1 font-bold dark:bg-slate-800">Duplicate</button>
        <button type="button" onClick={onDelete} className="rounded-lg bg-rose-100 px-2 py-1 font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">Delete</button>
      </div>
    </section>
  );
}
