import type { PlannerReferenceLayer } from '@/src/data/islandPlanner';

export function PlannerReferenceControls({
  reference,
  onUpload,
  onChange,
  onResetAlignment,
  onClearImage
}: {
  reference: PlannerReferenceLayer;
  onUpload: (file: File | null) => void;
  onChange: (next: Partial<PlannerReferenceLayer>) => void;
  onResetAlignment: () => void;
  onClearImage: () => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Import Island Map</h3>

      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Upload PNG/JPG
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(event) => onUpload(event.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-xs"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange({ visible: !reference.visible })}
          className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800"
        >
          {reference.visible ? 'Hide Image' : 'Show Image'}
        </button>
        <button
          type="button"
          onClick={() => onChange({ locked: !reference.locked })}
          className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800"
        >
          {reference.locked ? 'Unlock Image' : 'Lock Image'}
        </button>
      </div>

      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Opacity: {Math.round(reference.opacity * 100)}%
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={reference.opacity * 100}
          onChange={(event) => onChange({ opacity: Number(event.target.value) / 100 })}
          className="mt-1 w-full"
        />
      </label>

      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Scale: {reference.scale.toFixed(2)}x
        <input
          type="range"
          min={60}
          max={180}
          step={5}
          value={reference.scale * 100}
          onChange={(event) => onChange({ scale: Number(event.target.value) / 100 })}
          className="mt-1 w-full"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
          Offset X
          <input
            type="range"
            min={-300}
            max={300}
            step={2}
            value={reference.offsetX}
            disabled={reference.locked}
            onChange={(event) => onChange({ offsetX: Number(event.target.value) })}
            className="mt-1 w-full"
          />
        </label>
        <label className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
          Offset Y
          <input
            type="range"
            min={-300}
            max={300}
            step={2}
            value={reference.offsetY}
            disabled={reference.locked}
            onChange={(event) => onChange({ offsetY: Number(event.target.value) })}
            className="mt-1 w-full"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onResetAlignment} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">
          Reset Alignment
        </button>
        <button type="button" onClick={onClearImage} className="rounded-xl bg-rose-100 px-3 py-2 text-sm font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
          Remove Image
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300">
        Reference images are stored locally when possible. Very large files may need re-upload after refresh.
      </p>
    </section>
  );
}
