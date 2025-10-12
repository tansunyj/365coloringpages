'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Download } from 'lucide-react';

interface ThemeParkColoringCardProps {
  page: {
    id: number;
    title: string;
    park: string;
    likes?: number;
    downloads?: number;
  };
}

export default function ThemeParkColoringCard({ page }: ThemeParkColoringCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  // 点击卡片导航到主题公园详情页
  const handleCardClick = () => {
    // 将主题公园名称转换为URL友好的格式
    const parkSlug = page.park.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
    router.push(`/theme-park/${parkSlug}/${page.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片点击
    setIsLiked(!isLiked);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片点击
    // 这里可以添加下载逻辑
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
    >
      {/* 图片占位符 */}
      <div className="aspect-[4/3] bg-gradient-to-br from-yellow-100 to-orange-100 relative overflow-hidden">
        {/* 模拟涂色页面图片 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl opacity-30">🎢</div>
        </div>
        
        {/* 主题公园标签 */}
        <div className="absolute top-2 left-2">
          <span className="bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
            {page.park}
          </span>
        </div>

        {/* 悬停时显示的操作按钮 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          <button
            onClick={handleLikeClick}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className="h-3 w-3" fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleDownloadClick}
            className="p-1.5 rounded-full bg-white/80 text-gray-600 hover:text-blue-500 backdrop-blur-sm transition-colors"
          >
            <Download className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {page.title}
        </h3>
        
        {/* 统计信息 */}
        {(page.likes !== undefined || page.downloads !== undefined) && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            {page.likes !== undefined && (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{page.likes}</span>
              </div>
            )}
            {page.downloads !== undefined && (
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{page.downloads}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 