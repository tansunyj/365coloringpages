/**
 * 统一的页面 SEO 生成入口
 * 一次编写，多处使用
 */

import { Metadata } from 'next';
import { PageType, PageLevel, getSEOConfig } from './seoConfig';
import { dataFetcher } from './dataFetcher';
import { seoGenerator } from './seoGenerator';

export interface GeneratePageSEOParams {
  // 页面类型
  pageType: PageType;
  
  // 页面层级
  pageLevel: PageLevel;
  
  // 页面参数
  category?: string;
  slugId?: string;
  themePark?: string;
  
  // 基础 URL（用于 canonical）
  baseUrl?: string;
}

/**
 * 生成页面 SEO 元数据
 * 这是唯一需要在页面中调用的函数！
 * 
 * @example
 * // 分类首页
 * await generatePageSEO({
 *   pageType: 'categories',
 *   pageLevel: 'home',
 *   baseUrl: '/categories'
 * });
 * 
 * @example
 * // 分类列表页
 * await generatePageSEO({
 *   pageType: 'categories',
 *   pageLevel: 'category',
 *   category: 'animals',
 *   baseUrl: '/categories/animals'
 * });
 * 
 * @example
 * // 分类详情页
 * await generatePageSEO({
 *   pageType: 'categories',
 *   pageLevel: 'detail',
 *   category: 'animals',
 *   slugId: 'cat-123',
 *   baseUrl: '/categories/animals/cat-123'
 * });
 */
export async function generatePageSEO(params: GeneratePageSEOParams): Promise<Metadata> {
  const { pageType, pageLevel, category, slugId, themePark, baseUrl } = params;
  
  // 1. 获取配置
  const config = getSEOConfig(pageType, pageLevel);
  
  // 2. 根据配置获取数据
  let categoryData = null;
  let coloringPageData = null;
  let themeParkData = null;
  
  // 获取分类数据
  if (config.dataSource === 'category' && category) {
    categoryData = await dataFetcher.fetchCategory(category);
  }
  
  // 获取涂色页面数据
  if (config.dataSource === 'coloringPage' && slugId) {
    const id = dataFetcher.extractIdFromSlugId(slugId);
    if (id) {
      coloringPageData = await dataFetcher.fetchColoringPage(id);
      
      // 如果还没有分类数据，尝试从涂色页面获取
      if (!categoryData && category) {
        categoryData = await dataFetcher.fetchCategory(category);
      }
    } else {
      // ID 无效，返回错误元数据
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      };
    }
  }
  
  // 获取主题公园数据
  if (config.dataSource === 'themePark' && (themePark || category)) {
    const slug = themePark || category;
    if (slug) {
      themeParkData = await dataFetcher.fetchThemePark(slug);
    }
  }
  
  // 如果需要涂色页面数据但获取失败，返回错误元数据
  if (config.dataSource === 'coloringPage' && !coloringPageData) {
    return {
      title: `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page Not Found`,
      description: 'The requested page could not be found.',
    };
  }
  
  // 3. 构建上下文
  const context = {
    category,
    slugId,
    categoryData,
    coloringPageData,
    themeParkData,
    baseUrl,
    siteUrl: 'https://365coloringpages.com',
  };
  
  // 4. 生成 SEO
  return seoGenerator.generate(config, context);
}

/**
 * 快捷方法：生成分类页面 SEO
 */
export async function generateCategoriesSEO(
  level: PageLevel,
  params?: { category?: string; slugId?: string }
): Promise<Metadata> {
  const baseUrl = params?.slugId 
    ? `/categories/${params.category}/${params.slugId}`
    : params?.category
    ? `/categories/${params.category}`
    : '/categories';
  
  return generatePageSEO({
    pageType: 'categories',
    pageLevel: level,
    category: params?.category,
    slugId: params?.slugId,
    baseUrl,
  });
}

/**
 * 快捷方法：生成搜索页面 SEO
 */
export async function generateSearchSEO(
  level: PageLevel,
  params?: { category?: string; slugId?: string }
): Promise<Metadata> {
  const baseUrl = params?.slugId 
    ? `/search/${params.category}/${params.slugId}`
    : params?.category
    ? `/search/${params.category}`
    : '/search';
  
  return generatePageSEO({
    pageType: 'search',
    pageLevel: level,
    category: params?.category,
    slugId: params?.slugId,
    baseUrl,
  });
}

/**
 * 快捷方法：生成受欢迎页面 SEO
 */
export async function generatePopularSEO(
  level: PageLevel,
  params?: { category?: string; slugId?: string }
): Promise<Metadata> {
  const baseUrl = params?.slugId 
    ? `/popular/${params.category}/${params.slugId}`
    : params?.category
    ? `/popular/${params.category}`
    : '/popular';
  
  return generatePageSEO({
    pageType: 'popular',
    pageLevel: level,
    category: params?.category,
    slugId: params?.slugId,
    baseUrl,
  });
}

/**
 * 快捷方法：生成主题公园页面 SEO
 */
export async function generateThemeParksSEO(
  level: PageLevel,
  params?: { themePark?: string; slugId?: string }
): Promise<Metadata> {
  const baseUrl = params?.slugId 
    ? `/theme-parks/${params.themePark}/${params.slugId}`
    : params?.themePark
    ? `/theme-parks/${params.themePark}`
    : '/theme-parks';
  
  return generatePageSEO({
    pageType: 'themeParks',
    pageLevel: level,
    category: params?.themePark, // 使用 category 参数传递 themePark
    slugId: params?.slugId,
    baseUrl,
  });
}

/**
 * 快捷方法：生成最新页面 SEO
 */
export async function generateLatestSEO(
  level: PageLevel,
  params?: { category?: string; slugId?: string }
): Promise<Metadata> {
  const baseUrl = params?.slugId 
    ? `/latest/${params.category}/${params.slugId}`
    : params?.category
    ? `/latest/${params.category}`
    : '/latest';
  
  return generatePageSEO({
    pageType: 'latest',
    pageLevel: level,
    category: params?.category,
    slugId: params?.slugId,
    baseUrl,
  });
}

/**
 * 快捷方法：生成第一本涂色书页面 SEO
 */
export async function generateFirstColoringBookSEO(
  level: PageLevel,
  params?: { category?: string; slugId?: string }
): Promise<Metadata> {
  const baseUrl = params?.slugId 
    ? `/first-coloring-book/${params.category}/${params.slugId}`
    : params?.category
    ? `/first-coloring-book/${params.category}`
    : '/first-coloring-book';
  
  return generatePageSEO({
    pageType: 'firstColoringBook',
    pageLevel: level,
    category: params?.category,
    slugId: params?.slugId,
    baseUrl,
  });
}

