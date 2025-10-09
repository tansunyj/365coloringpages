import { NextRequest, NextResponse } from 'next/server';

// 管理员认证函数
function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  // 这里应该验证JWT token，暂时简单检查
  return token.length > 0;
}

// 主题公园数据接口
interface ThemePark {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  brandColor: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdByAdmin?: string;
  createdAt: string;
  updatedAt: string;
  pageCount: number;
}

// 临时数据存储（实际项目中应该连接数据库）
let themeParks: ThemePark[] = [
  {
    id: 1,
    name: '迪士尼世界',
    slug: 'disney-world',
    description: '迪士尼世界主题涂色页面合集，包含迪士尼经典角色和场景',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    brandColor: '#0066CC',
    sortOrder: 1,
    isActive: true,
    seoTitle: '迪士尼世界涂色页面 - 经典角色涂色',
    seoDescription: '迪士尼世界主题涂色页面，包含米奇、唐老鸭等经典角色，适合儿童涂色练习',
    createdByAdmin: 'admin@365coloringpages.com',
    createdAt: '2025-01-08T10:00:00.000Z',
    updatedAt: '2025-01-08T10:00:00.000Z',
    pageCount: 15
  },
  {
    id: 2,
    name: '环球影城',
    slug: 'universal-studios',
    description: '环球影城主题涂色页面合集，包含电影主题和角色',
    coverUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    brandColor: '#1E88E5',
    sortOrder: 2,
    isActive: true,
    seoTitle: '环球影城涂色页面 - 电影主题涂色',
    seoDescription: '环球影城主题涂色页面，包含各种电影角色和场景，适合电影爱好者',
    createdByAdmin: 'admin@365coloringpages.com',
    createdAt: '2025-01-08T10:00:00.000Z',
    updatedAt: '2025-01-08T10:00:00.000Z',
    pageCount: 12
  }
];

// GET - 获取特定主题公园详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const parkId = parseInt(id);

    if (isNaN(parkId)) {
      return NextResponse.json(
        { success: false, error: '无效的主题公园ID' },
        { status: 400 }
      );
    }

    // 查找主题公园
    const park = themeParks.find(p => p.id === parkId);
    if (!park) {
      return NextResponse.json(
        { success: false, error: '主题公园不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: park,
      message: '主题公园详情获取成功'
    });
  } catch (error) {
    console.error('获取主题公园详情失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// PUT - 更新特定主题公园
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const parkId = parseInt(id);

    if (isNaN(parkId)) {
      return NextResponse.json(
        { success: false, error: '无效的主题公园ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, slug, description, coverUrl, brandColor, sortOrder, isActive, seoTitle, seoDescription } = body;

    // 查找要更新的主题公园
    const parkIndex = themeParks.findIndex(park => park.id === parkId);
    if (parkIndex === -1) {
      return NextResponse.json(
        { success: false, error: '主题公园不存在' },
        { status: 404 }
      );
    }

    // 验证名称（如果提供）
    if (name !== undefined) {
      if (!name || typeof name !== 'string') {
        return NextResponse.json(
          { success: false, error: '主题公园名称不能为空' },
          { status: 400 }
        );
      }

      // 检查名称是否与其他主题公园重复
      const existingByName = themeParks.find(park => 
        park.name.toLowerCase() === name.toLowerCase() && park.id !== parkId
      );
      if (existingByName) {
        return NextResponse.json(
          { success: false, error: '该主题公园名称已存在' },
          { status: 400 }
        );
      }
    }

    // 验证标识符（如果提供）
    if (slug !== undefined) {
      if (!slug || typeof slug !== 'string') {
        return NextResponse.json(
          { success: false, error: '主题公园标识符不能为空' },
          { status: 400 }
        );
      }

      // 检查标识符是否与其他主题公园重复
      const existingBySlug = themeParks.find(park => 
        park.slug.toLowerCase() === slug.toLowerCase() && park.id !== parkId
      );
      if (existingBySlug) {
        return NextResponse.json(
          { success: false, error: '该主题公园标识符已存在' },
          { status: 400 }
        );
      }
    }

    // 更新主题公园
    const updatedPark = {
      ...themeParks[parkIndex],
      ...(name !== undefined && { name: name.trim() }),
      ...(slug !== undefined && { slug: slug.trim() }),
      ...(description !== undefined && { description }),
      ...(coverUrl !== undefined && { coverUrl }),
      ...(brandColor !== undefined && { brandColor }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isActive !== undefined && { isActive }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
      updatedAt: new Date().toISOString()
    };

    themeParks[parkIndex] = updatedPark;

    return NextResponse.json({
      success: true,
      data: updatedPark,
      message: '主题公园更新成功'
    });
  } catch (error) {
    console.error('更新主题公园失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// DELETE - 删除特定主题公园
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const parkId = parseInt(id);

    if (isNaN(parkId)) {
      return NextResponse.json(
        { success: false, error: '无效的主题公园ID' },
        { status: 400 }
      );
    }

    // 查找要删除的主题公园
    const parkIndex = themeParks.findIndex(park => park.id === parkId);
    if (parkIndex === -1) {
      return NextResponse.json(
        { success: false, error: '主题公园不存在' },
        { status: 404 }
      );
    }

    // 检查是否有关联的涂色页面
    const park = themeParks[parkIndex];
    if (park.pageCount > 0) {
      return NextResponse.json(
        { success: false, error: '该主题公园下还有涂色页面，无法删除' },
        { status: 409 }
      );
    }

    // 删除主题公园
    const deletedPark = themeParks.splice(parkIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedPark,
      message: '主题公园删除成功'
    });
  } catch (error) {
    console.error('删除主题公园失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
