import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Reset Password - 365 Coloring Pages | Secure Account Recovery',
  description: 'Forgot your password? Reset your 365 Coloring Pages account password securely. Access thousands of free printable coloring pages for kids and adults after resetting your password.',
  keywords: 'reset password, account recovery, coloring pages account, password recovery, forgot password, secure login, 365 coloring pages, printable coloring pages',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Reset Your Password - 365 Coloring Pages',
    description: 'Securely reset your password to access thousands of free coloring pages.',
    type: 'website',
    url: 'https://365coloringpages.com/reset-password',
    siteName: '365 Coloring Pages',
  },
  twitter: {
    card: 'summary',
    title: 'Reset Your Password - 365 Coloring Pages',
    description: 'Securely reset your password to access thousands of free coloring pages.',
  }
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <ResetPasswordClient />
    </Suspense>
  );
}
