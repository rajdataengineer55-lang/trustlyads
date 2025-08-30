
import type { Metadata, Viewport } from 'next';
import { Poppins, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { OffersProvider } from '@/contexts/OffersContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';


const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: ['400', '700']
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700']
});


export const metadata: Metadata = {
  title: 'LocalPulse',
  description: 'Connect with Local Businesses. Find Best Offers Daily.',
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn("antialiased font-body", poppins.variable, ptSans.variable)}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <AuthProvider>
            <OffersProvider>
              {children}
              <Toaster />
            </OffersProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
