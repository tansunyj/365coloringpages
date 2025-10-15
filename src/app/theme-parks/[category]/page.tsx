import { Suspense } from 'react';
import ThemeParksCategoryPageClient from './ThemeParksCategoryPageClient';
import { generateThemeParksSEO } from '@/seo/generatePageSEO';

interface ThemeParksCategoryPageProps {
  params: Promise<{ category: string }>;
}

/**
 * 主题公园分类页 SEO 元数据
 * 使用统一的 SEO 系统
 */
export async function generateMetadata({ params }: ThemeParksCategoryPageProps) {
  const { category } = await params;
  return await generateThemeParksSEO('category', { themePark: category });
}

export default async function ThemeParksCategoryPage({ params }: ThemeParksCategoryPageProps) {
  const { category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParksCategoryPageClient category={category} />
    </Suspense>
  );
}
