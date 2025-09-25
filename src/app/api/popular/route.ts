import { NextRequest, NextResponse } from 'next/server';

// 热门涂色页面数据接口
interface PopularColoringPage {
  id: number;
  title: string;
  description: string;
  primaryCategoryId: number;
  thumbnailUrl: string;
  previewUrl: string | null;
  originalUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  fileFormat: string;
  fileSize: number | null;
  status: string;
  downloads: number;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
  tags: string[];
  primaryCategory: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
  isLiked: boolean;
  isFavorited: boolean;
}

// TODO: 替换为真实的数据库查询
async function getPopularPagesFromDatabase(): Promise<PopularColoringPage[]> {
  try {
    // 这里应该是真实的数据库查询
    // 例如: const pages = await db.coloringPages.findMany({
    //   where: { status: 'published' },
    //   orderBy: { downloads: 'desc' },
    //   include: { primaryCategory: true }
    // });
    
    // 暂时返回空数组，需要连接到真实数据库
    console.warn('⚠️ Popular API: 请连接到真实数据库以获取热门涂色页面数据');
    return [];
  } catch (error) {
    console.error('❌ 获取热门涂色页面数据失败:', error);
    return [];
  }
}

// 临时保留的示例数据（仅用于开发测试）
const examplePopularPages: PopularColoringPage[] = [
  {
    id: 8,
    title: "可爱小狗涂色页",
    description: "一只可爱的小狗正在玩耍，适合儿童练习涂色技巧",
    primaryCategoryId: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=800&fit=crop",
    previewUrl: null,
    originalUrl: "/files/coloring/cute-dog-high-res.pdf",
    difficulty: "easy",
    ageRange: "3-8岁",
    fileFormat: "png",
    fileSize: 2048000,
    status: "published",
    downloads: 1250,
    likes: 186,
    views: 3420,
    createdAt: "2025-01-15T09:01:59.000Z",
    updatedAt: "2025-01-15T09:01:59.000Z",
    categoryName: "动物",
    categorySlug: "animals",
    categoryColor: "#FF6B6B",
    tags: [],
    primaryCategory: {
      id: 1,
      name: "动物",
      slug: "animals",
      color: "#FF6B6B"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 106,
    title: "海底世界探险",
    description: "神秘的海底世界，有各种海洋生物和珊瑚礁",
    primaryCategoryId: 8,
    thumbnailUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/underwater-adventure-high-res.pdf",
    difficulty: "medium",
    ageRange: "6-12岁",
    fileFormat: "pdf",
    fileSize: 2800000,
    status: "published",
    downloads: 2150,
    likes: 334,
    views: 4650,
    createdAt: "2025-01-14T11:29:10.000Z",
    updatedAt: "2025-01-14T11:29:10.000Z",
    categoryName: "海洋",
    categorySlug: "ocean",
    categoryColor: "#74B9FF",
    tags: [],
    primaryCategory: {
      id: 8,
      name: "海洋",
      slug: "ocean",
      color: "#74B9FF"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 107,
    title: "太空冒险之旅",
    description: "宇航员在太空中的奇妙冒险，包含行星和飞船",
    primaryCategoryId: 7,
    thumbnailUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/space-adventure-high-res.pdf",
    difficulty: "hard",
    ageRange: "8-15岁",
    fileFormat: "pdf",
    fileSize: 3200000,
    status: "published",
    downloads: 1850,
    likes: 275,
    views: 3980,
    createdAt: "2025-01-13T11:29:10.000Z",
    updatedAt: "2025-01-13T11:29:10.000Z",
    categoryName: "太空",
    categorySlug: "space",
    categoryColor: "#FFEAA7",
    tags: [],
    primaryCategory: {
      id: 7,
      name: "太空",
      slug: "space",
      color: "#FFEAA7"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 110,
    title: "魔法森林",
    description: "充满魔法的神秘森林，有精灵和魔法生物",
    primaryCategoryId: 3,
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/magic-forest-high-res.pdf",
    difficulty: "medium",
    ageRange: "6-14岁",
    fileFormat: "pdf",
    fileSize: 2900000,
    status: "published",
    downloads: 1680,
    likes: 245,
    views: 4250,
    createdAt: "2025-01-12T11:29:10.000Z",
    updatedAt: "2025-01-12T11:29:10.000Z",
    categoryName: "幻想",
    categorySlug: "fantasy",
    categoryColor: "#6BCF7F",
    tags: [],
    primaryCategory: {
      id: 3,
      name: "幻想",
      slug: "fantasy",
      color: "#6BCF7F"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 108,
    title: "森林里的小动物",
    description: "可爱的森林小动物们在树林中玩耍",
    primaryCategoryId: 5,
    thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/forest-animals-high-res.pdf",
    difficulty: "easy",
    ageRange: "3-8岁",
    fileFormat: "pdf",
    fileSize: 2400000,
    status: "published",
    downloads: 1980,
    likes: 298,
    views: 4230,
    createdAt: "2025-01-11T11:29:10.000Z",
    updatedAt: "2025-01-11T11:29:10.000Z",
    categoryName: "自然",
    categorySlug: "nature",
    categoryColor: "#45B7D1",
    tags: [],
    primaryCategory: {
      id: 5,
      name: "自然",
      slug: "nature",
      color: "#45B7D1"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 111,
    title: "超级英雄城市",
    description: "超级英雄保护城市的激动人心场景",
    primaryCategoryId: 10,
    thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/superhero-city-high-res.pdf",
    difficulty: "hard",
    ageRange: "8-16岁",
    fileFormat: "pdf",
    fileSize: 3100000,
    status: "published",
    downloads: 1450,
    likes: 198,
    views: 3180,
    createdAt: "2025-01-10T11:29:10.000Z",
    updatedAt: "2025-01-10T11:29:10.000Z",
    categoryName: "超级英雄",
    categorySlug: "superheroes",
    categoryColor: "#E17055",
    tags: [],
    primaryCategory: {
      id: 10,
      name: "超级英雄",
      slug: "superheroes",
      color: "#E17055"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 109,
    title: "恐龙时代",
    description: "史前恐龙的世界，各种恐龙在古老的大地上生活",
    primaryCategoryId: 6,
    thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/dinosaur-era-high-res.pdf",
    difficulty: "medium",
    ageRange: "5-12岁",
    fileFormat: "pdf",
    fileSize: 3500000,
    status: "published",
    downloads: 1580,
    likes: 223,
    views: 3420,
    createdAt: "2025-01-09T11:29:10.000Z",
    updatedAt: "2025-01-09T11:29:10.000Z",
    categoryName: "史前动物",
    categorySlug: "prehistoric",
    categoryColor: "#96CEB4",
    tags: [],
    primaryCategory: {
      id: 6,
      name: "史前动物",
      slug: "prehistoric",
      color: "#96CEB4"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 112,
    title: "农场生活",
    description: "快乐的农场生活，有各种农场动物和农作物",
    primaryCategoryId: 13,
    thumbnailUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/farm-life-high-res.pdf",
    difficulty: "easy",
    ageRange: "4-10岁",
    fileFormat: "pdf",
    fileSize: 2200000,
    status: "published",
    downloads: 1380,
    likes: 189,
    views: 2950,
    createdAt: "2025-01-08T11:29:10.000Z",
    updatedAt: "2025-01-08T11:29:10.000Z",
    categoryName: "农场",
    categorySlug: "farm",
    categoryColor: "#55A3FF",
    tags: [],
    primaryCategory: {
      id: 13,
      name: "农场",
      slug: "farm",
      color: "#55A3FF"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 113,
    title: "公主城堡",
    description: "美丽的公主在梦幻城堡中的故事",
    primaryCategoryId: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/princess-castle-high-res.pdf",
    difficulty: "medium",
    ageRange: "5-12岁",
    fileFormat: "pdf",
    fileSize: 2700000,
    status: "published",
    downloads: 1720,
    likes: 256,
    views: 3750,
    createdAt: "2025-01-07T11:29:10.000Z",
    updatedAt: "2025-01-07T11:29:10.000Z",
    categoryName: "童话",
    categorySlug: "fairy-tale",
    categoryColor: "#FD79A8",
    tags: [],
    primaryCategory: {
      id: 2,
      name: "童话",
      slug: "fairy-tale",
      color: "#FD79A8"
    },
    isLiked: false,
    isFavorited: false
  },
  {
    id: 114,
    title: "圣诞快乐",
    description: "温馨的圣诞节场景，有圣诞老人和礼物",
    primaryCategoryId: 9,
    thumbnailUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop",
    previewUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=600&fit=crop",
    originalUrl: "/files/coloring/christmas-joy-high-res.pdf",
    difficulty: "easy",
    ageRange: "3-10岁",
    fileFormat: "pdf",
    fileSize: 2500000,
    status: "published",
    downloads: 1320,
    likes: 176,
    views: 2840,
    createdAt: "2025-01-06T11:29:10.000Z",
    updatedAt: "2025-01-06T11:29:10.000Z",
    categoryName: "节日",
    categorySlug: "holidays",
    categoryColor: "#E84393",
    tags: [],
    primaryCategory: {
      id: 9,
      name: "节日",
      slug: "holidays",
      color: "#E84393"
    },
    isLiked: false,
    isFavorited: false
  }
];

// 热门页面搜索函数
async function searchPopularPages(
  query: string = '',
  category: string = '',
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'popular'
) {
  // 从数据库获取数据，如果获取失败则使用示例数据
  const allPages = await getPopularPagesFromDatabase();
  let filteredPages = allPages.length > 0 ? [...allPages] : [...examplePopularPages];

  // 关键词搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    filteredPages = filteredPages.filter(page => 
      page.title.toLowerCase().includes(searchTerm) ||
      page.description.toLowerCase().includes(searchTerm) ||
      page.categoryName.toLowerCase().includes(searchTerm) ||
      page.categorySlug.toLowerCase().includes(searchTerm)
    );
  }

  // 分类筛选
  if (category && category !== 'all') {
    filteredPages = filteredPages.filter(page => 
      page.categorySlug === category || page.categoryName.toLowerCase() === category.toLowerCase()
    );
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
    default:
      // 默认按热门程度排序（下载量 + 点赞数）
      filteredPages.sort((a, b) => (b.downloads + b.likes) - (a.downloads + a.likes));
      break;
  }

  // 分页
  const totalCount = filteredPages.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPages = filteredPages.slice(startIndex, endIndex);

  return {
    items: paginatedPages,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    },
    filters: {
      sort: sortBy
    }
  };
}

// GET - 获取热门涂色页面列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sort') || 'popular';

    // 参数验证
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { success: false, error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // 执行搜索
    const searchResults = await searchPopularPages(query, category, page, limit, sortBy);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      data: searchResults,
      message: `获取热门页面成功，共找到 ${searchResults.pagination.totalCount} 个结果`
    });

  } catch (error) {
    console.error('Popular pages error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 