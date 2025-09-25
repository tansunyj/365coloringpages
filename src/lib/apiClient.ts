// API客户端工具 - 封装常用的API调用方法
import { API_ENDPOINTS, REQUEST_CONFIG, buildUrlWithParams, type ApiResponse, type PaginatedResponse } from './apiConfig';

// 错误类定义
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 请求选项接口
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  token?: string;
}

// 基础请求函数
async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = REQUEST_CONFIG.TIMEOUT.DEFAULT,
    token
  } = options;

  // 构建请求头
  const requestHeaders: Record<string, string> = {
    ...REQUEST_CONFIG.DEFAULT_HEADERS,
    ...headers
  };

  // 添加认证头
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 构建请求配置
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // 添加请求体
  if (body && method !== 'GET') {
    if (body instanceof FormData) {
      // FormData时移除Content-Type，让浏览器自动设置
      delete requestHeaders['Content-Type'];
      fetchOptions.body = body;
    } else {
      fetchOptions.body = JSON.stringify(body);
    }
  }

  // 设置超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  fetchOptions.signal = controller.signal;

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      );
    }

    // 解析响应
    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('请求超时');
      }
      throw new ApiError(`网络错误: ${error.message}`);
    }
    
    throw new ApiError('未知错误');
  }
}

// API客户端类
export class ApiClient {
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  // 设置认证token
  setToken(token: string) {
    this.token = token;
  }

  // 清除认证token
  clearToken() {
    this.token = undefined;
  }

  // GET请求
  async get<T>(url: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const finalUrl = params ? buildUrlWithParams(url, params) : url;
    return request<T>(finalUrl, {
      method: 'GET',
      token: this.token,
    });
  }

  // POST请求
  async post<T>(url: string, data?: unknown): Promise<T> {
    return request<T>(url, {
      method: 'POST',
      body: data,
      token: this.token,
    });
  }

  // PUT请求
  async put<T>(url: string, data?: unknown): Promise<T> {
    return request<T>(url, {
      method: 'PUT',
      body: data,
      token: this.token,
    });
  }

  // DELETE请求
  async delete<T>(url: string): Promise<T> {
    return request<T>(url, {
      method: 'DELETE',
      token: this.token,
    });
  }

  // 文件上传
  async upload<T>(url: string, formData: FormData): Promise<T> {
    return request<T>(url, {
      method: 'POST',
      body: formData,
      token: this.token,
      timeout: REQUEST_CONFIG.TIMEOUT.UPLOAD,
      headers: REQUEST_CONFIG.UPLOAD_HEADERS(this.token),
    });
  }

  // 下载文件
  async download(url: string): Promise<Blob> {
    const response = await fetch(url, {
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
    });

    if (!response.ok) {
      throw new ApiError(`下载失败: ${response.statusText}`, response.status);
    }

    return response.blob();
  }
}

// 默认API客户端实例
export const apiClient = new ApiClient();

// 管理员API客户端实例
export const adminApiClient = new ApiClient();

// 便捷的API调用函数
export const api = {
  // 🎨 公共接口
  keywords: {
    get: () => apiClient.get<ApiResponse<Array<{ keyword: string; clickCount: number }>>>(
      API_ENDPOINTS.PUBLIC.KEYWORDS.GET
    ),
    click: (keyword: string) => apiClient.post<ApiResponse>(
      API_ENDPOINTS.PUBLIC.KEYWORDS.POST,
      { keyword }
    ),
  },

  search: (params: {
    q: string;
    page?: number;
    limit?: number;
    sort?: string;
    category?: string;
    // 新增的筛选参数
    tags?: string;
    difficulty?: string;
    ageRange?: string;
    features?: string;
    style?: string;
    quality?: string;
    [key: string]: string | number | boolean | undefined; // 允许额外的筛选参数
  }) => {
    // 过滤掉 undefined 值
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;
    return apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.SEARCH, filteredParams);
  },

  coloring: {
    detail: (id: number, params?: { source?: string; ref?: string }) => 
      apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.DETAIL(id), params),
    download: (id: number, params?: { format?: string; size?: string }) =>
      apiClient.download(buildUrlWithParams(API_ENDPOINTS.PUBLIC.COLORING.DOWNLOAD(id), params || {})),
    view: (id: number, data: { source?: string; ref?: string }) =>
      apiClient.post<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.VIEW(id), data),
    like: (id: number) => apiClient.post<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.LIKE(id)),
    unlike: (id: number) => apiClient.delete<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.LIKE(id)),
    share: (id: number, data: { platform: string; source?: string }) =>
      apiClient.post<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.SHARE(id), data),
    favorite: (id: number) => apiClient.post<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.FAVORITE(id)),
    unfavorite: (id: number) => apiClient.delete<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.FAVORITE(id)),
    rate: (id: number, rating: number) =>
      apiClient.post<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.RATE(id), { rating }),
    stats: (id: number) => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING.STATS(id)),
  },

  banners: {
    getActive: () => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.BANNERS.ACTIVE),
  },

  popular: {
    homepage: (limit?: number) => apiClient.get<ApiResponse>(
      API_ENDPOINTS.PUBLIC.POPULAR.HOMEPAGE,
      limit ? { limit } : undefined
    ),
    list: (params: {
      page?: number;
      limit?: number;
      category?: string;
      sort?: string;
    }) => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.POPULAR.LIST, params),
    stats: (period?: string) => apiClient.get<ApiResponse>(
      API_ENDPOINTS.PUBLIC.POPULAR.STATS,
      period ? { period } : undefined
    ),
  },

  categories: {
    list: () => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.CATEGORIES.LIST),
    detail: (slug: string) => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.CATEGORIES.DETAIL(slug)),
    pages: (params: {
      slug: string;
      page?: number;
      limit?: number;
      sort?: string;
      q?: string;
    }) => {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([key, value]) => key === 'slug' || (value !== undefined && value !== ''))
      ) as Record<string, string | number | boolean>;
      
      const { slug, ...queryParams } = filteredParams;
      return apiClient.get<ApiResponse>(
        API_ENDPOINTS.PUBLIC.CATEGORIES.DETAIL(slug as string), 
        queryParams
      );
    },
  },

  themeParks: {
    list: () => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.THEME_PARKS.LIST),
    detail: (slug: string, params?: {
      q?: string;
      page?: number;
      limit?: number;
      sort?: string;
      difficulty?: string;
      ageRange?: string;
    }) => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.THEME_PARKS.DETAIL(slug), params),
  },

  coloringBooks: {
    list: () => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING_BOOKS.LIST),
    detail: (slug: string) => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.COLORING_BOOKS.DETAIL(slug)),
  },

  auth: {
    register: (data: {
      email: string;
      password: string;
      name: string;
      confirmPassword: string;
    }) => apiClient.post<ApiResponse>(API_ENDPOINTS.PUBLIC.AUTH.REGISTER, data),
    login: (data: { email: string; password: string }) =>
      apiClient.post<ApiResponse>(API_ENDPOINTS.PUBLIC.AUTH.LOGIN, data),
    logout: () => apiClient.post<ApiResponse>(API_ENDPOINTS.PUBLIC.AUTH.LOGOUT),
    me: () => apiClient.get<ApiResponse>(API_ENDPOINTS.PUBLIC.AUTH.ME),
  },

  upload: {
    image: (formData: FormData) => apiClient.upload<ApiResponse>(
      API_ENDPOINTS.PUBLIC.UPLOAD.IMAGE,
      formData
    ),
  },

  // 🔐 管理员接口
  admin: {
    auth: {
      login: (data: { email: string; password: string }) =>
        apiClient.post<ApiResponse>(API_ENDPOINTS.ADMIN.AUTH.LOGIN, data),
    },

    keywords: {
      list: () => adminApiClient.get<ApiResponse>(API_ENDPOINTS.ADMIN.KEYWORDS.LIST),
      create: (data: {
        keyword: string;
        displayOrder: number;
        isActive: boolean;
        startDate?: string;
        endDate?: string;
      }) => adminApiClient.post<ApiResponse>(API_ENDPOINTS.ADMIN.KEYWORDS.CREATE, data),
      update: (data: {
        id: number;
        keyword?: string;
        displayOrder?: number;
        isActive?: boolean;
        startDate?: string;
        endDate?: string;
      }) => adminApiClient.put<ApiResponse>(API_ENDPOINTS.ADMIN.KEYWORDS.UPDATE, data),
      delete: (id: number) => adminApiClient.delete<ApiResponse>(
        buildUrlWithParams(API_ENDPOINTS.ADMIN.KEYWORDS.DELETE, { id })
      ),
    },

    banners: {
      list: () => adminApiClient.get<ApiResponse>(API_ENDPOINTS.ADMIN.BANNERS.LIST),
      create: (data: {
        name: string;
        description?: string;
        autoPlayInterval: number;
        images: Array<{
          imageUrl: string;
          title: string;
          subtitle?: string;
          description?: string;
          clickUrl?: string;
          order: number;
        }>;
      }) => adminApiClient.post<ApiResponse>(API_ENDPOINTS.ADMIN.BANNERS.CREATE, data),
      update: (data: {
        id: number;
        name?: string;
        description?: string;
        autoPlayInterval?: number;
        isActive?: boolean;
        images?: Array<{
          id?: number;
          imageUrl: string;
          title: string;
          subtitle?: string;
          description?: string;
          clickUrl?: string;
          order: number;
        }>;
      }) => adminApiClient.put<ApiResponse>(API_ENDPOINTS.ADMIN.BANNERS.UPDATE, data),
      delete: (id: number) => adminApiClient.delete<ApiResponse>(
        buildUrlWithParams(API_ENDPOINTS.ADMIN.BANNERS.DELETE, { id })
      ),
      setActive: (id: number) => adminApiClient.post<ApiResponse>(
        API_ENDPOINTS.ADMIN.BANNERS.SET_ACTIVE,
        { id }
      ),
    },

    stats: {
      overview: (period?: string) => adminApiClient.get<ApiResponse>(
        API_ENDPOINTS.ADMIN.STATS.OVERVIEW,
        period ? { period } : undefined
      ),
      popularPages: (params?: {
        limit?: number;
        sortBy?: string;
        period?: string;
      }) => adminApiClient.get<ApiResponse>(API_ENDPOINTS.ADMIN.STATS.POPULAR_PAGES, params),
      categories: (period?: string) => adminApiClient.get<ApiResponse>(
        API_ENDPOINTS.ADMIN.STATS.CATEGORIES,
        period ? { period } : undefined
      ),
      export: (params?: {
        format?: string;
        type?: string;
        period?: string;
      }) => adminApiClient.download(buildUrlWithParams(API_ENDPOINTS.ADMIN.STATS.EXPORT, params || {})),
    },
  },
};

export default api; 