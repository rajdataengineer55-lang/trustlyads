
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, EyeOff, MapPin, Clock, Building } from "lucide-react";
import { useOffers } from "@/contexts/OffersContext";
import Link from "next/link";
import type { SortOption } from "./filters";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';

interface FeaturedOffersProps {
  selectedCategory: string | null;
  selectedLocation: string | null;
  sortOption: SortOption;
  searchTerm: string;
}

const authorizedAdminEmail = "dandurajkumarworld24@gmail.com";

export function FeaturedOffers({ selectedCategory, selectedLocation, sortOption, searchTerm }: FeaturedOffersProps) {
  const { offers, loading: offersLoading } = useOffers();
  const { user, loading: authLoading } = useAuth();
  
  const loading = offersLoading || authLoading;
  const isAdmin = user?.email === authorizedAdminEmail;

  const filteredOffers = offers
    .filter(offer => {
      // Admin sees all offers, others only see non-hidden ones.
      return isAdmin || !offer.isHidden;
    })
    .filter(offer => {
      const categoryMatch = selectedCategory ? offer.category === selectedCategory : true;
      const locationMatch = selectedLocation ? offer.location === selectedLocation : true;
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch = searchTerm
        ? offer.title.toLowerCase().includes(searchTermLower) ||
          offer.business.toLowerCase().includes(searchTermLower) ||
          offer.location.toLowerCase().includes(searchTermLower) ||
          offer.description.toLowerCase().includes(searchTermLower) ||
          (offer.nearbyLocation && offer.nearbyLocation.toLowerCase().includes(searchTermLower)) ||
          offer.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
        : true;
      return categoryMatch && locationMatch && searchMatch;
    });
    // Note: 'trending' sort was removed as it was not fully implemented.
    // The default sort from Firestore (newest first) is used.
  
  if (loading) {
    return (
      <section id="featured-offers" className="w-full pt-16 sm:pt-24">
        <div className="container mx-auto px-4 md:px-6">
           <h2 className="text-3xl font-headline font-bold text-center mb-12">
            Featured Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (filteredOffers.length === 0) {
    return (
       <section id="featured-offers" className="w-full py-16 sm:py-24">
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
    <section id="featured-offers" className="w-full pt-16 sm:pt-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-headline font-bold text-center mb-12">
          Featured Offers
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: filteredOffers.length > 2,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredOffers.map((offer) => {
              const isNew = offer.createdAt && (new Date().getTime() - new Date(offer.createdAt).getTime()) < 24 * 60 * 60 * 1000;
              return (
              <CarouselItem key={offer.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                  <Card className={cn("overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col", offer.isHidden && "opacity-60")}>
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={offer.image}
                          alt={offer.title}
                          width={400}
                          height={300}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={offer.hint}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-xl font-headline font-bold text-white truncate">{offer.title}</h3>
                        </div>
                        <Badge variant="default" className="absolute top-4 right-4 bg-black text-white font-bold py-1 px-3 animate-blink">
                          {offer.discount}
                        </Badge>
                         {offer.isHidden && (
                            <Badge variant="destructive" className="absolute top-4 left-4 font-bold py-1 px-3">
                              <EyeOff className="mr-2 h-4 w-4" /> Hidden
                            </Badge>
                         )}
                         {isNew && !offer.isHidden && (
                            <Badge variant="secondary" className="absolute top-4 left-4 font-bold py-1 px-3 bg-green-500 text-white">
                               Just Listed
                            </Badge>
                          )}
                      </div>
                      <div className="p-4 sm:p-6 bg-card flex flex-col flex-grow">
                         <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Building className="h-4 w-4 mr-2 shrink-0" />
                              <p className="truncate font-medium text-foreground">{offer.business}</p>
                         </div>
                         <div className="flex items-start text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                            <div>
                              <p className="truncate font-medium text-foreground">{offer.location}</p>
                              {offer.nearbyLocation && <p className="truncate text-xs">{offer.nearbyLocation}</p>}
                            </div>
                         </div>
                         <div className="flex items-center text-xs text-muted-foreground mb-4 ml-1">
                             <Clock className="h-3 w-3 mr-1.5" />
                             <span>Posted {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}</span>
                         </div>
                        <div className="flex flex-wrap gap-2 mb-4 min-h-[24px]">
                          {offer.tags?.slice(0,3).map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                        <div className="mt-auto pt-4">
                          <Link href={`/offer/${offer.id}`} passHref>
                            <Button className="w-full">
                                 View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </CarouselItem>
            )})}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
