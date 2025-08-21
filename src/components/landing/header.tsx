"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu"
import { Zap, MapPin, ChevronDown, Users } from "lucide-react"
import Link from "next/link"
import { locations } from "@/lib/locations";

export function Header() {
  const [followers, setFollowers] = useState(0);

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
          <nav className="hidden md:flex gap-2 items-center">
            <Button variant="outline" onClick={() => setFollowers(followers + 1)}>
              <Users className="h-4 w-4 mr-2" />
              Follow
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">{followers}</span>
            </Button>
            <Link href="/admin">
              <Button>Admin</Button>
            </Link>
            <Button>Post Your Business</Button>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
