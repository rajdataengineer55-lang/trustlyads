
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <SearchX className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </main>
      </body>
    </html>
  )
}
