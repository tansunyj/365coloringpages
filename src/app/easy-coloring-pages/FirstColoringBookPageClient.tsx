'use client';

import React from 'react';
import UnifiedListPage from '../../components/UnifiedListPage';

export default function FirstColoringBookPageClient() {
  return (
    <UnifiedListPage
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
