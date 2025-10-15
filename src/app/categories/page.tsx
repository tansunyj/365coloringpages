import { Suspense } from 'react';
import { Metadata } from 'next';
import CategoriesPageClient from './CategoriesPageClient';
import { buildKeywordsForPage, buildTitle, buildDescription } from '@/seo/buildKeywords';

/**
 * Generate SEO metadata for Categories Index page
 * Based on CSV keyword analysis from PUBLIC_PAGES_ANALYSIS.md
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://365coloringpages.com';
  const currentMonth = new Date().getMonth() + 1;
  
  // Build SEO parameters using CSV-based keyword builder
  const context = {
    type: 'categories-index' as const,
    month: currentMonth,
  };
  
  const keywords = buildKeywordsForPage(context);
  const title = buildTitle(context);
  const description = buildDescription(context);
  const url = `${site}/categories`;
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: { 
      canonical: url 
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Coloring Pages',
      images: [{
        url: `${site}/og-categories.jpg`,
        width: 1200,
        height: 630,
        alt: 'Browse All Coloring Page Categories'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@coloringpages',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
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