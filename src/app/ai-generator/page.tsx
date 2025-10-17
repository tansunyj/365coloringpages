import AIGeneratorClient from './AIGeneratorClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Coloring Page Generator - Free Printable Pages for Kids',
  description: 'Create free printable coloring pages instantly with AI. Perfect for kids & adults. Generate unlimited custom coloring sheets in seconds - no design needed!',
  keywords: 'AI, nano banana, AI coloring pages, free printable coloring pages, coloring pages for kids, adult coloring',
  openGraph: {
    title: 'AI Coloring Page Generator - Free Printable Pages',
    description: 'Create free printable coloring pages instantly with AI. Perfect for kids & adults. Generate unlimited custom sheets in seconds!',
    type: 'website',
    url: 'https://365coloringpages.com/ai-generator',
    siteName: '365 Coloring Pages',
    images: [
      {
        url: 'https://365coloringpages.com/images/ai-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Coloring Page Generator - Create Custom Coloring Pages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Coloring Page Generator - Free Printable Pages',
    description: 'Create free printable coloring pages instantly with AI. Perfect for kids & adults. Generate unlimited custom sheets!',
    images: ['https://365coloringpages.com/images/ai-generator-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://365coloringpages.com/ai-generator',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function AIGeneratorPage() {
  return <AIGeneratorClient />;
}