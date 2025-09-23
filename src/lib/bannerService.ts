// Banner service for managing homepage banner carousel data

// API response types
interface ApiBannerImage {
  id?: number;
  imageUrl?: string;
  image_url?: string;
  url?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  clickUrl?: string;
  click_url?: string;
  order?: number;
}

export interface BannerImage {
  id: number;
  imageUrl: string;
  title: string;
  subtitle?: string;
  description?: string;
  clickUrl?: string;
  order: number; // 在轮播中的顺序
}

export interface BannerGroup {
  id: number;
  name: string; // 组名称，如"春季主题组"
  description?: string;
  isActive: boolean; // 是否为当前激活的组
  images: BannerImage[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  autoPlayInterval: number; // 自动播放间隔（毫秒）
}

// Mock data for demo purposes
// In a real application, this would fetch from an API or database
const mockBannerGroups: BannerGroup[] = [
  {
    id: 1,
    name: '节日主题轮播',
    description: '包含圣诞节、万圣节、复活节等节日主题的轮播组',
    isActive: true,
    autoPlayInterval: 3000,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
    createdBy: '管理员',
    images: [
      {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&h=400&fit=crop',
        title: 'Christmas Coloring Pages',
        subtitle: 'Magical holiday designs for festive fun',
        description: '圣诞主题涂色页，感受节日的魔法',
        clickUrl: '/categories/christmas',
        order: 1
      },
      {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1509557965043-36ce8a4540b1?w=1200&h=400&fit=crop',
        title: 'Halloween Spooky Collection',
        subtitle: 'Spooky and fun designs for Halloween',
        description: '万圣节主题涂色页，享受恐怖的乐趣',
        clickUrl: '/categories/halloween',
        order: 2
      },
      {
        id: 3,
        imageUrl: 'https://images.unsplash.com/photo-1553531580-33306b7223d7?w=1200&h=400&fit=crop',
        title: 'Easter Spring Celebration',
        subtitle: 'Beautiful spring and Easter themes',
        description: '复活节春季主题，美丽的春天庆典',
        clickUrl: '/categories/easter',
        order: 3
      },
      {
        id: 4,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
        title: 'Summer Beach Fun',
        subtitle: 'Sunny beach and ocean adventures',
        description: '夏日海滩乐趣，阳光海洋冒险',
        clickUrl: '/categories/summer',
        order: 4
      },
      {
        id: 5,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
        title: 'Magical Unicorns',
        subtitle: 'Enchanting unicorn coloring adventures',
        description: '神奇独角兽，迷人的涂色冒险',
        clickUrl: '/categories/unicorns',
        order: 5
      }
    ]
  },
  {
    id: 2,
    name: '动物主题轮播',
    description: '各种可爱动物主题的轮播组',
    isActive: false,
    autoPlayInterval: 4000,
    createdAt: '2024-03-10',
    updatedAt: '2024-03-12',
    createdBy: '管理员',
    images: [
      {
        id: 6,
        imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&h=400&fit=crop',
        title: 'Wild Animals Safari',
        subtitle: 'Explore the wild kingdom',
        description: '野生动物探险，探索野生王国',
        clickUrl: '/categories/wild-animals',
        order: 1
      },
      {
        id: 7,
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&h=400&fit=crop',
        title: 'Farm Animals',
        subtitle: 'Friendly farm creatures',
        description: '农场动物，友好的农场生物',
        clickUrl: '/categories/farm-animals',
        order: 2
      }
    ]
  }
];

// Get the currently active banner group
export const getActiveBannerGroup = async (): Promise<BannerGroup | null> => {
  try {
    // 调用后端API获取banners数据
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${apiBaseUrl}/api/banners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 添加错误处理和超时
      signal: AbortSignal.timeout(5000), // 5秒超时
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // 检查返回数据格式并转换为我们的BannerGroup格式
    if (data && data.success && data.data) {
      const apiData = data.data;
      
      // 转换API数据为BannerGroup格式
      const bannerGroup: BannerGroup = {
        id: apiData.id || 1,
        name: apiData.name || 'API Banner Group',
        description: apiData.description || '来自后端API的轮播组',
        isActive: apiData.isActive !== false, // 默认为true
        autoPlayInterval: apiData.autoPlayInterval || 3000,
        createdAt: apiData.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: apiData.updatedAt || new Date().toISOString().split('T')[0],
        createdBy: apiData.createdBy || 'API',
        images: Array.isArray(apiData.images) ? apiData.images.map((img: ApiBannerImage, index: number) => ({
          id: img.id || index,
          imageUrl: img.imageUrl || img.image_url || img.url,
          title: img.title || `Banner ${index + 1}`,
          subtitle: img.subtitle || '',
          description: img.description || '',
          clickUrl: img.clickUrl || img.click_url || '',
          order: img.order || index + 1
        })) : []
      };

      // 确保至少有一张图片
      if (bannerGroup.images.length === 0) {
        console.warn('API returned no banner images, using fallback');
        return null;
      }

      console.log('Successfully loaded banner data from API:', bannerGroup);
      return bannerGroup;
    } else {
      console.warn('API response format is invalid:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching banners from API:', error);
    
    // API调用失败时，返回null让Hero组件使用默认数据
    return null;
  }
};

// Get all banner groups
export const getAllBannerGroups = async (): Promise<BannerGroup[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockBannerGroups;
};

// Get default banner group fallback
export const getDefaultBannerGroup = (): BannerGroup => {
  return {
    id: 0,
    name: '默认轮播组',
    description: '系统默认的轮播组',
    isActive: true,
    autoPlayInterval: 3000,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    createdBy: '系统',
    images: [
      {
        id: 0,
        imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        title: '发现无限创意',
        subtitle: 'Unleash Your Creativity',
        description: '数千种精美的免费涂色页，适合儿童和成人',
        clickUrl: '/categories',
        order: 1
      }
    ]
  };
}; 