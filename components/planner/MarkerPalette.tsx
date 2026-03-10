import { markerTemplates } from '@/src/data/islandPlanner';

export function MarkerPalette({
  onAddMarker,
  selectedMarkerLabel,
  onDeleteMarker
}: {
  onAddMarker: (label: string, color: string) => void;
  selectedMarkerLabel: string | null;
  onDeleteMarker: () => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Markers</h3>
      <div className="grid gap-2">
        {markerTemplates.map((template) => (
          <button
            key={template.label}
            type="button"
            onClick={() => onAddMarker(template.label, template.color)}
            className="rounded-xl bg-slate-100 px-3 py-2 text-left text-sm font-bold dark:bg-slate-800"
          >
            <span className="mr-2 inline-block h-3 w-3 rounded-full" style={{ backgroundColor: template.color }} />
            {template.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!selectedMarkerLabel}
        onClick={onDeleteMarker}
        className="w-full rounded-xl bg-rose-100 px-3 py-2 text-sm font-bold text-rose-700 disabled:opacity-50 dark:bg-rose-900/40 dark:text-rose-200"
      >
        Remove Selected Marker{selectedMarkerLabel ? `: ${selectedMarkerLabel}` : ''}
      </button>
    </section>
  );
}
