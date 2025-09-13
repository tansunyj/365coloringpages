import UnifiedColoringDetail from '../../../components/UnifiedColoringDetail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 为静态导出生成路径
export async function generateStaticParams() {
  const staticParams: { id: string }[] = [];
  
  // 生成1-100的ID范围，覆盖所有主题公园页面
  for (let i = 1; i <= 100; i++) {
    staticParams.push({
      id: i.toString()
    });
  }

  return staticParams;
}

export default async function ThemeParkDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  return (
    <UnifiedColoringDetail 
      pageId={resolvedParams.id} 
      source="theme-park"
    />
  );
} 