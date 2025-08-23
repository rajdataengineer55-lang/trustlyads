
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Patel",
    role: "Restaurant Owner",
    avatar: "https://placehold.co/100x100.png",
    hint: "man portrait",
    rating: 5,
    comment: "LocalPulse helped my restaurant reach so many new customers! The platform is easy to use and I saw a big increase in foot traffic.",
  },
  {
    name: "Priya Sharma",
    role: "Shopper",
    avatar: "https://placehold.co/100x100.png",
    hint: "woman portrait",
    rating: 5,
    comment: "I love finding amazing local deals on LocalPulse. It's my go-to app before I go shopping. I've discovered so many great local shops I didn't know about!",
  },
  {
    name: "Vikram Singh",
    role: "Small Business Owner",
    avatar: "https://placehold.co/100x100.png",
    hint: "portrait man",
    rating: 4,
    comment: "A great way to advertise locally without a huge budget. The team was very helpful in getting my ad posted.",
  },
  {
      name: "Sneha Reddy",
      role: "Boutique Owner",
      avatar: "https://placehold.co/100x100.png",
      hint: "portrait woman",
      rating: 5,
      comment: "Posting my new collection on LocalPulse was a game-changer. I had customers asking for items the same day the ad went live!",
    },
    {
      name: "Rohan Gupta",
      role: "Customer",
      avatar: "https://placehold.co/100x100.png",
      hint: "man portrait happy",
      rating: 5,
      comment: "It's fantastic to have a single place to see all the offers from local stores. It saves me time and money.",
    },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold">Trusted by Our Community</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            See what business owners and customers are saying about LocalPulse.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2 h-full">
                  <Card className="h-full flex flex-col justify-between">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
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
