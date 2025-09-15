'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, Mail, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function SignupPage() {
  const [signupMethod, setSignupMethod] = useState<'choose' | 'email'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const router = useRouter();

  // 发送验证码
  const handleSendCode = async () => {
    if (!email) return;
    
    setIsVerifyingCode(true);
    // 模拟发送验证码
    setTimeout(() => {
      console.log('Verification code sent to:', email);
      setIsCodeSent(true);
      setIsVerifyingCode(false);
    }, 1000);
  };

  // 邮箱注册提交
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCodeSent) {
      await handleSendCode();
      return;
    }

    setIsLoading(true);
    
    // 模拟注册请求
    setTimeout(() => {
      console.log('Email signup:', { email, password, verificationCode });
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  // Google 注册
  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
    // 这里集成Google OAuth
  };

  // GitHub 注册
  const handleGithubSignup = () => {
    console.log('GitHub signup clicked');
    // 这里集成GitHub OAuth
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            
            {signupMethod === 'choose' ? (
              // 选择注册方式
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Create Account
                  </h1>
                  <p className="text-gray-600">
                    Choose your preferred sign-up method
                  </p>
                </div>

                <div className="space-y-4">
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

                  {/* 分隔线 */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  {/* 邮箱注册 */}
                  <button
                    onClick={() => setSignupMethod('email')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Continue with Email</span>
                  </button>
                </div>

                {/* 登录链接 */}
                <div className="text-center mt-6">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link 
                    href="/login" 
                    className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                  >
                    Log in
                  </Link>
                </div>
              </>
            ) : (
              // 邮箱注册表单
              <>
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setSignupMethod('choose')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900 ml-4">
                    Sign up with Email
                  </h1>
                </div>

                <form onSubmit={handleEmailSignup} className="space-y-6">
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

                  {/* 密码输入框 */}
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

                  {/* 验证码输入框 */}
                  {isCodeSent && (
                    <div>
                      <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <input
                        id="verificationCode"
                        type="text"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        We&apos;ve sent a verification code to {email}
                      </p>
                    </div>
                  )}

                  {/* 提交按钮 */}
                  <button
                    type="submit"
                    disabled={isLoading || isVerifyingCode}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Creating account...
                      </>
                    ) : isVerifyingCode ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Sending code...
                      </>
                    ) : isCodeSent ? (
                      'Create Account'
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 