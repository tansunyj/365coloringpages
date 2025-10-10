'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Plus,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Save
} from 'lucide-react';

/**
 * 涂色卡关联管理公共组件
 * 用于管理分类、主题公园、涂色书与涂色卡之间的关联关系
 */

interface ColoringPage {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  previewUrl?: string;
  status?: string;
  difficulty?: string;
  ageRange?: string;
  theme?: string;
  style?: string;
  size?: string;
  isPremium?: number;
  isFeatured?: number;
  sortOrder?: number;
  relationCreatedAt?: string;
  createdAt?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

type ToastType = 'success' | 'error' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface Metadata {
  themes: Array<{ value: string; label: string }>;
  styles: Array<{ value: string; label: string }>;
  difficulties: Array<{ value: string; label: string }>;
  ageRanges: Array<{ value: string; label: string }>;
}

interface ManageRelatedColoringPagesProps {
  entityType: 'category' | 'theme-park' | 'coloring-book';
  entityId: number;
  entityName: string;
  metadata?: Metadata;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ManageRelatedColoringPages({
  entityType,
  entityId,
  entityName,
  metadata: propMetadata,
  onClose,
  onUpdate
}: ManageRelatedColoringPagesProps) {
  // 状态管理
  const [relatedPages, setRelatedPages] = useState<ColoringPage[]>([]);
  const [availablePages, setAvailablePages] = useState<ColoringPage[]>([]);
  const [relatedSearch, setRelatedSearch] = useState('');
  const [availableSearch, setAvailableSearch] = useState('');
  const [selectedRelated, setSelectedRelated] = useState<Set<number>>(new Set());
  const [selectedAvailable, setSelectedAvailable] = useState<Set<number>>(new Set());
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // 跟踪要添加和删除的ID
  const [toAddIds, setToAddIds] = useState<Set<number>>(new Set());
  const [toRemoveIds, setToRemoveIds] = useState<Set<number>>(new Set());
  const [originalRelatedIds, setOriginalRelatedIds] = useState<Set<number>>(new Set());
  
  // Metadata 状态 - 优先使用从父组件传入的数据
  const [metadata, setMetadata] = useState<Metadata>(propMetadata || {
    themes: [],
    styles: [],
    difficulties: [],
    ageRanges: []
  });
  
  // 分页状态
  const [relatedPage, setRelatedPage] = useState(1);
  const [availablePage, setAvailablePage] = useState(1);
  const [relatedPagination, setRelatedPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [availablePagination, setAvailablePagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Toast 提示
  const showToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // 获取实体类型显示名称
  const getEntityTypeName = () => {
    switch (entityType) {
      case 'category':
        return '分类';
      case 'theme-park':
        return '主题公园';
      case 'coloring-book':
        return '涂色书';
      default:
        return '';
    }
  };

  // 加载 Metadata - 仅在未从父组件传入时调用
  const loadMetadata = async () => {
    // 如果父组件已经传入了 metadata，则不需要重新加载
    if (propMetadata) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/metadata');
      const result = await response.json();

      if (result.success && result.data) {
        setMetadata({
          themes: result.data.themes || [],
          styles: result.data.styles || [],
          difficulties: result.data.difficulties || [],
          ageRanges: result.data.ageRanges || []
        });
      }
    } catch (error) {
      console.error('加载元数据失败:', error);
    }
  };

  // 获取标签显示名称的辅助函数
  const getThemeLabel = (value: string) => {
    const item = metadata.themes.find(t => t.value === value);
    return item?.label || value;
  };

  const getStyleLabel = (value: string) => {
    const item = metadata.styles.find(s => s.value === value);
    return item?.label || value;
  };

  const getDifficultyLabel = (value: string) => {
    const item = metadata.difficulties.find(d => d.value === value);
    return item?.label || value;
  };

  const getAgeRangeLabel = (value: string) => {
    const item = metadata.ageRanges.find(a => a.value === value);
    return item?.label || value;
  };

  // 加载已关联的涂色卡
  const loadRelatedPages = async (page = 1, search = '') => {
    setIsLoadingRelated(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        q: search
      });

      const response = await fetch(
        `http://localhost:3001/api/admin/${entityType}/${entityId}/coloring-pages?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      console.log('📦 左侧列表 API 响应:', result);
      
      if (result.success && result.data) {
        const items = result.data.pages || result.data.items || result.data.coloringPages || [];
        const pagination = result.data.pagination || relatedPagination;
        
        console.log('📦 解析后的数据:', { items: items.length, pagination });
        
        setRelatedPages(items);
        setRelatedPagination(pagination);
        
        // 保存初始的关联ID列表
        const ids = new Set<number>(items.map((item: ColoringPage) => item.id));
        setOriginalRelatedIds(ids);
      } else {
        console.error('❌ API 返回失败:', result);
        showToast('error', '加载已关联涂色卡失败');
      }
    } catch (error) {
      console.error('加载已关联涂色卡失败:', error);
      showToast('error', '网络错误');
    } finally {
      setIsLoadingRelated(false);
    }
  };

  // 加载所有涂色卡（用于选择添加）
  const loadAvailablePages = async (page = 1, search = '') => {
    setIsLoadingAvailable(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        q: search
      });

      const response = await fetch(
        `http://localhost:3001/api/admin/coloring-pages?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      console.log('📦 右侧列表 API 响应:', result);
      
      if (result.success && result.data) {
        const items = result.data.pages || result.data.items || result.data.coloringPages || [];
        const pagination = result.data.pagination || availablePagination;
        
        console.log('📦 解析后的数据:', { items: items.length, pagination });
        
        setAvailablePages(items);
        setAvailablePagination(pagination);
      } else {
        console.error('❌ API 返回失败:', result);
        showToast('error', '加载涂色卡列表失败');
      }
    } catch (error) {
      console.error('加载涂色卡列表失败:', error);
      showToast('error', '网络错误');
    } finally {
      setIsLoadingAvailable(false);
    }
  };

  // 初始加载（只执行一次）
  useEffect(() => {
    // 加载 metadata（如果没有传入）
    if (!propMetadata) {
      loadMetadata();
    }
    // 加载列表数据
    loadRelatedPages(1, '');
    loadAvailablePages(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 搜索已关联涂色卡
  const handleRelatedSearch = () => {
    setRelatedPage(1);
    loadRelatedPages(1, relatedSearch);
  };

  // 搜索可用涂色卡
  const handleAvailableSearch = () => {
    setAvailablePage(1);
    loadAvailablePages(1, availableSearch);
  };

  // 判断某个ID是否已在左侧关联列表中
  const isRelated = (id: number) => {
    return relatedPages.some(page => page.id === id);
  };

  // 添加关联（前端操作，不立即保存）
  const handleAddRelations = () => {
    if (selectedAvailable.size === 0) {
      showToast('warning', '请选择要添加的涂色卡');
      return;
    }

    // 找到选中的且未关联的涂色卡对象
    const itemsToAdd = availablePages.filter(page => 
      selectedAvailable.has(page.id) && !isRelated(page.id)
    );
    
    if (itemsToAdd.length === 0) {
      showToast('warning', '所选项目已在关联列表中');
      setSelectedAvailable(new Set());
      return;
    }
    
    // 添加到左侧列表（不修改右侧列表，因为右侧显示所有数据）
    const newRelatedPages = [...relatedPages, ...itemsToAdd];
    setRelatedPages(newRelatedPages);
    
    // 更新待添加列表
    const newToAddIds = new Set(toAddIds);
    itemsToAdd.forEach(item => {
      if (!originalRelatedIds.has(item.id)) {
        newToAddIds.add(item.id);
      }
      // 如果之前标记为要删除，现在取消删除
      toRemoveIds.delete(item.id);
    });
    setToAddIds(newToAddIds);
    setToRemoveIds(new Set(toRemoveIds));
    
    // 清空选择
    setSelectedAvailable(new Set());
    
    showToast('success', `已添加 ${itemsToAdd.length} 项到左侧列表`);
  };

  // 移除关联（前端操作，不立即保存）
  const handleRemoveRelations = () => {
    if (selectedRelated.size === 0) {
      showToast('warning', '请选择要移除的涂色卡');
      return;
    }

    const itemsToRemoveCount = selectedRelated.size;
    
    // 从左侧列表移除（不添加到右侧，因为右侧显示所有数据）
    const newRelatedPages = relatedPages.filter(page => !selectedRelated.has(page.id));
    setRelatedPages(newRelatedPages);
    
    // 更新待删除列表
    const newToRemoveIds = new Set(toRemoveIds);
    selectedRelated.forEach(id => {
      if (originalRelatedIds.has(id)) {
        newToRemoveIds.add(id);
      }
      // 如果之前标记为要添加，现在取消添加
      toAddIds.delete(id);
    });
    setToRemoveIds(newToRemoveIds);
    setToAddIds(new Set(toAddIds));
    
    // 清空选择
    setSelectedRelated(new Set());
    
    showToast('success', `已从关联列表移除 ${itemsToRemoveCount} 项`);
  };

  // 保存所有改动
  const handleSaveAll = async () => {
    if (toAddIds.size === 0 && toRemoveIds.size === 0) {
      showToast('warning', '没有需要保存的改动');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // 执行删除操作
      if (toRemoveIds.size > 0) {
        const deleteResponse = await fetch(
          `http://localhost:3001/api/admin/${entityType}/${entityId}/coloring-pages`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coloringPageIds: Array.from(toRemoveIds)
            })
          }
        );

        const deleteResult = await deleteResponse.json();
        if (!deleteResult.success) {
          showToast('error', `删除失败: ${deleteResult.error || '未知错误'}`);
          setIsSaving(false);
          return;
        }
      }

      // 执行添加操作
      if (toAddIds.size > 0) {
        const addResponse = await fetch(
          `http://localhost:3001/api/admin/${entityType}/${entityId}/coloring-pages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coloringPageIds: Array.from(toAddIds)
            })
          }
        );

        const addResult = await addResponse.json();
        if (!addResult.success) {
          showToast('error', `添加失败: ${addResult.error || '未知错误'}`);
          setIsSaving(false);
          return;
        }
      }

      // 成功保存
      showToast('success', '保存成功！');
      
      // 清空待操作列表
      setToAddIds(new Set());
      setToRemoveIds(new Set());
      
      // 重新加载数据
      await loadRelatedPages(1, '');
      await loadAvailablePages(1, '');
      
      // 通知父组件更新
      onUpdate?.();
      
      // 关闭对话框
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (error) {
      console.error('保存失败:', error);
      showToast('error', '网络错误，保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 单个选择/取消选择 - 已关联
  const toggleRelatedSelection = (id: number) => {
    const newSelected = new Set(selectedRelated);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRelated(newSelected);
  };

  // 单个选择/取消选择 - 可用
  const toggleAvailableSelection = (id: number) => {
    const newSelected = new Set(selectedAvailable);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAvailable(newSelected);
  };

  // 全选/取消全选 - 已关联
  const toggleAllRelated = () => {
    if (selectedRelated.size === relatedPages.length) {
      setSelectedRelated(new Set());
    } else {
      setSelectedRelated(new Set(relatedPages.map(p => p.id)));
    }
  };

  // 全选/取消全选 - 可用
  const toggleAllAvailable = () => {
    if (selectedAvailable.size === availablePages.length) {
      setSelectedAvailable(new Set());
    } else {
      setSelectedAvailable(new Set(availablePages.map(p => p.id)));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] h-[95vh] flex flex-col overflow-hidden">
        {/* 标题栏 - 渐变背景 */}
        <div className="relative bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                管理涂色卡关联
              </h2>
              <p className="text-orange-100 mt-1 text-sm">
                {getEntityTypeName()}：<span className="font-medium">{entityName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              title="关闭"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* 主内容区 - 穿梭框布局 */}
        <div className="flex-1 overflow-hidden p-6 bg-gray-50">
          <div className="flex gap-4 h-full">
            {/* 左侧：已关联列表 */}
            <div className="flex flex-col bg-white border-2 border-green-200 rounded-xl overflow-hidden shadow-lg flex-1">
              {/* 头部 */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 rounded-lg p-2">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        已关联
                      </h3>
                      <p className="text-green-100 text-xs">
                        共 {relatedPagination.totalCount} 个涂色卡
                      </p>
                    </div>
                  </div>
                  {relatedPages.length > 0 && (
                    <label className="flex items-center cursor-pointer text-sm bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedRelated.size === relatedPages.length && relatedPages.length > 0}
                        onChange={toggleAllRelated}
                        className="w-4 h-4 text-orange-600 border-white rounded focus:ring-orange-500 mr-2"
                      />
                      全选
                    </label>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索已关联的涂色卡..."
                    value={relatedSearch}
                    onChange={(e) => setRelatedSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRelatedSearch()}
                    className="w-full pl-10 pr-10 py-2 bg-white border border-white/20 rounded-lg focus:ring-2 focus:ring-white focus:bg-white text-sm shadow-sm text-gray-900"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 h-4 w-4 pointer-events-none" />
                  {relatedSearch && (
                    <button
                      onClick={() => {
                        setRelatedSearch('');
                        loadRelatedPages(1, '');
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 列表内容 */}
              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                {isLoadingRelated ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 animate-spin text-green-500" />
                      <div className="absolute inset-0 h-12 w-12 animate-ping text-green-300 opacity-20">
                        <Loader2 className="h-12 w-12" />
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm">加载中...</p>
                  </div>
                ) : relatedPages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-base font-medium text-gray-700 mb-1">暂无关联的涂色卡</p>
                    <p className="text-sm text-gray-500 text-center">
                      从右侧选择涂色卡进行添加
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {relatedPages.map((page) => (
                      <div
                        key={page.id}
                        className={`group border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                          selectedRelated.has(page.id)
                            ? 'border-orange-500 bg-orange-50 shadow-md scale-[1.02]'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50 hover:shadow-sm'
                        }`}
                        onClick={() => toggleRelatedSelection(page.id)}
                      >
                        <div className="flex gap-3">
                          <input
                            type="checkbox"
                            checked={selectedRelated.has(page.id)}
                            onChange={() => toggleRelatedSelection(page.id)}
                            className="w-5 h-5 mt-1 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {page.thumbnailUrl ? (
                            <div className="relative flex-shrink-0">
                              <img
                                src={page.thumbnailUrl}
                                alt={page.title}
                                className="w-24 h-24 object-cover rounded-lg shadow-sm"
                              />
                              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10"></div>
                            </div>
                          ) : (
                            <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                              <ImageIcon className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="mb-1">
                              <span className="text-xs text-gray-500 mr-1">名称:</span>
                              <span className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                {page.title}
                              </span>
                            </div>
                            <div className="mb-2">
                              <span className="text-xs text-gray-500 mr-1">Slug:</span>
                              <span className="text-xs text-gray-600">{page.slug}</span>
                              <span className="text-xs text-gray-400 ml-2">ID: {page.id}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {page.theme && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                                  <span className="opacity-70 mr-1">主题:</span>{getThemeLabel(page.theme)}
                                </span>
                              )}
                              {page.style && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                                  <span className="opacity-70 mr-1">风格:</span>{getStyleLabel(page.style)}
                                </span>
                              )}
                              {page.difficulty && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                                  page.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                  page.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  <span className="opacity-70 mr-1">难度:</span>
                                  {getDifficultyLabel(page.difficulty)}
                                </span>
                              )}
                              {page.ageRange && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-pink-100 text-pink-700">
                                  <span className="opacity-70 mr-1">年龄:</span>{getAgeRangeLabel(page.ageRange)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 底部操作栏 */}
              <div className="border-t-2 border-green-200 p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                {/* 分页 */}
                {relatedPages.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">
                      第 {relatedPagination.currentPage}/{relatedPagination.totalPages} 页，共 {relatedPagination.totalCount} 条
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newPage = relatedPage - 1;
                          setRelatedPage(newPage);
                          loadRelatedPages(newPage, relatedSearch);
                        }}
                        disabled={!relatedPagination.hasPrevPage}
                        className="p-2 bg-white border border-green-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => {
                          const newPage = relatedPage + 1;
                          setRelatedPage(newPage);
                          loadRelatedPages(newPage, relatedSearch);
                        }}
                        disabled={!relatedPagination.hasNextPage}
                        className="p-2 bg-white border border-green-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 中间：穿梭按钮区 */}
            <div className="flex flex-col items-center justify-center gap-6 w-32">
              <div className="space-y-4">
                {/* 向左移动按钮（从右侧添加到左侧） */}
                <button
                  onClick={handleAddRelations}
                  disabled={selectedAvailable.size === 0}
                  className="group relative p-5 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-xl flex items-center justify-center w-20 h-20"
                  title="添加选中项到左侧"
                >
                  <ChevronLeft className="h-8 w-8 font-bold" strokeWidth={3} />
                  {selectedAvailable.size > 0 && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white">
                      {selectedAvailable.size}
                    </div>
                  )}
                </button>
                
                {/* 向右移动按钮（从左侧移除到右侧） */}
                <button
                  onClick={handleRemoveRelations}
                  disabled={selectedRelated.size === 0}
                  className="group relative p-5 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-2xl hover:from-red-600 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-xl flex items-center justify-center w-20 h-20"
                  title="移除选中项到右侧"
                >
                  <ChevronRight className="h-8 w-8 font-bold" strokeWidth={3} />
                  {selectedRelated.size > 0 && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white">
                      {selectedRelated.size}
                    </div>
                  )}
                </button>
              </div>

              {/* 统计信息 */}
              <div className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md border border-gray-200">
                <div className="text-center space-y-3">
                  <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">统计</div>
                  <div className="space-y-2">
                    <div className="bg-white border-2 border-green-200 px-3 py-2 rounded-lg">
                      <div className="text-green-700 text-lg font-bold">{relatedPagination.totalCount}</div>
                      <div className="text-xs text-gray-500 mt-0.5">已关联</div>
                    </div>
                    <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded-lg">
                      <div className="text-blue-700 text-lg font-bold">{availablePagination.totalCount}</div>
                      <div className="text-xs text-gray-500 mt-0.5">可添加</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：未关联列表 */}
            <div className="flex flex-col bg-white border-2 border-blue-200 rounded-xl overflow-hidden shadow-lg flex-1">
              {/* 头部 */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        未关联
                      </h3>
                      <p className="text-blue-100 text-xs">
                        共 {availablePagination.totalCount} 个涂色卡
                      </p>
                    </div>
                  </div>
                  {availablePages.length > 0 && (
                    <label className="flex items-center cursor-pointer text-sm bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedAvailable.size === availablePages.length && availablePages.length > 0}
                        onChange={toggleAllAvailable}
                        className="w-4 h-4 text-orange-600 border-white rounded focus:ring-orange-500 mr-2"
                      />
                      全选
                    </label>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索可用的涂色卡..."
                    value={availableSearch}
                    onChange={(e) => setAvailableSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAvailableSearch()}
                    className="w-full pl-10 pr-10 py-2 bg-white border border-white/20 rounded-lg focus:ring-2 focus:ring-white focus:bg-white text-sm shadow-sm text-gray-900"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-700 h-4 w-4 pointer-events-none" />
                  {availableSearch && (
                    <button
                      onClick={() => {
                        setAvailableSearch('');
                        loadAvailablePages(1, '');
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 列表内容 */}
              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                {isLoadingAvailable ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                      <div className="absolute inset-0 h-12 w-12 animate-ping text-blue-300 opacity-20">
                        <Loader2 className="h-12 w-12" />
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm">加载中...</p>
                  </div>
                ) : availablePages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-base font-medium text-gray-700 mb-1">暂无可用的涂色卡</p>
                    <p className="text-sm text-gray-500 text-center">
                      所有涂色卡都已关联
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availablePages.map((page) => {
                      const alreadyRelated = isRelated(page.id);
                      return (
                        <div
                          key={page.id}
                          className={`group border-2 rounded-xl p-3 transition-all duration-200 ${
                            alreadyRelated
                              ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                              : selectedAvailable.has(page.id)
                              ? 'border-orange-500 bg-orange-50 shadow-md scale-[1.02] cursor-pointer'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm cursor-pointer'
                          }`}
                          onClick={() => !alreadyRelated && toggleAvailableSelection(page.id)}
                        >
                          <div className="flex gap-3">
                            <input
                              type="checkbox"
                              checked={alreadyRelated || selectedAvailable.has(page.id)}
                              onChange={() => toggleAvailableSelection(page.id)}
                              disabled={alreadyRelated}
                              className="w-5 h-5 mt-1 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={(e) => e.stopPropagation()}
                            />
                          {page.thumbnailUrl ? (
                            <div className="relative flex-shrink-0">
                              <img
                                src={page.thumbnailUrl}
                                alt={page.title}
                                className="w-24 h-24 object-cover rounded-lg shadow-sm"
                              />
                              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10"></div>
                            </div>
                          ) : (
                            <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                              <ImageIcon className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="mb-1 flex items-center gap-2">
                              <div>
                                <span className="text-xs text-gray-500 mr-1">名称:</span>
                                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {page.title}
                                </span>
                              </div>
                              {alreadyRelated && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-600 text-white">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  已关联
                                </span>
                              )}
                            </div>
                            <div className="mb-2">
                              <span className="text-xs text-gray-500 mr-1">Slug:</span>
                              <span className="text-xs text-gray-600">{page.slug}</span>
                              <span className="text-xs text-gray-400 ml-2">ID: {page.id}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {page.theme && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                                  <span className="opacity-70 mr-1">主题:</span>{getThemeLabel(page.theme)}
                                </span>
                              )}
                              {page.style && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                                  <span className="opacity-70 mr-1">风格:</span>{getStyleLabel(page.style)}
                                </span>
                              )}
                              {page.difficulty && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                                  page.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                  page.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  <span className="opacity-70 mr-1">难度:</span>
                                  {getDifficultyLabel(page.difficulty)}
                                </span>
                              )}
                              {page.ageRange && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-pink-100 text-pink-700">
                                  <span className="opacity-70 mr-1">年龄:</span>{getAgeRangeLabel(page.ageRange)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                )}
              </div>

              {/* 底部操作栏 */}
              <div className="border-t-2 border-blue-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                {/* 分页 */}
                {availablePages.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">
                      第 {availablePagination.currentPage}/{availablePagination.totalPages} 页，共 {availablePagination.totalCount} 条
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newPage = availablePage - 1;
                          setAvailablePage(newPage);
                          loadAvailablePages(newPage, availableSearch);
                        }}
                        disabled={!availablePagination.hasPrevPage}
                        className="p-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => {
                          const newPage = availablePage + 1;
                          setAvailablePage(newPage);
                          loadAvailablePages(newPage, availableSearch);
                        }}
                        disabled={!availablePagination.hasNextPage}
                        className="p-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex justify-center">
            {/* 保存按钮 - 居中 */}
            <button
              onClick={handleSaveAll}
              disabled={isSaving || (toAddIds.size === 0 && toRemoveIds.size === 0)}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center gap-3"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  保存
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toast 容器 */}
        <div className="fixed top-[30%] left-1/2 transform -translate-x-1/2 z-[60] space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{
                animation: 'slideIn 0.3s ease-out forwards'
              }}
              className={`flex items-center gap-3 min-w-[300px] px-4 py-3 rounded-lg shadow-lg transition-all ${
                toast.type === 'success'
                  ? 'bg-green-500 text-white'
                  : toast.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
              <span className="flex-1 text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Toast 动画样式 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}} />
    </div>
  );
}
