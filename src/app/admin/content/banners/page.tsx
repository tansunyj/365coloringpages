'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ImageIcon, 
  Plus, 
  Search, 
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Upload,
  XCircle,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Clock,
  Images
} from 'lucide-react';

interface BannerImage {
  id: number;
  imageUrl: string;
  title: string;
  subtitle?: string;
  description?: string;
  clickUrl?: string;
  order: number;
}

interface BannerGroup {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  images: BannerImage[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  autoPlayInterval: number;
}

export default function AdminBannerManagement() {
  const [bannerGroups, setBannerGroups] = useState<BannerGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<BannerGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<BannerGroup | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // 模拟数据加载
  useEffect(() => {
    const loadBannerGroups = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockGroups: BannerGroup[] = [
        {
          id: 1,
          name: '节日主题轮播',
          description: '包含圣诞节、万圣节、复活节等节日主题的轮播组',
          isActive: true,
          autoPlayInterval: 3000,
          createdAt: '2024-03-15',
          updatedAt: '2024-03-15',
          createdBy: '管理员',
          images: [
            {
              id: 1,
              imageUrl: '/api/placeholder/1200/400?id=banner1',
              title: 'Christmas Coloring Pages',
              subtitle: 'Magical holiday designs for festive fun',
              description: '圣诞主题涂色页，感受节日的魔法',
              clickUrl: '/categories/christmas',
              order: 1
            },
            {
              id: 2,
              imageUrl: '/api/placeholder/1200/400?id=banner2',
              title: 'Halloween Spooky Collection',
              subtitle: 'Spooky and fun designs for Halloween',
              description: '万圣节主题涂色页，享受恐怖的乐趣',
              clickUrl: '/categories/halloween',
              order: 2
            },
            {
              id: 3,
              imageUrl: '/api/placeholder/1200/400?id=banner3',
              title: 'Easter Spring Celebration',
              subtitle: 'Beautiful spring and Easter themes',
              description: '复活节春季主题，美丽的春天庆典',
              clickUrl: '/categories/easter',
              order: 3
            }
          ]
        },
        {
          id: 2,
          name: '动物主题轮播',
          description: '各种可爱动物主题的轮播组',
          isActive: false,
          autoPlayInterval: 4000,
          createdAt: '2024-03-10',
          updatedAt: '2024-03-12',
          createdBy: '管理员',
          images: [
            {
              id: 4,
              imageUrl: '/api/placeholder/1200/400?id=banner4',
              title: 'Wild Animals Safari',
              subtitle: 'Explore the wild kingdom',
              description: '野生动物探险，探索野生王国',
              clickUrl: '/categories/wild-animals',
              order: 1
            },
            {
              id: 5,
              imageUrl: '/api/placeholder/1200/400?id=banner5',
              title: 'Farm Animals',
              subtitle: 'Friendly farm creatures',
              description: '农场动物，友好的农场生物',
              clickUrl: '/categories/farm-animals',
              order: 2
            }
          ]
        }
      ];
      
      setBannerGroups(mockGroups);
      setFilteredGroups(mockGroups);
      setIsLoading(false);
    };

    loadBannerGroups();
  }, []);

  // 过滤和搜索
  useEffect(() => {
    let filtered = bannerGroups;

    // 状态筛选
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(group => group.isActive === isActive);
    }

    // 搜索
    if (searchTerm) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredGroups(filtered);
  }, [bannerGroups, statusFilter, searchTerm]);

  // 分页计算
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

  // 搜索或筛选时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // 激活/取消激活轮播组
  const handleToggleActive = (groupId: number) => {
    setBannerGroups(bannerGroups.map(group => {
      if (group.id === groupId) {
        // 如果要激活这个组，先取消激活其他所有组
        if (!group.isActive) {
          setBannerGroups(prev => prev.map(g => ({ ...g, isActive: false })));
          return { ...group, isActive: true, updatedAt: new Date().toISOString().split('T')[0] };
        } else {
          return { ...group, isActive: false, updatedAt: new Date().toISOString().split('T')[0] };
        }
      }
      return group;
    }));
  };

  // 删除轮播组
  const handleDelete = (groupId: number) => {
    const group = bannerGroups.find(g => g.id === groupId);
    if (group?.isActive) {
      alert('无法删除已激活的轮播组，请先取消激活');
      return;
    }
    
    if (confirm('确定要删除这个轮播组吗？此操作不可恢复。')) {
      setBannerGroups(bannerGroups.filter(group => group.id !== groupId));
    }
  };

  // 编辑轮播组
  const handleEdit = (group: BannerGroup) => {
    setEditingGroup(group);
    setShowEditModal(true);
  };

  // 获取当前激活的轮播组
  const activeGroup = bannerGroups.find(group => group.isActive);

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Banner轮播管理
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                管理首页轮播组，每个组包含多张图片，同时只能有一个组处于激活状态
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                创建轮播组
              </button>
            </div>
          </div>

          {/* 当前激活的轮播组 */}
          {activeGroup && (
            <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Play className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-medium text-orange-900">当前激活的轮播组</h3>
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-200 text-orange-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {activeGroup.autoPlayInterval}ms
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                  <h4 className="font-medium text-orange-900 mb-2">{activeGroup.name}</h4>
                  <p className="text-sm text-orange-700 mb-2">{activeGroup.description}</p>
                  <p className="text-xs text-orange-600">
                    共 {activeGroup.images.length} 张图片 | 更新时间: {activeGroup.updatedAt}
                  </p>
                </div>
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activeGroup.images.slice(0, 3).map((image, index) => (
                      <div key={image.id} className="relative">
                        <img 
                          src={image.imageUrl} 
                          alt={image.title}
                          className="w-full h-20 object-cover rounded-md"
                        />
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1 py-0.5 rounded">
                          #{image.order}
                        </div>
                        <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs p-1 rounded">
                          {image.title}
                        </div>
                      </div>
                    ))}
                    {activeGroup.images.length > 3 && (
                      <div className="flex items-center justify-center h-20 bg-orange-100 rounded-md text-orange-600 text-sm font-medium">
                        +{activeGroup.images.length - 3} 更多
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                      placeholder="搜索轮播组名称或描述..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-md"
                  >
                    <option value="all">所有状态</option>
                    <option value="active">已激活</option>
                    <option value="inactive">未激活</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              显示 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredGroups.length)} 条，
              共 {filteredGroups.length} 条记录
            </div>
            <div className="text-sm text-gray-600">
              总计: {bannerGroups.length} 个轮播组，已激活: {bannerGroups.filter(g => g.isActive).length} 个
            </div>
          </div>

          {/* Banner Groups Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedGroups.map((group) => (
                <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{group.name}</h3>
                      <div className="flex items-center space-x-2">
                        {group.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Play className="w-3 h-3 mr-1" />
                            已激活
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Pause className="w-3 h-3 mr-1" />
                            未激活
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {group.description && (
                      <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Images className="h-3 w-3 mr-1" />
                      <span className="mr-3">{group.images.length} 张图片</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="mr-3">{group.autoPlayInterval}ms 间隔</span>
                      <User className="h-3 w-3 mr-1" />
                      <span>{group.createdBy}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>创建: {group.createdAt}</span>
                      {group.updatedAt !== group.createdAt && (
                        <>
                          <span className="mx-2">|</span>
                          <span>更新: {group.updatedAt}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Images Preview */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                      {group.images.slice(0, 6).map((image, index) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-16 object-cover rounded"
                          />
                          <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1 py-0.5 rounded">
                            #{image.order}
                          </div>
                        </div>
                      ))}
                      {group.images.length > 6 && (
                        <div className="flex items-center justify-center h-16 bg-gray-100 rounded text-gray-500 text-xs font-medium">
                          +{group.images.length - 6}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(group)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          title="编辑"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          编辑
                        </button>
                        
                        <button
                          onClick={() => handleDelete(group.id)}
                          disabled={group.isActive}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={group.isActive ? "已激活的轮播组无法删除" : "删除"}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleToggleActive(group.id)}
                        className={`inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md ${
                          group.isActive
                            ? 'text-white bg-red-600 hover:bg-red-700'
                            : 'text-white bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {group.isActive ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            取消激活
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            激活
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredGroups.length)} 条，
                共 {filteredGroups.length} 条记录
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

          {filteredGroups.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Images className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到轮播组</h3>
              <p className="text-gray-500">尝试调整搜索条件或创建新的轮播组</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateBannerGroupModal 
          onClose={() => setShowCreateModal(false)}
          onCreate={(newGroup) => {
            setBannerGroups([newGroup, ...bannerGroups]);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingGroup && (
        <EditBannerGroupModal 
          group={editingGroup}
          onClose={() => {
            setShowEditModal(false);
            setEditingGroup(null);
          }}
          onSave={(updatedGroup) => {
            setBannerGroups(bannerGroups.map(group => group.id === updatedGroup.id ? updatedGroup : group));
            setShowEditModal(false);
            setEditingGroup(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

// Create Banner Group Modal Component
function CreateBannerGroupModal({ onClose, onCreate }: { 
  onClose: () => void; 
  onCreate: (group: BannerGroup) => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    autoPlayInterval: 3000
  });
  const [images, setImages] = useState<Array<{
    file: File;
    preview: string;
    title: string;
    subtitle: string;
    description: string;
    clickUrl: string;
  }>>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImages(prev => [...prev, {
            file,
            preview: reader.result as string,
            title: file.name.replace(/\.[^/.]+$/, ""),
            subtitle: '',
            description: '',
            clickUrl: ''
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: string, value: string) => {
    setImages(images.map((img, i) => i === index ? { ...img, [field]: value } : img));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < images.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      setImages(newImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;

    setIsCreating(true);
    
    // 模拟创建
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newGroup: BannerGroup = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      autoPlayInterval: formData.autoPlayInterval,
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: '管理员',
      images: images.map((img, index) => ({
        id: Date.now() + index,
        imageUrl: img.preview,
        title: img.title,
        subtitle: img.subtitle,
        description: img.description,
        clickUrl: img.clickUrl,
        order: index + 1
      }))
    };

    onCreate(newGroup);
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">创建新轮播组</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  轮播组名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="例如：节日主题轮播"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自动播放间隔 (毫秒)
                </label>
                <input
                  type="number"
                  value={formData.autoPlayInterval}
                  onChange={(e) => setFormData({ ...formData, autoPlayInterval: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="1000"
                  max="10000"
                  step="500"
                />
              </div>
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
                placeholder="描述这个轮播组的主题和用途（可选）"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择多张Banner图片 <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              <p className="text-xs text-gray-500 mt-1">推荐尺寸: 1200x400 像素，可以选择多张图片</p>
            </div>

            {/* Images List */}
            {images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">图片列表 ({images.length} 张)</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {images.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img src={image.preview} alt={image.title} className="w-32 h-20 object-cover rounded" />
                          <div className="mt-2 flex justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <span className="text-xs text-gray-500 px-2">#{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'down')}
                              disabled={index === images.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">标题</label>
                            <input
                              type="text"
                              value={image.title}
                              onChange={(e) => updateImage(index, 'title', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">副标题</label>
                            <input
                              type="text"
                              value={image.subtitle}
                              onChange={(e) => updateImage(index, 'subtitle', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">描述</label>
                            <input
                              type="text"
                              value={image.description}
                              onChange={(e) => updateImage(index, 'description', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">跳转链接</label>
                            <input
                              type="text"
                              value={image.clickUrl}
                              onChange={(e) => updateImage(index, 'clickUrl', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                              placeholder="/categories/..."
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="flex-shrink-0 p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                disabled={isCreating || images.length === 0}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {isCreating ? '创建中...' : '创建轮播组'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Edit Banner Group Modal Component
function EditBannerGroupModal({ group, onClose, onSave }: {
  group: BannerGroup;
  onClose: () => void;
  onSave: (group: BannerGroup) => void;
}) {
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description || '',
    autoPlayInterval: group.autoPlayInterval
  });
  
  const [images, setImages] = useState<Array<{
    id?: number;
    file?: File;
    preview: string;
    title: string;
    subtitle: string;
    description: string;
    clickUrl: string;
    order: number;
    isNew?: boolean;
  }>>(
    group.images.map(img => ({
      id: img.id,
      preview: img.imageUrl,
      title: img.title,
      subtitle: img.subtitle || '',
      description: img.description || '',
      clickUrl: img.clickUrl || '',
      order: img.order,
      isNew: false
    }))
  );

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImages(prev => [...prev, {
            file,
            preview: reader.result as string,
            title: file.name.replace(/\.[^/.]+$/, ""),
            subtitle: '',
            description: '',
            clickUrl: '',
            order: prev.length + 1,
            isNew: true
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    // 重新排序
    setImages(prev => prev.map((img, i) => ({ ...img, order: i + 1 })));
  };

  const updateImage = (index: number, field: string, value: string) => {
    setImages(images.map((img, i) => i === index ? { ...img, [field]: value } : img));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < images.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      // 重新排序
      newImages.forEach((img, i) => {
        img.order = i + 1;
      });
      setImages(newImages);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedGroup: BannerGroup = {
      ...group,
      name: formData.name,
      description: formData.description,
      autoPlayInterval: formData.autoPlayInterval,
      updatedAt: new Date().toISOString().split('T')[0],
      images: images.map((img, index) => ({
        id: img.id || Date.now() + index,
        imageUrl: img.preview,
        title: img.title,
        subtitle: img.subtitle,
        description: img.description,
        clickUrl: img.clickUrl,
        order: img.order
      }))
    };

    onSave(updatedGroup);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">编辑轮播组</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  轮播组名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自动播放间隔 (毫秒)
                </label>
                <input
                  type="number"
                  value={formData.autoPlayInterval}
                  onChange={(e) => setFormData({ ...formData, autoPlayInterval: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="1000"
                  max="10000"
                  step="500"
                />
              </div>
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

            {/* Current Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">轮播图片 ({images.length} 张)</h4>
                <label className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Plus className="h-4 w-4 mr-1" />
                  添加图片
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {images.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img src={image.preview} alt={image.title} className="w-32 h-20 object-cover rounded" />
                          <div className="mt-2 flex justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              title="上移"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">#{image.order}</span>
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'down')}
                              disabled={index === images.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              title="下移"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                          {image.isNew && (
                            <div className="mt-1 text-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                新增
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">标题 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={image.title}
                              onChange={(e) => updateImage(index, 'title', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">副标题</label>
                            <input
                              type="text"
                              value={image.subtitle}
                              onChange={(e) => updateImage(index, 'subtitle', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">描述</label>
                            <input
                              type="text"
                              value={image.description}
                              onChange={(e) => updateImage(index, 'description', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">跳转链接</label>
                            <input
                              type="text"
                              value={image.clickUrl}
                              onChange={(e) => updateImage(index, 'clickUrl', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                              placeholder="/categories/..."
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="flex-shrink-0 p-1 text-red-500 hover:text-red-700"
                          title="删除图片"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <Images className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                     <h4 className="text-sm font-medium text-gray-900 mb-2">还没有图片</h4>
                   <p className="text-sm text-gray-500 mb-4">点击上方&quot;添加图片&quot;按钮来上传轮播图片</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={images.length === 0}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                保存更改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 