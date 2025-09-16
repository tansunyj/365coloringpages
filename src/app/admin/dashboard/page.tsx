'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, 
  Image as ImageIcon, 
  FolderOpen, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalImages: number;
  totalCategories: number;
  pendingReviews: number;
  todayViews: number;
  monthlyGrowth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalImages: 0,
    totalCategories: 0,
    pendingReviews: 0,
    todayViews: 0,
    monthlyGrowth: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'user_register', message: '新用户注册: user123@email.com', time: '2分钟前' },
    { id: 2, type: 'image_upload', message: '新图片上传: 独角兽涂色页', time: '5分钟前' },
    { id: 3, type: 'report', message: '用户举报: 不当内容', time: '10分钟前' },
    { id: 4, type: 'admin_action', message: '管理员审核通过5张图片', time: '15分钟前' },
  ]);

  // 模拟数据加载
  useEffect(() => {
    const loadStats = async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 15420,
        totalImages: 8930,
        totalCategories: 25,
        pendingReviews: 47,
        todayViews: 2340,
        monthlyGrowth: 12.5
      });
    };

    loadStats();
  }, []);

  const statCards = [
    {
      name: '总用户数',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      name: '总图片数',
      value: stats.totalImages.toLocaleString(),
      icon: ImageIcon,
      color: 'bg-green-500',
      change: '+15.3%',
      changeType: 'positive'
    },
    {
      name: '待审核',
      value: stats.pendingReviews.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-5.1%',
      changeType: 'negative'
    },
    {
      name: '今日访问',
      value: stats.todayViews.toLocaleString(),
      icon: Eye,
      color: 'bg-purple-500',
      change: '+23.1%',
      changeType: 'positive'
    }
  ];

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">管理员仪表板</h1>
            <p className="mt-2 text-gray-600">365 Coloring Pages 网站数据概览</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((card) => (
              <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${card.color} p-3 rounded-lg`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {card.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {card.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {card.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  最近活动
                </h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivities.map((activity, index) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {index !== recentActivities.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                activity.type === 'user_register' ? 'bg-blue-500' :
                                activity.type === 'image_upload' ? 'bg-green-500' :
                                activity.type === 'report' ? 'bg-red-500' : 'bg-gray-500'
                              }`}>
                                {activity.type === 'user_register' && <Users className="h-4 w-4 text-white" />}
                                {activity.type === 'image_upload' && <ImageIcon className="h-4 w-4 text-white" />}
                                {activity.type === 'report' && <AlertTriangle className="h-4 w-4 text-white" />}
                                {activity.type === 'admin_action' && <CheckCircle className="h-4 w-4 text-white" />}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">{activity.message}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  快速操作
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <ImageIcon className="h-8 w-8 text-orange-600" />
                    <div className="ml-4 text-left">
                      <p className="text-sm font-medium text-gray-900">审核图片</p>
                      <p className="text-sm text-gray-500">{stats.pendingReviews} 张图片待审核</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4 text-left">
                      <p className="text-sm font-medium text-gray-900">用户管理</p>
                      <p className="text-sm text-gray-500">管理注册用户</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <FolderOpen className="h-8 w-8 text-green-600" />
                    <div className="ml-4 text-left">
                      <p className="text-sm font-medium text-gray-900">内容管理</p>
                      <p className="text-sm text-gray-500">管理分类和内容</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div className="ml-4 text-left">
                      <p className="text-sm font-medium text-gray-900">举报处理</p>
                      <p className="text-sm text-gray-500">处理用户举报</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 