import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog - 365 Coloring Pages',
  description: 'Discover tips, tutorials, and insights about coloring, creativity, and art therapy on our blog.',
  keywords: 'coloring blog, art tutorials, creativity tips, coloring techniques, art therapy',
}

// 博客文章数据
const blogPosts = [
  {
    id: 1,
    slug: 'therapeutic-benefits-of-coloring',
    title: 'The Therapeutic Benefits of Coloring: More Than Just Fun',
    excerpt: 'Discover how coloring can reduce stress, improve focus, and promote mental well-being for both children and adults.',
    content: 'Full article content here...',
    author: 'Dr. Sarah Johnson',
    publishDate: '2024-12-10',
    readTime: '5 min read',
    category: 'Health & Wellness',
    tags: ['therapy', 'mental health', 'stress relief', 'mindfulness'],
    featuredImage: '/api/placeholder/800/400',
    featured: true
  },
  {
    id: 2,
    slug: 'ai-coloring-page-generation-tips',
    title: 'Mastering AI Coloring Page Generation: Tips and Tricks',
    excerpt: 'Learn how to create stunning custom coloring pages using our AI generator with expert tips and creative techniques.',
    content: 'Full article content here...',
    author: 'Creative Team',
    publishDate: '2024-12-08',
    readTime: '7 min read',
    category: 'Technology',
    tags: ['AI', 'creativity', 'tutorials', 'design'],
    featuredImage: '/api/placeholder/800/400',
    featured: false
  },
  {
    id: 3,
    slug: 'coloring-techniques-for-beginners',
    title: 'Essential Coloring Techniques Every Beginner Should Know',
    excerpt: 'Master the fundamentals of coloring with these essential techniques, from basic shading to advanced blending methods.',
    content: 'Full article content here...',
    author: 'Art Instructor',
    publishDate: '2024-12-05',
    readTime: '6 min read',
    category: 'Education',
    tags: ['techniques', 'beginner', 'tutorial', 'basics'],
    featuredImage: '/api/placeholder/800/400',
    featured: false
  },
  {
    id: 4,
    slug: 'seasonal-coloring-pages-winter',
    title: 'Winter Wonderland: Seasonal Coloring Pages for Cold Days',
    excerpt: 'Embrace the winter season with our collection of cozy, seasonal coloring pages perfect for snowy days indoors.',
    content: 'Full article content here...',
    author: 'Seasonal Editor',
    publishDate: '2024-12-03',
    readTime: '4 min read',
    category: 'Seasonal',
    tags: ['winter', 'seasonal', 'holidays', 'cozy'],
    featuredImage: '/api/placeholder/800/400',
    featured: false
  },
  {
    id: 5,
    slug: 'coloring-supplies-guide',
    title: 'The Ultimate Guide to Coloring Supplies: What You Need to Get Started',
    excerpt: 'From colored pencils to markers, discover the best coloring supplies for different techniques and skill levels.',
    content: 'Full article content here...',
    author: 'Supply Expert',
    publishDate: '2024-12-01',
    readTime: '8 min read',
    category: 'Guides',
    tags: ['supplies', 'materials', 'guide', 'recommendations'],
    featuredImage: '/api/placeholder/800/400',
    featured: false
  },
  {
    id: 6,
    slug: 'mindful-coloring-meditation',
    title: 'Mindful Coloring: Using Art as a Form of Meditation',
    excerpt: 'Learn how to transform your coloring practice into a mindful meditation experience for deeper relaxation.',
    content: 'Full article content here...',
    author: 'Mindfulness Coach',
    publishDate: '2024-11-28',
    readTime: '5 min read',
    category: 'Mindfulness',
    tags: ['meditation', 'mindfulness', 'relaxation', 'wellness'],
    featuredImage: '/api/placeholder/800/400',
    featured: false
  }
]

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Explore the world of creativity, discover coloring techniques, and learn about the therapeutic benefits of art.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="h-64 md:h-full w-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="ml-3 text-sm text-gray-500">Featured</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-purple-600 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span className="mr-4">{featuredPost.author}</span>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="mr-4">{new Date(featuredPost.publishDate).toLocaleDateString()}</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link href={`/blog/${post.slug}`}>
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="h-48 w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center text-xs text-gray-500">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="mb-6 text-purple-100">
            Subscribe to our newsletter to get the latest articles, coloring tips, and creative inspiration delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  )
} 