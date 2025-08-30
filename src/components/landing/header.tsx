
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MapPin, ChevronDown, Menu, LogOut, Send, MessageCircle, Bell } from "lucide-react"
import Link from "next/link"
import { locations } from "@/lib/locations";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';


interface HeaderProps {
  selectedLocation?: string | null;
  setSelectedLocation?: (location: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Logo = () => (
    <Link href="/" className="flex items-center space-x-2">
        <span className="text-2xl sm:text-3xl font-bold font-headline text-primary">trustlyads.in</span>
    </Link>
);


export function Header({ selectedLocation, setSelectedLocation = () => {}, searchTerm, setSearchTerm }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();


  const UserMenu = () => {
    if (!user) {
        return <Button onClick={signInWithGoogle} size="sm">Sign In</Button>
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className='h-9 w-9'>
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
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-semibold truncate pr-2">{selectedLocation || 'Tirupati, Andhra Pradesh'}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
          <DropdownMenuItem onSelect={() => setSelectedLocation(null)}>All Locations</DropdownMenuItem>
          <DropdownMenuSeparator />
          {locations.map((location) => (
            location.subLocations ? (
              <DropdownMenuSub key={location.name}>
                <DropdownMenuSubTrigger onSelect={() => setSelectedLocation(location.name)}>{location.name}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                     <DropdownMenuItem key={location.name} onSelect={() => setSelectedLocation(location.name)}>All of {location.name}</DropdownMenuItem>
                     <DropdownMenuSeparator />
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="container flex h-16 sm:h-20 items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
             <div className="md:flex">
                 <Logo />
             </div>
        </div>

        <div className='hidden md:flex items-center gap-2 lg:gap-4'>
             <LocationDropdown />
        </div>
        
        
        <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <MessageCircle />
              <span className='sr-only'>Chat</span>
            </Button>
             <Button variant="ghost" size="icon">
              <Bell />
              <span className='sr-only'>Notifications</span>
            </Button>
            <UserMenu />
            <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="font-bold shadow-lg group">
                Post Business
              </Button>
            </a>
            <Link href="/requests/new" passHref>
                <Button variant="secondary" size="sm">Post a Request</Button>
            </Link>
          </nav>
        
        <div className="flex items-center gap-2 md:hidden">
            <UserMenu />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className='w-full max-w-[300px]'>
              <SheetHeader>
                <SheetTitle>
                  <div onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>
               <nav className="flex flex-col gap-2 py-6">
                  <div className="px-4">
                     <LocationDropdown />
                  </div>
                  <div className="border-t my-4"></div>
                  <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full mt-4" variant="secondary">Post Your Business</Button>
                  </a>
                   <Link href="/requests/new" passHref>
                        <Button variant="outline" className='w-full'>Post a Request</Button>
                    </Link>
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
