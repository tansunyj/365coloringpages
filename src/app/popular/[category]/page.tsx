import { generatePopularSEO } from '@/seo/generatePageSEO';
import PopularCategoryPageClient from './PopularCategoryPageClient';

interface PopularCategoryPageProps {
  params: Promise<{ category: string }>;
}

/**
 * 受欢迎页面分类页
 * 使用统一的 SEO 生成系统 - 一次编写，多处使用！
 */
export async function generateMetadata({ params }: PopularCategoryPageProps) {
  const { category } = await params;
  return await generatePopularSEO('category', { category });
}

export default async function PopularCategoryPage({ params }: PopularCategoryPageProps) {
  const { category } = await params;
  
  return (
    <PopularCategoryPageClient category={category} />
  );
}