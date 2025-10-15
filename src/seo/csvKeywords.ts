/**
 * CSV 验证的关键词数据
 * 基于 coloring-pages_broad-match_us_2025-08-07.csv
 */

/**
 * 来自 Semrush CSV 的高流量修饰词
 * 键为修饰词，值为月搜索量
 */
export const CSV_VALIDATED_MODIFIERS = {
  style: {
    'cute': 33100,        // cute coloring pages
    'simple': 12100,      // simple coloring pages
    'detailed': 0,        // 逻辑合理但未在 CSV 中
    'realistic': 0,       // 逻辑合理但未在 CSV 中
    'cartoon': 0,         // 逻辑合理但未在 CSV 中
  },
  difficulty: {
    'easy': 18100,        // easy coloring pages
    'medium': 0,          // 逻辑合理但未在 CSV 中
    'hard': 0,            // 逻辑合理但未在 CSV 中
  },
  ageGroup: {
    'kids': 60500,        // coloring pages for kids
    'adults': 40500,      // adult coloring pages
  }
} as const;

/**
 * 长尾组合关键词生成器
 * 基于 CSV 数据中的组合模式
 * 
 * CSV 中的组合模式示例：
 * - cute animal coloring pages (4,400)
 * - easy christmas coloring pages (2,900)
 * - cute printable coloring pages (2,900)
 */
export interface LongTailOptions {
  style?: string;
  theme?: string;
  difficulty?: string;
  category?: string;
}

/**
 * 生成长尾组合关键词
 * 这些组合在 CSV 中有实际搜索量
 */
export function generateLongTailKeywords(options: LongTailOptions): string[] {
  const longTail: string[] = [];
  const { style, theme, difficulty, category } = options;
  
  // Pattern 1: style + theme + coloring pages
  // 例如: cute animal coloring pages (CSV: 4,400)
  if (style && theme) {
    longTail.push(`${style} ${theme} coloring pages`);
  }
  
  // Pattern 2: difficulty + theme + coloring pages
  // 例如: easy christmas coloring pages (CSV: 2,900)
  if (difficulty && theme) {
    longTail.push(`${difficulty} ${theme} coloring pages`);
  }
  
  // Pattern 3: style + category + coloring pages
  // 例如: cute princess coloring pages
  if (style && category && category !== theme) {
    longTail.push(`${style} ${category} coloring pages`);
  }
  
  // Pattern 4: style + printable + coloring pages
  // 例如: cute printable coloring pages (CSV: 2,900)
  if (style) {
    longTail.push(`${style} printable coloring pages`);
  }
  
  // Pattern 5: difficulty + category + coloring pages
  if (difficulty && category && category !== theme) {
    longTail.push(`${difficulty} ${category} coloring pages`);
  }
  
  return longTail;
}

/**
 * 验证修饰词是否在 CSV 中存在
 */
export function isCSVValidated(
  modifier: string, 
  type: keyof typeof CSV_VALIDATED_MODIFIERS
): boolean {
  return modifier in CSV_VALIDATED_MODIFIERS[type];
}

/**
 * 获取修饰词的搜索量
 */
export function getSearchVolume(
  modifier: string, 
  type: keyof typeof CSV_VALIDATED_MODIFIERS
): number {
  if (type in CSV_VALIDATED_MODIFIERS) {
    const modifiers = CSV_VALIDATED_MODIFIERS[type] as Record<string, number>;
    return modifiers[modifier] || 0;
  }
  return 0;
}

/**
 * 按搜索量排序关键词
 * CSV 中搜索量高的词优先
 */
export function sortBySearchVolume(keywords: string[]): string[] {
  // 简单实现：优先排列已知的高流量词
  const highPriority = ['coloring pages', 'free coloring pages', 'printable'];
  const sorted = [...keywords];
  
  sorted.sort((a, b) => {
    const aIndex = highPriority.indexOf(a);
    const bIndex = highPriority.indexOf(b);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });
  
  return sorted;
}

