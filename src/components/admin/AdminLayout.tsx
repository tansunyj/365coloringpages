'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Flag,
  Palette,
  BookOpen,
  Upload,
  Tag
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 检查管理员登录状态
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      router.push('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(user));
    } catch {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const navigation = [
    { name: '仪表板', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: '内容管理', href: '/admin/content', icon: FolderOpen, children: [
      { name: '分类管理', href: '/admin/content/categories', icon: FolderOpen },
      { name: '主题公园', href: '/admin/content/theme-parks', icon: Palette },
      { name: '第一本涂色书', href: '/admin/content/first-coloring', icon: BookOpen },
      { name: 'Banner设置', href: '/admin/content/banners', icon: ImageIcon },
      { name: '热门关键词', href: '/admin/content/keywords', icon: Flag },
    ]},
    { name: '图片管理', href: '/admin/images', icon: ImageIcon },
    { name: '用户管理', href: '/admin/users', icon: Users },
  ];

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">验证管理员权限...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} pathname={pathname} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} pathname={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex lg:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="block w-full pl-8 pr-3 py-2 text-gray-900 placeholder-gray-500">
                    管理员控制台
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center lg:ml-6">
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{adminUser.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

// Sidebar content component
function SidebarContent({ navigation, pathname }: { navigation: NavigationItem[], pathname: string }) {
  return (
    <div className="flex flex-col h-0 flex-1 bg-gray-800">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Shield className="h-8 w-8 text-orange-400" />
          <span className="ml-2 text-white text-lg font-semibold">管理员系统</span>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </Link>
              {item.children && (
                <div className="ml-8 space-y-1">
                  {item.children.map((child: NavigationItem) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={`${
                        pathname === child.href
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      } group flex items-center px-2 py-2 text-xs font-medium rounded-md`}
                    >
                      <child.icon className="mr-2 h-4 w-4" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
} 