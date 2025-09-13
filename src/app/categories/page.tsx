'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoriesColoringCard from '../../components/CategoriesColoringCard';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Latest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['All']);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 模拟涂色页面数据 - 来自多个分类
  const coloringPages = [
    // Animals
    { id: 1, title: 'Cute Cat Line Art', category: 'Animals', style: 'Line Art', theme: 'Pets', size: 'A4', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=500&fit=crop', likes: 324, downloads: 1250, isPremium: false },
    { id: 2, title: 'Majestic Lion Portrait', category: 'Animals', style: 'Detailed', theme: 'Wild Animals', size: 'A4', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=500&fit=crop', likes: 567, downloads: 2100, isPremium: true },
    { id: 3, title: 'Bird on Branch', category: 'Animals', style: 'Simple', theme: 'Birds', size: 'Letter', image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=500&fit=crop', likes: 189, downloads: 890, isPremium: false },
    { id: 4, title: 'Elephant Family', category: 'Animals', style: 'Line Art', theme: 'Wild Animals', size: 'A4', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=500&fit=crop', likes: 445, downloads: 1650, isPremium: false },
    { id: 5, title: 'Tiger Head Design', category: 'Animals', style: 'Detailed', theme: 'Wild Animals', size: 'A3', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=500&fit=crop', likes: 789, downloads: 3200, isPremium: true },
    
    // Fantasy
    { id: 6, title: 'Dragon Castle', category: 'Fantasy', style: 'Detailed', theme: 'Dragons', size: 'A4', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=500&fit=crop', likes: 456, downloads: 1800, isPremium: false },
    { id: 7, title: 'Unicorn Dreams', category: 'Fantasy', style: 'Line Art', theme: 'Unicorns', size: 'A4', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop', likes: 678, downloads: 2300, isPremium: true },
    { id: 8, title: 'Magic Forest', category: 'Fantasy', style: 'Simple', theme: 'Nature Magic', size: 'Letter', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop', likes: 234, downloads: 1200, isPremium: false },
    
    // Nature
    { id: 9, title: 'Mountain Landscape', category: 'Nature', style: 'Line Art', theme: 'Mountains', size: 'A4', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop', likes: 345, downloads: 1450, isPremium: false },
    { id: 10, title: 'Ocean Waves', category: 'Nature', style: 'Detailed', theme: 'Ocean', size: 'A3', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=500&fit=crop', likes: 567, downloads: 2100, isPremium: true },
    { id: 11, title: 'Flower Garden', category: 'Nature', style: 'Simple', theme: 'Flowers', size: 'Letter', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=500&fit=crop', likes: 289, downloads: 1180, isPremium: false },
    
    // Abstract
    { id: 12, title: 'Geometric Pattern', category: 'Abstract', style: 'Line Art', theme: 'Geometric', size: 'A4', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop', likes: 234, downloads: 980, isPremium: false },
    { id: 13, title: 'Mandala Circle', category: 'Abstract', style: 'Detailed', theme: 'Mandala', size: 'A4', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop', likes: 445, downloads: 1650, isPremium: true },
    { id: 14, title: 'Spiral Design', category: 'Abstract', style: 'Simple', theme: 'Patterns', size: 'Letter', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=500&fit=crop', likes: 178, downloads: 720, isPremium: false },
    
    // Vehicles
    { id: 15, title: 'Classic Car', category: 'Vehicles', style: 'Line Art', theme: 'Cars', size: 'A4', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop', likes: 356, downloads: 1400, isPremium: false },
    { id: 16, title: 'Airplane Flight', category: 'Vehicles', style: 'Detailed', theme: 'Aircraft', size: 'A3', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=500&fit=crop', likes: 234, downloads: 1100, isPremium: true },
    
    // More items for pagination
    { id: 17, title: 'Playful Dolphin', category: 'Animals', style: 'Simple', theme: 'Marine', size: 'Letter', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop', likes: 298, downloads: 1100, isPremium: false },
    { id: 18, title: 'Fairy Wings', category: 'Fantasy', style: 'Line Art', theme: 'Fairies', size: 'A4', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=500&fit=crop', likes: 412, downloads: 1580, isPremium: false },
    { id: 19, title: 'Desert Cactus', category: 'Nature', style: 'Simple', theme: 'Desert', size: 'Letter', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop', likes: 167, downloads: 680, isPremium: false },
    { id: 20, title: 'Celtic Knot', category: 'Abstract', style: 'Detailed', theme: 'Celtic', size: 'A4', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop', likes: 345, downloads: 1320, isPremium: true },
    { id: 21, title: 'Train Journey', category: 'Vehicles', style: 'Line Art', theme: 'Trains', size: 'A4', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop', likes: 278, downloads: 1050, isPremium: false }
  ];

  // 过滤选项
  const categories = ['All', 'Animals', 'Fantasy', 'Nature', 'Abstract', 'Vehicles'];
  const styles = ['All', 'Line Art', 'Detailed', 'Simple'];

  // 处理分类多选
  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      setSelectedCategories(prev => {
        const newSelection = prev.filter(c => c !== 'All');
        if (newSelection.includes(category)) {
          const filtered = newSelection.filter(c => c !== category);
          return filtered.length === 0 ? ['All'] : filtered;
        } else {
          return [...newSelection, category];
        }
      });
    }
  };

  // 处理风格多选
  const handleStyleChange = (style: string) => {
    if (style === 'All') {
      setSelectedStyles(['All']);
    } else {
      setSelectedStyles(prev => {
        const newSelection = prev.filter(s => s !== 'All');
        if (newSelection.includes(style)) {
          const filtered = newSelection.filter(s => s !== style);
          return filtered.length === 0 ? ['All'] : filtered;
        } else {
          return [...newSelection, style];
        }
      });
    }
  };

  // 过滤和排序逻辑
  const filteredPages = coloringPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.includes('All') || selectedCategories.includes(page.category);
    const matchesStyle = selectedStyles.includes('All') || selectedStyles.includes(page.style);
    return matchesSearch && matchesCategory && matchesStyle;
  });

  const sortedPages = [...filteredPages].sort((a, b) => {
    switch (sortBy) {
      case 'Latest':
        return b.id - a.id;
      case 'Most Popular':
        return b.downloads - a.downloads;
      case 'Most Liked':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  // 分页逻辑
  const totalPages = Math.ceil(sortedPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPages = sortedPages.slice(startIndex, startIndex + itemsPerPage);

  // 鼠标滚轮翻页功能
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (e.deltaY > 0) {
        // 向下滚动 - 下一页
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
      } else {
        // 向上滚动 - 上一页
        setCurrentPage(prev => Math.max(prev - 1, 1));
      }
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        mainElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, [totalPages]);

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
          <span className="text-gray-900 font-medium">Categories</span>
        </nav>

        {/* 页面标题和描述 */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            All Coloring Pages
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl leading-relaxed">
            Explore our complete collection of beautiful coloring pages from all categories. Find the perfect design for your creative journey!
          </p>
        </div>

        {/* 搜索框 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for coloring pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 shadow-sm font-medium"
              style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="space-y-4">
            {/* Category 筛选 */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-800 font-bold whitespace-nowrap">Category:</span>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700 select-none">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Style 筛选 */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-800 font-bold whitespace-nowrap">Style:</span>
              <div className="flex flex-wrap gap-3">
                {styles.map(style => (
                  <label
                    key={style}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(style)}
                      onChange={() => handleStyleChange(style)}
                      className="w-4 h-4 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700 select-none">
                      {style}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 涂色页面网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {paginatedPages.map((page) => (
            <CategoriesColoringCard key={page.id} page={page} />
          ))}
        </div>
        
        {/* 页面信息显示 */}
        {totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-700 font-semibold">
              Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedPages.length)} of {sortedPages.length} pages
            </p>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Use mouse wheel to navigate between pages
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}