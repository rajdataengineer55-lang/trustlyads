import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap, MapPin } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              TrustAds
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span>Tirupati, Vellore, Chittoor & more</span>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu */}
            <div className="md:hidden">
                <Link href="/" className="flex items-center space-x-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="font-bold sm:inline-block font-headline">
                    TrustAds
                    </span>
                </Link>
            </div>
          </div>
          <nav className="hidden md:flex gap-2">
            <Button>Post Your Business</Button>
            <Button variant="outline">Login</Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
