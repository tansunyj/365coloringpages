import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogArticles, getArticleBySlug, getAdjacentArticles } from '@/data/blogArticles';
import '../blog-styles.css';

// 动态文章组件映射
import ColoringPagesGuide from '@/components/blog/ColoringPagesGuide';
import ChristmasColoringPages from '@/components/blog/ChristmasColoringPages';
import HalloweenColoringPages from '@/components/blog/HalloweenColoringPages';
import AdultColoringPages from '@/components/blog/AdultColoringPages';
import UnicornColoringPages from '@/components/blog/UnicornColoringPages';
import CuteColoringPages from '@/components/blog/CuteColoringPages';
import SingleColoringPage from '@/components/blog/SingleColoringPage';
import FlowerColoringPages from '@/components/blog/FlowerColoringPages';
import ThanksgivingColoringPages from '@/components/blog/ThanksgivingColoringPages';
import SpringColoringPages from '@/components/blog/SpringColoringPages';
import SummerColoringPages from '@/components/blog/SummerColoringPages';
import FallColoringPages from '@/components/blog/FallColoringPages';
import PrincessColoringPages from '@/components/blog/PrincessColoringPages';
import CatColoringPages from '@/components/blog/CatColoringPages';
import EasterColoringPages from '@/components/blog/EasterColoringPages';
import DinosaurColoringPages from '@/components/blog/DinosaurColoringPages';
import FreePrintableColoringPages from '@/components/blog/FreePrintableColoringPages';
import AnimalColoringPages from '@/components/blog/AnimalColoringPages';
import DogColoringPages from '@/components/blog/DogColoringPages';
import ButterflyColoringPages from '@/components/blog/ButterflyColoringPages';
import MandalaColoringPages from '@/components/blog/MandalaColoringPages';
import EasyColoringPages from '@/components/blog/EasyColoringPages';
import SimpleColoringPages from '@/components/blog/SimpleColoringPages';
import DragonColoringPages from '@/components/blog/DragonColoringPages';

const articleComponents: Record<string, React.ComponentType> = {
  'coloring-pages-ultimate-guide': ColoringPagesGuide,
  'christmas-coloring-pages': ChristmasColoringPages,
  'halloween-coloring-pages': HalloweenColoringPages,
  'adult-coloring-pages': AdultColoringPages,
  'unicorn-coloring-pages': UnicornColoringPages,
  'cute-coloring-pages': CuteColoringPages,
  'single-coloring-page-benefits': SingleColoringPage,
  'flower-coloring-pages': FlowerColoringPages,
  'thanksgiving-coloring-pages': ThanksgivingColoringPages,
  'spring-coloring-pages': SpringColoringPages,
  'summer-coloring-pages': SummerColoringPages,
  'fall-coloring-pages': FallColoringPages,
  'princess-coloring-pages': PrincessColoringPages,
  'cat-coloring-pages': CatColoringPages,
  'easter-coloring-pages': EasterColoringPages,
  'dinosaur-coloring-pages': DinosaurColoringPages,
  'free-printable-coloring-pages': FreePrintableColoringPages,
  'animal-coloring-pages': AnimalColoringPages,
  'dog-coloring-pages': DogColoringPages,
  'butterfly-coloring-pages': ButterflyColoringPages,
  'mandala-coloring-pages': MandalaColoringPages,
  'easy-coloring-pages': EasyColoringPages,
  'simple-coloring-pages': SimpleColoringPages,
  'dragon-coloring-pages': DragonColoringPages,
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成静态参数
export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | 365 Coloring Pages Blog`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishDate,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }
  
  // 获取对应的文章组件
  const ArticleComponent = articleComponents[slug];
  
  // 获取上一篇和下一篇文章
  const { previous, next } = getAdjacentArticles(slug);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* 文章头部 - 优化版 */}
      <header className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-[800px] mx-auto px-8 sm:px-10 pt-16 pb-12">
          {/* 面包屑导航 */}
          <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-orange-500 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Article</span>
          </nav>
          
          {/* 文章标题 - 居中，更大 */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent leading-tight">
            {article.title}
          </h1>
          
          {/* 元信息 - 居中 */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-semibold text-xs">
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="font-medium">{article.author}</span>
            </div>
            <span>•</span>
            <time className="font-medium">{new Date(article.publishDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long',
              day: 'numeric'
            })}</time>
          </div>
        </div>
      </header>

      {/* 文章内容 */}
      <article className="max-w-[800px] mx-auto px-8 sm:px-10 py-16 bg-white dark:bg-gray-800 shadow-lg rounded-xl my-16">
        <div className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-[2em] prose-h2:mt-12 prose-h2:mb-5 prose-h2:pl-5 prose-h2:border-l-[6px] prose-h2:border-l-orange-500 prose-h2:transition-colors hover:prose-h2:text-orange-500
          prose-h3:text-[1.4em] prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-700 dark:prose-h3:text-gray-200
          prose-p:text-base prose-p:leading-[1.8] prose-p:my-6 prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-p:first-of-type:text-[1.25em] prose-p:first-of-type:font-light prose-p:first-of-type:text-gray-900 dark:prose-p:first-of-type:text-gray-100 prose-p:first-of-type:mb-12
          prose-ul:my-6 prose-ul:pl-5 prose-li:my-2.5
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold">
          {/* 动态渲染文章组件 */}
          {ArticleComponent ? (
            <ArticleComponent />
          ) : (
            <>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {article.description}
                </p>

                <div className="my-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border-l-4 border-orange-500">
                  <h3 className="mt-0 text-orange-900 dark:text-orange-200">📝 Article Content</h3>
                  <p className="mb-0 text-gray-700 dark:text-gray-300">
                    This comprehensive guide about <strong>{article.title.toLowerCase()}</strong> covers everything you need to know. 
                    From beginner tips to advanced techniques, discover the joy and benefits of coloring.
                  </p>
                </div>

                <h2 className="text-3xl font-bold mt-12 mb-6">Why This Topic Matters</h2>
                <p>
                  Coloring has become a beloved activity for people of all ages. Whether you're looking for stress relief, 
                  creative expression, or quality time with loved ones, {article.title.toLowerCase()} offer the perfect solution.
                </p>

                <div className="my-12 p-8 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">Image Placeholder 1</p>
                    <p className="text-xs mt-1">Suggested: Coloring pages and art supplies</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mt-12 mb-6">Getting Started</h2>
                <p>
                  Beginning your coloring journey is simple and rewarding. All you need is enthusiasm and a willingness 
                  to explore your creative side. {article.title} are designed to be accessible and enjoyable for everyone.
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl my-8 border border-blue-100 dark:border-gray-600">
                  <h3 className="mt-0 text-blue-900 dark:text-blue-200 flex items-center gap-2">
                    <span>✨</span>
                    Key Benefits
                  </h3>
                  <ul className="mb-0 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Reduces stress and anxiety</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Enhances focus and mindfulness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Sparks creativity and self-expression</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Provides screen-free entertainment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Creates opportunities for bonding</span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-3xl font-bold mt-12 mb-6">Tips for Success</h2>
                <p>
                  Make the most of your coloring experience with these helpful suggestions:
                </p>

                <ul className="space-y-3">
                  <li><strong className="text-gray-900 dark:text-gray-100">Choose the right tools:</strong> Colored pencils, markers, or crayons—each offers unique effects</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">Create a comfortable space:</strong> Good lighting and a relaxed environment enhance enjoyment</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">Don't rush:</strong> Take your time and enjoy the process</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">Experiment freely:</strong> There's no wrong way to color</li>
                  <li><strong className="text-gray-900 dark:text-gray-100">Display your work:</strong> Celebrate your creativity by showing off finished pieces</li>
                </ul>

                <div className="my-12 p-8 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">Image Placeholder 2</p>
                    <p className="text-xs mt-1">Suggested: People enjoying coloring activity</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mt-12 mb-6">Making It a Habit</h2>
                <p>
                  Incorporating coloring into your routine can bring lasting benefits. Whether it's a daily ritual or an 
                  occasional treat, regular coloring practice enhances well-being and nurtures creativity.
                </p>

                <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-10 rounded-2xl my-10 border border-purple-100 dark:border-gray-600">
                  <h3 className="mt-0 text-purple-900 dark:text-purple-200 text-2xl flex items-center gap-2">
                    <span>🎨</span>
                    Your Creative Journey
                  </h3>
                  <p className="text-lg mb-0 text-gray-700 dark:text-gray-300">
                    Every coloring page is an opportunity for discovery, relaxation, and joy. Start your journey today 
                    and explore the wonderful world of {article.title.toLowerCase()}!
                  </p>
                </div>

                <div className="my-10 p-8 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl text-center border border-orange-200 dark:border-gray-600">
                  <h3 className="mt-0 text-orange-900 dark:text-orange-200 text-2xl flex items-center justify-center gap-2">
                    <span>🖍️</span>
                    Ready to Begin?
                  </h3>
                  <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
                    Explore our collection of {article.title.toLowerCase()} and start creating today!
                  </p>
                  <a 
                    href="/categories" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Browse Coloring Pages
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
              </div>
            </>
          )}
        </div>

        {/* 上一篇/下一篇导航 */}
        {(previous || next) && (
          <nav className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {previous ? (
                <Link
                  href={`/blog/${previous.slug}`}
                  className="group block"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous Article</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {previous.title}
                  </h3>
                </Link>
              ) : (
                <div></div>
              )}
              
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group block md:text-right"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 md:justify-end">
                    <span>Next Article</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {next.title}
                  </h3>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </nav>
        )}

        {/* 返回博客列表 */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Blog</span>
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
