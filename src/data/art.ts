import type { ArtEntry } from './types';

export const artData: ArtEntry[] = [
  {
    id: 'academic-painting',
    name: 'Academic Painting',
    category: 'Painting',
    realImage: '/images/art/real.svg',
    fakeImage: '/images/art/fake.svg',
    differenceDescription: 'Fake version has a coffee stain near the top-right corner.',
    alwaysReal: false,
    haunted: false,
    image: '/images/art/painting.svg'
  },
  {
    id: 'amazing-painting',
    name: 'Amazing Painting',
    category: 'Painting',
    realImage: '/images/art/real.svg',
    fakeImage: '/images/art/fake.svg',
    differenceDescription: 'Fake version adds a hat to the central figure.',
    alwaysReal: false,
    haunted: false,
    image: '/images/art/painting.svg'
  },
  {
    id: 'calm-painting',
    name: 'Calm Painting',
    category: 'Painting',
    realImage: '/images/art/real.svg',
    fakeImage: '/images/art/real.svg',
    differenceDescription: 'This artwork is always genuine from Redd.',
    alwaysReal: true,
    haunted: false,
    image: '/images/art/painting.svg'
  },
  {
    id: 'gallant-statue',
    name: 'Gallant Statue',
    category: 'Statue',
    realImage: '/images/art/real.svg',
    fakeImage: '/images/art/fake.svg',
    differenceDescription: 'Fake version includes a book tucked under the right arm.',
    alwaysReal: false,
    haunted: true,
    image: '/images/art/statue.svg'
  },
  {
    id: 'mystic-statue',
    name: 'Mystic Statue',
    category: 'Statue',
    realImage: '/images/art/real.svg',
    fakeImage: '/images/art/fake.svg',
    differenceDescription: 'Fake version has a prominent earring that the real one lacks.',
    alwaysReal: false,
    haunted: false,
    image: '/images/art/statue.svg'
  }
];
