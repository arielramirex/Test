import { terrainColorMap, type TerrainType } from '@/src/data/islandPlanner';

export function PlannerTile({
  x,
  y,
  terrain,
  zoom,
  showGrid,
  onClick
}: {
  x: number;
  y: number;
  terrain: TerrainType;
  zoom: number;
  showGrid: boolean;
  onClick: (x: number, y: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(x, y)}
      className="touch-manipulation"
      style={{
        width: zoom,
        height: zoom,
        backgroundColor: terrainColorMap[terrain],
        border: showGrid ? '1px solid rgba(255,255,255,0.45)' : 'none'
      }}
      aria-label={`Tile ${x},${y}`}
    />
  );
}
