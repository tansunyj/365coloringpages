import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface ThemeParkDetailPageProps {
  params: Promise<{
    park: string;
    id: string;
  }>;
}

// 生成静态参数
export async function generateStaticParams() {
  const parks = ['disney-world', 'universal-studios', 'six-flags', 'cedar-point'];
  const ids = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
  
  const params = [];
  for (const park of parks) {
    for (const id of ids) {
      params.push({ park, id });
    }
  }
  
  return params;
}

export default async function ThemeParkDetailPage({ params }: ThemeParkDetailPageProps) {
  const { id, park } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={id} 
        type="theme-park"
        park={park}
      />
    </Suspense>
  );
} 