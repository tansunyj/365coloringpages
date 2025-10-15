/**
 * SEO 配置系统
 * 定义不同页面类型的 SEO 生成规则
 */

import { KEYWORD_SOURCE } from './keywords';

export type PageType = 'categories' | 'search' | 'popular' | 'themeParks' | 'latest' | 'firstColoringBook';
export type PageLevel = 'home' | 'category' | 'detail';

export interface SEOPageConfig {
  // 基础关键词（可以使用变量占位符）
  baseKeywords: string[];
  
  // Title 模板（支持变量替换）
  titleTemplate: string;
  
  // Description 模板
  descriptionTemplate: string;
  
  // Title 后缀（如果 titleTemplate 中没有指定）
  defaultTitleSuffix?: string;
  
  // 数据源类型
  dataSource?: 'category' | 'coloringPage' | 'themePark' | 'none';
  
  // 是否包含涂色页面属性关键词
  includeAttributes?: boolean;
  
  // 上下文前缀（添加到 description 开头）
  descriptionPrefix?: string;
  
  // 上下文关键词（添加到基础关键词）
  contextKeywords?: string[];
  
  // Keywords 数量限制
  keywordsLimit?: number;
}

/**
 * SEO 配置字典
 * 为每种页面类型和层级定义配置
 */
export const SEO_CONFIGS: Record<PageType, Record<PageLevel, SEOPageConfig>> = {
  // ==================== 分类页面 ====================
  // 基于 PUBLIC_PAGES_ANALYSIS.md (613-707行)
  categories: {
    home: {
      // 基于文档 673-707 行
      baseKeywords: [
        'coloring pages',
        'animal coloring pages',
        'cat coloring pages',
        'dog coloring pages',
        'disney coloring pages',
        'princess coloring pages',
        'free printable',
      ],
      titleTemplate: 'Browse All Coloring Page Categories - Animals, Characters & More',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Explore coloring page categories: Animals (Cat, Dog, Dinosaur), Characters (Hello Kitty, Pokemon, Disney), Holidays, and more. Free printable downloads.',
      dataSource: 'none',
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'coloring pages',
        'printable coloring pages',
      ],
      titleTemplate: '{categoryName} Coloring Pages',
      defaultTitleSuffix: 'Free Printable Designs',
      descriptionTemplate: 'Explore {categoryName} coloring pages. {highlightPhrase} Free printable designs perfect for kids and adults.',
      dataSource: 'category',
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'coloring pages',
        'printable coloring pages',
      ],
      titleTemplate: '{title} - {categoryName} Coloring Page',
      defaultTitleSuffix: 'Free Printable',
      descriptionTemplate: 'Download and print {title} coloring page. {difficultyText}{ageText}. {styleThemeText} design. Free high-quality printable coloring sheet.',
      dataSource: 'coloringPage',
      includeAttributes: true,
      keywordsLimit: 12,
    },
  },

  // ==================== 搜索页面 ====================
  // 基于 PUBLIC_PAGES_ANALYSIS.md (822-869行)
  search: {
    home: {
      // 基于文档 822-858 行
      baseKeywords: [
        'coloring pages',
        'free coloring pages',
        'printable coloring pages',
        'search coloring pages',
        'christmas coloring pages',
        'halloween coloring pages',
        'animal coloring pages',
        'disney coloring pages',
      ],
      titleTemplate: 'Search Free Coloring Pages - Find Your Perfect Printable',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Search 10,000+ coloring pages by keyword: Christmas, Halloween, Animals, Characters, and more. Free printable downloads for kids and adults.',
      dataSource: 'none',
      contextKeywords: ['search coloring pages', 'find coloring pages'],
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'search coloring pages',
        'find coloring pages',
        'browse coloring pages',
        'coloring pages',
      ],
      titleTemplate: 'Search {categoryName} Coloring Pages',
      defaultTitleSuffix: 'Free Printable',
      descriptionTemplate: 'Search and find {categoryName} coloring pages. {highlightPhrase} Browse through our collection of free printable designs. Perfect for kids and adults.',
      dataSource: 'category',
      contextKeywords: ['search coloring pages', 'find coloring pages'],
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'search coloring pages',
        'find coloring pages',
        'coloring pages',
      ],
      titleTemplate: '{title} - {categoryName} Coloring Page',
      defaultTitleSuffix: 'Search Results',
      descriptionTemplate: '{title} coloring page. {difficultyText}{ageText}. {styleThemeText} design. Free high-quality printable coloring sheet.',
      descriptionPrefix: 'Search result: ',
      dataSource: 'coloringPage',
      includeAttributes: true,
      contextKeywords: ['search coloring pages', 'find coloring pages'],
      keywordsLimit: 12,
    },
  },

  // ==================== 受欢迎页面 ====================
  // 基于 PUBLIC_PAGES_ANALYSIS.md (870-936行)
  popular: {
    home: {
      // 基于文档 870-874 行
      baseKeywords: [
        'popular coloring pages',
        'hello kitty coloring pages',
        'pokemon coloring pages',
        'bluey coloring pages',
        'sonic coloring pages',
        'disney coloring pages',
        'trending coloring pages',
      ],
      titleTemplate: 'Popular Coloring Pages - Most Downloaded Free Printables',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Browse the most popular coloring pages: Hello Kitty, Pokemon, Bluey, Disney characters, Animals and more. Top downloads updated daily.',
      dataSource: 'none',
      contextKeywords: ['popular coloring pages', 'trending coloring pages'],
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'popular coloring pages',
        'trending coloring pages',
        'coloring pages',
      ],
      titleTemplate: 'Popular {categoryName} Coloring Pages',
      defaultTitleSuffix: 'Most Popular Designs',
      descriptionTemplate: 'Explore the most popular {categoryName} coloring pages. {highlightPhrase} Trending designs loved by thousands. Free printable sheets for kids and adults.',
      dataSource: 'category',
      contextKeywords: ['popular coloring pages', 'trending coloring pages'],
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'popular coloring pages',
        'trending coloring pages',
        'coloring pages',
      ],
      titleTemplate: '{title} - Popular {categoryName} Coloring Page',
      defaultTitleSuffix: 'Free Printable',
      descriptionTemplate: '{title} coloring page. {difficultyText}{ageText}. {styleThemeText} design. One of our most loved free printable coloring sheets.',
      descriptionPrefix: 'Download this popular ',
      dataSource: 'coloringPage',
      includeAttributes: true,
      contextKeywords: ['popular coloring pages', 'trending coloring pages'],
      keywordsLimit: 12,
    },
  },

  // ==================== 主题公园页面 ====================
  // 基于 PUBLIC_PAGES_ANALYSIS.md (882-886行)
  themeParks: {
    home: {
      // 基于文档 882-886 行
      baseKeywords: [
        'theme park coloring pages',
        'disney coloring pages',
        'disney princess coloring pages',
        'mickey mouse coloring pages',
        'frozen coloring pages',
        'moana coloring pages',
      ],
      titleTemplate: 'Theme Park Coloring Pages - Disney, Characters & More',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Explore theme park coloring pages featuring Disney characters, Mickey Mouse, princesses, and popular attractions. Free printable downloads for kids.',
      dataSource: 'none',
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'theme park coloring pages',
        'park coloring pages',
        'coloring pages',
      ],
      titleTemplate: '{themeParkName} Coloring Pages',
      defaultTitleSuffix: 'Free Printable Designs',
      descriptionTemplate: 'Explore {themeParkName} themed coloring pages. {highlightPhrase} Free printable designs perfect for kids and adults who love theme parks.',
      dataSource: 'themePark',
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'theme park coloring pages',
        'park coloring pages',
        'coloring pages',
      ],
      titleTemplate: '{title} - {themeParkName} Coloring Page',
      defaultTitleSuffix: 'Free Printable',
      descriptionTemplate: 'Download and print {title} coloring page from {themeParkName}. {difficultyText}{ageText}. {styleThemeText} design. Free high-quality printable coloring sheet.',
      dataSource: 'coloringPage',
      includeAttributes: true,
      keywordsLimit: 12,
    },
  },

  // ==================== 最新页面 ====================
  // 基于 PUBLIC_PAGES_ANALYSIS.md (876-881行)
  latest: {
    home: {
      // 基于文档 876-881 行
      baseKeywords: [
        'latest coloring pages',
        'new coloring pages',
        'newest printables',
        'fresh coloring sheets',
        'recently added',
        'coloring pages for kids',
      ],
      titleTemplate: 'Latest Coloring Pages - New Free Printable Sheets',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Discover the newest coloring pages added daily. Fresh designs featuring animals, characters, holidays and more. Free printable downloads.',
      dataSource: 'none',
      contextKeywords: ['latest coloring pages', 'new coloring pages'],
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'latest coloring pages',
        'new coloring pages',
        'coloring pages',
      ],
      titleTemplate: 'Latest {categoryName} Coloring Pages',
      defaultTitleSuffix: 'Newest Designs',
      descriptionTemplate: 'Browse the latest {categoryName} coloring pages. {highlightPhrase} New designs added regularly. Free printable sheets for kids and adults.',
      dataSource: 'category',
      contextKeywords: ['latest coloring pages', 'new coloring pages'],
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'latest coloring pages',
        'new coloring pages',
        'coloring pages',
      ],
      titleTemplate: '{title} - Latest {categoryName} Coloring Page',
      defaultTitleSuffix: 'Free Printable',
      descriptionTemplate: '{title} coloring page. {difficultyText}{ageText}. {styleThemeText} design. Recently added free printable coloring sheet.',
      descriptionPrefix: 'New: ',
      dataSource: 'coloringPage',
      includeAttributes: true,
      contextKeywords: ['latest coloring pages', 'new coloring pages'],
      keywordsLimit: 12,
    },
  },

  // ==================== 第一本涂色书页面 ====================
  // 基于 PUBLIC_PAGES_ANALYSIS.md (888-892行)
  firstColoringBook: {
    home: {
      // 基于文档 888-892 行
      baseKeywords: [
        'first coloring book',
        'easy coloring pages',
        'simple coloring pages',
        'kids coloring pages',
        'abc coloring pages',
        'alphabet coloring pages',
        'number coloring pages',
        'preschool coloring pages',
      ],
      titleTemplate: 'First Coloring Book - Easy Coloring Pages for Beginners',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Perfect first coloring book with easy, simple designs for young children. ABC, numbers, and basic shapes. Free printable pages.',
      dataSource: 'none',
      contextKeywords: ['first coloring book', 'beginner coloring pages'],
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'first coloring book',
        'beginner coloring pages',
        'coloring pages',
      ],
      titleTemplate: 'First {categoryName} Coloring Book',
      defaultTitleSuffix: 'Easy Designs',
      descriptionTemplate: 'Simple {categoryName} coloring pages for beginners. {highlightPhrase} Perfect first coloring book. Free printable sheets for young children.',
      dataSource: 'category',
      contextKeywords: ['first coloring book', 'beginner coloring pages'],
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'first coloring book',
        'beginner coloring pages',
        'coloring pages',
      ],
      titleTemplate: '{title} - First Coloring Book',
      defaultTitleSuffix: 'Easy Design',
      descriptionTemplate: '{title} coloring page. {difficultyText}{ageText}. {styleThemeText} design. Perfect for your first coloring book. Free printable.',
      descriptionPrefix: 'Easy: ',
      dataSource: 'coloringPage',
      includeAttributes: true,
      contextKeywords: ['first coloring book', 'beginner coloring pages'],
      keywordsLimit: 12,
    },
  },
};

/**
 * 获取指定页面类型和层级的配置
 */
export function getSEOConfig(pageType: PageType, pageLevel: PageLevel): SEOPageConfig {
  const config = SEO_CONFIGS[pageType]?.[pageLevel];
  
  if (!config) {
    throw new Error(`SEO config not found for ${pageType}/${pageLevel}`);
  }
  
  return config;
}

