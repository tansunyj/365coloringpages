'use client'

import { useState, useEffect } from 'react';

interface TestResult {
  name: string;
  url: string;
  success: boolean;
  responseTime: number;
  data?: any;
  error?: string;
}

export default function TestHeroAPIPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const testAllAPIs = async () => {
    setTesting(true);
    setResults([]);
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    // 测试 Banners API
    const testBanners = async (): Promise<TestResult> => {
      const startTime = Date.now();
      try {
        const response = await fetch(`${apiBaseUrl}/api/banners`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000),
        });
        
        const responseTime = Date.now() - startTime;
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return {
          name: 'Banners API',
          url: `${apiBaseUrl}/api/banners`,
          success: data.success,
          responseTime,
          data: data.success ? data.data : undefined,
          error: data.success ? undefined : data.message
        };
      } catch (error) {
        return {
          name: 'Banners API',
          url: `${apiBaseUrl}/api/banners`,
          success: false,
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    };

    // 测试 Keywords API
    const testKeywords = async (): Promise<TestResult> => {
      const startTime = Date.now();
      try {
        const response = await fetch(`${apiBaseUrl}/api/keywords`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000),
        });
        
        const responseTime = Date.now() - startTime;
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return {
          name: 'Keywords API',
          url: `${apiBaseUrl}/api/keywords`,
          success: data.success,
          responseTime,
          data: data.success ? data.data : undefined,
          error: data.success ? undefined : data.message
        };
      } catch (error) {
        return {
          name: 'Keywords API',
          url: `${apiBaseUrl}/api/keywords`,
          success: false,
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    };

    // 并发测试两个API
    try {
      const [bannersResult, keywordsResult] = await Promise.all([
        testBanners(),
        testKeywords()
      ]);
      
      setResults([bannersResult, keywordsResult]);
    } catch (error) {
      console.error('测试过程中出错:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    // 页面加载时自动测试
    testAllAPIs();
  }, []);

  const allSuccess = results.length === 2 && results.every(r => r.success);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🏠 Hero组件API集成测试</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">API连接状态</h2>
          <button
            onClick={testAllAPIs}
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

        {/* 总体状态 */}
        {results.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border-2" style={{
            backgroundColor: allSuccess ? '#f0fdf4' : '#fef2f2',
            borderColor: allSuccess ? '#22c55e' : '#ef4444'
          }}>
            <div className="flex items-center">
              <span className="text-2xl mr-3">
                {allSuccess ? '✅' : '❌'}
              </span>
              <div>
                <h3 className={`font-bold text-lg ${allSuccess ? 'text-green-800' : 'text-red-800'}`}>
                  {allSuccess ? 'Hero组件API就绪！' : 'API连接存在问题'}
                </h3>
                <p className={`text-sm ${allSuccess ? 'text-green-700' : 'text-red-700'}`}>
                  {allSuccess 
                    ? '所有API都正常工作，首页Hero部分会正确显示后端数据'
                    : '部分API调用失败，首页可能使用默认数据'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 详细结果 */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{result.name}</h3>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  result.success 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {result.success ? '✅ 成功' : '❌ 失败'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <strong>API地址:</strong>
                  <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                    {result.url}
                  </div>
                </div>
                <div>
                  <strong>响应时间:</strong>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    result.responseTime < 1000 ? 'bg-green-200 text-green-800' :
                    result.responseTime < 3000 ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {result.responseTime}ms
                  </span>
                </div>
              </div>

              {result.error && (
                <div className="bg-red-50 p-3 rounded border border-red-200 mb-3">
                  <strong className="text-red-800">错误:</strong>
                  <div className="font-mono text-sm text-red-700 mt-1">
                    {result.error}
                  </div>
                </div>
              )}

              {result.success && result.data && (
                <div className="bg-gray-50 p-3 rounded">
                  <strong>数据预览:</strong>
                  <div className="font-mono text-xs bg-white p-2 rounded mt-1 max-h-32 overflow-auto">
                    {result.name === 'Keywords API' && Array.isArray(result.data) ? (
                      <div>
                        {result.data.slice(0, 5).map((item: any, i: number) => (
                          <div key={i}>"{item.keyword}" (点击: {item.clickCount})</div>
                        ))}
                        {result.data.length > 5 && <div>...共{result.data.length}个关键词</div>}
                      </div>
                    ) : result.name === 'Banners API' && result.data.images ? (
                      <div>
                        轮播组: {result.data.name || 'Unknown'}
                        <br />图片数量: {result.data.images.length}
                        {result.data.images.slice(0, 2).map((img: any, i: number) => (
                          <div key={i}>- {img.title || `图片${i+1}`}</div>
                        ))}
                      </div>
                    ) : (
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">💡 使用说明:</h3>
        <ul className="text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>Banners API</strong>: 为Hero部分提供轮播背景图片</li>
          <li><strong>Keywords API</strong>: 为搜索框上方提供热门关键词标签</li>
          <li>如果所有API都成功，访问首页就能看到完整的后端数据集成效果</li>
          <li>API失败时会自动使用默认数据，不影响页面正常显示</li>
        </ul>
        
        <div className="mt-4 p-3 bg-white rounded">
          <strong>环境变量配置:</strong>
          <div className="font-mono text-sm mt-1">
            NEXT_PUBLIC_API_BASE_URL = {process.env.NEXT_PUBLIC_API_BASE_URL || '未设置'}
          </div>
        </div>
      </div>
    </div>
  );
} 