"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useOffers, type Offer } from '@/contexts/OffersContext';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, MessageSquare, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function OfferDetailsPage() {
  const params = useParams();
  const { getOfferById } = useOffers();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const foundOffer = getOfferById(id);
      setOffer(foundOffer || null);
      setIsLoading(false);
    }
  }, [id, getOfferById]);

  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-gray-900/50 py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <Skeleton className="h-8 w-1/4 mb-8" />
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <Skeleton className="w-full h-96 rounded-lg" />
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                <Skeleton className="w-full h-24 rounded-lg" />
                                <Skeleton className="w-full h-24 rounded-lg" />
                                <Skeleton className="w-full h-24 rounded-lg" />
                                <Skeleton className="w-full h-24 rounded-lg" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-20 w-full" />
                             <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <div className="space-y-4">
                               <Skeleton className="h-12 w-full" />
                               <Skeleton className="h-12 w-full" />
                               <Skeleton className="h-12 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold mb-4">Offer Not Found</h1>
            <p className="text-muted-foreground mb-8">Sorry, we couldn't find the offer you're looking for.</p>
            <Link href="/">
                <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
            <Link href="/" className="inline-flex items-center text-primary mb-8 hover:underline">
                 <ArrowLeft className="mr-2 h-4 w-4" />
                 Back to all offers
            </Link>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    <div className="relative mb-4">
                        <Image
                            src={offer.image}
                            alt={offer.title}
                            width={800}
                            height={600}
                            className="w-full h-auto object-cover rounded-lg shadow-lg"
                            data-ai-hint={offer.hint}
                        />
                         <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold py-2 px-4 text-lg">
                          {offer.discount}
                        </Badge>
                    </div>
                    {/* Placeholder for more images */}
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(i => (
                             <Image key={i} src="https://placehold.co/200x200.png" alt="thumbnail" width={200} height={200} className="rounded-md object-cover aspect-square" data-ai-hint="placeholder image" />
                        ))}
                    </div>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-6">
                            <h1 className="text-3xl font-headline font-bold mb-2">{offer.title}</h1>
                            <p className="text-xl font-semibold text-primary mb-4">{offer.business}</p>
                            <div className="flex items-center text-muted-foreground mb-6">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span>{offer.location}</span>
                            </div>
                            
                            <p className="mb-6">This is a placeholder for a more detailed offer description. It can include information about the product, service, terms, and conditions to give customers all the details they need before making a decision.</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                            {offer.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                            </div>

                            <div className="space-y-3">
                                {offer.allowCall && offer.phoneNumber && (
                                <a href={`tel:${offer.phoneNumber}`}>
                                    <Button className="w-full justify-start text-lg py-6" variant="outline">
                                        <Phone className="mr-4" /> Call Now
                                    </Button>
                                </a>
                                )}
                                {offer.allowChat && offer.chatLink && (
                                <a href={`https://${offer.chatLink}`} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full justify-start text-lg py-6" variant="outline">
                                        <MessageSquare className="mr-4" /> Chat on WhatsApp
                                    </Button>
                                </a>
                                )}
                                {offer.allowSchedule && offer.scheduleLink && (
                                <a href={offer.scheduleLink} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full justify-start text-lg py-6" variant="outline">
                                        <CalendarIcon className="mr-4" /> Schedule a Meeting
                                    </Button>
                                </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
