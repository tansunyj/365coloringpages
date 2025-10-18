'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SimpleThemeParkCard from './SimpleThemeParkCard';
import api from '../lib/apiClient';

// 主题公园数据接口
interface ThemePark {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverUrl: string | null;
  brandColor: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdByAdmin: string | null;
  createdAt: string;
  updatedAt: string;
  pageCount: number;
}

// API 响应接口
interface ThemeParksResponse {
  success: boolean;
  data: ThemePark[];
}

export default function ThemeParkSection() {
  const [themeParks, setThemeParks] = useState<ThemePark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取主题公园数据
  useEffect(() => {
    const fetchThemeParks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.themeParks.list() as ThemeParksResponse;
        
        if (response.success && response.data && Array.isArray(response.data)) {
          // 只显示前10个激活的主题公园，按排序顺序
          const activeParks = response.data
            .filter(park => park.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .slice(0, 10);
          
          setThemeParks(activeParks);
        } else {
          setError('Failed to load theme parks');
        }
      } catch (err) {
        setError('Failed to load theme parks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemeParks();
  }, []);

  return (
    <section className="py-8" style={{ backgroundColor: '#f4f4f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题和More按钮 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Disney & Characters</h2>
          </div>
          <Link 
            href="/disney-characters"
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
          {/* 加载状态*/}
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

          {/* 错误状态*/}
          {error && !isLoading && (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
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

          {/* 主题公园卡片网格 */}
          {!isLoading && !error && themeParks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {themeParks.map((park) => (
                <SimpleThemeParkCard
                  key={park.id}
                  id={park.id}
                  title={park.name}
                  park={park.name}
                  coverUrl={park.coverUrl || undefined}
                  slug={park.slug}
                />
              ))}
            </div>
          )}

          {/* 空状态*/}
          {!isLoading && !error && themeParks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No theme parks available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}