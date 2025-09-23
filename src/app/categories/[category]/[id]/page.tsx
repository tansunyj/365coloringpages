import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface CategoryDetailPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// 生成静态参数
export async function generateStaticParams() {
  const categories = [
    'animals', 'fairy-tale', 'fantasy', 'vehicles', 'nature', 
    'prehistoric', 'space', 'ocean', 'holidays', 'superhero', 
    'food', 'magic', 'farm', 'celebration', 'default'
  ];
  const ids = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  
  const params = [];
  for (const category of categories) {
    for (const id of ids) {
      params.push({ category, id });
    }
  }
  
  return params;
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { id, category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={id} 
        type="categories"
        category={category}
      />
    </Suspense>
  );
} 