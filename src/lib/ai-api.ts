/**
 * AI生成器API调用函数
 * 封装所有与AI生成相关的后端接口
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// ==================== 类型定义 ====================

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'failed';
}

export interface AIGenerateRequest {
  prompt: string;
}

export interface AIGenerateResponse {
  success: boolean;
  data: {
    images: Array<{
      url: string;
    }>;
    created: number;
    prompt: string;
  };
  message: string;
}

export interface RemainingResponse {
  success: boolean;
  data: {
    used: number;      // 今日已使用次数
    limit: number;     // 每日限制次数
    remaining: number; // 今日剩余次数
  };
}

export interface HistoryPage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt?: string;  // 旧字段，兼容性
  generationTime?: string;  // 新字段，后端实际返回的字段
  status?: 'pending' | 'completed' | 'failed';
}

export interface HistoryResponse {
  success: boolean;
  data: {
    pages: HistoryPage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      startRecord: number;
      endRecord: number;
    };
    filters: {
      sort: string;
    };
    meta: {
      totalResults: number;
    };
  };
  message: string;
}

// ==================== API错误处理 ====================

export class AIApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'AIApiError';
  }
}

/**
 * 获取认证token
 * 项目中使用 authToken 或 token 作为key
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  // 优先使用 authToken，如果没有则使用 token（兼容性）
  return localStorage.getItem('authToken') || localStorage.getItem('token');
}

/**
 * 通用fetch包装函数
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 如果有token，添加认证头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // 特殊处理401未授权错误
      if (response.status === 401) {
        throw new AIApiError(
          '认证失败，请先登录',
          401,
          data
        );
      }

      throw new AIApiError(
        data.message || `请求失败: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AIApiError) {
      throw error;
    }
    
    // 网络错误或其他错误
    throw new AIApiError(
      error instanceof Error ? error.message : '网络请求失败，请检查连接',
      undefined,
      error
    );
  }
}

// ==================== API函数 ====================

/**
 * 生成AI图片
 */
export async function generateAIImage(
  prompt: string
): Promise<GeneratedImage> {
  if (!prompt.trim()) {
    throw new AIApiError('提示词不能为空');
  }

  const response = await apiFetch<AIGenerateResponse>('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt: prompt.trim() }),
  });

  // 转换为前端使用的格式
  const imageUrl = response.data.images[0]?.url;
  if (!imageUrl) {
    throw new AIApiError('生成的图片URL为空');
  }

  return {
    id: Date.now().toString(),
    prompt: response.data.prompt,
    imageUrl: imageUrl,
    timestamp: new Date(response.data.created * 1000),
  };
}

/**
 * 获取今日剩余生成次数
 */
export async function getRemainingGenerations(): Promise<{
  used: number;
  limit: number;
  remaining: number;
}> {
  const response = await apiFetch<RemainingResponse>('/api/ai/remaining', {
    method: 'GET',
  });

  return response.data;
}

/**
 * 获取我的创作历史
 */
export async function getMyCreations(
  page: number = 1,
  limit: number = 20
): Promise<{
  images: GeneratedImage[];
  pagination: HistoryResponse['data']['pagination'];
}> {
  const response = await apiFetch<HistoryResponse>(
    `/api/ai/my-creations?page=${page}&limit=${limit}`,
    {
      method: 'GET',
    }
  );

  // 转换为前端使用的格式
  const images: GeneratedImage[] = response.data.pages.map((page) => ({
    id: page.id,
    prompt: page.prompt,
    imageUrl: page.imageUrl,
    // 优先使用 generationTime，如果没有则使用 createdAt（兼容性）
    timestamp: new Date(page.generationTime || page.createdAt || new Date().toISOString()),
    status: page.status, // 保留后端返回的状态
  }));

  return {
    images,
    pagination: response.data.pagination,
  };
}

/**
 * 刷新剩余次数（用于生成后更新）
 */
export async function refreshRemainingCount(): Promise<number> {
  const data = await getRemainingGenerations();
  return data.remaining;
}

// ==================== 辅助函数 ====================

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * 获取登录提示信息
 */
export function getAuthErrorMessage(): string {
  return '请先登录后再使用AI生成功能';
}

/**
 * 重定向到登录（如果需要）
 */
export function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  // 可以在这里实现登录弹窗或页面跳转
  // 例如：触发登录对话框
  console.warn('用户未登录，需要认证');
}

/**
 * 格式化错误消息
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof AIApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return '未知错误，请稍后重试';
}

