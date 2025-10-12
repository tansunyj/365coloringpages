import { Suspense } from 'react';
import ThemeParkDetailClient from './ThemeParkDetailClient';

interface ThemeParkPageProps {
  params: {
    park: string;
  };
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    // 在构建时从 API 获取主题公园列表
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/api/theme-parks`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
                 return data.data
           .filter((park: { isActive: boolean; slug: string }) => park.isActive)
           .map((park: { slug: string }) => ({
             park: park.slug
           }));
      }
    }
  } catch (error) {
  }
  
  // 如果 API 调用失败，返回默认的主题公园列表
  return [
    { park: 'theme-park-adventures' },
    { park: 'disney-world' },
    { park: 'universal-studios' },
    { park: 'six-flags' },
    { park: 'cedar-point' },
    { park: 'knotts-berry-farm' },
    { park: 'busch-gardens' },
    { park: 'legoland' },
    { park: 'adventure-island' },
    { park: 'fairy-tale-kingdom' },
    { park: 'galaxyland' },
    { park: 'superhero-city' },
    { park: 'dinosaur-world' },
    { park: 'ocean-adventure' },
    { park: 'magic-forest' },
    { park: 'new-theme-park' }
  ];
}

export default function ThemeParkDetailPage({ params }: ThemeParkPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParkDetailClient 
        parkSlug={params.park}
      />
    </Suspense>
  );
} 