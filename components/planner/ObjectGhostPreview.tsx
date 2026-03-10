import { objectConfigMap } from '@/src/data/islandPlanner';

export function ObjectGhostPreview({
  objectId,
  orientation,
  tileSize,
  x,
  y,
  valid,
  visible
}: {
  objectId: string | null;
  orientation: 'horizontal' | 'vertical';
  tileSize: number;
  x: number | null;
  y: number | null;
  valid: boolean;
  visible: boolean;
}) {
  if (!visible || !objectId || x === null || y === null) return null;

  const config = objectConfigMap[objectId];
  if (!config) return null;
  const width = (orientation === 'vertical' && config.rotatable ? config.height : config.width) * tileSize;
  const height = (orientation === 'vertical' && config.rotatable ? config.width : config.height) * tileSize;

  return (
    <div
      className="pointer-events-none absolute flex items-center justify-center rounded-md text-[10px] font-extrabold uppercase tracking-wide"
      style={{
        zIndex: 25,
        left: x * tileSize,
        top: y * tileSize,
        width,
        height,
        backgroundColor: valid ? `${config.color}99` : 'rgba(244,63,94,0.45)',
        border: valid ? '2px dashed rgba(15,23,42,0.6)' : '2px dashed rgba(190,24,93,0.85)',
        color: valid ? '#0f172a' : '#7f1d1d'
      }}
    >
      <span className="rounded bg-white/80 px-1.5 py-0.5">{config.label}</span>
    </div>
  );
}
