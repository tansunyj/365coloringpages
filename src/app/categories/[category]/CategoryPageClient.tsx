'use client';

import React from 'react';
import UnifiedListPage from '../../../components/UnifiedListPage';

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
      'animals': '动物',
      'fairy-tale': '童话',
      'fantasy': '幻想',
      'vehicles': '交通工具',
      'nature': '自然',
      'prehistoric': '史前动物',
      'space': '太空',
      'ocean': '海洋',
      'holidays': '节日',
      'superhero': '超级英雄',
      'food': '食物',
      'magic': '魔法',
      'farm': '农场',
      'celebration': '庆祝'
    };
    
    return categoryNameMap[categorySlug] || 
           categorySlug.split('-').map(word => 
             word.charAt(0).toUpperCase() + word.slice(1)
           ).join(' ');
  };

  const displayName = getCategoryDisplayName(category);

  return (
    <UnifiedListPage
      type="categories"
      category={category}
      title={`${displayName}涂色页面`}
      subtitle={`探索${displayName}主题的精美涂色内容`}
      description={`浏览我们精心收集的${displayName}涂色页面，适合不同年龄段的用户使用。`}
      showSearch={true}
      showCategoryFilter={false}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={10}
    />
  );
} 