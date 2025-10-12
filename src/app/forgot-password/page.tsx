'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟发送重置密码邮件
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
        <Header />
        
        <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h1>
                <p className="text-gray-600">
                  We&apos;ve sent a password reset link to <span className="font-medium">{email}</span>
                </p>
              </div>
              
              <Link 
                href="/login" 
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* 标题部分 */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {/* 重置密码表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 邮箱输入框 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* 发送重置链接按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {/* 返回登录链接 */}
              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Back to Login
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