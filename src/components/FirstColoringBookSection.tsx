'use client';

import { ThemeSection } from './Hero';

export default function FirstColoringBookSection() {
  const firstBookData = [
    { id: 1, title: 'Simple Shapes', category: 'Beginner' },
    { id: 2, title: 'Big Numbers', category: 'Beginner' },
    { id: 3, title: 'Easy Animals', category: 'Beginner' },
    { id: 4, title: 'Basic Fruits', category: 'Beginner' },
    { id: 5, title: 'Simple Flowers', category: 'Beginner' },
    { id: 6, title: 'Happy Faces', category: 'Beginner' },
    { id: 7, title: 'Big Letters', category: 'Beginner' },
    { id: 8, title: 'Easy Patterns', category: 'Beginner' },
    { id: 9, title: 'Fun Toys', category: 'Beginner' },
    { id: 10, title: 'Little House', category: 'Beginner' }
  ];

  const sectionConfig = {
    title: 'My First Coloring Book',
    subtitle: 'Perfect beginner-friendly designs for little artists',
    backgroundColor: '#f0f0ec', // 梯次2：中等
    data: firstBookData
  };

  return <ThemeSection section={sectionConfig} />;
}