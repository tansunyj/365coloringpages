'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../../components/UnifiedListPageWrapper';

interface FirstColoringBookCategoryPageClientProps {
  category: string;
}

export default function FirstColoringBookCategoryPageClient({ category }: FirstColoringBookCategoryPageClientProps) {
  return (
    <UnifiedListPageWrapper
      type="easy-coloring-book"
      category={category}
      title="Easy Coloring Pages"
      subtitle="Simple Coloring Pages for Beginners"
      description="Browse simple coloring designs suitable for children and beginners."
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
