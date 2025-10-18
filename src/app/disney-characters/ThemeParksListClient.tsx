'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../components/UnifiedListPageWrapper';

interface ThemeParksListClientProps {
  initialCategory?: string;
}

/**
 * Disney & Characters 列表页面客户端组件
 * 使用统一的列表页组件显示迪士尼角色涂色页面
 */
export default function ThemeParksListClient({ initialCategory }: ThemeParksListClientProps) {
  return (
    <UnifiedListPageWrapper
      type="theme-parks"
      category={initialCategory}
      title="Disney & Characters"
      subtitle="Explore the Wonderful World of Disney Characters"
      description="Browse our collection of various Disney character coloring pages, from classic characters to the latest animations."
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
