'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Printer, Heart, Share2, ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface UnifiedColoringDetailProps {
  id: string;
  type: 'popular' | 'latest' | 'first-coloring-book' | 'theme-park' | 'categories' | 'search';
  category?: string;
  park?: string;
  searchParams?: {
    q?: string;
    page?: string;
    limit?: string;
    sort?: string;
    category?: string;
  };
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

export default function UnifiedColoringDetail({ id, type, category, park, searchParams }: UnifiedColoringDetailProps) {
  // 根据来源生成对应的数据
  const generatePageData = () => {
    switch (type) {
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
      case 'search':
        return generateSearchData();
      default:
        return generateDefaultData();
    }
  };

  const generatePopularData = () => {
    const popularTitles = [
      'Magical Unicorn Adventure', 'Dragon Kingdom Castle', 'Underwater Mermaid Palace',
      'Enchanted Forest Animals', 'Space Explorer Mission', 'Princess Butterfly Garden'
    ];
    const pageId = parseInt(id) || 1;
    const index = (pageId - 1) % popularTitles.length;
    const selectedTitle = popularTitles[index] || 'Popular Coloring Page';
    return {
      title: selectedTitle,
      description: `A beautiful and intricate coloring page featuring ${selectedTitle.toLowerCase()}. Perfect for both kids and adults who love detailed artwork.`,
      author: 'ColoringMaster',
      categories: ['Fantasy', 'Adventure', 'Popular']
    };
  };

  const generateLatestData = () => {
    const latestTitles = [
      'Modern Art Patterns', 'Geometric Mandala', 'Contemporary Flowers',
      'Abstract Waves', 'Urban Cityscape', 'Minimalist Nature'
    ];
    const pageId = parseInt(id) || 1;
    const index = (pageId - 1) % latestTitles.length;
    const selectedTitle = latestTitles[index] || 'Latest Coloring Page';
    return {
      title: selectedTitle,
      description: `Our newest addition: ${selectedTitle.toLowerCase()}. Fresh designs with modern artistic flair.`,
      author: 'ArtistPro',
      categories: ['Modern', 'Latest', 'Trending']
    };
  };

  const generateFirstColoringBookData = () => {
    const firstBookTitles = [
      'Simple Circle Fun', 'Happy Square', 'Friendly Triangle',
      'Big Heart Shape', 'Smiling Sun', 'Little Flower'
    ];
    const pageId = parseInt(id) || 1;
    const index = (pageId - 1) % firstBookTitles.length;
    const selectedTitle = firstBookTitles[index] || 'Simple Coloring Page';
    const categoryName = category ? decodeURIComponent(category).replace(/-/g, ' ') : 'Basic Shapes';
    return {
      title: selectedTitle,
      description: `Perfect for beginners! This simple ${selectedTitle.toLowerCase()} design is ideal for young artists just starting their coloring journey.`,
      author: 'BeginnerFriend',
      categories: [categoryName, 'Beginner', 'Simple']
    };
  };

  const generateThemeParkData = () => {
    const themeParkTitles = [
      'Roller Coaster Adventure', 'Ferris Wheel Fun', 'Carousel Horses',
      'Cotton Candy Stand', 'Magic Castle', 'Bumper Cars'
    ];
    const pageId = parseInt(id) || 1;
    const index = (pageId - 1) % themeParkTitles.length;
    const selectedTitle = themeParkTitles[index] || 'Theme Park Adventure';
    const parkName = park ? decodeURIComponent(park).replace(/-/g, ' ') : 'Theme Park';
    return {
      title: selectedTitle,
      description: `Experience the excitement of ${parkName} with this thrilling ${selectedTitle.toLowerCase()} coloring page!`,
      author: 'ParkArtist',
      categories: [parkName, 'Theme Park', 'Adventure']
    };
  };

  const generateCategoryData = () => {
    const categoryTitles = [
      'Nature Scene', 'Animal Portrait', 'Floral Design',
      'Vehicle Adventure', 'Food Fun', 'Holiday Special'
    ];
    const pageId = parseInt(id) || 1;
    const index = (pageId - 1) % categoryTitles.length;
    const categoryName = category || 'General';
    const selectedTitle = categoryTitles[index] || 'Coloring Page';
    return {
      title: selectedTitle,
      description: `A wonderful ${selectedTitle.toLowerCase()} from our ${categoryName} collection.`,
      author: 'CategoryExpert',
      categories: [categoryName, 'Collection', 'Featured']
    };
  };

  const generateSearchData = () => {
    const searchTitles = [
      'Cute Puppy Coloring Page', 'Adorable Dog Portrait', 'Playful Pet Scene',
      'Happy Animal Friend', 'Lovely Pet Drawing', 'Sweet Dog Illustration'
    ];
    const pageId = parseInt(id) || 1;
    const index = (pageId - 1) % searchTitles.length;
    const selectedTitle = searchTitles[index] || 'Search Result Coloring Page';
    const searchQuery = searchParams?.q || '';
    return {
      title: selectedTitle,
      description: `Found in search for "${searchQuery}": ${selectedTitle.toLowerCase()}. A perfect match for your coloring needs!`,
      author: 'SearchArtist',
      categories: ['Search Result', 'Featured', 'Match']
    };
  };

  const generateDefaultData = () => {
    return {
      title: `Coloring Page ${id}`,
      description: 'A beautiful coloring page perfect for all ages.',
      author: 'Artist',
      categories: ['General', 'Fun']
    };
  };

  const pageData = generatePageData();

  // 模拟涂色页面数据
  const coloringPageData: ColoringPageDetail = {
    id: id,
    title: pageData.title,
    description: pageData.description,
    author: pageData.author,
    dimensions: '8.5" x 11"',
    format: 'PDF',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo",
    categories: pageData.categories,
    likes: 300,
    downloads: 1250,
    isLiked: false
  };

  const [isLiked, setIsLiked] = useState(coloringPageData.isLiked);
  const [likeCount, setLikeCount] = useState(coloringPageData.likes);
  const router = useRouter();

  // 生成面包屑导航
  const getBreadcrumbPath = () => {
    switch (type) {
      case 'popular':
        return [
          { name: 'Home', href: '/' },
          { name: 'Popular', href: '/popular' },
          { name: coloringPageData.title, href: '#' }
        ];
      case 'latest':
        return [
          { name: 'Home', href: '/' },
          { name: 'Latest', href: '/latest' },
          { name: coloringPageData.title, href: '#' }
        ];
      case 'first-coloring-book':
        const categoryDisplay = category ? decodeURIComponent(category).replace(/-/g, ' ') : 'All';
        return [
          { name: 'Home', href: '/' },
          { name: 'My First Coloring Book', href: '/first-coloring-book' },
          { name: categoryDisplay, href: `/first-coloring-book/${category || ''}` },
          { name: coloringPageData.title, href: '#' }
        ];
      case 'theme-park':
        const parkDisplay = park ? decodeURIComponent(park).replace(/-/g, ' ') : 'All Parks';
        return [
          { name: 'Home', href: '/' },
          { name: 'Theme Park Adventures', href: '/theme-park' },
          { name: parkDisplay, href: `/theme-park/${park || ''}` },
          { name: coloringPageData.title, href: '#' }
        ];
      case 'categories':
        return [
          { name: 'Home', href: '/' },
          { name: 'Categories', href: '/categories' },
          { name: category || 'General', href: '/categories' },
          { name: coloringPageData.title, href: '#' }
        ];
      case 'search':
        const searchQuery = searchParams?.q || '';
        // 构建搜索URL，只包含必要的参数
        const params = new URLSearchParams();
        if (searchParams?.q) params.set('q', searchParams.q);
        if (searchParams?.page && searchParams.page !== '1') params.set('page', searchParams.page);
        if (searchParams?.limit && searchParams.limit !== '12') params.set('limit', searchParams.limit);
        if (searchParams?.sort) params.set('sort', searchParams.sort);
        if (searchParams?.category) params.set('category', searchParams.category);
        const searchUrl = `/search?${params.toString()}`;
        return [
          { name: 'Home', href: '/' },
          { name: 'Search Results', href: searchUrl },
          { name: searchQuery ? `"${searchQuery}"` : 'Results', href: searchUrl },
          { name: coloringPageData.title, href: '#' }
        ];
      default:
        return [
          { name: 'Home', href: '/' },
          { name: coloringPageData.title, href: '#' }
        ];
    }
  };

  const breadcrumbPath = getBreadcrumbPath();

  // 获取主题颜色
  const getThemeColor = () => {
    switch (type) {
      case 'popular': return 'bg-pink-500 hover:bg-pink-600';
      case 'latest': return 'bg-green-500 hover:bg-green-600';
      case 'first-coloring-book': return 'bg-blue-500 hover:bg-blue-600';
      case 'theme-park': return 'bg-purple-500 hover:bg-purple-600';
      case 'search': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getTagColor = () => {
    switch (type) {
      case 'popular': return 'bg-pink-100 text-pink-800';
      case 'latest': return 'bg-green-100 text-green-800';
      case 'first-coloring-book': return 'bg-blue-100 text-blue-800';
      case 'theme-park': return 'bg-purple-100 text-purple-800';
      case 'search': return 'bg-orange-100 text-orange-800';
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
    // 这里可以添加实际的下载逻辑
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: coloringPageData.title,
        text: coloringPageData.description,
        url: window.location.href,
      });
    } else {
      // 备用方案：复制到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          {breadcrumbPath.map((item, index) => (
            <React.Fragment key={item.name}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <Link
                href={item.href}
                className="hover:text-yellow-600 transition-colors"
              >
                {item.name}
              </Link>
            </React.Fragment>
          ))}
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
                  <span className="font-medium text-gray-900 capitalize">{type.replace('-', ' ')}</span>
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
                  switch (type) {
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