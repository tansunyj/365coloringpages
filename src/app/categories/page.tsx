import { Suspense } from 'react';
import CategoriesPageClient from './CategoriesPageClient';
import { generateCategoriesSEO } from '@/seo/generatePageSEO';

/**
 * Generate SEO metadata for Categories Index page
 * 使用统一SEO系统 - 基于 PUBLIC_PAGES_ANALYSIS.md 优化
 */
export async function generateMetadata() {
  return await generateCategoriesSEO('home');
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CategoriesPageClient />
    </Suspense>
  );
}