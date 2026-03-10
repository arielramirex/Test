export type FlowerEntry = {
  id: string;
  flowerSpecies: 'Rose' | 'Tulip' | 'Hyacinth' | 'Lily' | 'Cosmos' | 'Pansy' | 'Windflower' | 'Mum';
  parentColor1: string;
  parentColor2: string;
  resultColor: string;
  breedingChance: string;
  image: string;
};

export type CritterType = 'Fish' | 'Bug' | 'Sea Creature';

export type CritterEntry = {
  id: string;
  name: string;
  type: CritterType;
  sellPrice: number;
  location: string;
  shadowSize: string;
  timeAvailable: string;
  monthsNorth: string[];
  monthsSouth: string[];
  weather: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';
  image: string;
};

export type ArtEntry = {
  id: string;
  name: string;
  category: 'Painting' | 'Statue';
  realImage: string;
  fakeImage: string;
  differenceDescription: string;
  alwaysReal: boolean;
  haunted: boolean;
  image: string;
};

export type ItemEntry = {
  id: string;
  name: string;
  category: string;
  sellPrice: number;
  rarity: 'Common' | 'Rare' | 'Very Rare';
  source: string;
  image: string;
};

export type VillagerEntry = {
  id: string;
  name: string;
  species: string;
  personality: string;
  birthday: string;
  style: string;
  popularityTier: 'S Tier' | 'A Tier' | 'B Tier';
  image: string;
};

export type SeasonalEntry = {
  month: string;
  newCritters: string[];
  leavingCritters: string[];
  featuredItems: string[];
  events: string[];
};
