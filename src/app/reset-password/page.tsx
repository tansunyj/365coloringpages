'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// API 基础 URL
const API_BASE_URL = 'http://localhost:3001';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [mode, setMode] = useState<'request' | 'reset'>('request'); // 新增：区分请求重置和重置密码两种模式
  const [emailSent, setEmailSent] = useState(false); // 新增：标记邮件是否已发送

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setMode('reset'); // 有token，进入重置密码模式
    } else {
      setMode('request'); // 无token，进入请求重置模式
      setIsTokenValid(true); // 重置标志，因为在请求模式下不需要验证token
    }
  }, [searchParams]);

  // 请求重置密码（发送邮件）
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setEmailSent(true);
      setSuccessMessage('Password reset link has been sent to your email. Please check your inbox!');
    } catch (err) {
      setError((err as Error).message || 'Failed to send reset email, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // 重置密码（使用token）
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid password reset token');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Password reset failed');
      }

      setSuccessMessage(data.message || 'Password reset successful! Redirecting to homepage...');
      
      // 延迟跳转到首页
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError((err as Error).message || 'Password reset failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染请求重置密码界面（输入邮箱）
  const renderRequestResetForm = () => {
    if (emailSent) {
      return (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h3>
            <p className="text-gray-600 mb-2">
              We&apos;ve sent a password reset link to
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-6">{email}</p>
            <p className="text-sm text-gray-500 mb-8">
              Please check your inbox and click the link to reset your password.
              <br />
              If you don&apos;t see the email, check your spam folder.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      );
    }

    return (
      <>
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {/* 错误和成功消息 */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        {/* 表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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

          {/* 返回首页链接 */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              disabled={isLoading}
            >
              Back to Home
            </button>
          </div>
        </form>
      </>
    );
  };

  // 渲染重置密码界面（输入新密码）
  const renderResetPasswordForm = () => (
    <>
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      {/* 错误和成功消息 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-600 text-sm">{successMessage}</span>
        </div>
      )}

      {/* 表单 */}
      <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
        <div className="space-y-4">
          {/* 新密码 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              disabled={isLoading || !!successMessage}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* 确认密码 */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={isLoading || !!successMessage}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading || !!successMessage}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Resetting...
            </>
          ) : successMessage ? (
            'Password Reset Successfully ✓'
          ) : (
            'Reset Password'
          )}
        </button>

        {/* 返回首页链接 */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
            disabled={isLoading}
          >
            Back to Home
          </button>
        </div>
      </form>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {mode === 'request' ? renderRequestResetForm() : renderResetPasswordForm()}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

