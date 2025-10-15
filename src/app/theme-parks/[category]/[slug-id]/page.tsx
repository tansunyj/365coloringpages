import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';
import { generateThemeParksSEO } from '@/seo/generatePageSEO';

interface ThemeParksDetailPageProps {
  params: Promise<{
    category: string;
    'slug-id': string;
  }>;
}

/**
 * 主题公园详情页 SEO 元数据
 * 使用统一的 SEO 系统
 */
export async function generateMetadata({ params }: ThemeParksDetailPageProps) {
  const { category, 'slug-id': slugId } = await params;
  return await generateThemeParksSEO('detail', { themePark: category, slugId });
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
    
    const staticParams: { category: string; 'slug-id': string }[] = [];
    
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
          
          pages.forEach((page: { id: number; slug?: string }) => {
            const pageSlug = page.slug || `page-${page.id}`;
            staticParams.push({
              category: park.slug,
              'slug-id': `${pageSlug}-${page.id}`
            });
          });
        }
      } catch (error) {
        // 忽略单个公园的错误，继续处理其他公园
      }
    }
    
    return staticParams;
  } catch (error) {
    return [];
  }
}

export default async function ThemeParksDetailPage({ 
  params
}: ThemeParksDetailPageProps) {
  // 等待params
  const { 'slug-id': slugId, category } = await params;
  
  // 从slug-id中提取ID和slug
  // 例如：abc-def-129 -> ID: 129, slug: abc-def
  const parts = slugId.split('-');
  const id = parts.pop() || ''; // 最后一个部分是ID
  const pageSlug = parts.join('-'); // 前面的部分重新组合成slug
  
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
        park={category}
      />
    </Suspense>
  );
}
