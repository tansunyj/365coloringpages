import { Suspense } from 'react';
import ThemeParksListClient from '../ThemeParksListClient';

interface ThemeParkSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成静态参数 - 从API获取所有主题公园的slug
export async function generateStaticParams() {
  // 开发环境下跳过静态参数生成，避免启动时的API调用问题
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // 从API获取所有主题公园
    const response = await fetch(`${API_BASE}/api/theme-parks?limit=1000`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const themeParks = data.data?.themeParks || [];
    
    return themeParks.map((park: { slug: string }) => ({
      slug: park.slug,
    }));
  } catch (error) {
    return [];
  }
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