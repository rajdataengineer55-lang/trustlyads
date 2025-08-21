
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useOffers, type Offer } from '@/contexts/OffersContext';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, MessageSquare, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function OfferDetailsPage() {
  const params = useParams();
  const { offers, getOfferById } = useOffers();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const foundOffer = getOfferById(id);
      setOffer(foundOffer || null);
      if (foundOffer) {
        setMainImage(foundOffer.image);
      }
      setIsLoading(false);
    }
  }, [id, getOfferById]);
  
  const similarOffers = offers.filter(o => o.category === offer?.category && o.id !== offer?.id).slice(0, 3);

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

  const allImages = [offer.image, ...(offer.otherImages || [])];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
            <Link href="/" className="inline-flex items-center text-primary mb-8 hover:underline">
                 <ArrowLeft className="mr-2 h-4 w-4" />
                 Back to all offers
            </Link>
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                <div className="md:col-span-3">
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
                        <Image
                            src={mainImage || offer.image}
                            alt={offer.title}
                            fill
                            className="object-cover"
                            data-ai-hint={offer.hint}
                        />
                         <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold py-2 px-4 text-lg">
                          {offer.discount}
                        </Badge>
                    </div>
                    {allImages.length > 1 && (
                      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                          {allImages.map((img, i) => (
                              <div key={i} className="relative aspect-square cursor-pointer" onClick={() => setMainImage(img)}>
                                <Image 
                                  src={img} 
                                  alt={`thumbnail ${i + 1}`} 
                                  fill 
                                  className={cn("rounded-md object-cover transition-all", mainImage === img ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80')}
                                  data-ai-hint="placeholder image" 
                                />
                              </div>
                          ))}
                      </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-6">
                            <h1 className="text-3xl font-headline font-bold mb-2">{offer.title}</h1>
                            <p className="text-xl font-semibold text-primary mb-4">{offer.business}</p>
                            <div className="flex items-center text-muted-foreground mb-6">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span>{offer.location}</span>
                            </div>

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

            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Offer Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {offer.description}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {similarOffers.length > 0 && (
              <div className="mt-16">
                 <h2 className="text-3xl font-headline font-bold text-center mb-12">
                  Similar Offers
                </h2>
                 <div className="grid md:grid-cols-3 gap-4">
                  {similarOffers.map((similarOffer) => (
                    <Card key={similarOffer.id} className="overflow-hidden group transition-shadow duration-300 hover:shadow-2xl">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={similarOffer.image}
                            alt={similarOffer.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={similarOffer.hint}
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <h3 className="text-xl font-headline font-bold text-white">{similarOffer.title}</h3>
                          </div>
                          <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold py-1 px-3">
                            {similarOffer.discount}
                          </Badge>
                        </div>
                        <div className="p-6 bg-white dark:bg-card">
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{similarOffer.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {similarOffer.tags?.map((tag) => (
                              <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                          <Link href={`/offer/${similarOffer.id}`} passHref>
                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                 View Details
                                <ArrowLeft className="ml-2 h-4 w-4 transform rotate-180" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                 </div>
              </div>
            )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

    