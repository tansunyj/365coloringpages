import { Suspense } from 'react';
import LatestCategoryClient from './LatestCategoryClient';
import { generateLatestSEO } from '@/seo/generatePageSEO';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  return await generateLatestSEO('category', { category });
}

// 为静态导出生成路径
export async function generateStaticParams() {
  const categories = [
    'animals', 'fantasy', 'ocean', 'space', 'nature', 'prehistoric', 
    'superhero', 'farm', 'fairy-tale', 'holidays', 'all'
  ];
  
  return categories.map(category => ({
    category
  }));
}

export default async function NewColoringPagesCategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LatestCategoryClient category={category} />
    </Suspense>
  );
}
