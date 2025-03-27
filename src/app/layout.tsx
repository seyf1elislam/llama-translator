// import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import ThemeProviderWrapper from '@/components/theme-components/providers';

import { siteConfig } from '@/config/siteConfig';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: siteConfig.siteNameTemplate,
//   },
//   description: siteConfig.description,
//   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url),
// };

// import { siteConfig } from '@/config/siteConfig';

// Metadata remains the same
export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  );
}
