import { Suspense } from 'react';
import FirstColoringBookCategoryPageClient from './FirstColoringBookCategoryPageClient';
import { generateFirstColoringBookSEO } from '@/seo/generatePageSEO';

interface FirstColoringBookCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: FirstColoringBookCategoryPageProps) {
  const { category } = await params;
  return await generateFirstColoringBookSEO('category', { category });
}

export default async function FirstColoringBookCategoryPage({ params }: FirstColoringBookCategoryPageProps) {
  const { category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirstColoringBookCategoryPageClient category={category} />
    </Suspense>
  );
}
