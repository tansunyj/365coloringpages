/**
 * SEO 数据获取器
 * 统一的 API 调用和数据处理逻辑
 */

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  additionalKeywords?: string[];
  highlightPhrase?: string;
  customTitleSuffix?: string;
}

export interface ColoringPageData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  previewUrl?: string;
  theme?: string;
  style?: string;
  difficulty?: string;
  ageRange?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ThemeParkData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  additionalKeywords?: string[];
  highlightPhrase?: string;
  customTitleSuffix?: string;
}

export interface ColoringBookData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  additionalKeywords?: string[];
  highlightPhrase?: string;
  customTitleSuffix?: string;
}

/**
 * 数据获取器类
 */
export class SEODataFetcher {
  private apiBase: string;
  private isDev: boolean;

  constructor() {
    this.apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    this.isDev = process.env.NODE_ENV === 'development';
  }

  /**
   * 获取分类数据
   * ✅ 从 /api/categories/list 获取所有分类，然后根据 slug 查找
   */
  async fetchCategory(slug: string): Promise<CategoryData | null> {
    const apiUrl = `${this.apiBase}/api/categories/list`;
    
    if (this.isDev) {
      console.log(`[SEO Data] Fetching categories list to find: ${slug}`);
    }

    try {
      // 开发环境不缓存，生产环境缓存1小时
      const fetchOptions = this.isDev 
        ? { cache: 'no-store' as RequestCache }
        : { next: { revalidate: 3600 } };
      
      const response = await fetch(apiUrl, fetchOptions);

      if (response.ok) {
        const data = await response.json();
        const categories = data.data || [];
        
        // ✅ 从列表中查找匹配的分类
        const category = categories.find((cat: any) => cat.slug === slug);
        
        if (this.isDev) {
          if (category) {
            console.log(`[SEO Data] Category found: ${category.name}`);
            console.log(`[SEO Data] SEO fields:`, {
              seoTitle: category.seoTitle,
              seoDescription: category.seoDescription,
            });
          } else {
            console.warn(`[SEO Data] Category not found for slug: ${slug}`);
          }
        }
        
        return category || null;
      } else {
        if (this.isDev) {
          console.warn(`[SEO Data] Categories list API returned ${response.status}`);
        }
        return null;
      }
    } catch (error) {
      if (this.isDev) {
        console.error(`[SEO Data] Categories list error:`, error);
      }
      return null;
    }
  }

  /**
   * 获取涂色页面数据
   */
  async fetchColoringPage(id: string): Promise<ColoringPageData | null> {
    const apiUrl = `${this.apiBase}/api/coloring-pages/${id}`;
    
    if (this.isDev) {
      console.log(`[SEO Data] Fetching coloring page: ${apiUrl}`);
    }

    try {
      // 开发环境不缓存，生产环境缓存1小时
      const fetchOptions = this.isDev 
        ? { cache: 'no-store' as RequestCache }
        : { next: { revalidate: 3600 } };
      
      const response = await fetch(apiUrl, fetchOptions);

      if (response.ok) {
        const data = await response.json();
        const page = data.data;
        
        if (this.isDev) {
          console.log(`[SEO Data] Coloring page success: ${page?.title}`);
        }
        
        return page;
      } else {
        if (this.isDev) {
          console.warn(`[SEO Data] Coloring page API returned ${response.status}`);
        }
        return null;
      }
    } catch (error) {
      if (this.isDev) {
        console.error(`[SEO Data] Coloring page error:`, error);
      }
      return null;
    }
  }

  /**
   * 获取主题公园数据
   * ✅ 从 /api/theme-parks 获取所有主题公园，然后根据 slug 查找
   */
  async fetchThemePark(slug: string): Promise<ThemeParkData | null> {
    const apiUrl = `${this.apiBase}/api/theme-parks`;
    
    if (this.isDev) {
      console.log(`[SEO Data] Fetching theme parks list to find: ${slug}`);
    }

    try {
      // 开发环境不缓存，生产环境缓存1小时
      const fetchOptions = this.isDev 
        ? { cache: 'no-store' as RequestCache }
        : { next: { revalidate: 3600 } };
      
      const response = await fetch(apiUrl, fetchOptions);

      if (response.ok) {
        const data = await response.json();
        const themeParks = data.data || [];
        
        // ✅ 从列表中查找匹配的主题公园
        const themePark = themeParks.find((park: any) => park.slug === slug);
        
        if (this.isDev) {
          if (themePark) {
            console.log(`[SEO Data] Theme park found: ${themePark.name}`);
            console.log(`[SEO Data] SEO fields:`, {
              seoTitle: themePark.seoTitle,
              seoDescription: themePark.seoDescription,
            });
          } else {
            console.warn(`[SEO Data] Theme park not found for slug: ${slug}`);
          }
        }
        
        return themePark || null;
      } else {
        if (this.isDev) {
          console.warn(`[SEO Data] Theme parks list API returned ${response.status}`);
        }
        return null;
      }
    } catch (error) {
      if (this.isDev) {
        console.error(`[SEO Data] Theme parks list error:`, error);
      }
      return null;
    }
  }

  /**
   * 获取涂色书数据
   * ✅ 从 /api/coloring-books 获取所有涂色书，然后根据 slug 查找
   */
  async fetchColoringBook(slug: string): Promise<ColoringBookData | null> {
    const apiUrl = `${this.apiBase}/api/coloring-books`;
    
    if (this.isDev) {
      console.log(`[SEO Data] Fetching coloring books list to find: ${slug}`);
    }

    try {
      // 开发环境不缓存，生产环境缓存1小时
      const fetchOptions = this.isDev 
        ? { cache: 'no-store' as RequestCache }
        : { next: { revalidate: 3600 } };
      
      const response = await fetch(apiUrl, fetchOptions);

      if (response.ok) {
        const data = await response.json();
        const coloringBooks = data.data?.books || data.data || [];
        
        // ✅ 从列表中查找匹配的涂色书
        const rawBook = coloringBooks.find((book: any) => book.slug === slug);
        
        if (this.isDev) {
          if (rawBook) {
            console.log(`[SEO Data] Coloring book found: ${rawBook.title}`);
            console.log(`[SEO Data] SEO fields:`, {
              seoTitle: rawBook.seoTitle,
              seoDescription: rawBook.seoDescription,
            });
          } else {
            console.warn(`[SEO Data] Coloring book not found for slug: ${slug}`);
            console.log(`[SEO Data] Available slugs:`, coloringBooks.map((b: any) => b.slug));
          }
        }
        
        // ✅ 映射API字段到接口字段
        if (rawBook) {
          const coloringBook: ColoringBookData = {
            id: rawBook.id,
            name: rawBook.title, // ✅ API返回title，映射为name
            slug: rawBook.slug,
            description: rawBook.description,
            thumbnailUrl: rawBook.coverImage, // ✅ API返回coverImage，映射为thumbnailUrl
            seoTitle: rawBook.seoTitle,
            seoDescription: rawBook.seoDescription,
            additionalKeywords: rawBook.additionalKeywords || [],
            highlightPhrase: rawBook.highlightPhrase || rawBook.description,
            customTitleSuffix: rawBook.customTitleSuffix,
          };
          
          if (this.isDev) {
            console.log(`[SEO Data] Mapped coloring book data:`, {
              name: coloringBook.name,
              slug: coloringBook.slug,
              seoTitle: coloringBook.seoTitle,
              seoDescription: coloringBook.seoDescription,
            });
          }
          
          return coloringBook;
        }
        
        return null;
      } else {
        if (this.isDev) {
          console.warn(`[SEO Data] Coloring books list API returned ${response.status}`);
        }
        return null;
      }
    } catch (error) {
      if (this.isDev) {
        console.error(`[SEO Data] Coloring books list error:`, error);
      }
      return null;
    }
  }

  /**
   * 从 slug 格式化为显示名称
   * 增强版：处理各种边界情况
   * ✅ SEO优化：移除末尾的 "-slug" 后缀
   */
  formatSlugToName(slug: string): string {
    // 处理空值或无效输入
    if (!slug || typeof slug !== 'string') {
      return 'Unknown Category';
    }
    
    // 去除前后空格
    const cleanSlug = slug.trim();
    if (!cleanSlug) {
      return 'Unknown Category';
    }
    
    // 处理URL编码的情况
    const decodedSlug = decodeURIComponent(cleanSlug);
    
    // 分割单词
    const words = decodedSlug
      .split('-')
      .filter(word => word.length > 0); // 过滤空字符串
    
    // ✅ 如果最后一个词是 "slug"，移除它
    if (words.length > 1 && words[words.length - 1].toLowerCase() === 'slug') {
      words.pop();
    }
    
    // 格式化并拼接
    return words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') || 'Unknown Category'; // 最终兜底
  }

  /**
   * 从 slug-id 中提取 ID
   */
  extractIdFromSlugId(slugId: string): string | null {
    const parts = slugId.split('-');
    const id = parts.pop() || '';
    
    if (!id || isNaN(parseInt(id))) {
      return null;
    }
    
    return id;
  }
}

// 导出单例
export const dataFetcher = new SEODataFetcher();

