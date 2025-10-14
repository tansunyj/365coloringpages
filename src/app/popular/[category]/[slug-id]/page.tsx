import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface PopularDetailPageProps {
  params: Promise<{
    category: string;
    'slug-id': string;
  }>;
}

// 生成静态参数 - 从API获取所有分类和涂色页面的组合
export async function generateStaticParams() {
  // 开发环境下跳过静态参数生成，避免启动时的API调用问题
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // 获取所有分类列表
    const categoriesResponse = await fetch(`${API_BASE}/api/categories/list`, {
      cache: 'no-store'
    });
    
    if (!categoriesResponse.ok) {
      return [];
    }
    
    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData.data || [];
    
    const staticParams: { category: string; 'slug-id': string }[] = [];
    
    // 为每个分类获取其关联的涂色页面
    for (const cat of categories) {
      try {
        const pagesResponse = await fetch(
          `${API_BASE}/api/popular?category=${cat.slug}&limit=1000`,
          { cache: 'no-store' }
        );
        
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          const pages = pagesData.data?.pages || [];
          
          pages.forEach((page: { id: number; slug?: string }) => {
            // 构建新的slug-id格式
            const pageSlug = page.slug || `page-${page.id}`;
            const slugId = `${pageSlug}-${page.id}`;
            
            staticParams.push({
              category: cat.slug,
              'slug-id': slugId
            });
          });
        }
      } catch (error) {
        // 忽略错误，继续处理下一个分类
      }
    }
    
    return staticParams;
  } catch (error) {
    return [];
  }
}

export default async function PopularDetailPage({ params }: PopularDetailPageProps) {
  const { 'slug-id': slugId, category } = await params;
  
  // 从slug-id中提取ID和slug
  // 例如：abc-def-129 -> ID: 129, slug: abc-def
  const parts = slugId.split('-');
  const id = parts.pop() || ''; // 最后一个部分是ID
  const pageSlug = parts.join('-'); // 前面的部分重新组合成slug
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={id} 
        type="popular"
        category={category}
      />
    </Suspense>
  );
}
