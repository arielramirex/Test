export type ArtItem = {
  id: string;
  name: string;
  hasFake: boolean;
  realHint: string;
  fakeHint: string;
};

export type Critter = {
  id: string;
  name: string;
  type: 'fish' | 'bug' | 'sea';
  price: number;
  months: number[];
};

export type FlowerRecipe = {
  id: string;
  parentA: string;
  parentB: string;
  result: string;
};

export type Villager = {
  id: string;
  name: string;
  species: string;
  personality: string;
  popularity: number;
};