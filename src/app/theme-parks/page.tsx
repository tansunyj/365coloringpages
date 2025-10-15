import { Suspense } from 'react';
import { Metadata } from 'next';
import ThemeParksListClient from './ThemeParksListClient';
import { buildKeywordsForPage, buildTitle, buildDescription } from '@/seo/buildKeywords';
import { KEYWORD_SOURCE } from '@/seo/keywords';

/**
 * 主题公园首页 SEO 元数据
 * 使用 CSV 数据中的主题公园相关关键词
 */
export async function generateMetadata(): Promise<Metadata> {
  // 定义主题公园首页的专属关键词（从 CSV 数据）
  const themeParkKeywords = [
    'theme park coloring pages',
    'park coloring pages',
    'amusement park coloring pages',
    ...KEYWORD_SOURCE.core.slice(0, 3), // 添加核心关键词
  ];

  const keywords = buildKeywordsForPage({
    baseKeywords: themeParkKeywords,
    limit: 12,
  });

  const titleText = buildTitle({
    main: 'Theme Park Coloring Pages',
    suffix: 'Free Printable Designs',
  });

  const description = buildDescription({
    main: 'Explore our collection of theme park coloring pages. From amusement parks to water parks, find free printable designs for kids and adults.',
    maxLength: 160,
  });

  const canonicalUrl = 'https://365coloringpages.com/theme-parks';

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
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description,
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

export default function ThemeParksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParksListClient />
    </Suspense>
  );
} 