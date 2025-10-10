// API配置文件 - 统一管理所有API端点
// 根据环境变量动态配置API基础URL

// 获取API基础URL
const getApiBaseUrl = (): string => {
  // 使用环境变量中配置的后端地址，如果没有配置则默认使用localhost:3001
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

// API端点配置
export const API_ENDPOINTS = {
  // 基础URL
  BASE_URL: API_BASE_URL,
  
  // 🎨 前端公共接口
  PUBLIC: {
    // 热门关键词
    KEYWORDS: {
      GET: `${API_BASE_URL}/api/keywords`,
      POST: `${API_BASE_URL}/api/keywords`,
    },
    
    // 搜索接口
    SEARCH: `${API_BASE_URL}/api/search`,
    
    // 涂色页面接口
    COLORING: {
      DETAIL: (id: number) => `${API_BASE_URL}/api/coloring/${id}`,
      DOWNLOAD: (id: number) => `${API_BASE_URL}/api/coloring/${id}/download`,
      VIEW: (id: number) => `${API_BASE_URL}/api/coloring/${id}/view`,
      LIKE: (id: number) => `${API_BASE_URL}/api/coloring/${id}/like`,
      SHARE: (id: number) => `${API_BASE_URL}/api/coloring/${id}/share`,
      FAVORITE: (id: number) => `${API_BASE_URL}/api/coloring/${id}/favorite`,
      RATE: (id: number) => `${API_BASE_URL}/api/coloring/${id}/rate`,
      STATS: (id: number) => `${API_BASE_URL}/api/coloring/${id}/stats`,
    },
    
    // Banner轮播接口
    BANNERS: {
      ACTIVE: `${API_BASE_URL}/api/banners/active`,
      ALL: `${API_BASE_URL}/api/banners`,
    },
    
    // 热门页面接口
    POPULAR: {
      HOMEPAGE: `${API_BASE_URL}/api/popular/homepage`,
      LIST: `${API_BASE_URL}/api/popular`,
      STATS: `${API_BASE_URL}/api/popular/stats`,
    },
    
    // 最新上传接口
    LATEST: {
      LIST: `${API_BASE_URL}/api/latest`,
    },
    
    // 分类接口
    CATEGORIES: {
      LIST: `${API_BASE_URL}/api/categories`,
      LIST_ALL: `${API_BASE_URL}/api/categories/list`, // 获取所有分类列表（给下拉框用）
      DETAIL: (slug: string) => `${API_BASE_URL}/api/categories/${slug}`,
    },
    
    // 主题公园接口
    THEME_PARKS: {
      LIST: `${API_BASE_URL}/api/theme-parks`,
      DETAIL: (slug: string) => `${API_BASE_URL}/api/theme-parks/${slug}`,
    },
    
    // 涂色书接口
    COLORING_BOOKS: {
      LIST: `${API_BASE_URL}/api/coloring-books`,
      PAGES: `${API_BASE_URL}/api/coloring-books/pages`,
      DETAIL: (slug: string) => `${API_BASE_URL}/api/coloring-books/${slug}`,
    },
    
    // AI生成接口
    AI: {
      GENERATE: `${API_BASE_URL}/api/ai/generate`,
      STATUS: (id: number) => `${API_BASE_URL}/api/ai/generate/${id}`,
      HISTORY: `${API_BASE_URL}/api/ai/history`,
      SUBMIT_PUBLIC: (id: number) => `${API_BASE_URL}/api/ai/generate/${id}/submit-public`,
      PUBLIC_GALLERY: `${API_BASE_URL}/api/ai/public`,
      DELETE: (id: number) => `${API_BASE_URL}/api/ai/generate/${id}`,
      USAGE: `${API_BASE_URL}/api/ai/usage`,
    },
    
    // 博客接口
    BLOG: {
      LIST: `${API_BASE_URL}/api/blog`,
      DETAIL: (slug: string) => `${API_BASE_URL}/api/blog/${slug}`,
    },
    
    // 用户认证接口
    AUTH: {
      REGISTER: `${API_BASE_URL}/api/auth/register`,
      LOGIN: `${API_BASE_URL}/api/auth/login`,
      LOGOUT: `${API_BASE_URL}/api/auth/logout`,
      ME: `${API_BASE_URL}/api/auth/me`,
      GOOGLE: `${API_BASE_URL}/api/auth/google`,
      GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
      GITHUB: `${API_BASE_URL}/api/auth/github`,
      GITHUB_CALLBACK: `${API_BASE_URL}/api/auth/github/callback`,
    },
    
    // 文件上传接口
    UPLOAD: {
      IMAGE: `${API_BASE_URL}/api/upload/image`,
    },
  },
  
  // 🔐 管理员接口
  ADMIN: {
    // 管理员认证
    AUTH: {
      LOGIN: `${API_BASE_URL}/api/admin/login`,
    },
    
    // 关键词管理
    KEYWORDS: {
      LIST: `${API_BASE_URL}/api/admin/keywords`,
      CREATE: `${API_BASE_URL}/api/admin/keywords`,
      UPDATE: `${API_BASE_URL}/api/admin/keywords`,
      DELETE: `${API_BASE_URL}/api/admin/keywords`,
    },
    
    // 分类管理
    CATEGORIES: {
      LIST: `${API_BASE_URL}/api/admin/categories`,
      CREATE: `${API_BASE_URL}/api/admin/categories`,
      UPDATE: `${API_BASE_URL}/api/admin/categories`,
      DELETE: `${API_BASE_URL}/api/admin/categories`,
    },
    
    // 主题公园管理
    THEME_PARKS: {
      LIST: `${API_BASE_URL}/api/admin/theme-parks`,
      CREATE: `${API_BASE_URL}/api/admin/theme-parks`,
      UPDATE: `${API_BASE_URL}/api/admin/theme-parks`,
      DELETE: `${API_BASE_URL}/api/admin/theme-parks`,
    },
    
    // 涂色书管理
    COLORING_BOOKS: {
      LIST: `${API_BASE_URL}/api/admin/coloring-books`,
      CREATE: `${API_BASE_URL}/api/admin/coloring-books`,
      UPDATE: `${API_BASE_URL}/api/admin/coloring-books`,
      DELETE: `${API_BASE_URL}/api/admin/coloring-books`,
    },
    
    // 涂色页面管理
    COLORING_PAGES: {
      LIST: `${API_BASE_URL}/api/admin/coloring-pages`,
      CREATE: `${API_BASE_URL}/api/admin/coloring-pages`,
      UPDATE: `${API_BASE_URL}/api/admin/coloring-pages`,
      DELETE: `${API_BASE_URL}/api/admin/coloring-pages`,
    },
    
    // Banner管理
    BANNERS: {
      LIST: `${API_BASE_URL}/api/admin/banners`,
      CREATE: `${API_BASE_URL}/api/admin/banners`,
      UPDATE: `${API_BASE_URL}/api/admin/banners`,
      DELETE: `${API_BASE_URL}/api/admin/banners`,
      SET_ACTIVE: `${API_BASE_URL}/api/admin/banners/set-active`,
      ADD_IMAGE: (groupId: number) => `${API_BASE_URL}/api/admin/banners/${groupId}/images`,
      UPDATE_IMAGE: (groupId: number, imageId: number) => `${API_BASE_URL}/api/admin/banners/${groupId}/images/${imageId}`,
      DELETE_IMAGE: (groupId: number, imageId: number) => `${API_BASE_URL}/api/admin/banners/${groupId}/images/${imageId}`,
    },
    
    // AI生成管理
    AI_GENERATIONS: {
      LIST: `${API_BASE_URL}/api/admin/ai-generations`,
      STATS: `${API_BASE_URL}/api/admin/ai-generations/stats`,
      PENDING_REVIEW: `${API_BASE_URL}/api/admin/ai-generations/pending-review`,
      REVIEW: (id: number) => `${API_BASE_URL}/api/admin/ai-generations/${id}/review`,
      BATCH_REVIEW: `${API_BASE_URL}/api/admin/ai-generations/batch-review`,
      DELETE: (id: number) => `${API_BASE_URL}/api/admin/ai-generations/${id}`,
    },
    
    // 统计数据管理
    STATS: {
      OVERVIEW: `${API_BASE_URL}/api/admin/stats/overview`,
      POPULAR_PAGES: `${API_BASE_URL}/api/admin/stats/popular-pages`,
      CATEGORIES: `${API_BASE_URL}/api/admin/stats/categories`,
      RESET: `${API_BASE_URL}/api/admin/stats/reset`,
      EXPORT: `${API_BASE_URL}/api/admin/stats/export`,
    },
    
    // 用户管理
    USERS: {
      LIST: `${API_BASE_URL}/api/admin/users`,
      CREATE: `${API_BASE_URL}/api/admin/users`,
      UPDATE: `${API_BASE_URL}/api/admin/users`,
      DELETE: `${API_BASE_URL}/api/admin/users`,
    },
  },
} as const;

// 工具函数：构建带查询参数的URL
export const buildUrlWithParams = (baseUrl: string, params: Record<string, string | number | boolean>): string => {
  const url = new URL(baseUrl, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // 对于 'q' 参数，允许空字符串
      if (key === 'q' || value !== '') {
        url.searchParams.append(key, String(value));
      }
    }
  });
  
  return url.toString();
};

// 工具函数：获取完整的API URL（处理相对路径）
export const getFullApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // 如果是相对路径，确保以 / 开头
  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }
  
  return `${API_BASE_URL}${endpoint}`;
};

// HTTP请求配置
export const REQUEST_CONFIG = {
  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // 管理员请求头（需要token）
  ADMIN_HEADERS: (token: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }),
  
  // 文件上传请求头
  UPLOAD_HEADERS: (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },
  
  // 请求超时设置
  TIMEOUT: {
    DEFAULT: 10000,      // 10秒
    UPLOAD: 60000,       // 60秒
    AI_GENERATION: 120000, // 2分钟
  },
} as const;

// API响应类型定义
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页响应类型
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: {
    items: T[];
    totalCount: number;
    currentPage: number;
    hasNextPage: boolean;
    totalPages?: number;
  };
}

export default API_ENDPOINTS; 