'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ThemeParkListCard from '../../components/ThemeParkListCard';

export default function ThemeParkPageClient() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParks, setSelectedParks] = useState<string[]>([]);
  const [displayedItems, setDisplayedItems] = useState(24); // 初始显示数量
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 主题公园列表
  const themeParks = [
    'Disney World', 'Universal Studios', 'Six Flags', 
    'Cedar Point', 'Knott\'s Berry Farm', 'Busch Gardens', 
    'SeaWorld', 'Legoland', 'Adventure Island'
  ];

  // 将URL slug转换为显示名称
  const getDisplayNameFromSlug = (slug: string) => {
    const slugToName: { [key: string]: string } = {
      'disney-world': 'Disney World',
      'universal-studios': 'Universal Studios',
      'six-flags': 'Six Flags',
      'cedar-point': 'Cedar Point',
      'knotts-berry-farm': 'Knott\'s Berry Farm',
      'busch-gardens': 'Busch Gardens',
      'seaworld': 'SeaWorld',
      'legoland': 'Legoland',
      'adventure-island': 'Adventure Island'
    };
    return slugToName[slug] || slug;
  };

  // 处理URL参数，设置初始选中的主题公园
  useEffect(() => {
    const parkParam = searchParams.get('park');
    if (parkParam) {
      const parkName = getDisplayNameFromSlug(parkParam);
      if (themeParks.includes(parkName)) {
        setSelectedParks([parkName]);
      }
    }
  }, [searchParams]);

  // 主题公园涂色页面数据类型定义
  interface ThemeParkColoringPage {
    id: number;
    title: string;
    park: string;
    likes: number;
    downloads: number;
  }
  
  // 主题公园涂色页面数据状态
  const [allColoringPages, setAllColoringPages] = useState<ThemeParkColoringPage[]>([]);
  
  // 获取主题公园涂色页面数据
  useEffect(() => {
    const fetchThemeParkPages = async () => {
      try {
        
        // 调用真实的主题公园API
        const { api } = await import('../../lib/apiClient');
        const response = await api.themeParks.list();
        
        if (response.success && response.data && Array.isArray(response.data.pages)) {
          
          // 转换API数据为组件需要的格式
          const formattedPages = response.data.pages.map((page: {
            id: number;
            title: string;
            themePark?: string;
            theme?: string;
            likes?: number;
            downloads?: number;
            thumbnailUrl?: string;
            categoryName?: string;
            difficulty?: string;
            ageRange?: string;
          }) => ({
            id: page.id,
            title: page.title,
            park: page.themePark || page.theme || 'Theme Park Adventure',
            likes: page.likes || 0,
            downloads: page.downloads || 0,
            thumbnailUrl: page.thumbnailUrl,
            categoryName: page.categoryName || 'Theme Parks',
            difficulty: page.difficulty || 'medium',
            ageRange: page.ageRange || '6-12岁'
          }));
          
          setAllColoringPages(formattedPages);
        } else {
          setAllColoringPages([]);
        }
      } catch (error) {
        console.error('❌ 获取主题公园涂色页面数据失败:', error);
        setAllColoringPages([]);
      }
    };
    
    fetchThemeParkPages();
  }, []);
  
  // 原有的硬编码数据已移除，现在使用动态获取的数据

  // 处理主题公园多选
  const handleParkChange = (park: string) => {
    if (park === 'All') {
      setSelectedParks(['All']);
    } else {
      setSelectedParks(prev => {
        const newSelection = prev.filter(p => p !== 'All');
        if (newSelection.includes(park)) {
          const filtered = newSelection.filter(p => p !== park);
          return filtered.length === 0 ? ['All'] : filtered;
        } else {
          return [...newSelection, park];
        }
      });
    }
  };

  // 过滤逻辑
  const filteredPages = allColoringPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPark = selectedParks.includes('All') || selectedParks.includes(page.park);
    return matchesSearch && matchesPark;
  });

  // 分页显示
  const displayedPages = filteredPages.slice(0, displayedItems);
  const hasMore = displayedItems < filteredPages.length;

  // 加载更多
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      setTimeout(() => {
        setDisplayedItems(prev => prev + 12);
        setIsLoading(false);
      }, 500);
    }
  };

  // 无限滚动
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  // 重置分页当筛选条件改变时
  useEffect(() => {
    setDisplayedItems(24);
  }, [searchTerm, selectedParks]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-yellow-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Theme Park Adventures</span>
        </nav>

        {/* 页面标题和描述 */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Theme Park Adventures
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl leading-relaxed">
            Discover magical coloring pages inspired by the world&apos;s most exciting theme parks. From Disney magic to thrilling roller coasters!
          </p>
        </div>

        {/* 搜索框 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for theme park coloring pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder-gray-500"
              style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        {/* 主题公园筛选 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-gray-800 font-bold whitespace-nowrap">Theme Parks:</span>
            <div className="flex flex-wrap gap-3">
              {themeParks.map(park => (
                <label
                  key={park}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedParks.includes(park)}
                    onChange={() => handleParkChange(park)}
                    className="w-4 h-4 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700 select-none">
                    {park}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>


        {/* 涂色页面网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedPages.map((page) => (
            <ThemeParkListCard
              key={`${page.park}-${page.id}`}
              id={page.id}
              title={page.title}
              park={page.park}
              likes={page.likes}
              downloads={page.downloads}
            />
          ))}
        </div>

        {/* 加载更多按钮 */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-gray-900 font-semibold py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}

        {/* 没有更多数据提示 */}
        {!hasMore && displayedPages.length > 0 && (
          <div className="flex justify-center mt-8">
            <p className="text-gray-500 text-sm">
              You&apos;ve reached the end of our theme park coloring collection!
            </p>
          </div>
        )}

        {/* 无结果提示 */}
        {filteredPages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or theme park filters.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 