'use client';

import { Palette, Globe, User } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  // 模拟用户登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 预设的用户头像
  const userAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  ];
  
  // 使用固定头像避免水合错误（实际项目中这应该来自用户数据）
  const currentUserAvatar = userAvatars[0];
  
  const handleAuthClick = () => {
    if (isLoggedIn) {
      // 如果已登录，可以显示用户菜单或执行登出操作
      console.log('显示用户菜单');
    } else {
      // 如果未登录，执行登录操作
      setIsLoggedIn(true);
      console.log('执行登录操作');
    }
  };
  return (
    <header className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#fcfcf8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Palette className="h-8 w-8 text-yellow-400" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Coloring Pages
            </span>
          </Link>

          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-900 hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
              Categories
            </Link>
            <Link href="/ai-generator" className="text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
              AI Generator
            </Link>
            <a href="#" className="text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
              Blog
            </a>
          </nav>

          {/* 右侧按钮 */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-gray-600 text-sm">
              <Globe className="h-4 w-4 mr-1" />
              <span>EN</span>
            </div>
            
            {/* 用户头像 */}
            <button 
              onClick={handleAuthClick}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105"
            >
              {isLoggedIn ? (
                // 已登录：显示用户头像
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400 hover:border-yellow-500 transition-colors">
                  <Image
                    src={currentUserAvatar}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                // 未登录：显示灰色人头像
                <div className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              )}
            </button>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}