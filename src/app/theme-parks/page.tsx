import { Suspense } from 'react';
import ThemeParksListClient from './ThemeParksListClient';
import { generateThemeParksSEO } from '@/seo/generatePageSEO';

/**
 * 主题公园首页 SEO 元数据
 * 使用统一的 SEO 系统
 */
export async function generateMetadata() {
  return await generateThemeParksSEO('home');
}

export default function ThemeParksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParksListClient />
    </Suspense>
  );
} 