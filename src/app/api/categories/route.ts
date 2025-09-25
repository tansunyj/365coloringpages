import { NextRequest, NextResponse } from 'next/server';

// 分类数据接口
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

// TODO: 替换为真实的数据库查询
async function getCategoriesFromDatabase(): Promise<Category[]> {
  try {
    // 这里应该是真实的数据库查询
    // 例如: const categories = await db.categories.findMany({
    //   where: { isActive: true },
    //   orderBy: { displayOrder: 'asc' }
    // });
    
    // 暂时返回空数组，需要连接到真实数据库
    console.warn('⚠️ Categories API: 请连接到真实数据库以获取分类数据');
    return [];
  } catch (error) {
    console.error('❌ 获取分类数据失败:', error);
    return [];
  }
}

// 临时保留的示例数据（仅用于开发测试）
const exampleCategories: Category[] = [
  {
    id: 1,
    name: 'Animals',
    slug: 'animals',
    description: 'Cute and wild animals coloring pages',
    color: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Fairy Tale',
    slug: 'fairy-tale',
    description: 'Magical fairy tale characters and scenes',
    color: 'bg-pink-500'
  },
  {
    id: 3,
    name: 'Fantasy',
    slug: 'fantasy',
    description: 'Dragons, unicorns and magical creatures',
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, trucks, planes and more',
    color: 'bg-blue-500'
  },
  {
    id: 5,
    name: 'Nature',
    slug: 'nature',
    description: 'Beautiful flowers, trees and landscapes',
    color: 'bg-green-400'
  },
  {
    id: 6,
    name: 'Prehistoric',
    slug: 'prehistoric',
    description: 'Dinosaurs and prehistoric creatures',
    color: 'bg-orange-500'
  },
  {
    id: 7,
    name: 'Space',
    slug: 'space',
    description: 'Rockets, planets and space adventures',
    color: 'bg-indigo-500'
  },
  {
    id: 8,
    name: 'Ocean',
    slug: 'ocean',
    description: 'Sea creatures and underwater scenes',
    color: 'bg-cyan-500'
  },
  {
    id: 9,
    name: 'Holidays',
    slug: 'holidays',
    description: 'Christmas, Halloween and holiday themes',
    color: 'bg-red-500'
  },
  {
    id: 10,
    name: 'Superhero',
    slug: 'superhero',
    description: 'Heroes and action-packed adventures',
    color: 'bg-yellow-500'
  },
  {
    id: 11,
    name: 'Food',
    slug: 'food',
    description: 'Delicious fruits, vegetables and treats',
    color: 'bg-orange-400'
  },
  {
    id: 12,
    name: 'Magic',
    slug: 'magic',
    description: 'Wizards, spells and magical scenes',
    color: 'bg-violet-500'
  },
  {
    id: 13,
    name: 'Farm',
    slug: 'farm',
    description: 'Farm animals and countryside scenes',
    color: 'bg-amber-500'
  },
  {
    id: 14,
    name: 'Celebration',
    slug: 'celebration',
    description: 'Birthdays, parties and celebrations',
    color: 'bg-rose-500'
  }
];

// GET - 获取分类列表
export async function GET(request: NextRequest) {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    // 从数据库获取数据，如果获取失败则使用示例数据
    const categories = await getCategoriesFromDatabase();
    const finalCategories = categories.length > 0 ? categories : exampleCategories;

    return NextResponse.json({
      success: true,
      data: finalCategories,
      message: '分类列表获取成功'
    });

  } catch (error) {
    console.error('获取分类列表错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 