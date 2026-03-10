export type TerrainType = 'grass' | 'water' | 'cliff' | 'path' | 'sand';

export type PlannerTool =
  | { mode: 'terrain'; terrain: TerrainType }
  | { mode: 'place'; objectId: string }
  | { mode: 'template'; templateId: TemplateToolId }
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
  layerVisibility?: PlannerLayerVisibility;
  categoryFilter?: PlannerCategoryFilter;
  calibration?: GridCalibration;
  referenceLayer?: PlannerReferenceLayer;
  placementOrientation?: 'horizontal' | 'vertical';
  brushEnabled?: boolean;
  brushSize?: number;
  templateSize?: number;
};

export type PlannerLayerVisibility = {
  image: boolean;
  grid: boolean;
  terrain: boolean;
  buildings: boolean;
  markers: boolean;
  paths: boolean;
  water: boolean;
  cliffs: boolean;
};

export type PlannerCategoryFilter =
  | 'all'
  | 'housing'
  | 'shops'
  | 'infrastructure'
  | 'terrain'
  | 'markers';

export type TemplateToolId =
  | 'straight-path'
  | 'curved-path'
  | 'plaza-rect'
  | 'river-strip'
  | 'pond-block'
  | 'cliff-block';

export type TemplateTool = {
  id: TemplateToolId;
  name: string;
  description: string;
  terrain: TerrainType;
  defaultSize: number;
};

export type IslandPreset = {
  id: string;
  name: string;
  description: string;
  terrainPatches: Array<{ x: number; y: number; width: number; height: number; terrain: TerrainType }>;
  objects: Array<{ objectId: string; x: number; y: number; orientation?: 'horizontal' | 'vertical' }>;
  markers: Array<{ label: string; x: number; y: number; color: string }>;
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
export const PLANNER_UI_STORAGE_KEY = 'ac-island-planner-ui-v1';
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

export const defaultLayerVisibility: PlannerLayerVisibility = {
  image: true,
  grid: true,
  terrain: true,
  buildings: true,
  markers: true,
  paths: true,
  water: true,
  cliffs: true
};

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
export const objectCategoryMap: Record<string, Exclude<PlannerCategoryFilter, 'all' | 'terrain' | 'markers'>> = {
  'player-house': 'housing',
  'villager-house': 'housing',
  'nooks-cranny': 'shops',
  'able-sisters': 'shops',
  museum: 'infrastructure',
  campsite: 'infrastructure',
  bridge: 'infrastructure',
  incline: 'infrastructure'
};

export const templateTools: TemplateTool[] = [
  {
    id: 'straight-path',
    name: 'Straight Path',
    description: 'Draw a straight path strip.',
    terrain: 'path',
    defaultSize: 5
  },
  {
    id: 'curved-path',
    name: 'Curved Path',
    description: 'L-shaped corner path.',
    terrain: 'path',
    defaultSize: 4
  },
  {
    id: 'plaza-rect',
    name: 'Plaza Rectangle',
    description: 'Rectangular paved area.',
    terrain: 'path',
    defaultSize: 6
  },
  {
    id: 'river-strip',
    name: 'River Strip',
    description: 'Long water strip.',
    terrain: 'water',
    defaultSize: 7
  },
  {
    id: 'pond-block',
    name: 'Pond Block',
    description: 'Square pond area.',
    terrain: 'water',
    defaultSize: 4
  },
  {
    id: 'cliff-block',
    name: 'Cliff Block',
    description: 'Raised cliff rectangle.',
    terrain: 'cliff',
    defaultSize: 5
  }
];

export const islandPresets: IslandPreset[] = [
  {
    id: 'cottagecore',
    name: 'Cottagecore Starter',
    description: 'Soft winding paths, clustered homes, and cozy greenery.',
    terrainPatches: [
      { x: 5, y: 5, width: 8, height: 2, terrain: 'path' },
      { x: 7, y: 7, width: 2, height: 9, terrain: 'path' },
      { x: 16, y: 9, width: 6, height: 4, terrain: 'water' }
    ],
    objects: [
      { objectId: 'player-house', x: 8, y: 10 },
      { objectId: 'villager-house', x: 4, y: 12 },
      { objectId: 'villager-house', x: 12, y: 14 },
      { objectId: 'campsite', x: 18, y: 6 }
    ],
    markers: [{ label: 'Town Square', x: 8, y: 6, color: '#f7b7c7' }]
  },
  {
    id: 'citycore',
    name: 'Urban/City Core Starter',
    description: 'Structured blocks and centralized shops.',
    terrainPatches: [
      { x: 4, y: 4, width: 16, height: 3, terrain: 'path' },
      { x: 4, y: 10, width: 16, height: 3, terrain: 'path' },
      { x: 4, y: 16, width: 16, height: 3, terrain: 'path' }
    ],
    objects: [
      { objectId: 'nooks-cranny', x: 6, y: 5 },
      { objectId: 'able-sisters', x: 14, y: 5 },
      { objectId: 'museum', x: 10, y: 11 },
      { objectId: 'player-house', x: 6, y: 17 }
    ],
    markers: [{ label: 'Main Avenue', x: 12, y: 11, color: '#9dd6ff' }]
  },
  {
    id: 'natural-forest',
    name: 'Natural Forest Starter',
    description: 'Waterways, cliffs, and open natural corridors.',
    terrainPatches: [
      { x: 2, y: 4, width: 5, height: 12, terrain: 'water' },
      { x: 12, y: 2, width: 8, height: 6, terrain: 'cliff' },
      { x: 9, y: 14, width: 7, height: 5, terrain: 'cliff' }
    ],
    objects: [
      { objectId: 'museum', x: 3, y: 18 },
      { objectId: 'campsite', x: 18, y: 4 },
      { objectId: 'incline', x: 11, y: 13, orientation: 'vertical' }
    ],
    markers: [{ label: 'Lookout', x: 15, y: 5, color: '#bce5a4' }]
  },
  {
    id: 'fairycore',
    name: 'Fairycore Starter',
    description: 'Curving paths and whimsical focal points.',
    terrainPatches: [
      { x: 8, y: 8, width: 10, height: 2, terrain: 'path' },
      { x: 11, y: 5, width: 4, height: 9, terrain: 'path' },
      { x: 18, y: 14, width: 4, height: 4, terrain: 'water' }
    ],
    objects: [
      { objectId: 'player-house', x: 11, y: 11 },
      { objectId: 'villager-house', x: 6, y: 9 },
      { objectId: 'villager-house', x: 17, y: 9 },
      { objectId: 'bridge', x: 16, y: 13 }
    ],
    markers: [{ label: 'Fairy Circle', x: 13, y: 9, color: '#d9ccff' }]
  },
  {
    id: 'resort-beach',
    name: 'Resort/Beach Starter',
    description: 'Beach boardwalk and coastal amenities.',
    terrainPatches: [
      { x: 0, y: 20, width: 28, height: 8, terrain: 'sand' },
      { x: 5, y: 18, width: 16, height: 2, terrain: 'path' },
      { x: 10, y: 12, width: 8, height: 4, terrain: 'water' }
    ],
    objects: [
      { objectId: 'nooks-cranny', x: 5, y: 14 },
      { objectId: 'able-sisters', x: 13, y: 14 },
      { objectId: 'campsite', x: 20, y: 20 }
    ],
    markers: [{ label: 'Resort Strip', x: 12, y: 19, color: '#f2d1a0' }]
  }
];

export function getObjectFootprint(objectId: string, orientation: 'horizontal' | 'vertical' = 'horizontal') {
  const config = objectConfigMap[objectId];
  if (!config) return { width: 1, height: 1 };
  if (!config.rotatable || orientation === 'horizontal') return { width: config.width, height: config.height };
  return { width: config.height, height: config.width };
}
