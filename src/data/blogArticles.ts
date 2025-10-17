// 博客文章元数据配置
export interface BlogArticle {
  id: string;
  slug: string; // URL slug
  title: string;
  description: string;
  keywords: string[];
  category: 'guide' | 'seasonal' | 'theme' | 'educational';
  publishDate: string;
  author: string;
  readTime: string; // 阅读时间
  coverImage?: string; // 封面图
}

export const blogArticles: BlogArticle[] = [
  {
    id: '1',
    slug: 'coloring-pages-ultimate-guide',
    title: 'Free Coloring Pages Guide - Tips & Benefits',
    description: 'Ultimate guide to free printable coloring pages for kids & adults. Learn benefits, techniques, how to choose pages, and creative tips. Download 10,000+ sheets today!',
    keywords: ['free coloring pages', 'printable coloring pages', 'coloring pages for kids', 'adult coloring pages', 'coloring tips'],
    category: 'guide',
    publishDate: '2025-01-15',
    author: '365 Coloring Pages',
    readTime: '12 min read',
  },
  {
    id: '2',
    slug: 'christmas-coloring-pages',
    title: 'Christmas Coloring Pages - Free Printables',
    description: 'Download free printable Christmas coloring pages for kids & adults. Festive holiday designs including Santa, reindeer, snowmen & Christmas trees. Perfect for celebrations!',
    keywords: ['christmas coloring pages', 'free christmas coloring pages', 'printable christmas pages', 'christmas pages kids'],
    category: 'seasonal',
    publishDate: '2024-11-20',
    author: '365 Coloring Pages',
    readTime: '10 min read',
  },/*
  {
    id: '3',
    slug: 'halloween-coloring-pages',
    title: 'Halloween Coloring Pages: Spooky Creative Fun',
    description: 'Get into the Halloween spirit with spooky and fun coloring pages for kids and adults.',
    keywords: ['halloween coloring pages', 'spooky coloring', 'fall activities', 'halloween printables'],
    category: 'seasonal',
    publishDate: '2024-09-25',
    author: '365 Coloring Pages',
    readTime: '9 min read',
  },
  {
    id: '4',
    slug: 'adult-coloring-pages',
    title: 'Adult Coloring Pages: Stress Relief Through Art',
    description: 'Discover the therapeutic benefits of adult coloring pages for relaxation and mindfulness.',
    keywords: ['adult coloring pages', 'stress relief', 'art therapy', 'mindfulness coloring'],
    category: 'educational',
    publishDate: '2025-01-10',
    author: '365 Coloring Pages',
    readTime: '11 min read',
  },
  {
    id: '5',
    slug: 'cute-coloring-pages',
    title: 'Cute Coloring Pages: Adorable Designs for Everyone',
    description: 'Explore the most adorable cute coloring pages that bring joy to colorers of all ages.',
    keywords: ['cute coloring pages', 'kawaii coloring', 'adorable designs', 'fun activities'],
    category: 'theme',
    publishDate: '2025-01-08',
    author: '365 Coloring Pages',
    readTime: '8 min read',
  },
  {
    id: '6',
    slug: 'unicorn-coloring-pages',
    title: 'Unicorn Coloring Pages: Magical Fantasy Worlds',
    description: 'Enter enchanted realms with beautiful unicorn coloring pages for fantasy lovers.',
    keywords: ['unicorn coloring pages', 'fantasy coloring', 'magical creatures', 'rainbow unicorns'],
    category: 'theme',
    publishDate: '2025-01-05',
    author: '365 Coloring Pages',
    readTime: '9 min read',
  },
  {
    id: '7',
    slug: 'flower-coloring-pages',
    title: 'Flower Coloring Pages: Gardens That Bloom Forever',
    description: 'Create your own eternal garden with beautiful flower coloring pages.',
    keywords: ['flower coloring pages', 'floral designs', 'botanical coloring', 'nature art'],
    category: 'theme',
    publishDate: '2024-12-28',
    author: '365 Coloring Pages',
    readTime: '10 min read',
  },
  {
    id: '8',
    slug: 'thanksgiving-coloring-pages',
    title: 'Thanksgiving Coloring Pages: Gratitude in Color',
    description: 'Celebrate harvest season with thankful hearts through Thanksgiving coloring pages.',
    keywords: ['thanksgiving coloring pages', 'fall coloring', 'gratitude activities', 'harvest themes'],
    category: 'seasonal',
    publishDate: '2024-10-15',
    author: '365 Coloring Pages',
    readTime: '9 min read',
  },
  {
    id: '9',
    slug: 'spring-coloring-pages',
    title: 'Spring Coloring Pages: Nature Awakens in Color',
    description: 'Welcome spring with vibrant coloring pages celebrating renewal and growth.',
    keywords: ['spring coloring pages', 'spring activities', 'nature coloring', 'seasonal printables'],
    category: 'seasonal',
    publishDate: '2024-03-01',
    author: '365 Coloring Pages',
    readTime: '8 min read',
  },
  {
    id: '10',
    slug: 'summer-coloring-pages',
    title: 'Summer Coloring Pages: Sunshine and Freedom',
    description: 'Celebrate summer fun with beach scenes, ice cream, and outdoor adventures.',
    keywords: ['summer coloring pages', 'beach coloring', 'vacation activities', 'summer fun'],
    category: 'seasonal',
    publishDate: '2024-05-20',
    author: '365 Coloring Pages',
    readTime: '8 min read',
  },
  {
    id: '11',
    slug: 'fall-coloring-pages',
    title: 'Fall Coloring Pages: Autumn\'s Warm Embrace',
    description: 'Experience cozy autumn vibes with fall-themed coloring pages.',
    keywords: ['fall coloring pages', 'autumn coloring', 'cozy activities', 'seasonal themes'],
    category: 'seasonal',
    publishDate: '2024-08-25',
    author: '365 Coloring Pages',
    readTime: '9 min read',
  },
  {
    id: '12',
    slug: 'princess-coloring-pages',
    title: 'Princess Coloring Pages: Dreams Wear Crowns',
    description: 'Explore royal adventures with empowering princess coloring pages.',
    keywords: ['princess coloring pages', 'royal themes', 'fantasy coloring', 'empowerment'],
    category: 'theme',
    publishDate: '2024-12-15',
    author: '365 Coloring Pages',
    readTime: '9 min read',
  },
  {
    id: '13',
    slug: 'cat-coloring-pages',
    title: 'Cat Coloring Pages: Feline Friends in Every Shade',
    description: 'Celebrate our feline companions with adorable cat coloring pages.',
    keywords: ['cat coloring pages', 'animal coloring', 'pet lovers', 'cute cats'],
    category: 'theme',
    publishDate: '2024-12-10',
    author: '365 Coloring Pages',
    readTime: '10 min read',
  },
  {
    id: '14',
    slug: 'easter-coloring-pages',
    title: 'Easter Coloring Pages: Spring\'s Sweetest Celebration',
    description: 'Welcome Easter with eggs, bunnies, and spring joy in colorful pages.',
    keywords: ['easter coloring pages', 'spring celebration', 'easter eggs', 'bunny coloring'],
    category: 'seasonal',
    publishDate: '2024-02-28',
    author: '365 Coloring Pages',
    readTime: '8 min read',
  },
  {
    id: '15',
    slug: 'dinosaur-coloring-pages',
    title: 'Dinosaur Coloring Pages: Prehistoric Giants Come to Life',
    description: 'Bring dinosaurs back to life with exciting prehistoric coloring pages.',
    keywords: ['dinosaur coloring pages', 'prehistoric animals', 'educational coloring', 'kids activities'],
    category: 'educational',
    publishDate: '2024-11-30',
    author: '365 Coloring Pages',
    readTime: '10 min read',
  },
  {
    id: '16',
    slug: 'single-coloring-page-benefits',
    title: 'The Power of One Perfect Coloring Page',
    description: 'Discover why single coloring pages offer complete creative satisfaction.',
    keywords: ['coloring page', 'quick activities', 'creative breaks', 'mindfulness'],
    category: 'guide',
    publishDate: '2025-01-12',
    author: '365 Coloring Pages',
    readTime: '7 min read',
  },
  {
    id: '17',
    slug: 'free-printable-coloring-pages',
    title: 'Free Printable Coloring Pages: Accessible Creativity',
    description: 'Access thousands of free printable coloring pages for instant creative fun.',
    keywords: ['free printable coloring pages', 'printable activities', 'free downloads', 'coloring sheets'],
    category: 'guide',
    publishDate: '2025-01-01',
    author: '365 Coloring Pages',
    readTime: '11 min read',
  },
  {
    id: '18',
    slug: 'animal-coloring-pages',
    title: 'Animal Coloring Pages: Wildlife in Wonderful Color',
    description: 'Explore the animal kingdom through diverse and engaging coloring pages.',
    keywords: ['animal coloring pages', 'wildlife coloring', 'nature education', 'animal lovers'],
    category: 'theme',
    publishDate: '2024-12-20',
    author: '365 Coloring Pages',
    readTime: '10 min read',
  },
  {
    id: '19',
    slug: 'dog-coloring-pages',
    title: 'Dog Coloring Pages: Our Best Friends in Color',
    description: 'Celebrate canine companions with heartwarming dog coloring pages.',
    keywords: ['dog coloring pages', 'pet coloring', 'animal lovers', 'puppy pages'],
    category: 'theme',
    publishDate: '2024-12-18',
    author: '365 Coloring Pages',
    readTime: '9 min read',
  },
  {
    id: '20',
    slug: 'butterfly-coloring-pages',
    title: 'Butterfly Coloring Pages: Wings of Wonder',
    description: 'Transform pages with beautiful butterfly coloring designs.',
    keywords: ['butterfly coloring pages', 'nature coloring', 'transformation themes', 'insect art'],
    category: 'theme',
    publishDate: '2024-12-12',
    author: '365 Coloring Pages',
    readTime: '8 min read',
  },
  {
    id: '21',
    slug: 'mandala-coloring-pages',
    title: 'Mandala Coloring Pages: Finding Center in Circles',
    description: 'Discover meditation through intricate mandala coloring pages.',
    keywords: ['mandala coloring pages', 'meditation art', 'stress relief', 'geometric patterns'],
    category: 'educational',
    publishDate: '2024-12-05',
    author: '365 Coloring Pages',
    readTime: '11 min read',
  },
  {
    id: '22',
    slug: 'easy-coloring-pages',
    title: 'Easy Coloring Pages: Where Everyone Succeeds',
    description: 'Start your coloring journey with accessible, beginner-friendly pages.',
    keywords: ['easy coloring pages', 'beginner coloring', 'simple designs', 'kids activities'],
    category: 'guide',
    publishDate: '2024-11-28',
    author: '365 Coloring Pages',
    readTime: '8 min read',
  },
  {
    id: '23',
    slug: 'simple-coloring-pages',
    title: 'Simple Coloring Pages: Beauty in Simplicity',
    description: 'Find joy in straightforward, minimalist coloring designs.',
    keywords: ['simple coloring pages', 'minimalist art', 'quick activities', 'clean designs'],
    category: 'guide',
    publishDate: '2024-11-25',
    author: '365 Coloring Pages',
    readTime: '7 min read',
  },
  {
    id: '24',
    slug: 'dragon-coloring-pages',
    title: 'Dragon Coloring Pages: Where Fire Meets Imagination',
    description: 'Unleash fantasy with powerful and magical dragon coloring pages.',
    keywords: ['dragon coloring pages', 'fantasy creatures', 'mythical beasts', 'creative imagination'],
    category: 'theme',
    publishDate: '2024-11-22',
    author: '365 Coloring Pages',
    readTime: '10 min read',
  },*/
];

// 辅助函数：根据slug获取文章
export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find(article => article.slug === slug);
}

// 辅助函数：获取上一篇/下一篇文章
export function getAdjacentArticles(currentSlug: string) {
  const currentIndex = blogArticles.findIndex(article => article.slug === currentSlug);
  
  return {
    previous: currentIndex > 0 ? blogArticles[currentIndex - 1] : null,
    next: currentIndex < blogArticles.length - 1 ? blogArticles[currentIndex + 1] : null,
  };
}

// 辅助函数：根据分类获取文章
export function getArticlesByCategory(category: string): BlogArticle[] {
  return blogArticles.filter(article => article.category === category);
}

// 辅助函数：获取相关文章（同分类）
export function getRelatedArticles(currentSlug: string, limit: number = 3): BlogArticle[] {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];
  
  return blogArticles
    .filter(article => 
      article.slug !== currentSlug && 
      article.category === currentArticle.category
    )
    .slice(0, limit);
}

