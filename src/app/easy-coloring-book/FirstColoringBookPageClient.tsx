'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RichColoringCard from '../../components/RichColoringCard';

export default function FirstColoringBookPageClient() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [displayedItems, setDisplayedItems] = useState(24); // 初始显示数量
  const [isLoading, setIsLoading] = useState(false);

  // First Coloring Book 分类列表
  const categories = [
    'All', 'Basic Shapes', 'Nature', 'Emotions', 'Fruits', 
    'Animals', 'Shapes', 'Fun', 'Colors', 'Numbers', 'Letters'
  ];

  // 将URL slug转换为显示名�?
  const getDisplayNameFromSlug = (slug: string) => {
    const slugToName: { [key: string]: string } = {
      'basic-shapes': 'Basic Shapes',
      'nature': 'Nature',
      'emotions': 'Emotions',
      'fruits': 'Fruits',
      'animals': 'Animals',
      'shapes': 'Shapes',
      'fun': 'Fun',
      'colors': 'Colors',
      'numbers': 'Numbers',
      'letters': 'Letters'
    };
    return slugToName[slug] || slug;
  };

  // 处理URL参数，设置初始选中的分�?
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryName = getDisplayNameFromSlug(categoryParam);
      if (categories.includes(categoryName)) {
        setSelectedCategories([categoryName]);
      }
    }
  }, [searchParams]);

  // 涂色页面数据状�?- 使用API数据
  const [allColoringPages, setAllColoringPages] = useState<Array<{
    id: number;
    title: string;
    description?: string;
    category: string;
    categoryName?: string;
    categorySlug?: string;
    categoryColor?: string;
    likes: number;
    downloads: number;
    views?: number;
    thumbnailUrl?: string;
    difficulty?: string;
    ageRange?: string;
    isLiked?: boolean;
    isFavorited?: boolean;
  }>>([]);

  // 获取涂色书页面数�?
  useEffect(() => {
    const fetchColoringBookPages = async () => {
      try {
        
        const { api } = await import('../../lib/apiClient');
        const response = await api.coloringBooks.pages({
          book: 'easy-coloring-book',
          page: 1,
          limit: 100
        });
        
        if (response.success && response.data) {
          
          // 检查数据结构并转换
          const responseData = response.data as { pages?: unknown[] };
          const pages = responseData.pages || [];
          
          // 转换API数据为组件需要的格式
          const formattedPages = pages.map((page) => ({
            id: page.id || 0,
            title: page.title || 'Untitled',
            description: page.description || '',
            category: page.categoryName || 'Basic Shapes',
            categoryName: page.categoryName || 'Basic Shapes',
            categorySlug: page.categorySlug || 'basic-shapes',
            categoryColor: page.categoryColor || '#999',
            likes: page.likes || 0,
            downloads: page.downloads || 0,
            views: page.views || 0,
            thumbnailUrl: page.thumbnailUrl,
            difficulty: page.difficulty || 'easy',
            ageRange: page.ageRange || '3-6 years',
            isLiked: page.isLiked || false,
            isFavorited: page.isFavorited || false
          }));
          
          setAllColoringPages(formattedPages);
        } else {
          setAllColoringPages([]);
        }
      } catch (error) {
        setAllColoringPages([]);
      }
    };
    
    fetchColoringBookPages();
  }, []);

  // 静态数据已完全移除，现在全部使用API动态数�?

  // 分类选择处理
  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      const newSelected = selectedCategories.includes('All') 
        ? [category]
        : selectedCategories.includes(category)
          ? selectedCategories.filter(c => c !== category)
          : [...selectedCategories.filter(c => c !== 'All'), category];
      
      setSelectedCategories(newSelected.length === 0 ? ['All'] : newSelected);
    }
  };

  // 筛选和搜索逻辑
  const filteredPages = allColoringPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.includes('All') || 
                           selectedCategories.includes(page.category);
    return matchesSearch && matchesCategory;
  });

  // 分页显示的数�?
  const displayedPages = filteredPages.slice(0, displayedItems);
  const hasMore = displayedItems < filteredPages.length;

  // 加载更多
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      setTimeout(() => {
        setDisplayedItems(prev => prev + 24);
        setIsLoading(false);
      }, 500);
    }
  };

  // 无限滚动
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 面包屑导�?*/}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Easy Coloring Pages</span>
        </nav>

        {/* 页面标题和描�?*/}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Easy Coloring Pages
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl leading-relaxed">
            Perfect beginner-friendly designs for young artists and coloring enthusiasts. Simple, fun, and educational!
          </p>
        </div>

        {/* 搜索�?*/}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search coloring pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* 分类筛�?*/}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-gray-800 font-bold whitespace-nowrap">Categories:</span>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 text-green-400 bg-gray-100 border-gray-300 rounded focus:ring-green-400 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700 select-none">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 结果统计 */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            Showing {displayedPages.length} of {filteredPages.length} coloring pages
          </p>
        </div>

        {/* 涂色页面网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          {displayedPages.map((page) => (
            <RichColoringCard
              key={page.id}
              id={page.id}
              title={page.title}
              description={page.description || ''}
              thumbnailUrl={page.thumbnailUrl || ''}
              difficulty={(page.difficulty as 'easy' | 'medium' | 'hard') || 'easy'}
              ageRange={page.ageRange || '3-6 years'}
              views={page.views || 0}
              likes={page.likes}
              downloads={page.downloads}
              categoryName={page.categoryName || page.category}
              categoryColor={page.categoryColor || '#999'}
              isLiked={page.isLiked || false}
              isFavorited={page.isFavorited || false}
              linkType="easy-coloring-book"
              linkCategory={page.categorySlug || 'basic-shapes'}
              allPages={filteredPages}
            />
          ))}
        </div>

        {/* 加载更多按钮 */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* 分页信息 */}
        <div className="text-center text-gray-500 text-sm mt-8">
          {displayedPages.length} / {filteredPages.length} pages loaded
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 