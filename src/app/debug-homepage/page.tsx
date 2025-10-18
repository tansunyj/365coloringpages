'use client'

import { useState, useEffect } from 'react';

export default function DebugHomepage() {
  const [envCheck, setEnvCheck] = useState<string>('');
  const [apiTests, setApiTests] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // 检查环境变�?
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    setEnvCheck(apiUrl || '未设�?);
  }, []);

  const runFullTest = async () => {
    setTesting(true);
    setApiTests([]);
    
    const results: any[] = [];
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    // 测试1: 直接fetch keywords
    try {
      const startTime = Date.now();
      const response = await fetch(`${apiBaseUrl}/api/keywords`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      results.push({
        test: 'Direct Fetch Keywords',
        success: response.ok && data.success,
        status: response.status,
        responseTime,
        data: response.ok ? data : { error: response.statusText },
        url: `${apiBaseUrl}/api/keywords`
      });
      
    } catch (error) {
      results.push({
        test: 'Direct Fetch Keywords',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: `${apiBaseUrl}/api/keywords`
      });
    }
    
    // 测试2: 使用apiClient
    try {
      const { api } = await import('../../lib/apiClient');
      const startTime = Date.now();
      const response = await api.keywords.get();
      const responseTime = Date.now() - startTime;
      
      results.push({
        test: 'ApiClient Keywords',
        success: response.success,
        responseTime,
        data: response,
        url: '通过ApiClient调用'
      });
      
    } catch (error) {
      results.push({
        test: 'ApiClient Keywords',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: '通过ApiClient调用'
      });
    }
    
    // 测试3: 检查Hero组件同样的逻辑
    try {
      const { api } = await import('../../lib/apiClient');
      const response = await api.keywords.get();
      
      let processedKeywords: string[] = [];
      if (response.success && response.data) {
        // 使用和Hero组件相同的处理逻辑
        const sortedKeywords = [...response.data]
          .sort((a, b) => b.clickCount - a.clickCount)
          .slice(0, 6)
          .map(item => item.keyword);
        processedKeywords = sortedKeywords;
      } else {
        // fallback到默认关键词
        processedKeywords = ['Animals', 'Fantasy', 'Nature', 'Holidays'];
      }
      
      results.push({
        test: 'Hero Logic Simulation',
        success: response.success,
        data: {
          rawResponse: response,
          processedKeywords
        },
        url: 'Hero组件逻辑模拟'
      });
      
    } catch (error) {
      results.push({
        test: 'Hero Logic Simulation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: 'Hero组件逻辑模拟'
      });
    }
    
    setApiTests(results);
    setTesting(false);
  };

  useEffect(() => {
    runFullTest();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🏠 首页调试 - Keywords问题排查</h1>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
        <h2 className="font-semibold text-yellow-800 mb-2">📝 问题描述</h2>
        <p className="text-yellow-700">
          首页Hero部分显示的是默认英文关键�?Animals, Fantasy, Nature, Holidays)�?
          而不是从后端API获取的中文关键词(小狗, 公主, 独角兽等)
        </p>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">🔧 环境检�?/h2>
        <div className="bg-white p-3 rounded">
          <strong>NEXT_PUBLIC_API_BASE_URL:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-sm ${
            envCheck && envCheck !== '未设�? ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
          }`}>
            {envCheck}
          </span>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">🧪 API调用测试</h2>
          <button
            onClick={runFullTest}
            disabled={testing}
            className={`px-4 py-2 rounded ${
              testing 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {testing ? '测试�?..' : '重新测试'}
          </button>
        </div>

        <div className="space-y-4">
          {apiTests.map((test, index) => (
            <div key={index} className="bg-white p-4 rounded border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{test.test}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  test.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {test.success ? '�?成功' : '�?失败'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <strong>URL:</strong> {test.url}
              </div>
              
              {test.responseTime && (
                <div className="text-sm text-gray-600 mb-2">
                  <strong>响应时间:</strong> {test.responseTime}ms
                </div>
              )}
              
              {test.error && (
                <div className="bg-red-50 p-2 rounded text-red-700 text-sm mb-2">
                  <strong>错误:</strong> {test.error}
                </div>
              )}
              
              {test.data && (
                <div className="bg-gray-50 p-2 rounded">
                  <strong>数据预览:</strong>
                  <div className="font-mono text-xs mt-1 max-h-32 overflow-auto">
                    {test.test === 'Hero Logic Simulation' && test.data.processedKeywords ? (
                      <div>
                        <div><strong>处理后的关键�?</strong> {JSON.stringify(test.data.processedKeywords)}</div>
                        <div className="mt-2"><strong>原始响应:</strong> {JSON.stringify(test.data.rawResponse, null, 2)}</div>
                      </div>
                    ) : (
                      <pre>{JSON.stringify(test.data, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">🔍 排查建议</h3>
        <ol className="text-blue-700 space-y-1 list-decimal list-inside">
          <li>检查后端服务是否在 {envCheck} 上正常运�?/li>
          <li>确认 /api/keywords 端点返回正确的数据格�?/li>
          <li>查看浏览器开发者工具的Console日志</li>
          <li>检查Network标签页是否有CORS错误</li>
          <li>如果API调用成功但Hero还是显示默认关键词，可能是组件渲染问�?/li>
        </ol>
      </div>
    </div>
  );
} 