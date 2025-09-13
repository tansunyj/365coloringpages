import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PopularSection from '@/components/PopularSection';
import ThemeParkSection from '@/components/ThemeParkSection';
import FirstColoringBookSection from '@/components/FirstColoringBookSection';
import LatestUploadsSection from '@/components/LatestUploadsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      <Hero />
      <PopularSection />
      <ThemeParkSection />
      <FirstColoringBookSection />
      <LatestUploadsSection />
      <Footer />
    </div>
  );
}
