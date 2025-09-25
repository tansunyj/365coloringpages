'use client';

import Image from 'next/image';
import { Heart, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PopularColoringCardProps {
  title: string;
  category: string;
  likes?: number;
  downloads?: number;
  id?: number;
  thumbnailUrl?: string;
  categorySlug?: string;
}

export default function PopularColoringCard({ 
  title, 
  category, 
  likes,
  downloads,
  id,
  thumbnailUrl,
  categorySlug
}: PopularColoringCardProps) {
  // 使用useEffect来设置随机数，避免水合错误
  const [likeCount, setLikeCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [pageId, setPageId] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setLikeCount(likes !== undefined ? likes : Math.floor(Math.random() * 100) + 10);
    setDownloadCount(downloads !== undefined ? downloads : Math.floor(Math.random() * 500) + 50);
    setPageId(id !== undefined ? id : Math.floor(Math.random() * 100) + 1);
    setIsInitialized(true);
  }, [likes, downloads, id]);
  const router = useRouter();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };



  const handleCardClick = () => {
    // 导航到Popular分类详情页面
    const slug = categorySlug || 'animals'; // 默认分类
    router.push(`/popular/${slug}/${pageId}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-gray-300 relative cursor-pointer"
    >
      {/* 图片区域 - 1:1 比例 (正方形) */}
      <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
        <Image
          src={thumbnailUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        
        {/* 在图片上方添加彩色点缀 */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xs font-bold rounded-full opacity-90">
          {category}
        </div>
        
        {/* 右上角快速操作按钮 */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
              isLiked 
                ? 'bg-red-500/90 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* 增强的悬浮叠加层 - 显示标题和统计信息 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
          <div className="w-full p-4 text-white">
            <h3 className="text-sm font-bold truncate mb-2">{title}</h3>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {likeCount}
                </span>
              </div>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                Free
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 