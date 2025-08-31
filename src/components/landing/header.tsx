
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, ChevronDown, Menu, LogOut, Send, MessageCircle, Bell, Megaphone, User as UserIcon, Phone, UserPlus } from "lucide-react"
import Link from "next/link"
import { locations } from "@/lib/locations";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PhoneLoginForm } from '../phone-login-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface HeaderProps {
  selectedLocation?: string | null;
  setSelectedLocation?: (location: string | null) => void;
}

const Logo = () => (
    <Link href="/" className="flex items-center space-x-2">
        <Megaphone className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">trustlyads.in</span>
    </Link>
);

export function Header({ selectedLocation, setSelectedLocation = () => {} }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPhoneLoginOpen, setIsPhoneLoginOpen] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const { user, isAdmin, signOut, signInWithGoogle } = useAuth();
  const isMobile = useIsMobile();


  const UserMenu = () => {
     if (!user) {
      return (
        <>
          <Dialog open={isPhoneLoginOpen} onOpenChange={setIsPhoneLoginOpen}>
            <Button variant="outline" size="sm" onClick={() => {
                setIsVerificationCodeSent(false);
                setIsPhoneLoginOpen(true);
            }}>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign In
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign In with Phone</DialogTitle>
                    <DialogDescription>
                        {isVerificationCodeSent 
                            ? 'Enter the 6-digit code sent to your phone.'
                            : 'Enter your phone number to receive a verification code.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <div key={isVerificationCodeSent ? 'code-form' : 'phone-form'}>
                  <PhoneLoginForm
                    isCodeSent={isVerificationCodeSent}
                    onCodeSent={() => setIsVerificationCodeSent(true)}
                    onLoginSuccess={() => {
                      setIsPhoneLoginOpen(false);
                      setIsVerificationCodeSent(false);
                    }}
                    onChangeNumber={() => setIsVerificationCodeSent(false)}
                  />
                </div>
            </DialogContent>
          </Dialog>
        </>
      )
     }
     
     return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className='h-9 w-9'>
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'}/>
                        <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email ?? user.phoneNumber}</p>
                    </div>
                </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                 <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     )
  }

  const MobileUserMenu = () => {
    if (!user) {
        return (
            <div className="flex flex-col gap-2">
                 <Button variant="default" className="w-full" onClick={() => {
                    setIsVerificationCodeSent(false);
                    setIsPhoneLoginOpen(true);
                    setIsMobileMenuOpen(false);
                 }}>
                    <Phone className="mr-2 h-4 w-4" />
                    Sign In with Phone
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
             <div className="flex items-center gap-3 p-2 rounded-md bg-muted">
                <Avatar className='h-9 w-9'>
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'}/>
                    <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                    <span className="font-semibold text-sm truncate">{user.displayName ?? "User"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email ?? user.phoneNumber}</span>
                </div>
            </div>
            {isAdmin && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">Admin Panel</Button>
                </Link>
            )}
            <Button variant="ghost" onClick={() => {signOut(); setIsMobileMenuOpen(false);}} className="w-full justify-start mt-4">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
        </div>
    )
  }

  const DesktopLocationDropdown = () => (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs sm:text-sm">
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
                <DropdownMenuSubTrigger>{location.name}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                     <DropdownMenuItem onSelect={() => setSelectedLocation(location.name)}>All of {location.name}</DropdownMenuItem>
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

  const MobileLocationSelector = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (location: string | null) => {
        setSelectedLocation(location);
        setIsOpen(false);
    }
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs sm:text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold truncate pr-1">{selectedLocation || 'All Locations'}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-lg">
                <SheetHeader>
                    <SheetTitle>Select a Location</SheetTitle>
                </SheetHeader>
                <div className="py-4 max-h-[70vh] overflow-y-auto">
                    <Accordion type="single" collapsible className="w-full">
                        <div
                            onClick={() => handleSelect(null)}
                            className="flex items-center p-4 cursor-pointer hover:bg-muted rounded-md text-sm font-semibold"
                        >
                            All Locations
                        </div>
                        {locations.map((location) => (
                            location.subLocations ? (
                                <AccordionItem value={location.name} key={location.name}>
                                    <AccordionTrigger>{location.name}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="pl-4">
                                            <li onClick={() => handleSelect(location.name)} className="py-2 cursor-pointer hover:bg-muted rounded-md px-2">
                                                All of {location.name}
                                            </li>
                                            {location.subLocations.map(sub => (
                                                <li key={sub} onClick={() => handleSelect(sub)} className="py-2 cursor-pointer hover:bg-muted rounded-md px-2">
                                                    {sub}
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ) : (
                                <div
                                    key={location.name}
                                    onClick={() => handleSelect(location.name)}
                                    className="flex items-center p-4 cursor-pointer hover:bg-muted rounded-md text-sm font-semibold"
                                >
                                    {location.name}
                                </div>
                            )
                        ))}
                    </Accordion>
                </div>
            </SheetContent>
        </Sheet>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-1 md:gap-2">
          <Logo />
        </div>

        <div className="flex flex-1 justify-end items-center gap-2">
            <div className="flex-1 hidden md:flex justify-end">
                {isMobile === false ? <DesktopLocationDropdown /> : <MobileLocationSelector />}
            </div>
            
            <div className='hidden md:flex items-center gap-2'>
              <a href="https://wa.me/919380002829" target="_blank" rel="noopener noreferrer">
                <Button size="sm">Post Your Business</Button>
              </a>
              <UserMenu />
            </div>

            <div className='flex md:hidden items-center gap-2'>
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
                        <MobileUserMenu />
                        <div className='mt-4'>
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
      </div>
    </header>
  )
}
