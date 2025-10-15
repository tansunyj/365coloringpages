/**
 * SEO 生成器
 * 基于配置和数据动态生成 SEO 元数据
 */

import { Metadata } from 'next';
import { SEOPageConfig } from './seoConfig';
import { CategoryData, ColoringPageData, ThemeParkData, ColoringBookData } from './dataFetcher';
import { buildKeywordsForPage } from './buildKeywords';

export interface SEOGeneratorContext {
  // 页面参数
  category?: string;
  slugId?: string;
  
  // 获取的数据
  categoryData?: CategoryData | null;
  coloringPageData?: ColoringPageData | null;
  themeParkData?: ThemeParkData | null;
  coloringBookData?: ColoringBookData | null;
  
  // 基础信息
  baseUrl?: string;
  siteUrl?: string;
}

/**
 * SEO 生成器类
 */
export class SEOGenerator {
  /**
   * 生成完整的 SEO 元数据
   */
  generate(config: SEOPageConfig, context: SEOGeneratorContext): Metadata {
    // 1. 构建关键词
    const keywords = this.buildKeywords(config, context);
    
    // 2. 构建 title
    const titleText = this.buildTitle(config, context);
    
    // 3. 构建 description
    const description = this.buildDescription(config, context);
    
    // 4. 构建 canonical URL
    const canonicalUrl = this.buildCanonicalUrl(context);
    
    // 5. 获取 OG 图片
    const ogImage = this.getOGImage(context);
    
    // 6. 获取发布时间（仅详情页）
    const publishedTime = context.coloringPageData?.publishedAt;
    
    // 7. 返回完整的 Metadata
    return {
      title: {
        absolute: titleText, // 使用 absolute 避免 template 包装
      },
      description,
      keywords: keywords.join(', '),
      openGraph: {
        title: titleText,
        description,
        url: canonicalUrl,
        type: config.includeAttributes ? 'article' : 'website',
        siteName: '365 Coloring Pages',
        ...(ogImage && { images: [{ url: ogImage }] }),
        ...(publishedTime && { publishedTime }),
      },
      twitter: {
        card: 'summary_large_image',
        title: titleText,
        description,
        ...(ogImage && { images: [ogImage] }),
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  /**
   * 构建关键词列表
   */
  private buildKeywords(config: SEOPageConfig, context: SEOGeneratorContext): string[] {
    // 基础关键词（替换变量）
    let baseKeywords = config.baseKeywords.map(keyword => 
      this.replaceVariables(keyword, context)
    );
    
    // 上下文关键词
    const contextKeywords = config.contextKeywords || [];
    
    // 分类特定关键词
    let categoryKeywords: string[] = [];
    if (context.categoryData || context.category) {
      // ✅ 使用 slug 格式化版本，而不是 name（SEO友好）
      const categorySlug = context.categoryData?.slug || context.category!;
      const categoryName = this.formatSlugToName(categorySlug);
      categoryKeywords = [
        `${categoryName.toLowerCase()} coloring pages`,
      ];
    }
    
    // 主题公园特定关键词
    if (context.themeParkData) {
      // ✅ 使用 slug 格式化版本，而不是 name（SEO友好）
      const themeParkSlug = context.themeParkData.slug;
      const themeParkName = this.formatSlugToName(themeParkSlug);
      categoryKeywords = [
        `${themeParkName.toLowerCase()} coloring pages`,
      ];
    }
    
    // 涂色书特定关键词
    if (context.coloringBookData) {
      // ✅ 使用 slug 格式化版本，而不是 name（SEO友好）
      const coloringBookSlug = context.coloringBookData.slug;
      const coloringBookName = this.formatSlugToName(coloringBookSlug);
      categoryKeywords = [
        `${coloringBookName.toLowerCase()} coloring book`,
        `${coloringBookName.toLowerCase()} coloring pages`,
      ];
    }
    
    // 属性关键词（从涂色页面数据）
    let attributeKeywords: string[] = [];
    if (config.includeAttributes && context.coloringPageData) {
      const page = context.coloringPageData;
      
      if (page.theme) {
        attributeKeywords.push(`${page.theme} coloring pages`);
      }
      if (page.style) {
        attributeKeywords.push(`${page.style} coloring pages`);
      }
      if (page.difficulty) {
        attributeKeywords.push(`${page.difficulty} coloring pages`);
      }
      if (page.ageRange) {
        attributeKeywords.push(`coloring pages for ages ${page.ageRange}`);
      }
      if (page.title) {
        attributeKeywords.push(page.title.toLowerCase());
      }
      // ✅ 添加 slug 格式化版本作为关键词（SEO优化）
      if (page.slug) {
        const formattedSlug = this.formatSlugToName(page.slug);
        attributeKeywords.push(formattedSlug.toLowerCase());
      }
    }
    
    // 后端额外关键词
    const additionalKeywords = context.categoryData?.additionalKeywords || 
                               context.themeParkData?.additionalKeywords || 
                               context.coloringBookData?.additionalKeywords || 
                               [];
    
    // ✅ 从后端 seoTitle 和 seoDescription 中提取关键词
    const seoExtraKeywords: string[] = [];
    const backendTitle = context.coloringPageData?.seoTitle || 
                        context.categoryData?.seoTitle || 
                        context.themeParkData?.seoTitle || 
                        context.coloringBookData?.seoTitle;
    const backendDesc = context.coloringPageData?.seoDescription || 
                       context.categoryData?.seoDescription || 
                       context.themeParkData?.seoDescription || 
                       context.coloringBookData?.seoDescription;
    
    // 从 seoTitle 提取关键词（提取有意义的短语）
    if (backendTitle && backendTitle.trim()) {
      const titleWords = backendTitle.toLowerCase()
        .split(/[\s,;|:\-]+/)
        .filter(word => word.length > 3) // 只保留长度 > 3 的词
        .slice(0, 3); // 最多提取3个
      seoExtraKeywords.push(...titleWords);
    }
    
    // 从 seoDescription 提取关键词
    if (backendDesc && backendDesc.trim()) {
      const descWords = backendDesc.toLowerCase()
        .split(/[\s,;|:\-\.]+/)
        .filter(word => word.length > 4) // 只保留长度 > 4 的词
        .slice(0, 5); // 最多提取5个
      seoExtraKeywords.push(...descWords);
    }
    
    // 使用 buildKeywordsForPage 组合所有关键词
    return buildKeywordsForPage({
      baseKeywords: [...baseKeywords, ...contextKeywords],
      categoryKeywords,
      attributeKeywords,
      additionalKeywords: [...additionalKeywords, ...seoExtraKeywords],
      limit: config.keywordsLimit || 12,
    });
  }

  /**
   * 构建 Title
   */
  private buildTitle(config: SEOPageConfig, context: SEOGeneratorContext): string {
    // 使用模板生成 title
    let titleText = this.replaceVariables(config.titleTemplate, context);
    
    // 如果模板中没有 suffix，添加默认 suffix
    if (config.defaultTitleSuffix && !titleText.includes('|') && !titleText.includes('-')) {
      // 检查是否有自定义 suffix
      const customSuffix = context.categoryData?.customTitleSuffix || 
                          context.themeParkData?.customTitleSuffix;
      
      const suffix = customSuffix || config.defaultTitleSuffix;
      titleText = `${titleText} - ${suffix}`;
    }
    
    // ✅ 拼接后端提供的 seoTitle（如果有）
    const backendTitle = context.coloringPageData?.seoTitle || 
                        context.categoryData?.seoTitle || 
                        context.themeParkData?.seoTitle || 
                        context.coloringBookData?.seoTitle;
    
    if (backendTitle && backendTitle.trim()) {
      // 如果后端标题与模板生成的不同，拼接进去
      if (!titleText.includes(backendTitle)) {
        titleText = `${titleText} | ${backendTitle}`;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SEO Generator] Title with backend seoTitle: "${titleText}" (${titleText.length} chars)`);
      }
    }
    
    return titleText;
  }

  /**
   * 构建 Description
   */
  private buildDescription(config: SEOPageConfig, context: SEOGeneratorContext): string {
    // 使用模板生成 description
    let descText = this.replaceVariables(config.descriptionTemplate, context);
    
    // 添加前缀（如果有）
    if (config.descriptionPrefix) {
      descText = config.descriptionPrefix + descText;
    }
    
    // ✅ 拼接后端提供的 seoDescription（如果有）
    const backendDesc = context.coloringPageData?.seoDescription || 
                       context.categoryData?.seoDescription || 
                       context.themeParkData?.seoDescription || 
                       context.coloringBookData?.seoDescription;
    
    if (backendDesc && backendDesc.trim()) {
      // 如果后端描述与模板生成的不同，拼接进去
      if (!descText.includes(backendDesc)) {
        descText = `${descText} ${backendDesc}`;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SEO Generator] Description with backend seoDescription: "${descText}" (${descText.length} chars)`);
      }
    }
    
    // 如果长度太短，添加通用结尾
    if (descText.length < 100 && !backendDesc) {
      descText += ' Free printable coloring pages for kids and adults.';
    }
    
    return descText;
  }

  /**
   * 构建 Canonical URL
   */
  private buildCanonicalUrl(context: SEOGeneratorContext): string {
    const siteUrl = context.siteUrl || 'https://365coloringpages.com';
    const baseUrl = context.baseUrl || '';
    
    return `${siteUrl}${baseUrl}`;
  }

  /**
   * 获取 Open Graph 图片
   */
  private getOGImage(context: SEOGeneratorContext): string | undefined {
    // 详情页优先使用涂色页面预览图
    if (context.coloringPageData?.previewUrl) {
      return context.coloringPageData.previewUrl;
    }
    
    // 分类页使用分类缩略图
    if (context.categoryData?.thumbnailUrl) {
      return context.categoryData.thumbnailUrl;
    }
    
    // 主题公园使用缩略图
    if (context.themeParkData?.thumbnailUrl) {
      return context.themeParkData.thumbnailUrl;
    }
    
    // 涂色书使用缩略图
    if (context.coloringBookData?.thumbnailUrl) {
      return context.coloringBookData.thumbnailUrl;
    }
    
    return undefined;
  }

  /**
   * 替换模板变量
   */
  private replaceVariables(template: string, context: SEOGeneratorContext): string {
    let result = template;
    
    // 分类名称 - 只在模板包含占位符时处理
    if (result.includes('{categoryName}')) {
      let categoryName = '';
      
      // ✅ 涂色书数据优先（用于 first-coloring-book）
      if (context.coloringBookData && context.coloringBookData.slug) {
        categoryName = this.formatSlugToName(context.coloringBookData.slug);
      }
      // ✅ 其次使用分类数据的 slug 格式化版本（SEO友好）
      else if (context.categoryData && context.categoryData.slug) {
        categoryName = this.formatSlugToName(context.categoryData.slug);
      }
      // Fallback 1: 使用 context.category slug 转换
      else if (context.category) {
        categoryName = this.formatSlugToName(context.category);
      }
      // Fallback 2: 最后的兜底
      else {
        categoryName = 'Coloring Pages';
      }
      
      // 确保 categoryName 不为空或 undefined
      if (!categoryName || categoryName === 'undefined') {
        categoryName = context.category ? this.formatSlugToName(context.category) : 'Coloring Pages';
      }
      
      result = result.replace(/{categoryName}/g, categoryName);
      
      // 开发模式调试日志
      if (process.env.NODE_ENV === 'development') {
        const sourceInfo = context.coloringBookData ? 'coloringBook' : context.categoryData ? 'category' : 'slug';
        console.log(`[SEO Generator] Category replacement (${sourceInfo}): "${context.category}" -> "${categoryName}"`);
      }
    }
    
    // 主题公园名称 - 同样使用 slug 格式化版本
    if (result.includes('{themeParkName}')) {
      let themeParkName = '';
      
      // ✅ 优先使用后端数据的 slug 格式化版本（SEO友好）
      if (context.themeParkData && context.themeParkData.slug) {
        themeParkName = this.formatSlugToName(context.themeParkData.slug);
      } else if (context.category) {
        themeParkName = this.formatSlugToName(context.category);
      }
      
      if (themeParkName) {
        result = result.replace(/{themeParkName}/g, themeParkName);
      }
    }
    
    // 涂色页面信息
    if (context.coloringPageData) {
      const page = context.coloringPageData;
      
      // ✅ 拼接 title 和 slug 格式化版本（SEO优化）
      let titleText = page.title;
      if (page.slug) {
        const formattedSlug = this.formatSlugToName(page.slug);
        // 如果 slug 格式化后与 title 不同，拼接进去
        if (formattedSlug.toLowerCase() !== page.title.toLowerCase()) {
          titleText = `${page.title} (${formattedSlug})`;
        }
      }
      result = result.replace(/{title}/g, titleText);
      
      // 难度文本
      const difficultyText = page.difficulty 
        ? ` ${page.difficulty.charAt(0).toUpperCase() + page.difficulty.slice(1)} difficulty`
        : '';
      result = result.replace(/{difficultyText}/g, difficultyText);
      
      // 年龄文本
      const ageText = page.ageRange 
        ? `, perfect for ages ${page.ageRange}`
        : '';
      result = result.replace(/{ageText}/g, ageText);
      
      // 风格和主题文本
      const styleThemeText = page.style && page.theme 
        ? ` ${page.style} ${page.theme}`
        : page.style || page.theme || '';
      result = result.replace(/{styleThemeText}/g, styleThemeText);
    }
    
    // highlightPhrase
    const highlightPhrase = context.categoryData?.highlightPhrase || 
                           context.themeParkData?.highlightPhrase || 
                           '';
    result = result.replace(/{highlightPhrase}/g, highlightPhrase);
    
    return result;
  }

  /**
   * 格式化 slug 为名称
   * 增强版：处理各种边界情况
   * ✅ SEO优化：移除末尾的 "-slug" 后缀
   */
  private formatSlugToName(slug: string): string {
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
}

// 导出单例
export const seoGenerator = new SEOGenerator();

