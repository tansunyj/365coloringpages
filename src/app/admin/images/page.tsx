'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ImageIcon, 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit3,
  Plus,
  User,
  Calendar,
  Flag,
  Grid,
  List,
  Download,
  Settings,
  UserCheck,
  Crown,
  AlertCircle,
  AlertTriangle,
  X
} from 'lucide-react';

interface ColoringImage {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploader: string;
  uploaderType: 'admin' | 'user';
  uploadDate: string;
  views: number;
  downloads: number;
  reports?: number;
  description?: string;
  tags?: string[];
}

type ToastType = 'success' | 'error' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export default function AdminImageManagement() {
  const [images, setImages] = useState<ColoringImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<ColoringImage[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [uploaderFilter, setUploaderFilter] = useState<string>('all'); // 新增上传者筛选
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingImage, setEditingImage] = useState<ColoringImage | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast 提示函数
  const showToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // 3秒后自动移除
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // 模拟数据加载
  useEffect(() => {
    const loadImages = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成50张图片的模拟数据
      const mockImages: ColoringImage[] = Array.from({ length: 50 }, (_, index) => {
        const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];
        const categories = ['动物', '自然', '幻想', '交通工具', '食物', '节日', '图案', '花朵'];
        const uploaderTypes: ('admin' | 'user')[] = ['admin', 'user'];
        const uploaders = ['管理员', 'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Wilson'];
        
        const id = index + 1;
        const status = statuses[index % statuses.length];
        const category = categories[index % categories.length];
        const uploaderType = uploaderTypes[index % uploaderTypes.length];
        const uploader = uploaderType === 'admin' ? '管理员' : uploaders[1 + (index % 4)];
        
        return {
          id,
          title: `涂色页 ${id} - ${category}主题`,
          category,
          imageUrl: `/api/placeholder/300/400?id=${id}`,
          status,
          uploader,
          uploaderType,
          uploadDate: new Date(2024, 0, 1 + (index % 30)).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 5000) + 100,
          downloads: Math.floor(Math.random() * 1000) + 10,
          reports: status === 'rejected' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2),
          description: `这是一个${category}主题的涂色页，适合各个年龄段的用户使用。`,
          tags: [category, '线稿', '涂色']
        };
      });
      
      setImages(mockImages);
      setFilteredImages(mockImages);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  // 过滤和搜索
  useEffect(() => {
    let filtered = images;

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(image => image.status === statusFilter);
    }

    // 上传者类型筛选
    if (uploaderFilter !== 'all') {
      filtered = filtered.filter(image => image.uploaderType === uploaderFilter);
    }

    // 搜索
    if (searchTerm) {
      filtered = filtered.filter(image => 
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.uploader.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  }, [images, statusFilter, uploaderFilter, searchTerm]);

  // 分页计算
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);

  // 搜索或筛选时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, uploaderFilter, searchTerm]);

  // 批量操作
  const handleBatchApprove = () => {
    setImages(images.map(image => 
      selectedImages.includes(image.id) 
        ? { ...image, status: 'approved' as const }
        : image
    ));
    setSelectedImages([]);
  };

  const handleBatchReject = () => {
    setImages(images.map(image => 
      selectedImages.includes(image.id) 
        ? { ...image, status: 'rejected' as const }
        : image
    ));
    setSelectedImages([]);
  };

  const handleBatchDelete = () => {
    if (confirm('确定要删除选中的图片吗？此操作不可恢复。')) {
      setImages(images.filter(image => !selectedImages.includes(image.id)));
      setSelectedImages([]);
    }
  };

  // 单个操作
  const handleApprove = (imageId: number) => {
    setImages(images.map(image => 
      image.id === imageId ? { ...image, status: 'approved' as const } : image
    ));
  };

  const handleReject = (imageId: number) => {
    setImages(images.map(image => 
      image.id === imageId ? { ...image, status: 'rejected' as const } : image
    ));
  };

  const handleDelete = (imageId: number) => {
    if (confirm('确定要删除这张图片吗？此操作不可恢复。')) {
      setImages(images.filter(image => image.id !== imageId));
    }
  };

  const handleEdit = (image: ColoringImage) => {
    setEditingImage(image);
    setShowEditModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">待审核</span>,
      approved: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">已通过</span>,
      rejected: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">已拒绝</span>
    };
    return badges[status as keyof typeof badges];
  };

  const getUploaderBadge = (uploaderType: string) => {
    return uploaderType === 'admin' ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        <Crown className="w-3 h-3 mr-1" />
        管理员
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <User className="w-3 h-3 mr-1" />
        用户
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                图片管理
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                管理所有涂色页图片，包括上传、审核、编辑和删除操作
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                上传图片
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="搜索图片标题、分类或上传者..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-md"
                  >
                    <option value="all">所有状态</option>
                    <option value="pending">待审核</option>
                    <option value="approved">已通过</option>
                    <option value="rejected">已拒绝</option>
                  </select>

                  <select
                    value={uploaderFilter}
                    onChange={(e) => setUploaderFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-md"
                  >
                    <option value="all">所有上传者</option>
                    <option value="admin">管理员上传</option>
                    <option value="user">用户上传</option>
                  </select>
                </div>
              </div>

              {/* Batch Actions */}
              {selectedImages.length > 0 && (
                <div className="mt-4 flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    已选择 {selectedImages.length} 项
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleBatchApprove}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      批量通过
                    </button>
                    <button
                      onClick={handleBatchReject}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      批量拒绝
                    </button>
                    <button
                      onClick={handleBatchDelete}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      批量删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* View Toggle and Stats */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              显示 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredImages.length)} 条，
              共 {filteredImages.length} 条记录
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="网格视图"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="列表视图"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Images Grid/List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedImages([...selectedImages, image.id]);
                        } else {
                          setSelectedImages(selectedImages.filter(id => id !== image.id));
                        }
                      }}
                      className="absolute top-2 left-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded z-10"
                    />
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {getUploaderBadge(image.uploaderType)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{image.title}</h3>
                      {getStatusBadge(image.status)}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{image.category}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <User className="h-3 w-3 mr-1" />
                      <span className="mr-3">{image.uploader}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{image.uploadDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{image.views}</span>
                      </div>
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        <span>{image.downloads}</span>
                      </div>
                      {image.reports && image.reports > 0 && (
                        <div className="flex items-center text-red-500">
                          <Flag className="h-3 w-3 mr-1" />
                          <span>{image.reports}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(image)}
                        className="flex-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                        title="编辑"
                      >
                        <Edit3 className="h-3 w-3 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleApprove(image.id)}
                        className="flex-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100"
                        title="通过"
                      >
                        <CheckCircle className="h-3 w-3 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleReject(image.id)}
                        className="flex-1 text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                        title="拒绝"
                      >
                        <XCircle className="h-3 w-3 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="flex-1 text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                        title="删除"
                      >
                        <Trash2 className="h-3 w-3 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="divide-y divide-gray-200">
                {paginatedImages.map((image) => (
                  <div key={image.id} className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(image.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedImages([...selectedImages, image.id]);
                            } else {
                              setSelectedImages(selectedImages.filter(id => id !== image.id));
                            }
                          }}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{image.title}</p>
                            <p className="text-sm text-gray-500">{image.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getUploaderBadge(image.uploaderType)}
                            {getStatusBadge(image.status)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{image.uploader}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{image.uploadDate}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{image.views} 次浏览</span>
                            </div>
                            <div className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              <span>{image.downloads} 次下载</span>
                            </div>
                            {image.reports && image.reports > 0 && (
                              <div className="flex items-center text-red-600">
                                <Flag className="h-4 w-4 mr-1" />
                                <span>{image.reports} 次举报</span>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(image)}
                              className="text-blue-600 hover:text-blue-900"
                              title="编辑"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(image.id)}
                              className="text-green-600 hover:text-green-900"
                              title="通过"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(image.id)}
                              className="text-red-600 hover:text-red-900"
                              title="拒绝"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(image.id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="删除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredImages.length)} 条，
                共 {filteredImages.length} 条记录
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'text-orange-600 bg-orange-50 border border-orange-300'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}

          {filteredImages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ImageIcon className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到图片</h3>
              <p className="text-gray-500">尝试调整搜索条件或过滤器</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)}
          onUpload={(newImage) => {
            setImages([newImage, ...images]);
            setShowUploadModal(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingImage && (
        <EditModal 
          image={editingImage}
          onClose={() => {
            setShowEditModal(false);
            setEditingImage(null);
          }}
          onSave={(updatedImage) => {
            setImages(images.map(img => img.id === updatedImage.id ? updatedImage : img));
            setShowEditModal(false);
            setEditingImage(null);
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
    </AdminLayout>
  );
}

// Upload Modal Component
function UploadModal({ onClose, onUpload }: { 
  onClose: () => void; 
  onUpload: (image: ColoringImage) => void; 
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
    file: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const categories = ['动物', '自然', '幻想', '交通工具', '食物', '节日', '图案', '花朵'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    setIsUploading(true);
    
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newImage: ColoringImage = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      imageUrl: previewUrl,
      status: 'approved', // 管理员上传直接通过
      uploader: '管理员',
      uploaderType: 'admin',
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      downloads: 0,
      reports: 0
    };

    onUpload(newImage);
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">上传新图片</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择图片文件
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                required
              />
              {previewUrl && (
                <div className="mt-4">
                  <img src={previewUrl} alt="预览" className="w-full h-48 object-cover rounded-md" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片标题
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">选择分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="例如：动物,卡通,儿童"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
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
                disabled={isUploading}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {isUploading ? '上传中...' : '上传'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Edit Modal Component
function EditModal({ image, onClose, onSave }: {
  image: ColoringImage;
  onClose: () => void;
  onSave: (image: ColoringImage) => void;
}) {
  const [formData, setFormData] = useState({
    title: image.title,
    category: image.category,
    description: image.description || '',
    tags: image.tags?.join(', ') || '',
    status: image.status
  });

  const categories = ['动物', '自然', '幻想', '交通工具', '食物', '节日', '图案', '花朵'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedImage: ColoringImage = {
      ...image,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      status: formData.status as 'pending' | 'approved' | 'rejected'
    };

    onSave(updatedImage);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">编辑图片</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <img src={image.imageUrl} alt={image.title} className="w-full h-48 object-cover rounded-md" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片标题
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={formData.status}
                                 onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'approved' | 'rejected' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
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