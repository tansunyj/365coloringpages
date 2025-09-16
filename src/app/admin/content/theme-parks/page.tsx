'use client';

import { useState, useEffect } from 'react';
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
  Upload
} from 'lucide-react';

interface ThemePark {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminThemeParks() {
  const [themeParks, setThemeParks] = useState<ThemePark[]>([]);
  const [filteredThemeParks, setFilteredThemeParks] = useState<ThemePark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPark, setEditingPark] = useState<ThemePark | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 模拟数据加载
  useEffect(() => {
    const loadThemeParks = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockThemeParks: ThemePark[] = [
        {
          id: 1,
          name: '迪士尼世界',
          slug: 'disney-world',
          description: '神奇的迪士尼角色和场景涂色页',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 45,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        },
        {
          id: 2,
          name: '环球影城',
          slug: 'universal-studios',
          description: '电影主题的精彩涂色页',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 32,
          createdAt: '2024-01-16',
          updatedAt: '2024-01-21'
        },
        {
          id: 3,
          name: '六旗乐园',
          slug: 'six-flags',
          description: '刺激的游乐设施涂色页',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 28,
          createdAt: '2024-01-17',
          updatedAt: '2024-01-22'
        },
        {
          id: 4,
          name: '雪松点',
          slug: 'cedar-point',
          description: '过山车和游乐设施主题',
          imageUrl: '/api/placeholder/300/200',
          isActive: false,
          itemCount: 15,
          createdAt: '2024-01-18',
          updatedAt: '2024-01-23'
        },
        {
          id: 5,
          name: '乐高乐园',
          slug: 'legoland',
          description: '乐高积木主题涂色页',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 38,
          createdAt: '2024-01-19',
          updatedAt: '2024-01-24'
        },
        {
          id: 6,
          name: '奇幻王国',
          slug: 'fantasy-kingdom',
          description: '童话城堡和魔法世界',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 42,
          createdAt: '2024-01-20',
          updatedAt: '2024-01-25'
        },
        {
          id: 7,
          name: '冒险岛',
          slug: 'adventure-island',
          description: '丛林探险和冒险主题',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 35,
          createdAt: '2024-01-21',
          updatedAt: '2024-01-26'
        },
        {
          id: 8,
          name: '未来世界',
          slug: 'future-world',
          description: '科幻和太空主题乐园',
          imageUrl: '/api/placeholder/300/200',
          isActive: false,
          itemCount: 29,
          createdAt: '2024-01-22',
          updatedAt: '2024-01-27'
        },
        {
          id: 9,
          name: '水上乐园',
          slug: 'water-park',
          description: '水滑梯和水上游乐设施',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 26,
          createdAt: '2024-01-23',
          updatedAt: '2024-01-28'
        },
        {
          id: 10,
          name: '动物王国',
          slug: 'animal-kingdom',
          description: '野生动物和自然保护区主题',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 51,
          createdAt: '2024-01-24',
          updatedAt: '2024-01-29'
        },
        {
          id: 11,
          name: '欢乐谷',
          slug: 'happy-valley',
          description: '过山车和刺激游乐设施',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 33,
          createdAt: '2024-01-25',
          updatedAt: '2024-01-30'
        },
        {
          id: 12,
          name: '梦幻乐园',
          slug: 'dreamland',
          description: '彩虹和独角兽主题',
          imageUrl: '/api/placeholder/300/200',
          isActive: true,
          itemCount: 44,
          createdAt: '2024-01-26',
          updatedAt: '2024-01-31'
        }
      ];

      setThemeParks(mockThemeParks);
      setFilteredThemeParks(mockThemeParks);
      setIsLoading(false);
    };

    loadThemeParks();
  }, []);

  // 搜索过滤
  useEffect(() => {
    const filtered = themeParks.filter(park =>
      park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      park.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredThemeParks(filtered);
    setCurrentPage(1);
  }, [searchTerm, themeParks]);

  // 分页计算
  const totalPages = Math.ceil(filteredThemeParks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParks = filteredThemeParks.slice(startIndex, startIndex + itemsPerPage);

  const handleAddPark = () => {
    setEditingPark(null);
    setIsModalOpen(true);
  };

  const handleEditPark = (park: ThemePark) => {
    setEditingPark(park);
    setIsModalOpen(true);
  };

  const handleDeletePark = (parkId: number) => {
    if (confirm('确定要删除这个主题公园吗？此操作不可撤销。')) {
      setThemeParks(prev => prev.filter(park => park.id !== parkId));
    }
  };

  const handleToggleActive = (parkId: number) => {
    setThemeParks(prev => prev.map(park => 
      park.id === parkId ? { ...park, isActive: !park.isActive } : park
    ));
  };

  const handleSavePark = (parkData: Omit<ThemePark, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPark) {
      // 编辑现有主题公园
      setThemeParks(prev => prev.map(park => 
        park.id === editingPark.id 
          ? { 
              ...park, 
              ...parkData, 
              updatedAt: new Date().toISOString().split('T')[0] 
            }
          : park
      ));
    } else {
      // 添加新主题公园
      const newPark: ThemePark = {
        id: themeParks.length > 0 ? Math.max(...themeParks.map(p => p.id)) + 1 : 1,
        ...parkData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setThemeParks(prev => [...prev, newPark]);
    }
    setIsModalOpen(false);
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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">主题公园管理</h1>
                <p className="mt-2 text-gray-600">管理主题公园分类和内容</p>
              </div>
              <button
                onClick={handleAddPark}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>添加主题公园</span>
              </button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索主题公园..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              共 {filteredThemeParks.length} 个主题公园
            </div>
          </div>

          {/* Theme parks grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedParks.map((park) => (
              <div key={park.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={park.imageUrl}
                    alt={park.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      park.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {park.isActive ? '启用' : '禁用'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{park.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{park.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      <span>{park.itemCount} 项目</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{park.updatedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(park.id)}
                      className={`text-sm px-3 py-1 rounded-full ${
                        park.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {park.isActive ? '禁用' : '启用'}
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPark(park)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePark(park.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredThemeParks.length)} 条，
                共 {filteredThemeParks.length} 条记录
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
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ThemeParkModal
          park={editingPark}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePark}
        />
      )}
    </AdminLayout>
  );
}

// Theme Park Modal Component
interface ThemeParkModalProps {
  park: ThemePark | null;
  onClose: () => void;
  onSave: (park: Omit<ThemePark, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function ThemeParkModal({ park, onClose, onSave }: ThemeParkModalProps) {
  const [formData, setFormData] = useState({
    name: park?.name || '',
    slug: park?.slug || '',
    description: park?.description || '',
    imageUrl: park?.imageUrl || '',
    isActive: park?.isActive ?? true,
    itemCount: park?.itemCount || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('请填写主题公园名称和标识符');
      return;
    }

    onSave(formData);
  };

  const generateSlug = (name: string) => {
    return name
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
            {park ? '编辑主题公园' : '添加主题公园'}
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
              主题公园名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  name,
                  slug: prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="输入主题公园名称"
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
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="theme-park-slug"
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
              placeholder="输入主题公园描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              封面图片URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              项目数量
            </label>
            <input
              type="number"
              value={formData.itemCount}
              onChange={(e) => setFormData(prev => ({ ...prev, itemCount: parseInt(e.target.value) || 0 }))}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
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
              启用此主题公园
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