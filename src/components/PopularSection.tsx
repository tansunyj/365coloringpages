'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PopularColoringCard from './PopularColoringCard';
import api from '../lib/apiClient';

interface PopularPage {
  id: number;
  title: string;
  description: string;
  primaryCategoryId: number;
  thumbnailUrl: string;
  previewUrl: string | null;
  originalUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  fileFormat: string;
  fileSize: number | null;
  status: string;
  downloads: number;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
  tags: string[];
  primaryCategory: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
  isLiked: boolean;
  isFavorited: boolean;
}

interface PopularApiResponse {
  success: boolean;
  data: {
    pages: PopularPage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    filters: {
      sort: string;
    };
    meta?: {
      totalResults: number;
    };
  };
  message: string;
}

export default function PopularSection() {
  const [coloringPages, setColoringPages] = useState<PopularPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularPages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.popular.list({
          page: 1,
          limit: 10,
          sort: 'popular'
        });

        if (response.success) {
          const data = response.data as PopularApiResponse['data'];
          setColoringPages(data?.pages || []);
        } else {
          setError('Failed to load popular coloring pages');
        }
      } catch (err) {
        console.error('Error fetching popular pages:', err);
        setError('Failed to load popular coloring pages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPages();
  }, []);

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
          {/* 加载状态 */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-square mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {/* 错误状态 */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-lg font-medium">{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* 卡片网格 - 2行5列 */}
          {!isLoading && !error && coloringPages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {coloringPages.map((page) => (
                <PopularColoringCard
                  key={page.id}
                  id={page.id}
                  title={page.title}
                  category={page.categoryName}
                  likes={page.likes}
                  downloads={page.downloads}
                  thumbnailUrl={page.thumbnailUrl}
                  categorySlug={page.categorySlug}
                />
              ))}
            </div>
          )}

          {/* 空状态 */}
          {!isLoading && !error && coloringPages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg font-medium">No popular coloring pages found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}