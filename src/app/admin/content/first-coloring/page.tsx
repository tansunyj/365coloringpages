'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Image as ImageIcon,
  Eye,
  X,
  Save
} from 'lucide-react';

interface FirstColoringCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageCount: number;
  isActive: boolean;
  targetAge: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export default function AdminFirstColoring() {
  const [categories, setCategories] = useState<FirstColoringCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FirstColoringCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // 模拟数据加载
  useEffect(() => {
    const loadCategories = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCategories: FirstColoringCategory[] = [
        {
          id: 1,
          name: '基础形状',
          slug: 'basic-shapes',
          description: '简单的圆形、方形、三角形等基础形状',
          imageCount: 25,
          isActive: true,
          targetAge: '3-5岁',
          difficulty: 'easy',
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          name: '数字学习',
          slug: 'numbers',
          description: '1-10数字认知和涂色',
          imageCount: 18,
          isActive: true,
          targetAge: '4-6岁',
          difficulty: 'easy',
          createdAt: '2024-01-02'
        },
        {
          id: 3,
          name: '字母认知',
          slug: 'letters',
          description: 'A-Z字母学习涂色页',
          imageCount: 32,
          isActive: true,
          targetAge: '5-7岁',
          difficulty: 'medium',
          createdAt: '2024-01-03'
        },
        {
          id: 4,
          name: '简单动物',
          slug: 'simple-animals',
          description: '可爱的简笔画动物',
          imageCount: 28,
          isActive: true,
          targetAge: '3-6岁',
          difficulty: 'easy',
          createdAt: '2024-01-04'
        },
        {
          id: 5,
          name: '水果蔬菜',
          slug: 'fruits-vegetables',
          description: '常见水果和蔬菜涂色',
          imageCount: 22,
          isActive: true,
          targetAge: '4-7岁',
          difficulty: 'medium',
          createdAt: '2024-01-05'
        },
        {
          id: 6,
          name: '情感表达',
          slug: 'emotions',
          description: '开心、难过等情感表情',
          imageCount: 15,
          isActive: true,
          targetAge: '5-8岁',
          difficulty: 'medium',
          createdAt: '2024-01-06'
        },
        {
          id: 7,
          name: '颜色认知',
          slug: 'colors',
          description: '各种颜色的学习和识别',
          imageCount: 20,
          isActive: true,
          targetAge: '3-5岁',
          difficulty: 'easy',
          createdAt: '2024-01-07'
        },
        {
          id: 8,
          name: '趣味图案',
          slug: 'fun-patterns',
          description: '简单有趣的图案设计',
          imageCount: 30,
          isActive: false,
          targetAge: '6-8岁',
          difficulty: 'hard',
          createdAt: '2024-01-08'
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

  const handleAddCategory = (categoryData: Omit<FirstColoringCategory, 'id' | 'createdAt'>) => {
    const newCategory: FirstColoringCategory = {
      ...categoryData,
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCategories(prev => [...prev, newCategory]);
    setShowAddModal(false);
  };

  const handleEditCategory = (categoryData: FirstColoringCategory) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryData.id ? categoryData : cat
    ));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm('确定要删除这个分类吗？此操作不可撤销。')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleToggleActive = (categoryId: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">第一本涂色书管理</h1>
                <p className="mt-2 text-gray-600">管理儿童启蒙涂色分类</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>添加分类</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                      <BookOpen className="h-8 w-8 text-orange-600" />
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">/{category.slug}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? '启用' : '禁用'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      <span>{category.imageCount} 张图片</span>
                    </div>
                    <div className="text-blue-600">
                      {category.targetAge}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(category.difficulty)}`}>
                      {getDifficultyText(category.difficulty)}
                    </span>
                    <span className="text-xs text-gray-500">{category.createdAt}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(category.id)}
                      className={`text-sm px-3 py-1 rounded-full ${
                        category.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {category.isActive ? '禁用' : '启用'}
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到分类</h3>
              <p className="text-gray-500">尝试调整搜索条件</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
        <FirstColoringModal
          category={editingCategory}
          onSave={(categoryData) => {
            if (editingCategory) {
              handleEditCategory(categoryData as FirstColoringCategory);
            } else {
              handleAddCategory(categoryData as Omit<FirstColoringCategory, 'id' | 'createdAt'>);
            }
          }}
          onClose={() => {
            setShowAddModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

// First Coloring Modal Component
interface FirstColoringModalProps {
  category: FirstColoringCategory | null;
  onClose: () => void;
  onSave: (category: Omit<FirstColoringCategory, 'id' | 'createdAt'> | FirstColoringCategory) => void;
}

function FirstColoringModal({ category, onClose, onSave }: FirstColoringModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    imageCount: category?.imageCount || 0,
    isActive: category?.isActive ?? true,
    targetAge: category?.targetAge || '3-5岁',
    difficulty: category?.difficulty || 'easy' as 'easy' | 'medium' | 'hard'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('请填写分类名称和标识符');
      return;
    }

    if (category) {
      // 编辑模式
      onSave({
        ...category,
        ...formData
      });
    } else {
      // 添加模式
      onSave(formData);
    }
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
            {category ? '编辑分类' : '添加分类'}
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
              分类名称 *
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
              placeholder="输入分类名称"
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
              placeholder="category-slug"
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
              placeholder="输入分类描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标年龄
            </label>
            <select
              value={formData.targetAge}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAge: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="3-5岁">3-5岁</option>
              <option value="4-6岁">4-6岁</option>
              <option value="5-7岁">5-7岁</option>
              <option value="6-8岁">6-8岁</option>
              <option value="3-6岁">3-6岁</option>
              <option value="4-7岁">4-7岁</option>
              <option value="5-8岁">5-8岁</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              难度级别
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              图片数量
            </label>
            <input
              type="number"
              value={formData.imageCount}
              onChange={(e) => setFormData(prev => ({ ...prev, imageCount: parseInt(e.target.value) || 0 }))}
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
              启用此分类
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