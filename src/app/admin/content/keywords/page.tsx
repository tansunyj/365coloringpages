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
  Upload
} from 'lucide-react';

interface Keyword {
  id: number;
  keyword: string;
  displayOrder: number;
  isActive: boolean;
  clickCount: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    displayOrder: 0,
    isActive: true,
    startDate: '',
    endDate: ''
  });
  const [batchKeywords, setBatchKeywords] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 从API加载关键词数据
  useEffect(() => {
    const loadKeywords = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/keywords', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success && data.data) {
          setKeywords(data.data);
        } else {
          console.error('加载关键词失败:', data.error);
        }
      } catch (error) {
        console.error('加载关键词失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKeywords();
  }, []);

  // 筛选关键词
  const filteredKeywords = keywords.filter(keyword =>
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 计算分页
  const totalFilteredCount = filteredKeywords.length;
  const calculatedTotalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedKeywords = filteredKeywords.slice(startIndex, endIndex);

  // 更新总页数
  useEffect(() => {
    setTotalPages(calculatedTotalPages);
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [calculatedTotalPages, currentPage]);

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
      const response = await fetch('/api/admin/keywords', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: formData.keyword.trim(),
          displayOrder: formData.displayOrder || Math.max(...keywords.map(k => k.displayOrder), 0) + 1,
          isActive: formData.isActive,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setKeywords(prev => [...prev, data.data].sort((a, b) => a.displayOrder - b.displayOrder));
        setShowAddModal(false);
        resetForm();
      } else {
        setFormErrors({ keyword: data.error || '添加失败' });
      }
    } catch (error) {
      console.error('添加关键词失败:', error);
      setFormErrors({ keyword: '网络错误，请重试' });
    }
  };

  // 批量添加关键词
  const handleBatchAdd = async () => {
    const keywordList = batchKeywords
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (keywordList.length === 0) {
      setFormErrors({ batch: '请输入至少一个关键词' });
      return;
    }

    // 验证每个关键词
    const errors: string[] = [];
    keywordList.forEach((keyword, index) => {
      if (keyword.length < 2 || keyword.length > 20) {
        errors.push(`第${index + 1}行：关键词长度必须在2-20字符之间`);
      }
      const existing = keywords.find(k => k.keyword.toLowerCase() === keyword.toLowerCase());
      if (existing) {
        errors.push(`第${index + 1}行：关键词"${keyword}"已存在`);
      }
    });

    if (errors.length > 0) {
      setFormErrors({ batch: errors.join('\n') });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const promises = keywordList.map((keyword, index) => 
        fetch('/api/admin/keywords', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword: keyword.trim(),
            displayOrder: Math.max(...keywords.map(k => k.displayOrder), 0) + index + 1,
            isActive: true,
          }),
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));
      
      const successResults = results.filter(r => r.success);
      if (successResults.length > 0) {
        const newKeywords = successResults.map(r => r.data);
        setKeywords(prev => [...prev, ...newKeywords].sort((a, b) => a.displayOrder - b.displayOrder));
        setBatchKeywords('');
        setShowBatchModal(false);
        setFormErrors({});
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
      startDate: keyword.startDate || '',
      endDate: keyword.endDate || ''
    });
    setShowAddModal(true);
  };

  // 更新关键词
  const handleUpdate = async () => {
    if (!validateForm() || !editingKeyword) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/keywords', {
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
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setKeywords(prev => prev.map(keyword => 
          keyword.id === editingKeyword.id ? data.data : keyword
        ).sort((a, b) => a.displayOrder - b.displayOrder));
        setShowAddModal(false);
        resetForm();
      } else {
        setFormErrors({ keyword: data.error || '更新失败' });
      }
    } catch (error) {
      console.error('更新关键词失败:', error);
      setFormErrors({ keyword: '网络错误，请重试' });
    }
  };

  // 删除关键词
  const handleDelete = async (keywordId: number) => {
    if (!window.confirm('确定要删除这个关键词吗？')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/keywords?id=${keywordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setKeywords(prev => prev.filter(keyword => keyword.id !== keywordId));
      } else {
        alert('删除失败: ' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('删除关键词失败:', error);
      alert('网络错误，删除失败');
    }
  };

  // 切换激活状态
  const toggleActive = async (keywordId: number) => {
    const keyword = keywords.find(k => k.id === keywordId);
    if (!keyword) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/keywords', {
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
      if (data.success && data.data) {
        setKeywords(prev => prev.map(k => 
          k.id === keywordId ? data.data : k
        ));
      } else {
        alert('状态切换失败: ' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('切换状态失败:', error);
      alert('网络错误，状态切换失败');
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
                热门关键词管理
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

        {/* 搜索和统计 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="搜索关键词..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>总计: <strong>{keywords.length}</strong></span>
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
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  关键词列表 ({totalFilteredCount})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {paginatedKeywords.map((keyword) => (
                  <div key={keyword.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            keyword.isActive ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <Tag className={`h-5 w-5 ${
                              keyword.isActive ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {keyword.keyword}
                          </h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>顺序: {keyword.displayOrder}</span>
                            <span className="flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              点击: {keyword.clickCount}
                            </span>
                            {keyword.startDate && (
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {keyword.startDate}
                                {keyword.endDate && ` - ${keyword.endDate}`}
                              </span>
                            )}
                            <span>更新: {keyword.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleActive(keyword.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            keyword.isActive 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={keyword.isActive ? '点击停用' : '点击激活'}
                        >
                          {keyword.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(keyword)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑关键词"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(keyword.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除关键词"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {paginatedKeywords.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? '没有找到匹配的关键词' : '还没有创建任何关键词'}
                  </div>
                )}
              </div>
              
              {/* 分页组件 */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    显示 {startIndex + 1} - {Math.min(endIndex, totalFilteredCount)} 条，共 {totalFilteredCount} 条
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === pageNum
                                ? 'bg-orange-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

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
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
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
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
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
                    placeholder="每行输入一个关键词，例如：&#10;小猫&#10;小狗&#10;独角兽&#10;公主"
                  />
                  {formErrors.batch && (
                    <p className="mt-1 text-sm text-red-600 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="whitespace-pre-line">{formErrors.batch}</span>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    • 每行一个关键词，每个关键词2-20个字符<br/>
                    • 系统会自动检查重复并设置显示顺序<br/>
                    • 批量添加的关键词默认为激活状态
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowBatchModal(false);
                    setBatchKeywords('');
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
    </AdminLayout>
  );
} 