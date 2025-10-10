import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface CategoryDetailPageProps {
  params: Promise<{
    category: string;
    id: string;
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
      console.error('Failed to fetch categories for static generation');
      return [];
    }
    
    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData.data || [];
    
    const staticParams: { category: string; id: string }[] = [];
    
    // 为每个分类获取其关联的涂色页面
    for (const cat of categories) {
      try {
        const pagesResponse = await fetch(
          `${API_BASE}/api/categories/${cat.slug}/coloring-pages?limit=1000`,
          { cache: 'no-store' }
        );
        
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          const pages = pagesData.data?.coloringPages || [];
          
          pages.forEach((page: { id: number }) => {
            staticParams.push({
              category: cat.slug,
              id: page.id.toString()
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching pages for category ${cat.slug}:`, error);
      }
    }
    
    return staticParams;
  } catch (error) {
    console.error('Error generating static params for category details:', error);
    return [];
  }
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { id, category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={id} 
        type="categories"
        category={category}
      />
    </Suspense>
  );
} 