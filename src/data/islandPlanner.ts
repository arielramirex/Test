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
};

export type PlannerObjectInstance = {
  instanceId: string;
  objectId: string;
  x: number;
  y: number;
};

export type PlannerSnapshot = {
  terrains: TerrainType[];
  objects: PlannerObjectInstance[];
};

export const PLANNER_GRID_SIZE = 28;
export const PLANNER_STORAGE_KEY = 'ac-island-planner-v1';

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
  { id: 'bridge', name: 'Bridge', width: 4, height: 2, type: 'structure', color: '#f7d7a8', label: 'Bridge' },
  { id: 'incline', name: 'Incline', width: 2, height: 4, type: 'structure', color: '#d6c3a5', label: 'Incline' }
];

export const objectConfigMap = Object.fromEntries(placeableObjects.map((item) => [item.id, item])) as Record<string, PlaceableObjectConfig>;
