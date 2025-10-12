import { NextRequest, NextResponse } from 'next/server';

// 涂色页面详情数据接口 - 与真实API保持一致
interface ColoringPageDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  originalFileUrl: string;
  fileFormat: string;
  fileSize: number;
  difficulty: string;
  ageRange: string;
  theme: string;
  style: string;
  size: string;
  isPremium: number;
  isFeatured: number;
  status: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string | null;
  sourceType: string;
  createdByUser: string;
  aiPrompt: string | null;
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    color: string;
  }>;
  isLiked: boolean;
  isFavorited: boolean;
}

// TODO: 替换为真实的数据库查询
async function getColoringPageFromDatabase(id: number): Promise<ColoringPageDetail | null> {
  try {
    // 这里应该连接到真实的数据库
    // const page = await db.coloringPages.findUnique({ where: { id } });
    // return page;
    return null;
  } catch (error) {
    console.error('❌ 获取涂色页面详情失败:', error);
    return null;
  }
}

// 示例涂色页面详情数据 - 与真实API格式完全一致
const exampleColoringPages: Record<number, ColoringPageDetail> = {
  106: {
    id: 106,
    title: "海底世界探险",
    slug: "underwater-adventure",
    description: "神秘的海底世界，有各种海洋生物和珊瑚礁",
    thumbnailUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/underwater-adventure-high-res.pdf",
    fileFormat: "png",
    fileSize: 2048000,
    difficulty: "medium",
    ageRange: "6-12岁",
    theme: "Ocean",
    style: "Line Art",
    size: "A4",
    isPremium: 0,
    isFeatured: 1,
    status: "published",
    publishedAt: "2025-09-22T11:29:10.000Z",
    seoTitle: "海底世界探险涂色页",
    seoDescription: "神秘的海底世界，有各种海洋生物和珊瑚礁",
    sourceType: "admin",
    createdByUser: "system",
    aiPrompt: null,
    previewUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=800&fit=crop",
    createdAt: "2025-09-22T11:29:10.000Z",
    updatedAt: "2025-09-22T11:29:10.000Z",
    categories: [
      {
        id: 2,
        name: "海洋",
        slug: "ocean",
        color: "#74B9FF"
      }
    ],
    isLiked: false,
    isFavorited: false
  },
  107: {
    id: 107,
    title: "太空冒险之旅",
    slug: "space-adventure",
    description: "宇航员在太空中的奇妙冒险，包含行星和飞船",
    thumbnailUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/space-adventure-high-res.pdf",
    fileFormat: "png",
    fileSize: 3072000,
    difficulty: "hard",
    ageRange: "8-15岁",
    theme: "Space",
    style: "Line Art",
    size: "A4",
    isPremium: 0,
    isFeatured: 1,
    status: "published",
    publishedAt: "2025-09-22T11:29:10.000Z",
    seoTitle: "太空冒险之旅涂色页",
    seoDescription: "宇航员在太空中的奇妙冒险，包含行星和飞船",
    sourceType: "admin",
    createdByUser: "system",
    aiPrompt: null,
    previewUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=800&fit=crop",
    createdAt: "2025-09-22T11:29:10.000Z",
    updatedAt: "2025-09-22T11:29:10.000Z",
    categories: [
      {
        id: 3,
        name: "太空",
        slug: "space",
        color: "#FFEAA7"
      }
    ],
    isLiked: false,
    isFavorited: false
  },
  108: {
    id: 108,
    title: "森林里的小动物",
    slug: "forest-animals",
    description: "可爱的森林小动物们在树林中玩耍",
    thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/forest-animals-high-res.pdf",
    fileFormat: "png",
    fileSize: 1536000,
    difficulty: "easy",
    ageRange: "3-8岁",
    theme: "Nature",
    style: "Line Art",
    size: "A4",
    isPremium: 0,
    isFeatured: 1,
    status: "published",
    publishedAt: "2025-09-22T11:29:10.000Z",
    seoTitle: "森林里的小动物涂色页",
    seoDescription: "可爱的森林小动物们在树林中玩耍",
    sourceType: "admin",
    createdByUser: "system",
    aiPrompt: null,
    previewUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop",
    createdAt: "2025-09-22T11:29:10.000Z",
    updatedAt: "2025-09-22T11:29:10.000Z",
    categories: [
      {
        id: 4,
        name: "自然",
        slug: "nature",
        color: "#45B7D1"
      }
    ],
    isLiked: false,
    isFavorited: false
  },
  109: {
    id: 109,
    title: "恐龙时代",
    slug: "dinosaur-era",
    description: "史前恐龙的世界，各种恐龙在古老的大地上生活",
    thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/dinosaur-era-high-res.pdf",
    fileFormat: "png",
    fileSize: 2560000,
    difficulty: "medium",
    ageRange: "5-12岁",
    theme: "Prehistoric",
    style: "Line Art",
    size: "A4",
    isPremium: 0,
    isFeatured: 1,
    status: "published",
    publishedAt: "2025-09-22T11:29:10.000Z",
    seoTitle: "恐龙时代涂色页",
    seoDescription: "史前恐龙的世界，各种恐龙在古老的大地上生活",
    sourceType: "admin",
    createdByUser: "system",
    aiPrompt: null,
    previewUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop",
    createdAt: "2025-09-22T11:29:10.000Z",
    updatedAt: "2025-09-22T11:29:10.000Z",
    categories: [
      {
        id: 5,
        name: "史前动物",
        slug: "prehistoric",
        color: "#96CEB4"
      }
    ],
    isLiked: false,
    isFavorited: false
  },
  110: {
    id: 110,
    title: "魔法森林",
    slug: "magic-forest",
    description: "充满魔法的神秘森林，有精灵和魔法生物",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/magic-forest-high-res.pdf",
    fileFormat: "png",
    fileSize: 2304000,
    difficulty: "medium",
    ageRange: "6-14岁",
    theme: "Fantasy",
    style: "Line Art",
    size: "A4",
    isPremium: 0,
    isFeatured: 1,
    status: "published",
    publishedAt: "2025-09-22T11:29:10.000Z",
    seoTitle: "魔法森林涂色页",
    seoDescription: "充满魔法的神秘森林，有精灵和魔法生物",
    sourceType: "admin",
    createdByUser: "system",
    aiPrompt: null,
    previewUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=800&fit=crop",
    createdAt: "2025-09-22T11:29:10.000Z",
    updatedAt: "2025-09-22T11:29:10.000Z",
    categories: [
      {
        id: 6,
        name: "幻想",
        slug: "fantasy",
        color: "#6BCF7F"
      }
    ],
    isLiked: false,
    isFavorited: false
  },
  111: {
    id: 111,
    title: "超级英雄城市",
    slug: "superhero-city",
    description: "超级英雄保护城市的激动人心场景",
    thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/superhero-city-high-res.pdf",
    fileFormat: "png",
    fileSize: 2816000,
    difficulty: "hard",
    ageRange: "8-16岁",
    theme: "Superheroes",
    style: "Line Art",
    size: "A4",
    isPremium: 0,
    isFeatured: 1,
    status: "published",
    publishedAt: "2025-09-22T11:29:10.000Z",
    seoTitle: "超级英雄城市涂色页",
    seoDescription: "超级英雄保护城市的激动人心场景",
    sourceType: "admin",
    createdByUser: "system",
    aiPrompt: null,
    previewUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop",
    createdAt: "2025-09-22T11:29:10.000Z",
    updatedAt: "2025-09-22T11:29:10.000Z",
    categories: [
      {
        id: 7,
        name: "超级英雄",
        slug: "superheroes",
        color: "#E17055"
      }
    ],
    isLiked: false,
    isFavorited: false
  },
  112: {
    id: 112,
    title: "农场生活",
    slug: "farm-life",
    description: "快乐的农场生活，有各种农场动物和农作物",
    thumbnailUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/farm-life-high-res.pdf",
    fileFormat: "png",
    fileSize: 1792000,
    difficulty: "easy",
    ageRange: "4-10岁",
    theme: "Farm",
    style: "Line Art",
    size: "A4",
    isPremium: 0,
    isFeatured: 1,
    status: "published",
    publishedAt: "2025-09-22T11:29:10.000Z",
    seoTitle: "农场生活涂色页",
    seoDescription: "快乐的农场生活，有各种农场动物和农作物",
    sourceType: "admin",
    createdByUser: "system",
    aiPrompt: null,
    previewUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=800&fit=crop",
    createdAt: "2025-09-22T11:29:10.000Z",
    updatedAt: "2025-09-22T11:29:10.000Z",
    categories: [
      {
        id: 8,
        name: "农场",
        slug: "farm",
        color: "#55A3FF"
      }
    ],
    isLiked: false,
    isFavorited: false
  },
  113: {
    id: 113,
    title: "节日庆典",
    slug: "holiday-celebration",
    description: "各种节日庆祝活动的欢乐场景",
    thumbnailUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
    originalFileUrl: "/files/coloring/holiday-celebration-high-res.pdf",
    fileFormat: "png",
    fileSize: 2048000,
    difficulty: "medium",
    ageRange: "5-12岁",
    theme: "Holidays",
    style: "Line Art",
    size: "A4",
    isPremium: 0,
    isFeatured: 1,
    status: "published",
    publishedAt: "2025-09-22T11:29:10.000Z",
    seoTitle: "节日庆典涂色页",
    seoDescription: "各种节日庆祝活动的欢乐场景",
    sourceType: "admin",
    createdByUser: "system",
    aiPrompt: null,
    previewUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=800&fit=crop",
    createdAt: "2025-09-22T11:29:10.000Z",
    updatedAt: "2025-09-22T11:29:10.000Z",
    categories: [
      {
        id: 9,
        name: "节日",
        slug: "holidays",
        color: "#FD79A8"
      }
    ],
    isLiked: false,
    isFavorited: false
  }
};

// GET - 获取涂色页面详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const coloringPageId = parseInt(id);


    // 参数验证
    if (isNaN(coloringPageId) || coloringPageId <= 0) {
      return NextResponse.json(
        { success: false, error: '无效的涂色页面ID' },
        { status: 400 }
      );
    }

    // 尝试从数据库获取数据
    let coloringPage = await getColoringPageFromDatabase(coloringPageId);
    
    // 如果数据库中没有数据，使用示例数据
    if (!coloringPage) {
      coloringPage = exampleColoringPages[coloringPageId];
    }

    if (!coloringPage) {
      return NextResponse.json(
        { success: false, error: '涂色页面不存在' },
        { status: 404 }
      );
    }

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    // 构造和真实API一致的响应格式
    return NextResponse.json({
      success: true,
      data: coloringPage,
      message: `获取涂色页面"${coloringPage.title}"详情成功`
    });

  } catch (error) {
    console.error('❌ 涂色页面详情API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 