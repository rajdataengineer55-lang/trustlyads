"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MapPin, ChevronDown, Menu, LogOut, Send, MessageCircle, Bell, Megaphone, Search } from "lucide-react"
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

const Logo = () => (
    <Link href="/" className="flex items-center space-x-2">
        <Megaphone className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold font-headline">trustlyads.in</span>
    </Link>
);


export function Header({ selectedLocation, setSelectedLocation = () => {} }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();


  const UserActions = () => {
    if (!user) {
        return <Button onClick={() => {signInWithGoogle(); setIsMobileMenuOpen(false);}} className="w-full">Sign In with Google</Button>
    }

    return (
        <div className="flex flex-col gap-2">
             <div className="flex items-center gap-3 p-2 rounded-md bg-muted">
                <Avatar className='h-9 w-9'>
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'}/>
                    <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            </div>
            {isAdmin && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">Admin Panel</Button>
                </Link>
            )}
             <Link href="/requests" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start">
                    <Send className="mr-2 h-4 w-4" />
                    My Requests
                </Button>
            </Link>
            <Button variant="ghost" onClick={() => {signOut(); setIsMobileMenuOpen(false);}} className="w-full justify-start mt-4">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
        </div>
    )
  }

  const LocationDropdown = () => (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden md:inline-flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold truncate pr-1">{selectedLocation || 'All Locations'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
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

  const MainNav = () => (
    <div className='flex items-center gap-2'>
        <LocationDropdown />
        <Link href="/requests/new" passHref>
            <Button variant="secondary" className="hidden sm:inline-flex">Post a Request</Button>
        </Link>
        <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer">
          <Button className="hidden sm:inline-flex">Post Your Business</Button>
        </a>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
            <div className='md:hidden'>
              <Logo />
            </div>
            <div className='hidden md:flex'>
              <Logo />
            </div>
        </div>

        <div className="flex items-center gap-2">
           <div className='hidden md:flex'>
             <MainNav />
           </div>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon" className='md:hidden'>
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
                <nav className="flex flex-col gap-4 py-6">
                    <UserActions />
                    <div className='mt-4'>
                      <Link href="/requests/new" passHref>
                          <Button variant="secondary" className='w-full'>Post a Request</Button>
                      </Link>
                      <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full mt-2" >Post Your Business</Button>
                      </a>
                    </div>
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
