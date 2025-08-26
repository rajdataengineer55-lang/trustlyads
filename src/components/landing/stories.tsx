
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
import { Card, CardContent } from '../ui/card';
import { ArrowRight, MapPin } from 'lucide-react';


export function Stories() {
  const { stories, loading } = useStories();

  if (loading) {
    return (
        <section id="stories" className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                 <h2 className="text-3xl font-headline font-bold text-center mb-12">
                    Latest Stories
                </h2>
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-64 w-40 rounded-lg" />
                    <Skeleton className="h-64 w-40 rounded-lg" />
                    <Skeleton className="h-64 w-40 rounded-lg" />
                    <Skeleton className="h-64 w-40 rounded-lg" />
                    <Skeleton className="h-64 w-40 rounded-lg" />
                </div>
            </div>
        </section>
    );
  }

  if(stories.length === 0) {
    return null; // Don't render the section if there are no stories
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
                loop: stories.length > 5,
            }}
            className="w-full"
        >
            <CarouselContent>
            {stories.map((story) => (
                <CarouselItem key={story.id} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
                    <Link href={story.link} target="_blank" rel="noopener noreferrer" className="block group">
                        <Card className="overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
                            <CardContent className="relative aspect-[9/16] w-full p-0">
                                <Image
                                    src={story.imageUrl}
                                    alt={`Story from ${story.businessName}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                                    <p className="text-sm font-bold truncate">{story.businessName}</p>
                                    <div className="flex items-center text-xs">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="truncate">{story.location}</span>
                                    </div>
                                    <div className="flex items-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                                        View Story <ArrowRight className="ml-1 h-3 w-3" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
