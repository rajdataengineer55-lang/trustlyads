
"use client";

import { useEffect, useState, useCallback } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useOffers, type Offer, type Review } from '@/contexts/OffersContext';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, MessageSquare, Calendar as CalendarIcon, ArrowLeft, Share2, Star, Navigation, ArrowRight, EyeOff, BarChart2, Eye, User, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import useEmblaCarousel from 'embla-carousel-react';
import { Separator } from '@/components/ui/separator';


const reviewSchema = z.object({
    author: z.string().min(2, { message: "Name must be at least 2 characters." }),
    rating: z.number().min(1, "Please select a rating.").max(5),
    comment: z.string().min(10, "Comment must be at least 10 characters."),
});

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { offers, getOfferById, addReview, loading: offersLoading, incrementOfferView, incrementOfferClick, loadReviewsForOffer } = useOffers();
  const { user, isAdmin } = useAuth();
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { toast } = useToast();
  
  const id = typeof params.id === 'string' ? params.id : '';

  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
      emblaApi.on('select', onSelect);
      onSelect(); // Set initial index
      return () => {
          emblaApi.off('select', onSelect);
      };
  }, [emblaApi]);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { author: "", rating: 0, comment: "" },
  });

  useEffect(() => {
    if (user) {
        form.setValue('author', user.displayName || "");
    }
  }, [user, form]);
  
  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = form.watch("rating");

  const loadOfferData = useCallback(async () => {
    if (!id || offersLoading) return;

    const foundOffer = getOfferById(id);

    if (foundOffer) {
      if (isAdmin || !foundOffer.isHidden) {
        setOffer(foundOffer);
        
        // Only increment view once
        const viewedKey = `viewed-${id}`;
        if (!sessionStorage.getItem(viewedKey)) {
          incrementOfferView(id);
          sessionStorage.setItem(viewedKey, 'true');
        }

        // Fetch reviews for this specific offer
        setReviewsLoading(true);
        await loadReviewsForOffer(id);
        setReviewsLoading(false);

      } else {
        setOffer(null); // Offer is hidden
        notFound();
      }
    } else if (!offersLoading) {
      // If offers are loaded but this one wasn't found, it's a 404
      notFound();
    }
  }, [id, offersLoading, getOfferById, isAdmin, incrementOfferView, loadReviewsForOffer]);

  useEffect(() => {
    loadOfferData();
  }, [id, offers, loadOfferData]);


  const handleShare = async () => {
    if (!offer || !id) return;
    incrementOfferClick(id); 

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
      if (err.name === 'AbortError') return;
      
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

  const handleContactClick = (action: 'call' | 'chat' | 'schedule' | 'request' | 'directions') => {
    if (!offer || !id) return;
    incrementOfferClick(id);

    switch(action) {
        case 'call':
            if(offer.phoneNumber) window.location.href = `tel:${offer.phoneNumber}`;
            break;
        case 'chat':
            if(offer.chatLink) window.open(offer.chatLink, '_blank');
            break;
        case 'schedule':
             if(offer.scheduleLink) window.open(offer.scheduleLink, '_blank');
            break;
        case 'directions':
            if(offer.locationLink) window.open(offer.locationLink, '_blank');
            break;
        case 'request':
            toast({
                title: "Contact Info Clicked!",
                description: "Your interest has been noted.",
            });
            break;
    }
  };

  const onReviewSubmit = async (data: z.infer<typeof reviewSchema>) => {
    if (!offer) return;
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Signed In",
            description: "You must be signed in to leave a review.",
        });
        return;
    }
    const newReview: Omit<Review, 'id' | 'createdAt'> = {
        author: data.author,
        rating: data.rating,
        comment: data.comment,
    };
    
    await addReview(offer.id, newReview); // This now re-fetches reviews internally

    toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
    });
    form.reset({ author: user.displayName || "", rating: 0, comment: '' });
  };
  
  if (offersLoading || !offer) {
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
  const allImages = [offer.image, ...(offer.otherImages || [])].filter(Boolean) as string[];

  const LocationInfo = () => (
    <div className="flex items-start text-muted-foreground mt-4">
      <MapPin className="h-5 w-5 mr-3 shrink-0 mt-1" />
      <div>
        <p className="font-semibold text-foreground">{offer.location}</p>
        {offer.nearbyLocation && <p className="text-sm">{offer.nearbyLocation}</p>}
      </div>
    </div>
  );

  const ContactActions = () => {
    return (
        <div className="space-y-3 mt-6 pt-6 border-t">
             <p className="font-semibold text-foreground mb-3">Contact the Business</p>
             {offer.allowCall && offer.phoneNumber && (
                <Button className="w-full justify-start text-base py-6" onClick={() => handleContactClick('call')}>
                    <Phone className="mr-4" /> Call Now
                </Button>
            )}
             {offer.allowChat && offer.chatLink && (
                <Button className="w-full justify-start text-base py-6" onClick={() => handleContactClick('chat')}>
                    <MessageSquare className="mr-4" /> Chat on WhatsApp
                </Button>
            )}
             {offer.allowSchedule && offer.scheduleLink && (
                <Button className="w-full justify-start text-base py-6" onClick={() => handleContactClick('schedule')}>
                    <CalendarIcon className="mr-4" /> Schedule an Appointment
                </Button>
            )}

            <Button className="w-full justify-start text-base py-6" variant="outline" onClick={handleShare}>
                <Share2 className="mr-4" /> Share This Ad
            </Button>
            
            {offer.locationLink && (
                <Button variant="outline" className="w-full justify-start text-base py-6" onClick={() => handleContactClick('directions')}>
                    <Navigation className="mr-4 h-4 w-4" />
                    Get Directions
                </Button>
             )}
        </div>
    );
  };
  
  const ReviewForm = () => {
    if (!user) {
        return null;
    }

    return (
        <Card className="mt-12">
            <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with this business.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onReviewSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
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
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Send className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                            Submit Review
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background/50 py-6 sm:py-12">
        <div className="container mx-auto px-4 md:px-6">
            <div className="mb-6 sm:mb-8">
              <Link href="/" className="inline-flex items-center text-primary hover:underline text-sm">
                   <ArrowLeft className="mr-2 h-4 w-4" />
                   Back to all ads
              </Link>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16">
                
                {/* Image Gallery Column */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden relative rounded-lg" ref={emblaRef}>
                        <div className="flex">
                            {allImages.map((img, i) => (
                                <div key={i} className="relative flex-[0_0_100%] aspect-[4/3] bg-black rounded-lg overflow-hidden">
                                    <Image
                                        src={img}
                                        alt={`${offer.title} image ${i + 1}`}
                                        fill
                                        className="object-cover w-full h-auto"
                                        priority={i === 0}
                                        sizes="(max-width: 1024px) 100vw, 40vw"
                                    />
                                </div>
                            ))}
                        </div>
                        <Badge variant="default" className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black text-white font-bold py-1 px-2 sm:py-2 sm:px-3 text-sm sm:text-base animate-blink">
                          {offer.discount}
                        </Badge>
                        {offer.isHidden && (
                            <Badge variant="destructive" className="absolute top-2 left-2 sm:top-4 sm:left-4 font-bold py-1 px-2 sm:py-2 sm:px-3 text-sm sm:text-base">
                                <EyeOff className="mr-2 h-4 w-4" /> Hidden
                            </Badge>
                        )}
                        {allImages.length > 1 && (
                            <>
                                <Button onClick={scrollPrev} variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/75 hover:text-white h-8 w-8 sm:h-10 sm:w-10">
                                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                </Button>
                                <Button onClick={scrollNext} variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/75 hover:text-white h-8 w-8 sm:h-10 sm:w-10">
                                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                </Button>
                            </>
                        )}
                    </div>
                    
                    {allImages.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-4">
                            {allImages.map((img, i) => (
                                <div key={i} className="relative aspect-square cursor-pointer rounded-md overflow-hidden bg-black" onClick={() => scrollTo(i)}>
                                    <Image 
                                        src={img}
                                        alt={`thumbnail ${i + 1}`} 
                                        fill
                                        className={cn("object-cover w-full h-full transition-all", selectedIndex === i ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80')}
                                        sizes="100px"
                                        data-ai-hint="placeholder image"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {isAdmin && (
                         <div className="flex items-center gap-4 mt-6 p-3 rounded-lg bg-muted border">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Eye className="h-4 w-4 text-muted-foreground" /> <span>{offer.views || 0} Views</span>
                            </div>
                            <Separator orientation="vertical" className="h-6" />
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <BarChart2 className="h-4 w-4 text-muted-foreground" /> <span>{offer.clicks || 0} Clicks</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Column */}
                <div className="lg:col-span-3 space-y-6">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {offer.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                            ))}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{offer.title}</h1>
                        <p className="text-xl font-semibold text-primary mt-2">{offer.business}</p>
                        {offer.price && (
                            <p className="text-4xl font-bold mt-4">₹ {offer.price.toLocaleString()}</p>
                        )}
                        <LocationInfo />
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap text-base">
                        <p>{offer.description}</p>
                    </div>

                    <div>
                        <ContactActions />
                    </div>
                </div>
            </div>

            <Separator className="my-12 sm:my-16" />

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
              <div className="space-y-8 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews ({reviewsLoading ? 0 : offer.reviews?.length || 0})</CardTitle>
                    <CardDescription>See what other customers are saying.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviewsLoading ? (
                        <div className="space-y-4 p-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : offer.reviews && offer.reviews.length > 0 ? (
                        offer.reviews.map((review) => (
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
                      ))
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-4">Be the first to review this business!</p>
                    )}
                  </CardContent>
                </Card>
                <ReviewForm />
              </div>

              <div className="lg:col-span-1">
                 {similarOffers.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Similar Ads</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {similarOffers.map((similarOffer) => {
                                const imageUrl = similarOffer.image || 'https://picsum.photos/600/400';
                                return (
                                <Card key={similarOffer.id} className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
                                    <CardContent className="p-0">
                                    <Link href={`/offer/${similarOffer.id}`} passHref className="block">
                                        <div className="relative aspect-[4/3] bg-black">
                                        <Image
                                            src={imageUrl}
                                            alt={similarOffer.title}
                                            width={600}
                                            height={400}
                                            className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                            <h3 className="text-base font-bold text-white truncate">{similarOffer.title}</h3>
                                        </div>
                                        <Badge variant="default" className="absolute top-2 right-2 bg-accent text-accent-foreground font-bold">
                                            {similarOffer.discount}
                                        </Badge>
                                        </div>
                                    </Link>
                                    <div className="p-4 bg-card">
                                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                                            <MapPin className="h-4 w-4 mr-2 shrink-0" />
                                            <span className="truncate">{similarOffer.location}</span>
                                        </div>
                                        <Link href={`/offer/${similarOffer.id}`} passHref>
                                        <Button className="w-full" variant="secondary">
                                            View Details
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        </Link>
                                    </div>
                                    </CardContent>
                                </Card>
                                )
                            })}
                        </div>
                    </div>
                )}
              </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
