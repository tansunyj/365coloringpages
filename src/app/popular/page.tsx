import { generatePopularSEO } from '@/seo/generatePageSEO';
import PopularPageClient from './PopularPageClient';

/**
 * 受欢迎页面首页
 * 使用统一的 SEO 生成系统 - 一次编写，多处使用！
 */
export async function generateMetadata() {
  return await generatePopularSEO('home');
}

export default function PopularPage() {
  return <PopularPageClient />;
} 