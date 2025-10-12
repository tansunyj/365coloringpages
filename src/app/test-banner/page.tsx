'use client'

import { useState, useEffect } from 'react';

interface BannerTestData {
  apiUrl: string;
  responseTime: number;
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export default function TestBannerPage() {
  const [testResult, setTestResult] = useState<BannerTestData | null>(null);
  const [testing, setTesting] = useState(false);

  const testBannerAPI = async () => {
    setTesting(true);
    const startTime = Date.now();
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const apiUrl = `${apiBaseUrl}/api/banners`;
      
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10秒超时
      });

      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setTestResult({
        apiUrl,
        responseTime,
        success: true,
        data
      });
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      setTestResult({
        apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL + '/api/banners',
        responseTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    // 页面加载时自动测试
    testBannerAPI();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🧪 Banner API 测试页面</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">API 连接测试</h2>
          <button
            onClick={testBannerAPI}
            disabled={testing}
            className={`px-4 py-2 rounded ${
              testing 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {testing ? '测试中...' : '重新测试'}
          </button>
        </div>

        {testResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>API地址:</strong>
                <div className="font-mono text-sm bg-white p-2 rounded">
                  {testResult.apiUrl}
                </div>
              </div>
              <div>
                <strong>响应时间:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  testResult.responseTime < 1000 ? 'bg-green-200 text-green-800' :
                  testResult.responseTime < 3000 ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {testResult.responseTime}ms
                </span>
              </div>
            </div>

            <div>
              <strong>连接状态:</strong>
              <span className={`ml-2 px-3 py-1 rounded text-sm font-medium ${
                testResult.success 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'
              }`}>
                {testResult.success ? '✅ 成功' : '❌ 失败'}
              </span>
            </div>

            {testResult.error && (
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <strong className="text-red-800">错误信息:</strong>
                <div className="font-mono text-sm text-red-700 mt-2">
                  {testResult.error}
                </div>
              </div>
            )}

            {testResult.success && testResult.data && (
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <strong className="text-green-800">API响应数据:</strong>
                <div className="font-mono text-xs bg-white p-3 rounded mt-2 max-h-64 overflow-auto">
                  <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">💡 使用说明:</h3>
        <ul className="text-blue-700 space-y-1 list-disc list-inside">
          <li>此页面测试后端 Banner API 是否可以正常访问</li>
          <li>API地址自动使用环境变量 NEXT_PUBLIC_API_BASE_URL</li>
          <li>成功的话，首页Hero部分就能正常加载后端的背景图数据</li>
          <li>如果失败，请检查：
            <ul className="ml-4 mt-1 space-y-1">
              <li>• 后端服务是否在运行</li>
              <li>• API地址是否正确</li>
              <li>• 是否存在CORS问题</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
} 