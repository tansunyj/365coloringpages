'use client';

import React from 'react';
import UnifiedListPage from '../../../components/UnifiedListPage';

interface LatestCategoryClientProps {
  category: string;
}

export default function LatestCategoryClient({ category }: LatestCategoryClientProps) {
  // 调试信息
  
  return (
    <UnifiedListPage
      type="latest"
      category={category}
      title="New Coloring Pages"
      subtitle="Discover the Latest Coloring Content"
      description="Browse the latest uploaded coloring pages and experience the newest creative works."
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={15}
    />
  );
}
