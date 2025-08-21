import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Calendar } from "lucide-react";

const offers = [
  {
    title: "50% Off on Italian Cuisine",
    business: "Bella Italia",
    image: "https://placehold.co/600x400.png",
    hint: "restaurant food",
    discount: "50% OFF",
    allowCall: true,
    allowChat: true,
    allowSchedule: false,
  },
  {
    title: "Summer Collection Sale",
    business: "Chic Boutique",
    image: "https://placehold.co/600x400.png",
    hint: "fashion clothing",
    discount: "30% OFF",
    allowCall: true,
    allowChat: false,
    allowSchedule: true,
  },
  {
    title: "Relaxing Spa Day Package",
    business: "Serenity Spa",
    image: "https://placehold.co/600x400.png",
    hint: "spa wellness",
    discount: "2-for-1",
    allowCall: true,
    allowChat: true,
    allowSchedule: true,
  },
  {
    title: "Weekend Car Rental Deal",
    business: "Speedy Rentals",
    image: "https://placehold.co/600x400.png",
    hint: "car rental",
    discount: "$50/day",
    allowCall: true,
    allowChat: false,
    allowSchedule: false,
  },
  {
    title: "Home Cleaning Services",
    business: "Sparkle Clean",
    image: "https://placehold.co/600x400.png",
    hint: "home service",
    discount: "20% OFF",
    allowCall: true,
    allowChat: true,
    allowSchedule: true,
  }
];

export function FeaturedOffers() {
  return (
    <section id="featured-offers" className="w-full py-16 sm:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-headline font-bold text-center mb-12">
          Featured Offers
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {offers.map((offer, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
                        <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold py-1 px-3">
                          {offer.discount}
                        </Badge>
                      </div>
                      <div className="p-6 bg-white dark:bg-card">
                        <h3 className="text-xl font-headline font-bold">{offer.title}</h3>
                        <p className="text-muted-foreground mt-1">{offer.business}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {offer.allowCall && (
                            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold flex-1">
                              Connect Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                          {offer.allowChat && (
                            <Button variant="outline" className="flex-1">
                              <MessageCircle className="mr-2 h-4 w-4" /> Chat Now
                            </Button>
                          )}
                          {offer.allowSchedule && (
                            <Button variant="outline" className="flex-1">
                              <Calendar className="mr-2 h-4 w-4" /> Schedule
                            </Button>
                          )}
                        </div>
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
