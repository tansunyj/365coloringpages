import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PopularSection from '@/components/PopularSection';
import ThemeParkSection from '@/components/ThemeParkSection';
import FirstColoringBookSection from '@/components/FirstColoringBookSection';
import LatestUploadsSection from '@/components/LatestUploadsSection';
import Footer from '@/components/Footer';
import { HomePageJsonLd } from '@/components/JsonLd';

/**
 * 首页静态 SEO Metadata
 * 使用静态 export 确保所有 meta 标签都在初始 HTML 的 <head> 中
 */
export const metadata: Metadata = {
  title: 'Free Printable Coloring Pages for Kids & Adults',
  description: 'Browse 10,000+ free printable coloring pages: Halloween (49.5K), Fall, Hello Kitty (49.5K), Pokemon (33.1K), Animals, Disney characters, and more. Download high-quality sheets instantly.',
  keywords: [
    'coloring pages',
    'free coloring pages', 
    'printable coloring pages',
    'coloring pages for kids',
    'christmas coloring pages',
    'halloween coloring pages',
    'hello kitty coloring pages',
    'cute coloring pages',
    'easy coloring pages',
    'animal coloring pages',
    'disney coloring pages',
    'free printable'
  ],
  authors: [{ name: '365 Coloring Pages' }],
  creator: '365 Coloring Pages',
  publisher: '365 Coloring Pages',
  alternates: {
    canonical: 'https://365coloringpages.com/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://365coloringpages.com/',
    siteName: '365 Coloring Pages',
    title: 'Free Printable Coloring Pages for Kids & Adults',
    description: 'Browse 10,000+ free printable coloring pages: Halloween (49.5K), Fall, Animals, Disney characters, and more. Download high-quality sheets instantly.',
    images: [
      {
        url: 'https://365coloringpages.com/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Printable Coloring Pages - 365 Coloring Pages',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@365coloringpages',
    creator: '@365coloringpages',
    title: 'Free Printable Coloring Pages for Kids & Adults',
    description: '10,000+ free printable coloring pages: Animals, Characters, Holidays & More',
    images: ['https://365coloringpages.com/og-home.jpg'],
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

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <HomePageJsonLd />
      
      <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
        <Header />
        <Hero />
        <PopularSection />
        <ThemeParkSection />
        <FirstColoringBookSection />
        <LatestUploadsSection />
        <Footer />
      </div>
    </>
  );
}
