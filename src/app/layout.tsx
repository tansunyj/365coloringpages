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
    icon: '/images/logo.ico',
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
        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* 客户端修复：确保 meta 标签�?<head> �?*/}
        <ClientMetaFix />
        {children}
      </body>
    </html>
  );
}
