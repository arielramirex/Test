export function ExportPanel({
  includeImage,
  includeGrid,
  includeMarkers,
  onChange,
  onExport
}: {
  includeImage: boolean;
  includeGrid: boolean;
  includeMarkers: boolean;
  onChange: (next: { includeImage?: boolean; includeGrid?: boolean; includeMarkers?: boolean }) => void;
  onExport: () => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Export</h3>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={includeImage} onChange={(e) => onChange({ includeImage: e.target.checked })} /> Include imported image</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={includeGrid} onChange={(e) => onChange({ includeGrid: e.target.checked })} /> Include grid lines</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={includeMarkers} onChange={(e) => onChange({ includeMarkers: e.target.checked })} /> Include markers/labels</label>
      <button type="button" onClick={onExport} className="w-full rounded-xl bg-meadow px-3 py-2 text-sm font-bold text-slate-900 dark:bg-aurora">Export PNG</button>
    </section>
  );
}
