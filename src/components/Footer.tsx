'use client';

import { Palette, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-gray-800" style={{ backgroundColor: '#fefdfb' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 网站简介 */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Palette className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold">Coloring Pages</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Unleash your creativity with thousands of beautiful, free coloring pages. Perfect for kids and adults alike.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 发现 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Discover</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Popular Pages
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  New Releases
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  AI Generator
                </a>
              </li>
            </ul>
          </div>

          {/* 社区 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Submit Your Art
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Artist Spotlights
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Contests
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>

          {/* 支持 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Copyright
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