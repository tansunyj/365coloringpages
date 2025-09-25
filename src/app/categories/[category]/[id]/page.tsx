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
  
  const staticParams: { category: string; id: string }[] = [];
  
  categories.forEach(category => {
    // 生成 1-200 的ID范围
    for (let i = 1; i <= 200; i++) {
      staticParams.push({
        category,
        id: i.toString()
      });
    }
  });
  
  return staticParams;
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