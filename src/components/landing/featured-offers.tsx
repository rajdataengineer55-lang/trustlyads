
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, EyeOff, MapPin, Calendar, Tag } from "lucide-react";
import { useOffers } from "@/contexts/OffersContext";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { locations } from "@/lib/locations";
import { formatDistanceToNow } from 'date-fns';
import { categories } from "@/lib/categories";

interface FeaturedOffersProps {
  selectedCategory: string | null;
  selectedLocation: string | null;
  searchTerm: string;
  sortOption: string;
}

export function FeaturedOffers({ selectedCategory, selectedLocation, searchTerm, sortOption }: FeaturedOffersProps) {
  const { offers, loading: offersLoading } = useOffers();
  
  const loading = offersLoading;

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : <Tag className="h-4 w-4 mr-2 shrink-0 mt-0.5" />;
  };

  const filteredAndSortedOffers = useMemo(() => {
    let filtered = offers.filter(offer => !offer.isHidden);

    if (selectedCategory) {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    if (selectedLocation) {
        // Find if the selected location is a main location with sub-locations
        const mainLocation = locations.find(loc => loc.name === selectedLocation && loc.subLocations);
        if (mainLocation?.subLocations) {
            // If it is, include offers from the main location and all its sub-locations
            const locationsToShow = [mainLocation.name, ...mainLocation.subLocations];
            filtered = filtered.filter(offer => locationsToShow.includes(offer.location));
        } else {
            // Otherwise, it's a sub-location or a main location without subs, so match directly
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

  }, [offers, selectedCategory, selectedLocation, searchTerm, sortOption]);
  
  if (loading) {
    return (
      <section id="featured-offers" className="w-full py-10 sm:py-12">
        <div className="container mx-auto px-4 md:px-6">
           <h2 className="text-3xl font-bold text-center mb-12">
            Featured Offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
            <h2 className="text-3xl font-bold mb-4">
              Featured Offers
            </h2>
            <p className="text-muted-foreground">No offers found for the selected filters.</p>
          </div>
       </section>
    );
  }

  return (
    <section id="featured-offers" className="w-full py-10 sm:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAndSortedOffers.map((offer) => {
            const imageUrl = offer.image || 'https://placehold.co/600x400.png';
            return (
            <Card key={offer.id} className={cn("overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 w-full flex flex-col", offer.isHidden && "opacity-60")}>
              <CardContent className="p-0 flex flex-col flex-grow">
                <Link href={`/offer/${offer.id}`} passHref className="block">
                  <div className="relative aspect-[4/3] bg-black">
                    <Image
                      src={imageUrl}
                      alt={offer.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    {offer.isHidden && (
                        <Badge variant="destructive" className="absolute top-2 right-2 font-bold">
                          <EyeOff className="mr-2 h-4 w-4" /> Hidden
                        </Badge>
                    )}
                     <Badge variant="default" className="absolute top-2 left-2 animate-blink">
                        {offer.discount}
                    </Badge>
                  </div>
                </Link>
                <div className="p-4 bg-card flex flex-col flex-grow">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-start text-sm text-muted-foreground">
                      {getCategoryIcon(offer.category)}
                      <span className="truncate">{offer.category}</span>
                    </div>
                    <Link href={`/offer/${offer.id}`} passHref>
                        <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors h-14 overflow-hidden">
                            {offer.title}
                        </h3>
                    </Link>
                     {offer.price && (
                        <p className="text-xl font-bold text-primary my-2">₹ {offer.price.toLocaleString()}</p>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{offer.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="mt-4">
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
  );
}
