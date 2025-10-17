'use client';

import { Palette } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-gray-800" style={{ backgroundColor: '#f4f4f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* 网站简介 */}
          <div className="lg:col-span-1 relative pr-8">
            <Link href="/" className="flex items-center mb-5 hover:opacity-80 transition-opacity">
              <img src="/images/logo.png" alt="365 Coloring Pages Logo" className="h-24 w-24 rounded-md" />
              <span className="ml-3 text-3xl font-bold">Coloring Pages</span>
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              Unleash your creativity with thousands of beautiful, free coloring pages. Perfect for kids and adults alike.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:591124281yj@gmail.com" className="text-gray-500 hover:text-orange-500 transition-colors" title="Email us">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </a>
              <a href="https://x.com/yangjerry666" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors" title="Follow us on X">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
              <a href="https://t.me/yangjerry666" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors" title="Contact us on Telegram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
            {/* 竖线分割 - 更显眼的颜色 */}
            <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-gray-300"></div>
          </div>

          {/* 发现 */}
          <div className="relative pr-8">
            <h3 className="text-lg font-black mb-5 text-gray-900">Discover</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Link href="/best-coloring-pages" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                Best Coloring Pages
              </Link>
              <Link href="/new-coloring-pages" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                New Coloring Pages
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                Categories
              </Link>
                              <Link href="/disney-characters" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                Disney & Characters
              </Link>
              <Link href="/easy-coloring-pages" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                Easy Coloring Pages
              </Link>
              <Link href="/ai-generator" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                AI Generator
              </Link>
            </div>
            {/* 竖线分割 - 更显眼的颜色 */}
            <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-gray-300"></div>
          </div>

          {/* 关于我们 */}
          <div className="relative pr-8">
            <h3 className="text-lg font-black mb-5 text-gray-900">About</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                  Terms of Service
                </Link>
              </li>
            </ul>
            {/* 竖线分割 - 更显眼的颜色 */}
            <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-gray-300"></div>
          </div>

          {/* 友情链接 */}
          <div>
            <h3 className="text-lg font-black mb-5 text-gray-900">Friendly Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.baixarvideoyoutube.video/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                  Baixar Video Youtube
                </a>
              </li>
              <li>
                <a href="https://www.chinesename.us/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                  Chinese Name Tools
                </a>
              </li>
              <li>
                <a href="https://www.j10c.net/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                  J10C Network
                </a>
              </li>
              <li>
                <a href="https://toolkit-hub-liard.vercel.app/#/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors text-sm leading-relaxed">
                  Toolkit Hub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-orange-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2024 365 Coloring Pages. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              Made with ❤️ for creative minds everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}