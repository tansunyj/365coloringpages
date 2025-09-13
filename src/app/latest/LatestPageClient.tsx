'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LatestColoringCard from '../../components/LatestColoringCard';
import { ChevronDown } from 'lucide-react';

export default function LatestPageClient() {
  const [activeFilter, setActiveFilter] = useState('Abstract');
  const [sortBy, setSortBy] = useState('Latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(24); // 初始显示24个项目（4行×6列）
  const [isLoading, setIsLoading] = useState(false);

  // 扩展模拟数据 - 最新上传的图片，足够显示多行
  // 注意：这些数据的ID和category必须与现有的详情页路由系统匹配
  const allColoringPages = [
    // Abstract - 最新上传的抽象艺术
    { id: 1, title: 'Modern Art Fusion', category: 'Abstract', likes: 134, downloads: 650, uploadDate: '2024-01-15' },
    { id: 2, title: 'Digital Mandala', category: 'Abstract', likes: 178, downloads: 890, uploadDate: '2024-01-14' },
    { id: 3, title: 'Geometric Dreams', category: 'Abstract', likes: 123, downloads: 580, uploadDate: '2024-01-13' },
    { id: 4, title: 'Flowing Patterns', category: 'Abstract', likes: 156, downloads: 780, uploadDate: '2024-01-12' },
    { id: 5, title: 'Color Burst', category: 'Abstract', likes: 267, downloads: 1350, uploadDate: '2024-01-11' },
    { id: 6, title: 'Zen Circles', category: 'Abstract', likes: 298, downloads: 1490, uploadDate: '2024-01-10' },
    { id: 7, title: 'Psychedelic Waves', category: 'Abstract', likes: 189, downloads: 920, uploadDate: '2024-01-09' },
    { id: 8, title: 'Sacred Symbols', category: 'Abstract', likes: 234, downloads: 1170, uploadDate: '2024-01-08' },
    { id: 9, title: 'Tribal Art', category: 'Abstract', likes: 156, downloads: 790, uploadDate: '2024-01-07' },
    { id: 10, title: 'Mosaic Magic', category: 'Abstract', likes: 203, downloads: 1040, uploadDate: '2024-01-06' },
    { id: 11, title: 'Optical Wonder', category: 'Abstract', likes: 278, downloads: 1420, uploadDate: '2024-01-05' },
    { id: 12, title: 'Art Deco Revival', category: 'Abstract', likes: 198, downloads: 1000, uploadDate: '2024-01-04' },
    { id: 13, title: 'Swirling Colors', category: 'Abstract', likes: 245, downloads: 1260, uploadDate: '2024-01-03' },
    { id: 14, title: 'Minimalist Beauty', category: 'Abstract', likes: 167, downloads: 850, uploadDate: '2024-01-02' },
    { id: 15, title: 'Complex Geometry', category: 'Abstract', likes: 312, downloads: 1580, uploadDate: '2024-01-01' },
    { id: 16, title: 'Floral Abstraction', category: 'Abstract', likes: 189, downloads: 950, uploadDate: '2023-12-31' },

    // Technology - 最新科技主题
    { id: 1, title: 'Robot Friends', category: 'Technology', likes: 245, downloads: 1250, uploadDate: '2024-01-15' },
    { id: 2, title: 'Space Station', category: 'Technology', likes: 189, downloads: 980, uploadDate: '2024-01-14' },
    { id: 3, title: 'Cyber City', category: 'Technology', likes: 234, downloads: 1180, uploadDate: '2024-01-13' },
    { id: 4, title: 'Flying Cars', category: 'Technology', likes: 198, downloads: 1050, uploadDate: '2024-01-12' },
    { id: 5, title: 'AI Companion', category: 'Technology', likes: 312, downloads: 1580, uploadDate: '2024-01-11' },
    { id: 6, title: 'Virtual Reality', category: 'Technology', likes: 278, downloads: 1420, uploadDate: '2024-01-10' },
    { id: 7, title: 'Drone Adventure', category: 'Technology', likes: 195, downloads: 990, uploadDate: '2024-01-09' },
    { id: 8, title: 'Smart Home', category: 'Technology', likes: 267, downloads: 1340, uploadDate: '2024-01-08' },
    { id: 9, title: 'Hologram Display', category: 'Technology', likes: 289, downloads: 1480, uploadDate: '2024-01-07' },
    { id: 10, title: 'Digital Pet', category: 'Technology', likes: 203, downloads: 1120, uploadDate: '2024-01-06' },
    { id: 11, title: 'Quantum Computer', category: 'Technology', likes: 156, downloads: 820, uploadDate: '2024-01-05' },
    { id: 12, title: 'Nano Machines', category: 'Technology', likes: 234, downloads: 1190, uploadDate: '2024-01-04' },
    { id: 13, title: 'Time Machine', category: 'Technology', likes: 298, downloads: 1520, uploadDate: '2024-01-03' },
    { id: 14, title: 'Solar Panels', category: 'Technology', likes: 187, downloads: 950, uploadDate: '2024-01-02' },
    { id: 15, title: 'Electric Car', category: 'Technology', likes: 245, downloads: 1280, uploadDate: '2024-01-01' },
    { id: 16, title: 'Satellite Network', category: 'Technology', likes: 212, downloads: 1080, uploadDate: '2023-12-31' },

    // Architecture - 最新建筑主题
    { id: 1, title: 'Modern Skyscraper', category: 'Architecture', likes: 156, downloads: 750, uploadDate: '2024-01-15' },
    { id: 2, title: 'Ancient Temple', category: 'Architecture', likes: 203, downloads: 1100, uploadDate: '2024-01-14' },
    { id: 3, title: 'Bridge Design', category: 'Architecture', likes: 165, downloads: 820, uploadDate: '2024-01-13' },
    { id: 4, title: 'Cathedral Spires', category: 'Architecture', likes: 145, downloads: 720, uploadDate: '2024-01-12' },
    { id: 5, title: 'Lighthouse Tower', category: 'Architecture', likes: 187, downloads: 940, uploadDate: '2024-01-11' },
    { id: 6, title: 'Castle Fortress', category: 'Architecture', likes: 298, downloads: 1580, uploadDate: '2024-01-10' },
    { id: 7, title: 'Pagoda Structure', category: 'Architecture', likes: 345, downloads: 1720, uploadDate: '2024-01-09' },
    { id: 8, title: 'Glass Pyramid', category: 'Architecture', likes: 267, downloads: 1380, uploadDate: '2024-01-08' },
    { id: 9, title: 'Opera House', category: 'Architecture', likes: 198, downloads: 1020, uploadDate: '2024-01-07' },
    { id: 10, title: 'Wind Mill', category: 'Architecture', likes: 156, downloads: 780, uploadDate: '2024-01-06' },
    { id: 11, title: 'Observatory Dome', category: 'Architecture', likes: 234, downloads: 1190, uploadDate: '2024-01-05' },
    { id: 12, title: 'Spiral Staircase', category: 'Architecture', likes: 289, downloads: 1450, uploadDate: '2024-01-04' },
    { id: 13, title: 'Garden Pavilion', category: 'Architecture', likes: 176, downloads: 890, uploadDate: '2024-01-03' },
    { id: 14, title: 'Art Museum', category: 'Architecture', likes: 223, downloads: 1140, uploadDate: '2024-01-02' },
    { id: 15, title: 'Space Needle', category: 'Architecture', likes: 312, downloads: 1620, uploadDate: '2024-01-01' },
    { id: 16, title: 'Gothic Church', category: 'Architecture', likes: 198, downloads: 1010, uploadDate: '2023-12-31' },

    // Seasonal - 最新季节主题
    { id: 1, title: 'Winter Snowflake', category: 'Seasonal', likes: 267, downloads: 1400, uploadDate: '2024-01-15' },
    { id: 2, title: 'Spring Blossoms', category: 'Seasonal', likes: 298, downloads: 1600, uploadDate: '2024-01-14' },
    { id: 3, title: 'Summer Beach', category: 'Seasonal', likes: 276, downloads: 1350, uploadDate: '2024-01-13' },
    { id: 4, title: 'Autumn Harvest', category: 'Seasonal', likes: 345, downloads: 1750, uploadDate: '2024-01-12' },
    { id: 5, title: 'Christmas Tree', category: 'Seasonal', likes: 289, downloads: 1480, uploadDate: '2024-01-11' },
    { id: 6, title: 'Halloween Pumpkin', category: 'Seasonal', likes: 267, downloads: 1380, uploadDate: '2024-01-10' },
    { id: 7, title: 'Easter Egg', category: 'Seasonal', likes: 234, downloads: 1190, uploadDate: '2024-01-09' },
    { id: 8, title: 'Valentine Heart', category: 'Seasonal', likes: 298, downloads: 1520, uploadDate: '2024-01-08' },
    { id: 9, title: 'New Year Fireworks', category: 'Seasonal', likes: 198, downloads: 1020, uploadDate: '2024-01-07' },
    { id: 10, title: 'Thanksgiving Turkey', category: 'Seasonal', likes: 312, downloads: 1620, uploadDate: '2024-01-06' },
    { id: 11, title: 'Fourth of July', category: 'Seasonal', likes: 156, downloads: 810, uploadDate: '2024-01-05' },
    { id: 12, title: 'Mother&apos;s Day Flowers', category: 'Seasonal', likes: 223, downloads: 1150, uploadDate: '2024-01-04' },
    { id: 13, title: 'Father&apos;s Day Card', category: 'Seasonal', likes: 278, downloads: 1430, uploadDate: '2024-01-03' },
    { id: 14, title: 'Back to School', category: 'Seasonal', likes: 189, downloads: 980, uploadDate: '2024-01-02' },
    { id: 15, title: 'Summer Vacation', category: 'Seasonal', likes: 245, downloads: 1270, uploadDate: '2024-01-01' },
    { id: 16, title: 'Winter Holiday', category: 'Seasonal', likes: 167, downloads: 870, uploadDate: '2023-12-31' },
  ];

  const categories = ['Abstract', 'Technology', 'Architecture', 'Seasonal'];
  const sortOptions = ['Latest', 'Most Liked', 'Most Downloaded'];

  // 根据活跃筛选器过滤页面
  const filteredPages = allColoringPages.filter(page => page.category === activeFilter);

  // 根据排序选项排序
  const sortedPages = [...filteredPages].sort((a, b) => {
    switch (sortBy) {
      case 'Latest':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case 'Most Liked':
        return b.likes - a.likes;
      case 'Most Downloaded':
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  // 当前显示的页面（限制显示数量）
  const displayedPages = sortedPages.slice(0, displayedItems);

  // 检查是否还有更多数据
  const hasMore = sortedPages.length > displayedItems;

  // 加载更多数据的函数
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      // 模拟加载延迟
      setTimeout(() => {
        setDisplayedItems(prev => prev + 12); // 每次加载12个更多项目（2行）
        setIsLoading(false);
      }, 500);
    }
  };

  // 当筛选器改变时重置显示数量
  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    setDisplayedItems(24); // 重置为初始显示数量
  };

  // 滚动加载更多的功能
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 && hasMore && !isLoading) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题和描述 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Uploads</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the newest coloring pages fresh from our creative community.
          </p>
        </div>

        {/* 过滤器和排序 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          
          {/* 分类过滤器 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 排序下拉菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Sort by: {sortBy}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 结果计数 */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {displayedPages.length} of {sortedPages.length} results in {activeFilter}
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {displayedPages.map((page) => (
            <LatestColoringCard
              key={`${page.category}-${page.id}`}
              id={page.id}
              title={page.title}
              category={page.category}
              likes={page.likes}
              downloads={page.downloads}
            />
          ))}
        </div>

        {/* 加载更多按钮和状态 */}
        <div className="text-center">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-600">Loading more...</span>
            </div>
          )}
          
          {!isLoading && hasMore && (
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Load More
            </button>
          )}
          
          {!hasMore && sortedPages.length > 0 && (
            <p className="text-gray-500 py-8">
              You&apos;ve reached the end! No more {activeFilter.toLowerCase()} coloring pages to show.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
} 