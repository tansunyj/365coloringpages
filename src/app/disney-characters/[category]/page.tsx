import { Suspense } from 'react';
import ThemeParksCategoryPageClient from './ThemeParksCategoryPageClient';
import { generateThemeParksSEO } from '@/seo/generatePageSEO';

interface DisneyCharactersCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: DisneyCharactersCategoryPageProps) {
  const { category } = await params;
  return await generateThemeParksSEO('category', { themePark: category });
}

export default async function DisneyCharactersCategoryPage({ params }: DisneyCharactersCategoryPageProps) {
  const { category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParksCategoryPageClient category={category} />
    </Suspense>
  );
}
