'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ImageIcon, 
  Plus, 
  Search, 
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  XCircle,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  X,
  Save,
  Upload,
  Image as ImagePlus
} from 'lucide-react';

interface BannerImage {
  id: number;
  title: string;
  imageUrl: string;
  linkType: string;
  subtitle?: string;
  linkTarget?: string;
}

interface BannerGroup {
  id: number;
  name: string;
  description: string;
  intervalTime: number;
  status: string;
  startDate?: string;
  endDate?: string;
  images: BannerImage[];
  isDeleted: boolean;
  deletedAt?: string;
  createdByAdmin?: string;
  createdAt: string;
  updatedAt: string;
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

export default function AdminBannerManagement() {
  const [bannerGroups, setBannerGroups] = useState<BannerGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<BannerGroup | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailGroup, setDetailGroup] = useState<BannerGroup | null>(null);

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

  // 加载Banner组列表（带参数版本）
  const loadBannerGroupsWithParams = async (page: number, search: string, status: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        showToast('error', '请先登录');
        window.location.href = '/admin/login';
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        q: search,
        status: status
      });

      const apiUrl = `http://localhost:3001/api/admin/banners?${params}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();
      
      if (response.ok && result.success && result.data) {
        setBannerGroups(result.data.banners || []);
        setPagination(result.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } else {
        handleApiError(response, result, '加载Banner组列表失败');
      }
    } catch (error) {
      console.error('加载Banner组失败:', error);
      showToast('error', '加载Banner组失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 加载Banner组列表（使用当前状态）
  const loadBannerGroups = async () => {
    await loadBannerGroupsWithParams(currentPage, searchTerm, statusFilter);
  };

  useEffect(() => {
    loadBannerGroups();
  }, [currentPage]);

  // 新增Banner组
  const handleAddGroup = async (groupData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        showToast('error', '请先登录');
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch('http://localhost:3001/api/admin/banners', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('success', 'Banner组添加成功');
        loadBannerGroups();
        return true;
        } else {
        handleApiError(response, result, 'Banner组添加失败');
        return false;
      }
    } catch (error) {
      console.error('添加Banner组失败:', error);
      showToast('error', '网络错误，添加失败');
      return false;
    }
  };

  // 编辑Banner组
  const handleEditGroup = async (id: number, groupData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        showToast('error', '请先登录');
        window.location.href = '/admin/login';
      return;
    }
    
      const response = await fetch(`http://localhost:3001/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('success', 'Banner组更新成功');
        loadBannerGroups();
        return true;
        } else {
        handleApiError(response, result, 'Banner组更新失败');
        return false;
      }
    } catch (error) {
      console.error('更新Banner组失败:', error);
      showToast('error', '网络错误，更新失败');
      return false;
    }
  };

  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1); // 重置到第一页
    loadBannerGroupsWithParams(1, searchTerm, statusFilter);
  };

  // 清空搜索
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1); // 重置到第一页
    loadBannerGroupsWithParams(1, '', statusFilter);
  };

  // 处理状态筛选
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // 重置到第一页
    // 使用新的status值直接调用loadBannerGroups
    loadBannerGroupsWithParams(1, searchTerm, status);
  };

  // 处理行点击查看详情
  const handleRowClick = (group: BannerGroup) => {
    setDetailGroup(group);
    setShowDetailModal(true);
  };

  // 处理编辑
  const handleEdit = (group: BannerGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    const group = bannerGroups.find(g => g.id === id);
    if (group?.status === 'active') {
      showToast('warning', '无法删除已激活的Banner组，请先取消激活');
      return;
    }
    setDeleteGroupId(id);
    setShowDeleteConfirm(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (deleteGroupId !== null) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          showToast('error', '请先登录');
          window.location.href = '/admin/login';
          return;
        }

        const response = await fetch(`http://localhost:3001/api/admin/banners/${deleteGroupId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          showToast('error', '登录已过期，请重新登录');
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
          return;
        }

        const result = await response.json();

        if (response.ok && result.success) {
          // 从本地状态中移除已删除的项目
          setBannerGroups(prev => prev.filter(g => g.id !== deleteGroupId));
          showToast('success', 'Banner组删除成功');
          // 重新加载数据以确保数据同步
          loadBannerGroups();
        } else {
          handleApiError(response, result, 'Banner组删除失败');
        }
      } catch (error) {
        console.error('删除Banner组失败:', error);
        showToast('error', '网络错误，删除失败');
      } finally {
        setShowDeleteConfirm(false);
        setDeleteGroupId(null);
      }
    }
  };

  // 取消删除
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteGroupId(null);
  };

  // 处理激活/停用
  const handleToggleActive = async (id: number) => {
    const group = bannerGroups.find(g => g.id === id);
    if (!group) return;

    const currentStatus = group.status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        showToast('error', '请先登录');
        window.location.href = '/admin/login';
        return;
      }

      // 先更新UI状态以提供即时反馈
      setBannerGroups(prev => prev.map(g => 
        g.id === id ? { ...g, status: newStatus } : g
      ));

      const response = await fetch(`http://localhost:3001/api/admin/banners/${id}/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('success', newStatus === 'active' ? 'Banner组已激活' : 'Banner组已停用');
        // 重新加载数据以确保数据同步
        loadBannerGroups();
      } else {
        // 如果API调用失败，恢复原来的状态
        setBannerGroups(prev => prev.map(g => 
          g.id === id ? { ...g, status: currentStatus } : g
        ));
        handleApiError(response, result, '状态更新失败');
      }
    } catch (error) {
      // 如果网络错误，恢复原来的状态
      setBannerGroups(prev => prev.map(g => 
        g.id === id ? { ...g, status: currentStatus } : g
      ));
      showToast('error', '网络错误，状态更新失败');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Banner管理</h1>
              <p className="mt-1 text-sm text-gray-600">管理首页Banner组，每个Banner组包含多张图片</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingGroup(null);
                  setIsModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加Banner组
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
                  placeholder="搜索Banner组..."
                      value={searchTerm}
                  onChange={handleSearchInput}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    <option value="active">已激活</option>
                    <option value="inactive">停用</option>
                  </select>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                搜索
              </button>
                </div>

            {/* 统计信息 */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">总计:</span>
                <span className="font-semibold text-gray-900">{pagination.totalCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">当前页:</span>
                <span className="font-semibold text-gray-900">{pagination.currentPage}</span>
            </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">已激活:</span>
                <span className="font-semibold text-green-600">{bannerGroups.filter(g => g.status === 'active').length}</span>
          </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">停用:</span>
                <span className="font-semibold text-gray-600">{bannerGroups.filter(g => g.status === 'inactive').length}</span>
            </div>
            </div>
            </div>
          </div>

        {/* 表格 */}
          {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
            </div>
          ) : (
          <>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banner组
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      图片数量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      自动播放间隔
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      开始日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      截止日期
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
                  {bannerGroups.map((group) => (
                    <tr 
                      key={group.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(group)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{group.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{group.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={group.description}>
                          {group.description || '-'}
                      </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <ImageIcon className="h-4 w-4 text-blue-500 mr-1" />
                          {group.images.length} 张
                    </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{group.intervalTime}ms</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {group.startDate ? new Date(group.startDate).toLocaleDateString('zh-CN') : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {group.endDate ? new Date(group.endDate).toLocaleDateString('zh-CN') : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(group.id);
                          }}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            group.status === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          title={group.status === 'active' ? '点击停用' : '点击激活'}
                        >
                        {group.status === 'active' ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              已激活
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
                        {group.updatedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(group);
                          }}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                          title="编辑"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(group.id);
                          }}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          title="删除"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                      </div>
                      
            {/* 分页 */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 mt-4">
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
                      显示第 {pagination.currentPage} 页，共 {pagination.totalCount} 条
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

        {/* 编辑/新增模态框 */}
        {isModalOpen && (
          <BannerGroupModal
          group={editingGroup}
          onClose={() => {
              setIsModalOpen(false);
            setEditingGroup(null);
          }}
            onSave={async (formData) => {
              const success = editingGroup 
                ? await handleEditGroup(editingGroup.id, formData)
                : await handleAddGroup(formData);
              
              if (success) {
                setIsModalOpen(false);
            setEditingGroup(null);
              }
            }}
            showToast={showToast}
          />
        )}

        {/* 删除确认对话框 */}
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
                    确定要删除这个Banner组吗？此操作不可撤销。
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    确定删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner详情模态框 */}
        {showDetailModal && detailGroup && (
          <BannerDetailModal
            group={detailGroup}
            onClose={() => {
              setShowDetailModal(false);
              setDetailGroup(null);
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

// Banner Group Modal Component
interface BannerGroupModalProps {
  group: BannerGroup | null;
  onClose: () => void; 
  onSave: (formData: any) => void;
  showToast: (type: ToastType, message: string) => void;
}

function BannerGroupModal({ group, onClose, onSave, showToast }: BannerGroupModalProps) {
  // 格式化日期为 yyyy-MM-dd HH:mm:ss 格式
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 格式化输入日期为 yyyy-MM-dd HH:mm:ss 格式
  const formatInputToAPI = (inputValue: string) => {
    if (!inputValue) return null;
    // 如果输入的是日期格式 (yyyy-MM-dd)，则添加时间部分
    if (inputValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `${inputValue} 00:00:00`;
    }
    // 如果已经是完整格式，直接返回
    return inputValue;
  };

  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    autoPlayInterval: group?.intervalTime || 3000,
    startDate: formatDateForInput(group?.startDate) || '',
    endDate: formatDateForInput(group?.endDate) || '',
    // 确保每个image都有唯一的id
    images: (group?.images || []).map((img, index) => ({
      ...img,
      id: img.id || Date.now() + index // 如果没有id，生成一个唯一的id
    }))
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast('error', '请填写Banner组名称');
      return;
    }

    // 验证每张图片必须有标题和图片URL
    for (const img of formData.images) {
      if (!img.title.trim()) {
        showToast('error', '请填写所有图片的标题');
        return;
      }
      if (!img.imageUrl.trim()) {
        showToast('error', '请上传所有图片');
        return;
      }
    }

    // 准备API数据格式
    const apiData = {
      name: formData.name,
      description: formData.description,
      intervalTime: formData.autoPlayInterval,
      startDate: formatInputToAPI(formData.startDate),
      endDate: formatInputToAPI(formData.endDate),
      images: formData.images.map(img => ({
        title: img.title,
        imageUrl: img.imageUrl,
        linkType: img.linkType, // 使用实际的linkType值
        subtitle: img.subtitle || '',
        linkTarget: img.linkTarget || ''
      }))
    };

    await onSave(apiData);
  };

  const handleAddImage = () => {
    const newImage: BannerImage = {
      id: Date.now(),
      imageUrl: '',
      title: '',
      linkType: 'categories',
      subtitle: '',
      linkTarget: '/categories/'
    };
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
  };

  const handleRemoveImage = (id: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleImageChange = useCallback((id: number, field: keyof BannerImage, value: string | number) => {
    setFormData(prev => {
      const newImages = prev.images.map(img => 
        img.id === id ? { ...img, [field]: value } : img
      );
      return {
        ...prev,
        images: newImages
      };
    });
  }, []);

  const handleImageUrlChange = useCallback((id: number, url: string) => {
    handleImageChange(id, 'imageUrl', url);
  }, [handleImageChange]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
        <form onSubmit={handleSubmit}>
          {/* 模态框标题 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {group ? '编辑Banner组' : '添加Banner组'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* 模态框内容 */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* 基本信息 */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner组名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="例如: 节日主题轮播"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自动播放间隔 (毫秒)
                </label>
                <input
                  type="number"
                  value={formData.autoPlayInterval}
                  onChange={(e) => setFormData(prev => ({ ...prev, autoPlayInterval: parseInt(e.target.value) || 3000 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="3000"
                  min="1000"
                  step="100"
                />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="包含圣诞节、万圣节、复活节等节日主题的Banner组"
              />
            </div>

            {/* 日期设置 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  开始日期时间
              </label>
              <input
                  type="datetime-local"
                  value={formData.startDate ? formData.startDate.replace(' ', 'T') : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value.replace('T', ' ') }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  截止日期时间
                </label>
                            <input
                  type="datetime-local"
                  value={formData.endDate ? formData.endDate.replace(' ', 'T') : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value.replace('T', ' ') }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          </div>
                          </div>

            {/* 轮播图片列表 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Banner图片 ({formData.images.length} 张)
                </label>
                        <button
                          type="button"
                  onClick={handleAddImage}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                  <Plus className="h-4 w-4 mr-1" />
                  添加图片
                        </button>
                      </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {formData.images.map((image, index) => {
                  // 如果发现重复ID，使用index作为后备key
                  const uniqueKey = formData.images.filter(img => img.id === image.id).length > 1 
                    ? `${image.id}-${index}` 
                    : image.id;
                    
                  return (
                    <BannerImageItem
                      key={uniqueKey}
                      image={image}
                      onRemove={handleRemoveImage}
                      onChange={handleImageChange}
                      onImageUrlChange={handleImageUrlChange}
                      showToast={showToast}
                    />
                  );
                })}
                
                {formData.images.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded-lg">
                    <ImagePlus className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>暂无图片，点击&ldquo;添加图片&rdquo;按钮添加Banner图片</p>
              </div>
            )}
                          </div>
                          </div>
                          </div>

          {/* 模态框底部 */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
              <Save className="h-4 w-4 mr-2" />
              保存更改
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}

// Banner Image Item Component (左右布局)
interface BannerImageItemProps {
  image: BannerImage;
  onRemove: (id: number) => void;
  onChange: (id: number, field: keyof BannerImage, value: string | number) => void;
  onImageUrlChange: (id: number, url: string) => void;
  showToast: (type: ToastType, message: string) => void;
}

function BannerImageItem({ image, onRemove, onChange, onImageUrlChange, showToast }: BannerImageItemProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 直接使用image.linkType，不使用本地状态
  // 这样可以确保每个组件都使用自己的props，避免状态污染
  const linkType = (image.linkType as 'categories' | 'disney-characters' | 'easy-coloring-pages') || 'categories';

  // 初始化时设置默认跳转链接（仅在linkType改变时）
  useEffect(() => {
    if (!image.linkTarget || image.linkTarget === '') {
      onChange(image.id, 'linkTarget', '/categories/');
    }
  }, [image.id]); // 添加image.id作为依赖，确保每个组件独立

  // 根据linkType更新跳转链接前缀
  const handleLinkTypeChange = (type: 'categories' | 'disney-characters' | 'easy-coloring-pages') => {
    
    // 更新linkType字段
    onChange(image.id, 'linkType', type);
    
    let prefix = '';
    switch (type) {
      case 'categories':
        prefix = '/categories/';
        break;
      case 'disney-characters':
        prefix = '/disney-characters/';
        break;
      case 'easy-coloring-pages':
        prefix = '/easy-coloring-pages/';
        break;
    }
    onChange(image.id, 'linkTarget', prefix);
  };

  // 处理目标地址输入，确保符合linkType
  const handleLinkTargetChange = (value: string) => {
    let processedValue = value;
    
    // 根据linkType验证和修正输入值
    switch (linkType) {
      case 'categories':
        if (!value.startsWith('/categories/')) {
          processedValue = '/categories/' + value.replace(/^\/+/, '');
        }
        break;
      case 'disney-characters':
        if (!value.startsWith('/disney-characters/')) {
          processedValue = '/disney-characters/' + value.replace(/^\/+/, '');
        }
        break;
      case 'easy-coloring-pages':
        if (!value.startsWith('/easy-coloring-pages/')) {
          processedValue = '/easy-coloring-pages/' + value.replace(/^\/+/, '');
        }
        break;
    }
    
    onChange(image.id, 'linkTarget', processedValue);
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', '请选择图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', '图片大小不能超过10MB');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data?.thumbnailUrl) {
        onImageUrlChange(image.id, result.data.thumbnailUrl);
        showToast('success', '图片上传成功！');
      } else {
        showToast('error', result.message || '上传失败');
      }
    } catch (error) {
      console.error('❌ 上传失败:', error);
      showToast('error', '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const hasImage = image.imageUrl && image.imageUrl.trim() !== '';

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          #{image.id}
        </span>
            <button
          type="button"
          onClick={() => onRemove(image.id)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="删除此图片"
        >
          <Trash2 className="h-4 w-4" />
            </button>
          </div>

      {/* 左右布局：左侧图片，右侧字段 */}
      <div className="grid grid-cols-5 gap-4">
        {/* 左侧：图片上传区域 */}
        <div className="col-span-2 flex flex-col">
                <input
            ref={fileInputRef}
                    type="file"
                    accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
                    className="hidden"
                  />

          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 min-h-[240px]"
          >
            {hasImage ? (
              <>
                <img
                  src={image.imageUrl}
                  alt={image.title || '轮播图'}
                  className="w-full h-full object-cover"
                />
                {isHovering && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Upload className="h-8 w-8 mx-auto mb-1" />
                      <span className="text-sm">替换图片</span>
                          </div>
                            </div>
                          )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <span className="text-sm">上传中...</span>
                        </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <ImagePlus className="h-12 w-12 mb-2" />
                <span className="text-sm">点击上传图片</span>
                <span className="text-xs mt-1">16:9 比例</span>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：表单字段 */}
        <div className="col-span-3 space-y-3">
              <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={`title-${image.id}`}
                  name={`title-${image.id}`}
                  value={image.title}
                  onChange={(e) => {
                    onChange(image.id, 'title', e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="圣诞主题涂色页"
                />
              </div>

              <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              副标题
                </label>
                <input
                  type="text"
                  id={`subtitle-${image.id}`}
                  name={`subtitle-${image.id}`}
                  value={image.subtitle || ''}
                  onChange={(e) => {
                    onChange(image.id, 'subtitle', e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="感受节日快乐"
                />
            </div>

            <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              跳转到
              </label>
            <div className="space-y-3">
              {/* Radio Group */}
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                            <input
                    type="radio"
                    name={`linkType-${image.id}`}
                    value="categories"
                    checked={linkType === 'categories'}
                    onChange={(e) => handleLinkTypeChange(e.target.value as 'categories' | 'disney-characters' | 'easy-coloring-pages')}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">分类</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`linkType-${image.id}`}
                    value="disney-characters"
                    checked={linkType === 'disney-characters'}
                    onChange={(e) => handleLinkTypeChange(e.target.value as 'categories' | 'disney-characters' | 'easy-coloring-pages')}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disney & Characters</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`linkType-${image.id}`}
                    value="easy-coloring-pages"
                    checked={linkType === 'easy-coloring-pages'}
                    onChange={(e) => handleLinkTypeChange(e.target.value as 'categories' | 'disney-characters' | 'easy-coloring-pages')}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Easy Coloring Pages</span>
                </label>
            </div>

              {/* 跳转链接输入框 */}
            <div>
                <label className="block text-xs text-gray-600 mb-1">
                  目标地址
                </label>
                  <input
                              type="text"
                  value={image.linkTarget || ''}
                  onChange={(e) => handleLinkTargetChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={
                    linkType === 'categories' ? '/categories/christmas' :
                    linkType === 'disney-characters' ? '/disney-characters/disney' :
                    '/easy-coloring-pages/first-book'
                  }
                            />
              </div>
                        </div>
                      </div>
                    </div>
      </div>
    </div>
  );
}

// Banner详情模态框组件
interface BannerDetailModalProps {
  group: BannerGroup;
  onClose: () => void;
}

function BannerDetailModal({ group, onClose }: BannerDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
        {/* 模态框标题 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Banner组详情
          </h2>
                            <button
                              type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
                            </button>
                          </div>

        {/* 模态框内容 */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* 基本信息 */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner组名称
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {group.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                自动播放间隔(毫秒)
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {group.intervalTime}ms
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 min-h-[80px]">
                {group.description || '-'}
              </div>
            </div>

            {/* 日期信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  开始日期
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                  {group.startDate ? new Date(group.startDate).toLocaleDateString('zh-CN') : '-'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  截止日期
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                  {group.endDate ? new Date(group.endDate).toLocaleDateString('zh-CN') : '-'}
                </div>
              </div>
            </div>

            {/* 状态信息 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  group.status === 'active'
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {group.status === 'active' ? '已激活' : '停用'}
                              </span>
              </div>
            </div>
          </div>

          {/* Banner图片列表 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Banner图片 ({group.images.length} 张)
              </label>
            </div>

            <div className="space-y-4">
              {group.images.map((image, index) => {
                // 为详情页面的image生成唯一标识
                const imageKey = `detail-image-${index}`;
                return (
                <div key={imageKey} className="border border-gray-300 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    {/* 左侧：图片预览 */}
                    <div className="col-span-2">
                      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                        {image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImagePlus className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                    </div>

                    {/* 右侧：图片信息 */}
                    <div className="col-span-3 space-y-3">
                          <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          标题
                        </label>
                        <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                          {image.title}
                          </div>
                      </div>

                          <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          副标题
                        </label>
                        <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                          {image.subtitle || '-'}
                          </div>
                      </div>

                          <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          跳转类型
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`detail-linkType-${index}`}
                              value="categories"
                              checked={image.linkType === 'categories'}
                              readOnly
                              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">分类</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`detail-linkType-${index}`}
                              value="disney-characters"
                              checked={image.linkType === 'disney-characters' || image.linkType === 'theme-parks'}
                              readOnly
                              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Disney & Characters</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`detail-linkType-${index}`}
                              value="easy-coloring-pages"
                              checked={image.linkType === 'easy-coloring-pages' || image.linkType === 'coloring-books'}
                              readOnly
                              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Easy Coloring Pages</span>
                          </label>
                        </div>
                      </div>

                          <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          目标地址
                        </label>
                        <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                          {image.linkTarget ? image.linkTarget : '-'}
                        </div>
                        </div>
                    </div>
                      </div>
                    </div>
                );
              })}
              
              {group.images.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded-lg">
                  <ImagePlus className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>暂无图片</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 模态框底部 */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
