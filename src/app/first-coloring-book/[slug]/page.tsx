import { Suspense } from 'react';
import FirstColoringBookListClient from '../FirstColoringBookListClient';

interface FirstColoringBookSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成静态参数 - 为常见涂色书提供静态路径
export async function generateStaticParams() {
  const commonColoringBooks = [
    'first-coloring-book', 'latest-pages', 'popular-pages',
    'animals', 'nature', 'shapes', 'emotions', 'fruits'
  ];

  return commonColoringBooks.map((slug) => ({
    slug,
  }));
}

export default async function FirstColoringBookSlugPage({
  params
}: FirstColoringBookSlugPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <FirstColoringBookListClient initialCategory={slug} />
    </Suspense>
  );
} 