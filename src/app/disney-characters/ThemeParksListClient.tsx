'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

interface ThemeParksListClientProps {
  initialCategory?: string;
}

/**
 * Disney & Characters 列表页面客户端组件
 * 使用统一的列表页组件显示迪士尼角色涂色页面
 */
export default function ThemeParksListClient({ initialCategory }: ThemeParksListClientProps) {
  return (
    <UnifiedListPage
      type="theme-parks"
      category={initialCategory}
      title="Disney & Characters"
      subtitle="探索精彩的迪士尼角色世界"
      description="浏览我们收集的各种迪士尼角色涂色页面，从经典角色到最新动画，应有尽有。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
