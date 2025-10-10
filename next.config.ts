import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 只在生产构建时启用静态导出，开发环境使用正常模式
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  // 确保环境变量在静态导出时正确处理
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  },
};

export default nextConfig;
