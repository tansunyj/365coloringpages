'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import UnifiedBreadcrumb from './UnifiedBreadcrumb';
import RichColoringCard from './RichColoringCard';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

/**
 * 涂色页面数据接口
 */
interface ColoringPageItem {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  views: number;
  likes: number;
  downloads: number;
  categoryName: string;
  categorySlug?: string;
  categoryColor: string;
  createdAt: string;
  isLiked?: boolean;
  isFavorited?: boolean;
}

/**
 * 分页信息接口
 */
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startRecord: number;
  endRecord: number;
}

/**
 * API响应接口
 */
interface ApiResponse {
  success: boolean;
  data: {
    pages?: ColoringPageItem[];
    items?: ColoringPageItem[];
    pagination: PaginationInfo;
    filters: {
      sort: string;
      category: string;
      query?: string;
    };
    meta?: {
      searchTime?: number;
      totalResults: number;
    };
  };
  message: string;
}

/**
 * 分类数据接口
 */
interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

/**
 * 统一列表页组件属性
 */
interface UnifiedListPageProps {
  type: 'popular' | 'latest' | 'first-coloring-book' | 'theme-parks' | 'categories' | 'search';
  category?: string;
  park?: string;
  title: string;
  subtitle: string;
  description: string;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showSortFilter?: boolean;
  defaultSort?: string;
  itemsPerPage?: number;
}

/**
 * API客户端工具类
 */
class ApiClientUtil {
  /**
   * 根据页面类型调用对应的API
   */
  static async fetchData(
    type: UnifiedListPageProps['type'],
    params: {
      page: number;
      limit: number;
      category?: string;
      sort?: string;
      q?: string;
      park?: string;
    }
  ): Promise<ApiResponse> {
    const api = (await import('../lib/apiClient')).default;
    
    switch (type) {
      case 'popular':
        return await api.popular.list({
          page: params.page,
          limit: params.limit,
          category: params.category !== 'all' ? params.category : '',
          sort: params.sort || 'popular'
        }) as ApiResponse;
        
      case 'categories':
        return await api.categories.pages({
          slug: params.category && params.category !== 'all' ? params.category : 'animals',
          page: params.page,
          limit: params.limit,
          sort: params.sort || 'popular',
          q: params.q || ''
        }) as ApiResponse;
        
      case 'search':
        return await api.search({
          q: params.q || '',
          page: params.page,
          limit: params.limit,
          sort: params.sort || 'relevance',
          category: params.category !== 'all' ? params.category : ''
        }) as ApiResponse;
        
      case 'theme-parks':
        // 统一调用主题公园涂色页面接口，通过theme参数筛选
        const { apiClient } = await import('../lib/apiClient');
        const themeParksParams = {
          q: params.q || '',
          page: params.page,
          limit: params.limit,
          sort: params.sort || '',
          theme: (params.category && params.category !== 'all' && params.category !== '') ? params.category : ''  // 使用theme参数筛选主题公园，选择"所有"时为空
        };
        console.log('🎢 Theme Parks API Call:', 'http://localhost:3001/api/theme-parks', themeParksParams);
        return await apiClient.get<ApiResponse>('http://localhost:3001/api/theme-parks', themeParksParams) as ApiResponse;
        
      case 'latest':
      case 'first-coloring-book':
        // 这些API暂时不可用，返回空结果
        return {
          success: true,
          data: {
            pages: [],
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalCount: 0,
              limit: params.limit,
              hasNextPage: false,
              hasPrevPage: false,
              startRecord: 0,
              endRecord: 0
            },
            filters: {
              sort: params.sort || '',
              category: params.category || ''
            },
            meta: {
              totalResults: 0
            }
          },
          message: '暂无数据'
        };
        
      default:
        throw new Error(`Unsupported page type: ${type}`);
    }
  }
  
  /**
   * 获取分类列表或主题公园列表
   */
  static async fetchCategories(type?: string): Promise<Category[]> {
    try {
      const { api } = await import('../lib/apiClient');
      
      if (type === 'theme-parks') {
        // 获取主题公园列表
        const response = await api.themeParks.list();
        
        if (response.success && Array.isArray(response.data)) {
          // 转换主题公园数据格式为分类格式
          return response.data.map((park: { id: number; name: string; slug: string; brandColor?: string }) => ({
            id: park.id,
            name: park.name,
            slug: park.slug,
            color: park.brandColor || '#FF6B6B'
          }));
        }
        return [];
      } else {
        // 获取普通分类列表
        const response = await api.categories.list();
        
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      return [];
    }
  }
}

/**
 * 排序选项配置
 */
const SORT_OPTIONS = [
  { value: 'relevance', label: '相关度' },
  { value: 'popular', label: '热门度' },
  { value: 'newest', label: '最新' },
  { value: 'oldest', label: '最早' },
  { value: 'views', label: '浏览量' },
  { value: 'downloads', label: '下载量' },
];

/**
 * 统一列表页组件
 * 
 * @description 
 * 统一的列表页组件，支持以下7种页面类型：
 * 1. popular - 热门页面
 * 2. latest - 最新页面  
 * 3. first-coloring-book - 我的第一本涂色书
 * 4. theme-parks - 主题公园
 * 5. categories - 分类页面
 * 6. search - 搜索结果页面
 * 
 * 提供统一的搜索、筛选、分页功能
 */
export default function UnifiedListPage({
  type,
  category,
  park,
  title,
  subtitle,
  description,
  showSearch = true,
  showCategoryFilter = true,
  showSortFilter = true,
  defaultSort = 'popular',
  itemsPerPage = 15
}: UnifiedListPageProps) {
  // 状态管理
  const [items, setItems] = useState<ColoringPageItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // 滚动检测
  const observerRef = useRef<HTMLDivElement>(null);
  
  // 路由和搜索参数
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 获取URL参数
  const urlPage = parseInt(searchParams.get('page') || '1');
  const currentLimit = parseInt(searchParams.get('limit') || itemsPerPage.toString());
  const urlCategory = searchParams.get('category');
  const currentCategory = urlCategory !== null ? urlCategory : (category || '');
  const currentSort = searchParams.get('sort') || defaultSort;
  const currentQuery = searchParams.get('q') || '';
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  
  // 同步URL参数到状态
  useEffect(() => {
    setSearchQuery(currentQuery);
    setSelectedCategory(currentCategory);
    setSelectedSort(currentSort);
  }, [currentQuery, currentCategory, currentSort]);

  /**
   * 更新URL参数
   */
  const updateUrl = useCallback((params: Record<string, string | number>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (key === 'category') {
        // 对于category参数，即使是空字符串也要设置，以明确用户的选择
        newSearchParams.set(key, value.toString());
      } else if (value && value !== '' && value !== '0') {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });
    
    // 页面变化时重置到第1页
    if ('category' in params || 'sort' in params || 'q' in params) {
      newSearchParams.set('page', '1');
    }
    
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    router.push(newUrl);
  }, [router, searchParams]);

  /**
   * 加载数据
   */
  const loadData = useCallback(async (isLoadMore = false, pageToLoad?: number) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setCurrentPage(1);
        setHasMore(true);
      }
      setError(null);
      
      const actualPageToLoad = pageToLoad || (isLoadMore ? currentPage : 1);
      
      if (type === 'theme-parks') {
        console.log('📍 LoadData - Current Category:', currentCategory, 'URL Category:', urlCategory, 'Prop Category:', category);
      }
      
      const response = await ApiClientUtil.fetchData(type, {
        page: actualPageToLoad,
        limit: currentLimit,
        category: currentCategory,
        sort: currentSort,
        q: currentQuery,
        park: park
      });
      
      if (response.success) {
        console.log('🔍 API Response Data:', response.data);
        
        // 处理不同API响应格式的数据字段
        let pageItems: ColoringPageItem[] = [];
        if (Array.isArray(response.data)) {
          // 主题公园API直接返回数组 - 需要转换为涂色页面格式
          if (type === 'theme-parks') {
            interface ThemeParkItem {
              id: number;
              name: string;
              slug: string;
              description: string;
              coverUrl: string;
              brandColor: string;
              createdAt: string;
              updatedAt?: string;
            }
            pageItems = response.data.map((park: ThemeParkItem) => ({
              id: park.id,
              title: park.name,
              description: park.description,
              thumbnailUrl: park.coverUrl,
              difficulty: 'easy' as const,
              ageRange: 'all',
              views: 0,
              likes: 0,
              downloads: 0,
              categoryName: park.name,
              categorySlug: park.slug,
              categoryColor: park.brandColor || '#FF6B6B',
              createdAt: park.createdAt,
              isLiked: false,
              isFavorited: false
            }));
          } else {
            pageItems = response.data;
          }
        } else {
          // 其他API返回对象格式
          pageItems = response.data.pages || response.data.items || [];
        }
        console.log('📄 Page Items:', pageItems);
        
        if (isLoadMore) {
          // 追加数据，确保没有重复的ID
          setItems(prevItems => {
            const existingIds = new Set(prevItems.map(item => item.id));
            const newItems = pageItems.filter(item => !existingIds.has(item.id));
            return [...prevItems, ...newItems];
          });
        } else {
          // 替换数据（首次加载或搜索）
          setItems(pageItems);
        }
        
        // 处理分页信息 - 针对主题公园API的特殊处理
        const paginationData = Array.isArray(response.data) ? {
          currentPage: 1,
          totalPages: 1,
          totalCount: pageItems.length,
          limit: currentLimit,
          hasNextPage: false,
          hasPrevPage: false,
          startRecord: 1,
          endRecord: pageItems.length
        } : (response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: pageItems.length,
          limit: currentLimit,
          hasNextPage: false,
          hasPrevPage: false,
          startRecord: 1,
          endRecord: pageItems.length
        });
        console.log('📊 Pagination Data:', paginationData);
        
        setPagination(paginationData);
        
        // 检查是否还有更多数据
        setHasMore(paginationData.hasNextPage || false);
        
      } else {
        setError(response.message || '加载数据失败');
      }
    } catch (err) {
      console.error('Load data error:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [type, currentLimit, currentCategory, currentSort, currentQuery, park]);

  /**
   * 加载更多数据
   */
  const loadMore = useCallback(async () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      
      try {
        setLoadingMore(true);
        setError(null);
        
        const response = await ApiClientUtil.fetchData(type, {
          page: nextPage,
          limit: currentLimit,
          category: currentCategory,
          sort: currentSort,
          q: currentQuery,
          park: park
        });
        
        if (response.success) {
          const pageItems = response.data.pages || response.data.items || [];
          
          // 追加数据，确保没有重复的ID
          setItems(prevItems => {
            const existingIds = new Set(prevItems.map(item => item.id));
            const newItems = pageItems.filter(item => !existingIds.has(item.id));
            return [...prevItems, ...newItems];
          });
          setCurrentPage(nextPage);
          setPagination(response.data.pagination);
          
          // 检查是否还有更多数据
          const paginationData = response.data.pagination;
          setHasMore(paginationData.hasNextPage);
        } else {
          setError(response.message || '加载更多数据失败');
        }
      } catch (err) {
        console.error('Load more error:', err);
        setError('网络错误，请稍后重试');
      } finally {
        setLoadingMore(false);
      }
    }
  }, [loadingMore, hasMore, currentPage, type, currentLimit, currentCategory, currentSort, currentQuery, park]);

  /**
   * 加载分类数据
   */
  const loadCategories = useCallback(async () => {
    if (showCategoryFilter) {
      const categoryData = await ApiClientUtil.fetchCategories(type);
      setCategories(categoryData);
    }
  }, [showCategoryFilter, type]);

  // 数据加载效果 - 只在搜索条件变化时重新加载
  useEffect(() => {
    console.log('🔥 useEffect Triggered - currentCategory:', currentCategory, 'type:', type);
    loadData();
  }, [currentLimit, currentCategory, currentSort, currentQuery, type, park]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 无限滚动检测
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading, loadingMore, loadMore]);

  // 事件处理
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateUrl({ q: query, page: 1 });
  };

  const handleCategoryChange = (categorySlug: string) => {
    console.log('🔄 Category Change:', categorySlug);
    console.log('🔄 Before Update - URL Category:', urlCategory, 'Current Category:', currentCategory);
    setSelectedCategory(categorySlug);
    updateUrl({ category: categorySlug, page: 1 });
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    updateUrl({ sort: sort, page: 1 });
  };

  // 获取分类筛选的默认选项文字
  const getCategoryFilterLabel = () => {
    switch (type) {
      case 'theme-parks':
        return '所有主题公园';
      default:
        return '所有分类';
    }
  };





  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <UnifiedBreadcrumb
          type={type}
          category={category}
          park={park}
          searchParams={{
            q: currentQuery,
            page: currentPage.toString(),
            limit: currentLimit.toString(),
            sort: currentSort,
            category: currentCategory
          }}
        />



        {/* 搜索和筛选区域 - 响应式布局 */}
        {(showSearch || showCategoryFilter || showSortFilter) && (
          <div className="mb-6">
            {showSearch ? (
              // 搜索框和筛选器在同一行
              <div className="flex items-center gap-4">
                {/* 搜索框 - 占据大部分空间 */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search for coloring pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                      className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm text-base"
                    />
                    <button
                      onClick={() => handleSearch(searchQuery)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors duration-200"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* 筛选器组 - 固定宽度 */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* 分类筛选 */}
                  {showCategoryFilter && (
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="appearance-none px-4 py-3 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm font-medium shadow-sm cursor-pointer hover:border-gray-400 transition-colors min-w-[120px]"
                      >
                        <option value="">{getCategoryFilterLabel()}</option>
                        {categories.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {/* 自定义下拉箭头 */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* 排序筛选 */}
                  {showSortFilter && (
                    <div className="relative">
                      <select
                        value={selectedSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="appearance-none px-4 py-3 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm font-medium shadow-sm cursor-pointer hover:border-gray-400 transition-colors min-w-[100px]"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {/* 自定义下拉箭头 */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // 仅筛选器时的右对齐布局
              <div className="flex justify-end items-center gap-3">
                {/* 分类筛选 */}
                {showCategoryFilter && (
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm font-medium shadow-sm cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <option value="">{getCategoryFilterLabel()}</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {/* 自定义下拉箭头 */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* 排序筛选 */}
                {showSortFilter && (
                  <div className="relative">
                    <select
                      value={selectedSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none px-4 py-2.5 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm font-medium shadow-sm cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {/* 自定义下拉箭头 */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 结果统计 - 简洁样式 */}
        {pagination && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Found {pagination.totalCount} results
            </p>
            <p className="text-sm text-gray-600">
              第 {pagination.currentPage} 页，共 {pagination.totalPages} 页
            </p>
          </div>
        )}

        {/* 内容区域 */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">加载中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => loadData()}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              重新加载
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">没有找到相关的涂色页面</p>
            <p className="text-sm text-gray-400">尝试调整搜索条件或浏览其他分类</p>
          </div>
        ) : (
          <>
                         {/* 涂色卡片网格 */}
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
               {items.map((item) => (
                 <RichColoringCard
                   key={item.id}
                   id={item.id}
                   title={item.title}
                   description={item.description}
                   thumbnailUrl={item.thumbnailUrl}
                   difficulty={item.difficulty}
                   ageRange={item.ageRange}
                   views={item.views}
                   likes={item.likes}
                   downloads={item.downloads}
                   categoryName={item.categoryName}
                   categoryColor={item.categoryColor}
                   isLiked={item.isLiked}
                   linkType={type}
                   linkCategory={type === 'theme-parks' ? currentCategory || 'theme-park-adventures' : (item.categorySlug || category)}
                   linkPark={park}
                   searchParams={{
                     q: currentQuery,
                     page: currentPage.toString(),
                     limit: currentLimit.toString(),
                     sort: currentSort,
                     category: currentCategory
                   }}
                 />
               ))}
             </div>

            {/* 无限滚动加载指示器 */}
            <div ref={observerRef} className="flex justify-center items-center py-8">
              {loadingMore && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                  <span className="text-gray-600">正在加载更多...</span>
                </div>
              )}
              {!hasMore && items.length > 0 && (
                <div className="text-gray-500 text-center">
                  <p>已加载全部内容</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
} 