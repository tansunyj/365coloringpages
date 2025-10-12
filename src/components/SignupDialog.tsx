'use client';

import { useState, useEffect } from 'react';
import { X, Github, Mail } from 'lucide-react';

interface SignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void;
}

export default function SignupDialog({ isOpen, onClose, onSwitchToLogin, onSignupSuccess }: SignupDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

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

  // 重置状态当对话框关闭时
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setVerificationCode('');
      setIsCodeSent(false);
      setIsVerifyingCode(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!email) {
      alert('请先输入邮箱地址');
      return;
    }
    
    setIsVerifyingCode(true);
    // 模拟发送验证码
    setTimeout(() => {
      setIsCodeSent(true);
      setIsVerifyingCode(false);
    }, 1000);
  };

  // 注册提交
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCodeSent) {
      alert('请先发送验证码');
      return;
    }

    if (!verificationCode) {
      alert('请输入验证码');
      return;
    }

    setIsLoading(true);
    
    // 模拟注册请求
    setTimeout(() => {
      alert('注册成功！');
      setIsLoading(false);
      // 调用注册成功回调
      onSignupSuccess();
      // 这里可以添加实际的注册逻辑和自动登录
    }, 1000);
  };

  // Google 注册
  const handleGoogleSignup = () => {
    // 这里集成Google OAuth
  };

  // GitHub 注册
  const handleGithubSignup = () => {
    // 这里集成GitHub OAuth
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 - 完全透明，只用于点击关闭 */}
      <div 
        className="fixed inset-0 transition-opacity"
        onClick={onClose}
      />
      
      {/* 对话框容器 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] max-w-md w-full mx-auto transform transition-all border border-gray-300">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* 对话框内容 */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                Sign up to start your coloring journey
              </p>
            </div>

            {/* 社交登录按钮 */}
            <div className="space-y-3 mb-6">
              {/* Google 注册 */}
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              {/* GitHub 注册 */}
              <button
                onClick={handleGithubSignup}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Github className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700 font-medium">Continue with GitHub</span>
              </button>
            </div>

            {/* 分隔线 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* 邮箱注册表单 */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* 邮箱输入框和发送验证码按钮 */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={!email || isVerifyingCode || isCodeSent}
                    className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
                  >
                    {isVerifyingCode ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : isCodeSent ? (
                      '已发送'
                    ) : (
                      '发送验证码'
                    )}
                  </button>
                </div>
              </div>

              {/* 密码输入框 */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* 验证码输入框 */}
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="verification-code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
                {isCodeSent && (
                  <p className="text-sm text-green-600 mt-2">
                    验证码已发送到 {email}
                  </p>
                )}
              </div>

              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={isLoading || !email || !password || !verificationCode}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* 登录链接 */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Already have an account? </span>
              <button
                onClick={onSwitchToLogin}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 