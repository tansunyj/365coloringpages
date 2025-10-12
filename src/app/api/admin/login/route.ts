import { NextRequest, NextResponse } from 'next/server';

// 动态导入配置文件，如果不存在则使用默认配置
async function getAdminConfig() {
  try {
    const config = await import('../../../../../admin.config');
    return config;
  } catch (error) {
    // 如果配置文件不存在，使用默认配置
    console.warn('admin.config.ts not found, using default config');
    return {
      adminConfig: {
        email: 'admin@365coloringpages.com',
        password: 'admin123456',
        name: '管理员',
        role: 'superadmin'
      },
      jwtSecret: 'default-jwt-secret'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // 获取管理员配置
    const { adminConfig } = await getAdminConfig();

    // 添加调试信息

    // 验证管理员账号
    if (email === adminConfig.email && password === adminConfig.password) {
      // 创建管理员用户信息（不包含密码）
      const adminUser = {
        id: 1,
        email: adminConfig.email,
        name: adminConfig.name,
        role: adminConfig.role
      };

      // 生成简单的令牌（实际生产环境建议使用JWT）
      const token = `admin-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        data: {
          token,
          user: adminUser
        },
        message: '管理员登录成功'
      });
    } else {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
} 