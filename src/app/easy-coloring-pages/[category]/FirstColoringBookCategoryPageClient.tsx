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
