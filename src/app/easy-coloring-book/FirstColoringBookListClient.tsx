'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../components/UnifiedListPageWrapper';

interface FirstColoringBookListClientProps {
  initialCategory?: string;
}

/**
 * 我的第一本涂色书列表页面客户端组�?
 * 使用统一的列表页组件显示涂色书涂色页�?
 */
export default function FirstColoringBookListClient({ initialCategory }: FirstColoringBookListClientProps) {
  return (
    <UnifiedListPageWrapper
      type="easy-coloring-book"
      category={initialCategory}
      title="Easy Coloring Pages"
      subtitle="简单易上手的涂色页面，适合儿童和初学�?
      description="浏览我们专为儿童和初学者设计的Easy Coloring Book合集，简单大图形设计，让每个人都能享受涂色的乐趣�?
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={40}
    />
  );
} 