'use client';

import React, { Suspense } from 'react';
import UnifiedListPageWrapper from '../../components/UnifiedListPageWrapper';

/**
 * Popular页面客户端组�?
 * 使用统一的列表页组件显示热门涂色页面
 */
export default function PopularPageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <UnifiedListPageWrapper
        type="popular"
        title="Popular Coloring Pages"
        subtitle="探索最受欢迎的涂色内容"
        description="浏览社区中最受欢迎、下载最多的涂色页面，发现大家都在涂什么�?
        showSearch={true}
        showCategoryFilter={true}
        showSortFilter={true}
        defaultSort="popular"
        itemsPerPage={40}
      />
    </Suspense>
  );
} 