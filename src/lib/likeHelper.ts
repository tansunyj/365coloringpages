// 涂色卡片点赞（like）功能助手
import { fetchWithIP } from './clientIP';

const API_BASE_URL = 'http://localhost:3001';

/**
 * 点赞涂色卡片（需要登录）
 * - 用户必须登录才能点赞
 * 
 * @param coloringPageId - 涂色卡片 ID
 * @returns Promise<{ success: boolean; message: string; likes: number; isLiked: boolean }>
 */
export async function likeColoringPage(coloringPageId: number) {
  try {
    // 检查用户是否登录（必需）
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('请先登录才能点赞');
    }
    
    
    // 调用接口（自动添加 IP 地址）
    const response = await fetchWithIP(`${API_BASE_URL}/api/likes/${coloringPageId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '点赞失败');
    }
    
    const data = await response.json();
    
    
    return {
      success: true,
      message: data.message || '点赞成功',
      likes: data.data?.likes || 0,
      isLiked: data.data?.isLiked !== undefined ? data.data.isLiked : true, // 如果后端没返回，默认为 true
    };
  } catch (error) {
    throw error;
  }
}

/**
 * 取消点赞涂色卡片（需要登录）
 * 
 * @param coloringPageId - 涂色卡片 ID
 * @returns Promise<{ success: boolean; message: string; likes: number }>
 */
export async function unlikeColoringPage(coloringPageId: number) {
  try {
    // 检查用户是否登录
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('请先登录');
    }
    
    
    // 调用接口（自动添加 IP 地址）
    const response = await fetchWithIP(`${API_BASE_URL}/api/likes/${coloringPageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '取消点赞失败');
    }
    
    const data = await response.json();
    
    
    return {
      success: true,
      message: data.message || '取消点赞成功',
      likes: data.data?.likes || 0,
      isLiked: false,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * 切换点赞状态
 * - 如果当前已点赞，则取消点赞
 * - 如果当前未点赞，则点赞
 * 
 * @param coloringPageId - 涂色卡片 ID
 * @param currentlyLiked - 当前是否已点赞
 * @returns Promise<{ success: boolean; message: string; likes: number; isLiked: boolean }>
 */
export async function toggleLike(coloringPageId: number, currentlyLiked: boolean) {
  if (currentlyLiked) {
    return await unlikeColoringPage(coloringPageId);
  } else {
    return await likeColoringPage(coloringPageId);
  }
}

/**
 * 检查用户是否已登录
 * @returns boolean
 */
export function isUserLoggedIn(): boolean {
  return !!localStorage.getItem('authToken');
}

