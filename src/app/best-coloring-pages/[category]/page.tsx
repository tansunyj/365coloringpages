import { generatePopularSEO } from '@/seo/generatePageSEO';
import PopularCategoryPageClient from './PopularCategoryPageClient';

interface BestColoringPagesCategoryPageProps {
  params: Promise<{ category: string }>;
}

/**
 * Best Coloring Pages 分类页
 * 使用统一的 SEO 生成系统 - 一次编写，多处使用！
 */
export async function generateMetadata({ params }: BestColoringPagesCategoryPageProps) {
  const { category } = await params;
  return await generatePopularSEO('category', { category });
}

export default async function BestColoringPagesCategoryPage({ params }: BestColoringPagesCategoryPageProps) {
  const { category } = await params;
  
  return (
    <PopularCategoryPageClient category={category} />
  );
}
