import { objectConfigMap, type PlannerObjectInstance } from '@/src/data/islandPlanner';

export function MarkerLayer({
  markers,
  tileSize,
  gridSize,
  visible,
  selectedMarkerId,
  onSelectMarker,
  onMarkerPointerDown
}: {
  markers: { id: string; label: string; x: number; y: number; color: string }[];
  tileSize: number;
  gridSize: number;
  visible: boolean;
  selectedMarkerId: string | null;
  onSelectMarker: (id: string) => void;
  onMarkerPointerDown: (id: string, clientX: number, clientY: number) => void;
}) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {markers.map((marker) => {
        const left = marker.x * tileSize;
        const top = marker.y * tileSize;
        const selected = selectedMarkerId === marker.id;
        return (
          <button
            key={marker.id}
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
              onSelectMarker(marker.id);
              onMarkerPointerDown(marker.id, event.clientX, event.clientY);
            }}
            onClick={(event) => {
              event.stopPropagation();
              onSelectMarker(marker.id);
            }}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-[10px] font-bold"
            style={{
              left,
              top,
              backgroundColor: marker.color,
              borderColor: selected ? '#0f766e' : 'rgba(15,23,42,0.35)',
              boxShadow: selected ? '0 0 0 2px rgba(15,118,110,0.25)' : 'none',
              maxWidth: Math.max(gridSize * tileSize - 8, 80)
            }}
          >
            {marker.label}
          </button>
        );
      })}
    </div>
  );
}

export function ObjectLayer({
  objects,
  tileSize,
  selectedObjectId,
  visible,
  onObjectSelect
}: {
  objects: PlannerObjectInstance[];
  tileSize: number;
  selectedObjectId: string | null;
  visible: boolean;
  onObjectSelect: (instanceId: string) => void;
}) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-20">
      {objects.map((entry) => {
        const config = objectConfigMap[entry.objectId];
        if (!config) return null;
        const selected = selectedObjectId === entry.instanceId;
        const width = (entry.orientation === 'vertical' && config.rotatable ? config.height : config.width) * tileSize;
        const height = (entry.orientation === 'vertical' && config.rotatable ? config.width : config.height) * tileSize;

        return (
          <button
            key={entry.instanceId}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onObjectSelect(entry.instanceId);
            }}
            className="absolute flex items-center justify-center rounded-md text-[10px] font-extrabold uppercase tracking-wide text-slate-900"
            style={{
              left: entry.x * tileSize,
              top: entry.y * tileSize,
              width,
              height,
              backgroundColor: config.color,
              border: selected ? '2px solid #0f766e' : '1px solid rgba(15,23,42,0.3)',
              boxShadow: selected ? '0 0 0 2px rgba(240,253,250,0.9)' : 'none'
            }}
          >
            <span className="rounded bg-white/75 px-1.5 py-0.5">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
