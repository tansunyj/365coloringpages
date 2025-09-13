'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PopularColoringCard from '../../components/PopularColoringCard';
import { ChevronDown } from 'lucide-react';

export default function PopularPageClient() {
  const [activeFilter, setActiveFilter] = useState('Animals');
  const [sortBy, setSortBy] = useState('Popularity');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(24); // 初始显示24个项目（4行x6列）
  const [isLoading, setIsLoading] = useState(false);

  // 扩展模拟数据 - 更多的流行图片，足够显示多行
  // 注意：这些数据的ID和category必须与现有的详情页路由系统匹配
  const allColoringPages = [
    // Animals
    { id: 1, title: 'Cute Cat Face', category: 'Animals', likes: 245, downloads: 1250 },
    { id: 2, title: 'Majestic Lion', category: 'Animals', likes: 189, downloads: 980 },
    { id: 3, title: 'Wolf Portrait', category: 'Animals', likes: 234, downloads: 1180 },
    { id: 4, title: 'Eagle Soaring', category: 'Animals', likes: 198, downloads: 1050 },
    { id: 5, title: 'Playful Puppy', category: 'Animals', likes: 312, downloads: 1580 },
    { id: 6, title: 'Wise Owl', category: 'Animals', likes: 278, downloads: 1420 },
    { id: 7, title: 'Graceful Swan', category: 'Animals', likes: 195, downloads: 990 },
    { id: 8, title: 'Jumping Rabbit', category: 'Animals', likes: 267, downloads: 1340 },
    { id: 9, title: 'Proud Horse', category: 'Animals', likes: 289, downloads: 1480 },
    { id: 10, title: 'Colorful Parrot', category: 'Animals', likes: 203, downloads: 1120 },
    { id: 11, title: 'Swimming Fish', category: 'Animals', likes: 156, downloads: 820 },
    { id: 12, title: 'Dancing Bear', category: 'Animals', likes: 234, downloads: 1190 },
    { id: 13, title: 'Sleeping Fox', category: 'Animals', likes: 298, downloads: 1520 },
    { id: 14, title: 'Flying Butterfly', category: 'Animals', likes: 187, downloads: 950 },
    { id: 15, title: 'Curious Monkey', category: 'Animals', likes: 245, downloads: 1280 },
    { id: 16, title: 'Gentle Deer', category: 'Animals', likes: 212, downloads: 1080 },
    
         // Nature  
     { id: 1, title: 'Forest Path', category: 'Nature', likes: 156, downloads: 750 },
     { id: 2, title: 'Ocean Wave', category: 'Nature', likes: 203, downloads: 1100 },
     { id: 3, title: 'Butterfly Garden', category: 'Nature', likes: 165, downloads: 820 },
     { id: 4, title: 'Mountain Landscape', category: 'Nature', likes: 145, downloads: 720 },
     { id: 5, title: 'Flower Bouquet', category: 'Nature', likes: 187, downloads: 940 },
     { id: 6, title: 'Sunset Beach', category: 'Nature', likes: 298, downloads: 1580 },
     { id: 7, title: 'Cherry Blossoms', category: 'Nature', likes: 345, downloads: 1720 },
     { id: 8, title: 'Tropical Paradise', category: 'Nature', likes: 267, downloads: 1380 },
     { id: 9, title: 'Autumn Leaves', category: 'Nature', likes: 198, downloads: 1020 },
     { id: 10, title: 'Desert Cactus', category: 'Nature', likes: 156, downloads: 780 },
     { id: 11, title: 'Snowy Mountains', category: 'Nature', likes: 234, downloads: 1190 },
     { id: 12, title: 'Rainforest Canopy', category: 'Nature', likes: 289, downloads: 1450 },
     { id: 13, title: 'Peaceful Lake', category: 'Nature', likes: 176, downloads: 890 },
     { id: 14, title: 'Wildflower Meadow', category: 'Nature', likes: 223, downloads: 1140 },
     { id: 15, title: 'Starry Night Sky', category: 'Nature', likes: 312, downloads: 1620 },
     { id: 16, title: 'Rolling Hills', category: 'Nature', likes: 198, downloads: 1010 },

         // Abstract
     { id: 1, title: 'Geometric Pattern', category: 'Abstract', likes: 134, downloads: 650 },
     { id: 2, title: 'Mandala Circle', category: 'Abstract', likes: 178, downloads: 890 },
     { id: 3, title: 'Spiral Design', category: 'Abstract', likes: 123, downloads: 580 },
     { id: 4, title: 'Celtic Knot', category: 'Abstract', likes: 156, downloads: 780 },
     { id: 5, title: 'Zen Patterns', category: 'Abstract', likes: 267, downloads: 1350 },
     { id: 6, title: 'Kaleidoscope', category: 'Abstract', likes: 298, downloads: 1490 },
     { id: 7, title: 'Fractal Art', category: 'Abstract', likes: 189, downloads: 920 },
     { id: 8, title: 'Sacred Geometry', category: 'Abstract', likes: 234, downloads: 1170 },
     { id: 9, title: 'Tribal Patterns', category: 'Abstract', likes: 156, downloads: 790 },
     { id: 10, title: 'Mosaic Design', category: 'Abstract', likes: 203, downloads: 1040 },
     { id: 11, title: 'Optical Illusion', category: 'Abstract', likes: 278, downloads: 1420 },
     { id: 12, title: 'Art Deco Style', category: 'Abstract', likes: 198, downloads: 1000 },
     { id: 13, title: 'Psychedelic Swirls', category: 'Abstract', likes: 245, downloads: 1260 },
     { id: 14, title: 'Minimalist Lines', category: 'Abstract', likes: 167, downloads: 850 },
     { id: 15, title: 'Complex Mandala', category: 'Abstract', likes: 312, downloads: 1580 },
     { id: 16, title: 'Geometric Flowers', category: 'Abstract', likes: 189, downloads: 950 },

         // Fantasy
     { id: 1, title: 'Dragon Castle', category: 'Fantasy', likes: 267, downloads: 1400 },
     { id: 2, title: 'Unicorn Dreams', category: 'Fantasy', likes: 298, downloads: 1600 },
     { id: 3, title: 'Fairy Tale Castle', category: 'Fantasy', likes: 276, downloads: 1350 },
     { id: 4, title: 'Magic Forest', category: 'Fantasy', likes: 345, downloads: 1750 },
     { id: 5, title: 'Phoenix Rising', category: 'Fantasy', likes: 289, downloads: 1480 },
     { id: 6, title: 'Mermaid Kingdom', category: 'Fantasy', likes: 267, downloads: 1380 },
     { id: 7, title: 'Wizard Tower', category: 'Fantasy', likes: 234, downloads: 1190 },
     { id: 8, title: 'Enchanted Garden', category: 'Fantasy', likes: 298, downloads: 1520 },
     { id: 9, title: 'Crystal Cave', category: 'Fantasy', likes: 198, downloads: 1020 },
     { id: 10, title: 'Flying Pegasus', category: 'Fantasy', likes: 312, downloads: 1620 },
     { id: 11, title: 'Magical Potion', category: 'Fantasy', likes: 156, downloads: 810 },
     { id: 12, title: 'Fairy Wings', category: 'Fantasy', likes: 223, downloads: 1150 },
     { id: 13, title: 'Dragon Egg', category: 'Fantasy', likes: 278, downloads: 1430 },
     { id: 14, title: 'Mystical Portal', category: 'Fantasy', likes: 189, downloads: 980 },
     { id: 15, title: 'Elven City', category: 'Fantasy', likes: 245, downloads: 1270 },
     { id: 16, title: 'Magic Wand', category: 'Fantasy', likes: 167, downloads: 870 },
  ];

  const categories = ['Animals', 'Nature', 'Abstract', 'Fantasy'];
  const sortOptions = ['Popularity', 'Latest', 'Most Liked'];

  // 根据活跃筛选器过滤页面
  const filteredPages = allColoringPages.filter(page => page.category === activeFilter);

  // 根据排序选项排序
  const sortedPages = [...filteredPages].sort((a, b) => {
    switch (sortBy) {
      case 'Popularity':
        return b.downloads - a.downloads;
      case 'Latest':
        return b.id - a.id; // 假设ID越大越新
      case 'Most Liked':
        return b.likes - a.likes;
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
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        // 当距离页面底部1000px时开始加载
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]); // 依赖于加载状态和是否还有更多数据

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题和描述 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Popular Coloring Pages</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the most downloaded and viewed coloring pages by our community.
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
                    ? 'bg-orange-500 text-white shadow-md'
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
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sort by: {sortBy}
              <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
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
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      sortBy === option ? 'text-orange-500 bg-orange-50' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 图片网格 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {displayedPages.map((page) => (
              <PopularColoringCard
                key={page.id}
                id={page.id}
                title={page.title}
                category={page.category}
                likes={page.likes}
                downloads={page.downloads}
              />
            ))}
          </div>
          
          {/* Load More 按钮 */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </div>

        {/* 显示统计信息 */}
        {!hasMore && displayedPages.length > 0 && (
          <div className="flex justify-center mt-8">
            <p className="text-gray-500 text-sm">
              loading more coloring pages
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 