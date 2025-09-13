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
  const [selectedParks, setSelectedParks] = useState<string[]>(['All']);
  const [displayedItems, setDisplayedItems] = useState(24); // 初始显示数量
  const [isLoading, setIsLoading] = useState(false);

  // 主题公园列表
  const themeParks = [
    'All', 'Disney World', 'Universal Studios', 'Six Flags', 
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

  // 扩展的主题公园涂色页面数据 (使用连续ID 1-80)
  const allColoringPages = [
    // Disney World (id 1-20)
    { id: 1, title: 'Mickey Mouse Castle', park: 'Disney World', likes: 456, downloads: 2340 },
    { id: 2, title: 'Cinderella\'s Carriage', park: 'Disney World', likes: 389, downloads: 1980 },
    { id: 3, title: 'Donald Duck Adventure', park: 'Disney World', likes: 298, downloads: 1560 },
    { id: 4, title: 'Minnie Mouse Bow', park: 'Disney World', likes: 445, downloads: 2100 },
    { id: 5, title: 'Goofy\'s Playhouse', park: 'Disney World', likes: 267, downloads: 1340 },
    { id: 6, title: 'Pluto\'s Bone', park: 'Disney World', likes: 189, downloads: 890 },
    { id: 7, title: 'Fairy Tale Castle', park: 'Disney World', likes: 567, downloads: 2890 },
    { id: 8, title: 'Magic Wand', park: 'Disney World', likes: 234, downloads: 1200 },
    { id: 9, title: 'Princess Crown', park: 'Disney World', likes: 678, downloads: 3450 },
    { id: 10, title: 'Enchanted Forest', park: 'Disney World', likes: 345, downloads: 1780 },
    { id: 11, title: 'Flying Carpet', park: 'Disney World', likes: 234, downloads: 1120 },
    { id: 12, title: 'Pirate Ship', park: 'Disney World', likes: 456, downloads: 2340 },
    { id: 13, title: 'Treasure Chest', park: 'Disney World', likes: 298, downloads: 1560 },
    { id: 14, title: 'Magic Mirror', park: 'Disney World', likes: 389, downloads: 1980 },
    { id: 15, title: 'Fairy Godmother', park: 'Disney World', likes: 445, downloads: 2100 },
    { id: 16, title: 'Sleeping Beauty', park: 'Disney World', likes: 567, downloads: 2890 },
    { id: 17, title: 'Snow White Apple', park: 'Disney World', likes: 234, downloads: 1200 },
    { id: 18, title: 'Beast\'s Rose', park: 'Disney World', likes: 345, downloads: 1780 },
    { id: 19, title: 'Ariel\'s Trident', park: 'Disney World', likes: 456, downloads: 2340 },
    { id: 20, title: 'Simba\'s Pride', park: 'Disney World', likes: 567, downloads: 2890 },

    // Universal Studios (id 21-40)
    { id: 21, title: 'Jurassic T-Rex', park: 'Universal Studios', likes: 678, downloads: 3200 },
    { id: 22, title: 'Transformer Robot', park: 'Universal Studios', likes: 543, downloads: 2780 },
    { id: 23, title: 'Harry Potter Wand', park: 'Universal Studios', likes: 789, downloads: 4100 },
    { id: 24, title: 'Hogwarts Castle', park: 'Universal Studios', likes: 890, downloads: 4560 },
    { id: 25, title: 'Minion Stuart', park: 'Universal Studios', likes: 456, downloads: 2340 },
    { id: 26, title: 'King Kong', park: 'Universal Studios', likes: 345, downloads: 1780 },
    { id: 27, title: 'Shrek Ogre', park: 'Universal Studios', likes: 234, downloads: 1200 },
    { id: 28, title: 'Spider-Man Web', park: 'Universal Studios', likes: 567, downloads: 2890 },
    { id: 29, title: 'Hulk Smash', park: 'Universal Studios', likes: 678, downloads: 3450 },
    { id: 30, title: 'Iron Man Suit', park: 'Universal Studios', likes: 789, downloads: 4100 },
    { id: 31, title: 'Captain America Shield', park: 'Universal Studios', likes: 543, downloads: 2780 },
    { id: 32, title: 'Thor Hammer', park: 'Universal Studios', likes: 456, downloads: 2340 },
    { id: 33, title: 'Mummy Tomb', park: 'Universal Studios', likes: 345, downloads: 1780 },
    { id: 34, title: 'E.T. Spaceship', park: 'Universal Studios', likes: 234, downloads: 1200 },
    { id: 35, title: 'Jaws Shark', park: 'Universal Studios', likes: 567, downloads: 2890 },
    { id: 36, title: 'Back to Future Car', park: 'Universal Studios', likes: 678, downloads: 3450 },
    { id: 37, title: 'Despicable Me Rocket', park: 'Universal Studios', likes: 789, downloads: 4100 },
    { id: 38, title: 'Fast & Furious Car', park: 'Universal Studios', likes: 543, downloads: 2780 },
    { id: 39, title: 'Simpsons Donut', park: 'Universal Studios', likes: 456, downloads: 2340 },
    { id: 40, title: 'Wizarding World', park: 'Universal Studios', likes: 890, downloads: 4560 },

    // Six Flags (id 41-60)
    { id: 41, title: 'Roller Coaster Loop', park: 'Six Flags', likes: 345, downloads: 1780 },
    { id: 42, title: 'Ferris Wheel Giant', park: 'Six Flags', likes: 234, downloads: 1200 },
    { id: 43, title: 'Carousel Horses', park: 'Six Flags', likes: 456, downloads: 2340 },
    { id: 44, title: 'Bumper Cars', park: 'Six Flags', likes: 567, downloads: 2890 },
    { id: 45, title: 'Cotton Candy Stand', park: 'Six Flags', likes: 123, downloads: 650 },
    { id: 46, title: 'Popcorn Wagon', park: 'Six Flags', likes: 189, downloads: 890 },
    { id: 47, title: 'Ring Toss Game', park: 'Six Flags', likes: 267, downloads: 1340 },
    { id: 48, title: 'Duck Pond Game', park: 'Six Flags', likes: 298, downloads: 1560 },
    { id: 49, title: 'Balloon Dart', park: 'Six Flags', likes: 345, downloads: 1780 },
    { id: 50, title: 'Prize Teddy Bear', park: 'Six Flags', likes: 234, downloads: 1200 },
    { id: 51, title: 'Funhouse Mirror', park: 'Six Flags', likes: 456, downloads: 2340 },
    { id: 52, title: 'Haunted House', park: 'Six Flags', likes: 567, downloads: 2890 },
    { id: 53, title: 'Log Flume', park: 'Six Flags', likes: 678, downloads: 3450 },
    { id: 54, title: 'Water Slide', park: 'Six Flags', likes: 789, downloads: 4100 },
    { id: 55, title: 'Swing Ride', park: 'Six Flags', likes: 543, downloads: 2780 },
    { id: 56, title: 'Tilt-a-Whirl', park: 'Six Flags', likes: 456, downloads: 2340 },
    { id: 57, title: 'Spinning Teacups', park: 'Six Flags', likes: 345, downloads: 1780 },
    { id: 58, title: 'Pirate Ship Swing', park: 'Six Flags', likes: 234, downloads: 1200 },
    { id: 59, title: 'Gravity Drop', park: 'Six Flags', likes: 567, downloads: 2890 },
    { id: 60, title: 'Super Loop', park: 'Six Flags', likes: 678, downloads: 3450 },

    // Cedar Point (id 61-80)
    { id: 61, title: 'Steel Vengeance', park: 'Cedar Point', likes: 789, downloads: 4100 },
    { id: 62, title: 'Millennium Force', park: 'Cedar Point', likes: 678, downloads: 3450 },
    { id: 63, title: 'Maverick Horse', park: 'Cedar Point', likes: 567, downloads: 2890 },
    { id: 64, title: 'Top Thrill Dragster', park: 'Cedar Point', likes: 890, downloads: 4560 },
    { id: 65, title: 'GateKeeper Wings', park: 'Cedar Point', likes: 456, downloads: 2340 },
    { id: 66, title: 'Raptor Claws', park: 'Cedar Point', likes: 345, downloads: 1780 },
    { id: 67, title: 'Magnum XL', park: 'Cedar Point', likes: 234, downloads: 1200 },
    { id: 68, title: 'Blue Streak', park: 'Cedar Point', likes: 567, downloads: 2890 },
    { id: 69, title: 'Gemini Twins', park: 'Cedar Point', likes: 678, downloads: 3450 },
    { id: 70, title: 'Iron Dragon', park: 'Cedar Point', likes: 789, downloads: 4100 },
    { id: 71, title: 'Corkscrew Twist', park: 'Cedar Point', likes: 543, downloads: 2780 },
    { id: 72, title: 'Mine Ride', park: 'Cedar Point', likes: 456, downloads: 2340 },
    { id: 73, title: 'Wildcat Prowl', park: 'Cedar Point', likes: 345, downloads: 1780 },
    { id: 74, title: 'Cedar Creek', park: 'Cedar Point', likes: 234, downloads: 1200 },
    { id: 75, title: 'SkyCoaster', park: 'Cedar Point', likes: 567, downloads: 2890 },
    { id: 76, title: 'Power Tower', park: 'Cedar Point', likes: 678, downloads: 3450 },
    { id: 77, title: 'Wicked Twister', park: 'Cedar Point', likes: 789, downloads: 4100 },
    { id: 78, title: 'Disaster Transport', park: 'Cedar Point', likes: 543, downloads: 2780 },
    { id: 79, title: 'Valravn Dive', park: 'Cedar Point', likes: 890, downloads: 4560 },
    { id: 80, title: 'Rougarou Beast', park: 'Cedar Point', likes: 678, downloads: 3450 }
  ];

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