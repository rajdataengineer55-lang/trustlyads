import type { Metadata } from 'next';
import { Poppins, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { OffersProvider } from '@/contexts/OffersContext';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { StoriesProvider } from '@/contexts/StoriesContext';


const fontBody = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const fontHeadline = Poppins({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'trustlyads.in',
  description: 'Connect with Local Businesses. Find Best Offers Daily.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn("antialiased", fontBody.variable, fontHeadline.variable)}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <AuthProvider>
            <OffersProvider>
              <StoriesProvider>
                {children}
              </StoriesProvider>
            </OffersProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
