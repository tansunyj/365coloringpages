'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FirstColoringListCard from '../../components/FirstColoringListCard';

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

  // 将URL slug转换为显示名称
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

  // 处理URL参数，设置初始选中的分类
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryName = getDisplayNameFromSlug(categoryParam);
      if (categories.includes(categoryName)) {
        setSelectedCategories([categoryName]);
      }
    }
  }, [searchParams]);

  // 扩展的 First Coloring Book 涂色页面数据 (使用连续ID 1-100)
  const allColoringPages = [
    // Basic Shapes (id 1-15)
    { id: 1, title: 'Simple Circle', category: 'Basic Shapes', likes: 234, downloads: 1200 },
    { id: 2, title: 'Big Square', category: 'Basic Shapes', likes: 189, downloads: 890 },
    { id: 3, title: 'Happy Triangle', category: 'Basic Shapes', likes: 267, downloads: 1340 },
    { id: 4, title: 'Rectangle Fun', category: 'Basic Shapes', likes: 298, downloads: 1560 },
    { id: 5, title: 'Oval Shape', category: 'Basic Shapes', likes: 156, downloads: 780 },
    { id: 6, title: 'Diamond Bright', category: 'Basic Shapes', likes: 223, downloads: 1100 },
    { id: 7, title: 'Star Shape', category: 'Basic Shapes', likes: 345, downloads: 1750 },
    { id: 8, title: 'Heart Shape', category: 'Basic Shapes', likes: 412, downloads: 2050 },
    { id: 9, title: 'Cross Simple', category: 'Basic Shapes', likes: 178, downloads: 920 },
    { id: 10, title: 'Arrow Point', category: 'Basic Shapes', likes: 201, downloads: 1000 },
    { id: 11, title: 'Pentagon Shape', category: 'Basic Shapes', likes: 134, downloads: 670 },
    { id: 12, title: 'Hexagon Fun', category: 'Basic Shapes', likes: 167, downloads: 830 },
    { id: 13, title: 'Octagon Big', category: 'Basic Shapes', likes: 145, downloads: 720 },
    { id: 14, title: 'Crescent Moon', category: 'Basic Shapes', likes: 289, downloads: 1450 },
    { id: 15, title: 'Lightning Bolt', category: 'Basic Shapes', likes: 256, downloads: 1280 },

    // Nature (id 16-30)
    { id: 16, title: 'Happy Sun', category: 'Nature', likes: 345, downloads: 1800 },
    { id: 17, title: 'Smiling Cloud', category: 'Nature', likes: 278, downloads: 1390 },
    { id: 18, title: 'Rainbow Bright', category: 'Nature', likes: 445, downloads: 2340 },
    { id: 19, title: 'Simple Flower', category: 'Nature', likes: 356, downloads: 1750 },
    { id: 20, title: 'Green Tree', category: 'Nature', likes: 234, downloads: 1200 },
    { id: 21, title: 'Butterfly Wings', category: 'Nature', likes: 389, downloads: 1950 },
    { id: 22, title: 'Ladybug Spots', category: 'Nature', likes: 267, downloads: 1340 },
    { id: 23, title: 'Bee Busy', category: 'Nature', likes: 198, downloads: 990 },
    { id: 24, title: 'Leaf Simple', category: 'Nature', likes: 156, downloads: 780 },
    { id: 25, title: 'Mushroom Red', category: 'Nature', likes: 223, downloads: 1115 },
    { id: 26, title: 'Grass Green', category: 'Nature', likes: 134, downloads: 670 },
    { id: 27, title: 'Rock Stone', category: 'Nature', likes: 178, downloads: 890 },
    { id: 28, title: 'Water Drop', category: 'Nature', likes: 245, downloads: 1225 },
    { id: 29, title: 'Snowflake', category: 'Nature', likes: 312, downloads: 1560 },
    { id: 30, title: 'Mountain High', category: 'Nature', likes: 289, downloads: 1445 },

    // Animals (id 31-45)
    { id: 31, title: 'Little Cat', category: 'Animals', likes: 567, downloads: 2890 },
    { id: 32, title: 'Happy Dog', category: 'Animals', likes: 445, downloads: 2225 },
    { id: 33, title: 'Bunny Ears', category: 'Animals', likes: 356, downloads: 1780 },
    { id: 34, title: 'Fish Swimming', category: 'Animals', likes: 234, downloads: 1170 },
    { id: 35, title: 'Bird Flying', category: 'Animals', likes: 298, downloads: 1490 },
    { id: 36, title: 'Elephant Big', category: 'Animals', likes: 389, downloads: 1945 },
    { id: 37, title: 'Giraffe Tall', category: 'Animals', likes: 267, downloads: 1335 },
    { id: 38, title: 'Lion Mane', category: 'Animals', likes: 445, downloads: 2225 },
    { id: 39, title: 'Monkey Play', category: 'Animals', likes: 178, downloads: 890 },
    { id: 40, title: 'Frog Green', category: 'Animals', likes: 223, downloads: 1115 },
    { id: 41, title: 'Turtle Slow', category: 'Animals', likes: 156, downloads: 780 },
    { id: 42, title: 'Snake Long', category: 'Animals', likes: 134, downloads: 670 },
    { id: 43, title: 'Duck Yellow', category: 'Animals', likes: 289, downloads: 1445 },
    { id: 44, title: 'Pig Pink', category: 'Animals', likes: 201, downloads: 1005 },
    { id: 45, title: 'Cow Spots', category: 'Animals', likes: 245, downloads: 1225 },

    // Fruits (id 46-60)
    { id: 46, title: 'Big Apple', category: 'Fruits', likes: 298, downloads: 1560 },
    { id: 47, title: 'Yellow Banana', category: 'Fruits', likes: 234, downloads: 1170 },
    { id: 48, title: 'Orange Round', category: 'Fruits', likes: 267, downloads: 1335 },
    { id: 49, title: 'Red Strawberry', category: 'Fruits', likes: 345, downloads: 1725 },
    { id: 50, title: 'Purple Grapes', category: 'Fruits', likes: 189, downloads: 945 },
    { id: 51, title: 'Green Pear', category: 'Fruits', likes: 223, downloads: 1115 },
    { id: 52, title: 'Watermelon Slice', category: 'Fruits', likes: 356, downloads: 1780 },
    { id: 53, title: 'Pineapple Crown', category: 'Fruits', likes: 278, downloads: 1390 },
    { id: 54, title: 'Cherry Red', category: 'Fruits', likes: 156, downloads: 780 },
    { id: 55, title: 'Lemon Yellow', category: 'Fruits', likes: 201, downloads: 1005 },
    { id: 56, title: 'Peach Soft', category: 'Fruits', likes: 178, downloads: 890 },
    { id: 57, title: 'Plum Purple', category: 'Fruits', likes: 134, downloads: 670 },
    { id: 58, title: 'Coconut Brown', category: 'Fruits', likes: 245, downloads: 1225 },
    { id: 59, title: 'Kiwi Green', category: 'Fruits', likes: 167, downloads: 835 },
    { id: 60, title: 'Mango Sweet', category: 'Fruits', likes: 289, downloads: 1445 },

    // Emotions (id 61-75)
    { id: 61, title: 'Smiling Face', category: 'Emotions', likes: 456, downloads: 2100 },
    { id: 62, title: 'Happy Eyes', category: 'Emotions', likes: 345, downloads: 1725 },
    { id: 63, title: 'Surprised Look', category: 'Emotions', likes: 234, downloads: 1170 },
    { id: 64, title: 'Sleepy Yawn', category: 'Emotions', likes: 189, downloads: 945 },
    { id: 65, title: 'Winking Eye', category: 'Emotions', likes: 267, downloads: 1335 },
    { id: 66, title: 'Laughing Mouth', category: 'Emotions', likes: 298, downloads: 1490 },
    { id: 67, title: 'Thinking Face', category: 'Emotions', likes: 178, downloads: 890 },
    { id: 68, title: 'Excited Jump', category: 'Emotions', likes: 356, downloads: 1780 },
    { id: 69, title: 'Calm Peaceful', category: 'Emotions', likes: 223, downloads: 1115 },
    { id: 70, title: 'Curious Wonder', category: 'Emotions', likes: 245, downloads: 1225 },
    { id: 71, title: 'Proud Smile', category: 'Emotions', likes: 201, downloads: 1005 },
    { id: 72, title: 'Shy Blush', category: 'Emotions', likes: 156, downloads: 780 },
    { id: 73, title: 'Brave Strong', category: 'Emotions', likes: 289, downloads: 1445 },
    { id: 74, title: 'Kind Heart', category: 'Emotions', likes: 334, downloads: 1670 },
    { id: 75, title: 'Grateful Thanks', category: 'Emotions', likes: 278, downloads: 1390 },

    // Fun (id 76-90)
    { id: 76, title: 'Balloon', category: 'Fun', likes: 267, downloads: 1340 },
    { id: 77, title: 'Birthday Cake', category: 'Fun', likes: 445, downloads: 2225 },
    { id: 78, title: 'Party Hat', category: 'Fun', likes: 234, downloads: 1170 },
    { id: 79, title: 'Ice Cream Cone', category: 'Fun', likes: 356, downloads: 1780 },
    { id: 80, title: 'Candy Sweet', category: 'Fun', likes: 189, downloads: 945 },
    { id: 81, title: 'Toy Car', category: 'Fun', likes: 298, downloads: 1490 },
    { id: 82, title: 'Teddy Bear', category: 'Fun', likes: 378, downloads: 1890 },
    { id: 83, title: 'Ball Round', category: 'Fun', likes: 156, downloads: 780 },
    { id: 84, title: 'Kite Flying', category: 'Fun', likes: 223, downloads: 1115 },
    { id: 85, title: 'Swing Play', category: 'Fun', likes: 201, downloads: 1005 },
    { id: 86, title: 'Slide Fun', category: 'Fun', likes: 178, downloads: 890 },
    { id: 87, title: 'Sandbox Dig', category: 'Fun', likes: 134, downloads: 670 },
    { id: 88, title: 'Bubbles Pop', category: 'Fun', likes: 245, downloads: 1225 },
    { id: 89, title: 'Music Note', category: 'Fun', likes: 167, downloads: 835 },
    { id: 90, title: 'Dance Move', category: 'Fun', likes: 289, downloads: 1445 },

    // Shapes (id 91-100)
    { id: 91, title: 'Red Heart', category: 'Shapes', likes: 389, downloads: 1980 },
    { id: 92, title: 'Blue Star', category: 'Shapes', likes: 423, downloads: 2050 },
    { id: 93, title: 'Green Circle', category: 'Shapes', likes: 234, downloads: 1170 },
    { id: 94, title: 'Yellow Square', category: 'Shapes', likes: 267, downloads: 1335 },
    { id: 95, title: 'Pink Triangle', category: 'Shapes', likes: 189, downloads: 945 },
    { id: 96, title: 'Orange Diamond', category: 'Shapes', likes: 298, downloads: 1490 },
    { id: 97, title: 'Purple Oval', category: 'Shapes', likes: 156, downloads: 780 },
    { id: 98, title: 'Brown Rectangle', category: 'Shapes', likes: 178, downloads: 890 },
    { id: 99, title: 'Black Pentagon', category: 'Shapes', likes: 134, downloads: 670 },
    { id: 100, title: 'White Hexagon', category: 'Shapes', likes: 223, downloads: 1115 }
  ];

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

  // 分页显示的数据
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
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">My First Coloring Book</span>
        </nav>

        {/* 页面标题和描述 */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            My First Coloring Book
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl leading-relaxed">
            Perfect beginner-friendly designs for young artists and coloring enthusiasts. Simple, fun, and educational!
          </p>
        </div>

        {/* 搜索框 */}
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

        {/* 分类筛选 */}
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
            <FirstColoringListCard
              key={page.id}
              id={page.id}
              title={page.title}
              category={page.category}
              likes={page.likes}
              downloads={page.downloads}
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