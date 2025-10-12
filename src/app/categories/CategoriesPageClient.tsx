'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

/**
 * Categories页面客户端组件
 * 使用统一的列表页组件显示分类涂色页面
 */
export default function CategoriesPageClient() {
  return (
    <UnifiedListPage
      type="categories"
      title="分类涂色页面"
      subtitle="探索各种精彩的涂色内容"
      description="浏览我们完整的涂色页面分类集合，找到适合您创意之旅的完美设计！"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={40}
    />
  );
} 