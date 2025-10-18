import { Metadata } from 'next'
import { Palette, Users, Heart, Target, Award, Globe } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About Us - 365 Coloring Pages',
  description: 'Learn about our mission to bring creativity and joy to millions through beautiful, free coloring pages for kids and adults.',
  keywords: 'about us, coloring pages, creativity, art therapy, educational resources',
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 p-4 rounded-full">
              <Palette className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About 365 Coloring Pages</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering creativity and imagination through beautiful, accessible coloring experiences for everyone.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-6">
              Founded in 2024, 365 Coloring Pages was born from a simple belief: creativity should be accessible to everyone, everywhere. What started as a small collection of hand-drawn illustrations has grown into one of the world&apos;s largest repositories of free, high-quality coloring pages.
            </p>
            <p className="mb-6">
              Our journey began when we recognized the therapeutic and educational benefits of coloring activities. From helping children develop fine motor skills and creativity to providing adults with a peaceful escape from daily stress, coloring transcends age boundaries and cultural differences.
            </p>
            <p>
              Today, we serve millions of users worldwide, offering thousands of carefully curated coloring pages across diverse themes and difficulty levels. Every page is designed with love, attention to detail, and a deep understanding of what makes coloring both enjoyable and meaningful.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission & Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To democratize creativity by providing free, high-quality coloring resources that inspire, educate, and bring joy to people of all ages around the world.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Our Values</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li><strong>Accessibility:</strong> Free resources for everyone</li>
                <li><strong>Quality:</strong> Professional, detailed designs</li>
                <li><strong>Inclusivity:</strong> Content for all ages and abilities</li>
                <li><strong>Innovation:</strong> Embracing new technologies like AI</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">For Everyone</h3>
              <p className="text-gray-600 text-sm">
                From toddlers to seniors, our collection includes age-appropriate content for every skill level and interest.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">
                Every coloring page is professionally designed, thoroughly tested, and optimized for the best printing experience.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Community</h3>
              <p className="text-gray-600 text-sm">
                Join millions of users worldwide who trust us for their creative and educational coloring needs.
              </p>
            </div>
          </div>
        </section>

        {/* Our Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Collections</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
                <ul className="text-gray-600 space-y-2">
                  <li><strong>Animals & Nature:</strong> Wildlife, pets, landscapes</li>
                  <li><strong>Fantasy & Magic:</strong> Unicorns, dragons, fairy tales</li>
                  <li><strong>Educational:</strong> Numbers, letters, shapes</li>
                  <li><strong>Seasonal:</strong> Holidays and celebrations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Features</h3>
                <ul className="text-gray-600 space-y-2">
                  <li><strong>Theme Park Adventures:</strong> Disney-inspired designs</li>
                  <li><strong>Easy Coloring Book:</strong> Simple designs for beginners</li>
                  <li><strong>AI Generator:</strong> Custom coloring pages on demand</li>
                  <li><strong>Latest Uploads:</strong> Fresh content weekly</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>Email:</strong> 591124281yj@gmail.com
                </p>
                <p>
                  <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (UTC)
                </p>
                <p>
                  <strong>Response Time:</strong> Within 24-48 hours
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>X (Twitter):</strong> @yangjerry666
                </p>
                <p>
                  <strong>Telegram:</strong> @yangjerry666
                </p>
                <p>
                  Stay updated with our latest releases, tips, and community highlights.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  )
} 