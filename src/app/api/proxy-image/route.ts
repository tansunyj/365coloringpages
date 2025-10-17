import { NextRequest, NextResponse } from 'next/server';

/**
 * 图片代理 API
 * 用于绕过 CORS 限制，代理外部图片请求
 */
export async function GET(request: NextRequest) {
  try {
    // 从查询参数中获取图片 URL
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少图片 URL 参数' },
        { status: 400 }
      );
    }

    // 验证 URL 是否来自允许的域名
    try {
      const url = new URL(imageUrl);
      const allowedDomains = [
        'image.365coloringpages.com',
        '365coloringpages.com',
        // AI 图片生成服务域名
        'pfst.cf2.poecdn.net',                          // Poe AI
        'oaidalleapiprodscus.blob.core.windows.net',   // OpenAI DALL-E
        'replicate.delivery',                           // Replicate
        'temp-storage.ai.com',                          // 临时AI存储
        'cdn.openai.com',                               // OpenAI CDN
        'imagedelivery.net',                            // Cloudflare Images
      ];
      
      if (!allowedDomains.some(domain => url.hostname.endsWith(domain))) {
        console.warn('⚠️ 不允许的图片域名:', url.hostname);
        return NextResponse.json(
          { error: `不允许的图片域名: ${url.hostname}` },
          { status: 403 }
        );
      }
      
      console.log('✅ 允许代理图片:', url.hostname);
    } catch (urlError) {
      return NextResponse.json(
        { error: '无效的图片 URL' },
        { status: 400 }
      );
    }

    // 获取图片
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `无法获取图片: ${imageResponse.statusText}` },
        { status: imageResponse.status }
      );
    }

    // 获取图片数据
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';

    // 返回图片数据，并设置适当的响应头
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('代理图片失败:', error);
    return NextResponse.json(
      { error: '代理图片失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理 OPTIONS 请求（CORS 预检）
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

