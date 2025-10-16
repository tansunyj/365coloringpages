import { Suspense } from 'react';
import ThemeParksListClient from './ThemeParksListClient';
import { generateThemeParksSEO } from '@/seo/generatePageSEO';

/**
 * Disney & Characters 首页 SEO 元数据
 * 使用统一的 SEO 系统
 */
export async function generateMetadata() {
  return await generateThemeParksSEO('home');
}

export default function DisneyCharactersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParksListClient />
    </Suspense>
  );
}
