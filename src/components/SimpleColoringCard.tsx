'use client';

import Image from 'next/image';

interface SimpleColoringCardProps {
  title: string;
  category: string;
}

export default function SimpleColoringCard({ title, category }: SimpleColoringCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* 图片区域 - 5:4 比例 (宽度4, 高度5) */}
      <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo"
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        
        {/* 悬浮叠加层 - 显示标题 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
          <div className="w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium truncate">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}