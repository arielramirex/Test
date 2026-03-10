import { terrainColorMap, type TerrainType } from '@/src/data/islandPlanner';

export function PlannerTile({
  x,
  y,
  terrain,
  zoom,
  showGrid,
  onClick,
  onPointerDown,
  gridBorderColor
}: {
  x: number;
  y: number;
  terrain: TerrainType;
  zoom: number;
  showGrid: boolean;
  onClick: (x: number, y: number) => void;
  onPointerDown?: (x: number, y: number) => void;
  gridBorderColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(x, y)}
      onPointerDown={() => onPointerDown?.(x, y)}
      className="touch-manipulation"
      style={{
        width: zoom,
        height: zoom,
        backgroundColor: terrainColorMap[terrain],
        border: showGrid ? `1px solid ${gridBorderColor ?? 'rgba(255,255,255,0.45)'}` : 'none'
      }}
      aria-label={`Tile ${x},${y}`}
    />
  );
}
