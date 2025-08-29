
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, EyeOff, MapPin, Clock, Building } from "lucide-react";
import { useOffers } from "@/contexts/OffersContext";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { useMemo } from "react";
import { locations } from "@/lib/locations";


interface FeaturedOffersProps {
  selectedCategory: string | null;
  selectedLocation: string | null;
  searchTerm: string;
  sortOption: string;
}

export function FeaturedOffers({ selectedCategory, selectedLocation, searchTerm, sortOption }: FeaturedOffersProps) {
  const { offers, loading: offersLoading } = useOffers();
  const { loading: authLoading, isAdmin } = useAuth();
  
  const loading = offersLoading || authLoading;

  const filteredAndSortedOffers = useMemo(() => {
    let filtered = offers.filter(offer => isAdmin || !offer.isHidden);

    if (selectedCategory) {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    if (selectedLocation) {
        const mainLocation = locations.find(loc => loc.name === selectedLocation && loc.subLocations);
        if (mainLocation?.subLocations) {
            const locationsToShow = [mainLocation.name, ...mainLocation.subLocations];
            filtered = filtered.filter(offer => locationsToShow.includes(offer.location));
        } else {
            filtered = filtered.filter(offer => offer.location === selectedLocation);
        }
    }

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchTermLower) ||
        offer.business.toLowerCase().includes(searchTermLower) ||
        offer.location.toLowerCase().includes(searchTermLower) ||
        offer.description.toLowerCase().includes(searchTermLower) ||
        (offer.nearbyLocation && offer.nearbyLocation.toLowerCase().includes(searchTermLower)) ||
        offer.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    if (sortOption === 'trending') {
      return filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    // Default sort is 'newest' (which is the default from Firestore due to orderBy)
    return filtered;

  }, [offers, isAdmin, selectedCategory, selectedLocation, searchTerm, sortOption]);
  
  if (loading) {
    return (
      <section id="featured-offers" className="w-full py-10 sm:py-12">
        <div className="container mx-auto px-4 md:px-6">
           <h2 className="text-3xl font-headline font-bold text-center mb-12">
            Featured Offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <Skeleton className="h-[380px] w-full" />
            <Skeleton className="h-[380px] w-full" />
            <Skeleton className="h-[380px] w-full" />
            <Skeleton className="h-[380px] w-full" />
            <Skeleton className="h-[380px] w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (filteredAndSortedOffers.length === 0) {
    return (
       <section id="featured-offers" className="w-full py-10 sm:py-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">
              Featured Offers
            </h2>
            <p className="text-muted-foreground">No offers found for the selected filters.</p>
          </div>
       </section>
    );
  }

  return (
    <>
    <section id="featured-offers" className="w-full py-10 sm:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedOffers.map((offer) => {
            if (!offer.createdAt) return null; // Guard against missing createdAt
            const isNew = (new Date().getTime() - new Date(offer.createdAt).getTime()) < 24 * 60 * 60 * 1000;
            const imageUrl = offer.image || 'https://placehold.co/600x400.png';

            return (
              <Card key={offer.id} className={cn("overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 w-full flex flex-col", offer.isHidden && "opacity-60")}>
                <CardContent className="p-0 flex flex-col flex-grow">
                  <Link href={`/offer/${offer.id}`} className="cursor-pointer block">
                    <div className="relative aspect-[4/3] w-full bg-muted">
                      <Image
                        src={imageUrl}
                        alt={offer.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <h3 className="text-lg font-headline font-bold text-white truncate">{offer.title}</h3>
                      </div>
                      <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold py-1 px-3">
                          {offer.discount}
                      </Badge>
                      {offer.isHidden && (
                          <Badge variant="destructive" className="absolute top-4 left-4 font-bold">
                            <EyeOff className="mr-2 h-4 w-4" /> Hidden
                          </Badge>
                      )}
                      {isNew && !offer.isHidden && (
                          <Badge variant="secondary" className="absolute top-4 left-4 font-bold bg-green-500 text-white">
                              Just Listed
                          </Badge>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 sm:p-6 bg-card flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{offer.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {offer.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>                            
                      ))}
                    </div>
                    <div className="mt-auto">
                        <Link href={`/offer/${offer.id}`} passHref>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                               View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
          )})}
        </div>
      </div>
    </section>
    </>
  );
}
