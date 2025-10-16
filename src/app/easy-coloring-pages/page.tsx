import { Suspense } from 'react';
import FirstColoringBookPageClient from './FirstColoringBookPageClient';
import { generateFirstColoringBookSEO } from '@/seo/generatePageSEO';

export async function generateMetadata() {
  return await generateFirstColoringBookSEO('home');
}

export default function EasyColoringPagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirstColoringBookPageClient />
    </Suspense>
  );
}
