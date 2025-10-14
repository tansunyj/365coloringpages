# 博客文章组件使用指南

## 📁 文件结构

```
src/
├── components/blog/
│   ├── ChristmasColoringPages.tsx ✅
│   ├── HalloweenColoringPages.tsx ✅
│   ├── AdultColoringPages.tsx ✅
│   ├── UnicornColoringPages.tsx ✅
│   ├── CuteColoringPages.tsx ✅
│   └── ... (其他20篇文章待创建)
│
├── data/
│   └── blogArticles.ts (文章元数据配置)
│
└── app/blog/
    ├── page.tsx (博客列表页)
    └── [slug]/page.tsx (文章详情页)
```

## ✅ 已完成的文章 (5/25)

1. ✅ ChristmasColoringPages.tsx - 圣诞节涂色
2. ✅ HalloweenColoringPages.tsx - 万圣节涂色
3. ✅ AdultColoringPages.tsx - 成人涂色
4. ✅ UnicornColoringPages.tsx - 独角兽涂色
5. ✅ CuteColoringPages.tsx - 可爱涂色

## 📝 待创建的文章 (20/25)

按优先级排序：

### 高优先级（季节性）
- [ ] ThanksgivingColoringPages.tsx - 感恩节
- [ ] SpringColoringPages.tsx - 春天
- [ ] SummerColoringPages.tsx - 夏天
- [ ] FallColoringPages.tsx - 秋天
- [ ] EasterColoringPages.tsx - 复活节

### 主题文章
- [ ] FlowerColoringPages.tsx - 花朵
- [ ] PrincessColoringPages.tsx - 公主
- [ ] CatColoringPages.tsx - 猫
- [ ] DinosaurColoringPages.tsx - 恐龙
- [ ] AnimalColoringPages.tsx - 动物
- [ ] DogColoringPages.tsx - 狗
- [ ] ButterflyColoringPages.tsx - 蝴蝶
- [ ] DragonColoringPages.tsx - 龙

### 指南文章
- [ ] ColoringPagesGuide.tsx - 终极指南
- [ ] SingleColoringPage.tsx - 单页涂色
- [ ] FreePrintableColoringPages.tsx - 免费可打印
- [ ] EasyColoringPages.tsx - 简单涂色
- [ ] SimpleColoringPages.tsx - 简洁涂色

### 教育文章
- [ ] MandalaColoringPages.tsx - 曼陀罗

## 🎨 创建新文章步骤

### 1. 创建文章组件

在 `src/components/blog/` 创建新的 `.tsx` 文件：

```tsx
// src/components/blog/YourArticle.tsx
import Image from 'next/image';

export default function YourArticle() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {/* 引言段落 */}
      <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
        你的文章引言...
      </p>

      {/* 插图占位符 */}
      <div className="my-8 rounded-xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-xxxxx?w=1200&h=600&fit=crop"
          alt="描述性文字"
          width={1200}
          height={600}
          className="w-full h-auto"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          AI Image Prompt: "详细的文生图提示词，描述需要生成的图片内容、风格、氛围等"
        </p>
      </div>

      {/* 文章内容 */}
      <h2>主要标题</h2>
      <p>内容...</p>
      
      {/* 更多内容... */}
    </div>
  );
}
```

### 2. 在 `blogArticles.ts` 中添加元数据

确保在 `src/data/blogArticles.ts` 中已有对应的文章元数据。

### 3. 在动态路由中导入组件

编辑 `src/app/blog/[slug]/page.tsx`：

```tsx
import YourArticle from '@/components/blog/YourArticle';

const articleComponents: Record<string, React.ComponentType> = {
  // ... 其他文章
  'your-article-slug': YourArticle,
};
```

## 🖼️ 图片占位符使用指南

### Unsplash 图片 URL 格式

```
https://images.unsplash.com/photo-{PHOTO_ID}?w=1200&h=600&fit=crop
```

### 推荐主题 Photo IDs

- 圣诞: `1512909595-83c1c4e0e3e7`
- 万圣节: `1509715513011-e394f0cb20c4`
- 可爱/卡通: `1425082661705-1834bfd09dca`
- 自然/花朵: `1490730141103-6cac27aaab94`
- 艺术/涂色: `1513364776144-60967b0f800f`
- 儿童活动: `1558618666-fcd25c85cd64`

### AI 文生图提示词模板

```
AI Image Prompt: "[主题] with [具体元素], [风格描述], [氛围/情感], 
[技术要求如'suitable for coloring page', 'detailed illustration', etc.]"
```

示例：
```
AI Image Prompt: "Magical unicorn in enchanted forest with rainbow mane and flowers, 
whimsical dreamy atmosphere, fantasy illustration style suitable for coloring page"
```

## 🎨 样式组件使用

### 信息框（带背景色）

```tsx
<div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-xl my-6">
  <h4 className="text-purple-800 dark:text-purple-300 mt-0">标题</h4>
  <p className="mb-0">内容...</p>
</div>
```

### 引用块

```tsx
<blockquote className="border-l-4 border-purple-500 pl-4 italic my-6">
  引用文字内容
</blockquote>
```

### 网格布局（多列）

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  <div className="bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
    <h4 className="text-pink-800 dark:text-pink-300">标题</h4>
    <p className="text-sm mb-0">内容</p>
  </div>
  {/* 更多列... */}
</div>
```

### 渐变背景框

```tsx
<div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 p-8 rounded-xl my-8">
  <h3 className="mt-0">标题</h3>
  <p>内容...</p>
</div>
```

### CTA 按钮

```tsx
<div className="my-8 p-6 bg-purple-100 dark:bg-gray-700 rounded-xl">
  <h3 className="mt-0 text-purple-800 dark:text-purple-300">标题</h3>
  <p className="mb-4">描述...</p>
  <a 
    href="/categories/christmas" 
    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
  >
    按钮文字 →
  </a>
</div>
```

## 📊 颜色主题对照表

| 主题 | 主色 | 深色模式 | 使用场景 |
|------|------|----------|----------|
| 紫色 | `purple-600` | `purple-400` | 通用、魔法主题 |
| 粉色 | `pink-600` | `pink-400` | 可爱、公主主题 |
| 蓝色 | `blue-600` | `blue-400` | 冬天、水主题 |
| 绿色 | `green-600` | `green-400` | 春天、自然主题 |
| 橙色 | `orange-600` | `orange-400` | 万圣节、秋天 |
| 红色 | `red-600` | `red-400` | 圣诞、情人节 |

## ✅ 质量检查清单

创建新文章时确保：

- [ ] 引言段落（text-xl 样式）
- [ ] 至少3-5张图片占位符
- [ ] 每张图片都有 AI 文生图提示词
- [ ] 使用多样化的布局（信息框、引用、网格等）
- [ ] H2 和 H3 标题结构清晰
- [ ] 包含 CTA（行动号召）按钮
- [ ] 深色模式兼容
- [ ] 响应式设计（使用 Tailwind 响应式类）
- [ ] 自然的关键词融入（不强调搜索量）
- [ ] 充满感情的叙述风格

## 🚀 快速开始

1. 复制已完成的文章组件作为模板
2. 根据新主题修改内容
3. 更新图片和 AI 提示词
4. 在 `[slug]/page.tsx` 中导入
5. 测试深色/浅色模式
6. 检查响应式布局
7. 确保 SEO 友好

## 📝 示例参考

最佳实践示例：
- `ChristmasColoringPages.tsx` - 完整结构参考
- `AdultColoringPages.tsx` - 教育性内容参考
- `UnicornColoringPages.tsx` - 幻想主题参考
- `CuteColoringPages.tsx` - 可爱风格参考

