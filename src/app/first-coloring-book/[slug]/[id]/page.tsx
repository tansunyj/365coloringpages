import { Suspense } from 'react';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface FirstColoringBookDetailPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

// 生成静态参数 - 为静态导出提供更多路径
export async function generateStaticParams() {
  const coloringBookSlugs = [
    'first-coloring-book', 'latest-pages', 'popular-pages',
    'animals', 'nature', 'shapes', 'emotions', 'fruits'
  ];
  
  // 包含所有可能的ID范围
  const allIds = [
    // 基础ID范围 1-20
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    // 扩展ID范围 21-50
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    // 涂色书页面ID 106-113 (重要的API数据)
    '106', '107', '108', '109', '110', '111', '112', '113'
  ];
  
  const params = [];
  for (const slug of coloringBookSlugs) {
    for (const id of allIds) {
      params.push({ slug, id });
    }
  }
  
  console.log(`🚀 生成了 ${params.length} 个静态参数组合`);
  return params;
}

export default async function FirstColoringBookDetailPage({
  params
}: FirstColoringBookDetailPageProps) {
  const { slug, id } = await params;

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
        type="first-coloring-book"
        category={slug}
      />
    </Suspense>
  );
} 