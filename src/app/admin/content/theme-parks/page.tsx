'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Eye,
  Image as ImageIcon,
  Calendar,
  Users,
  X,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  EyeOff,
  XCircle,
  Link
} from 'lucide-react';
import ManageRelatedColoringPages from '@/components/admin/ManageRelatedColoringPages';

interface ThemePark {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  brandColor: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdByAdmin?: string;
  createdAt: string;
  updatedAt: string;
  coloringPageCount: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

type ToastType = 'success' | 'error' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export default function AdminThemeParks() {
  const [themeParks, setThemeParks] = useState<ThemePark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPark, setEditingPark] = useState<ThemePark | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteParkId, setDeleteParkId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPark, setDetailPark] = useState<ThemePark | null>(null);
  const [showManageColoringPages, setShowManageColoringPages] = useState(false);
  const [managingPark, setManagingPark] = useState<ThemePark | null>(null);

  // Toast 提示函数
  const showToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // 3秒后自动移除
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

    // 根据HTTP状态码显示不同的错误消息
    let errorMessage = defaultMessage;
    let toastType: 'warning' | 'error' = 'warning';
    
    switch (response.status) {
      case 400:
        errorMessage = data.message || '请求参数无效';
        break;
      case 404:
        errorMessage = data.message || '资源不存在';
        break;
      case 409:
        errorMessage = data.message || '存在关联数据，无法执行此操作';
        break;
      case 500:
        errorMessage = data.message || '服务器内部错误';
        toastType = 'error'; // 500错误显示为红色
        break;
      default:
        errorMessage = data.message || defaultMessage;
    }

    showToast(toastType, errorMessage);
  };

  // 从API加载主题公园数据
  const loadThemeParks = async (page = 1, search = '', status = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('❌ Token 不存在，跳转到登录页');
        window.location.href = '/admin/login';
        return;
      }

      console.log('🔐 加载主题公园列表 - Token存在:', !!token);

      const response = await fetch(`http://localhost:3001/api/admin/theme-parks?page=${page}&limit=${itemsPerPage}&q=${search}&status=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔐 加载响应状态:', response.status);

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();
      console.log('🔐 加载响应数据:', data);

      if (response.ok && data.success && data.data) {
        setThemeParks(data.data.themeParks || []);
        setPagination(data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } else {
        handleApiError(response, data, '加载主题公园列表失败');
      }
    } catch (error) {
      console.error('❌ 加载主题公园失败:', error);
      showToast('error', '加载失败，请重试');
    } finally {
      setIsLoading(false);
    }
    };

  useEffect(() => {
    loadThemeParks(currentPage, searchTerm, statusFilter);
  }, [currentPage]);

  // 处理搜索输入（不触发查询）
  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
  };

  // 执行搜索（按回车或点击搜索按钮时调用）
  const handleSearch = () => {
    setCurrentPage(1);
    loadThemeParks(1, searchTerm, statusFilter);
  };

  // 处理状态筛选
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadThemeParks(1, searchTerm, status);
  };

  // 清空搜索框
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    loadThemeParks(1, '', statusFilter);
  };

  // 清空状态筛选
  const handleClearStatusFilter = () => {
    setStatusFilter('');
    setCurrentPage(1);
    loadThemeParks(1, searchTerm, '');
  };

  // 添加主题公园
  const handleAddPark = async (parkData: Omit<ThemePark, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      console.log('📝 新增主题公园 - 请求数据:', parkData);

      const response = await fetch('http://localhost:3001/api/admin/theme-parks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parkData),
      });

      console.log('📝 新增响应状态:', response.status);

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();
      console.log('📝 新增响应数据:', data);

      if (response.ok && data.success) {
        showToast('success', '主题公园添加成功！');
        setIsModalOpen(false);
        // 重新加载列表
        loadThemeParks(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '主题公园添加失败');
      }
    } catch (error) {
      console.error('❌ 添加主题公园失败:', error);
      showToast('error', '添加失败，请重试');
    }
  };

  // 编辑主题公园
  const handleEditPark = async (parkData: ThemePark) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      console.log('✏️ 编辑主题公园 - 请求数据:', parkData);

      const response = await fetch(`http://localhost:3001/api/admin/theme-parks/${parkData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parkData),
      });

      console.log('✏️ 编辑响应状态:', response.status);

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();
      console.log('✏️ 编辑响应数据:', data);

      if (response.ok && data.success) {
        showToast('success', '主题公园更新成功！');
        setEditingPark(null);
        setIsModalOpen(false);
        // 重新加载列表
        loadThemeParks(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '主题公园更新失败');
      }
    } catch (error) {
      console.error('❌ 编辑主题公园失败:', error);
      showToast('error', '更新失败，请重试');
    }
  };

  // 删除主题公园
  const handleDeletePark = (parkId: number) => {
    setDeleteParkId(parkId);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePark = async () => {
    if (!deleteParkId) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      console.log('🗑️ 删除主题公园 - ID:', deleteParkId);

      const response = await fetch(`http://localhost:3001/api/admin/theme-parks?id=${deleteParkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('🗑️ 删除响应状态:', response.status);

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();
      console.log('🗑️ 删除响应数据:', data);

      if (response.ok && data.success) {
        showToast('success', '主题公园删除成功！');
        // 重新加载列表
        loadThemeParks(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '主题公园删除失败');
      }
    } catch (error) {
      console.error('❌ 删除主题公园失败:', error);
      showToast('error', '删除失败，请重试');
    } finally {
      // 关闭确认 dialog
      setShowDeleteConfirm(false);
      setDeleteParkId(null);
    }
  };

  const cancelDeletePark = () => {
    setShowDeleteConfirm(false);
    setDeleteParkId(null);
  };

  // 处理行点击，显示详情
  const handleRowClick = (park: ThemePark) => {
    setDetailPark(park);
    setShowDetailModal(true);
  };

  // 切换激活状态
  const handleToggleActive = async (parkId: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const park = themeParks.find(p => p.id === parkId);
      if (!park) return;

      console.log('🔄 切换状态 - ID:', parkId, '当前状态:', park.isActive);

      const response = await fetch(`http://localhost:3001/api/admin/theme-parks/${parkId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              ...park, 
          isActive: !park.isActive,
        }),
      });

      console.log('🔄 切换状态响应状态:', response.status);

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();
      console.log('🔄 切换状态响应数据:', data);

      if (response.ok && data.success) {
        showToast('success', park.isActive ? '已停用主题公园' : '已激活主题公园');
        // 只更新当前行的状态，不重新加载整个列表
        setThemeParks(prev => prev.map(p => 
          p.id === parkId ? { ...p, isActive: !p.isActive } : p
        ));
    } else {
        handleApiError(response, data, '状态更新失败');
      }
    } catch (error) {
      console.error('❌ 切换状态失败:', error);
      showToast('error', '状态更新失败，请重试');
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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
                <Users className="h-7 w-7 mr-3 text-orange-600" />
                主题公园管理
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                管理主题公园列表，包括各种主题公园的涂色页面
              </p>
              </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加主题公园
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
                placeholder="搜索主题公园..."
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
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">全部状态</option>
                <option value="active">激活</option>
                <option value="inactive">停用</option>
              </select>
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
              <span>当前页: <strong>{themeParks.length}</strong></span>
              <span>激活: <strong>{themeParks.filter(p => p.isActive).length}</strong></span>
              <span>停用: <strong>{themeParks.filter(p => !p.isActive).length}</strong></span>
            </div>
            </div>
          </div>

        {/* 主题公园列表 */}
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
                        主题公园
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        描述
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SEO标题
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SEO描述
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        涂色卡数量
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        排序
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        更新时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {themeParks.map((park) => (
                      <tr 
                        key={park.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(park)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{park.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {park.coverUrl ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={park.coverUrl}
                                  alt={park.name}
                                />
                              ) : (
                                <div 
                                  className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold"
                                  style={{ backgroundColor: park.brandColor }}
                                >
                                  {park.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{park.name}</div>
                              <div className="text-xs text-gray-400">/{park.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={park.description}>
                            {park.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={park.seoTitle || '未设置'}>
                            {park.seoTitle || '未设置'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={park.seoDescription || '未设置'}>
                            {park.seoDescription || '未设置'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {park.coloringPageCount || 0} 个
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{park.sortOrder}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(park.id);
                      }}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        park.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            title={park.isActive ? '点击停用' : '点击激活'}
                          >
                            {park.isActive ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                激活
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                停用
                              </>
                            )}
                    </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {park.updatedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setManagingPark(park);
                                setShowManageColoringPages(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-md hover:bg-blue-50"
                              title="关联涂色卡"
                            >
                              <Link className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPark(park);
                                setIsModalOpen(true);
                              }}
                              className="text-orange-600 hover:text-orange-900 transition-colors p-2 rounded-md hover:bg-orange-50"
                              title="编辑"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePark(park.id);
                              }}
                              className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-md hover:bg-red-50"
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
                        显示{pagination.currentPage}页,共{pagination.totalCount}条
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={!pagination.hasPrevPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          上一页
                        </button>
                        
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                          disabled={!pagination.hasNextPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          下一页
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
        {isModalOpen && (
          <ThemeParkModal
            park={editingPark}
            onClose={() => {
              setIsModalOpen(false);
              setEditingPark(null);
            }}
            onSave={editingPark ? handleEditPark : handleAddPark}
            showToast={showToast}
          />
        )}

        {/* 详情模态框 */}
        {showDetailModal && detailPark && (
          <ThemeParkDetailModal
            park={detailPark}
            onClose={() => {
              setShowDetailModal(false);
              setDetailPark(null);
            }}
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
                    确定要删除这个主题公园吗？此操作不可撤销。
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDeletePark}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeletePark}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    确定删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 关联涂色卡管理模态框 */}
        {showManageColoringPages && managingPark && (
          <ManageRelatedColoringPages
            entityType="theme-park"
            entityId={managingPark.id}
            entityName={managingPark.name}
            onClose={() => {
              setShowManageColoringPages(false);
              setManagingPark(null);
            }}
            onUpdate={() => {
              // 可选：关联更新后刷新列表
              loadThemeParks(currentPage, searchTerm, statusFilter);
            }}
          />
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

// Theme Park Modal Component
interface ThemeParkModalProps {
  park: ThemePark | null;
  onClose: () => void;
  onSave: (park: ThemePark | Omit<ThemePark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

function ThemeParkModal({ park, onClose, onSave, showToast }: ThemeParkModalProps) {
  const [formData, setFormData] = useState({
    name: park?.name || '',
    slug: park?.slug || '',
    description: park?.description || '',
    coverUrl: park?.coverUrl || '',
    brandColor: park?.brandColor || '#FF6B6B',
    sortOrder: park?.sortOrder || 0,
    isActive: park?.isActive ?? true,
    seoTitle: park?.seoTitle || '',
    seoDescription: park?.seoDescription || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.slug.trim()) {
      showToast('warning', '请填写主题公园名称和标识符');
      return;
    }

    // 如果是编辑模式，需要包含 ID
    if (park) {
      onSave({
        ...formData,
        id: park.id,
        createdAt: park.createdAt,
        updatedAt: park.updatedAt,
        pageCount: park.pageCount,
        createdByAdmin: park.createdByAdmin,
      });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
            {park ? '编辑主题公园' : '添加主题公园'}
            </h3>
          <button
            onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主题公园名称 *
            </label>
            <input
              type="text"
              value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标识符 (slug) *
            </label>
            <input
              type="text"
              value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
              </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                封面图片
            </label>
              <CoverImageUpload
                imageUrl={formData.coverUrl}
                onImageChange={(url) => setFormData({ ...formData, coverUrl: url })}
                showToast={showToast}
              />
          </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  品牌颜色
                </label>
                <input
                  type="color"
                  value={formData.brandColor}
                  onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                  排序
            </label>
            <input
              type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
            </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO标题
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="用于搜索引擎优化的标题"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO描述
            </label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              rows={3}
              placeholder="用于搜索引擎优化的描述"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              启用此主题公园
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
                保存
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}

// Cover Image Upload Component
interface CoverImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

function CoverImageUpload({ imageUrl, onImageChange, showToast }: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showToast('error', '请选择图片文件');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', '图片文件大小不能超过5MB');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        return;
      }

      console.log('🔐 图片上传 - Token存在:', !!token);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📤 图片上传响应状态:', response.status);

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const result = await response.json();
      console.log('📤 图片上传响应数据:', result);

      if (result.success && result.data?.thumbnailUrl) {
        onImageChange(result.data.thumbnailUrl);
        console.log('🎉 图片上传成功，显示 toast');
        showToast('success', '图片上传成功！');
        console.log('✅ Toast 已调用');
      } else {
        console.log('❌ 图片上传失败，显示错误 toast');
        showToast('error', result.message || '上传失败');
      }
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      showToast('error', '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-orange-400 transition-colors"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      >
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt="封面图片"
              className="w-full h-32 object-cover rounded-lg"
            />
            {isHovering && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-white text-sm font-medium">替换图片</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {isUploading ? '上传中...' : '点击上传图片'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                支持 JPG、PNG 格式，最大 5MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
}

// Theme Park Detail Modal Component
interface ThemeParkDetailModalProps {
  park: ThemePark;
  onClose: () => void;
}

function ThemeParkDetailModal({ park, onClose }: ThemeParkDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              主题公园详情
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主题公园名称
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {park.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标识符 (slug)
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {park.slug}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                {park.description}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                封面图片
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {park.coverUrl ? (
                  <img
                    src={park.coverUrl}
                    alt="封面图片"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div 
                    className="w-full h-32 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: park.brandColor }}
                  >
                    {park.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  品牌颜色
                </label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: park.brandColor }}
                  ></div>
                  <span className="text-sm text-gray-600">{park.brandColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  排序
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {park.sortOrder}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  涂色卡数量
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {park.coloringPageCount || 0} 个涂色卡
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    park.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {park.isActive ? '激活' : '停用'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  创建时间
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {park.createdAt}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  更新时间
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {park.updatedAt}
                </div>
              </div>
            </div>

            {park.createdByAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  创建管理员
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {park.createdByAdmin}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO标题
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {park.seoTitle || '未设置'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO描述
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                {park.seoDescription || '未设置'}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 