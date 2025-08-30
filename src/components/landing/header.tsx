
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Megaphone, MapPin, ChevronDown, Menu, Phone, User, Info, LogOut, Heart } from "lucide-react"
import Link from "next/link"
import { locations } from "@/lib/locations";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  selectedLocation?: string | null;
  setSelectedLocation?: (location: string | null) => void;
}

export function Header({ selectedLocation, setSelectedLocation = () => {} }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const LocationDropdown = ({ isMobile = false }: { isMobile?: boolean }) => (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isMobile ? (
             <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-xs truncate">{selectedLocation || 'Locations'}</span>
                <ChevronDown className="h-3 w-3" />
             </Button>
          ) : (
            <Button variant="ghost" className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span className="truncate">{selectedLocation || 'Tirupati, Vellore, Chittoor & more'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setSelectedLocation(null)}>All Locations</DropdownMenuItem>
          <DropdownMenuSeparator />
          {locations.map((location) => (
            location.subLocations ? (
              <DropdownMenuSub key={location.name}>
                <DropdownMenuSubTrigger onSelect={() => setSelectedLocation(location.name)}>{location.name}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {location.subLocations.map((subLocation) => (
                      <DropdownMenuItem key={subLocation} onSelect={() => setSelectedLocation(subLocation)}>{subLocation}</DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem key={location.name} onSelect={() => setSelectedLocation(location.name)}>{location.name}</DropdownMenuItem>
            )
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex-1 flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
              <Megaphone className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block font-headline">
                trustlyads.in
              </span>
          </Link>
          <div className="md:hidden">
            <LocationDropdown isMobile />
          </div>
        </div>

        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center">
             <LocationDropdown />
          </nav>
        </div>
        
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
          <nav className="flex gap-2 items-center">
            <Link href="/about" passHref>
                <Button variant="ghost" size="icon" aria-label="About us">
                    <Info />
                </Button>
            </Link>
             <a href="tel:+919380002829">
                <Button variant="ghost" size="icon" aria-label="Contact us">
                    <Phone />
                </Button>
            </a>
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
               <nav className="flex flex-col gap-2 py-6">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Quick Links</div>
                  
                  <Link href="/about" passHref>
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}><Info /> About</Button>
                  </Link>
                  <a href="tel:+919380002829">
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}><Phone /> Contact Us</Button>
                  </a>
                  
                  <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full mt-4">Post Your Business</Button>
                  </a>

                  <div className="absolute bottom-4 right-4">
                     <ThemeToggle />
                  </div>
               </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
