
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useStories } from '@/contexts/StoriesContext';
import { Skeleton } from '../ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useMemo } from 'react';
import { locations } from '@/lib/locations';

interface StoriesProps {
  selectedLocation: string | null;
}

export function Stories({ selectedLocation }: StoriesProps) {
  const { stories, loading } = useStories();

  const filteredStories = useMemo(() => {
    if (!selectedLocation) {
      return stories;
    }

    // Find if the selected location is a main location with sub-locations
    const mainLocation = locations.find(loc => loc.name === selectedLocation && loc.subLocations);

    if (mainLocation && mainLocation.subLocations) {
      // If a main location is selected, show stories from all its sub-locations
      return stories.filter(story => mainLocation.subLocations?.includes(story.location));
    } else {
      // If a sub-location or a location without sub-locations is selected, do an exact match
      return stories.filter(story => story.location === selectedLocation);
    }
  }, [stories, selectedLocation]);

  if (loading) {
    return (
        <section id="stories" className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                 <h2 className="text-3xl font-headline font-bold text-center mb-12">
                    Latest Stories
                </h2>
                <div className="flex justify-center gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
  }

  if(filteredStories.length === 0) {
    return null; // Don't render the section if there are no stories for the filter
  }

  return (
    <section id="stories" className="w-full py-16 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-headline font-bold text-center mb-12">
          Latest Stories
        </h2>
        
        <Carousel
            opts={{
                align: "start",
                loop: filteredStories.length > 10,
                dragFree: true,
            }}
            className="w-full"
        >
            <CarouselContent>
            {filteredStories.map((story) => (
                <CarouselItem key={story.id} className="basis-1/4 sm:basis-1/6 md:basis-1/8 lg:basis-1/12">
                    <Link href={`/offer/${story.offerId}`} className="block group text-center">
                        <div className="relative w-20 h-20 mx-auto rounded-full p-1 ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300">
                             <div className="relative w-full h-full rounded-full overflow-hidden">
                                {story.imageUrls && story.imageUrls.length > 0 && (
                                    <Image
                                        src={story.imageUrls[0]}
                                        alt={`Story from ${story.businessName}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="80px"
                                    />
                                )}
                             </div>
                        </div>
                        <p className="mt-2 text-xs font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                            {story.businessName}
                        </p>
                    </Link>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
