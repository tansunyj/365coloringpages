'use client';

import { ThemeSection } from './Hero';

export default function LatestUploadsSection() {
  const latestData = [
    { id: 1, title: 'Modern Art', category: 'Latest' },
    { id: 2, title: 'Space Adventure', category: 'Latest' },
    { id: 3, title: 'Cute Robots', category: 'Latest' },
    { id: 4, title: 'Magic Forest', category: 'Latest' },
    { id: 5, title: 'Ocean Depths', category: 'Latest' },
    { id: 6, title: 'City Skyline', category: 'Latest' },
    { id: 7, title: 'Fantasy Creatures', category: 'Latest' },
    { id: 8, title: 'Tropical Paradise', category: 'Latest' },
    { id: 9, title: 'Winter Wonderland', category: 'Latest' },
    { id: 10, title: 'Desert Sunset', category: 'Latest' }
  ];

  const sectionConfig = {
    title: 'Latest Uploads',
    subtitle: 'Fresh new designs added by our creative community',
    backgroundColor: '#ecece8', // 梯次3：最深
    data: latestData
  };

  return <ThemeSection section={sectionConfig} />;
}