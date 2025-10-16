'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * 面包屑项接口定义
 */
interface BreadcrumbItem {
  name: string;
  href: string;
}

/**
 * 面包屑组件属性接口
 */
interface UnifiedBreadcrumbProps {
  type: 'popular' | 'latest' | 'easy-coloring-book' | 'theme-parks' | 'categories' | 'search';
  category?: string;
  park?: string;
  itemTitle?: string;
  searchParams?: {
    q?: string;
    page?: string;
    limit?: string;
    sort?: string;
    category?: string;
  };
}

/**
 * 分类名称映射工具类
 */
class CategoryNameMapper {
  private static readonly categoryNameMap: Record<string, string> = {
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

  /**
   * 获取分类显示名称
   * @param categorySlug - 分类slug
   * @returns 显示名称
   */
  static getDisplayName(categorySlug: string): string {
    if (categorySlug === 'all') return 'All Categories';
    
    // 优先使用中文映射
    const chineseName = this.categoryNameMap[categorySlug];
    if (chineseName) return chineseName;
    
    // 如果没有映射，格式化英文名称
    return categorySlug.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

/**
 * 面包屑路径生成器
 */
class BreadcrumbPathGenerator {
  /**
   * 生成面包屑路径
   * @param props - 组件属性
   * @returns 面包屑项数组
   */
  static generatePath(props: UnifiedBreadcrumbProps): BreadcrumbItem[] {
    const { type, category, park, itemTitle, searchParams } = props;

    switch (type) {
      case 'popular':
        return this.generatePopularPath(category, itemTitle);
      
      case 'latest':
        return this.generateLatestPath(category, itemTitle);
      
      case 'easy-coloring-book':
        return this.generateFirstColoringBookPath(category, itemTitle);
      
      case 'theme-parks':
        return this.generateThemeParksPath(park, itemTitle);
      
      case 'categories':
        return this.generateCategoriesPath(category, itemTitle);
      
      case 'search':
        return this.generateSearchPath(searchParams, itemTitle);
      
      default:
        return this.generateDefaultPath(itemTitle);
    }
  }

  /**
   * 生成Popular页面面包屑
   */
  private static generatePopularPath(category?: string, itemTitle?: string): BreadcrumbItem[] {
    const basePath = [
      { name: 'Home', href: '/' },
      { name: 'Best Coloring Pages', href: '/best-coloring-pages' }
    ];

    if (category) {
      const categoryDisplay = CategoryNameMapper.getDisplayName(category);
      basePath.push({ name: categoryDisplay, href: `/best-coloring-pages?category=${category}` });
    }

    if (itemTitle) {
      basePath.push({ name: itemTitle, href: '#' });
    }

    return basePath;
  }

  /**
   * 生成Latest页面面包屑
   */
  private static generateLatestPath(category?: string, itemTitle?: string): BreadcrumbItem[] {
    const basePath = [
      { name: 'Home', href: '/' },
      { name: 'New Coloring Pages', href: '/new-coloring-pages' }
    ];

    if (category && itemTitle) {
      // 详情页面：分类链接跳转到主列表页并预选分类
      const categoryDisplay = CategoryNameMapper.getDisplayName(category);
      basePath.push({ 
        name: categoryDisplay, 
        href: `/new-coloring-pages?category=${category}` // 跳转到主列表页并预选分类
      });
      basePath.push({ name: itemTitle, href: '#' });
    } else if (itemTitle) {
      // 如果只有标题没有分类，直接添加标题
      basePath.push({ name: itemTitle, href: '#' });
    }

    return basePath;
  }

  /**
   * 生成Easy Coloring Book页面面包屑
   */
  private static generateFirstColoringBookPath(category?: string, itemTitle?: string): BreadcrumbItem[] {
    const basePath = [
      { name: 'Home', href: '/' },
      { name: 'Easy Coloring Pages', href: '/easy-coloring-pages' }
    ];

    if (category) {
      const categoryDisplay = CategoryNameMapper.getDisplayName(category);
      basePath.push({ name: categoryDisplay, href: `/easy-coloring-pages/${category}` });
    }

    if (itemTitle) {
      basePath.push({ name: itemTitle, href: '#' });
    }

    return basePath;
  }

  /**
   * 生成Theme Parks页面面包屑
   */
  private static generateThemeParksPath(park?: string, itemTitle?: string): BreadcrumbItem[] {
    const basePath = [
      { name: 'Home', href: '/' },
      { name: 'Disney & Characters', href: '/disney-characters' }
    ];

    if (park) {
      const parkDisplay = park ? decodeURIComponent(park).replace(/-/g, ' ') : 'All Parks';
      basePath.push({ name: parkDisplay, href: `/disney-characters/${park}` });
    }

    if (itemTitle) {
      basePath.push({ name: itemTitle, href: '#' });
    }

    return basePath;
  }

  /**
   * 生成Categories页面面包屑
   */
  private static generateCategoriesPath(category?: string, itemTitle?: string): BreadcrumbItem[] {
    const basePath = [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' }
    ];

    if (category) {
      const categoryDisplay = CategoryNameMapper.getDisplayName(category);
      basePath.push({ name: categoryDisplay, href: `/categories/${category}` });
    }

    if (itemTitle) {
      basePath.push({ name: itemTitle, href: '#' });
    }

    return basePath;
  }

  /**
   * 生成Search页面面包屑
   */
  private static generateSearchPath(searchParams?: UnifiedBreadcrumbProps['searchParams'], itemTitle?: string): BreadcrumbItem[] {
    const basePath = [
      { name: 'Home', href: '/' },
      { name: 'Search Results', href: '/search' }
    ];

    if (searchParams) {
      // 构建搜索URL参数
      const params = new URLSearchParams();
      if (searchParams.q) params.set('q', searchParams.q);
      if (searchParams.page && searchParams.page !== '1') params.set('page', searchParams.page);
      if (searchParams.limit && searchParams.limit !== '12') params.set('limit', searchParams.limit);
      if (searchParams.sort) params.set('sort', searchParams.sort);
      if (searchParams.category) params.set('category', searchParams.category);
      
      const searchUrl = `/search?${params.toString()}`;
      const searchQuery = searchParams.q || '';
      
      if (searchQuery) {
        basePath.push({ name: `"${searchQuery}"`, href: searchUrl });
      }
    }

    if (itemTitle) {
      basePath.push({ name: itemTitle, href: '#' });
    }

    return basePath;
  }

  /**
   * 生成默认面包屑
   */
  private static generateDefaultPath(itemTitle?: string): BreadcrumbItem[] {
    const basePath = [{ name: 'Home', href: '/' }];

    if (itemTitle) {
      basePath.push({ name: itemTitle, href: '#' });
    }

    return basePath;
  }
}

/**
 * 统一面包屑导航组件
 * 
 * @description 
 * 根据页面类型和参数自动生成合适的面包屑导航路径，支持以下7种页面类型：
 * 1. popular - 热门页面
 * 2. latest - 最新页面  
 * 3. easy-coloring-book - Easy Coloring Book
 * 4. theme-parks - 主题公园
 * 5. categories - 分类页面
 * 6. search - 搜索结果页面
 * 
 * @example
 * // 分类页面详情页面包屑
 * <UnifiedBreadcrumb 
 *   type="categories" 
 *   category="animals" 
 *   itemTitle="可爱小狗涂色页" 
 * />
 * 
 * // 搜索结果页面包屑
 * <UnifiedBreadcrumb 
 *   type="search" 
 *   searchParams={{q: "小狗", category: "animals"}}
 *   itemTitle="搜索结果页面"
 * />
 */
export default function UnifiedBreadcrumb(props: UnifiedBreadcrumbProps) {
  const breadcrumbPath = BreadcrumbPathGenerator.generatePath(props);

  if (breadcrumbPath.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      {breadcrumbPath.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          )}
          {index === breadcrumbPath.length - 1 ? (
            <span className="text-gray-900 font-medium truncate max-w-xs" title={item.name}>
              {item.name}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-orange-600 transition-colors duration-200 truncate max-w-xs"
              title={item.name}
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
} 