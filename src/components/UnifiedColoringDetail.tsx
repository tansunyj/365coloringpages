'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Printer, Heart, Share2, Star, Copy } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import UnifiedBreadcrumb from './UnifiedBreadcrumb';

interface UnifiedColoringDetailProps {
  id: string;
  type: 'popular' | 'latest' | 'first-coloring-book' | 'theme-parks' | 'categories' | 'search';
  category?: string;
  park?: string;
  isDialog?: boolean; // 是否在Dialog中显示
  allPages?: any[]; // 列表页传递的所有数据（通常是40条）
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
  originalFileUrl?: string;  // 高清原图，仅用于下载和打印
  theme?: string;
  style?: string;
  size?: string;
  difficulty?: string;
  ageRange?: string;
  views?: number;
  likes?: number;
  downloads?: number;
  isLiked?: boolean;
  createdAt?: string;
  tags?: string[];
  aiPrompt?: string | null;
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
  likes?: number; // 点赞数量
  views?: number; // 浏览次数
  downloads?: number; // 下载次数
  tags?: string[];
}

export default function UnifiedColoringDetail({ id, type, category, park, isDialog = false, allPages, searchParams }: UnifiedColoringDetailProps) {
  // 状态管理
  const [coloringPageData, setColoringPageData] = useState<ColoringPageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedPages, setRelatedPages] = useState<any[]>([]);
  
  // 防止重复加载 - 记录上一次加载的ID
  const lastLoadedId = useRef<string>('');
  
  // 防止重复获取相关推荐
  const hasLoadedRelated = useRef<boolean>(false);
  
  // 从 sessionStorage 读取列表数据（如果组件没有直接传递 allPages）
  // 使用 useMemo 同步初始化，避免 useEffect 的异步问题
  const listPageData = useMemo(() => {
    // 优先使用传递的 allPages
    if (allPages && Array.isArray(allPages) && allPages.length > 0) {
      console.log('📦 使用传递的 allPages 数据:', allPages.length, '条');
      return allPages;
    }
    
    // 尝试从 sessionStorage 读取（仅在客户端）
    if (typeof window !== 'undefined') {
      try {
        const storedData = sessionStorage.getItem('listPageAllData');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('📦 从 sessionStorage 读取列表数据:', parsed.length, '条');
            return parsed;
          }
        }
      } catch (error) {
        console.error('❌ 读取 sessionStorage 失败:', error);
      }
    }
    
    return [];
  }, [allPages]);

  // 从后端API获取涂色页面详情
  useEffect(() => {
    // 如果ID相同，跳过重复加载
    if (lastLoadedId.current === id) {
      console.log('🚫 详情ID未变化，跳过重复加载:', id);
      return;
    }
    
    console.log('🔄 开始加载详情数据，ID:', id);
    lastLoadedId.current = id;
    
    const fetchColoringPageDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { api } = await import('../lib/apiClient');
        const response = await api.coloring.detail(parseInt(id));
        
        if (response.success && response.data) {
          const pageData = response.data as ApiColoringPageData;
          
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
          
          // 缩略图：用于小图预览（最小尺寸）
          const thumbnailUrl = getValidImageUrl(pageData.thumbnailUrl);
          
          // 详情页预览图：中等清晰度，不提供最高清原图（保护策略）
          const imageUrl = getValidImageUrl(pageData.previewUrl || pageData.thumbnailUrl);
          
          // 原始高清图：仅用于下载和打印
          const originalFileUrl = getValidImageUrl(pageData.originalFileUrl);
          
          
          setColoringPageData({
            id: pageData.id?.toString() || id,
            title: pageData.title || 'Untitled Coloring Page',
            description: pageData.description || 'A beautiful coloring page for you to enjoy.',
            author: pageData.createdByUser || 'Unknown Artist',
            categories: categoryNames,
            thumbnailUrl: thumbnailUrl,
            imageUrl: imageUrl,
            originalFileUrl: originalFileUrl,  // 保存高清原图URL
            theme: pageData.theme || 'N/A',
            style: pageData.style || 'N/A',
            size: pageData.size || 'N/A',
            difficulty: pageData.difficulty || 'medium',
            ageRange: pageData.ageRange || '3-12岁',
            views: pageData.views || 0, // 从API读取views，如果没有则为0
            likes: pageData.likes || 0, // 从API读取likes，如果没有则为0
            downloads: pageData.downloads || 0, // 从API读取downloads，如果没有则为0
            isLiked: pageData.isLiked || false,
            createdAt: pageData.createdAt || pageData.publishedAt,
            tags: pageData.tags || [],
            aiPrompt: pageData.aiPrompt || null
          });
          
          setIsLiked(pageData.isLiked || false);
          setIsFavorited(pageData.isFavorited || false);
          setLikeCount(pageData.likes || 0); // 从API读取点赞数量
          
          console.log('✅ 详情数据加载成功，点赞数:', pageData.likes);
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
    // 注意：只依赖id，避免type变化导致重复加载
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 获取相关推荐数据
  useEffect(() => {
    const fetchRelatedPages = async () => {
      try {
        let dataPool: any[] = [];
        
        // 优先使用列表页传递的数据（通常是40条）
        if (listPageData && Array.isArray(listPageData) && listPageData.length > 0) {
          console.log('📦 使用列表页传递的数据池:', listPageData.length, '条');
          dataPool = listPageData;
        } else {
          // 如果没有传递数据，从API获取
          // 但只调用一次，避免重复请求
          if (hasLoadedRelated.current) {
            console.log('⏭️ 已经获取过相关推荐，跳过重复请求');
            return;
          }
          
          console.log('📡 列表页未传递数据，从API获取...');
          hasLoadedRelated.current = true; // 标记为已加载
          
          const { api } = await import('../lib/apiClient');
          
          // 随机选择排序方式，增加随机性
          const sortOptions = ['latest', 'popular', 'views', 'downloads'];
          const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];
          
          // 获取数据（20条）
          const response = await api.popular.list({
            page: 1,
            limit: 20,
            sort: randomSort
          });
          
          console.log('📦 API响应 - 排序方式:', randomSort, '数据:', response);
          
          if (response.success && response.data) {
            // 尝试多种方式提取数组数据
            if (Array.isArray(response.data)) {
              dataPool = response.data;
            } else if (Array.isArray(response.data.items)) {
              dataPool = response.data.items;
            } else if (Array.isArray(response.data.pages)) {
              dataPool = response.data.pages;
            } else {
              console.warn('⚠️ API返回的数据不是数组格式:', response.data);
              setRelatedPages([]);
              return;
            }
          } else {
            console.warn('⚠️ API响应失败或无数据');
            setRelatedPages([]);
            return;
          }
        }
        
        console.log('📊 数据池大小:', dataPool.length, '条');
        
        // 过滤掉当前页面
        const filteredPages = dataPool.filter((page: any) => page.id.toString() !== id);
        
        console.log('🔍 过滤后剩余:', filteredPages.length, '条（已排除当前ID:', id, ')');
        
        // 使用 Fisher-Yates 洗牌算法，确保真正的随机
        const shuffled = [...filteredPages];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // 选择前4个
        const selected = shuffled.slice(0, 4);
        setRelatedPages(selected);
        
        console.log('✅ 加载相关推荐:', selected.length, '条');
        console.log('🎲 推荐卡片IDs:', selected.map((p: any) => p.id).join(', '), '(当前页面ID:', id, ')');
      } catch (error) {
        console.error('❌ 获取相关推荐失败:', error);
        // 如果失败，设置空数组
        setRelatedPages([]);
      }
    };

    if (!isDialog) {
      // 当ID变化时，重置标记，允许重新加载
      if (lastLoadedId.current !== id) {
        hasLoadedRelated.current = false;
      }
      fetchRelatedPages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isDialog]);

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
      originalFileUrl: 'https://via.placeholder.com/1200x1600?text=Fallback+HighRes',
      theme: 'Fantasy',
      style: 'Cartoon',
      size: 'A4',
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


  const handleLike = async () => {
    const wasLiked = isLiked;
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const { api } = await import('../lib/apiClient');
      if (wasLiked) {
        await api.coloring.unlike(id);
      } else {
        await api.coloring.like(id);
      }
    } catch (error) {
      console.error('❌ 点赞操作失败:', error);
      setIsLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
    }
  };

  const handleFavorite = async () => {
    const wasFavorited = isFavorited;
    setIsFavorited(!isFavorited);

    try {
      const { api } = await import('../lib/apiClient');
      if (wasFavorited) {
        await api.coloring.unfavorite(id);
      } else {
        await api.coloring.favorite(id);
      }
    } catch (error) {
      console.error('❌ 收藏操作失败:', error);
      setIsFavorited(wasFavorited);
    }
  };

  /**
   * 获取原始高清图片URL（公共函数）
   * 调用 API 获取真实的高清图片地址
   */
  const getOriginalImageUrl = async (): Promise<string | null> => {
    try {
      console.log('🔍 正在获取原始图片URL，ID:', id);
      const { api } = await import('../lib/apiClient');
      const response = await api.coloring.getOriginalImage(parseInt(id));
      
      if (response.success && response.data && response.data.imageUrl) {
        console.log('✅ 成功获取原始图片URL:', response.data.imageUrl);
        return response.data.imageUrl;
      } else {
        console.warn('⚠️ API响应成功但未返回图片URL:', response);
        return null;
      }
    } catch (error) {
      console.error('❌ 获取原始图片URL失败:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    try {
      console.log('📥 开始下载，ID:', id);
      
      // 1. 调用 API 获取原始图片 URL
      const originalImageUrl = await getOriginalImageUrl();
      
      if (!originalImageUrl) {
        alert('Sorry, unable to get the high-resolution image. Please try again later.');
        return;
      }
      
      console.log('✅ 获取到原始图片URL:', originalImageUrl);
      
      // 2. 使用 fetch 下载图片数据（R1存储桶已配置CORS）
      console.log('🔄 开始获取图片数据...');
      const response = await fetch(originalImageUrl);
      
      if (!response.ok) {
        throw new Error(`图片下载失败: ${response.status} ${response.statusText}`);
      }
      
      // 3. 将响应转换为 Blob
      const blob = await response.blob();
      console.log('✅ 图片数据获取成功，大小:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
      
      // 4. 创建 Blob URL
      const blobUrl = URL.createObjectURL(blob);
      
      // 5. 创建下载链接并触发下载
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${coloringPageData?.title || 'coloring-page'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 6. 释放 Blob URL，避免内存泄漏
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        console.log('🧹 已清理临时资源');
      }, 100);
      
      console.log('✅ 下载完成');
    } catch (error) {
      console.error('❌ 下载失败:', error);
      alert('Download failed. Please try again later.');
    }
  };

  const handlePrint = async () => {
    try {
      console.log('🖨️ 准备打印...');
      
      // 调用 API 获取真实的高清原图 URL
      const originalImageUrl = await getOriginalImageUrl();
      
      if (!originalImageUrl) {
        alert('Sorry, unable to get the high-resolution image. Please try again later.');
        return;
      }
      
      console.log('✅ 获取到打印图片URL:', originalImageUrl);
      
      // 获取当前日期时间（用于版权信息）
      const now = new Date();
      
      // 创建打印页面的HTML内容
      const printHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${coloringPageData?.title || 'Coloring Page'} - Print</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: Arial, sans-serif;
                background: white;
                padding: 20px;
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
              }
              
              .print-container {
                max-width: 100%;
                margin: 0 auto;
                position: relative;
                flex: 1;
                display: flex;
                flex-direction: column;
              }
              
              .print-image-wrapper {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                margin: 20px 0;
                padding-bottom: 30px;
              }
              
              .print-image {
                max-width: 100%;
                height: auto;
                display: block;
              }
              
              .print-footer {
                margin-top: auto;
                padding: 3px 0px;
                font-size: 8px;
                color: #666;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                display: flex;
                justify-content: flex-start;
                align-items: center;
              }
              
              .print-copyright {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 8px;
                white-space: nowrap;
                margin-left: 0cm;
              }
              
              .print-logo {
                font-weight: bold;
                color: #333;
              }
              
              @media print {
                body {
                  padding: 0;
                }
                
                .print-container {
                  max-width: 100%;
                }
                
                @page {
                  margin: 1cm;
                  @bottom-right {
                    content: none;
                  }
                  @bottom-left {
                    content: none;
                  }
                  @bottom-center {
                    content: none;
                  }
                  @bottom {
                    content: none;
                  }
                }
                
                /* 隐藏浏览器自动生成的页脚 */
                @page :first {
                  @bottom-right {
                    content: none;
                  }
                  @bottom-left {
                    content: none;
                  }
                  @bottom-center {
                    content: none;
                  }
                }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <div class="print-image-wrapper">
                <img 
                  src="${originalImageUrl}" 
                  alt="${coloringPageData?.title || 'Coloring Page'}"
                  class="print-image"
                  onload="window.print();"
                />
              </div>
              
              <div class="print-footer">
                <div class="print-copyright">
                  <span class="print-logo">365 Coloring Pages ©${now.getFullYear()} 365coloringpages.com All rights reserved.</span>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
      
      // 在当前页面创建打印内容
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'absolute';
      printFrame.style.top = '-9999px';
      printFrame.style.left = '-9999px';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = 'none';
      
      document.body.appendChild(printFrame);
      
      // 写入HTML内容到iframe
      const iframeDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(printHtml);
        iframeDoc.close();
        
        // 等待图片加载完成后打印
        const img = iframeDoc.querySelector('.print-image') as HTMLImageElement;
        if (img) {
          img.onload = () => {
            iframeDoc.defaultView?.print();
            // 打印完成后清理iframe
            setTimeout(() => {
              document.body.removeChild(printFrame);
            }, 1000);
          };
          // 如果图片已经加载完成
          if (img.complete) {
            iframeDoc.defaultView?.print();
            setTimeout(() => {
              document.body.removeChild(printFrame);
            }, 1000);
          }
        } else {
          // 没有图片时直接打印
          iframeDoc.defaultView?.print();
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        }
        
        console.log('✅ 打印对话框已打开');
      } else {
        console.warn('⚠️ 无法创建打印iframe');
        alert('Print failed. Please try again.');
        document.body.removeChild(printFrame);
      }
    } catch (error) {
      console.error('❌ 打印失败:', error);
      alert('Print failed. Please try again.');
    }
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
    <div className={isDialog ? '' : 'min-h-screen'} style={isDialog ? {} : { backgroundColor: '#fcfcf8' }}>
      {!isDialog && <Header />}
      
      <main className={isDialog ? 'py-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {/* 面包屑导航 */}
        {!isDialog && (
          <UnifiedBreadcrumb
            type={type}
            category={category}
            park={park}
            itemTitle={coloringPageData.title}
            searchParams={searchParams}
          />
        )}

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 mb-16">
          {/* 左侧图片区域 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="relative aspect-square">
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
          </div>

          {/* 右侧信息区域 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
            {/* 基本信息 */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">{coloringPageData.title}</h1>
                {/* 点赞、收藏、分享按钮 - 标题右上角 */}
                <div className="flex space-x-1.5 ml-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isLiked 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={isLiked ? '已点赞' : '点赞'}
                  >
                    <Heart 
                      className={`h-4 w-4 mr-1.5 transition-all duration-200`}
                      fill={isLiked ? 'currentColor' : 'none'}
                      strokeWidth={2}
                    />
                    <span className="font-medium text-sm">{likeCount}</span>
                  </button>
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isFavorited 
                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={isFavorited ? '已收藏' : '收藏'}
                  >
                    <Star 
                      className={`h-4 w-4 transition-all duration-200`}
                      fill={isFavorited ? 'currentColor' : 'none'}
                      strokeWidth={2}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {coloringPageData.description}
              </p>
            </div>

            {/* 详细信息 */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg">
                <div className="flex justify-between items-center text-sm px-3 py-1.5 bg-white border-r border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Theme:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.theme}</span>
                </div>
                <div className="flex justify-between items-center text-sm px-3 py-1.5 bg-blue-50 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Style:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.style}</span>
                </div>
                <div className="flex justify-between items-center text-sm px-3 py-1.5 bg-blue-50 border-r border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Size:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.size}</span>
                </div>
                <div className="flex justify-between items-center text-sm px-3 py-1.5 bg-white border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Difficulty:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.difficulty}</span>
                </div>
                <div className="flex justify-between items-center text-sm px-3 py-1.5 bg-white border-r border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Age Range:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.ageRange}</span>
                </div>
                <div className="flex justify-between items-center text-sm px-3 py-1.5 bg-blue-50 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Author:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.author}</span>
                </div>
                <div className="flex justify-between items-center text-sm px-3 py-1.5 bg-blue-50 border-r border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Created:</span>
                  <span className="font-medium text-gray-900">{coloringPageData.createdAt ? new Date(coloringPageData.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2 text-sm px-3 py-1.5 bg-white">
                  <span className="text-gray-600 font-medium whitespace-nowrap">Categories:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {coloringPageData.categories.map((cat, index) => (
                      <span
                        key={`${cat}-${index}`}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor()}`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI提示词 */}
            {coloringPageData.aiPrompt && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Prompt</h3>
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={coloringPageData.aiPrompt}
                    readOnly
                    className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coloringPageData.aiPrompt || '');
                      alert('Prompt copied to clipboard!');
                    }}
                    className="flex-shrink-0 p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Copy prompt"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 使用指南 */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex-1 flex flex-col justify-end">
              <h3 className="text-base font-semibold text-gray-900 mb-2">How to Use</h3>
              <ul className="space-y-1 text-sm text-gray-700">
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

            {/* 下载、打印按钮 - 底部 */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Download className="h-5 w-5 mr-2" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Printer className="h-5 w-5 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* 相关推荐 - 仅在非Dialog模式下显示 */}
        {!isDialog && relatedPages.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Coloring Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedPages.map((page) => {
                // 处理图片URL - 支持多个可能的字段名
                const getValidImageUrl = (): string => {
                  // 尝试多个可能的图片字段
                  const possibleUrls = [
                    page.thumbnailUrl,
                    page.previewUrl,
                    page.imageUrl,
                    page.thumbnail,
                    page.image
                  ];
                  
                  // 找到第一个非空的URL
                  const url = possibleUrls.find(u => u && typeof u === 'string' && u.length > 0);
                  
                  console.log('🖼️ 处理图片URL:', {
                    pageId: page.id,
                    pageTitle: page.title,
                    thumbnailUrl: page.thumbnailUrl,
                    previewUrl: page.previewUrl,
                    imageUrl: page.imageUrl,
                    selectedUrl: url,
                    urlType: typeof url,
                    urlLength: url?.length || 0
                  });
                  
                  if (!url) {
                    console.warn('⚠️ 未找到有效的图片URL，使用占位符，页面数据:', page);
                    return 'https://via.placeholder.com/400x400?text=No+Image';
                  }
                  
                  // 如果是相对路径，转换为绝对路径
                  if (url.startsWith('/')) {
                    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
                    const fullUrl = `${apiBaseUrl}${url}`;
                    console.log('🔄 转换相对路径:', { relative: url, absolute: fullUrl });
                    return fullUrl;
                  }
                  
                  // 如果已经是完整URL，直接返回
                  if (url.startsWith('http://') || url.startsWith('https://')) {
                    console.log('✅ 使用完整URL:', url);
                    return url;
                  }
                  
                  console.warn('⚠️ 无效的URL格式:', { url, page });
                  return 'https://via.placeholder.com/400x400?text=Invalid+URL';
                };

                const imageUrl = getValidImageUrl();
                
                return (
                  <div
                    key={page.id}
                    onClick={() => {
                      // 构建正确的跳转URL，保留category/park参数
                      let targetUrl = '';
                      switch (type) {
                        case 'popular':
                          // 如果有category参数，保留它
                          if (category) {
                            targetUrl = `/popular/${category}/${page.id}`;
                          } else {
                            targetUrl = `/popular/all/${page.id}`;
                          }
                          break;
                        case 'latest':
                          // 如果有category参数，保留它
                          if (category) {
                            targetUrl = `/latest/${category}/${page.id}`;
                          } else {
                            targetUrl = `/latest/${page.id}`;
                          }
                          break;
                        case 'first-coloring-book':
                          // 如果有category参数，保留它
                          if (category) {
                            targetUrl = `/first-coloring-book/${category}/${page.id}`;
                          } else {
                            targetUrl = `/first-coloring-book/${page.id}`;
                          }
                          break;
                        case 'theme-parks':
                          // 如果有park参数，保留它
                          if (park) {
                            targetUrl = `/theme-parks/${park}/${page.id}`;
                          } else {
                            targetUrl = `/theme-parks/${page.id}`;
                          }
                          break;
                        case 'categories':
                          // 如果有category参数，保留它
                          if (category) {
                            targetUrl = `/categories/${category}/${page.id}`;
                          } else {
                            targetUrl = `/categories/${page.id}`;
                          }
                          break;
                        case 'search':
                          // 搜索详情页需要保留查询参数
                          const params = new URLSearchParams();
                          if (searchParams?.q) params.set('q', searchParams.q);
                          if (searchParams?.page) params.set('page', searchParams.page);
                          if (searchParams?.limit) params.set('limit', searchParams.limit);
                          if (searchParams?.sort) params.set('sort', searchParams.sort);
                          if (searchParams?.category) params.set('category', searchParams.category);
                          params.set('id', page.id.toString());
                          targetUrl = `/search/detail?${params.toString()}`;
                          break;
                        default:
                          targetUrl = `/categories/${page.id}`;
                          break;
                      }
                      
                      console.log('🔗 跳转到详情页:', { 
                        from: window.location.pathname, 
                        to: targetUrl,
                        type,
                        category,
                        park,
                        pageId: page.id 
                      });
                      
                      router.push(targetUrl);
                    }}
                    className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                  >
                    <div className="aspect-square relative overflow-hidden bg-gray-200">
                      <Image
                        src={imageUrl}
                        alt={page.title || 'Coloring Page'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        onError={(e) => {
                          console.error('❌ 图片加载失败:', imageUrl);
                          console.error('❌ 完整的page数据:', JSON.stringify(page, null, 2));
                          e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                        }}
                        onLoad={() => {
                          console.log('✅ 图片加载成功:', imageUrl);
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-pink-600 transition-colors flex-1">
                          {page.title || 'Untitled'}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                          {page.difficulty || 'medium'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {!isDialog && <Footer />}
    </div>
  );
} 