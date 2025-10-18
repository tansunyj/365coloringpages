'use client';

import { Suspense } from 'react';
import UnifiedListPage from './UnifiedListPage';

/**
 * UnifiedListPage 包装组件
 * Suspense 包裹以满足 useSearchParams() 的要求
 */
interface UnifiedListPageProps {
  type: 'popular' | 'latest' | 'easy-coloring-book' | 'theme-parks' | 'categories' | 'search';
  category?: string;
  park?: string;
  title: string;
  subtitle: string;
  description: string;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showSortFilter?: boolean;
  defaultSort?: string;
  itemsPerPage?: number;
}

export default function UnifiedListPageWrapper(props: UnifiedListPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <UnifiedListPage {...props} />
    </Suspense>
  );
}

