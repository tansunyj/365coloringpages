'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../../components/UnifiedListPageWrapper';

interface ThemeParksCategoryPageClientProps {
  category: string;
}

export default function ThemeParksCategoryPageClient({ category }: ThemeParksCategoryPageClientProps) {
  return (
    <UnifiedListPageWrapper
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
