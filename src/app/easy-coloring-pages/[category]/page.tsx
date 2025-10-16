import { Suspense } from 'react';
import FirstColoringBookCategoryPageClient from './FirstColoringBookCategoryPageClient';
import { generateFirstColoringBookSEO } from '@/seo/generatePageSEO';

interface EasyColoringPagesCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: EasyColoringPagesCategoryPageProps) {
  const { category } = await params;
  return await generateFirstColoringBookSEO('category', { category });
}

export default async function EasyColoringPagesCategoryPage({ params }: EasyColoringPagesCategoryPageProps) {
  const { category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirstColoringBookCategoryPageClient category={category} />
    </Suspense>
  );
}
