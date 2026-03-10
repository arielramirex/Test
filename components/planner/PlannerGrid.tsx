import type {
  GridCalibration,
  OverlayMode,
  PlannerMarker,
  PlannerObjectInstance,
  PlannerReferenceLayer,
  TerrainType
} from '@/src/data/islandPlanner';
import { PlannerTile } from './PlannerTile';
import { MarkerLayer, ObjectLayer } from './MarkerLayer';
import { ObjectGhostPreview } from './ObjectGhostPreview';

export function PlannerGrid({
  terrains,
  objects,
  markers,
  calibration,
  overlayMode,
  referenceLayer,
  selectedObjectId,
  selectedMarkerId,
  ghost,
  onTileClick,
  onTileHover,
  onPaintStart,
  onPaintDrag,
  onPaintEnd,
  onObjectSelect,
  onMarkerSelect,
  onMarkerPointerDown,
  onReferencePointerDown,
  onReferencePointerMove,
  onReferencePointerUp
}: {
  terrains: TerrainType[];
  objects: PlannerObjectInstance[];
  markers: PlannerMarker[];
  calibration: GridCalibration;
  overlayMode: OverlayMode;
  referenceLayer: PlannerReferenceLayer;
  selectedObjectId: string | null;
  selectedMarkerId: string | null;
  ghost: { x: number | null; y: number | null; objectId: string | null; orientation: 'horizontal' | 'vertical'; valid: boolean };
  onTileClick: (x: number, y: number) => void;
  onTileHover: (x: number, y: number) => void;
  onPaintStart: (x: number, y: number) => void;
  onPaintDrag: (x: number, y: number) => void;
  onPaintEnd: () => void;
  onObjectSelect: (instanceId: string) => void;
  onMarkerSelect: (id: string) => void;
  onMarkerPointerDown: (id: string, clientX: number, clientY: number) => void;
  onReferencePointerDown: (clientX: number, clientY: number) => void;
  onReferencePointerMove: (clientX: number, clientY: number) => void;
  onReferencePointerUp: () => void;
}) {
  const gridSize = calibration.gridSize;
  const tileSize = calibration.tileSize;
  const width = gridSize * tileSize;
  const height = gridSize * tileSize;

  const showImage = overlayMode === 'image' || overlayMode === 'image-grid' || overlayMode === 'full';
  const showGrid = overlayMode !== 'image';
  const showObjects = overlayMode === 'full';

  return (
    <div className="overflow-auto rounded-2xl border border-white/40 bg-white/70 p-2 shadow-float dark:border-slate-700 dark:bg-slate-900/60">
      <div
        className="relative"
        style={{ width: width + Math.abs(calibration.offsetX) + 8, height: height + Math.abs(calibration.offsetY) + 8 }}
      >
        {showImage && referenceLayer.imageDataUrl && referenceLayer.visible ? (
          <div
            className={`absolute inset-0 z-0 overflow-hidden rounded-md ${referenceLayer.locked ? 'pointer-events-none' : 'pointer-events-auto'}`}
            style={{ opacity: referenceLayer.opacity }}
            onPointerDown={(event) => {
              if (referenceLayer.locked) return;
              event.preventDefault();
              onReferencePointerDown(event.clientX, event.clientY);
            }}
            onPointerMove={(event) => {
              if (referenceLayer.locked) return;
              onReferencePointerMove(event.clientX, event.clientY);
            }}
            onPointerUp={onReferencePointerUp}
            onPointerLeave={onReferencePointerUp}
          >
            <img
              src={referenceLayer.imageDataUrl}
              alt="Imported island reference"
              className="h-full w-full object-cover"
              style={{
                transformOrigin: 'center center',
                transform: `translate(${referenceLayer.offsetX}px, ${referenceLayer.offsetY}px) scale(${referenceLayer.scale}) rotate(${referenceLayer.rotation}deg)`
              }}
            />
          </div>
        ) : null}

        <div
          className="absolute z-10"
          style={{ left: calibration.offsetX, top: calibration.offsetY, width, height, opacity: calibration.terrainOpacity }}
          onPointerUp={onPaintEnd}
          onPointerLeave={onPaintEnd}
        >
          {showGrid ? (
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width,
                height
              }}
            >
              {terrains.map((terrain, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize);
                return (
                  <div
                    key={`${x}-${y}`}
                    onPointerEnter={() => {
                      onTileHover(x, y);
                      onPaintDrag(x, y);
                    }}
                    onMouseEnter={() => onTileHover(x, y)}
                  >
                    <PlannerTile
                      x={x}
                      y={y}
                      terrain={terrain}
                      zoom={tileSize}
                      showGrid={calibration.showLines}
                      onClick={onTileClick}
                      onPointerDown={onPaintStart}
                      gridBorderColor={calibration.highContrastLines ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.45)'}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          <ObjectGhostPreview
            objectId={ghost.objectId}
            orientation={ghost.orientation}
            tileSize={tileSize}
            x={ghost.x}
            y={ghost.y}
            valid={ghost.valid}
            visible={showObjects}
          />

          <ObjectLayer
            objects={objects}
            tileSize={tileSize}
            selectedObjectId={selectedObjectId}
            visible={showObjects}
            onObjectSelect={onObjectSelect}
          />

          <MarkerLayer
            markers={markers}
            tileSize={tileSize}
            gridSize={gridSize}
            visible={showObjects}
            selectedMarkerId={selectedMarkerId}
            onSelectMarker={onMarkerSelect}
            onMarkerPointerDown={onMarkerPointerDown}
          />
        </div>
      </div>
    </div>
  );
}
