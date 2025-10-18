'use client';

import React from 'react';
import UnifiedListPage from '@/components/UnifiedListPage';

/**
 * 搜索页面客户端组件
 * 使用统一的列表页组件显示搜索结果
 */
export default function SearchPageClient() {
  return (
    <UnifiedListPage
      type="search"
      title="Search Results"
      subtitle="Find the Coloring Pages You Need"
      description="Search by keywords to quickly find your favorite coloring pages."
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}

