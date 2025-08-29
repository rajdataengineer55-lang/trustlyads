
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Megaphone, MapPin, ChevronDown, Menu, Phone, User, Info, LogIn, LogOut, Heart } from "lucide-react"
import Link from "next/link"
import { locations } from "@/lib/locations";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { addFollower, removeFollower, isFollowing, getFollowersCount } from '@/lib/followers';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  selectedLocation?: string | null;
  setSelectedLocation?: (location: string | null) => void;
}

export function Header({ selectedLocation, setSelectedLocation = () => {} }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { toast } = useToast();

  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(true);

  const fetchFollowerData = useCallback(async () => {
    setIsFollowLoading(true);
    // Fetch the count regardless of user state
    getFollowersCount().then(setFollowersCount);

    if (user) {
      // Check following status only if user is logged in
      isFollowing(user.uid).then(status => {
        setFollowing(status);
        setIsFollowLoading(false);
      });
    } else {
      setFollowing(false);
      setIsFollowLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFollowerData();
  }, [fetchFollowerData]);


  const handleFollowToggle = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "You need to be signed in to follow.", variant: "destructive" });
      return;
    }
    
    setIsFollowLoading(true);
    try {
      if (following) {
        await removeFollower(user.uid);
        setFollowing(false);
        setFollowersCount(prev => prev - 1); // Optimistically update count
        toast({ title: "Unfollowed", description: "You are no longer following." });
      } else {
        await addFollower(user.uid);
        setFollowing(true);
        setFollowersCount(prev => prev + 1); // Optimistically update count
        toast({ title: "Followed!", description: "Thanks for following!" });
      }
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      // If there was an error, refetch the real data to correct optimistic updates
      fetchFollowerData();
    } finally {
      setIsFollowLoading(false);
    }
  };


  const FollowButton = ({ isMobile = false }) => (
    <Button
      variant={following ? "default" : "outline"}
      onClick={handleFollowToggle}
      disabled={!user || isFollowLoading}
      className={isMobile ? "w-full justify-start gap-2" : ""}
    >
      <Heart className={`mr-2 h-4 w-4 ${following && !isMobile ? 'fill-white' : ''}`} />
      {following ? 'Following' : 'Follow'}
      <span className="ml-2 bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
        {followersCount}
      </span>
    </Button>
  );

  const UserMenu = () => {
    if (loading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              Signed in as {user.displayName}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/admin" passHref>
              <DropdownMenuItem><User className="mr-2" /> Admin</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={signOut}><LogOut className="mr-2" /> Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button onClick={signInWithGoogle}>
        <LogIn className="mr-2" />
        Sign In
      </Button>
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
            <FollowButton />
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
            <UserMenu />
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
                  {user ? (
                    <>
                      <div className='px-4 mb-2'>
                        <p className='text-sm font-medium'>{user.displayName}</p>
                        <p className='text-xs text-muted-foreground'>{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <Link href="/admin" passHref>
                        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}><User /> Admin</Button>
                      </Link>
                      <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { signOut(); setIsMobileMenuOpen(false); }}><LogOut /> Sign Out</Button>
                    </>
                  ) : (
                    <Button className="w-full" onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }}><LogIn /> Sign In</Button>
                  )}

                  <DropdownMenuSeparator />
                  
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Quick Links</div>
                  
                  <FollowButton isMobile={true} />

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
