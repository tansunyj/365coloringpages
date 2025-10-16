'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

export default function FirstColoringBookPageClient() {
  return (
    <UnifiedListPage
      type="easy-coloring-book"
      title="Easy Coloring Pages"
      subtitle="适合初学者的简单涂色页面"
      description="浏览适合孩子和初学者的简单涂色设计，轻松开始您的涂色之旅。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
