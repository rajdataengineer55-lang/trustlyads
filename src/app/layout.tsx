import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { OffersProvider } from '@/contexts/OffersContext';

export const metadata: Metadata = {
  title: 'TrustAds',
  description: 'Connect with Local Businesses. Find Best Offers Daily.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <OffersProvider>
          {children}
        </OffersProvider>
        <Toaster />
      </body>
    </html>
  );
}
