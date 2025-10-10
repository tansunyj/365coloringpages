'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

interface ThemeParksListClientProps {
  initialCategory?: string;
}

/**
 * 主题公园列表页面客户端组件
 * 使用统一的列表页组件显示主题公园涂色页面
 */
export default function ThemeParksListClient({ initialCategory }: ThemeParksListClientProps) {
  return (
    <UnifiedListPage
      type="theme-parks"
      category={initialCategory}
      title="主题公园涂色页面"
      subtitle="探索精彩的主题公园世界"
      description="浏览我们收集的各种主题公园涂色页面，从迪士尼到环球影城，应有尽有。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={20}
    />
  );
} 