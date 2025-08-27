
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { useOffers, type Offer, type Review } from '@/contexts/OffersContext';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, MessageSquare, Calendar as CalendarIcon, ArrowLeft, Share2, Star, Navigation, ArrowRight, LogIn, EyeOff, BarChart2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';


const reviewSchema = z.object({
    author: z.string().min(1, { message: "Name is required." }),
    rating: z.number().min(1, "Please select a rating.").max(5),
    comment: z.string().min(10, "Comment must be at least 10 characters."),
});

const ADMIN_EMAIL = "dandurajkumarworld24@gmail.com";

export default function OfferDetailsPage() {
  const params = useParams();
  const { offers, getOfferById, addReview, loading: offersLoading, incrementOfferView, incrementOfferClick } = useOffers();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const { toast } = useToast();
  
  const id = typeof params.id === 'string' ? params.id : '';

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: "",
      rating: 0,
      comment: "",
    },
  });

  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = form.watch("rating");

  useEffect(() => {
    if (!id || offersLoading) {
      return; // Wait for ID and data
    }
  
    const foundOffer = getOfferById(id);
  
    if (!foundOffer) {
      notFound();
      return;
    }
  
    const isAdmin = user?.email === ADMIN_EMAIL;
    const isVisible = !foundOffer.isHidden || (foundOffer.isHidden && isAdmin);
  
    if (isVisible) {
      setOffer(foundOffer);
      if (foundOffer.image) {
        setMainImage(foundOffer.image);
      }
  
      // Track view
      const viewedKey = `viewed-${id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        incrementOfferView(id);
        sessionStorage.setItem(viewedKey, 'true');
      }
    } else {
      notFound();
    }
  }, [id, getOfferById, offersLoading, user, incrementOfferView]);

  const handleTrackedClick = (url: string, isExternal: boolean = true) => {
    if(!id) return;
    incrementOfferClick(id);
    if(isExternal) {
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        window.location.href = url;
    }
  };

  const handleShare = async () => {
    if (!offer || !id) return;
    incrementOfferClick(id); // Count sharing as a click

    const shareData = {
      title: offer.title,
      text: `${offer.business} is offering: ${offer.discount}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      
      console.error("Error sharing, falling back to clipboard:", err);
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Sharing is not available, so the link was copied to your clipboard.",
        });
      } catch (copyError) {
        toast({
          variant: "destructive",
          title: "Failed to Share",
          description: "Could not share or copy the offer link at this time.",
        });
      }
    }
  };

  const onReviewSubmit = async (data: z.infer<typeof reviewSchema>) => {
    if (!offer || !user) return;
    const newReview: Omit<Review, 'id' | 'createdAt'> = {
        author: data.author,
        rating: data.rating,
        comment: data.comment,
    };
    await addReview(offer.id, newReview);
    toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
    });
    form.reset({ author: "", rating: 0, comment: '' });
  };
  
  if (authLoading || offersLoading || !offer) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background/50 py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <Skeleton className="h-8 w-1/4 mb-8" />
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        <div>
                            <Skeleton className="w-full aspect-[4/3] rounded-lg" />
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

  const similarOffers = offers.filter(o => o.category === offer?.category && o.id !== offer?.id && !o.isHidden).slice(0, 3);
  const allImages = [offer.image, ...(offer.otherImages || [])].filter(Boolean);

  const LocationInfo = () => (
    <div className="flex items-start text-muted-foreground mb-4">
      <MapPin className="h-5 w-5 mr-3 shrink-0 mt-1" />
      <div>
        <p className="font-semibold text-foreground">{offer.location}</p>
        {offer.nearbyLocation && <p className="text-sm">{offer.nearbyLocation}</p>}
      </div>
    </div>
  );

  const ContactActions = () => (
    <div className="space-y-3">
        <Button className="w-full justify-start text-base py-6" variant="outline" onClick={handleShare}>
            <Share2 className="mr-4" /> Share Offer
        </Button>
        {offer.allowCall && offer.phoneNumber && (
            <Button className="w-full justify-start text-base py-6" variant="outline" onClick={() => handleTrackedClick(`tel:${offer.phoneNumber}`, false)}>
                <Phone className="mr-4" /> Call Now
            </Button>
        )}
        {offer.allowChat && offer.chatLink && (
            <Button className="w-full justify-start text-base py-6" variant="outline" onClick={() => handleTrackedClick(`https://${offer.chatLink}`)}>
                <MessageSquare className="mr-4" /> Chat on WhatsApp
            </Button>
        )}
        {offer.allowSchedule && offer.scheduleLink && (
            <Button className="w-full justify-start text-base py-6" variant="outline" onClick={() => handleTrackedClick(offer.scheduleLink!)}>
                <CalendarIcon className="mr-4" /> Schedule a Meeting
            </Button>
        )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background/50 py-6 sm:py-12">
        <div className="container mx-auto px-4 md:px-6">
            <Link href="/" className="inline-flex items-center text-primary mb-6 sm:mb-8 hover:underline">
                 <ArrowLeft className="mr-2 h-4 w-4" />
                 Back to all offers
            </Link>
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                <div className="lg:col-span-3">
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
                        <Image
                            src={mainImage || 'https://placehold.co/600x400.png'}
                            alt={offer.title}
                            fill
                            className="object-cover transition-all duration-300 ease-in-out hover:scale-105"
                            data-ai-hint={offer.hint}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 33vw"
                        />
                         <Badge variant="default" className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black text-white font-bold py-1 px-2 sm:py-2 sm:px-3 text-sm sm:text-base animate-blink">
                          {offer.discount}
                        </Badge>
                        {offer.isHidden && (
                            <Badge variant="destructive" className="absolute top-2 left-2 sm:top-4 sm:left-4 font-bold py-1 px-2 sm:py-2 sm:px-3 text-sm sm:text-base">
                                <EyeOff className="mr-2 h-4 w-4" /> Hidden
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <Badge variant="secondary" className="font-bold py-1.5 px-3 text-sm">
                            <Eye className="mr-2 h-4 w-4" /> {offer.views || 0} Views
                        </Badge>
                            <Badge variant="secondary" className="font-bold py-1.5 px-3 text-sm">
                            <BarChart2 className="mr-2 h-4 w-4" /> {offer.clicks || 0} Clicks
                        </Badge>
                    </div>

                    {allImages.length > 1 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                          {allImages.map((img, i) => (
                              <div key={i} className="relative aspect-square cursor-pointer" onClick={() => setMainImage(img)}>
                                <Image 
                                  src={img} 
                                  alt={`thumbnail ${i + 1}`} 
                                  fill 
                                  className={cn("rounded-md object-cover transition-all", mainImage === img ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80')}
                                  data-ai-hint="placeholder image"
                                  sizes="10vw" 
                                />
                              </div>
                          ))}
                      </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                            <h1 className="text-2xl sm:text-3xl font-headline font-bold mb-2">{offer.title}</h1>
                            <p className="text-lg font-semibold text-primary mb-4">{offer.business}</p>
                            
                            <LocationInfo />

                             {offer.locationLink && (
                                <div className="mb-6">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => handleTrackedClick(offer.locationLink!)}>
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Get Directions
                                    </Button>
                                </div>
                             )}


                            <div className="flex flex-wrap gap-2 mb-6">
                            {offer.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                            </div>
                            
                            <div className="mt-auto">
                             {user ? (
                                <ContactActions />
                             ) : (
                                <div className="space-y-3">
                                  <Button className="w-full justify-start text-base py-6" variant="outline" onClick={handleShare}>
                                      <Share2 className="mr-4" /> Share Offer
                                  </Button>
                                  <Button onClick={signInWithGoogle} className="w-full justify-center text-base py-6">
                                      <LogIn className="mr-4" /> Sign in to Contact
                                  </Button>
                                </div>
                             )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-12 grid lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="space-y-8 lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Offer Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {offer.description}
                    </p>
                  </CardContent>
                </Card>
                
                {offer.reviews && offer.reviews.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Reviews ({offer.reviews.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {offer.reviews.map((review) => (
                        <div key={review.id} className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>{review.author.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{review.author}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={cn("h-4 w-4", i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                        <CardDescription>Share your experience with this business.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onReviewSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Rating</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => {
                                                        const ratingValue = i + 1;
                                                        return (
                                                            <Star
                                                                key={ratingValue}
                                                                className={cn(
                                                                    "h-6 w-6 cursor-pointer transition-colors",
                                                                    (hoverRating || currentRating) >= ratingValue
                                                                        ? 'text-yellow-400 fill-yellow-400'
                                                                        : 'text-gray-300'
                                                                )}
                                                                onClick={() => field.onChange(ratingValue)}
                                                                onMouseEnter={() => setHoverRating(ratingValue)}
                                                                onMouseLeave={() => setHoverRating(0)}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="comment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Review</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Share your experience..." {...field} rows={4}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit Review</Button>
                            </form>
                        </Form>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground mb-4">You must be signed in to write a review.</p>
                          <Button onClick={signInWithGoogle}>
                            <LogIn className="mr-2 h-4 w-4"/>
                            Sign in to Review
                          </Button>
                        </div>
                      )}
                    </CardContent>
                </Card>
              </div>
            </div>
            
            {similarOffers.length > 0 && (
              <div className="mt-16">
                 <h2 className="text-2xl font-headline font-bold text-center mb-8">
                  Similar Offers
                </h2>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarOffers.map((similarOffer) => (
                    <Card key={similarOffer.id} className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
                      <CardContent className="p-0">
                        <Link href={`/offer/${similarOffer.id}`} passHref className="block">
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={similarOffer.image || 'https://placehold.co/600x400.png'}
                              alt={similarOffer.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={similarOffer.hint}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-lg font-headline font-bold text-white truncate">{similarOffer.title}</h3>
                            </div>
                            <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold py-1 px-3">
                              {similarOffer.discount}
                            </Badge>
                          </div>
                        </Link>
                        <div className="p-4 sm:p-6 bg-card">
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4 mr-2 shrink-0" />
                              <span className="truncate">{similarOffer.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {similarOffer.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary">{tag}</Badge>                            
                            ))}
                          </div>
                          <Link href={`/offer/${similarOffer.id}`} passHref>
                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                 View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
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
