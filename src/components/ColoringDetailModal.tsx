'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Download, Printer, Heart, Share2, Star } from 'lucide-react';
import Toast from './Toast';

interface ColoringDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  coloringPageId: number;
}

interface ColoringPageDetail {
  id: number;
  title: string;
  description: string;
  author: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    color: string;
  }>;
  thumbnailUrl: string;
  originalFileUrl: string;
  difficulty: string;
  ageRange: string;
  views: number;
  likes: number;
  downloads: number;
  isLiked: boolean;
  isFavorited: boolean;
  createdAt: string;
  tags?: string[];
}

export default function ColoringDetailModal({ isOpen, onClose, coloringPageId }: ColoringDetailModalProps) {
  const [coloringPageData, setColoringPageData] = useState<ColoringPageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Toast状态
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  
  // 显示Toast提示
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type });
  };
  
  // 防止重复加载 - 记录上一次加载的ID和打开状态
  const lastLoadedId = useRef<number>(0);
  const lastOpenState = useRef<boolean>(false);

  useEffect(() => {
    if (!isOpen || !coloringPageId) return;
    
    // 如果弹窗状态和ID都没变，跳过重复加载
    if (lastLoadedId.current === coloringPageId && lastOpenState.current === isOpen) {
      console.log('🚫 弹窗详情未变化，跳过重复加载:', coloringPageId);
      return;
    }
    
    console.log('🔄 开始加载弹窗详情数据，ID:', coloringPageId);
    lastLoadedId.current = coloringPageId;
    lastOpenState.current = isOpen;

    const fetchColoringPageDetail = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = 'http://localhost:3001';
        const token = localStorage.getItem('authToken');
        
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/coloring-pages/${coloringPageId}`, {
          method: 'GET',
          headers,
        });
        
        if (!response.ok) {
          throw new Error(`获取详情失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setColoringPageData(data.data);
          setIsLiked(data.data.isLiked || false);
          setLikeCount(data.data.likes || 0);
          setIsFavorited(data.data.isFavorited || false);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchColoringPageDetail();
  }, [isOpen, coloringPageId]);

  const handleLike = async () => {
    // 检查是否登录
    const token = localStorage.getItem('authToken');
    if (!token) {
      showToast('Please login to like', 'warning');
      return;
    }
    
    const wasLiked = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      const { toggleLike } = await import('../lib/likeHelper');
      const result = await toggleLike(coloringPageId, wasLiked);
      setIsLiked(result.isLiked);
      setLikeCount(result.likes);
    } catch (error) {
      setIsLiked(wasLiked);
      setLikeCount(previousCount);
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleFavorite = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      showToast('Please login to add to favorites', 'warning');
      return;
    }
    
    const wasFavorited = isFavorited;
    setIsFavorited(!isFavorited);
    
    try {
      const { toggleFavorite } = await import('../lib/favoriteHelper');
      const result = await toggleFavorite(coloringPageId, wasFavorited);
      setIsFavorited(result.isFavorited);
    } catch (error) {
      setIsFavorited(wasFavorited);
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleDownload = async () => {
    if (!coloringPageData?.originalFileUrl) return;
    
    // 先调用下载统计API
    try {
      const response = await fetch(`http://localhost:3001/api/coloring/${coloringPageId}/download`, {
        method: 'POST',
      });
      
      if (response.ok) {
        console.log('✅ 下载次数统计成功');
      }
    } catch (error) {
      console.warn('⚠️ 下载次数统计失败:', error);
    }
    
    // 继续下载
    window.open(coloringPageData.originalFileUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/coloring/${coloringPageId}`;
    if (navigator.share) {
      navigator.share({
        title: coloringPageData?.title || 'Coloring Page',
        text: coloringPageData?.description || 'A beautiful coloring page for you to enjoy.',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading...' : coloringPageData?.title || 'Coloring Page Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : coloringPageData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 左侧图片区域 */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={coloringPageData.thumbnailUrl || 'https://via.placeholder.com/600x800?text=No+Image'}
                      alt={coloringPageData.title}
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Image+Not+Found';
                      }}
                    />
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    {/* 点赞按钮 */}
                    <button
                      onClick={handleLike}
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        isLiked 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={isLiked ? 'Unlike' : 'Like'}
                    >
                      <Heart 
                        className={`h-4 w-4 mr-1 transition-all duration-200`}
                        fill={isLiked ? 'currentColor' : 'none'}
                        strokeWidth={2}
                      />
                      <span className="font-medium">{likeCount}</span>
                    </button>
                    
                    {/* 收藏按钮 */}
                    <button
                      onClick={handleFavorite}
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                        isFavorited 
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                      <Star 
                        className={`h-4 w-4 transition-all duration-200`}
                        fill={isFavorited ? 'currentColor' : 'none'}
                        strokeWidth={2}
                      />
                    </button>
                    
                    {/* 分享按钮 */}
                    <button
                      onClick={handleShare}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 右侧信息区域 */}
              <div className="space-y-6">
                {/* 描述 */}
                <div>
                  <p className="text-gray-600 leading-relaxed">
                    {coloringPageData.description}
                  </p>
                  
                  {/* 分类标签 */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {coloringPageData.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ 
                          backgroundColor: `${cat.color}20`, 
                          color: cat.color 
                        }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Author:</span>
                      <span className="font-medium text-gray-900">{coloringPageData.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium text-gray-900">{coloringPageData.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age Range:</span>
                      <span className="font-medium text-gray-900">{coloringPageData.ageRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium text-gray-900">{coloringPageData.views?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Downloads:</span>
                      <span className="font-medium text-gray-900">{coloringPageData.downloads?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">
                        {coloringPageData.createdAt ? new Date(coloringPageData.createdAt).toLocaleDateString('en-US') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Guide */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      Click "Download" button to save the coloring page to your device
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      Print on standard A4 paper for best results
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      Use crayons, colored pencils, or markers for coloring
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      Share your wonderful creations with friends and family!
                    </li>
                  </ul>
                </div>

                {/* Tags */}
                {coloringPageData.tags && coloringPageData.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {coloringPageData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              未找到涂色卡片详情
            </div>
          )}
        </div>
      </div>
      
      {/* Toast提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

