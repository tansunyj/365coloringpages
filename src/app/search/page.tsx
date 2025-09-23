'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, SortAsc, Download, Heart, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

// 涂色页面数据接口 - 根据实际API响应调整
interface ColoringPage {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  thumbnailUrl: string;
  category?: string;
  categorySlug?: string;
  categoryName?: string | null;
  categoryColor?: string | null;
  tags?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  downloads: number;
  likes: number;
  views: number;
  ageRange?: string;
  resultType?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 搜索结果响应接口
interface SearchResponse {
  success: boolean;
  data: {
    pages: ColoringPage[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
  query: string;
}

// 实际API响应数据接口
interface ActualApiSearchData {
  coloringPages?: ColoringPage[];
  pages?: ColoringPage[];
  categories?: unknown[];
  totalResults?: number;
  searchTime?: number;
}

// 分类接口
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function SearchPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // 只在客户端获取搜索参数，避免hydration mismatch
  const query = isClient ? (searchParams.get('q') || '') : '';
  const category = isClient ? (searchParams.get('category') || '') : '';
  const page = isClient ? parseInt(searchParams.get('page') || '1', 10) : 1;
  
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'popular' | 'downloads'>('relevance');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [error, setError] = useState('');

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 客户端检测
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 加载分类列表
  const loadCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const { api } = await import('../../lib/apiClient');
      const response = await api.categories.list();
      
      if (response.success && response.data) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // 初始化：加载分类和执行搜索
  useEffect(() => {
    if (isClient) {
      setSearchQuery(query);
      setCategoryFilter(category || 'all');
      setCurrentPage(page);
      
      // 加载分类列表
      loadCategories();
      
      // 执行搜索
      if (query || category) {
        searchPages(query || '', page);
      }
    }
  }, [isClient, query, category, page, loadCategories]);

  // 搜索函数
  const searchPages = useCallback(async (searchQuery: string, page: number = 1, isLoadMore = false) => {
    // 如果既没有搜索词又没有分类过滤，则不执行搜索
    if (!searchQuery.trim() && categoryFilter === 'all') return;

    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError('');
      }

      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        sort: sortBy,
        category: categoryFilter !== 'all' ? categoryFilter : '',
        limit: '12'
      });

      const { api } = await import('../../lib/apiClient');
      const response = await api.search({
        q: searchQuery || '', // 确保总是有值，即使是空字符串
        page: page,
        limit: 12,
        sort: sortBy,
        category: categoryFilter !== 'all' ? categoryFilter : '',
      });
      
      console.log('API响应:', response);
      
      // 验证API响应结构
      if (!response || typeof response !== 'object') {
        throw new Error(t('search.searchFailed'));
      }
      
      if (!response.data || typeof response.data !== 'object') {
        throw new Error(t('search.searchFailed'));
      }
      
      // 检查实际的API响应结构
      const responseData = response.data as ActualApiSearchData;
      
      // API返回的是coloringPages，不是pages
      let pagesArray: ColoringPage[] = [];
      
      if (Array.isArray(responseData.coloringPages)) {
        pagesArray = responseData.coloringPages;
      } else if (Array.isArray(responseData.pages)) {
        pagesArray = responseData.pages;
      } else {
        console.error('API响应数据格式错误:', responseData);
        throw new Error(t('search.searchFailed'));
      }
      
      // 计算分页信息
      const totalResults = responseData.totalResults || pagesArray.length;
      const limit = 12;
      const calculatedTotalPages = Math.ceil(totalResults / limit);
      const calculatedHasNextPage = page < calculatedTotalPages;
      
      const data: SearchResponse = {
        success: response.success,
        data: {
          pages: pagesArray,
          totalCount: totalResults,
          currentPage: page,
          totalPages: calculatedTotalPages,
          hasNextPage: calculatedHasNextPage,
        },
        query: query
      };

      if (data.success) {
        if (isLoadMore) {
          setPages(prev => [...prev, ...data.data.pages]);
        } else {
          setPages(data.data.pages);
          setCurrentPage(1);
        }
        
        setTotalCount(data.data.totalCount);
        setHasNextPage(data.data.hasNextPage);
        setCurrentPage(data.data.currentPage);
        // 确保成功时清除错误状态
        setError('');
      } else {
        // API响应失败时的处理
        setError(t('search.searchFailed'));
        setPages([]);
        setTotalCount(0);
        setHasNextPage(false);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('搜索错误:', error);
      setError(t('search.networkError'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [sortBy, categoryFilter, t]);



  // 加载更多数据
  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore && searchQuery) {
      searchPages(searchQuery, currentPage + 1, true);
    }
  }, [hasNextPage, isLoadingMore, searchQuery, currentPage, searchPages]);

  // 无限滚动监听
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isLoadingMore, loadMore]);

  // 处理新搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 更新URL
      const newUrl = `${window.location.pathname}?q=${encodeURIComponent(searchQuery)}`;
      window.history.replaceState({}, '', newUrl);
      
      // 执行搜索
      searchPages(searchQuery, 1, false);
    }
  };

  // 处理筛选变化
  useEffect(() => {
    if (searchQuery && pages.length > 0) {
      searchPages(searchQuery, 1, false);
    }
  }, [sortBy, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 页眉 */}
      <Header />
      
      {/* 主要内容区域 */}
      <div className="flex-1">
        {/* 搜索头部 */}
        <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                {t('search.searchButton')}
              </button>
            </div>
          </form>

          {/* 搜索结果信息和筛选 */}
          {query && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-gray-600">
                {isLoading ? (
                  <span>{t('search.searching')}</span>
                ) : (
                  <span>
                    {t('search.resultsFor').replace('{count}', totalCount.toString()).replace('{query}', query)}
                  </span>
                )}
              </div>

              {/* 筛选和排序 */}
              <div className="flex flex-wrap gap-4">
                {/* 分类筛选 */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={isLoadingCategories}
                  >
                    <option value="all">{t('search.allCategories')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 排序 */}
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'relevance' | 'newest' | 'popular' | 'downloads')}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="relevance">{t('search.relevance')}</option>
                    <option value="newest">{t('search.newest')}</option>
                    <option value="popular">{t('search.popular')}</option>
                    <option value="downloads">{t('search.downloads')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 搜索结果内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={() => searchPages(searchQuery, 1, false)}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              {t('search.retry')}
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('search.searching')}</p>
          </div>
        ) : pages && pages.length > 0 ? (
          <>
            {/* 搜索结果网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pages.map((page) => {
                // 构建当前搜索参数，保持与原URL相同的参数
                const currentSearchParams = new URLSearchParams();
                if (query) currentSearchParams.set('q', query);
                currentSearchParams.set('page', currentPage.toString());
                currentSearchParams.set('limit', '12');
                // 始终包含 sort 参数，即使是空字符串
                currentSearchParams.set('sort', sortBy === 'relevance' ? '' : sortBy);
                // 始终包含 category 参数，即使是空字符串
                currentSearchParams.set('category', categoryFilter === 'all' ? '' : categoryFilter);
                
                return (
                  <SearchResultCard 
                    key={page.id} 
                    page={page} 
                    searchQuery={query}
                    searchParams={currentSearchParams}
                  />
                );
              })}
            </div>

            {/* 加载更多触发器 */}
            <div ref={loadMoreRef} className="mt-8 text-center">
              {isLoadingMore && (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">{t('search.loadingMore')}</p>
                </div>
              )}
              {!hasNextPage && pages.length > 0 && (
                <p className="text-gray-500 py-8">{t('search.allResultsShown')}</p>
              )}
            </div>
          </>
        ) : query && !isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('search.noResults')}</h3>
              <p>{t('search.noResultsDescription')}</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Link
                href="/categories"
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                {t('search.browseCategories')}
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('search.backToHome')}
              </Link>
            </div>
          </div>
        ) : !query && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('search.startSearching')}</h3>
            <p className="text-gray-500">{t('search.startSearchingDescription')}</p>
          </div>
        )}
        </div>
      </div>
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
}

// 搜索结果卡片组件
function SearchResultCard({ page, searchQuery, searchParams }: { page: ColoringPage; searchQuery: string; searchParams: URLSearchParams }) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);

  // 生成分类slug的辅助函数
  const getCategorySlug = (categoryName: string) => {
    if (!categoryName) return 'default';
    
    // 中文到英文的映射
    const categoryMap: Record<string, string> = {
      '动物': 'animals',
      '童话': 'fairy-tale',
      '幻想': 'fantasy',
      '交通工具': 'vehicles',
      '自然': 'nature',
      '史前动物': 'prehistoric',
      '太空': 'space',
      '海洋': 'ocean',
      '节日': 'holidays',
      '超级英雄': 'superhero',
      '食物': 'food',
      '魔法': 'magic',
      '农场': 'farm',
      '庆祝': 'celebration'
    };
    
    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'default';
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    // 这里可以调用API记录点赞
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // 这里可以调用下载API
    console.log(t('search.download') + ':', page.title);
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800', 
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-orange-100 text-orange-800'
    ];
    // 添加安全检查，防止category为undefined或null
    if (!category || typeof category !== 'string') {
      return colors[0]; // 返回默认颜色
    }
    const index = category.length % colors.length;
    return colors[index];
  };

  // 构建搜索详情页URL，使用查询参数方式
  const buildSearchDetailUrl = () => {
    const detailParams = new URLSearchParams(searchParams);
    detailParams.set('id', page.id.toString());
    return `/search/detail?${detailParams.toString()}`;
  };

  return (
    <Link
      href={buildSearchDetailUrl()}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* 图片 */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={page.thumbnailUrl}
          alt={page.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* 分类标签 */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(page.category || page.categoryName || t('search.defaultCategory'))}`}>
            {page.category || page.categoryName || t('search.defaultCategory')}
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleLike}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-orange-600 backdrop-blur-sm transition-colors"
          >
            <Download className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 信息 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
          {page.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {page.description}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {page.tags && Array.isArray(page.tags) && page.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {page.tags && Array.isArray(page.tags) && page.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{page.tags.length - 3}
            </span>
          )}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {page.views}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {page.downloads}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {page.likes}
            </span>
          </div>
          <span className="text-orange-600 font-medium">{page.category || page.categoryName || t('search.defaultCategory')}</span>
        </div>
      </div>
    </Link>
  );
} 