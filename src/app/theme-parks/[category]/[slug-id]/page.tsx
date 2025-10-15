import { Suspense } from 'react';
import { Metadata } from 'next';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';
import { buildKeywordsForPage, buildTitle, buildDescription } from '@/seo/buildKeywords';
import { KEYWORD_SOURCE } from '@/seo/keywords';

interface ThemeParksDetailPageProps {
  params: Promise<{
    category: string;
    'slug-id': string;
  }>;
}

/**
 * 主题公园涂色卡片详情页 SEO 元数据
 * 渐进式增强：默认关键词 + 主题公园关键词 + 涂色卡片属性关键词
 */
export async function generateMetadata({ params }: ThemeParksDetailPageProps): Promise<Metadata> {
  const { category, 'slug-id': slugId } = await params;

  // 从 slug-id 中提取 ID
  const parts = slugId.split('-');
  const id = parts.pop() || '';

  // 如果 ID 无效，返回基础元数据
  if (!id || isNaN(parseInt(id))) {
    return {
      title: 'Theme Park Coloring Page Not Found',
      description: 'The requested theme park coloring page could not be found.',
    };
  }

  // 尝试从后端获取涂色页面详细数据
  let coloringPage: any = null;
  let themeParkName = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE}/api/coloring-pages/${id}`, {
      next: { revalidate: 3600 }, // 缓存 1 小时
    });

    if (response.ok) {
      const data = await response.json();
      coloringPage = data.data;
    }
  } catch (error) {
    // 使用默认值
  }

  if (!coloringPage) {
    return {
      title: 'Theme Park Coloring Page Not Found',
      description: 'The requested theme park coloring page could not be found.',
    };
  }

  // 基础关键词（主题公园相关）
  const baseKeywords = [
    'theme park coloring pages',
    'park coloring pages',
    ...KEYWORD_SOURCE.core.slice(0, 2),
  ];

  // 主题公园特定关键词
  const themeParkKeywords = [
    `${themeParkName.toLowerCase()} coloring pages`,
  ];

  // 从涂色页面属性提取关键词
  const attributeKeywords: string[] = [];

  if (coloringPage.theme) {
    attributeKeywords.push(`${coloringPage.theme} coloring pages`);
  }
  if (coloringPage.style) {
    attributeKeywords.push(`${coloringPage.style} coloring pages`);
  }
  if (coloringPage.difficulty) {
    attributeKeywords.push(`${coloringPage.difficulty} coloring pages`);
  }
  if (coloringPage.ageRange) {
    attributeKeywords.push(`coloring pages for ages ${coloringPage.ageRange}`);
  }
  if (coloringPage.title) {
    attributeKeywords.push(coloringPage.title.toLowerCase());
  }

  // 使用渐进式增强策略
  const keywords = buildKeywordsForPage({
    baseKeywords,
    categoryKeywords: themeParkKeywords,
    attributeKeywords,
    limit: 12,
  });

  // 优先使用后端提供的 seoTitle（如果有效）
  let titleText: string;
  if (coloringPage.seoTitle && coloringPage.seoTitle.length >= 40 && coloringPage.seoTitle.length <= 80) {
    titleText = coloringPage.seoTitle;
  } else {
    titleText = buildTitle({
      main: `${coloringPage.title} - ${themeParkName} Coloring Page`,
      suffix: 'Free Printable',
    });
  }

  // 优先使用后端提供的 seoDescription（如果有效）
  let description: string;
  if (coloringPage.seoDescription && coloringPage.seoDescription.length >= 100 && coloringPage.seoDescription.length <= 200) {
    description = coloringPage.seoDescription;
  } else {
    const difficultyText = coloringPage.difficulty ? ` ${coloringPage.difficulty.charAt(0).toUpperCase() + coloringPage.difficulty.slice(1)} difficulty` : '';
    const ageText = coloringPage.ageRange ? `, perfect for ages ${coloringPage.ageRange}` : '';
    const styleText = coloringPage.style && coloringPage.theme ? ` ${coloringPage.style} ${coloringPage.theme}` : '';

    description = buildDescription({
      main: `Download and print ${coloringPage.title} coloring page from ${themeParkName}.${difficultyText ? difficultyText + ',' : ''}${ageText}.${styleText} design. Free high-quality printable coloring sheet.`,
      maxLength: 160,
    });
  }

  const canonicalUrl = `https://365coloringpages.com/theme-parks/${category}/${slugId}`;
  const ogImage = coloringPage.previewUrl || undefined;

  return {
    // 使用 absolute 模式，避免被 layout template 包装
    title: {
      absolute: titleText,
    },
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: titleText,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: '365 Coloring Pages',
      ...(ogImage && { images: [{ url: ogImage }] }),
      ...(coloringPage.publishedAt && { publishedTime: coloringPage.publishedAt }),
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

// 生成静态参数 - 从API获取所有主题公园和涂色页面的组合
export async function generateStaticParams() {
  // 开发环境下跳过静态参数生成，避免启动时的API调用问题
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // 获取所有主题公园
    const parksResponse = await fetch(`${API_BASE}/api/theme-parks?limit=1000`, {
      cache: 'no-store'
    });
    
    if (!parksResponse.ok) {
      return [];
    }
    
    const parksData = await parksResponse.json();
    const themeParks = parksData.data?.themeParks || [];
    
    const staticParams: { category: string; 'slug-id': string }[] = [];
    
    // 为每个主题公园获取其关联的涂色页面
    for (const park of themeParks) {
      try {
        const pagesResponse = await fetch(
          `${API_BASE}/api/theme-parks/${park.slug}/coloring-pages?limit=1000`,
          { cache: 'no-store' }
        );
        
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          const pages = pagesData.data?.coloringPages || [];
          
          pages.forEach((page: { id: number; slug?: string }) => {
            const pageSlug = page.slug || `page-${page.id}`;
            staticParams.push({
              category: park.slug,
              'slug-id': `${pageSlug}-${page.id}`
            });
          });
        }
      } catch (error) {
        // 忽略单个公园的错误，继续处理其他公园
      }
    }
    
    return staticParams;
  } catch (error) {
    return [];
  }
}

export default async function ThemeParksDetailPage({ 
  params
}: ThemeParksDetailPageProps) {
  // 等待params
  const { 'slug-id': slugId, category } = await params;
  
  // 从slug-id中提取ID和slug
  // 例如：abc-def-129 -> ID: 129, slug: abc-def
  const parts = slugId.split('-');
  const id = parts.pop() || ''; // 最后一个部分是ID
  const pageSlug = parts.join('-'); // 前面的部分重新组合成slug
  
  // 检查ID是否为有效数字
  if (!id || isNaN(parseInt(id))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">页面未找到</h1>
          <p className="text-gray-600">无效的涂色页面ID</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <UnifiedColoringDetail
        id={id}
        type="theme-parks"
        park={category}
      />
    </Suspense>
  );
}
