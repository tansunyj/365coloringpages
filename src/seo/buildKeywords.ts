import { KEYWORD_SOURCE, getSeasonalKeywords, CATEGORY_KEYWORD_MAP, KeywordSource } from './keywords';

/**
 * Page Context - 基于 PUBLIC_PAGES_ANALYSIS.md 文档定义
 */
export interface PageContext {
  type: 'home' | 'list' | 'detail' | 'search' | 'popular' | 'latest' | 'theme-parks' | 'first-coloring-book' | 'ai-generator' | 'blog' | 'categories-index';
  category?: string;
  title?: string;
  q?: string;
  month?: number;
}

/**
 * 详细的关键词构建参数（用于 SEO Generator）
 */
export interface DetailedKeywordParams {
  baseKeywords?: string[];
  categoryKeywords?: string[];
  attributeKeywords?: string[];
  additionalKeywords?: string[];
  limit?: number;
}

/**
 * Title 构建参数
 */
export interface TitleParams {
  main: string;
  suffix?: string;
}

/**
 * Description 构建参数
 */
export interface DescriptionParams {
  main: string;
  highlightPhrase?: string;
  maxLength?: number;
}

/**
 * Pick top N items from array
 */
function pickTop<T>(arr: T[], n: number): T[] {
  return arr.slice(0, Math.min(n, arr.length));
}

/**
 * Normalize category slug for keyword matching
 */
function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/-/g, ' ');
}

/**
 * Get category-specific keywords
 * 基于 PUBLIC_PAGES_ANALYSIS.md 中的 CATEGORY_KEYWORD_MAP
 */
function getCategoryKeywords(category: string): string[] {
  const normalized = category.toLowerCase();
  
  // Direct match from CATEGORY_KEYWORD_MAP
  if (CATEGORY_KEYWORD_MAP[normalized]) {
    return CATEGORY_KEYWORD_MAP[normalized];
  }
  
  // Fuzzy match for animals (295+ keywords in CSV)
  const animalPatterns = /animal|cat|dog|dinosaur|butterfly|horse|wolf|fox|shark|turtle|bear|puppy|kitten|bird|fish|lion|elephant|frog|bunny|dolphin/i;
  if (animalPatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.animals, 6);
  }
  
  // Fuzzy match for characters (341+ keywords in CSV)
  const characterPatterns = /disney|mickey|princess|frozen|moana|star-wars|toy-story|harry|pokemon|sonic|mario|minion|barbie|bluey|peppa|my-little-pony|ninja|goku|hello-kitty|spiderman/i;
  if (characterPatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.characters, 6);
  }
  
  // Fuzzy match for fantasy (92+ keywords in CSV)
  const fantasyPatterns = /unicorn|mermaid|princess|mandala|fairy/i;
  if (fantasyPatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.fantasy, 4);
  }
  
  // Fuzzy match for education (70+ keywords in CSV)
  const educationPatterns = /abc|alphabet|number|first-coloring-book|kids|easy|simple|preschool|toddler/i;
  if (educationPatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.education, 5);
  }
  
  // Fuzzy match for vehicles (68+ keywords in CSV)
  const vehiclePatterns = /car|truck|mcqueen|vehicle|train/i;
  if (vehiclePatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.vehicles, 3);
  }
  
  // Default fallback
  return CATEGORY_KEYWORD_MAP['default'] || [];
}

/**
 * Build keywords for a specific page (重载 1: PageContext 方式)
 * 基于 PUBLIC_PAGES_ANALYSIS.md 文档 (450-513 行)
 * 
 * Strategy: Progressive Enhancement (渐进式增强)
 * = Core Keywords (30%) + Seasonal (10%) + Category Keywords (40%) + Backend Additional (20%)
 * 
 * @param context - 页面上下文
 * @param customSource - 自定义关键词源（可选）
 * @returns 优化后的关键词数组（最多 12-15 个）
 */
export function buildKeywordsForPage(context: PageContext, customSource?: KeywordSource): string[];

/**
 * Build keywords for a specific page (重载 2: 详细参数方式)
 * 用于 SEO Generator 的灵活调用
 * 
 * @param params - 详细的关键词参数
 * @returns 优化后的关键词数组
 */
export function buildKeywordsForPage(params: DetailedKeywordParams): string[];

/**
 * Build keywords for a specific page (实现)
 */
export function buildKeywordsForPage(
  contextOrParams: PageContext | DetailedKeywordParams,
  customSource?: KeywordSource
): string[] {
  // 判断调用方式
  if ('baseKeywords' in contextOrParams || 'categoryKeywords' in contextOrParams) {
    // DetailedKeywordParams 方式调用
    return buildDetailedKeywords(contextOrParams as DetailedKeywordParams);
  } else {
    // PageContext 方式调用
    return buildContextKeywords(contextOrParams as PageContext, customSource);
  }
}

/**
 * 基于详细参数构建关键词
 */
function buildDetailedKeywords(params: DetailedKeywordParams): string[] {
  const {
    baseKeywords = [],
    categoryKeywords = [],
    attributeKeywords = [],
    additionalKeywords = [],
    limit = 12,
  } = params;
  
  const keywords: string[] = [];
  
  // 1. Base keywords (包含 core + context)
  keywords.push(...baseKeywords);
  
  // 2. Category-specific keywords
  keywords.push(...categoryKeywords);
  
  // 3. Attribute keywords (从详情页面提取)
  keywords.push(...attributeKeywords);
  
  // 4. Additional keywords from backend
  keywords.push(...pickTop(additionalKeywords, 3));
  
  // 5. Remove duplicates and limit
  const uniqueKeywords = Array.from(new Set(keywords));
  return uniqueKeywords.slice(0, limit);
}

/**
 * 基于页面上下文构建关键词
 * 实现 PUBLIC_PAGES_ANALYSIS.md 中的关键词生成逻辑
 */
function buildContextKeywords(context: PageContext, customSource?: KeywordSource): string[] {
  const source = customSource || KEYWORD_SOURCE;
  const keywords: string[] = [];
  
  // 1. Core Keywords (Always include - 30% weight)
  // 始终包含超高流量核心词
  keywords.push(...pickTop(source.core, context.type === 'home' ? 5 : 3));
  
  // 2. Seasonal Keywords (Based on month - 10% weight)
  // 按月份动态调整季节关键词
  const seasonalKeywords = getSeasonalKeywords(context.month);
  keywords.push(...pickTop(seasonalKeywords, context.type === 'home' ? 2 : 1));
  
  // 3. Category-Specific Keywords (40% weight)
  // 基于分类的主题词集
  let categoryKeywords: string[] = [];
  
  switch (context.type) {
    case 'home':
      // Homepage: mix of high-volume keywords
      categoryKeywords = [
        ...pickTop(source.holidays, 2),
        ...pickTop(source.animals, 2),
        ...pickTop(source.characters, 2),
      ];
      break;
      
    case 'categories-index':
      // Categories index: mix of all categories
      categoryKeywords = [
        'animal coloring pages',
        'cat coloring pages',
        'dog coloring pages',
        'disney coloring pages',
        'princess coloring pages',
      ];
      break;
      
    case 'list':
      // List pages: category-specific keywords + modifiers
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords = [
          `${normalizeCategory(context.category)} coloring pages`,
          ...pickTop(specificKeywords, 4),
        ];
        // Add modifiers
        keywords.push(...pickTop(source.modifiers.slice(0, 3), 2));
      }
      break;
      
    case 'detail':
      // Detail pages: title + category + modifiers
      if (context.title) {
        categoryKeywords.push(
          context.title,
          `${context.title} coloring page`
        );
      }
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords.push(
          `${normalizeCategory(context.category)} coloring pages`,
          ...pickTop(specificKeywords, 2)
        );
      }
      // Add essential modifiers
      keywords.push('printable', 'free', 'for kids');
      break;
      
    case 'search':
      // Search pages: query + category + search keywords
      if (context.q) {
        categoryKeywords.push(`${context.q} coloring pages`, context.q);
      }
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords.push(...pickTop(specificKeywords, 3));
      }
      categoryKeywords.push('search coloring pages');
      break;
      
    case 'popular':
      // Popular pages: trending + high-volume characters
      categoryKeywords.push('popular coloring pages');
      categoryKeywords.push(...pickTop(source.characters, 4));
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords.push(...pickTop(specificKeywords, 3));
      }
      break;
      
    case 'latest':
      // Latest pages: new + fresh keywords
      categoryKeywords.push('latest coloring pages', 'new coloring pages');
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords.push(...pickTop(specificKeywords, 3));
      }
      break;
      
    case 'theme-parks':
      // Theme parks: theme park + character IP keywords
      categoryKeywords.push('theme park coloring pages');
      categoryKeywords.push(...pickTop(source.themeParks, 2));
      categoryKeywords.push(...pickTop(source.characters, 5));
      break;
      
    case 'first-coloring-book':
      // First coloring book: educational keywords
      categoryKeywords.push('first coloring book');
      categoryKeywords.push(...pickTop(source.education, 6));
      break;
      
    case 'ai-generator':
      // AI generator: innovation keywords
      categoryKeywords.push(
        'ai coloring pages',
        'ai generator',
        'custom coloring pages',
        'personalized printables',
        'ai coloring generator'
      );
      break;
      
    case 'blog':
      // Blog: content marketing keywords
      categoryKeywords.push(
        'coloring tips',
        'coloring techniques',
        'art tips',
        'creative ideas',
        'coloring blog'
      );
      break;
  }
  
  keywords.push(...categoryKeywords);
  
  // 4. Add medium-volume保底词 for non-detail pages
  if (context.type !== 'detail') {
    // 从 CSV 中流量保底词中选择 2 个
    keywords.push(...pickTop([
      'free printable coloring pages',
      'flower coloring pages',
      'cat coloring pages',
    ], 2));
  }
  
  // 5. Remove duplicates and limit to 12-15 keywords
  const uniqueKeywords = Array.from(new Set(keywords));
  const limit = context.type === 'home' ? 15 : 12;
  return uniqueKeywords.slice(0, limit);
}

/**
 * Build title for a page (重载 1: PageContext 方式)
 * 基于 PUBLIC_PAGES_ANALYSIS.md 文档 (1432-1484 行)
 * 
 * @param context - 页面上下文
 * @param customTitle - 自定义标题（可选，直接覆盖）
 * @returns 优化后的标题
 */
export function buildTitle(context: PageContext, customTitle?: string): string;

/**
 * Build title for a page (重载 2: 结构化参数方式)
 * 
 * @param params - 标题参数
 * @returns 构建的标题
 */
export function buildTitle(params: TitleParams): string;

/**
 * Build title for a page (实现)
 */
export function buildTitle(
  contextOrParams: PageContext | TitleParams,
  customTitle?: string
): string {
  // 判断调用方式
  if ('main' in contextOrParams) {
    // TitleParams 方式调用
    const { main, suffix } = contextOrParams;
    return suffix ? `${main} - ${suffix}` : main;
  } else {
    // PageContext 方式调用
    return buildContextTitle(contextOrParams, customTitle);
  }
}

/**
 * 基于页面上下文构建标题
 * 实现 PUBLIC_PAGES_ANALYSIS.md 中的标题生成逻辑
 */
function buildContextTitle(context: PageContext, customTitle?: string): string {
  if (customTitle) return customTitle;
  
  const siteName = 'Coloring Pages';
  
  switch (context.type) {
    case 'home':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 631 行
      return `Free Printable Coloring Pages for Kids & Adults | ${siteName}`;
      
    case 'categories-index':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 675 行
      return `Browse All Coloring Page Categories - Animals, Characters & More`;
      
    case 'list':
      if (context.category) {
        const displayName = normalizeCategory(context.category);
        const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        // 基于 PUBLIC_PAGES_ANALYSIS.md 第 737 行
        return `${capitalizedName} Coloring Pages - Free Printable | ${siteName}`;
      }
      return `Browse Coloring Pages | ${siteName}`;
      
    case 'detail':
      if (context.title && context.category) {
        const displayCategory = normalizeCategory(context.category);
        const capitalizedCategory = displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1);
        // 基于 PUBLIC_PAGES_ANALYSIS.md 第 787 行
        return `${context.title} - ${capitalizedCategory} Coloring Page | Free Printable`;
      }
      return `Coloring Page | ${siteName}`;
      
    case 'search':
      if (context.q) {
        // 基于 PUBLIC_PAGES_ANALYSIS.md 第 842 行
        return `"${context.q}" Coloring Pages - Search Results | ${siteName}`;
      }
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 823 行
      return `Search Free Coloring Pages - Find Your Perfect Printable`;
      
    case 'popular':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 871 行
      return `Popular Coloring Pages - Most Downloaded Free Printables | ${siteName}`;
      
    case 'latest':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 877 行
      return `Latest Coloring Pages - New Free Printable Sheets | ${siteName}`;
      
    case 'theme-parks':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 883 行
      return `Theme Park Coloring Pages - Disney, Characters & More | ${siteName}`;
      
    case 'first-coloring-book':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 889 行
      return `First Coloring Book - Easy Coloring Pages for Beginners | ${siteName}`;
      
    case 'ai-generator':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 950 行
      return `AI Coloring Page Generator - Create Custom Printable Sheets | ${siteName}`;
      
    case 'blog':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 972 行
      return `Coloring Tips & Creative Ideas - Blog | ${siteName}`;
      
    default:
      return siteName;
  }
}

/**
 * Build description for a page (重载 1: PageContext 方式)
 * 基于 PUBLIC_PAGES_ANALYSIS.md 文档 (1486-1537 行)
 * 
 * @param context - 页面上下文
 * @param customDescription - 自定义描述（可选，直接覆盖）
 * @param highlightPhrase - 高亮短语（可选，用于渐进式增强）
 * @returns 优化后的描述
 */
export function buildDescription(
  context: PageContext, 
  customDescription?: string,
  highlightPhrase?: string
): string;

/**
 * Build description for a page (重载 2: 结构化参数方式)
 * 
 * @param params - 描述参数
 * @returns 构建的描述
 */
export function buildDescription(params: DescriptionParams): string;

/**
 * Build description for a page (实现)
 */
export function buildDescription(
  contextOrParams: PageContext | DescriptionParams,
  customDescription?: string,
  highlightPhrase?: string
): string {
  // 判断调用方式
  if ('main' in contextOrParams) {
    // DescriptionParams 方式调用
    const { main, highlightPhrase: phrase, maxLength = 160 } = contextOrParams;
    
    let desc = main;
    
    // 插入高亮短语（渐进式增强）
    if (phrase) {
      // 如果有句号，在句号前插入
      const firstPeriod = desc.indexOf('.');
      if (firstPeriod !== -1) {
        desc = desc.substring(0, firstPeriod) + `. ${phrase}` + desc.substring(firstPeriod);
      } else {
        desc = `${desc} ${phrase}`;
      }
    }
    
    // 确保长度合适
    if (desc.length > maxLength) {
      desc = desc.substring(0, maxLength - 3) + '...';
    }
    
    return desc;
  } else {
    // PageContext 方式调用
    return buildContextDescription(contextOrParams, customDescription, highlightPhrase);
  }
}

/**
 * 基于页面上下文构建描述
 * 实现 PUBLIC_PAGES_ANALYSIS.md 中的描述生成逻辑
 */
function buildContextDescription(
  context: PageContext, 
  customDescription?: string,
  highlightPhrase?: string
): string {
  if (customDescription) return customDescription;
  
  switch (context.type) {
    case 'home':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 653 行
      return 'Browse 10,000+ free printable coloring pages for kids and adults. Animals, characters, holidays, and more. Download high-quality sheets instantly.';
      
    case 'categories-index':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 689 行
      return 'Explore coloring page categories: Animals (Cat, Dog, Dinosaur), Characters (Hello Kitty, Pokemon, Disney), Holidays, and more. Free printable downloads.';
      
    case 'list':
      if (context.category) {
        const displayName = normalizeCategory(context.category);
        // 基于 PUBLIC_PAGES_ANALYSIS.md 第 739 行
        let desc = `Browse free printable ${displayName} coloring pages. `;
        
        // Progressive enhancement: 插入高亮短语
        if (highlightPhrase) {
          desc += `${highlightPhrase} `;
        }
        
        desc += 'High-quality sheets for kids and adults. Download instantly.';
        return desc;
      }
      return 'Browse thousands of free printable coloring pages. High-quality sheets for all ages.';
      
    case 'detail':
      if (context.title) {
        // 基于 PUBLIC_PAGES_ANALYSIS.md 第 788 行
        return `Download and print ${context.title}. Perfect for kids activities. Free high-quality coloring page.`;
      }
      return 'Download and print this free coloring page. Perfect for kids activities.';
      
    case 'search':
      if (context.q) {
        // 基于 PUBLIC_PAGES_ANALYSIS.md 第 847 行
        return `Search results for "${context.q}" coloring pages. Free printable downloads for kids and adults.`;
      }
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 825 行
      return 'Search 10,000+ coloring pages by keyword: Christmas, Halloween, Animals, Characters, and more. Free printable downloads for kids and adults.';
      
    case 'popular':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 873 行
      return 'Browse the most popular coloring pages: Hello Kitty, Pokemon, Bluey, Disney characters, Animals and more. Top downloads updated daily.';
      
    case 'latest':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 878 行
      return 'Discover the newest coloring pages added daily. Fresh designs featuring animals, characters, holidays and more. Free printable downloads.';
      
    case 'theme-parks':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 884 行
      return 'Explore theme park coloring pages featuring Disney characters, Mickey Mouse, princesses, and popular attractions. Free printable downloads for kids.';
      
    case 'first-coloring-book':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 890 行
      return 'Perfect first coloring book with easy, simple designs for young children. ABC, numbers, and basic shapes. Free printable pages.';
      
    case 'ai-generator':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 952 行
      return 'Use AI to generate personalized coloring pages from text prompts. Create unique designs featuring animals, characters, or any theme. Download and print instantly.';
      
    case 'blog':
      // 基于 PUBLIC_PAGES_ANALYSIS.md 第 973 行
      return 'Discover coloring tips, techniques, and creative ideas. Learn about popular themes: Christmas, Halloween, Animals, Disney characters. Fun activities for kids and adults.';
      
    default:
      return 'Free printable coloring pages for kids and adults.';
  }
}

