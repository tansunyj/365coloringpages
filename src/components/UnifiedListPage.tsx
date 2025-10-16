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
  bookTitle?: string;
  bookName?: string;  // 添加 bookName 字段支持
  bookType?: string;
  themeParkName?: string;
  themeParkSlug?: string;
  slug?: string; // 添加slug字段
  // 涂色书页面API返回的字段
  coloringBookId?: number;
  coloringBookName?: string;
  coloringBookSlug?: string;
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
  type: 'popular' | 'latest' | 'easy-coloring-book' | 'theme-parks' | 'categories' | 'search';
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
          sort: params.sort || 'popular',
          q: params.q || ''
        }) as ApiResponse;
        
      case 'categories':
        // 如果没有指定具体分类，获取所有分类下的涂色卡片
        if (!params.category || params.category === 'all' || params.category === '') {
          // 调用 /api/categories?page=1&limit=20&sort=newest 获取所有涂色卡片
          const { apiClient } = await import('../lib/apiClient');
          const { API_ENDPOINTS } = await import('../lib/apiConfig');
          
          const categoriesParams: Record<string, string | number> = {
            page: params.page,
            limit: params.limit,
          };
          
          if (params.sort) categoriesParams.sort = params.sort;
          if (params.q) categoriesParams.q = params.q;
          
          return await apiClient.get<ApiResponse>(
            API_ENDPOINTS.PUBLIC.CATEGORIES.LIST,
            categoriesParams
          ) as ApiResponse;
        } else {
          // 获取具体分类下的涂色页面
          return await api.categories.pages({
            slug: params.category,
            page: params.page,
            limit: params.limit,
            sort: params.sort || 'newest',
            q: params.q || ''
          }) as ApiResponse;
        }
        
      case 'search':
        return await api.search({
          q: params.q || '',
          page: params.page,
          limit: params.limit,
          sort: params.sort || '', // 搜索接口不需要 sort 参数值
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
        const { API_ENDPOINTS } = await import('../lib/apiConfig');
        return await apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.THEME_PARKS.LIST, themeParksParams) as ApiResponse;
        
      case 'easy-coloring-book':
        // 调用新的涂色书页面API，通过book参数筛选
        const { apiClient: coloringBooksApiClient } = await import('../lib/apiClient');
        const coloringBooksParams = {
          q: params.q || '',
          page: params.page,
          limit: params.limit,
          sort: params.sort || 'popular',
          book: (params.category && params.category !== 'all' && params.category !== '') ? params.category : ''  // 使用book参数筛选涂色书，选择"所有"时为空
        };
        const { API_ENDPOINTS: coloringBooksEndpoints } = await import('../lib/apiConfig');
        return await coloringBooksApiClient.get<ApiResponse>(coloringBooksEndpoints.PUBLIC.COLORING_BOOKS.PAGES, coloringBooksParams) as ApiResponse;
        
      case 'latest':
        // 调用最新上传涂色页面接口
        const { apiClient: latestApiClient } = await import('../lib/apiClient');
        const latestParams = {
          q: params.q || '',
          category: (params.category && params.category !== 'all' && params.category !== '') ? params.category : '',
          page: params.page,
          limit: params.limit,
          sort: params.sort || 'newest'
        };
        const { API_ENDPOINTS: latestEndpoints } = await import('../lib/apiConfig');
        return await latestApiClient.get<ApiResponse>(latestEndpoints.PUBLIC.LATEST.LIST, latestParams) as ApiResponse;
        
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
      } else if (type === 'easy-coloring-book') {
        // 获取涂色书列表
        interface ColoringBookApiResponse {
          success: boolean;
          data: {
            books: Array<{ id: number; title: string; slug: string; type: string }>;
          };
        }
        const response = await api.coloringBooks.list() as ColoringBookApiResponse;
        
        if (response.success && response.data && response.data.books && Array.isArray(response.data.books)) {
          // 转换涂色书数据格式为分类格式
          return response.data.books.map((book: { id: number; title: string; slug: string; type: string }) => ({
            id: book.id,
            name: book.title,
            slug: book.slug,
            color: '#34D399' // 使用绿色主题
          }));
        }
        return [];
      } else {
        // 获取普通分类列表
        const response = await api.categories.list() as any;
        
        // 处理返回格式: {success: true, data: [{id, name, slug, ...}, ...]}
        if (response.success && Array.isArray(response.data)) {
          return response.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            color: '#3B82F6' // 默认蓝色
          }));
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
 * 统一的排序选项配置
 */
const SORT_OPTIONS = [
  { value: 'newest', label: '最新发布', icon: '🆕' },
  { value: 'popular', label: '最受欢迎', icon: '🔥' },
  { value: 'downloads', label: '下载最多', icon: '⬇️' },
  { value: 'likes', label: '点赞最多', icon: '❤️' },
  { value: 'views', label: '浏览最多', icon: '👁️' },
];

/**
 * 统一列表页组件
 * 
 * @description 
 * 统一的列表页组件，支持以下7种页面类型：
 * 1. popular - 热门页面
 * 2. latest - 最新页面  
 * 3. easy-coloring-book - Easy Coloring Book
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
  defaultSort = '',
  itemsPerPage = 40
}: UnifiedListPageProps) {
  
  // 辅助函数：从分类名称生成slug
  const getCategorySlugFromName = (categoryName?: string): string => {
    if (!categoryName) return 'animals';
    
    const categoryMap: Record<string, string> = {
      '动物': 'animals',
      '幻想': 'fantasy', 
      '海洋': 'ocean',
      '太空': 'space',
      '自然': 'nature',
      '史前动物': 'prehistoric',
      '超级英雄': 'superhero',
      '农场': 'farm',
      '童话': 'fairy-tale',
      '节日': 'holidays'
    };
    
    return categoryMap[categoryName] || 'animals';
  };

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
  
  // 防止重复加载的标记 - 记录上一次的查询参数
  const lastQueryRef = useRef<string>('');
  
  // 路由和搜索参数
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 获取URL参数
  const urlPage = parseInt(searchParams.get('page') || '1');
  const currentLimit = parseInt(searchParams.get('limit') || itemsPerPage.toString());
  
  // 对于categories、search、popular、theme-parks、easy-coloring-book和latest页面，优先使用传入的category参数（来自URL路径）
  // 对于其他页面，使用查询参数中的category
  const urlCategory = searchParams.get('category');
  const currentCategory = (type === 'categories' || type === 'search' || type === 'popular' || type === 'theme-parks' || type === 'easy-coloring-book' || type === 'latest')
    ? (category || '')  // categories、search、popular、theme-parks、easy-coloring-book和latest页面使用路径参数
    : (urlCategory !== null ? urlCategory : (category || ''));  // 其他页面使用查询参数
  
  const currentSort = searchParams.get('sort') || defaultSort;
  const currentQuery = searchParams.get('q') || '';
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  
  // 用于标记是否是首次加载，避免URL参数覆盖用户输入
  const isInitialMount = useRef(true);
  // 记录上一次的URL查询词，用于检测外部导航
  const lastUrlQuery = useRef(currentQuery);
  
  // 同步URL参数到状态 - 只在初始化或外部导航时更新
  useEffect(() => {
    // 只在组件首次挂载时同步URL参数到搜索框
    if (isInitialMount.current) {
      setSearchQuery(currentQuery);
      setSelectedCategory(currentCategory);
      setSelectedSort(currentSort);
      lastUrlQuery.current = currentQuery;
      isInitialMount.current = false;
      return;
    }
    
    // 对于分类和排序，始终同步（因为用户不会手动输入这些）
    if (selectedCategory !== currentCategory) {
      setSelectedCategory(currentCategory);
    }
    if (selectedSort !== currentSort) {
      setSelectedSort(currentSort);
    }
    
    // 对于搜索关键词：只在URL查询词发生变化时同步
    // 这通常意味着：
    // 1. 用户点击了搜索按钮（updateUrl被调用）
    // 2. 用户使用了浏览器后退/前进按钮
    // 3. 用户从外部链接进入
    // 但不会在用户正在输入时同步，保护用户的输入体验
    if (currentQuery !== lastUrlQuery.current) {
      console.log('🔄 URL搜索词已变化，同步到搜索框:', currentQuery);
      setSearchQuery(currentQuery);
      lastUrlQuery.current = currentQuery;
    }
  }, [currentQuery, currentCategory, currentSort, selectedCategory, selectedSort]);

  /**
   * 更新URL参数 - 使用 replace 避免整个页面刷新
   */
  const updateUrl = useCallback((params: Record<string, string | number>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (key === 'category') {
        // 对于categories、search、popular、theme-parks、easy-coloring-book和latest页面，不将category参数添加到查询参数中
        // 因为category信息已经在URL路径中了
        if (type !== 'categories' && type !== 'search' && type !== 'popular' && type !== 'theme-parks' && type !== 'easy-coloring-book' && type !== 'latest') {
          newSearchParams.set(key, value.toString());
        }
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
    // 使用 replace 而不是 push，避免整个页面刷新
    router.replace(newUrl, { scroll: false });
  }, [router, searchParams, type]);

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
        // 清空现有数据，避免重复显示
        setItems([]);
      }
      setError(null);
      
      const actualPageToLoad = pageToLoad || (isLoadMore ? currentPage : 1);
      
      if (type === 'theme-parks') {
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
          } else if (type === 'easy-coloring-book') {
            // 涂色书API直接返回数组 - 需要转换为涂色页面格式
            interface ColoringBookItem {
              id: number;
              title: string;
              description: string;
              coverImage: string;
              slug: string;
              type: string;
              pageCount: number;
              createdAt: string;
              updatedAt?: string;
            }
            pageItems = response.data.map((book: ColoringBookItem) => ({
              id: book.id,
              title: book.title,
              description: book.description,
              thumbnailUrl: book.coverImage,
              difficulty: 'easy' as const,
              ageRange: 'all',
              views: 0, // 默认值，因为涂色书数据没有这些统计信息
              likes: 0,
              downloads: book.pageCount || 0, // 使用页面数量作为下载数
              categoryName: book.title,
              categorySlug: book.slug,
              categoryColor: '#34D399', // 绿色主题
              createdAt: book.createdAt,
              isLiked: false,
              isFavorited: false
            }));
          } else {
            pageItems = response.data;
          }
        } else {
          // 其他API返回对象格式
          if (type === 'easy-coloring-book' && 'books' in response.data && Array.isArray(response.data.books)) {
            // 处理新的涂色书API格式
            interface ColoringBookItem {
              id: number;
              title: string;
              description: string;
              coverImage: string;
              slug: string;
              pageCount: number;
              createdAt: string;
            }
            pageItems = response.data.books.map((book: ColoringBookItem) => ({
              id: book.id,
              title: book.title,
              description: book.description,
              thumbnailUrl: book.coverImage,
              difficulty: 'easy' as const,
              ageRange: 'all',
              views: 0,
              likes: 0,
              downloads: book.pageCount || 0,
              categoryName: book.title,
              categorySlug: book.slug,
              categoryColor: '#34D399',
              createdAt: book.createdAt,
              isLiked: false,
              isFavorited: false
            }));
          } else if (type === 'easy-coloring-book' && 'pages' in response.data && Array.isArray(response.data.pages)) {
            // 处理涂色书页面API格式 - 数据已经是标准格式，直接使用
            
            // 检查第一条数据的字段，帮助调试
            if (response.data.pages.length > 0) {
            }
            
            pageItems = response.data.pages;
          } else {
            pageItems = response.data.pages || response.data.items || [];
          }
        }
        
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
   * 加载分类数据 - 只在组件挂载时加载一次
   */
  useEffect(() => {
    const loadCategories = async () => {
      if (showCategoryFilter) {
        const categoryData = await ApiClientUtil.fetchCategories(type);
        setCategories(categoryData);
      }
    };
    
    loadCategories();
  }, [showCategoryFilter, type]);

  // 数据加载效果 - 只在搜索条件变化时重新加载
  useEffect(() => {
    // 生成当前查询的唯一标识
    const currentQueryKey = `${type}-${currentLimit}-${currentCategory}-${currentSort}-${currentQuery}-${park || ''}`;
    
    // 如果查询参数没有变化，不重复加载
    if (lastQueryRef.current === currentQueryKey) {
      console.log('🚫 查询参数未变化，跳过重复加载:', currentQueryKey);
      return;
    }
    
    console.log('🔄 查询参数已变化，开始加载数据:', currentQueryKey);
    lastQueryRef.current = currentQueryKey;
    
    loadData(false); // 明确传递 false，表示不是加载更多，而是重新加载
    // 注意：不要把 loadData 作为依赖项，避免因函数重新创建导致重复调用
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLimit, currentCategory, currentSort, currentQuery, type, park]);

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
    setSelectedCategory(categorySlug);
    
    // 对于categories、search、popular、theme-parks、easy-coloring-book和latest页面，跳转到新的URL路径
    if (type === 'categories' || type === 'search' || type === 'popular' || type === 'theme-parks' || type === 'easy-coloring-book' || type === 'latest') {
      const basePath = type === 'categories' ? '/categories' : 
                      type === 'search' ? '/search' : 
                      type === 'popular' ? '/best-coloring-pages' : 
                      type === 'theme-parks' ? '/disney-characters' : 
                      type === 'easy-coloring-book' ? '/easy-coloring-pages' : '/new-coloring-pages';
      
      if (categorySlug === 'all' || categorySlug === '') {
        // 跳转到首页，保留当前查询参数
        const currentParams = new URLSearchParams(searchParams);
        currentParams.delete('category'); // 删除category参数，因为首页不需要
        const queryString = currentParams.toString();
        const newUrl = queryString ? `${basePath}?${queryString}` : basePath;
        router.push(newUrl);
      } else {
        // 跳转到特定分类页面，保留当前查询参数
        const currentParams = new URLSearchParams(searchParams);
        currentParams.delete('category'); // 删除category参数，因为已经在路径中了
        const queryString = currentParams.toString();
        const newUrl = queryString ? `${basePath}/${categorySlug}?${queryString}` : `${basePath}/${categorySlug}`;
        router.push(newUrl);
      }
    } else {
      // 其他页面使用查询参数
      updateUrl({ category: categorySlug, page: 1 });
    }
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
      case 'easy-coloring-book':
        return '所有Easy Coloring Book';
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
                          {option.icon} {option.label}
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
        {error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => loadData()}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        ) : items.length === 0 && !loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">没有找到相关的涂色页面</p>
            <p className="text-sm text-gray-400">尝试调整搜索条件或浏览其他分类</p>
          </div>
        ) : (
          <div className="relative">
            {/* 小型加载指示器 - 固定在右上角 */}
            {loading && (
              <div className="fixed top-24 right-8 z-50 bg-white shadow-lg rounded-lg px-4 py-3 flex items-center space-x-3 border border-gray-200">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                <span className="text-sm text-gray-700 font-medium">加载中...</span>
              </div>
            )}

            {/* 涂色卡片网格 - 使用 key 强制重新渲染以避免闪烁 */}
            <div 
              key={`${currentCategory}-${currentSort}-${currentQuery}`}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fadeIn"
            >
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
                   categoryName={item.categoryName || '其他'}
                   categoryColor={item.categoryColor}
                   isLiked={item.isLiked}
                   isFavorited={item.isFavorited}
                   linkType={type}
                   linkCategory={
                    type === 'theme-parks' ? (
                      // 为 theme-parks 类型生成分类 slug
                      currentCategory ||
                      item.categorySlug ||
                      getCategorySlugFromName(item.categoryName) ||
                      category ||
                      'theme-park-adventures'
                    ) :
                    type === 'easy-coloring-book' ? (
                      // 为 easy-coloring-book 类型生成分类 slug
                      currentCategory ||
                      item.categorySlug ||
                      getCategorySlugFromName(item.categoryName) ||
                      category ||
                      'easy-coloring-book'
                    ) :
                    type === 'latest' ? (
                      // 为 latest 类型生成分类 slug
                      item.categorySlug || 
                      getCategorySlugFromName(item.categoryName) || 
                      category || 
                      'animals'
                    ) :
                    type === 'categories' ? (
                      // 为 categories 类型生成分类 slug
                      item.categorySlug || 
                      getCategorySlugFromName(item.categoryName) || 
                      currentCategory ||
                      category || 
                      'animals'
                    ) :
                    type === 'search' ? (
                      // 为 search 类型生成分类 slug
                      currentCategory || 
                      item.categorySlug || 
                      getCategorySlugFromName(item.categoryName) || 
                      category || 
                      ''
                    ) :
                    (item.categorySlug || category)
                  }
                   linkPark={park}
                   bookTitle={item.coloringBookName || item.bookTitle || item.bookName}
                   bookType={item.bookType}
                   themeParkName={item.themeParkName}
                   themeParkSlug={item.themeParkSlug}
                   slug={item.slug}
                   searchParams={{
                     q: currentQuery,
                     page: currentPage.toString(),
                     limit: currentLimit.toString(),
                     sort: currentSort,
                     category: currentCategory
                   }}
                   allPages={items}
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
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
} 