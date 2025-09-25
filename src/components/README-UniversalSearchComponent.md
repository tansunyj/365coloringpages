# UniversalSearchComponent 使用说明

## 概述

`UniversalSearchComponent` 是一个功能强大且灵活的通用搜索组件，支持多种筛选方式、自定义布局和高度可配置的选项。

## 新增功能

### 1. 左侧 Checkbox 筛选
- 支持多选和单选模式
- 可折叠筛选组
- 显示选项计数
- 完全自定义的筛选条件

### 2. 增强的页面标题配置
- 支持主标题、副标题和描述
- 可自定义标题组件
- 灵活的布局选项

### 3. 自定义右上角筛选
- 支持任意数量的自定义筛选下拉菜单
- 灵活的筛选参数配置

### 4. 响应式侧边栏布局
- 可选的左侧边栏布局
- 自适应网格系统

## 基本使用

```tsx
import UniversalSearchComponent, { 
  SearchConfig, 
  CheckboxFilterGroup,
  TitleConfig 
} from '@/components/UniversalSearchComponent';

// 页面标题配置
const titleConfig: TitleConfig = {
  title: "搜索涂色页面",
  subtitle: "发现您的完美涂色体验", 
  description: "浏览数千张精美的涂色页面...",
  centerTitle: true
};

// 左侧筛选配置
const checkboxFilters: CheckboxFilterGroup[] = [
  {
    key: 'tags',
    title: '标签',
    options: [
      { value: 'animal', label: '动物', count: 150 },
      { value: 'princess', label: '公主', count: 89 }
    ],
    multiple: true,
    collapsible: true,
    defaultExpanded: true,
    showCount: true
  },
  {
    key: 'difficulty',
    title: '难度等级',
    options: [
      { value: 'easy', label: '简单' },
      { value: 'medium', label: '中等' },
      { value: 'hard', label: '困难' }
    ],
    multiple: false, // 单选
    collapsible: true,
    defaultExpanded: true
  }
];

// 搜索配置
const searchConfig: SearchConfig = {
  apiEndpoint: async (params) => {
    // 您的 API 调用逻辑
    const response = await api.search(params);
    return response;
  },
  
  // 页面标题
  titleConfig: titleConfig,
  
  // 左侧筛选
  checkboxFilters: checkboxFilters,
  showCheckboxFilters: true,
  useLeftSidebar: true,
  
  // 右上角筛选
  sortOptions: [
    { value: 'relevance', label: '相关性' },
    { value: 'newest', label: '最新' },
    { value: 'popular', label: '热门' }
  ],
  categoryOptions: [
    { value: 'all', label: '所有分类' },
    { value: 'animals', label: '动物' },
    { value: 'nature', label: '自然' }
  ],
  
  // 自定义筛选
  customFilters: {
    style: [
      { value: '', label: '绘画风格' },
      { value: 'cartoon', label: '卡通风格' },
      { value: 'realistic', label: '写实风格' }
    ],
    quality: [
      { value: '', label: '图片质量' },
      { value: 'hd', label: '高清' },
      { value: 'ultra-hd', label: '超高清' }
    ]
  },
  
  // 布局配置
  gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  
  // 自定义渲染
  renderItem: (item, searchQuery, searchParams) => (
    <YourCustomCard key={item.id} item={item} />
  ),
};

// 使用组件
<UniversalSearchComponent 
  config={searchConfig}
  className="min-h-0"
/>
```

## 配置选项详解

### TitleConfig
```tsx
interface TitleConfig {
  title?: string;           // 主标题
  subtitle?: string;        // 副标题  
  description?: string;     // 描述文本
  centerTitle?: boolean;    // 是否居中显示
  customTitleComponent?: React.ReactNode; // 自定义标题组件
}
```

### CheckboxFilterGroup
```tsx
interface CheckboxFilterGroup {
  key: string;              // 筛选键名，对应 API 参数
  title: string;            // 显示标题
  options: FilterOption[];  // 选项列表
  multiple?: boolean;       // 是否支持多选，默认 true
  collapsible?: boolean;    // 是否可折叠，默认 true
  defaultExpanded?: boolean; // 默认是否展开，默认 true
  showCount?: boolean;      // 是否显示选项计数，默认 false
}
```

### SearchConfig 新增选项
```tsx
interface SearchConfig {
  // 新增：页面标题配置
  titleConfig?: TitleConfig;
  
  // 新增：左侧筛选配置
  checkboxFilters?: CheckboxFilterGroup[];
  showCheckboxFilters?: boolean;
  useLeftSidebar?: boolean;
  
  // 新增：自定义筛选
  customFilters?: { [key: string]: FilterOption[] };
  
  // 其他已有配置...
}
```

## API 参数传递

组件会自动将筛选条件转换为 API 参数：

- **Checkbox 筛选**: 多选值用逗号分隔，如 `tags: "animal,princess"`
- **自定义筛选**: 直接传递选中的值
- **URL 同步**: 所有筛选条件会同步到 URL 参数中

## 样式自定义

组件使用 Tailwind CSS，支持通过 `className` 属性覆盖默认样式：

```tsx
<UniversalSearchComponent 
  config={config}
  className="custom-styles" 
/>
```

## 兼容性

组件保持向后兼容，旧的配置方式仍然有效：

```tsx
// 旧的配置方式仍然工作
const config = {
  title: "页面标题",
  description: "页面描述", 
  centerTitle: true,
  // ...其他配置
};
```

## 最佳实践

1. **性能优化**: 为大量选项使用虚拟滚动
2. **用户体验**: 合理设置默认筛选状态
3. **响应式**: 在移动端考虑折叠筛选栏
4. **国际化**: 使用翻译键而不是硬编码文本

## 示例项目

查看 `/src/app/search/page.tsx` 获取完整的使用示例。 