export function PlannerHelpPanel({
  visible,
  onDismiss
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  if (!visible) return null;

  return (
    <section className="space-y-2 rounded-2xl border border-sky-200 bg-sky-50/90 p-4 text-sm shadow-float dark:border-slate-700 dark:bg-slate-900/85">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-extrabold">Planner Quick Start</h3>
        <button type="button" onClick={onDismiss} className="rounded-lg bg-white/90 px-2 py-1 text-xs font-bold dark:bg-slate-800">
          Hide
        </button>
      </div>
      <ul className="space-y-1 text-slate-700 dark:text-slate-200">
        <li>1. Import your island map image and lower opacity.</li>
        <li>2. Align image and grid with overlay + grid controls.</li>
        <li>3. Paint terrain, then place buildings and markers.</li>
        <li>4. Save multiple concepts or export JSON/PNG.</li>
      </ul>
      <p className="text-xs text-slate-600 dark:text-slate-300">
        Shortcuts: `Ctrl/Cmd+Z` undo, `Ctrl/Cmd+Y` redo, `Delete` remove selected, `Esc` deselect, `T` terrain tool, `B` building tool.
      </p>
    </section>
  );
}
