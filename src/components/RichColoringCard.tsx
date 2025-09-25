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
  linkType: 'popular' | 'latest' | 'first-coloring-book' | 'theme-parks' | 'categories' | 'search';
  linkCategory?: string;
  linkPark?: string;
  searchParams?: {
    q?: string;
    page?: string;
    limit?: string;
    sort?: string;
    category?: string;
  };
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
    '庆祝': 'bg-rose-500'
  };

  static getBackgroundColor(categoryName: string): string {
    return this.colorMap[categoryName] || 'bg-gray-500';
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
    const { linkType, id, linkCategory, linkPark, searchParams } = props;

    switch (linkType) {
      case 'categories':
        return `/categories/${linkCategory}/${id}`;
        
      case 'popular':
        return linkCategory 
          ? `/popular/${linkCategory}/${id}`
          : `/popular/all/${id}`;
          
      case 'search':
        const params = new URLSearchParams();
        if (searchParams?.q) params.set('q', searchParams.q);
        if (searchParams?.page) params.set('page', searchParams.page);
        if (searchParams?.limit) params.set('limit', searchParams.limit);
        if (searchParams?.sort) params.set('sort', searchParams.sort);
        if (searchParams?.category) params.set('category', searchParams.category);
        params.set('id', id.toString());
        return `/search/detail?${params.toString()}`;
        
      case 'theme-parks':
        return linkCategory 
          ? `/theme-parks/${linkCategory}/${id}`
          : `/theme-parks/theme-park-adventures/${id}`;
          
      case 'first-coloring-book':
        return linkCategory 
          ? `/first-coloring-book/${linkCategory}/${id}`
          : `/first-coloring-book/${id}`;
          
      case 'latest':
        return linkCategory 
          ? `/latest/${linkCategory}/${id}`
          : `/latest/animals/${id}`; // 默认分类
        
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
    categoryName,
    isLiked = false
  } = props;

  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [imageError, setImageError] = useState(false);

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
    
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    
    // 这里可以调用API更新点赞状态
    try {
      // const response = await api.coloring.like(id);
      console.log(`${liked ? 'Unlike' : 'Like'} coloring page ${id}`);
    } catch (error) {
      // 如果API调用失败，回滚状态
      setLiked(liked);
      setLikeCount(likes);
      console.error('Failed to update like status:', error);
    }
  };

  // 处理下载
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // const response = await api.coloring.download(id);
      console.log(`Download coloring page ${id}`);
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  // 图片加载错误处理
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={detailLink} className="group block">
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

          {/* 分类标签 - 左上角 */}
          <div className="absolute top-3 left-3">
            <span className={`${categoryBgColor} text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-md`}>
              {categoryName}
            </span>
          </div>

          {/* 难度标签 - 右上角 */}
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
              {Array.from({ length: difficultyInfo.stars }).map((_, index) => (
                <Star key={index} className={`h-3 w-3 ${difficultyInfo.color} fill-current`} />
              ))}
              <span className={`text-xs font-medium ${difficultyInfo.color}`}>
                {difficultyInfo.text}
              </span>
            </div>
          </div>

          {/* 悬浮操作按钮 */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-3">
              <button
                onClick={handleLike}
                className={`p-3 rounded-full shadow-lg transition-colors ${
                  liked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleDownload}
                className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors text-gray-700 hover:text-orange-500"
              >
                <Download className="h-5 w-5" />
              </button>
              <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors text-gray-700 hover:text-blue-500">
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 卡片内容 */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* 年龄范围 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              适合年龄: {ageRange}
            </span>
          </div>
          
          {/* 统计信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {(views || 0).toLocaleString()}
              </span>
              <span className="flex items-center">
                <Heart className={`h-4 w-4 mr-1 ${liked ? 'text-red-500' : ''}`} />
                {(likeCount || 0).toLocaleString()}
              </span>
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {(downloads || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* 下载按钮 */}
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Free Download
          </button>
        </div>
      </div>
    </Link>
  );
} 