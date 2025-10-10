'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

/**
 * Popular页面客户端组件
 * 使用统一的列表页组件显示热门涂色页面
 */
export default function PopularPageClient() {
  return (
    <UnifiedListPage
      type="popular"
      title="热门涂色页面"
      subtitle="探索最受欢迎的涂色内容"
      description="浏览社区中最受欢迎、下载最多的涂色页面，发现大家都在涂什么。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={20}
    />
  );
} 