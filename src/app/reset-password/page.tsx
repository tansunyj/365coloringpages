'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// API 基础 URL
const API_BASE_URL = 'http://localhost:3001';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setIsTokenValid(false);
      setError('无效的重置密码链接');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('无效的重置密码令牌');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为 6 个字符');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
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
        throw new Error(data.message || '重置密码失败');
      }

      setSuccessMessage(data.message || '密码重置成功！正在跳转到首页...');
      
      // 延迟跳转到首页
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError((err as Error).message || '重置密码失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {/* 标题 */}
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        {!isTokenValid ? (
          <div className="text-center">
            <div className="mb-4 text-6xl">❌</div>
            <p className="text-red-600 text-sm mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              返回首页
            </button>
          </div>
        ) : (
          <>
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
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
        )}
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

