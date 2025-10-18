import { NextRequest, NextResponse } from 'next/server';

// 主题公园数据接口
interface ThemePark {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  brandColor: string;
  createdAt: string;
  updatedAt: string;
}

// 主题公园涂色页面数据接口
interface ThemeParkColoringPage {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  originalFileUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  theme: string;
  parkSlug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// TODO: 替换为真实的数据库查询
async function getThemeParksFromDatabase(): Promise<ThemePark[]> {
  try {
    // 这里应该是真实的数据库查询
    // 例如: const parks = await db.themeParks.findMany({
    //   where: { isActive: true },
    //   orderBy: { displayOrder: 'asc' }
    // });
    
    // 暂时返回空数组，需要连接到真实数据库
    return [];
  } catch (error) {
    console.error('❌ 获取主题公园数据失败:', error);
    return [];
  }
}

async function getThemeParkPagesFromDatabase(): Promise<ThemeParkColoringPage[]> {
  try {
    // 这里应该是真实的数据库查询
    // 例如: const pages = await db.coloringPages.findMany({
    //   where: { type: 'theme-park', status: 'published' },
    //   include: { themePark: true }
    // });
    
    // 暂时返回空数组，需要连接到真实数据库
    return [];
  } catch (error) {
    console.error('❌ 获取主题公园涂色页面数据失败:', error);
    return [];
  }
}

// 临时保留的示例数据（仅用于开发测试）
const exampleThemeParks: ThemePark[] = [
  {
    id: 1,
    name: "Disney World",
    slug: "disney-world",
    description: "magical kingdom with beloved Disney characters",
    coverUrl: "https://images.unsplash.com/photo-1566403033175-c1c4a29e1df0?w=400&h=400&fit=crop",
    brandColor: "#FF6B9D",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Universal Studios",
    slug: "universal-studios",
    description: "movie-themed adventures and thrilling rides",
    coverUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=400&fit=crop",
    brandColor: "#4285F4",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Six Flags",
    slug: "six-flags",
    description: "extreme roller coasters and thrill rides",
    coverUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
    brandColor: "#FF4444",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z"
  }
];

const exampleThemeParkPages: ThemeParkColoringPage[] = [
  {
    id: 301,
    title: "Mickey Mouse Castle Adventure",
    description: "Join Mickey Mouse on a magical adventure through the Disney castle",
    thumbnailUrl: "https://images.unsplash.com/photo-1566403033175-c1c4a29e1df0?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/mickey-castle-high-res.pdf",
    difficulty: "easy",
    ageRange: "3-8 years",
    theme: "Disney World",
    parkSlug: "disney-world",
    status: "published",
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z"
  },
  {
    id: 302,
    title: "Jurassic Park T-Rex",
    description: "Meet the mighty T-Rex from Jurassic Park at Universal Studios",
    thumbnailUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/trex-universal-high-res.pdf",
    difficulty: "medium",
    ageRange: "6-12 years",
    theme: "Universal Studios",
    parkSlug: "universal-studios",
    status: "published",
    createdAt: "2025-01-14T14:30:00.000Z",
    updatedAt: "2025-01-14T14:30:00.000Z"
  },
  {
    id: 303,
    title: "Roller Coaster Loop",
    description: "Experience the thrilling loop of Six Flags roller coasters",
    thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/roller-coaster-high-res.pdf",
    difficulty: "hard",
    ageRange: "8-15 years",
    theme: "Six Flags",
    parkSlug: "six-flags",
    status: "published",
    createdAt: "2025-01-13T16:45:00.000Z",
    updatedAt: "2025-01-13T16:45:00.000Z"
  }
];

// 搜索和筛选主题公园涂色页面函数
async function searchThemeParkPages(
  query: string = '',
  theme: string = '',
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'newest'
) {
  // 从数据库获取数据，如果获取失败则使用示例数据
  const allPages = await getThemeParkPagesFromDatabase();
  let filteredPages = allPages.length > 0 ? [...allPages] : [...exampleThemeParkPages];

  // 关键词搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredPages = filteredPages.filter(page => 
      page.title.toLowerCase().includes(searchTerm) ||
      page.description.toLowerCase().includes(searchTerm) ||
      page.theme.toLowerCase().includes(searchTerm)
    );
  }

  // 主题筛选
  if (theme && theme !== 'all') {
    filteredPages = filteredPages.filter(page => page.parkSlug === theme);
  }

  // 排序
  switch (sortBy) {
    case 'newest':
      filteredPages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      filteredPages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'title':
      filteredPages.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'difficulty':
      const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
      filteredPages.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      break;
    default:
      // 默认按最新排序
      filteredPages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
      query,
      theme,
      sortBy
    }
  };
}

// GET - 根据查询参数返回主题公园列表或涂色页面
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 检查是否是获取主题公园列表的请求
    const isListRequest = !searchParams.has('q') && !searchParams.has('theme') && !searchParams.has('page');
    
    if (isListRequest) {
      // 返回主题公园列表
      const allParks = await getThemeParksFromDatabase();
      const parks = allParks.length > 0 ? allParks : exampleThemeParks;
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return NextResponse.json({
        success: true,
        data: parks,
        message: '主题公园列表获取成功'
      });
    } else {
      // 返回主题公园涂色页面
      const query = searchParams.get('q') || '';
      const theme = searchParams.get('theme') || '';
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const sortBy = searchParams.get('sort') || 'newest';

      // 参数验证
      if (page < 1 || limit < 1 || limit > 50) {
        return NextResponse.json(
          { success: false, error: '无效的分页参数' },
          { status: 400 }
        );
      }

      // 执行搜索
      const searchResults = await searchThemeParkPages(query, theme, page, limit, sortBy);

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      return NextResponse.json({
        success: true,
        data: searchResults,
        message: `获取主题公园页面成功，共找到 ${searchResults.pagination.totalCount} 个结果`
      });
    }

  } catch (error) {
    console.error('Theme parks error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 