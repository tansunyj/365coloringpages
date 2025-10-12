'use client';

import { useState, useEffect } from 'react';
import { X, Github, Eye, EyeOff } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { fetchWithIP } from '@/lib/clientIP';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

// 生成默认头像URL（基于用户邮箱或名称）
const generateDefaultAvatar = (email: string, name?: string) => {
  // 使用UI Avatars服务生成漂亮的字母头像
  const displayName = name || email.split('@')[0];
  // 使用邮箱的首字母，背景色使用橙黄色系，只显示首字母
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f59e0b&color=fff&size=200&bold=true&length=1`;
};

export default function LoginDialog({ isOpen, onClose, onLoginSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 对话框打开时重置所有状态
  useEffect(() => {
    if (isOpen) {
      // 清空所有输入框
      setEmail('');
      setPassword('');
      setCaptchaCode('');
      setCaptchaId('');
      setCaptchaSvg('');
      setError('');
      setIsLoading(false);
      setShowPassword(false);
    }
  }, [isOpen]);

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

  // 关闭对话框并重置状态
  const handleClose = () => {
    setEmail('');
    setPassword('');
    setCaptchaCode('');
    setCaptchaId('');
    setCaptchaSvg('');
    setError('');
    setIsLoading(false);
    setShowPassword(false);
    onClose();
  };

  // 生成验证码
  const generateCaptcha = async (emailValue: string = '') => {
    try {
      const response = await fetchWithIP(API_ENDPOINTS.PUBLIC.CAPTCHA.GENERATE, {
        method: 'POST',
        body: JSON.stringify({ email: emailValue || '' }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCaptchaId(result.data.captchaId);
        setCaptchaSvg(result.data.captchaSvg);
      } else {
        setError(result.error || 'Failed to generate captcha');
      }
    } catch (err) {
      setError('Failed to generate captcha');
      console.error('Captcha generation error:', err);
    }
  };

  // 验证邮箱格式是否合法（更严格的验证）
  const isValidEmail = (email: string): boolean => {
    // 严格的邮箱格式验证
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  // 验证密码复杂性
  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    
    // 必须包含至少一个小写字母
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    // 必须包含至少一个大写字母
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    // 必须包含至少一个数字
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    
    // 可选：必须包含至少一个特殊字符
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;']/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*...)' };
    }
    
    return { isValid: true, message: '' };
  };

  // 邮箱输入时自动刷新验证码（只有当邮箱格式完整合法时才触发）
  useEffect(() => {
    if (email && isValidEmail(email)) {
      // 延迟500ms，避免用户还在输入时就触发请求
      const timer = setTimeout(() => {
        if (isValidEmail(email)) {
          generateCaptcha(email);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [email]);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 验证邮箱格式
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // 验证密码复杂性
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }
    
    // 验证验证码
    if (!captchaCode.trim()) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetchWithIP(API_ENDPOINTS.PUBLIC.AUTH.LOGIN_OR_REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          captchaId,
          captchaCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 保存 token（使用 authToken 作为key，与OAuth登录保持一致）
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('token', result.data.token);
        
        // 保存用户信息
        if (result.data.user) {
          // 如果没有头像，生成默认头像
          const avatarUrl = result.data.user.avatar && result.data.user.avatar.trim() !== ''
            ? result.data.user.avatar
            : generateDefaultAvatar(result.data.user.email, result.data.user.name);
          
          const userInfo = {
            ...result.data.user,
            avatar: avatarUrl  // 使用生成的头像URL
          };
          
          console.log('💾 登录/注册成功，保存用户信息:', userInfo);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
        
        // 登录成功
        onLoginSuccess();
        handleClose();
      } else {
        setError(result.error || 'Login failed');
        
        // 如果验证码错误，刷新验证码
        if (result.error && result.error.includes('验证码')) {
          await generateCaptcha(email);
          setCaptchaCode('');
        }
      }
    } catch (err) {
      setError('Login failed, please try again');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Google 登录
  const handleGoogleLogin = () => {
    window.location.href = API_ENDPOINTS.PUBLIC.AUTH.GOOGLE;
  };

  // GitHub 登录
  const handleGithubLogin = () => {
    window.location.href = API_ENDPOINTS.PUBLIC.AUTH.GITHUB;
  };

  // 刷新验证码
  const handleRefreshCaptcha = async () => {
    setCaptchaCode('');
    await generateCaptcha(email);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/20 transition-opacity"
        onClick={handleClose}
      />
      
      {/* 对话框容器 */}
      <div className="flex min-h-full items-start justify-center pt-48 p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all">
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* 对话框内容 */}
          <div className="p-6">
            {/* 标题部分 */}
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Welcome to Coloring World
              </h2>
              <p className="text-xs text-gray-500">
                Sign in or create an account to save your favorite coloring pages
              </p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* 社交登录按钮 - 并排显示 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* GitHub 登录 */}
              <button
                onClick={handleGithubLogin}
                type="button"
                className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-xs font-medium text-gray-700">GitHub</span>
              </button>

              {/* Google 登录 */}
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-xs font-medium text-gray-700">Google</span>
              </button>
            </div>

            {/* 分隔线 */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* 登录/注册表单 */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* 邮箱输入框 */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm placeholder:text-gray-400"
                />
              </div>

              {/* 密码输入框 */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8+ chars: A-Z, a-z, 0-9, !@#$..."
                    autoComplete="new-password"
                    minLength={8}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Include: uppercase, lowercase, number & symbol
                </p>
              </div>

              {/* 验证码 - 始终显示UI，但只有输入邮箱后才加载图片 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Verification Code
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* 验证码图片 - 占50%宽度 */}
                  <div 
                    className="h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 cursor-pointer"
                    onClick={handleRefreshCaptcha}
                    title="Click to refresh"
                  >
                    {captchaSvg ? (
                      <div dangerouslySetInnerHTML={{ __html: captchaSvg }} />
                    ) : (
                      <span className="text-xs text-gray-400">Enter email first</span>
                    )}
                  </div>
                  {/* 输入框 - 占50%宽度 */}
                  <input
                    type="text"
                    required
                    value={captchaCode}
                    onChange={(e) => setCaptchaCode(e.target.value)}
                    placeholder="Result"
                    autoComplete="off"
                    className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-center text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* 登录/注册按钮 */}
              <button
                type="submit"
                disabled={isLoading || !email || !password || !captchaCode}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center text-sm mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Sign In / Sign Up'
                )}
              </button>
            </form>

            {/* 重置密码链接 */}
            <div className="mt-3">
              <a 
                href="/reset-password" 
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
