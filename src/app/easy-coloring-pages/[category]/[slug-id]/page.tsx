import { Suspense } from 'react';
import { generateFirstColoringBookSEO } from '@/seo/generatePageSEO';
import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface EasyColoringPagesDetailPageProps {
  params: Promise<{
    category: string;
    'slug-id': string;
  }>;
}

export async function generateMetadata({ params }: EasyColoringPagesDetailPageProps) {
  const { category, 'slug-id': slugId } = await params;
  return await generateFirstColoringBookSEO('detail', { category, slugId });
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  return [];
}

export default async function EasyColoringPagesDetailPage({ params }: EasyColoringPagesDetailPageProps) {
  const { 'slug-id': slugId, category } = await params;
  
  const parts = slugId.split('-');
  const id = parts.pop() || '';
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedColoringDetail 
        id={id} 
        type="easy-coloring-book"
        category={category}
      />
    </Suspense>
  );
}
