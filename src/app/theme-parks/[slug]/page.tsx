import { Suspense } from 'react';
import ThemeParksListClient from '../ThemeParksListClient';

interface ThemeParkSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成静态参数 - 为常见主题公园提供静态路径
export async function generateStaticParams() {
  const commonThemeParks = [
    'theme-park-adventures',
    'disney-world',
    'universal-studios',
    'six-flags',
    'cedar-point',
    'legoland',
    'knots-berry-farm',
    'busch-gardens'
  ];
  
  return commonThemeParks.map((slug) => ({
    slug,
  }));
}

export default async function ThemeParkSlugPage({ 
  params 
}: ThemeParkSlugPageProps) {
  // 等待params
  const { slug } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ThemeParksListClient initialCategory={slug} />
    </Suspense>
  );
} 