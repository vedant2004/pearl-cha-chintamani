import type { Metadata, Viewport } from 'next';
import './globals.css';
import MarigoldPetals from '@/components/MarigoldPetals';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'PEARL CHA CHINTAMANI | Ganesh Utsav 2026 | Hyderabad',
  description:
    'Official Ganesh Utsav 2026 website for Pearl Community in Hyderabad, India. Darshan, Aarti and Pooja timings at the Stage, cultural events, gallery, volunteer seva, and blessings for Lord Ganesha.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  keywords: [
    'Pearl Cha Chintamani',
    'Ganesh Utsav 2026',
    'Hyderabad Ganpati',
    'Pearl Apartments Ganesh Festival',
    'Aarti Timings Stage',
    'Visarjan 2026',
  ],
  openGraph: {
    title: 'PEARL CHA CHINTAMANI | Ganesh Utsav 2026',
    description: 'Ganpati Bappa Morya! Explore Pooja timings, events, gallery, and volunteer seva.',
    images: ['/images/ganpati-hero.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#200407',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <MarigoldPetals />
        {children}
      </body>
    </html>
  );
}
