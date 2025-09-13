import { Suspense } from 'react';
import ThemeParkPageClient from './ThemeParkPageClient';

export default function ThemeParkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParkPageClient />
    </Suspense>
  );
} 