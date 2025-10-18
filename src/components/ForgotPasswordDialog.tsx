'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchWithIP } from '@/lib/clientIP';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// API 基础 URL
const API_BASE_URL = 'http://localhost:3001';

export default function ForgotPasswordDialog({ isOpen, onClose }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC键关闭对话框
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // 重置状�?
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setError(null);
      setSuccessMessage(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchWithIP(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '发送重置邮件失�?);
      }

      setSuccessMessage(data.message || '重置密码链接已发送到您的邮箱，有效期3�?);
      
      // 3秒后关闭对话�?
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError((err as Error).message || '发送重置邮件失败，请重�?);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 对话框容�?*/}
      <div className="flex min-h-full items-start justify-center p-4 pt-36">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all border border-gray-300">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* 对话框内�?*/}
          <div className="p-8">
            {/* 标题部分 */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reset Password
              </h2>
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* 错误和成功消�?*/}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <span className="text-green-600 text-sm">{successMessage}</span>
              </div>
            )}

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 邮箱输入�?*/}
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading || !!successMessage}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isLoading || !!successMessage}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Sending...
                  </>
                ) : successMessage ? (
                  'Email Sent �?
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {/* 返回登录链接 */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

