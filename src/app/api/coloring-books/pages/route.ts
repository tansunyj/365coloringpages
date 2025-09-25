import { NextRequest, NextResponse } from 'next/server';

// 涂色书页面数据接口 - 与真实API保持一致
interface ColoringBookPage {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  views: number;
  likes: number;
  downloads: number;
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
  createdAt: string;
  isLiked: boolean;
  isFavorited: boolean;
  bookId: number;
  bookTitle: string;
  bookSlug: string;
  bookType: string;
}

// TODO: 替换为真实的数据库查询
async function getColoringBookPagesFromDatabase(): Promise<ColoringBookPage[]> {
  try {
    // 这里应该连接到真实的数据库
    // const pages = await db.coloringBookPages.findMany();
    // return pages;
    console.log('📚 尝试从数据库获取涂色书页面数据...');
    return [];
  } catch (error) {
    console.error('❌ 获取涂色书页面数据失败:', error);
    return [];
  }
}

// 示例涂色书页面数据 - 与真实API格式完全一致
const exampleColoringBookPages: ColoringBookPage[] = [
  // bookId: 1, bookSlug: "first-coloring-book" 的页面
  {
    id: 108,
    title: "森林里的小动物",
    description: "可爱的森林小动物们在树林中玩耍",
    thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    difficulty: "easy",
    ageRange: "3-8岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "自然",
    categorySlug: "nature",
    categoryColor: "#45B7D1",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 1,
    bookTitle: "我的第一本涂色书",
    bookSlug: "first-coloring-book",
    bookType: "first-coloring"
  },
  {
    id: 112,
    title: "农场生活",
    description: "快乐的农场生活，有各种农场动物和农作物",
    thumbnailUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=400&fit=crop",
    difficulty: "easy",
    ageRange: "4-10岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "农场",
    categorySlug: "farm",
    categoryColor: "#55A3FF",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 1,
    bookTitle: "我的第一本涂色书",
    bookSlug: "first-coloring-book",
    bookType: "first-coloring"
  },
  // bookId: 2, bookSlug: "latest-pages" 的页面
  {
    id: 106,
    title: "海底世界探险",
    description: "神秘的海底世界，有各种海洋生物和珊瑚礁",
    thumbnailUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    difficulty: "medium",
    ageRange: "6-12岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "海洋",
    categorySlug: "ocean",
    categoryColor: "#74B9FF",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 2,
    bookTitle: "最新涂色页面",
    bookSlug: "latest-pages",
    bookType: "latest"
  },
  {
    id: 107,
    title: "太空冒险之旅",
    description: "宇航员在太空中的奇妙冒险，包含行星和飞船",
    thumbnailUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
    difficulty: "hard",
    ageRange: "8-15岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "太空",
    categorySlug: "space",
    categoryColor: "#FFEAA7",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 2,
    bookTitle: "最新涂色页面",
    bookSlug: "latest-pages",
    bookType: "latest"
  },
  {
    id: 109,
    title: "恐龙时代",
    description: "史前恐龙的世界，各种恐龙在古老的大地上生活",
    thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    difficulty: "medium",
    ageRange: "5-12岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "史前动物",
    categorySlug: "prehistoric",
    categoryColor: "#96CEB4",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 2,
    bookTitle: "最新涂色页面",
    bookSlug: "latest-pages",
    bookType: "latest"
  },
  {
    id: 110,
    title: "魔法森林",
    description: "充满魔法的神秘森林，有精灵和魔法生物",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    difficulty: "medium",
    ageRange: "6-14岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "幻想",
    categorySlug: "fantasy",
    categoryColor: "#6BCF7F",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 2,
    bookTitle: "最新涂色页面",
    bookSlug: "latest-pages",
    bookType: "latest"
  },
  {
    id: 111,
    title: "超级英雄城市",
    description: "超级英雄保护城市的激动人心场景",
    thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    difficulty: "hard",
    ageRange: "8-16岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "超级英雄",
    categorySlug: "superheroes",
    categoryColor: "#E17055",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 2,
    bookTitle: "最新涂色页面",
    bookSlug: "latest-pages",
    bookType: "latest"
  },
  {
    id: 113,
    title: "节日庆典",
    description: "各种节日庆祝活动的欢乐场景",
    thumbnailUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
    difficulty: "medium",
    ageRange: "5-12岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "节日",
    categorySlug: "holidays",
    categoryColor: "#FD79A8",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 2,
    bookTitle: "最新涂色页面",
    bookSlug: "latest-pages",
    bookType: "latest"
  },
  // bookId: 3, bookSlug: "popular-pages" 的页面
  {
    id: 106,
    title: "海底世界探险",
    description: "神秘的海底世界，有各种海洋生物和珊瑚礁",
    thumbnailUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    difficulty: "medium",
    ageRange: "6-12岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "海洋",
    categorySlug: "ocean",
    categoryColor: "#74B9FF",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 3,
    bookTitle: "热门涂色页面",
    bookSlug: "popular-pages",
    bookType: "popular"
  },
  {
    id: 107,
    title: "太空冒险之旅",
    description: "宇航员在太空中的奇妙冒险，包含行星和飞船",
    thumbnailUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
    difficulty: "hard",
    ageRange: "8-15岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "太空",
    categorySlug: "space",
    categoryColor: "#FFEAA7",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 3,
    bookTitle: "热门涂色页面",
    bookSlug: "popular-pages",
    bookType: "popular"
  },
  {
    id: 109,
    title: "恐龙时代",
    description: "史前恐龙的世界，各种恐龙在古老的大地上生活",
    thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    difficulty: "medium",
    ageRange: "5-12岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "史前动物",
    categorySlug: "prehistoric",
    categoryColor: "#96CEB4",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 3,
    bookTitle: "热门涂色页面",
    bookSlug: "popular-pages",
    bookType: "popular"
  },
  {
    id: 110,
    title: "魔法森林",
    description: "充满魔法的神秘森林，有精灵和魔法生物",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    difficulty: "medium",
    ageRange: "6-14岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "幻想",
    categorySlug: "fantasy",
    categoryColor: "#6BCF7F",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 3,
    bookTitle: "热门涂色页面",
    bookSlug: "popular-pages",
    bookType: "popular"
  },
  {
    id: 113,
    title: "节日庆典",
    description: "各种节日庆祝活动的欢乐场景",
    thumbnailUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
    difficulty: "medium",
    ageRange: "5-12岁",
    views: 0,
    likes: 0,
    downloads: 0,
    categoryName: "节日",
    categorySlug: "holidays",
    categoryColor: "#FD79A8",
    createdAt: "2025-09-22T11:29:10.000Z",
    isLiked: false,
    isFavorited: false,
    bookId: 3,
    bookTitle: "热门涂色页面",
    bookSlug: "popular-pages",
    bookType: "popular"
  }
];

// 搜索和筛选涂色书页面函数
async function searchColoringBookPages(
  query: string = '',
  book: string = '',
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'popular'
) {
  // 从数据库获取数据，如果获取失败则使用示例数据
  const allPages = await getColoringBookPagesFromDatabase();
  let filteredPages = allPages.length > 0 ? [...allPages] : [...exampleColoringBookPages];

  console.log('🔍 搜索参数:', { query, book, page, limit, sortBy });
  console.log('📄 原始页面数量:', filteredPages.length);

  // 关键词搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredPages = filteredPages.filter(page =>
      page.title.toLowerCase().includes(searchTerm) ||
      page.description.toLowerCase().includes(searchTerm) ||
      page.categoryName.toLowerCase().includes(searchTerm)
    );
    console.log('🔍 关键词筛选后页面数量:', filteredPages.length);
  }

  // 涂色书筛选 - 根据bookSlug筛选
  if (book && book !== 'all' && book !== '') {
    filteredPages = filteredPages.filter(page => page.bookSlug === book);
    console.log(`📚 涂色书筛选 (${book}) 后页面数量:`, filteredPages.length);
  }

  // 排序
  const sortedPages = [...filteredPages];
  switch (sortBy) {
    case 'popular':
      sortedPages.sort((a, b) => b.views - a.views);
      break;
    case 'newest':
      sortedPages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      sortedPages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'likes':
      sortedPages.sort((a, b) => b.likes - a.likes);
      break;
    default:
      // 默认按创建时间排序
      sortedPages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPages = sortedPages.slice(startIndex, endIndex);

  console.log('📊 分页结果:', { startIndex, endIndex, paginatedCount: paginatedPages.length });

  return {
    items: paginatedPages,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(sortedPages.length / limit),
      totalCount: sortedPages.length,
      limit: limit,
      hasNextPage: endIndex < sortedPages.length,
      hasPrevPage: page > 1,
      startRecord: startIndex + 1,
      endRecord: Math.min(endIndex, sortedPages.length)
    },
    filters: {
      query,
      book,
      sort: sortBy,
      category: ''
    }
  };
}

// GET - 获取涂色书页面列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const query = searchParams.get('q') || '';
    const book = searchParams.get('book') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sort') || 'popular';

    console.log('📚 涂色书页面API调用:', { query, book, page, limit, sortBy });

    // 参数验证
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { success: false, error: '无效的分页参数' },
        { status: 400 }
      );
    }

    // 执行搜索
    const searchResults = await searchColoringBookPages(query, book, page, limit, sortBy);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    // 构造和真实API一致的响应格式
    return NextResponse.json({
      success: true,
      data: {
        pages: searchResults.items,  // 使用 pages 字段名
        pagination: searchResults.pagination,
        filters: searchResults.filters,
        meta: {
          searchTime: 0,
          totalResults: searchResults.pagination.totalCount
        }
      },
      message: book && book !== '' ? 
        `获取涂色书"${book}"的页面列表成功` : 
        '获取所有涂色书的页面列表成功'
    });

  } catch (error) {
    console.error('❌ 涂色书页面API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 