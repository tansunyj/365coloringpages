import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface FirstColoringBookDetailPageProps {
  params: {
    category: string;
    id: string;
  };
}

// 生成静态参数
export async function generateStaticParams() {
  const categories = ['basic-shapes', 'nature', 'emotions', 'fruits', 'animals', 'shapes', 'fun', 'colors', 'numbers', 'letters'];
  const ids = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  
  const params = [];
  for (const category of categories) {
    for (const id of ids) {
      params.push({ category, id });
    }
  }
  
  return params;
}

export default function FirstColoringBookDetailPage({ params }: FirstColoringBookDetailPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={params.id} 
        type="first-coloring-book"
        category={params.category}
      />
    </Suspense>
  );
} 