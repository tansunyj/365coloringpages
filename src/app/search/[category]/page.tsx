import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchCategoryPageClient from './SearchCategoryPageClient';
import { buildKeywordsForPage } from '@/seo/buildKeywords';

interface SearchCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Generate dynamic SEO metadata for search category pages
 * Combines default search keywords with category-specific keywords
 */
export async function generateMetadata({ params }: SearchCategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category } = resolvedParams;
  
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://365coloringpages.com';
  const currentMonth = new Date().getMonth() + 1;
  
  let displayName = decodeURIComponent(category).replace(/-/g, ' ');
  let categoryData: {
    name?: string;
    additionalKeywords?: string[];
    thumbnailUrl?: string;
  } | null = null;
  
  // 尝试获取分类数据
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // 开发环境不缓存，生产环境缓存1小时
    const fetchOptions = process.env.NODE_ENV === 'development'
      ? { cache: 'no-store' as RequestCache }
      : { next: { revalidate: 3600 } };
    
    const response = await fetch(`${API_BASE}/api/categories/${category}`, fetchOptions);
    
    if (response.ok) {
      const data = await response.json();
      categoryData = data.data;
      displayName = categoryData.name || displayName;
    }
  } catch (error) {
    console.log('Using fallback category name');
  }
  
  // 构建关键词：搜索基础词 + 分类特定词
  const searchKeywords = [
    'search coloring pages',
    'find coloring pages',
    'browse coloring pages',
  ];
  
  const context = {
    type: 'list' as const,
    category,
    month: currentMonth,
  };
  
  const categoryKeywords = buildKeywordsForPage(context, undefined, {
    additionalKeywords: categoryData?.additionalKeywords || [],
  });
  
  // 合并关键词
  const allKeywords = [
    ...searchKeywords,
    ...categoryKeywords,
  ];
  
  // 去重
  const uniqueKeywords = [...new Set(allKeywords)];
  
  const displayCategoryName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const title = `Search ${displayCategoryName} Coloring Pages - Free Printable Designs`;
  const description = `Search and find ${displayCategoryName.toLowerCase()} coloring pages. Browse through our collection of free printable ${displayCategoryName.toLowerCase()} designs. Perfect for kids and adults.`;
  const url = `${site}/search/${category}`;
  
  return {
    title,
    description,
    keywords: uniqueKeywords.join(', '),
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Coloring Pages',
      images: categoryData?.thumbnailUrl ? [{
        url: categoryData.thumbnailUrl,
        width: 1200,
        height: 630,
        alt: `${displayCategoryName} Coloring Pages`
      }] : [{
        url: `${site}/og-search-${category}.jpg`,
        width: 1200,
        height: 630,
        alt: `Search ${displayCategoryName} Coloring Pages`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@coloringpages',
      images: categoryData?.thumbnailUrl ? [categoryData.thumbnailUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
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
