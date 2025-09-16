'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FolderOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Image as ImageIcon,
  Eye
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // 模拟数据加载
  useEffect(() => {
    const loadCategories = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCategories: Category[] = [
        {
          id: 1,
          name: '动物',
          slug: 'animals',
          description: '各种动物的涂色页面',
          imageCount: 245,
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          name: '自然',
          slug: 'nature',
          description: '花朵、树木、风景等自然主题',
          imageCount: 189,
          isActive: true,
          createdAt: '2024-01-02'
        },
        {
          id: 3,
          name: '幻想',
          slug: 'fantasy',
          description: '独角兽、龙、魔法等幻想主题',
          imageCount: 156,
          isActive: true,
          createdAt: '2024-01-03'
        },
        {
          id: 4,
          name: '交通工具',
          slug: 'vehicles',
          description: '汽车、飞机、船只等交通工具',
          imageCount: 98,
          isActive: false,
          createdAt: '2024-01-04'
        },
        {
          id: 5,
          name: '食物',
          slug: 'food',
          description: '水果、蔬菜、甜点等美食主题',
          imageCount: 134,
          isActive: true,
          createdAt: '2024-01-05'
        },
        {
          id: 6,
          name: '节日',
          slug: 'holidays',
          description: '圣诞节、万圣节等节日主题',
          imageCount: 87,
          isActive: true,
          createdAt: '2024-01-06'
        },
        {
          id: 7,
          name: '图案',
          slug: 'patterns',
          description: '几何图案、曼陀罗等装饰图案',
          imageCount: 76,
          isActive: true,
          createdAt: '2024-01-07'
        },
        {
          id: 8,
          name: '花朵',
          slug: 'flowers',
          description: '玫瑰、向日葵等各种花朵',
          imageCount: 112,
          isActive: true,
          createdAt: '2024-01-08'
        },
        {
          id: 9,
          name: '角色',
          slug: 'characters',
          description: '卡通人物、超级英雄等角色',
          imageCount: 203,
          isActive: true,
          createdAt: '2024-01-09'
        },
        {
          id: 10,
          name: '建筑',
          slug: 'architecture',
          description: '城堡、房屋、桥梁等建筑主题',
          imageCount: 65,
          isActive: false,
          createdAt: '2024-01-10'
        },
        {
          id: 11,
          name: '运动',
          slug: 'sports',
          description: '足球、篮球、游泳等运动主题',
          imageCount: 54,
          isActive: true,
          createdAt: '2024-01-11'
        },
        {
          id: 12,
          name: '海洋',
          slug: 'ocean',
          description: '鱼类、珊瑚、海洋生物等',
          imageCount: 91,
          isActive: true,
          createdAt: '2024-01-12'
        }
      ];
      
      setCategories(mockCategories);
      setIsLoading(false);
    };

    loadCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 分页计算
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // 搜索时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAddCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Math.max(...categories.map(c => c.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCategories([...categories, newCategory]);
    setShowAddModal(false);
  };

  const handleEditCategory = (categoryData: Category) => {
    setCategories(categories.map(cat => 
      cat.id === categoryData.id ? categoryData : cat
    ));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm('确定要删除这个分类吗？这将影响该分类下的所有图片。')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const toggleCategoryStatus = (categoryId: number) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
              <p className="mt-2 text-gray-600">管理涂色页面的分类</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加分类
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索分类..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCategories.map((category) => (
              <div key={category.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FolderOpen className="h-8 w-8 text-orange-600" />
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">/{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? '启用' : '禁用'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ImageIcon className="h-4 w-4 mr-1" />
                    {category.imageCount} 张图片
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 inline mr-1" />
                      编辑
                    </button>
                    <button
                      onClick={() => toggleCategoryStatus(category.id)}
                      className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                        category.isActive
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {category.isActive ? '禁用' : '启用'}
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到分类</h3>
              <p className="text-gray-500">尝试调整搜索条件</p>
            </div>
          )}

          {/* Pagination */}
          {filteredCategories.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCategories.length)} 条，
                共 {filteredCategories.length} 条记录
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

      {/* Add/Edit Modal */}
      {(showAddModal || editingCategory) && (
        <CategoryModal
          category={editingCategory}
          onSave={(categoryData) => {
            if (editingCategory) {
              handleEditCategory(categoryData as Category);
            } else {
              handleAddCategory(categoryData as Omit<Category, 'id' | 'createdAt'>);
            }
          }}
          onCancel={() => {
            setShowAddModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

// Category Modal Component
function CategoryModal({ 
  category, 
  onSave, 
  onCancel 
}: { 
  category: Category | null;
  onSave: (category: Omit<Category, 'id' | 'createdAt'> | Category) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    isActive: category?.isActive ?? true,
    imageCount: category?.imageCount || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (category) {
      onSave({ ...category, ...formData });
    } else {
      onSave(formData);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {category ? '编辑分类' : '添加分类'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类名称
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name)
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL别名
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                启用分类
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                {category ? '更新' : '创建'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 