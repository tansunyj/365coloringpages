'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, SortAsc, Download, Heart, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 涂色页面数据接口
interface ColoringPage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  categorySlug: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  downloads: number;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'popular' | 'downloads'>('relevance');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [error, setError] = useState('');

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 搜索函数
  const searchPages = useCallback(async (searchQuery: string, page: number = 1, isLoadMore = false) => {
    if (!searchQuery.trim()) return;

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

      const response = await fetch(`/api/search?${params}`);
      const data: SearchResponse = await response.json();

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
        // 只有在真正的API错误时才设置错误状态
        if (response.status >= 500) {
          setError('搜索失败，请重试');
        } else {
          // 其他情况（如参数错误等）仍然显示空结果，不设置错误
          setPages([]);
          setTotalCount(0);
          setHasNextPage(false);
          setCurrentPage(1);
          setError(''); // 确保清除错误状态
        }
      }
    } catch (error) {
      console.error('搜索错误:', error);
      setError('网络错误，请检查网络连接');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [sortBy, categoryFilter]);

  // 初始搜索
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      searchPages(query, 1, false);
    }
  }, [query, searchPages]);

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
                placeholder="搜索涂色页面..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                搜索
              </button>
            </div>
          </form>

          {/* 搜索结果信息和筛选 */}
          {query && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-gray-600">
                {isLoading ? (
                  <span>搜索中...</span>
                ) : (
                  <span>
                                         为 &ldquo;<strong className="text-gray-900">{query}</strong>&rdquo; 找到 <strong>{totalCount}</strong> 个结果
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
                  >
                    <option value="all">所有分类</option>
                    <option value="动物">动物</option>
                    <option value="童话">童话</option>
                    <option value="幻想">幻想</option>
                    <option value="交通工具">交通工具</option>
                    <option value="自然">自然</option>
                    <option value="史前动物">史前动物</option>
                    <option value="太空">太空</option>
                    <option value="海洋">海洋</option>
                    <option value="节日">节日</option>
                    <option value="超级英雄">超级英雄</option>
                    <option value="食物">食物</option>
                    <option value="魔法">魔法</option>
                    <option value="农场">农场</option>
                    <option value="庆祝">庆祝</option>
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
                    <option value="relevance">相关性</option>
                    <option value="newest">最新</option>
                    <option value="popular">最受欢迎</option>
                    <option value="downloads">下载量</option>
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
              重试
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">搜索中...</p>
          </div>
        ) : pages.length > 0 ? (
          <>
            {/* 搜索结果网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pages.map((page) => (
                <SearchResultCard key={page.id} page={page} searchQuery={query} />
              ))}
            </div>

            {/* 加载更多触发器 */}
            <div ref={loadMoreRef} className="mt-8 text-center">
              {isLoadingMore && (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">加载更多...</p>
                </div>
              )}
              {!hasNextPage && pages.length > 0 && (
                <p className="text-gray-500 py-8">已显示全部结果</p>
              )}
            </div>
          </>
        ) : query && !isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关结果</h3>
              <p>试试其他关键词，或浏览我们的分类页面</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Link
                href="/categories"
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                浏览分类
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        ) : !query && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索</h3>
            <p className="text-gray-500">输入关键词查找你喜欢的涂色页面</p>
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
function SearchResultCard({ page, searchQuery }: { page: ColoringPage; searchQuery: string }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    // 这里可以调用API记录点赞
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // 这里可以调用下载API
    console.log('下载:', page.title);
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
    const index = category.length % colors.length;
    return colors[index];
  };

  return (
    <Link
      href={`/categories/${page.categorySlug}/${page.id}?from=search&q=${encodeURIComponent(searchQuery)}`}
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
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(page.category)}`}>
            {page.category}
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
          {page.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {page.tags.length > 3 && (
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
          <span className="text-orange-600 font-medium">{page.category}</span>
        </div>
      </div>
    </Link>
  );
} 