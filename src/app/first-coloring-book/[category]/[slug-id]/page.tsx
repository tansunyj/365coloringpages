import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface FirstColoringBookDetailPageProps {
  params: Promise<{
    category: string;
    'slug-id': string;
  }>;
}

// 生成静态参数 - 从API获取所有涂色书和涂色页面的组合
export async function generateStaticParams() {
  // 开发环境下跳过静态参数生成，避免启动时的API调用问题
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // 获取所有涂色书
    const booksResponse = await fetch(`${API_BASE}/api/coloring-books?limit=1000`, {
      cache: 'no-store'
    });
    
    if (!booksResponse.ok) {
      return [];
    }
    
    const booksData = await booksResponse.json();
    const books = booksData.data?.books || [];
    
    const staticParams: { category: string; 'slug-id': string }[] = [];
    
    // 为每个涂色书获取其关联的涂色页面
    for (const book of books) {
      try {
        const pagesResponse = await fetch(
          `${API_BASE}/api/coloring-books/${book.slug}/pages?limit=1000`,
          { cache: 'no-store' }
        );
        
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          const pages = pagesData.data?.pages || [];
          
          pages.forEach((page: { id: number; slug?: string }) => {
            const pageSlug = page.slug || `page-${page.id}`;
            staticParams.push({
              category: book.slug,
              'slug-id': `${pageSlug}-${page.id}`
            });
          });
        }
      } catch (error) {
        // 忽略单个涂色书的错误，继续处理其他涂色书
      }
    }
    
    return staticParams;
  } catch (error) {
    return [];
  }
}

export default async function FirstColoringBookDetailPage({
  params
}: FirstColoringBookDetailPageProps) {
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
        type="first-coloring-book"
        category={category}
      />
    </Suspense>
  );
}
