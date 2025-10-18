'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Image as ImageIcon,
  Eye,
  EyeOff,
  X,
  Save,
  Calendar,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Filter,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Link
} from 'lucide-react';
import ManageRelatedColoringPages from '@/components/admin/ManageRelatedColoringPages';

interface ColoringBook {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  pageCount: number;
  coloringPageCount?: number;  // 关联的涂色卡数量
  type: string;
  seoTitle?: string;
  seoDescription?: string;
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

export default function AdminFirstColoring() {
  const [books, setBooks] = useState<ColoringBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<ColoringBook | null>(null);
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
  const [deleteBookId, setDeleteBookId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailBook, setDetailBook] = useState<ColoringBook | null>(null);
  const [showManageColoringPages, setShowManageColoringPages] = useState(false);
  const [managingBook, setManagingBook] = useState<ColoringBook | null>(null);

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
        window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
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

  // 从API加载涂色书列表
  const loadBooks = async (page = 1, search = '', status = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // 检查token是否存在
      if (!token) {
        window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        return;
      }


      const response = await fetch(`http://localhost:3001/api/admin/coloring-books?page=${page}&limit=${itemsPerPage}&q=${search}&status=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      // 如果401未授权，跳转到登录页
      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }

      const data = await response.json();
      if (response.ok && data.success && data.data) {
        setBooks(data.data.books || []);
        if (data.data.pagination) {
          setPagination(data.data.pagination);
        }
      } else {
        handleApiError(response, data, '加载涂色书列表失败');
      }
    } catch (error) {
      console.error('加载涂色书列表失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 页面加载时执行初始查询
    loadBooks(currentPage, searchTerm, statusFilter);
  }, [currentPage]);

  // 处理搜索输入（不触发查询）
  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
  };

  // 执行搜索（按回车或点击搜索按钮时调用）
  const handleSearch = () => {
    setCurrentPage(1);
    loadBooks(1, searchTerm, statusFilter);
  };

  // 处理状态筛选
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadBooks(1, searchTerm, status);
  };

  // 清空搜索
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    loadBooks(1, '', statusFilter);
  };

  // 清空状态筛选
  const handleClearStatusFilter = () => {
    setStatusFilter('');
    setCurrentPage(1);
    loadBooks(1, searchTerm, '');
  };

  const handleAddBook = async (bookData: Omit<ColoringBook, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }


      const response = await fetch('http://localhost:3001/api/admin/coloring-books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '涂色书添加成功！');
        setShowAddModal(false);
        // 重新加载列表
        loadBooks(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '涂色书添加失败');
      }
    } catch (error) {
      console.error('添加涂色书失败', error);
      showToast('error', '添加失败，请重试');
    }
  };

  const handleEditBook = async (bookData: ColoringBook) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }


      const response = await fetch(`http://localhost:3001/api/admin/coloring-books/${bookData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '涂色书更新成功！');
        setEditingBook(null);
        // 重新加载列表
        loadBooks(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '涂色书更新失败');
      }
    } catch (error) {
      console.error('更新涂色书失败', error);
      showToast('error', '更新失败，请重试');
    }
  };

  const handleDeleteBook = (bookId: number) => {
    setDeleteBookId(bookId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBook = async () => {
    if (!deleteBookId) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }


      const response = await fetch(`http://localhost:3001/api/admin/coloring-books?id=${deleteBookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', '涂色书删除成功！');
        // 重新加载列表
        loadBooks(currentPage, searchTerm, statusFilter);
      } else {
        handleApiError(response, data, '涂色书删除失败');
      }
    } catch (error) {
      console.error('删除涂色书失败', error);
      showToast('error', '删除失败，请重试');
    } finally {
      // 关闭确认 dialog
      setShowDeleteConfirm(false);
      setDeleteBookId(null);
    }
  };

  const cancelDeleteBook = () => {
    setShowDeleteConfirm(false);
    setDeleteBookId(null);
  };

  // 处理行点击，显示详情
  const handleRowClick = (book: ColoringBook) => {
    setDetailBook(book);
    setShowDetailModal(true);
  };

  const handleToggleActive = async (bookId: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }

      const book = books.find(b => b.id === bookId);
      if (!book) return;


      const response = await fetch(`http://localhost:3001/api/admin/coloring-books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...book,
          isActive: !book.isActive,
        }),
      });


      if (response.status === 401) {
        showToast('error', '登录已过期，请重新登录');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
        }, 1500);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('success', book.isActive ? '已停用涂色书' : '已激活涂色书');
        // 只更新当前行的状态，不重新加载整个列表
        setBooks(prev => prev.map(b => 
          b.id === bookId ? { ...b, isActive: !b.isActive } : b
        ));
      } else {
        handleApiError(response, data, '状态更新失败')  || '状态更新失败';
        showToast('error', errorMessage);
      }
    } catch (error) {
      console.error('切换状态失败', error);
      showToast('error', '状态更新失败，请重试') || '状态更新失败，请重试';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'first-coloring': return '首次涂色书';
      case 'latest': return '最新涂色书';
      case 'popular': return '热门涂色书';
      case 'custom': return '自定义涂色书';
      default: return '未知类型';
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
                <BookOpen className="h-7 w-7 mr-3 text-orange-600" />
                简易涂色页管理
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                管理简易涂色页列表，包括第一本涂色书、最新页面、热门页面等
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加涂色书
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
                  placeholder="搜索涂色书..."
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
            {/* 统计信息 */}
            <div className="flex gap-4 text-sm text-gray-600">
              <span>总计: <strong>{pagination.totalCount}</strong></span>
              <span>当前: <strong>{books.length}</strong></span>
              <span>激活: <strong>{books.filter(b => b.isActive).length}</strong></span>
              <span>停用: <strong>{books.filter(b => !b.isActive).length}</strong></span>
            </div>
          </div>
        </div>

        {/* 涂色书列表 */}
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        涂色书
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        描述
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SEO标题
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SEO描述
                      </th>
                    {/***   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>*/}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        涂色卡数量
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        显示顺序
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        更新时间
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr 
                        key={book.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(book)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{book.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={book.coverImage}
                                alt={book.title}
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyMEgyOFYyOEgxNlYyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2IDEySDI4VjE2SDE2VjEyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{book.title}</div>
                              <div className="text-xs text-gray-400">/{book.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={book.description}>
                            {book.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={book.seoTitle || '未设置'}>
                            {book.seoTitle || '未设置'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={book.seoDescription || '未设置'}>
                            {book.seoDescription || '未设置'}
                          </div>
                        </td>
                    {/******    <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(book.type)}`}>
                            {getTypeText(book.type)}
                          </span>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {book.coloringPageCount !== undefined ? book.coloringPageCount : (book.pageCount || 0)} 
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{book.displayOrder}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleActive(book.id);
                            }}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              book.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            title={book.isActive ? '点击停用' : '点击激活'}
                          >
                            {book.isActive ? (
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
                          {book.updatedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setManagingBook(book);
                                setShowManageColoringPages(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="关联涂色书"
                            >
                              <Link className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingBook(book);
                              }}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="编辑"
                            >
                              <Edit3 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBook(book.id);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                
                {books.length === 0 && (
                  <div className="px-6 py-12 text-center text-gray-500 border-t border-gray-200">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">
                      {searchTerm ? '没有找到匹配的涂色书' : '还没有创建任何涂色书'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* 分页组件 - 始终完整显示 */}
              {books.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    {/* 统计信息 */}
                    <div className="text-sm text-gray-700">
                      显示 {pagination.currentPage} 页，{pagination.totalCount} 条
                    </div>
                    
                    {/* 分页按钮 - 始终显示完整翻页组件 */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || !pagination.hasPrevPage}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="上一页"
                      >
                        上一页
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(pagination.totalPages || 1, 5) }, (_, i) => {
                          const totalPages = pagination.totalPages || 1;
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              disabled={totalPages === 1}
                              className={`min-w-[2.5rem] px-3 py-1 text-sm border rounded transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-orange-600 text-white border-orange-600'
                                  : 'text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages || 1))}
                        disabled={currentPage === (pagination.totalPages || 1) || !pagination.hasNextPage}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="下一页"
                      >
                        下一页
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingBook) && (
        <ColoringBookModal
          book={editingBook}
          onSave={(bookData) => {
            if (editingBook) {
              handleEditBook(bookData as ColoringBook);
            } else {
              handleAddBook(bookData as Omit<ColoringBook, 'id' | 'createdAt' | 'updatedAt'>);
            }
          }}
          onClose={() => {
            setShowAddModal(false);
            setEditingBook(null);
          }}
          showToast={showToast}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && detailBook && (
        <ColoringBookDetailModal
          book={detailBook}
          onClose={() => {
            setShowDetailModal(false);
            setDetailBook(null);
          }}
        />
      )}

      {/* 关联涂色卡管理模态框 */}
      {showManageColoringPages && managingBook && (
        <ManageRelatedColoringPages
          entityType="coloring-book"
          entityId={managingBook.id}
          entityName={managingBook.title}
          onClose={() => {
            setShowManageColoringPages(false);
            setManagingBook(null);
          }}
          onUpdate={() => {
            // 可选：关联更新后刷新列表
            loadBooks(currentPage, searchTerm, statusFilter);
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
                  确定要删除这个涂色书吗？此操作不可撤销
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDeleteBook}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmDeleteBook}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  确定删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </AdminLayout>
  );
}

// Cover Image Upload Component
interface CoverImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  showToast: (type: ToastType, message: string) => void;
}

function CoverImageUpload({ imageUrl, onImageChange, showToast }: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showToast('error', '请选择图片文件');
      return;
    }

    // 验证文件大小 (限制10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', '图片大小不能超过10MB');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // 检查token 是否存在
      if (!token) {
        showToast('error', '未登录或登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/nZ3AsLbIeq1x5JQg86PTChXWodYSGNEDB2M0HauKkmfl9t7iyOUwv4cVpFjrRz/login';
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
        onImageChange(result.data.thumbnailUrl);
        // 确保使用 toast 而不�?alert
        showToast('success', '图片上传成功');
      } else {
        showToast('error', result.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      showToast('error', '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const hasImage = imageUrl && imageUrl.trim() !== '';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        封面图片
      </label>
      
      {/* 隐藏的文件输入 */}
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
        disabled={isUploading}
      />
      
      <div
        className="relative inline-block cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          if (!isUploading) {
            fileInputRef.current?.click();
          }
        }}
      >
        {hasImage ? (
          // 有图片时显示图片
          <>
            <img
              src={imageUrl}
              alt="封面预览"
              className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300 transition-all"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA1Nkg4OFY4OEg0MFY1NloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQwIDMySDg4VjQ4SDQwVjMyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              }}
            />
            {/* 悬停覆盖- 替换图片 */}
            {isHovering && !isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center transition-opacity">
                <div className="text-center text-white">
                  <ImageIcon className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-medium">替换图片</p>
                </div>
              </div>
            )}
          </>
        ) : (
          // 没有图片时显示占位图
          <>
            <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center transition-all">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">暂无图片</p>
              </div>
            </div>
            {/* 悬停覆盖- 上传图片 */}
            {isHovering && !isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center transition-opacity">
                <div className="text-center text-white">
                  <ImageIcon className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-medium">上传图片</p>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* 上传中遮罩 */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">上传中...</p>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        {hasImage ? '点击图片可替换封面' : '点击上传封面图片'}
      </p>
    </div>
  );
}

// Coloring Book Modal Component
interface ColoringBookModalProps {
  book: ColoringBook | null;
  onClose: () => void;
  onSave: (book: Omit<ColoringBook, 'id' | 'createdAt' | 'updatedAt'> | ColoringBook) => void;
  showToast: (type: ToastType, message: string) => void;
}

function ColoringBookModal({ book, onClose, onSave, showToast }: ColoringBookModalProps) {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    description: book?.description || '',
    coverImage: book?.coverImage || '',
    slug: book?.slug || '',
    isActive: book?.isActive ?? true,
    displayOrder: book?.displayOrder || 0,
    pageCount: book?.pageCount || 0,
    type: book?.type || 'first-coloring',
    seoTitle: book?.seoTitle || '',
    seoDescription: book?.seoDescription || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.slug.trim()) {
      showToast('warning', '请填写涂色书标题和标识(slug)');
      return;
    }

    if (book) {
      // 编辑模式
      onSave({
        ...book,
        ...formData
      });
    } else {
      // 添加模式
      onSave(formData);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {book ? '编辑涂色书' : '添加涂色书'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              涂色书标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  title,
                  slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="输入涂色书标题"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标识(slug) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="涂色书标识(slug)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="输入涂色书描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO标题
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="用于搜索引擎优化的标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO描述
            </label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="用于搜索引擎优化的描述"
            />
          </div>

          <CoverImageUpload
            imageUrl={formData.coverImage}
            onImageChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
            showToast={showToast}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              类型
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="first-coloring">首次涂色书</option>
              <option value="latest">最新涂色书</option>
              <option value="popular">热门涂色书</option>
              <option value="custom">自定义涂色书</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                涂色卡数量
              </label>
              <input
                type="number"
                value={formData.pageCount}
                onChange={(e) => setFormData(prev => ({ ...prev, pageCount: parseInt(e.target.value) || 0 }))}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              启用此涂色书
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>保存</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Coloring Book Detail Modal Component
interface ColoringBookDetailModalProps {
  book: ColoringBook;
  onClose: () => void;
}

function ColoringBookDetailModal({ book, onClose }: ColoringBookDetailModalProps) {
  // 类型文本映射函数
  const getTypeText = (type: string) => {
    switch (type) {
      case 'first-coloring':
        return '首次涂色书';
      case 'latest':
        return '最新涂色书';
      case 'popular':
        return '热门涂色书';
      case 'custom':
        return '自定义涂色书';
      default:
        return type;
    }
  };

  // 类型颜色映射函数
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'first-coloring':
        return 'bg-blue-100 text-blue-800';
      case 'latest':
        return 'bg-green-100 text-green-800';
      case 'popular':
        return 'bg-red-100 text-red-800';
      case 'custom':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              涂色书详情
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
                  涂色书标题
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {book.title}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标识(slug)
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {book.slug}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                {book.description}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO标题
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {book.seoTitle || '未设置'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO描述
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                {book.seoDescription || '未设置'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                封面图片
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt="封面图片"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-32 rounded-lg flex items-center justify-center bg-gray-200 text-gray-500">
                    暂无封面图片
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  类型
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(book.type)}`}>
                    {getTypeText(book.type)}
                  </span>
                </div>
              </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                  涂色卡数量
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {book.coloringPageCount !== undefined ? book.coloringPageCount : (book.pageCount || 0)} 个涂色卡
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  排序
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {book.displayOrder}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {book.isActive ? '激活' : '停用'}
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
                  {book.createdAt}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  更新时间
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {book.updatedAt}
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