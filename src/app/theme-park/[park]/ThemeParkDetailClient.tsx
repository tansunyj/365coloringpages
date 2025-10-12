'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import UniversalSearchComponent, { SearchConfig, SearchResultItem, SearchApiResponse } from '../../../components/UniversalSearchComponent';
import ThemeParkListCard from '../../../components/ThemeParkListCard';
import api from '../../../lib/apiClient';

// 主题公园数据接口
interface ThemePark {
  id: number;
  name: string;
  description: string;
  slug: string;
  coverUrl: string;
  brandColor: string;
  isActive: boolean;
  sortOrder: number;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ThemeParkDetailClientProps {
  parkSlug: string;
}

export default function ThemeParkDetailClient({ parkSlug }: ThemeParkDetailClientProps) {
  const searchParams = useSearchParams();
  const [themePark, setThemePark] = useState<ThemePark | null>(null);
  const [isLoadingThemePark, setIsLoadingThemePark] = useState(true);

  // 获取主题公园基本信息
  useEffect(() => {
    const fetchThemePark = async () => {
      try {
        setIsLoadingThemePark(true);
        const response = await api.themeParks.detail(parkSlug);
        if (response.success && response.data && typeof response.data === 'object') {
          const data = response.data as { themePark: ThemePark };
          if (data.themePark) {
            setThemePark(data.themePark);
          }
        }
      } catch (error) {
      } finally {
        setIsLoadingThemePark(false);
      }
    };

    fetchThemePark();
  }, [parkSlug]);

  // 配置搜索组件
  const searchConfig: SearchConfig = {
    // API配置
    apiEndpoint: async (params) => {
      const response = await api.themeParks.detail(parkSlug, {
        q: params.q,
        page: params.page,
        limit: params.limit,
        difficulty: params.difficulty,
        ageRange: params.ageRange,
      });
      return response as unknown as SearchApiResponse;
    },
    
    // 搜索参数
    defaultSort: '',
    defaultCategory: 'all',
    pageSize: 20,
    
    // 筛选选项
    difficultyOptions: [
      { value: '', label: 'All Difficulties' },
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ],
    ageRangeOptions: [
      { value: '', label: 'All Ages' },
      { value: '3-5', label: '3-5 years' },
      { value: '6-8', label: '6-8 years' },
      { value: '9-12', label: '9-12 years' },
      { value: '13+', label: '13+ years' }
    ],
    
    // 显示配置
    showSearch: true,
    showCategoryFilter: false,
    showSortFilter: false,
    showDifficultyFilter: true,
    showAgeRangeFilter: true,
    
    // 网格配置
    gridCols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
    
    // 页面标题
    title: themePark ? `${themePark.name} Coloring Pages` : 'Theme Park Coloring Pages',
    description: themePark ? themePark.description : 'Explore the most downloaded and viewed coloring pages by our community.',
    centerTitle: true,
    
    // 自定义渲染
    renderItem: (item) => (
      <ThemeParkListCard
        key={item.id}
        id={item.id}
        title={item.title}
        park={themePark?.name || ''}
        likes={item.likes || 0}
        downloads={item.downloads || 0}
      />
    ),
  };

  if (isLoadingThemePark) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading theme park...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UniversalSearchComponent 
          config={searchConfig}
          className="min-h-0" // 覆盖默认的min-h-screen
        />
      </div>

      <Footer />
    </div>
  );
} 