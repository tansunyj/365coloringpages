'use client';

import React from 'react';
import UnifiedListPage from '../../../components/UnifiedListPage';

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
    <UnifiedListPage
      type="first-coloring-book"
      category={category}
      title="我的第一本涂色书"
      subtitle="适合初学者和年轻艺术家的涂色页面"
      description="浏览我们为初学者精心设计的涂色页面合集，简单易上手，让每个人都能享受涂色的乐趣。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={40}
    />
  );
}
