'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SimpleFirstColoringCard from './SimpleFirstColoringCard';
import { api } from '../lib/apiClient';

// 定义涂色书数据接口
interface ColoringBook {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  pageCount: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// API响应接口
interface ColoringBooksResponse {
  success: boolean;
  data: {
    books: ColoringBook[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      startRecord: number;
      endRecord: number;
    };
    filters: {
      query: string;
      book: string;
      sort: string;
    };
    meta: {
      totalResults: number;
    };
  };
  message: string;
}

export default function FirstColoringBookSection() {
  const [coloringBooks, setColoringBooks] = useState<ColoringBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取涂色书数据
  useEffect(() => {
    const fetchColoringBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.coloringBooks.list({ limit: 10 }) as ColoringBooksResponse;
        
        if (response.success && response.data && response.data.books && Array.isArray(response.data.books)) {
          // 过滤出激活的涂色书，按显示顺序排序，只显示前10个
          const activeBooks = response.data.books
            .filter(book => book.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .slice(0, 10);
          
          setColoringBooks(activeBooks);
        } else {
          setError('Failed to load coloring books');
        }
      } catch (err) {
        console.error('Error fetching coloring books:', err);
        setError('Failed to load coloring books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchColoringBooks();
  }, []);

  return (
    <section className="py-8" style={{ backgroundColor: '#f0f8f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Easy Coloring Book</h2>
            <p className="text-lg text-gray-600">Simple designs perfect for kids and beginners</p>
          </div>
          <Link 
            href="/easy-coloring-book"
            className="text-gray-600 hover:text-green-500 text-sm font-medium transition-colors flex items-center"
          >
            More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load coloring books</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading coloring books...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {coloringBooks.map((book) => {
                // 根据类型显示友好的分类文本
                const getCategoryLabel = (type: string) => {
                  switch (type) {
                    case 'first-coloring': return 'First Coloring';
                    case 'latest': return 'Latest';
                    case 'popular': return 'Popular';
                    default: return type;
                  }
                };
                
                return (
                  <SimpleFirstColoringCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    category={getCategoryLabel(book.type)}
                    slug={book.slug}
                    coverImage={book.coverImage}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}