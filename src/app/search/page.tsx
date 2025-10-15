import { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

/**
 * Generate SEO metadata for search page
 * Based on Semrush CSV data
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://365coloringpages.com';
  
  // 基于 CSV 数据的核心搜索关键词
  const keywords = [
    'coloring pages',              // CSV: 368,000
    'free coloring pages',         // CSV: 40,500
    'printable coloring pages',    // CSV: 33,100
    'coloring pages for kids',     // CSV: 60,500
    'free printable coloring pages', // CSV: 22,200
    'coloring pages printable',    // CSV: 33,100
    'cute coloring pages',         // CSV: 33,100
    'easy coloring pages',         // CSV: 18,100
    'simple coloring pages',       // CSV: 12,100
    'search coloring pages',
    'find coloring pages',
    'browse coloring pages',
  ];
  
  const title = 'Search Free Coloring Pages - Find & Print Your Favorite Designs';
  const description = 'Search through thousands of free printable coloring pages. Find coloring pages for kids, adults, and all ages. Easy search with filters by category, difficulty, and style.';
  const url = `${site}/search`;
  
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
        url: `${site}/og-search.jpg`,
        width: 1200,
        height: 630,
        alt: 'Search Coloring Pages'
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

/**
 * 搜索页面组件
 */
export default function SearchPage() {
  return <SearchPageClient />;
} 