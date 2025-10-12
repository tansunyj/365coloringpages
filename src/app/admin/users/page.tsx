'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Save,
  X,
  AlertCircle,
  User,
  Eye,
  EyeOff,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail,
  Shield,
  XCircle,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  provider: string;
  providerId: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
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

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // 分页相关状态
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

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
        errorMessage = data.message || '用户不存在';
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

  // 从API加载用户数据
  const loadUsers = async (page = 1, search = '', status = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }


      const response = await fetch(`http://localhost:3001/api/admin/users?page=${page}&limit=${itemsPerPage}&q=${search}&status=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        setUsers(data.data.users || []);
        setPagination(data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } else {
        handleApiError(response, data, '加载用户列表失败');
      }
    } catch (error) {
      console.error('❌ 加载用户失败:', error);
      showToast('error', '加载失败，请重试');
    } finally {
      setIsLoading(false);
    }
    };

  useEffect(() => {
    loadUsers(currentPage, searchTerm, statusFilter);
  }, [currentPage]);

  // 处理搜索输入（不触发查询）
  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
  };

  // 执行搜索（按回车或点击搜索按钮时调用）
  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers(1, searchTerm, statusFilter);
  };

  // 处理状态筛选
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadUsers(1, searchTerm, status);
  };

  // 清空搜索框
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    loadUsers(1, '', statusFilter);
  };

  // 清空状态筛选
  const handleClearStatusFilter = () => {
    setStatusFilter('');
    setCurrentPage(1);
    loadUsers(1, searchTerm, '');
  };

  // 添加用户
  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }


      const response = await fetch('http://localhost:3001/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '用户添加成功！');
        setShowAddModal(false);
        // 重新加载列表
        loadUsers(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '用户添加失败');
      }
    } catch (error) {
      console.error('❌ 添加用户失败:', error);
      showToast('error', '添加失败，请重试');
    }
  };

  // 编辑用户
  const handleEditUser = async (userData: User) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }


      const response = await fetch(`http://localhost:3001/api/admin/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '用户更新成功！');
        setEditingUser(null);
        setShowAddModal(false);
        // 重新加载列表
        loadUsers(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '用户更新失败');
      }
    } catch (error) {
      console.error('❌ 编辑用户失败:', error);
      showToast('error', '更新失败，请重试');
    }
  };

  // 删除用户
  const handleDeleteUser = (userId: number) => {
    setDeleteUserId(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }


      const response = await fetch(`http://localhost:3001/api/admin/users?id=${deleteUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '用户删除成功！');
        // 重新加载列表
        loadUsers(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '用户删除失败');
      }
    } catch (error) {
      console.error('❌ 删除用户失败:', error);
      showToast('error', '删除失败，请重试');
    } finally {
      // 关闭确认 dialog
      setShowDeleteConfirm(false);
      setDeleteUserId(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setDeleteUserId(null);
  };

  // 处理行点击，显示详情
  const handleRowClick = (user: User) => {
    setDetailUser(user);
    setShowDetailModal(true);
  };

  // 切换冻结状态
  const handleToggleFreeze = async (userId: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const user = users.find(u => u.id === userId);
      if (!user) return;

      const action = user.isActive ? 'freeze' : 'unfreeze';

      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/toggle-freeze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action,
        }),
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', user.isActive ? '用户已冻结' : '用户已解冻');
        // 只更新当前行的状态，不重新加载整个列表
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isActive: !u.isActive } : u
        ));
      } else {
        handleApiError(response, data, '状态更新失败');
      }
    } catch (error) {
      console.error('❌ 切换冻结状态失败:', error);
      showToast('error', '状态更新失败，请重试');
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'google':
        return <Globe className="h-4 w-4" />;
      case 'github':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getProviderText = (provider: string) => {
    switch (provider) {
      case 'email':
        return '邮箱';
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      default:
        return provider;
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
                <Users className="h-7 w-7 mr-3 text-orange-600" />
                用户管理
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                管理系统用户，包括用户信息、状态和权限管理
              </p>
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
                  placeholder="搜索用户..."
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
                <option value="active">正常</option>
                <option value="inactive">冻结</option>
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
              <span>当前页: <strong>{users.length}</strong></span>
              <span>正常: <strong>{users.filter(u => u.isActive).length}</strong></span>
              <span>冻结: <strong>{users.filter(u => !u.isActive).length}</strong></span>
            </div>
            </div>
          </div>

        {/* 用户列表 */}
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
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        邮箱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        登录方式
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最后登录
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(user)}
                      >
                        <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                              {user.avatar ? (
                          <img
                                  className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar}
                                  alt={user.name}
                          />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-orange-600" />
                                </div>
                              )}
                        </div>
                        <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-400">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            {getProviderIcon(user.provider)}
                            <span className="ml-2">{getProviderText(user.provider)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.lastLoginAt ? (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                {new Date(user.lastLoginAt).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-gray-400">从未登录</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFreeze(user.id);
                            }}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              user.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title={user.isActive ? '点击冻结' : '点击解冻'}
                          >
                            {user.isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                正常
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                冻结
                              </>
                            )}
                          </button>
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
        {showAddModal && (
          <UserModal
            user={editingUser}
            onClose={() => {
              setShowAddModal(false);
              setEditingUser(null);
            }}
            onSave={editingUser ? handleEditUser : handleAddUser}
            showToast={showToast}
          />
        )}

        {/* 详情模态框 */}
        {showDetailModal && detailUser && (
          <UserDetailModal
            user={detailUser}
            onClose={() => {
              setShowDetailModal(false);
              setDetailUser(null);
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
                    确定要删除这个用户吗？此操作不可撤销。
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDeleteUser}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeleteUser}
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

// User Modal Component
interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: User | Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

function UserModal({ user, onClose, onSave, showToast }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    isActive: user?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('warning', '请填写用户姓名和邮箱');
      return;
    }

    // 如果是编辑模式，需要包含 ID
    if (user) {
      onSave({
        ...formData,
        id: user.id,
        avatar: user.avatar,
        provider: user.provider,
        providerId: user.providerId,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
              {user ? '编辑用户' : '添加用户'}
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
                  用户姓名 *
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
                  邮箱地址 *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
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
                启用此用户
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

// User Detail Modal Component
interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              用户详情
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
                  用户姓名
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {user.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱地址
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  登录方式
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {user.provider}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? '正常' : '冻结'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                头像
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="用户头像"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-orange-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最后登录时间
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '从未登录'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  注册时间
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {new Date(user.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                更新时间
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {new Date(user.updatedAt).toLocaleString()}
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