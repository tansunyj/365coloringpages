'use client';

import Link from 'next/link';
import PopularColoringCard from './PopularColoringCard';

export default function PopularSection() {
  // 模拟数据 - 10张图片，2行显示
  const coloringPages = [
    {
      id: 1,
      title: 'Unicorn',
      category: 'Fantasy'
    },
    {
      id: 2,
      title: 'Dragon',
      category: 'Fantasy'
    },
    {
      id: 3,
      title: 'Princess',
      category: 'Fantasy'
    },
    {
      id: 4,
      title: 'Superhero',
      category: 'Action'
    },
    {
      id: 5,
      title: 'Car',
      category: 'Vehicles'
    },
    {
      id: 6,
      title: 'Butterfly',
      category: 'Nature'
    },
    {
      id: 7,
      title: 'Flower Garden',
      category: 'Nature'
    },
    {
      id: 8,
      title: 'Castle',
      category: 'Fantasy'
    },
    {
      id: 9,
      title: 'Dinosaur',
      category: 'Animals'
    },
    {
      id: 10,
      title: 'Ocean Animals',
      category: 'Animals'
    }
  ];

  return (
    <section className="py-8" style={{ backgroundColor: '#fcfcf8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Popular</h2>
          <Link href="/popular" className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors flex items-center">
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
              <PopularColoringCard
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