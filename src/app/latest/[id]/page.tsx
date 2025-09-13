import UnifiedColoringDetail from '../../../components/UnifiedColoringDetail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 为静态导出生成路径
export async function generateStaticParams() {
  // 生成1-100的ID范围，覆盖Latest页面的所有数据
  const staticParams: { id: string }[] = [];
  
  for (let i = 1; i <= 100; i++) {
    staticParams.push({
      id: i.toString()
    });
  }

  return staticParams;
}

export default async function LatestDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <UnifiedColoringDetail 
      pageId={resolvedParams.id} 
      source="latest" 
    />
  );
} 