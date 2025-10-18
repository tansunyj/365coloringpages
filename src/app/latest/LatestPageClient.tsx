'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../components/UnifiedListPageWrapper';

/**
 * Latest页面客户端组�?
 * 使用统一的列表页组件显示最新涂色页�?
 */
export default function LatestPageClient() {
  return (
    <UnifiedListPageWrapper
      type="latest"
      title="New Coloring Pages"
      subtitle="发现最新的涂色内容"
      description="浏览最新上传的涂色页面，第一时间体验最新的创意作品�?
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="newest"
      itemsPerPage={40}
    />
  );
} 