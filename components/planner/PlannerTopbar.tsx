import type { OverlayMode } from '@/src/data/islandPlanner';

export function PlannerTopbar({
  onUndo,
  onRedo,
  onSave,
  onReset,
  onClear,
  onToggleGrid,
  onToggleOverlay,
  onExport,
  onCenter,
  canUndo,
  canRedo,
  overlayMode,
  gridVisible,
  layoutName
}: {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onReset: () => void;
  onClear: () => void;
  onToggleGrid: () => void;
  onToggleOverlay: () => void;
  onExport: () => void;
  onCenter: () => void;
  canUndo: boolean;
  canRedo: boolean;
  overlayMode: OverlayMode;
  gridVisible: boolean;
  layoutName: string;
}) {
  const buttonClass = 'rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700';

  return (
    <div className="sticky top-2 z-40 rounded-2xl border border-white/50 bg-white/90 p-2 shadow-float backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-extrabold">Planner Actions</p>
        <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-100">{layoutName}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
        <button type="button" onClick={onUndo} disabled={!canUndo} className={buttonClass}>Undo</button>
        <button type="button" onClick={onRedo} disabled={!canRedo} className={buttonClass}>Redo</button>
        <button type="button" onClick={onSave} className={buttonClass}>Save</button>
        <button type="button" onClick={onReset} className={buttonClass}>Reset</button>
        <button type="button" onClick={onClear} className={buttonClass}>Clear All</button>
        <button type="button" onClick={onToggleGrid} className={buttonClass}>{gridVisible ? 'Hide Grid' : 'Show Grid'}</button>
        <button type="button" onClick={onToggleOverlay} className={buttonClass}>{overlayMode === 'image' ? 'Show Overlay' : 'Image Only'}</button>
        <button type="button" onClick={onExport} className={buttonClass}>Export</button>
        <button type="button" onClick={onCenter} className={buttonClass}>Center View</button>
      </div>
    </div>
  );
}
