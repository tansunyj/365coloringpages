'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Printer, Heart, Share2, ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface UnifiedColoringDetailProps {
  pageId: string;
  source: 'popular' | 'latest' | 'first-coloring-book' | 'theme-park' | 'categories';
  category?: string; // 用于主题公园和分类页面
}

interface ColoringPageDetail {
  id: string;
  title: string;
  description: string;
  author: string;
  dimensions: string;
  format: string;
  image: string;
  categories: string[];
  likes: number;
  downloads: number;
  isLiked: boolean;
}

export default function UnifiedColoringDetail({ pageId, source, category }: UnifiedColoringDetailProps) {
  // 根据来源生成对应的数据
  const generatePageData = () => {
    switch (source) {
      case 'popular':
        return generatePopularData();
      case 'latest':
        return generateLatestData();
      case 'first-coloring-book':
        return generateFirstColoringBookData();
      case 'theme-park':
        return generateThemeParkData();
      case 'categories':
        return generateCategoryData();
      default:
        return generateDefaultData();
    }
  };

  const generatePopularData = () => {
    const popularTitles = [
      'Cute Cat Face', 'Majestic Lion', 'Wolf Portrait', 'Eagle Soaring', 'Playful Puppy',
      'Wise Owl', 'Graceful Swan', 'Jumping Rabbit', 'Proud Horse', 'Colorful Parrot',
      'Swimming Fish', 'Dancing Bear', 'Sleeping Fox', 'Flying Butterfly', 'Curious Monkey', 'Gentle Deer'
    ];
    const categories = ['Animals', 'Nature', 'Fantasy', 'Abstract'];
    const titleIndex = (parseInt(pageId) - 1) % popularTitles.length;
    const categoryIndex = Math.floor(titleIndex / 4) % categories.length;
    const title = popularTitles[titleIndex] || `Popular Page ${pageId}`;
    const subCategory = categories[categoryIndex] || 'Animals';
    
    return {
      title,
      description: `This ${title.toLowerCase()} coloring page is one of our most popular designs. Perfect for all ages and skill levels!`,
      categories: ['Popular', subCategory, 'Trending', 'Community Favorite'],
      author: 'Popular Artist',
      themeColor: 'pink'
    };
  };

  const generateLatestData = () => {
    const latestTitles = [
      'Modern Art Fusion', 'Digital Mandala', 'Geometric Dreams', 'Flowing Patterns', 'Color Burst',
      'Zen Circles', 'Psychedelic Waves', 'Sacred Symbols', 'Tribal Art', 'Mosaic Magic',
      'Optical Wonder', 'Art Deco Revival', 'Swirling Colors', 'Minimalist Beauty', 'Complex Geometry', 'Floral Abstraction'
    ];
    const categories = ['Abstract', 'Technology', 'Architecture', 'Seasonal'];
    const titleIndex = (parseInt(pageId) - 1) % latestTitles.length;
    const categoryIndex = Math.floor(titleIndex / 4) % categories.length;
    const title = latestTitles[titleIndex] || `Latest Upload ${pageId}`;
    const subCategory = categories[categoryIndex] || 'Abstract';
    
    return {
      title,
      description: `A fresh new ${title.toLowerCase()} coloring page recently added to our collection. Perfect for exploring new artistic styles!`,
      categories: ['Latest', subCategory, 'New', 'Fresh'],
      author: 'Creative Team',
      themeColor: 'green'
    };
  };

  const generateFirstColoringBookData = () => {
    const firstColoringBookTitles = [
      'Simple Circle', 'Big Square', 'Happy Triangle', 'Cute Heart', 'Bright Star',
      'Happy Sun', 'Smiling Moon', 'Little Cat', 'Big Apple', 'Red Heart',
      'Smiling Face', 'Balloon', 'Simple Flower', 'Yellow Banana', 'Green Tree'
    ];
    const categories = ['Basic Shapes', 'Nature', 'Animals', 'Fruits', 'Emotions'];
    const titleIndex = (parseInt(pageId) - 1) % firstColoringBookTitles.length;
    const categoryIndex = Math.floor(titleIndex / 3) % categories.length;
    const title = firstColoringBookTitles[titleIndex] || `First Coloring ${pageId}`;
    const subCategory = categories[categoryIndex] || 'Basic Shapes';
    
    return {
      title,
      description: `A simple and fun ${title.toLowerCase()} coloring page perfect for beginners and young artists. Great for learning and creativity!`,
      categories: ['First Coloring Book', subCategory, 'Beginner', 'Educational'],
      author: 'Kids Art Team',
      themeColor: 'blue'
    };
  };

  const generateThemeParkData = () => {
    const themeParkTitles = [
      'Mickey Mouse Castle', 'Roller Coaster Fun', 'Ferris Wheel', 'Carousel Horse', 'Magic Wand',
      'Princess Crown', 'Pirate Ship', 'Space Mountain', 'Haunted House', 'Fireworks Show'
    ];
    const titleIndex = (parseInt(pageId) - 1) % themeParkTitles.length;
    const title = themeParkTitles[titleIndex] || `Theme Park ${pageId}`;
    
    return {
      title,
      description: `Experience the magic with this ${title.toLowerCase()} coloring page inspired by the world's most exciting theme parks!`,
      categories: ['Theme Park', category || 'Disney World', 'Adventure', 'Magic'],
      author: 'Theme Park Artists',
      themeColor: 'purple'
    };
  };

  const generateCategoryData = () => {
    return {
      title: `${category || 'Category'} Coloring Page ${pageId}`,
      description: `A beautiful ${category?.toLowerCase() || 'category'} coloring page perfect for creative expression and relaxation.`,
      categories: [category || 'General', 'Creative', 'Art', 'Fun'],
      author: 'Category Artist',
      themeColor: 'gray'
    };
  };

  const generateDefaultData = () => {
    return {
      title: `Coloring Page ${pageId}`,
      description: 'A beautiful coloring page perfect for creative expression and relaxation.',
      categories: ['General', 'Creative', 'Art', 'Fun'],
      author: 'Artist',
      themeColor: 'gray'
    };
  };

  const pageData = generatePageData();

  // 模拟涂色页面数据
  const coloringPageData: ColoringPageDetail = {
    id: pageId,
    title: pageData.title,
    description: pageData.description,
    author: pageData.author,
    dimensions: '2480 x 3508px',
    format: 'PNG',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo',
    categories: pageData.categories,
    likes: Math.floor(Math.random() * 500) + 100,
    downloads: Math.floor(Math.random() * 2000) + 500,
    isLiked: false
  };

  const [isLiked, setIsLiked] = useState(coloringPageData.isLiked);
  const [likeCount, setLikeCount] = useState(coloringPageData.likes);
  const router = useRouter();

  // 生成面包屑导航
  const generateBreadcrumbs = () => {
    switch (source) {
      case 'popular':
        return (
          <>
            <Link href="/popular" className="hover:text-yellow-600 transition-colors">Popular</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{coloringPageData.title}</span>
          </>
        );
      case 'latest':
        return (
          <>
            <Link href="/latest" className="hover:text-yellow-600 transition-colors">Latest Uploads</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{coloringPageData.title}</span>
          </>
        );
      case 'first-coloring-book':
        return (
          <>
            <Link href="/first-coloring-book" className="hover:text-yellow-600 transition-colors">My First Coloring Book</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{coloringPageData.title}</span>
          </>
        );
      case 'theme-park':
        return (
          <>
            <Link href="/theme-park" className="hover:text-yellow-600 transition-colors">Theme Park Adventures</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{category}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{coloringPageData.title}</span>
          </>
        );
      case 'categories':
        return (
          <>
            <Link href="/categories" className="hover:text-yellow-600 transition-colors">Categories</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{coloringPageData.title}</span>
          </>
        );
      default:
        return <span className="text-gray-900 font-medium">{coloringPageData.title}</span>;
    }
  };

  // 获取主题颜色
  const getThemeColor = () => {
    switch (pageData.themeColor) {
      case 'pink': return 'bg-pink-500 hover:bg-pink-600';
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600';
      case 'purple': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getTagColor = () => {
    switch (pageData.themeColor) {
      case 'pink': return 'bg-pink-100 text-pink-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 相关推荐数据
  const relatedPages = [
    { id: 1, title: 'Related Page 1', category: 'Similar' },
    { id: 2, title: 'Related Page 2', category: 'Similar' },
    { id: 3, title: 'Related Page 3', category: 'Similar' },
    { id: 4, title: 'Related Page 4', category: 'Similar' }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = () => {
    console.log('Downloading:', coloringPageData.title);
  };

  const handlePrint = () => {
    console.log('Printing:', coloringPageData.title);
  };

  const handleShare = () => {
    console.log('Sharing:', coloringPageData.title);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-yellow-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          {generateBreadcrumbs()}
        </nav>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 左侧图片区域 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="relative aspect-[3/4] mb-6">
                <Image
                  src={coloringPageData.image}
                  alt={coloringPageData.title}
                  fill
                  className="object-cover rounded-xl"
                  unoptimized
                />
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={handleDownload}
                    className={`flex items-center px-6 py-3 text-white rounded-lg transition-colors font-medium ${getThemeColor()}`}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Printer className="h-5 w-5 mr-2" />
                    Print
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {likeCount}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧信息区域 */}
          <div className="space-y-8">
            {/* 基本信息 */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{coloringPageData.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {coloringPageData.description}
              </p>
              
              {/* 分类标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {coloringPageData.categories.map((cat, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor()}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* 详细信息 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Author:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.downloads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <span className="font-medium text-gray-900 capitalize">{source.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

            {/* 使用指南 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Click &quot;Download&quot; to save the coloring page to your device
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Print on standard 8.5x11 paper for best results
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Use crayons, colored pencils, or markers to bring it to life
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Share your finished artwork with friends and family!
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 相关推荐 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Coloring Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedPages.map((page) => (
              <div
                key={page.id}
                onClick={() => {
                  // 根据当前页面来源动态导航
                  switch (source) {
                    case 'popular':
                      router.push(`/popular/${page.id}`);
                      break;
                    case 'latest':
                      router.push(`/latest/${page.id}`);
                      break;
                    case 'first-coloring-book':
                      router.push(`/first-coloring-book/${page.id}`);
                      break;
                    case 'theme-park':
                      router.push(`/theme-park/${page.id}`);
                      break;
                    case 'categories':
                    default:
                      router.push(`/categories/${page.id}`);
                      break;
                  }
                }}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white rounded-full p-2 shadow-lg">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                    {page.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {page.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 