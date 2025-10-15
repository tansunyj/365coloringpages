import { generateSearchSEO } from '@/seo/generatePageSEO';
import SearchPageClient from './SearchPageClient';

/**
 * Generate SEO metadata for search home page
 * 使用统一的 SEO 系统
 */
export async function generateMetadata() {
  return await generateSearchSEO('home');
}

/**
 * 搜索页面组件
 */
export default function SearchPage() {
  return <SearchPageClient />;
} 