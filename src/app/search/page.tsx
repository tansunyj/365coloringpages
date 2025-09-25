'use client';

import React from 'react';
import UnifiedListPage from '@/components/UnifiedListPage';

/**
 * 搜索页面组件
 * 使用统一的列表页组件显示搜索结果
 */
export default function SearchPage() {
  return (
    <UnifiedListPage
      type="search"
      title="搜索结果"
      subtitle="找到您需要的涂色页面"
      description="通过关键词搜索，快速找到心仪的涂色页面。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="relevance"
      itemsPerPage={12}
    />
  );
} 