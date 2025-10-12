'use client';

import Image from 'next/image';
import { Heart, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LatestColoringCardProps {
  title: string;
  category: string;
  likes?: number;
  downloads?: number;
  id?: number;
  thumbnailUrl?: string;
  categorySlug?: string;
}

export default function LatestColoringCard({ 
  title, 
  category, 
  likes,
  downloads,
  id,
  thumbnailUrl,
  categorySlug
}: LatestColoringCardProps) {
  // 标准化分类名称，如果为空则显示"其他"
  const displayCategory = !category || category.trim() === '' ? '其他' : category;
  
  // 使用useEffect来设置随机数，避免水合错误
  const [likeCount, setLikeCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [pageId, setPageId] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setLikeCount(likes || Math.floor(Math.random() * 100) + 10);
    setDownloadCount(downloads || Math.floor(Math.random() * 500) + 50);
    setPageId(id || Math.floor(Math.random() * 100) + 1);
    setIsInitialized(true);
  }, [likes, downloads, id]);
  const router = useRouter();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCardClick = () => {
    // 生成分类 slug
    const getCategorySlug = (categoryName: string): string => {
      const categoryMap: Record<string, string> = {
        '动物': 'animals',
        '幻想': 'fantasy', 
        '海洋': 'ocean',
        '太空': 'space',
        '自然': 'nature',
        '史前动物': 'prehistoric',
        '超级英雄': 'superhero',
        '农场': 'farm',
        '童话': 'fairy-tale',
        '节日': 'holidays'
      };
      
      return categoryMap[categoryName] || 'animals'; // 默认分类
    };

    const slug = categorySlug || getCategorySlug(category);
    // 导航到Latest分类详情页面
    router.push(`/latest/${slug}/${pageId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-gray-300 relative cursor-pointer"
    >
      {/* 图片区域 - 1:1 比例 (正方形) */}
      <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
        <Image
          src={thumbnailUrl || "https://images.unsplash.com/photo-1555400113-b651d7eb7525?w=400&h=400&fit=crop"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />

        {/* 左上角显示涂色卡片标题 */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full opacity-90">
          {title}
        </div>
      </div>
    </div>
  );
} 