// 涂色卡片收藏（favorite）功能助手
import { fetchWithIP } from './clientIP';

const API_BASE_URL = 'http://localhost:3001';

/**
 * 收藏涂色卡片（需要登录）
 * 
 * @param coloringPageId - 涂色卡片 ID
 * @returns Promise<{ success: boolean; message: string }>
 */
export async function favoriteColoringPage(coloringPageId: number) {
  try {
    // 检查用户是否登录
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('请先登录');
    }
    
    
    // 调用接口（自动添加 IP 地址）
    const response = await fetchWithIP(`${API_BASE_URL}/api/favorites/${coloringPageId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '收藏失败');
    }
    
    const data = await response.json();
    
    
    return {
      success: true,
      message: data.message || '收藏成功',
    };
  } catch (error) {
    throw error;
  }
}

/**
 * 取消收藏涂色卡片（需要登录）
 * 
 * @param coloringPageId - 涂色卡片 ID
 * @returns Promise<{ success: boolean; message: string }>
 */
export async function unfavoriteColoringPage(coloringPageId: number) {
  try {
    // 检查用户是否登录
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('请先登录');
    }
    
    
    // 调用接口（自动添加 IP 地址）
    const response = await fetchWithIP(`${API_BASE_URL}/api/favorites/${coloringPageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '取消收藏失败');
    }
    
    const data = await response.json();
    
    
    return {
      success: true,
      message: data.message || '取消收藏成功',
    };
  } catch (error) {
    throw error;
  }
}

/**
 * 切换收藏状态
 * - 如果当前已收藏，则取消收藏
 * - 如果当前未收藏，则添加收藏
 * 
 * @param coloringPageId - 涂色卡片 ID
 * @param currentlyFavorited - 当前是否已收藏
 * @returns Promise<{ success: boolean; message: string; isFavorited: boolean }>
 */
export async function toggleFavorite(coloringPageId: number, currentlyFavorited: boolean) {
  try {
    if (currentlyFavorited) {
      await unfavoriteColoringPage(coloringPageId);
      return {
        success: true,
        message: '取消收藏成功',
        isFavorited: false,
      };
    } else {
      await favoriteColoringPage(coloringPageId);
      return {
        success: true,
        message: '收藏成功',
        isFavorited: true,
      };
    }
  } catch (error) {
    throw error;
  }
}

/**
 * 检查用户是否已登录
 * @returns boolean
 */
export function isUserLoggedIn(): boolean {
  return !!localStorage.getItem('authToken');
}

/**
 * 获取我的收藏列表
 * 
 * @param page - 页码
 * @param limit - 每页数量
 * @returns Promise<{ success: boolean; data: any; pagination: any }>
 */
export async function getMyFavorites(page: number = 1, limit: number = 20) {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('请先登录');
    }
    
    const response = await fetchWithIP(`${API_BASE_URL}/api/favorites?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '获取收藏列表失败');
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw error;
  }
}

