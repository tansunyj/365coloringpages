import { NextRequest, NextResponse } from 'next/server';

// 涂色页面数据接口
interface ColoringPage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  categorySlug: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  downloads: number;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据库数据（实际项目中应该从数据库获取）
const mockColoringPages: ColoringPage[] = [
  {
    id: 1,
    title: '可爱小狗涂色页',
    description: '一只可爱的小狗正在玩耍，适合儿童练习涂色技巧',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop',
    category: '动物',
    categorySlug: 'animals',
    tags: ['狗', '宠物', '可爱', '儿童'],
    difficulty: 'easy',
    downloads: 1250,
    likes: 186,
    views: 3420,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    title: '美丽公主城堡',
    description: '童话中的公主城堡，充满梦幻色彩的宫殿设计',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    category: '童话',
    categorySlug: 'fairy-tale',
    tags: ['公主', '城堡', '童话', '梦幻'],
    difficulty: 'medium',
    downloads: 890,
    likes: 124,
    views: 2180,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: 3,
    title: '彩虹独角兽',
    description: '神奇的独角兽在彩虹下奔跑，充满魔法色彩',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: '幻想',
    categorySlug: 'fantasy',
    tags: ['独角兽', '彩虹', '魔法', '幻想'],
    difficulty: 'medium',
    downloads: 1680,
    likes: 245,
    views: 4250,
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13'
  },
  {
    id: 4,
    title: '汽车竞速赛',
    description: '刺激的赛车比赛场景，适合喜欢汽车的孩子',
    imageUrl: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=400&fit=crop',
    category: '交通工具',
    categorySlug: 'vehicles',
    tags: ['汽车', '赛车', '速度', '竞赛'],
    difficulty: 'hard',
    downloads: 760,
    likes: 98,
    views: 1890,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: 5,
    title: '美丽花朵花园',
    description: '绽放的花朵和蝴蝶的花园场景',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: '自然',
    categorySlug: 'nature',
    tags: ['花朵', '花园', '蝴蝶', '自然'],
    difficulty: 'easy',
    downloads: 1120,
    likes: 167,
    views: 2850,
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11'
  },
  {
    id: 6,
    title: '恐龙世界探险',
    description: '史前恐龙世界的冒险之旅',
    imageUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop',
    category: '史前动物',
    categorySlug: 'prehistoric',
    tags: ['恐龙', '史前', '冒险', '探险'],
    difficulty: 'hard',
    downloads: 980,
    likes: 134,
    views: 2340,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: 7,
    title: '太空火箭冒险',
    description: '宇宙飞船在星空中的冒险旅程',
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
    category: '太空',
    categorySlug: 'space',
    tags: ['火箭', '太空', '星星', '宇宙'],
    difficulty: 'medium',
    downloads: 650,
    likes: 89,
    views: 1560,
    createdAt: '2024-01-09',
    updatedAt: '2024-01-09'
  },
  {
    id: 8,
    title: '海底世界探索',
    description: '神秘的海底世界，各种海洋生物',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    category: '海洋',
    categorySlug: 'ocean',
    tags: ['海洋', '鱼', '海底', '探索'],
    difficulty: 'easy',
    downloads: 1340,
    likes: 198,
    views: 3120,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    id: 9,
    title: '森林小动物聚会',
    description: '森林里的小动物们在开心地聚会',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    category: '动物',
    categorySlug: 'animals',
    tags: ['森林', '动物', '聚会', '友谊'],
    difficulty: 'medium',
    downloads: 820,
    likes: 115,
    views: 2090,
    createdAt: '2024-01-07',
    updatedAt: '2024-01-07'
  },
  {
    id: 10,
    title: '圣诞节快乐',
    description: '圣诞老人和他的礼物袋',
    imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop',
    category: '节日',
    categorySlug: 'holidays',
    tags: ['圣诞节', '圣诞老人', '礼物', '节日'],
    difficulty: 'easy',
    downloads: 1580,
    likes: 234,
    views: 3890,
    createdAt: '2024-01-06',
    updatedAt: '2024-01-06'
  },
  {
    id: 11,
    title: '超级英雄城市',
    description: '超级英雄在城市中拯救世界',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: '超级英雄',
    categorySlug: 'superhero',
    tags: ['英雄', '城市', '拯救', '超能力'],
    difficulty: 'hard',
    downloads: 720,
    likes: 101,
    views: 1780,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    id: 12,
    title: '美味水果拼盘',
    description: '各种新鲜水果的美味组合',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop',
    category: '食物',
    categorySlug: 'food',
    tags: ['水果', '健康', '美味', '营养'],
    difficulty: 'easy',
    downloads: 950,
    likes: 142,
    views: 2340,
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04'
  },
  {
    id: 13,
    title: '魔法师学院',
    description: '魔法师学院里的神奇场景',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: '魔法',
    categorySlug: 'magic',
    tags: ['魔法', '学院', '巫师', '神奇'],
    difficulty: 'hard',
    downloads: 640,
    likes: 87,
    views: 1560,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  },
  {
    id: 14,
    title: '农场快乐时光',
    description: '农场里的动物和农夫的快乐生活',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=400&fit=crop',
    category: '农场',
    categorySlug: 'farm',
    tags: ['农场', '动物', '农夫', '乡村'],
    difficulty: 'medium',
    downloads: 840,
    likes: 123,
    views: 2180,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: 15,
    title: '生日派对庆祝',
    description: '生日蛋糕和气球的庆祝场面',
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop',
    category: '庆祝',
    categorySlug: 'celebration',
    tags: ['生日', '蛋糕', '气球', '庆祝'],
    difficulty: 'easy',
    downloads: 1180,
    likes: 175,
    views: 2890,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// 搜索函数
function searchColoringPages(
  query: string,
  page: number = 1,
  limit: number = 12,
  sortBy: string = 'relevance',
  category?: string
) {
  let filteredPages = [...mockColoringPages];

  // 关键词搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    filteredPages = filteredPages.filter(page => 
      page.title.toLowerCase().includes(searchTerm) ||
      page.description.toLowerCase().includes(searchTerm) ||
      page.category.toLowerCase().includes(searchTerm) ||
      page.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // 分类筛选
  if (category && category !== 'all') {
    filteredPages = filteredPages.filter(page => page.category === category);
  }

  // 排序
  switch (sortBy) {
    case 'newest':
      filteredPages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'popular':
      filteredPages.sort((a, b) => b.likes - a.likes);
      break;
    case 'downloads':
      filteredPages.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'relevance':
    default:
      // 相关性排序（简化实现：按标题匹配度）
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        filteredPages.sort((a, b) => {
          const aScore = a.title.toLowerCase().includes(searchTerm) ? 2 : 
                        a.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ? 1 : 0;
          const bScore = b.title.toLowerCase().includes(searchTerm) ? 2 : 
                        b.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ? 1 : 0;
          return bScore - aScore;
        });
      }
      break;
  }

  // 分页
  const totalCount = filteredPages.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPages = filteredPages.slice(startIndex, endIndex);

  return {
    pages: paginatedPages,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages
  };
}

// GET - 搜索涂色页面
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sort') || 'relevance';
    const category = searchParams.get('category') || '';

    // 参数验证
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { success: false, error: '无效的分页参数' },
        { status: 400 }
      );
    }

    // 执行搜索
    const searchResults = searchColoringPages(query, page, limit, sortBy, category);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: searchResults,
      query: query
    });

  } catch (error) {
    console.error('搜索错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// POST - 记录搜索行为（用于分析和优化）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, resultCount, clickedItemId } = body;

    // 这里可以记录搜索行为用于分析
    console.log('搜索记录:', {
      query,
      resultCount,
      clickedItemId,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: '搜索记录已保存'
    });

  } catch (error) {
    console.error('记录搜索行为失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 