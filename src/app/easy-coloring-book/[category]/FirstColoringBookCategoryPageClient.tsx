'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../../components/UnifiedListPageWrapper';

interface FirstColoringBookCategoryPageClientProps {
  category: string;
}

/**
 * 涂色书分类页面客户端组件
 * 使用统一的列表页组件显示特定分类的涂色书涂色页面
 * 保持与首页相同的UI布局，只传递分类参数
 */
export default function FirstColoringBookCategoryPageClient({ category }: FirstColoringBookCategoryPageClientProps) {
  return (
    <UnifiedListPageWrapper
      type="easy-coloring-book"
      category={category}
      title="Easy Coloring Pages"
      subtitle="简单易上手的涂色页面，适合儿童和初学者"
      description="浏览我们专为儿童和初学者设计的Easy Coloring Book合集，简单大图形设计，让每个人都能享受涂色的乐趣。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={40}
    />
  );
}
