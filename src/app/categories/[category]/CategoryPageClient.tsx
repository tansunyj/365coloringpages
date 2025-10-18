'use client';

import React from 'react';
import UnifiedListPageWrapper from '../../../components/UnifiedListPageWrapper';

/**
 * 分类页面客户端组件属性
 */
interface CategoryPageClientProps {
  category: string;
}

/**
 * 分类页面客户端组件
 * 使用统一的列表页组件显示特定分类的涂色页面
 */
export default function CategoryPageClient({ category }: CategoryPageClientProps) {
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
      'celebration': 'Celebration'
    };
    
    return categoryNameMap[categorySlug] || 
           categorySlug.split('-').map(word => 
             word.charAt(0).toUpperCase() + word.slice(1)
           ).join(' ');
  };

  const displayName = getCategoryDisplayName(category);

  return (
    <UnifiedListPageWrapper
      type="categories"
      category={category}
      title={`${displayName} Coloring Pages`}
      subtitle={`Explore Beautiful ${displayName} Themed Coloring Content`}
      description={`Browse our carefully curated collection of ${displayName} coloring pages, suitable for users of all ages.`}
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={10}
    />
  );
} 