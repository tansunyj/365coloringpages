import Image from "next/image";
import { Search, Menu, Upload, ChevronDown, Heart, Download, Eye } from "lucide-react";

export default function Home() {
  const categories = [
    "动物", "花卉", "卡通", "风景", "建筑", "人物", "节日", "交通工具", "食物", "体育"
  ];

  const coloringPages = [
    {
      id: 1,
      title: "可爱小猫咪",
      image: "/placeholder-coloring-1.jpg",
      category: "动物",
      downloads: 1250,
      likes: 89
    },
    {
      id: 2,
      title: "美丽花园",
      image: "/placeholder-coloring-2.jpg",
      category: "花卉",
      downloads: 2100,
      likes: 156
    },
    {
      id: 3,
      title: "超级英雄",
      image: "/placeholder-coloring-3.jpg",
      category: "卡通",
      downloads: 3400,
      likes: 234
    },
    {
      id: 4,
      title: "山水风景",
      image: "/placeholder-coloring-4.jpg",
      category: "风景",
      downloads: 1800,
      likes: 127
    },
    {
      id: 5,
      title: "城堡建筑",
      image: "/placeholder-coloring-5.jpg",
      category: "建筑",
      downloads: 950,
      likes: 67
    },
    {
      id: 6,
      title: "快乐家庭",
      image: "/placeholder-coloring-6.jpg",
      category: "人物",
      downloads: 1600,
      likes: 112
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">
                365coloringpages
              </div>
            </div>

            {/* 导航菜单 */}
            <nav className="hidden md:flex space-x-8">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-green-600 cursor-pointer">
                <span>探索</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <a href="#" className="text-gray-700 hover:text-green-600">涂色页面</a>
              <a href="#" className="text-gray-700 hover:text-green-600">插图</a>
              <a href="#" className="text-gray-700 hover:text-green-600">模板</a>
              <a href="#" className="text-gray-700 hover:text-green-600">教程</a>
            </nav>

            {/* 右侧按钮 */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-green-600">登录</button>
              <button className="text-gray-700 hover:text-green-600">注册</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>上传</span>
              </button>
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="relative gradient-animate text-white py-20">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            精美免费涂色页面与创意活动
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            超过5.7万张高质量涂色页面，由我们才华横溢的社区分享
          </p>

          {/* 搜索栏 */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="搜索免费涂色页面、插图、模板等..."
              />
            </div>
          </div>

          {/* 分类标签 */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((category, index) => (
              <button
                key={index}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full text-sm transition-all duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 内容区域 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 标题和导航 */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              超过5.7万张高质量涂色页面、插图和模板，由我们才华横溢的社区分享。
            </h2>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                编辑推荐
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-green-600">
                最新
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-green-600">
                热门
              </button>
            </div>
          </div>

          {/* 涂色页面网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coloringPages.map((page) => (
              <div key={page.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                {/* 图片区域 */}
                <div className="relative aspect-square bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Image
                        src="/next.svg"
                        alt="Placeholder"
                        width={60}
                        height={60}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p className="text-sm">{page.title}</p>
                    </div>
                  </div>
                  
                  {/* 悬浮操作按钮 */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* 分类标签 */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                      {page.category}
                    </span>
                  </div>
                </div>

                {/* 卡片信息 */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {page.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{page.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{page.likes}</span>
                      </div>
                    </div>
                    <button className="text-green-600 hover:text-green-700 font-medium">
                      免费下载
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 加载更多按钮 */}
          <div className="text-center mt-12">
            <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors">
              查看更多涂色页面
            </button>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">365涂色页面</h3>
              <p className="text-gray-400 text-sm">
                为孩子和成人提供最佳的免费涂色页面和创意活动。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">发现</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">涂色页面</a></li>
                <li><a href="#" className="hover:text-white">插图</a></li>
                <li><a href="#" className="hover:text-white">模板</a></li>
                <li><a href="#" className="hover:text-white">教程</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">社区</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">博客</a></li>
                <li><a href="#" className="hover:text-white">论坛</a></li>
                <li><a href="#" className="hover:text-white">创作者</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">帮助中心</a></li>
                <li><a href="#" className="hover:text-white">联系我们</a></li>
                <li><a href="#" className="hover:text-white">隐私政策</a></li>
                <li><a href="#" className="hover:text-white">服务条款</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 365涂色页面. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
