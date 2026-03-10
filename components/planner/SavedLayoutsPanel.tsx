import type { PlannerSnapshot } from '@/src/data/islandPlanner';

export function SavedLayoutsPanel({
  layouts,
  activeLayoutId,
  onCreate,
  onSave,
  onLoad,
  onRename,
  onDuplicate,
  onDelete
}: {
  layouts: PlannerSnapshot[];
  activeLayoutId: string | null;
  onCreate: () => void;
  onSave: () => void;
  onLoad: (id: string) => void;
  onRename: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Saved Layouts</h3>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onCreate} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">New</button>
        <button type="button" onClick={onSave} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">Save Current</button>
      </div>
      <div className="grid gap-2">
        {layouts.length ? (
          layouts.map((layout) => (
            <div key={layout.id} className={`rounded-xl p-2 ${layout.id === activeLayoutId ? 'bg-mint/60 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-bold">{layout.name ?? 'Unnamed Layout'}</p>
                <button type="button" onClick={() => onLoad(layout.id ?? '')} className="rounded-lg bg-white/80 px-2 py-1 text-xs font-bold dark:bg-slate-700">Load</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => onRename(layout.id ?? '')} className="rounded-lg bg-white/70 px-2 py-1 text-xs font-bold dark:bg-slate-700">Rename</button>
                <button type="button" onClick={() => onDuplicate(layout.id ?? '')} className="rounded-lg bg-white/70 px-2 py-1 text-xs font-bold dark:bg-slate-700">Duplicate</button>
                <button type="button" onClick={() => onDelete(layout.id ?? '')} className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">No saved layouts yet.</p>
        )}
      </div>
    </section>
  );
}
