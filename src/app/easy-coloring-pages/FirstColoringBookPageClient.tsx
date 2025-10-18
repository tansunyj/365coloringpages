'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../components/UnifiedListPageWrapper';

export default function FirstColoringBookPageClient() {
  return (
    <UnifiedListPageWrapper
      type="easy-coloring-book"
      title="Easy Coloring Pages"
      subtitle="Simple Coloring Pages for Beginners"
      description="Browse simple coloring designs suitable for children and beginners, easily start your coloring journey."
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort="popular"
      itemsPerPage={40}
    />
  );
}
