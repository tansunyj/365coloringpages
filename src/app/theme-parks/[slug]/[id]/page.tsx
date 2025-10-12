import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface ThemeParkDetailPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

// 生成静态参数 - 从API获取所有主题公园和涂色页面的组合
export async function generateStaticParams() {
  // 开发环境下跳过静态参数生成，避免启动时的API调用问题
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // 获取所有主题公园
    const parksResponse = await fetch(`${API_BASE}/api/theme-parks?limit=1000`, {
      cache: 'no-store'
    });
    
    if (!parksResponse.ok) {
      return [];
    }
    
    const parksData = await parksResponse.json();
    const themeParks = parksData.data?.themeParks || [];
    
    const staticParams: { slug: string; id: string }[] = [];
    
    // 为每个主题公园获取其关联的涂色页面
    for (const park of themeParks) {
      try {
        const pagesResponse = await fetch(
          `${API_BASE}/api/theme-parks/${park.slug}/coloring-pages?limit=1000`,
          { cache: 'no-store' }
        );
        
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          const pages = pagesData.data?.coloringPages || [];
          
          pages.forEach((page: { id: number }) => {
            staticParams.push({
              slug: park.slug,
              id: page.id.toString()
            });
          });
        }
      } catch (error) {
      }
    }
    
    return staticParams;
  } catch (error) {
    return [];
  }
}

export default async function ThemeParkDetailPage({ 
  params
}: ThemeParkDetailPageProps) {
  // 等待params
  const { slug, id } = await params;
  
  // 检查ID是否为有效数字
  if (!id || isNaN(parseInt(id))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">页面未找到</h1>
          <p className="text-gray-600">无效的涂色页面ID</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <UnifiedColoringDetail
        id={id}
        type="theme-parks"
        park={slug}
      />
    </Suspense>
  );
} 