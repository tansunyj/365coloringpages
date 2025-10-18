'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchWithIP } from '@/lib/clientIP';

interface CaptchaInputProps {
  email: string;
  value: string;
  onChange: (value: string) => void;
  onCaptchaReady?: (captchaId: string) => void;
  disabled?: boolean;
  className?: string;
}

interface CaptchaData {
  captchaId: string;
  captchaSvg: string;
  rateLimit: {
    email: { remaining: number; max: number };
    ip: { remaining: number; max: number };
  };
}

const API_BASE_URL = 'http://localhost:3001';

/**
 * 图形验证码输入组�?
 * 集成验证码生成、刷新和输入功能
 */
export default function CaptchaInput({
  email,
  value,
  onChange,
  onCaptchaReady,
  disabled = false,
  className = '',
}: CaptchaInputProps) {
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 生成验证�?
  const generateCaptcha = async () => {
    if (!email) {
      setError('请先输入邮箱地址');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      
      const response = await fetchWithIP(`${API_BASE_URL}/api/captcha/generate`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '生成验证码失�?);
      }

      setCaptchaData(data.data);
      
      // 通知父组件验证码已准备好
      if (onCaptchaReady && data.data.captchaId) {
        onCaptchaReady(data.data.captchaId);
      }

      // 显示速率限制信息
      if (data.data.rateLimit) {
      }
    } catch (err) {
      setError((err as Error).message || '生成验证码失�?);
    } finally {
      setIsLoading(false);
    }
  };

  // 邮箱变化时自动生成验证码
  useEffect(() => {
    if (email && email.includes('@')) {
      generateCaptcha();
    }
  }, [email]);

  // 刷新验证�?
  const handleRefresh = () => {
    onChange(''); // 清空输入
    generateCaptcha();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 验证码图�?*/}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative border border-gray-300">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-sm">加载�?..</span>
            </div>
          ) : error ? (
            <span className="text-xs text-red-500 px-2">{error}</span>
          ) : captchaData ? (
            <div 
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: captchaData.captchaSvg }}
            />
          ) : (
            <span className="text-xs text-gray-400">请输入邮箱后自动生成</span>
          )}
        </div>

        {/* 刷新按钮 */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading || !email || disabled}
          className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="刷新验证�?
        >
          <RefreshCw className={`h-4 w-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 验证码输入框 */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        disabled={disabled || !captchaData}
        placeholder="请输入图形验证码"
        maxLength={6}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed uppercase tracking-widest text-center text-lg font-mono"
      />

      {/* 速率限制提示 */}
      {captchaData?.rateLimit && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            邮箱剩余: {captchaData.rateLimit.email.remaining}/{captchaData.rateLimit.email.max}
          </span>
          <span>
            IP剩余: {captchaData.rateLimit.ip.remaining}/{captchaData.rateLimit.ip.max}
          </span>
        </div>
      )}
    </div>
  );
}

