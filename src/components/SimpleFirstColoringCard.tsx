'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Download } from 'lucide-react';

interface SimpleFirstColoringCardProps {
  id: number;
  title: string;
  category: string;
  slug?: string;
  coverImage?: string;
}

export default function SimpleFirstColoringCard({ 
  title, 
  category,
  slug,
  coverImage
}: SimpleFirstColoringCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setLikeCount(Math.floor(Math.random() * 100) + 10);
    setIsInitialized(true);
  }, []);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCardClick = () => {
    if (slug) {
      // 如果有slug，跳转到涂色书详情页
      router.push(`/first-coloring-book/${slug}`);
    } else {
      // 否则跳转到First Coloring Book列表页面，并预选对应的分类
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      router.push(`/first-coloring-book?category=${encodeURIComponent(categorySlug)}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-gray-300 relative cursor-pointer"
    >
      {/* 图片区域 - 1:1 比例 (正方形) */}
      <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
        <Image
          src={coverImage || "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        
        {/* 在图片上方添加彩色点缀 */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full opacity-90">
          {title}
        </div>
        
      </div>
    </div>
  );
} 