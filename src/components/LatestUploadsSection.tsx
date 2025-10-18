'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LatestColoringCard from './LatestColoringCard';

// 定义 API 响应类型
interface LatestPageItem {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficulty: string;
  ageRange: string;
  views: number;
  likes: number;
  downloads: number;
  categoryName: string;
  categoryColor: string;
  slug?: string; // 添加slug字段
  createdAt: string;
}

interface LatestApiResponse {
  success: boolean;
  data: {
    pages: LatestPageItem[];
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
      category: string;
      sort: string;
      query: string;
    };
    meta: {
      searchTime: number;
      totalResults: number;
    };
  };
  message: string;
}

export default function LatestUploadsSection() {
  const [coloringPages, setColoringPages] = useState<LatestPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 分类名称到slug的转换函数
  const getCategorySlug = (categoryName: string): string => {
    const categoryMap: Record<string, string> = {
      '动物': 'animals',
      '幻想': 'fantasy', 
      '海洋': 'ocean',
      '太空': 'space',
      '自然': 'nature',
      '史前动物': 'prehistoric',
      '超级英雄': 'superhero',
      '农场': 'farm',
      '童话': 'fairy-tale',
      '节日': 'holidays'
    };
    
    return categoryMap[categoryName] || 'animals'; // 默认分类
  };

  // 获取最新上传的涂色页面数据
  useEffect(() => {
    const fetchLatestPages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { api } = await import('../lib/apiClient');
        const response = await api.latest.list({
          limit: 10, // 只获取前10条数据
          sort: 'newest'
        }) as LatestApiResponse;
        
        if (response.success && response.data && response.data.pages && Array.isArray(response.data.pages)) {
          setColoringPages(response.data.pages);
        } else {
          setError('Failed to load latest uploads');
        }
      } catch (err) {
        console.error('Error fetching latest uploads:', err);
        setError('Failed to load latest uploads');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPages();
  }, []);

  if (error) {
    return (
      <section className="py-8" style={{ backgroundColor: '#ecece8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-center text-red-600">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8" style={{ backgroundColor: '#ecece8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">New Coloring Pages</h2>
          <Link href="/new-coloring-pages" className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors flex items-center">
            More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 白色卡片容器 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {isLoading ? (
            /* 加载状态*/
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-xl animate-pulse" style={{ aspectRatio: '1/1' }}>
                  <div className="w-full h-full bg-gray-300 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            /* 卡片网格 - 2行3列*/
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {coloringPages.map((page) => (
                <LatestColoringCard
                  key={page.id}
                  id={page.id}
                  title={page.title}
                  category={page.categoryName || 'Other'}
                  likes={page.likes}
                  downloads={page.downloads}
                  thumbnailUrl={page.thumbnailUrl}
                  categorySlug={getCategorySlug(page.categoryName || 'Other')}
                  slug={page.slug}
                  allPages={coloringPages}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}