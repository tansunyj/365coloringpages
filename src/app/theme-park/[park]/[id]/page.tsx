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
  const staticParams: { park: string; id: string }[] = [];
  
  parks.forEach(park => {
    // 生成 1-200 的ID范围
    for (let i = 1; i <= 200; i++) {
      staticParams.push({
        park,
        id: i.toString()
      });
    }
  });
  
  return staticParams;
}

export default async function ThemeParkDetailPage({ params }: ThemeParkDetailPageProps) {
  const { id, park } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={id} 
        type="theme-parks"
        park={park}
      />
    </Suspense>
  );
} 