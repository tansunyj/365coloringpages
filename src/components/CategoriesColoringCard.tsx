'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Heart, Download, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ColoringPage {
  id: number;
  title: string;
  category: string;
  style: string;
  theme: string;
  size: string;
  image: string;
  likes: number;
  downloads: number;
  isPremium: boolean;
  slug?: string; // 添加slug字段
}

interface CategoriesColoringCardProps {
  page: ColoringPage;
  allPages?: ColoringPage[];
}

export default function CategoriesColoringCard({ page, allPages }: CategoriesColoringCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(page.likes);
  const router = useRouter();
  
  // 标准化分类名称，如果为空则显示"Other"
  const displayCategory = !page.category || page.category.trim() === '' ? 'Other' : page.category;

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

  const handleClick = () => {
    // 存储列表数据到sessionStorage
    if (allPages && allPages.length > 0) {
      const otherPages = allPages.filter(p => p.id !== page.id);
      const shuffled = otherPages.sort(() => 0.5 - Math.random());
      const selectedPages = shuffled.slice(0, 4);
      sessionStorage.setItem('relatedColoringPages', JSON.stringify(selectedPages));
    }
    
    const categorySlug = getCategorySlug(displayCategory);
    // 使用新的slug-id格式
    const pageSlug = page.slug || `page-${page.id}`;
    router.push(`/categories/${categorySlug}/${pageSlug}-${page.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
    >
      {/* 图片容器 - 1:1比例 */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        {!imageError ? (
          <Image
            src={page.image}
            alt={page.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-150 flex items-center justify-center border border-gray-200/50">
            <div className="text-gray-400 text-center p-4">
              <div className="text-5xl mb-3 filter drop-shadow-sm">🎨</div>
              <div className="text-sm font-semibold text-gray-500 mb-1">Line Art</div>
              <div className="text-xs text-gray-400 font-medium">{displayCategory}</div>
            </div>
          </div>
        )}
        
        {/* Premium 标志 */}
        {page.isPremium && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-yellow-300/50">
            <Crown className="h-3.5 w-3.5 fill-current" />
            <span className="tracking-wide">Premium</span>
          </div>
        )}
        
        {/* 右上角快速操作按钮 */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-200 hover:scale-110 shadow-lg ${
              isLiked 
                ? 'bg-red-500/90 text-white border-red-400/50' 
                : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-white/90 text-gray-700 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white hover:text-blue-500 transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
        
        {/* 悬浮时的信息覆盖层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
          <div className="w-full p-4 text-white">
            <h3 className="text-sm font-bold truncate mb-2 drop-shadow-sm">{page.title}</h3>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Heart className="h-3 w-3" />
                  <span className="font-medium">{likeCount}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Download className="h-3 w-3" />
                  <span className="font-medium">{page.downloads}</span>
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-white/30 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                  {page.size}
                </span>
                <span className="text-xs text-white/80 font-medium capitalize">
                  {page.style}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 