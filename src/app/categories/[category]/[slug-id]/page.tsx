import { Suspense } from 'react';
import { Metadata } from 'next';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';
import { buildKeywordsForPage, buildDescription } from '@/seo/buildKeywords';

interface CategoryDetailPageProps {
  params: Promise<{
    category: string;
    'slug-id': string;
  }>;
}

interface ColoringPageDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  previewUrl: string;
  difficulty: string;
  ageRange: string;
  theme: string;
  style: string;
  seoTitle?: string;
  seoDescription?: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

/**
 * Generate dynamic SEO metadata for coloring page detail pages
 * Uses progressive enhancement with data from backend
 */
export async function generateMetadata({ params }: CategoryDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, 'slug-id': slugId } = resolvedParams;
  
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://365coloringpages.com';
  const currentMonth = new Date().getMonth() + 1;
  
  // Extract ID from slug-id (last part)
  const parts = slugId.split('-');
  const id = parts.pop() || '';
  
  // Fetch coloring page detail
  let pageData: ColoringPageDetail | null = null;
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE}/api/coloring-pages/${id}`, {
      cache: 'no-store',
      next: { revalidate: 3600 }
    });
    
    if (response.ok) {
      const data = await response.json();
      pageData = data.data;
    }
  } catch (error) {
    console.log('Failed to fetch page detail for SEO');
  }
  
  if (!pageData) {
    // Fallback metadata
    return {
      title: 'Coloring Page | Free Printable',
      description: 'Download and print this free coloring page.',
    };
  }
  
  // Build SEO using progressive enhancement strategy
  const displayCategory = decodeURIComponent(category).replace(/-/g, ' ');
  
  // Extract keywords from page attributes
  const pageKeywords: string[] = [];
  
  // Add theme and style as keywords
  if (pageData.theme) pageKeywords.push(`${pageData.theme} coloring pages`);
  if (pageData.style) pageKeywords.push(`${pageData.style} coloring pages`);
  if (pageData.difficulty) pageKeywords.push(`${pageData.difficulty} coloring pages`);
  
  // Add age-specific keywords
  if (pageData.ageRange) {
    pageKeywords.push(`coloring pages for ages ${pageData.ageRange}`);
  }
  
  // Build keywords with backend enhancement
  const keywords = buildKeywordsForPage(
    { 
      type: 'detail', 
      category, 
      title: pageData.title,
      month: currentMonth 
    },
    undefined,
    { additionalKeywords: pageKeywords }
  );
  
  // Build title with backend override support
  const title = pageData.seoTitle && pageData.seoTitle.length >= 30 && pageData.seoTitle.length <= 80
    ? pageData.seoTitle
    : `${pageData.title} - ${displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1)} Coloring Page | Free Printable`;
  
  // Build description with enhanced detail
  let description = '';
  if (pageData.seoDescription && pageData.seoDescription.length >= 100 && pageData.seoDescription.length <= 200) {
    description = pageData.seoDescription;
  } else {
    // Generate enhanced description
    description = `Download and print ${pageData.title} coloring page. `;
    
    if (pageData.description && pageData.description !== pageData.title) {
      description += `${pageData.description}. `;
    }
    
    if (pageData.difficulty && pageData.ageRange) {
      description += `${pageData.difficulty.charAt(0).toUpperCase() + pageData.difficulty.slice(1)} difficulty, perfect for ages ${pageData.ageRange}. `;
    }
    
    if (pageData.style || pageData.theme) {
      const attrs = [pageData.style, pageData.theme].filter(Boolean).join(' ');
      description += `${attrs} design. `;
    }
    
    description += 'Free high-quality printable coloring sheet.';
    
    // Trim if too long
    if (description.length > 200) {
      description = description.substring(0, 197) + '...';
    }
  }
  
  const url = `${site}/categories/${category}/${slugId}`;
  
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
      type: 'article',
      siteName: 'Coloring Pages',
      images: pageData.previewUrl ? [{
        url: pageData.previewUrl,
        width: 1200,
        height: 630,
        alt: pageData.title,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@coloringpages',
      images: pageData.previewUrl ? [pageData.previewUrl] : undefined,
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
    other: {
      'article:author': 'Coloring Pages',
      'article:section': displayCategory,
      'article:tag': keywords.slice(0, 5).join(','),
    },
  };
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
          `${API_BASE}/api/categories/${cat.slug}/coloring-pages?limit=1000`,
          { cache: 'no-store' }
        );
        
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          const pages = pagesData.data?.coloringPages || [];
          
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

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
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
        type="categories"
        category={category}
      />
    </Suspense>
  );
}
