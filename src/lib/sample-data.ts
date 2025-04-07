import { Post } from '@/types';

export const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Spring Tulips in Bloom',
    description: 'My tulip garden is finally blooming! The colors are absolutely stunning this year.',
    notes: 'Remember to plant more bulbs in the fall for next spring.',
    date: '2025-04-01',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11',
        alt: 'Colorful tulips in garden',
        width: 1200,
        height: 800
      },
      {
        url: 'https://images.unsplash.com/photo-1588628566587-dbd176de94b4',
        alt: 'Close-up of pink tulip',
        width: 1200,
        height: 800
      }
    ],
    tags: ['tulips', 'spring', 'flowers']
  },
  {
    id: '2',
    title: 'New Herb Garden',
    description: 'Started my herb garden with basil, thyme, and rosemary.',
    date: '2025-03-28',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
        alt: 'Herb garden with various herbs',
        width: 1200,
        height: 800
      }
    ],
    tags: ['herbs', 'gardening', 'kitchen garden']
  }
];
