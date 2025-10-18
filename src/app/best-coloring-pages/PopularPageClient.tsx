'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../components/UnifiedListPageWrapper';

/**
 * Best Coloring Pages页面客户端组件
 * 使用统一的列表页组件显示最好的涂色页面
 */
export default function PopularPageClient() {
  return (
    <UnifiedListPageWrapper
      type="popular"
      title="Best Coloring Pages"
      subtitle="Explore the Best Coloring Content"
      description="Browse the most popular and highest quality coloring pages in the community and discover the best coloring experience."
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
