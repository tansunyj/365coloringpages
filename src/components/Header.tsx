'use client';

import { Palette, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LoginDialog from './LoginDialog';
import { languageNames, locales, type Locale } from '@/i18n/config';
import { useTranslation } from '@/hooks/useTranslation';
import { API_ENDPOINTS } from '@/lib/apiConfig';

export default function Header() {
  // 国际化
  const { locale: currentLocale, changeLanguage: switchLanguage } = useTranslation();
  
  // 模拟用户登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentUserAvatar, setCurrentUserAvatar] = useState('');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  
  // 预设的用户头像
  const userAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  ];

  // 检查登录状态的函数（提取出来以便复用）
  const checkLoginStatus = () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const userInfoStr = localStorage.getItem('userInfo');
    
    console.log('🔍 检查登录状态:', { 
      hasToken: !!token, 
      hasUserInfo: !!userInfoStr,
      pathname: pathname,
      token: token?.substring(0, 20) + '...'
    });
    
    if (token && userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        console.log('✅ 恢复用户信息:', {
          email: userInfo.email,
          hasAvatar: !!userInfo.avatar,
          name: userInfo.name
        });
        
        setIsLoggedIn(true);
        // 如果有头像就使用用户头像，否则使用默认头像
        setCurrentUserAvatar(userInfo.avatar || userAvatars[0]);
        // 设置用户邮箱
        setUserEmail(userInfo.email || 'user@example.com');
      } catch (error) {
        console.error('❌ 解析用户信息失败:', error);
        // 清除损坏的数据
        localStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        setCurrentUserAvatar('');
      }
    } else {
      console.log('⚠️ 未找到登录信息');
      setIsLoggedIn(false);
      setCurrentUserAvatar('');
    }
  };

  // 初始化时检查登录状态
  useEffect(() => {
    checkLoginStatus();
    
    // 监听storage事件（跨标签页同步）
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // 路由变化时重新检查登录状态
  useEffect(() => {
    console.log('🔄 路由变化，重新检查登录状态');
    checkLoginStatus();
  }, [pathname]);

  // 监听来自个人资料页面的用户状态更新
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      console.log('🔐 收到登录事件:', event.detail);
      setIsLoggedIn(event.detail.isLoggedIn);
      setCurrentUserAvatar(event.detail.userAvatar);
      // 同时重新检查 localStorage 以确保获取最新的用户信息（包括邮箱）
      checkLoginStatus();
    };

    const handleUserLogout = () => {
      setIsLoggedIn(false);
      setCurrentUserAvatar('');
      // 清除localStorage中的认证信息
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('authProvider');
    };

    const handleAvatarUpdate = (event: CustomEvent) => {
      console.log('📸 收到头像更新事件:', event.detail);
      if (event.detail.avatar) {
        setCurrentUserAvatar(event.detail.avatar);
      } else if (event.detail.userAvatar) {
        setCurrentUserAvatar(event.detail.userAvatar);
      }
      // 同时重新检查 localStorage 以确保数据同步
      checkLoginStatus();
    };

    // 添加事件监听器
    window.addEventListener('userLogin', handleUserLogin as EventListener);
    window.addEventListener('userLogout', handleUserLogout);
    window.addEventListener('userAvatarUpdate', handleAvatarUpdate as EventListener);

    return () => {
      // 清理事件监听器
      window.removeEventListener('userLogin', handleUserLogin as EventListener);
      window.removeEventListener('userLogout', handleUserLogout);
      window.removeEventListener('userAvatarUpdate', handleAvatarUpdate as EventListener);
    };
  }, []);

  // 使用默认头像作为后备
  const displayAvatar = currentUserAvatar || userAvatars[0];
  
  const handleAuthClick = () => {
    if (isLoggedIn) {
      // 如果已登录，切换用户菜单显示状态
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      // 如果未登录，打开登录对话框
      setIsLoginDialogOpen(true);
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (token) {
        // 调用后端退出接口
        await fetch(API_ENDPOINTS.PUBLIC.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('退出登录失败:', error);
    } finally {
      // 无论后端调用是否成功，都清除本地存储
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      setCurrentUserAvatar('');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('authProvider');
      localStorage.removeItem('token');
    }
  };

  // 处理登录成功
  const handleLoginSuccess = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (token) {
      try {
        // 获取用户信息（使用正确的API接口）
        const response = await fetch(API_ENDPOINTS.PUBLIC.USER.ME, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            localStorage.setItem('authToken', token);
            setCurrentUserAvatar(data.data.avatar || userAvatars[0]);
            setUserEmail(data.data.email || 'user@example.com');
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        setCurrentUserAvatar(userAvatars[0]);
      }
    }
    
    setIsLoggedIn(true);
    setIsLoginDialogOpen(false);
  };

  // 语言切换函数
  const handleLanguageChange = (locale: Locale) => {
    switchLanguage(locale);
    setIsLanguageMenuOpen(false);
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isUserMenuOpen || isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isLanguageMenuOpen]);

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
            <Link href="/blog" className="text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
              Blog
            </Link>
          </nav>

          {/* 右侧按钮 */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 语言选择器 */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                <Image
                  src={languageNames[currentLocale].flagPath}
                  alt={`${languageNames[currentLocale].nativeName} flag`}
                  width={16}
                  height={12}
                  className="mr-2 rounded-sm"
                />
                <span>{languageNames[currentLocale].nativeName}</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>

              {/* 语言下拉菜单 */}
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => handleLanguageChange(locale)}
                      className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                        currentLocale === locale ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      <Image
                        src={languageNames[locale].flagPath}
                        alt={`${languageNames[locale].nativeName} flag`}
                        width={24}
                        height={18}
                        className="mr-3 rounded-sm flex-shrink-0"
                      />
                      <div className="flex flex-col items-start flex-grow">
                        <span className="font-medium">{languageNames[locale].nativeName}</span>
                        <span className="text-xs text-gray-500">{languageNames[locale].name}</span>
                      </div>
                      {currentLocale === locale && (
                        <span className="ml-auto text-orange-600 text-lg">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 用户头像 */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleAuthClick}
                className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105"
              >
                {isLoggedIn ? (
                  // 已登录：显示用户头像
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400 hover:border-yellow-500 transition-colors">
                    <Image
                      src={displayAvatar}
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

              {/* 用户菜单下拉框 - 优化版 */}
              {isLoggedIn && isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                  {/* 用户信息卡片 */}
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 px-5 py-4 border-b border-orange-100">
                    <div className="flex items-center gap-4">
                      {/* 用户头像 */}
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow-md flex-shrink-0">
                        <Image
                          src={displayAvatar}
                          alt="User Avatar"
                          width={56}
                          height={56}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      {/* 用户信息 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {userEmail.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-600 truncate" title={userEmail}>
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 菜单项 */}
                  <div className="py-2">
                    {/* 个人主页 */}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        router.push('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <User className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Personal Profile
                      </span>
                    </button>

                    {/* 分隔线 */}
                    <div className="my-2 border-t border-gray-100"></div>

                    {/* 退出登录 */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-red-600 group-hover:text-red-700">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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

      {/* 登录/注册对话框（二合一） */}
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
}