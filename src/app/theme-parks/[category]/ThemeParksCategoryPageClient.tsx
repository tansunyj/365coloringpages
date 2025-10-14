'use client';

import React from 'react';
import UnifiedListPage from '../../../components/UnifiedListPage';

interface ThemeParksCategoryPageClientProps {
  category: string;
}

/**
 * 主题公园分类页面客户端组件
 * 使用统一的列表页组件显示特定分类的主题公园涂色页面
 * 保持与首页相同的UI布局，只传递分类参数
 */
export default function ThemeParksCategoryPageClient({ category }: ThemeParksCategoryPageClientProps) {
  return (
    <UnifiedListPage
      type="theme-parks"
      category={category}
      title="主题公园涂色页面"
      subtitle="探索精彩的主题公园世界"
      description="浏览我们收集的各种主题公园涂色页面，从迪士尼到环球影城，应有尽有。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
