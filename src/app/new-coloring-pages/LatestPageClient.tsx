'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

/**
 * New Coloring Pages页面客户端组件
 * 使用统一的列表页组件显示最新涂色页面
 */
export default function LatestPageClient() {
  return (
    <UnifiedListPage
      type="latest"
      title="New Coloring Pages"
      subtitle="发现最新的涂色内容"
      description="浏览最新上传的涂色页面，第一时间体验最新的创意作品。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={40}
    />
  );
}
