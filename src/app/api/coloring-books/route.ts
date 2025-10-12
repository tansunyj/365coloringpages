import { NextRequest, NextResponse } from 'next/server';

// 涂色书数据接口 - 与真实API保持一致
interface ColoringBook {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  type: string;
  pageCount: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

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
async function getColoringBooksFromDatabase(): Promise<ColoringBook[]> {
  try {
    // 这里应该是真实的数据库查询
    // 例如: const books = await db.coloringBooks.findMany({
    //   where: { isActive: true },
    //   orderBy: { displayOrder: 'asc' }
    // });
    
    // 暂时返回空数组，需要连接到真实数据库
    return [];
  } catch (error) {
    console.error('❌ 获取涂色书数据失败:', error);
    return [];
  }
}

async function getColoringBookPagesFromDatabase(): Promise<ColoringBookPage[]> {
  try {
    // 这里应该是真实的数据库查询
    // 例如: const pages = await db.coloringPages.findMany({
    //   where: { type: 'first-coloring-book', status: 'published' },
    //   include: { coloringBook: true }
    // });
    
    // 暂时返回空数组，需要连接到真实数据库
    return [];
  } catch (error) {
    console.error('❌ 获取涂色书页面数据失败:', error);
    return [];
  }
}

// 临时保留的示例数据（仅用于开发测试）- 与真实API格式保持一致
const exampleColoringBooks: ColoringBook[] = [
  {
    id: 1,
    title: "我的第一本涂色书",
    slug: "first-coloring-book",
    description: "适合初学者的简单涂色页面",
    coverImage: "http://www.baidu.com",
    type: "first-coloring",
    pageCount: 2,
    isActive: true,
    displayOrder: 1,
    createdAt: "2025-09-16T09:19:46.000Z",
    updatedAt: "2025-09-20T14:58:04.000Z"
  },
  {
    id: 2,
    title: "最新涂色页面",
    slug: "latest-pages",
    description: "最新上传的涂色页面合集",
    coverImage: "http://www.baidu.com",
    type: "latest",
    pageCount: 8,
    isActive: true,
    displayOrder: 2,
    createdAt: "2025-09-16T09:19:46.000Z",
    updatedAt: "2025-09-20T14:58:04.000Z"
  },
  {
    id: 3,
    title: "热门涂色页面",
    slug: "popular-pages",
    description: "最受欢迎的涂色页面合集",
    coverImage: "http://www.baidu.com",
    type: "popular",
    pageCount: 5,
    isActive: true,
    displayOrder: 3,
    createdAt: "2025-09-16T09:19:46.000Z",
    updatedAt: "2025-09-20T14:58:07.000Z"
  }
];

const exampleColoringBookPages: ColoringBookPage[] = [
  // first-coloring-book 涂色书的页面 - 模拟真实API格式
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
  // 其他涂色书的页面
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
  }
];

// 搜索和筛选涂色书页面函数
async function searchColoringBookPages(
  query: string = '',
  book: string = '',
  page: number = 1,
  limit: number = 15,
  sortBy: string = 'newest'
) {
  // 从数据库获取数据，如果获取失败则使用示例数据
  const allPages = await getColoringBookPagesFromDatabase();
  let filteredPages = allPages.length > 0 ? [...allPages] : [...exampleColoringBookPages];

  // 关键词搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredPages = filteredPages.filter(page => 
      page.title.toLowerCase().includes(searchTerm) ||
      page.description.toLowerCase().includes(searchTerm) ||
      page.categoryName.toLowerCase().includes(searchTerm)
    );
  }

  // 涂色书筛选 - 根据bookSlug筛选
  if (book && book !== 'all') {
    filteredPages = filteredPages.filter(page => page.bookSlug === book);
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
      book,
      sortBy
    }
  };
}

// GET - 根据查询参数返回涂色书列表或涂色书页面
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 检查是否是获取涂色书列表的请求
    // 当book参数为空或者没有其他查询参数时，返回涂色书列表
    const book = searchParams.get('book') || '';
    const query = searchParams.get('q') || '';
    const isListRequest = (!book || book === '') && (!query || query === '') && !searchParams.has('page');
    
    if (isListRequest) {
      // 返回涂色书列表
      const allBooks = await getColoringBooksFromDatabase();
      const books = allBooks.length > 0 ? allBooks : exampleColoringBooks;
      
      // 获取分页参数
      const limit = parseInt(searchParams.get('limit') || '20');
      const page = parseInt(searchParams.get('page') || '1');
      const sort = searchParams.get('sort') || 'popular';
      
      // 根据排序方式排序
      const sortedBooks = [...books];
      if (sort === 'popular') {
        sortedBooks.sort((a, b) => a.displayOrder - b.displayOrder);
      } else if (sort === 'newest') {
        sortedBooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      // 分页处理
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBooks = sortedBooks.slice(startIndex, endIndex);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return NextResponse.json({
        success: true,
        data: {
          books: paginatedBooks,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(sortedBooks.length / limit),
            totalCount: sortedBooks.length,
            limit: limit,
            hasNextPage: endIndex < sortedBooks.length,
            hasPrevPage: page > 1,
            startRecord: startIndex + 1,
            endRecord: Math.min(endIndex, sortedBooks.length)
          },
          filters: {
            query: '',
            book: '',
            sort: sort
          },
          meta: {
            totalResults: sortedBooks.length
          }
        },
        message: '获取活跃涂色书成功'
      });
    } else {
      // 返回涂色书页面
      const query = searchParams.get('q') || '';
      const book = searchParams.get('book') || '';
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
      const searchResults = await searchColoringBookPages(query, book, page, limit, sortBy);

      // 获取对应的涂色书信息
      const allBooks = await getColoringBooksFromDatabase();
      const books = allBooks.length > 0 ? allBooks : exampleColoringBooks;
      const targetBook = books.find(b => b.slug === book);

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      // 构造和真实API一致的响应格式
      return NextResponse.json({
        success: true,
        data: {
          pages: searchResults.items,  // 将items重命名为pages
          pagination: searchResults.pagination,
          filters: searchResults.filters,
          meta: {
            searchTime: 0,
            totalResults: searchResults.pagination.totalCount
          },
          book: targetBook || books[0]  // 添加涂色书信息
        },
        message: targetBook ? 
          `获取涂色书"${targetBook.title}"的页面列表成功` : 
          `获取涂色书页面成功，共找到 ${searchResults.pagination.totalCount} 个结果`
      });
    }

  } catch (error) {
    console.error('Coloring books error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 