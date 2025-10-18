import { generatePopularSEO } from '@/seo/generatePageSEO';
import PopularPageClient from './PopularPageClient';

/**
 * Best Coloring Pages 首页
 * 使用统一的SEO 生成系统 - 一次编写，多处使用
 */
export async function generateMetadata() {
  return await generatePopularSEO('home');
}

export default function BestColoringPagesPage() {
  return <PopularPageClient />;
}
