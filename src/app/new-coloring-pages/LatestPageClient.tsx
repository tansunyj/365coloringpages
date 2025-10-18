'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

/**
 * New Coloring Pages页面客户端组件
 * 使用统一的列表页组件显示最新涂色页面
 */
export default function LatestPageClient() {
  return (
    <UnifiedListPage
      type="latest"
      title="New Coloring Pages"
      subtitle="Discover the Latest Coloring Content"
      description="Browse the latest uploaded coloring pages and experience the newest creative works."
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={40}
    />
  );
}
