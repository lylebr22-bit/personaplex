import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://flipcheck.app'),
  title: {
    default: 'FlipCheck — Snap a tag, know what it’s worth',
    template: '%s · FlipCheck',
  },
  description:
    'Scan any thrift find with one photo. Get a realistic resale price, the best platform to list on, and a listing title that sells. Built for flippers.',
  keywords: [
    'reselling',
    'thrift',
    'flipping',
    'Poshmark',
    'Depop',
    'eBay',
    'Mercari',
    'resale appraisal',
    'AI price check',
  ],
  authors: [{ name: 'FlipCheck' }],
  openGraph: {
    title: 'FlipCheck — Snap a tag, know what it’s worth',
    description:
      'One photo → realistic resale price + best platform + listing title. For flippers who are tired of guessing.',
    url: 'https://flipcheck.app',
    siteName: 'FlipCheck',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlipCheck — Snap a tag, know what it’s worth',
    description:
      'One photo → realistic resale price + best platform + listing title.',
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230b0b0f'/%3E%3Crect x='10' y='10' width='12' height='12' rx='2' fill='%23f97316' transform='rotate(45 16 16)'/%3E%3C/svg%3E",
        type: 'image/svg+xml',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0b0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
