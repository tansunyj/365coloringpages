import UnifiedColoringDetail from '../../../components/UnifiedColoringDetail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 为静态导出生成路径
export async function generateStaticParams() {
  // 生成1-20的ID范围，覆盖Popular页面的所有数据
  const staticParams: { id: string }[] = [];
  
  for (let i = 1; i <= 20; i++) {
    staticParams.push({
      id: i.toString()
    });
  }

  return staticParams;
}

export default async function PopularDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <UnifiedColoringDetail 
      id={resolvedParams.id} 
      type="popular" 
    />
  );
} 