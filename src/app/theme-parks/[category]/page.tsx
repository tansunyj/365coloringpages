import { Suspense } from 'react';
import ThemeParksCategoryPageClient from './ThemeParksCategoryPageClient';

interface ThemeParksCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function ThemeParksCategoryPage({ params }: ThemeParksCategoryPageProps) {
  const { category } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParksCategoryPageClient category={category} />
    </Suspense>
  );
}
