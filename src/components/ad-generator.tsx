
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Megaphone, Star, Edit, Sparkles, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { locations } from "@/lib/locations";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import { cn } from "@/lib/utils";
import type { OfferData } from "@/lib/offers";
import { uploadMultipleFiles } from "@/lib/storage";
import { generateAdCopy, GenerateAdCopyInput } from "@/ai/flows/generate-ad-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  business: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  businessType: z.string({ required_error: "Please select a business type." }),
  location: z.string({ required_error: "Please select a location." }),
  nearbyLocation: z.string().optional(),
  locationLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  offerTitle: z.string().min(5, { message: "Offer title must be at least 5 characters." }),
  offerCompleteDetails: z.string().min(10, { message: "Offer details must be at least 10 characters." }),
  discount: z.string().min(1, { message: "Discount details are required." }),
  tags: z.string().optional(),
  images: z.custom<FileList>().optional(),
  allowCall: z.boolean().default(false).optional(),
  phoneNumber: z.string().optional(),
  allowChat: z.boolean().default(false).optional(),
  chatLink: z.string().optional(),
  allowSchedule: z.boolean().default(false).optional(),
  scheduleLink: z.string().optional(),
});

const businessTypes = {
  "Agriculture & Farming": ["Agriculture & Farming"],
  "Services": ["Electrical Works & Wiring Services", "Plumbing & Borewell Services", "Welding & Fabrication Shops", "Furniture Makers & Wood Works", "Two-Wheeler & Bicycle Repair", "Tailoring & Stitching Units", "Event Management & Tent House Services", "Mobile Repair & Accessories Shops", "Printing Press & Flex Banner Shops", "Catering & Tiffin Services", "Courier & Parcel Services", "Bike/Car Wash & Detailing", "Photography & Videography Services", "Interior & Painting Services", "Scrap Collection & Recycling Services", "House Cleaning Services", "Water Supply Services"],
  "Shops & Retail": ["Kirana & General Stores", "Supermarkets", "Clothing & Fashion", "Furniture & Home Appliances", "Goldsmith & Jewellery Shops", "Stationery & Book Shops", "Ayurvedic & Herbal Product Stores"],
  "Health & Wellness": ["Hospitals & Clinics", "Medical Shops & Diagnostics", "Fitness Centers / Gyms", "Beauty Parlors & Salons"],
  "Hotels, Food & Restaurants": ["Hotels", "Restaurants", "Biryani Points", "Tiffin Centers", "Bakeries & Sweet Shops", "Ice Cream Parlors", "Street Food / Fast Food", "Coffee & Tea Shops", "Fruit & Juice Centers"],
  "Automobiles & Transport": ["Car Rentals", "Bike Rentals", "Auto / Taxi Services", "Bus & Travel Agencies", "Agriculture Equipment Rentals (Tractors, Sprayers, Harvesters)"],
  "Education & Training": ["Schools & Colleges", "Coaching Centers", "Computer Training", "Skill Development Institutes"],
  "Real Estate & Construction": ["Property Dealers", "Rental Houses", "Building Materials & Hardware"],
  "Finance & Professional": ["Banks & ATMs", "Chartered Accountants", "Insurance Services", "Legal Advisors"],
  "Gym": ["Gym"],
};

interface AdGeneratorProps {
  offerToEdit?: Offer;
  onFinished?: () => void;
}

export function AdGenerator({ offerToEdit, onFinished }: AdGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Posting...");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedMainImageIndex, setSelectedMainImageIndex] = useState(0);

  const { toast } = useToast();
  const { addOffer, updateOffer } = useOffers();

  const isEditMode = !!offerToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { business: "", offerTitle: "", offerCompleteDetails: "", discount: "", tags: "", nearbyLocation: "", locationLink: "", allowCall: false, phoneNumber: "", allowChat: false, chatLink: "", allowSchedule: false, scheduleLink: "" },
  });

  useEffect(() => {
    if (isEditMode && offerToEdit) {
      form.reset({
        business: offerToEdit.business,
        businessType: offerToEdit.category,
        location: offerToEdit.location,
        nearbyLocation: offerToEdit.nearbyLocation,
        locationLink: offerToEdit.locationLink,
        offerTitle: offerToEdit.title,
        offerCompleteDetails: offerToEdit.description,
        discount: offerToEdit.discount,
        tags: offerToEdit.tags.join(", "),
        allowCall: offerToEdit.allowCall,
        phoneNumber: offerToEdit.phoneNumber,
        allowChat: offerToEdit.allowChat,
        chatLink: offerToEdit.chatLink,
        allowSchedule: offerToEdit.allowSchedule,
        scheduleLink: offerToEdit.scheduleLink,
      });
      
      const allImages = [offerToEdit.image, ...(offerToEdit.otherImages || [])].filter(Boolean);
      setImagePreviews(allImages);
      setSelectedMainImageIndex(0);
    }
  }, [offerToEdit, isEditMode, form]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
        if ((imagePreviews.length + files.length) > 10) {
            toast({ variant: "destructive", title: "Image Limit Exceeded", description: "You can upload a maximum of 10 images." });
            return;
        }
        const newFilePreviews = Array.from(files).map(file => URL.createObjectURL(file));
        const combinedPreviews = [...imagePreviews, ...newFilePreviews];
        setImagePreviews(combinedPreviews.slice(0, 10));
        
        // This is a bit tricky with react-hook-form, we need to append to the FileList
        const dataTransfer = new DataTransfer();
        const existingFiles = form.getValues('images');
        if (existingFiles) {
            Array.from(existingFiles).forEach(file => dataTransfer.items.add(file));
        }
        Array.from(files).forEach(file => dataTransfer.items.add(file));

        form.setValue('images', dataTransfer.files);
    }
  };

  const handleGenerateAdCopy = async () => {
    setIsAiLoading(true);
    setAiError(null);
    const { business, offerTitle, discount } = form.getValues();
    if (!business || !offerTitle || !discount) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide Business Name, Offer Title, and Discount details to generate ad copy." });
      setIsAiLoading(false);
      return;
    }
    try {
      const input: GenerateAdCopyInput = { business, title: offerTitle, discount };
      const result = await generateAdCopy(input);
      form.setValue('offerCompleteDetails', result.adCopy, { shouldValidate: true });
    } catch (error) {
      console.error("AI copy generation failed:", error);
      setAiError("Failed to generate ad copy. The AI service may be temporarily unavailable. Please try again later.");
    } finally {
      setIsAiLoading(false);
    }
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setLoadingMessage(isEditMode ? "Updating..." : "Posting...");

    let uploadedImageUrls: string[] = isEditMode && offerToEdit ? imagePreviews.filter(url => url.startsWith('http')) : [];

    if (values.images && values.images.length > 0) {
        setLoadingMessage("Uploading images...");
        try {
            const filesToUpload = Array.from(values.images).filter(file => !imagePreviews.includes(URL.createObjectURL(file)));
            const dataTransfer = new DataTransfer();
            filesToUpload.forEach(file => dataTransfer.items.add(file));

            if(dataTransfer.files.length > 0) {
              const newUrls = await uploadMultipleFiles(dataTransfer.files);
              uploadedImageUrls.push(...newUrls);
            }
        } catch (error: any) {
            console.error("Image upload failed:", error);
            const isCorsError = error.message.includes('network') || (error.code && error.code.includes('storage/unauthorized'));
            toast({ variant: "destructive", title: "Image Upload Failed", description: isCorsError ? "Uploads are failing due to incorrect CORS settings on the Storage Bucket." : "An unknown error occurred during upload.", duration: 10000 });
            setIsLoading(false);
            return;
        }
    }
    
    if (uploadedImageUrls.length === 0) uploadedImageUrls.push('https://placehold.co/600x400.png');
    setLoadingMessage(isEditMode ? "Saving changes..." : "Finalizing post...");

    const mainImage = uploadedImageUrls[selectedMainImageIndex] || uploadedImageUrls[0];
    const otherImages = uploadedImageUrls.filter((_, index) => index !== selectedMainImageIndex);
    const hint = [values.offerTitle, values.business, values.businessType, values.tags?.split(',').map(tag => tag.trim()).filter(Boolean).join(' ')].filter(Boolean).join(' ').toLowerCase();

    const offerData: OfferData = {
        title: values.offerTitle, description: values.offerCompleteDetails, business: values.business, category: values.businessType, location: values.location,
        nearbyLocation: values.nearbyLocation, locationLink: values.locationLink, image: mainImage, otherImages: otherImages, hint: hint,
        discount: values.discount, tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [], allowCall: values.allowCall ?? false,
        phoneNumber: values.phoneNumber, allowChat: values.allowChat ?? false, chatLink: values.chatLink, allowSchedule: values.allowSchedule ?? false,
        scheduleLink: values.scheduleLink, isHidden: isEditMode ? offerToEdit.isHidden : false,
    };

    try {
      if (isEditMode && offerToEdit) await updateOffer(offerToEdit.id, offerData);
      else await addOffer(offerData);
      toast({ title: isEditMode ? "Offer Updated!" : "Offer Posted!", description: `Your offer has been successfully ${isEditMode ? 'updated' : 'posted'}.` });
      if (onFinished) onFinished();
      else { form.reset(); setImagePreviews([]); setSelectedMainImageIndex(0); }
    } catch (error) {
       console.error("Failed to save offer:", error);
       toast({ variant: "destructive", title: "Save Failed", description: "Could not save the offer to the database." });
    } finally {
      setIsLoading(false);
    }
  }

  const AdForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Business Details</CardTitle><CardDescription>Information about the business posting the offer.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="business" render={({ field }) => (<FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="e.g., The Cozy Cafe" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="businessType" render={({ field }) => (<FormItem><FormLabel>Business Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a business type" /></SelectTrigger></FormControl><SelectContent>{Object.entries(businessTypes).map(([group, types]) => (<SelectGroup key={group}><SelectLabel>{group}</SelectLabel>{types.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectGroup>))}</SelectContent></Select><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Location Details</CardTitle><CardDescription>Help customers find your business.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger></FormControl><SelectContent>{locations.map((location) => location.subLocations ? (<SelectGroup key={location.name}><SelectLabel>{location.name}</SelectLabel>{location.subLocations.map((sub) => (<SelectItem key={`${location.name}-${sub}`} value={sub}>{sub}</SelectItem>))}</SelectGroup>) : (<SelectItem key={location.name} value={location.name}>{location.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="nearbyLocation" render={({ field }) => (<FormItem><FormLabel>Nearby Location / Landmark</FormLabel><FormControl><Input placeholder="e.g., Opposite the post office" {...field} /></FormControl><FormDescription>Provide a well-known nearby place.</FormDescription><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="locationLink" render={({ field }) => (<FormItem><FormLabel>Business Location Link</FormLabel><FormControl><Input type="url" placeholder="e.g., https://maps.app.goo.gl/your-link" {...field} /></FormControl><FormDescription>Enter the Google Maps link for your business.</FormDescription><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Offer Details</CardTitle><CardDescription>Describe the offer you are promoting.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="offerTitle" render={({ field }) => (<FormItem><FormLabel>Offer Title</FormLabel><FormControl><Input placeholder="e.g., Get 20% off all coffee" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="discount" render={({ field }) => (<FormItem><FormLabel>Discount / Price</FormLabel><FormControl><Input placeholder="e.g., 50% OFF, 2-for-1, ₹500" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="offerCompleteDetails" render={({ field }) => (<FormItem><FormLabel>Complete Offer Details</FormLabel><FormControl><Textarea placeholder="Describe your offer in detail..." {...field} rows={6} /></FormControl><FormMessage /></FormItem>)} />
            <div className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={handleGenerateAdCopy} disabled={isAiLoading}>
                {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate with AI
              </Button>
              {aiError && (<Alert variant="destructive" className="mt-4"><AlertTriangle className="h-4 w-4" /><AlertTitle>AI Error</AlertTitle><AlertDescription>{aiError}</AlertDescription></Alert>)}
            </div>
            <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="e.g., Today's Offer, Sale, New" {...field} /></FormControl><FormDescription>Separate tags with a comma.</FormDescription><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Offer Media</CardTitle><CardDescription>Upload images for your offer. The first image will be the cover photo.</CardDescription></CardHeader>
          <CardContent>
            <FormField control={form.control} name="images" render={({ field }) => (<FormItem><FormLabel>Offer Images (up to 10)</FormLabel><FormControl><Input type="file" accept="image/*" multiple onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" /></FormControl><FormDescription>Click an image to select it as the main cover photo.</FormDescription>
                {imagePreviews.length > 0 && (<div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">{imagePreviews.map((src, i) => (<div key={i} className="relative cursor-pointer" onClick={() => setSelectedMainImageIndex(i)}><Image src={src} alt={`Preview ${i+1}`} width={100} height={100} className={cn("rounded-md object-cover aspect-square transition-all", selectedMainImageIndex === i ? "ring-4 ring-offset-2 ring-primary" : "ring-1 ring-gray-300")} />{selectedMainImageIndex === i && (<div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1"><Star className="h-3 w-3" /></div>)}</div>))}</div>)}
                {imagePreviews.length === 0 && (<div className="mt-2 rounded-md border border-dashed border-gray-300 p-4 text-center"><Image src="https://placehold.co/600x400.png" alt="Placeholder" width={100} height={100} className="mx-auto rounded-md object-cover aspect-square" data-ai-hint="food biryani" /><p className="text-xs text-muted-foreground mt-2">Image previews will appear here</p></div>)}
              <FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Communication Options</CardTitle><CardDescription>Select how customers can connect with you.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 gap-y-4 pt-2">
              <FormField control={form.control} name="allowCall" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal text-sm leading-none">Allow Call</FormLabel></FormItem>)} />
              <FormField control={form.control} name="allowChat" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal text-sm leading-none">Allow Chat</FormLabel></FormItem>)} />
              <FormField control={form.control} name="allowSchedule" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal text-sm leading-none">Schedule</FormLabel></FormItem>)} />
            </div>
            {form.watch("allowCall") && (<FormField control={form.control} name="phoneNumber" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="Enter phone number" {...field} /></FormControl><FormMessage /></FormItem>)} />)}
            {form.watch("allowChat") && (<FormField control={form.control} name="chatLink" render={({ field }) => (<FormItem><FormLabel>Chat Link or ID</FormLabel><FormControl><Input placeholder="e.g., wa.me/91..." {...field} /></FormControl><FormMessage /></FormItem>)} />)}
            {form.watch("allowSchedule") && (<FormField control={form.control} name="scheduleLink" render={({ field }) => (<FormItem><FormLabel>Scheduling URL</FormLabel><FormControl><Input type="url" placeholder="e.g., https://calendly.com/your-name" {...field} /></FormControl><FormMessage /></FormItem>)} />)}
          </CardContent>
        </Card>
        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{loadingMessage}</>) : (<>{isEditMode ? <Edit className="mr-2 h-4 w-4" /> : <Megaphone className="mr-2 h-4 w-4" />}{isEditMode ? 'Update Offer' : 'Post Offer'}</>)}
        </Button>
      </form>
    </Form>
  )

  if (isEditMode) return AdForm;

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-headline font-bold">Post and Manage Offers</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Fill out the form below to post a new offer, or scroll down to manage existing ones.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        {AdForm}
      </div>
    </>
  );
}
