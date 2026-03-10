import { placeableObjects } from '@/src/data/islandPlanner';

export function PlaceableObjectPalette({
  activeObjectId,
  onSelectObject
}: {
  activeObjectId: string | null;
  onSelectObject: (objectId: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {placeableObjects.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectObject(item.id)}
          className={`rounded-xl px-3 py-2 text-left text-sm font-bold transition ${activeObjectId === item.id ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
        >
          <span className="mr-2 inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.name} ({item.width}x{item.height})
        </button>
      ))}
    </div>
  );
}
