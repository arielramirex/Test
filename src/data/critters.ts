import type { CritterEntry } from './types';

const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const fishData: CritterEntry[] = [
  { id: 'coelacanth', name: 'Coelacanth', type: 'Fish', sellPrice: 15000, location: 'Sea', shadowSize: 'Huge', timeAvailable: 'All Day', monthsNorth: allMonths, monthsSouth: allMonths, weather: 'Rain', rarity: 'Very Rare', image: '/images/critters/fish.svg' },
  { id: 'golden-trout', name: 'Golden Trout', type: 'Fish', sellPrice: 15000, location: 'Clifftop River', shadowSize: 'Medium', timeAvailable: '4 PM - 9 AM', monthsNorth: ['Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'], monthsSouth: ['Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'], weather: 'Any', rarity: 'Very Rare', image: '/images/critters/fish.svg' },
  { id: 'stringfish', name: 'Stringfish', type: 'Fish', sellPrice: 15000, location: 'Clifftop River', shadowSize: 'Huge', timeAvailable: '4 PM - 9 AM', monthsNorth: ['Dec', 'Jan', 'Feb', 'Mar'], monthsSouth: ['Jun', 'Jul', 'Aug', 'Sep'], weather: 'Any', rarity: 'Rare', image: '/images/critters/fish.svg' },
  { id: 'koi', name: 'Koi', type: 'Fish', sellPrice: 4000, location: 'Pond', shadowSize: 'Large', timeAvailable: '4 PM - 9 AM', monthsNorth: allMonths, monthsSouth: allMonths, weather: 'Any', rarity: 'Uncommon', image: '/images/critters/fish.svg' }
];

export const bugData: CritterEntry[] = [
  { id: 'golden-stag', name: 'Golden Stag', type: 'Bug', sellPrice: 12000, location: 'Palm Trees', shadowSize: '-', timeAvailable: '5 PM - 8 AM', monthsNorth: ['Jul', 'Aug'], monthsSouth: ['Jan', 'Feb'], weather: 'Any', rarity: 'Very Rare', image: '/images/critters/bug.svg' },
  { id: 'horned-hercules', name: 'Horned Hercules', type: 'Bug', sellPrice: 12000, location: 'Palm Trees', shadowSize: '-', timeAvailable: '5 PM - 8 AM', monthsNorth: ['Jul', 'Aug'], monthsSouth: ['Jan', 'Feb'], weather: 'Any', rarity: 'Very Rare', image: '/images/critters/bug.svg' },
  { id: 'scorpion', name: 'Scorpion', type: 'Bug', sellPrice: 8000, location: 'Ground', shadowSize: '-', timeAvailable: '7 PM - 4 AM', monthsNorth: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], monthsSouth: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], weather: 'Any', rarity: 'Rare', image: '/images/critters/bug.svg' },
  { id: 'orchid-mantis', name: 'Orchid Mantis', type: 'Bug', sellPrice: 2400, location: 'Flowers', shadowSize: '-', timeAvailable: '8 AM - 5 PM', monthsNorth: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], monthsSouth: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], weather: 'Any', rarity: 'Uncommon', image: '/images/critters/bug.svg' }
];

export const seaCreatureData: CritterEntry[] = [
  { id: 'gigas-giant-clam', name: 'Gigas Giant Clam', type: 'Sea Creature', sellPrice: 15000, location: 'Sea', shadowSize: 'Very Large', timeAvailable: 'All Day', monthsNorth: ['May', 'Jun', 'Jul', 'Aug', 'Sep'], monthsSouth: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'], weather: 'Any', rarity: 'Very Rare', image: '/images/critters/sea-creature.svg' },
  { id: 'spider-crab', name: 'Spider Crab', type: 'Sea Creature', sellPrice: 12000, location: 'Sea', shadowSize: 'Very Large', timeAvailable: 'All Day', monthsNorth: ['Mar', 'Apr'], monthsSouth: ['Sep', 'Oct'], weather: 'Any', rarity: 'Rare', image: '/images/critters/sea-creature.svg' },
  { id: 'vampire-squid', name: 'Vampire Squid', type: 'Sea Creature', sellPrice: 10000, location: 'Sea', shadowSize: 'Medium', timeAvailable: '4 PM - 9 AM', monthsNorth: ['May', 'Jun', 'Jul', 'Aug'], monthsSouth: ['Nov', 'Dec', 'Jan', 'Feb'], weather: 'Any', rarity: 'Rare', image: '/images/critters/sea-creature.svg' },
  { id: 'sea-pig', name: 'Sea Pig', type: 'Sea Creature', sellPrice: 10000, location: 'Sea', shadowSize: 'Small', timeAvailable: '4 PM - 9 AM', monthsNorth: ['Nov', 'Dec', 'Jan', 'Feb'], monthsSouth: ['May', 'Jun', 'Jul', 'Aug'], weather: 'Any', rarity: 'Rare', image: '/images/critters/sea-creature.svg' }
];

export const critterData: CritterEntry[] = [...fishData, ...bugData, ...seaCreatureData];
