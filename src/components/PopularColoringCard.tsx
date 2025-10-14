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
  slug?: string; // 添加slug字段
  allPages?: any[];
}

export default function PopularColoringCard({ 
  title, 
  category, 
  likes,
  downloads,
  id,
  thumbnailUrl,
  categorySlug,
  slug,
  allPages
}: PopularColoringCardProps) {
  // 标准化分类名称，如果为空则显示"其他"
  const displayCategory = !category || category.trim() === '' ? '其他' : category;
  
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
    // 存储完整的列表数据到sessionStorage（不筛选，详情页会处理）
    if (allPages && allPages.length > 0) {
      console.log('💾 PopularColoringCard 存储完整数据池:', allPages.length, '条');
      sessionStorage.setItem('listPageAllData', JSON.stringify(allPages));
    }
    
    // 导航到Popular分类详情页面，使用新的slug-id格式
    const catSlug = categorySlug || 'animals'; // 默认分类
    const pageSlug = slug || `page-${pageId}`;
    router.push(`/popular/${catSlug}/${pageSlug}-${pageId}`);
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
        
        {/* 左上角显示涂色卡片标题 */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full opacity-90">
          {title}
        </div>
        
      </div>
    </div>
  );
} 