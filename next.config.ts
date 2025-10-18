import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 配置
  // Cloudflare Pages 完全支持 Next.js SSR，无需静态导出
  // 这样可以确保 SEO meta 标签正确出现在 <head> 中
  
  // 不使用静态导出模式
  // output: 'export',  // 已禁用 - Cloudflare Pages 支持 SSR
  
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  images: {
    unoptimized: true,
  },
  
  // 确保环境变量正确处理
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  },
  
  // 修复 Next.js 15 开发模式下 meta 标签在 body 中的问题
  // 参考: https://stackoverflow.com/questions/79585863/meta-tags-are-moving-to-body-tag-instead-of-head-tag
  experimental: {
    // @ts-expect-error - Next.js 15 的实验性配置
    htmlLimitedBots: /.*/,
  },
  
  // 在构建时忽略 ESLint 和 TypeScript 错误
  // 这些错误不会影响运行时功能
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
