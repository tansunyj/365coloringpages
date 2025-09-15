import { Suspense } from 'react';
import CategoriesPageClient from '../CategoriesPageClient';

// 生成静态参数
export async function generateStaticParams() {
  return [
    { category: 'animals' },
    { category: 'nature' },
    { category: 'fantasy' },
    { category: 'vehicles' },
    { category: 'food' },
    { category: 'holidays' },
    { category: 'patterns' },
    { category: 'flowers' },
    { category: 'characters' },
    { category: 'general' }
  ];
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesPageClient />
    </Suspense>
  );
} 