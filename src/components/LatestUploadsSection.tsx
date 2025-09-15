'use client';

import Link from 'next/link';
import LatestColoringCard from './LatestColoringCard';

export default function LatestUploadsSection() {
  // 模拟数据 - 10张最新上传的图片，2行显示
  const coloringPages = [
    {
      id: 1,
      title: 'Modern Art',
      category: 'Abstract'
    },
    {
      id: 2,
      title: 'Space Adventure',
      category: 'Fantasy'
    },
    {
      id: 3,
      title: 'Cute Robots',
      category: 'Technology'
    },
    {
      id: 4,
      title: 'Magic Forest',
      category: 'Nature'
    },
    {
      id: 5,
      title: 'Ocean Depths',
      category: 'Animals'
    },
    {
      id: 6,
      title: 'City Skyline',
      category: 'Architecture'
    },
    {
      id: 7,
      title: 'Fantasy Creatures',
      category: 'Fantasy'
    },
    {
      id: 8,
      title: 'Tropical Paradise',
      category: 'Nature'
    },
    {
      id: 9,
      title: 'Winter Wonderland',
      category: 'Seasonal'
    },
    {
      id: 10,
      title: 'Desert Sunset',
      category: 'Landscape'
    }
  ];

  return (
    <section className="py-8" style={{ backgroundColor: '#ecece8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest Uploads</h2>
          <Link href="/latest" className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors flex items-center">
            More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 白色卡片容器 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* 卡片网格 - 2行5列 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {coloringPages.map((page) => (
              <LatestColoringCard
                key={page.id}
                id={page.id}
                title={page.title}
                category={page.category}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}