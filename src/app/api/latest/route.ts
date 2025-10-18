import { NextRequest, NextResponse } from 'next/server';

// 最新涂色页面数据接口
interface LatestColoringPage {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  originalFileUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  category: string;
  categorySlug: string;
  categoryColor: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// TODO: 替换为真实的数据库查询
async function getLatestPagesFromDatabase(): Promise<LatestColoringPage[]> {
  try {
    // 这里应该是真实的数据库查询
    // 例如: const pages = await db.coloringPages.findMany({
    //   where: { status: 'published' },
    //   orderBy: { createdAt: 'desc' },
    //   include: { primaryCategory: true }
    // });
    
    // 暂时返回空数组，需要连接到真实数据库
    return [];
  } catch (error) {
    console.error('❌ 获取最新涂色页面数据失败:', error);
    return [];
  }
}

// 临时保留的示例数据（仅用于开发测试）
const exampleLatestPages: LatestColoringPage[] = [
  {
    id: 201,
    title: "森林小屋",
    description: "温馨的森林小屋，周围环绕着美丽的大自然",
    thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/forest-cottage-high-res.pdf",
    difficulty: "medium",
    ageRange: "6-12 years",
    category: "自然",
    categorySlug: "nature",
    categoryColor: "#22C55E",
    status: "published",
    createdAt: "2025-01-20T10:30:00.000Z",
    updatedAt: "2025-01-20T10:30:00.000Z"
  },
  {
    id: 202,
    title: "太空探索",
    description: "宇航员和火箭的太空冒险场景",
    thumbnailUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/space-exploration-high-res.pdf",
    difficulty: "hard",
    ageRange: "8-15 years",
    category: "太空",
    categorySlug: "space",
    categoryColor: "#3B82F6",
    status: "published",
    createdAt: "2025-01-19T15:45:00.000Z",
    updatedAt: "2025-01-19T15:45:00.000Z"
  },
  {
    id: 203,
    title: "海豚朋友",
    description: "可爱的海豚在海洋中游泳",
    thumbnailUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/dolphin-friends-high-res.pdf",
    difficulty: "easy",
    ageRange: "3-8 years",
    category: "海洋",
    categorySlug: "ocean",
    categoryColor: "#06B6D4",
    status: "published",
    createdAt: "2025-01-18T09:15:00.000Z",
    updatedAt: "2025-01-18T09:15:00.000Z"
  }
];

// 搜索和筛选函数
async function searchLatestPages(
  query: string = '',
  category: string = '',
  page: number = 1,
  limit: number = 15,
  sortBy: string = 'newest'
) {
  // 从数据库获取数据，如果获取失败则使用示例数据
  const allPages = await getLatestPagesFromDatabase();
  let filteredPages = allPages.length > 0 ? [...allPages] : [...exampleLatestPages];

  // 关键词搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredPages = filteredPages.filter(page => 
      page.title.toLowerCase().includes(searchTerm) ||
      page.description.toLowerCase().includes(searchTerm) ||
      page.category.toLowerCase().includes(searchTerm)
    );
  }

  // 分类筛选
  if (category && category !== 'all') {
    filteredPages = filteredPages.filter(page => page.categorySlug === category);
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
      category,
      sortBy
    }
  };
}

// GET - 获取最新涂色页面列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const sortBy = searchParams.get('sort') || 'newest';

    // 参数验证
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { success: false, error: '无效的分页参数' },
        { status: 400 }
      );
    }

    // 执行搜索
    const searchResults = await searchLatestPages(query, category, page, limit, sortBy);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      data: searchResults,
      message: `获取最新页面成功，共找到 ${searchResults.pagination.totalCount} 个结果`
    });

  } catch (error) {
    console.error('Latest pages error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 