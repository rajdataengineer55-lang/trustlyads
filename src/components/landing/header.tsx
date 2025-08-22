
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu"
import { Megaphone, MapPin, ChevronDown, Users, Menu, Phone, User, Info } from "lucide-react"
import Link from "next/link"
import { locations } from "@/lib/locations";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';

export function Header() {
  const [followers, setFollowers] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
              <Megaphone className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block font-headline">
                trustlyads.in
              </span>
          </Link>
        </div>

        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>Tirupati, Vellore, Chittoor & more</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {locations.map((location) => (
                  location.subLocations ? (
                    <DropdownMenuSub key={location.name}>
                      <DropdownMenuSubTrigger>{location.name}</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {location.subLocations.map((subLocation) => (
                            <DropdownMenuItem key={subLocation}>{subLocation}</DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ) : (
                    <DropdownMenuItem key={location.name}>{location.name}</DropdownMenuItem>
                  )
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
          <nav className="flex gap-2 items-center">
            <Link href="/about" passHref>
                <Button variant="ghost" size="icon" aria-label="About us">
                    <Info />
                </Button>
            </Link>
             <Link href="/admin" passHref>
                <Button variant="ghost" size="icon" aria-label="Admin">
                    <User />
                </Button>
            </Link>
             <a href="tel:+919380002829">
                <Button variant="ghost" size="icon" aria-label="Contact us">
                    <Phone />
                </Button>
            </a>
            <Button variant="outline" onClick={() => setFollowers(followers + 1)}>
              <Users className="h-4 w-4 mr-2" />
              Followers
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">{followers}</span>
            </Button>
            <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer">
              <Button>Post Your Business</Button>
            </a>
            <ThemeToggle />
          </nav>
        </div>

        <div className="flex items-center justify-end md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Megaphone className="h-6 w-6 text-primary" />
                    <span className="font-bold sm:inline-block font-headline">
                      trustlyads.in
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
               <nav className="flex flex-col gap-4 py-6">
                  <div className="px-4">
                     <ThemeToggle />
                  </div>
                  <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">Post Your Business</Button>
                  </a>
                  <Button variant="outline" onClick={() => {
                      setFollowers(followers + 1);
                      setIsMobileMenuOpen(false);
                  }}>
                      <Users className="h-4 w-4 mr-2" />
                      Followers
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">{followers}</span>
                  </Button>
                  <Link href="/admin" passHref>
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}><User /> Admin</Button>
                  </Link>
                  <Link href="/about" passHref>
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}><Info /> About</Button>
                  </Link>
                  <a href="tel:+919380002829">
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}><Phone /> Contact Us</Button>
                  </a>
               </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
