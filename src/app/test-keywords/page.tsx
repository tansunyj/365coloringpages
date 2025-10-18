'use client'

import { useState, useEffect } from 'react';

interface KeywordData {
  keyword: string;
  clickCount: number;
}

interface KeywordsTestData {
  apiUrl: string;
  responseTime: number;
  success: boolean;
  data?: KeywordData[];
  error?: string;
}

export default function TestKeywordsPage() {
  const [testResult, setTestResult] = useState<KeywordsTestData | null>(null);
  const [testing, setTesting] = useState(false);

  const testKeywordsAPI = async () => {
    setTesting(true);
    const startTime = Date.now();
    
    try {
      // 使用和Hero组件相同的API调用方式
      const { api } = await import('../../lib/apiClient');
      const response = await api.keywords.get();

      const responseTime = Date.now() - startTime;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      
      setTestResult({
        apiUrl: `${apiBaseUrl}/api/keywords`,
        responseTime,
        success: response.success,
        data: response.success ? response.data : undefined,
        error: response.success ? undefined : (response.message || 'API调用失败')
      });
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      
      setTestResult({
        apiUrl: `${apiBaseUrl}/api/keywords`,
        responseTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  // 直接测试原始fetch调用
  const testDirectAPI = async () => {
    setTesting(true);
    const startTime = Date.now();
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const apiUrl = `${apiBaseUrl}/api/keywords`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setTestResult({
        apiUrl,
        responseTime,
        success: data.success,
        data: data.success ? data.data : undefined,
        error: data.success ? undefined : (data.message || 'API返回失败')
      });
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      
      setTestResult({
        apiUrl: `${apiBaseUrl}/api/keywords`,
        responseTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    // 页面加载时自动测�?
    testKeywordsAPI();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🏷�?Keywords API 测试页面</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">API 连接测试</h2>
          <div className="space-x-2">
            <button
              onClick={testKeywordsAPI}
              disabled={testing}
              className={`px-4 py-2 rounded ${
                testing 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {testing ? '测试�?..' : '使用ApiClient测试'}
            </button>
            <button
              onClick={testDirectAPI}
              disabled={testing}
              className={`px-4 py-2 rounded ${
                testing 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {testing ? '测试�?..' : '直接Fetch测试'}
            </button>
          </div>
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
              <strong>连接状�?</strong>
              <span className={`ml-2 px-3 py-1 rounded text-sm font-medium ${
                testResult.success 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'
              }`}>
                {testResult.success ? '�?成功' : '�?失败'}
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
                <strong className="text-green-800">Keywords数据 (�?0�?:</strong>
                <div className="mt-3 space-y-2">
                  {testResult.data.slice(0, 10).map((keyword, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="font-medium">{keyword.keyword}</span>
                      <span className="text-sm text-gray-600">点击: {keyword.clickCount}</span>
                    </div>
                  ))}
                  {testResult.data.length > 10 && (
                    <div className="text-sm text-gray-500 text-center">
                      ...还有 {testResult.data.length - 10} 个关键词
                    </div>
                  )}
                </div>
                
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <strong>完整响应数据:</strong>
                  <div className="font-mono text-xs bg-white p-3 rounded mt-2 max-h-32 overflow-auto">
                    <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">💡 说明:</h3>
        <ul className="text-blue-700 space-y-1 list-disc list-inside">
          <li>此页面测�?Keywords API 是否可以正常访问</li>
          <li>成功获取数据后，这些关键词会显示在首页Hero部分的搜索框上方</li>
          <li>期望的API响应格式�?/li>
        </ul>
        <div className="mt-2 bg-white p-3 rounded font-mono text-xs">
          <pre>{`{
  "success": true,
  "data": [
    {
      "keyword": "小狗",
      "clickCount": 238
    },
    {
      "keyword": "公主", 
      "clickCount": 189
    }
  ]
}`}</pre>
        </div>
      </div>
    </div>
  );
} 