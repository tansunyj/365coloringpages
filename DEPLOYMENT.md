# Cloudflare Pages 部署指南

## 🚀 快速部署步骤

### 方式一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 `Pages` 部分

2. **创建新项目**
   - 点击 `Create a project`
   - 选择 `Connect to Git`
   - 连接您的 GitHub/GitLab 仓库

3. **配置构建设置**
   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   Root directory: (留空，除非项目在子目录中)
   ```

4. **环境变量设置**
   - `NODE_VERSION`: 18
   - `NPM_FLAGS`: --version (可选)

5. **部署**
   - 点击 `Save and Deploy`
   - Cloudflare 会自动构建和部署您的项目

### 方式二：使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **部署项目**
   ```bash
   # 构建项目
   npm run build
   
   # 部署到 Cloudflare Pages
   wrangler pages deploy out --project-name=365coloringpages
   ```

## 🔧 关键配置文件

### next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',           // 启用静态导出
  trailingSlash: true,        // 添加尾部斜杠
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,        // 禁用图片优化（静态导出必需）
  },
};

export default nextConfig;
```

### public/_redirects
```
/* /index.html 200
```

### wrangler.toml (可选)
```toml
name = "365coloringpages"
compatibility_date = "2023-05-18"

[build]
command = "npm run build"
cwd = ""
watchPaths = ["src/**/*"]

[build.environment]
NODE_VERSION = "18"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

## 🚨 常见问题解决

### 1. 404 错误
- **原因**: SPA 路由问题
- **解决**: 确保 `_redirects` 文件在 `public` 目录中，内容为 `/* /index.html 200`

### 2. 中文字符显示问题
- **原因**: 编码问题
- **解决**: 确保所有文件使用 UTF-8 编码

### 3. 图片无法显示
- **原因**: Next.js 图片优化在静态导出中不可用
- **解决**: 在 `next.config.ts` 中设置 `images: { unoptimized: true }`

### 4. CSS 样式丢失
- **原因**: 构建配置问题
- **解决**: 确保 `output: 'export'` 正确设置

## 📁 部署文件结构

构建后的 `out` 目录应包含：
```
out/
├── _next/           # Next.js 静态资源
├── 404.html         # 404 页面
├── index.html       # 主页面
├── index.txt        # 索引文件
├── _redirects       # 重定向规则
└── static assets    # 其他静态资源
```

## 🌐 自定义域名

1. 在 Cloudflare Pages 项目设置中添加自定义域名
2. 配置 DNS 记录指向 Cloudflare
3. 等待 SSL 证书自动生成

## 📊 监控和分析

- 使用 Cloudflare Analytics 监控网站性能
- 配置 Web Vitals 跟踪用户体验
- 设置错误监控和日志记录

---

如果遇到其他问题，请检查：
1. 构建日志中的错误信息
2. 浏览器控制台的错误
3. Cloudflare Pages 的部署日志