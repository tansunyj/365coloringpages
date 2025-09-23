'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import UnifiedColoringDetail from '../../../components/UnifiedColoringDetail';

export default function SearchDetailPage() {
  const searchParams = useSearchParams();
  
  // 从查询参数获取ID和其他搜索参数
  const id = searchParams.get('id') || '1';
  const searchQuery = {
    q: searchParams.get('q') || '',
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '12',
    sort: searchParams.get('sort') || '',
    category: searchParams.get('category') || '',
  };
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={id} 
        type="search"
        searchParams={searchQuery}
      />
    </Suspense>
  );
} 