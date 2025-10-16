'use client';

import React from 'react';
import UnifiedListPage from '../../../components/UnifiedListPage';

interface ThemeParksCategoryPageClientProps {
  category: string;
}

export default function ThemeParksCategoryPageClient({ category }: ThemeParksCategoryPageClientProps) {
  return (
    <UnifiedListPage
      type="theme-parks"
      park={category}
      title="Disney & Characters"
      subtitle="探索精彩的迪士尼角色世界"
      description="浏览我们收集的各种迪士尼角色涂色页面。"
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
