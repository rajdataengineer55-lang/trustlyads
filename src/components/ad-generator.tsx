
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Megaphone, Star } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { locations } from "@/lib/locations";
import { useOffers } from "@/contexts/OffersContext";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  businessType: z.string({ required_error: "Please select a business type." }),
  location: z.string({ required_error: "Please select a location." }),
  offerTitle: z.string().min(5, { message: "Offer title must be at least 5 characters." }),
  offerCompleteDetails: z.string().min(10, { message: "Offer details must be at least 10 characters." }),
  discount: z.string().min(1, { message: "Discount details are required." }),
  tags: z.string().optional(),
  images: z.custom<FileList>().optional(),
  video: z.custom<FileList>().optional(),
  allowCall: z.boolean().default(false).optional(),
  phoneNumber: z.string().optional(),
  allowChat: z.boolean().default(false).optional(),
  chatLink: z.string().optional(),
  allowSchedule: z.boolean().default(false).optional(),
  scheduleLink: z.string().optional(),
});

const businessTypes = {
  "Automobiles & Transport": [
    "Car Rentals",
    "Bike Rentals",
    "Auto / Taxi Services",
    "Bus & Travel Agencies",
  ],
  "Shops & Retail": [
    "Kirana & General Stores",
    "Supermarkets",
    "Mobile Shops & Electronics",
    "Clothing & Fashion",
    "Furniture & Home Appliances",
  ],
  "Health & Wellness": [
    "Hospitals & Clinics",
    "Medical Shops",
    "Diagnostic Centers",
    "Fitness Centers / Gyms",
    "Beauty Parlors & Salons",
  ],
  "Education & Training": [
    "Schools & Colleges",
    "Coaching Centers",
    "Computer Training",
    "Skill Development Institutes",
  ],
  "Home & Local Services": [
    "Electricians",
    "Plumbers",
    "Carpenters",
    "House Cleaning Services",
    "Water Supply Services",
  ],
  "Real Estate & Construction": [
    "Property Dealers",
    "Rental Houses",
    "Building Materials & Hardware",
    "Interior Designing",
  ],
  "Finance & Professional Services": [
    "Banks & ATMs",
    "Chartered Accountants",
    "Insurance Services",
    "Legal Advisors",
  ],
  "Food & Restaurants": [
    "Restaurants",
    "Biryani Points",
    "Tiffin Centers",
    "Bakeries & Sweet Shops",
    "Ice Cream Parlors",
    "Street Food / Fast Food",
    "Coffee & Tea Shops",
    "Fruit & Juice Centers",
    "Catering Services",
  ],
};

export function AdGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const { toast } = useToast();
  const { addOffer } = useOffers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      offerTitle: "",
      offerCompleteDetails: "",
      discount: "",
      tags: "",
      allowCall: true,
      phoneNumber: "",
      allowChat: false,
      chatLink: "",
      allowSchedule: false,
      scheduleLink: "",
    },
  });

  const watchAllowCall = form.watch("allowCall");
  const watchAllowChat = form.watch("allowChat");
  const watchAllowSchedule = form.watch("allowSchedule");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if ((imagePreviews.length + files.length) > 10) {
        toast({
          variant: "destructive",
          title: "Image Limit Exceeded",
          description: "You can upload a maximum of 10 images.",
        });
        return;
      }
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 10)); // Limit to 10 images
      form.setValue('images', files);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = function() {
        window.URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 60) {
          toast({
            variant: "destructive",
            title: "Video Too Long",
            description: "Please upload a video that is 1 minute or less.",
          });
          setVideoPreview(null);
          form.setValue('video', undefined);
          if (e.target) e.target.value = ''; // Reset the file input
        } else {
          setVideoPreview(URL.createObjectURL(file));
          form.setValue('video', e.target.files);
        }
      }
      videoElement.src = URL.createObjectURL(file);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mainImage = imagePreviews[selectedMainImage] || 'https://placehold.co/600x400.png';
    const otherImages = imagePreviews.filter((_, index) => index !== selectedMainImage);

    const newOffer = {
        title: values.offerTitle,
        description: values.offerCompleteDetails,
        business: values.businessName,
        category: values.businessType,
        location: values.location,
        image: mainImage,
        otherImages: otherImages,
        hint: 'new offer',
        discount: values.discount,
        tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || ["Just Listed"],
        allowCall: values.allowCall ?? false,
        allowChat: values.allowChat ?? false,
        allowSchedule: values.allowSchedule ?? false,
        phoneNumber: values.phoneNumber,
        chatLink: values.chatLink,
        scheduleLink: values.scheduleLink,
    };

    addOffer(newOffer);

    toast({
      title: "Offer Posted!",
      description: "Your offer has been successfully posted and is now live.",
    });
    
    form.reset();
    setImagePreviews([]);
    setSelectedMainImage(0);
    setVideoPreview(null);

    setIsLoading(false);
  }

  return (
    <section id="dashboard-preview" className="py-16 sm:py-24 bg-white dark:bg-gray-900/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold">Post Ads and Manage Offers Easily</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below to post your new offer to the platform.
            </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
              <CardHeader>
                  <div className="flex items-center gap-2">
                      <Megaphone className="h-6 w-6 text-primary" />
                      <CardTitle className="font-headline">Post Your Offer</CardTitle>
                  </div>
                  <CardDescription>Fill out your offer details to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., The Cozy Cafe" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(businessTypes).map(([group, types]) => (
                                  <SelectGroup key={group}>
                                    <FormLabel className="px-2 text-xs text-muted-foreground">{group}</FormLabel>
                                    {types.map(type => (
                                      <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {locations.map((location) =>
                                  location.subLocations ? (
                                    <SelectGroup key={location.name}>
                                      <FormLabel className="px-2 text-xs text-muted-foreground">{location.name}</FormLabel>
                                      {location.subLocations.map((sub) => (
                                        <SelectItem key={`${location.name}-${sub}`} value={sub}>
                                          {sub}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  ) : (
                                    <SelectItem key={location.name} value={location.name}>
                                      {location.name}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="offerTitle"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Offer Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Get 20% off all coffee" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="offerCompleteDetails"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Complete Offer Details</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe your offer in detail..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount / Price</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 50% OFF, 2-for-1, $10" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Today's Offer, Sale, New" {...field} />
                            </FormControl>
                            <FormDescription>Separate tags with a comma.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormLabel>Offer Images</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                        </FormControl>
                        <FormDescription>Upload up to 10 images. Click on an image below to select it as the main cover image.</FormDescription>
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                            {imagePreviews.map((src, i) => (
                              <div key={i} className="relative cursor-pointer" onClick={() => setSelectedMainImage(i)}>
                                <Image src={src} alt={`Preview ${i+1}`} width={100} height={100} className={cn("rounded-md object-cover aspect-square transition-all", selectedMainImage === i ? "ring-4 ring-offset-2 ring-primary" : "ring-1 ring-gray-300")}/>
                                {selectedMainImage === i && (
                                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                                    <Star className="h-3 w-3" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Offer Video</FormLabel>
                        <FormControl>
                          <Input type="file" accept="video/*" onChange={handleVideoChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                        </FormControl>
                         <FormDescription>Upload a short video (max 1 minute) for your offer.</FormDescription>
                        {videoPreview && (
                          <div className="mt-2 relative">
                            <video src={videoPreview} controls className="rounded-md w-full object-cover" />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>

                      <div className="space-y-4">
                          <FormLabel>Communication Options</FormLabel>
                          <FormDescription>Select how customers can connect with you.</FormDescription>
                          <div className="flex items-center space-x-4 pt-2">
                              <FormField
                              control={form.control}
                              name="allowCall"
                              render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                      <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                      Allow Call
                                  </FormLabel>
                                  </FormItem>
                              )}
                              />
                               <FormField
                              control={form.control}
                              name="allowChat"
                              render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                      <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                      Allow Chat
                                  </FormLabel>
                                  </FormItem>
                              )}
                              />
                               <FormField
                              control={form.control}
                              name="allowSchedule"
                              render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                      <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                      Schedule Meeting
                                  </FormLabel>
                                  </FormItem>
                              )}
                              />
                          </div>
                      </div>
                      
                      {watchAllowCall && (
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="Enter phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {watchAllowChat && (
                        <FormField
                          control={form.control}
                          name="chatLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chat Link or ID</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., your-whatsapp-link or username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {watchAllowSchedule && (
                        <FormField
                          control={form.control}
                          name="scheduleLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduling URL</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="e.g., https://calendly.com/your-name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                      {isLoading ? (
                          <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                          </>
                      ) : (
                          <>
                          <Megaphone className="mr-2 h-4 w-4" />
                          Post Offer
                          </>
                      )}
                      </Button>
                  </form>
                  </Form>
              </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

    