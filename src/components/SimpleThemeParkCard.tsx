'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SimpleThemeParkCardProps {
  title: string;
  park: string;
  id: number;
  coverUrl?: string;
  slug?: string;
}

export default function SimpleThemeParkCard({ 
  title, 
  park, 
  id,
  coverUrl,
  slug
}: SimpleThemeParkCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    // 跳转到主题公园列表页面，使用SEO友好的URL结构
    const parkSlug = slug || park.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
    router.push(`/theme-parks/${parkSlug}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-gray-300 relative cursor-pointer"
    >
      {/* 图片区域 - 1:1 比例 (正方形) */}
      <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
        <Image
          src={coverUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        
        {/* 在图片上方添加主题公园标签 */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full opacity-90">
          {park}
        </div>
        

        
        {/* 悬浮叠加层 - 显示标题 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
          <div className="w-full p-4 text-white">
            <h3 className="text-sm font-bold truncate">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
} 