import { Suspense } from 'react';
import FirstColoringBookPageClient from './FirstColoringBookPageClient';

export default function FirstColoringBookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirstColoringBookPageClient />
    </Suspense>
  );
} 