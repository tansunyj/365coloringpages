'use client';

import { Suspense, useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import UniversalSearchComponent, { 
  SearchConfig, 
  SearchResultItem, 
  SearchApiResponse,
  TitleConfig
} from '../../../components/UniversalSearchComponent';
import RichColoringCard from '../../../components/RichColoringCard';
import { useTranslation } from '../../../hooks/useTranslation';

// 分类数据接口
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  imageUrl: string;
  sortOrder: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

// Popular API 响应数据结构
interface PopularApiResponse {
  success: boolean;
  data: {
    items: SearchResultItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    filters: {
      sort: string;
      category: string;
    };
  };
  message: string;
}

interface PopularCategoryClientProps {
  category: string;
}

export default function PopularCategoryClient({ category }: PopularCategoryClientProps) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // 获取分类显示名称
  const getCategoryDisplayName = (slug: string) => {
    const categoryMap: Record<string, string> = {
      'animals': '动物',
      'fantasy': '幻想',
      'ocean': '海洋',
      'space': '太空',
      'nature': '自然',
      'prehistoric': '史前动物',
      'superhero': '超级英雄',
      'farm': '农场',
      'fairy-tale': '童话',
      'holidays': '节日',
      'all': '所有分类'
    };
    return categoryMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  // 页面标题配置
  const titleConfig: TitleConfig = {
    title: `热门${getCategoryDisplayName(category)}涂色页面`,
    subtitle: '探索最受欢迎的涂色内容',
    description: `浏览社区中最受欢迎、下载最多的${getCategoryDisplayName(category)}涂色页面，发现大家都在涂什么。`,
    centerTitle: false
  };

  // 加载分类数据
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const { api } = await import('../../../lib/apiClient');
        const response = await api.categories.list();
        
        if (response.success && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 动态生成搜索配置
  const getSearchConfig = (): SearchConfig => ({
    // API配置
    apiEndpoint: async (params) => {
      try {
        const { api } = await import('../../../lib/apiClient');
        
        // 调用 popular API，参数格式：?q=&category=&page=1&limit=15&sort=
        const response = await api.popular.list({
          page: params.page || 1,
          limit: params.limit || 15,
          category: params.category !== 'all' ? params.category : '',
          sort: params.sort || 'popular'
        }) as PopularApiResponse;
        
        // 转换 API 响应格式以匹配 UniversalSearchComponent 期望的格式
        const transformedResponse: SearchApiResponse = {
          success: response.success,
          data: {
            items: response.data?.items || [],
            totalCount: response.data?.pagination?.totalCount || 0,
            currentPage: response.data?.pagination?.currentPage || 1,
            totalPages: response.data?.pagination?.totalPages || 1,
            hasNextPage: response.data?.pagination?.hasNextPage || false,
            hasMore: response.data?.pagination?.hasNextPage || false
          },
          message: response.message
        };
        
        return transformedResponse;
      } catch (error) {
        throw error;
      }
    },
    
    // 搜索参数
    defaultSort: '',
    defaultCategory: category, // 预选当前分类
    pageSize: 40,
    
    // 右上角筛选选项
    sortOptions: [
      { value: 'popular', label: '最热门' },
      { value: 'newest', label: '最新' },
      { value: 'downloads', label: '下载最多' },
      { value: 'likes', label: '点赞最多' },
      { value: 'views', label: '浏览最多' }
    ],
    categoryOptions: [
      { value: 'all', label: '所有分类' },
      ...categories.map(cat => ({
        value: cat.slug,
        label: cat.name
      }))
    ],
    
    // 显示配置
    showSearch: true, // 显示搜索框以保持布局一致
    showCategoryFilter: true,
    showSortFilter: true,
    showDifficultyFilter: false,
    showAgeRangeFilter: false,
    showCheckboxFilters: false, // 不显示左侧筛选
    autoLoadOnMount: true, // 页面加载时自动加载数据
    
    // 布局配置
    useLeftSidebar: false, // 不使用左侧边栏布局
    gridCols: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    
    // 页面标题配置
    titleConfig: titleConfig,
    
    // 自定义渲染
    renderItem: (item, searchQuery, searchParams, allItems) => (
      <RichColoringCard
        key={`${item.id}-${item.categorySlug || 'default'}`}
        id={item.id}
        title={item.title}
        description={item.description}
        thumbnailUrl={item.thumbnailUrl}
        difficulty={item.difficulty || 'medium'}
        ageRange={item.ageRange || '3-12岁'}
        views={item.views || 0}
        likes={item.likes || 0}
        downloads={item.downloads || 0}
        categoryName={item.categoryName || item.category || '其他'}
        categoryColor={item.categoryColor || '#999'}
        isLiked={item.isLiked || false}
        isFavorited={item.isFavorited || false}
        linkType="popular"
        linkCategory={item.categorySlug || category}
        allPages={allItems}
      />
    ),
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 页眉 */}
      <Header />
      
      {/* 主要内容区域 */}
      <div className="flex-1 py-8">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        }>
          {categoriesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">加载分类数据中...</p>
            </div>
          ) : (
            <UniversalSearchComponent 
              config={getSearchConfig()}
              className="min-h-0" // 覆盖默认的min-h-screen
            />
          )}
        </Suspense>
      </div>
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
} 