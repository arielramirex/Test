
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ExportPanel } from '@/components/planner/ExportPanel';
import { GridCalibrationPanel } from '@/components/planner/GridCalibrationPanel';
import { MarkerPalette } from '@/components/planner/MarkerPalette';
import { OverlayControls } from '@/components/planner/OverlayControls';
import { PlannerGrid } from '@/components/planner/PlannerGrid';
import { PlannerLegend } from '@/components/planner/PlannerLegend';
import { PlannerReferenceControls } from '@/components/planner/PlannerReferenceControls';
import { PlannerToolbar } from '@/components/planner/PlannerToolbar';
import { PlannerTopbar } from '@/components/planner/PlannerTopbar';
import { SavedLayoutsPanel } from '@/components/planner/SavedLayoutsPanel';
import { SelectedObjectInspector } from '@/components/planner/SelectedObjectInspector';
import { SectionHero } from '@/components/ui/SectionHero';
import {
  defaultOverlayMode,
  getObjectFootprint,
  objectConfigMap,
  plannerGridDefaults,
  plannerReferenceDefaults,
  PLANNER_ACTIVE_LAYOUT_KEY,
  PLANNER_LAYOUTS_KEY,
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

type SavedLayout = PlannerSnapshot & { id: string; name: string };

type PlannerStateSnapshot = {
  terrains: TerrainType[];
  objects: PlannerObjectInstance[];
  markers: PlannerMarker[];
  activeTool: PlannerTool;
  overlayMode: OverlayMode;
  calibration: GridCalibration;
  referenceLayer: PlannerReferenceLayer;
  placementOrientation: 'horizontal' | 'vertical';
  brushEnabled: boolean;
  brushSize: number;
};

type SidebarTab = 'import' | 'overlay' | 'grid' | 'terrain' | 'buildings' | 'markers' | 'saved' | 'export';

const tabItems: { id: SidebarTab; label: string }[] = [
  { id: 'terrain', label: 'Terrain' },
  { id: 'buildings', label: 'Buildings' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'grid', label: 'Grid' },
  { id: 'import', label: 'Map Import' },
  { id: 'markers', label: 'Markers' },
  { id: 'saved', label: 'Saved Layout' },
  { id: 'export', label: 'Export' }
];

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

function cloneStateSnapshot(snapshot: PlannerStateSnapshot): PlannerStateSnapshot {
  return {
    terrains: [...snapshot.terrains],
    objects: snapshot.objects.map((entry) => ({ ...entry })),
    markers: snapshot.markers.map((entry) => ({ ...entry })),
    activeTool: snapshot.activeTool,
    overlayMode: snapshot.overlayMode,
    calibration: { ...snapshot.calibration },
    referenceLayer: { ...snapshot.referenceLayer },
    placementOrientation: snapshot.placementOrientation,
    brushEnabled: snapshot.brushEnabled,
    brushSize: snapshot.brushSize
  };
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
  const [brushSize, setBrushSize] = useState(1);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);
  const [referenceLayer, setReferenceLayer] = useState<PlannerReferenceLayer>(plannerReferenceDefaults);
  const [status, setStatus] = useState('Tip: choose a tool and tap tiles to start planning.');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('terrain');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [pastHistory, setPastHistory] = useState<PlannerStateSnapshot[]>([]);
  const [futureHistory, setFutureHistory] = useState<PlannerStateSnapshot[]>([]);

  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [activeLayoutId, setActiveLayoutId] = useState<string | null>(null);

  const [exportOptions, setExportOptions] = useState({ includeImage: true, includeGrid: true, includeMarkers: true });

  const paintSession = useRef(false);
  const dragReference = useRef<{ active: boolean; lastX: number; lastY: number }>({ active: false, lastX: 0, lastY: 0 });
  const dragMarker = useRef<{ id: string | null; startX: number; startY: number; markerX: number; markerY: number }>({
    id: null,
    startX: 0,
    startY: 0,
    markerX: 0,
    markerY: 0
  });
  const viewportRef = useRef<HTMLDivElement>(null);

  const captureSnapshot = (): PlannerStateSnapshot => ({
    terrains: [...terrains],
    objects: objects.map((obj) => ({ ...obj })),
    markers: markers.map((marker) => ({ ...marker })),
    activeTool,
    overlayMode,
    calibration: { ...calibration },
    referenceLayer: { ...referenceLayer },
    placementOrientation,
    brushEnabled,
    brushSize
  });

  const applySnapshot = (snapshot: PlannerStateSnapshot) => {
    setTerrains(snapshot.terrains);
    setObjects(snapshot.objects);
    setMarkers(snapshot.markers);
    setActiveTool(snapshot.activeTool);
    setOverlayMode(snapshot.overlayMode);
    setCalibration(snapshot.calibration);
    setReferenceLayer(snapshot.referenceLayer);
    setPlacementOrientation(snapshot.placementOrientation);
    setBrushEnabled(snapshot.brushEnabled);
    setBrushSize(snapshot.brushSize);
    setSelectedObjectId(null);
    setSelectedMarkerId(null);
  };

  const commitHistory = () => {
    setPastHistory((current) => [...current.slice(-79), captureSnapshot()]);
    setFutureHistory([]);
  };

  useEffect(() => {
    const stored = localStorage.getItem(PLANNER_STORAGE_KEY);
    const storedLayouts = localStorage.getItem(PLANNER_LAYOUTS_KEY);
    const storedActiveLayout = localStorage.getItem(PLANNER_ACTIVE_LAYOUT_KEY);

    if (storedLayouts) {
      try {
        const parsedLayouts = JSON.parse(storedLayouts) as SavedLayout[];
        if (Array.isArray(parsedLayouts)) {
          const valid = parsedLayouts.filter((layout) => layout && typeof layout.id === 'string');
          setSavedLayouts(valid);
        }
      } catch {
        localStorage.removeItem(PLANNER_LAYOUTS_KEY);
      }
    }

    if (storedActiveLayout) setActiveLayoutId(storedActiveLayout);

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as PlannerStateSnapshot;
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
      if (typeof parsed.brushSize === 'number') setBrushSize(Math.max(1, Math.min(3, parsed.brushSize)));
    } catch {
      localStorage.removeItem(PLANNER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload: PlannerStateSnapshot = {
      terrains,
      objects,
      markers,
      activeTool,
      overlayMode,
      calibration,
      referenceLayer,
      placementOrientation,
      brushEnabled,
      brushSize
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
  }, [terrains, objects, markers, activeTool, overlayMode, calibration, referenceLayer, placementOrientation, brushEnabled, brushSize]);

  useEffect(() => {
    localStorage.setItem(PLANNER_LAYOUTS_KEY, JSON.stringify(savedLayouts));
  }, [savedLayouts]);

  useEffect(() => {
    if (activeLayoutId) {
      localStorage.setItem(PLANNER_ACTIVE_LAYOUT_KEY, activeLayoutId);
    } else {
      localStorage.removeItem(PLANNER_ACTIVE_LAYOUT_KEY);
    }
  }, [activeLayoutId]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (dragMarker.current.id) {
        const markerId = dragMarker.current.id;
        const dx = event.clientX - dragMarker.current.startX;
        const dy = event.clientY - dragMarker.current.startY;
        const nextX = Math.max(0, Math.min(calibration.gridSize - 1, Math.round(dragMarker.current.markerX + dx / calibration.tileSize)));
        const nextY = Math.max(0, Math.min(calibration.gridSize - 1, Math.round(dragMarker.current.markerY + dy / calibration.tileSize)));
        setMarkers((current) => current.map((marker) => (marker.id === markerId ? { ...marker, x: nextX, y: nextY } : marker)));
      }

      if (dragReference.current.active && !referenceLayer.locked) {
        const dx = event.clientX - dragReference.current.lastX;
        const dy = event.clientY - dragReference.current.lastY;
        dragReference.current.lastX = event.clientX;
        dragReference.current.lastY = event.clientY;
        setReferenceLayer((current) => ({ ...current, offsetX: current.offsetX + dx, offsetY: current.offsetY + dy }));
      }
    };

    const onUp = () => {
      dragMarker.current.id = null;
      dragReference.current.active = false;
      paintSession.current = false;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [calibration.gridSize, calibration.tileSize, referenceLayer.locked]);

  const applyTerrainAt = (x: number, y: number, terrain: TerrainType) => {
    setTerrains((current) => {
      const next = [...current];
      const radius = Math.floor(brushSize / 2);
      for (let oy = -radius; oy <= radius; oy += 1) {
        for (let ox = -radius; ox <= radius; ox += 1) {
          const tx = x + ox;
          const ty = y + oy;
          if (tx < 0 || ty < 0 || tx >= calibration.gridSize || ty >= calibration.gridSize) continue;
          next[tileIndex(tx, ty, calibration.gridSize)] = terrain;
        }
      }
      return next;
    });
  };

  const handleTileClick = (x: number, y: number) => {
    const objectAtTile = getObjectAtTile(objects, x, y);

    if (activeTool.mode === 'terrain') {
      commitHistory();
      applyTerrainAt(x, y, activeTool.terrain);
      setStatus(`Painted ${activeTool.terrain} at (${x}, ${y}).`);
      return;
    }

    if (activeTool.mode === 'erase') {
      commitHistory();
      if (objectAtTile) {
        setObjects((current) => current.filter((entry) => entry.instanceId !== objectAtTile.instanceId));
        if (selectedObjectId === objectAtTile.instanceId) setSelectedObjectId(null);
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

      commitHistory();
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

        if (collides(objects, x, y, selectedObject.objectId, selectedObject.orientation ?? 'horizontal', calibration.gridSize, selectedObject.instanceId)) {
          if (objectAtTile) {
            setSelectedObjectId(objectAtTile.instanceId);
            setStatus(`Selected ${objectConfigMap[objectAtTile.objectId]?.name ?? 'object'} for moving.`);
          } else {
            setStatus('Cannot move there: out of bounds or overlapping another object.');
          }
          return;
        }

        commitHistory();
        setObjects((current) => current.map((entry) => (entry.instanceId === selectedObjectId ? { ...entry, x, y } : entry)));
        setStatus(`Moved object to (${x}, ${y}).`);
        return;
      }

      if (objectAtTile) {
        setSelectedObjectId(objectAtTile.instanceId);
        setSelectedMarkerId(null);
        setStatus(`Selected ${objectConfigMap[objectAtTile.objectId]?.name ?? 'object'} for moving.`);
      }
    }
  };

  const handlePaintStart = (x: number, y: number) => {
    if (!brushEnabled || (activeTool.mode !== 'terrain' && activeTool.mode !== 'erase')) return;
    paintSession.current = true;
    commitHistory();
    if (activeTool.mode === 'terrain') {
      applyTerrainAt(x, y, activeTool.terrain);
    } else {
      applyTerrainAt(x, y, 'grass');
    }
  };

  const handlePaintDrag = (x: number, y: number) => {
    if (!paintSession.current || !brushEnabled) return;
    if (activeTool.mode === 'terrain') {
      applyTerrainAt(x, y, activeTool.terrain);
    } else if (activeTool.mode === 'erase') {
      applyTerrainAt(x, y, 'grass');
    }
  };

  const handlePaintEnd = () => {
    if (!paintSession.current) return;
    paintSession.current = false;
    setStatus('Paint stroke applied.');
  };

  const handleUndo = () => {
    if (!pastHistory.length) return;
    const current = captureSnapshot();
    const previous = pastHistory[pastHistory.length - 1];
    setPastHistory((list) => list.slice(0, -1));
    setFutureHistory((list) => [...list, cloneStateSnapshot(current)]);
    applySnapshot(cloneStateSnapshot(previous));
    setStatus('Undid last action.');
  };

  const handleRedo = () => {
    if (!futureHistory.length) return;
    const current = captureSnapshot();
    const next = futureHistory[futureHistory.length - 1];
    setFutureHistory((list) => list.slice(0, -1));
    setPastHistory((list) => [...list, cloneStateSnapshot(current)]);
    applySnapshot(cloneStateSnapshot(next));
    setStatus('Redid action.');
  };

  const clearPlanner = () => {
    commitHistory();
    setTerrains(createTerrains(calibration.gridSize));
    setObjects([]);
    setMarkers([]);
    setSelectedObjectId(null);
    setSelectedMarkerId(null);
    setStatus('Cleared terrain, objects, and markers.');
  };

  const resetPlanner = () => {
    commitHistory();
    setCalibration(plannerGridDefaults);
    setTerrains(createTerrains(plannerGridDefaults.gridSize));
    setObjects([]);
    setMarkers([]);
    setSelectedObjectId(null);
    setSelectedMarkerId(null);
    setReferenceLayer(plannerReferenceDefaults);
    setOverlayMode(defaultOverlayMode);
    setStatus('Planner reset to defaults.');
  };

  const centerView = () => {
    viewportRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  };

  const selectedObject = useMemo(
    () => objects.find((entry) => entry.instanceId === selectedObjectId) ?? null,
    [objects, selectedObjectId]
  );

  const selectedMarker = useMemo(
    () => markers.find((entry) => entry.id === selectedMarkerId) ?? null,
    [markers, selectedMarkerId]
  );

  const ghostPreview = useMemo(() => {
    if (activeTool.mode !== 'place') {
      return { x: null, y: null, objectId: null, orientation: placementOrientation, valid: false } as const;
    }
    if (!hoverTile) {
      return { x: null, y: null, objectId: activeTool.objectId, orientation: placementOrientation, valid: false } as const;
    }
    return {
      x: hoverTile.x,
      y: hoverTile.y,
      objectId: activeTool.objectId,
      orientation: placementOrientation,
      valid: !collides(objects, hoverTile.x, hoverTile.y, activeTool.objectId, placementOrientation, calibration.gridSize)
    } as const;
  }, [activeTool, hoverTile, placementOrientation, objects, calibration.gridSize]);

  const currentLayoutName = useMemo(() => {
    const active = savedLayouts.find((layout) => layout.id === activeLayoutId);
    return active?.name ?? 'Unsaved Layout';
  }, [savedLayouts, activeLayoutId]);

  const saveToLayouts = () => {
    const name = window.prompt('Layout name', currentLayoutName === 'Unsaved Layout' ? 'Island Concept' : currentLayoutName);
    if (!name) return;

    const snapshot: SavedLayout = {
      id: activeLayoutId ?? `layout-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      terrains,
      objects,
      markers,
      activeTool,
      overlayMode,
      calibration,
      referenceLayer,
      placementOrientation,
      brushEnabled,
      brushSize
    };

    setSavedLayouts((current) => {
      const exists = current.some((entry) => entry.id === snapshot.id);
      if (exists) {
        return current.map((entry) => (entry.id === snapshot.id ? snapshot : entry));
      }
      return [snapshot, ...current];
    });
    setActiveLayoutId(snapshot.id);
    setStatus(`Saved layout "${name}".`);
  };

  const createLayout = () => {
    const name = window.prompt('New layout name', `Island Concept ${savedLayouts.length + 1}`);
    if (!name) return;
    const layout: SavedLayout = {
      id: `layout-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      terrains: createTerrains(calibration.gridSize),
      objects: [],
      markers: [],
      activeTool: { mode: 'terrain', terrain: 'grass' },
      overlayMode: defaultOverlayMode,
      calibration,
      referenceLayer,
      placementOrientation: 'horizontal',
      brushEnabled: true,
      brushSize: 1
    };
    setSavedLayouts((current) => [layout, ...current]);
    setActiveLayoutId(layout.id);
    setTerrains(layout.terrains);
    setObjects([]);
    setMarkers([]);
    setActiveTool(layout.activeTool);
    setStatus(`Created layout "${name}".`);
  };

  const loadLayout = (id: string) => {
    const layout = savedLayouts.find((entry) => entry.id === id);
    if (!layout) return;

    const nextCalibration = { ...plannerGridDefaults, ...layout.calibration };
    const expectedTiles = nextCalibration.gridSize * nextCalibration.gridSize;
    let nextTerrains = layout.terrains;

    if (layout.terrains.length !== expectedTiles) {
      const inferredSize = Math.floor(Math.sqrt(layout.terrains.length));
      nextTerrains = resizeTerrains(layout.terrains, inferredSize, nextCalibration.gridSize);
    }

    applySnapshot({
      terrains: nextTerrains,
      objects: layout.objects,
      markers: layout.markers ?? [],
      activeTool: layout.activeTool ?? { mode: 'terrain', terrain: 'grass' },
      overlayMode: layout.overlayMode ?? defaultOverlayMode,
      calibration: nextCalibration,
      referenceLayer: { ...plannerReferenceDefaults, ...layout.referenceLayer },
      placementOrientation: layout.placementOrientation ?? 'horizontal',
      brushEnabled: layout.brushEnabled ?? true,
      brushSize: Math.max(1, Math.min(3, layout.brushSize ?? 1))
    });
    setActiveLayoutId(id);
    setStatus(`Loaded layout "${layout.name}".`);
  };

  const renameLayout = (id: string) => {
    const target = savedLayouts.find((entry) => entry.id === id);
    if (!target) return;
    const name = window.prompt('Rename layout', target.name);
    if (!name) return;
    setSavedLayouts((current) => current.map((entry) => (entry.id === id ? { ...entry, name } : entry)));
    setStatus(`Renamed layout to "${name}".`);
  };

  const duplicateLayout = (id: string) => {
    const target = savedLayouts.find((entry) => entry.id === id);
    if (!target) return;
    const copy: SavedLayout = {
      ...target,
      id: `layout-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${target.name} Copy`,
      terrains: [...target.terrains],
      objects: target.objects.map((entry) => ({ ...entry, instanceId: `${entry.objectId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` })),
      markers: (target.markers ?? []).map((entry) => ({ ...entry, id: `${entry.id}-copy-${Math.random().toString(36).slice(2, 5)}` }))
    };
    setSavedLayouts((current) => [copy, ...current]);
    setStatus(`Duplicated layout "${target.name}".`);
  };

  const deleteLayout = (id: string) => {
    const target = savedLayouts.find((entry) => entry.id === id);
    if (!target) return;
    const confirmDelete = window.confirm(`Delete layout "${target.name}"?`);
    if (!confirmDelete) return;

    setSavedLayouts((current) => current.filter((entry) => entry.id !== id));
    if (activeLayoutId === id) setActiveLayoutId(null);
    setStatus(`Deleted layout "${target.name}".`);
  };

  const updateCalibration = (next: Partial<GridCalibration>) => {
    commitHistory();
    const current = calibration;
    const merged = { ...current, ...next };
    const nextGridSize = next.gridSize;

    if (typeof nextGridSize === 'number' && nextGridSize !== current.gridSize) {
      setTerrains((previous) => resizeTerrains(previous, current.gridSize, nextGridSize));
      setObjects((previous) =>
        previous.filter((entry) => {
          const footprint = getObjectFootprint(entry.objectId, entry.orientation ?? 'horizontal');
          return entry.x + footprint.width <= nextGridSize && entry.y + footprint.height <= nextGridSize;
        })
      );
      setMarkers((previous) => previous.filter((marker) => marker.x < nextGridSize && marker.y < nextGridSize));
      if (hoverTile && (hoverTile.x >= nextGridSize || hoverTile.y >= nextGridSize)) {
        setHoverTile(null);
      }
    }
    setCalibration(merged);
  };

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (!result) return;
      commitHistory();
      setReferenceLayer((current) => ({ ...current, imageDataUrl: result, visible: true }));
      setSidebarTab('overlay');
      setStatus('Imported reference image. Adjust opacity and alignment to match your island map.');
    };
    reader.readAsDataURL(file);
  };

  const addMarker = (label: string, color: string) => {
    commitHistory();
    const marker: PlannerMarker = {
      id: `marker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label,
      color,
      x: Math.round(calibration.gridSize / 2),
      y: Math.round(calibration.gridSize / 2)
    };
    setMarkers((current) => [...current, marker]);
    setSelectedMarkerId(marker.id);
    setSelectedObjectId(null);
    setStatus(`Added marker: ${label}.`);
  };

  const deleteSelectedMarker = () => {
    if (!selectedMarkerId) return;
    commitHistory();
    setMarkers((current) => current.filter((entry) => entry.id !== selectedMarkerId));
    setStatus('Removed selected marker.');
    setSelectedMarkerId(null);
  };

  const moveSelectedObject = (dx: number, dy: number) => {
    if (!selectedObject) return;
    const nextX = selectedObject.x + dx;
    const nextY = selectedObject.y + dy;
    if (collides(objects, nextX, nextY, selectedObject.objectId, selectedObject.orientation ?? 'horizontal', calibration.gridSize, selectedObject.instanceId)) {
      setStatus('Move blocked by overlap or bounds.');
      return;
    }
    commitHistory();
    setObjects((current) => current.map((entry) => (entry.instanceId === selectedObject.instanceId ? { ...entry, x: nextX, y: nextY } : entry)));
    setStatus('Moved selected object.');
  };

  const rotateSelectedObject = () => {
    if (!selectedObject) return;
    const config = objectConfigMap[selectedObject.objectId];
    if (!config?.rotatable) {
      setStatus('This object cannot be rotated.');
      return;
    }
    const nextOrientation = (selectedObject.orientation ?? 'horizontal') === 'horizontal' ? 'vertical' : 'horizontal';
    if (collides(objects, selectedObject.x, selectedObject.y, selectedObject.objectId, nextOrientation, calibration.gridSize, selectedObject.instanceId)) {
      setStatus('Rotation blocked by overlap or bounds.');
      return;
    }
    commitHistory();
    setObjects((current) =>
      current.map((entry) =>
        entry.instanceId === selectedObject.instanceId
          ? {
              ...entry,
              orientation: nextOrientation
            }
          : entry
      )
    );
    setStatus('Rotated selected object.');
  };

  const duplicateSelectedObject = () => {
    if (!selectedObject) return;
    const orientation = selectedObject.orientation ?? 'horizontal';
    const footprint = getObjectFootprint(selectedObject.objectId, orientation);
    let targetX = selectedObject.x + footprint.width + 1;
    let targetY = selectedObject.y;

    if (collides(objects, targetX, targetY, selectedObject.objectId, orientation, calibration.gridSize)) {
      targetX = selectedObject.x;
      targetY = selectedObject.y + footprint.height + 1;
    }

    if (collides(objects, targetX, targetY, selectedObject.objectId, orientation, calibration.gridSize)) {
      setStatus('Could not duplicate: no open adjacent space.');
      return;
    }

    commitHistory();
    const nextInstance: PlannerObjectInstance = {
      ...selectedObject,
      instanceId: `${selectedObject.objectId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x: targetX,
      y: targetY
    };
    setObjects((current) => [...current, nextInstance]);
    setSelectedObjectId(nextInstance.instanceId);
    setStatus('Duplicated selected object.');
  };

  const deleteSelectedObject = () => {
    if (!selectedObject) return;
    commitHistory();
    setObjects((current) => current.filter((entry) => entry.instanceId !== selectedObject.instanceId));
    setSelectedObjectId(null);
    setStatus('Deleted selected object.');
  };

  const onMarkerPointerDown = (id: string, clientX: number, clientY: number) => {
    const marker = markers.find((entry) => entry.id === id);
    if (!marker) return;
    commitHistory();
    dragMarker.current = {
      id,
      startX: clientX,
      startY: clientY,
      markerX: marker.x,
      markerY: marker.y
    };
  };

  const onReferencePointerDown = (clientX: number, clientY: number) => {
    if (referenceLayer.locked) return;
    commitHistory();
    dragReference.current = { active: true, lastX: clientX, lastY: clientY };
  };

  const onReferencePointerMove = (clientX: number, clientY: number) => {
    if (!dragReference.current.active || referenceLayer.locked) return;
    const dx = clientX - dragReference.current.lastX;
    const dy = clientY - dragReference.current.lastY;
    dragReference.current.lastX = clientX;
    dragReference.current.lastY = clientY;
    setReferenceLayer((current) => ({ ...current, offsetX: current.offsetX + dx, offsetY: current.offsetY + dy }));
  };

  const onReferencePointerUp = () => {
    dragReference.current.active = false;
  };

  const exportPlannerImage = () => {
    const tileSize = calibration.tileSize;
    const gridSize = calibration.gridSize;
    const canvas = document.createElement('canvas');
    const width = gridSize * tileSize;
    const height = gridSize * tileSize;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawContent = () => {
      for (let y = 0; y < gridSize; y += 1) {
        for (let x = 0; x < gridSize; x += 1) {
          const terrain = terrains[tileIndex(x, y, gridSize)];
          const color = terrain === 'grass' ? '#a9d78f' : terrain === 'water' ? '#7ac7f8' : terrain === 'cliff' ? '#8f7d68' : terrain === 'path' ? '#d5b089' : '#f1ddb2';
          ctx.fillStyle = color;
          ctx.globalAlpha = calibration.terrainOpacity;
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
      ctx.globalAlpha = 1;

      if (exportOptions.includeGrid && calibration.showLines) {
        ctx.strokeStyle = calibration.highContrastLines ? 'rgba(15,23,42,0.65)' : 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridSize; i += 1) {
          const pos = i * tileSize;
          ctx.beginPath();
          ctx.moveTo(pos, 0);
          ctx.lineTo(pos, height);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, pos);
          ctx.lineTo(width, pos);
          ctx.stroke();
        }
      }

      objects.forEach((entry) => {
        const config = objectConfigMap[entry.objectId];
        if (!config) return;
        const footprint = getObjectFootprint(entry.objectId, entry.orientation ?? 'horizontal');
        ctx.fillStyle = config.color;
        ctx.fillRect(entry.x * tileSize, entry.y * tileSize, footprint.width * tileSize, footprint.height * tileSize);
        ctx.strokeStyle = 'rgba(15,23,42,0.45)';
        ctx.strokeRect(entry.x * tileSize, entry.y * tileSize, footprint.width * tileSize, footprint.height * tileSize);
        ctx.fillStyle = '#0f172a';
        ctx.font = `bold ${Math.max(10, Math.floor(tileSize * 0.38))}px sans-serif`;
        ctx.fillText(config.label, entry.x * tileSize + 4, entry.y * tileSize + Math.max(12, tileSize / 1.5));
      });

      if (exportOptions.includeMarkers) {
        markers.forEach((marker) => {
          const cx = marker.x * tileSize;
          const cy = marker.y * tileSize;
          ctx.fillStyle = marker.color;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(5, tileSize * 0.28), 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.font = `bold ${Math.max(10, Math.floor(tileSize * 0.34))}px sans-serif`;
          ctx.fillText(marker.label, cx + 8, cy - 8);
        });
      }

      const link = document.createElement('a');
      link.download = 'island-planner.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setStatus('Exported planner image as PNG.');
    };

    if (exportOptions.includeImage && referenceLayer.imageDataUrl && referenceLayer.visible) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = referenceLayer.opacity;
        ctx.translate(width / 2 + referenceLayer.offsetX, height / 2 + referenceLayer.offsetY);
        ctx.rotate((referenceLayer.rotation * Math.PI) / 180);
        const drawW = width * referenceLayer.scale;
        const drawH = height * referenceLayer.scale;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
        drawContent();
      };
      img.src = referenceLayer.imageDataUrl;
      return;
    }

    drawContent();
  };

  const toggleOverlay = () => {
    setOverlayMode((current) => (current === 'image' ? 'full' : 'image'));
  };

  const toggleGridVisibility = () => {
    setCalibration((current) => ({ ...current, showLines: !current.showLines }));
  };

  const mobileTabButtons = (
    <div className="sticky bottom-20 z-30 flex gap-2 overflow-x-auto rounded-2xl bg-white/85 p-2 shadow-float backdrop-blur dark:bg-slate-900/85 lg:hidden">
      {tabItems.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => {
            setSidebarTab(tab.id);
            setMobileSidebarOpen(true);
          }}
          className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${sidebarTab === tab.id ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 dark:bg-slate-800'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <main className="page-shell space-y-4 pb-24 lg:pb-10">
      <SectionHero
        label="Island Planner"
        tint="#c7f2d4"
        title="Design Your Island Layout"
        subtitle="Phase 3 planner with overlay alignment, terrain tools, building footprints, markers, saved concepts, and export."
      />

      <PlannerTopbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={saveToLayouts}
        onReset={resetPlanner}
        onClear={clearPlanner}
        onToggleGrid={toggleGridVisibility}
        onToggleOverlay={toggleOverlay}
        onExport={exportPlannerImage}
        onCenter={centerView}
        canUndo={pastHistory.length > 0}
        canRedo={futureHistory.length > 0}
        overlayMode={overlayMode}
        gridVisible={calibration.showLines}
        layoutName={currentLayoutName}
      />

      <div className="grid gap-4 lg:grid-cols-[310px_1fr] xl:grid-cols-[340px_1fr]">
        <aside className="hidden rounded-2xl border border-white/50 bg-white/70 p-3 shadow-float dark:border-slate-700 dark:bg-slate-900/70 lg:sticky lg:top-28 lg:block lg:h-[calc(100vh-9rem)] lg:overflow-y-auto">
          <div className="mb-3 grid grid-cols-2 gap-2">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSidebarTab(tab.id)}
                className={`rounded-xl px-2 py-2 text-xs font-bold ${sidebarTab === tab.id ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {(sidebarTab === 'terrain' || sidebarTab === 'buildings') && (
              <PlannerToolbar
                activeTool={activeTool}
                brushEnabled={brushEnabled}
                brushSize={brushSize}
                orientation={placementOrientation}
                onSelectTerrain={(terrain) => {
                  setActiveTool({ mode: 'terrain', terrain });
                  setSelectedObjectId(null);
                  setSelectedMarkerId(null);
                }}
                onSelectObject={(objectId) => {
                  setActiveTool({ mode: 'place', objectId });
                  setSelectedObjectId(null);
                  setSelectedMarkerId(null);
                }}
                onSelectErase={() => setActiveTool({ mode: 'erase' })}
                onSelectMove={() => setActiveTool({ mode: 'select' })}
                onToggleBrush={() => setBrushEnabled((current) => !current)}
                onBrushSize={(size) => setBrushSize(Math.max(1, Math.min(3, size)))}
                onRotatePlacement={() => setPlacementOrientation((current) => (current === 'horizontal' ? 'vertical' : 'horizontal'))}
                onDuplicateSelected={duplicateSelectedObject}
                onUndo={handleUndo}
                onReset={clearPlanner}
                selectedObjectExists={Boolean(selectedObject)}
              />
            )}

            {sidebarTab === 'import' && (
              <PlannerReferenceControls
                reference={referenceLayer}
                onUpload={handleImageUpload}
                onChange={(next) => setReferenceLayer((current) => ({ ...current, ...next }))}
                onNudge={(dx, dy) => setReferenceLayer((current) => ({ ...current, offsetX: current.offsetX + dx, offsetY: current.offsetY + dy }))}
                onNudgeScale={(delta) => setReferenceLayer((current) => ({ ...current, scale: Math.max(0.5, Math.min(2, current.scale + delta)) }))}
                onNudgeRotation={(delta) => setReferenceLayer((current) => ({ ...current, rotation: Math.max(-30, Math.min(30, current.rotation + delta)) }))}
                onResetPosition={() => setReferenceLayer((current) => ({ ...current, offsetX: 0, offsetY: 0 }))}
                onResetScale={() => setReferenceLayer((current) => ({ ...current, scale: 1 }))}
                onResetRotation={() => setReferenceLayer((current) => ({ ...current, rotation: 0 }))}
                onClearImage={() => setReferenceLayer((current) => ({ ...current, imageDataUrl: null }))}
              />
            )}

            {sidebarTab === 'overlay' && (
              <OverlayControls
                overlayMode={overlayMode}
                terrainOpacity={calibration.terrainOpacity}
                onOverlayMode={setOverlayMode}
                onTerrainOpacity={(value) => setCalibration((current) => ({ ...current, terrainOpacity: value }))}
              />
            )}

            {sidebarTab === 'grid' && (
              <GridCalibrationPanel
                settings={calibration}
                onChange={updateCalibration}
                onSnapImageCenter={() => setReferenceLayer((current) => ({ ...current, offsetX: 0, offsetY: 0 }))}
                onSnapGridCenter={() => setCalibration((current) => ({ ...current, offsetX: 0, offsetY: 0 }))}
              />
            )}

            {sidebarTab === 'markers' && (
              <MarkerPalette
                onAddMarker={addMarker}
                selectedMarkerLabel={selectedMarker?.label ?? null}
                onDeleteMarker={deleteSelectedMarker}
              />
            )}

            {sidebarTab === 'saved' && (
              <SavedLayoutsPanel
                layouts={savedLayouts}
                activeLayoutId={activeLayoutId}
                onCreate={createLayout}
                onSave={saveToLayouts}
                onLoad={loadLayout}
                onRename={renameLayout}
                onDuplicate={duplicateLayout}
                onDelete={deleteLayout}
              />
            )}

            {sidebarTab === 'export' && (
              <ExportPanel
                includeImage={exportOptions.includeImage}
                includeGrid={exportOptions.includeGrid}
                includeMarkers={exportOptions.includeMarkers}
                onChange={(next) => setExportOptions((current) => ({ ...current, ...next }))}
                onExport={exportPlannerImage}
              />
            )}

            <SelectedObjectInspector
              selected={selectedObject}
              onMove={moveSelectedObject}
              onDelete={deleteSelectedObject}
              onDuplicate={duplicateSelectedObject}
              onRotate={rotateSelectedObject}
            />
          </div>
        </aside>

        <section className="space-y-3">
          <div className="rounded-2xl border border-white/50 bg-white/70 p-3 shadow-float dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{status}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Active tool: {activeTool.mode === 'terrain' ? `Terrain (${activeTool.terrain})` : activeTool.mode === 'place' ? `Place (${objectConfigMap[activeTool.objectId]?.name ?? activeTool.objectId})` : activeTool.mode}
              {' '}| Grid: {calibration.gridSize}x{calibration.gridSize} | Tile: {calibration.tileSize}px
            </p>
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
            ghost={ghostPreview}
            onTileClick={handleTileClick}
            onTileHover={(x, y) => setHoverTile({ x, y })}
            onPaintStart={handlePaintStart}
            onPaintDrag={handlePaintDrag}
            onPaintEnd={handlePaintEnd}
            onObjectSelect={(instanceId) => {
              setSelectedObjectId(instanceId);
              setSelectedMarkerId(null);
            }}
            onMarkerSelect={(id) => {
              setSelectedMarkerId(id);
              setSelectedObjectId(null);
            }}
            onMarkerPointerDown={onMarkerPointerDown}
            onReferencePointerDown={onReferencePointerDown}
            onReferencePointerMove={onReferencePointerMove}
            onReferencePointerUp={onReferencePointerUp}
            viewportRef={viewportRef}
          />

          <PlannerLegend objects={objects} />
        </section>
      </div>

      {mobileTabButtons}

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-900/40 p-3 lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <div className="mx-auto max-h-[85vh] max-w-xl overflow-y-auto rounded-2xl bg-white p-3 shadow-float dark:bg-slate-900" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold">Planner Controls: {tabItems.find((item) => item.id === sidebarTab)?.label}</h2>
              <button type="button" onClick={() => setMobileSidebarOpen(false)} className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-slate-800">Close</button>
            </div>

            <div className="space-y-3">
              {(sidebarTab === 'terrain' || sidebarTab === 'buildings') && (
                <PlannerToolbar
                  activeTool={activeTool}
                  brushEnabled={brushEnabled}
                  brushSize={brushSize}
                  orientation={placementOrientation}
                  onSelectTerrain={(terrain) => {
                    setActiveTool({ mode: 'terrain', terrain });
                    setSelectedObjectId(null);
                    setSelectedMarkerId(null);
                  }}
                  onSelectObject={(objectId) => {
                    setActiveTool({ mode: 'place', objectId });
                    setSelectedObjectId(null);
                    setSelectedMarkerId(null);
                  }}
                  onSelectErase={() => setActiveTool({ mode: 'erase' })}
                  onSelectMove={() => setActiveTool({ mode: 'select' })}
                  onToggleBrush={() => setBrushEnabled((current) => !current)}
                  onBrushSize={(size) => setBrushSize(Math.max(1, Math.min(3, size)))}
                  onRotatePlacement={() => setPlacementOrientation((current) => (current === 'horizontal' ? 'vertical' : 'horizontal'))}
                  onDuplicateSelected={duplicateSelectedObject}
                  onUndo={handleUndo}
                  onReset={clearPlanner}
                  selectedObjectExists={Boolean(selectedObject)}
                />
              )}

              {sidebarTab === 'import' && (
                <PlannerReferenceControls
                  reference={referenceLayer}
                  onUpload={handleImageUpload}
                  onChange={(next) => setReferenceLayer((current) => ({ ...current, ...next }))}
                  onNudge={(dx, dy) => setReferenceLayer((current) => ({ ...current, offsetX: current.offsetX + dx, offsetY: current.offsetY + dy }))}
                  onNudgeScale={(delta) => setReferenceLayer((current) => ({ ...current, scale: Math.max(0.5, Math.min(2, current.scale + delta)) }))}
                  onNudgeRotation={(delta) => setReferenceLayer((current) => ({ ...current, rotation: Math.max(-30, Math.min(30, current.rotation + delta)) }))}
                  onResetPosition={() => setReferenceLayer((current) => ({ ...current, offsetX: 0, offsetY: 0 }))}
                  onResetScale={() => setReferenceLayer((current) => ({ ...current, scale: 1 }))}
                  onResetRotation={() => setReferenceLayer((current) => ({ ...current, rotation: 0 }))}
                  onClearImage={() => setReferenceLayer((current) => ({ ...current, imageDataUrl: null }))}
                />
              )}

              {sidebarTab === 'overlay' && (
                <OverlayControls
                  overlayMode={overlayMode}
                  terrainOpacity={calibration.terrainOpacity}
                  onOverlayMode={setOverlayMode}
                  onTerrainOpacity={(value) => setCalibration((current) => ({ ...current, terrainOpacity: value }))}
                />
              )}

              {sidebarTab === 'grid' && (
                <GridCalibrationPanel
                  settings={calibration}
                  onChange={updateCalibration}
                  onSnapImageCenter={() => setReferenceLayer((current) => ({ ...current, offsetX: 0, offsetY: 0 }))}
                  onSnapGridCenter={() => setCalibration((current) => ({ ...current, offsetX: 0, offsetY: 0 }))}
                />
              )}

              {sidebarTab === 'markers' && (
                <MarkerPalette
                  onAddMarker={addMarker}
                  selectedMarkerLabel={selectedMarker?.label ?? null}
                  onDeleteMarker={deleteSelectedMarker}
                />
              )}

              {sidebarTab === 'saved' && (
                <SavedLayoutsPanel
                  layouts={savedLayouts}
                  activeLayoutId={activeLayoutId}
                  onCreate={createLayout}
                  onSave={saveToLayouts}
                  onLoad={loadLayout}
                  onRename={renameLayout}
                  onDuplicate={duplicateLayout}
                  onDelete={deleteLayout}
                />
              )}

              {sidebarTab === 'export' && (
                <ExportPanel
                  includeImage={exportOptions.includeImage}
                  includeGrid={exportOptions.includeGrid}
                  includeMarkers={exportOptions.includeMarkers}
                  onChange={(next) => setExportOptions((current) => ({ ...current, ...next }))}
                  onExport={exportPlannerImage}
                />
              )}

              <SelectedObjectInspector
                selected={selectedObject}
                onMove={moveSelectedObject}
                onDelete={deleteSelectedObject}
                onDuplicate={duplicateSelectedObject}
                onRotate={rotateSelectedObject}
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
