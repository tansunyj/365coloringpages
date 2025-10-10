import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface FirstColoringBookDetailPageProps {
  params: Promise<{
    slug: string;
    id: string;
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
      console.error('Failed to fetch coloring books for static generation');
      return [];
    }
    
    const booksData = await booksResponse.json();
    const books = booksData.data?.books || [];
    
    const staticParams: { slug: string; id: string }[] = [];
    
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
          
          pages.forEach((page: { id: number }) => {
            staticParams.push({
              slug: book.slug,
              id: page.id.toString()
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching pages for coloring book ${book.slug}:`, error);
      }
    }
    
    console.log(`🚀 生成了 ${staticParams.length} 个静态参数组合`);
    return staticParams;
  } catch (error) {
    console.error('Error generating static params for coloring book details:', error);
    return [];
  }
}

export default async function FirstColoringBookDetailPage({
  params
}: FirstColoringBookDetailPageProps) {
  const { slug, id } = await params;

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
        category={slug}
      />
    </Suspense>
  );
} 