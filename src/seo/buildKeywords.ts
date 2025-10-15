import { KEYWORD_SOURCE, getSeasonalKeywords, CATEGORY_KEYWORD_MAP, KeywordSource } from './keywords';

export interface PageContext {
  type: 'home' | 'list' | 'detail' | 'search' | 'popular' | 'latest' | 'theme-parks' | 'first-coloring-book' | 'ai-generator' | 'blog' | 'categories-index';
  category?: string;
  title?: string;
  q?: string;
  month?: number;
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
 */
function getCategoryKeywords(category: string): string[] {
  const normalized = category.toLowerCase();
  
  // Direct match
  if (CATEGORY_KEYWORD_MAP[normalized]) {
    return CATEGORY_KEYWORD_MAP[normalized];
  }
  
  // Fuzzy match for animals
  const animalPatterns = /animal|cat|dog|dinosaur|butterfly|horse|wolf|fox|shark|turtle|bear|puppy|kitten|bird|fish|lion|elephant|frog|bunny|dolphin/i;
  if (animalPatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.animals, 6);
  }
  
  // Fuzzy match for characters
  const characterPatterns = /disney|mickey|princess|frozen|moana|star-wars|toy-story|harry|pokemon|sonic|mario|minion|barbie|bluey|peppa|my-little-pony|ninja|goku|hello-kitty|spiderman/i;
  if (characterPatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.characters, 6);
  }
  
  // Fuzzy match for fantasy
  const fantasyPatterns = /unicorn|mermaid|princess|mandala|fairy/i;
  if (fantasyPatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.fantasy, 4);
  }
  
  // Fuzzy match for education
  const educationPatterns = /abc|alphabet|number|first-coloring-book|kids|easy|simple|preschool|toddler/i;
  if (educationPatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.education, 5);
  }
  
  // Fuzzy match for vehicles
  const vehiclePatterns = /car|truck|mcqueen|vehicle|train/i;
  if (vehiclePatterns.test(category)) {
    return pickTop(KEYWORD_SOURCE.vehicles, 3);
  }
  
  // Default fallback
  return CATEGORY_KEYWORD_MAP['default'] || [];
}

/**
 * Build keywords for a specific page
 * Returns array of keywords optimized for SEO
 * 
 * Strategy: Progressive Enhancement (渐进式增强)
 * = Core Keywords (30%) + Category Keywords (40%) + Seasonal (10%) + Backend Additional (20%)
 */
export function buildKeywordsForPage(
  context: PageContext, 
  customSource?: KeywordSource,
  backendData?: {
    additionalKeywords?: string[];  // Extra keywords from backend
    keywordPriority?: number;       // Priority 1-10
  }
): string[] {
  const source = customSource || KEYWORD_SOURCE;
  const keywords: string[] = [];
  
  // 1. Core Keywords (Always include - 30% weight)
  // These provide consistency across all category pages
  const coreKeywords = pickTop(source.core, 3);
  keywords.push(...coreKeywords);
  
  // 2. Seasonal Keywords (Based on month - 10% weight)
  const seasonalKeywords = getSeasonalKeywords(context.month);
  keywords.push(...pickTop(seasonalKeywords, 1));
  
  // 3. Category-Specific Keywords (40% weight)
  // These are automatically generated based on category
  let categoryKeywords: string[] = [];
  
  switch (context.type) {
    case 'home':
      // Homepage: mix of high-volume keywords
      categoryKeywords = [
        ...pickTop(source.core, 2),
        ...pickTop(source.holidays, 2),
        ...pickTop(source.animals, 2),
        ...pickTop(source.characters, 2),
      ];
      break;
      
    case 'categories-index':
      // Categories index page: mix of all categories
      categoryKeywords = [
        'animal coloring pages',
        'cat coloring pages',
        'dog coloring pages',
        'disney coloring pages',
        'princess coloring pages',
        ...pickTop(source.modifiers, 1),
      ];
      break;
      
    case 'list':
      // List pages: category-specific keywords
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords = [
          ...pickTop(specificKeywords, 4),
          `${normalizeCategory(context.category)} coloring pages`,
          ...pickTop(source.modifiers, 1),
        ];
      }
      break;
      
    case 'detail':
      // Detail pages: title + category keywords
      if (context.title) {
        categoryKeywords = [
          context.title,
          `${context.title} coloring page`,
        ];
      }
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords.push(
          `${normalizeCategory(context.category)} coloring pages`,
          ...pickTop(specificKeywords, 2),
          'printable',
          'free',
        );
      }
      break;
      
    case 'search':
      // Search pages: query + general keywords
      if (context.q) {
        categoryKeywords = [`${context.q} coloring pages`, context.q];
      }
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords.push(...pickTop(specificKeywords, 2));
      }
      categoryKeywords.push('search coloring pages');
      break;
      
    case 'popular':
      // Popular pages: trending keywords
      categoryKeywords = ['popular coloring pages', ...pickTop(source.characters, 3)];
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords.push(...pickTop(specificKeywords, 2));
      }
      break;
      
    case 'latest':
      // Latest pages: new keywords
      categoryKeywords = ['latest coloring pages', 'new coloring pages'];
      if (context.category) {
        const specificKeywords = getCategoryKeywords(context.category);
        categoryKeywords.push(...pickTop(specificKeywords, 2));
      }
      break;
      
    case 'theme-parks':
      // Theme parks: character IP keywords
      categoryKeywords = ['theme park coloring pages', ...pickTop(source.characters, 4)];
      break;
      
    case 'first-coloring-book':
      // First coloring book: educational keywords
      categoryKeywords = ['first coloring book', ...pickTop(source.education, 5)];
      break;
      
    case 'ai-generator':
      // AI generator: innovation keywords
      categoryKeywords = [
        'ai coloring pages',
        'ai generator',
        'custom coloring pages',
        'personalized printables',
      ];
      break;
      
    case 'blog':
      // Blog: content marketing keywords
      categoryKeywords = [
        'coloring tips',
        'coloring techniques',
        'art tips',
        'creative ideas',
      ];
      break;
  }
  
  keywords.push(...categoryKeywords);
  
  // 4. Backend Additional Keywords (20% weight - if provided)
  // These are extra keywords from backend for specific categories
  if (backendData?.additionalKeywords && backendData.additionalKeywords.length > 0) {
    keywords.push(...pickTop(backendData.additionalKeywords, 3));
  }
  
  // 5. Remove duplicates and limit to 12 keywords
  const uniqueKeywords = Array.from(new Set(keywords));
  return uniqueKeywords.slice(0, 12);
}

/**
 * Build title for a page
 */
export function buildTitle(context: PageContext, customTitle?: string): string {
  if (customTitle) return customTitle;
  
  const siteName = 'Coloring Pages';
  
  switch (context.type) {
    case 'home':
      return `Free Printable Coloring Pages for Kids & Adults | ${siteName}`;
      
    case 'categories-index':
      return `Browse All Coloring Page Categories - Animals, Characters & More`;
      
    case 'list':
      if (context.category) {
        const displayName = normalizeCategory(context.category);
        return `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} Coloring Pages - Free Printable | ${siteName}`;
      }
      return `Browse Coloring Pages | ${siteName}`;
      
    case 'detail':
      if (context.title && context.category) {
        const displayCategory = normalizeCategory(context.category);
        return `${context.title} - ${displayCategory} Coloring Page | Free Printable`;
      }
      return `Coloring Page | ${siteName}`;
      
    case 'search':
      if (context.q) {
        return `"${context.q}" Coloring Pages - Search Results | ${siteName}`;
      }
      return `Search Free Coloring Pages | ${siteName}`;
      
    case 'popular':
      return `Popular Coloring Pages - Most Downloaded Free Printables | ${siteName}`;
      
    case 'latest':
      return `Latest Coloring Pages - New Free Printable Sheets | ${siteName}`;
      
    case 'theme-parks':
      return `Theme Park Coloring Pages - Disney, Characters & More | ${siteName}`;
      
    case 'first-coloring-book':
      return `First Coloring Book - Easy Coloring Pages for Beginners | ${siteName}`;
      
    case 'ai-generator':
      return `AI Coloring Page Generator - Create Custom Printable Sheets | ${siteName}`;
      
    case 'blog':
      return `Coloring Tips & Creative Ideas - Blog | ${siteName}`;
      
    default:
      return siteName;
  }
}

/**
 * Build description for a page with optional highlight phrase insertion
 * 
 * @param context - Page context
 * @param customDescription - Full custom description (overrides all)
 * @param highlightPhrase - Phrase to insert in the middle (progressive enhancement)
 */
export function buildDescription(
  context: PageContext, 
  customDescription?: string,
  highlightPhrase?: string
): string {
  if (customDescription) return customDescription;
  
  switch (context.type) {
    case 'home':
      return 'Browse 10,000+ free printable coloring pages for kids and adults. Animals, characters, holidays, and more. Download high-quality sheets instantly.';
      
    case 'categories-index':
      return 'Explore coloring page categories: Animals (Cat, Dog, Dinosaur), Characters (Hello Kitty, Pokemon, Disney), Holidays, and more. Free printable downloads.';
      
    case 'list':
      if (context.category) {
        const displayName = normalizeCategory(context.category);
        let desc = `Browse free printable ${displayName} coloring pages. `;
        
        // Insert highlight phrase if provided (progressive enhancement)
        if (highlightPhrase) {
          desc += `${highlightPhrase}. `;
        } else {
          desc += 'High-quality sheets ';
        }
        
        desc += 'for kids and adults. Download instantly.';
        return desc;
      }
      return 'Browse thousands of free printable coloring pages. High-quality sheets for all ages.';
      
    case 'detail':
      if (context.title) {
        return `Download and print ${context.title}. Perfect for kids activities. Free high-quality coloring page.`;
      }
      return 'Download and print this free coloring page. Perfect for kids activities.';
      
    case 'search':
      if (context.q) {
        return `Search results for "${context.q}" coloring pages. Free printable downloads for kids and adults.`;
      }
      return 'Search 10,000+ coloring pages by keyword: Christmas, Halloween, Animals, Characters, and more. Free printable downloads.';
      
    case 'popular':
      return 'Browse the most popular coloring pages: Hello Kitty, Pokemon, Disney characters, Animals and more. Top downloads updated daily.';
      
    case 'latest':
      return 'Discover the newest coloring pages added daily. Fresh designs featuring animals, characters, holidays and more. Free printable downloads.';
      
    case 'theme-parks':
      return 'Explore theme park coloring pages featuring Disney characters, princesses, and popular attractions. Free printable downloads for kids.';
      
    case 'first-coloring-book':
      return 'Perfect first coloring book with easy, simple designs for young children. ABC, numbers, and basic shapes. Free printable pages.';
      
    case 'ai-generator':
      return 'Generate personalized coloring pages with AI. Type any prompt to create unique printable coloring sheets. Free custom designs for kids and adults.';
      
    case 'blog':
      return 'Discover coloring tips, techniques, and creative ideas. Learn about color theory, art supplies, and fun activities for kids and adults.';
      
    default:
      return 'Free printable coloring pages for kids and adults.';
  }
}

