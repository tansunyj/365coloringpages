'use client'

import { useEffect, useState } from 'react';

export default function DebugEnvPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取环境变量
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const nodeEnv = process.env.NODE_ENV;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const debug = process.env.DEBUG;

  // 测试直接访问�?
  const directApiUrl = typeof window !== 'undefined' 
    ? (window as Record<string, any>).__NEXT_DATA__?.env?.NEXT_PUBLIC_API_BASE_URL 
    : undefined;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🔍 环境变量调试页面 (增强�?</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">当前环境变量值：</h2>
        
        <div className="space-y-3">
          <div className="flex">
            <span className="font-medium w-64">NEXT_PUBLIC_API_BASE_URL:</span>
            <span className={`px-2 py-1 rounded ${apiBaseUrl ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {apiBaseUrl || '�?未设�?}
            </span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-64">NODE_ENV:</span>
            <span className="px-2 py-1 rounded bg-blue-200 text-blue-800">
              {nodeEnv || '未设�?}
            </span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-64">NEXT_PUBLIC_SITE_URL:</span>
            <span className={`px-2 py-1 rounded ${siteUrl ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
              {siteUrl || '⚠️ 未设�?}
            </span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-64">NEXT_PUBLIC_SITE_NAME:</span>
            <span className={`px-2 py-1 rounded ${siteName ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
              {siteName || '⚠️ 未设�?}
            </span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-64">DEBUG:</span>
            <span className={`px-2 py-1 rounded ${debug ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
              {debug || '⚠️ 未设�?}
            </span>
          </div>
        </div>
      </div>

      {/* 高级调试信息 */}
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-blue-800">🔬 高级调试信息�?/h2>
        
        <div className="space-y-2 text-sm">
          <div><strong>构建模式:</strong> {typeof window !== 'undefined' ? '客户�? : '服务�?}</div>
          <div><strong>组件已挂�?</strong> {mounted ? '�? : '�?}</div>
          <div><strong>当前URL:</strong> {typeof window !== 'undefined' ? window.location.href : '服务端渲�?}</div>
          <div><strong>Next.js 数据:</strong> {typeof window !== 'undefined' && (window as any).__NEXT_DATA__ ? '已加�? : '未加�?}</div>
          <div><strong>直接访问API URL:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${directApiUrl ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {directApiUrl || '未找�?}
            </span>
          </div>
        </div>
      </div>

      {/* 环境变量原始值测�?*/}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">🧪 原始值测试：</h2>
        
        <div className="bg-white p-4 rounded border font-mono text-sm">
          <div>process.env.NEXT_PUBLIC_API_BASE_URL = "{apiBaseUrl}"</div>
          <div>String(process.env.NEXT_PUBLIC_API_BASE_URL) = "{String(apiBaseUrl)}"</div>
          <div>JSON.stringify(process.env.NEXT_PUBLIC_API_BASE_URL) = {JSON.stringify(apiBaseUrl)}</div>
          <div>typeof process.env.NEXT_PUBLIC_API_BASE_URL = "{typeof apiBaseUrl}"</div>
        </div>
      </div>

      {/* 所�?process.env 的内�?*/}
      <div className="bg-yellow-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-yellow-800">📋 所�?NEXT_PUBLIC_ 环境变量�?/h2>
        
        <div className="bg-white p-4 rounded border font-mono text-xs max-h-64 overflow-auto">
          {mounted && typeof window !== 'undefined' ? (
            <pre>
              {JSON.stringify(
                Object.fromEntries(
                  Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
                ), 
                null, 
                2
              )}
            </pre>
          ) : (
            <div>等待客户端挂�?..</div>
          )}
        </div>
      </div>

      {/* 问题诊断 */}
      {!apiBaseUrl && (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">�?问题诊断�?/h3>
          <ul className="text-red-700 space-y-1 list-disc list-inside">
            <li>NEXT_PUBLIC_API_BASE_URL 没有正确加载</li>
            <li>这会导致API请求失败</li>
            <li>可能的原因：
              <ul className="ml-4 mt-1 space-y-1">
                <li>�?.env 文件格式错误</li>
                <li>�?开发服务器未重�?/li>
                <li>�?Next.js 缓存问题</li>
                <li>�?静态导出配置问�?/li>
              </ul>
            </li>
          </ul>
        </div>
      )}

      {/* 测试 API 调用 */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">🧪 API 配置测试�?/h3>
        <div className="text-green-700">
          <div><strong>期望�?API 基础URL:</strong> http://localhost:3001</div>
          <div><strong>实际获取到的�?</strong> {apiBaseUrl || '(空�?'}</div>
          <div><strong>匹配状�?</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              apiBaseUrl === 'http://localhost:3001' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}>
              {apiBaseUrl === 'http://localhost:3001' ? '�?匹配' : '�?不匹�?}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 