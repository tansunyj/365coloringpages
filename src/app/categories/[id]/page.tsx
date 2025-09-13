import UnifiedColoringDetail from '../../../components/UnifiedColoringDetail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 为静态导出生成路径
export async function generateStaticParams() {
  // 为分类页面生成所有可能的ID
  const staticParams: { id: string }[] = [];
  
  // 生成1-100的ID范围，覆盖所有分类页面
  for (let i = 1; i <= 100; i++) {
    staticParams.push({
      id: i.toString()
    });
  }

  return staticParams;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <UnifiedColoringDetail 
      pageId={resolvedParams.id} 
      source="categories"
      category="General"
    />
  );
} 