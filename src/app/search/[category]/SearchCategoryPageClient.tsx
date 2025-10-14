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
      'celebration': '庆祝',
      'phone-slug': '手机',
      'fruite-slug': '水果',
      'cat': '猫'
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
      title={`${displayName}搜索结果`}
      subtitle={`在${displayName}分类中搜索涂色页面`}
      description={`搜索${displayName}主题的精美涂色页面，找到适合您创意之旅的完美设计！`}
      showSearch={true}
      showCategoryFilter={true}
      showSortFilter={true}
      defaultSort=""
      itemsPerPage={40}
    />
  );
}
