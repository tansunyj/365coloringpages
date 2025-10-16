import { Suspense } from 'react';
import { generateThemeParksSEO } from '@/seo/generatePageSEO';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface DisneyCharactersDetailPageProps {
  params: Promise<{
    category: string;
    'slug-id': string;
  }>;
}

export async function generateMetadata({ params }: DisneyCharactersDetailPageProps) {
  const { category, 'slug-id': slugId } = await params;
  return await generateThemeParksSEO('detail', { themePark: category, slugId });
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  return [];
}

export default async function DisneyCharactersDetailPage({ params }: DisneyCharactersDetailPageProps) {
  const { 'slug-id': slugId, category } = await params;
  
  const parts = slugId.split('-');
  const id = parts.pop() || '';
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={id} 
        type="theme-parks"
        park={category}
      />
    </Suspense>
  );
}
