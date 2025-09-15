import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface CategoryDetailPageProps {
  params: {
    category: string;
    id: string;
  };
}

// 生成静态参数
export async function generateStaticParams() {
  const categories = ['animals', 'nature', 'fantasy', 'vehicles', 'food', 'holidays', 'patterns', 'flowers', 'characters', 'general'];
  const ids = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  
  const params = [];
  for (const category of categories) {
    for (const id of ids) {
      params.push({ category, id });
    }
  }
  
  return params;
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={params.id} 
        type="categories"
        category={params.category}
      />
    </Suspense>
  );
} 