export function QuickActionsBar({
  onTerrain,
  onPlace,
  onSelect,
  onFit,
  onDeselect
}: {
  onTerrain: () => void;
  onPlace: () => void;
  onSelect: () => void;
  onFit: () => void;
  onDeselect: () => void;
}) {
  return (
    <div className="fixed bottom-36 right-3 z-40 hidden gap-2 rounded-2xl bg-white/90 p-2 shadow-float backdrop-blur dark:bg-slate-900/90 lg:flex">
      <button type="button" onClick={onTerrain} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-slate-800">Terrain</button>
      <button type="button" onClick={onPlace} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-slate-800">Place</button>
      <button type="button" onClick={onSelect} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-slate-800">Select</button>
      <button type="button" onClick={onFit} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-slate-800">Fit</button>
      <button type="button" onClick={onDeselect} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-slate-800">Deselect</button>
    </div>
  );
}

