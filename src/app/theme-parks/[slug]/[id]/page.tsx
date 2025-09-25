import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface ThemeParkDetailPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

// 生成静态参数 - 为静态导出提供更多路径
export async function generateStaticParams() {
  // 预生成一些常见的主题公园和ID组合
  const themeParkSlugs = [
    'theme-park-adventures',
    'disney-world', 
    'universal-studios',
    'six-flags',
    'cedar-point',
    'legoland'
  ];
  
  const commonIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  
  const params = [];
  for (const slug of themeParkSlugs) {
    for (const id of commonIds) {
      params.push({ slug, id });
    }
  }
  
  return params;
}

export default async function ThemeParkDetailPage({ 
  params
}: ThemeParkDetailPageProps) {
  // 等待params
  const { slug, id } = await params;
  
  // 检查ID是否为有效数字
  if (!id || isNaN(parseInt(id))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">页面未找到</h1>
          <p className="text-gray-600">无效的涂色页面ID</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <UnifiedColoringDetail
        id={id}
        type="theme-parks"
        park={slug}
      />
    </Suspense>
  );
} 