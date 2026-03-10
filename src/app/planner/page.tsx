'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlannerGrid } from '@/components/planner/PlannerGrid';
import { PlannerLegend } from '@/components/planner/PlannerLegend';
import { PlannerReferenceControls } from '@/components/planner/PlannerReferenceControls';
import { PlannerToolbar } from '@/components/planner/PlannerToolbar';
import { SectionHero } from '@/components/ui/SectionHero';
import {
  objectConfigMap,
  PLANNER_GRID_SIZE,
  PLANNER_STORAGE_KEY,
  plannerReferenceDefaults,
  placeableObjects,
  type PlannerObjectInstance,
  type PlannerReferenceLayer,
  type PlannerSnapshot,
  type PlannerTool,
  type TerrainType
} from '@/src/data/islandPlanner';

const initialTerrains = Array.from({ length: PLANNER_GRID_SIZE * PLANNER_GRID_SIZE }, () => 'grass' as TerrainType);

function tileIndex(x: number, y: number) {
  return y * PLANNER_GRID_SIZE + x;
}

function getObjectAtTile(objects: PlannerObjectInstance[], x: number, y: number) {
  return objects.find((entry) => {
    const config = objectConfigMap[entry.objectId];
    if (!config) return false;
    return x >= entry.x && x < entry.x + config.width && y >= entry.y && y < entry.y + config.height;
  });
}

function collides(objects: PlannerObjectInstance[], testX: number, testY: number, objectId: string, ignoreId?: string) {
  const config = objectConfigMap[objectId];
  if (!config) return true;

  if (testX < 0 || testY < 0 || testX + config.width > PLANNER_GRID_SIZE || testY + config.height > PLANNER_GRID_SIZE) {
    return true;
  }

  return objects.some((entry) => {
    if (ignoreId && entry.instanceId === ignoreId) return false;
    const other = objectConfigMap[entry.objectId];
    if (!other) return false;

    return !(
      testX + config.width <= entry.x ||
      testX >= entry.x + other.width ||
      testY + config.height <= entry.y ||
      testY >= entry.y + other.height
    );
  });
}

export default function PlannerPage() {
  const [terrains, setTerrains] = useState<TerrainType[]>(initialTerrains);
  const [objects, setObjects] = useState<PlannerObjectInstance[]>([]);
  const [activeTool, setActiveTool] = useState<PlannerTool>({ mode: 'terrain', terrain: 'grass' });
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(22);
  const [showGrid, setShowGrid] = useState(true);
  const [referenceLayer, setReferenceLayer] = useState<PlannerReferenceLayer>(plannerReferenceDefaults);
  const [history, setHistory] = useState<PlannerSnapshot[]>([]);
  const [status, setStatus] = useState('Tip: choose a tool and tap tiles to start planning.');

  useEffect(() => {
    const stored = localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as {
        terrains?: TerrainType[];
        objects?: PlannerObjectInstance[];
        zoom?: number;
        showGrid?: boolean;
        referenceLayer?: PlannerReferenceLayer;
      };

      if (parsed.terrains?.length === initialTerrains.length) setTerrains(parsed.terrains);
      if (Array.isArray(parsed.objects)) setObjects(parsed.objects);
      if (typeof parsed.zoom === 'number') setZoom(parsed.zoom);
      if (typeof parsed.showGrid === 'boolean') setShowGrid(parsed.showGrid);
      if (parsed.referenceLayer) {
        setReferenceLayer({ ...plannerReferenceDefaults, ...parsed.referenceLayer });
      }
    } catch {
      localStorage.removeItem(PLANNER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload = {
      terrains,
      objects,
      zoom,
      showGrid,
      referenceLayer
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
  }, [objects, referenceLayer, showGrid, terrains, zoom]);

  const pushHistory = () => {
    setHistory((current) => [...current.slice(-39), { terrains: [...terrains], objects: [...objects] }]);
  };

  const resetPlanner = () => {
    pushHistory();
    setTerrains(initialTerrains);
    setObjects([]);
    setSelectedObjectId(null);
    setStatus('Planner reset.');
  };

  const undo = () => {
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
      setReferenceLayer((current) => ({
        ...current,
        imageDataUrl: dataUrl,
        visible: true
      }));
      setStatus('Island map imported as planner reference.');
    };
    reader.readAsDataURL(file);
  };

  const handleTileClick = (x: number, y: number) => {
    const objectAtTile = getObjectAtTile(objects, x, y);

    if (activeTool.mode === 'terrain') {
      pushHistory();
      setTerrains((current) => {
        const next = [...current];
        next[tileIndex(x, y)] = activeTool.terrain;
        return next;
      });
      setStatus(`Painted ${activeTool.terrain} at (${x}, ${y}).`);
      return;
    }

    if (activeTool.mode === 'erase') {
      pushHistory();
      if (objectAtTile) {
        setObjects((current) => current.filter((entry) => entry.instanceId !== objectAtTile.instanceId));
        setStatus('Removed placed object.');
      } else {
        setTerrains((current) => {
          const next = [...current];
          next[tileIndex(x, y)] = 'grass';
          return next;
        });
        setStatus('Erased terrain back to grass.');
      }
      return;
    }

    if (activeTool.mode === 'place') {
      const targetObject = placeableObjects.find((entry) => entry.id === activeTool.objectId);
      if (!targetObject) return;

      if (collides(objects, x, y, targetObject.id)) {
        setStatus('Cannot place there: out of bounds or overlapping another object.');
        return;
      }

      pushHistory();
      setObjects((current) => [
        ...current,
        {
          instanceId: `${targetObject.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          objectId: targetObject.id,
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

        if (collides(objects, x, y, selectedObject.objectId, selectedObject.instanceId)) {
          if (objectAtTile) {
            setSelectedObjectId(objectAtTile.instanceId);
            setStatus(`Selected ${objectConfigMap[objectAtTile.objectId]?.name ?? 'object'} for moving.`);
          } else {
            setStatus('Cannot move there: out of bounds or overlapping another object.');
          }
          return;
        }

        pushHistory();
        setObjects((current) =>
          current.map((entry) => (entry.instanceId === selectedObjectId ? { ...entry, x, y } : entry))
        );
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

  const placedCount = useMemo(() => objects.length, [objects]);

  return (
    <main className="page-shell space-y-4">
      <SectionHero
        label="Island Planner"
        tint="#b8d7ff"
        title="Island Planner"
        subtitle="Sketch terraforming and building layouts before making in-game changes. All planner data stays in your browser via localStorage."
      />

      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <PlannerToolbar
            activeTool={activeTool}
            zoom={zoom}
            showGrid={showGrid}
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
            onUndo={undo}
            onReset={resetPlanner}
            onZoom={setZoom}
            onToggleGrid={() => setShowGrid((current) => !current)}
          />

          <PlannerReferenceControls
            reference={referenceLayer}
            onUpload={handleImageUpload}
            onChange={(next) => setReferenceLayer((current) => ({ ...current, ...next }))}
            onResetAlignment={() =>
              setReferenceLayer((current) => ({
                ...current,
                offsetX: 0,
                offsetY: 0,
                scale: 1
              }))
            }
            onClearImage={() =>
              setReferenceLayer((current) => ({
                ...current,
                imageDataUrl: null
              }))
            }
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-white/80 p-3 text-sm shadow-float dark:bg-slate-900/70">
            <p className="font-bold">Placed Objects: {placedCount}</p>
            <p className="text-slate-600 dark:text-slate-300">{status}</p>
          </div>

          <PlannerGrid
            gridSize={PLANNER_GRID_SIZE}
            terrains={terrains}
            objects={objects}
            zoom={zoom}
            showGrid={showGrid}
            referenceLayer={referenceLayer}
            selectedObjectId={selectedObjectId}
            onTileClick={handleTileClick}
          />

          <PlannerLegend objects={objects} />
        </div>
      </section>
    </main>
  );
}
