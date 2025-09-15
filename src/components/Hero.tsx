'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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

// Hero组件

export default function Hero() {
  const categories = ['Animals', 'Fantasy', 'Nature', 'Holidays'];
  
  // 节假日专题数据 - 更多主题用于跑马灯效果
  const holidayThemes = [
    {
      id: 1,
      title: 'Christmas Coloring Pages',
      subtitle: 'Magical holiday designs for festive fun',
      tags: ['Christmas', 'Santa', 'Reindeer', 'Christmas Tree'],
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&h=600&fit=crop',
      keywords: ['Christmas magic', 'Holiday spirit', 'Winter wonderland'],
      isDark: true // 深色背景
    },
    {
      id: 2,
      title: 'Halloween Spooky Collection',
      subtitle: 'Spooky and fun designs for Halloween',
      tags: ['Halloween', 'Pumpkin', 'Ghost', 'Witch'],
      image: 'https://images.unsplash.com/photo-1509557965043-36ce8a4540b1?w=1200&h=600&fit=crop',
      keywords: ['Spooky fun', 'Halloween magic', 'Trick or treat'],
      isDark: true // 深色背景
    },
    {
      id: 3,
      title: 'Easter Spring Celebration',
      subtitle: 'Beautiful spring and Easter themes',
      tags: ['Easter', 'Bunny', 'Eggs', 'Spring'],
      image: 'https://images.unsplash.com/photo-1553531580-33306b7223d7?w=1200&h=600&fit=crop',
      keywords: ['Spring blooms', 'Easter joy', 'Fresh beginnings'],
      isDark: false // 浅色背景
    },
    {
      id: 4,
      title: 'Summer Beach Fun',
      subtitle: 'Sunny beach and ocean adventures',
      tags: ['Beach', 'Ocean', 'Sun', 'Vacation'],
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop',
      keywords: ['Summer vibes', 'Beach fun', 'Ocean dreams'],
      isDark: false // 浅色背景
    },
    {
      id: 5,
      title: 'Magical Unicorns',
      subtitle: 'Enchanting unicorn coloring adventures',
      tags: ['Unicorn', 'Magic', 'Rainbow', 'Fantasy'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop',
      keywords: ['Magical dreams', 'Unicorn magic', 'Rainbow colors'],
      isDark: true // 深色背景
    }
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 连续跑马灯轮播 - 3秒切换一次
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % holidayThemes.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [holidayThemes.length]);
  
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 这里可以添加实际的搜索逻辑，例如跳转到搜索结果页面
      console.log('Searching for:', searchQuery);
      // 例如：router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const currentTheme = holidayThemes[currentSlide];
  const isDarkBackground = currentTheme.isDark;
  
  // 根据背景亮度动态设置样式类名
  const textColorClass = isDarkBackground ? 'text-white' : 'text-gray-900';
  const textShadowClass = isDarkBackground ? 'drop-shadow-lg' : 'drop-shadow-sm';
  const subtitleColorClass = isDarkBackground ? 'text-white/90' : 'text-gray-700';
  const overlayClass = isDarkBackground ? 'bg-black/30' : 'bg-white/20';

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#fcfcf8' }}>
      {/* 全屏背景轮播图 */}
      <div className="relative h-[400px] md:h-[450px]">
        {/* 背景图片轮播 */}
        <div className="absolute inset-0">
          {holidayThemes.map((theme, index) => (
            <div
              key={theme.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={theme.image}
                alt={theme.title}
                fill
                className="object-cover"
                unoptimized
                priority={index === 0}
              />
              {/* 半透明遮罩 */}
              <div className={`absolute inset-0 ${overlayClass}`}></div>
            </div>
          ))}
        </div>
        
        {/* 悬浮的内容层 */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          {/* 主标题 */}
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${textColorClass} ${textShadowClass} leading-tight`}>
            Unleash Your Creativity
          </h1>
          
          {/* 副标题 */}
          <p className={`text-lg md:text-xl mb-8 ${subtitleColorClass} max-w-2xl mx-auto font-medium ${textShadowClass}`}>
            Find, print, and download coloring pages. Or create your own with AI.
          </p>

          {/* 搜索框容器 - 统一宽度和左对齐 */}
          <div className="max-w-2xl mx-auto w-full mb-8">
            {/* 动态节假日标签 - 搜索框上方，左对齐 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentTheme.keywords.map((keyword, index) => (
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
                placeholder={`Search for ${currentTheme.title.toLowerCase()} or other themes...`}
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

            {/* 动态分类标签 - 搜索框下方，左对齐 */}
            <div className="flex flex-wrap gap-3">
              {currentTheme.tags.map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
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
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* 轮播指示器 */}
          <div className="flex space-x-2 mt-8">
            {holidayThemes.map((_, index) => (
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
        </div>
      </div>
    </section>
  );
}