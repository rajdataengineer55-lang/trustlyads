
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Megaphone, MapPin, ChevronDown, Menu, Phone, User, Info, LogOut } from "lucide-react"
import Link from "next/link"
import { locations } from "@/lib/locations";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


interface HeaderProps {
  selectedLocation?: string | null;
  setSelectedLocation?: (location: string | null) => void;
}

export function Header({ selectedLocation, setSelectedLocation = () => {} }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();


  const UserMenu = () => {
    if (!user) {
        return <Button onClick={signInWithGoogle}>Sign In</Button>
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'}/>
                    <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
                <div className="flex flex-col">
                    <span className="font-semibold">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isAdmin && (
                <Link href="/admin">
                    <DropdownMenuItem>Admin Panel</DropdownMenuItem>
                </Link>
            )}
            <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

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
            <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer">
              <Button>Post Your Business</Button>
            </a>
            <ThemeToggle />
            <UserMenu />
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
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Main Menu</div>
                  {user ? (
                    <>
                       <div className="px-3 py-2">
                        <p className="font-semibold">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                       </div>
                       {isAdmin && (
                         <Link href="/admin" passHref>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Button>
                         </Link>
                       )}
                       <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut(); setIsMobileMenuOpen(false); }}><LogOut className="mr-2 h-4 w-4"/> Sign Out</Button>
                    </>
                  ) : (
                    <Button className="w-full" onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }}>Sign In</Button>
                  )}
                  
                  <div className="border-t my-4"></div>

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

    