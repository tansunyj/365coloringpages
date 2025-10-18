'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../components/UnifiedListPageWrapper';

/**
 * Categories页面客户端组件
 * 使用统一的列表页组件显示分类涂色页面
 */
export default function CategoriesPageClient() {
  return (
    <UnifiedListPageWrapper
      type="categories"
      title="Category Coloring Pages"
      subtitle="Explore Various Exciting Coloring Content"
      description="Browse our complete collection of coloring page categories and find the perfect design for your creative journey!"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={40}
    />
  );
} 