"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Megaphone, MapPin, ChevronDown, Menu, Phone, User, Info, LogOut, Send, Search, Bell, MessageCircle } from "lucide-react"
import Link from "next/link"
import { locations } from "@/lib/locations";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface HeaderProps {
  selectedLocation?: string | null;
  setSelectedLocation?: (location: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Logo = () => (
    <svg width="60" height="30" viewBox="0 0 100 50" className="fill-primary">
        <text x="0" y="40" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold">
            olx
        </text>
    </svg>
);


export function Header({ selectedLocation, setSelectedLocation = () => {}, searchTerm, setSearchTerm }: HeaderProps) {
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
             <Link href="/requests">
                <DropdownMenuItem>
                    <Send className="mr-2 h-4 w-4" />
                    My Requests
                </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const LocationDropdown = () => (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 p-2 rounded-md border border-input bg-background w-full sm:w-64 cursor-pointer">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm truncate">{selectedLocation || 'Tirupati, Andhra Pradesh'}</span>
              <ChevronDown className="h-5 w-5" />
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
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
      <div className="container flex h-20 items-center gap-4">
        <Link href="/" className="items-center space-x-2 md:flex hidden">
            <Logo />
        </Link>
        
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo />
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
                       <Link href="/requests" passHref>
                         <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>My Requests</Button>
                       </Link>
                       <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut(); setIsMobileMenuOpen(false); }}><LogOut className="mr-2 h-4 w-4"/> Sign Out</Button>
                    </>
                  ) : (
                    <Button className="w-full" onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }}>Sign In</Button>
                  )}
                  
                  <div className="border-t my-4"></div>

                  <Link href="/requests/new" passHref>
                    <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Post a Request</Button>
                  </Link>

                  <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full mt-4" variant="secondary">Post Your Business</Button>
                  </a>
                  
                  <div className="absolute bottom-4 right-4">
                     <ThemeToggle />
                  </div>
               </nav>
            </SheetContent>
          </Sheet>
        </div>


        <div className="hidden md:flex items-center gap-2">
            <LocationDropdown />
        </div>
        
        <div className="flex-1 flex items-center">
            <div className="relative w-full">
                <Input
                    type="search"
                    placeholder="Find Cars, Mobile Phones and more..."
                    className="w-full pr-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button size="icon" className="absolute right-0 top-0 h-full w-12 rounded-l-none bg-primary hover:bg-primary/90">
                    <Search className="h-6 w-6 text-primary-foreground" />
                </Button>
            </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        ENGLISH <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>English</DropdownMenuItem>
                    <DropdownMenuItem>हिन्दी</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon">
                <MessageCircle className="h-6 w-6" />
            </Button>
             <Button variant="ghost" size="icon">
                <Bell className="h-6 w-6" />
            </Button>

            <UserMenu />

            <Link href="/requests/new">
                <Button size="lg" className="rounded-full font-bold text-base shadow-lg group">
                    <span className="text-xl mr-1 group-hover:animate-bounce">+</span> SELL
                </Button>
            </Link>
          </nav>
      </div>
    </header>
  )
}
