'use client';

import { ThemeSection } from './Hero';

export default function ThemeParkSection() {
  const themeParkData = [
    { id: 1, title: 'Disney Castle', category: 'Theme Park' },
    { id: 2, title: 'Roller Coaster', category: 'Theme Park' },
    { id: 3, title: 'Ferris Wheel', category: 'Theme Park' },
    { id: 4, title: 'Carousel Horses', category: 'Theme Park' },
    { id: 5, title: 'Mickey Mouse', category: 'Theme Park' },
    { id: 6, title: 'Wonder Land', category: 'Theme Park' },
    { id: 7, title: 'Amusement Park', category: 'Theme Park' },
    { id: 8, title: 'Fun Fair', category: 'Theme Park' },
    { id: 9, title: 'Magic Kingdom', category: 'Theme Park' },
    { id: 10, title: 'Adventure World', category: 'Theme Park' }
  ];

  const sectionConfig = {
    title: 'Theme Park Adventures',
    subtitle: 'Magical theme park designs for endless fun',
    backgroundColor: '#f4f4f0', // 梯次1：较深
    data: themeParkData
  };

  return <ThemeSection section={sectionConfig} />;
}