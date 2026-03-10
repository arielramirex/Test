export type TerrainType = 'grass' | 'water' | 'cliff' | 'path' | 'sand';

export type PlannerTool =
  | { mode: 'terrain'; terrain: TerrainType }
  | { mode: 'place'; objectId: string }
  | { mode: 'erase' }
  | { mode: 'select' };

export type PlaceableObjectConfig = {
  id: string;
  name: string;
  width: number;
  height: number;
  type: 'building' | 'structure';
  color: string;
  label: string;
  rotatable?: boolean;
};

export type PlannerObjectInstance = {
  instanceId: string;
  objectId: string;
  x: number;
  y: number;
  orientation?: 'horizontal' | 'vertical';
};

export type PlannerSnapshot = {
  id?: string;
  name?: string;
  terrains: TerrainType[];
  objects: PlannerObjectInstance[];
  markers?: PlannerMarker[];
  activeTool?: PlannerTool;
  overlayMode?: OverlayMode;
  calibration?: GridCalibration;
  referenceLayer?: PlannerReferenceLayer;
  placementOrientation?: 'horizontal' | 'vertical';
  brushEnabled?: boolean;
  brushSize?: number;
};

export type PlannerReferenceLayer = {
  imageDataUrl: string | null;
  visible: boolean;
  opacity: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  locked: boolean;
  rotation: number;
};

export type OverlayMode = 'image' | 'grid' | 'image-grid' | 'full';

export type GridCalibration = {
  gridSize: number;
  tileSize: number;
  offsetX: number;
  offsetY: number;
  showLines: boolean;
  highContrastLines: boolean;
  terrainOpacity: number;
};

export type PlannerMarker = {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
};

export const PLANNER_GRID_SIZE = 28;
export const PLANNER_STORAGE_KEY = 'ac-island-planner-v1';
export const PLANNER_LAYOUTS_KEY = 'ac-island-layouts-v1';
export const PLANNER_ACTIVE_LAYOUT_KEY = 'ac-island-active-layout-v1';
export const plannerReferenceDefaults: PlannerReferenceLayer = {
  imageDataUrl: null,
  visible: true,
  opacity: 0.55,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  locked: true,
  rotation: 0
};

export const plannerGridDefaults: GridCalibration = {
  gridSize: 28,
  tileSize: 22,
  offsetX: 0,
  offsetY: 0,
  showLines: true,
  highContrastLines: false,
  terrainOpacity: 1
};

export const defaultOverlayMode: OverlayMode = 'full';

export const markerTemplates: Omit<PlannerMarker, 'id' | 'x' | 'y'>[] = [
  { label: 'Resident Services', color: '#f7b7c7' },
  { label: 'Airport', color: '#9dd6ff' },
  { label: 'Pier', color: '#f2d1a0' },
  { label: 'River Mouth', color: '#8ecbff' },
  { label: 'Secret Beach', color: '#f7e3b5' },
  { label: 'Villager House', color: '#f7c39f' },
  { label: 'Museum', color: '#a9c8f0' },
  { label: 'Campsite', color: '#bce5a4' }
];

export const terrainPalette: { key: TerrainType; label: string; color: string }[] = [
  { key: 'grass', label: 'Grass', color: '#a9d78f' },
  { key: 'water', label: 'Water', color: '#7ac7f8' },
  { key: 'cliff', label: 'Cliff', color: '#8f7d68' },
  { key: 'path', label: 'Path', color: '#d5b089' },
  { key: 'sand', label: 'Sand', color: '#f1ddb2' }
];

export const terrainColorMap: Record<TerrainType, string> = {
  grass: '#a9d78f',
  water: '#7ac7f8',
  cliff: '#8f7d68',
  path: '#d5b089',
  sand: '#f1ddb2'
};

export const placeableObjects: PlaceableObjectConfig[] = [
  { id: 'player-house', name: 'Player House', width: 4, height: 4, type: 'building', color: '#f5b6c8', label: 'Home' },
  { id: 'villager-house', name: 'Villager House', width: 4, height: 4, type: 'building', color: '#f8c7a1', label: 'Villager' },
  { id: 'nooks-cranny', name: 'Nook\'s Cranny', width: 5, height: 4, type: 'building', color: '#c0e9d7', label: 'Nook' },
  { id: 'able-sisters', name: 'Able Sisters', width: 5, height: 4, type: 'building', color: '#d9ccff', label: 'Able' },
  { id: 'museum', name: 'Museum', width: 7, height: 4, type: 'building', color: '#9fc5e8', label: 'Museum' },
  { id: 'campsite', name: 'Campsite', width: 4, height: 4, type: 'building', color: '#bde4a8', label: 'Camp' },
  { id: 'bridge', name: 'Bridge', width: 4, height: 2, type: 'structure', color: '#f7d7a8', label: 'Bridge', rotatable: true },
  { id: 'incline', name: 'Incline', width: 2, height: 4, type: 'structure', color: '#d6c3a5', label: 'Incline', rotatable: true }
];

export const objectConfigMap = Object.fromEntries(placeableObjects.map((item) => [item.id, item])) as Record<string, PlaceableObjectConfig>;

export function getObjectFootprint(objectId: string, orientation: 'horizontal' | 'vertical' = 'horizontal') {
  const config = objectConfigMap[objectId];
  if (!config) return { width: 1, height: 1 };
  if (!config.rotatable || orientation === 'horizontal') return { width: config.width, height: config.height };
  return { width: config.height, height: config.width };
}
