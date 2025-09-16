import { NextResponse } from 'next/server';

// 热门关键词接口
interface Keyword {
  id: number;
  keyword: string;
  displayOrder: number;
  isActive: boolean;
  clickCount: number;
  startDate?: string;
  endDate?: string;
}

// 模拟数据（实际项目中应该从数据库获取）
const keywords: Keyword[] = [
  {
    id: 1,
    keyword: '小狗',
    displayOrder: 1,
    isActive: true,
    clickCount: 234
  },
  {
    id: 2,
    keyword: '公主',
    displayOrder: 2,
    isActive: true,
    clickCount: 189
  },
  {
    id: 3,
    keyword: '独角兽',
    displayOrder: 3,
    isActive: true,
    clickCount: 156
  },
  {
    id: 4,
    keyword: '汽车',
    displayOrder: 4,
    isActive: false,
    clickCount: 134
  },
  {
    id: 5,
    keyword: '花朵',
    displayOrder: 5,
    isActive: true,
    clickCount: 167
  },
  {
    id: 6,
    keyword: '恐龙',
    displayOrder: 6,
    isActive: true,
    clickCount: 145
  }
];

// GET - 获取活跃的热门关键词
export async function GET() {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // 只返回激活状态且在有效时间段内的关键词，按显示顺序排序
    const activeKeywords = keywords
      .filter(keyword => {
        if (!keyword.isActive) return false;
        
        // 检查开始时间
        if (keyword.startDate && keyword.startDate > currentDate) return false;
        
        // 检查结束时间
        if (keyword.endDate && keyword.endDate < currentDate) return false;
        
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(({ keyword, clickCount }) => ({ keyword, clickCount })); // 只返回必要的字段

    return NextResponse.json({
      success: true,
      data: activeKeywords
    });
  } catch (error) {
    console.error('获取热门关键词失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// POST - 记录关键词点击（用于统计）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword } = body;

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { success: false, error: '无效的关键词' },
        { status: 400 }
      );
    }

    // 查找关键词并增加点击计数
    const keywordData = keywords.find(k => 
      k.keyword.toLowerCase() === keyword.toLowerCase() && k.isActive
    );

    if (keywordData) {
      keywordData.clickCount += 1;
    }

    return NextResponse.json({
      success: true,
      message: '点击记录成功'
    });
  } catch (error) {
    console.error('记录关键词点击失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 