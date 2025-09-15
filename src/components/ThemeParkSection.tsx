'use client';

import Link from 'next/link';
import SimpleThemeParkCard from './SimpleThemeParkCard';

export default function ThemeParkSection() {
  // 主题公园涂色页面数据 - 使用和其他页面一致的数据结构
  const themeParkData = [
    { id: 1, title: 'Mickey Mouse Castle', park: 'Disney World', likes: 456, downloads: 2340 },
    { id: 2, title: 'Jurassic T-Rex', park: 'Universal Studios', likes: 678, downloads: 3200 },
    { id: 3, title: 'Roller Coaster Loop', park: 'Six Flags', likes: 345, downloads: 1780 },
    { id: 4, title: 'Steel Vengeance', park: 'Cedar Point', likes: 789, downloads: 4100 },
    { id: 5, title: 'Cinderella\'s Carriage', park: 'Disney World', likes: 389, downloads: 1980 },
    { id: 6, title: 'Harry Potter Wand', park: 'Universal Studios', likes: 789, downloads: 4100 },
    { id: 7, title: 'Ferris Wheel Giant', park: 'Six Flags', likes: 234, downloads: 1200 },
    { id: 8, title: 'Millennium Force', park: 'Cedar Point', likes: 678, downloads: 3450 },
    { id: 9, title: 'Princess Crown', park: 'Disney World', likes: 678, downloads: 3450 },
    { id: 10, title: 'Transformer Robot', park: 'Universal Studios', likes: 543, downloads: 2780 }
  ];

  return (
    <section className="py-8" style={{ backgroundColor: '#f4f4f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题和More按钮 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Theme Park Adventures</h2>
          </div>
          <Link 
            href="/theme-park"
            className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors flex items-center"
          >
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
            {themeParkData.map((page) => (
              <SimpleThemeParkCard
                key={`${page.park}-${page.id}`}
                id={page.id}
                title={page.title}
                park={page.park}
                likes={page.likes}
                downloads={page.downloads}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}