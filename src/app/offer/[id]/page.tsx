
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { useOffers, type Offer, type Review } from '@/contexts/OffersContext';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, MessageSquare, Calendar as CalendarIcon, ArrowLeft, Share2, Star, Navigation, ArrowRight, LogIn, EyeOff } from 'lucide-react';
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
    author: z.string().min(2, "Name must be at least 2 characters.").optional(),
    rating: z.number().min(1, "Please select a rating.").max(5),
    comment: z.string().min(10, "Comment must be at least 10 characters."),
});

const authorizedAdminEmail = "dandurajkumarworld24@gmail.com";

export default function OfferDetailsPage() {
  const params = useParams();
  const { offers, getOfferById, addReview, loading: offersLoading } = useOffers();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const { toast } = useToast();
  
  const id = typeof params.id === 'string' ? params.id : '';

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = form.watch("rating");

  useEffect(() => {
    if (id && !offersLoading) {
      const foundOffer = getOfferById(id);
      
      if (!foundOffer) {
        notFound();
        return;
      }
      
      const isAdmin = user?.email === authorizedAdminEmail;
      const isVisible = !foundOffer.isHidden || (foundOffer.isHidden && isAdmin);

      if (isVisible) {
        setOffer(foundOffer);
        if (foundOffer.image) {
            setMainImage(foundOffer.image);
        }
      } else {
        notFound();
      }
    }
  }, [id, getOfferById, offersLoading, offers, user]);


  useEffect(() => {
    if (user) {
        form.setValue("author", user.displayName || "Anonymous");
    }
  }, [user, form]);

  const handleShare = async () => {
    if (!offer) return;

    const shareData = {
      title: offer.title,
      text: `${offer.business} is offering: ${offer.discount}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "The offer link has been copied to your clipboard.",
        });
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      
      console.error("Error sharing:", err);
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          variant: "default",
          title: "Sharing not available, Link Copied!",
          description: "The offer link has been copied to your clipboard instead.",
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
        author: user.displayName || "Anonymous",
        rating: data.rating,
        comment: data.comment,
    };
    await addReview(offer.id, newReview);
    toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
    });
    form.reset({ rating: 0, comment: '' });
  };
  
  if (authLoading || offersLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background/50 py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <Skeleton className="h-8 w-1/4 mb-8" />
                    <div className="grid md:grid-cols-2 gap-8">
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

  if (!offer) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background/50 flex items-center justify-center">
            <div className="text-center p-8 max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>View Offer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            Please sign in to view the full details of this offer and write a review.
                        </p>
                        <Button onClick={signInWithGoogle} className="w-full">
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>
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
      <MapPin className="h-5 w-5 mr-2 shrink-0 mt-1" />
      <div>
        <p className="font-medium">{offer.location}</p>
        {offer.nearbyLocation && <p className="text-sm">{offer.nearbyLocation}</p>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background/50 py-6 sm:py-12">
        <div className="container mx-auto px-4 md:px-6">
            <Link href="/" className="inline-flex items-center text-primary mb-4 sm:mb-8 hover:underline">
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
                         <Badge variant="default" className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-accent text-accent-foreground font-bold py-1 px-2 sm:py-2 sm:px-3 text-sm sm:text-base">
                          {offer.discount}
                        </Badge>
                        {offer.isHidden && (
                            <Badge variant="destructive" className="absolute top-2 left-2 sm:top-4 sm:left-4 font-bold py-1 px-2 sm:py-2 sm:px-3 text-sm sm:text-base">
                                <EyeOff className="mr-2 h-4 w-4" /> Hidden
                            </Badge>
                        )}
                    </div>
                    {allImages.length > 1 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                          {allImages.map((img, i) => (
                              <div key={i} className="relative aspect-[4/3] cursor-pointer" onClick={() => setMainImage(img)}>
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
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <h1 className="text-xl sm:text-2xl font-headline font-bold mb-2">{offer.title}</h1>
                            <p className="text-lg font-semibold text-primary mb-4">{offer.business}</p>
                            
                            <LocationInfo />

                             {offer.locationLink && (
                                <a href={offer.locationLink} target="_blank" rel="noopener noreferrer" className="mb-6 block">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Get Directions
                                    </Button>
                                </a>
                             )}


                            <div className="flex flex-wrap gap-2 mb-6">
                            {offer.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                            </div>

                            <div className="space-y-3">
                                <Button className="w-full justify-start text-base py-6" variant="outline" onClick={handleShare}>
                                    <Share2 className="mr-4" /> Share Offer
                                </Button>
                                {offer.allowCall && offer.phoneNumber && (
                                <a href={`tel:${offer.phoneNumber}`}>
                                    <Button className="w-full justify-start text-base py-6" variant="outline">
                                        <Phone className="mr-4" /> Call Now
                                    </Button>
                                </a>
                                )}
                                {offer.allowChat && offer.chatLink && (
                                <a href={`https://${offer.chatLink}`} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full justify-start text-base py-6" variant="outline">
                                        <MessageSquare className="mr-4" /> Chat on WhatsApp
                                    </Button>
                                </a>
                                )}
                                {offer.allowSchedule && offer.scheduleLink && (
                                <a href={offer.scheduleLink} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full justify-start text-base py-6" variant="outline">
                                        <CalendarIcon className="mr-4" /> Schedule a Meeting
                                    </Button>
                                </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-12 grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-8">
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
                
                {offer.reviews && offer.reviews.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {offer.reviews.map((review) => (
                        <div key={review.id} className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
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

              <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onReviewSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input readOnly placeholder="Enter your name" {...field} />
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
                                                <Textarea placeholder="Share your experience..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit Review</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
              </div>
            </div>
            
            {similarOffers.length > 0 && (
              <div className="mt-16">
                 <h2 className="text-2xl font-headline font-bold text-center mb-12">
                  Similar Offers
                </h2>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarOffers.map((similarOffer) => (
                    <Card key={similarOffer.id} className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={similarOffer.image}
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
                        <div className="p-4 sm:p-6 bg-card">
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4 mr-2 shrink-0" />
                              <span className="truncate">{similarOffer.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {similarOffer.tags?.map((tag) => (
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
