'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      setIsLoading(false);
      // 这里可以添加实际的登录逻辑
      // 成功后跳转到首页
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* 登录表单容器 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* 标题部分 */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600">
                Log in to continue to your coloring world.
              </p>
            </div>

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 邮箱/用户名输入框 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* 密码输入�?*/}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* 忘记密码链接 */}
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>

              {/* 注册链接 */}
              <div className="text-center">
                <span className="text-gray-600">Don&apos;t have an account? </span>
                <Link 
                  href="/signup" 
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 