import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface ThemeParkDetailPageProps {
  params: {
    park: string;
    id: string;
  };
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

export default function ThemeParkDetailPage({ params }: ThemeParkDetailPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={params.id} 
        type="theme-park"
        park={params.park}
      />
    </Suspense>
  );
} 