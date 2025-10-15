'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Download } from 'lucide-react';

interface FirstColoringListCardProps {
  id: number;
  title: string;
  category: string;
  likes?: number;
  downloads?: number;
  allPages?: any[];
}

export default function FirstColoringListCard({ 
  id, 
  title, 
  category,
  likes,
  downloads,
  allPages
}: FirstColoringListCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes || 50);
  const [downloadCount, setDownloadCount] = useState(downloads || 250);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 将category名称转换为URL友好的slug
  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleCardClick = () => {
    // 存储列表数据到sessionStorage
    if (allPages && allPages.length > 0) {
      const otherPages = allPages.filter(p => p.id !== id);
      const shuffled = otherPages.sort(() => 0.5 - Math.random());
      const selectedPages = shuffled.slice(0, 4);
      sessionStorage.setItem('relatedColoringPages', JSON.stringify(selectedPages));
    }
    
    const categorySlug = getCategorySlug(category);
    router.push(`/easy-coloring-book/${categorySlug}/${id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-gray-300 relative cursor-pointer"
    >
      {/* 图片区域 - 1:1 比例 (正方形) */}
      <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo"
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        
        {/* 在图片上方添加彩色点缀 */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-blue-400 to-green-500 text-white text-xs font-bold rounded-full opacity-90">
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
          <button
            onClick={handleDownload}
            className="p-2 bg-white/90 text-gray-600 rounded-full backdrop-blur-sm hover:bg-white hover:text-green-500 transition-all duration-200 hover:scale-110"
          >
            <Download className="h-4 w-4" />
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
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                                      {downloadCount}
                </span>
              </div>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                Easy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 