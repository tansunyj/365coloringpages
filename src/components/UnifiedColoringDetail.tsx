'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Printer, Heart, Share2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import UnifiedBreadcrumb from './UnifiedBreadcrumb';

interface UnifiedColoringDetailProps {
  id: string;
  type: 'popular' | 'latest' | 'first-coloring-book' | 'theme-parks' | 'categories' | 'search';
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
  categories: string[];
  thumbnailUrl?: string;
  imageUrl?: string;
  difficulty?: string;
  ageRange?: string;
  views?: number;
  likes?: number;
  downloads?: number;
  isLiked?: boolean;
  createdAt?: string;
  tags?: string[];
}

// API响应数据类型
interface ApiColoringPageData {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  originalFileUrl: string;
  fileFormat: string;
  fileSize: number;
  difficulty: string;
  ageRange: string;
  theme: string;
  style: string;
  size: string;
  isPremium: number;
  isFeatured: number;
  status: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string | null;
  sourceType: string;
  createdByUser: string;
  aiPrompt: string | null;
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    color: string;
  }>;
  isLiked: boolean;
  isFavorited: boolean;
  tags?: string[];
}

export default function UnifiedColoringDetail({ id, type, category, park, searchParams }: UnifiedColoringDetailProps) {
  // 状态管理
  const [coloringPageData, setColoringPageData] = useState<ColoringPageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 从后端API获取涂色页面详情
  useEffect(() => {
    const fetchColoringPageDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { api } = await import('../lib/apiClient');
        const response = await api.coloring.detail(parseInt(id));
        
        if (response.success && response.data) {
          const pageData = response.data as ApiColoringPageData;
          
            thumbnailUrl: pageData.thumbnailUrl,
            previewUrl: pageData.previewUrl,
            originalFileUrl: pageData.originalFileUrl
          });
          
          // 处理categories数组，提取分类名称
          const categoryNames = pageData.categories ? 
            pageData.categories.map((cat) => cat.name) : [type];
          
          // 处理图片URL，确保它们是有效的
          const getValidImageUrl = (url: string | null | undefined): string => {
            if (!url) return 'https://via.placeholder.com/600x800?text=No+Image';
            
            // 如果是相对路径，转换为绝对路径
            if (url.startsWith('/')) {
              const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
              return `${apiBaseUrl}${url}`;
            }
            
            // 如果已经是绝对路径，直接返回
            if (url.startsWith('http')) {
              return url;
            }
            
            // 其他情况，使用placeholder
            return 'https://via.placeholder.com/600x800?text=Invalid+URL';
          };
          
          const thumbnailUrl = getValidImageUrl(pageData.thumbnailUrl || pageData.previewUrl);
          const imageUrl = getValidImageUrl(pageData.thumbnailUrl || pageData.previewUrl);
          
          
          setColoringPageData({
            id: pageData.id?.toString() || id,
            title: pageData.title || 'Untitled Coloring Page',
            description: pageData.description || 'A beautiful coloring page for you to enjoy.',
            author: pageData.createdByUser || 'Unknown Artist',
            categories: categoryNames,
            thumbnailUrl: thumbnailUrl,
            imageUrl: imageUrl,
            difficulty: pageData.difficulty || 'medium',
            ageRange: pageData.ageRange || '3-12岁',
            views: 0, // API响应中没有views字段，设为0
            likes: 0, // API响应中没有likes字段，设为0  
            downloads: 0, // API响应中没有downloads字段，设为0
            isLiked: pageData.isLiked || false,
            createdAt: pageData.createdAt || pageData.publishedAt,
            tags: pageData.tags || []
          });
          
          setIsLiked(pageData.isLiked || false);
          setLikeCount(0); // API中没有点赞数量，设为0
        } else {
          // 如果API返回失败，使用fallback数据
          setColoringPageData(generateFallbackData());
        }
      } catch (error) {
        console.error('Failed to fetch coloring page detail:', error);
        // API调用失败时使用fallback数据
        setColoringPageData(generateFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchColoringPageDetail();
  }, [id, type]);

  // Fallback数据生成（当API失败时使用）
  const generateFallbackData = (): ColoringPageDetail => {
    const fallbackTitles = {
      'popular': ['Magical Unicorn Adventure', 'Dragon Kingdom Castle', 'Underwater Mermaid Palace'],
      'latest': ['Modern Art Patterns', 'Geometric Mandala', 'Contemporary Flowers'],
      'theme-parks': ['Roller Coaster Adventure', 'Carousel Dreams', 'Ferris Wheel Fun'],
      'categories': ['Category Coloring Page', 'Beautiful Design', 'Creative Art'],
      'first-coloring-book': ['Simple Circle Fun', 'Happy Square', 'Friendly Triangle'],
      'search': ['Search Result Page', 'Found Design', 'Matching Art']
    };

    const titles = fallbackTitles[type] || fallbackTitles['categories'];
    const pageId = parseInt(id) || 1;
    const index = (pageId - 1) % titles.length;
    const selectedTitle = titles[index];

    return {
      id,
      title: selectedTitle,
      description: `A beautiful coloring page featuring ${selectedTitle.toLowerCase()}. Perfect for creative expression.`,
      author: 'Creative Artist',
      categories: [type, 'Creative'],
      thumbnailUrl: 'https://via.placeholder.com/400x400?text=Fallback+Image',
      imageUrl: 'https://via.placeholder.com/600x800?text=Fallback+Image',
      difficulty: 'medium',
      ageRange: '3-12岁',
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 100) + 10,
      downloads: Math.floor(Math.random() * 500) + 50,
      isLiked: false
    };
  };

  const router = useRouter();

  // 生成面包屑导航
  const getBreadcrumbPath = () => {
    if (!coloringPageData) return [];

    switch (type) {
      case 'popular':
        if (category) {
          const categoryDisplay = category === 'all' ? 'All Categories' : 
            category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          return [
            { name: 'Home', href: '/' },
            { name: 'Popular', href: '/popular' },
            { name: categoryDisplay, href: `/popular/${category}` },
            { name: coloringPageData.title, href: '#' }
          ];
        } else {
          return [
            { name: 'Home', href: '/' },
            { name: 'Popular', href: '/popular' },
            { name: coloringPageData.title, href: '#' }
          ];
        }
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
      case 'theme-parks':
        const parkDisplay = park ? decodeURIComponent(park).replace(/-/g, ' ') : 'All Parks';
        return [
          { name: 'Home', href: '/' },
          { name: 'Theme Parks', href: '/theme-parks' },
          { name: parkDisplay, href: `/theme-parks/${park || ''}` },
          { name: coloringPageData.title, href: '#' }
        ];
      case 'categories':
        if (category) {
          const categoryDisplay = category === 'all' ? 'All Categories' : 
            category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          
          // 中文分类名称映射
          const categoryNameMap: Record<string, string> = {
            'animals': '动物',
            'fairy-tale': '童话',
            'fantasy': '幻想',
            'vehicles': '交通工具',
            'nature': '自然',
            'prehistoric': '史前动物',
            'space': '太空',
            'ocean': '海洋',
            'holidays': '节日',
            'superhero': '超级英雄',
            'food': '食物',
            'magic': '魔法',
            'farm': '农场',
            'celebration': '庆祝'
          };
          
          const displayName = categoryNameMap[category] || categoryDisplay;
          
          return [
            { name: 'Home', href: '/' },
            { name: 'Categories', href: '/categories' },
            { name: displayName, href: `/categories/${category}` },
            { name: coloringPageData.title, href: '#' }
          ];
        } else {
          return [
            { name: 'Home', href: '/' },
            { name: 'Categories', href: '/categories' },
            { name: coloringPageData.title, href: '#' }
          ];
        }
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
      case 'theme-parks': return 'bg-purple-500 hover:bg-purple-600';
      case 'categories': return 'bg-orange-500 hover:bg-orange-600';
      case 'search': return 'bg-indigo-500 hover:bg-indigo-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getTagColor = () => {
    switch (type) {
      case 'popular': return 'bg-pink-100 text-pink-800';
      case 'latest': return 'bg-green-100 text-green-800';
      case 'first-coloring-book': return 'bg-blue-100 text-blue-800';
      case 'theme-parks': return 'bg-purple-100 text-purple-800';
      case 'categories': return 'bg-orange-100 text-orange-800';
      case 'search': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 相关推荐数据 - 根据当前页面ID生成唯一的相关页面ID
  // 使用更大的偏移量避免与真实数据ID冲突
  const generateRelatedPages = () => {
    if (!coloringPageData) return [];
    const baseId = parseInt(id) || 1;
    const offset = 10000; // 使用10000作为偏移量，避免与真实数据冲突
    return [
      { id: baseId + offset + 1, title: 'Related Page 1', category: 'Similar' },
      { id: baseId + offset + 2, title: 'Related Page 2', category: 'Similar' },
      { id: baseId + offset + 3, title: 'Related Page 3', category: 'Similar' },
      { id: baseId + offset + 4, title: 'Related Page 4', category: 'Similar' }
    ];
  };
  
  const relatedPages = generateRelatedPages();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = () => {
    // 这里可以添加实际的下载逻辑
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: coloringPageData?.title || 'Coloring Page',
        text: coloringPageData?.description || 'A beautiful coloring page for you to enjoy.',
        url: window.location.href,
      });
    } else {
      // 备用方案：复制到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!coloringPageData) {
    return <div className="min-h-screen flex items-center justify-center">No data available.</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <UnifiedBreadcrumb
          type={type}
          category={category}
          park={park}
          itemTitle={coloringPageData.title}
          searchParams={searchParams}
        />

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 左侧图片区域 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="relative aspect-[3/4] mb-6">
                <Image
                  src={coloringPageData.imageUrl || 'https://via.placeholder.com/600x800?text=No+Image'}
                  alt={coloringPageData.title}
                  fill
                  className="object-cover rounded-xl"
                  unoptimized
                  onError={(e) => {
                    // 图片加载失败时设置fallback图片
                    e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Image+Not+Found';
                  }}
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
                    key={`${cat}-${index}`}
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
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age Range:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.ageRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.views?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.downloads?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created At:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.createdAt ? new Date(coloringPageData.createdAt).toLocaleDateString() : 'N/A'}</span>
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
                    case 'theme-parks':
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