'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// API 基础 URL
const API_BASE_URL = 'http://localhost:3001';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');

    if (!token) {
      setError('未获取到认证令牌');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        setIsLoadingUserInfo(true);
        
        // 保存 token 到 localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('authProvider', provider || 'unknown');
        
        // 使用 token 获取用户信息
        const response = await fetch(`${API_BASE_URL}/api/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`获取用户信息失败: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // 保存真实的用户信息到 localStorage
          localStorage.setItem('userInfo', JSON.stringify(data.data));
        } else {
          throw new Error('后端返回的用户信息格式不正确');
        }
        
        // 延迟跳转，让用户看到加载动画
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取用户信息失败，请重试');
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    fetchUserInfo();
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-6xl">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">认证失败</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">登录成功！</h1>
        <p className="text-gray-600">正在跳转...</p>
      </div>
    </div>
  );
}

