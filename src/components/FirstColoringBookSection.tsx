'use client';


import Link from 'next/link';
import SimpleFirstColoringCard from './SimpleFirstColoringCard';

export default function FirstColoringBookSection() {
  // My First Coloring Book 数据 - 适合初学者的简单涂色页面
  const firstColoringBookData = [
    { id: 1, title: 'Simple Circle', category: 'Basic Shapes' },
    { id: 2, title: 'Happy Sun', category: 'Nature' },
    { id: 3, title: 'Smiling Face', category: 'Emotions' },
    { id: 4, title: 'Big Apple', category: 'Fruits' },
    { id: 5, title: 'Little Cat', category: 'Animals' },
    { id: 6, title: 'Red Heart', category: 'Shapes' },
    { id: 7, title: 'Rainbow', category: 'Nature' },
    { id: 8, title: 'Balloon', category: 'Fun' },
    { id: 9, title: 'Flower', category: 'Nature' },
    { id: 10, title: 'Star', category: 'Shapes' }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#f0f8f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">My First Coloring Book</h2>
            <p className="text-lg text-gray-600">Perfect for beginners and young artists</p>
          </div>
          <Link 
            href="/first-coloring-book"
            className="text-gray-600 hover:text-green-500 text-sm font-medium transition-colors flex items-center"
          >
            More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {firstColoringBookData.map((page) => (
              <SimpleFirstColoringCard
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