import UnifiedColoringDetail from '../../../components/UnifiedColoringDetail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 为静态导出生成路径 - 从API获取所有涂色页面
export async function generateStaticParams() {
  // 开发环境下跳过静态参数生成，避免启动时的API调用问题
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE}/api/admin/coloring-pages?limit=1000`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const pages = data.data?.pages || data.data?.items || data.data?.coloringPages || [];
    
    return pages.map((page: { id: number }) => ({
      id: page.id.toString()
    }));
  } catch (error) {
    return [];
  }
}

export default async function ColoringDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <UnifiedColoringDetail 
      id={resolvedParams.id} 
      type="categories"
      category="General"
    />
  );
} 