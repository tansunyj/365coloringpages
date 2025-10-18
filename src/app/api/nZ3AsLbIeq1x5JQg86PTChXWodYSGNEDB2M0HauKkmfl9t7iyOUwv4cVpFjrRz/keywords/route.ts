import { NextRequest, NextResponse } from 'next/server';

// 热门关键词接口
interface Keyword {
  id: number;
  keyword: string;
  displayOrder: number;
  isActive: boolean;
  clickCount: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据存储（实际项目中应该使用数据库）
const keywords: Keyword[] = [
  {
    id: 1,
    keyword: '小狗',
    displayOrder: 1,
    isActive: true,
    clickCount: 234,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    keyword: '公主',
    displayOrder: 2,
    isActive: true,
    clickCount: 189,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-14'
  },
  {
    id: 3,
    keyword: '独角兽',
    displayOrder: 3,
    isActive: true,
    clickCount: 156,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-13'
  },
  {
    id: 4,
    keyword: '汽车',
    displayOrder: 4,
    isActive: false,
    clickCount: 134,
    createdAt: '2024-01-04',
    updatedAt: '2024-01-12'
  },
  {
    id: 5,
    keyword: '花朵',
    displayOrder: 5,
    isActive: true,
    clickCount: 167,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-11'
  },
  {
    id: 6,
    keyword: '恐龙',
    displayOrder: 6,
    isActive: true,
    clickCount: 145,
    createdAt: '2024-01-06',
    updatedAt: '2024-01-10'
  }
];

// 验证管理员权限
function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  // 这里应该验证JWT token
  // 简化处理，实际项目中需要完整的JWT验证
  const token = authHeader.substring(7);
  return token && token.length > 0;
}

// GET - 获取所有关键词
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      );
    }

    // 按显示顺序排序
    const sortedKeywords = keywords.sort((a, b) => a.displayOrder - b.displayOrder);

    return NextResponse.json({
      success: true,
      data: sortedKeywords
    });
  } catch (error) {
    console.error('获取关键词列表失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// POST - 创建新关键词
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { keyword, displayOrder, isActive, startDate, endDate } = body;

    // 验证输入
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { success: false, error: '关键词不能为空' },
        { status: 400 }
      );
    }

    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length < 2 || trimmedKeyword.length > 20) {
      return NextResponse.json(
        { success: false, error: '关键词长度必须在2-20字符之间' },
        { status: 400 }
      );
    }

    // 检查关键词是否已存在
    const existingKeyword = keywords.find(k => 
      k.keyword.toLowerCase() === trimmedKeyword.toLowerCase()
    );
    if (existingKeyword) {
      return NextResponse.json(
        { success: false, error: '该关键词已存在' },
        { status: 400 }
      );
    }

    // 创建新关键词
    const newKeyword: Keyword = {
      id: Math.max(...keywords.map(k => k.id), 0) + 1,
      keyword: trimmedKeyword,
      displayOrder: displayOrder || Math.max(...keywords.map(k => k.displayOrder), 0) + 1,
      isActive: isActive !== false, // 默认为true
      clickCount: 0,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    keywords.push(newKeyword);

    return NextResponse.json({
      success: true,
      data: newKeyword,
      message: '关键词创建成功'
    });
  } catch (error) {
    console.error('创建关键词失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// PUT - 更新关键词
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, keyword, displayOrder, isActive, startDate, endDate } = body;

    // 验证ID
    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { success: false, error: '无效的关键词ID' },
        { status: 400 }
      );
    }

    // 查找要更新的关键词
    const keywordIndex = keywords.findIndex(k => k.id === id);
    if (keywordIndex === -1) {
      return NextResponse.json(
        { success: false, error: '关键词不存在' },
        { status: 404 }
      );
    }

    // 验证关键词
    if (keyword !== undefined) {
      if (!keyword || typeof keyword !== 'string') {
        return NextResponse.json(
          { success: false, error: '关键词不能为空' },
          { status: 400 }
        );
      }

      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword.length < 2 || trimmedKeyword.length > 20) {
        return NextResponse.json(
          { success: false, error: '关键词长度必须在2-20字符之间' },
          { status: 400 }
        );
      }

      // 检查关键词是否与其他关键词重复
      const existingKeyword = keywords.find(k => 
        k.keyword.toLowerCase() === trimmedKeyword.toLowerCase() && k.id !== id
      );
      if (existingKeyword) {
        return NextResponse.json(
          { success: false, error: '该关键词已存在' },
          { status: 400 }
        );
      }
    }

    // 更新关键词
    const updatedKeyword = {
      ...keywords[keywordIndex],
      ...(keyword !== undefined && { keyword: keyword.trim() }),
      ...(displayOrder !== undefined && { displayOrder }),
      ...(isActive !== undefined && { isActive }),
      ...(startDate !== undefined && { startDate: startDate || undefined }),
      ...(endDate !== undefined && { endDate: endDate || undefined }),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    keywords[keywordIndex] = updatedKeyword;

    return NextResponse.json({
      success: true,
      data: updatedKeyword,
      message: '关键词更新成功'
    });
  } catch (error) {
    console.error('更新关键词失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// DELETE - 删除关键词
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '无效的关键词ID' },
        { status: 400 }
      );
    }

    // 查找要删除的关键词
    const keywordIndex = keywords.findIndex(k => k.id === id);
    if (keywordIndex === -1) {
      return NextResponse.json(
        { success: false, error: '关键词不存在' },
        { status: 404 }
      );
    }

    // 删除关键词
    const deletedKeyword = keywords.splice(keywordIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedKeyword,
      message: '关键词删除成功'
    });
  } catch (error) {
    console.error('删除关键词失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 