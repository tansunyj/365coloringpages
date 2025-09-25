import { Suspense } from 'react';
import ThemeParksListClient from './ThemeParksListClient';

export default function ThemeParksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParksListClient />
    </Suspense>
  );
} 