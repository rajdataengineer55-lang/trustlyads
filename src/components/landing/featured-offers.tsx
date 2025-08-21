
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Calendar, Phone } from "lucide-react";

const offers = [
  {
    title: "50% Off on Italian Cuisine",
    business: "Bella Italia",
    category: "Food & Restaurants",
    image: "https://placehold.co/600x400.png",
    hint: "restaurant food",
    discount: "50% OFF",
    tags: ["Today's Offer", "Discounts"],
    allowCall: true,
    allowChat: true,
    allowSchedule: false,
  },
  {
    title: "Summer Collection Sale",
    business: "Chic Boutique",
    category: "Textile & Garments",
    image: "https://placehold.co/600x400.png",
    hint: "fashion clothing",
    discount: "30% OFF",
    tags: ["Sale", "Just Listed"],
    allowCall: true,
    allowChat: false,
    allowSchedule: true,
  },
  {
    title: "Relaxing Spa Day Package",
    business: "Serenity Spa",
    category: "Health & Wellness",
    image: "https://placehold.co/600x400.png",
    hint: "spa wellness",
    discount: "2-for-1",
    tags: ["Discounts"],
    allowCall: true,
    allowChat: true,
    allowSchedule: true,
  },
  {
    title: "Weekend Car Rental Deal",
    business: "Speedy Rentals",
    category: "Automobiles",
    image: "https://placehold.co/600x400.png",
    hint: "car rental",
    discount: "$50/day",
    tags: ["Just Listed"],
    allowCall: true,
    allowChat: false,
    allowSchedule: false,
  },
  {
    title: "Home Cleaning Services",
    business: "Sparkle Clean",
    category: "Home & Local Services",
    image: "https://placehold.co/600x400.png",
    hint: "home service",
    discount: "20% OFF",
    tags: ["Today's Offer"],
    allowCall: true,
    allowChat: true,
    allowSchedule: true,
  }
];

interface FeaturedOffersProps {
  selectedCategory: string | null;
}

export function FeaturedOffers({ selectedCategory }: FeaturedOffersProps) {

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
            {filteredOffers.map((offer, index) => (
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
                        <div className="flex flex-wrap gap-2 mb-2">
                          {offer.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-headline font-bold">{offer.title}</h3>
                        <p className="text-muted-foreground mt-1">{offer.business}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {offer.allowCall && (
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex-1">
                              <Phone className="mr-2 h-4 w-4" /> Call Now
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
