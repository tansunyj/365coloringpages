import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogArticles } from '@/data/blogArticles';

export const metadata: Metadata = {
  title: 'Blog - Coloring Pages Tips, Guides & Inspiration | 365 Coloring Pages',
  description: 'Discover expert tips, creative guides, and inspiration for coloring pages. From seasonal themes to techniques, find everything you need for your coloring journey.',
  keywords: ['coloring pages blog', 'coloring tips', 'creative guides', 'art inspiration'],
};

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Header Section */}
      <section className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Blog</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get to know the latest features, insights into development and tips to use 365coloringpages.com to the fullest.
          </p>
        </div>
      </section>

      {/* Articles List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {blogArticles.map((article, index) => (
            <article key={article.id} className="group">
              <Link href={`/blog/${article.slug}`} className="block">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {article.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-semibold text-xs">
                      {article.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{article.author}</span>
                  </div>
                  <span>•</span>
                  <span>{new Date(article.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
