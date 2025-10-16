'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Heart, Eye, Star } from 'lucide-react';

/**
 * 丰富涂色卡片组件属性接口
 */
interface RichColoringCardProps {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  views: number;
  likes: number;
  downloads: number;
  categoryName: string;
  categoryColor: string;
  isLiked?: boolean;
  isFavorited?: boolean;
  linkType: 'popular' | 'latest' | 'easy-coloring-book' | 'theme-parks' | 'categories' | 'search';
  linkCategory?: string;
  linkPark?: string;
  bookTitle?: string;
  bookType?: string;
  themeParkName?: string;
  themeParkSlug?: string;
  slug?: string; // 添加slug字段
  searchParams?: {
    q?: string;
    page?: string;
    limit?: string;
    sort?: string;
    category?: string;
  };
  allPages?: any[];
}

/**
 * 分类颜色映射工具
 */
class CategoryColorUtil {
  private static readonly colorMap: Record<string, string> = {
    '动物': 'bg-pink-500',
    '童话': 'bg-purple-500',
    '幻想': 'bg-indigo-500',
    '交通工具': 'bg-blue-500',
    '自然': 'bg-green-500',
    '史前动物': 'bg-yellow-500',
    '太空': 'bg-gray-800',
    '海洋': 'bg-cyan-500',
    '节日': 'bg-red-500',
    '超级英雄': 'bg-orange-500',
    '食物': 'bg-amber-500',
    '魔法': 'bg-violet-500',
    '农场': 'bg-lime-500',
    '庆祝': 'bg-rose-500',
    '其他': 'bg-gray-500'
  };

  static getBackgroundColor(categoryName: string): string {
    // 如果分类名称为空或未定义，使用"其他"的颜色
    if (!categoryName || categoryName.trim() === '') {
      return this.colorMap['其他'];
    }
    return this.colorMap[categoryName] || 'bg-gray-500';
  }
  
  /**
   * 标准化分类名称，如果为空则返回"其他"
   */
  static normalizeCategoryName(categoryName?: string | null): string {
    if (!categoryName || categoryName.trim() === '') {
      return '其他';
    }
    return categoryName;
  }
}

/**
 * 链接生成工具
 */
class LinkGenerator {
  /**
   * 根据页面类型生成详情页链接
   */
  static generateDetailLink(props: RichColoringCardProps): string {
    const { linkType, id, linkCategory, linkPark, searchParams, slug } = props;

    switch (linkType) {
      case 'categories':
        // 使用新的slug-id格式
        const pageSlug = slug || `page-${id}`;
        return `/categories/${linkCategory}/${pageSlug}-${id}`;
        
      case 'popular':
        // 使用新的URL结构：/best-coloring-pages/[category]/[slug-id]
        if (linkCategory && linkCategory !== 'all' && linkCategory !== '') {
          const pageSlug = slug || `page-${id}`;
          return `/best-coloring-pages/${linkCategory}/${pageSlug}-${id}`;
        } else {
          return `/best-coloring-pages/all/${id}`;
        }
          
      case 'search':
        // 使用新的URL结构：/search/[category]/[slug-id]
        if (linkCategory && linkCategory !== 'all' && linkCategory !== '') {
          const pageSlug = slug || `page-${id}`;
          return `/search/${linkCategory}/${pageSlug}-${id}`;
        } else {
          // 如果没有分类，使用旧的查询参数方式
          const params = new URLSearchParams();
          if (searchParams?.q) params.set('q', searchParams.q);
          if (searchParams?.page) params.set('page', searchParams.page);
          if (searchParams?.limit) params.set('limit', searchParams.limit);
          if (searchParams?.sort) params.set('sort', searchParams.sort);
          if (searchParams?.category) params.set('category', searchParams.category);
          params.set('id', id.toString());
          return `/search/detail?${params.toString()}`;
        }
        
      case 'theme-parks':
        // 使用新的URL结构：/disney-characters/[category]/[slug-id]
        if (linkCategory && linkCategory !== 'all' && linkCategory !== '') {
          const pageSlug = slug || `page-${id}`;
          return `/disney-characters/${linkCategory}/${pageSlug}-${id}`;
        } else {
          return `/disney-characters/theme-park-adventures/${id}`;
        }
          
      case 'easy-coloring-book':
        // 使用新的URL结构：/easy-coloring-pages/[category]/[slug-id]
        if (linkCategory && linkCategory !== 'all' && linkCategory !== '') {
          const pageSlug = slug || `page-${id}`;
          return `/easy-coloring-pages/${linkCategory}/${pageSlug}-${id}`;
        } else {
          return `/easy-coloring-pages/easy-coloring-book/${id}`;
        }
          
      case 'latest':
        // 使用新的URL结构：/new-coloring-pages/[category]/[slug-id]
        if (linkCategory && linkCategory !== 'all' && linkCategory !== '') {
          const pageSlug = slug || `page-${id}`;
          return `/new-coloring-pages/${linkCategory}/${pageSlug}-${id}`;
        } else {
          return `/new-coloring-pages/animals/${id}`; // 默认分类
        }
        
      default:
        return `/coloring/${id}`;
    }
  }
}

/**
 * 丰富涂色卡片组件
 * 
 * @description 
 * 显示完整的涂色页面信息，包括真实图片、统计数据、分类标签等
 * 支持不同页面类型的链接生成和交互功能
 * 
 * @example
 * <RichColoringCard
 *   id={8}
 *   title="可爱小狗涂色页"
 *   thumbnailUrl="https://example.com/image.jpg"
 *   difficulty="easy"
 *   ageRange="3-8岁"
 *   views={7}
 *   likes={0}
 *   downloads={0}
 *   categoryName="动物"
 *   categoryColor="#FF6B6B"
 *   linkType="search"
 *   searchParams={{q: "小狗"}}
 * />
 */
export default function RichColoringCard(props: RichColoringCardProps) {
  const {
    id,
    title,
    description,
    thumbnailUrl,
    difficulty,
    ageRange,
    views,
    likes,
    downloads,
    categoryName: rawCategoryName,
    isLiked = false,
    isFavorited = false,
    bookTitle,
    bookType,
    themeParkName,
    themeParkSlug,
    linkType,
    allPages
  } = props;

  const [liked, setLiked] = useState(isLiked);
  const [favorited, setFavorited] = useState(isFavorited);
  const [likeCount, setLikeCount] = useState(likes);
  const [imageError, setImageError] = useState(false);

  // 标准化分类名称，如果为空则显示"其他"
  const categoryName = CategoryColorUtil.normalizeCategoryName(rawCategoryName);

  // 生成详情页链接
  const detailLink = LinkGenerator.generateDetailLink(props);

  // 获取分类背景色
  const categoryBgColor = CategoryColorUtil.getBackgroundColor(categoryName);

  // 获取难度显示
  const getDifficultyDisplay = (difficulty: string) => {
    const difficultyMap = {
      'easy': { text: '简单', color: 'text-green-600', stars: 1 },
      'medium': { text: '中等', color: 'text-yellow-600', stars: 2 },
      'hard': { text: '困难', color: 'text-red-600', stars: 3 }
    };
    return difficultyMap[difficulty as keyof typeof difficultyMap] || difficultyMap.easy;
  };

  const difficultyInfo = getDifficultyDisplay(difficulty);

  // 处理点赞
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 先更新UI，提供即时反馈
    const wasLiked = liked;
    const previousCount = likeCount;
    
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    
    // 调用API更新点赞状态
    try {
      const { api } = await import('../lib/apiClient');
      
      if (wasLiked) {
        // 取消点赞
        await api.coloring.unlike(id);
      } else {
        // 点赞
        await api.coloring.like(id);
      }
    } catch (error) {
      // 如果API调用失败，回滚状态
      console.error('❌ 点赞操作失败:', error);
      setLiked(wasLiked);
      setLikeCount(previousCount);
      
      // 可以在这里添加错误提示
      // toast.error('操作失败，请稍后重试');
    }
  };

  // 处理收藏
  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wasFavorited = favorited;
    setFavorited(!favorited);
    
    try {
      const { api } = await import('../lib/apiClient');
      
      if (wasFavorited) {
        // 取消收藏
        await api.coloring.unfavorite(id);
      } else {
        // 收藏
        await api.coloring.favorite(id);
      }
    } catch (error) {
      console.error('❌ 收藏操作失败:', error);
      setFavorited(wasFavorited);
    }
  };

  // 图片加载错误处理
  const handleImageError = () => {
    setImageError(true);
  };

  // 处理卡片点击
  const handleCardClick = () => {
    // 存储完整的列表数据到sessionStorage（不筛选，详情页会处理）
    if (allPages && allPages.length > 0) {
      console.log('💾 RichColoringCard 存储完整数据池:', allPages.length, '条');
      sessionStorage.setItem('listPageAllData', JSON.stringify(allPages));
    }
  };

  return (
    <Link href={detailLink} onClick={handleCardClick} className="group block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-100">
        {/* 图片区域 */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageError ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={handleImageError}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            // 图片加载失败时的占位符
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🎨</div>
                <div className="text-xs font-medium">涂色页</div>
                <div className="text-xs text-gray-400 mt-1">{categoryName}</div>
              </div>
            </div>
          )}

          {/* 分类/涂色书/主题公园标题标签 - 左上角 */}
          <div className="absolute top-3 left-3 z-10">
            {linkType === 'theme-parks' && themeParkName ? (
              // 主题公园页面：显示主题公园名称
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-md">
                {themeParkName}
              </span>
            ) : linkType === 'easy-coloring-book' ? (
              // 涂色书页面：优先显示涂色书名称，如果没有则显示"涂色书"
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-md">
                {bookTitle || 'Easy Coloring Book'}
              </span>
            ) : (
              // 其他页面：显示分类名称
              <span className={`${categoryBgColor} text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-md`}>
                {categoryName}
              </span>
            )}
          </div>

          {/* 点赞和收藏按钮 - 右上角 */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            {/* 点赞按钮（上方） */}
            <button
              onClick={handleLike}
              className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                liked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500'
              }`}
              title={liked ? '已点赞' : '点赞'}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            
            {/* 收藏按钮（下方） */}
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                favorited 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-600 hover:text-yellow-500'
              }`}
              title={favorited ? '已收藏' : '收藏'}
            >
              <Star className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* 卡片内容 */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors flex-1">
              {title}
            </h3>
            {linkType === 'easy-coloring-book' && bookType && (
              <span className="bg-white/30 backdrop-blur-sm text-gray-800 px-2 py-1 text-xs font-bold rounded-full shadow-md ml-2 flex-shrink-0">
                {bookType}
              </span>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* 年龄范围和难度 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              适合年龄: {ageRange}
            </span>
            <div className="flex items-center space-x-1 text-xs">
              {Array.from({ length: difficultyInfo.stars }).map((_, index) => (
                <Star key={index} className={`h-3 w-3 ${difficultyInfo.color} fill-current`} />
              ))}
              <span className={`font-bold ${difficultyInfo.color}`}>
                {difficultyInfo.text}
              </span>
            </div>
          </div>
          
          {/* 统计信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <Heart className={`h-4 w-4 mr-1 ${liked ? 'text-red-500' : ''}`} />
              {(likeCount || 0).toLocaleString()}
            </span>
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {(views || 0).toLocaleString()}
            </span>
            <span className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              {(downloads || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 