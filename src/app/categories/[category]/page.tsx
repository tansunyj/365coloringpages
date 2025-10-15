import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoryPageClient from './CategoryPageClient';
import { buildKeywordsForPage, buildTitle, buildDescription } from '@/seo/buildKeywords';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Generate dynamic SEO metadata for each category page
 * This makes SEO keywords change based on the category!
 * 
 * Examples:
 * - /categories/animals -> Shows animal-related keywords
 * - /categories/disney -> Shows Disney-related keywords
 * - /categories/cat -> Shows cat-related keywords
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category } = resolvedParams;
  
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://365coloringpages.com';
  const currentMonth = new Date().getMonth() + 1;
  
  // Fetch category data from API (including SEO enhancement fields)
  let displayName = decodeURIComponent(category).replace(/-/g, ' ');
  let categoryData: {
    name?: string;
    additionalKeywords?: string[];   // Extra keywords (progressive enhancement)
    highlightPhrase?: string;        // Phrase to insert in description
    customTitleSuffix?: string;      // Optional custom title suffix
    thumbnailUrl?: string;
  } | null = null;
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE}/api/categories/${category}`, {
      cache: 'no-store',
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (response.ok) {
      const data = await response.json();
      categoryData = data.data;
      displayName = categoryData.name || displayName;
    }
  } catch (error) {
    // Fallback to slug-based name
    console.log('Using fallback category name');
  }
  
  // Build SEO parameters using Progressive Enhancement strategy:
  // Core Keywords (30%) + Category Keywords (40%) + Seasonal (10%) + Backend Additional (20%)
  const context = {
    type: 'list' as const,
    category,
    month: currentMonth,
  };
  
  // Build keywords with backend enhancement (if provided)
  const keywords = buildKeywordsForPage(context, undefined, {
    additionalKeywords: categoryData?.additionalKeywords,
  });
  
  // Build title (use custom suffix if provided)
  const title = categoryData?.customTitleSuffix
    ? `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} Coloring Pages - ${categoryData.customTitleSuffix}`
    : buildTitle(context);
  
  // Build description with highlight phrase insertion (if provided)
  const description = buildDescription(
    context,
    undefined,  // no full custom description
    categoryData?.highlightPhrase  // insert highlight phrase
  );
  
  const url = `${site}/categories/${category}`;
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
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
        alt: `${displayName} Coloring Pages`
      }] : [{
        url: `${site}/og-category-${category}.jpg`,
        width: 1200,
        height: 630,
        alt: `${displayName} Coloring Pages`
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

export default async function CategoryPage({ params }: CategoryPageProps) {
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
      <CategoryPageClient category={resolvedParams.category} />
    </Suspense>
  );
} 