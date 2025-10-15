import { Suspense } from 'react';
import { Metadata } from 'next';
import ThemeParksCategoryPageClient from './ThemeParksCategoryPageClient';
import { buildKeywordsForPage, buildTitle, buildDescription } from '@/seo/buildKeywords';
import { KEYWORD_SOURCE } from '@/seo/keywords';

interface ThemeParksCategoryPageProps {
  params: Promise<{ category: string }>;
}

/**
 * 主题公园详情页 SEO 元数据
 * 渐进式增强：默认主题公园关键词 + 具体主题公园特性
 */
export async function generateMetadata({ params }: ThemeParksCategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  // 尝试从后端获取主题公园数据
  let themePark: any = null;
  let themeParkName = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const apiUrl = `${API_BASE}/api/theme-parks/${category}`;
    
    // 开发模式下打印日志
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Theme Parks SEO] Fetching: ${apiUrl}`);
    }
    
    // 开发环境不缓存，生产环境缓存1小时
    const fetchOptions = process.env.NODE_ENV === 'development'
      ? { cache: 'no-store' as RequestCache }
      : { next: { revalidate: 3600 } };
    
    const response = await fetch(apiUrl, fetchOptions);

    if (response.ok) {
      const data = await response.json();
      themePark = data.data;
      themeParkName = themePark?.name || themeParkName;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Theme Parks SEO] Success! Theme Park: ${themeParkName}`);
        console.log(`[Theme Parks SEO] Has seoTitle: ${!!themePark?.seoTitle}`);
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Theme Parks SEO] API returned ${response.status} for ${category}`);
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Theme Parks SEO] Error fetching theme park:`, error);
    }
    // 使用默认值
  }

  // 基础关键词（主题公园相关）
  const baseKeywords = [
    'theme park coloring pages',
    'park coloring pages',
    ...KEYWORD_SOURCE.core.slice(0, 2),
  ];

  // 主题公园特定关键词
  const themeParkSpecificKeywords = [
    `${themeParkName.toLowerCase()} coloring pages`,
    `${themeParkName.toLowerCase()} printable coloring pages`,
  ];

  // 后端提供的额外关键词
  const additionalKeywords = themePark?.additionalKeywords || [];

  // 使用渐进式增强策略
  const keywords = buildKeywordsForPage({
    baseKeywords,
    categoryKeywords: themeParkSpecificKeywords,
    additionalKeywords,
    limit: 12,
  });

  // 优先使用后端提供的 seoTitle（如果有效）
  let titleText: string;
  if (themePark?.seoTitle && themePark.seoTitle.length >= 40 && themePark.seoTitle.length <= 80) {
    titleText = themePark.seoTitle;
  } else {
    const customSuffix = themePark?.customTitleSuffix || 'Free Printable Designs';
    titleText = buildTitle({
      main: `${themeParkName} Coloring Pages`,
      suffix: customSuffix,
    });
  }

  // 优先使用后端提供的 seoDescription（如果有效）
  let description: string;
  if (themePark?.seoDescription && themePark.seoDescription.length >= 100 && themePark.seoDescription.length <= 200) {
    description = themePark.seoDescription;
  } else {
    const highlightPhrase = themePark?.highlightPhrase || '';
    description = buildDescription({
      main: `Explore ${themeParkName.toLowerCase()} themed coloring pages. ${highlightPhrase} Free printable designs perfect for kids and adults who love theme parks.`,
      maxLength: 160,
    });
  }

  const canonicalUrl = `https://365coloringpages.com/theme-parks/${category}`;
  const ogImage = themePark?.thumbnailUrl || undefined;

  return {
    // 使用 absolute 模式，避免被 layout template 包装
    title: {
      absolute: titleText,
    },
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: titleText,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: '365 Coloring Pages',
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ThemeParksCategoryPage({ params }: ThemeParksCategoryPageProps) {
  const { category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParksCategoryPageClient category={category} />
    </Suspense>
  );
}
