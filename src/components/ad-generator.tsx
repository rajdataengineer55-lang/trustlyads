
"use client";

import { useState, useEffect, useRef } from "react";
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
import { Loader2, Megaphone, Star, Edit, UploadCloud } from "lucide-react";
import Image from "next/image";
import { locations } from "@/lib/locations";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import { cn } from "@/lib/utils";
import type { OfferData } from "@/lib/offers";
import { uploadMultipleFiles } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

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
});

const businessTypes = {
  "Medical & Pharmacy": ["Medical & Pharmacy"],
  "Hotels & Restaurants": ["Hotels & Restaurants"],
  "Wholesale & Retail": ["Wholesale & Retail"],
  "Automobiles": ["Automobiles"],
  "Real Estate & Property": ["Real Estate & Property"],
  "Electrical & Electronics": ["Electrical & Electronics"],
  "Building & Construction": ["Building & Construction"],
  "Gold & Jewellery": ["Gold & Jewellery"],
  "Agriculture & Farming": ["Agriculture & Farming"],
  "Textile & Garments": ["Textile & Garments"],
};

interface AdGeneratorProps {
  offerToEdit?: Offer;
  onFinished?: () => void;
}

export function AdGenerator({ offerToEdit, onFinished }: AdGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Posting...");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [selectedMainImageIndex, setSelectedMainImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { addOffer, updateOffer } = useOffers();
  const { user } = useAuth();

  const isEditMode = !!offerToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { business: "", offerTitle: "", offerCompleteDetails: "", discount: "", tags: "", nearbyLocation: "", locationLink: "" },
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
      });
      
      const allImages = [offerToEdit.image, ...(offerToEdit.otherImages || [])].filter(Boolean) as string[];
      setImagePreviews(allImages);
      setNewImageFiles([]); 
      setSelectedMainImageIndex(0);
    }
  }, [offerToEdit, isEditMode, form]);
  
  const processFiles = (files: File[]) => {
    const currentFiles = Array.from(files);
    const newFilePreviews = currentFiles.map(file => URL.createObjectURL(file));

    if (isEditMode) {
      setImagePreviews(newFilePreviews);
      setNewImageFiles(currentFiles);
    } else {
      setImagePreviews(prev => [...prev, ...newFilePreviews]);
      setNewImageFiles(prev => [...prev, ...currentFiles]);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
      }
    }
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({variant: "destructive", title: "Authentication Error", description: "You must be logged in to post an ad."});
        return;
    }
    setIsLoading(true);
    setLoadingMessage(isEditMode ? "Updating..." : "Posting...");

    let finalImageUrls: string[] = imagePreviews.filter(p => p.startsWith('https://'));

    if (newImageFiles.length > 0) {
        setLoadingMessage("Uploading images...");
        try {
            const uploadedUrls = await uploadMultipleFiles(newImageFiles, 'offers');
            finalImageUrls.push(...uploadedUrls);
        } catch (error: any) {
            console.error("Image upload failed:", error);
            const isCorsError = error.message.includes('network') || (error.code && error.code.includes('storage/unauthorized'));
            toast({ variant: "destructive", title: "Image Upload Failed", description: isCorsError ? "Uploads are failing due to incorrect CORS settings on the Storage Bucket." : "An unknown error occurred during upload.", duration: 10000 });
            setIsLoading(false);
            return;
        }
    }
    
    if (finalImageUrls.length === 0) {
        toast({ variant: "destructive", title: "No Images", description: "An offer must have at least one image."});
        setIsLoading(false);
        return;
    }
    
    setLoadingMessage(isEditMode ? "Saving changes..." : "Finalizing post...");

    const mainImage = finalImageUrls[selectedMainImageIndex] || finalImageUrls[0];
    const otherImages = finalImageUrls.filter((_, index) => index !== selectedMainImageIndex);

    const offerData: OfferData = {
        title: values.offerTitle, description: values.offerCompleteDetails, business: values.business, category: values.businessType, location: values.location,
        nearbyLocation: values.nearbyLocation, locationLink: values.locationLink, image: mainImage, otherImages: otherImages || [],
        discount: values.discount, tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
        isHidden: isEditMode && offerToEdit ? offerToEdit.isHidden : false,
        postedBy: user.uid,
    };

    try {
      if (isEditMode && offerToEdit) {
        await updateOffer(offerToEdit.id, offerData);
      } else {
        await addOffer(offerData);
      }
      toast({ title: isEditMode ? "Ad Updated!" : "Ad Posted!", description: `Your ad has been successfully ${isEditMode ? 'updated' : 'posted'}.` });
      if (onFinished) {
        onFinished();
      } else { 
        form.reset(); 
        setImagePreviews([]);
        setNewImageFiles([]);
        setSelectedMainImageIndex(0);
      }
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
            <FormField control={form.control} name="businessType" render={({ field }) => (<FormItem><FormLabel>Business Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a business type" /></SelectTrigger></FormControl><SelectContent>{Object.entries(businessTypes).map(([group, types]) => (<SelectGroup key={group}><SelectLabel>{group}</SelectLabel>{types.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
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
          <CardHeader><CardTitle>Ad Details</CardTitle><CardDescription>Describe the ad you are promoting.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="offerTitle" render={({ field }) => (<FormItem><FormLabel>Ad Title</FormLabel><FormControl><Input placeholder="e.g., Get 20% off all coffee" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="discount" render={({ field }) => (<FormItem><FormLabel>Discount / Price</FormLabel><FormControl><Input placeholder="e.g., 50% OFF, 2-for-1, ₹500" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="offerCompleteDetails" render={({ field }) => (<FormItem><FormLabel>Complete Ad Details</FormLabel><FormControl><Textarea placeholder="Describe your ad in detail..." {...field} rows={6} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="e.g., Today's Offer, Sale, New" {...field} /></FormControl><FormDescription>Separate tags with a comma.</FormDescription><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ad Media</CardTitle><CardDescription>Upload up to 10 images for your ad. The first image will be the cover photo.</CardDescription></CardHeader>
          <CardContent>
             <div 
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200",
                isDragging ? "border-primary bg-primary/10" : "hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center z-10">
                  <p className="text-primary font-bold text-lg">Drop images here</p>
                </div>
              )}

              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or GIF (up to 10 files)</p>
              
              <FormField control={form.control} name="images" render={() => (
                  <FormItem className="sr-only">
                    <FormLabel>Ad Images</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        ref={fileInputRef}
                        onChange={handleImageChange} 
                        className="hidden"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <FormDescription className="mb-2">Click an image to select it as the main cover photo.</FormDescription>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                    {imagePreviews.map((src, i) => (
                        <div key={i} className="relative cursor-pointer" onClick={() => setSelectedMainImageIndex(i)}>
                            <Image src={src} alt={`Preview ${i+1}`} width={100} height={100} className={cn("rounded-md object-cover aspect-square transition-all", selectedMainImageIndex === i ? "ring-4 ring-offset-2 ring-primary" : "ring-1 ring-gray-300")} data-ai-hint="placeholder image" />
                            {selectedMainImageIndex === i && <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1"><Star className="h-3 w-3" /></div>}
                        </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{loadingMessage}</>) : (<>{isEditMode ? <Edit className="mr-2 h-4 w-4" /> : <Megaphone className="mr-2 h-4 w-4" />}{isEditMode ? 'Update Ad' : 'Post Ad'}</>)}
        </Button>
      </form>
    </Form>
  )

  if (isEditMode) return AdForm;

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Post and Manage Ads</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Fill out the form below to post a new ad, or scroll down to manage existing ones.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        {AdForm}
      </div>
    </>
  );
}
