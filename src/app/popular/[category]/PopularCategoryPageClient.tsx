'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../../components/UnifiedListPageWrapper';

interface PopularCategoryPageClientProps {
  category: string;
}

/**
 * Popular分类页面客户端组件
 * 使用统一的列表页组件显示特定分类的热门涂色页面
 * 保持与首页相同的UI布局，只传递分类参数
 */
export default function PopularCategoryPageClient({ category }: PopularCategoryPageClientProps) {
  return (
    <UnifiedListPageWrapper
      type="popular"
      category={category}
      title="Popular Coloring Pages"
      subtitle="探索最受欢迎的涂色内容"
      description="浏览社区中最受欢迎、下载最多的涂色页面，发现大家都在涂什么。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
