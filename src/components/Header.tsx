'use client';

import { Palette, User, Heart, Download, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LoginDialog from './LoginDialog';
import SignupDialog from './SignupDialog';
import { languageNames, locales, type Locale } from '@/i18n/config';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  // 国际化
  const { locale: currentLocale, changeLanguage: switchLanguage } = useTranslation();
  
  // 模拟用户登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentUserAvatar, setCurrentUserAvatar] = useState('');
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

  // 监听来自个人资料页面的用户状态更新
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      setIsLoggedIn(event.detail.isLoggedIn);
      setCurrentUserAvatar(event.detail.userAvatar);
    };

    const handleUserLogout = () => {
      setIsLoggedIn(false);
      setCurrentUserAvatar('');
    };

    const handleAvatarUpdate = (event: CustomEvent) => {
      setCurrentUserAvatar(event.detail.userAvatar);
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
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    setCurrentUserAvatar('');
    console.log('用户已登出');
  };

  // 处理登录成功
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginDialogOpen(false);
    setCurrentUserAvatar(userAvatars[0]); // 设置默认头像
    console.log('登录成功');
  };

  // 处理注册成功
  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
    setIsSignupDialogOpen(false);
    setCurrentUserAvatar(userAvatars[0]); // 设置默认头像
    console.log('注册成功');
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

              {/* 用户菜单下拉框 */}
              {isLoggedIn && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push('/profile');
                    }}
                    className="w-full flex items-start gap-3 px-4 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">用户账户</p>
                      <p className="text-sm text-gray-500">user@example.com</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      console.log('我的收藏');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    我的收藏
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      console.log('我的下载');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    我的下载
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push('/profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    账户设置
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    退出登录
                  </button>
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

      {/* 登录对话框 */}
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginDialogOpen(false);
          setIsSignupDialogOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 注册对话框 */}
      <SignupDialog
        isOpen={isSignupDialogOpen}
        onClose={() => setIsSignupDialogOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupDialogOpen(false);
          setIsLoginDialogOpen(true);
        }}
        onSignupSuccess={handleSignupSuccess}
      />
    </header>
  );
}