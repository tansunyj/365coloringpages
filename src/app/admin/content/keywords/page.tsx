'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Save,
  X,
  AlertCircle,
  TrendingUp,
  Eye,
  EyeOff,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Upload,
  XCircle,
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface Keyword {
  id: number;
  keyword: string;
  displayOrder: number;
  isActive: number | boolean;
  clickCount: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
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

export default function AdminKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
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
    if (!inputValue) return undefined;
    // 如果输入的是日期格式 (yyyy-MM-dd)，则添加时间部分
    if (inputValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `${inputValue} 00:00:00`;
    }
    // 如果已经是完整格式，直接返回
    return inputValue;
  };

  const [formData, setFormData] = useState({
    keyword: '',
    displayOrder: 0,
    isActive: true,
    startDate: '',
    endDate: ''
  });
  const [batchKeywords, setBatchKeywords] = useState('');
  const [batchFormData, setBatchFormData] = useState({
    displayOrder: 0,
    startDate: '',
    endDate: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // 筛选相关状态
  const [statusFilter, setStatusFilter] = useState<string>(''); // 状态筛选
  const [startDateFilter, setStartDateFilter] = useState<string>(''); // 开始日期筛选
  const [endDateFilter, setEndDateFilter] = useState<string>(''); // 结束日期筛选
  
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
  const [detailKeyword, setDetailKeyword] = useState<Keyword | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteKeywordId, setDeleteKeywordId] = useState<number | null>(null);

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

  // 从API加载关键词数据
  const loadKeywords = async (page = 1, search = '', status = '', startDate = '', endDate = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const { api, adminApiClient } = await import('@/lib/apiClient');
      adminApiClient.setToken(token || '');
      
      const data = await api.admin.keywords.list({
        q: search,
        page: page,
        limit: itemsPerPage,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });
      
      if (data.success && data.data) {
        // 适配新的返回格式
        const responseData = data.data as any;
        if (responseData.keywords && Array.isArray(responseData.keywords)) {
          // 转换 isActive 从数字到布尔值
          const keywordsData = responseData.keywords.map((k: any) => ({
            ...k,
            isActive: k.isActive === 1 || k.isActive === true
          }));
          setKeywords(keywordsData);
          
          if (responseData.pagination) {
            setPagination(responseData.pagination);
          }
        }
      } else {
        showToast('error', data.message || '加载关键词列表失败');
      }
    } catch (error) {
      console.error('加载关键词失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新URL参数
  const updateURL = (params: { q?: string; status?: string; startDate?: string; endDate?: string; page?: number }) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams();
      
      const q = params.q !== undefined ? params.q : searchTerm;
      const status = params.status !== undefined ? params.status : statusFilter;
      const startDate = params.startDate !== undefined ? params.startDate : startDateFilter;
      const endDate = params.endDate !== undefined ? params.endDate : endDateFilter;
      const page = params.page !== undefined ? params.page : currentPage;
      
      if (q) urlParams.set('q', q);
      if (status) urlParams.set('status', status);
      if (startDate) urlParams.set('startDate', startDate);
      if (endDate) urlParams.set('endDate', endDate);
      if (page > 1) urlParams.set('page', page.toString());
      
      const newURL = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      window.history.pushState({}, '', newURL);
    }
  };

  // 初始化：从URL读取参数
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qParam = urlParams.get('q') || '';
      const statusParam = urlParams.get('status') || '';
      const startDateParam = urlParams.get('startDate') || '';
      const endDateParam = urlParams.get('endDate') || '';
      const pageParam = parseInt(urlParams.get('page') || '1');
      
      // 设置初始状态
      if (qParam) setSearchTerm(qParam);
      if (statusParam) setStatusFilter(statusParam);
      if (startDateParam) setStartDateFilter(startDateParam);
      if (endDateParam) setEndDateFilter(endDateParam);
      if (pageParam > 1) setCurrentPage(pageParam);
      
      // 加载数据
      loadKeywords(pageParam, qParam, statusParam, startDateParam, endDateParam);
      setIsInitialized(true);
    }
  }, []);

  // 当页码或筛选条件变化时重新加载
  useEffect(() => {
    if (isInitialized) {
      loadKeywords(currentPage, searchTerm, statusFilter, startDateFilter, endDateFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 清空搜索框
  const handleClearSearch = () => {
    setSearchTerm('');
    updateURL({ q: '', page: 1 });
    
    // 如果当前已经是第1页，直接加载数据；否则设置页码会触发useEffect
    if (currentPage === 1) {
      loadKeywords(1, '', statusFilter, startDateFilter, endDateFilter);
    } else {
      setCurrentPage(1);
    }
  };

  // 处理查询按钮点击
  const handleQueryClick = () => {
    // 更新URL
    updateURL({ q: searchTerm, status: statusFilter, startDate: startDateFilter, endDate: endDateFilter, page: 1 });
    
    // 如果当前已经是第1页，直接加载数据；否则设置页码会触发useEffect
    if (currentPage === 1) {
      loadKeywords(1, searchTerm, statusFilter, startDateFilter, endDateFilter);
    } else {
      setCurrentPage(1);
    }
  };

  // 重置所有筛选条件
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    updateURL({ q: '', status: '', startDate: '', endDate: '', page: 1 });
    
    // 如果当前已经是第1页，直接加载数据；否则设置页码会触发useEffect
    if (currentPage === 1) {
      loadKeywords(1, '', '', '', '');
    } else {
      setCurrentPage(1);
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      keyword: '',
      displayOrder: 0,
      isActive: true,
      startDate: '',
      endDate: ''
    });
    setFormErrors({});
    setEditingKeyword(null);
  };

  // 表单验证
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.keyword.trim()) {
      errors.keyword = '关键词不能为空';
    } else if (formData.keyword.trim().length < 2) {
      errors.keyword = '关键词至少需要2个字符';
    } else if (formData.keyword.trim().length > 20) {
      errors.keyword = '关键词最多20个字符';
    }

    if (formData.displayOrder < 0) {
      errors.displayOrder = '显示顺序不能为负数';
    }

    // 检查关键词是否重复
    const existingKeyword = keywords.find(k => 
      k.keyword.toLowerCase() === formData.keyword.trim().toLowerCase() && 
      k.id !== editingKeyword?.id
    );
    if (existingKeyword) {
      errors.keyword = '该关键词已存在';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 添加关键词
  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const { api, adminApiClient } = await import('@/lib/apiClient');
      adminApiClient.setToken(token || '');
      
      const data = await api.admin.keywords.create({
        keyword: formData.keyword.trim(),
        displayOrder: formData.displayOrder || Math.max(...keywords.map(k => k.displayOrder), 0) + 1,
        isActive: formData.isActive,
        startDate: formatInputToAPI(formData.startDate),
        endDate: formatInputToAPI(formData.endDate),
      });
      
      if (data.success && data.data) {
        showToast('success', data.message || '关键词添加成功');
        setShowAddModal(false);
        resetForm();
        // 重新加载数据
        await loadKeywords(currentPage, searchTerm, statusFilter, startDateFilter, endDateFilter);
      } else {
        showToast('error', data.message || '关键词添加失败');
      }
    } catch (error) {
      console.error('添加关键词失败:', error);
      showToast('error', '网络错误，请重试');
      setFormErrors({ keyword: '网络错误，请重试' });
    }
  };

  // 解析关键词（支持双引号处理空格）
  const parseKeywords = (text: string): string[] => {
    const keywords: string[] = [];
    const lines = text.split('\n');
    
    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // 解析每行的关键词
      const lineKeywords = parseLineKeywords(trimmedLine);
      keywords.push(...lineKeywords);
    });
    
    return keywords;
  };

  // 解析单行关键词（支持双引号和空格分割）
  const parseLineKeywords = (line: string): string[] => {
    const keywords: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"' && !inQuotes) {
        // 开始双引号
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        // 结束双引号
        inQuotes = false;
        if (current.trim()) {
          keywords.push(current.trim());
          current = '';
        }
      } else if (char === ' ' && !inQuotes) {
        // 空格分割（不在引号内）
        if (current.trim()) {
          keywords.push(current.trim());
          current = '';
        }
      } else {
        // 普通字符
        current += char;
      }
      
      i++;
    }
    
    // 处理最后一个关键词
    if (current.trim()) {
      keywords.push(current.trim());
    }
    
    return keywords.filter(k => k.length > 0);
  };

  // 批量添加关键词
  const handleBatchAdd = async () => {
    const keywordList = parseKeywords(batchKeywords);

    if (keywordList.length === 0) {
      setFormErrors({ batch: '请输入至少一个关键词' });
      return;
    }

    // 验证每个关键词
    const errors: string[] = [];
    keywordList.forEach((keyword, index) => {
      if (keyword.length < 2 || keyword.length > 20) {
        errors.push(`第${index + 1}个关键词：长度必须在2-20字符之间`);
      }
      const existing = keywords.find(k => k.keyword.toLowerCase() === keyword.toLowerCase());
      if (existing) {
        errors.push(`第${index + 1}个关键词："${keyword}"已存在`);
      }
    });

    if (errors.length > 0) {
      setFormErrors({ batch: errors.join('\n') });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const promises = keywordList.map((keyword, index) => 
        fetch('http://localhost:3001/api/admin/keywords', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword: keyword.trim(),
            displayOrder: batchFormData.displayOrder || Math.max(...keywords.map(k => k.displayOrder), 0) + index + 1,
            isActive: true,
            startDate: formatInputToAPI(batchFormData.startDate),
            endDate: formatInputToAPI(batchFormData.endDate),
          }),
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));
      
      const successResults = results.filter(r => r.success);
      if (successResults.length > 0) {
        setBatchKeywords('');
        setBatchFormData({
          displayOrder: 0,
          startDate: '',
          endDate: ''
        });
        setShowBatchModal(false);
        setFormErrors({});
        // 重新加载数据
        await loadKeywords(currentPage, searchTerm, statusFilter, startDateFilter, endDateFilter);
      }

      if (successResults.length < keywordList.length) {
        const failedCount = keywordList.length - successResults.length;
        setFormErrors({ batch: `${failedCount}个关键词添加失败` });
      }
    } catch (error) {
      console.error('批量添加关键词失败:', error);
      setFormErrors({ batch: '网络错误，请重试' });
    }
  };

  // 编辑关键词
  const handleEdit = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setFormData({
      keyword: keyword.keyword,
      displayOrder: keyword.displayOrder,
      isActive: keyword.isActive,
      startDate: formatDateForInput(keyword.startDate),
      endDate: formatDateForInput(keyword.endDate)
    });
    setShowAddModal(true);
  };

  // 更新关键词
  const handleUpdate = async () => {
    if (!validateForm() || !editingKeyword) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/admin/keywords', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingKeyword.id,
          keyword: formData.keyword.trim(),
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
          startDate: formatInputToAPI(formData.startDate),
          endDate: formatInputToAPI(formData.endDate),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.data) {
        setShowAddModal(false);
        resetForm();
        // 重新加载数据
        await loadKeywords(currentPage, searchTerm, statusFilter, startDateFilter, endDateFilter);
      } else {
        handleApiError(response, data, '关键词更新失败');
      }
    } catch (error) {
      console.error('更新关键词失败:', error);
      setFormErrors({ keyword: '网络错误，请重试' });
    }
  };

  // 删除关键词
  const handleDelete = (keywordId: number) => {
    setDeleteKeywordId(keywordId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteKeywordId) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/admin/keywords?id=${deleteKeywordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showToast('success', '关键词删除成功！');
        // 重新加载数据
        await loadKeywords(currentPage, searchTerm, statusFilter, startDateFilter, endDateFilter);
      } else {
        handleApiError(response, data, '关键词删除失败');
      }
    } catch (error) {
      console.error('删除关键词失败:', error);
      showToast('error', '网络错误，删除失败');
    } finally {
      setShowDeleteConfirm(false);
      setDeleteKeywordId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteKeywordId(null);
  };

  // 处理行点击，显示详情
  const handleRowClick = (keyword: Keyword) => {
    setDetailKeyword(keyword);
    setShowDetailModal(true);
  };

  // 切换激活状态
  const toggleActive = async (keywordId: number) => {
    const keyword = keywords.find(k => k.id === keywordId);
    if (!keyword) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/admin/keywords', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: keywordId,
          isActive: !keyword.isActive,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.data) {
        showToast('success', keyword.isActive ? '已停用关键词' : '已激活关键词');
        // 只更新当前行的状态，不重新加载整个列表
        setKeywords(prev => prev.map(k => 
          k.id === keywordId ? { ...k, isActive: !k.isActive } : k
        ));
      } else {
        handleApiError(response, data, '状态切换失败');
      }
    } catch (error) {
      console.error('切换状态失败:', error);
      showToast('error', '网络错误，状态切换失败');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Tag className="h-7 w-7 mr-3 text-orange-600" />
                关键词管理
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                管理首页搜索框上方显示的热门关键词，引导用户搜索
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加关键词
              </button>
              <button
                onClick={() => setShowBatchModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                批量添加
              </button>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* 第一行：搜索框和筛选器 */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* 搜索框 - 带清空图标 */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="搜索关键词..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={handleSearchInput}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleQueryClick();
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
              
              {/* 筛选条件容器 */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                {/* 状态筛选 */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">全部状态</option>
                  <option value="active">激活</option>
                  <option value="inactive">停用</option>
                </select>

                {/* 开始日期筛选 */}
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
                  <label className="text-sm text-gray-600 whitespace-nowrap">开始:</label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="border-0 p-0 focus:ring-0 focus:outline-none text-sm"
                  />
                </div>

                {/* 结束日期筛选 */}
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
                  <label className="text-sm text-gray-600 whitespace-nowrap">结束:</label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="border-0 p-0 focus:ring-0 focus:outline-none text-sm"
                  />
                </div>

                {/* 查询和重置按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={handleQueryClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
                    title="查询"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    查询
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center whitespace-nowrap"
                    title="重置筛选条件"
                  >
                    <X className="h-4 w-4 mr-1" />
                    重置
                  </button>
                </div>
              </div>
            </div>

            {/* 第二行：统计信息 */}
            <div className="flex gap-4 text-sm text-gray-600">
              <span>总计: <strong>{pagination.totalCount}</strong></span>
              <span>当前页: <strong>{keywords.length}</strong></span>
              <span>激活: <strong>{keywords.filter(k => k.isActive).length}</strong></span>
              <span>停用: <strong>{keywords.filter(k => !k.isActive).length}</strong></span>
            </div>
          </div>
        </div>

        {/* 关键词列表 */}
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
                        关键词
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        显示顺序
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        点击次数
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        有效期
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {keywords.map((keyword) => (
                      <tr 
                        key={keyword.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(keyword)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{keyword.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 text-orange-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{keyword.keyword}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{keyword.displayOrder}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <TrendingUp className="h-3 w-3 text-blue-500 mr-1" />
                            {keyword.clickCount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {keyword.startDate ? (
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span>
                                {keyword.startDate}
                                {keyword.endDate && ` ~ ${keyword.endDate}`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActive(keyword.id);
                            }}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              keyword.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            title={keyword.isActive ? '点击停用' : '点击激活'}
                          >
                            {keyword.isActive ? (
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(keyword);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="编辑关键词"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(keyword.id);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="删除关键词"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {keywords.length === 0 && (
                  <div className="px-6 py-12 text-center text-gray-500 border-t border-gray-200">
                    <Tag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">
                      {searchTerm ? '没有找到匹配的关键词' : '还没有创建任何关键词'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* 分页组件 - 始终完整显示 */}
              {keywords.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    {/* 统计信息 */}
                    <div className="text-sm text-gray-700">
                      显示 {pagination.startRecord || 1} - {pagination.endRecord || keywords.length} 条，共 {pagination.totalCount || keywords.length} 条
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

        {/* 详情模态框 */}
        {showDetailModal && detailKeyword && (
          <KeywordDetailModal
            keyword={detailKeyword}
            onClose={() => {
              setShowDetailModal(false);
              setDetailKeyword(null);
            }}
          />
        )}

        {/* 删除确认对话框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    确认删除
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    确定要删除这个关键词吗？此操作无法撤销。
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      确定删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 添加/编辑模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingKeyword ? '编辑关键词' : '添加关键词'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 关键词输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    关键词 *
                  </label>
                  <input
                    type="text"
                    value={formData.keyword}
                    onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      formErrors.keyword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="请输入关键词"
                  />
                  {formErrors.keyword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.keyword}
                    </p>
                  )}
                </div>

                {/* 显示顺序 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    显示顺序
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      formErrors.displayOrder ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="请输入显示顺序"
                    min="0"
                  />
                  {formErrors.displayOrder && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.displayOrder}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    数字越小，显示顺序越靠前。留空则自动排在最后。
                  </p>
                </div>

                {/* 显示时间段 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      开始时间
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate ? formData.startDate.replace(' ', 'T') : ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value.replace('T', ' ') }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      留空表示立即生效
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      结束时间
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate ? formData.endDate.replace(' ', 'T') : ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value.replace('T', ' ') }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      留空表示永久有效
                    </p>
                  </div>
                </div>

                {/* 是否激活 */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">立即激活显示</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={editingKeyword ? handleUpdate : handleAdd}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingKeyword ? '更新' : '添加'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 批量添加模态框 */}
        {showBatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  批量添加关键词
                </h2>
                <button
                  onClick={() => {
                    setShowBatchModal(false);
                    setBatchKeywords('');
                    setBatchFormData({
                      displayOrder: 0,
                      startDate: '',
                      endDate: ''
                    });
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    关键词列表
                  </label>
                  <textarea
                    value={batchKeywords}
                    onChange={(e) => setBatchKeywords(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32 ${
                      formErrors.batch ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="支持多种输入方式：&#10;方式1（每行一个）：&#10;小猫&#10;小狗&#10;独角兽&#10;&#10;方式2（空格分割）：&#10;小猫 小狗 独角兽 公主&#10;&#10;方式3（双引号处理空格）：&#10;小猫咪 小狗 独角兽公主"
                  />
                  {formErrors.batch && (
                    <p className="mt-1 text-sm text-red-600 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="whitespace-pre-line">{formErrors.batch}</span>
                    </p>
                  )}
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">📝 输入方式说明：</p>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>• <strong>每行一个关键词：</strong>每行输入一个关键词</p>
                      <p>• <strong>空格分割：</strong>同一行用空格分割多个关键词</p>
                      <p>• <strong>双引号处理空格：</strong>关键词包含空格时用双引号括起来</p>
                      <p>• <strong>混合使用：</strong>可以同时使用多种方式</p>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                      <p><strong>示例：</strong></p>
                      <p>小猫 小狗 "独角兽公主"</p>
                      <p>"小猫咪" 恐龙</p>
                      <p>花朵</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    • 每个关键词2-20个字符，系统会自动检查重复并设置显示顺序<br/>
                    • 批量添加的关键词默认为激活状态
                  </p>
                </div>

                {/* 批量设置区域 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">批量设置</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* 显示顺序 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        显示顺序
                      </label>
                      <input
                        type="number"
                        value={batchFormData.displayOrder}
                        onChange={(e) => setBatchFormData(prev => ({ 
                          ...prev, 
                          displayOrder: parseInt(e.target.value) || 0 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="留空则自动设置"
                        min="0"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        留空则从当前最大顺序号开始自动递增
                      </p>
                    </div>

                    {/* 开始时间 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        开始时间
                      </label>
                      <input
                        type="datetime-local"
                        value={batchFormData.startDate ? batchFormData.startDate.replace(' ', 'T') : ''}
                        onChange={(e) => setBatchFormData(prev => ({ 
                          ...prev, 
                          startDate: e.target.value.replace('T', ' ') 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        留空表示立即生效
                      </p>
                    </div>

                    {/* 结束时间 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        结束时间
                      </label>
                      <input
                        type="datetime-local"
                        value={batchFormData.endDate ? batchFormData.endDate.replace(' ', 'T') : ''}
                        onChange={(e) => setBatchFormData(prev => ({ 
                          ...prev, 
                          endDate: e.target.value.replace('T', ' ') 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        留空表示永久有效
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowBatchModal(false);
                    setBatchKeywords('');
                    setBatchFormData({
                      displayOrder: 0,
                      startDate: '',
                      endDate: ''
                    });
                    setFormErrors({});
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleBatchAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  批量添加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
    </AdminLayout>
  );
}

// Keyword Detail Modal Component
interface KeywordDetailModalProps {
  keyword: Keyword;
  onClose: () => void;
}

function KeywordDetailModal({ keyword, onClose }: KeywordDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              关键词详情
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                关键词
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                {keyword.keyword}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                {keyword.description || '暂无描述'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  搜索次数
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {keyword.searchCount}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    keyword.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {keyword.isActive ? '激活' : '停用'}
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
                  {keyword.createdAt}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  更新时间
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {keyword.updatedAt}
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