/**
 * 客户端 IP 地址获取工具
 * 用于在所有 API 请求中自动添加客户端 IP
 */

let cachedClientIP: string | null = null;

/**
 * 获取客户端 IP 地址
 * 优先使用缓存，避免重复请求
 */
export async function getClientIP(): Promise<string> {
  // 如果已有缓存，直接返回
  if (cachedClientIP) {
    return cachedClientIP;
  }

  try {
    // 方案1：通过第三方服务获取（最准确）
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      cache: 'force-cache', // 使用缓存
    });
    
    if (response.ok) {
      const data = await response.json();
      cachedClientIP = data.ip;
      return cachedClientIP;
    }
  } catch (error) {
    // ipify 服务失败，尝试备用方案
  }

  try {
    // 方案2：备用服务
    const response = await fetch('https://api.ip.sb/ip', {
      method: 'GET',
      cache: 'force-cache',
    });
    
    if (response.ok) {
      const ip = await response.text();
      cachedClientIP = ip.trim();
      return cachedClientIP;
    }
  } catch (error) {
    // ip.sb 服务失败
  }

  // 如果都失败，返回未知
  const fallbackIP = 'unknown';
  cachedClientIP = fallbackIP;
  return fallbackIP;
}

/**
 * 创建带有客户端 IP 的请求头
 */
export async function createHeadersWithIP(additionalHeaders: Record<string, string> = {}): Promise<HeadersInit> {
  const clientIP = await getClientIP();
  
  // 注意：不要在这里设置 Content-Type，让调用方或浏览器自动处理
  // 特别是 FormData 上传时，浏览器需要自动设置 multipart/form-data 和 boundary
  return {
    'X-Client-IP': clientIP,
    'X-Forwarded-For': clientIP,
    ...additionalHeaders,
  };
}

/**
 * 重置 IP 缓存（用于测试或切换网络后）
 */
export function resetIPCache(): void {
  cachedClientIP = null;
}

/**
 * 增强版 fetch，自动添加 IP 地址
 * 智能处理 Content-Type：
 * - 如果 body 是 FormData，不设置 Content-Type（让浏览器自动设置 multipart/form-data）
 * - 如果 body 是字符串（通常是 JSON），且没有手动设置 Content-Type，自动设置为 application/json
 * - 其他情况保持原样
 */
export async function fetchWithIP(url: string, options: RequestInit = {}): Promise<Response> {
  const additionalHeaders: Record<string, string> = options.headers as Record<string, string> || {};
  
  // 智能判断是否需要添加 Content-Type
  if (options.body) {
    // 如果是 FormData，不设置 Content-Type（让浏览器自动处理）
    if (options.body instanceof FormData) {
      // 不添加 Content-Type
    }
    // 如果是字符串（通常是 JSON.stringify 的结果）且没有手动设置 Content-Type
    else if (typeof options.body === 'string' && !additionalHeaders['Content-Type'] && !additionalHeaders['content-type']) {
      additionalHeaders['Content-Type'] = 'application/json';
    }
  }
  
  const headers = await createHeadersWithIP(additionalHeaders);
  
  return fetch(url, {
    ...options,
    headers,
  });
}

