'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, 
  Ban, 
  CheckCircle, 
  Mail, 
  Calendar,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  UserX,
  UserCheck
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  joinDate: string;
  status: 'active' | 'banned' | 'suspended';
  totalUploads: number;
  totalViews: number;
  lastActive: string;
  reports: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 模拟数据加载
  useEffect(() => {
    const loadUsers = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = Array.from({ length: 50 }, (_, index) => {
        const statuses: ('active' | 'banned' | 'suspended')[] = ['active', 'banned', 'suspended'];
        const names = [
          'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Wilson', 'Eva Davis',
          'Frank Miller', 'Grace Lee', 'Henry Zhang', 'Ivy Chen', 'Jack Taylor',
          'Kate Williams', 'Leo Garcia', 'Mia Rodriguez', 'Noah Martinez', 'Olivia Anderson',
          'Paul Thompson', 'Quinn White', 'Ruby Jackson', 'Sam Harris', 'Tina Clark'
        ];
        
        const id = index + 1;
        const status = statuses[index % statuses.length];
        const name = names[index % names.length] + (index > 19 ? ` ${Math.floor(index / 20) + 1}` : '');
        const joinDate = new Date(2024, 0, 1 + (index % 30));
        const lastActiveDate = new Date(2024, 0, 15 + (index % 15));
        
        return {
          id,
          email: `user${id}@email.com`,
          name,
          avatar: `/api/placeholder/40/40?id=${id}`,
          joinDate: joinDate.toISOString().split('T')[0],
          status,
          totalUploads: Math.floor(Math.random() * 200) + 1,
          totalViews: Math.floor(Math.random() * 10000) + 50,
          lastActive: lastActiveDate.toISOString().split('T')[0],
          reports: status === 'banned' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 3)
        };
      });
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  // 过滤和搜索
  useEffect(() => {
    let filtered = users;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, statusFilter, searchTerm]);

  // 分页计算
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // 搜索或筛选时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const handleBanUser = (userId: number) => {
    if (confirm('确定要封禁这个用户吗？')) {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: 'banned' } : user
      ));
    }
  };

  const handleUnbanUser = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
  };

  const handleSuspendUser = (userId: number) => {
    if (confirm('确定要暂停这个用户吗？')) {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: 'suspended' } : user
      ));
    }
  };

  const handleBatchAction = (action: 'ban' | 'unban' | 'suspend') => {
    if (selectedUsers.length === 0) return;

    const actionText = {
      ban: '封禁',
      unban: '解封',
      suspend: '暂停'
    };

    if (!confirm(`确定要${actionText[action]}选中的 ${selectedUsers.length} 个用户吗？`)) return;

    const newStatus = action === 'ban' ? 'banned' : action === 'unban' ? 'active' : 'suspended';
    
    setUsers(prev => prev.map(user => 
      selectedUsers.includes(user.id) ? { ...user, status: newStatus } : user
    ));
    
    setSelectedUsers([]);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      banned: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: '正常',
      banned: '已封禁',
      suspended: '已暂停'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
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
            <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
            <p className="mt-2 text-gray-600">管理注册用户，处理违规行为</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索用户邮箱或姓名..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">所有状态</option>
                    <option value="active">正常用户</option>
                    <option value="suspended">已暂停</option>
                    <option value="banned">已封禁</option>
                  </select>
                </div>
              </div>

              {/* Batch Actions */}
              {selectedUsers.length > 0 && (
                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    已选择 {selectedUsers.length} 个用户
                  </span>
                  <button
                    onClick={() => handleBatchAction('unban')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    批量解封
                  </button>
                  <button
                    onClick={() => handleBatchAction('suspend')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                  >
                    <Ban className="w-4 h-4 mr-1" />
                    批量暂停
                  </button>
                  <button
                    onClick={() => handleBatchAction('ban')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    批量封禁
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(user => user.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    上传/浏览
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后活跃
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    举报
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{user.totalUploads} 上传</div>
                      <div className="text-gray-500">{user.totalViews.toLocaleString()} 浏览</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.reports > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {user.reports} 次
                        </span>
                      ) : (
                        <span className="text-gray-400">无</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.status === 'banned' ? (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                            title="解封用户"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="暂停用户"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleBanUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="封禁用户"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到用户</h3>
              <p className="text-gray-500">尝试调整搜索条件或过滤器</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} 条，
                共 {filteredUsers.length} 条记录
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
    </AdminLayout>
  );
} 