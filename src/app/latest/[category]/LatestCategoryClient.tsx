'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../../components/UnifiedListPageWrapper';

interface LatestCategoryClientProps {
  category: string;
}

export default function LatestCategoryClient({ category }: LatestCategoryClientProps) {
  // 调试信息
  
  return (
    <UnifiedListPageWrapper
      type="latest"
      category={category}
      title="New Coloring Pages"
      subtitle="发现最新的涂色内容"
      description="浏览最新上传的涂色页面，第一时间体验最新的创意作品。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={15}
    />
  );
} 