'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import UnifiedColoringDetail from '../../../components/UnifiedColoringDetail';

// 将使�?useSearchParams 的逻辑提取到单独的组件�?
function SearchDetailContent() {
  const searchParams = useSearchParams();
  
  // 从查询参数获取ID和其他搜索参�?
  const id = searchParams.get('id') || '1';
  const searchQuery = {
    q: searchParams.get('q') || '',
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '12',
    sort: searchParams.get('sort') || '',
    category: searchParams.get('category') || '',
  };
  
  return (
    <UnifiedColoringDetail 
      id={id} 
      type="search"
      searchParams={searchQuery}
    />
  );
}

export default function SearchDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <SearchDetailContent />
    </Suspense>
  );
} 