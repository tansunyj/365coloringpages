'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveBannerGroup, getDefaultBannerGroup, type BannerGroup, type BannerImage } from '@/lib/bannerService';
import SimpleColoringCard from './SimpleColoringCard';

// ThemeSection相关类型定义
interface ThemeSection {
  title: string;
  subtitle: string;
  backgroundColor: string;
  data: Array<{
    id: number;
    title: string;
    category: string;
  }>;
}

interface ThemeSectionProps {
  section: ThemeSection;
}

// ThemeSection组件
export function ThemeSection({ section }: ThemeSectionProps) {
  return (
    <section className="py-16" style={{ backgroundColor: section.backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{section.title}</h2>
          </div>
          <button className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors flex items-center">
            More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 白色卡片容器 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* 卡片网格 - 2行5列 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {section.data.map((page) => (
              <SimpleColoringCard
                key={page.id}
                title={page.title}
                category={page.category}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 热门关键词接口
interface HotKeyword {
  keyword: string;
  clickCount: number;
}

// Hero组件
export default function Hero() {
  const [bannerGroup, setBannerGroup] = useState<BannerGroup>(getDefaultBannerGroup());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hotKeywords, setHotKeywords] = useState<HotKeyword[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(true);
  
  // 默认分类标签（作为fallback）
  const defaultCategories = ['Animals', 'Fantasy', 'Nature', 'Holidays'];

  // 加载banner组数据
  useEffect(() => {
    const loadBannerGroup = async () => {
      try {
        const activeBannerGroup = await getActiveBannerGroup();
        if (activeBannerGroup) {
          setBannerGroup(activeBannerGroup);
        }
      } catch (error) {
        console.error('Error loading banner group:', error);
        // Keep default banner group on error
      } finally {
        setIsLoading(false);
      }
    };

    loadBannerGroup();
  }, []);

  // 加载热门关键词
  useEffect(() => {
    const loadHotKeywords = async () => {
      try {
        const response = await fetch('/api/keywords');
        const data = await response.json();
        
        if (data.success && data.data) {
          setHotKeywords(data.data);
        }
      } catch (error) {
        console.error('Error loading hot keywords:', error);
        // 使用默认关键词作为fallback
        const fallbackKeywords = ['Animals', 'Fantasy', 'Nature', 'Holidays'];
        setHotKeywords(fallbackKeywords.map(cat => ({ keyword: cat, clickCount: 0 })));
      } finally {
        setKeywordsLoading(false);
      }
    };

    loadHotKeywords();
  }, []);

  // 自动轮播效果
  useEffect(() => {
    if (bannerGroup.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerGroup.images.length);
      }, bannerGroup.autoPlayInterval);
      
      return () => clearInterval(timer);
    }
  }, [bannerGroup.images.length, bannerGroup.autoPlayInterval]);
  
  const handleTagClick = async (tag: string) => {
    setSearchQuery(tag);
    
    // 记录关键词点击
    try {
      await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: tag }),
      });
    } catch (error) {
      console.error('Error recording keyword click:', error);
    }
  };
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 这里可以添加实际的搜索逻辑，例如跳转到搜索结果页面
      console.log('Searching for:', searchQuery);
      // 例如：router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 获取当前显示的图片
  const currentImage = bannerGroup.images[currentSlide] || bannerGroup.images[0];
  
  // 根据图片判断是否为深色背景（简单实现）
  const isDarkBackground = true; // 默认使用深色遮罩以确保文字可读性
  
  // 根据背景亮度动态设置样式类名
  const textColorClass = isDarkBackground ? 'text-white' : 'text-gray-900';
  const textShadowClass = isDarkBackground ? 'drop-shadow-lg' : 'drop-shadow-sm';
  const subtitleColorClass = isDarkBackground ? 'text-white/90' : 'text-gray-700';
  const overlayClass = isDarkBackground ? 'bg-black/40' : 'bg-white/20';

  // 获取当前显示的关键词
  const getCurrentKeywords = () => {
    if (keywordsLoading) {
      return defaultCategories.slice(0, 6); // 显示默认类别作为加载中的placeholder
    }
    
    if (hotKeywords.length > 0) {
      return hotKeywords.slice(0, 6).map(item => item.keyword); // 最多显示6个关键词
    }
    
    // fallback到默认分类
    return defaultCategories.slice(0, 6);
  };

  const bannerContent = (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#fcfcf8' }}>
      {/* Banner轮播背景 */}
      <div className="relative h-[400px] md:h-[450px]">
        {/* 背景图片轮播 */}
        <div className="absolute inset-0">
          {bannerGroup.images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover"
                unoptimized
                priority={index === 0}
              />
              {/* 半透明遮罩确保文字可读性 */}
              <div className={`absolute inset-0 ${overlayClass}`}></div>
            </div>
          ))}
        </div>
        
        {/* 悬浮的内容层 */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          {/* 主标题 - 使用当前图片标题或默认标题 */}
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${textColorClass} ${textShadowClass} leading-tight`}>
            {currentImage.title || 'Unleash Your Creativity'}
          </h1>
          
          {/* 副标题 - 使用当前图片副标题或描述 */}
          <p className={`text-lg md:text-xl mb-8 ${subtitleColorClass} max-w-2xl mx-auto font-medium ${textShadowClass}`}>
            {currentImage.subtitle || currentImage.description || 'Find, print, and download coloring pages. Or create your own with AI.'}
          </p>

          {/* 搜索框容器 - 统一宽度和左对齐 */}
          <div className="max-w-2xl mx-auto w-full mb-8">
            {/* 动态关键词标签 - 搜索框上方，左对齐 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {getCurrentKeywords().map((keyword, index) => (
                <button
                  key={keyword}
                  onClick={() => handleTagClick(keyword)}
                  className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 border ${textShadowClass} ${
                    isDarkBackground 
                      ? 'bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white border-white/50 hover:border-white/70'
                      : 'bg-gray-900/90 backdrop-blur-sm hover:bg-gray-900 text-white border-gray-800/70 hover:border-gray-700'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {keyword}
                </button>
              ))}
            </div>

            {/* 悬浮搜索框 */}
            <form className="relative mb-6" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${currentImage.title.toLowerCase()} or other themes...`}
                className="w-full pl-12 pr-14 py-4 bg-white/95 backdrop-blur-sm text-gray-900 rounded-2xl text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-2xl border border-white/20 focus:bg-white transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* 分类标签 - 搜索框下方，左对齐 */}
            <div className="flex flex-wrap gap-3">
              {defaultCategories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => handleTagClick(category)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl border ${textShadowClass} ${
                    isDarkBackground
                      ? 'bg-white/25 backdrop-blur-sm hover:bg-white/35 text-white border-white/50 hover:border-white/70'
                      : 'bg-gray-900/85 backdrop-blur-sm hover:bg-gray-900 text-white border-gray-800/70 hover:border-gray-700'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1 + 0.3}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 轮播指示器 - 只有多张图片时显示 */}
          {bannerGroup.images.length > 1 && (
            <div className="flex space-x-2 mt-8">
              {bannerGroup.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  // 如果当前图片有点击链接，包装成Link组件
  if (currentImage.clickUrl) {
    return (
      <Link href={currentImage.clickUrl} className="block">
        {bannerContent}
      </Link>
    );
  }

  return bannerContent;
}