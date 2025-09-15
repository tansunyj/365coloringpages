import { Suspense } from 'react';
import ThemeParkPageClient from '../ThemeParkPageClient';

// 生成静态参数
export async function generateStaticParams() {
  return [
    { park: 'disney-world' },
    { park: 'universal-studios' },
    { park: 'six-flags' },
    { park: 'cedar-point' },
    { park: 'knotts-berry-farm' },
    { park: 'busch-gardens' },
    { park: 'seaworld' },
    { park: 'legoland' },
    { park: 'adventure-island' }
  ];
}

export default function ThemeParkParkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeParkPageClient />
    </Suspense>
  );
} 