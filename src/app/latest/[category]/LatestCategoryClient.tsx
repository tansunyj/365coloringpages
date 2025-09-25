'use client';

import React from 'react';
import UnifiedListPage from '../../../components/UnifiedListPage';

interface LatestCategoryClientProps {
  category: string;
}

export default function LatestCategoryClient({ category }: LatestCategoryClientProps) {
  // 调试信息
  console.log('🚀 LatestCategoryClient mounted with category:', category);
  
  return (
    <UnifiedListPage
      type="latest"
      category={category}
      title="最新上传"
      subtitle="发现最新的涂色内容"
      description="浏览最新上传的涂色页面，第一时间体验最新的创意作品。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={15}
    />
  );
} 