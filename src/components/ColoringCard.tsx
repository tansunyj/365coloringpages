'use client';

import { Download, Heart, Eye } from 'lucide-react';
import Image from 'next/image';

interface ColoringCardProps {
  title: string;
  category: string;
  imageUrl: string;
  downloadCount?: number;
  likeCount?: number;
}

export default function ColoringCard({ 
  title, 
  category, 
  imageUrl, 
  downloadCount = 0, 
  likeCount = 0 
}: ColoringCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* 图片区域 */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* 占位符内容 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-400 rounded-lg mx-auto mb-2 opacity-50 flex items-center justify-center">
              <span className="text-2xl text-white">🎨</span>
            </div>
            <p className="text-sm font-medium">{title}</p>
          </div>
        </div>
        
        {/* 悬浮操作按钮 */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors">
              <Heart className="h-5 w-5 text-gray-700" />
            </button>
            <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors">
              <Eye className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        
        {/* 统计信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {likeCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}