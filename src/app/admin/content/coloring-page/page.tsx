'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Save,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Upload,
  XCircle,
  Filter,
  CheckCircle,
  AlertTriangle,
  Tag,
  Calendar
} from 'lucide-react';

interface ColoringPage {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  previewUrl: string;
  originalFileUrl: string;
  fileFormat: string;
  fileSize: number | null;
  difficulty: string;
  ageRange: string;
  theme: string | null;
  style: string;
  size: string;
  isPremium: boolean;
  isFeatured: boolean;
  status: string;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  prompt: string | null;
  aiPrompt: string | null;
  createdAt: string;
  updatedAt: string;
  categoryNames: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startRecord: number;
  endRecord: number;
}

type ToastType = 'success' | 'error' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface MetadataItem {
  type: string;
  value: string;
  label: string;
  labelZh: string;
  description: string;
  sortOrder: number;
  isActive: number;
  icon: string | null;
  color: string | null;
}

interface MetadataGroup {
  type: string;
  items: MetadataItem[];
}

export default function AdminColoringPages() {
  const [coloringPages, setColoringPages] = useState<ColoringPage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPage, setEditingPage] = useState<ColoringPage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    previewUrl: '',
    difficulty: 'easy',
    ageRangeMin: '2',
    ageRangeMax: '12',
    theme: [] as string[],
    style: [] as string[],
    size: 'A4',
    prompt: '',
    seoTitle: '',
    seoDescription: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [imagePreview, setImagePreview] = useState('');
  
  // 筛选相关状态
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [themeFilter, setThemeFilter] = useState<string>('');
  const [styleFilter, setStyleFilter] = useState<string>('');
  
  // 元数据状态
  const [metadata, setMetadata] = useState<{
    difficulty: MetadataItem[];
    size: MetadataItem[];
    style: MetadataItem[];
    theme: MetadataItem[];
  }>({
    difficulty: [],
    size: [],
    style: [],
    theme: []
  });
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
    startRecord: 0,
    endRecord: 0,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPage, setDetailPage] = useState<ColoringPage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePageId, setDeletePageId] = useState<number | null>(null);

  // Toast 提示函数
  const showToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // 统一错误处理函数
  const handleApiError = (response: Response, data: any, defaultMessage: string) => {
    if (response.status === 401) {
      showToast('error', '登录已过期，请重新登录');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1500);
      return;
    }

    let errorMessage = defaultMessage;
    let toastType: 'warning' | 'error' = 'warning';
    
    switch (response.status) {
      case 400:
        errorMessage = data.message || '请求参数无效';
        break;
      case 404:
        errorMessage = data.message || '涂色卡不存在';
        break;
      case 409:
        errorMessage = data.message || '存在关联数据，无法执行此操作';
        break;
      case 500:
        errorMessage = data.message || '服务器内部错误';
        toastType = 'error';
        break;
      default:
        errorMessage = data.message || defaultMessage;
    }

    showToast(toastType, errorMessage);
  };

  // 加载元数据
  const loadMetadata = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/metadata');
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const metadataMap: any = {
          difficulty: [],
          size: [],
          style: [],
          theme: []
        };

        data.data.forEach((group: MetadataGroup) => {
          if (group.type && group.items) {
            metadataMap[group.type] = group.items;
          }
        });

        setMetadata(metadataMap);
      } else {
      }
    } catch (error) {
      console.error('加载元数据失败:', error);
    }
  };

  // 获取 metadata 的 labelZh 值
  const getThemeLabel = (value: string) => {
    const item = metadata.theme.find(item => item.value === value);
    return item ? item.labelZh : value;
  };

  const getStyleLabel = (value: string) => {
    const item = metadata.style.find(item => item.value === value);
    return item ? item.labelZh : value;
  };

  const getSizeLabel = (value: string) => {
    const item = metadata.size.find(item => item.value === value);
    return item ? item.labelZh : value;
  };

  // 清理年龄范围字符串，去掉"岁"字
  const cleanAgeRange = (ageRange: string | null | undefined): string => {
    if (!ageRange) return '-';
    // 去掉"岁"字
    return ageRange.replace(/岁/g, '').trim();
  };

  // 从API加载涂色卡数据
  const loadColoringPages = async (page = 1, search = '', status = '', difficulty = '', theme = '', style = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const { api, adminApiClient } = await import('@/lib/apiClient');
      adminApiClient.setToken(token || '');
      
      const data = await api.admin.coloringPages.list({
        q: search,
        page: page,
        limit: itemsPerPage,
        status: status || undefined,
        difficulty: difficulty || undefined,
        theme: theme || undefined,
        style: style || undefined
      });
      
      if (data.success && data.data) {
        const responseData = data.data as any;
        if (responseData.pages && Array.isArray(responseData.pages)) {
          setColoringPages(responseData.pages);
          
          if (responseData.pagination) {
            setPagination({
              ...responseData.pagination,
              limit: itemsPerPage,
              startRecord: (responseData.pagination.currentPage - 1) * itemsPerPage + 1,
              endRecord: Math.min(responseData.pagination.currentPage * itemsPerPage, responseData.pagination.totalCount)
            });
          }
        }
      } else {
        showToast('error', data.message || '加载涂色卡列表失败');
      }
    } catch (error) {
      console.error('加载涂色卡失败:', error);
      showToast('error', '加载失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetadata(); // 加载元数据
    loadColoringPages(currentPage, searchTerm, statusFilter, difficultyFilter, themeFilter, styleFilter);
  }, [currentPage]);

  // 处理搜索输入
  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
  };

  // 执行搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadColoringPages(1, searchTerm, statusFilter, difficultyFilter, themeFilter, styleFilter);
  };

  // 处理状态筛选
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadColoringPages(1, searchTerm, status, difficultyFilter, themeFilter, styleFilter);
  };

  // 处理难度筛选
  const handleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter(difficulty);
    setCurrentPage(1);
    loadColoringPages(1, searchTerm, statusFilter, difficulty, themeFilter, styleFilter);
  };

  // 处理主题筛选
  const handleThemeFilter = (theme: string) => {
    setThemeFilter(theme);
    setCurrentPage(1);
    loadColoringPages(1, searchTerm, statusFilter, difficultyFilter, theme, styleFilter);
  };

  // 处理风格筛选
  const handleStyleFilter = (style: string) => {
    setStyleFilter(style);
    setCurrentPage(1);
    loadColoringPages(1, searchTerm, statusFilter, difficultyFilter, themeFilter, style);
  };

  // 清空搜索框
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    loadColoringPages(1, '', statusFilter, difficultyFilter, themeFilter, styleFilter);
  };

  // 重置所有筛选条件
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDifficultyFilter('');
    setThemeFilter('');
    setStyleFilter('');
    setCurrentPage(1);
    loadColoringPages(1, '', '', '', '', '');
  };

  // 验证表单
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      errors.title = '标题不能为空';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug不能为空';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 生成slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // 处理行点击
  const handleRowClick = (page: ColoringPage) => {
    setDetailPage(page);
    setShowDetailModal(true);
  };

  // 添加涂色卡
  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      // 构建年龄范围字符串
      const ageRange = formData.ageRangeMin && formData.ageRangeMax 
        ? `${formData.ageRangeMin}-${formData.ageRangeMax} years`
        : formData.ageRangeMin
        ? `${formData.ageRangeMin}+ years`
        : formData.ageRangeMax
        ? `Under ${formData.ageRangeMax} years`
        : 'All ages';
      
      const response = await fetch('http://localhost:3001/api/admin/coloring-pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ageRange,
          style: Array.isArray(formData.style) ? formData.style.join(', ') : formData.style,
          theme: Array.isArray(formData.theme) ? formData.theme.join(', ') : formData.theme,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '涂色卡添加成功！');
        setShowAddModal(false);
        setFormData({
          title: '',
          slug: '',
          description: '',
          imageUrl: '',
          thumbnailUrl: '',
          previewUrl: '',
          difficulty: 'easy',
          ageRangeMin: '2',
          ageRangeMax: '12',
          theme: [] as string[],
          style: [] as string[],
          size: 'A4',
          prompt: '',
          seoTitle: '',
          seoDescription: ''
        });
        loadColoringPages(currentPage, searchTerm, statusFilter, difficultyFilter, themeFilter, styleFilter);
      } else {
        handleApiError(response, data, '涂色卡添加失败');
      }
    } catch (error) {
      console.error('添加涂色卡失败:', error);
      showToast('error', '添加失败，请重试');
    }
  };

  // 编辑涂色卡
  const handleUpdate = async () => {
    if (!validateForm() || !editingPage) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      // 构建年龄范围字符串
      const ageRange = formData.ageRangeMin && formData.ageRangeMax 
        ? `${formData.ageRangeMin}-${formData.ageRangeMax} years`
        : formData.ageRangeMin
        ? `${formData.ageRangeMin}+ years`
        : formData.ageRangeMax
        ? `Under ${formData.ageRangeMax} years`
        : 'All ages';
      
      const response = await fetch(`http://localhost:3001/api/admin/coloring-pages/${editingPage.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ageRange,
          style: Array.isArray(formData.style) ? formData.style.join(', ') : formData.style,
          theme: Array.isArray(formData.theme) ? formData.theme.join(', ') : formData.theme,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '涂色卡更新成功！');
        setShowAddModal(false);
        setEditingPage(null);
        setFormData({
          title: '',
          slug: '',
          description: '',
          imageUrl: '',
          thumbnailUrl: '',
          previewUrl: '',
          difficulty: 'easy',
          ageRangeMin: '2',
          ageRangeMax: '12',
          theme: [] as string[],
          style: [] as string[],
          size: 'A4',
          prompt: '',
          seoTitle: '',
          seoDescription: ''
        });
        loadColoringPages(currentPage, searchTerm, statusFilter, difficultyFilter, themeFilter, styleFilter);
      } else {
        handleApiError(response, data, '涂色卡更新失败');
      }
    } catch (error) {
      console.error('更新涂色卡失败:', error);
      showToast('error', '更新失败，请重试');
    }
  };

  // 删除涂色卡
  const handleDelete = (pageId: number) => {
    setDeletePageId(pageId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletePageId) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/admin/coloring-pages?id=${deletePageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '涂色卡删除成功！');
        loadColoringPages(currentPage, searchTerm, statusFilter, difficultyFilter, themeFilter, styleFilter);
      } else {
        handleApiError(response, data, '涂色卡删除失败');
      }
    } catch (error) {
      console.error('删除涂色卡失败:', error);
      showToast('error', '删除失败，请重试');
    } finally {
      setShowDeleteConfirm(false);
      setDeletePageId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletePageId(null);
  };

  // 切换发布状态（根据目标状态）
  const handleToggleStatus = async (pageId: number, targetStatus?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const page = coloringPages.find(p => p.id === pageId);
      if (!page) return;

      // 根据目标状态或当前状态确定要执行的操作
      let action: 'publish' | 'unpublish' | 'freeze' | 'unfreeze';
      let newStatus: string;
      let successMessage: string;

      if (targetStatus) {
        // 根据目标状态确定操作
        switch (targetStatus) {
          case 'published':
            action = 'publish';
            newStatus = 'published';
            successMessage = '已发布涂色卡';
            break;
          case 'draft':
            action = page.status === 'frozen' ? 'unfreeze' : 'unpublish';
            newStatus = 'draft';
            successMessage = page.status === 'frozen' ? '已解除冻结' : '已下架涂色卡';
            break;
          case 'frozen':
            action = 'freeze';
            newStatus = 'frozen';
            successMessage = '已冻结涂色卡';
            break;
          default:
            return;
        }
      } else {
        // 根据当前状态确定要执行的操作（向后兼容）
        switch (page.status) {
          case 'draft':
            action = 'publish';
            newStatus = 'published';
            successMessage = '已发布涂色卡';
            break;
          case 'published':
            action = 'unpublish';
            newStatus = 'draft';
            successMessage = '已下架涂色卡';
            break;
          case 'frozen':
            action = 'unfreeze';
            newStatus = 'draft';
            successMessage = '已解除冻结';
            break;
          default:
            // 对于其他状态，默认冻结
            action = 'freeze';
            newStatus = 'frozen';
            successMessage = '已冻结涂色卡';
            break;
        }
      }

      const { api, adminApiClient } = await import('@/lib/apiClient');
      adminApiClient.setToken(token || '');
      
      const data = await api.admin.coloringPages.toggleStatus(pageId, action);

      if (data.success) {
        showToast('success', successMessage);
        setColoringPages(prev => prev.map(p => 
          p.id === pageId ? { ...p, status: newStatus } : p
        ));
      } else {
        showToast('error', data.message || '状态切换失败');
      }
    } catch (error) {
      console.error('切换状态失败:', error);
      showToast('error', '状态切换失败，请重试');
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <ImageIcon className="h-7 w-7 mr-3 text-orange-600" />
                涂色卡管理
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                管理涂色卡内容，包括图片、分类、标签和SEO信息
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加涂色卡
              </button>
            </div>
          </div>
        </div>

        {/* 搜索和统计 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* 搜索和筛选行 */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="搜索涂色卡..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="清空搜索"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
              <select
                value={themeFilter}
                onChange={(e) => handleThemeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">全部主题</option>
                {metadata.theme.map((item) => (
                  <option key={item.value} value={item.value}>{item.labelZh}</option>
                ))}
              </select>
              <select
                value={styleFilter}
                onChange={(e) => handleStyleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">全部风格</option>
                {metadata.style.map((item) => (
                  <option key={item.value} value={item.value}>{item.labelZh}</option>
                ))}
              </select>
              <select
                value={difficultyFilter}
                onChange={(e) => handleDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">全部难度</option>
                {metadata.difficulty.map((item) => (
                  <option key={item.value} value={item.value}>{item.labelZh}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">全部状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="frozen">冻结</option>
              </select>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                title="重置筛选条件"
              >
                <X className="h-4 w-4 mr-2" />
                重置
              </button>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                title="搜索"
              >
                <Search className="h-4 w-4 mr-2" />
                搜索
              </button>
            </div>
            {/* 统计信息行 */}
            <div className="flex gap-4 text-sm text-gray-600">
              <span>总计: <strong>{pagination.totalCount}</strong></span>
              <span>当前页: <strong>{coloringPages.length}</strong></span>
              <span>已发布: <strong>{coloringPages.filter(p => p.status === 'published').length}</strong></span>
              <span>草稿: <strong>{coloringPages.filter(p => p.status === 'draft').length}</strong></span>
              <span>冻结: <strong>{coloringPages.filter(p => p.status === 'frozen').length}</strong></span>
            </div>
          </div>
        </div>

        {/* 涂色卡列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : (
            <>
              {/* 表格视图 */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        涂色卡
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        主题
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        风格
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        难度
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        年龄范围
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        创建时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coloringPages.map((page) => (
                      <tr 
                        key={page.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(page)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{page.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              {page.thumbnailUrl ? (
                                <img
                                  className="h-16 w-16 rounded object-cover"
                                  src={page.thumbnailUrl}
                                  alt={page.title}
                                />
                              ) : (
                                <div className="h-16 w-16 rounded bg-gray-200 flex items-center justify-center">
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{page.title}</div>
                              <div className="text-xs text-gray-400">/{page.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{page.theme ? getThemeLabel(page.theme) : '-'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{page.style ? getStyleLabel(page.style) : '-'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(page.difficulty)}`}>
                            {getDifficultyText(page.difficulty)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{cleanAgeRange(page.ageRange)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(page.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {/* 草稿标签 - 最初始状态，放在最左边 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (page.status !== 'draft') {
                                  handleToggleStatus(page.id, 'draft');
                                }
                              }}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                                page.status === 'draft'
                                  ? 'bg-yellow-500 text-white cursor-default'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 cursor-pointer'
                              }`}
                              disabled={page.status === 'draft'}
                            >
                              草稿
                            </button>
                            
                            {/* 已发布标签 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (page.status !== 'published') {
                                  handleToggleStatus(page.id, 'published');
                                }
                              }}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                                page.status === 'published'
                                  ? 'bg-green-500 text-white cursor-default'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 cursor-pointer'
                              }`}
                              disabled={page.status === 'published'}
                            >
                              已发布
                            </button>
                            
                            {/* 冻结标签 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (page.status !== 'frozen') {
                                  handleToggleStatus(page.id, 'frozen');
                                }
                              }}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                                page.status === 'frozen'
                                  ? 'bg-red-500 text-white cursor-default'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 cursor-pointer'
                              }`}
                              disabled={page.status === 'frozen'}
                            >
                              冻结
                            </button>
                            
                            {/* 解冻标签 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (page.status === 'frozen') {
                                  handleToggleStatus(page.id, 'draft');
                                }
                              }}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                                page.status === 'frozen'
                                  ? 'bg-blue-200 text-blue-700 hover:bg-blue-300 cursor-pointer'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                              disabled={page.status !== 'frozen'}
                            >
                              解冻
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPage(page);
                                // 解析年龄范围
                                const ageMatch = page.ageRange ? page.ageRange.match(/(\d+)-(\d+)/) : null;
                                setFormData({
                                  title: page.title,
                                  slug: page.slug,
                                  description: page.description,
                                  imageUrl: page.originalFileUrl,
                                  thumbnailUrl: page.thumbnailUrl,
                                  previewUrl: page.previewUrl || page.thumbnailUrl,
                                  difficulty: page.difficulty,
                                  ageRangeMin: ageMatch ? ageMatch[1] : '',
                                  ageRangeMax: ageMatch ? ageMatch[2] : '',
                                  theme: page.theme ? [page.theme] : [],
                                  style: page.style ? [page.style] : [],
                                  size: page.size || 'A4',
                                  prompt: page.aiPrompt || page.prompt || '',
                                  seoTitle: page.seoTitle || '',
                                  seoDescription: page.seoDescription || ''
                                });
                                // 设置图片预览
                                setImagePreview(page.previewUrl || page.thumbnailUrl || '');
                                setShowAddModal(true);
                              }}
                              className="p-1.5 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-md transition-all"
                              title="编辑"
                            >
                              <Edit3 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(page.id);
                              }}
                              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-all"
                              title="删除"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={!pagination.hasNextPage}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        显示第 {pagination.startRecord} 到 {pagination.endRecord} 条，共 {pagination.totalCount} 条
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={!pagination.hasPrevPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === currentPage
                                  ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                          disabled={!pagination.hasNextPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 添加/编辑模态框 */}
        {showAddModal && (
          <ColoringPageModal
            page={editingPage}
            formData={formData}
            setFormData={setFormData}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            onClose={() => {
              setShowAddModal(false);
              setEditingPage(null);
              setImagePreview('');
              setFormData({
                title: '',
                slug: '',
                description: '',
                imageUrl: '',
                thumbnailUrl: '',
                previewUrl: '',
                difficulty: 'easy',
                ageRangeMin: '2',
                ageRangeMax: '12',
                theme: [] as string[],
                style: [] as string[],
                size: 'A4',
                prompt: '',
                isActive: false,
                seoTitle: '',
                seoDescription: ''
              });
            }}
            onSave={editingPage ? handleUpdate : handleAdd}
            showToast={showToast}
            generateSlug={generateSlug}
            metadata={metadata}
          />
        )}

        {/* 详情模态框 */}
        {showDetailModal && detailPage && (
          <ColoringPageDetailModal
            page={detailPage}
            onClose={() => {
              setShowDetailModal(false);
              setDetailPage(null);
            }}
            getDifficultyText={getDifficultyText}
            getDifficultyColor={getDifficultyColor}
            metadata={metadata}
            getThemeLabel={getThemeLabel}
            getStyleLabel={getStyleLabel}
            getSizeLabel={getSizeLabel}
          />
        )}

        {/* 删除确认 Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      确认删除
                    </h3>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-500">
                    确定要删除这个涂色卡吗？此操作不可撤销。
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    确定删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast 容器 */}
        <div className="fixed top-[30%] left-1/2 transform -translate-x-1/2 z-50 space-y-2">
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
    </AdminLayout>
  );
}

// Coloring Page Modal Component
interface ColoringPageModalProps {
  page: ColoringPage | null;
  formData: any;
  setFormData: (data: any) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
  onClose: () => void;
  onSave: () => void;
  showToast: (type: ToastType, message: string) => void;
  generateSlug: (title: string) => string;
  metadata: {
    difficulty: MetadataItem[];
    size: MetadataItem[];
    style: MetadataItem[];
    theme: MetadataItem[];
  };
}

function ColoringPageModal({ page, formData, setFormData, imagePreview, setImagePreview, onClose, onSave, showToast, generateSlug, metadata }: ColoringPageModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  // 调试：监控 imagePreview 变化
  useEffect(() => {
  }, [imagePreview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.slug.trim()) {
      showToast('warning', '请填写标题和Slug');
      return;
    }

    onSave();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showToast('error', '请选择图片文件');
      return;
    }

    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', '图片大小不能超过5MB');
      return;
    }

    setIsUploading(true);

    try {
      // 创建FormData
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // 上传图片
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const previewUrl = data.data.previewUrl;
        const thumbnailUrl = data.data.thumbnailUrl;
        const originalUrl = data.data.originalUrl;
        
        
        setImagePreview(previewUrl);
        setFormData({
          ...formData,
          previewUrl: previewUrl,
          thumbnailUrl: thumbnailUrl,
          originalFileUrl: originalUrl,
        });
        
        // 再次确认 imagePreview 已设置
        setTimeout(() => {
        }, 1000);
        
        showToast('success', '图片上传成功');
      } else {
        showToast('error', data.message || '图片上传失败');
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      showToast('error', '图片上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData({
      ...formData,
      thumbnailUrl: '',
      imageUrl: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {page ? '编辑涂色卡' : '添加涂色卡'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 左右布局内容 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* 左侧：图片预览和上传 - 正方形 */}
            <div className="flex flex-col">
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 transition-colors flex flex-col relative">
                {imagePreview ? (
                  <div className="relative group flex-1 flex flex-col bg-gray-100 rounded-lg overflow-hidden">
                    {/* 图片容器 - 填满模式 */}
                    <div className="flex-1 w-full h-full">
                      <img
                        src={imagePreview}
                        alt="预览"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('❌ 图片加载失败:', imagePreview);
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3E加载失败%3C/text%3E%3C/svg%3E';
                        }}
                        onLoad={() => {
                        }}
                      />
                    </div>
                    {/* 悬停时显示的操作按钮遮罩层 */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <label className="cursor-pointer bg-white text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center text-sm shadow-lg">
                          <Upload className="h-4 w-4 mr-1" />
                          替换
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center text-sm shadow-lg"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <label className="cursor-pointer flex-1 flex flex-col items-center justify-center text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                      <span className="text-sm text-gray-600 mb-1">点击上传图片</span>
                      <span className="text-xs text-gray-400">支持 JPG、PNG 格式，最大 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    {/* 图片要求提示 - 放在上传区域底部 */}
                    <div className="mt-auto pt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="flex">
                        <AlertCircle className="h-3 w-3 text-blue-600 mr-1.5 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-800">
                          <p className="font-medium mb-0.5">图片要求：</p>
                          <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                            <li>推荐尺寸：800x800 像素或更高</li>
                            <li>文件格式：JPG、PNG</li>
                            <li>文件大小：不超过 5MB</li>
                            <li>图片应清晰，适合涂色</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">上传中...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：属性设置 - 正方形高度 */}
            <div className="aspect-square flex flex-col space-y-1">
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: formData.slug === generateSlug(formData.title) ? generateSlug(title) : formData.slug
                    });
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="输入涂色卡标题"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="coloring-page-slug"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="输入涂色卡描述"
              />
            </div>

            {/* 属性设置 - 紧凑布局 */}
            <div className="grid grid-cols-4 gap-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  难度
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {metadata.difficulty.map((item) => (
                    <option key={item.value} value={item.value}>{item.labelZh}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  年龄下限
                </label>
                <input
                  type="number"
                  value={formData.ageRangeMin}
                  onChange={(e) => setFormData({ ...formData, ageRangeMin: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="3"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  年龄上限
                </label>
                <input
                  type="number"
                  value={formData.ageRangeMax}
                  onChange={(e) => setFormData({ ...formData, ageRangeMax: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="8"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  尺寸
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {metadata.size.map((item) => (
                    <option key={item.value} value={item.value}>{item.labelZh}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  主题
                </label>
                <select
                  value={Array.isArray(formData.theme) ? formData.theme[0] || '' : formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value ? [e.target.value] : [] })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">选择主题</option>
                  {metadata.theme.map((item) => (
                    <option key={item.value} value={item.value}>{item.labelZh}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  风格
                </label>
                <select
                  value={Array.isArray(formData.style) ? formData.style[0] || '' : formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value ? [e.target.value] : [] })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">选择风格</option>
                  {metadata.style.map((item) => (
                    <option key={item.value} value={item.value}>{item.labelZh}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                提示词
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                rows={5}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="输入AI生成图片的提示词（如果适用）"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                SEO标题
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="用于搜索引擎优化的标题"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                SEO描述
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={1}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="用于搜索引擎优化的描述"
              />
            </div>
          </div>
          </div>

          {/* 底部按钮 */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Coloring Page Detail Modal Component
interface ColoringPageDetailModalProps {
  page: ColoringPage;
  onClose: () => void;
  getDifficultyText: (difficulty: string) => string;
  getDifficultyColor: (difficulty: string) => string;
  metadata: {
    difficulty: MetadataItem[];
    size: MetadataItem[];
    style: MetadataItem[];
    theme: MetadataItem[];
  };
  getThemeLabel: (value: string) => string;
  getStyleLabel: (value: string) => string;
  getSizeLabel: (value: string) => string;
}

function ColoringPageDetailModal({ page, onClose, getDifficultyText, getDifficultyColor, metadata, getThemeLabel, getStyleLabel, getSizeLabel }: ColoringPageDetailModalProps) {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            涂色卡详情
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 左右布局内容 */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* 左侧：图片显示 - 正方形 */}
            <div className="flex flex-col">
              <div className="aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                {page.thumbnailUrl ? (
                  <img
                    src={page.thumbnailUrl}
                    alt={page.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：属性显示 - 正方形高度 */}
            <div className="aspect-square flex flex-col space-y-1">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">标题</label>
                  <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                    {page.title}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">Slug</label>
                  <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 truncate" title={page.slug}>
                    {page.slug}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">描述</label>
                <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900" style={{ minHeight: '48px', maxHeight: '48px', overflow: 'auto' }}>
                  {page.description || '-'}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">难度</label>
                  <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(page.difficulty)}`}>
                      {getDifficultyText(page.difficulty)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">年龄范围</label>
                  <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                    {cleanAgeRange(page.ageRange)}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">尺寸</label>
                  <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 whitespace-nowrap">
                    {page.size ? getSizeLabel(page.size) : '-'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">主题</label>
                  <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 truncate" title={page.theme ? getThemeLabel(page.theme) : '-'}>
                    {page.theme ? getThemeLabel(page.theme) : '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">风格</label>
                  <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 truncate" title={page.style ? getStyleLabel(page.style) : '-'}>
                    {page.style ? getStyleLabel(page.style) : '-'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">提示词</label>
                <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900" style={{ minHeight: '120px', maxHeight: '120px', overflow: 'auto' }}>
                  {page.aiPrompt || page.prompt || '未设置'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">SEO标题</label>
                <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 truncate" title={page.seoTitle || '未设置'}>
                  {page.seoTitle || '未设置'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">SEO描述</label>
                <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900" style={{ minHeight: '48px', maxHeight: '48px', overflow: 'auto' }}>
                  {page.seoDescription || '未设置'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
