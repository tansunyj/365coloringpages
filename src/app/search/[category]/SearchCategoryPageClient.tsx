'use client';

import React from 'react';
import UnifiedListPage from '../../../components/UnifiedListPage';

/**
 * 搜索分类页面客户端组件属性
 */
interface SearchCategoryPageClientProps {
  category: string;
}

/**
 * 搜索分类页面客户端组件
 * 使用统一的列表页组件显示特定分类的搜索结果
 */
export default function SearchCategoryPageClient({ category }: SearchCategoryPageClientProps) {
  // 根据分类生成页面标题
  const getCategoryDisplayName = (categorySlug: string): string => {
    const categoryNameMap: Record<string, string> = {
      'animals': 'Animals',
      'fairy-tale': 'Fairy Tale',
      'fantasy': 'Fantasy',
      'vehicles': 'Vehicles',
      'nature': 'Nature',
      'prehistoric': 'Prehistoric',
      'space': 'Space',
      'ocean': 'Ocean',
      'holidays': 'Holidays',
      'superhero': 'Superhero',
      'food': 'Food',
      'magic': 'Magic',
      'farm': 'Farm',
      'celebration': 'Celebration',
      'phone-slug': 'Phone',
      'fruite-slug': 'Fruit',
      'cat': 'Cat'
    };
    
    return categoryNameMap[categorySlug] || 
           categorySlug.split('-').map(word => 
             word.charAt(0).toUpperCase() + word.slice(1)
           ).join(' ');
  };

  const displayName = getCategoryDisplayName(category);

  return (
    <UnifiedListPage
      type="search"
      category={category}
      title={`${displayName} Search Results`}
      subtitle={`Search Coloring Pages in ${displayName} Category`}
      description={`Search for beautiful ${displayName} themed coloring pages and find the perfect design for your creative journey!`}
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={40}
    />
  );
}
