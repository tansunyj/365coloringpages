'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

/**
 * Best Coloring Pages页面客户端组件
 * 使用统一的列表页组件显示最好的涂色页面
 */
export default function PopularPageClient() {
  return (
    <UnifiedListPage
      type="popular"
      title="Best Coloring Pages"
      subtitle="探索最优秀的涂色内容"
      description="浏览社区中最受欢迎、质量最高的涂色页面，发现最佳的涂色体验。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
