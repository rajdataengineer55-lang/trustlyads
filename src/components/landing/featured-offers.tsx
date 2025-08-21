
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { useOffers } from "@/contexts/OffersContext";
import Link from "next/link";

interface FeaturedOffersProps {
  selectedCategory: string | null;
}

export function FeaturedOffers({ selectedCategory }: FeaturedOffersProps) {
  const { offers } = useOffers();

  const filteredOffers = selectedCategory
    ? offers.filter(offer => offer.category === selectedCategory)
    : offers;

  if (filteredOffers.length === 0) {
    return (
       <section id="featured-offers" className="w-full py-16 sm:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">
              Featured Offers
            </h2>
            <p className="text-muted-foreground">No offers found for the selected category.</p>
          </div>
       </section>
    );
  }

  return (
    <section id="featured-offers" className="w-full py-16 sm:py-24">
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
          <CarouselContent>
            {filteredOffers.map((offer) => (
              <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden group transition-shadow duration-300 hover:shadow-2xl">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={offer.image}
                          alt={offer.title}
                          width={600}
                          height={400}
                          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={offer.hint}
                        />
                         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-xl font-headline font-bold text-white">{offer.title}</h3>
                        </div>
                        <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold py-1 px-3">
                          {offer.discount}
                        </Badge>
                      </div>
                      <div className="p-6 bg-white dark:bg-card">
                         <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{offer.location}</span>
                         </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {offer.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                        <Link href={`/offer/${offer.id}`} passHref>
                          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                            <a>
                               View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
