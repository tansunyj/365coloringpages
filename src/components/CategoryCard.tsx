'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    // 导航到主分类页面
    router.push(`/categories`);
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* 图片容器 - 1:1比例（正方形） */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        {!imageError ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-150 flex items-center justify-center border border-gray-200/50">
            <div className="text-gray-400 text-center p-4">
              <div className="text-6xl mb-3 filter drop-shadow-sm">🎨</div>
              <div className="text-sm font-semibold text-gray-500">{category.name}</div>
              <div className="text-xs text-gray-400 mt-1">Image not available</div>
            </div>
          </div>
        )}
        
        {/* 悬浮时的轻微覆盖层 */}
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* 右上角数量指示器 */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full border border-white/50 shadow-lg">
          <span className="text-xs font-bold text-gray-800">{category.count}</span>
        </div>
      </div>

      {/* 底部信息区域 - 优化设计 */}
      <div className="p-4 space-y-2">
        {/* 分类名称 */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors leading-tight">
          {category.name}
        </h3>
        
        {/* 数量信息 */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm font-medium">
            {category.count} <span className="text-gray-500">designs</span>
          </p>
          
          {/* 探索按钮 */}
          <div className={`flex items-center text-yellow-600 text-xs font-semibold transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-1'
          }`}>
            <span>Explore</span>
            <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* 进度条（可选） */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full transition-all duration-300 group-hover:shadow-lg"
            style={{ width: `${Math.min((category.count / 300) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}