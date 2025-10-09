'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  XCircle,
  Save, 
  Upload,
  CheckCircle,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

type ToastType = 'success' | 'error' | 'warning';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState<Category | null>(null);

  // Toast 提示函数
  const showToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
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

  // 加载分类列表
  const loadCategories = async (page: number = 1, search: string = '', status: string = '') => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      console.log('🔐 加载分类列表 - Token存在:', !!token);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        q: search,
        status: status
      });

      const response = await fetch(`http://localhost:3001/api/admin/categories?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📤 加载响应状态:', response.status);

      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();
      console.log('📤 加载分类列表 - 响应数据:', data);

      if (response.ok && data.success && data.data) {
        setCategories(data.data.categories || []);
        setPagination(data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } else {
        handleApiError(response, data, '加载分类列表失败');
      }
    } catch (error) {
      console.error('❌ 加载分类列表失败:', error);
      showToast('error', '网络错误，加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories(currentPage, searchTerm, statusFilter);
  }, [currentPage]);

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadCategories(1, searchTerm, statusFilter);
  };

  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 清空搜索框
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    loadCategories(1, '', statusFilter);
  };

  // 处理状态筛选
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadCategories(1, searchTerm, status);
  };

  // 处理行点击，显示详情
  const handleRowClick = (category: Category) => {
    setDetailCategory(category);
    setShowDetailModal(true);
  };

  // 添加分类
  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        return;
      }

      const response = await fetch('http://localhost:3001/api/admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '分类添加成功！');
        setEditingCategory(null);
        setIsModalOpen(false);
        // 重新加载列表
        loadCategories(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '分类添加失败');
      }
    } catch (error) {
      console.error('添加分类失败:', error);
      showToast('error', '网络错误，添加失败');
    }
  };

  // 编辑分类
  const handleEditCategory = async (categoryData: Category) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/admin/categories/${categoryData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '分类更新成功！');
        setEditingCategory(null);
        setIsModalOpen(false);
        // 重新加载列表
        loadCategories(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '分类更新失败');
      }
    } catch (error) {
      console.error('编辑分类失败:', error);
      showToast('error', '网络错误，更新失败');
    }
  };

  // 删除分类
  const handleDeleteCategory = (categoryId: number) => {
    setDeleteCategoryId(categoryId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategoryId) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/admin/categories?id=${deleteCategoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '分类删除成功！');
        // 重新加载列表
        loadCategories(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '分类删除失败');
      }
    } catch (error) {
      console.error('删除分类失败:', error);
      showToast('error', '网络错误，删除失败');
    } finally {
      setShowDeleteConfirm(false);
      setDeleteCategoryId(null);
    }
  };

  const cancelDeleteCategory = () => {
    setShowDeleteConfirm(false);
    setDeleteCategoryId(null);
  };

  // 切换激活状态
  const handleToggleActive = async (categoryId: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const category = categories.find(c => c.id === categoryId);
      if (!category) return;

      const currentStatus = category.isActive === 1 ? 'active' : 'inactive';
      const newStatus = category.isActive === 1 ? 'inactive' : 'active';
      const action = category.isActive === 1 ? 'deactivate' : 'activate';

      console.log('🔄 切换状态 - ID:', categoryId, '当前状态:', currentStatus, '新状态:', newStatus);

      // 乐观更新：立即更新本地状态
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, isActive: cat.isActive === 1 ? 0 : 1 }
            : cat
        )
      );

      const response = await fetch(`http://localhost:3001/api/admin/categories/${categoryId}/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action
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
        showToast('success', action === 'activate' ? '已激活分类' : '已停用分类');
        // 重新加载数据以确保状态同步
        loadCategories(currentPage, searchTerm, statusFilter);
      } else {
        // 如果API调用失败，回滚本地状态
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat.id === categoryId 
              ? { ...cat, isActive: category.isActive } // 恢复到原始状态
              : cat
          )
        );
        handleApiError(response, data, '状态更新失败');
      }
    } catch (error) {
      console.error('❌ 切换状态失败:', error);
      // 如果网络错误，回滚本地状态
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, isActive: category.isActive } // 恢复到原始状态
            : cat
        )
      );
      showToast('error', '网络错误，状态更新失败');
    }
  };

  const getStatusColor = (isActive: number) => {
    return isActive === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (isActive: number) => {
    return isActive === 1 ? '激活' : '停用';
  };

  return (
    <AdminLayout>
      <div className="p-6">
          {/* 页面标题 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
                <p className="mt-1 text-sm text-gray-600">管理分类列表,包括各种分类的涂色页面</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加分类
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
                    placeholder="搜索分类..."
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
                  <option value="active">激活</option>
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
                  <span className="text-gray-500">激活:</span>
                  <span className="font-semibold text-green-600">{categories.filter(c => c.isActive === 1).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">停用:</span>
                  <span className="font-semibold text-gray-600">{categories.filter(c => c.isActive === 0).length}</span>
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
                        分类
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
                    {categories.map((category) => (
                      <tr 
                        key={category.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(category)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                              <div className="text-sm text-gray-500">/{category.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={category.description}>
                            {category.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={category.seoTitle || '未设置'}>
                            {category.seoTitle || '未设置'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={category.seoDescription || '未设置'}>
                            {category.seoDescription || '未设置'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{category.sortOrder}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleActive(category.id);
                            }}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              category.isActive === 1
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            title={category.isActive === 1 ? '点击停用' : '点击激活'}
                          >
                            {category.isActive === 1 ? (
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
                          {category.updatedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(category);
                                setIsModalOpen(true);
                              }}
                              className="text-orange-600 hover:text-orange-900 transition-colors"
                              title="编辑"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category.id);
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

        {/* 添加/编辑模态框 */}
        {isModalOpen && (
          <CategoryModal
            category={editingCategory}
            onClose={() => {
              setIsModalOpen(false);
              setEditingCategory(null);
            }}
            onSave={editingCategory ? handleEditCategory : handleAddCategory}
            showToast={showToast}
          />
        )}

        {/* 详情模态框 */}
        {showDetailModal && detailCategory && (
          <CategoryDetailModal
            category={detailCategory}
            onClose={() => {
              setShowDetailModal(false);
              setDetailCategory(null);
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
                    确定要删除这个分类吗？此操作不可撤销。
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDeleteCategory}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeleteCategory}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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

// Category Modal Component
interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (category: Category | Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

function CategoryModal({ category, onClose, onSave, showToast }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    sortOrder: category?.sortOrder || 0,
    isActive: category?.isActive ?? 1,
    seoTitle: category?.seoTitle || '',
    seoDescription: category?.seoDescription || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.slug.trim()) {
      showToast('warning', '请填写分类名称和标识符');
      return;
    }

    // 如果是编辑模式，需要包含 ID
    if (category) {
      onSave({
        ...formData,
        id: category.id,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
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
              {category ? '编辑分类' : '添加分类'}
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
                  分类名称 *
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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive === 1}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked ? 1 : 0 })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  启用此分类
                </label>
              </div>
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

// Category Detail Modal Component
interface CategoryDetailModalProps {
  category: Category;
  onClose: () => void;
}

function CategoryDetailModal({ category, onClose }: CategoryDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              分类详情
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
                  分类名称
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {category.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标识符 (slug)
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {category.slug}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                {category.description}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO标题
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {category.seoTitle || '未设置'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO描述
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                {category.seoDescription || '未设置'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  排序
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {category.sortOrder}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.isActive === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.isActive === 1 ? '激活' : '停用'}
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
                  {category.createdAt}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  更新时间
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {category.updatedAt}
                </div>
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