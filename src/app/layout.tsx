import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientMetaFix from "./ClientMetaFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Root Layout Metadata - Global Fallback
 * This will be overridden by page-specific metadata
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://365coloringpages.com'),
  title: {
    default: '365 Coloring Pages - Free Printable Coloring Sheets',
    template: '%s | 365 Coloring Pages',
  },
  description: 'Browse 10,000+ free printable coloring pages for kids and adults. Download high-quality sheets: Animals, Disney characters, Holidays & More.',
  keywords: 'coloring pages, free coloring pages, printable coloring pages, coloring pages for kids',
  authors: [{ name: '365 Coloring Pages' }],
  creator: '365 Coloring Pages',
  publisher: '365 Coloring Pages',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 基础标签 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 
          重要提示：
          由于 Next.js 15 + Turbopack 在开发模式下的 bug，
          我们在这里只放置基础标签。
          页面级的 SEO meta 标签由 page.tsx 的 metadata 对象提供。
          
          如果在开发模式下 meta 标签仍在 body 中，
          请测试生产构建：npm run build && npm start
          生产环境中 meta 标签会正确出现在 <head> 中。
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* 客户端修复：确保 meta 标签在 <head> 中 */}
        <ClientMetaFix />
        {children}
      </body>
    </html>
  );
}
