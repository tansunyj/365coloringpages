'use client';

import React from 'react';
import UnifiedListPage from '../../../components/UnifiedListPage';

interface FirstColoringBookCategoryPageClientProps {
  category: string;
}

export default function FirstColoringBookCategoryPageClient({ category }: FirstColoringBookCategoryPageClientProps) {
  return (
    <UnifiedListPage
      type="easy-coloring-book"
      category={category}
      title="Easy Coloring Pages"
      subtitle="适合初学者的简单涂色页面"
      description="浏览适合孩子和初学者的简单涂色设计。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
