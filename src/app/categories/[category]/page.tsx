import { Suspense } from 'react';
import CategoryPageClient from './CategoryPageClient';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// 为静态导出生成路径
export async function generateStaticParams() {
  const categories = [
    'animals', 'fairy-tale', 'fantasy', 'vehicles', 'nature', 
    'prehistoric', 'space', 'ocean', 'holidays', 'superhero', 
    'food', 'magic', 'farm', 'celebration'
  ];
  
  return categories.map(category => ({
    category
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CategoryPageClient category={resolvedParams.category} />
    </Suspense>
  );
} 