'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/apiConfig';

// 生成默认头像URL（基于用户邮箱或名称）
const generateDefaultAvatar = (email: string, name?: string) => {
  // 使用UI Avatars服务生成漂亮的字母头像
  const displayName = name || email.split('@')[0];
  // 使用邮箱的首字母，背景色使用橙黄色系，只显示首字母
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f59e0b&color=fff&size=200&bold=true&length=1`;
};

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
        
        console.log('🔐 OAuth 登录成功，开始获取用户信息...');
        console.log('Token:', token.substring(0, 20) + '...');
        console.log('Provider:', provider);
        
        // 保存 token 到 localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('token', token); // 兼容性
        localStorage.setItem('authProvider', provider || 'unknown');
        
        // 使用 token 获取用户信息（根据接口文档使用 /api/user/me）
        const response = await fetch(API_ENDPOINTS.PUBLIC.USER.ME, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 用户信息接口响应状态:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ 获取用户信息失败:', errorText);
          throw new Error(`获取用户信息失败: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('📦 用户信息数据:', data);
        
        if (data.success && data.data) {
          // 如果没有头像，生成默认头像
          const avatarUrl = data.data.avatar && data.data.avatar.trim() !== ''
            ? data.data.avatar
            : generateDefaultAvatar(data.data.email, data.data.name);
          
          console.log('🖼️ 头像URL:', { original: data.data.avatar, final: avatarUrl });
          
          // 保存真实的用户信息到 localStorage
          const userInfo = {
            id: data.data.id,
            email: data.data.email,
            name: data.data.name,
            avatar: avatarUrl,  // 使用生成的头像URL
            provider: data.data.provider
          };
          
          console.log('💾 保存用户信息到 localStorage:', userInfo);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          
          console.log('✅ 用户信息保存成功，准备跳转...');
        } else {
          console.error('❌ 后端返回格式错误:', data);
          throw new Error('后端返回的用户信息格式不正确');
        }
        
        // 延迟跳转，让用户看到加载动画
        setTimeout(() => {
          console.log('🔄 跳转到首页...');
          window.location.href = '/';
        }, 1000);
      } catch (err) {
        console.error('❌ OAuth 登录流程失败:', err);
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

