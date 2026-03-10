'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GridCalibrationPanel } from '@/components/planner/GridCalibrationPanel';
import { MarkerPalette } from '@/components/planner/MarkerPalette';
import { OverlayControls } from '@/components/planner/OverlayControls';
import { PlannerGrid } from '@/components/planner/PlannerGrid';
import { PlannerLegend } from '@/components/planner/PlannerLegend';
import { PlannerReferenceControls } from '@/components/planner/PlannerReferenceControls';
import { PlannerToolbar } from '@/components/planner/PlannerToolbar';
import { SectionHero } from '@/components/ui/SectionHero';
import {
  defaultOverlayMode,
  getObjectFootprint,
  objectConfigMap,
  plannerGridDefaults,
  plannerReferenceDefaults,
  PLANNER_STORAGE_KEY,
  placeableObjects,
  type GridCalibration,
  type OverlayMode,
  type PlannerMarker,
  type PlannerObjectInstance,
  type PlannerReferenceLayer,
  type PlannerSnapshot,
  type PlannerTool,
  type TerrainType
} from '@/src/data/islandPlanner';

function createTerrains(gridSize: number, fill: TerrainType = 'grass') {
  return Array.from({ length: gridSize * gridSize }, () => fill);
}

function tileIndex(x: number, y: number, gridSize: number) {
  return y * gridSize + x;
}

function getObjectAtTile(objects: PlannerObjectInstance[], x: number, y: number) {
  return objects.find((entry) => {
    const footprint = getObjectFootprint(entry.objectId, entry.orientation ?? 'horizontal');
    return x >= entry.x && x < entry.x + footprint.width && y >= entry.y && y < entry.y + footprint.height;
  });
}

function collides(
  objects: PlannerObjectInstance[],
  testX: number,
  testY: number,
  objectId: string,
  orientation: 'horizontal' | 'vertical',
  gridSize: number,
  ignoreId?: string
) {
  const footprint = getObjectFootprint(objectId, orientation);

  if (testX < 0 || testY < 0 || testX + footprint.width > gridSize || testY + footprint.height > gridSize) {
    return true;
  }

  return objects.some((entry) => {
    if (ignoreId && entry.instanceId === ignoreId) return false;
    const other = getObjectFootprint(entry.objectId, entry.orientation ?? 'horizontal');

    return !(
      testX + footprint.width <= entry.x ||
      testX >= entry.x + other.width ||
      testY + footprint.height <= entry.y ||
      testY >= entry.y + other.height
    );
  });
}

function resizeTerrains(current: TerrainType[], previousSize: number, nextSize: number) {
  const next = createTerrains(nextSize);
  const shared = Math.min(previousSize, nextSize);
  for (let y = 0; y < shared; y += 1) {
    for (let x = 0; x < shared; x += 1) {
      next[tileIndex(x, y, nextSize)] = current[tileIndex(x, y, previousSize)];
    }
  }
  return next;
}

export default function PlannerPage() {
  const [calibration, setCalibration] = useState<GridCalibration>(plannerGridDefaults);
  const [terrains, setTerrains] = useState<TerrainType[]>(createTerrains(plannerGridDefaults.gridSize));
  const [objects, setObjects] = useState<PlannerObjectInstance[]>([]);
  const [markers, setMarkers] = useState<PlannerMarker[]>([]);
  const [activeTool, setActiveTool] = useState<PlannerTool>({ mode: 'terrain', terrain: 'grass' });
  const [overlayMode, setOverlayMode] = useState<OverlayMode>(defaultOverlayMode);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [placementOrientation, setPlacementOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [brushEnabled, setBrushEnabled] = useState(true);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);
  const [referenceLayer, setReferenceLayer] = useState<PlannerReferenceLayer>(plannerReferenceDefaults);
  const [history, setHistory] = useState<PlannerSnapshot[]>([]);
  const [status, setStatus] = useState('Tip: choose a tool and tap tiles to start planning.');

  const paintSession = useRef(false);
  const dragReference = useRef<{ active: boolean; lastX: number; lastY: number }>({ active: false, lastX: 0, lastY: 0 });
  const dragMarker = useRef<{ id: string | null; startX: number; startY: number; markerX: number; markerY: number }>({
    id: null,
    startX: 0,
    startY: 0,
    markerX: 0,
    markerY: 0
  });

  useEffect(() => {
    const stored = localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as {
        terrains?: TerrainType[];
        objects?: PlannerObjectInstance[];
        markers?: PlannerMarker[];
        activeTool?: PlannerTool;
        overlayMode?: OverlayMode;
        calibration?: GridCalibration;
        referenceLayer?: PlannerReferenceLayer;
        placementOrientation?: 'horizontal' | 'vertical';
        brushEnabled?: boolean;
      };

      const nextCalibration = { ...plannerGridDefaults, ...parsed.calibration };
      setCalibration(nextCalibration);

      if (parsed.terrains?.length === nextCalibration.gridSize * nextCalibration.gridSize) {
        setTerrains(parsed.terrains);
      } else if (parsed.terrains?.length) {
        const inferredSize = Math.floor(Math.sqrt(parsed.terrains.length));
        setTerrains(resizeTerrains(parsed.terrains, inferredSize, nextCalibration.gridSize));
      }

      if (Array.isArray(parsed.objects)) setObjects(parsed.objects);
      if (Array.isArray(parsed.markers)) setMarkers(parsed.markers);
      if (parsed.activeTool) setActiveTool(parsed.activeTool);
      if (parsed.overlayMode) setOverlayMode(parsed.overlayMode);
      if (parsed.referenceLayer) setReferenceLayer({ ...plannerReferenceDefaults, ...parsed.referenceLayer });
      if (parsed.placementOrientation) setPlacementOrientation(parsed.placementOrientation);
      if (typeof parsed.brushEnabled === 'boolean') setBrushEnabled(parsed.brushEnabled);
    } catch {
      localStorage.removeItem(PLANNER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload = {
      terrains,
      objects,
      markers,
      activeTool,
      overlayMode,
      calibration,
      referenceLayer,
      placementOrientation,
      brushEnabled
    };

    try {
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      const fallbackPayload = {
        ...payload,
        referenceLayer: {
          ...referenceLayer,
          imageDataUrl: null
        }
      };
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(fallbackPayload));
      if (referenceLayer.imageDataUrl) {
        setStatus('Saved planner edits, but the image is too large for localStorage. You may need to re-upload it later.');
      }
    }
  }, [terrains, objects, markers, activeTool, overlayMode, calibration, referenceLayer, placementOrientation, brushEnabled]);

  useEffect(() => {
    if (!dragMarker.current.id) return;

    const onMove = (event: PointerEvent) => {
      const markerId = dragMarker.current.id;
      if (!markerId) return;

      const dx = event.clientX - dragMarker.current.startX;
      const dy = event.clientY - dragMarker.current.startY;
      const nextX = Math.max(0, Math.min(calibration.gridSize - 1, Math.round(dragMarker.current.markerX + dx / calibration.tileSize)));
      const nextY = Math.max(0, Math.min(calibration.gridSize - 1, Math.round(dragMarker.current.markerY + dy / calibration.tileSize)));

      setMarkers((current) => current.map((marker) => (marker.id === markerId ? { ...marker, x: nextX, y: nextY } : marker)));
    };

    const onUp = () => {
      dragMarker.current.id = null;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [calibration.gridSize, calibration.tileSize]);

  const pushHistory = () => {
    setHistory((current) => [...current.slice(-39), { terrains: [...terrains], objects: [...objects] }]);
  };

  const applyTerrainAt = (x: number, y: number, terrain: TerrainType) => {
    setTerrains((current) => {
      const next = [...current];
      next[tileIndex(x, y, calibration.gridSize)] = terrain;
      return next;
    });
  };

  const handleTileClick = (x: number, y: number) => {
    const objectAtTile = getObjectAtTile(objects, x, y);

    if (activeTool.mode === 'terrain') {
      pushHistory();
      applyTerrainAt(x, y, activeTool.terrain);
      setStatus(`Painted ${activeTool.terrain} at (${x}, ${y}).`);
      return;
    }

    if (activeTool.mode === 'erase') {
      pushHistory();
      if (objectAtTile) {
        setObjects((current) => current.filter((entry) => entry.instanceId !== objectAtTile.instanceId));
        setStatus('Removed placed object.');
      } else {
        applyTerrainAt(x, y, 'grass');
        setStatus('Erased terrain back to grass.');
      }
      return;
    }

    if (activeTool.mode === 'place') {
      const targetObject = placeableObjects.find((entry) => entry.id === activeTool.objectId);
      if (!targetObject) return;

      if (collides(objects, x, y, targetObject.id, placementOrientation, calibration.gridSize)) {
        setStatus('Cannot place there: out of bounds or overlapping another object.');
        return;
      }

      pushHistory();
      setObjects((current) => [
        ...current,
        {
          instanceId: `${targetObject.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          objectId: targetObject.id,
          orientation: placementOrientation,
          x,
          y
        }
      ]);
      setStatus(`Placed ${targetObject.name} at (${x}, ${y}).`);
      return;
    }

    if (activeTool.mode === 'select') {
      if (selectedObjectId) {
        const selectedObject = objects.find((entry) => entry.instanceId === selectedObjectId);
        if (!selectedObject) {
          setSelectedObjectId(null);
          return;
        }

        if (collides(
          objects,
          x,
          y,
          selectedObject.objectId,
          selectedObject.orientation ?? 'horizontal',
          calibration.gridSize,
          selectedObject.instanceId
        )) {
          if (objectAtTile) {
            setSelectedObjectId(objectAtTile.instanceId);
            setStatus(`Selected ${objectConfigMap[objectAtTile.objectId]?.name ?? 'object'} for moving.`);
          } else {
            setStatus('Cannot move there: out of bounds or overlapping another object.');
          }
          return;
        }

        pushHistory();
        setObjects((current) => current.map((entry) => (entry.instanceId === selectedObjectId ? { ...entry, x, y } : entry)));
        setStatus(`Moved object to (${x}, ${y}).`);
        return;
      }

      if (objectAtTile) {
        setSelectedObjectId(objectAtTile.instanceId);
        setStatus(`Selected ${objectConfigMap[objectAtTile.objectId]?.name ?? 'object'} for moving.`);
      } else {
        setStatus('Tap an object to select it, then tap destination tile to move.');
      }
    }
  };

  const handlePaintStart = (x: number, y: number) => {
    if (!brushEnabled) return;
    if (!(activeTool.mode === 'terrain' || activeTool.mode === 'erase')) return;
    paintSession.current = true;
    pushHistory();
    if (activeTool.mode === 'terrain') applyTerrainAt(x, y, activeTool.terrain);
    if (activeTool.mode === 'erase') applyTerrainAt(x, y, 'grass');
  };

  const handlePaintDrag = (x: number, y: number) => {
    if (!paintSession.current || !brushEnabled) return;
    if (activeTool.mode === 'terrain') applyTerrainAt(x, y, activeTool.terrain);
    if (activeTool.mode === 'erase') applyTerrainAt(x, y, 'grass');
  };

  const handlePaintEnd = () => {
    paintSession.current = false;
  };

  const handleReset = () => {
    pushHistory();
    setTerrains(createTerrains(calibration.gridSize));
    setObjects([]);
    setMarkers([]);
    setSelectedObjectId(null);
    setSelectedMarkerId(null);
    setStatus('Planner reset.');
  };

  const handleUndo = () => {
    setHistory((current) => {
      if (!current.length) {
        setStatus('Nothing to undo.');
        return current;
      }
      const last = current[current.length - 1];
      setTerrains(last.terrains);
      setObjects(last.objects);
      setStatus('Undid last action.');
      return current.slice(0, -1);
    });
  };

  const handleDuplicateSelected = () => {
    if (!selectedObjectId) return;
    const selected = objects.find((entry) => entry.instanceId === selectedObjectId);
    if (!selected) return;

    const nextX = Math.min(calibration.gridSize - 1, selected.x + 1);
    const nextY = selected.y;
    if (collides(objects, nextX, nextY, selected.objectId, selected.orientation ?? 'horizontal', calibration.gridSize)) {
      setStatus('Cannot duplicate object at adjacent tile.');
      return;
    }

    pushHistory();
    setObjects((current) => [
      ...current,
      {
        ...selected,
        instanceId: `${selected.objectId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        x: nextX,
        y: nextY
      }
    ]);
    setStatus('Duplicated selected object.');
  };

  const handleGridCalibration = (next: Partial<GridCalibration>) => {
    if (typeof next.gridSize === 'number' && next.gridSize !== calibration.gridSize) {
      const resized = resizeTerrains(terrains, calibration.gridSize, next.gridSize);
      setTerrains(resized);
      setObjects((current) =>
        current.filter((entry) => {
          const footprint = getObjectFootprint(entry.objectId, entry.orientation ?? 'horizontal');
          return entry.x + footprint.width <= next.gridSize && entry.y + footprint.height <= next.gridSize;
        })
      );
      setMarkers((current) => current.filter((marker) => marker.x < next.gridSize && marker.y < next.gridSize));
    }

    setCalibration((current) => ({ ...current, ...next }));
  };

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('Please upload a PNG or JPG image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!dataUrl) {
        setStatus('Unable to read image file.');
        return;
      }
      setReferenceLayer((current) => ({ ...current, imageDataUrl: dataUrl, visible: true }));
      setStatus('Island map imported as planner reference.');
    };
    reader.readAsDataURL(file);
  };

  const handleReferencePointerDown = (clientX: number, clientY: number) => {
    if (referenceLayer.locked) return;
    dragReference.current = { active: true, lastX: clientX, lastY: clientY };
  };

  const handleReferencePointerMove = (clientX: number, clientY: number) => {
    if (!dragReference.current.active || referenceLayer.locked) return;
    const dx = clientX - dragReference.current.lastX;
    const dy = clientY - dragReference.current.lastY;
    dragReference.current.lastX = clientX;
    dragReference.current.lastY = clientY;
    setReferenceLayer((current) => ({ ...current, offsetX: current.offsetX + dx, offsetY: current.offsetY + dy }));
  };

  const handleReferencePointerUp = () => {
    dragReference.current.active = false;
  };

  const handleAddMarker = (label: string, color: string) => {
    const center = Math.floor(calibration.gridSize / 2);
    const id = `marker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setMarkers((current) => [...current, { id, label, color, x: center, y: center }]);
    setSelectedMarkerId(id);
  };

  const selectedMarker = markers.find((marker) => marker.id === selectedMarkerId) ?? null;

  const ghost = useMemo(() => {
    if (activeTool.mode !== 'place' || !hoverTile) {
      return { x: null, y: null, objectId: null, orientation: placementOrientation, valid: false };
    }
    const valid = !collides(objects, hoverTile.x, hoverTile.y, activeTool.objectId, placementOrientation, calibration.gridSize);
    return { x: hoverTile.x, y: hoverTile.y, objectId: activeTool.objectId, orientation: placementOrientation, valid };
  }, [activeTool, hoverTile, placementOrientation, objects, calibration.gridSize]);

  const placedCount = useMemo(() => objects.length, [objects]);

  return (
    <main className="page-shell space-y-4">
      <SectionHero
        label="Island Planner"
        tint="#b8d7ff"
        title="Island Planner"
        subtitle="Use transparent overlays, calibration controls, markers, and ghost footprints to plan terraforming and building placements manually."
      />

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <PlannerReferenceControls
            reference={referenceLayer}
            onUpload={handleImageUpload}
            onChange={(next) => setReferenceLayer((current) => ({ ...current, ...next }))}
            onNudge={(dx, dy) => setReferenceLayer((current) => ({ ...current, offsetX: current.offsetX + dx, offsetY: current.offsetY + dy }))}
            onNudgeScale={(delta) => setReferenceLayer((current) => ({ ...current, scale: Math.min(1.8, Math.max(0.6, Number((current.scale + delta).toFixed(2)))) }))}
            onNudgeRotation={(delta) => setReferenceLayer((current) => ({ ...current, rotation: Math.min(20, Math.max(-20, Number((current.rotation + delta).toFixed(1)))) }))}
            onResetPosition={() => setReferenceLayer((current) => ({ ...current, offsetX: 0, offsetY: 0 }))}
            onResetScale={() => setReferenceLayer((current) => ({ ...current, scale: 1 }))}
            onResetRotation={() => setReferenceLayer((current) => ({ ...current, rotation: 0 }))}
            onClearImage={() => setReferenceLayer((current) => ({ ...current, imageDataUrl: null }))}
          />

          <OverlayControls
            overlayMode={overlayMode}
            terrainOpacity={calibration.terrainOpacity}
            onOverlayMode={setOverlayMode}
            onTerrainOpacity={(value) => handleGridCalibration({ terrainOpacity: value })}
          />

          <GridCalibrationPanel
            settings={calibration}
            onChange={handleGridCalibration}
            onSnapImageCenter={() => setReferenceLayer((current) => ({ ...current, offsetX: 0, offsetY: 0 }))}
            onSnapGridCenter={() => handleGridCalibration({ offsetX: 0, offsetY: 0 })}
          />

          <PlannerToolbar
            activeTool={activeTool}
            brushEnabled={brushEnabled}
            orientation={placementOrientation}
            onSelectTerrain={(terrain) => {
              setActiveTool({ mode: 'terrain', terrain });
              setSelectedObjectId(null);
            }}
            onSelectObject={(objectId) => {
              setActiveTool({ mode: 'place', objectId });
              setSelectedObjectId(null);
            }}
            onSelectErase={() => {
              setActiveTool({ mode: 'erase' });
              setSelectedObjectId(null);
            }}
            onSelectMove={() => setActiveTool({ mode: 'select' })}
            onToggleBrush={() => setBrushEnabled((current) => !current)}
            onRotatePlacement={() => setPlacementOrientation((current) => (current === 'horizontal' ? 'vertical' : 'horizontal'))}
            onDuplicateSelected={handleDuplicateSelected}
            onUndo={handleUndo}
            onReset={handleReset}
            selectedObjectExists={Boolean(selectedObjectId)}
          />

          <MarkerPalette
            onAddMarker={handleAddMarker}
            selectedMarkerLabel={selectedMarker?.label ?? null}
            onDeleteMarker={() => {
              if (!selectedMarkerId) return;
              setMarkers((current) => current.filter((marker) => marker.id !== selectedMarkerId));
              setSelectedMarkerId(null);
            }}
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-white/80 p-3 text-sm shadow-float dark:bg-slate-900/70">
            <p className="font-bold">Placed Objects: {placedCount}</p>
            <p className="text-slate-600 dark:text-slate-300">{status}</p>
          </div>

          <PlannerGrid
            terrains={terrains}
            objects={objects}
            markers={markers}
            calibration={calibration}
            overlayMode={overlayMode}
            referenceLayer={referenceLayer}
            selectedObjectId={selectedObjectId}
            selectedMarkerId={selectedMarkerId}
            ghost={ghost}
            onTileClick={handleTileClick}
            onTileHover={(x, y) => setHoverTile({ x, y })}
            onPaintStart={handlePaintStart}
            onPaintDrag={handlePaintDrag}
            onPaintEnd={handlePaintEnd}
            onObjectSelect={(instanceId) => {
              setSelectedObjectId(instanceId);
              setActiveTool({ mode: 'select' });
            }}
            onMarkerSelect={setSelectedMarkerId}
            onMarkerPointerDown={(id, clientX, clientY) => {
              const marker = markers.find((entry) => entry.id === id);
              if (!marker) return;
              dragMarker.current = {
                id,
                startX: clientX,
                startY: clientY,
                markerX: marker.x,
                markerY: marker.y
              };
            }}
            onReferencePointerDown={handleReferencePointerDown}
            onReferencePointerMove={handleReferencePointerMove}
            onReferencePointerUp={handleReferencePointerUp}
          />

          <PlannerLegend objects={objects} />
        </div>
      </section>
    </main>
  );
}
