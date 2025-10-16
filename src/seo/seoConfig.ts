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
  dataSource?: 'category' | 'coloringPage' | 'themePark' | 'coloringBook' | 'none';
  
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

  // ==================== 最佳涂色页面 ====================
  // 基于 SEMRush 数据优化：best coloring pages (480/月), best free (170/月), top (110/月)
  popular: {
    home: {
      // 基于 CSV 数据的高流量关键词优化
      baseKeywords: [
        'best coloring pages',              // 480/月 - 核心关键词
        'best free coloring pages',         // 170/月
        'top coloring pages',               // 110/月
        'hello kitty coloring pages',       // 49.5K/月 - 保留高流量角色
        'pokemon coloring pages',           // 33.1K/月
        'bluey coloring pages',             // 40.5K/月
        'disney coloring pages',            // 18.1K/月
        'best coloring pages for kids',     // 70/月
      ],
      titleTemplate: 'Best Coloring Pages - Top Quality Free Printables',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Discover the best coloring pages featuring Hello Kitty (49.5K searches), Pokemon (33.1K), Bluey (40.5K), Disney characters and more. Top quality free printables for kids and adults.',
      dataSource: 'none',
      contextKeywords: ['best coloring pages', 'top coloring pages', 'best free coloring pages'],
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'best coloring pages',              // 480/月 - 核心关键词
        'best free coloring pages',         // 170/月
        'top coloring pages',               // 110/月
        'coloring pages',                   // 368K/月 - 通用关键词
      ],
      titleTemplate: 'Best {categoryName} Coloring Pages',
      defaultTitleSuffix: 'Top Quality Designs',
      descriptionTemplate: 'Discover the best {categoryName} coloring pages. {highlightPhrase} Premium quality designs perfect for kids and adults. Free printable downloads.',
      dataSource: 'category',
      contextKeywords: ['best coloring pages', 'top coloring pages', 'best free coloring pages'],
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'best coloring pages',              // 480/月 - 核心关键词
        'best free coloring pages',         // 170/月
        'top coloring pages',               // 110/月
        'coloring pages',                   // 368K/月 - 通用关键词
      ],
      titleTemplate: '{title} - Best {categoryName} Coloring Page',
      defaultTitleSuffix: 'Free Printable',
      descriptionTemplate: '{title} coloring page. {difficultyText}{ageText}. {styleThemeText} design. One of our best quality free printable coloring sheets.',
      descriptionPrefix: 'Download this premium ',
      dataSource: 'coloringPage',
      includeAttributes: true,
      contextKeywords: ['best coloring pages', 'top coloring pages', 'best free coloring pages'],
      keywordsLimit: 12,
    },
  },

  // ==================== 迪士尼角色页面 ====================
  // 基于 SEMRush 数据优化：princess (22.2K/月), disney (18.1K/月), mickey mouse (9.9K/月)
  themeParks: {
    home: {
      // 基于 CSV 数据的高流量角色关键词优化
      baseKeywords: [
        'princess coloring pages',          // 22.2K/月 - 最高流量
        'disney coloring pages',            // 18.1K/月
        'disney princess coloring pages',   // 9.9K/月
        'mickey mouse coloring pages',      // 9.9K/月
        'frozen coloring pages',            // 8.1K/月
        'moana coloring pages',             // 8.1K/月
        'disney characters coloring pages', // 语义相关
        'coloring pages disney',            // 5.4K/月 - 反向关键词
      ],
      titleTemplate: 'Disney & Characters Coloring Pages - Princess, Mickey & More',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Explore Disney & Characters coloring pages featuring Princess (22.2K searches), Disney characters (18.1K), Mickey Mouse (9.9K), Frozen, Moana and more. Free printable downloads for kids.',
      dataSource: 'none',
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'disney coloring pages',            // 18.1K/月 - 核心关键词
        'princess coloring pages',          // 22.2K/月 - 最高流量
        'disney characters coloring pages', // 语义相关
        'coloring pages',                   // 368K/月 - 通用关键词
      ],
      titleTemplate: '{themeParkName} Disney Characters Coloring Pages',
      defaultTitleSuffix: 'Free Printable Designs',
      descriptionTemplate: 'Explore {themeParkName} Disney characters coloring pages. {highlightPhrase} Premium Disney designs perfect for kids who love princesses, Mickey Mouse and more.',
      dataSource: 'themePark',
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'disney coloring pages',            // 18.1K/月 - 核心关键词
        'princess coloring pages',          // 22.2K/月 - 最高流量
        'disney characters coloring pages', // 语义相关
        'coloring pages',                   // 368K/月 - 通用关键词
      ],
      titleTemplate: '{title} - Disney Character Coloring Page',
      defaultTitleSuffix: 'Free Printable',
      descriptionTemplate: 'Download and print {title} Disney character coloring page. {difficultyText}{ageText}. {styleThemeText} design featuring beloved Disney characters. Free high-quality printable.',
      dataSource: 'coloringPage',
      includeAttributes: true,
      keywordsLimit: 12,
    },
  },

  // ==================== 新涂色页面 ====================
  // 基于 SEMRush 数据优化：混合高流量通用词 + 功能准确性
  latest: {
    home: {
      // 混合策略：高流量通用词 + 新内容定位
      baseKeywords: [
        'coloring pages for kids',          // 60.5K/月 - 高流量目标用户
        'kids coloring pages',              // 14.8K/月 - 高流量
        'new coloring pages',               // 90/月 - 功能准确性
        'coloring pages',                   // 368K/月 - 超高流量通用词
        'free coloring pages',              // 40.5K/月 - 高流量
        'printable coloring pages',         // 33.1K/月 - 高流量
      ],
      titleTemplate: 'New Coloring Pages - Fresh Free Printables for Kids',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Discover new coloring pages added daily! Fresh designs for kids featuring animals, characters, holidays and more. Free printable downloads updated regularly.',
      dataSource: 'none',
      contextKeywords: ['new coloring pages', 'coloring pages for kids', 'fresh designs'],
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'coloring pages for kids',          // 60.5K/月 - 高流量目标用户
        'new coloring pages',               // 90/月 - 功能准确性
        'kids coloring pages',              // 14.8K/月
        'coloring pages',                   // 368K/月 - 通用词
      ],
      titleTemplate: 'New {categoryName} Coloring Pages for Kids',
      defaultTitleSuffix: 'Fresh Designs',
      descriptionTemplate: 'Browse new {categoryName} coloring pages for kids. {highlightPhrase} Fresh designs added regularly. Free printable sheets perfect for children.',
      dataSource: 'category',
      contextKeywords: ['new coloring pages', 'coloring pages for kids', 'fresh designs'],
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'coloring pages for kids',          // 60.5K/月 - 高流量
        'new coloring pages',               // 90/月 - 功能准确性
        'kids coloring pages',              // 14.8K/月
        'coloring pages',                   // 368K/月 - 通用词
      ],
      titleTemplate: '{title} - New {categoryName} Coloring Page for Kids',
      defaultTitleSuffix: 'Free Printable',
      descriptionTemplate: '{title} coloring page for kids. {difficultyText}{ageText}. {styleThemeText} design. Fresh addition to our free printable collection.',
      descriptionPrefix: 'New: ',
      dataSource: 'coloringPage',
      includeAttributes: true,
      contextKeywords: ['new coloring pages', 'coloring pages for kids', 'fresh designs'],
      keywordsLimit: 12,
    },
  },

  // ==================== Easy Coloring Book 页面 ====================
  // 基于 CSV数据分析：easy coloring pages (18.1K), easy coloring book pages (390), simple coloring pages (12.1K), kids coloring pages (14.8K)
  // 详见: FIRST_COLORING_BOOK_SEO_ANALYSIS.md
  firstColoringBook: {
    home: {
      // ✅ SEO优化：使用高搜索量关键词（Easy Coloring Book主题）
      baseKeywords: [
        'easy coloring pages',           // ✅ 18,100搜索量（核心关键词）
        'simple coloring pages',         // ✅ 12,100搜索量
        'kids coloring pages',           // ✅ 14,800搜索量
        'easy coloring book pages',      // ✅ 390搜索量（直接匹配）
        'simple coloring book pages',    // ✅ 590搜索量（直接匹配）
        'easy coloring pages for kids',  // ✅ 1,900搜索量
        'preschool coloring pages',      // ✅ 3,600搜索量
        'beginner coloring pages',       // ✅ 语义相关（初学者）
      ],
      titleTemplate: 'Easy Coloring Book - Simple Pages for Kids & Beginners',
      defaultTitleSuffix: '', // 已包含在 titleTemplate 中
      descriptionTemplate: 'Browse 1,000+ easy coloring book pages perfect for kids and beginners. Simple designs featuring animals, characters, ABC, numbers. Free printable downloads for toddlers, preschoolers, and all skill levels.',
      dataSource: 'none',
      contextKeywords: ['easy coloring book', 'easy coloring pages', 'simple coloring pages', 'beginner coloring pages'],
      keywordsLimit: 12,
    },
    category: {
      baseKeywords: [
        'easy coloring pages',       // ✅ 核心关键词
        'simple coloring pages',     // ✅ 核心关键词
        'kids coloring pages',       // ✅ 核心关键词
        'easy coloring book pages',  // ✅ 390搜索量（直接匹配）
        'beginner coloring pages',   // ✅ 语义相关（初学者）
      ],
      titleTemplate: 'Easy {categoryName} Coloring Book for Kids',
      defaultTitleSuffix: 'Simple Designs',
      descriptionTemplate: 'Easy {categoryName} coloring book with simple designs for kids and beginners. {highlightPhrase} Large areas and clear outlines make these perfect for preschool, toddlers, and first-time colorists. Free printable.',
      dataSource: 'coloringBook',
      contextKeywords: ['easy coloring book', 'easy coloring pages', 'simple coloring pages'],
      keywordsLimit: 12,
    },
    detail: {
      baseKeywords: [
        'easy coloring pages',       // ✅ 核心关键词
        'simple coloring pages',     // ✅ 核心关键词
        'kids coloring pages',       // ✅ 核心关键词
        'easy coloring book page',   // ✅ 语义匹配（单页）
        'beginner coloring pages',   // ✅ 语义相关（初学者）
      ],
      titleTemplate: '{title} - Easy Coloring Book Page for Kids',
      defaultTitleSuffix: 'Simple Design',
      descriptionTemplate: '{title} from our easy coloring book collection. {difficultyText}{ageText}. Simple {styleThemeText} design perfect for kids, toddlers, and beginners. Free printable download.',
      descriptionPrefix: 'Easy: ',
      dataSource: 'coloringPage',
      includeAttributes: true,
      contextKeywords: ['easy coloring book', 'easy coloring pages', 'simple coloring pages'],
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

