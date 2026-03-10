export function LayoutImportExportPanel({
  onExportJson,
  onImportJson
}: {
  onExportJson: () => void;
  onImportJson: (file: File | null) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">JSON Import / Export</h3>

      <button
        type="button"
        onClick={onExportJson}
        className="w-full rounded-xl bg-meadow px-3 py-2 text-sm font-bold text-slate-900 dark:bg-aurora"
      >
        Export Planner JSON
      </button>

      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Import Planner JSON
        <input
          type="file"
          accept="application/json,.json"
          onChange={(event) => onImportJson(event.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-xs"
        />
      </label>
    </section>
  );
}

