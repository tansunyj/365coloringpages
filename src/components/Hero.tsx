'use client';

import { Search } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

// 分类接口
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  imageUrl: string;
  sortOrder: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

// 热门关键词接口
interface HotKeyword {
  keyword: string;
  clickCount: number;
}

// Hero组件
export default function Hero() {
  const router = useRouter();
  const [bannerGroup, setBannerGroup] = useState<BannerGroup>(getDefaultBannerGroup());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [hotKeywords, setHotKeywords] = useState<HotKeyword[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // 用于跟踪是否已经开始加载categories，防止重复调用
  const categoriesLoadingStarted = useRef(false);
  // 用于跟踪是否已经开始加载keywords，防止重复调用
  const keywordsLoadingStarted = useRef(false);
  
  // 默认分类标签（作为fallback）
  const defaultCategories = ['Animals', 'Fantasy', 'Nature', 'Holidays'];

  // 检测客户端环境，避免hydration mismatch
  useEffect(() => {
    setIsClient(true);
    // 重置加载状态，确保重新加载数据
    categoriesLoadingStarted.current = false;
    keywordsLoadingStarted.current = false;
  }, []);

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

  // 加载分类数据
  useEffect(() => {
    // 只在客户端环境下加载
    if (!isClient) return;
    
    // 防止重复调用：如果已经开始加载过，就不再加载
    if (categoriesLoadingStarted.current) {
      console.log('Categories加载已开始过，跳过重复调用');
      return;
    }
    
    categoriesLoadingStarted.current = true;
    let isMounted = true; // 防止组件卸载后仍然设置状态
    
    const loadCategories = async () => {
      try {
        console.log('🔥 开始加载分类数据... (只应该看到这条日志一次)');
        
        const { api } = await import('../lib/apiClient');
        const response = await api.categories.list();
        
        console.log('Categories API响应:', response);
        
        // 检查组件是否仍然挂载
        if (!isMounted) return;
        
        if (response.success && response.data) {
          console.log('✅ 成功获取分类数据:', response.data);
          // 过滤活跃的分类并按sortOrder排序，取前6个
          const activeCategories = (response.data as Category[])
            .filter((cat: Category) => cat.isActive === 1)
            .sort((a: Category, b: Category) => a.sortOrder - b.sortOrder)
            .slice(0, 6);
          setCategories(activeCategories);
        } else {
          console.warn('⚠️ API响应格式不正确或无数据:', response);
          // 使用空数组作为fallback
          setCategories([]);
        }
      } catch (error) {
        // 检查组件是否仍然挂载
        if (!isMounted) return;
        
        console.error('❌ Error loading categories:', error);
        console.error('错误详情:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        // 使用空数组作为fallback
        setCategories([]);
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
          console.log('🏁 Categories加载完成');
        }
      }
    };

    loadCategories();
    
    // 清理函数：组件卸载时设置标志位
    return () => {
      isMounted = false;
    };
  }, [isClient]); // 依赖isClient，确保在客户端环境检测后运行

  // 加载热门关键词
  useEffect(() => {
    // 只在客户端环境下加载
    if (!isClient) return;
    
    // 防止重复调用：如果已经开始加载过，就不再加载
    if (keywordsLoadingStarted.current) {
      console.log('Keywords加载已开始过，跳过重复调用');
      return;
    }
    
    keywordsLoadingStarted.current = true;
    let isMounted = true; // 防止组件卸载后仍然设置状态
    
    const loadKeywords = async () => {
      try {
        console.log('🔥 开始加载热门关键词...');
        
        const { api } = await import('../lib/apiClient');
        const response = await api.keywords.get();
        
        console.log('Keywords API响应:', response);
        
        // 检查组件是否仍然挂载
        if (!isMounted) return;
        
        if (response.success && response.data) {
          console.log('✅ 成功获取关键词数据:', response.data);
          // 按点击数排序，取前8个关键词
          const sortedKeywords = (response.data as HotKeyword[])
            .sort((a, b) => b.clickCount - a.clickCount)
            .slice(0, 8);
          setHotKeywords(sortedKeywords);
        } else {
          console.warn('⚠️ API响应格式不正确或无数据:', response);
          // 使用默认关键词作为fallback
          const fallbackKeywords = ['小狗', '公主', '独角兽', '汽车', '花朵', '恐龙', '超级英雄', '魔法'];
          setHotKeywords(fallbackKeywords.map(keyword => ({ keyword, clickCount: 0 })));
        }
      } catch (error) {
        // 检查组件是否仍然挂载
        if (!isMounted) return;
        
        console.error('❌ Error loading keywords:', error);
        console.error('错误详情:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        // 使用默认关键词作为fallback
        const fallbackKeywords = ['小狗', '公主', '独角兽', '汽车', '花朵', '恐龙', '超级英雄', '魔法'];
        setHotKeywords(fallbackKeywords.map(keyword => ({ keyword, clickCount: 0 })));
      } finally {
        if (isMounted) {
          setKeywordsLoading(false);
          console.log('🏁 Keywords加载完成');
        }
      }
    };

    loadKeywords();
    
    // 清理函数：组件卸载时设置标志位
    return () => {
      isMounted = false;
    };
  }, [isClient]); // 依赖isClient，确保在客户端环境检测后运行

  // 自动轮播效果
  useEffect(() => {
    // 只在客户端启动轮播，避免hydration mismatch
    if (isClient && bannerGroup.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerGroup.images.length);
      }, bannerGroup.autoPlayInterval);
      
      return () => clearInterval(timer);
    }
  }, [isClient, bannerGroup.images.length, bannerGroup.autoPlayInterval]);
  
  const handleCategoryClick = async (categorySlug: string) => {
    // 跳转到搜索结果页面，使用分类过滤
    const searchParams = new URLSearchParams({
      q: '',
      page: '1',
      limit: '12',
      sort: '',
      category: categorySlug
    });
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleKeywordClick = async (keyword: string) => {
    // 记录关键词点击
    try {
      const { api } = await import('../lib/apiClient');
      await api.keywords.click(keyword);
    } catch (error) {
      console.error('Error recording keyword click:', error);
    }
    
    // 跳转到搜索结果页面，使用关键词搜索
    const searchParams = new URLSearchParams({
      q: keyword,
      page: '1',
      limit: '12',
      sort: '',
      category: ''
    });
    router.push(`/search?${searchParams.toString()}`);
  };
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 跳转到搜索结果页面，使用用户输入的关键词
      const searchParams = new URLSearchParams({
        q: searchQuery.trim(),
        page: '1',
        limit: '12',
        sort: '',
        category: ''
      });
      router.push(`/search?${searchParams.toString()}`);
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

  // 获取当前显示的分类 - 使用useMemo缓存计算结果
  const currentCategories = useMemo(() => {
    // 在服务端渲染时，始终显示默认分类以避免hydration mismatch
    if (!isClient) {
      return defaultCategories.slice(0, 6).map(name => ({ name, slug: name.toLowerCase(), color: '#6B7280' }));
    }
    
    if (categoriesLoading) {
      // 显示默认类别作为加载中的placeholder
      return defaultCategories.slice(0, 6).map(name => ({ name, slug: name.toLowerCase(), color: '#6B7280' }));
    }
    
    if (categories.length > 0) {
      // 返回加载的分类数据
      return categories.map(cat => ({ name: cat.name, slug: cat.slug, color: cat.color }));
    }
    
    // fallback到默认分类
    return defaultCategories.slice(0, 6).map(name => ({ name, slug: name.toLowerCase(), color: '#6B7280' }));
  }, [isClient, categoriesLoading, categories]);

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
          {/* 标题和副标题区域 - 可点击（如果有clickUrl） */}
          <div className={`${currentImage.clickUrl ? 'cursor-pointer' : ''}`}
               onClick={currentImage.clickUrl ? () => window.open(currentImage.clickUrl, '_self') : undefined}>
            {/* 主标题 - 使用当前图片标题或默认标题 */}
            <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${textColorClass} ${textShadowClass} leading-tight`}>
              {currentImage.title || 'Unleash Your Creativity'}
            </h1>
            
            {/* 副标题 - 使用当前图片副标题或描述 */}
            <p className={`text-lg md:text-xl mb-8 ${subtitleColorClass} max-w-2xl mx-auto font-medium ${textShadowClass}`}>
              {currentImage.subtitle || currentImage.description || 'Find, print, and download coloring pages. Or create your own with AI.'}
            </p>
          </div>

          {/* 搜索框容器 - 统一宽度和左对齐，独立区域不受Link影响 */}
          <div className="max-w-2xl mx-auto w-full mb-8">
            {/* 动态关键词标签 - 搜索框上方，左对齐 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentCategories.map((category, index) => (
                <button
                  key={category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 border ${textShadowClass}`}
                  style={{
                    backgroundColor: category.color + '20', // 20% opacity
                    borderColor: category.color,
                    color: isDarkBackground ? 'white' : category.color,
                    animation: `fadeInUp 0.6s ease-out forwards ${index * 0.1}s`
                  }}
                >
                  {category.name}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* 热门关键词标签 - 搜索框下方，左对齐 */}
            {!keywordsLoading && hotKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hotKeywords.map((item, index) => (
                  <button
                    key={item.keyword}
                    onClick={() => handleKeywordClick(item.keyword)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${textShadowClass} ${
                      isDarkBackground 
                        ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 hover:border-white/50'
                        : 'bg-gray-800/80 backdrop-blur-sm hover:bg-gray-800 text-white border border-gray-700 hover:border-gray-600'
                    }`}
                    style={{
                      animation: `fadeInUp 0.6s ease-out forwards ${index * 0.1}s`
                    }}
                  >
                    {item.keyword}
                  </button>
                ))}
              </div>
            )}

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

  // 直接返回banner内容，不使用Link包装整个区域
  return bannerContent;
}