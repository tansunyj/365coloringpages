import { Suspense } from 'react';
import SearchCategoryPageClient from './SearchCategoryPageClient';
import { generateSearchSEO } from '@/seo/generatePageSEO';

interface SearchCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Generate dynamic SEO metadata for search category pages
 * 使用统一的 SEO 系统
 */
export async function generateMetadata({ params }: SearchCategoryPageProps) {
  const { category } = await params;
  return await generateSearchSEO('category', { category });
}

// 为静态导出生成路径 - 从API获取所有分类
export async function generateStaticParams() {
  // 开发环境下跳过静态参数生成，避免启动时的API调用问题
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE}/api/categories/list`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const categories = data.data || [];
    
    return categories.map((cat: { slug: string }) => ({
      category: cat.slug
    }));
  } catch (error) {
    return [];
  }
}

export default async function SearchCategoryPage({ params }: SearchCategoryPageProps) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SearchCategoryPageClient category={resolvedParams.category} />
    </Suspense>
  );
}
