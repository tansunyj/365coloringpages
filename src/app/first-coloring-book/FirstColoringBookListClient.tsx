'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

interface FirstColoringBookListClientProps {
  initialCategory?: string;
}

/**
 * 我的第一本涂色书列表页面客户端组件
 * 使用统一的列表页组件显示涂色书涂色页面
 */
export default function FirstColoringBookListClient({ initialCategory }: FirstColoringBookListClientProps) {
  return (
    <UnifiedListPage
      type="first-coloring-book"
      category={initialCategory}
      title="我的第一本涂色书"
      subtitle="适合初学者和年轻艺术家的涂色页面"
      description="浏览我们为初学者精心设计的涂色页面合集，简单易上手，让每个人都能享受涂色的乐趣。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={20}
    />
  );
} 