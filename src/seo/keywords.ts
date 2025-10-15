/**
 * SEO Keyword Source - Based on Semrush CSV Analysis
 * Data source: coloring-pages_broad-match_us_2025-08-07.csv (First 3000 rows)
 */

export interface KeywordSource {
  core: string[];
  seasonal: string[];
  animals: string[];
  characters: string[];
  fantasy: string[];
  education: string[];
  vehicles: string[];
  holidays: string[];
  modifiers: string[];
}

/**
 * High-volume keywords from CSV (Volume > 5K, KD < 45)
 */
export const KEYWORD_SOURCE: KeywordSource = {
  // Core universal keywords (always include 2-3)
  core: [
    'coloring pages',
    'printable coloring pages',
    'free coloring pages',
    'coloring pages for kids',
    'free printable',
    'easy coloring pages',
    'simple coloring pages',
    'cute coloring pages',
  ],

  // Seasonal keywords (rotate by month)
  seasonal: [
    'christmas coloring pages',      // Dec (60.5K)
    'halloween coloring pages',      // Oct (49.5K)
    'thanksgiving coloring pages',   // Nov (27.1K)
    'easter coloring pages',         // Mar-Apr (22.2K)
    'valentines day coloring pages', // Feb (9.9K)
    'winter coloring pages',         // Dec-Feb (12.1K)
    'fall coloring pages',           // Sep-Nov (22.2K)
    'spring coloring pages',         // Mar-May (22.2K)
    'summer coloring pages',         // Jun-Aug (22.2K)
    'st patricks day coloring pages',// Mar (5.4K)
    '4th of july coloring pages',    // Jul (5.4K)
    'back to school coloring pages', // Aug-Sep (4.4K)
  ],

  // Animal keywords (295+ variations in CSV)
  animals: [
    'cat coloring pages',            // 22.2K
    'dinosaur coloring pages',       // 22.2K
    'animal coloring pages',         // 14.8K
    'dog coloring pages',            // 14.8K
    'butterfly coloring pages',      // 14.8K
    'horse coloring pages',          // 9.9K
    'puppy coloring pages',          // 8.1K
    'kitten coloring pages',         // 8.1K
    'fox coloring pages',            // 5.4K
    'shark coloring pages',          // 5.4K
    'turtle coloring pages',         // 5.4K
    'bear coloring pages',           // 4.4K
    'wolf coloring pages',           // 5.4K
    'bird coloring pages',           // 4.4K
    'fish coloring pages',           // 2.9K
    'lion coloring pages',           // 4.4K
    'elephant coloring pages',       // 4.4K
    'frog coloring pages',           // 4.4K
    'bunny coloring pages',          // 5.4K
    'dolphin coloring pages',        // 3.6K
  ],

  // Character/IP keywords (341+ variations in CSV)
  characters: [
    'hello kitty coloring pages',    // 49.5K
    'bluey coloring pages',          // 40.5K
    'sonic coloring pages',          // 40.5K
    'pokemon coloring pages',        // 33.1K
    'spiderman coloring pages',      // 27.1K
    'mario coloring pages',          // 18.1K
    'disney coloring pages',         // 18.1K
    'barbie coloring pages',         // 14.8K
    'elsa coloring pages',           // 14.8K
    'mickey mouse coloring pages',   // 9.9K
    'minion coloring pages',         // 6.6K
    'peppa pig coloring pages',      // 6.6K
    'star wars coloring pages',      // 8.1K
    'toy story coloring pages',      // 5.4K
    'transformers coloring pages',   // 5.4K
    'my little pony coloring pages', // 9.9K
    'harry potter coloring pages',   // 8.1K
    'ninja turtles coloring pages',  // 5.4K
    'goku coloring pages',           // 5.4K
    'frozen coloring pages',         // 8.1K
    'moana coloring pages',          // 8.1K
    'disney princess coloring pages',// 9.9K
    'winnie the pooh coloring pages',// 6.6K
  ],

  // Fantasy/Princess keywords
  fantasy: [
    'unicorn coloring pages',        // 33.1K
    'princess coloring pages',       // 22.2K
    'mermaid coloring pages',        // 14.8K
    'mandala coloring pages',        // 18.1K
    'fairy coloring pages',          // 6.6K
  ],

  // Educational keywords
  education: [
    'abc coloring pages',            // 5.4K
    'alphabet coloring pages',       // 5.4K
    'number coloring pages',         // 5.4K
    'color by number coloring pages',// 5.4K
    'easy coloring pages',           // 18.1K
    'simple coloring pages',         // 12.1K
    'preschool coloring pages',      // 3.6K
    'toddler coloring pages',        // 3.6K
  ],

  // Vehicle keywords
  vehicles: [
    'car coloring pages',            // 12.1K
    'monster truck coloring pages',  // 9.9K
    'lightning mcqueen coloring page',// 8.1K
    'truck coloring pages',          // 4.4K
    'train coloring page',           // 2.9K
  ],

  // Holiday-specific (high seasonality)
  holidays: [
    'christmas coloring pages',      // 60.5K
    'halloween coloring pages',      // 49.5K
    'thanksgiving coloring pages',   // 27.1K
    'easter coloring pages',         // 22.2K
    'valentines day coloring pages', // 9.9K
  ],

  // Modifiers (combine with any keyword)
  modifiers: [
    'free',
    'printable',
    'for kids',
    'for adults',
    'easy',
    'simple',
    'cute',
    'fun',
  ],
};

/**
 * Get seasonal keywords based on current month
 */
export function getSeasonalKeywords(month?: number): string[] {
  const currentMonth = month || new Date().getMonth() + 1; // 1-12
  
  const seasonalMap: Record<number, string[]> = {
    1: ['winter coloring pages'],
    2: ['valentines day coloring pages', 'winter coloring pages'],
    3: ['spring coloring pages', 'easter coloring pages', 'st patricks day coloring pages'],
    4: ['spring coloring pages', 'easter coloring pages'],
    5: ['spring coloring pages'],
    6: ['summer coloring pages'],
    7: ['summer coloring pages', '4th of july coloring pages'],
    8: ['summer coloring pages', 'back to school coloring pages'],
    9: ['fall coloring pages', 'back to school coloring pages'],
    10: ['fall coloring pages', 'halloween coloring pages'],
    11: ['fall coloring pages', 'thanksgiving coloring pages'],
    12: ['winter coloring pages', 'christmas coloring pages'],
  };
  
  return seasonalMap[currentMonth] || [];
}

/**
 * Category to keyword mapping
 */
export const CATEGORY_KEYWORD_MAP: Record<string, string[]> = {
  // Animals
  'animals': ['animal coloring pages', 'cat coloring pages', 'dog coloring pages', 'dinosaur coloring pages'],
  'cat': ['cat coloring pages', 'kitten coloring pages', 'kitty coloring pages'],
  'dog': ['dog coloring pages', 'puppy coloring pages'],
  'dinosaur': ['dinosaur coloring pages', 't rex coloring page'],
  'butterfly': ['butterfly coloring pages'],
  'horse': ['horse coloring pages'],
  'fox': ['fox coloring pages'],
  'shark': ['shark coloring pages'],
  'turtle': ['turtle coloring pages'],
  'bear': ['bear coloring pages'],
  'wolf': ['wolf coloring pages'],
  
  // Characters
  'hello-kitty': ['hello kitty coloring pages'],
  'bluey': ['bluey coloring pages'],
  'sonic': ['sonic coloring pages', 'sonic the hedgehog coloring pages'],
  'pokemon': ['pokemon coloring pages', 'pikachu coloring pages'],
  'spiderman': ['spiderman coloring pages', 'spider man coloring pages'],
  'mario': ['mario coloring pages', 'super mario coloring pages'],
  'disney': ['disney coloring pages', 'disney princess coloring pages'],
  'barbie': ['barbie coloring pages'],
  'elsa': ['elsa coloring pages', 'frozen coloring pages'],
  'mickey-mouse': ['mickey mouse coloring pages'],
  
  // Fantasy
  'unicorn': ['unicorn coloring pages'],
  'princess': ['princess coloring pages', 'disney princess coloring pages'],
  'mermaid': ['mermaid coloring pages', 'ariel coloring pages'],
  'mandala': ['mandala coloring pages'],
  
  // Educational
  'abc': ['abc coloring pages', 'alphabet coloring pages'],
  'alphabet': ['alphabet coloring pages', 'letter coloring pages'],
  'numbers': ['number coloring pages'],
  
  // Vehicles
  'car': ['car coloring pages'],
  'truck': ['truck coloring pages', 'monster truck coloring pages'],
  
  // Default fallback
  'default': ['coloring pages', 'free coloring pages', 'printable coloring pages'],
};

