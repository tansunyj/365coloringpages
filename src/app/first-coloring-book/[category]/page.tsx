import { Suspense } from 'react';
import FirstColoringBookCategoryPageClient from './FirstColoringBookCategoryPageClient';

interface FirstColoringBookCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function FirstColoringBookCategoryPage({ params }: FirstColoringBookCategoryPageProps) {
  const { category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirstColoringBookCategoryPageClient category={category} />
    </Suspense>
  );
}
