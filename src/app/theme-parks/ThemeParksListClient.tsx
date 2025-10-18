'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../components/UnifiedListPageWrapper';

interface ThemeParksListClientProps {
  initialCategory?: string;
}

/**
 * 主题公园列表页面客户端组�?
 * 使用统一的列表页组件显示主题公园涂色页面
 */
export default function ThemeParksListClient({ initialCategory }: ThemeParksListClientProps) {
  return (
    <UnifiedListPageWrapper
      type="theme-parks"
      category={initialCategory}
      title="Disney & Characters"
      subtitle="探索精彩的主题公园世�?
      description="浏览我们收集的各种主题公园涂色页面，从迪士尼到环球影城，应有尽有�?
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
} 