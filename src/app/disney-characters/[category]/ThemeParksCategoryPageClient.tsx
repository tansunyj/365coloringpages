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
      category={category}
      title="Disney & Characters"
      subtitle="Explore the Wonderful World of Disney Characters"
      description="Browse our collection of various Disney character coloring pages."
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
