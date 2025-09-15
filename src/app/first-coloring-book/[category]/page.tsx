import { Suspense } from 'react';
import FirstColoringBookPageClient from '../FirstColoringBookPageClient';

// 生成静态参数
export async function generateStaticParams() {
  return [
    { category: 'basic-shapes' },
    { category: 'nature' },
    { category: 'emotions' },
    { category: 'fruits' },
    { category: 'animals' },
    { category: 'shapes' },
    { category: 'fun' },
    { category: 'colors' },
    { category: 'numbers' },
    { category: 'letters' }
  ];
}

export default function FirstColoringBookCategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirstColoringBookPageClient />
    </Suspense>
  );
} 