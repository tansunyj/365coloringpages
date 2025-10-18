'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SortAsc, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

// 通用搜索结果项接�?
export interface SearchResultItem {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl: string;
  category?: string;
  categorySlug?: string;
  categoryName?: string;
  categoryColor?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  downloads?: number;
  likes?: number;
  views?: number;
  ageRange?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown; // 允许额外的字�?
}

// 搜索API响应接口
export interface SearchApiResponse {
  success: boolean;
  data: {
    items?: SearchResultItem[];
    pages?: SearchResultItem[];
    coloringPages?: SearchResultItem[];
    totalCount: number;
    currentPage: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasMore?: boolean;
  };
  message?: string;
}

// 筛选选项接口
export interface FilterOption {
  value: string;
  label: string;
  count?: number; // 可选的计数
}

// Checkbox 筛选组接口
export interface CheckboxFilterGroup {
  key: string; // 筛选键名，�?'tags', 'difficulty', 'ageRange'
  title: string; // 显示标题
  options: FilterOption[];
  multiple?: boolean; // 是否支持多选，默认 true
  collapsible?: boolean; // 是否可折叠，默认 true
  defaultExpanded?: boolean; // 默认是否展开，默�?true
  showCount?: boolean; // 是否显示选项计数，默�?false
}

// 页面标题配置接口
export interface TitleConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  centerTitle?: boolean;
  customTitleComponent?: React.ReactNode; // 自定义标题组�?
}

// 搜索配置接口
export interface SearchConfig {
  // API配置
  apiEndpoint: (params: SearchParams) => Promise<SearchApiResponse>;
  
  // 搜索参数
  defaultSort?: string;
  defaultCategory?: string;
  pageSize?: number;
  
  // 右上角筛选选项
  sortOptions?: FilterOption[];
  categoryOptions?: FilterOption[];
  difficultyOptions?: FilterOption[];
  ageRangeOptions?: FilterOption[];
  customFilters?: { [key: string]: FilterOption[] }; // 自定义筛选项
  
  // 左侧 Checkbox 筛�?
  checkboxFilters?: CheckboxFilterGroup[];
  
  // 显示配置
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showSortFilter?: boolean;
  showDifficultyFilter?: boolean;
  showAgeRangeFilter?: boolean;
  showCheckboxFilters?: boolean; // 是否显示左侧筛�?
  autoLoadOnMount?: boolean; // 是否在组件挂载时自动加载数据
  
  // 布局配置
  useLeftSidebar?: boolean; // 是否使用左侧边栏布局
  gridCols?: string; // Tailwind classes like "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  
  // 页面标题配置
  titleConfig?: TitleConfig;
  
  // 自定义组�?
  renderItem?: (item: SearchResultItem, searchQuery?: string, searchParams?: URLSearchParams, allItems?: SearchResultItem[]) => React.ReactNode;
  
  // 兼容性：保留旧的标题字段
  title?: string;
  description?: string;
  centerTitle?: boolean;
}

// 搜索参数接口
export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  difficulty?: string;
  ageRange?: string;
  [key: string]: unknown;
}

interface UniversalSearchComponentProps {
  config: SearchConfig;
  initialQuery?: string;
  className?: string;
}

export default function UniversalSearchComponent({ 
  config, 
  initialQuery = '', 
  className = '' 
}: UniversalSearchComponentProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // 搜索状�?
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  
  // 分页状�?
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  // 筛选状�?
  const [sortBy, setSortBy] = useState(config.defaultSort || 'relevance');
  const [categoryFilter, setCategoryFilter] = useState(config.defaultCategory || 'all');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [ageRangeFilter, setAgeRangeFilter] = useState('');
  
  // Checkbox 筛选状�?
  const [checkboxFilters, setCheckboxFilters] = useState<{ [key: string]: string[] }>({});
  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({});
  
  // 自定义筛选状�?
  const [customFilters, setCustomFilters] = useState<{ [key: string]: string }>({});
  
  // 无限滚动
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 客户端检�?
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始�?checkbox 筛选状�?
  useEffect(() => {
    if (config.checkboxFilters) {
      const initialCheckboxFilters: { [key: string]: string[] } = {};
      const initialExpandedFilters: { [key: string]: boolean } = {};
      
      config.checkboxFilters.forEach(group => {
        initialCheckboxFilters[group.key] = [];
        initialExpandedFilters[group.key] = group.defaultExpanded !== false;
      });
      
      setCheckboxFilters(initialCheckboxFilters);
      setExpandedFilters(initialExpandedFilters);
    }
  }, [config.checkboxFilters]);

  // 从URL参数初始化状�?
  useEffect(() => {
    if (isClient && searchParams) {
      const query = searchParams.get('q') || initialQuery;
      const category = searchParams.get('category') || config.defaultCategory || 'all';
      const sort = searchParams.get('sort') || config.defaultSort || 'relevance';
      const difficulty = searchParams.get('difficulty') || '';
      const ageRange = searchParams.get('ageRange') || '';
      const page = parseInt(searchParams.get('page') || '1', 10);
      
      setSearchQuery(query);
      setCategoryFilter(category);
      setSortBy(sort);
      setDifficultyFilter(difficulty);
      setAgeRangeFilter(ageRange);
      setCurrentPage(page);
      
      // 从URL初始�?checkbox 筛�?
      if (config.checkboxFilters) {
        const urlCheckboxFilters: { [key: string]: string[] } = {};
        config.checkboxFilters.forEach(group => {
          const value = searchParams.get(group.key);
          urlCheckboxFilters[group.key] = value ? value.split(',') : [];
        });
        setCheckboxFilters(urlCheckboxFilters);
      }
      
      // 从URL初始化自定义筛�?
      if (config.customFilters) {
        const urlCustomFilters: { [key: string]: string } = {};
        Object.keys(config.customFilters).forEach(key => {
          urlCustomFilters[key] = searchParams.get(key) || '';
        });
        setCustomFilters(urlCustomFilters);
      }
    }
  }, [isClient, searchParams, initialQuery, config.defaultCategory, config.defaultSort, config.checkboxFilters, config.customFilters]);

  // 搜索函数
  const searchItems = useCallback(async (query: string, page: number = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError('');
      }

      const params: SearchParams = {
        q: query || undefined,
        page,
        limit: config.pageSize || 12,
        sort: undefined, // 搜索接口不需�?sort 参数
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        difficulty: difficultyFilter || undefined,
        ageRange: ageRangeFilter || undefined,
      };

      // 添加 checkbox 筛选参�?
      Object.entries(checkboxFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          params[key] = values.join(',');
        }
      });

      // 添加自定义筛选参�?
      Object.entries(customFilters).forEach(([key, value]) => {
        if (value) {
          params[key] = value;
        }
      });

      // 过滤掉空�?
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
      );

      const response = await config.apiEndpoint(filteredParams);
      
      if (!response || !response.success) {
        throw new Error('Search failed');
      }

      // 处理不同的响应数据结�?
      let itemsArray: SearchResultItem[] = [];
      if (response.data.items) {
        itemsArray = response.data.items;
      } else if (response.data.pages) {
        itemsArray = response.data.pages;
      } else if (response.data.coloringPages) {
        itemsArray = response.data.coloringPages;
      }

      if (isLoadMore) {
        setItems(prev => [...prev, ...itemsArray]);
      } else {
        setItems(itemsArray);
        setCurrentPage(1);
      }
      
      setTotalCount(response.data.totalCount);
      setHasNextPage(response.data.hasNextPage || response.data.hasMore || false);
      setCurrentPage(response.data.currentPage || page);
      setError('');
      
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [sortBy, categoryFilter, difficultyFilter, ageRangeFilter, checkboxFilters, customFilters, config.apiEndpoint, config.pageSize]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || categoryFilter !== 'all' || Object.values(checkboxFilters).some(arr => arr.length > 0)) {
      searchItems(searchQuery, 1, false);
    }
  };

  // 当筛选条件变化时重新搜索
  useEffect(() => {
    if (isClient && (searchQuery || categoryFilter !== 'all' || Object.values(checkboxFilters).some(arr => arr.length > 0) || config.autoLoadOnMount)) {
      searchItems(searchQuery, 1, false);
    }
  }, [sortBy, categoryFilter, difficultyFilter, ageRangeFilter, checkboxFilters, customFilters, isClient, searchQuery, searchItems, config.autoLoadOnMount]);

  // 处理 checkbox 筛选变�?
  const handleCheckboxChange = (groupKey: string, optionValue: string, checked: boolean) => {
    setCheckboxFilters(prev => {
      const group = config.checkboxFilters?.find(g => g.key === groupKey);
      const isMultiple = group?.multiple !== false;
      
      if (isMultiple) {
        // 多选模�?
        const currentValues = prev[groupKey] || [];
        if (checked) {
          return {
            ...prev,
            [groupKey]: [...currentValues, optionValue]
          };
        } else {
          return {
            ...prev,
            [groupKey]: currentValues.filter(v => v !== optionValue)
          };
        }
      } else {
        // 单选模�?
        return {
          ...prev,
          [groupKey]: checked ? [optionValue] : []
        };
      }
    });
  };

  // 切换筛选组展开状�?
  const toggleFilterExpanded = (groupKey: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // 清除所有筛�?
  const clearAllFilters = () => {
    setCheckboxFilters({});
    setCategoryFilter(config.defaultCategory || 'all');
    setSortBy(config.defaultSort || 'relevance');
    setDifficultyFilter('');
    setAgeRangeFilter('');
    setCustomFilters({});
  };

  // 加载更多
  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore && (searchQuery || categoryFilter !== 'all' || Object.values(checkboxFilters).some(arr => arr.length > 0))) {
      searchItems(searchQuery, currentPage + 1, true);
    }
  }, [hasNextPage, isLoadingMore, searchQuery, categoryFilter, checkboxFilters, currentPage, searchItems]);

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

  // 获取最终的标题配置（优先使用新配置，兼容旧配置�?
  const finalTitleConfig = config.titleConfig || {
    title: config.title,
    description: config.description,
    centerTitle: config.centerTitle
  };

  // 渲染左侧筛选栏
  const renderLeftSidebar = () => {
    if (!config.showCheckboxFilters || !config.checkboxFilters || config.checkboxFilters.length === 0) {
      return null;
    }

    return (
      <div className="w-64 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">筛选条�?/h3>
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            清除全部
          </button>
        </div>
        
        {config.checkboxFilters.map((group) => (
          <div key={group.key} className="mb-6 last:mb-0">
            {group.collapsible !== false ? (
              <button
                onClick={() => toggleFilterExpanded(group.key)}
                className="flex items-center justify-between w-full mb-3 text-left"
              >
                <span className="font-medium text-gray-700">{group.title}</span>
                {expandedFilters[group.key] ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>
            ) : (
              <h4 className="font-medium text-gray-700 mb-3">{group.title}</h4>
            )}
            
            {(group.collapsible === false || expandedFilters[group.key]) && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {group.options.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 text-sm">
                    <input
                      type={group.multiple === false ? "radio" : "checkbox"}
                      name={group.multiple === false ? group.key : undefined}
                      checked={checkboxFilters[group.key]?.includes(option.value) || false}
                      onChange={(e) => handleCheckboxChange(group.key, option.value, e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-gray-600 flex-1">{option.label}</span>
                    {group.showCount && option.count !== undefined && (
                      <span className="text-gray-400 text-xs">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        {(finalTitleConfig.title || finalTitleConfig.subtitle || finalTitleConfig.description || finalTitleConfig.customTitleComponent) && (
          <div className={`mb-8 ${finalTitleConfig.centerTitle ? 'text-center' : ''}`}>
          {finalTitleConfig.customTitleComponent || (
            <>
              {finalTitleConfig.title && (
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {finalTitleConfig.title}
                </h1>
              )}
              {finalTitleConfig.subtitle && (
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  {finalTitleConfig.subtitle}
                </h2>
              )}
              {finalTitleConfig.description && (
                <p className={`text-lg text-gray-600 ${finalTitleConfig.centerTitle ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
                  {finalTitleConfig.description}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* 搜索和筛选区�?*/}
      <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* 搜索�?*/}
        {config.showSearch !== false && (
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative w-full">
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
        )}

        {/* 结果信息和筛选选项 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* 左侧：结果信�?*/}
          <div className="text-gray-600">
            {isLoading ? (
              <span>{t('search.searching')}</span>
            ) : (
              <span>
                {searchQuery 
                  ? t('search.resultsFor').replace('{count}', items.length.toString()).replace('{query}', searchQuery)
                  : t('search.resultsFound').replace('{count}', items.length.toString())
                }
              </span>
            )}
          </div>
          
          {/* 右侧：筛选选项 */}
          <div className="flex flex-wrap gap-4">
          {/* 分类筛�?*/}
          {config.showCategoryFilter !== false && config.categoryOptions && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {config.categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 排序 */}
          {config.showSortFilter !== false && config.sortOptions && (
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {config.sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 难度筛�?*/}
          {config.showDifficultyFilter && config.difficultyOptions && (
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {config.difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {/* 年龄范围筛�?*/}
          {config.showAgeRangeFilter && config.ageRangeOptions && (
            <select
              value={ageRangeFilter}
              onChange={(e) => setAgeRangeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {config.ageRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {/* 自定义筛�?*/}
          {config.customFilters && Object.entries(config.customFilters).map(([key, options]) => (
            <select
              key={key}
              value={customFilters[key] || ''}
              onChange={(e) => setCustomFilters(prev => ({ ...prev, [key]: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">{key}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
          </div>
        </div>
      </div>

        {/* 主内容区�?*/}
        <div className={`mt-6 ${config.useLeftSidebar ? 'flex gap-8' : ''}`}>
        {/* 左侧筛选栏 */}
        {config.useLeftSidebar && renderLeftSidebar()}
        
        {/* 搜索结果内容 */}
        <div className="flex-1">
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={() => searchItems(searchQuery, 1, false)}
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
          ) : items && items.length > 0 ? (
            <>
              {/* 搜索结果网格 */}
              <div className={`grid gap-6 ${config.gridCols || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {items.map((item) => {
                  if (config.renderItem) {
                    return config.renderItem(item, searchQuery, searchParams, items);
                  }
                  
                  // 默认渲染
                  return (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 加载更多触发�?*/}
              <div ref={loadMoreRef} className="mt-8 text-center">
                {isLoadingMore && (
                  <div className="py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">{t('search.loadingMore')}</p>
                  </div>
                )}
                {!hasNextPage && items.length > 0 && (
                  <p className="text-gray-500 py-8">{t('search.allResultsShown')}</p>
                )}
              </div>
            </>
          ) : !isLoading && items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('search.noResults')}</h3>
                <p>{t('search.noResultsDescription')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('search.startSearching')}</h3>
              <p className="text-gray-500">{t('search.startSearchingDescription')}</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
} 